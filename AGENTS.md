# Thiết kế Backend - Module Người dùng (User)

**Mục đích:** Quản lý thông tin tài khoản người dùng (Khách hàng và Quản trị viên).

**Middleware:**

- `authenticateToken`: Xác thực JWT.
- `authorizeRole(role)`: Kiểm tra vai trò (CUSTOMER, ADMIN).

**API Endpoints:**

1. **Lấy thông tin hồ sơ cá nhân (Get My Profile)**
    - **Endpoint:** `GET /api/users/me`
    - **Mô tả:** Lấy thông tin chi tiết của người dùng đang đăng nhập.
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Truy vấn DB để lấy thông tin user (không bao gồm password).
        - Có thể kèm theo thông tin địa chỉ mặc định.
    - **Response (Success 200):**`json { "id": "string", "name": "string", "email": "string", "phone": "string | null", "role": "CUSTOMER", // Hoặc ADMIN "defaultAddress": { // Optional "id": "string", "recipientName": "string", "street": "string", "city": "string", "phone": "string" } // ... other relevant fields }`
    - **Response (Error 401/404):** Lỗi xác thực hoặc không tìm thấy user.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER hoặc ADMIN).
    - **Middleware:** `authenticateToken`.
2. **Cập nhật thông tin hồ sơ cá nhân (Update My Profile)**
    - **Endpoint:** `PUT /api/users/me`
    - **Mô tả:** Cho phép người dùng đang đăng nhập cập nhật thông tin cá nhân (tên, số điện thoại).
    - **Request Body:**`json { "name": "string (optional)", "phone": "string (optional)" // Không cho phép cập nhật email, role, password qua endpoint này }`
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Validate input.
        - Cập nhật thông tin user trong DB.
        - Trả về thông tin user đã cập nhật.
    - **Response (Success 200):** Thông tin user đã cập nhật (tương tự GET /api/users/me).
    - **Response (Error 400/401/404):** Lỗi validation, xác thực hoặc không tìm thấy user.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER hoặc ADMIN).
    - **Middleware:** `authenticateToken`.
3. **Quản lý Địa chỉ (Address Management - CRUD)**
    - **Endpoint:** `POST /api/users/me/addresses` (Thêm mới)
    - **Endpoint:** `GET /api/users/me/addresses` (Lấy danh sách)
    - **Endpoint:** `PUT /api/users/me/addresses/{addressId}` (Cập nhật)
    - **Endpoint:** `DELETE /api/users/me/addresses/{addressId}` (Xóa)
    - **Endpoint:** `PATCH /api/users/me/addresses/{addressId}/default` (Đặt làm mặc định)
    - **Mô tả:** Quản lý danh sách địa chỉ giao hàng của người dùng.
    - **Request Body (POST/PUT):**`json { "recipientName": "string (required)", "street": "string (required)", "city": "string (required)", "phone": "string (required)" }`
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Thực hiện các thao tác CRUD trên collection `Address` liên kết với `userId`.
        - Khi đặt làm mặc định, cần cập nhật `isDefault = false` cho các địa chỉ khác của cùng user.
    - **Response:** Dữ liệu địa chỉ hoặc danh sách địa chỉ.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER hoặc ADMIN).
    - **Middleware:** `authenticateToken`.
4. **Lấy danh sách Người dùng (Admin - List Users)**
    - **Endpoint:** `GET /api/admin/users`
    - **Mô tả:** Lấy danh sách tất cả người dùng (cho Admin).
    - **Query Params:** `page`, `limit`, `search` (theo tên/email), `role`.
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Truy vấn DB lấy danh sách user với phân trang, tìm kiếm, lọc.
        - Không trả về mật khẩu.
    - **Response (Success 200):**`json { "data": [ /* array of user objects */ ], "pagination": { "page": 1, "limit": 10, "totalItems": 100, "totalPages": 10 } }`
    - **Response (Error 401/403):** Lỗi xác thực hoặc không có quyền.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
5. **Xem chi tiết Người dùng (Admin - Get User Details)**
    - **Endpoint:** `GET /api/admin/users/{userId}`
    - **Mô tả:** Lấy thông tin chi tiết của một người dùng cụ thể (cho Admin).
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Truy vấn DB lấy thông tin user theo `userId` (bao gồm cả địa chỉ, lịch sử đơn hàng nếu cần).
        - Không trả về mật khẩu.
    - **Response (Success 200):** Thông tin chi tiết user.
    - **Response (Error 401/403/404):** Lỗi xác thực, quyền hoặc không tìm thấy user.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
6. **(Optional) Cập nhật Người dùng (Admin - Update User)**
    - **Endpoint:** `PUT /api/admin/users/{userId}`
    - **Mô tả:** Cho phép Admin cập nhật thông tin user (ví dụ: cập nhật role, tên, phone - không nên cho phép đổi email/password trực tiếp).
    - **Request Body:** Thông tin cần cập nhật.
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Validate input.
        - Cập nhật thông tin user trong DB.
    - **Response (Success 200):** Thông tin user đã cập nhật.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
