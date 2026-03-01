# HƯỚNG DẪN KỸ THUẬT DỰ ÁN SHOP PHỤ KIỆN Ô TÔ (OTO SHOP)

Đây là tài liệu hướng dẫn dành cho sinh viên mới tiếp cận ReactJS (Frontend) và Laravel (Backend), nhằm giúp bạn hiểu rõ cấu trúc, luồng đi của dữ liệu và cách vận hành dự án.

---

## 1. TỔNG QUAN VỀ CÔNG NGHỆ (TECH STACK)

Dự án này là một ứng dụng web dạng **SPA (Single Page Application)**, gồm 2 phần tách biệt giao tiếp với nhau qua API:

### 1.1. Frontend (Giao diện người dùng)
- **ReactJS**: Thư viện JavaScript để xây dựng giao diện.
- **Vite**: Công cụ build code nhanh chóng.
- **React Router DOM**: Quản lý điều hướng (chuyển trang mà không load lại trình duyệt).
- **Axios**: Thư viện để gửi request (yêu cầu) lấy dữ liệu từ Backend.
- **Bootstrap 5**: Thư viện CSS để làm giao diện đẹp nhanh chóng.

### 1.2. Backend (Xử lý logic & Dữ liệu)
- **Laravel (PHP Framework)**: Xây dựng API và quản lý cơ sở dữ liệu.
- **MySQL**: Hệ quản trị cơ sở dữ liệu.
- **Sanctum**: Thư viện của Laravel để xác thực người dùng (Authentication) qua Token.

---

## 2. CẤU TRÚC DỰ ÁN

### 2.1. Backend (`/be`)
Đây là nơi chứa toàn bộ logic xử lý dữ liệu.

- **`routes/api.php`**: **QUAN TRỌNG NHẤT**. Nơi khai báo các đường dẫn API (Ví dụ: `/products`, `/login`). Frontend sẽ gọi vào các đường dẫn này.
- **`app/Http/Controllers/`**: Chứa các file xử lý logic chính.
    - `ProductController.php`: Lấy danh sách, thêm, sửa, xóa sản phẩm.
    - `OrderController.php`: Xử lý đặt hàng, xem đơn hàng.
    - `AuthController.php`: Xử lý đăng ký, đăng nhập, đăng xuất.
- **`app/Models/`**: Các file đại diện cho bảng dữ liệu (User, Product, Order). Dùng để tương tác với Database thay vì viết SQL thuần.
- **`database/migrations/`**: Các file định nghĩa cấu trúc bảng (Table schema) trong Database.
- **`public/uploads/`**: Thư mục chứa ảnh sản phẩm được upload.

### 2.2. Frontend (`/fe`)
Đây là nơi chứa mã nguồn giao diện.

- **`src/api.js`**: File cấu hình Axios. Tại đây định nghĩa đường dẫn gốc tới Backend (`baseURL`) và tự động đính kèm Token đăng nhập vào mỗi request.
- **`src/App.jsx`**: File gốc của ứng dụng, chứa cấu hình Router (định tuyến) để quy định URL nào sẽ hiển thị Trang nào.
- **`src/context/`**:
    - `AuthContext.jsx`: Quản lý việc Đăng nhập/Đăng xuất và lưu thông tin User toàn cục.
    - `CartContext.jsx`: Quản lý Giỏ hàng (Thêm/Sửa/Xóa sản phẩm trong giỏ).
- **`src/pages/`**: Chứa các trang giao diện chính.
    - `Home.jsx`, `ProductList.jsx`, `ProductDetail.jsx`: Các trang người dùng.
    - `Cart.jsx`, `Checkout.jsx`: Trang giỏ hàng và thanh toán.
    - `admin/`: Các trang quản trị (Dashboard, Quản lý sản phẩm, Đơn hàng).
- **`src/layouts/`**:
    - `PublicLayout.jsx`: Giao diện chung cho khách (có Header, Footer).
    - `AdminLayout.jsx`: Giao diện chung cho Admin (có Sidebar quản trị).

---

## 3. LUỒNG HOẠT ĐỘNG CHÍNH (KEY FLOWS)

### 3.1. Luồng Xác thực (Authentication Flow)
1. **Đăng nhập**:
   - User nhập email/password tại form Login.
   - Frontend gửi POST request tới `/api/login`.
   - Backend kiểm tra DB. Nếu đúng -> Trả về một chuỗi ký tự gọi là **Token**.
   - Frontend lưu Token này vào `localStorage` của trình duyệt.
