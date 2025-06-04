# Thiết kế Frontend - Module Giỏ hàng (Cart)

**Mục đích:** Cung cấp giao diện cho khách hàng xem và quản lý giỏ hàng.

**Routes (App Router):**

- `/cart`: Trang chi tiết giỏ hàng.

**Components:**

1. **CartIcon (`components/features/cart/CartIcon.tsx`)**
    - **Sử dụng:** Trong `Header` của `CustomerLayout`.
    - **UI:** Icon giỏ hàng, thường có hiển thị số lượng sản phẩm hiện có trong giỏ (badge).
    - **Logic:**
        - Lấy dữ liệu số lượng item từ `useCart` hook (hoặc state management).
        - Khi click, có thể mở ra một mini-cart dropdown hoặc điều hướng đến trang `/cart`.
        - Cập nhật số lượng hiển thị khi giỏ hàng thay đổi.
2. **MiniCart (`components/features/cart/MiniCart.tsx`)** (Optional)
    - **Sử dụng:** Hiển thị khi click vào `CartIcon`.
    - **UI:** Dropdown hiển thị tóm tắt các sản phẩm trong giỏ (ảnh nhỏ, tên, số lượng, giá), tổng tiền và nút “Xem giỏ hàng” / “Thanh toán”.
    - **Logic:**
        - Lấy dữ liệu giỏ hàng từ `useCart` hook.
        - Render danh sách item tóm tắt.
3. **CartView (`components/features/cart/CartView.tsx`)**
    - **Sử dụng:** Tại trang `/cart`.
    - **UI:** Layout 2 cột:
        - Cột trái: Danh sách chi tiết các sản phẩm trong giỏ (`CartItem` component). Hiển thị thông báo nếu giỏ hàng trống.
        - Cột phải: Tóm tắt giỏ hàng (`CartSummary`) bao gồm tổng tiền và nút “Tiến hành thanh toán”.
    - **Logic:**
        - Sử dụng `useCart` hook để lấy dữ liệu giỏ hàng chi tiết.
        - Fetch dữ liệu giỏ hàng từ API `GET /api/cart` khi component mount hoặc khi state cart thay đổi (để đảm bảo đồng bộ và lấy thông tin product mới nhất).
        - Hiển thị loading state khi đang fetch.
        - Truyền dữ liệu xuống `CartItem` và `CartSummary`.
4. **CartItem (`components/features/cart/CartItem.tsx`)**
    - **Sử dụng:** Trong `CartView` (danh sách bên trái).
    - **UI:** Hiển thị thông tin một sản phẩm trong giỏ: Ảnh, Tên, Kích thước/Màu sắc đã chọn, Đơn giá, Input chọn Số lượng, Thành tiền, Nút “Xóa”.
    - **Logic:**
        - Nhận dữ liệu item qua props.
        - Khi người dùng thay đổi số lượng:
            - Gọi hàm cập nhật số lượng từ `useCart` hook (hàm này sẽ gọi API `PUT /api/cart/items/{cartItemId}`).
            - Có thể có debounce để tránh gọi API liên tục.
            - Hiển thị loading/disabled state khi đang cập nhật.
            - Xử lý lỗi (ví dụ: số lượng vượt tồn kho).
        - Khi người dùng nhấn nút “Xóa”:
            - Hiển thị xác nhận.
            - Gọi hàm xóa item từ `useCart` hook (hàm này sẽ gọi API `DELETE /api/cart/items/{cartItemId}`).
5. **CartSummary (`components/features/cart/CartSummary.tsx`)**
    - **Sử dụng:** Trong `CartView` (cột phải).
    - **UI:** Hiển thị Tổng tiền tạm tính. Nút “Tiến hành thanh toán”.
    - **Logic:**
        - Nhận tổng tiền từ `CartView` hoặc tính toán lại từ danh sách items.
        - Nút “Tiến hành thanh toán” điều hướng đến trang `/checkout`.
        - Vô hiệu hóa nút nếu giỏ hàng trống hoặc có item không hợp lệ (ví dụ: sản phẩm đã bị xóa).

**Trang (Pages):**

- **Cart Page (`app/(customer)/cart/page.tsx`)**: Sử dụng `CustomerLayout`, hiển thị `CartView`. Cần được bảo vệ, yêu cầu đăng nhập.

**State Management & Data Fetching:**

- **`useCart` Hook (Zustand/Context):**
    - Quản lý state `cart` (bao gồm `items`, `totalAmount`, `isLoading`, `error`).
    - Cung cấp các hàm:
        - `fetchCart()`: Gọi API `GET /api/cart` để lấy/đồng bộ giỏ hàng.
        - `addItem(itemData)`: Gọi API `POST /api/cart/items`, cập nhật state khi thành công.
        - `updateItemQuantity(itemId, quantity)`: Gọi API `PUT /api/cart/items/{itemId}`, cập nhật state.
        - `removeItem(itemId)`: Gọi API `DELETE /api/cart/items/{itemId}`, cập nhật state.
        - `clearCart()`: Xóa state giỏ hàng (dùng sau khi checkout thành công).
    - State này cần được khởi tạo bằng cách gọi `fetchCart()` khi người dùng đăng nhập hoặc tải lại trang.
