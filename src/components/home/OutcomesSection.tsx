"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function OutcomesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary rounded-[2rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
        
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <motion.svg 
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="h-full w-full" 
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
            <h2 className="text-4xl font-black mb-6 uppercase">KẾT QUẢ SAU KHÓA HỌC</h2>
            <p className="text-white/80 text-lg mb-8">Bạn không chỉ học kiến thức, bạn mang về bộ giải pháp sẵn sàng vận hành.</p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: "groups", title: "Virtual Staff", desc: "Đội ngũ AI hỗ trợ 24/7" },
                { icon: "speed", title: "70% Time Saved", desc: "X3 hiệu suất làm việc" },
                { icon: "psychology", title: "AI Mindset", desc: "Tư duy giải quyết vấn đề bằng AI" },
                { icon: "workspace_premium", title: "Certification", desc: "Chứng chỉ uy tín từ Bootcamp" },
              ].map((item, idx) => (
                <motion.div
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                   className="space-y-2"
                >
                  <span className="material-symbols-outlined text-4xl opacity-80">{item.icon}</span>
                  <h5 className="font-bold">{item.title}</h5>
                  <p className="text-sm text-white/70">{item.desc}</p>
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
