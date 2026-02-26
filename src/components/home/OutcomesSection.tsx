"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OutcomesSection() {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 lg:p-20 relative overflow-hidden shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.03)] group">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-google-blue/5 via-transparent to-primary/10 rounded-full blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none -z-10">
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="h-full w-full opacity-30" 
            fill="none" 
            viewBox="0 0 100 100"
          >
            <circle cx="100" cy="0" r="80" stroke="white" strokeWidth="0.5"></circle>
            <circle cx="100" cy="0" r="60" stroke="white" strokeWidth="0.5"></circle>
            <circle cx="100" cy="0" r="40" stroke="white" strokeWidth="0.5"></circle>
          </motion.svg>
        </div>

        <div className="relative z-10 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-black mb-6 uppercase drop-shadow-md">KẾT QUẢ SAU KHÓA HỌC</h2>
            <p className="text-slate-400 text-lg mb-8">Bạn không chỉ học kiến thức, bạn mang về bộ giải pháp sẵn sàng vận hành.</p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: "groups", title: "Virtual Staff", desc: "Đội ngũ AI hỗ trợ 24/7", color: "text-google-blue" },
                { icon: "speed", title: "70% Time Saved", desc: "X3 hiệu suất làm việc", color: "text-google-green" },
                { icon: "psychology", title: "AI Mindset", desc: "Tư duy giải quyết vấn đề", color: "text-google-red" },
                { icon: "workspace_premium", title: "Certification", desc: "Chứng chỉ từ Bootcamp", color: "text-google-yellow" },
              ].map((item, idx) => (
                <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                   className="space-y-3 glass-card p-5 rounded-2xl hover:bg-white/5 transition-colors border border-white/5"
                >
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${item.color}`}>
                     <span className="material-symbols-outlined text-3xl opacity-90 drop-shadow-md">{item.icon}</span>
                  </div>
                  <h5 className="font-bold text-slate-200">{item.title}</h5>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="hidden lg:block relative aspect-video"
          >
             <Image 
               fill 
               alt="Success Team" 
               className="rounded-2xl shadow-2xl object-cover" 
               src="/images/06ed1df268641d6ebfcf743e353cc5d6.jpg" 
             />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
