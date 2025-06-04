# Thiết kế Backend - Module Đơn hàng (Order)

**Mục đích:** Xử lý quy trình đặt hàng và quản lý đơn hàng.

**Middleware:**

- `authenticateToken`: Xác thực JWT.
- `authorizeRole(\'ADMIN\')`: Kiểm tra vai trò Admin (cho các thao tác quản lý).

**API Endpoints:**

1. **Tạo Đơn hàng (Create Order)**
    - **Endpoint:** `POST /api/orders`
    - **Mô tả:** Tạo đơn hàng mới từ giỏ hàng của người dùng.
    - **Request Body:**`json { "shippingAddressId": "string (required, ObjectId)", // ID của địa chỉ đã lưu // Hoặc có thể cho phép nhập địa chỉ mới trực tiếp // "shippingAddress": { "recipientName": "...", "street": "...", "city": "...", "phone": "..." }, "paymentMethod": "COD", // Hiện tại chỉ hỗ trợ COD "notes": "string (optional)" }`
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Lấy giỏ hàng (`Cart` và `CartItem`) của user.
        - Nếu giỏ hàng trống, trả về lỗi 400.
        - Lấy thông tin địa chỉ giao hàng từ `shippingAddressId` (hoặc từ request body).
        - **Transaction:** Bắt đầu một transaction để đảm bảo tính toàn vẹn.
            - Kiểm tra lại tồn kho cho từng sản phẩm trong giỏ hàng. Nếu có sản phẩm hết hàng hoặc không đủ số lượng, hủy transaction và trả về lỗi 400.
            - Tạo bản ghi `Order` mới với trạng thái `PENDING`, lưu `shippingAddress` dưới dạng JSON, `paymentMethod`, `notes`.
            - Tạo các bản ghi `OrderItem` tương ứng với từng `CartItem`:
                - Lưu `productId`, `quantity`, `size`, `color`.
                - Lưu `price` (giá tại thời điểm đặt hàng).
                - Tạo `productSnapshot` (lưu tên, ảnh SP).
            - Tính `totalAmount` cho `Order`.
            - **Trừ tồn kho:** Cập nhật `stockQuantity` của các `Product` tương ứng.
            - Xóa giỏ hàng (`Cart` và `CartItem`) của user sau khi đặt hàng thành công.
            - Tạo bản ghi `OrderStatusUpdate` đầu tiên với status `PENDING`.
        - **Commit Transaction.**
        - (Optional) Gửi email xác nhận đơn hàng cho khách.
    - **Response (Success 201):**`json { "orderId": "string (orderId)", "orderCode": "string (orderCode)", "status": "PENDING", "totalAmount": "number" }`
    - **Response (Error 400/401/404):** Lỗi validation (giỏ hàng trống, hết hàng, địa chỉ không hợp lệ), xác thực.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.
2. **Lấy danh sách Đơn hàng của tôi (List My Orders)**
    - **Endpoint:** `GET /api/orders/my`
    - **Mô tả:** Lấy danh sách các đơn hàng đã đặt của người dùng đang đăng nhập.
    - **Query Params:** `page`, `limit`, `status`.
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Truy vấn DB lấy danh sách `Order` của user với phân trang và lọc theo trạng thái.
        - Sắp xếp theo ngày tạo mới nhất.
        - Trả về thông tin tóm tắt (mã đơn, ngày đặt, tổng tiền, trạng thái).
    - **Response (Success 200):**`json { "data": [ /* array of order summaries */ ], "pagination": { /* pagination info */ } }`
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.
3. **Lấy chi tiết Đơn hàng (Get Order Details)**
    - **Endpoint:** `GET /api/orders/{orderIdOrCode}`
    - **Mô tả:** Lấy thông tin chi tiết của một đơn hàng cụ thể (cho Customer hoặc Admin).
    - **Logic:**
        - Sử dụng `authenticateToken`.
        - Tìm `Order` theo `orderId` hoặc `orderCode`.
        - Nếu không tìm thấy, trả về 404.
        - **Kiểm tra quyền:** Nếu user là CUSTOMER, chỉ cho phép xem đơn hàng của chính họ (`order.userId === req.user.id`). Nếu là ADMIN, cho phép xem mọi đơn hàng.
        - Lấy thông tin chi tiết đơn hàng, bao gồm `items` (với `productSnapshot`), `shippingAddress`, `statusHistory`.
    - **Response (Success 200):** Chi tiết đơn hàng.
    - **Response (Error 401/403/404):** Lỗi xác thực, không có quyền xem, hoặc không tìm thấy đơn hàng.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER xem của mình, ADMIN xem tất cả).
    - **Middleware:** `authenticateToken`.
4. **Lấy danh sách Tất cả Đơn hàng (Admin - List All Orders)**
    - **Endpoint:** `GET /api/admin/orders`
    - **Mô tả:** Lấy danh sách tất cả đơn hàng trong hệ thống (cho Admin).
    - **Query Params:** `page`, `limit`, `status`, `search` (theo mã đơn, tên KH, email KH).
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Truy vấn DB lấy danh sách `Order` với phân trang, lọc, tìm kiếm.
        - Bao gồm thông tin khách hàng liên quan.
    - **Response (Success 200):**`json { "data": [ /* array of order summaries with customer info */ ], "pagination": { /* pagination info */ } }`
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.
5. **Cập nhật Trạng thái Đơn hàng (Admin - Update Order Status)**
    - **Endpoint:** `PATCH /api/admin/orders/{orderId}/status`
    - **Mô tả:** Cập nhật trạng thái của một đơn hàng (chỉ Admin).
    - **Request Body:**`json { "status": "string (required, PROCESSING | SHIPPING | DELIVERED | CANCELLED)" }`
    - **Logic:**
        - Sử dụng `authenticateToken` và `authorizeRole(\'ADMIN\')`.
        - Tìm `Order` theo `orderId`.
        - Validate trạng thái mới (ví dụ: không thể chuyển từ DELIVERED về PENDING).
        - Cập nhật `status` của `Order`.
        - Tạo bản ghi `OrderStatusUpdate` mới với trạng thái mới và `updatedBy = req.user.id`.
        - **Xử lý hoàn kho (nếu hủy đơn):** Nếu trạng thái mới là `CANCELLED`, cần cộng lại số lượng sản phẩm trong `OrderItem` vào `Product.stockQuantity` (cần transaction).
        - (Optional) Gửi email thông báo cập nhật trạng thái cho khách hàng.
    - **Response (Success 200):** Thông tin đơn hàng đã cập nhật (hoặc chỉ trạng thái mới).
    - **Response (Error 400/401/403/404):** Lỗi validation (trạng thái không hợp lệ), xác thực, quyền, không tìm thấy đơn hàng.
    - **Phân quyền:** ADMIN.
    - **Middleware:** `authenticateToken`, `authorizeRole(\'ADMIN\')`.

**Lưu ý:**

- Việc tạo đơn hàng và cập nhật trạng thái (đặc biệt là hủy đơn) cần được thực hiện trong transaction để đảm bảo tính nhất quán dữ liệu (tồn kho, trạng thái đơn hàng).
- Cần định nghĩa rõ quy trình chuyển đổi trạng thái hợp lệ.
