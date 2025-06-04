# Thiết kế Frontend - Module Xác thực (Authentication)

**Mục đích:** Cung cấp giao diện cho người dùng (Khách hàng & Admin) đăng ký, đăng nhập.

**Routes (App Router):**

- `/login`: Trang đăng nhập Khách hàng.
- `/register`: Trang đăng ký Khách hàng.
- `/admin/login`: Trang đăng nhập Quản trị viên.

**Components:**

1. **LoginForm (`components/features/auth/LoginForm.tsx`)**
    - **Sử dụng:** Tại `/login` và `/admin/login`.
    - **UI:** Form chứa các trường Email, Mật khẩu và nút “Đăng nhập”. Có thể có link “Quên mật khẩu?” (nếu triển khai) và link “Đăng ký” (chỉ cho trang login khách hàng).
    - **Logic:**
        - Sử dụng `React Hook Form` để quản lý state và validation (email hợp lệ, mật khẩu không trống).
        - Gọi API `POST /api/auth/login` khi submit.
        - Sử dụng `useAuth` hook (hoặc state management) để cập nhật trạng thái đăng nhập (lưu token, thông tin user) khi thành công.
        - Hiển thị thông báo lỗi từ API (ví dụ: sai email/mật khẩu) bằng `react-toastify` hoặc component `Alert`.
        - Chuyển hướng người dùng sau khi đăng nhập thành công (về trang chủ hoặc trang trước đó cho khách hàng, về dashboard cho admin).
    - **Props:** `isAdminLogin` (boolean, để thay đổi tiêu đề, endpoint API nếu cần, và link đăng ký).
2. **RegisterForm (`components/features/auth/RegisterForm.tsx`)**
    - **Sử dụng:** Tại `/register`.
    - **UI:** Form chứa các trường Họ tên, Email, Mật khẩu, Nhập lại mật khẩu, Số điện thoại (tùy chọn) và nút “Đăng ký”. Có link “Đã có tài khoản? Đăng nhập”.
    - **Logic:**
        - Sử dụng `React Hook Form` để quản lý state và validation (các trường bắt buộc, email hợp lệ, mật khẩu khớp, độ dài mật khẩu).
        - Gọi API `POST /api/auth/register` khi submit.
        - Sử dụng `useAuth` hook để cập nhật trạng thái đăng nhập khi thành công (API đăng ký có thể trả về token).
        - Hiển thị thông báo lỗi từ API (ví dụ: email đã tồn tại).
        - Chuyển hướng người dùng sau khi đăng ký thành công (về trang chủ).

**Trang:**

1. **Trang Đăng nhập Khách hàng (`app/(customer)/login/page.tsx`)**
    - Sử dụng `CustomerLayout`.
    - Hiển thị component `LoginForm` với `isAdminLogin={false}`.
    - Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng về trang chủ.
2. **Trang Đăng ký Khách hàng (`app/(customer)/register/page.tsx`)**
    - Sử dụng `CustomerLayout`.
    - Hiển thị component `RegisterForm`.
    - Kiểm tra nếu người dùng đã đăng nhập thì chuyển hướng về trang chủ.
3. **Trang Đăng nhập Admin (`app/(admin)/admin/login/page.tsx`)**
    - Sử dụng layout đơn giản (không cần sidebar/header của admin).
    - Hiển thị component `LoginForm` với `isAdminLogin={true}`.
    - Kiểm tra nếu người dùng đã đăng nhập (và là admin) thì chuyển hướng về `/admin/dashboard`.

**Quản lý trạng thái (State Management):**

- Sử dụng `useAuth` hook (từ Zustand hoặc Context) để:
    - Lưu trữ `user` (thông tin người dùng), `token`, `isAuthenticated`, `role`.
    - Cung cấp các hàm `login(credentials)`, `register(data)`, `logout()`.
    - Các hàm này sẽ gọi API tương ứng, cập nhật state và xử lý lưu/xóa token (trong local storage hoặc cookie).

**Bảo vệ Route (Route Guarding):**

- **Customer Routes:** Các trang như `/account`, `/checkout` cần kiểm tra `isAuthenticated`. Nếu chưa đăng nhập, chuyển hướng về `/login`.
- **Admin Routes:** Toàn bộ route group `(admin)` cần kiểm tra `isAuthenticated` và `role === \'ADMIN\'`. Nếu không thỏa mãn, chuyển hướng về `/admin/login` hoặc trang lỗi 403.
- Việc bảo vệ route có thể thực hiện trong `layout.tsx` của từng route group hoặc sử dụng middleware của Next.js (nếu áp dụng cho toàn bộ).

**Luồng Đăng xuất:**

- Nút “Đăng xuất” (trong Header cho Customer, trong AdminHeader/Sidebar cho Admin) sẽ gọi hàm `logout()` từ `useAuth` hook.
- Hàm `logout()` sẽ:
    - Xóa token khỏi local storage/cookie.
    - Reset trạng thái auth trong state management.
    - Chuyển hướng người dùng về trang chủ (Customer) hoặc trang login (Admin).
    - (Optional) Gọi API backend `/api/auth/logout` nếu backend cần xử lý thêm (ví dụ: blacklist token).
