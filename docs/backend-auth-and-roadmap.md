# Backend Auth Flow And Roadmap

Tài liệu này mô tả luồng xác thực hiện tại, cách backend được tổ chức lại, và kế hoạch hoàn thiện theo schema MSSQL tại `database/mssql_schema.sql`.

## Cấu Trúc Backend Hiện Tại

```text
server/
├── app.ts
├── index.ts
├── config/
│   └── env.ts
├── data/
│   ├── courses.ts
│   └── store.ts
├── lib/
│   ├── auth.ts
│   └── http.ts
├── middleware/
│   └── auth.ts
├── modules/
│   ├── auth/
│   │   └── auth.routes.ts
│   ├── courses/
│   │   ├── course.schema.ts
│   │   └── courses.routes.ts
│   └── orders/
│       └── orders.routes.ts
└── types.ts
```

`server/index.ts` chỉ khởi động server. `server/app.ts` khai báo middleware và gắn route. Từng nhóm nghiệp vụ nằm trong `server/modules`.

## Luồng Auth Hiện Tại

### 1. Đăng ký học viên

Endpoint:

```text
POST /api/v1/auth/register
```

Body:

```json
{
  "name": "Nguyen Van A",
  "email": "student@example.com",
  "password": "secret123"
}
```

Backend xử lý:

1. Validate body bằng Zod.
2. Chuẩn hóa email về lowercase.
3. Kiểm tra email đã tồn tại chưa.
4. Hash password bằng bcrypt.
5. Tạo user role `student`.
6. Trả về `accessToken` và thông tin user public.

### 2. Đăng nhập

Endpoint:

```text
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "admin@edupro.local",
  "password": "Admin@123"
}
```

Backend xử lý:

1. Validate body.
2. Tìm user theo email.
3. So sánh password với password hash.
4. Ký JWT access token.
5. Trả về session gồm `accessToken` và user public.

Tài khoản admin demo:

```text
admin@edupro.local / Admin@123
```

### 3. Gọi API cần đăng nhập

Client gửi header:

```text
Authorization: Bearer <accessToken>
```

Middleware `requireAuth` xử lý:

1. Đọc Bearer token từ header.
2. Verify token bằng `JWT_ACCESS_SECRET`.
3. Gắn `req.authUser = { id, email, role }`.
4. Nếu token thiếu hoặc sai, trả `401`.

### 4. Phân quyền role

Middleware `requireRoles(...)` xử lý:

1. Kiểm tra đã có `req.authUser`.
2. Kiểm tra role có nằm trong danh sách được phép không.
3. Nếu không đủ quyền, trả `403`.

Ví dụ:

```ts
requireAuth, requireRoles('admin', 'super_admin')
```

Hiện tại các API tạo/sửa/xóa khóa học đã yêu cầu role `admin` hoặc `super_admin`.

## Mapping Với Schema MSSQL

Backend memory hiện tại tương ứng với các bảng MSSQL như sau:

```text
users memory      -> dbo.Users + dbo.Roles
courses memory    -> dbo.Courses + dbo.Categories
orders memory     -> dbo.Orders + dbo.OrderItems
access token      -> ký bằng JWT, chưa lưu DB
refresh token     -> sẽ lưu ở dbo.RefreshTokens
```

Khi nối MSSQL, nên giữ nguyên contract API hiện tại và chỉ thay lớp repository.

## Kế Hoạch Hoàn Thiện Backend

### Phase 1: Ổn định auth và admin MVP

- Hoàn thiện login/register/me.
- Bảo vệ route admin bằng access token.
- Thêm role guard cho course/order/admin APIs.
- Thêm form admin login ở frontend.
- Giữ dữ liệu memory để test nhanh trong dev.

Trạng thái: đã làm phần lõi.

### Phase 2: Kết nối MSSQL

- Cài package `mssql`.
- Thêm biến môi trường kết nối SQL Server.
- Tạo `server/db/mssql.ts`.
- Tạo repository:
  - `users.repository.ts`
  - `courses.repository.ts`
  - `orders.repository.ts`
  - `refresh-tokens.repository.ts`
- Chuyển auth/course/order routes sang dùng repository thay vì `store`.
- Chạy script `database/mssql_schema.sql` trước khi khởi động backend.

Biến môi trường đề xuất:

```env
MSSQL_SERVER=localhost
MSSQL_PORT=1433
MSSQL_DATABASE=EduProDb
MSSQL_USER=sa
MSSQL_PASSWORD=yourStrongPassword
MSSQL_ENCRYPT=false
MSSQL_TRUST_SERVER_CERTIFICATE=true
```

### Phase 3: Refresh token và session an toàn

- Access token hết hạn ngắn, ví dụ 15 phút.
- Refresh token hết hạn dài, ví dụ 30 ngày.
- Hash refresh token trước khi lưu vào `dbo.RefreshTokens`.
- Thêm endpoint:
  - `POST /auth/refresh-token`
  - `POST /auth/logout`
- Khi refresh, rotate refresh token cũ sang token mới.
- Khi logout, revoke refresh token.

### Phase 4: Course CMS đầy đủ

- CRUD category.
- CRUD course section.
- CRUD lesson.
- Upload thumbnail và lesson assets.
- Course status flow:
  - `draft`
  - `pending_review`
  - `published`
  - `archived`
- Admin duyệt/publish khóa học.

### Phase 5: Checkout và enrollment

- Cart API.
- Order API.
- Payment session cho VNPay/MoMo/VietQR/Stripe.
- Webhook xác nhận thanh toán.
- Tạo enrollment sau khi order `paid`.
- Lưu tiến độ học vào `LessonProgress`.

### Phase 6: Instructor dashboard

- Instructor tạo khóa học của mình.
- Instructor xem học viên theo khóa học.
- Instructor xem doanh thu.
- Yêu cầu payout.
- Admin duyệt payout.

### Phase 7: Production hardening

- Rate limit login/register.
- Email verification.
- Forgot/reset password.
- Audit log cho thao tác admin.
- Centralized error handler.
- Request logging.
- Unit/integration test cho auth/course/order.
- Docker Compose cho SQL Server + API.
