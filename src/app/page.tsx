"use client";
import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  Rocket, BookOpen, Brain, Gamepad2, Users, Target, 
  Trophy, Smile, Clock, CheckCircle2, AlertTriangle, 
  MonitorPlay, Calendar, MapPin, Phone, Globe, ChevronRight,
  FlaskConical, Sparkles, Palette, PenTool, Lightbulb, Link2, DownloadCloud
} from 'lucide-react';

// --- CONFIG BẢNG MÀU RETRO ---
const theme = {
  navy: '#2a3b8f',
  pink: '#e94e77',
  yellow: '#ffcc00',
  teal: '#45b596',
  orange: '#ff7e67',
  bg: '#fdfbf7', // Màu giấy cream
  dark: '#1f2937'
};

// --- ANIMATION VARIANTS ---
const fadeInUp: any = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.4, duration: 0.8 } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

// --- REUSABLE UI ELEMENTS ---
// Miếng băng dính giấy
const Tape: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`absolute w-24 h-8 bg-[#e94e77]/90 border-4 border-gray-800 opacity-90 backdrop-blur-sm z-20 ${className}`} 
       style={{ boxShadow: '2px 2px 0px rgba(0,0,0,0.2)' }} />
);

interface FunkyButtonProps {
  children: React.ReactNode;
  href: string;
  bgClass?: string;
  shadowColor?: string;
  textColor?: string;
  className?: string;
  target?: string;
}