- React Query/SWR có thể được dùng bên trong `useCart` hook để quản lý việc fetch và cache dữ liệu từ API `/api/cart`.

# Thiết kế Frontend - Module Đơn hàng (Order)

**Mục đích:** Cung cấp giao diện cho khách hàng đặt hàng, xem lịch sử đơn hàng và cho admin quản lý đơn hàng.

**Routes (App Router):**

- `/checkout`: Trang tiến hành thanh toán.
- `/order/confirmation/{orderId}`: Trang xác nhận đặt hàng thành công.
- `/account/orders`: Trang lịch sử đơn hàng của khách hàng.
- `/account/orders/{orderId}`: Trang chi tiết đơn hàng của khách hàng.
- `/admin/orders`: Trang quản lý danh sách đơn hàng (Admin).
- `/admin/orders/{orderId}`: Trang xem chi tiết đơn hàng (Admin).

**Components (Customer):**

1. **CheckoutForm (`components/features/checkout/CheckoutForm.tsx`)**
    - **Sử dụng:** Tại `/checkout`.
    - **UI:** Layout 2-3 cột:
        - Thông tin giao hàng: Chọn địa chỉ đã lưu (`AddressList` thu gọn) hoặc nhập địa chỉ mới (`AddressForm`).
        - Tóm tắt đơn hàng (`OrderSummary`): Danh sách sản phẩm (`OrderItem` thu gọn), tổng tiền.
        - Chọn phương thức thanh toán (Hiện chỉ có COD).
        - Ô nhập Ghi chú (optional).
        - Nút “Đặt hàng”.
    - **Logic:**
        - Fetch giỏ hàng hiện tại (`useCart`) và danh sách địa chỉ (`GET /api/users/me/addresses`).
        - Quản lý state địa chỉ được chọn hoặc địa chỉ mới nhập.
        - Sử dụng `React Hook Form` cho phần nhập địa chỉ mới.
        - Khi nhấn “Đặt hàng”:
            - Validate thông tin (địa chỉ đã chọn/nhập).
            - Gọi API `POST /api/orders` với `shippingAddressId` hoặc `shippingAddress` object, `paymentMethod`, `notes`.
            - Hiển thị loading state.
            - Xử lý lỗi từ API (ví dụ: hết hàng, lỗi server).
            - Nếu thành công, gọi `clearCart()` từ `useCart` và chuyển hướng đến trang xác nhận `/order/confirmation/{orderId}`.
2. **OrderSummary (`components/features/orders/OrderSummary.tsx`)**
    - **Sử dụng:** Trong `CheckoutForm`, `OrderConfirmation`, `OrderDetailView`.
    - **UI:** Hiển thị danh sách các `OrderItem` (phiên bản chỉ đọc), tổng tiền sản phẩm, phí vận chuyển (nếu có), tổng cộng.
    - **Logic:** Nhận danh sách items và tổng tiền qua props. Render thông tin.
3. **OrderItem (`components/features/orders/OrderItem.tsx`)** (Có thể dùng chung/kế thừa từ CartItem)
    - **Sử dụng:** Trong `OrderSummary`.
    - **UI:** Phiên bản chỉ đọc của CartItem: Ảnh, Tên, Size/Color, Số lượng, Đơn giá, Thành tiền.
    - **Logic:** Nhận dữ liệu item qua props.
4. **OrderConfirmation (`components/features/orders/OrderConfirmation.tsx`)**
    - **Sử dụng:** Tại `/order/confirmation/{orderId}`.
    - **UI:** Thông báo đặt hàng thành công, hiển thị Mã đơn hàng (`orderCode`), tóm tắt đơn hàng (`OrderSummary`), thông tin giao hàng dự kiến (nếu có). Nút “Tiếp tục mua sắm” hoặc “Xem chi tiết đơn hàng”.
    - **Logic:**
        - Lấy `orderId` từ URL.
        - Fetch thông tin cơ bản của đơn hàng từ API `GET /api/orders/{orderId}` để hiển thị mã đơn, tổng tiền.
5. **OrderHistoryList (`components/features/account/OrderHistoryList.tsx`)**
    - **Sử dụng:** Tại `/account/orders`.
    - **UI:** Danh sách các đơn hàng đã đặt, mỗi đơn hàng là một `OrderHistoryItem`. Có phân trang.
    - **Logic:**
        - Fetch danh sách đơn hàng từ API `GET /api/orders/my` với phân trang.
        - Sử dụng React Query/SWR.