2. **Sử dụng**:
   - Mỗi lần Frontend gọi API cần quyền (ví dụ: xem lịch sử đơn hàng), nó sẽ tự động gửi kèm Token này trong Header.
   - Backend kiểm tra Token hợp lệ -> Trả dữ liệu.

### 3.2. Luồng Hiển thị Sản phẩm
1. User vào trang chủ hoặc danh sách sản phẩm.
2. `useEffect` trong React (hàm chạy khi trang vừa load) sẽ gọi `api.get('/products')`.
3. Backend (`ProductController@index`) truy vấn Database lấy danh sách sản phẩm -> Trả về dạng JSON.
4. Frontend nhận JSON -> Lưu vào `state` (`setProducts`) -> React tự động vẽ lại giao diện hiển thị danh sách.
   - **Hình ảnh**: Được load từ đường dẫn `http://127.0.0.1:8000/uploads/ten_anh.jpg` (Do Backend quản lý file).

### 3.3. Luồng Giỏ hàng & Đặt hàng
1. **Thêm giỏ hàng**:
   - User bấm "Thêm vào giỏ".
   - Frontend lưu thông tin sản phẩm vào `cart` state (chưa gửi lên server ngay). Dữ liệu này thường được lưu tạm ở `localStorage` để F5 không mất.
2. **Đặt hàng (Checkout)**:
   - User điền thông tin và bấm "Đặt hàng".
   - Frontend gửi POST request tới `/api/orders` gồm: thông tin khách hàng + chi tiết danh sách sản phẩm trong giỏ.
   - Backend (`OrderController@store`) nhận dữ liệu:
     - Tạo bản ghi trong bảng `orders`.
     - Tạo các bản ghi trong bảng `order_details`.
     - Trả về thông báo thành công.
   - Frontend nhận thông báo -> Xóa giỏ hàng -> Chuyển hướng sang trang thông báo thành công.

### 3.4. Luồng Admin (Quản trị viên)
1. User admin đăng nhập.
2. Hệ thống kiểm tra `role` (vai trò). Nếu là `admin` -> Cho phép truy cập `/admin`.
3. **Quản lý sản phẩm**:
   - Xem: Gọi `GET /products`.
   - Thêm/Sửa: Admin nhập form (có thể chọn ảnh). Frontend dùng `FormData` để gửi dữ liệu text + file ảnh lên Backend (`POST /products`).
   - Xóa: Gọi `DELETE /products/{id}`.

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### Bước 1: Chạy Backend (Laravel)
Mở terminal tại thư mục `/be`:
1. Cài đặt thư viện (lần đầu): `composer install`
2. Cấu hình môi trường: Copy `.env.example` thành `.env` và cấu hình Database.
3. Tạo Database & Dữ liệu mẫu: `php artisan migrate --seed`
4. Cấp quyền thư mục ảnh: `chmod -R 777 public/uploads` (trên Linux/Mac)
5. **Khởi chạy server**:
   ```bash
   php artisan serve
   ```
   (Server sẽ chạy tại `http://127.0.0.1:8000`)

### Bước 2: Chạy Frontend (React)
Mở terminal khác tại thư mục `/fe`:
1. Cài đặt thư viện (lần đầu): `npm install`
2. **Khởi chạy dev server**:
   ```bash
   npm run dev
   ```
   (Trang web sẽ chạy tại `http://localhost:5173`)

### Bước 3: Truy cập
- Trang chủ: `http://localhost:5173`
- Trang Admin: `http://localhost:5173/login` (Đăng nhập với tài khoản Admin được tạo ở bước seed database).

---

## 5. MẸO DEBUG (SỬA LỖI) CHO SINH VIÊN

1. **Lỗi API 401 (Unauthorized)**:
   - Thường do chưa đăng nhập hoặc Token hết hạn. Thử đăng xuất và đăng nhập lại.
2. **Lỗi API 500 (Server Error)**:
   - Lỗi logic phía Backend. Mở tab **Network** trong Developer Tools của trình duyệt -> Bấm vào request bị đỏ -> Xem Preview để thấy thông báo lỗi cụ thể từ Laravel.
   - Hoặc xem file `be/storage/logs/laravel.log`.
3. **Lỗi ảnh không hiển thị**:
   - Kiểm tra xem Backend server (`php artisan serve`) có đang chạy không.
   - Kiểm tra đường dẫn ảnh có bắt đầu bằng `http://127.0.0.1:8000/uploads/` không.
4. **Lỗi CORS**:
   - Thường do Frontend và Backend chạy khác port. Đảm bảo cấu hình CORS trong Laravel (`config/cors.php`) đã cho phép origin `localhost:5173`.

---
*Tài liệu được tạo tự động bởi trợ lý AI để hỗ trợ training dự án.*
