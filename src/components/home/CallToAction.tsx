"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-24 text-center" id="dang-ky">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase leading-tight">
            SẴN SÀNG TRỞ THÀNH NHÂN SỰ CỦA TƯƠNG LAI?
          </h2>
          <p className="text-slate-500 text-lg">
            Đừng để bị thay thế bởi AI, hãy là người điều khiển nó.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-50px" }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="inline-flex flex-col gap-4 w-full sm:w-auto"
        >
          <Link href="/register" className="px-12 py-6 rounded-2xl bg-primary text-white font-black text-2xl hover:scale-105 transition-transform shadow-2xl shadow-primary/30 google-glow">
            ĐĂNG KÝ THAM GIA NGAY
          </Link>
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">laptop_mac</span> Cần Laptop
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">mail</span> Tài khoản Gmail
            </span>
          </div>
        </motion.div>

        <motion.p
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="text-xs text-slate-500 italic opacity-60"
        >
          * Số lượng học viên giới hạn 50 người để đảm bảo chất lượng thực chiến tốt nhất.
        </motion.p>

      </div>
    </section>
  );
}
