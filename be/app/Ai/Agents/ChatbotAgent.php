<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Providers\Tools\ProviderTool;
use Stringable;

class ChatbotAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        $products = \App\Models\Product::with('category')->limit(30)->get();
        $productsText = $products->map(function ($p) {
            $cat = $p->category->name ?? 'Không rõ';
            $price = number_format($p->price) . ' VND';
            return "- [PRODUCT:{$p->id}] Tên: {$p->name} ({$cat}). Giá: {$price}. Kho: {$p->stock}. Mô tả: {$p->description}";
        })->join("\n");

        return <<<PROMPT
        Bạn là nhân viên tư vấn bán hàng của một cửa hàng phụ tùng ô tô.
        Quy tắc trả lời:
        1. Cực kỳ NGẮN GỌN, VÀO THẲNG VẤN ĐỀ, không dài dòng giải thích luyên thuyên.
        2. TUYỆT ĐỐI KHÔNG dùng bảng (markdown table) để liệt kê sản phẩm.
        3. Nếu khách hỏi mua gì đó, chỉ cần nói 1-2 câu ngắn (VD: "Dạ, cửa hàng đang có các sản phẩm này ạ:") sau đó dùng tag [PRODUCT:{id}] để hệ thống tự hiển thị sản phẩm.
        4. KHÔNG báo giá hay mô tả lại dài dòng, vì thông tin đó sẽ tự động hiển thị trên card sản phẩm rồi.
        
        [THÔNG TIN SẢN PHẨM HIỆN CÓ ĐỂ THAM KHẢO]
        {$productsText}
        PROMPT;
    }



    /**
     * Get the tools available to the agent.
     *
     * @return list<Agent|Tool|ProviderTool>
     */
    public function tools(): iterable
    {
        return [];
    }
}
