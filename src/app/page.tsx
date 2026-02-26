"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  RefreshCcw, 
  Terminal, 
  TimerOff, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  LayoutGrid, 
  Zap, 
  Users, 
  Gauge, 
  BrainCircuit, 
  Award, 
  Monitor,
  MousePointer2
} from "lucide-react";
import Link from "next/link";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

// ==========================================
// INTERACTIVE 3D TUBES BACKGROUND COMPONENT
// ==========================================
interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

const TubesBackground = ({ 
  children, 
  className,
  enableClickInteraction = true 
}: TubesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#3b82f6", "#06b6d4", "#8b5cf6"],
            lights: {
              intensity: 150,
              colors: ["#60a5fa", "#22d3ee", "#a78bfa", "#38bdf8"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {};

        window.addEventListener('resize', handleResize);
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    tubesRef.current.tubes.setColors(colors);
    tubesRef.current.tubes.setLightsColors(lightsColors);
  };

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden bg-[#020617]", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-crosshair"
        style={{ touchAction: 'none' }}
      />
      
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020617] to-transparent z-0 pointer-events-none"></div>
      
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// MAIN LANDING PAGE
// ==========================================
export default function App() {
  return (
    <div className="w-full bg-[#0A101E] text-slate-200 font-sans overflow-x-hidden selection:bg-google-blue/30">
      <main className="relative z-10 pt-16">
        {/* HERO SECTION TRANG BỊ TUBES BACKGROUND */}
        <section className="relative w-full h-screen flex flex-col overflow-hidden">
          <TubesBackground className="absolute inset-0 z-0 bg-transparent" enableClickInteraction={true}>
            <div className="container mx-auto px-6 md:px-12 py-20 flex flex-col items-center text-center justify-center h-full max-w-7xl">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-auto inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] uppercase tracking-wider"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-google-blue"></span>
                </span>
                <span>Sẵn sàng cho kỷ nguyên 2026</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="pointer-events-auto text-6xl md:text-7xl lg:text-[80px] font-black text-white tracking-tight leading-[1.1] max-w-5xl drop-shadow-2xl uppercase"
              >
                CHINH PHỤC HỆ SINH THÁI <br/>
                <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#4285F4_0%,#EA4335_33%,#FBBC05_66%,#34A853_100%)] drop-shadow-none">
                  GOOGLE AI
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pointer-events-auto mt-8 text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed drop-shadow-md font-light"
              >
                Xây dựng đội ngũ "nhân sự ảo" tối ưu hiệu suất công việc với 5 buổi học thực chiến theo công thức 30/70.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 pointer-events-auto relative inline-block group"
              >
                {/* HIỆU ỨNG GLOW BACKGROUND CHO BUTTON */}
                <div className="absolute -inset-1 bg-gradient-to-r from-google-blue to-purple-500 rounded-full blur opacity-25 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>

                <Link href="/register" className="inline-flex relative items-center justify-center overflow-hidden px-12 py-5 text-lg font-bold text-white bg-transparent backdrop-blur-md rounded-full border border-white/20 transition-all hover:scale-105 active:scale-95 hover:bg-white/10 shadow-2xl">
                  {/* Lớp phủ sáng khi hover */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 drop-shadow-sm uppercase tracking-wider">Đăng Ký Tham Gia Ngay</span>
                </Link>
              </motion.div>

              {/* Hướng dẫn tương tác chuột */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-google-blue/80 animate-pulse pointer-events-none"
              >
                <MousePointer2 size={16} />
                <span className="text-xs font-medium tracking-widest uppercase">Di chuột & Click vào nền</span>
              </motion.div>
            </div>
          </TubesBackground>
        </section>

        {/* THỐNG KÊ SECTION */}
        <section className="relative z-20 container mx-auto px-6 md:px-12 -mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl mx-auto">
            {[
              { label: "+1.000", sub: "Học Viên", icon: <Users size={24}/>, color: "text-google-blue" },
              { label: "05", sub: "Buổi Học", icon: <BookOpen size={24}/>, color: "text-google-green" },
              { label: "30/70", sub: "Thực Chiến", icon: <Gauge size={24}/>, color: "text-google-red" },
              { label: "100%", sub: "Sản Phẩm", icon: <Award size={24}/>, color: "text-google-yellow" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:bg-white/[0.05] transition-colors shadow-[0_8px_32px_rgba(0,0,0,0.3)] group"
              >
                <div className={`${stat.color} mb-3 drop-shadow-[0_0_8px_currentColor] group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{stat.label}</div>
                <div className="text-xs md:text-sm uppercase tracking-widest text-slate-400 mt-2 font-medium">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PAIN POINTS SECTION */}
        <section id="van-de" className="container mx-auto px-6 md:px-12 py-32 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-google-red/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">BẠN CÓ ĐANG KIỆT SỨC...?</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">Luôn trong trạng thái quá tải nhưng hiệu suất vẫn chưa tương xứng? Thế giới đang thay đổi nhanh chóng bởi AI, và cách làm việc thủ công đang giữ chân bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              { title: "Quá tải thông tin", desc: "Xử lý hàng tá email, báo cáo và tài liệu mỗi ngày khiến bạn không còn thời gian sáng tạo.", icon: <Mail className="text-google-red" size={28} /> },
              { title: "Tác vụ lặp lại", desc: "Mất hàng giờ cho những công việc thủ công không tên, copy-paste khiến hiệu suất trì trệ.", icon: <RefreshCcw className="text-google-yellow" size={28} /> },
              { title: "Thiếu kỹ năng", desc: "Không biết giao tiếp hiệu quả với AI, chỉ dùng như Google Search, kết quả hời hợt.", icon: <Terminal className="text-google-blue" size={28} /> },
              { title: "Áp lực deadline", desc: "Chạy đua với thời gian liên tục mà vẫn không hoàn thành khối lượng giao việc.", icon: <TimerOff className="text-google-green" size={28} /> }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/10 transition-all group shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-8 border border-white/10 group-hover:rotate-12 transition-transform shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="loi-ich" className="container mx-auto px-6 md:px-12 py-32 relative border-y border-white/5 bg-[#0A101E]/50">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-google-blue/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10 w-full max-w-7xl mx-auto">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-google-blue/10 border border-google-blue/20 text-google-blue uppercase tracking-wider text-xs font-bold mb-6">
                <Sparkles size={14} /> Giải Pháp Toàn Diện
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight uppercase tracking-tight">
                BIẾN GOOGLE AI THÀNH <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-cyan-400">CỘNG SỰ ĐẮC LỰC NHẤT</span>
              </h2>
              <p className="text-slate-400 text-xl mb-10 leading-relaxed font-light">Không chỉ là một công cụ chat, Hệ sinh thái Google AI là một nền tảng mạnh mẽ giúp tự động hóa toàn bộ quy trình làm việc của bạn.</p>
              
              <ul className="space-y-6">
                {[
                  "Xử lý vô hạn dữ liệu đa phương tiện với độ chính xác cao nhờ Gemini 1.5 Pro.",
                  "Hệ thống hóa tài liệu nội bộ thành kho tri thức thông minh với NotebookLM.",
                  "Tích hợp và xây dựng quy trình tự động trên Workspace Studio không cần viết code."
                ].map((text, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1.5 flex-shrink-0 w-6 h-6 rounded-full bg-google-green/20 flex items-center justify-center border border-google-green/50 shadow-[0_0_10px_rgba(52,168,83,0.3)]">
                      <CheckCircle2 size={14} className="text-google-green" />
                    </div>
                    <span className="text-slate-300 text-lg leading-relaxed">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-6">
               {[
                 { title: "Gemini AI", desc: "Siêu AI tạo văn bản & mã", icon: <Sparkles className="text-google-blue" size={36}/> },
                 { title: "NotebookLM", desc: "Trợ lý nghiên cứu cá nhân", icon: <BookOpen className="text-google-red" size={36}/> },
                 { title: "Workspace", desc: "Tích hợp Docs, Sheets, Slide", icon: <LayoutGrid className="text-google-yellow" size={36}/> },
                 { title: "Automation", desc: "Luồng công việc tự động", icon: <Zap className="text-google-green" size={36}/> }
               ].map((tool, i) => (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   key={i} 
                   className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 backdrop-blur-xl flex flex-col items-start hover:bg-white/[0.06] hover:-translate-y-2 transition-all shadow-xl group border-l-2 hover:border-l-google-blue"
                 >
                   <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                     {tool.icon}
                   </div>
                   <h4 className="text-xl font-bold text-white mb-2">{tool.title}</h4>
                   <p className="text-sm text-slate-400">{tool.desc}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section id="chuong-trinh" className="container mx-auto px-6 md:px-12 py-32 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-lg">LỘ TRÌNH 5 BUỔI CHINH PHỤC</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">Framework đào tạo Thực Chiến 30/70 - Học viên bắt buộc có sản phẩm ứng dụng ngay sau từng buổi học.</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Đường line chạy dọc */}
            <div className="absolute left-10 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-google-blue via-google-red to-google-green opacity-30 hidden sm:block"></div>

            <div className="space-y-12 relative z-10">
              {[
                { num: "01", title: "Tư duy & Gemini", desc: "Xóa bỏ thói quen Google Search cũ. Nắm vững nghệ thuật Prompting cấu trúc đa chiều và khai thác sức mạnh tối đa của Gemini 1.5 Pro.", color: "text-google-blue" },
                { num: "02", title: "Kho Tri Thức Nội Bộ", desc: "Làm chủ NotebookLM để quản lý hàng ngàn tài liệu công ty. Biến đống PDF, báo cáo rườm rà thành trợ lý giải đáp tức thì.", color: "text-google-red" },
                { num: "03", title: "Tự Động Hóa Dữ Liệu", desc: "Sử dụng API và AppSheet để biến Google Sheets thành Database thu nhỏ, kết nối luồng dữ liệu mà không cần biết code.", color: "text-google-yellow" },
                { num: "04", title: "Workspace Integration", desc: "Tích hợp Generative AI thẳng vào Docs/Gmail hỗ trợ viết email kịch bản, và tự thiết kế Add-on hỗ trợ riêng biệt.", color: "text-google-green" },
                { num: "05", title: "Capstone Project", desc: "Thuyết trình và bàn giao 'Nhân sự ảo'. Demo trực tiếp cách AI agent giải quyết một bài toán cụ thể trong phòng ban của bạn.", color: "text-white" }
              ].map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  key={i} 
                  className={`flex flex-col sm:flex-row items-center gap-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} relative`}
                >
                  {/* Chấm tròn mốc thời gian */}
                  <div className="absolute left-10 sm:left-1/2 -ml-[9px] w-[18px] h-[18px] rounded-full bg-[#0A101E] border-4 border-current z-20 hidden sm:block" style={{ color: ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#ffffff'][i] }}></div>

                  <div className={`w-full sm:w-1/2 ${i % 2 === 0 ? 'sm:text-right sm:pr-12' : 'sm:pl-12 text-left'}`}>
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-all shadow-xl group">
                      <div className={`text-6xl font-black mb-4 opacity-30 group-hover:opacity-100 transition-opacity ${step.color}`}>
                        {step.num}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-slate-400 text-base leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="container mx-auto px-6 md:px-12 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-google-blue/10 via-[#0A101E] to-[#0A101E] rounded-[3rem] border border-white/5 pointer-events-none"></div>
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-wider">ĐẦU RA CAM KẾT</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Bạn mang về bộ giải pháp thực tế, không phải mớ lý thuyết suông.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative z-10">
            {[
              { icon: <Users size={32}/>, label: "Virtual Staff", sub: "Tạo ít nhất 1 AI Agent chuyên mảng" },
              { icon: <Gauge size={32}/>, label: "Efficiency", sub: "Rút ngắn 60% thời gian xử lý tác vụ" },
              { icon: <BrainCircuit size={32}/>, label: "Prompt Master", sub: "Sở hữu thư viện 100+ Prompt mẫu" },
              { icon: <Award size={32}/>, label: "Certification", sub: "Chứng nhận Hệ sinh thái Google AI" }
            ].map((res, i) => (
              <div key={i} className="flex flex-col items-center p-8 bg-black/40 rounded-3xl border border-white/5">
                <div className="text-white mb-6 p-4 rounded-2xl bg-white/10 border border-white/20">{res.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">{res.label}</h4>
                <p className="text-sm text-slate-400 text-center">{res.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="container mx-auto px-6 md:px-12 py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-tr from-google-blue/30 via-google-red/10 to-transparent border border-white/20 relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(66,133,244,0.3)] backdrop-blur-xl"
          >
            {/* Họa tiết lưới trang trí */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 uppercase tracking-tight">
               DẪN ĐẦU HAY BỊ BỎ LẠI?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto relative z-10 font-light leading-relaxed">
              Kỷ nguyên AI đang phân loại rõ ràng: Người biết dùng AI và phần còn lại. <br/>
              Đừng đứng yên. Giới hạn <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-md mx-1">50 học viên</span> khóa đầu tiên.
            </p>
            
            <div className="relative z-10 inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-google-blue via-google-red to-google-yellow rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <Link href="/register" className="relative flex items-center justify-center bg-transparent backdrop-blur-md border border-white/20 px-12 py-6 rounded-full text-xl font-bold text-white transition-all hover:scale-105 active:scale-95 hover:bg-white/5">
                <span className="uppercase tracking-widest">Giữ Chỗ Của Bạn Ngay Hôm Nay</span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400 relative z-10">
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"><Monitor size={16} className="text-google-blue"/> Yêu cầu mang theo Laptop</span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"><Mail size={16} className="text-google-red"/> Cần tài khoản Gmail cá nhân</span>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
