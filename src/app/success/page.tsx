"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, Sparkles, Send, MapPin, Users, TicketCheck } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://lms-api.cesglobal.com.vn";

interface PaymentInfo {
  amount: number;
  currency: string;
  paid_at: string | null;
  transfer_content: string;
}

const Tape = ({ className = "" }) => (
  <div className={`absolute w-24 h-8 bg-[#e94e77]/90 border-4 border-gray-800 opacity-90 backdrop-blur-sm z-20 ${className}`}
    style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }} />
);

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 min-h-[80vh] bg-[#fdfbf7] flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-gray-800 border-t-[#ffcc00] rounded-full animate-spin shadow-[4px_4px_0px_#1f2937]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get('id');
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!enrollmentId) {
      setIsVerified(true);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/enrollments/${enrollmentId}/status`);
        const data = await response.json();
        if (response.ok && data.data) {
          const result = data.data;
          if (result.payment_status === 'completed' || result.enrollment_status === 'paid') {
            setPaymentInfo(result.payment);
          }
        }
      } catch {
        /* Non-critical — page works without verified data */
      }
      setIsVerified(true);
    };

    verifyPayment();
  }, [enrollmentId]);

  if (!isVerified) {
    return (
      <div className="flex-1 min-h-[80vh] bg-[#fdfbf7] flex items-center justify-center">
        <div className="w-16 h-16 border-8 border-gray-800 border-t-[#ffcc00] rounded-full animate-spin shadow-[4px_4px_0px_#1f2937]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20 mb-[50px] bg-[#fdfbf7] font-sans relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />

      {/* Abstract Decor */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#ffcc00] rounded-full border-4 border-gray-800" />
      <div className="absolute top-40 left-10 w-24 h-24 bg-[#45b596] transform rotate-45 border-4 border-gray-800" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Messaging (Left) */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
          className="lg:col-span-7 flex flex-col space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#ffcc00] border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937] text-gray-900 px-6 py-3 rounded-full w-fit transform -rotate-2">
            <Check size={24} strokeWidth={3} className="text-[#2a3b8f]" />
            <span className="text-sm md:text-base font-black tracking-widest uppercase">Thanh toán hoàn tất!</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-gray-800 uppercase leading-[1.3] drop-shadow-[4px_4px_0px_#e94e77]">
              CHÀO MỪNG ĐẾN VỚI <span className="text-[#2a3b8f] tracking-tight border-b-8 border-[#ffcc00] mt-2 xl:mt-0 xl:inline-block">KHOÁ HỌC!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-bold max-w-lg leading-relaxed mt-4 bg-white border-4 border-gray-800 p-4 rounded-xl shadow-[4px_4px_0px_#1f2937] transform rotate-1">
              Tuyệt vời quá thầy cô ơi! 🚀 Vé tham gia đã chính thức nằm trong tay. Một hành trình bứt phá công việc giảng dạy với AI đã rục rịch khởi hành!
            </p>
          </div>

          {/* Payment receipt */}
          {paymentInfo && paymentInfo.paid_at && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#45b596] border-4 border-gray-800 rounded-3xl p-6 shadow-[8px_8px_0px_#1f2937] space-y-3 relative transform -rotate-1 max-w-lg w-full"
            >

              <div className="flex items-center gap-3 text-white text-lg font-black uppercase tracking-wider bg-black/20 p-3 rounded-xl mb-4 border-4 border-gray-800">
                <TicketCheck strokeWidth={3} />
                Vé đã kích hoạt
              </div>
              <div className="bg-white border-4 border-gray-800 rounded-2xl p-4 font-bold text-gray-800 flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-gray-300">
                  <span className="uppercase text-gray-500 text-xs font-black">Số tiền</span>
                  <span className="text-lg text-[#e94e77]">{new Intl.NumberFormat('vi-VN').format(paymentInfo.amount)} {paymentInfo.currency}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-gray-300">
                  <span className="uppercase text-gray-500 text-xs font-black">Thời gian xử lý</span>
                  <span>{new Date(paymentInfo.paid_at).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase text-gray-500 text-xs font-black">Mã vé (Giao dịch)</span>
                  <span className="font-mono text-[#2a3b8f] uppercase bg-blue-50 px-2 py-1 rounded border-2 border-gray-800">{paymentInfo.transfer_content}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-8 max-w-lg">
            <a href="https://zalo.me/g/grybmv805" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#e94e77] text-white px-8 py-5 border-4 border-gray-800 rounded-2xl font-black text-xl uppercase tracking-wider hover:-translate-y-1 shadow-[6px_6px_0px_#1f2937] hover:shadow-[8px_8px_0px_#1f2937] active:translate-y-2 active:shadow-none transition-all w-full text-center whitespace-nowrap"
            >
              <Send size={24} strokeWidth={3} /> VÀO ZALO NGAY
            </a>
            <Link href="/" className="flex items-center justify-center gap-3 bg-white text-gray-800 px-8 py-5 border-4 border-gray-800 rounded-2xl font-black text-lg uppercase tracking-wider hover:-translate-y-1 shadow-[6px_6px_0px_#1f2937] hover:shadow-[8px_8px_0px_#1f2937] active:translate-y-2 active:shadow-none transition-all w-full md:w-auto text-center">
              TRANG CHỦ
            </Link>
          </div>
        </motion.div>

        {/* QR & Community Card (Right) */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center mt-10 lg:mt-0"
        >
          <div className="bg-white border-4 border-gray-800 rounded-[2rem] p-8 md:p-10 flex flex-col items-center text-center shadow-[16px_16px_0px_#2a3b8f] relative overflow-hidden transform rotate-2 max-w-sm w-full">
            <Tape className="-top-4 right-8 bg-[#45b596] -rotate-6" />

            <div className="w-16 h-16 bg-[#2a3b8f] rounded-full border-4 border-gray-800 flex items-center justify-center absolute -top-8 -left-8 shadow-[4px_4px_0px_#ffcc00] z-20">
              <Star className="text-white fill-[#ffcc00] w-8 h-8 rotate-45" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center mt-4">
              {/* QR Zalo */}
              <div className="mb-6 bg-gray-100 border-4 border-gray-800 rounded-2xl p-3 shadow-[inset_0px_4px_0px_rgba(0,0,0,0.1)]">
                <div className="relative bg-white border-4 border-gray-800 rounded-xl overflow-hidden shadow-[4px_4px_0px_#e94e77]">
                  <img src="/images/qr-zalo.png" alt="Mã QR Zalo nhóm khóa học" className="object-contain w-48 h-48 md:w-56 md:h-56 pointer-events-none" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-gray-800 uppercase mb-2 drop-shadow-[1px_1px_0px_#ffcc00]">Quét phát vào lớp!</h3>
              <p className="text-gray-600 font-bold mb-6 text-sm leading-relaxed border-t-2 border-dashed border-gray-300 pt-4">
                Thầy cô nhớ gia nhập nhóm Zalo ngay để nhận tài liệu chuẩn bị, Link cài đặt các phần mềm nhé.
              </p>

              <button onClick={() => navigator.clipboard.writeText("https://zalo.me/g/grybmv805")}
                className="w-full py-4 px-4 bg-white border-4 border-gray-800 text-gray-900 rounded-2xl font-black uppercase text-sm tracking-wider hover:bg-[#ffcc00] transition-colors shadow-[4px_4px_0px_#1f2937] active:translate-y-1 active:shadow-none"
              >
                Copy Link Zalo
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
