"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 mb-[100px]">
      <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Success Messaging */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-google-green/10 text-google-green px-4 py-2 rounded-full w-fit">
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span className="text-sm font-bold tracking-wider uppercase">Success Confirmed</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Chào mừng tới <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-red to-google-yellow">Thế hệ AI 2026</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Chúc mừng! Bạn đã chính thức trở thành thành viên của Google AI Ecosystem Bootcamp 2026. Một hành trình khai phá tiềm năng AI đang chờ đón bạn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">group</span>
              Vào Nhóm Zalo Ngay
            </button>
            <Link href="/" className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white px-6 py-4 font-medium transition-colors group">
              Quay lại Trang chủ
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {/* Steps Timeline */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Tiếp theo là gì?</p>
            <div className="flex flex-col gap-6">
              {[
                { step: "1", title: "Tham gia cộng đồng", desc: "Kết nối với hơn 500+ học viên và chuyên gia tại nhóm Zalo chính thức.", active: true },
                { step: "2", title: "Kiểm tra Email", desc: "Chúng tôi đã gửi bộ tài liệu khởi đầu và lịch trình chi tiết vào hòm thư của bạn.", active: false }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`flex-none size-8 rounded-full flex items-center justify-center font-bold ${item.active ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* QR & Community Card */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.7, delay: 0.2 }}
           className="relative @container"
        >
          <div className="glow-border bg-white dark:bg-[#1c1f27] rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            {/* Background Pattern Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-9xl">qr_code_2</span>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="size-64 md:size-72 bg-white p-4 rounded-lg shadow-inner flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-lg"></div>
                  
                  <Image src="/images/1bbf72338c49b77c6e976b4f172a3424.jpg" alt="Zalo community group QR code" fill className="object-contain relative z-10 p-4" />
                  
                  {/* QR Frame Corners */}
                  <div className="absolute -top-2 -left-2 size-6 border-t-4 border-l-4 border-google-blue rounded-tl-lg"></div>
                  <div className="absolute -top-2 -right-2 size-6 border-t-4 border-r-4 border-google-red rounded-tr-lg"></div>
                  <div className="absolute -bottom-2 -left-2 size-6 border-b-4 border-l-4 border-google-yellow rounded-bl-lg"></div>
                  <div className="absolute -bottom-2 -right-2 size-6 border-b-4 border-r-4 border-google-green rounded-br-lg"></div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quét mã để gia nhập</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                Tham gia nhóm thảo luận của cohort 2026 để nhận cập nhật tài liệu đào tạo sớm nhất.
              </p>

              <div className="w-full space-y-4">
                <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-400">
                  <div className="h-px grow bg-slate-200 dark:bg-slate-800"></div>
                  <span>HOẶC</span>
                  <div className="h-px grow bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <button className="w-full py-3 px-4 border border-primary/30 text-primary rounded-xl font-bold hover:bg-primary/5 transition-colors">
                  Copy Link Tham Gia
                </button>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-6 -left-6 md:-left-12 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100 dark:border-slate-700"
          >
            <div className="size-12 rounded-full bg-google-blue/10 flex items-center justify-center text-google-blue">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-400 uppercase">Trusted by</p>
              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">Google Developers</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
