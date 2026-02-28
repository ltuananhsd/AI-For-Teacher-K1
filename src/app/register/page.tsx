"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Briefcase, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, Info, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  job: string;
  goals: string;
}

export default function RegisterPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({ fullName: '', phone: '', email: '', job: '', goals: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email) {
      setErrorMessage("Vui lòng nhập Họ và tên, Email và Số điện thoại!");
      return;
    }
    // Validate phone format — exactly 10 digits starting with 0
    const phoneClean = formData.phone.replace(/\s|-/g, '');
    if (!/^0[0-9]{9}$/.test(phoneClean)) {
      setErrorMessage("Số điện thoại phải gồm đúng 10 chữ số, bắt đầu bằng 0 (VD: 0123456789)");
      return;
    }
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Email không hợp lệ. Vui lòng nhập lại.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const phoneClean = formData.phone.replace(/\s|-/g, '');
      const response = await fetch(`${API_BASE}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: phoneClean,
          job_title: formData.job || undefined,
          goals: formData.goals || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage(data.error?.message || 'Email này đã đăng ký khóa học này rồi.');
        } else if (response.status === 422) {
          const details = data.error?.details;
          if (Array.isArray(details) && details.length > 0) {
            setErrorMessage(details.map((d: { message: string }) => d.message).join('. '));
          } else {
            setErrorMessage(data.error?.message || 'Thông tin không hợp lệ.');
          }
        } else {
          setErrorMessage(data.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success — redirect to payment page
      const registrationId = data.data?.registration_id;
      if (registrationId) {
        router.push(`/payment?id=${registrationId}`);
      } else {
        setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại.');
        setIsSubmitting(false);
      }
    } catch {
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1012] text-white pt-24 pb-16 px-4 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[40%] bg-green-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <div className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 xl:gap-12 mt-8">
        
        {/* Left Column (Main Form) */}
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold mb-3">Đăng ký tham gia</h1>
            <div className="flex items-center justify-between text-sm text-slate-400 mb-4 font-medium">
              <span>Bước 1: Thông tin cá nhân & Mục tiêu</span>
              <span className="font-bold text-blue-400">25% Hoàn tất</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-[#1A1B1E] border border-white/5 h-1.5 rounded-full overflow-hidden flex shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "25%" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-blue-500 h-full rounded-full"
              ></motion.div>
            </div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1A1B1E]/80 backdrop-blur-md border border-white/10 rounded-[1.5rem] p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="w-12 h-12 rounded-xl bg-[#4285F4]/10 flex items-center justify-center border border-[#4285F4]/20 shrink-0 mt-1 md:mt-0 shadow-inner">
                <User size={22} className="text-[#4285F4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Hoàn tất thông tin đăng ký Bootcamp</h2>
                <p className="text-sm text-slate-400">Vui lòng cung cấp chính xác thông tin để chúng tôi xác thực tư cách học viên AI của bạn.</p>
              </div>
            </div>

            {/* Error message inline */}
            {errorMessage && !showModal && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl"
              >
                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-300 font-medium">{errorMessage}</p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleProceed}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Họ và tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-slate-300 ml-1">Họ và tên</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A" 
                      required
                      className="w-full bg-[#0f1012] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all placeholder:text-slate-600 shadow-inner" 
                    />
                  </div>
                </div>
                
                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-300 ml-1">Số điện thoại</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0901 234 567" 
                      required
                      className="w-full bg-[#0f1012] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all placeholder:text-slate-600 shadow-inner" 
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-300 ml-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nguyenvana@gmail.com" 
                      required
                      className="w-full bg-[#0f1012] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all placeholder:text-slate-600 shadow-inner" 
                    />
                  </div>
                </div>
                
                {/* Chức vụ */}
                <div className="space-y-2">
                  <label htmlFor="job" className="text-sm font-semibold text-slate-300 ml-1">Chức vụ / Nghề nghiệp</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors z-10">
                      <Briefcase size={18} />
                    </div>
                    <select 
                      id="job"
                      name="job"
                      value={formData.job}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1012] border border-white/10 rounded-xl py-3 pl-11 pr-10 text-white focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all appearance-none shadow-inner relative z-0"
                    >
                      <option value="" disabled className="text-slate-500">Chọn nghề nghiệp của bạn</option>
                      <option value="student">Sinh viên CNTT</option>
                      <option value="developer">Lập trình viên (Developer)</option>
                      <option value="manager">Quản lý dự án (PM/PO)</option>
                      <option value="researcher">Nghiên cứu viên AI</option>
                      <option value="other">Khác</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mục tiêu */}
              <div className="space-y-2">
                <label htmlFor="goals" className="text-sm font-semibold text-slate-300 ml-1">Mục tiêu của bạn khi tham gia Bootcamp</label>
                <div className="relative group">
                  <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-current flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full border-t-[1.5px] border-r-[1.5px] border-current -rotate-45 -ml-0.5 mt-0.5"></div>
                    </div>
                  </div>
                  <textarea 
                    id="goals"
                    name="goals"
                    rows={4} 
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="Chia sẻ kỳ vọng của bạn về kiến thức AI Ecosystem, sản phẩm bạn muốn tạo ra..." 
                    className="w-full bg-[#0f1012] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[#4285F4] focus:ring-1 focus:ring-[#4285F4] transition-all placeholder:text-slate-600 resize-none shadow-inner leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6">
                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#4285F4] to-[#2b6ce0] hover:from-[#3372f5] hover:to-[#225cc7] shadow-[0_0_20px_rgba(66,133,244,0.3)] group border border-[#4285F4]/30"
                >
                  Tiếp tục thanh toán <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-xs mt-2 font-medium">
                <ShieldCheck size={14} className="text-slate-400" />
                <span>Dữ liệu của bạn được mã hóa và bảo mật theo tiêu chuẩn Google Cloud</span>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Column (Benefits) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 lg:mt-16"
        >
          {/* Lợi ích khóa học */}
          <div className="bg-[#1A1B1E]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-white/5">
              <ShieldCheck className="text-[#4285F4]" size={22} /> Lợi ích khóa học
            </h3>
            
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 size={20} className="text-[#4285F4] drop-shadow-[0_0_8px_rgba(66,133,244,0.5)] bg-[#4285F4]/10 rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-slate-200 mb-1">Chứng chỉ chính thức</h4>
                  <p className="text-[13px] text-slate-400 leading-relaxed font-medium">Được công nhận bởi Google Developer Groups.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 size={20} className="text-[#4285F4] drop-shadow-[0_0_8px_rgba(66,133,244,0.5)] bg-[#4285F4]/10 rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-slate-200 mb-1">Truy cập tài nguyên độc quyền</h4>
                  <p className="text-[13px] text-slate-400 leading-relaxed font-medium">Sử dụng Google AI Studio & Vertex AI API miễn phí.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5">
                  <CheckCircle2 size={20} className="text-[#4285F4] drop-shadow-[0_0_8px_rgba(66,133,244,0.5)] bg-[#4285F4]/10 rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-[15px] text-slate-200 mb-1">Networking toàn cầu</h4>
                  <p className="text-[13px] text-slate-400 leading-relaxed font-medium">Kết nối với hơn 500+ chuyên gia AI hàng đầu.</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Sẵn sàng bứt phá */}
          <div className="bg-[#1A1B1E] border border-white/10 rounded-2xl p-[2px] overflow-hidden relative shadow-xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/20 via-transparent to-cyan-400/20 opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen"></div>
            <div className="rounded-xl overflow-hidden relative aspect-[4/3] bg-[#0f1012] flex flex-col justify-end p-6 border border-white/5">
              
              {/* Fake AI connection image pattern */}
              <div className="absolute inset-0 opacity-40">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[150%]">
                  <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(66, 133, 244, 0.5)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  {/* Central Node */}
                  <circle cx="50%" cy="50%" r="40" fill="url(#glow)" />
                  <circle cx="50%" cy="50%" r="4" fill="#60A5FA" className="animate-pulse" />
                  
                  {/* Lines to edges */}
                  <g stroke="rgba(96, 165, 250, 0.4)" strokeWidth="1" strokeDasharray="3 3" className="opacity-80">
                    <line x1="50%" y1="50%" x2="20%" y2="20%" />
                    <line x1="50%" y1="50%" x2="80%" y2="15%" />
                    <line x1="50%" y1="50%" x2="85%" y2="70%" />
                    <line x1="50%" y1="50%" x2="15%" y2="80%" />
                    <line x1="50%" y1="50%" x2="30%" y2="95%" />
                    <line x1="50%" y1="50%" x2="70%" y2="90%" />
                  </g>
                  
                  {/* Surrounding Nodes */}
                  <g fill="#93C5FD">
                    <circle cx="20%" cy="20%" r="2" />
                    <circle cx="80%" cy="15%" r="2.5" />
                    <circle cx="85%" cy="70%" r="1.5" />
                    <circle cx="15%" cy="80%" r="3" />
                    <circle cx="30%" cy="95%" r="2" />
                    <circle cx="70%" cy="90%" r="2" />
                  </g>
                </svg>
              </div>
              
              <div className="relative z-10 w-full text-left mt-auto">
                <span className="block text-[11px] font-bold text-white/70 tracking-[0.1em] uppercase mb-1 drop-shadow-md">SẴN SÀNG BỨT PHÁ</span>
                <span className="text-base text-white font-bold drop-shadow-lg">Thế hệ AI mới bắt đầu từ bạn.</span>
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0f1012]/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1A1B1E] border border-white/10 rounded-[1.5rem] p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-3 mb-4 text-[#4285F4]">
                <Info size={28} className="shrink-0" />
                <h3 className="text-xl font-bold text-white tracking-tight">Xác nhận thông tin</h3>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Vui lòng kiểm tra lại thông tin đăng ký (đặc biệt là <b>Email</b> và <b>Số điện thoại</b>) bảo đảm chính xác để chúng tôi thêm bạn vào danh sách học viên.
              </p>

              <div className="bg-[#0f1012] border border-white/5 rounded-xl p-5 mb-6 space-y-4 shadow-inner">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Họ và tên:</span>
                  <span className="text-white font-semibold text-sm">{formData.fullName}</span>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Email:</span>
                  <span className="text-white font-semibold text-sm">{formData.email}</span>
                </div>
                <div className="h-px w-full bg-white/5"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Số điện thoại:</span>
                  <span className="text-white font-semibold text-sm">{formData.phone}</span>
                </div>
                {formData.job && (
                  <>
                    <div className="h-px w-full bg-white/5"></div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Nghề nghiệp:</span>
                      <span className="text-white font-semibold text-sm">{formData.job}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Error in modal */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="text-red-400 text-sm shrink-0" size={16} />
                  <p className="text-xs text-red-300 font-medium leading-relaxed">{errorMessage}</p>
                </motion.div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => { setShowModal(false); setErrorMessage(''); }}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-600 text-slate-300 hover:bg-white/5 hover:text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Sửa lại
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#4285F4] to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all shadow-[0_0_15px_rgba(66,133,244,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 border border-[#4285F4]/30"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm">Đang xử lý...</span>
                    </>
                  ) : (
                    'Xác nhận đăng ký'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
