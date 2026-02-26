"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SolutionSection() {
  return (
    <section className="py-24 overflow-hidden relative z-10" id="loi-ich">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-white uppercase drop-shadow-lg">
              BIẾN GOOGLE AI THÀNH <br />{" "}
              <span className="text-primary drop-shadow-[0_0_15px_rgba(67,135,244,0.3)]">CỘNG SỰ ĐẮC LỰC NHẤT</span>
            </h2>
            <p className="text-lg text-slate-400 drop-shadow-md">
              Không chỉ là một công cụ chat, Google AI là một hệ sinh thái mạnh mẽ giúp bạn tự động hóa mọi quy trình làm việc.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { title: "Gemini 1.5 Pro & Flash", desc: "Xử lý khối lượng dữ liệu khổng lồ với độ chính xác cao." },
                { title: "NotebookLM & Workspace Studio", desc: "Biến tài liệu cá nhân thành kho tri thức thông minh." },
                { title: "Whisk, Flow, Opal & Script", desc: "Tự động hóa quy trình không cần code (No-code automation)." },
              ].map((item, idx) => (
                <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                   className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1 shadow-[0_0_10px_rgba(67,135,244,0.3)]">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="h-48 rounded-[2rem] glass-card bg-gradient-to-br from-primary/20 to-transparent p-6 flex flex-col justify-end border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                <span className="material-symbols-outlined text-primary mb-2 drop-shadow-[0_0_10px_rgba(67,135,244,0.5)] z-10">auto_awesome</span>
                <p className="font-bold text-sm text-white z-10">Gemini AI</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="h-64 rounded-[2rem] glass-card p-6 flex flex-col justify-end border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden relative group">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500">
                  <Image fill alt="NotebookLM bg" className="object-cover" src="/images/notebook_lm_bg.png" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A101E] to-transparent"></div>
                </div>
                <span className="material-symbols-outlined text-google-green relative z-10 mb-2 drop-shadow-[0_0_10px_rgba(52,168,83,0.5)]">menu_book</span>
                <p className="font-bold text-sm relative z-10 text-white">NotebookLM</p>
              </motion.div>
            </div>
            <div className="space-y-4 pt-12">
              <motion.div whileHover={{ scale: 1.02 }} className="h-64 rounded-[2rem] glass-card p-6 flex flex-col justify-end border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden relative group">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500">
                  <Image fill alt="Workspace Studio bg" className="object-cover" src="/images/workspace_studio_bg.png" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A101E] to-transparent"></div>
                </div>
                <span className="material-symbols-outlined text-google-red relative z-10 mb-2 drop-shadow-[0_0_10px_rgba(234,67,53,0.5)]">workspaces</span>
                <p className="font-bold text-sm relative z-10 text-white">Workspace Studio</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="h-48 rounded-[2rem] glass-card bg-gradient-to-br from-google-yellow/20 to-transparent p-6 flex flex-col justify-end border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                <span className="material-symbols-outlined text-google-yellow mb-2 drop-shadow-[0_0_10px_rgba(251,188,5,0.5)] z-10">bolt</span>
                <p className="font-bold text-sm text-white z-10">Flow Automation</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
