"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const POLL_INTERVAL_MS = 3000;

interface PaymentData {
  amount: number;
  currency: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  transfer_content: string;
  qr_url: string | null;
  expires_at: string;
  paid_at: string | null;
}

interface StatusResponse {
  registration_id: string;
  registration_status: string;
  payment_status: string;
  payment: PaymentData | null;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function formatTimeRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('id');

  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch registration status
  const fetchStatus = useCallback(async () => {
    if (!registrationId) return;

    try {
      const response = await fetch(`${API_BASE}/api/registrations/${registrationId}/status`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error?.message || 'Không thể tải thông tin thanh toán.');
        setIsLoading(false);
        return;
      }

      const result: StatusResponse = data.data;
      setPaymentData(result.payment);
      setPaymentStatus(result.payment_status);
      setIsLoading(false);

      // Handle completed payment
      if (result.payment_status === 'completed' || result.registration_status === 'paid') {
        // Stop polling
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        // Redirect to success
        router.push(`/success?id=${registrationId}`);
        return;
      }

      // Handle expired payment
      if (result.payment_status === 'expired' || result.registration_status === 'cancelled') {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setPaymentStatus('expired');
        return;
      }

      // Update countdown
      if (result.payment?.expires_at) {
        const expiresAt = new Date(result.payment.expires_at).getTime();
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeRemaining(remaining);
      }
    } catch {
      setError('Không thể kết nối máy chủ.');
      setIsLoading(false);
    }
  }, [registrationId, router]);

  // Initial fetch + setup polling
  useEffect(() => {
    if (!registrationId) {
      router.push('/register');
      return;
    }

    fetchStatus();

    // Start polling every 3 seconds
    pollIntervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [registrationId, fetchStatus, router]);

  // Countdown timer (client-side, separate from poll)
  useEffect(() => {
    if (timeRemaining <= 0) return;

    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          setPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [timeRemaining > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Copy to clipboard
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* Fallback — not essential */
    }
  };

  // Handle retry (create new registration)
  const handleRetry = () => {
    router.push('/register');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Đang tải thông tin thanh toán...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#101722]/60 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
          <h2 className="text-white text-xl font-bold mb-2">Có lỗi xảy ra</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
          >
            Đăng ký lại
          </button>
        </motion.div>
      </div>
    );
  }

  // Expired state
  if (paymentStatus === 'expired') {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#101722]/60 border border-amber-500/20 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-amber-400 text-4xl">timer_off</span>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Hết thời gian thanh toán</h2>
          <p className="text-slate-400 text-sm mb-6">
            Phiên thanh toán đã hết hạn. Vui lòng đăng ký lại để nhận mã QR mới.
          </p>
          <button
            onClick={handleRetry}
            className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(67,135,244,0.4)] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Đăng ký lại
          </button>
        </motion.div>
      </div>
    );
  }

  // Normal payment view
  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 md:px-10">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Main Payment Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 flex flex-col gap-8"
        >
          {/* Progress Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-white text-2xl font-bold">Thanh toán</h1>
                <p className="text-slate-400 text-sm mt-1">Bước 2: Quét QR chuyển khoản</p>
              </div>
              <span className="text-primary font-bold">50% Hoàn tất</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "25%" }}
                animate={{ width: "50%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(67,135,244,0.6)] rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-[#101722]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col gap-8">

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Quét mã QR để thanh toán</h3>
                <p className="text-slate-400 text-sm mt-1">Thanh toán tự động xác nhận sau khi chuyển khoản thành công</p>
              </div>
            </div>

            {/* Countdown + amount */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 animate-pulse">schedule</span>
                <span className="text-amber-400 font-bold text-lg font-mono tracking-wider">
                  {formatTimeRemaining(timeRemaining)}
                </span>
                <span className="text-slate-500 text-sm">còn lại</span>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Số tiền cần thanh toán</p>
                <p className="text-white text-2xl font-bold">
                  {paymentData ? formatCurrency(paymentData.amount) : '---'}
                  <span className="text-sm text-slate-400 ml-1">{paymentData?.currency || 'VND'}</span>
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-4 rounded-2xl">
                {paymentData?.qr_url ? (
                  <Image
                    src={paymentData.qr_url}
                    alt="VietQR Payment Code"
                    width={240}
                    height={240}
                    className="rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-60 h-60 flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-500 text-sm">QR không khả dụng</span>
                  </div>
                )}
              </div>
              <p className="text-slate-500 text-xs text-center">Mở app ngân hàng → Quét mã QR → Xác nhận thanh toán</p>
            </div>

            {/* Bank Details */}
            {paymentData && (
              <div className="bg-slate-900/50 border border-white/5 rounded-xl p-5 space-y-4">
                <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">account_balance</span>
                  Hoặc chuyển khoản thủ công
                </h4>

                {/* Bank Name */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Ngân hàng</span>
                  <span className="text-white font-semibold">{paymentData.bank_name}</span>
                </div>

                {/* Account Number */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold font-mono">{paymentData.account_number}</span>
                    <button
                      onClick={() => handleCopy(paymentData.account_number, 'account')}
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                      title="Sao chép"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copied === 'account' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Account Name */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Chủ tài khoản</span>
                  <span className="text-white font-semibold">{paymentData.account_name}</span>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-400 text-sm">Số tiền</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{formatCurrency(paymentData.amount)} {paymentData.currency}</span>
                    <button
                      onClick={() => handleCopy(String(paymentData.amount), 'amount')}
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                      title="Sao chép"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copied === 'amount' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Transfer Content */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 text-sm">Nội dung CK</span>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold font-mono text-sm">{paymentData.transfer_content}</span>
                    <button
                      onClick={() => handleCopy(paymentData.transfer_content, 'content')}
                      className="text-primary hover:text-primary/80 transition-colors p-1"
                      title="Sao chép"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {copied === 'content' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mt-2">
                  <span className="material-symbols-outlined text-amber-400 text-sm shrink-0 mt-0.5">warning</span>
                  <p className="text-amber-300 text-xs font-medium leading-relaxed">
                    Vui lòng nhập chính xác nội dung chuyển khoản để hệ thống tự động xác nhận. Sai nội dung có thể dẫn đến chậm trễ xử lý.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Back button */}
          <div className="flex justify-center">
            <Link href="/register" className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Quay lại trang đăng ký
            </Link>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          {/* Status indicator */}
          <div className="bg-[#101722]/60 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-50" />
              </div>
              <span className="text-white font-semibold text-sm">Đang chờ thanh toán</span>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                <span className="text-slate-300">Đăng ký thông tin</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-400 text-lg animate-pulse">pending</span>
                <span className="text-amber-400 font-medium">Thanh toán</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-600 text-lg">radio_button_unchecked</span>
                <span className="text-slate-500">Hoàn tất</span>
              </li>
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 rounded-xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Hướng dẫn thanh toán
            </h4>
            <ol className="space-y-3 text-sm text-slate-400 list-decimal list-inside">
              <li>Mở ứng dụng ngân hàng trên điện thoại</li>
              <li>Chọn <span className="text-white font-medium">Quét QR</span> hoặc <span className="text-white font-medium">Chuyển khoản</span></li>
              <li>Quét mã QR hoặc nhập thông tin chuyển khoản</li>
              <li>Nhập đúng <span className="text-amber-400 font-medium">nội dung chuyển khoản</span></li>
              <li>Xác nhận thanh toán và chờ hệ thống tự động xác nhận</li>
            </ol>
          </div>

          {/* Security note */}
          <div className="bg-slate-900/30 border border-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="material-symbols-outlined text-sm">shield</span>
              <span>Giao dịch bảo mật bởi SePay & VietQR</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