const FunkyButton: React.FC<FunkyButtonProps> = ({ children, href, bgClass = "bg-[#e94e77]", shadowColor = "#2a3b8f", textColor="text-white", className="", target }) => (
  <a href={href} 
     target={target}
     className={`relative inline-flex items-center justify-center px-6 py-3 md:px-8 md:py-4 font-black text-base md:text-xl uppercase tracking-wider border-4 border-gray-800 rounded-2xl transition-all duration-200 active:translate-x-[6px] active:translate-y-[6px] hover:-translate-y-1 ${bgClass} ${textColor} ${className}`}
     style={{ boxShadow: `6px 6px 0px ${shadowColor}`, '--tw-shadow-color': shadowColor } as React.CSSProperties}
     onMouseDown={(e) => e.currentTarget.style.boxShadow = '0px 0px 0px transparent'}
     onMouseUp={(e) => e.currentTarget.style.boxShadow = `6px 6px 0px ${shadowColor}`}
     onMouseLeave={(e) => e.currentTarget.style.boxShadow = `6px 6px 0px ${shadowColor}`}
  >
    {children}
  </a>
);

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: string;
  color?: string;
  shadowColor?: string;
  align?: "center" | "left";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, color = theme.navy, shadowColor = theme.yellow, align="center" }) => (
  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={`mb-16 relative z-10 ${align === 'center' ? 'text-center flex flex-col items-center' : 'text-left flex flex-col items-start'}`}>
    {subtitle && (
      <span className="inline-block bg-[#1f2937] text-white py-2 px-6 rounded-full text-sm font-black tracking-widest uppercase mb-6 border-2 border-gray-800 transform -rotate-2 shadow-[4px_4px_0px_#e94e77]">
        {subtitle}
      </span>
    )}
    <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-[1.1] text-gray-800"
        style={{ textShadow: `4px 4px 0px ${shadowColor}, -1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937, 1px 1px 0 #1f2937` }}>
      {title}
    </h2>
  </motion.div>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="font-sans text-gray-800 bg-[#fdfbf7] antialiased selection:bg-[#ffcc00] selection:text-gray-900 overflow-x-hidden relative">
      {/* Background Texture overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply" />
      
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-2 bg-[#e94e77] origin-left z-50 border-b-2 border-gray-800" style={{ scaleX }} />

      {/* HEADER SECTION */}
      <header className="fixed top-4 left-0 right-0 z-[60] px-4 md:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Logo */}
          <div className="bg-white px-3 py-2 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#2a3b8f] transform -rotate-2 hover:rotate-0 transition-transform">
            <a href="#">
              <img src="/images/logo-xanh.png" alt="Logo CES" className="h-8 md:h-10 object-contain" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937]">
            {[
              { label: 'Thực Trạng', href: '#thuc-trang' },
              { label: 'Giải Pháp', href: '#giai-phap' },
              { label: 'Đối Tượng', href: '#doi-tuong' },
              { label: 'Lộ Trình', href: '#lo-trinh' },
              { label: 'Chuyên Gia', href: '#chuyen-gia' },
            ].map((item, idx) => (
              <a key={idx} href={item.href} className="font-black uppercase text-sm md:text-base px-4 py-2 hover:bg-[#ffcc00] rounded-xl transition-colors text-gray-800 border-2 border-transparent hover:border-gray-800">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Header CTA */}
          <FunkyButton href="/register" bgClass="bg-[#e94e77]" shadowColor="#1f2937" className="!px-6 !py-2 text-sm md:text-base pointer-events-auto transform rotate-2">
            ĐĂNG KÝ
            <Rocket className="ml-2 w-4 h-4 md:w-5 md:h-5 animate-pulse" />
          </FunkyButton>
        </div>
      </header>

      {/* 1. HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-4 md:px-8 border-b-4 border-gray-800 overflow-hidden bg-[#fdfbf7]">
          {/* Abstract Decorative Shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#ffcc00] rounded-full border-4 border-gray-800 animate-[bounce_5s_infinite]" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-[#45b596] rotate-45 border-4 border-gray-800" />
        <div className="absolute top-32 right-10 w-40 h-40 bg-[#e94e77] rounded-[2rem] transform rotate-12 border-4 border-gray-800" />
        <div className="absolute bottom-32 right-20 w-16 h-16 bg-[#2a3b8f] rounded-full border-4 border-gray-800" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-white px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#45b596] font-black uppercase flex items-center gap-2 transform -rotate-2">
                <Target className="text-[#e94e77] w-[18px] h-[18px] md:w-5 md:h-5" /> CESGLOBAL
              </div>
              <div className="bg-white px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#ffcc00] font-black uppercase flex items-center gap-2 transform rotate-2">
                <Calendar className="text-[#2a3b8f] w-[18px] h-[18px] md:w-5 md:h-5" /> 28/03/2026
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative mb-8">
               <Tape className="-top-4 md:-top-6 left-1/4 transform -rotate-3" />
               <Tape className="-top-2 md:-top-4 right-1/4 transform rotate-6 bg-[#45b596]/90" />
               <div className="bg-white p-6 md:p-12 border-4 border-gray-800 rounded-[1.5rem] md:rounded-3xl shadow-[8px_8px_0px_#2a3b8f] md:shadow-[12px_12px_0px_#2a3b8f] transform -rotate-1">
                  <h2 className="text-lg md:text-3xl font-black text-gray-500 mb-2 uppercase tracking-widest">Khóa học thực chiến</h2>
                  <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase leading-[1.2] md:leading-[1] text-gray-800"
                      style={{ textShadow: '4px 4px 0px #ffcc00, 8px 8px 0px #e94e77, -2px -2px 0 #1f2937, 2px -2px 0 #1f2937, -2px 2px 0 #1f2937, 2px 2px 0 #1f2937' }}>
                    Khai Mở<br/>Sức Mạnh AI
                  </h1>
               </div>
            </motion.div>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-2xl font-bold bg-[#ffcc00] border-4 border-gray-800 px-6 py-4 md:px-8 md:py-4 rounded-3xl md:rounded-full shadow-[6px_6px_0px_#1f2937] max-w-3xl transform rotate-1 mb-10 md:mb-12">
              Chương trình ứng dụng Hệ sinh thái Google. <br className="hidden md:block"/> Trợ lý đa năng cho giáo viên kỷ nguyên số!
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <FunkyButton href="/register" bgClass="bg-[#e94e77]" shadowColor="#1f2937" className="!text-xl md:!text-2xl">
                Đăng Ký Ngay <Rocket className="ml-2 w-5 h-5 md:w-6 md:h-6 animate-pulse" />
              </FunkyButton>
              <FunkyButton href="#thuc-trang" bgClass="bg-white" textColor="text-gray-800" shadowColor="#45b596">
                Khám Phá
              </FunkyButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. VẤN ĐỀ THỰC TRẠNG */}
      <section id="thuc-trang" className="py-24 px-4 md:px-8 border-b-4 border-gray-800 bg-[#ffcc00] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent bg-[length:20px_20px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading title="Thầy cô có đang kiệt sức?" subtitle="1. Thực Trạng" shadowColor={theme.pink} />
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, color: "bg-[#e94e77]", title: "Ám ảnh hồ sơ", desc: "Áp lực nghĩ đề tài, viết SKKN dài hàng chục trang.", rot: "-rotate-2" },
              { icon: Clock, color: "bg-[#2a3b8f]", title: "Cạn kiệt thời gian", desc: "Mất hàng giờ tìm ảnh, làm Flashcard, bài giảng.", rot: "rotate-2" },
              { icon: AlertTriangle, color: "bg-[#45b596]", title: "Ngợp tài liệu", desc: "Mệt mỏi khi đọc, tóm tắt giáo trình khô khan.", rot: "-rotate-1" },
              { icon: MonitorPlay, color: "bg-[#ff7e67]", title: "Rào cản Code", desc: "Muốn tạo Game học tập nhưng không biết lập trình.", rot: "rotate-1" },
              { icon: Users, color: "bg-[#2a3b8f]", title: "Học sinh chán", desc: "Phương pháp cũ mất hút với Gen Z, Gen Alpha.", rot: "-rotate-3" },
              { icon: Brain, color: "bg-[#e94e77]", title: "Áp lực AI", desc: "Bắt buộc ứng dụng AI nhưng loay hoay không biết bắt đầu.", rot: "rotate-2" }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className={`bg-white w-[90%] md:w-full mx-auto p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border-4 border-gray-800 shadow-[6px_6px_0px_rgba(0,0,0,0.8)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.8)] transform ${item.rot} relative hover:-translate-y-2 transition-transform`}>
                <Tape className="-top-4 left-1/2 -translate-x-1/2" />
                <div className={`w-12 h-12 md:w-16 md:h-16 ${item.color} rounded-full border-4 border-gray-800 flex items-center justify-center mb-4 md:mb-6 shadow-[3px_3px_0px_#1f2937] md:shadow-[4px_4px_0px_#1f2937] transform -rotate-12`}>
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-2 md:mb-3 uppercase tracking-wide">{item.title}</h3>
                <p className="text-gray-700 font-medium text-base md:text-lg border-t-2 border-dashed border-gray-300 pt-3">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. GIẢI PHÁP TỪ GOOGLE AI */}
      <section id="giai-phap" className="py-24 px-4 md:px-8 border-b-4 border-gray-800 bg-[#45b596]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Giải Pháp Đột Phá Từ Google AI" subtitle="2. Vũ Khí Tối Thượng" shadowColor={theme.yellow} />
          
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid md:grid-cols-2 gap-10">
            {[
              { icon: PenTool, color: theme.pink, title: "Tự động hóa", desc: "Viết SKKN chuẩn format, lên giáo án chỉ trong vài phút." },
              { icon: Palette, color: theme.yellow, title: "Sáng tạo ảnh", desc: "Tự tạo hình ảnh, flashcard 3D sinh động không cần biết thiết kế." },
              { icon: Brain, color: theme.navy, title: "Bộ não thứ 2", desc: "Biến tài liệu thành Sơ đồ tư duy, Podcast học tập cuốn hút." },
              { icon: Gamepad2, color: theme.orange, title: "Kiến tạo Game", desc: "Tự làm Mini-game tương tác với học sinh và đưa lên Web chỉ bằng vài câu lệnh." }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-[#fdfbf7] w-[90%] md:w-full mx-auto p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border-4 border-gray-800 relative group flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start text-center md:text-left"
                   style={{ boxShadow: `6px 6px 0px ${item.color}` }}>
                
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-gray-800 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300"
                     style={{ boxShadow: `4px 4px 0px ${item.color}` }}>
                  <item.icon className="w-8 h-8 md:w-10 md:h-10" color={item.color} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-2 md:mb-3 uppercase" style={{ color: item.color, textShadow: '1px 1px 0 #1f2937, -1px -1px 0 #1f2937, 1px -1px 0 #1f2937, -1px 1px 0 #1f2937' }}>{item.title}</h3>
                  <p className="text-gray-800 font-bold text-base md:text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4 & 5. ĐỐI TƯỢNG & PHƯƠNG PHÁP */}
      <section id="doi-tuong" className="py-24 px-4 md:px-8 border-b-4 border-gray-800 bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionHeading title="Ai Nên Tham Gia?" subtitle="3. Đối Tượng" align="left" shadowColor={theme.teal} />
            <div className="space-y-6 mt-8">
              {[
                { title: "Giáo viên các cấp (MN, TH, THCS, THPT)", desc: "Làm mới bài giảng, giảm tải áp lực." },
                { title: "Giảng viên, Trợ giảng", desc: "Tóm tắt tài liệu, tạo câu hỏi trắc nghiệm." },
                { title: "Cán bộ quản lý giáo dục", desc: "Tối ưu hóa quy trình, đánh giá chất lượng." },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 md:gap-4 items-center md:items-start text-center md:text-left bg-white w-[90%] md:w-full mx-auto p-5 md:p-6 rounded-2xl border-4 border-gray-800 shadow-[6px_6px_0px_#2a3b8f] transform hover:-translate-y-1 transition-transform">
                  <div className="bg-[#ffcc00] p-1.5 md:p-1 border-4 border-gray-800 rounded-xl transform -rotate-6 shrink-0">
                    <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-gray-800" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg md:text-xl uppercase mb-1 md:mb-1">{item.title}</h4>
                    <p className="text-gray-700 text-sm md:text-base font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-6 md:mt-8 bg-[#e94e77] text-white p-4 md:p-6 w-[90%] md:w-full mx-auto border-4 border-gray-800 shadow-[6px_6px_0px_#ffcc00] font-black text-base md:text-lg transform rotate-2 text-center">
                <Lightbulb className="inline mr-2 mb-1" /> HOÀN TOÀN KHÔNG YÊU CẦU BIẾT LẬP TRÌNH!
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} 
               className="bg-[#2a3b8f] w-[95%] md:w-full mx-auto p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] text-white border-4 border-gray-800 shadow-[8px_8px_0px_#ff7e67] md:shadow-[12px_12px_0px_#ff7e67] relative mt-12 lg:mt-0 max-md:text-center">
             <Tape className="-top-5 right-10 transform rotate-6 bg-[#ffcc00]" />
             <Tape className="-top-5 right-20 transform -rotate-3 bg-[#45b596]" />
             
            <span className="inline-block bg-[#ffcc00] text-gray-900 py-1.5 px-4 text-xs md:text-sm font-black tracking-widest uppercase mb-6 border-2 border-gray-800 transform rotate-2">
              4. Triết lý đào tạo
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight" style={{ textShadow: '3px 3px 0px #1f2937' }}>
              Học Thực Chiến <br/><span className="text-[#e94e77]" style={{ textShadow: '3px 3px 0px #1f2937, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white' }}>Ra Sản Phẩm</span>
            </h2>
            
            <div className="grid gap-4 md:gap-6">
              {[
                { icon: Target, text: "Thực hành là nền tảng: Cầm tay chỉ việc trên máy cá nhân." },
                { icon: Trophy, text: "Học xong có sản phẩm: SKKN, Flashcard, Podcast, Web Game." },
                { icon: Smile, text: "Vui vẻ & Tương tác: Phá bỏ e ngại công nghệ." },
                { icon: Users, text: "Ngôn ngữ bình dân: Sư phạm, dễ hiểu." }
              ].map((item, i) =>(
                 <div key={i} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 bg-white/10 p-4 rounded-xl border-2 border-white/20">
                  <div className="bg-[#45b596] p-2 rounded-full border-2 border-gray-800 shrink-0"><item.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" /></div>
                  <p className="font-bold text-base md:text-lg">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. LỘ TRÌNH 4 BUỔI */}
      <section id="lo-trinh" className="py-24 px-4 md:px-8 border-b-4 border-gray-800 bg-[#e94e77] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           {/* Abstract wavy lines background */}
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="#000" strokeWidth="2" />
              <path d="M0,70 Q25,45 50,70 T100,70" fill="none" stroke="#000" strokeWidth="2" />
           </svg>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHeading title="Lộ trình 4 buổi" subtitle="6. Chuyển đổi chuyên sâu" shadowColor={theme.yellow} />
          
          <div className="space-y-16">
            {[
              {
                buoi: "BUỔI 1", title: "KHAI MỞ GEMINI", color: "bg-[#ffcc00]",
                content: ["Làm chủ Nghệ thuật Prompt riêng cho giáo viên.", "Dùng Deep Research xây dựng dàn ý SKKN chuẩn.", "Sửa bài trực tiếp, dùng Imagen 3 tạo Flashcard 3D.", "Tạo Chatbot cá nhân hóa."],
                product: "1 Dàn ý SKKN, 1 Bộ Flashcard & 1 Chatbot."
              },
              {
                buoi: "BUỔI 2", title: "NOTEBOOKLM - NÃO THỨ 2", color: "bg-[#45b596]",
                content: ["Biến PDF thành trợ lý: Tóm tắt 100% chính xác.", "Audio Overview: Tạo Podcast 2 MC cho học sinh.", "Sơ đồ tư duy, Mốc thời gian làm Infographic."],
                product: "1 Sổ tay học tập số (FAQ, Podcast, Infographic)."
              },
              {
                buoi: "BUỔI 3", title: "AI STUDIO - TẠO GAME", color: "bg-[#00b0ff]",
                content: ["Lên ý tưởng game", "Biến ý tưởng thành thực tế", "Nghiệm thu, kiểm tra và sửa lỗi hệ thống"],
                product: "1 Mini-game giáo dục chạy trên máy tính."
              },
              {
                buoi: "BUỔI 4", title: "ĐƯA LÊN WEB", color: "bg-[#ff7e67]",
                content: ["Cập nhật tính năng cho game: Tính điểm, đếm ngược, hiệu ứng …", "Tạo github, deploy: đưa game lên web"],
                product: "1 Link Web Game hoạt động thực tế!"
              }
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 50, rotate: idx % 2 === 0 ? -2 : 2 }} whileInView={{ opacity: 1, y: 0, rotate: idx % 2 === 0 ? -1 : 1 }} viewport={{ once: true, margin: "-100px" }}
                className="bg-[#fdfbf7] w-[90%] md:w-full mx-auto p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] border-4 border-gray-800 flex flex-col md:flex-row gap-4 md:gap-6 relative"
                style={{ boxShadow: `8px 8px 0px ${theme.navy}` }}>
                
                <Tape className="-top-4 right-6 md:right-10" />
                
                {/* Badge Buổi */}
                <div className="shrink-0 max-md:flex max-md:justify-center">
                  <div className={`${item.color} border-4 border-gray-800 text-gray-900 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl transform -rotate-3 shadow-[4px_4px_0px_#1f2937] inline-flex items-center justify-center font-black text-xl md:text-2xl`}>
                    {item.buoi}
                  </div>
                </div>
                
                <div className="flex-1 max-md:text-center">
                  <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 uppercase tracking-tight text-[#2a3b8f]" style={{ textShadow: '2px 2px 0px #ffcc00' }}>{item.title}</h3>
                  <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 font-bold text-base md:text-lg text-gray-700 text-left">
                    {item.content.map((li, i) => (
                      <li key={i} className="flex gap-2 md:gap-3 items-start">
                        <span className="shrink-0 mt-1"><Sparkles className="w-5 h-5 text-[#e94e77] fill-current" /></span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-gray-800 text-white p-4 md:p-5 rounded-xl border-4 border-[#ffcc00] transform rotate-1 text-left">
                    <span className="font-black text-sm md:text-base uppercase text-[#ffcc00] flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 md:w-5 md:h-5" /> Sản phẩm thu về:
                    </span>
                    <p className="font-bold text-base md:text-lg">{item.product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CHUYÊN GIA (GIỮ NGUYÊN CODE TỪ TRƯỚC) */}
      <section id="chuyen-gia" className="bg-white border-b-4 border-gray-800">
        <div className="max-w-4xl mx-auto relative pt-16 pb-20 px-4">
          {/* Funky Background Frame */}
          <div className="absolute inset-4 md:inset-8 bg-[#45b596] transform rotate-2 rounded-3xl border-4 border-gray-800 shadow-[8px_8px_0px_#ffcc00]"></div>
          
          <div className="relative bg-[#f9f6ea] w-[95%] md:w-full mx-auto p-6 md:p-16 rounded-[2rem] md:rounded-3xl border-4 border-gray-800 text-center flex flex-col items-center">
            
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 bg-yellow-200 transform -rotate-3 border-2 border-gray-800 z-50 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]"></div>
            
            <div className="mb-12 relative">
              <span className="inline-block bg-[#e94e77] text-white py-1.5 px-6 rounded-full text-xs md:text-sm font-black tracking-widest uppercase mb-4 shadow-[3px_3px_0px_#2a3b8f] border-2 border-[#2a3b8f] transform -rotate-1">
                5. GIẢNG VIÊN
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-[#2a3b8f] tracking-tight uppercase" style={{ textShadow: '3px 3px 0px #ffcc00, -1px -1px 0 #1a1a1a, 1px -1px 0 #1a1a1a, -1px 1px 0 #1a1a1a, 1px 1px 0 #1a1a1a' }}>
                Đội ngũ chuyên gia
              </h2>
            </div>

            {/* Avatar Illustration Composite */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 group">
              <div className="absolute inset-0 bg-[#e94e77] rounded-full transform -rotate-6 border-4 border-gray-800 transition-transform group-hover:rotate-0"></div>
              <div className="absolute inset-2 bg-[#ffcc00] rounded-full transform rotate-3 border-4 border-gray-800"></div>
              
              <div className="absolute inset-2 bg-[#45b596] rounded-full overflow-hidden flex items-center justify-center border-4 border-gray-800">
                <img src="/images/kim-anh.png" alt="Giảng viên Nguyễn Kim Anh" className="w-full h-full object-cover object-top relative z-10 scale-[1.3] origin-top translate-y-1" />
              </div>

              <div className="absolute bottom-6 -right-2 z-20 transform rotate-[15deg] group-hover:rotate-0 transition-all duration-300">
                <div className="bg-white rounded-full p-2 border-4 border-gray-800 shadow-[4px_4px_0px_#e94e77]">
                  <FlaskConical className="w-8 h-8 md:w-10 md:h-10 text-gray-800" fill="#e94e77" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute top-4 -left-4 z-20 text-[#e94e77] animate-pulse">
                 <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-gray-800 drop-shadow-[2px_2px_0px_#1a1a1a]" fill="currentColor" strokeWidth={2} />
              </div>
            </div>

            <div className="bg-[#2a3b8f] text-white border-4 border-[#ffcc00] px-6 py-2 md:px-8 md:py-3 transform rotate-1 relative shadow-[6px_6px_0px_rgba(0,0,0,0.8)] mb-6 md:mb-8 outline outline-4 outline-gray-800">
               <h3 className="text-xl md:text-3xl font-black tracking-widest uppercase text-center" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>Nguyễn Kim Anh</h3>
               <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-gray-300 rounded-full border border-gray-600"></div>
               <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full border border-gray-600"></div>
               <div className="absolute bottom-1.5 left-1.5 w-2 h-2 bg-gray-300 rounded-full border border-gray-600"></div>
               <div className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full border border-gray-600"></div>
            </div>

            <p className="text-sm md:text-xl text-gray-800 font-bold max-w-xl leading-relaxed bg-white p-4 md:p-6 rounded-2xl border-4 border-gray-800 shadow-[6px_6px_0px_#45b596]">
              Chuyên gia Đào tạo, Thiết kế trải nghiệm học tập AI <br className="hidden md:block"/> dành riêng cho Giáo Viên
            </p>

            <div className="absolute top-12 right-12 text-[#2a3b8f] opacity-10 transform rotate-12 pointer-events-none">
              <Palette className="w-12 h-12 md:w-20 md:h-20" strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-12 left-12 text-[#e94e77] opacity-10 transform -rotate-12 pointer-events-none">
              <BookOpen className="w-12 h-12 md:w-20 md:h-20" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8. PRICING & CTA */}
      <section id="register" className="py-24 px-4 md:px-8 bg-[#2a3b8f] relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl lg:text-[2.75rem] xl:text-6xl font-black mb-8 md:mb-10 leading-[1.2] text-white uppercase" style={{ textShadow: '4px 4px 0px #e94e77' }}>
              <span className="whitespace-nowrap">Đầu tư một lần,</span> <br/>
              <span className="text-[#ffcc00]" style={{ textShadow: '4px 4px 0px #1f2937' }}>giải phóng mãi mãi!</span>
            </h2>
            
            <div className="bg-[#fdfbf7] w-[90%] md:w-full mx-auto p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border-4 border-gray-800 shadow-[6px_6px_0px_#45b596] md:shadow-[8px_8px_0px_#45b596] mb-8 transform -rotate-1">
              <Tape className="-top-4 right-10" />
              <h4 className="text-xl md:text-2xl font-black mb-4 md:mb-6 uppercase border-b-4 border-gray-800 pb-2 inline-block">Giá trị nhận được:</h4>
              <ul className="space-y-3 md:space-y-4 font-bold text-base md:text-lg text-gray-800">
                <li className="flex items-start gap-2 md:gap-3"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#e94e77] mt-1 shrink-0" strokeWidth={3} /> Tiết kiệm 80% thời gian soạn bài.</li>
                <li className="flex items-start gap-2 md:gap-3"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#e94e77] mt-1 shrink-0" strokeWidth={3} /> Sở hữu kho Công cụ cá nhân.</li>
                <li className="flex items-start gap-2 md:gap-3"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#e94e77] mt-1 shrink-0" strokeWidth={3} /> "Giáo viên công nghệ" tiên phong.</li>
              </ul>
            </div>

            <div className="bg-[#1f2937] w-[90%] md:w-full mx-auto p-5 md:p-6 rounded-2xl border-4 border-[#ffcc00] text-white font-bold text-sm md:text-base transform rotate-1">
              <span className="text-[#ffcc00] uppercase block mb-2">⚠ Yêu cầu chuẩn bị:</span>
              - 1 Laptop cá nhân có kết nối Wifi.<br/>
              - Đã đăng nhập tài khoản Google.
            </div>
          </motion.div>

          {/* Pricing Ticket */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-[#ffcc00] p-6 md:p-12 w-[90%] md:w-full mx-auto rounded-[1.5rem] md:rounded-[2rem] border-4 border-gray-800 relative text-center"
            style={{ boxShadow: '8px 8px 0px #e94e77' }}>
            
            {/* Dashed inner border to look like a coupon */}
            <div className="absolute inset-4 border-4 border-dashed border-gray-800 rounded-xl pointer-events-none" />
            
            <div className="absolute -top-6 -right-2 md:-right-6 bg-[#e94e77] text-white px-4 py-2 md:px-6 md:py-4 rounded-full font-black text-lg md:text-xl border-4 border-gray-800 shadow-[4px_4px_0px_#1f2937] transform rotate-12 z-10 animate-pulse">
              CHỈ 50 SUẤT!
            </div>
            
            <div className="relative z-10 py-6">
              <p className="text-gray-800 font-black text-xl md:text-2xl uppercase mb-2">Khoản đầu tư</p>
              <p className="text-gray-600 font-bold mb-4 line-through decoration-4 decoration-[#e94e77] text-lg md:text-xl">Giá gốc: 2.500.000 VNĐ</p>
              
              <div className="text-gray-900 font-black text-5xl md:text-7xl tracking-tighter mb-4" style={{ textShadow: '4px 4px 0px white' }}>
                449<span className="text-3xl md:text-4xl">k</span>
              </div>
              
              <div className="bg-[#1f2937] text-[#ffcc00] inline-block px-4 py-1.5 md:px-6 md:py-2 rounded-xl text-sm md:text-base font-black uppercase tracking-wider border-2 border-gray-800 mb-2 transform -rotate-2">
                HỌC PHÍ ƯU ĐÃI
              </div>
              <p className="text-xs md:text-sm font-bold text-gray-800 mt-2">Trước ngày 18/03/2026</p>
            </div>

            <div className="relative z-10 space-y-3 mb-6 md:mb-8 text-left bg-white p-4 md:p-5 rounded-2xl border-4 border-gray-800 font-black text-sm md:text-base">
              <div className="flex items-center gap-3"><Calendar className="text-[#45b596] w-5 h-5" /> Khai giảng: 28/03/2026</div>
              <div className="flex items-center gap-3"><Clock className="text-[#45b596] w-5 h-5" /> Thứ 4 & Thứ 7 (19h30 - 22h00)</div>
            </div>

            <FunkyButton href="/register" bgClass="bg-[#e94e77]" shadowColor="#1f2937" className="w-full relative z-10 py-4 md:py-6 text-xl md:text-2xl mb-6">
              ĐĂNG KÝ NGAY <Rocket className="ml-2 w-5 h-5 md:w-6 md:h-6 animate-pulse" />
            </FunkyButton>

            <div className="relative z-10 flex flex-col items-center">
              <p className="text-gray-800 font-black mb-3 text-sm md:text-base uppercase bg-white px-4 py-1.5 rounded-xl border-2 border-gray-800 shadow-[2px_2px_0px_#2a3b8f] transform -rotate-2">
                 Hoặc scan QR để đăng ký
              </p>
              <div className="bg-white p-3 rounded-2xl border-4 border-gray-800 shadow-[6px_6px_0px_#e94e77] transform rotate-1 transition-transform hover:scale-105">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://ai-for-teacher-k1.vercel.app/register&margin=10" alt="QR đăng ký khóa học" className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t-8 border-gray-800 py-12 px-4 text-center md:text-left bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-multiply">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 font-black">
          <div className="bg-[#ffcc00] px-6 py-3 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#e94e77] transform -rotate-1">
            <h3 className="text-2xl uppercase text-gray-900 flex items-center gap-2">
              <Target /> CES GLOBAL
            </h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-gray-800">
            <div className="flex items-center justify-center gap-2 bg-[#fdfbf7] border-2 border-gray-800 px-4 py-2 rounded-xl shadow-[2px_2px_0px_#45b596]">
              <MapPin size={20} className="text-[#e94e77]" /> 222 Nguyễn Văn Tuyết, HN
            </div>
            <div className="flex items-center justify-center gap-2 bg-[#fdfbf7] border-2 border-gray-800 px-4 py-2 rounded-xl shadow-[2px_2px_0px_#45b596]">
              <Phone size={20} className="text-[#45b596]" /> 0911.991.288
            </div>
            <a href="https://cesglobal.com.vn/" className="flex items-center justify-center gap-2 bg-[#2a3b8f] text-white border-2 border-gray-800 px-4 py-2 rounded-xl shadow-[2px_2px_0px_#ffcc00] hover:-translate-y-1 transition-transform">
              <Globe size={20} /> cesglobal.com.vn
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}