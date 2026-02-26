"use client";

import { motion } from "framer-motion";

const problems = [
  {
    icon: "mail",
    color: "google-red",
    title: "Quá tải thông tin",
    desc: "Xử lý hàng tá email, báo cáo và tài liệu mỗi ngày khiến bạn không còn thời gian sáng tạo.",
  },
  {
    icon: "sync",
    color: "google-yellow",
    title: "Tác vụ lặp lại",
    desc: "Mất hàng giờ cho những công việc thủ công không tên, khiến hiệu suất trì trệ.",
  },
  {
    icon: "terminal",
    color: "primary",
    title: "Thiếu kỹ năng Prompt",
    desc: "Không biết cách giao tiếp hiệu quả với AI, dẫn đến kết quả hời hợt, không ứng dụng được.",
  },
  {
    icon: "timer_off",
    color: "google-green",
    title: "Áp lực deadline",
    desc: "Luôn trong tình trạng chạy đua với thời gian mà vẫn không hoàn thành hết khối lượng công việc.",
  }
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/30" id="van-de">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            BẠN CÓ ĐANG KIỆT SỨC...?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Thế giới đang thay đổi nhanh chóng, và những phương pháp cũ đang khiến bạn bị bỏ lại phía sau.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined text-${item.color}`}>{item.icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
