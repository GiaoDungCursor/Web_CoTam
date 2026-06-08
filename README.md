# EduPro E-Learning Platform

Website bán khóa học trực tuyến được xây dựng bằng React, Vite, TypeScript, Tailwind CSS và Express. Phiên bản hiện tại có frontend cho phía người dùng cuối và backend API MVP cho danh sách khóa học, chi tiết khóa học, đăng ký/đăng nhập demo và tạo đơn hàng demo.

Dự án cũng được định hướng mở rộng thành một nền tảng e-learning đầy đủ với backend API, xác thực người dùng, thanh toán, quản lý khóa học, dashboard giảng viên/admin, video streaming và hệ thống chăm sóc khách hàng.

## Mục Lục

- [Tổng quan](#tổng-quan)
- [Tính năng hiện tại](#tính-năng-hiện-tại)
- [Tech stack hiện tại](#tech-stack-hiện-tại)
- [Cài đặt và chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Scripts](#scripts)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Định hướng backend](#định-hướng-backend)
- [Thiết kế API](#thiết-kế-api)
- [Database đề xuất](#database-đề-xuất)
- [Xác thực và phân quyền](#xác-thực-và-phân-quyền)
- [Thanh toán](#thanh-toán)
- [Video và lưu trữ file](#video-và-lưu-trữ-file)
- [Triển khai](#triển-khai)
- [Roadmap](#roadmap)

## Tổng Quan

EduPro hướng tới mô hình tương tự Udemy/Coursera ở quy mô nhỏ đến trung bình:

- Học viên có thể xem danh sách khóa học, xem chi tiết, đăng ký, mua khóa học và theo dõi tiến độ học.
- Giảng viên có thể tạo khóa học, quản lý bài học, xem học viên và doanh thu.
- Admin có thể duyệt khóa học, quản lý người dùng, giao dịch, voucher và cấu hình hệ thống.
- Backend xử lý dữ liệu nghiệp vụ, xác thực, thanh toán, webhook, email, file upload và báo cáo.

Phiên bản trong repo hiện tại đã có backend Express chạy tại `server/`. Dữ liệu vẫn là in-memory/mock để phục vụ MVP, chưa kết nối database thật.

## Tính Năng Hiện Tại

- Trang chủ giới thiệu nền tảng.
- Danh sách khóa học.
- Trang chi tiết khóa học.
- Layout chung gồm header và footer.
- Routing bằng React Router.
- Dữ liệu khóa học mẫu.
- Giao diện responsive bằng Tailwind CSS.
- Tùy chọn giao diện sáng/tối/theo hệ thống, lưu bằng `localStorage`.
- Build production bằng Vite.
- Backend API Express tại `/api/v1`.
- Endpoint khóa học, danh mục, auth demo và order demo.
- Frontend gọi API thật và fallback về mock data nếu backend chưa chạy.
- Trang admin `/admin` để tạo, sửa, xóa khóa học.

## Tech Stack Hiện Tại

- React 19
- Vite 8
- TypeScript
- Tailwind CSS
- React Router DOM
- React Icons
- ThemeProvider tự quản lý `light`, `dark`, `system`
- Express
- Zod
- JSON Web Token
- bcryptjs
- ESLint

## Cài Đặt Và Chạy Dự Án

Yêu cầu:

- Node.js 18 trở lên
- npm

Cài dependencies:

```bash
npm install
```

Chạy môi trường development:

```bash
npm run dev
```

Mặc định Vite sẽ chạy tại:

```text
http://localhost:5173
```

Chạy backend API:

```bash
npm run server
```

API mặc định chạy tại:

```text
http://localhost:3000/api/v1
```

Khi phát triển, nên mở 2 terminal:

```bash
npm run server
```

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Xem thử bản production sau khi build:

```bash
npm run preview
```

## Scripts

```bash
npm run dev
```

Chạy app ở môi trường development.

```bash
npm run dev:api
```

Chạy backend API ở chế độ watch.

```bash
npm run server
```

Chạy backend API một lần.

```bash
npm run build
```

Kiểm tra TypeScript cho frontend/backend và build app ra thư mục `dist`.

```bash
npm run lint
```

Chạy ESLint để kiểm tra code.

```bash
npm run preview
```

Chạy server preview cho bản build production.

## Cấu Trúc Thư Mục

```text
.
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   └── layout/
│   ├── data/
│   │   └── courses.ts
│   ├── lib/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Courses.tsx
│   │   └── CourseDetail.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server/
│   ├── data/
│   │   └── courses.ts
│   └── index.ts
├── dist/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Định Hướng Backend

Backend hiện được triển khai ở mức MVP bằng Express và in-memory data. Khi mở rộng, có thể chuyển dần sang mô hình Modular Monolith trước, sau đó tách microservices khi lưu lượng lớn hơn.

Stack hiện tại:

- Node.js với Express.
- Zod để validate request body.
- bcryptjs để hash password demo.
- JSON Web Token cho access token demo.
- Dữ liệu in-memory cho users, orders và khóa học.

Stack nên bổ sung ở giai đoạn tiếp theo:

- PostgreSQL cho dữ liệu chính.
- Prisma hoặc TypeORM cho ORM.
- Redis cho cache, OTP, rate limit và session tạm.
- Refresh token rotation.
- Docker Compose cho môi trường local.
- GitHub Actions cho CI/CD.

Các module backend chính:

- Auth module: đăng ký, đăng nhập, refresh token, quên mật khẩu, OAuth.
- User module: hồ sơ cá nhân, avatar, trạng thái tài khoản, phân quyền.
- Course module: khóa học, danh mục, section, lesson, tài liệu đính kèm.
- Enrollment module: ghi danh, quyền truy cập khóa học, tiến độ học.
- Cart/Order module: giỏ hàng, đơn hàng, mã giảm giá.
- Payment module: VNPay, MoMo, ZaloPay, VietQR, Stripe/PayPal.
- Review module: đánh giá, bình luận, rating.
- Q&A module: hỏi đáp trong từng bài học.
- Instructor module: quản lý khóa học, học viên, doanh thu.
- Admin module: duyệt khóa học, quản lý user, giao dịch, voucher.
- Notification module: email, thông báo hệ thống, webhook events.
- File module: upload ảnh, tài liệu, video metadata.

## Thiết Kế API

Base URL đề xuất:

```text
/api/v1
```

Endpoint đã triển khai:

```text
POST   /auth/register
POST   /auth/login

GET    /health
GET    /categories

GET    /courses
GET    /courses/:id
POST   /courses
PATCH  /courses/:id
DELETE /courses/:id

POST   /orders
GET    /orders
```

Các endpoint còn lại trong roadmap: refresh token, user profile, lesson, cart, payment webhook, enrollment, review và phân quyền admin thật.

Chuẩn response nên thống nhất:

```json
{
  "success": true,
  "data": {},
  "message": "OK"
}
```

Ví dụ lỗi:

```json
{
  "success": false,
  "message": "Email đã được sử dụng",
  "errors": []
}
```

## Database Đề Xuất

Các bảng cốt lõi:

- `users`: thông tin tài khoản.
- `roles`: phân quyền hệ thống.
- `user_oauth_accounts`: tài khoản Google/Facebook/GitHub liên kết.
- `refresh_tokens`: quản lý refresh token.
- `categories`: danh mục khóa học.
- `courses`: thông tin khóa học.
- `course_sections`: chương/phần trong khóa học.
- `lessons`: bài học.
- `lesson_assets`: tài liệu, file đính kèm, video metadata.
- `carts`: giỏ hàng.
- `cart_items`: khóa học trong giỏ.
- `orders`: đơn hàng.
- `order_items`: chi tiết đơn hàng.
- `payments`: giao dịch thanh toán.
- `coupons`: mã giảm giá.
- `coupon_redemptions`: lịch sử dùng mã giảm giá.
- `enrollments`: khóa học học viên sở hữu.
- `lesson_progress`: tiến độ từng bài học.
- `reviews`: đánh giá khóa học.
- `questions`: câu hỏi trong bài học/khóa học.
- `answers`: câu trả lời của giảng viên/admin.
- `instructor_payouts`: yêu cầu rút tiền của giảng viên.
- `notifications`: thông báo hệ thống.
- `audit_logs`: lịch sử thao tác quan trọng.

Quan hệ quan trọng:

- Một user có thể là student, instructor hoặc admin.
- Một instructor có nhiều course.
- Một course có nhiều section.
- Một section có nhiều lesson.
- Một order có nhiều order item.
- Một enrollment liên kết user với course.
- Lesson progress liên kết enrollment với lesson.

## Xác Thực Và Phân Quyền

Luồng xác thực đề xuất:

1. User đăng nhập bằng email/password hoặc OAuth.
2. Backend trả về access token ngắn hạn và refresh token dài hạn.
3. Access token dùng để gọi API.
4. Refresh token dùng để lấy access token mới.
5. Khi logout, refresh token bị thu hồi.

Roles đề xuất:

- `student`: học viên.
- `instructor`: giảng viên.
- `admin`: quản trị viên.
- `super_admin`: toàn quyền hệ thống.

Các lớp bảo vệ nên có:

- Password hashing bằng bcrypt hoặc argon2.
- Rate limit cho login, OTP và forgot password.
- Email verification.
- Refresh token rotation.
- RBAC cho API admin/instructor.
- Audit log cho thao tác nhạy cảm.

## Thanh Toán

Thanh toán nội địa:

- VNPay
- MoMo
- ZaloPay
- VietQR qua Casso hoặc SePay

Thanh toán quốc tế:

- Stripe
- PayPal

Luồng thanh toán đề xuất:

1. Học viên thêm khóa học vào giỏ hàng.
2. Tạo order với trạng thái `pending`.
3. Backend tạo payment session hoặc payment URL.
4. Người dùng thanh toán ở cổng thanh toán.
5. Cổng thanh toán gọi webhook/IPN về backend.
6. Backend xác minh chữ ký webhook.
7. Nếu thành công, cập nhật order thành `paid`.
8. Backend tạo enrollment cho các khóa học trong order.
9. Gửi email hóa đơn/xác nhận mua khóa học.

Trạng thái order:

- `pending`
- `paid`
- `failed`
- `cancelled`
- `refunded`

## Video Và Lưu Trữ File

Với nền tảng e-learning, không nên lưu video trực tiếp trong server app. Nên dùng object storage và CDN.

Đề xuất:

- AWS S3 hoặc Cloudflare R2 để lưu file.
- CloudFront hoặc Cloudflare CDN để phân phối nội dung.
- HLS hoặc MPEG-DASH cho video streaming.
- Signed URL để hạn chế truy cập trái phép.
- Watermark động theo user ID/email để giảm rủi ro chia sẻ lậu.
- Mux, Vimeo OTT hoặc Cloudflare Stream nếu muốn giảm công vận hành video pipeline.

Luồng upload video:

1. Instructor tạo lesson.
2. Backend tạo signed upload URL.
3. Frontend upload video trực tiếp lên storage.
4. Backend lưu metadata video.
5. Worker xử lý encode/transcode nếu tự vận hành.
6. Lesson chỉ phát video qua signed playback URL.

## Triển Khai

Frontend:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- Static hosting bất kỳ hỗ trợ thư mục `dist`

Backend:

- Render
- Railway
- Fly.io
- DigitalOcean App Platform
- AWS ECS/EC2
- VPS chạy Docker

Database:

- Supabase PostgreSQL
- Neon PostgreSQL
- Railway PostgreSQL
- AWS RDS
- DigitalOcean Managed Database

Gợi ý môi trường production:

```text
Frontend: Vercel/Netlify
Backend: Docker + Node.js API
Database: PostgreSQL
Cache: Redis
Storage: S3/R2
CDN: CloudFront/Cloudflare
CI/CD: GitHub Actions
```

## Biến Môi Trường Đề Xuất

Frontend:

```env
VITE_API_BASE_URL=https://api.example.com/api/v1
```

Backend:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/edupro
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=

VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_RETURN_URL=

MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Lưu ý: không commit file `.env` thật lên repository. Chỉ nên commit `.env.example`.

## Roadmap

Giai đoạn 1: hoàn thiện frontend mockup

- Sửa toàn bộ lỗi hiển thị tiếng Việt.
- Hoàn thiện trang login/register.
- Thêm giỏ hàng.
- Thêm trang checkout mock.
- Thêm trang học video mock.
- Thêm responsive/mobile polish.

Giai đoạn 2: xây backend MVP

- Tạo REST API.
- Thêm dashboard admin tạo/sửa/xóa khóa học.
- Kết nối PostgreSQL.
- Auth bằng JWT.
- CRUD khóa học.
- Enrollment và progress.
- Cart/order cơ bản.
- Admin duyệt khóa học.

Giai đoạn 3: thanh toán và vận hành

- Tích hợp VNPay/MoMo/VietQR.
- Xử lý webhook.
- Gửi email xác nhận.
- Dashboard doanh thu.
- Logging và monitoring.

Giai đoạn 4: e-learning nâng cao

- Video streaming qua S3/R2/CDN.
- Q&A theo bài học.
- Review/rating.
- Coupon.
- Certificate PDF.
- Instructor payout.
- Gamification.

## Ghi Chú Phát Triển

- Dữ liệu hiện tại là mock data, chưa gọi API thật.
- Các trang `about`, `login`, `register` hiện mới là placeholder.
- Thư mục `dist` là output build, không nên chỉnh tay trừ khi cần kiểm tra file production.
- Khi backend được thêm vào, nên tạo thêm `.env.example`, tài liệu API và hướng dẫn chạy Docker Compose.
- File schema MSSQL nằm tại `database/mssql_schema.sql`. Có thể chạy trực tiếp trong SQL Server Management Studio hoặc Azure Data Studio để tạo database `EduProDb`, bảng lõi và dữ liệu khóa học mẫu.
- Tài liệu luồng auth và kế hoạch hoàn thiện backend nằm tại `docs/backend-auth-and-roadmap.md`.
