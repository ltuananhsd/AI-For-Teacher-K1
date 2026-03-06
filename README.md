# Khai Mở Sức Mạnh AI - Khóa Học Thực Chiến Cho Giáo Viên (K1)

Trang Landing page và luồng đăng ký cho chương trình đào tạo **Khóa học ứng dụng AI cho Giáo viên - Khai Mở Sức Mạnh AI** do CES Global tổ chức.

Dự án được xây dựng với **Next.js 16**, **React 19**, **Tailwind CSS v4**, và **Framer Motion**.
Đặc biệt, giao diện sử dụng ngôn ngữ thiết kế **Retro Brutalism / Playful Education** với viền nét đậm, bóng đổ màu khối cứng, và hiệu ứng dán giấy (tape) mang lại cảm giác sổ tay giáo dục sinh động.

---

## Công nghệ sử dụng

| Công nghệ        | Phiên bản | Mục đích                                       |
| ---------------- | --------- | ---------------------------------------------- |
| Next.js          | 16.1.6    | App Router, SSR/SSG, Tối ưu Image & Font       |
| React            | 19.2.3    | Render UI                                      |
| TypeScript       | ^5        | Kiểm soát kiểu dữ liệu tĩnh (strict mode)      |
| Tailwind CSS     | ^4        | Utility-first styling (PostCSS plugin)         |
| Framer Motion    | ^12       | Hiệu ứng cuộn trang & animations lò xo (spring)|
| Lucide React     | ^0.575    | Thư viện Icon                                  |

---

## Yêu cầu hệ thống

- **Node.js** >= 20
- **npm** (đi kèm với Node.js)

---

## Hướng dẫn cài đặt & Khởi động

```bash
# 1. Cài đặt các thư viện (dependencies)
npm install

# 2. Khởi động server môi trường phát triển (development)
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

---

## Các tập lệnh (Scripts)

| Lệnh            | Lệnh gốc     | Mô tả                                       |
| --------------- | ------------ | ------------------------------------------- |
| `npm run dev`   | `next dev`   | Mở local server với tính năng Hot Reload    |
| `npm run build` | `next build` | Build ứng dụng cho môi trường Production    |
| `npm run start` | `next start` | Khởi chạy server Production sau khi build   |
| `npm run lint`  | `eslint`     | Chạy kiểm tra mã nguồn (ESLint)             |

---

## Cấu trúc dự án

```text
├── public/
│   └── images/              # Assets hình ảnh (logo, avatar) 
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Cấu hình Tailwind (v4) & các Utility class cốt lõi
│   │   ├── layout.tsx       # Root layout (font chữ, thẻ metadata)
│   │   ├── page.tsx         # Trang chủ (Monolithic component với Retro UI)
│   │   ├── register/        # Bước 1: Form đăng ký
│   │   ├── payment/         # Bước 2: Thanh toán QR Code
│   │   └── success/         # Bước 3: Hoàn tất đăng ký
│   └── components/
│       ├── layout/          # Header, Footer, Chatbot
│       └── home/            # Các section của landing page (nếu được tách)
├── AGENTS.md                # Quy tắc dành cho AI Agent code trong dự án
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── next.config.ts
```

---

## Luồng người dùng (User Flow)

```text
Trang Chủ (/) → Đăng Ký (/register) → Thanh Toán (/payment) → Thành Công (/success)
```

| Route       | Mô tả                                                                               |
| ----------- | ----------------------------------------------------------------------------------- |
| `/`         | Landing page marketing (Hero, Thực trạng, Giải pháp, Lộ trình, Hình ảnh giảng viên) |
| `/register` | Form thu thập thông tin đăng ký của giáo viên học viên                              |
| `/payment`  | Cổng quét mã QR thanh toán với đồng hồ đếm ngược                                    |
| `/success`  | Trang xác nhận sau khi thanh toán, cung cấp link vào nhóm Zalo lớp học            |

---

## Hệ thống thiết kế (Design System)

Dự án sử dụng ngôn ngữ thiết kế **Retro Brutalism** kết hợp phong cách Scrapbook trường học. Không sử dụng thiết kế Flat, Sleek, hay Glassmorphism thông thường.

### Bảng màu chủ đạo (Retro Palette):

| Tên biến | Mã Hex    | Chức năng                   |
| -------- | --------- | --------------------------- |
| `navy`   | `#2a3b8f` | Heading, khối tạo độ tương phản |
| `pink`   | `#e94e77` | Nút hành động chính (CTA), Miếng dán |
| `yellow` | `#ffcc00` | Highlight nổi bật, Tag, Bóng đổ |
| `teal`   | `#45b596` | Màu nhấn, trạng thái thành công |
| `orange` | `#ff7e67` | Màu nhấn, cảnh báo              |
| `bg`     | `#fdfbf7` | Màu nền tĩnh như giấy cream     |
| `dark`   | `#1f2937` | Màu đoạn văn tả text cốt lõi    |

### 4 Nguyên tắc UI cốt lõi:

1. **Viền (Borders)**: Tất cả module chính phải có viền dày cứng `border-4 border-gray-800`.
2. **Bóng cứng (Solid Shadows)**: Không dùng bóng mờ, đổ bóng bằng block màu đặc: `shadow-[6px_6px_0px_#2a3b8f]`.
3. **Typography**: Chữ Headline đè viền (`text-shadow`) kết hợp in hoa cứng cáp.
4. **Góc nghiêng (Tilt)**: Các sticker, thiệp báo hiệu, giấy dính (tape) hoặc module mang sắc thái lộn xộn nhẹ `rotate-2`, `-rotate-3`. 

---

## Font chữ

**Space Grotesk** — Tích hợp qua `next/font/google` với subset tiếng Việt.
Hỗ trợ nét cứng, phù hợp với phong cách Brutalism.

---

## Hướng dẫn Triển khai (Deployment)

### Khuyến nghị: Vercel

```bash
# Chạy câu lệnh sinh ra các assets frontend tĩnh (nếu cần test)
npm run build
```

1. Đẩy code lên môi trường GitHub/GitLab.
2. Thêm mới dự án lấy từ tài khoản trên [Vercel](https://vercel.com).
3. Ấn Deploy — Với Frontend tĩnh không cần thiết lập Variable môi trường đính kèm.

---

## Xem thêm

- **Cẩm nang cho AI**: Tệp [AGENTS.md](./AGENTS.md) mô tả luật sinh code và kiến trúc.
- **Backend**: (Cần bổ sung URL tới Repo Express backend nếu dự án đăng ký có liên kết trực tiếp).

---

## Bản quyền

© 2026 CES Global. Toàn quyền sở hữu.
