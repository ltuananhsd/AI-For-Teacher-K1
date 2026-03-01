# Database Schema (CRM Admin)

This document provides a detailed overview of the database schema for the CES Global platform. It is intended for use by developers building the CRM Admin dashboard. The schema utilizes PostgreSQL (via Supabase) and is designed to support course management, enrollments, payments, and automated email operations.

## Architecture Overview

Here is a high-level Entity-Relationship (ER) diagram illustrating the core relationships between tables:

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

## Detailed Table Structures

### 1. `profiles`
Stores student information and serves as the central point for CRM activities. It has a 1:1 relationship with Supabase's built-in `auth.users` table and is automatically created upon Google login.

```mermaid
erDiagram
    profiles {
        UUID id PK "Liên kết 1:1 với auth.users(id)"
        CITEXT email UK "Bắt buộc, tự kiểm tra định dạng"
        TEXT full_name 
        TEXT phone UK "Tự kiểm tra định dạng"
        TEXT avatar_url 
        user_role role "Mặc định: 'student' (student | admin | super_admin)"
        DATE date_of_birth 
        TEXT address 
        TEXT city 
        TEXT company 
        TEXT job_title 
        TEXT notes "Ghi chú nội bộ dành cho Admin (CRM)"
        TEXT_ARRAY tags "Mặc định: {}. Phân loại (vd: VIP, returning...)"
        TEXT lead_source "Nguồn khách (google, facebook, referral...)"
        JSONB metadata "Mặc định: {}. Dùng cho các trường tùy chỉnh CRM"
        BOOLEAN is_active "Mặc định: TRUE"
        BOOLEAN email_verified "Mặc định: FALSE"
        TIMESTAMPTZ created_at "Mặc định: NOW()"
        TIMESTAMPTZ updated_at "Mặc định: NOW()"
        TIMESTAMPTZ last_login_at 
    }
```

---

### 2. `course_categories`
Manages course categories (e.g., IELTS, TOEIC, Business English).

