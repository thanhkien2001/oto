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
        ]);
    }
}
