<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Categories
        \DB::table('categories')->insert([
            ['name' => 'Đèn ô tô'],
            ['name' => 'Gương chiếu hậu'],
            ['name' => 'Cản trước/sau'],
            ['name' => 'Ốp lưng'],
            ['name' => 'Phụ kiện nội thất'],
            ['name' => 'Bánh xe & Mâm xe'],
            ['name' => 'Dầu nhớt & Phụ gia'],
        ]);

        // Seed Products
        \DB::table('products')->insert([
            ['category_id' => 1, 'name' => 'Đèn LED pha ô tô H7', 'price' => 1500000, 'description' => 'Đèn LED siêu sáng, tuổi thọ cao, dễ lắp đặt', 'image_url' => 'led-pha-h7.jpg', 'stock' => 50],
            ['category_id' => 1, 'name' => 'Đèn hậu LED', 'price' => 800000, 'description' => 'Đèn hậu LED hiện đại, tiết kiệm điện', 'image_url' => 'den-hau-led.jpg', 'stock' => 30],
            ['category_id' => 2, 'name' => 'Gương chiếu hậu tự động', 'price' => 1200000, 'description' => 'Gương tự động gập khi khóa xe, chống nước', 'image_url' => 'guong-tu-dong.jpg', 'stock' => 25],
            ['category_id' => 3, 'name' => 'Cản trước thể thao', 'price' => 2500000, 'description' => 'Cản trước chất liệu nhựa ABS cao cấp', 'image_url' => 'can-truoc.jpg', 'stock' => 15],
            ['category_id' => 4, 'name' => 'Ốp lưng carbon', 'price' => 1800000, 'description' => 'Ốp lưng chất liệu carbon nhẹ, bền', 'image_url' => 'op-lung-carbon.jpg', 'stock' => 40],
            ['category_id' => 5, 'name' => 'Ghế da bọc nội thất', 'price' => 3500000, 'description' => 'Bộ ghế da cao cấp, êm ái, dễ vệ sinh', 'image_url' => 'ghe-da.jpg', 'stock' => 10],
            ['category_id' => 5, 'name' => 'Vô lăng bọc da', 'price' => 1500000, 'description' => 'Vô lăng bọc da thật, thiết kế thể thao', 'image_url' => 'volang-da.jpg', 'stock' => 20],
            ['category_id' => 6, 'name' => 'Mâm đúc hợp kim 17 inch', 'price' => 4500000, 'description' => 'Mâm đúc thể thao, siêu nhẹ, chịu lực tốt', 'image_url' => 'mam-duc-17inch.jpg', 'stock' => 15],
            ['category_id' => 6, 'name' => 'Lốp xe Michelin', 'price' => 2200000, 'description' => 'Lốp xe cao cấp bám đường cực tốt, êm ái', 'image_url' => 'lop-michelin.jpg', 'stock' => 30],
            ['category_id' => 7, 'name' => 'Dầu nhớt tổng hợp 5W-30', 'price' => 500000, 'description' => 'Dầu nhớt cao cấp giúp bảo vệ động cơ toàn diện', 'image_url' => 'dau-nhot-5w30.jpg', 'stock' => 100],
            ['category_id' => 7, 'name' => 'Nước làm mát động cơ', 'price' => 250000, 'description' => 'Giải nhiệt nhanh, chống gỉ sét hệ thống', 'image_url' => 'nuoc-lam-mat.jpg', 'stock' => 80],
            ['category_id' => 5, 'name' => 'Thảm lót sàn 5D', 'price' => 1200000, 'description' => 'Thảm lót sàn 5D chống bụi, chống thấm nước', 'image_url' => 'tham-lot-san-5d.jpg', 'stock' => 40],
        ]);
    }
}
