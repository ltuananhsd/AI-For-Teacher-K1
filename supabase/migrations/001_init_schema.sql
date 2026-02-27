-- ============================================================================
-- CES GLOBAL - SUPABASE DATABASE SCHEMA
-- Production-Ready | CRM-Ready
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";  -- Case-insensitive text for email

-- ============================================================================
-- 2. CUSTOM TYPES (ENUMs)
-- ============================================================================
CREATE TYPE user_role AS ENUM ('student', 'admin', 'super_admin');
CREATE TYPE course_status AS ENUM ('draft', 'open', 'full', 'in_progress', 'completed', 'cancelled');
CREATE TYPE enrollment_status AS ENUM ('pending_payment', 'paid', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'expired');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'qr_code', 'card', 'ewallet', 'manual');
CREATE TYPE email_type AS ENUM ('payment_confirmation', 'course_info', 'reminder', 'welcome', 'custom');
CREATE TYPE email_status AS ENUM ('queued', 'sending', 'sent', 'failed', 'bounced');
CREATE TYPE resource_type AS ENUM ('zalo_group', 'facebook_group', 'class_link', 'material', 'recording', 'other');

-- ============================================================================
-- 3. CORE TABLES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 3.1 PROFILES (extends auth.users, auto-created on Google sign-up)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           CITEXT UNIQUE NOT NULL,
    full_name       TEXT,
    phone           TEXT UNIQUE,
    avatar_url      TEXT,
    role            user_role NOT NULL DEFAULT 'student',
    date_of_birth   DATE,
    address         TEXT,
    city            TEXT,
    company         TEXT,
    job_title       TEXT,
    -- CRM fields
    notes           TEXT,                       -- Ghi chú nội bộ admin
    tags            TEXT[] DEFAULT '{}',         -- Tags cho phân loại
    lead_source     TEXT,                       -- Nguồn đến: google, facebook, referral...
    metadata        JSONB DEFAULT '{}'::JSONB,  -- Flexible extension field
    -- Status
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{9,15}$')
);

COMMENT ON TABLE profiles IS 'Thông tin học viên, tự động tạo khi đăng nhập Google';
COMMENT ON COLUMN profiles.metadata IS 'Trường mở rộng JSONB, dùng cho CRM custom fields';
COMMENT ON COLUMN profiles.tags IS 'Tags phân loại học viên: VIP, returning, etc.';

-- ---------------------------------------------------------------------------
-- 3.2 COURSE CATEGORIES
-- ---------------------------------------------------------------------------
CREATE TABLE course_categories (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    slug            TEXT UNIQUE NOT NULL,
    description     TEXT,
    icon_url        TEXT,
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE course_categories IS 'Danh mục khóa học: IELTS, TOEIC, Business English, etc.';

-- ---------------------------------------------------------------------------
-- 3.3 COURSES
-- ---------------------------------------------------------------------------
CREATE TABLE courses (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                TEXT UNIQUE NOT NULL,
    title               TEXT NOT NULL,
    subtitle            TEXT,
    description         TEXT,
    short_description   TEXT,                   -- Cho card preview
    thumbnail_url       TEXT,
    cover_image_url     TEXT,
    -- Pricing
    price               DECIMAL(12,2) NOT NULL,
    original_price      DECIMAL(12,2),          -- Giá gốc (nếu đang giảm giá)
    currency            TEXT NOT NULL DEFAULT 'VND',
    -- Instructor
    instructor_name     TEXT,
    instructor_bio      TEXT,
    instructor_avatar   TEXT,
    -- Capacity
    max_students        INT,                    -- NULL = unlimited
    current_students    INT NOT NULL DEFAULT 0,
    -- Status & Schedule
    status              course_status NOT NULL DEFAULT 'draft',
    start_date          DATE,
    end_date            DATE,
    duration_hours      INT,
    registration_deadline DATE,
    -- Flags
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    is_published        BOOLEAN NOT NULL DEFAULT FALSE,
    -- SEO
    meta_title          TEXT,
    meta_description    TEXT,
    -- Flexible
    metadata            JSONB DEFAULT '{}'::JSONB,
    -- Audit
    created_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraints
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_original_price CHECK (original_price IS NULL OR original_price >= price),
    CONSTRAINT valid_capacity CHECK (max_students IS NULL OR max_students > 0),
    CONSTRAINT valid_student_count CHECK (current_students >= 0),
    CONSTRAINT valid_date_range CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date)
);

