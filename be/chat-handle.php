<?php

namespace App\Http\Controllers\Candidate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Ai\Agents\CareerAdvisorAgent;
use App\Models\JobListing;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array',
            'history.*.role' => 'required|in:user,ai',
            'history.*.content' => 'required|string'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $profile = $user->candidateProfile;

        // Lấy 30 công việc mới nhất để AI tham chiếu
        $jobs = JobListing::approved()->with('company.companyProfile')->latest()->limit(30)->get();
        $jobsText = $jobs->map(function ($j) {
            $companyName = $j->company->companyProfile->company_name ?? $j->company->name;
            $salary = $j->salary_min ? (number_format($j->salary_min / 1000000) . 'tr - ' . number_format($j->salary_max / 1000000) . 'tr') : 'Thỏa thuận';
            return "- ID {$j->id}: {$j->title} ({$companyName}). Yêu cầu: {$j->skills_required}. Lương: {$salary}. Địa điểm: {$j->location}.";
        })->join("\n");

        $skills = $profile && $profile->skills ? $profile->skills : 'Ứng viên chưa cập nhật kỹ năng (hãy khuyên họ vào Cập nhật hồ sơ để AI hỗ trợ tốt hơn)';
        $exp = $profile && $profile->experience_years ? $profile->experience_years . ' năm' : 'Chưa cập nhật';
        $title = $profile && $profile->title ? $profile->title : 'Chưa cập nhật';

        $systemPrompt = <<<PROMPT
        [THÔNG TIN NGỮ CẢNH BẮT BUỘC ĐỂ BẠN (AI) THAM KHẢO]
        --- Thông tin hồ sơ của người bạn đang chat ---
        - Tên ứng viên: {$user->name}
        - Kỹ năng hiện có: {$skills}
        - Số năm kinh nghiệm: {$exp}
        - Vị trí mong muốn: {$title}

        --- Danh sách việc làm hệ thống đang tuyển (Mới nhất) ---
        {$jobsText}
        PROMPT;

        $promptText = "{$systemPrompt}\n\n[LỊCH SỬ TRÒ CHUYỆN GẦN NHẤT]\n";

        $history = $request->input('history', []);
        // Lấy 6 tin nhắn gần nhất để làm context nhớ hội thoại
        $recentHistory = array_slice($history, -6);
        foreach ($recentHistory as $msg) {
            $role = $msg['role'] == 'user' ? "Ứng viên ({$user->name})" : 'Bạn (AI)';
            $promptText .= $role . ': ' . $msg['content'] . "\n";
        }

        $promptText .= "\nỨng viên ({$user->name}): " . $request->message . "\nBạn (AI): ";

        try {
            $response = (new CareerAdvisorAgent)->prompt($promptText, timeout: 45);
            $replyText = $response->text;

            // Xử lý Job Cards: Lọc tối đa 3 jobs và hiển thị dạng thẻ cuộn ngang (horizontal scroll)
            $jobIds = [];
            $replyText = preg_replace_callback('/\[JOB:(\d+)\]/', function ($matches) use (&$jobIds) {
                $job = JobListing::find($matches[1]);
                if (!$job) return '';

                $jobIds[] = $job->id;
                // Thay thế text trong câu trả lời AI bằng tên công việc in đậm đẹp mắt
                return "<strong>{$job->title}</strong>";
            }, $replyText);

            $jobIds = array_unique($jobIds);
            $jobIds = array_slice($jobIds, 0, 3); // Lấy tối đa 3 công việc phù hợp nhất

            if (!empty($jobIds)) {
                // Render List Card dạng Cuộn ngang (Scroll Horizontal)
                $html = "<div style='display:flex;gap:12px;overflow-x:auto;padding:4px 4px 12px 4px;margin-top:16px; scrollbar-width:thin; max-width:100%; width:260px;'>";
                foreach ($jobIds as $id) {
                    $job = JobListing::with('company.companyProfile')->find($id);
                    if ($job) {
                        $companyName = mb_strimwidth($job->company->companyProfile->company_name ?? $job->company->name, 0, 25, '...');
                        $url = route('jobs.show', $job->id);
                        $salary = $job->salary_min
                            ? (number_format($job->salary_min / 1000000) . ' - ' . number_format($job->salary_max / 1000000) . ' tr')
                            : 'Thỏa thuận';

                        $html .= "<div style='flex:0 0 210px;border:1px solid rgba(124, 58, 237, 0.4);border-radius:12px;padding:14px;background:var(--surface);box-shadow:0 4px 12px rgba(0,0,0,0.05);display:flex;flex-direction:column;'>"
                            . "<div style='font-weight:700;font-size:13px;margin-bottom:6px;color:var(--text);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;'>{$job->title}</div>"
                            . "<div style='font-size:11px;color:var(--text-muted);margin-bottom:8px;'><i class='fa-regular fa-building'></i> {$companyName}</div>"
                            . "<div style='font-size:11px;color:var(--text-muted);margin-bottom:auto;'><i class='fa-regular fa-location-dot'></i> {$job->location}</div>"
                            . "<div style='font-size:12px;color:var(--accent);font-weight:700;margin:12px 0;'><i class='fa-solid fa-money-bill'></i> {$salary}</div>"
                            . "<a href='{$url}' target='_blank' style='display:block;text-align:center;background:var(--surface-2);color:var(--text);border:1px solid var(--border);padding:6px 0;border-radius:24px;font-size:11px;text-decoration:none;font-weight:600;transition:all 0.2s;' onmouseover='this.style.background=\"var(--accent)\";this.style.color=\"white\";' onmouseout='this.style.background=\"var(--surface-2)\";this.style.color=\"var(--text)\";'>Xem chi tiết ↗</a>"
                            . "</div>";
                    }
                }
                $html .= "</div>";
                // Nối HTML Cards vào cuối câu trả lời của AI
                $replyText .= $html;
            }

            return response()->json([
                'success' => true,
                'reply' => $replyText
            ]);
        } catch (\Exception $e) {
            Log::error('AI Chat Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'reply' => 'Xin lỗi bạn, server AI đang bảo trì hoặc quá tải. Vui lòng thử lại sau ít phút nhé! (Lỗi: ' . $e->getMessage() . ')'
            ], 500);
        }
    }
}