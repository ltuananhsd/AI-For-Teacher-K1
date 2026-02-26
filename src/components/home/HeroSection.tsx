"use উপকূল";

import React from 'react';
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="flex-grow flex items-center justify-center px-6 lg:px-12 pb-20 pt-10 relative z-10 w-full min-h-screen">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pointer-events-none mt-20">
          
          {/* CỘT TRÁI: TEXT & CALL TO ACTION */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-8 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-google-blue"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Sẵn sàng cho kỷ nguyên 2026
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-lg">
              CHINH PHỤC HỆ
              <br />
              SINH THÁI
              <br />
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#4285F4_0%,#EA4335_33%,#FBBC05_66%,#34A853_100%)] drop-shadow-none">
                GOOGLE AI
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-light drop-shadow-md">
              Xây dựng đội ngũ "nhân sự ảo" tối ưu hiệu suất công việc với 5 buổi học thực chiến theo công thức 30/70.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
              <Link href="/register" className="pointer-events-auto px-8 py-4 rounded-xl bg-google-blue hover:bg-google-blue/80 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(66,133,244,0.4)] hover:shadow-[0_0_40px_rgba(66,133,244,0.6)] hover:-translate-y-1">
                Đăng Ký Tham Gia Ngay
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#0A101E] object-cover" src="/images/215353b3b5c277ae421364418efecf2b.jpg" alt="Học viên" />
                  <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#0A101E] object-cover" src="/images/9c6d0b40c9c84a12d65eeee86d46b858.jpg" alt="Học viên" />
                  <Image width={40} height={40} className="w-10 h-10 rounded-full border-2 border-[#0A101E] object-cover" src="/images/6b2fa857f6837ef549d4d2a4a571fde0.jpg" alt="Học viên" />
                  <div className="w-10 h-10 rounded-full border-2 border-[#0A101E] bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-300 z-10 pointer-events-auto cursor-help" title="Và hàng ngàn học viên khác...">
                    +1k
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: GLASSMORPHISM FEATURE CARD */}
          <div className="lg:col-span-6 w-full pointer-events-none relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-google-blue/10 via-transparent to-purple-500/10 rounded-full blur-3xl opacity-70"></div>
            
            <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.03)] flex flex-col group mt-10 lg:mt-0">
              <div className="relative h-[300px] sm:h-[400px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute w-48 h-48 bg-google-blue/20 rounded-full blur-[60px] opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10 flex items-center justify-center w-48 h-56 bg-white/[0.05] backdrop-blur-md rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_2px_10px_rgba(255,255,255,0.1)] border border-white/20 transition-transform duration-500 group-hover:scale-105 pointer-events-auto cursor-pointer">
                  <span className="text-[80px] font-medium text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] tracking-tighter ml-2 font-serif group-hover:text-google-blue transition-colors duration-500">
                    AI
                  </span>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-5 h-24 bg-white/[0.02] backdrop-blur-sm border-y border-l border-white/10 rounded-l-xl shadow-[inset_2px_0_5px_rgba(255,255,255,0.05)]"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-5 w-5 h-24 bg-white/[0.02] backdrop-blur-sm border-y border-r border-white/10 rounded-r-xl shadow-[inset_-2px_0_5px_rgba(255,255,255,0.05)]"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>

              <div className="bg-black/20 p-6 sm:p-8 relative z-20">
                <div className="grid grid-cols-3 divide-x divide-white/10">
                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-4xl sm:text-5xl font-bold text-google-blue drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] group-hover:scale-110 transition-transform duration-500">
                      5
                    </span>
                    <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-300 mt-2 font-medium drop-shadow-md">
                      Buổi học
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:text-google-green transition-colors duration-500 group-hover:scale-110">
                      30/70
                    </span>
                    <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-300 mt-2 font-medium drop-shadow-md">
                      Thực chiến
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center px-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:text-google-yellow transition-colors duration-500 group-hover:scale-110">
                      100%
                    </span>
                    <span className="text-xs sm:text-sm uppercase tracking-widest text-slate-300 mt-2 font-medium drop-shadow-md">
                      Sản phẩm
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
    </section>
  );
}
