# Danh sách các Module chi tiết cho Dự án E-commerce Áo Dài

Dựa trên phân tích tài liệu SRS (Software Requirements Specification), hệ thống E-commerce Áo Dài sẽ bao gồm các module chính sau, phân tách theo chức năng và trách nhiệm:

## I. Module Lõi & Chia sẻ (Core & Shared)

*   **Mục đích:** Cung cấp các chức năng, tiện ích và cấu hình cơ bản được sử dụng xuyên suốt ứng dụng.
*   **Backend:**
    *   Thiết lập kết nối cơ sở dữ liệu (Prisma Client).
    *   Quản lý cấu hình ứng dụng (biến môi trường, cài đặt).
    *   Middleware chung (xử lý lỗi, logging, xác thực request cơ bản).
    *   Các hàm tiện ích dùng chung (validation helpers, formatters).
*   **Frontend:**
    *   Thiết lập client gọi API.
    *   Quản lý trạng thái toàn cục (nếu cần, ví dụ: thông tin người dùng đăng nhập, giỏ hàng).
    *   Các thành phần UI dùng chung (Buttons, Inputs, Modals, Layouts, Loaders, Notifications).
    *   Các hàm tiện ích frontend (format tiền tệ, ngày tháng, validation).
    *   Cấu hình TailwindCSS và các style cơ bản.

## II. Module Xác thực (Authentication)

*   **Mục đích:** Quản lý quá trình đăng ký, đăng nhập, đăng xuất và phân quyền người dùng (Khách hàng & Quản trị viên).
*   **Backend:**
    *   API đăng ký tài khoản khách hàng.
    *   API đăng nhập (cho cả Khách hàng và Quản trị viên - có thể dùng chung hoặc tách biệt endpoint).
    *   API đăng xuất.
    *   Quản lý phiên đăng nhập (ví dụ: sử dụng JWT hoặc session).
    *   Middleware kiểm tra quyền truy cập dựa trên vai trò (role-based access control).
    *   Hashing mật khẩu.
*   **Frontend (Customer):**
    *   Trang/Form đăng ký.
    *   Trang/Form đăng nhập.
    *   Xử lý logic đăng xuất (xóa token/session, cập nhật UI).
*   **Frontend (Admin):**
    *   Trang/Form đăng nhập riêng cho quản trị viên (tại `/admin/login`).

## III. Module Người dùng (User)

*   **Mục đích:** Quản lý thông tin tài khoản người dùng.
*   **Backend:**
    *   API lấy thông tin hồ sơ người dùng hiện tại (cho khách hàng).
    *   API cập nhật thông tin hồ sơ người dùng (cho khách hàng).
    *   API lấy danh sách người dùng (cho quản trị viên).
    *   API xem chi tiết người dùng (cho quản trị viên).
    *   API quản lý địa chỉ (nếu cần lưu nhiều địa chỉ).
    *   Quản lý vai trò người dùng.
*   **Frontend (Customer):**
    *   Trang "Tài khoản của tôi" (bao gồm các tab/section con).
    *   Section xem/chỉnh sửa thông tin cá nhân.
    *   Section quản lý địa chỉ (nếu có).
    *   Section đổi mật khẩu (nếu có).
*   **Frontend (Admin):**
    *   Trang danh sách người dùng (hiển thị thông tin cơ bản, có thể có tìm kiếm/lọc).
    *   Trang xem chi tiết thông tin người dùng.

## IV. Module Danh mục (Category)

*   **Mục đích:** Quản lý các danh mục sản phẩm.
*   **Backend:**
    *   API CRUD cho danh mục (Admin).
    *   API lấy danh sách danh mục (cho cả Customer và Admin, có thể có filter/phân cấp).
    *   API lấy chi tiết một danh mục.
*   **Frontend (Customer):**
    *   Hiển thị menu/navigation danh mục.
    *   Hiển thị tên/breadcrumb danh mục trên trang danh sách sản phẩm.
*   **Frontend (Admin):**
    *   Trang quản lý danh mục (danh sách, nút thêm mới).
    *   Form thêm/sửa danh mục.

## V. Module Sản phẩm (Product)

