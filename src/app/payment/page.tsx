"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AlertTriangle, Clock, Copy, Check, X, ShieldCheck, HelpCircle, ArrowRight, Wallet, CheckCircle2, RotateCcw } from "lucide-react";

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

const Tape = ({ className = "" }) => (
  <div className={`absolute w-24 h-8 bg-yellow-200/90 border-4 border-gray-800 opacity-90 backdrop-blur-sm z-20 ${className}`} 
       style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }} />
);

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    // --- TẠM THỜI TẮT GỌI API ĐỂ TEST GIAO DIỆN ---
    setIsLoading(true);
    
    // Giả lập load data 1 giây
    setTimeout(() => {
      setPaymentData({
        amount: 449000,
        currency: 'VND',
        bank_name: 'Techcombank',
        account_number: '1903123456789',
        account_name: 'NGUYEN VAN A',
        transfer_content: 'CES K1 0901234567',
        qr_url: 'https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=https://zalo.me/g/aqdhoc234',
        expires_at: new Date(Date.now() + 15 * 60000).toISOString(),
        paid_at: null
      });
      setPaymentStatus('pending');
      setTimeRemaining(15 * 60); // 15 phút
      setIsLoading(false);
    }, 1000);

    /* Code thật đã bị ẩn:
    ...
    */
  }, []);

  useEffect(() => {
    if (!registrationId) {
      router.replace('/register');
      return;
    }

    fetchStatus();
    
    // Tạm thời tắt tự động Reload gọi lại API (gây nháy màn hình do Loading giả bị chạy lại)
    // pollIntervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [registrationId, fetchStatus, router]);

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

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleRetry = () => {
    router.replace('/register');
  };

  const handleCancel = async () => {
    if (!registrationId) {
      router.replace('/register');
      return;
    }

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    try {
      await fetch(`${API_BASE}/api/registrations/${registrationId}/cancel`, {
        method: 'POST',
      });
    } catch {
      // ignore
    }
    router.replace('/register');
  };

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-8 border-gray-800 border-t-[#ffcc00] rounded-full animate-spin shadow-[4px_4px_0px_#1f2937]" />
          <p className="text-gray-800 font-bold uppercase tracking-widest mt-4">Đang tải thông tin...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-[12px_12px_0px_#e94e77] relative"
        >
          <Tape className="-top-4 left-1/2 -translate-x-1/2 bg-[#ffcc00]" />
          <AlertTriangle className="text-[#e94e77] w-16 h-16 mx-auto mb-4 drop-shadow-[2px_2px_0px_#1f2937]" />
          <h2 className="text-gray-800 font-black text-2xl uppercase mb-2 mt-4">Có lỗi xảy ra</h2>
          <p className="text-gray-600 font-bold mb-8">{error}</p>
          <button onClick={handleRetry}
            className="w-full py-4 bg-[#2a3b8f] text-white font-black uppercase rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937] hover:translate-y-1 hover:shadow-none active:translate-y-2 transition-all flex justify-center items-center gap-2"
          >
            <RotateCcw strokeWidth={3} /> Đăng ký lại
          </button>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === 'cancelled') {
    return (
      <div className="flex-1 min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4 overflow-hidden pattern-cubes">
        <motion.div initial={{ opacity: 0, y: 50, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
          className="bg-white border-4 border-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-[12px_12px_0px_#1f2937] relative"
        >
          <Tape className="-top-4 right-10 bg-[#e94e77] rotate-6" />
          <X className="text-[#1f2937] w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full p-4 border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937]" />
          <h2 className="text-gray-800 font-black text-3xl uppercase mb-2 tracking-tight">Đã hủy!</h2>
          <p className="text-gray-600 font-bold mb-8">Quy trình đăng ký đã bị hủy bỏ bởi bạn. Mã QR không còn hiệu lực.</p>
          <button onClick={handleRetry}
            className="w-full py-4 bg-[#45b596] text-white font-black uppercase rounded-2xl border-4 border-gray-800 shadow-[6px_6px_0px_#1f2937] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1f2937] active:translate-y-1 active:shadow-none transition-all"
          >
            Đăng ký lại nhé!
          </button>
        </motion.div>
      </div>
    );
  }

  if (paymentStatus === 'expired') {
    return (
      <div className="flex-1 min-h-screen bg-[#fdfbf7] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-[#ffcc00] border-4 border-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-[12px_12px_0px_#2a3b8f] relative transform -rotate-1"
        >
          <Tape className="-top-4 left-6 bg-white -rotate-3" />
          <Clock className="text-gray-800 w-20 h-20 mx-auto mb-4 bg-white rounded-full p-4 border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937]" strokeWidth={2.5} />
          <h2 className="text-gray-900 font-black text-3xl uppercase mb-2 tracking-tight">Hết giờ!</h2>
          <p className="text-gray-800 font-bold mb-8 text-lg">Mã thanh toán của bạn đã hết hạn. Nhanh tay đăng ký lại nào!</p>
          <button onClick={handleRetry}
            className="w-full py-4 bg-white text-gray-900 font-black uppercase rounded-2xl border-4 border-gray-800 shadow-[6px_6px_0px_#1f2937] hover:-translate-y-1 transition-all"
          >
            Nhận mã QR mới
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 pt-12 pb-16 px-4 md:px-10 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />
      
      <div className="absolute top-20 right-[-5%] w-48 h-48 bg-[#45b596] rounded-full border-4 border-gray-800 z-0" />
      <div className="absolute bottom-10 left-[-5%] w-32 h-32 bg-[#e94e77] transform rotate-45 border-4 border-gray-800 z-0" />

      <div className="max-w-6xl w-full mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">

        {/* Cột trái (Quét mã) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="lg:col-span-8 flex flex-col gap-8"
        >
           {/* Progress Indicator */}
           <div className="mb-4 text-center md:text-left relative">
             <div className="inline-block bg-[#1f2937] text-white py-2 px-6 rounded-full text-sm font-black tracking-widest uppercase mb-4 border-2 border-gray-800 transform -rotate-1 shadow-[4px_4px_0px_#45b596]">
               Bước 2: Thanh toán
             </div>
             <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1.1] text-gray-800 drop-shadow-[3px_3px_0px_#ffcc00]">
               Quét QR Ngay!
             </h1>
          </div>

          <div className="bg-white border-4 border-gray-800 rounded-3xl p-6 md:p-8 shadow-[12px_12px_0px_#1f2937] flex flex-col gap-8 relative">
            <Tape className="-top-4 left-1/2 -translate-x-1/2 bg-[#ffcc00]" />
            
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl p-4 md:p-6 shadow-[inset_0_4px_0px_rgba(0,0,0,0.05)] gap-4">
              <div className="flex items-center gap-3">
                <Clock className="text-[#e94e77] w-8 h-8 animate-pulse" strokeWidth={3} />
                <span className="text-[#e94e77] font-black text-3xl font-mono tracking-wider">
                  {formatTimeRemaining(timeRemaining)}
                </span>
                <span className="text-gray-600 font-bold uppercase tracking-wider text-sm mt-1">Còn lại</span>
              </div>
              <div className="text-center md:text-right">
                 <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Số tiền (VNĐ)</p>
                 <p className="text-[#2a3b8f] font-black text-3xl md:text-4xl drop-shadow-[1px_1px_0px_#ffcc00] mt-1">
                   {paymentData ? formatCurrency(paymentData.amount) : '---'}
                 </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 justify-center mt-2">
              <div className="bg-[#ffcc00] p-4 rounded-3xl border-4 border-gray-800 shadow-[8px_8px_0px_#1f2937] transform rotate-1">
                {paymentData?.qr_url ? (
                  <div className="bg-white rounded-2xl p-2 border-4 border-gray-800">
                    <Image src={paymentData.qr_url} alt="VietQR Code" width={260} height={260} className="rounded-xl pointer-events-none select-none" unoptimized />
                  </div>
                ) : (
                  <div className="w-[260px] h-[260px] flex items-center justify-center bg-gray-100 rounded-2xl border-4 border-gray-800">
                    <span className="font-bold text-gray-500 uppercase">Đang tải QR...</span>
                  </div>
                )}
              </div>
              
              <div className="max-w-[200px] text-center md:text-left">
                 <h3 className="text-2xl font-black text-gray-800 uppercase leading-none mb-4">Tự động xác nhận!</h3>
                 <p className="font-bold text-gray-600 text-sm leading-relaxed">Mở app Ngân hàng, chọn quét QR và thanh toán. Hệ thống sẽ tự động chuyển trang khi nhận được tiền.</p>
              </div>
            </div>

            {/* Manual Info */}
            {paymentData && (
              <div className="bg-gray-100 border-4 border-gray-800 rounded-2xl p-5 mt-4 space-y-3 relative overflow-hidden text-sm md:text-base">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-bl-full pointer-events-none" />
                 
                 <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-3 relative z-10">
                    <span className="font-black text-gray-500 uppercase">Ngân hàng:</span>
                    <span className="font-bold text-gray-900 truncate max-w-[50%]">{paymentData.bank_name}</span>
                 </div>
                 
                 <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-3 relative z-10">
                    <span className="font-black text-gray-500 uppercase">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#e94e77] text-lg font-mono">{paymentData.account_number}</span>
                      <button onClick={() => handleCopy(paymentData.account_number, 'account')} className="bg-white p-2 border-2 border-gray-800 rounded-lg hover:bg-[#ffcc00] transition-colors" title="Sao chép">
                        {copied === 'account' ? <Check size={16} strokeWidth={3} className="text-green-600"/> : <Copy size={16} strokeWidth={3}/>}
                      </button>
                    </div>
                 </div>

                 <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-3 relative z-10">
                    <span className="font-black text-gray-500 uppercase">Chủ TK:</span>
                    <span className="font-bold text-gray-900 truncate max-w-[50%] uppercase">{paymentData.account_name}</span>
                 </div>

                 <div className="flex justify-between items-center pt-2 relative z-10">
                    <span className="font-black text-gray-500 uppercase">Nội dung CK:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black bg-[#45b596] text-white px-3 py-1 border-2 border-gray-800 rounded-lg text-lg uppercase tracking-wider">{paymentData.transfer_content}</span>
                      <button onClick={() => handleCopy(paymentData.transfer_content, 'content')} className="bg-white p-2 border-2 border-gray-800 rounded-lg hover:bg-[#ffcc00] transition-colors" title="Sao chép">
                        {copied === 'content' ? <Check size={16} strokeWidth={3} className="text-green-600"/> : <Copy size={16} strokeWidth={3}/>}
                      </button>
                    </div>
                 </div>
                 
                  <div className="mt-4 flex gap-2 items-start text-xs font-bold text-[#e94e77] bg-red-100 p-3 rounded-xl border-2 border-[#e94e77]">
                    <AlertTriangle size={18} className="shrink-0" />
                    Bắt buộc nhập chính xác NỘI DUNG CHUYỂN KHOẢN để hệ thống cập nhật tự động.
                  </div>

                  {/* NÚT TEST CHUYỂN TRANG */}
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
                    <button onClick={() => router.replace(`/success?id=${registrationId}`)} className="w-full bg-[#ffcc00] py-3 text-gray-900 border-4 border-gray-800 font-black uppercase rounded-xl hover:bg-[#e94e77] hover:text-white transition-colors">
                      [Test] Giả lập CK thành công
                    </button>
                  </div>
              </div>
            )}
          </div>

          <div className="text-center mt-2">
            <button onClick={() => setShowCancelConfirm(true)}
              className="font-bold text-gray-500 hover:text-[#e94e77] uppercase text-sm inline-flex items-center gap-1 transition-colors underline decoration-dashed underline-offset-4"
            >
              <X size={16} strokeWidth={3} /> Quay lại / Hủy đăng ký
            </button>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-[#45b596] border-4 border-gray-800 rounded-3xl p-6 shadow-[8px_8px_0px_#1f2937] transform rotate-1 mt-10 md:mt-32">
             <Tape className="-top-3 left-6 transform -rotate-3 bg-white" />
             <h3 className="text-white font-black text-2xl uppercase mb-6 flex items-center gap-2 tracking-tight drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
               <HelpCircle size={28} strokeWidth={3} /> Hướng Dẫn
             </h3>
             <ol className="space-y-4 font-bold text-gray-900 bg-white p-5 rounded-2xl border-4 border-gray-800 text-sm leading-relaxed">
               <li className="flex gap-2 items-start"><span className="text-[#e94e77] font-black text-lg leading-none">1.</span> Mở App Ngân Hàng hoặc Momo.</li>
               <li className="flex gap-2 items-start"><span className="text-[#e94e77] font-black text-lg leading-none">2.</span> Chọn quét mã QR.</li>
               <li className="flex gap-2 items-start"><span className="text-[#e94e77] font-black text-lg leading-none">3.</span> Kiểm tra kĩ số tiền.</li>
               <li className="flex gap-2 items-start"><span className="text-[#e94e77] font-black text-lg leading-none">4.</span> Bấm thanh toán, chờ vài giây hệ thống sẽ vác bạn vào thẳng lớp học!</li>
             </ol>
          </div>

           <div className="bg-white border-4 border-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-[4px_4px_0px_#ffcc00] transform -rotate-1">
             <ShieldCheck size={32} strokeWidth={2.5} className="text-[#2a3b8f]" />
             <span className="font-black text-gray-700 uppercase tracking-widest text-xs leading-tight">An Toàn tuyệt đối qua SePay & VietQR</span>
           </div>
        </motion.div>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9, y: 50, rotate: -2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.9, y: 50, rotate: -2 }}
              className="bg-white border-4 border-gray-800 rounded-[2rem] p-6 max-w-sm w-full shadow-[16px_16px_0px_#e94e77] text-center"
            >
              <Tape className="-top-4 -right-2 bg-[#ffcc00] rotate-12" />
              <div className="w-16 h-16 bg-[#e94e77] rounded-full border-4 border-gray-800 flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#1f2937]">
                 <X size={32} strokeWidth={3} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-2">Hủy Phiên Này?</h3>
              <p className="text-gray-600 font-bold mb-6 text-sm">Nếu bạn hủy, mã QR này sẽ mất tác dụng vĩnh viễn.</p>
              
              <div className="flex gap-3">
                <button onClick={() => setShowCancelConfirm(false)}
                   className="flex-1 py-3 bg-gray-200 text-gray-800 border-4 border-gray-800 rounded-xl font-black uppercase text-sm hover:bg-gray-300 transition-colors"
                >
                  Khoan đã
                </button>
                <button onClick={handleCancel}
                   className="flex-1 py-3 bg-[#e94e77] text-white border-4 border-gray-800 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_#1f2937] hover:translate-y-1 hover:shadow-none active:translate-y-2 transition-all"
                >
                  Xác nhận Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
       <div className="flex-1 min-h-screen bg-[#fdfbf7] flex items-center justify-center">
         <div className="w-16 h-16 border-8 border-gray-800 border-t-[#ffcc00] rounded-full animate-spin" />
       </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
