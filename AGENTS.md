# Thiết kế Frontend - Module Sản phẩm (Product)

**Mục đích:** Hiển thị sản phẩm cho khách hàng và cung cấp giao diện quản lý cho admin.

**Routes (App Router):**

- `/products`: Trang danh sách sản phẩm.
- `/products/{slug}`: Trang chi tiết sản phẩm.
- `/admin/products`: Trang quản lý sản phẩm (Admin).
- `/admin/products/new`: Trang thêm mới sản phẩm (Admin).
- `/admin/products/{productId}/edit`: Trang sửa sản phẩm (Admin).

**Components (Customer):**

1. **ProductList (`components/features/products/ProductList.tsx`)**
    - **Sử dụng:** Tại `/products`.
    - **UI:** Hiển thị danh sách sản phẩm dưới dạng lưới (grid). Sử dụng `ProductCard` cho mỗi sản phẩm. Tích hợp `ProductFilter`, `ProductSort`, và `Pagination`.
    - **Logic:**
        - Lấy các tham số lọc, sắp xếp, phân trang từ URL query params.
        - Fetch dữ liệu từ API `GET /api/products` với các params tương ứng.
        - Sử dụng React Query/SWR để quản lý data fetching, loading, error states.
        - Hiển thị skeleton loader khi đang tải.
        - Cập nhật URL query params khi người dùng thay đổi bộ lọc, sắp xếp hoặc trang.
2. **ProductCard (`components/features/products/ProductCard.tsx`)**
    - **Sử dụng:** Trong `ProductList`, trang chủ, sản phẩm liên quan.
    - **UI:** Hiển thị hình ảnh đại diện, tên sản phẩm, giá (giá gốc và giá khuyến mãi nếu có), có thể có nút “Thêm vào giỏ” nhanh hoặc link đến trang chi tiết.
    - **Logic:** Nhận dữ liệu sản phẩm qua props. Render thông tin. Link đến `/products/{slug}`.
3. **ProductFilter (`components/features/products/ProductFilter.tsx`)**
    - **Sử dụng:** Tại `/products` (thường ở sidebar).
    - **UI:** Các bộ lọc theo Danh mục (lấy từ API Categories), Khoảng giá (slider hoặc input), Kích thước, Màu sắc, Chất liệu (checkboxes hoặc tags).
    - **Logic:**
        - Fetch danh sách danh mục, các tùy chọn lọc khác nếu cần.
        - Quản lý trạng thái các bộ lọc đã chọn.
        - Khi người dùng thay đổi bộ lọc, cập nhật URL query params để `ProductList` fetch lại dữ liệu.
4. **ProductSort (`components/features/products/ProductSort.tsx`)**
    - **Sử dụng:** Tại `/products` (thường ở phía trên danh sách).
    - **UI:** Dropdown cho phép chọn tiêu chí sắp xếp (Mới nhất, Giá tăng dần, Giá giảm dần).
    - **Logic:** Quản lý trạng thái sắp xếp đã chọn. Cập nhật URL query param `sortBy` khi thay đổi.
5. **ProductDetailView (`components/features/products/ProductDetailView.tsx`)**
    - **Sử dụng:** Tại `/products/{slug}`.
    - **UI:** Layout chi tiết sản phẩm:
        - Cột trái: `ProductImageGallery`.
        - Cột phải: Tên sản phẩm, Giá, Mô tả ngắn, Lựa chọn Kích thước, Màu sắc (nếu có), Chọn Số lượng, Nút “Thêm vào giỏ hàng”, Thông tin chi tiết (Mô tả đầy đủ, Chất liệu).
        - Phần dưới: Đánh giá sản phẩm (nếu có), Sản phẩm liên quan (`ProductList` thu nhỏ).
    - **Logic:**
        - Lấy `slug` từ URL params.
        - Fetch dữ liệu chi tiết từ API `GET /api/products/{slug}`.
        - Quản lý state cho các tùy chọn (size, color, quantity) đã chọn.
        - Gọi API `POST /api/cart/items` khi nhấn “Thêm vào giỏ hàng” (sử dụng `useCart` hook).
        - Hiển thị trạng thái tồn kho.
