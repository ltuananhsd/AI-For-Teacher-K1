"use client";

import { motion } from "framer-motion";

const days = [
  {
    num: "01",
    title: "Tư duy & Gemini",
    desc: "Nắm vững nghệ thuật Prompting và khai thác sức mạnh tối đa của Gemini 1.5 Pro.",
    color: "primary",
    hoverColor: "bg-primary/5",
    textColor: "text-primary/20",
    textHoverColor: "group-hover:text-primary/40",
  },
  {
    num: "02",
    title: "Kho Tri Thức",
    desc: "Làm chủ NotebookLM để quản lý hàng ngàn tài liệu và nghiên cứu thông minh.",
    color: "google-red",
    hoverColor: "bg-google-red/5",
    textColor: "text-google-red/20",
    textHoverColor: "group-hover:text-google-red/40",
  },
  {
    num: "03",
    title: "Tự Động Hóa",
    desc: "Kết nối Google Workspace với Flow & Whisk để tự động hóa quy trình Marketing/Office.",
    color: "google-yellow",
    hoverColor: "bg-google-yellow/5",
    textColor: "text-google-yellow/20",
    textHoverColor: "group-hover:text-google-yellow/40",
  },
  {
    num: "04",
    title: "Workspace Studio",
    desc: "Xây dựng Add-ons và công cụ hỗ trợ công việc chuyên sâu ngay trên Google Docs/Sheets.",
    color: "google-green",
    hoverColor: "bg-google-green/5",
    textColor: "text-google-green/20",
    textHoverColor: "group-hover:text-google-green/40",
  },
  {
    num: "05",
    title: "Capstone Project",
    desc: "Hoàn thiện 'Nhân sự ảo' thực tế phục vụ trực tiếp cho công việc của bạn.",
    color: "slate-400",
    hoverColor: "bg-white/5",
    textColor: "text-slate-600/20",
    textHoverColor: "group-hover:text-slate-600/40",
  },
];

export default function RoadmapSection() {
  return (
    <section className="py-24 bg-background-light dark:bg-[#0c121a]" id="chuong-trinh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4">LỘ TRÌNH 5 BUỔI CHINH PHỤC</h2>
          <p className="text-slate-500">Từ người mới bắt đầu đến chuyên gia ứng dụng AI vào công việc</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {days.map((day, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              <div className={`p-6 rounded-2xl glass-card h-full flex flex-col border-l-4 border-l-${day.color} hover:${day.hoverColor} transition-all`}>
                <span className={`text-4xl font-black ${day.textColor} mb-4 ${day.textHoverColor} transition-colors`}>
                  {day.num}
                </span>
                <h4 className="font-bold text-lg mb-2">{day.title}</h4>
                <p className="text-xs text-slate-500">{day.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
