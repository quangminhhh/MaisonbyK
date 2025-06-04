# Thiết kế Backend - Module Sản phẩm (Product)

**Mục đích:** Quản lý thông tin sản phẩm áo dài và hình ảnh liên quan.

**Middleware:**

- `authenticateToken`: Xác thực JWT (cần cho Admin).
- `authorizeRole(\'ADMIN\')`: Kiểm tra vai trò Admin.
- `uploadMiddleware`: Middleware xử lý file upload (ví dụ: sử dụng `multer` cho Node.js/Express) cho hình ảnh.

**API Endpoints:**

1. **Lấy danh sách Sản phẩm (List Products)**
    - **Endpoint:** `GET /api/products`
    - **Mô tả:** Lấy danh sách sản phẩm công khai với phân trang, lọc và tìm kiếm.
    - **Query Params:**
        - `page`, `limit`: Phân trang.
        - `category`: Lọc theo slug hoặc ID danh mục.
        - `search`: Tìm kiếm theo tên, mô tả.
        - `minPrice`, `maxPrice`: Lọc theo khoảng giá.
        - `sizes`: Lọc theo kích thước (ví dụ: `sizes=S,M`).
        - `colors`: Lọc theo màu sắc.
        - `material`: Lọc theo chất liệu.
        - `sortBy`: Sắp xếp (ví dụ: `price_asc`, `price_desc`, `createdAt_desc`).
    - **Logic:**
        - Truy vấn DB lấy danh sách sản phẩm với các điều kiện lọc, tìm kiếm, sắp xếp và phân trang.
        - Chỉ lấy các sản phẩm có status `AVAILABLE` hoặc `OUT_OF_STOCK` (không lấy `UNLISTED`).
        - Bao gồm thông tin cơ bản (tên, slug, giá, ảnh đại diện, danh mục).
    - **Response (Success 200):**`json { "data": [ /* array of product summaries */ ], "pagination": { "page": 1, "limit": 10, "totalItems": 50, "totalPages": 5 } }`
    - **Phân quyền:** Public.
2. **Lấy chi tiết Sản phẩm (Get Product Details)**
    - **Endpoint:** `GET /api/products/{slugOrId}`
    - **Mô tả:** Lấy thông tin chi tiết của một sản phẩm dựa trên slug hoặc ID.
    - **Logic:**
        - Tìm sản phẩm theo slug hoặc ID.
        - Nếu không tìm thấy hoặc status là `UNLISTED`, trả về 404.
        - Trả về thông tin chi tiết (bao gồm mô tả, tất cả hình ảnh, các tùy chọn size/color, material, category, giá, trạng thái tồn kho tương đối).
        - Có thể lấy thêm sản phẩm liên quan (cùng danh mục).
    - **Response (Success 200):** Chi tiết sản phẩm.
    - **Response (Error 404):** Không tìm thấy sản phẩm.
    - **Phân quyền:** Public.
3. **Tạo Sản phẩm (Admin - Create Product)**
    - **Endpoint:** `POST /api/admin/products`
    - **Mô tả:** Tạo một sản phẩm mới (chỉ Admin).
    - **Request Body:** (Content-Type: multipart/form-data nếu có upload ảnh trực tiếp, hoặc JSON nếu URL ảnh được gửi riêng sau khi upload)
    `json { "name": "string (required)", "description": "string (required)", "price": "number (required, > 0)", "promotionalPrice": "number (optional)", "categoryId": "string (required, ObjectId)", "sizes": "string[] (required)", // ["S", "M", "L"] "colors": "string[] (required)", // ["Trắng", "Đỏ"] "material": "string (optional)", "stockQuantity": "number (required, >= 0)", "status": "string (optional, AVAILABLE | OUT_OF_STOCK | UNLISTED)", "imageUrls": "string[] (optional, URLs từ upload)" // Hoặc xử lý file upload }`
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Validate input.
        - Tự động tạo `slug` từ `name`, đảm bảo unique.
        - Lưu sản phẩm vào DB.
        - Nếu `imageUrls` được cung cấp, tạo các bản ghi `Image` liên kết với sản phẩm.
    - **Response (Success 201):** Thông tin sản phẩm vừa tạo.
    - **Response (Error 400/401/403/409):** Lỗi validation, xác thực, quyền hoặc tên/slug đã tồn tại.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