```mermaid
erDiagram
    course_categories {
        UUID id PK 
        TEXT name "Bắt buộc"
        TEXT slug UK "Bắt buộc"
        TEXT description 
        TEXT icon_url 
        INT display_order "Mặc định: 0"
        BOOLEAN is_active "Mặc định: TRUE"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 3. `courses`
Core table for course information. Includes fields for multi-session support, promotions, SEO, and capacity management.

```mermaid
erDiagram
    courses {
        UUID id PK 
        TEXT slug UK "Bắt buộc"
        TEXT title "Bắt buộc"
        TEXT subtitle 
        TEXT description 
        TEXT short_description "Dùng cho thẻ (card) xem trước"
        TEXT thumbnail_url 
        TEXT cover_image_url 
        DECIMAL price "Bắt buộc, >= 0"
        DECIMAL original_price "Giá gốc (khi đang giảm giá)"
        TEXT currency "Mặc định: 'VND'"
        TEXT instructor_name 
        TEXT instructor_bio 
        TEXT instructor_avatar 
        INT max_students "NULL = không giới hạn"
        INT current_students "Mặc định: 0"
        course_status status "Mặc định: 'draft' (draft | open | full | in_progress | completed | cancelled)"
        DATE start_date 
        DATE end_date 
        INT duration_hours 
        DATE registration_deadline 
        BOOLEAN is_featured "Mặc định: FALSE"
        BOOLEAN is_published "Mặc định: FALSE"
        TEXT meta_title "Dùng cho SEO"
        TEXT meta_description "Dùng cho SEO"
        JSONB metadata "Mặc định: {}"
        UUID created_by "Khóa ngoại → profiles(id)"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 4. `course_category_map`
Junction table mapping the Many-to-Many (N:N) relationship between `courses` and `course_categories`.

```mermaid
erDiagram
    course_category_map {
        UUID course_id PK_FK "→ courses(id) CASCADE"
        UUID category_id PK_FK "→ course_categories(id) CASCADE"
    }
```

---

### 5. `course_resources`
Contains access materials such as Zalo group links, Facebook groups, class links, etc. **IMPORTANT: these are ONLY visible to students who have successfully paid.**

```mermaid
erDiagram
    course_resources {
        UUID id PK 
        UUID course_id FK "→ courses(id) CASCADE"
        resource_type resource_type "Bắt buộc: zalo_group | facebook_group | class_link | material | recording | other"
        TEXT title "Bắt buộc"
        TEXT url "Bắt buộc"
        TEXT description 
        INT display_order "Mặc định: 0"
        BOOLEAN is_active "Mặc định: TRUE"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 6. `course_schedules`
Maintains the detailed day-by-day or session-by-session schedule for each course.

```mermaid
erDiagram
    course_schedules {
        UUID id PK 
        UUID course_id FK "→ courses(id) CASCADE"
        TEXT title "Bắt buộc (vd: Buổi 1: Giới thiệu)"
        TEXT description 
        TIMESTAMPTZ scheduled_at "Thời gian bắt đầu buổi học"
        INT duration_minutes 
        TEXT location "Mô tả nơi học (Online / Offline...)"
        INT display_order "Mặc định: 0"
        TIMESTAMPTZ created_at 
    }
```

---

### 7. `enrollments`
Records a student's registration for a specific course. A constraint ensures a `UNIQUE(user_id, course_id)` pairing (a student can only register for a specific course once).

```mermaid
erDiagram
    enrollments {
        UUID id PK 
        UUID user_id FK "→ profiles(id) RESTRICT"
        UUID course_id FK "→ courses(id) RESTRICT"
        enrollment_status status "Mặc định: 'pending_payment' (pending_payment | paid | confirmed | cancelled | refunded)"
        TIMESTAMPTZ enrolled_at "Mặc định: NOW()"
        TIMESTAMPTZ confirmed_at 
        TIMESTAMPTZ cancelled_at 
        TEXT cancellation_reason 
        TEXT notes "Ghi chú nội bộ CRM"
        JSONB metadata "Mặc định: {}"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 8. `payments`
Tracks multi-gateway payment transactions (e.g., Sepay, MoMo, VNPay, Stripe, Manual). 

```mermaid
erDiagram
    payments {
        UUID id PK 
        UUID enrollment_id FK "→ enrollments(id) RESTRICT"
        UUID user_id FK "→ profiles(id) RESTRICT"
        DECIMAL amount "Bắt buộc, > 0"
        TEXT currency "Mặc định: 'VND'"
        payment_method payment_method "bank_transfer | qr_code | card | ewallet | manual"
        payment_status status "Mặc định: 'pending' (pending | processing | completed | failed | refunded | expired)"
        TEXT gateway_provider "sepay | momo | vnpay | stripe | manual..."
        TEXT gateway_transaction_id "ID giao dịch từ cổng thanh toán"
        TEXT gateway_order_id "Order ID gửi lên cổng thanh toán"
        TEXT gateway_reference "Mã tham chiếu"
        JSONB gateway_raw_data "Toàn bộ response/IPN từ gateway"
        TEXT checkout_url "Link thanh toán / QR Code"
        TIMESTAMPTZ expires_at "Thời hạn nộp tiền"
        TIMESTAMPTZ paid_at 
        TIMESTAMPTZ failed_at 
        TEXT failure_reason 
        TIMESTAMPTZ refunded_at 
        DECIMAL refund_amount "Phải <= amount"
        INET ip_address "Bảo mật/Audit"
        TEXT user_agent "Bảo mật/Audit"
        JSONB metadata "Mặc định: {}"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 9. `email_templates`
Stores customizable email templates supporting `{{variables}}` substitution.

```mermaid
erDiagram
    email_templates {
        UUID id PK 
        TEXT template_key UK "Bắt buộc (vd: payment_success, course_info)"
        TEXT name "Bắt buộc"
        TEXT subject "Bắt buộc"
        TEXT body_html "Bắt buộc"
        TEXT body_text 
        email_type email_type "Bắt buộc: payment_confirmation | course_info | reminder | welcome | custom"
        JSONB variables "Mặc định: []. Định nghĩa biến yêu cầu của template"
        BOOLEAN is_active "Mặc định: TRUE"
        TIMESTAMPTZ created_at 
        TIMESTAMPTZ updated_at 
    }
```

---

### 10. `email_logs`
Tracks sent emails, incorporating a retry mechanism for failed deliveries.

```mermaid
erDiagram
    email_logs {
        UUID id PK 
        UUID user_id FK "→ profiles(id)"
        UUID enrollment_id FK "→ enrollments(id)"
        UUID template_id FK "→ email_templates(id)"
        email_type email_type "Bắt buộc"
        TEXT recipient_email "Bắt buộc"
        TEXT subject "Bắt buộc"
        TEXT body_preview "Lưu 200 ký tự đầu làm bản xem trước"
        email_status status "Mặc định: 'queued' (queued | sending | sent | failed | bounced)"
        TIMESTAMPTZ sent_at 
        TIMESTAMPTZ delivered_at 
        TIMESTAMPTZ opened_at 
        TEXT error_message 
        INT retry_count "Mặc định: 0"
        INT max_retries "Mặc định: 3"
        TIMESTAMPTZ next_retry_at 
        JSONB metadata "Mặc định: {}"
        TIMESTAMPTZ created_at 
    }
```

---

### 11. `audit_logs`
Audit trail of important user and standard CRM operations. Provides a history of changes for compliance.

```mermaid
erDiagram
    audit_logs {
        UUID id PK 
        UUID user_id FK "→ profiles(id)"
        TEXT action "Bắt buộc (create, update, delete, login, payment...)"
        TEXT table_name "Bắt buộc"
        UUID record_id 
        JSONB old_data 
        JSONB new_data 
        INET ip_address 
        TEXT user_agent 
        TEXT description "Mô tả dễ đọc (Human-readable)"
        TIMESTAMPTZ created_at "Mặc định: NOW()"
    }
```

---

## Enumerable Types (ENUMs)

These custom PostgreSQL datatypes strictly define the allowed values for specific table states and rules.

| Enum Type             | Allowed Values                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `user_role`           | `student`, `admin`, `super_admin`                                                                   |
| `course_status`       | `draft`, `open`, `full`, `in_progress`, `completed`, `cancelled`                                    |
| `enrollment_status`   | `pending_payment`, `paid`, `confirmed`, `cancelled`, `refunded`                                     |
| `payment_status`      | `pending`, `processing`, `completed`, `failed`, `refunded`, `expired`                               |
| `payment_method`      | `bank_transfer`, `qr_code`, `card`, `ewallet`, `manual`                                             |
| `email_type`          | `payment_confirmation`, `course_info`, `reminder`, `welcome`, `custom`                              |
| `email_status`        | `queued`, `sending`, `sent`, `failed`, `bounced`                                                    |
| `resource_type`       | `zalo_group`, `facebook_group`, `class_link`, `material`, `recording`, `other`                      |

---

## Technical Notes for CRM Developers

1. **Triggers:** A PostgreSQL trigger automatically sets the `updated_at` column to `NOW()` upon row modification.
2. **Business Logic Location:** Be aware that all business logic (processing payments, triggering emails, tracking capacity) is governed by the Node.js/Express backend, **not** via complex database triggers. 
3. **Capacity Planning:** The `enrollments` table forces a UNIQUE constraint on the combination of `user_id` & `course_id`. A user can enroll in a course once. 
4. **CRM Functionality:** Utilize the `metadata`, `tags`, `notes`, and `audit_logs` fields/tables heavily when implementing administrative features in the CRM dashboard. 
