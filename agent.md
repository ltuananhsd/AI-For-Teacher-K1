# Tài Liệu Hướng Dẫn AI (Agent) - Dự Án Google AI Bootcamp 2026

Đây là tài liệu tóm tắt nhằm giúp AI nắm bắt nhanh kiến trúc, công nghệ và quy chuẩn của dự án frontend này. Khi nhận yêu cầu chỉnh sửa, AI cần đọc file này trước tiên và bắt buộc tuân thủ các quy định dưới đây để duy trì tính nhất quán.

## 1. Thông Tin Chung

- Tên dự án: Google AI Ecosystem Bootcamp 2026 (Landing Page & Form Đăng Ký)
- Ngôn ngữ giao diện (UI): Tiếng Việt
- Ngôn ngữ code & comment: Tiếng Anh

## 2. Tech Stack Chính

Dự án sử dụng các công nghệ sau, AI tuyệt đối không tự ý cài đặt thêm thư viện mới (đặc biệt là các thư viện như CSS-in-JS, Redux, Zustand hay UI Framework như shadcn/MUI):

- Framework: Next.js 16.1.6 (App Router)
- React Library: React 19.2.3
- Ngôn ngữ: TypeScript v5 (Strict mode)
- Styling: Tailwind CSS v4 (Sử dụng `@tailwindcss/postcss`, cấu hình toàn bộ qua file `globals.css`, dự án KHÔNG có file `tailwind.config.ts`)
- Animation: Framer Motion v12
- Icons: Lucide React v0.575 (Luôn import riêng từng icon để tối ưu bundle)

## 3. Cấu Trúc Thư Mục Hệ Thống

Dự án được tổ chức theo kiến trúc App Router của Next.js:

- Thư mục `src/app/`: Chứa định tuyến (routing) và các layout.
  - `globals.css`: Chứa Tailwind imports (`@tailwind`) và khai báo theme custom.
  - `layout.tsx`: Root layout (chứa cấu hình font, metadata, Navbar và Footer).
  - `page.tsx`: Landing page chính (Lưu ý: file này có thể khá lớn vì gộp nhiều sections).
  - `register/page.tsx`: Trang điền form đăng ký thông tin (Bước 1).
  - `payment/page.tsx`: Trang thanh toán quét mã QR (Bước 2).
  - `success/page.tsx`: Trang thông báo đăng ký thành công (Bước 3).

- Thư mục `src/components/`: Chứa các React components có thể tái sử dụng.
  - `layout/`: Gồm `Header.tsx` và `Footer.tsx`.
  - `home/`: Gồm các components của trang chủ đã được tách lẻ (như `HeroSection.tsx`, `RoadmapSection.tsx`, `TubesBackground.tsx`...). Khi refactor hoặc thêm tính năng cho trang chủ, hãy ưu tiên làm việc trên các component này.

- Thư mục `public/`: Chứa tài nguyên tĩnh (hình ảnh nền, logo).

## 4. Quy Định Về Code Và Component

- Client và Server Components: Mặc định sử dụng Server Components. Chỉ thêm dòng `"use client"` ở đầu file khi component cần dùng hooks của React (useState, useEffect, refs), dùng Framer Motion, điều hướng trình duyệt hoặc gắn các sự kiện (onClick, onChange).
- Cách đặt tên (Naming Convention):
  - File component: Viết hoa chữ cái đầu và có đuôi `.tsx` (ví dụ: `HeroSection.tsx`).
  - File css, tiện ích (utils): Dùng kiểu camelCase.
- Xử lý Asset & Link:
  - Bắt buộc dùng thẻ `<Image>` của `next/image` cho mọi ảnh local.
  - Bắt buộc dùng `<Link>` của `next/link` cho điều hướng nội bộ. Liên kết ra trang khác phải dùng thẻ `<a>` kèm `target="_blank" rel="noopener noreferrer"`.
- TypeScript: Luôn khai báo type/interface rõ ràng. Hạn chế tối đa dùng `any`.

## 5. Quy Định Về Giao Diện Và Animation

- Giao diện (Styling):
  - Dự án CHỈ sử dụng Dark Mode. KHÔNG viết các đoạn code hỗ trợ Light Mode.
  - Thiết kế theo phong cách Glassmorphism (giao diện kính mờ), kết hợp với hiệu ứng Glow (phát sáng). Khai thác tối đa các custom class đã định nghĩa trong `globals.css` như `.glass-card` hoặc `.google-glow`.
  - Chú trọng Mobile-first, sử dụng các tiền tố `md:`, `lg:` của Tailwind để xử lý responsive.
- Animation:
  - Sử dụng độc quyền thư viện Framer Motion.
  - Chú ý: Cần gắn thuộc tính `viewport={{ once: true }}` cho các thẻ `motion` chạy hiệu ứng khi scroll, để tránh lặp đi lặp lại hành động làm giảm hiệu năng.

## 6. Các Hành Động Bị Cấm (Anti-Patterns)

- Không tạo API routes (backend đã được tách biệt ở nơi khác).
- Không dùng `getServerSideProps` hay các hàm xử lý dữ liệu SSR cũ của Next.js (chỉ dùng App Router data fetching).
- Không nhúng mã CSS inline (thuộc tính `style={{}}`) nếu có thể dùng Tailwind.

## 7. Checklist Kiểm Tra Code (Dành Cho Agent)

- Lỗi biên dịch: Ứng dụng phải chạy được lệnh `npm run build` bình thường.
- Responsive: Giao diện hiển thị tốt trên 375px (Mobile), 768px (Tablet) và 1024px+ (Desktop).
- Dọn dẹp: Xóa toàn bộ `console.log` dùng lúc debug khỏi code gửi lên.