COMMENT ON TABLE courses IS 'Khóa học, support đa khóa và CRM quản lý';

-- ---------------------------------------------------------------------------
-- 3.4 COURSE-CATEGORY JUNCTION (Many-to-Many)
-- ---------------------------------------------------------------------------
CREATE TABLE course_category_map (
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    category_id     UUID NOT NULL REFERENCES course_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, category_id)
);

-- ---------------------------------------------------------------------------
-- 3.5 COURSE RESOURCES (Links Zalo, FB, Class — chỉ visible sau thanh toán)
-- ---------------------------------------------------------------------------
CREATE TABLE course_resources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    resource_type   resource_type NOT NULL,
    title           TEXT NOT NULL,
    url             TEXT NOT NULL,
    description     TEXT,
    display_order   INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE course_resources IS 'Link Zalo, Facebook group, class link — CHỈ hiển thị cho học viên đã thanh toán';

-- ---------------------------------------------------------------------------
-- 3.6 COURSE SCHEDULES
-- ---------------------------------------------------------------------------
CREATE TABLE course_schedules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id       UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,              -- "Buổi 1: Giới thiệu"
    description     TEXT,
    scheduled_at    TIMESTAMPTZ,               -- Thời gian buổi học
    duration_minutes INT,
    location        TEXT,                       -- Online / Offline address
    display_order   INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE course_schedules IS 'Lịch học chi tiết từng buổi';

-- ---------------------------------------------------------------------------
-- 3.7 ENROLLMENTS (Đăng ký khóa học)
-- ---------------------------------------------------------------------------
CREATE TABLE enrollments (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    course_id           UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    status              enrollment_status NOT NULL DEFAULT 'pending_payment',
    -- Timestamps
    enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    cancellation_reason TEXT,
    -- CRM
    notes               TEXT,
    metadata            JSONB DEFAULT '{}'::JSONB,
    -- Audit
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Unique: mỗi user chỉ đăng ký 1 lần cho 1 khóa
    CONSTRAINT unique_enrollment UNIQUE (user_id, course_id)
);

COMMENT ON TABLE enrollments IS 'Bản ghi đăng ký khóa học, UNIQUE(user_id, course_id)';

