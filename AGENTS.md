# Thiết kế Backend - Module Giỏ hàng (Cart)

**Mục đích:** Quản lý giỏ hàng của khách hàng.

**Middleware:**

- `authenticateToken`: Xác thực JWT (bắt buộc để liên kết giỏ hàng với user).

**Lưu trữ Giỏ hàng:**

- Sẽ lưu trực tiếp vào collection `Cart` và `CartItem` trong MongoDB, liên kết với `userId`. Điều này đảm bảo giỏ hàng được đồng bộ trên nhiều thiết bị và phiên đăng nhập.

**API Endpoints:**

1. **Lấy thông tin Giỏ hàng (Get Cart)**
    - **Endpoint:** `GET /api/cart`
    - **Mô tả:** Lấy thông tin chi tiết giỏ hàng của người dùng đang đăng nhập.
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Tìm giỏ hàng (`Cart`) của user trong DB.
        - Nếu chưa có, tạo giỏ hàng mới rỗng cho user.
        - Lấy tất cả `CartItem` liên quan, kèm thông tin sản phẩm (`Product`) cần thiết (tên, giá hiện tại, ảnh đại diện, slug, tồn kho).
        - Tính toán tổng tiền.
        - Kiểm tra và cập nhật giỏ hàng nếu sản phẩm không còn tồn tại hoặc hết hàng (ví dụ: đánh dấu item không hợp lệ hoặc tự động xóa).
    - **Response (Success 200):**`json { "id": "string (cartId)", "userId": "string (userId)", "items": [ { "id": "string (cartItemId)", "productId": "string", "quantity": "number", "size": "string | null", "color": "string | null", "price": "number (giá lúc thêm)", "product": { "id": "string", "name": "string", "slug": "string", "imageUrl": "string | null (ảnh đại diện)", "currentPrice": "number (giá hiện tại)", "stockQuantity": "number", "status": "string (AVAILABLE, OUT_OF_STOCK)" } } // ... more items ], "totalAmount": "number" }`
    - **Response (Error 401):** Lỗi xác thực.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.
2. **Thêm Sản phẩm vào Giỏ hàng (Add Item to Cart)**
    - **Endpoint:** `POST /api/cart/items`
    - **Mô tả:** Thêm một sản phẩm (với số lượng và tùy chọn) vào giỏ hàng.
    - **Request Body:**`json { "productId": "string (required, ObjectId)", "quantity": "number (required, > 0)", "size": "string (optional)", "color": "string (optional)" }`
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Tìm hoặc tạo giỏ hàng (`Cart`) cho user.
        - Validate input (`productId` tồn tại, `quantity` hợp lệ).
        - Kiểm tra tồn kho (`Product.stockQuantity`) so với `quantity` yêu cầu + số lượng đã có trong giỏ (nếu item đã tồn tại).
        - Kiểm tra xem `CartItem` với cùng `productId`, `size`, `color` đã tồn tại chưa.
            - Nếu có: Cập nhật `quantity` (cộng dồn). Đảm bảo tổng quantity không vượt tồn kho.
            - Nếu chưa: Tạo `CartItem` mới, lưu giá sản phẩm (`Product.price` hoặc `promotionalPrice`) vào `CartItem.price`.
        - Trả về thông tin giỏ hàng đã cập nhật (hoặc chỉ thông báo thành công).
    - **Response (Success 200/201):** Thông tin giỏ hàng cập nhật hoặc thông báo thành công.
    - **Response (Error 400/401/404):** Lỗi validation (hết hàng, sản phẩm không tồn tại), xác thực.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.
3. **Cập nhật Số lượng Item trong Giỏ hàng (Update Cart Item Quantity)**
    - **Endpoint:** `PUT /api/cart/items/{cartItemId}`
    - **Mô tả:** Cập nhật số lượng của một item cụ thể trong giỏ hàng.
    - **Request Body:**`json { "quantity": "number (required, >= 0)" // Nếu quantity = 0, tương đương xóa item }`
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Tìm `CartItem` theo `cartItemId`. Đảm bảo item này thuộc giỏ hàng của user đang đăng nhập.
        - Nếu `quantity == 0`, xóa `CartItem`.
        - Nếu `quantity > 0`:
            - Kiểm tra tồn kho (`Product.stockQuantity`) so với `quantity` mới.
            - Cập nhật `quantity` của `CartItem`.
        - Trả về thông tin giỏ hàng đã cập nhật.
    - **Response (Success 200):** Thông tin giỏ hàng cập nhật.
    - **Response (Error 400/401/404):** Lỗi validation (hết hàng), xác thực, không tìm thấy item hoặc item không thuộc user.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.
4. **Xóa Item khỏi Giỏ hàng (Remove Cart Item)**
    - **Endpoint:** `DELETE /api/cart/items/{cartItemId}`
    - **Mô tả:** Xóa một item cụ thể khỏi giỏ hàng.
    - **Logic:**
        - Sử dụng `authenticateToken` để lấy `userId`.
        - Tìm `CartItem` theo `cartItemId`. Đảm bảo item này thuộc giỏ hàng của user đang đăng nhập.
        - Xóa `CartItem` khỏi DB.
        - Trả về thông tin giỏ hàng đã cập nhật.
    - **Response (Success 200):** Thông tin giỏ hàng cập nhật.
    - **Response (Error 401/404):** Lỗi xác thực, không tìm thấy item hoặc item không thuộc user.
    - **Phân quyền:** Đã đăng nhập (CUSTOMER).
    - **Middleware:** `authenticateToken`.

**Lưu ý:**

- Cần xử lý đồng thời (concurrency) khi cập nhật giỏ hàng và kiểm tra tồn kho, đặc biệt là khi nhiều request xảy ra cùng lúc hoặc khi tiến hành checkout.
- Cân nhắc việc xóa các giỏ hàng không hoạt động trong thời gian dài.
