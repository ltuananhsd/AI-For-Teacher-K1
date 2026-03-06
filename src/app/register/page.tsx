"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Briefcase, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, Info, AlertCircle, Target, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const COURSE_SLUG = 'ai-for-teacher-k1';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  job: string;
  goals: string;
}

// --- CONFIG BẢNG MÀU RETRO ---
const theme = {
  navy: '#2a3b8f',
  pink: '#e94e77',
  yellow: '#ffcc00',
  teal: '#45b596',
  orange: '#ff7e67',
  bg: '#fdfbf7',
  dark: '#1f2937'
};

const Tape = ({ className = "" }) => (
  <div className={`absolute w-24 h-8 bg-yellow-200/90 border-2 border-gray-800 opacity-90 backdrop-blur-sm z-20 ${className}`}
    style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }} />
);

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
    const phoneClean = formData.phone.replace(/\s|-/g, '');
    if (!/^0[0-9]{9}$/.test(phoneClean)) {
      setErrorMessage("Số điện thoại phải gồm đúng 10 chữ số, bắt đầu bằng 0 (VD: 0123456789)");
      return;
    }
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
      const response = await fetch(`${API_BASE}/api/enrollments/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: phoneClean,
          job_title: formData.job || undefined,
          goals: formData.goals || undefined,
          course_slug: COURSE_SLUG,
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
      const enrollmentId = data.data?.enrollment_id;
      if (enrollmentId) {
        router.push(`/payment?id=${enrollmentId}`);
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
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 pt-12 pb-16 px-4 font-sans relative overflow-hidden selection:bg-[#ffcc00] selection:text-gray-900">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />

      {/* Abstract Decor */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#ffcc00] rounded-full border-4 border-gray-800" />
      <div className="absolute top-40 left-10 w-24 h-24 bg-[#45b596] transform rotate-45 border-4 border-gray-800" />

      {/* Header Back Button */}
      <div className="max-w-6xl mx-auto mb-8 md:mb-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <button onClick={() => router.push('/')} className="bg-white px-6 py-3 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#2a3b8f] font-black uppercase text-sm transform hover:-translate-x-1 transition-all flex items-center gap-2">
          ← QUAY LẠI TRANG CHỦ
        </button>
        <div className="bg-white px-3 py-2 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#e94e77] transform rotate-2">
          <img src="/images/logo-xanh.png" alt="Logo CES" className="h-8 md:h-10 object-contain" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">

        {/* Left Column (Main Form) */}
        <div className="w-full">
          <div className="mb-10 text-center md:text-left relative">
            <div className="inline-block bg-[#1f2937] text-white py-2 px-6 rounded-full text-sm font-black tracking-widest uppercase mb-6 border-2 border-gray-800 transform rotate-1 shadow-[4px_4px_0px_#ffcc00]">
              Bước 1: Thông tin học viên
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase leading-[1.1] text-[#2a3b8f]" style={{ textShadow: '4px 4px 0px #ffcc00, -1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937, 1px 1px 0 #1f2937' }}>
              Đăng Ký Tham Gia
            </h1>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-4 border-gray-800 rounded-3xl p-6 md:p-10 shadow-[12px_12px_0px_#2a3b8f] relative"
          >
            <Tape className="-top-4 right-10 transform rotate-6 bg-[#45b596]/90" />

            <div className="flex items-center gap-4 mb-8 pb-6 border-b-4 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-[#ffcc00] border-4 border-gray-800 rounded-full flex items-center justify-center shadow-[4px_4px_0px_#1f2937] transform -rotate-6 shrink-0">
                <Target size={28} className="text-gray-900" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase text-gray-800 tracking-tight">Thông tin Bootcamp</h2>
                <p className="text-gray-600 font-bold">Điền chính xác để chúng tôi ghi danh cho bạn nhé!</p>
              </div>
            </div>

            {/* Error message inline */}
            {errorMessage && !showModal && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 mb-8 bg-[#ff7e67] border-4 border-gray-800 rounded-2xl shadow-[4px_4px_0px_#1f2937] transform rotate-1"
              >
                <AlertTriangle className="text-gray-900 shrink-0 mt-0.5" size={24} />
                <p className="text-gray-900 font-bold">{errorMessage}</p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleProceed}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Họ và tên */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-black uppercase text-gray-800 ml-1 tracking-wider">Họ và tên <span className="text-[#e94e77]">*</span></label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-800">
                      <User size={20} strokeWidth={2.5} />
                    </div>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Nguyễn Văn A" required
                      className="w-full bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcc00] transition-all placeholder:text-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-black uppercase text-gray-800 ml-1 tracking-wider">Số điện thoại <span className="text-[#e94e77]">*</span></label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-800">
                      <Phone size={20} strokeWidth={2.5} />
                    </div>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0901 234 567" required
                      className="w-full bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcc00] transition-all placeholder:text-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="email" className="text-sm font-black uppercase text-gray-800 ml-1 tracking-wider">Email <span className="text-[#e94e77]">*</span></label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-800">
                      <Mail size={20} strokeWidth={2.5} />
                    </div>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="nguyenvana@gmail.com" required
                      className="w-full bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcc00] transition-all placeholder:text-gray-400 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>

                {/* Chức vụ */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="job" className="text-sm font-black uppercase text-gray-800 ml-1 tracking-wider">Chuyên môn / Khối lớp</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-800 z-10">
                      <Briefcase size={20} strokeWidth={2.5} />
                    </div>
                    <select id="job" name="job" value={formData.job} onChange={handleInputChange}
                      className="w-full bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl py-3 pl-12 pr-10 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcc00] transition-all appearance-none shadow-[4px_4px_0px_rgba(0,0,0,0.1)] relative z-0"
                    >
                      <option value="" disabled className="text-gray-500">Bấm để chọn...</option>
                      <option value="giáo_viên_mầm_non">Giáo viên Mầm non</option>
                      <option value="giáo_viên_tiểu_học">Giáo viên Tiểu học</option>
                      <option value="giáo_viên_thcs">Giáo viên THCS</option>
                      <option value="giáo_viên_thpt">Giáo viên THPT</option>
                      <option value="khác">Khác / Quản lý giáo dục</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-800">
                      <ChevronDown size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mục tiêu */}
              <div className="space-y-2">
                <label htmlFor="goals" className="text-sm font-black uppercase text-gray-800 ml-1 tracking-wider">Điều thầy cô mong muốn nhất?</label>
                <div className="relative group">
                  <textarea id="goals" name="goals" rows={3} value={formData.goals} onChange={handleInputChange} placeholder="Ví dụ: Muốn soạn bài nhanh hơn, muốn tự làm game cho học sinh..."
                    className="w-full bg-[#fdfbf7] border-4 border-gray-800 rounded-2xl py-4 px-4 text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ffcc00] transition-all placeholder:text-gray-400 resize-none shadow-[4px_4px_0px_rgba(0,0,0,0.1)] leading-relaxed"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit"
                  className="w-full relative inline-flex items-center justify-center px-8 py-5 font-black text-xl md:text-2xl uppercase tracking-wider border-4 border-gray-800 rounded-2xl transition-all duration-200 active:translate-x-[4px] active:translate-y-[4px] hover:-translate-y-1 bg-[#e94e77] text-white shadow-[6px_6px_0px_#1f2937] hover:shadow-[8px_8px_0px_#1f2937] active:shadow-none"
                >
                  THANH TOÁN GIỮ CHỖ <ArrowRight className="ml-3 font-black" size={28} strokeWidth={3} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mt-4 font-bold bg-gray-100 py-2 rounded-xl border-2 border-dashed border-gray-300">
                <ShieldCheck size={18} className="text-[#45b596]" strokeWidth={2.5} />
                <span>Thông tin được bảo mật tại Google Cloud.</span>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Column (Benefits) */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-8 lg:mt-32">

          {/* Lợi ích khóa học */}
          <div className="bg-[#45b596] border-4 border-gray-800 rounded-3xl p-8 shadow-[8px_8px_0px_#1f2937] transform rotate-1">
            <Tape className="-top-3 left-10 transform -rotate-2 bg-[#ffcc00]" />
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase drop-shadow-[2px_2px_0px_#1a1a1a]">
              Đặc Quyền
            </h3>

            <ul className="space-y-6 bg-white p-6 border-4 border-gray-800 rounded-2xl shadow-inner">
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5"><CheckCircle2 size={24} className="text-[#e94e77]" strokeWidth={3} /></div>
                <div>
                  <h4 className="font-black text-lg text-gray-800 uppercase mb-1">Cầm tay chỉ việc</h4>
                  <p className="font-bold text-gray-600 leading-relaxed">Hỗ trợ trực tiếp trên máy.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5"><CheckCircle2 size={24} className="text-[#e94e77]" strokeWidth={3} /></div>
                <div>
                  <h4 className="font-black text-lg text-gray-800 uppercase mb-1">Tài nguyên chuẩn</h4>
                  <p className="font-bold text-gray-600 leading-relaxed">Mẫu Prompt Form SKKN.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="shrink-0 mt-0.5"><CheckCircle2 size={24} className="text-[#e94e77]" strokeWidth={3} /></div>
                <div>
                  <h4 className="font-black text-lg text-gray-800 uppercase mb-1">Không cần Code</h4>
                  <p className="font-bold text-gray-600 leading-relaxed">Đóng gói Web trọn vẹn.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#ffcc00] border-4 border-gray-800 rounded-3xl p-6 shadow-[8px_8px_0px_#e94e77] text-center transform -rotate-2">
            <Sparkles className="mx-auto text-[#2a3b8f] mb-4" size={48} strokeWidth={2} />
            <h3 className="font-black text-3xl uppercase text-gray-900 leading-tight">Chỉ còn <span className="text-[#e94e77] bg-white px-2 border-2 border-gray-800 rounded-lg">15</span> suất <br /> Early Bird!</h3>
          </div>

        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9, y: 50, rotate: 2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.9, y: 50, rotate: 2 }}
              className="bg-[#fdfbf7] border-4 border-gray-800 rounded-[2rem] p-6 md:p-8 max-w-md w-full shadow-[16px_16px_0px_#2a3b8f] relative overflow-hidden"
            >
              <Tape className="-top-4 left-1/2 -translate-x-1/2 bg-[#e94e77]" />

              <div className="flex items-center justify-center gap-3 mb-6 mt-2 relative z-10">
                <h3 className="text-3xl font-black text-gray-800 tracking-tight uppercase" style={{ textShadow: '2px 2px 0px #ffcc00' }}>Xác nhận</h3>
              </div>

              <p className="text-gray-700 font-bold text-center mb-6 leading-relaxed relative z-10">
                Thầy cô vui lòng kiểm tra lại <b>Email</b> và <b>Số điện thoại</b> để chúng em gửi vé tham gia nhé!
              </p>

              <div className="bg-white border-4 border-gray-800 rounded-2xl p-5 mb-6 space-y-4 shadow-[inset_0px_4px_0px_rgba(0,0,0,0.05)] relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-gray-500 font-black uppercase tracking-wider">Họ và tên:</span>
                  <span className="text-gray-900 font-bold text-lg">{formData.fullName}</span>
                </div>
                <div className="h-[2px] w-full border-t-2 border-dashed border-gray-300"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-gray-500 font-black uppercase tracking-wider">Email:</span>
                  <span className="text-[#2a3b8f] font-bold text-lg">{formData.email}</span>
                </div>
                <div className="h-[2px] w-full border-t-2 border-dashed border-gray-300"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-gray-500 font-black uppercase tracking-wider">Số điện thoại:</span>
                  <span className="text-gray-900 font-bold text-lg">{formData.phone}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-start gap-3 p-3 mb-6 bg-[#ff7e67] border-4 border-gray-800 rounded-xl relative z-10">
                  <AlertTriangle className="text-gray-900 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-gray-900 font-bold">{errorMessage}</p>
                </div>
              )}

              <div className="flex flex-col-reverse md:flex-row gap-4 mt-8 relative z-10">
                <button onClick={() => { setShowModal(false); setErrorMessage(''); }} disabled={isSubmitting}
                  className="w-full md:w-1/3 py-3 px-4 rounded-xl border-4 border-gray-800 text-gray-800 hover:bg-gray-200 font-black uppercase transition-colors disabled:opacity-50 active:translate-y-1 bg-white"
                >
                  Sửa lại
                </button>
                <button onClick={handleConfirm} disabled={isSubmitting}
                  className="w-full md:w-2/3 py-3 px-4 rounded-xl border-4 border-gray-800 bg-[#45b596] hover:bg-[#3ca386] text-white font-black uppercase transition-all shadow-[4px_4px_0px_#1f2937] hover:shadow-[2px_2px_0px_#1f2937] hover:translate-y-[2px] active:translate-y-1 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN!'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