6. **ProductImageGallery (`components/features/products/ProductImageGallery.tsx`)**
    - **Sử dụng:** Trong `ProductDetailView`.
    - **UI:** Hiển thị ảnh lớn và danh sách ảnh thumbnail. Cho phép click thumbnail để đổi ảnh lớn. Có thể có chức năng zoom ảnh.
    - **Logic:** Nhận danh sách `images` từ props. Quản lý state ảnh đang được chọn.

**Components (Admin):**

1. **ProductTable (`components/features/admin/products/ProductTable.tsx`)**
    - **Sử dụng:** Tại `/admin/products`.
    - **UI:** Bảng hiển thị danh sách sản phẩm (Ảnh nhỏ, Tên, Danh mục, Giá, Số lượng tồn, Trạng thái). Có tìm kiếm, lọc theo danh mục/trạng thái, phân trang. Nút “Thêm mới”, “Sửa”, “Xóa”.
    - **Logic:**
        - Fetch dữ liệu từ API `GET /api/admin/products` (cần endpoint riêng cho admin hoặc param để lấy cả sản phẩm ẩn).
        - Sử dụng thư viện table.
        - Link đến trang sửa (`/admin/products/{productId}/edit`).
        - Xử lý xóa (gọi API `DELETE /api/admin/products/{productId}` sau xác nhận).
2. **ProductForm (`components/features/admin/products/ProductForm.tsx`)**
    - **Sử dụng:** Tại `/admin/products/new` và `/admin/products/{productId}/edit`.
    - **UI:** Form lớn nhập/sửa thông tin sản phẩm:
        - Tên, Mô tả (WYSIWYG editor nếu có thể), Giá, Giá KM.
        - Chọn Danh mục (Dropdown từ API Categories).
        - Nhập Kích thước, Màu sắc, Chất liệu (có thể dùng input tags).
        - Nhập Số lượng tồn.
        - Chọn Trạng thái.
        - Khu vực Upload/Quản lý Hình ảnh (`ImageUploader`).
        - Nút “Lưu sản phẩm”.
    - **Logic:**
        - Sử dụng `React Hook Form`.
        - Nếu là trang sửa, fetch dữ liệu sản phẩm hiện tại từ API `GET /api/products/{productId}` để điền form.
        - Fetch danh sách danh mục cho dropdown.
        - Xử lý upload ảnh và lấy URL.
        - Gọi API `POST /api/admin/products` (thêm mới) hoặc `PUT /api/admin/products/{productId}` (cập nhật) khi submit.
        - Chuyển hướng về trang danh sách admin sau khi lưu thành công.
3. **ImageUploader (`components/features/admin/products/ImageUploader.tsx`)**
    - **Sử dụng:** Trong `ProductForm`.
    - **UI:** Khu vực cho phép kéo thả hoặc chọn file ảnh. Hiển thị ảnh đã upload dưới dạng thumbnail. Cho phép xóa ảnh, sắp xếp thứ tự, chọn ảnh đại diện.
    - **Logic:**
        - Gọi API `POST /api/admin/products/upload-image` cho mỗi ảnh được chọn.
        - Quản lý danh sách URL ảnh đã upload.
        - Cung cấp danh sách URL này cho `ProductForm` để gửi lên cùng dữ liệu sản phẩm.

**Trang (Pages):**

- **Customer Product List (`app/(customer)/products/page.tsx`)**: Sử dụng `CustomerLayout`, hiển thị `ProductFilter`, `ProductSort`, `ProductList`.
- **Customer Product Detail (`app/(customer)/products/{slug}/page.tsx`)**: Sử dụng `CustomerLayout`, hiển thị `ProductDetailView`.
- **Admin Product List (`app/(admin)/admin/products/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `ProductTable` và nút “Thêm mới”.
- **Admin Product New/Edit (`app/(admin)/admin/products/(new|{productId}/edit)/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `ProductForm`.

**State Management & Data Fetching:**

- React Query/SWR cho fetch/cache sản phẩm, danh mục.
- React Hook Form cho state form admin.
- URL query params để quản lý state lọc/sắp xếp/phân trang trên trang danh sách sản phẩm.
