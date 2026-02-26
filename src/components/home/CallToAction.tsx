"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-24 text-center relative z-10" id="dang-ky">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-gradient-to-r from-google-blue/10 via-primary/5 to-google-green/10 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight drop-shadow-md">
            SẴN SÀNG TRỞ THÀNH NHÂN SỰ CỦA TƯƠNG LAI?
          </h2>
          <p className="text-slate-400 text-lg">
            Đừng để bị thay thế bởi AI, hãy là người điều khiển nó.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="inline-flex flex-col gap-6 w-full sm:w-auto"
        >
          <Link href="/register" className="px-12 py-6 rounded-2xl bg-white/[0.05] border border-white/20 backdrop-blur-xl text-white font-black text-2xl hover:bg-white/10 hover:border-google-blue/50 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.03)] google-glow group relative overflow-hidden">
            <span className="relative z-10 drop-shadow-md group-hover:text-google-blue transition-colors">ĐĂNG KÝ THAM GIA NGAY</span>
            <div className="absolute inset-0 bg-gradient-to-r from-google-blue/0 via-google-blue/20 to-google-blue/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </Link>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-400 glass-card px-6 py-3 rounded-full border border-white/10 shadow-lg">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-google-yellow">laptop_mac</span> Cần Laptop
            </span>
            <div className="w-px h-4 bg-white/20"></div>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-google-red">mail</span> Tài khoản Gmail
            </span>
          </div>
        </motion.div>

        <motion.p
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="text-xs text-slate-500 italic opacity-80"
        >
          * Số lượng học viên giới hạn 50 người để đảm bảo chất lượng thực chiến tốt nhất.
        </motion.p>

      </div>
    </section>
  );
}
