"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const [timeLeft, setTimeLeft] = useState(594); // 9:54

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-10 mb-12">
      <div className="w-full max-w-[640px] flex flex-col gap-6">
        
        {/* Progress Stepper */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 px-2"
        >
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Thanh toán học phí Bootcamp 2026</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Hoàn tất thanh toán để giữ chỗ tham gia</p>
            </div>
            <div className="text-right">
              <p className="text-primary text-sm font-bold">Bước 2/3</p>
              <p className="text-xs opacity-60">Xác thực thanh toán</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: "25%" }}
               animate={{ width: "66%" }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-primary shadow-[0_0_10px_rgba(67,135,244,0.5)]" 
            />
          </div>
        </motion.div>

        {/* Payment Card (Glassmorphism) */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl p-6 md:p-10 flex flex-col items-center gap-8"
        >
          {/* Amount Highlight */}
          <motion.div 
             animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="bg-success/10 border border-success/30 px-6 py-2 rounded-full"
          >
            <p className="text-success text-2xl font-bold tracking-wider">5.000.000 VNĐ</p>
          </motion.div>

          {/* QR Code Container */}
          <div className="relative group">
            {/* Circular Timer Border Effect */}
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4 rounded-xl border-2 border-dashed border-primary/30"
            />
            <div className="relative bg-white p-4 rounded-lg shadow-[0_0_30px_rgba(67,135,244,0.2)]">
              <div className="relative size-56 md:size-64">
                <Image src="/images/qr-code.png" alt="QR Code" fill className="object-contain" />
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <p className="text-sm font-medium">Mã QR hết hạn trong: <span className="text-primary font-bold">{formatTime(timeLeft)}</span></p>
          </div>

          {/* Bank Details */}
          <div className="w-full space-y-3">
            {[
              { label: "Ngân hàng", value: "VIETCOMBANK (VCB)" },
              { label: "Số tài khoản", value: "1023948576" },
              { label: "Nội dung", value: "AI2026 USER8829" }
            ].map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <div>
                  <p className="text-xs uppercase text-slate-500 tracking-widest font-bold">{detail.label}</p>
                  <p className="font-semibold text-sm md:text-base">{detail.value}</p>
                </div>
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors group">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">content_copy</span>
                </button>
              </div>
            ))}
          </div>

          {/* Auto Confirm Note */}
          <div className="w-full flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <span className="material-symbols-outlined text-warning shrink-0">info</span>
            <p className="text-xs md:text-sm text-warning/90 leading-relaxed font-medium">
              Hệ thống sẽ tự động xác nhận giao dịch trong vòng 1-5 phút sau khi chuyển tiền thành công. Vui lòng không đóng cửa sổ này.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <Link href="/success" className="shadow-[0_0_15px_rgba(67,135,244,0.4)] w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">check_circle</span>
              Xác nhận đã chuyển
            </Link>
            <Link href="/register" className="w-full py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">arrow_back</span>
              Quay lại
            </Link>
          </div>
        </motion.div>

        {/* Trust Footer */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.6, delay: 0.8 }}
           className="flex justify-center flex-wrap items-center gap-6 opacity-60 hover:opacity-100 transition-all duration-500 px-4 py-8"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">security</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure SSL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">shield_person</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">AI Fraud Detection</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
