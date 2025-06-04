# Thiết kế Backend - Module Xác thực (Authentication)

**Mục đích:** Quản lý đăng ký, đăng nhập, đăng xuất và phân quyền.

**Công nghệ:** Node.js, Prisma, JWT (JSON Web Tokens) cho quản lý phiên.

**Middleware:**

- `authenticateToken`: Middleware xác thực JWT, gắn thông tin user vào request nếu token hợp lệ.
- `authorizeRole(role)`: Middleware kiểm tra vai trò người dùng (CUSTOMER, ADMIN).

**API Endpoints:**

1. **Đăng ký Khách hàng (Customer Registration)**
    - **Endpoint:** `POST /api/auth/register`
    - **Mô tả:** Cho phép khách hàng mới tạo tài khoản.
    - **Request Body:**`json { "name": "string (required)", "email": "string (required, email format)", "password": "string (required, min length 6)", "phone": "string (optional)" }`
    - **Logic:**
        - Validate input (email format, password strength, email uniqueness).
        - Hash mật khẩu (sử dụng bcrypt).
        - Tạo user mới trong DB với `role: CUSTOMER`.
        - Tạo JWT cho user mới.
        - Trả về thông tin user (không bao gồm password) và JWT.
    - **Response (Success 201):**`json { "user": { "id": "string", "name": "string", "email": "string", "phone": "string | null", "role": "CUSTOMER" }, "token": "string (jwt)" }`
    - **Response (Error 400/409):** Thông báo lỗi validation hoặc email đã tồn tại.
    - **Phân quyền:** Public.
2. **Đăng nhập (Login)**
    - **Endpoint:** `POST /api/auth/login`
    - **Mô tả:** Xác thực thông tin đăng nhập và tạo phiên làm việc.
    - **Request Body:**`json { "email": "string (required, email format)", "password": "string (required)" }`
    - **Logic:**
        - Validate input.
        - Tìm user theo email.
        - Nếu không tìm thấy user hoặc mật khẩu không khớp (so sánh hash), trả về lỗi 401.
        - Nếu thành công, tạo JWT cho user.
        - Trả về thông tin user (không bao gồm password) và JWT.
    - **Response (Success 200):**`json { "user": { "id": "string", "name": "string", "email": "string", "phone": "string | null", "role": "string (CUSTOMER or ADMIN)" }, "token": "string (jwt)" }`
    - **Response (Error 401):** Sai email hoặc mật khẩu.
    - **Phân quyền:** Public.
3. **Lấy thông tin User hiện tại (Get Current User)**
    - **Endpoint:** `GET /api/auth/me`
    - **Mô tả:** Lấy thông tin của người dùng đang đăng nhập dựa trên JWT.
    - **Logic:**
        - Sử dụng middleware `authenticateToken` để xác thực và lấy thông tin user từ token.
        - Trả về thông tin user (không bao gồm password).
    - **Response (Success 200):**`json { "user": { "id": "string", "name": "string", "email": "string", "phone": "string | null", "role": "string (CUSTOMER or ADMIN)" } }`
    - **Response (Error 401):** Token không hợp lệ hoặc hết hạn.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER hoặc ADMIN).
    - **Middleware:** `authenticateToken`.
4. **Đăng xuất (Logout)**
    - **Endpoint:** `POST /api/auth/logout`
    - **Mô tả:** (Thường xử lý ở client-side bằng cách xóa token). Backend có thể thêm vào blacklist nếu cần cơ chế phức tạp hơn, nhưng với JWT đơn giản thì không cần endpoint này.
    - **Logic:** Không cần xử lý gì đặc biệt ở backend nếu chỉ dùng JWT stateless.
    - **Phân quyền:** Đã đăng nhập.

**Lưu ý:**

- Sử dụng thư viện như `bcrypt` để hash mật khẩu.
- Sử dụng thư viện như `jsonwebtoken` để tạo và xác thực JWT.
- Thiết lập secret key an toàn cho JWT và quản lý qua biến môi trường.
- Xem xét thời gian hết hạn (expiration) cho JWT.