*   **Mục đích:** Quản lý thông tin chi tiết về các sản phẩm áo dài.
*   **Backend:**
    *   API CRUD cho sản phẩm (Admin).
    *   API lấy danh sách sản phẩm với phân trang, tìm kiếm, lọc theo danh mục, giá, thuộc tính (kích thước, màu sắc, chất liệu) (cho Customer và Admin).
    *   API lấy chi tiết một sản phẩm (bao gồm hình ảnh, mô tả, giá, tùy chọn, tồn kho, đánh giá - nếu có).
    *   API lấy sản phẩm liên quan.
    *   API quản lý tồn kho (có thể tích hợp trong CRUD hoặc tách riêng).
    *   API xử lý upload hình ảnh sản phẩm (lưu vào thư mục `public/uploads/products`).
*   **Frontend (Customer):**
    *   Hiển thị sản phẩm trên trang chủ (nổi bật, mới).
    *   Trang danh sách sản phẩm (lưới/danh sách, phân trang).
    *   Component bộ lọc sản phẩm.
    *   Component tìm kiếm sản phẩm.
    *   Trang chi tiết sản phẩm (hiển thị đầy đủ thông tin, hình ảnh, tùy chọn, nút thêm vào giỏ).
*   **Frontend (Admin):**
    *   Trang quản lý sản phẩm (danh sách, tìm kiếm, lọc, phân trang, nút thêm mới).
    *   Form thêm/sửa sản phẩm (bao gồm các trường thông tin, upload hình ảnh, chọn danh mục, quản lý tùy chọn/biến thể nếu cần).

## VI. Module Giỏ hàng (Cart)

*   **Mục đích:** Cho phép khách hàng quản lý các sản phẩm muốn mua trước khi thanh toán.
*   **Backend:**
    *   API thêm sản phẩm vào giỏ hàng.
    *   API lấy thông tin giỏ hàng hiện tại.
    *   API cập nhật số lượng sản phẩm trong giỏ hàng.
    *   API xóa sản phẩm khỏi giỏ hàng.
    *   Xử lý logic giỏ hàng (tính tổng tiền, kiểm tra tồn kho khi thêm/cập nhật).
    *   Lưu trữ giỏ hàng (có thể dùng session, local storage kết hợp đồng bộ backend, hoặc lưu trực tiếp vào DB cho user đã đăng nhập).
*   **Frontend (Customer):**
    *   Icon/Component hiển thị số lượng sản phẩm và tổng tiền nhỏ ở header.
    *   Trang chi tiết giỏ hàng (danh sách sản phẩm, số lượng, giá, tổng tiền, nút xóa, nút tiến hành thanh toán).
    *   Cập nhật UI khi thêm/sửa/xóa sản phẩm trong giỏ.

## VII. Module Đơn hàng (Order)

*   **Mục đích:** Xử lý quy trình đặt hàng và quản lý các đơn hàng đã tạo.
*   **Backend:**
    *   API tạo đơn hàng (nhận thông tin giỏ hàng, địa chỉ giao hàng, phương thức thanh toán - COD).
    *   API lấy danh sách đơn hàng của khách hàng hiện tại.
    *   API lấy chi tiết đơn hàng (cho cả Customer và Admin).
    *   API lấy danh sách tất cả đơn hàng (cho Admin, có phân trang, lọc theo trạng thái, tìm kiếm).
    *   API cập nhật trạng thái đơn hàng (Admin).
    *   Logic xử lý sau khi đặt hàng (trừ tồn kho sản phẩm, gửi email thông báo - nếu có).
*   **Frontend (Customer):**
    *   Trang thanh toán (nhập/xác nhận địa chỉ, xem lại đơn hàng, chọn phương thức thanh toán, nút đặt hàng).
    *   Trang xác nhận đặt hàng thành công.
    *   Trang lịch sử đơn hàng (danh sách, xem chi tiết).
*   **Frontend (Admin):**
    *   Trang quản lý đơn hàng (danh sách, lọc, tìm kiếm).
    *   Trang xem chi tiết đơn hàng.
    *   Chức năng cập nhật trạng thái đơn hàng.

