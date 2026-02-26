"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "linear-gradient(rgba(67, 135, 244, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(67, 135, 244, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}
        ></div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 size-[600px]" 
          style={{
            filter: "blur(120px)",
            background: "radial-gradient(circle, rgba(67, 135, 244, 0.15) 0%, transparent 70%)"
          }}
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -right-40 size-[600px]" 
          style={{
            filter: "blur(120px)",
            background: "radial-gradient(circle, rgba(234, 67, 53, 0.1) 0%, transparent 70%)"
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] opacity-20 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#101722]/60 backdrop-blur-md border border-white/10 w-full max-w-[520px] rounded-xl p-8 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-6 ring-1 ring-primary/20">
                <span className="material-symbols-outlined !text-3xl">lock_open</span>
              </div>
              <h1 className="text-slate-100 text-3xl font-bold tracking-tight mb-2">Đăng nhập hệ thống</h1>
              <p className="text-slate-400 text-base">Chào mừng các chuyên gia AI tương lai</p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium px-1">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 !text-xl">mail</span>
                  <input className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-4 pl-12 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-600" placeholder="Nhập email của bạn" type="email" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium px-1">Mật khẩu</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 !text-xl">key</span>
                  <input className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-4 pl-12 pr-12 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-slate-600" placeholder="Nhập mật khẩu" type="password" required />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" type="button">
                    <span className="material-symbols-outlined !text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input className="size-4 rounded border-slate-700 bg-slate-900/50 text-primary focus:ring-primary/20 !ring-offset-0" type="checkbox" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Ghi nhớ đăng nhập</span>
                </label>
                <Link className="text-sm text-primary hover:underline font-medium" href="#">Quên mật khẩu?</Link>
              </div>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2" type="button">
                Đăng nhập
                <span className="material-symbols-outlined !text-lg">arrow_forward</span>
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-700/50"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-xs font-medium uppercase tracking-widest">Hoặc tiếp tục với</span>
                <div className="flex-grow border-t border-slate-700/50"></div>
              </div>

              <button className="glass-card w-full hover:bg-white/5 border border-slate-700/50 text-slate-100 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-3" type="button">
                <svg className="size-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                </svg>
                Tiếp tục với Google
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                Chưa có tài khoản? 
                <Link className="text-primary hover:underline font-bold ml-1" href="/register">Đăng ký tham gia ngay</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