-- ---------------------------------------------------------------------------
-- 3.8 PAYMENTS (Multi-gateway: Sepay, MoMo, VNPay, Stripe, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE payments (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id           UUID NOT NULL REFERENCES enrollments(id) ON DELETE RESTRICT,
    user_id                 UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    -- Amount
    amount                  DECIMAL(12,2) NOT NULL,
    currency                TEXT NOT NULL DEFAULT 'VND',
    -- Payment info
    payment_method          payment_method,
    status                  payment_status NOT NULL DEFAULT 'pending',
    -- Gateway (generic, hỗ trợ nhiều cổng thanh toán)
    gateway_provider        TEXT,                -- 'sepay', 'momo', 'vnpay', 'stripe', 'manual'
    gateway_transaction_id  TEXT,                -- ID giao dịch từ gateway
    gateway_order_id        TEXT,                -- Order ID gửi lên gateway
    gateway_reference       TEXT,                -- Mã tham chiếu
    gateway_raw_data        JSONB,               -- Toàn bộ response/IPN từ gateway
    -- URLs (QR, redirect, etc.)
    checkout_url            TEXT,                -- URL thanh toán / QR code
    -- Lifecycle timestamps
    expires_at              TIMESTAMPTZ,         -- Hết hạn thanh toán
    paid_at                 TIMESTAMPTZ,
    failed_at               TIMESTAMPTZ,
    failure_reason          TEXT,
    refunded_at             TIMESTAMPTZ,
    refund_amount           DECIMAL(12,2),
    -- Security / Audit
    ip_address              INET,
    user_agent              TEXT,
    metadata                JSONB DEFAULT '{}'::JSONB,
    -- Timestamps
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Constraints
    CONSTRAINT valid_amount CHECK (amount > 0),
    CONSTRAINT valid_refund CHECK (refund_amount IS NULL OR (refund_amount > 0 AND refund_amount <= amount))
);

COMMENT ON TABLE payments IS 'Giao dịch thanh toán đa cổng (Sepay, MoMo, VNPay, Stripe, manual...)';

-- ---------------------------------------------------------------------------
-- 3.9 EMAIL TEMPLATES
-- ---------------------------------------------------------------------------
CREATE TABLE email_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_key    TEXT UNIQUE NOT NULL,        -- 'payment_success', 'course_info', etc.
    name            TEXT NOT NULL,
    subject         TEXT NOT NULL,               -- Subject line, support {{variables}}
    body_html       TEXT NOT NULL,               -- HTML body, support {{variables}}
    body_text       TEXT,                        -- Plain text fallback
    email_type      email_type NOT NULL,
    variables       JSONB DEFAULT '[]'::JSONB,   -- Định nghĩa biến template: [{"name":"student_name","required":true}]
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE email_templates IS 'Template email có thể tùy chỉnh theo từng khóa học';

-- ---------------------------------------------------------------------------
-- 3.10 EMAIL LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE email_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    enrollment_id   UUID REFERENCES enrollments(id) ON DELETE SET NULL,
    template_id     UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    email_type      email_type NOT NULL,
    recipient_email TEXT NOT NULL,
    subject         TEXT NOT NULL,
    body_preview    TEXT,                        -- First 200 chars for preview
    status          email_status NOT NULL DEFAULT 'queued',
    -- Delivery
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    opened_at       TIMESTAMPTZ,
    -- Error handling
    error_message   TEXT,
    retry_count     INT NOT NULL DEFAULT 0,
    max_retries     INT NOT NULL DEFAULT 3,
    next_retry_at   TIMESTAMPTZ,
    -- Metadata
    metadata        JSONB DEFAULT '{}'::JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE email_logs IS 'Log gửi email với retry mechanism';

-- ---------------------------------------------------------------------------
-- 3.11 AUDIT LOGS
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,               -- 'create', 'update', 'delete', 'login', 'payment'
    table_name      TEXT NOT NULL,
    record_id       UUID,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    description     TEXT,                        -- Human-readable description
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Audit trail cho mọi thao tác quan trọng — compliance ready';

-- Create audit_logs partition by month for performance (optional, large scale)
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- 4. INDEXES (Performance Optimization)
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_active ON profiles(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_tags ON profiles USING GIN(tags);

-- Courses
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_is_published ON courses(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_courses_is_featured ON courses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_courses_start_date ON courses(start_date);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- Course Resources
CREATE INDEX idx_course_resources_course_id ON course_resources(course_id);
CREATE INDEX idx_course_resources_type ON course_resources(resource_type);

-- Course Schedules
CREATE INDEX idx_course_schedules_course_id ON course_schedules(course_id);
CREATE INDEX idx_course_schedules_scheduled_at ON course_schedules(scheduled_at);

-- Enrollments
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_enrollments_active ON enrollments(status)
    WHERE status NOT IN ('cancelled', 'refunded');

-- Payments
CREATE INDEX idx_payments_enrollment_id ON payments(enrollment_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway_provider ON payments(gateway_provider);
CREATE INDEX idx_payments_gateway_tx ON payments(gateway_transaction_id);
CREATE INDEX idx_payments_gateway_order ON payments(gateway_order_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_pending ON payments(status, expires_at)
    WHERE status = 'pending';

-- Email Logs
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_enrollment_id ON email_logs(enrollment_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_retry ON email_logs(status, next_retry_at)
    WHERE status = 'failed' AND retry_count < 3;

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id);

-- ============================================================================
-- 5. TRIGGER: Auto update `updated_at`
-- ============================================================================
-- Đây là trigger duy nhất trong DB. Mọi business logic khác
-- (update enrollment, đếm student, xử lý IPN, gửi email...)
-- đều được xử lý ở tầng backend để dễ kiểm soát.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_categories_updated_at
    BEFORE UPDATE ON course_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_course_resources_updated_at
    BEFORE UPDATE ON course_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_enrollments_updated_at
    BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 6. SEED DATA: Default Email Templates
-- ============================================================================

INSERT INTO email_templates (template_key, name, subject, body_html, body_text, email_type, variables) VALUES
(
    'payment_success',
    'Xác nhận thanh toán thành công',
    'CES Global - Xác nhận thanh toán khóa {{course_title}}',
    '<h2>Xin chào {{student_name}},</h2>
<p>Cảm ơn bạn đã đăng ký và thanh toán thành công!</p>
<h3>Thông tin thanh toán:</h3>
<ul>
<li><strong>Khóa học:</strong> {{course_title}}</li>
<li><strong>Số tiền:</strong> {{amount}} {{currency}}</li>
<li><strong>Mã giao dịch:</strong> {{transaction_id}}</li>
<li><strong>Thời gian:</strong> {{paid_at}}</li>
</ul>
<p>Bạn sẽ nhận được email thông tin khóa học ngay sau đây.</p>
<p>Trân trọng,<br>CES Global Team</p>',
    'Xin chào {{student_name}}, Cảm ơn bạn đã thanh toán thành công khóa {{course_title}}. Số tiền: {{amount}} {{currency}}. Mã GD: {{transaction_id}}.',
    'payment_confirmation',
    '[{"name":"student_name","required":true},{"name":"course_title","required":true},{"name":"amount","required":true},{"name":"currency","required":true},{"name":"transaction_id","required":true},{"name":"paid_at","required":true}]'::JSONB
),
(
    'course_info',
    'Thông tin khóa học',
    'CES Global - Chào mừng bạn đến với khóa {{course_title}}!',
    '<h2>Chào mừng {{student_name}}! 🎉</h2>
<p>Chúc mừng bạn đã chính thức tham gia khóa học <strong>{{course_title}}</strong>!</p>
<h3>📅 Thông tin khóa học:</h3>
<ul>
<li><strong>Giảng viên:</strong> {{instructor_name}}</li>
<li><strong>Ngày bắt đầu:</strong> {{start_date}}</li>
<li><strong>Thời lượng:</strong> {{duration}}</li>
</ul>
<h3>🔗 Link tham gia:</h3>
<ul>
{{#each resources}}
<li><strong>{{title}}:</strong> <a href="{{url}}">{{url}}</a></li>
{{/each}}
</ul>
<p>Nếu cần hỗ trợ, vui lòng liên hệ hotline: {{support_phone}}</p>
<p>Chúc bạn học tập hiệu quả!<br>CES Global Team</p>',
    'Chào mừng {{student_name}} đến khóa {{course_title}}! Giảng viên: {{instructor_name}}. Ngày BĐ: {{start_date}}.',
    'course_info',
    '[{"name":"student_name","required":true},{"name":"course_title","required":true},{"name":"instructor_name","required":true},{"name":"start_date","required":true},{"name":"duration","required":false},{"name":"resources","required":true,"type":"array"},{"name":"support_phone","required":false}]'::JSONB
),
(
    'welcome',
    'Chào mừng thành viên mới',
    'Chào mừng bạn đến CES Global! 🌟',
    '<h2>Xin chào {{student_name}},</h2>
<p>Cảm ơn bạn đã tạo tài khoản tại CES Global!</p>
<p>Bạn có thể khám phá các khóa học của chúng tôi tại: <a href="{{courses_url}}">Danh sách khóa học</a></p>
<p>Trân trọng,<br>CES Global Team</p>',
    'Chào {{student_name}}, cảm ơn bạn đã tạo tài khoản CES Global!',
    'welcome',
    '[{"name":"student_name","required":true},{"name":"courses_url","required":true}]'::JSONB
);

-- ============================================================================
-- DONE! Schema chỉ chứa tables + indexes + updated_at trigger.
-- Mọi business logic (auth, payment, enrollment, email) ở backend.
-- ============================================================================