6. **OrderHistoryItem (`components/features/account/OrderHistoryItem.tsx`)**
    - **Sử dụng:** Trong `OrderHistoryList`.
    - **UI:** Card hiển thị thông tin tóm tắt đơn hàng: Mã đơn hàng, Ngày đặt, Tổng tiền, Trạng thái. Có link/nút “Xem chi tiết”.
    - **Logic:** Nhận dữ liệu đơn hàng qua props. Link đến `/account/orders/{orderId}`.
7. **CustomerOrderDetailView (`components/features/account/CustomerOrderDetailView.tsx`)**
    - **Sử dụng:** Tại `/account/orders/{orderId}`.
    - **UI:** Hiển thị chi tiết đơn hàng:
        - Thông tin chung: Mã đơn hàng, Ngày đặt, Trạng thái.
        - Địa chỉ giao hàng.
        - Phương thức thanh toán.
        - Danh sách sản phẩm (`OrderSummary`).
        - Lịch sử trạng thái đơn hàng.
    - **Logic:**
        - Lấy `orderId` từ URL.
        - Fetch chi tiết đơn hàng từ API `GET /api/orders/{orderId}`.

**Components (Admin):**

1. **AdminOrderTable (`components/features/admin/orders/AdminOrderTable.tsx`)**
    - **Sử dụng:** Tại `/admin/orders`.
    - **UI:** Bảng hiển thị danh sách tất cả đơn hàng (Mã đơn, Tên KH, Ngày đặt, Tổng tiền, Trạng thái). Có tìm kiếm, lọc theo trạng thái, phân trang.
    - **Logic:**
        - Fetch dữ liệu từ API `GET /api/admin/orders`.
        - Sử dụng thư viện table.
        - Mỗi hàng có link đến trang chi tiết `/admin/orders/{orderId}`.
2. **AdminOrderDetailView (`components/features/admin/orders/AdminOrderDetailView.tsx`)**
    - **Sử dụng:** Tại `/admin/orders/{orderId}`.
    - **UI:** Tương tự `CustomerOrderDetailView` nhưng có thêm:
        - Thông tin khách hàng (link đến trang chi tiết user).
        - Chức năng cập nhật trạng thái đơn hàng (`OrderStatusUpdater`).
    - **Logic:**
        - Lấy `orderId` từ URL.
        - Fetch chi tiết đơn hàng từ API `GET /api/orders/{orderId}` (Admin có quyền xem mọi đơn).
3. **OrderStatusUpdater (`components/features/admin/orders/OrderStatusUpdater.tsx`)**
    - **Sử dụng:** Trong `AdminOrderDetailView`.
    - **UI:** Dropdown hoặc các nút để chọn trạng thái mới (Processing, Shipping, Delivered, Cancelled). Nút “Cập nhật trạng thái”.
    - **Logic:**
        - Nhận trạng thái hiện tại và `orderId` qua props.
        - Quản lý state trạng thái mới được chọn.
        - Gọi API `PATCH /api/admin/orders/{orderId}/status` khi nhấn nút cập nhật.
        - Hiển thị loading/error/success state.
        - Refresh lại chi tiết đơn hàng sau khi cập nhật thành công.

**Trang (Pages):**

- **Checkout Page (`app/(customer)/checkout/page.tsx`)**: Sử dụng `CustomerLayout`, hiển thị `CheckoutForm`. Yêu cầu đăng nhập.
- **Order Confirmation Page (`app/(customer)/order/confirmation/{orderId}/page.tsx`)**: Sử dụng `CustomerLayout`, hiển thị `OrderConfirmation`. Yêu cầu đăng nhập.
- **Customer Order History (`app/(customer)/account/orders/page.tsx`)**: Sử dụng `CustomerLayout` và `AccountLayout`, hiển thị `OrderHistoryList`. Yêu cầu đăng nhập.
- **Customer Order Detail (`app/(customer)/account/orders/{orderId}/page.tsx`)**: Sử dụng `CustomerLayout` và `AccountLayout`, hiển thị `CustomerOrderDetailView`. Yêu cầu đăng nhập.
- **Admin Order List (`app/(admin)/admin/orders/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `AdminOrderTable`. Yêu cầu Admin.
- **Admin Order Detail (`app/(admin)/admin/orders/{orderId}/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `AdminOrderDetailView`. Yêu cầu Admin.

**State Management & Data Fetching:**

- React Query/SWR để fetch/cache đơn hàng.
- `useCart` hook để lấy giỏ hàng cho checkout và xóa sau khi đặt hàng.
- Form state quản lý bởi `React Hook Form` (cho địa chỉ mới ở checkout).
- State cập nhật trạng thái đơn hàng (Admin) quản lý bằng `useState`.
