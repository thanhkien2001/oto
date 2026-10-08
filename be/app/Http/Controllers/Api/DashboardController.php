<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $totalUsers = User::count();

        // Lấy 5 đơn hàng mới nhất
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Doanh thu theo 7 ngày gần nhất (tuần)
        $revenueByDay = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', '!=', 'Đã hủy')
            ->where('created_at', '>=', Carbon::now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [Carbon::parse($item->date)->format('d/m') => $item->total];
            });
        
        // Đảm bảo có đủ 7 ngày kể cả ngày ko có doanh thu
        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateStr = Carbon::now()->subDays($i)->format('d/m');
            $last7Days[$dateStr] = $revenueByDay->get($dateStr, 0);
        }

        // Doanh thu theo tháng trong năm nay
        $revenueByMonthData = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', '!=', 'Đã hủy')
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return ['Tháng ' . $item->month => $item->total];
            });

        $months = [];
        for ($i = 1; $i <= 12; $i++) {
            $months['Tháng ' . $i] = $revenueByMonthData->get('Tháng ' . $i, 0);
        }

        // Doanh thu theo 5 năm gần nhất
        $revenueByYearData = Order::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', '!=', 'Đã hủy')
            ->where('created_at', '>=', Carbon::now()->subYears(4)->startOfYear())
            ->groupBy('year')
            ->orderBy('year', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->year => $item->total];
            });

        $years = [];
        $currentYear = Carbon::now()->year;
        for ($i = 4; $i >= 0; $i--) {
            $y = $currentYear - $i;
            $years[(string)$y] = $revenueByYearData->get($y, 0);
        }

        return response()->json([
            'counts' => [
                'products' => $totalProducts,
                'categories' => $totalCategories,
                'orders' => $totalOrders,
                'users' => $totalUsers,
            ],
            'recentOrders' => $recentOrders,
            'charts' => [
                'revenueByWeek' => [
                    'labels' => array_keys($last7Days),
                    'data' => array_values($last7Days)
                ],
                'revenueByMonth' => [
                    'labels' => array_keys($months),
                    'data' => array_values($months)
                ],
                'revenueByYear' => [
                    'labels' => array_keys($years),
                    'data' => array_values($years)
                ]
            ]
        ]);
    }
}
