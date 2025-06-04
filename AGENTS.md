# Thiết kế Frontend - Module Lõi & Chia sẻ (Core & Shared)

**Mục đích:** Cung cấp cấu trúc, thành phần UI, tiện ích và quản lý trạng thái cơ bản dùng chung trong toàn bộ ứng dụng (cả Customer và Admin).

**Công nghệ:** Next.js 15 (App Router), TypeScript 5, TailwindCSS 4.

**Thư viện đề xuất:**

- **State Management:** Zustand (nhẹ nhàng, dễ dùng) hoặc React Context API (cho các state đơn giản, ít cập nhật).
- **Form Handling:** React Hook Form (hiệu năng tốt, dễ tích hợp validation).
- **Data Fetching:** Sử dụng `fetch` API tích hợp của trình duyệt hoặc thư viện như `axios` (cung cấp nhiều tiện ích hơn). Kết hợp với React Query/SWR (TanStack Query) để quản lý caching, revalidation, loading/error states hiệu quả.
- **UI Components:** Sử dụng TailwindCSS để xây dựng component từ đầu hoặc kết hợp với thư viện component headless như Headless UI để đảm bảo accessibility.
- **Icons:** `react-icons` hoặc SVG tùy chỉnh.
- **Notifications/Toasts:** `react-toastify` hoặc tương tự.

**Cấu trúc thư mục (đề xuất trong `src/`):**
src/
├── app/                  # Next.js App Router
│   ├── (admin)/          # Route group cho trang Admin
│   │   ├── admin/
│   │   │   ├── login/      # Trang đăng nhập Admin
│   │   │   ├── dashboard/  # Trang dashboard Admin
│   │   │   ├── products/   # Quản lý sản phẩm
│   │   │   ├── categories/ # Quản lý danh mục
│   │   │   ├── orders/     # Quản lý đơn hàng
│   │   │   └── users/      # Quản lý người dùng
│   │   └── layout.tsx    # Layout chung cho Admin (sidebar, header)
│   ├── (customer)/       # Route group cho trang Khách hàng
│   │   ├── page.tsx      # Trang chủ
│   │   ├── products/
│   │   │   ├── page.tsx    # Trang danh sách sản phẩm
│   │   │   └── [slug]/     # Trang chi tiết sản phẩm
│   │   ├── cart/         # Trang giỏ hàng
│   │   ├── checkout/     # Trang thanh toán
│   │   ├── account/      # Trang tài khoản khách hàng (profile, orders, addresses)
│   │   ├── login/        # Trang đăng nhập khách hàng
│   │   └── register/     # Trang đăng ký khách hàng
│   │   └── layout.tsx    # Layout chung cho Khách hàng (header, footer)
│   ├── api/              # Next.js API Routes (nếu backend tích hợp trong Next.js)
│   └── layout.tsx        # Layout gốc (root layout)
├── components/
│   ├── ui/               # Các component UI cơ bản, tái sử dụng (Button, Input, Modal, Card, etc.)
│   ├── layout/           # Các component layout (Header, Footer, Sidebar, PageWrapper)
│   └── features/         # Các component phức tạp hơn, theo từng tính năng (ProductCard, CartItem, OrderSummary)
├── contexts/             # React Contexts (nếu dùng)
├── hooks/                # Custom React Hooks (useAuth, useCart, useApi)
├── lib/                  # Các hàm tiện ích, cấu hình client API
│   ├── api.ts            # Cấu hình client gọi API backend
│   ├── utils.ts          # Các hàm tiện ích chung (format tiền tệ, ngày tháng)
│   └── validators.ts     # Schemas validation (nếu dùng Zod với React Hook Form)
├── services/             # Logic gọi API cho từng module (productService, authService)
├── store/                # Zustand store (nếu dùng)
└── styles/               # Global CSS, Tailwind config
    └── globals.css

**Thành phần chính:**

1. **API Client (`lib/api.ts`):**
    - Thiết lập instance `axios` hoặc hàm wrapper cho `fetch`.
    - Cấu hình base URL cho API backend.
    - Tự động đính kèm JWT (lấy từ local storage/cookie) vào header `Authorization` cho các request cần xác thực.
    - Xử lý lỗi API tập trung (ví dụ: tự động logout nếu nhận lỗi 401).
2. **State Management (`store/` hoặc `contexts/`):**
    - **Auth State:** Lưu thông tin user đăng nhập (`user`, `token`, `isAuthenticated`, `role`).
    - **Cart State:** Lưu thông tin giỏ hàng (`items`, `totalAmount`). Cần đồng bộ với backend.
    - Sử dụng Zustand hoặc Context tùy độ phức tạp.
3. **Shared UI Components (`components/ui/`):**
    - `Button`: Các biến thể (primary, secondary, danger), kích thước, trạng thái loading.
    - `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`: Form controls với label, error message.
    - `Modal`: Component modal chung.
    - `Card`: Component card cơ bản.
    - `Spinner`/`Loader`: Hiển thị trạng thái loading.
    - `Alert`/`Notification`: Hiển thị thông báo lỗi, thành công.
    - `Pagination`: Component phân trang.
    - `Breadcrumb`: Hiển thị đường dẫn trang.
4. **Layout Components (`components/layout/`):**
    - `CustomerLayout`: Bao gồm `Header` (logo, navigation, search bar, cart icon, user menu) và `Footer`.
    - `AdminLayout`: Bao gồm `Sidebar` (menu điều hướng admin) và `AdminHeader`.
    - `PageWrapper`: Container chung cho nội dung trang, xử lý padding, max-width.
5. **Custom Hooks (`hooks/`):**
    - `useAuth()`: Cung cấp thông tin xác thực và các hàm login, logout, register.
    - `useCart()`: Cung cấp thông tin giỏ hàng và các hàm thêm/sửa/xóa item.
    - `useApi(apiCall, options)`: Hook wrapper cho việc gọi API, quản lý loading, error, data (có thể dùng React Query/SWR thay thế).
6. **Utilities (`lib/utils.ts`):**
    - `formatCurrency(amount)`: Định dạng tiền tệ (VNĐ).
    - `formatDate(date)`: Định dạng ngày tháng.
    - `cn(...)`: Tiện ích kết hợp class TailwindCSS (từ thư viện `clsx` và `tailwind-merge`).

**Luồng dữ liệu:**

- Component trang (trong `app/`) sẽ gọi các service hoặc custom hook để fetch dữ liệu.
- Dữ liệu được truyền xuống các component con qua props.
- Trạng thái toàn cục (auth, cart) được quản lý bởi Zustand/Context và truy cập qua hook.
- Form sử dụng React Hook Form để quản lý state và validation.

**Styling:**

- Sử dụng TailwindCSS cho toàn bộ styling.
- Định nghĩa các màu sắc, font chữ, spacing tùy chỉnh trong `tailwind.config.js` để đảm bảo tính nhất quán và phù hợp với thương hiệu Áo Dài.
