# Thiết kế Backend - Module Danh mục (Category)

**Mục đích:** Quản lý các danh mục sản phẩm.

**Middleware:**

- `authenticateToken`: Xác thực JWT (cần cho Admin).
- `authorizeRole(\'ADMIN\')`: Kiểm tra vai trò Admin.

**API Endpoints:**

1. **Lấy danh sách Danh mục (List Categories)**
    - **Endpoint:** `GET /api/categories`
    - **Mô tả:** Lấy danh sách tất cả danh mục, có thể dùng cho cả Customer và Admin. Có thể hỗ trợ lấy cây danh mục.
    - **Query Params:** `parentId` (lấy danh mục con), `tree=true` (lấy toàn bộ cây danh mục).
    - **Logic:**
        - Truy vấn DB lấy danh sách danh mục.
        - Nếu `tree=true`, xây dựng cấu trúc cây.
        - Có thể thêm thông tin số lượng sản phẩm trong mỗi danh mục.
    - **Response (Success 200):**`json [ { "id": "string", "name": "string", "slug": "string", "description": "string | null", "imageUrl": "string | null", "parentId": "string | null", "children": [] // Nếu tree=true // "productCount": number // Optional } // ... more categories ]`
    - **Phân quyền:** Public.
2. **Lấy chi tiết Danh mục (Get Category Details)**
    - **Endpoint:** `GET /api/categories/{slugOrId}`
    - **Mô tả:** Lấy thông tin chi tiết của một danh mục dựa trên slug hoặc ID.
    - **Logic:**
        - Tìm danh mục theo slug hoặc ID.
        - Trả về thông tin chi tiết.
    - **Response (Success 200):** Chi tiết một danh mục (tương tự item trong list).
    - **Response (Error 404):** Không tìm thấy danh mục.
    - **Phân quyền:** Public.
3. **Tạo Danh mục (Admin - Create Category)**
    - **Endpoint:** `POST /api/admin/categories`
    - **Mô tả:** Tạo một danh mục mới (chỉ Admin).
    - **Request Body:**`json { "name": "string (required)", "description": "string (optional)", "parentId": "string (optional, ObjectId)", "imageUrl": "string (optional, URL trả về từ upload)" }`
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Validate input (tên không trùng).
        - Tự động tạo `slug` từ `name` (ví dụ: dùng thư viện `slugify`). Đảm bảo slug là unique.
        - Lưu danh mục mới vào DB.
    - **Response (Success 201):** Thông tin danh mục vừa tạo.
    - **Response (Error 400/401/403/409):** Lỗi validation, xác thực, quyền hoặc tên/slug đã tồn tại.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
4. **Cập nhật Danh mục (Admin - Update Category)**
    - **Endpoint:** `PUT /api/admin/categories/{categoryId}`
    - **Mô tả:** Cập nhật thông tin một danh mục (chỉ Admin).
    - **Request Body:** Tương tự POST, nhưng các trường là optional.
    `json { "name": "string (optional)", "description": "string (optional)", "parentId": "string (optional, ObjectId)", "imageUrl": "string (optional, URL trả về từ upload)", "slug": "string (optional)" // Cho phép sửa slug nếu cần, phải đảm bảo unique }`
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Validate input (nếu sửa tên/slug, kiểm tra unique).
        - Nếu `name` thay đổi và `slug` không được cung cấp, tự động tạo lại slug.
        - Cập nhật danh mục trong DB.
    - **Response (Success 200):** Thông tin danh mục đã cập nhật.
    - **Response (Error 400/401/403/404/409):** Lỗi validation, xác thực, quyền, không tìm thấy hoặc tên/slug đã tồn tại.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
5. **Xóa Danh mục (Admin - Delete Category)**
    - **Endpoint:** `DELETE /api/admin/categories/{categoryId}`
    - **Mô tả:** Xóa một danh mục (chỉ Admin).
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Kiểm tra xem danh mục có sản phẩm nào không.
        - Kiểm tra xem danh mục có danh mục con nào không.
        - **Chiến lược xóa:**
            - Nếu có sản phẩm hoặc danh mục con: Trả về lỗi 400 yêu cầu di chuyển sản phẩm/danh mục con trước, hoặc cung cấp tùy chọn di chuyển (phức tạp hơn).
            - Nếu không: Xóa danh mục khỏi DB.
            - (Hoặc) Xóa mềm: Đánh dấu `isDeleted = true` thay vì xóa hẳn.
    - **Response (Success 204):** No Content.
    - **Response (Error 400/401/403/404):** Lỗi ràng buộc (còn sản phẩm/con), xác thực, quyền, hoặc không tìm thấy.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.

**Lưu ý:**

- Cần có cơ chế tạo slug tự động và đảm bảo tính duy nhất.
- Xử lý cẩn thận việc xóa danh mục để tránh mất dữ liệu liên quan (sản phẩm).
