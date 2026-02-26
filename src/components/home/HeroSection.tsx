"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-google-red rounded-full blur-[120px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Sẵn sàng cho kỷ nguyên 2026
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-slate-900 dark:text-white">
            CHINH PHỤC HỆ SINH THÁI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-google-red to-google-green">
              GOOGLE AI
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0">
            Xây dựng đội ngũ "nhân sự ảo" tối ưu hiệu suất công việc với 5 buổi học thực chiến theo công thức 30/70.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/25">
              Đăng Ký Tham Gia Ngay
            </Link>
            <div className="flex -space-x-3 overflow-hidden">
              <Image alt="Profile picture 1" width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-background-dark object-cover" src="/images/215353b3b5c277ae421364418efecf2b.jpg" />
              <Image alt="Profile picture 2" width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-background-dark object-cover" src="/images/9c6d0b40c9c84a12d65eeee86d46b858.jpg" />
              <Image alt="Profile picture 3" width={40} height={40} className="inline-block h-10 w-10 rounded-full ring-2 ring-background-dark object-cover" src="/images/6b2fa857f6837ef549d4d2a4a571fde0.jpg" />
              <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-background-dark bg-slate-800 text-xs text-white font-bold">+1k</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
           className="flex-1 w-full max-w-xl"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-google-red to-google-yellow rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-background-light dark:bg-background-dark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="relative w-full aspect-video">
                <Image fill alt="AI Bootcamp" className="object-cover" src="/images/54ab56928b277937cbaddb4d90f76606.jpg" />
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-primary text-2xl font-black">5</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Buổi Học</p>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-800">
                  <p className="text-primary text-2xl font-black">30/70</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Thực Chiến</p>
                </div>
                <div className="text-center">
                  <p className="text-primary text-2xl font-black">100%</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Sản Phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