4. **Cập nhật Sản phẩm (Admin - Update Product)**
    - **Endpoint:** `PUT /api/admin/products/{productId}`
    - **Mô tả:** Cập nhật thông tin một sản phẩm (chỉ Admin).
    - **Request Body:** Tương tự POST, các trường là optional.
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Validate input.
        - Nếu `name` thay đổi và `slug` không được cung cấp, tạo lại slug (đảm bảo unique).
        - Cập nhật sản phẩm trong DB.
        - Xử lý cập nhật hình ảnh (thêm/xóa).
    - **Response (Success 200):** Thông tin sản phẩm đã cập nhật.
    - **Response (Error 400/401/403/404/409):** Lỗi validation, xác thực, quyền, không tìm thấy hoặc tên/slug đã tồn tại.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
5. **Xóa Sản phẩm (Admin - Delete Product)**
    - **Endpoint:** `DELETE /api/admin/products/{productId}`
    - **Mô tả:** Xóa một sản phẩm (chỉ Admin).
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Kiểm tra ràng buộc: Sản phẩm có nằm trong đơn hàng nào chưa hoàn thành không? (Theo schema, `onDelete: Restrict` trên `OrderItem` sẽ ngăn xóa nếu có liên kết).
        - **Chiến lược xóa:**
            - Xóa mềm: Cập nhật `status = UNLISTED` hoặc thêm trường `isDeleted = true`.
            - Xóa cứng: Xóa sản phẩm và các hình ảnh liên quan (Prisma `onDelete: Cascade` trên `Image`). Cần đảm bảo không có ràng buộc từ `OrderItem`.
    - **Response (Success 204):** No Content.
    - **Response (Error 400/401/403/404):** Lỗi ràng buộc (còn trong đơn hàng), xác thực, quyền, hoặc không tìm thấy.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
6. **Upload Hình ảnh Sản phẩm (Admin - Upload Product Image)**
    - **Endpoint:** `POST /api/admin/products/upload-image`
    - **Mô tả:** Tải lên một file hình ảnh cho sản phẩm.
    - **Request Body:** `multipart/form-data` với field `image`.
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Sử dụng `uploadMiddleware` để xử lý file.
        - Validate file (kích thước, loại file: jpg, png, webp).
        - Lưu file vào thư mục tĩnh (ví dụ: `public/uploads/products`) với tên file unique.
        - Trả về URL công khai của file ảnh đã lưu.
    - **Response (Success 200):**`json { "imageUrl": "/uploads/products/unique-image-name.jpg" }`
    - **Response (Error 400/401/403):** Lỗi file không hợp lệ, xác thực, quyền.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`, `uploadMiddleware`.
7. **(Optional) Quản lý Hình ảnh Sản phẩm (Admin - Manage Product Images)**
    - **Endpoint:** `POST /api/admin/products/{productId}/images` (Thêm ảnh bằng URL đã upload)
    - **Endpoint:** `DELETE /api/admin/products/{productId}/images/{imageId}` (Xóa ảnh khỏi sản phẩm)
    - **Endpoint:** `PATCH /api/admin/products/{productId}/images/{imageId}/default` (Đặt làm ảnh đại diện)
    - **Mô tả:** Quản lý danh sách hình ảnh của một sản phẩm cụ thể.
    - **Logic:** Thực hiện các thao tác CRUD trên collection `Image` liên kết với `productId`.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.

**Lưu ý:**

- Cần xử lý logic tạo slug tự động và đảm bảo tính duy nhất.
- Quản lý tồn kho cần được cập nhật khi có đơn hàng được tạo/hủy.
- Việc upload ảnh cần được thiết kế cẩn thận về bảo mật và lưu trữ.
