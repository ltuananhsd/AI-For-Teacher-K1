# CES Global - Database Schema

## Tổng quan

```mermaid
erDiagram
    auth_users ||--|| profiles : "1:1"
    profiles ||--o{ enrollments : "đăng ký"
    profiles ||--o{ payments : "thanh toán"
    profiles ||--o{ email_logs : "nhận email"
    profiles ||--o{ audit_logs : "thực hiện"
    courses ||--o{ enrollments : "được đăng ký"
    courses ||--o{ course_resources : "có"
    courses ||--o{ course_schedules : "có"
    courses }o--o{ course_categories : "N:N"
    enrollments ||--o{ payments : "có"
    enrollments ||--o{ email_logs : "trigger"
    email_templates ||--o{ email_logs : "dùng"
```

---

## Chi tiết từng table

### profiles
> Thông tin học viên — liên kết 1:1 với `auth.users`, tự tạo khi Google login

```mermaid
erDiagram
    profiles {
        UUID id PK "→ auth.users(id)"
        CITEXT email UK "NOT NULL, CHECK regex"
        TEXT full_name
        TEXT phone UK "CHECK regex"
        TEXT avatar_url
        user_role role "DEFAULT student"
        DATE date_of_birth
        TEXT address
        TEXT city
        TEXT company
        TEXT job_title
        TEXT notes "Ghi chú admin (CRM)"
        TEXT_ARRAY tags "DEFAULT {}"
        TEXT lead_source "google, facebook, referral..."
        JSONB metadata "DEFAULT {}"
        BOOLEAN is_active "DEFAULT TRUE"
        BOOLEAN email_verified "DEFAULT FALSE"
        TIMESTAMPTZ created_at "DEFAULT NOW()"
        TIMESTAMPTZ updated_at "DEFAULT NOW()"
        TIMESTAMPTZ last_login_at
    }
```

---

### course_categories
> Danh mục khóa học: IELTS, TOEIC, Business English...

