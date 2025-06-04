# Thiết kế Frontend - Module Người dùng (User)

**Mục đích:** Cung cấp giao diện cho khách hàng quản lý tài khoản và cho admin quản lý người dùng.

**Routes (App Router):**

- `/account`: Trang tài khoản khách hàng (có thể dùng route group `(customer)`).
    - `/account/profile`: Section/Tab thông tin cá nhân.
    - `/account/addresses`: Section/Tab quản lý địa chỉ.
    - `/account/orders`: Section/Tab lịch sử đơn hàng (liên kết đến Module Order).
- `/admin/users`: Trang quản lý người dùng (Admin).
- `/admin/users/{userId}`: Trang xem chi tiết người dùng (Admin).

**Components (Customer):**

1. **AccountLayout (`components/features/account/AccountLayout.tsx`)**
    - **Sử dụng:** Bao quanh các trang con trong `/account`.
    - **UI:** Layout 2 cột, cột trái là menu điều hướng (Thông tin cá nhân, Địa chỉ, Đơn hàng, Đăng xuất), cột phải hiển thị nội dung tương ứng.
2. **ProfileForm (`components/features/account/ProfileForm.tsx`)**
    - **Sử dụng:** Tại `/account/profile`.
    - **UI:** Form hiển thị thông tin hiện tại (Họ tên, Email - chỉ đọc, Số điện thoại) và cho phép chỉnh sửa Tên, Số điện thoại. Nút “Lưu thay đổi”.
    - **Logic:**
        - Fetch dữ liệu user hiện tại từ API `GET /api/users/me`.
        - Sử dụng `React Hook Form` với giá trị mặc định từ API.
        - Gọi API `PUT /api/users/me` khi submit.
        - Hiển thị thông báo thành công/lỗi.
3. **AddressList (`components/features/account/AddressList.tsx`)**
    - **Sử dụng:** Tại `/account/addresses`.
    - **UI:** Hiển thị danh sách địa chỉ đã lưu dưới dạng Card. Mỗi card có thông tin địa chỉ, nút “Sửa”, “Xóa”, và nút/checkbox “Đặt làm mặc định”. Có nút “Thêm địa chỉ mới”.
    - **Logic:**
        - Fetch danh sách địa chỉ từ API `GET /api/users/me/addresses`.
        - Gọi API tương ứng khi nhấn nút Sửa, Xóa, Đặt làm mặc định.
        - Mở Modal chứa `AddressForm` khi nhấn “Thêm mới” hoặc “Sửa”.
4. **AddressForm (`components/features/account/AddressForm.tsx`)**
    - **Sử dụng:** Trong Modal tại `/account/addresses` và có thể cả trang Checkout.
    - **UI:** Form nhập thông tin địa chỉ (Tên người nhận, Số điện thoại, Đường, Thành phố/Tỉnh).
    - **Logic:**
        - Sử dụng `React Hook Form`.
        - Gọi API `POST /api/users/me/addresses` (thêm mới) hoặc `PUT /api/users/me/addresses/{addressId}` (cập nhật) khi submit.
        - Đóng modal và refresh danh sách địa chỉ khi thành công.
    - **Props:** `initialData` (cho trường hợp sửa), `onSubmitSuccess` (callback).

**Components (Admin):**

1. **UserTable (`components/features/admin/users/UserTable.tsx`)**
    - **Sử dụng:** Tại `/admin/users`.
    - **UI:** Bảng hiển thị danh sách người dùng (ID, Tên, Email, Vai trò, Ngày tạo). Có các chức năng tìm kiếm, lọc theo vai trò, phân trang.
    - **Logic:**
        - Fetch dữ liệu từ API `GET /api/admin/users` với các query params tương ứng.
        - Sử dụng thư viện table (ví dụ: `@tanstack/react-table`) để quản lý state bảng.
        - Mỗi hàng có link đến trang chi tiết user.
2. **UserDetailView (`components/features/admin/users/UserDetailView.tsx`)**
    - **Sử dụng:** Tại `/admin/users/{userId}`.
    - **UI:** Hiển thị thông tin chi tiết của user (Tên, Email, Phone, Role, Địa chỉ, Lịch sử đơn hàng tóm tắt).
    - **Logic:**
        - Lấy `userId` từ URL params.
        - Fetch dữ liệu từ API `GET /api/admin/users/{userId}`.
        - Hiển thị thông tin.
        - (Optional) Có thể có nút để chỉnh sửa thông tin cơ bản hoặc vai trò user.

**Trang (Pages):**

- **Customer Account Pages (`app/(customer)/account/...`)**: Sử dụng `CustomerLayout` và `AccountLayout`, hiển thị các component tương ứng (ProfileForm, AddressList, OrderHistory - từ module Order).
- **Admin User List Page (`app/(admin)/admin/users/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `UserTable`.
- **Admin User Detail Page (`app/(admin)/admin/users/{userId}/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `UserDetailView`.

**State Management & Data Fetching:**

- Sử dụng React Query/SWR để fetch và cache dữ liệu user, địa chỉ.
- `useAuth` hook cung cấp thông tin user hiện tại.
- Form state quản lý bởi `React Hook Form`.
