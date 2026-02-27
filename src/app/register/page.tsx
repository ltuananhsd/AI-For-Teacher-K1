"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', job: '', goals: '' });
  const router = useRouter();

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceed = (e: any) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      alert("Vui lòng nhập Họ và tên, Email và Số điện thoại!");
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 md:px-10">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Registration Form Container */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 flex flex-col gap-8"
        >
          {/* Progress Section */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-white text-2xl font-bold">Đăng ký tham gia</h1>
                <p className="text-slate-400 text-sm mt-1">Bước 1: Thông tin cá nhân & Mục tiêu</p>
              </div>
              <span className="text-primary font-bold">25% Hoàn tất</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(67,135,244,0.6)] rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-[#101722]/60 backdrop-blur-md border border-white/10 rounded-xl p-8 flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-lg">
                <span className="material-symbols-outlined text-primary">person_add</span>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">Hoàn tất thông tin đăng ký Bootcamp</h3>
                <p className="text-slate-400 text-sm mt-1">Vui lòng cung cấp chính xác thông tin để chúng tôi xác thực tư cách hội viên AI của bạn.</p>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-medium ml-1">Họ và tên</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all" 
                    placeholder="Nguyễn Văn A" 
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-medium ml-1">Số điện thoại</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">call</span>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all" 
                    placeholder="0901 234 567" 
                    type="tel"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-medium ml-1">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all" 
                    placeholder="nguyenvana@gmail.com" 
                    type="email"
                    required
                  />
                </div>
              </div>

              {/* Job Title Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-300 text-sm font-medium ml-1">Chức vụ / Nghề nghiệp</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">work</span>
                  <select name="job" value={formData.job} onChange={handleInputChange} className="w-full appearance-none bg-slate-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-10 text-white focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all">
                    <option disabled value="">Chọn nghề nghiệp của bạn</option>
                    <option value="student">Sinh viên CNTT</option>
                    <option value="developer">Lập trình viên (Developer)</option>
                    <option value="manager">Quản lý dự án (PM/PO)</option>
                    <option value="researcher">Nghiên cứu viên AI</option>
                    <option value="other">Khác</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Goals Text Area */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-slate-300 text-sm font-medium ml-1">Mục tiêu của bạn khi tham gia Bootcamp</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-4 text-slate-500 group-focus-within:text-primary transition-colors">track_changes</span>
                  <textarea 
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none" 
                    placeholder="Chia sẻ kỳ vọng của bạn về kiến thức AI Ecosystem..." 
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>
            </form>

            {/* CTA Section */}
            <div className="flex flex-col gap-4 pt-4">
              <button onClick={handleProceed} type="button" className="shadow-[0_0_15px_rgba(67,135,244,0.4)] w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group focus:outline-none">
                <span>Tiếp tục thanh toán</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">shield</span>
                <span>Dữ liệu của bạn được mã hóa và bảo mật theo tiêu chuẩn Google Cloud</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar Decor / Benefits */}
        <motion.aside 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              Lợi ích khóa học
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { title: "Chứng chỉ chính thức", desc: "Được công nhận bởi Google Developer Groups." },
                { title: "Truy cập tài nguyên độc quyền", desc: "Sử dụng Google AI Studio & Vertex AI API miễn phí." },
                { title: "Networking toàn cầu", desc: "Kết nối với hơn 500+ chuyên gia AI hàng đầu." },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                  <div className="text-sm">
                    <p className="text-white font-medium">{item.title}</p>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Accent Card */}
          <div className="relative rounded-xl h-48 overflow-hidden group">
            <div className="absolute inset-0">
               <Image 
                 src="/images/register-bg.jpg" 
                 alt="Tech Background" 
                 fill 
                 className="object-cover transition-transform duration-700 group-hover:scale-110" 
               />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs font-bold uppercase tracking-widest opacity-70">Sẵn sàng bứt phá</p>
              <p className="text-white text-sm font-medium">Thế hệ AI mới bắt đầu từ bạn.</p>
            </div>
          </div>
        </motion.aside>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0A101E] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-3xl">info</span>
                <h3 className="text-xl font-bold text-white">Xác nhận thông tin</h3>
              </div>
              
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Vui lòng kiểm tra lại thông tin đăng ký (đặc biệt là <b>Email</b> và <b>Số điện thoại</b>) bảo đảm chính xác để chúng tôi thêm bạn vào danh sách học viên.
              </p>

              <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium uppercase min-w-[100px]">Họ và tên:</span>
                  <span className="text-white font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium uppercase min-w-[100px]">Email:</span>
                  <span className="text-white font-semibold">{formData.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium uppercase min-w-[100px]">Số điện thoại:</span>
                  <span className="text-white font-semibold">{formData.phone}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-white hover:bg-white/5 font-medium transition-colors"
                >
                  Sửa lại
                </button>
                <button 
                  onClick={() => router.push("/payment")}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-[0_0_15px_rgba(67,135,244,0.4)]"
                >
                  Xác nhận
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