```mermaid
erDiagram
    course_categories {
        UUID id PK
        TEXT name "NOT NULL"
        TEXT slug UK "NOT NULL"
        TEXT description
        TEXT icon_url
        INT display_order "DEFAULT 0"
        BOOLEAN is_active "DEFAULT TRUE"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

---

### courses
> Khóa học — support đa khóa, giảm giá, SEO, capacity

```mermaid
erDiagram
    courses {
        UUID id PK
        TEXT slug UK "NOT NULL"
        TEXT title "NOT NULL"
        TEXT subtitle
        TEXT description
        TEXT short_description "Card preview"
        TEXT thumbnail_url
        TEXT cover_image_url
        DECIMAL price "NOT NULL, CHECK >= 0"
        DECIMAL original_price "Giá gốc"
        TEXT currency "DEFAULT VND"
        TEXT instructor_name
        TEXT instructor_bio
        TEXT instructor_avatar
        INT max_students "NULL = unlimited"
        INT current_students "DEFAULT 0"
        course_status status "DEFAULT draft"
        DATE start_date
        DATE end_date
        INT duration_hours
        DATE registration_deadline
        BOOLEAN is_featured "DEFAULT FALSE"
        BOOLEAN is_published "DEFAULT FALSE"
        TEXT meta_title "SEO"
        TEXT meta_description "SEO"
        JSONB metadata "DEFAULT {}"
        UUID created_by "FK → profiles"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

---

### course_category_map
> Junction table quan hệ N:N giữa courses và categories

```mermaid
erDiagram
    course_category_map {
        UUID course_id PK_FK "→ courses(id) CASCADE"
        UUID category_id PK_FK "→ course_categories(id) CASCADE"
    }
```

---

### course_resources
> Link Zalo, Facebook group, class link — CHỈ hiển thị cho học viên đã thanh toán

```mermaid
erDiagram
    course_resources {
        UUID id PK
        UUID course_id FK "→ courses(id) CASCADE"
        resource_type resource_type "NOT NULL"
        TEXT title "NOT NULL"
        TEXT url "NOT NULL"
        TEXT description
        INT display_order "DEFAULT 0"
        BOOLEAN is_active "DEFAULT TRUE"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

**resource_type values:** `zalo_group` | `facebook_group` | `class_link` | `material` | `recording` | `other`

---

### course_schedules
> Lịch học chi tiết từng buổi

```mermaid
erDiagram
    course_schedules {
        UUID id PK
        UUID course_id FK "→ courses(id) CASCADE"
        TEXT title "NOT NULL"
        TEXT description
        TIMESTAMPTZ scheduled_at
        INT duration_minutes
        TEXT location "Online / Offline"
        INT display_order "DEFAULT 0"
        TIMESTAMPTZ created_at
    }
```

---

### enrollments
> Đăng ký khóa học — UNIQUE(user_id, course_id)

```mermaid
erDiagram
    enrollments {
        UUID id PK
        UUID user_id FK "→ profiles(id) RESTRICT"
        UUID course_id FK "→ courses(id) RESTRICT"
        enrollment_status status "DEFAULT pending_payment"
        TIMESTAMPTZ enrolled_at "DEFAULT NOW()"
        TIMESTAMPTZ confirmed_at
        TIMESTAMPTZ cancelled_at
        TEXT cancellation_reason
        TEXT notes
        JSONB metadata "DEFAULT {}"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

**enrollment_status values:** `pending_payment` → `paid` → `confirmed` | `cancelled` | `refunded`

---

### payments
> Giao dịch thanh toán đa cổng (Sepay, MoMo, VNPay, Stripe, manual...)

```mermaid
erDiagram
    payments {
        UUID id PK
        UUID enrollment_id FK "→ enrollments(id) RESTRICT"
        UUID user_id FK "→ profiles(id) RESTRICT"
        DECIMAL amount "NOT NULL, CHECK > 0"
        TEXT currency "DEFAULT VND"
        payment_method payment_method
        payment_status status "DEFAULT pending"
        TEXT gateway_provider "sepay, momo, vnpay, stripe..."
        TEXT gateway_transaction_id
        TEXT gateway_order_id
        TEXT gateway_reference
        JSONB gateway_raw_data
        TEXT checkout_url "QR / redirect"
        TIMESTAMPTZ expires_at
        TIMESTAMPTZ paid_at
        TIMESTAMPTZ failed_at
        TEXT failure_reason
        TIMESTAMPTZ refunded_at
        DECIMAL refund_amount "CHECK <= amount"
        INET ip_address
        TEXT user_agent
        JSONB metadata "DEFAULT {}"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

**payment_method values:** `bank_transfer` | `qr_code` | `card` | `ewallet` | `manual`  
**payment_status values:** `pending` → `processing` → `completed` | `failed` | `refunded` | `expired`

---

### email_templates
> Template email tùy chỉnh, hỗ trợ `{{variables}}`

```mermaid
erDiagram
    email_templates {
        UUID id PK
        TEXT template_key UK "NOT NULL"
        TEXT name "NOT NULL"
        TEXT subject "NOT NULL"
        TEXT body_html "NOT NULL"
        TEXT body_text
        email_type email_type "NOT NULL"
        JSONB variables "DEFAULT []"
        BOOLEAN is_active "DEFAULT TRUE"
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

**Seed templates:** `payment_success`, `course_info`, `welcome`

---

### email_logs
> Log gửi email với retry mechanism

```mermaid
erDiagram
    email_logs {
        UUID id PK
        UUID user_id FK "→ profiles(id)"
        UUID enrollment_id FK "→ enrollments(id)"
        UUID template_id FK "→ email_templates(id)"
        email_type email_type "NOT NULL"
        TEXT recipient_email "NOT NULL"
        TEXT subject "NOT NULL"
        TEXT body_preview
        email_status status "DEFAULT queued"
        TIMESTAMPTZ sent_at
        TIMESTAMPTZ delivered_at
        TIMESTAMPTZ opened_at
        TEXT error_message
        INT retry_count "DEFAULT 0"
        INT max_retries "DEFAULT 3"
        TIMESTAMPTZ next_retry_at
        JSONB metadata "DEFAULT {}"
        TIMESTAMPTZ created_at
    }
```

---

### audit_logs
> Audit trail cho mọi thao tác quan trọng

```mermaid
erDiagram
    audit_logs {
        UUID id PK
        UUID user_id FK "→ profiles(id)"
        TEXT action "NOT NULL"
        TEXT table_name "NOT NULL"
        UUID record_id
        JSONB old_data
        JSONB new_data
        INET ip_address
        TEXT user_agent
        TEXT description
        TIMESTAMPTZ created_at "DEFAULT NOW()"
    }
```

---

## ENUMs

| Type | Values |
|------|--------|
| `user_role` | `student`, `admin`, `super_admin` |
| `course_status` | `draft`, `open`, `full`, `in_progress`, `completed`, `cancelled` |
| `enrollment_status` | `pending_payment`, `paid`, `confirmed`, `cancelled`, `refunded` |
| `payment_status` | `pending`, `processing`, `completed`, `failed`, `refunded`, `expired` |
| `payment_method` | `bank_transfer`, `qr_code`, `card`, `ewallet`, `manual` |
| `email_type` | `payment_confirmation`, `course_info`, `reminder`, `welcome`, `custom` |
| `email_status` | `queued`, `sending`, `sent`, `failed`, `bounced` |
| `resource_type` | `zalo_group`, `facebook_group`, `class_link`, `material`, `recording`, `other` |

---

## Indexes

| Table | Index | Type |
|-------|-------|------|
| profiles | email, role, is_active, created_at, tags | B-tree, GIN, Partial |
| courses | slug, status, is_published, is_featured, start_date | B-tree, Partial |
| course_resources | course_id, resource_type | B-tree |
| course_schedules | course_id, scheduled_at | B-tree |
| enrollments | user_id, course_id, status, (user_id+course_id) | B-tree, Composite, Partial |
| payments | enrollment_id, user_id, status, gateway_provider, gateway_tx_id, gateway_order_id | B-tree, Partial |
| email_logs | user_id, enrollment_id, status, (retry) | B-tree, Partial |
| audit_logs | user_id, table_name, action, (table+record) | B-tree, Composite |