## VIII. Module Quản trị (Admin Panel)

*   **Mục đích:** Cung cấp giao diện tập trung cho quản trị viên để quản lý toàn bộ hệ thống.
*   **Backend:**
    *   API cung cấp dữ liệu tổng hợp cho Dashboard (ví dụ: số đơn hàng mới, doanh thu hôm nay - nếu cần).
    *   Đảm bảo các API quản lý (Product, Category, Order, User) được bảo vệ, chỉ cho phép Admin truy cập.
*   **Frontend (Admin):**
    *   Layout chung cho trang quản trị (Sidebar menu, Header).
    *   Trang Dashboard (hiển thị thông tin tổng quan).
    *   Tích hợp các trang quản lý của các module khác (Product, Category, Order, User) vào layout này.

## IX. Module Xử lý Ảnh (Image Handling - Implicit)

*   **Mục đích:** Quản lý việc tải lên và lưu trữ hình ảnh.
*   **Backend:**
    *   Endpoint nhận file ảnh tải lên.
    *   Logic validation file (kích thước, định dạng).
    *   Lưu file vào thư mục tĩnh trên server (`public/uploads/...`).
    *   Trả về đường dẫn ảnh đã lưu.
*   **Frontend (Admin):**
    *   Component UI cho phép chọn và tải ảnh lên (trong form Sản phẩm, Danh mục).
    *   Hiển thị ảnh đã tải lên.

Việc phân chia module như trên giúp tách biệt các mối quan tâm (separation of concerns), dễ dàng quản lý, phát triển và bảo trì code.
2. Thiết kế Cơ sở dữ liệu (Prisma Schema)

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL") // Sẽ được cung cấp qua biến môi trường
}

// --- Module Xác thực & Người dùng ---

enum Role {
  CUSTOMER
  ADMIN
}

model User {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  email          String    @unique
  password       String    // Sẽ được hash trước khi lưu
  phone          String?   // Số điện thoại (tùy chọn)
  role           Role      @default(CUSTOMER)
  addresses      Address[] // Địa chỉ của người dùng
  orders         Order[]   // Đơn hàng của người dùng
  cart           Cart?     // Giỏ hàng của người dùng (1-1)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Address {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  userId       String   @db.ObjectId
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipientName String
  street       String
  city         String   // Tạm thời đơn giản, có thể mở rộng thành quận/huyện, tỉnh/thành
  phone        String
  isDefault    Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
}

// --- Module Danh mục ---

model Category {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String    @unique
  slug        String    @unique // Dùng cho URL thân thiện
  description String?
  imageUrl    String?   // URL hình ảnh đại diện (tùy chọn)
  parentId    String?   @db.ObjectId // Hỗ trợ danh mục đa cấp (tùy chọn)
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: NoAction, onUpdate: NoAction)
  children    Category[] @relation("CategoryHierarchy")
  products    Product[] // Sản phẩm thuộc danh mục này
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([slug])
}

// --- Module Sản phẩm ---

enum ProductStatus {
  AVAILABLE // Đang bán
  OUT_OF_STOCK // Hết hàng (vẫn hiển thị)
  UNLISTED // Ngừng bán / Ẩn
}

model Product {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  name           String
  slug           String        @unique // Dùng cho URL thân thiện
  description    String
  price          Float         // Giá bán gốc
  promotionalPrice Float?        // Giá khuyến mãi (tùy chọn)
  categoryId     String        @db.ObjectId
  category       Category      @relation(fields: [categoryId], references: [id])
  images         Image[]       // Danh sách hình ảnh sản phẩm
  sizes          String[]      // Danh sách kích thước (S, M, L, XL, Freesize)
  colors         String[]      // Danh sách màu sắc
  material       String?       // Chất liệu
  stockQuantity  Int           // Số lượng tồn kho
  status         ProductStatus @default(AVAILABLE)
  orderItems     OrderItem[]   // Các mục trong đơn hàng liên quan đến sản phẩm này
  cartItems      CartItem[]    // Các mục trong giỏ hàng liên quan đến sản phẩm này
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([slug])
  @@index([categoryId])
  @@index([name]) // Hỗ trợ tìm kiếm theo tên
  @@fulltext([name, description]) // Hỗ trợ tìm kiếm full-text (nếu DB hỗ trợ)
}

