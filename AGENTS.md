## Dữ liệu Mẫu (Data Seeding)

- Sử dụng `prisma/seed.ts` và script trong `package.json` (`prisma db seed`) để tạo dữ liệu ban đầu cần thiết cho môi trường development:
    - Tài khoản Admin mặc định.
    - Các danh mục sản phẩm cơ bản.
    - Một số sản phẩm mẫu với đầy đủ thông tin và hình ảnh.
- Điều này giúp dev và tester có dữ liệu để làm việc ngay lập tức.

## Tài liệu (Documentation)

- **README.md:** Cung cấp hướng dẫn cài đặt, cấu trúc dự án, cách chạy các script quan trọng (dev, build, test, seed). Users flow, admin flow, system flow.
