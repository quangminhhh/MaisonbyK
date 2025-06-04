# Thiết kế Frontend - Module Danh mục (Category)

**Mục đích:** Hiển thị danh mục cho khách hàng và cung cấp giao diện quản lý cho admin.

**Routes (App Router):**

- `/products?category={categorySlug}`: Trang danh sách sản phẩm lọc theo danh mục (thuộc Module Product, nhưng sử dụng dữ liệu Category).
- `/admin/categories`: Trang quản lý danh mục (Admin).

**Components (Customer):**

1. **CategoryNavigation (`components/features/categories/CategoryNavigation.tsx`)**
    - **Sử dụng:** Trong Header hoặc Sidebar (tùy thiết kế layout).
    - **UI:** Menu đa cấp hiển thị danh sách các danh mục chính. Khi hover/click vào danh mục cha, hiển thị các danh mục con.
    - **Logic:**
        - Fetch dữ liệu cây danh mục từ API `GET /api/categories?tree=true`.
        - Render menu điều hướng, mỗi mục là một link đến trang danh sách sản phẩm tương ứng (ví dụ: `/products?category=ao-dai-truyen-thong`).
        - Sử dụng React Query/SWR để cache dữ liệu danh mục.
2. **CategoryBreadcrumb (`components/features/categories/CategoryBreadcrumb.tsx`)**
    - **Sử dụng:** Trên trang danh sách sản phẩm (`/products`) khi có lọc theo danh mục, và trang chi tiết sản phẩm (`/products/[slug]`).
    - **UI:** Hiển thị đường dẫn danh mục (ví dụ: Trang chủ > Áo Dài > Áo Dài Truyền Thống).
    - **Logic:**
        - Nhận thông tin danh mục hiện tại (hoặc slug/ID) làm prop.
        - Nếu cần, fetch thông tin danh mục cha từ API `GET /api/categories/{slugOrId}` để xây dựng đường dẫn.
        - Render các link breadcrumb.

**Components (Admin):**

1. **CategoryTable (`components/features/admin/categories/CategoryTable.tsx`)**
    - **Sử dụng:** Tại `/admin/categories`.
    - **UI:** Bảng hiển thị danh sách danh mục (Tên, Slug, Mô tả ngắn, Số sản phẩm - nếu có). Có nút “Thêm mới”, “Sửa”, “Xóa” cho mỗi danh mục.
    - **Logic:**
        - Fetch dữ liệu từ API `GET /api/categories` (có thể cần lấy cả cây để hiển thị phân cấp).
        - Sử dụng thư viện table.
        - Xử lý sự kiện click nút Thêm mới, Sửa, Xóa (mở modal hoặc gọi API trực tiếp sau xác nhận).
2. **CategoryForm (`components/features/admin/categories/CategoryForm.tsx`)**
    - **Sử dụng:** Trong Modal hoặc trang riêng để thêm/sửa danh mục.
    - **UI:** Form nhập Tên danh mục, Mô tả, chọn Danh mục cha (dropdown lấy từ API), upload/chọn Hình ảnh đại diện.
    - **Logic:**
        - Sử dụng `React Hook Form`.
        - Fetch danh sách danh mục (để chọn cha) từ API `GET /api/categories`.
        - Xử lý upload ảnh (nếu có) gọi API `POST /api/admin/products/upload-image` (có thể dùng chung endpoint upload) và lấy URL.
        - Gọi API `POST /api/admin/categories` (thêm mới) hoặc `PUT /api/admin/categories/{categoryId}` (cập nhật) khi submit.
        - Đóng modal và refresh danh sách khi thành công.
    - **Props:** `initialData` (cho sửa), `onSubmitSuccess`.

**Trang (Pages):**

- **Admin Category List Page (`app/(admin)/admin/categories/page.tsx`)**: Sử dụng `AdminLayout`, hiển thị `CategoryTable` và nút “Thêm mới” (mở modal chứa `CategoryForm`).

**State Management & Data Fetching:**

- React Query/SWR để fetch và cache danh sách/cây danh mục.
- State của form quản lý bởi `React Hook Form`.
- State của modal quản lý bằng `useState` hoặc thư viện modal.