model Image {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  url       String   // Đường dẫn tới file ảnh (ví dụ: /uploads/products/image-name.jpg)
  altText   String?  // Mô tả ảnh (tốt cho SEO và accessibility)
  productId String   @db.ObjectId
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  isDefault Boolean  @default(false) // Đánh dấu ảnh đại diện
  createdAt DateTime @default(now())

  @@index([productId])
}

// --- Module Giỏ hàng ---

model Cart {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  userId    String     @unique @db.ObjectId // Mỗi user chỉ có 1 giỏ hàng
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[] // Các sản phẩm trong giỏ
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  cartId    String   @db.ObjectId
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String   @db.ObjectId
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade) // Cascade để nếu SP bị xóa thì item cũng bị xóa khỏi giỏ
  quantity  Int
  size      String?  // Lưu trữ size đã chọn (nếu có)
  color     String?  // Lưu trữ màu đã chọn (nếu có)
  price     Float    // Giá tại thời điểm thêm vào giỏ (để tránh ảnh hưởng khi giá SP thay đổi)
  createdAt DateTime @default(now())

  @@unique([cartId, productId, size, color]) // Đảm bảo không trùng item với cùng tùy chọn trong giỏ
  @@index([cartId])
  @@index([productId])
}

// --- Module Đơn hàng ---

enum OrderStatus {
  PENDING     // Chờ xác nhận
  PROCESSING  // Đang xử lý
  SHIPPING    // Đang giao hàng
  DELIVERED   // Đã giao
  CANCELLED   // Đã hủy
  FAILED      // Thất bại
}

enum PaymentMethod {
  COD // Thanh toán khi nhận hàng
  // Có thể thêm các phương thức khác sau này
}

model Order {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  orderCode      String        @unique @default(cuid()) // Mã đơn hàng duy nhất, dễ đọc hơn ObjectId
  userId         String        @db.ObjectId
  user           User          @relation(fields: [userId], references: [id])
  items          OrderItem[]   // Các sản phẩm trong đơn hàng
  totalAmount    Float         // Tổng tiền đơn hàng
  status         OrderStatus   @default(PENDING)
  shippingAddress Json         // Lưu trữ địa chỉ giao hàng tại thời điểm đặt (tránh ảnh hưởng nếu user đổi địa chỉ sau này)
                               // Ví dụ: { recipientName: "...", street: "...", city: "...", phone: "..." }
  paymentMethod  PaymentMethod @default(COD)
  paymentStatus  String        @default("PENDING") // Trạng thái thanh toán (PENDING, PAID, FAILED)
  notes          String?       // Ghi chú của khách hàng
  statusHistory  OrderStatusUpdate[] // Lịch sử cập nhật trạng thái
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@index([userId])
  @@index([orderCode])
  @@index([status])
}

model OrderItem {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  orderId    String   @db.ObjectId
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId  String   @db.ObjectId
  product    Product  @relation(fields: [productId], references: [id], onUpdate: NoAction, onDelete: Restrict) // Restrict: Không cho xóa SP nếu đang có trong đơn hàng
  quantity   Int
  price      Float    // Giá sản phẩm tại thời điểm đặt hàng
  size       String?  // Size đã đặt
  color      String?  // Màu đã đặt
  productSnapshot Json? // Lưu trữ thông tin cơ bản của SP tại thời điểm đặt (tên, ảnh) để hiển thị nếu SP gốc bị xóa/thay đổi nhiều
                      // Ví dụ: { name: "Áo dài ABC", imageUrl: "/path/to/image.jpg" }
  createdAt  DateTime @default(now())

  @@index([orderId])
  @@index([productId])
}

model OrderStatusUpdate {
  id        String      @id @default(auto()) @map("_id") @db.ObjectId
  orderId   String      @db.ObjectId
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  status    OrderStatus // Trạng thái mới
  updatedBy String?     // ID của Admin cập nhật (nếu có)
  timestamp DateTime    @default(now())

  @@index([orderId])
}

