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
  Menu,
  X,
  MousePointer2
} from "lucide-react";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
// Hàm tiện ích để nối các class CSS (thay thế cho thư viện bên ngoài nếu không có sẵn)
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

// Hàm tạo màu ngẫu nhiên cho hiệu ứng Tubes 3D
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
  // Sử dụng any ở đây vì thư viện threejs-components load qua CDN không có sẵn TypeScript types
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Tải động thư viện threejs-components chứa hiệu ứng Tubes1 từ CDN
        // Sử dụng @ts-ignore để bỏ qua cảnh báo của TypeScript về module động
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        // Khởi tạo hiệu ứng trên thẻ canvas
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            // Cấu hình màu sắc mặc định, sử dụng tông màu xanh/tím để hợp với chủ đề AI
            colors: ["#3b82f6", "#06b6d4", "#8b5cf6"],
            lights: {
              intensity: 150,
              colors: ["#60a5fa", "#22d3ee", "#a78bfa", "#38bdf8"]
            }
          }
        });

        tubesRef.current = app;
        setIsLoaded(true);

        const handleResize = () => {
          // Thư viện thường tự xử lý resize, nhưng ta giữ listener này cho khả năng mở rộng
        };

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

  // Hàm xử lý tương tác click để đổi màu ngẫu nhiên
  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    // Tạo màu mới tông ngẫu nhiên nhưng vẫn giữ sắc thái tươi sáng
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
      {/* Thẻ canvas chứa bối cảnh WebGL 3D */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-crosshair"
        style={{ touchAction: 'none' }}
      />
      
      {/* Lớp mờ (Gradient Overlay) để làm dịu phần viền dưới, giúp chuyển tiếp mượt mà sang nội dung bên dưới */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#020617] to-transparent z-0 pointer-events-none"></div>
      
      {/* Lớp chứa nội dung (Children Overlay). 
          Quan trọng: Sử dụng pointer-events-none ở container và pointer-events-auto ở các thẻ con cần tương tác */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// NAVIGATION COMPONENT
// ==========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#020617]/80 backdrop-blur-md border-b border-blue-500/20 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer">
          <Sparkles className="text-blue-500" size={28} />
          <span className="text-xl font-bold text-white tracking-tight">Google AI <span className="text-blue-500">2026</span></span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 pointer-events-auto">
          <a href="#chuong-trinh" className="text-sm text-slate-300 hover:text-white transition-colors">Chương Trình</a>
          <a href="#van-de" className="text-sm text-slate-300 hover:text-white transition-colors">Vấn Đề</a>
          <a href="#loi-ich" className="text-sm text-slate-300 hover:text-white transition-colors">Lợi Ích</a>
        </div>

        <div className="hidden md:flex items-center gap-4 pointer-events-auto">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Đăng Nhập</button>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Đăng Ký Ngay
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-slate-300 pointer-events-auto" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 pointer-events-auto">
          <a href="#chuong-trinh" className="text-slate-300" onClick={() => setIsOpen(false)}>Chương Trình</a>
          <a href="#van-de" className="text-slate-300" onClick={() => setIsOpen(false)}>Vấn Đề</a>
          <a href="#loi-ich" className="text-slate-300" onClick={() => setIsOpen(false)}>Lợi Ích</a>
          <hr className="border-white/10" />
          <button className="text-left font-medium text-slate-300">Đăng Nhập</button>
          <button className="py-3 text-center font-semibold text-white bg-blue-600 rounded-lg shadow-lg">
            Đăng Ký Ngay
          </button>
        </div>
      )}
    </nav>
  );
};

// ==========================================
// MAIN LANDING PAGE
// ==========================================
export default function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-blue-500/30">
      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION TRANG BỊ TUBES BACKGROUND */}
        <section className="relative w-full min-h-[100vh] flex flex-col">
          <TubesBackground className="absolute inset-0 z-0" enableClickInteraction={true}>
            <div className="container mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center justify-center h-full">
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6 backdrop-blur-md cursor-default"
              >
                <Sparkles size={16} />
                <span>Sẵn sàng cho kỷ nguyên 2026</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="pointer-events-auto cursor-default text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
              >
                CHINH PHỤC HỆ SINH THÁI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
                  GOOGLE AI
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="pointer-events-auto cursor-default mt-6 text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
              >
                Xây dựng đội ngũ "nhân sự ảo" tối ưu hiệu suất công việc với 5 buổi học thực chiến theo công thức 30/70.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-10 pointer-events-auto"
              >
                <button className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                  Đăng Ký Tham Gia Ngay
                </button>
              </motion.div>

              {/* Hướng dẫn tương tác chuột */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-8 flex items-center gap-2 text-blue-400/70 animate-pulse pointer-events-none"
              >
                <MousePointer2 size={18} />
                <span className="text-sm font-medium tracking-wide">Di chuột & Click để tương tác với không gian 3D</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl pointer-events-auto"
              >
                {[
                  { label: "+1k", sub: "Học viên", icon: <Users size={20}/> },
                  { label: "5", sub: "Buổi học", icon: <BookOpen size={20}/> },
                  { label: "30/70", sub: "Lý thuyết / Thực chiến", icon: <Gauge size={20}/> },
                  { label: "100%", sub: "Có sản phẩm", icon: <Award size={20}/> }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:bg-black/60 transition-colors cursor-default">
                    <div className="text-blue-400 mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white">{stat.label}</div>
                    <div className="text-sm text-slate-400 mt-1">{stat.sub}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </TubesBackground>
        </section>

        {/* PAIN POINTS SECTION */}
        <section id="van-de" className="container mx-auto px-6 md:px-12 py-24 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">BẠN CÓ ĐANG KIỆT SỨC...?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Thế giới đang thay đổi nhanh chóng, và những phương pháp cũ đang khiến bạn bị bỏ lại phía sau.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Quá tải thông tin", desc: "Xử lý hàng tá email, báo cáo và tài liệu mỗi ngày khiến bạn không còn thời gian sáng tạo.", icon: <Mail className="text-red-400" size={32} /> },
              { title: "Tác vụ lặp lại", desc: "Mất hàng giờ cho những công việc thủ công không tên, khiến hiệu suất trì trệ.", icon: <RefreshCcw className="text-orange-400" size={32} /> },
              { title: "Thiếu kỹ năng Prompt", desc: "Không biết cách giao tiếp hiệu quả với AI, dẫn đến kết quả hời hợt, không ứng dụng được.", icon: <Terminal className="text-yellow-400" size={32} /> },
              { title: "Áp lực deadline", desc: "Luôn trong tình trạng chạy đua với thời gian mà vẫn không hoàn thành hết khối lượng công việc.", icon: <TimerOff className="text-purple-400" size={32} /> }
            ].map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SOLUTIONS SECTION */}
        <section id="loi-ich" className="container mx-auto px-6 md:px-12 py-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                BIẾN GOOGLE AI THÀNH <br/>
                <span className="text-blue-400">CỘNG SỰ ĐẮC LỰC NHẤT</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8">Không chỉ là một công cụ chat, Google AI là một hệ sinh thái mạnh mẽ giúp bạn tự động hóa mọi quy trình làm việc.</p>
              
              <ul className="space-y-6">
                {[
                  "Xử lý khối lượng dữ liệu khổng lồ với độ chính xác cao nhờ Gemini 1.5 Pro.",
                  "Biến tài liệu cá nhân thành kho tri thức thông minh với NotebookLM.",
                  "Tự động hóa quy trình không cần code với Flow, Opal & Script."
                ].map((text, i) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    key={i} 
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                      <CheckCircle2 size={14} className="text-blue-400" />
                    </div>
                    <span className="text-slate-300 leading-relaxed">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
               {[
                 { title: "Gemini AI", icon: <Sparkles className="text-cyan-400" size={32}/> },
                 { title: "NotebookLM", icon: <BookOpen className="text-indigo-400" size={32}/> },
                 { title: "Workspace Studio", icon: <LayoutGrid className="text-blue-400" size={32}/> },
                 { title: "Flow Automation", icon: <Zap className="text-yellow-400" size={32}/> }
               ].map((tool, i) => (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: i * 0.1 }}
                   key={i} 
                   className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-md flex flex-col items-center text-center hover:bg-white/10 transition-colors"
                 >
                   <div className="mb-4">{tool.icon}</div>
                   <h4 className="font-semibold text-white">{tool.title}</h4>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section id="chuong-trinh" className="container mx-auto px-6 md:px-12 py-20 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">LỘ TRÌNH 5 BUỔI CHINH PHỤC</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Từ người mới bắt đầu đến chuyên gia ứng dụng AI vào công việc</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { num: "01", title: "Tư duy & Gemini", desc: "Nắm vững nghệ thuật Prompting và khai thác sức mạnh tối đa của Gemini 1.5 Pro." },
              { num: "02", title: "Kho Tri Thức", desc: "Làm chủ NotebookLM để quản lý hàng ngàn tài liệu và nghiên cứu thông minh." },
              { num: "03", title: "Tự Động Hóa", desc: "Kết nối Google Workspace với Flow & Whisk để tự động hóa quy trình Marketing/Office." },
              { num: "04", title: "Workspace Studio", desc: "Xây dựng Add-ons và công cụ hỗ trợ công việc chuyên sâu ngay trên Google Docs/Sheets." },
              { num: "05", title: "Capstone Project", desc: "Hoàn thiện 'Nhân sự ảo' thực tế phục vụ trực tiếp cho công việc của bạn." }
            ].map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-900 opacity-50">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* RESULTS SECTION */}
        <section className="container mx-auto px-6 md:px-12 py-20 border-y border-white/5 bg-blue-950/10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">KẾT QUẢ SAU KHÓA HỌC</h2>
            <p className="text-slate-400">Bạn không chỉ học kiến thức, bạn mang về bộ giải pháp sẵn sàng vận hành.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {[
              { icon: <Users size={40}/>, label: "Virtual Staff", sub: "Đội ngũ AI hỗ trợ 24/7" },
              { icon: <Gauge size={40}/>, label: "70% Time Saved", sub: "X3 hiệu suất làm việc" },
              { icon: <BrainCircuit size={40}/>, label: "AI Mindset", sub: "Tư duy giải quyết vấn đề" },
              { icon: <Award size={40}/>, label: "Certification", sub: "Chứng chỉ từ Bootcamp" }
            ].map((res, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-blue-400 mb-4 bg-blue-500/10 p-4 rounded-full">{res.icon}</div>
                <h4 className="text-xl font-bold text-white mb-1">{res.label}</h4>
                <p className="text-sm text-slate-400">{res.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="container mx-auto px-6 md:px-12 py-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-16 rounded-3xl bg-gradient-to-br from-blue-900/40 to-[#020617] border border-blue-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              SẴN SÀNG TRỞ THÀNH NHÂN SỰ CỦA TƯƠNG LAI?
            </h2>
            <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto relative z-10">
              Đừng để bị thay thế bởi AI, hãy là người điều khiển nó. Số lượng học viên giới hạn 50 người để đảm bảo chất lượng thực chiến tốt nhất.
            </p>
            
            <button className="relative z-10 px-10 py-5 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.6)]">
              ĐĂNG KÝ THAM GIA NGAY
            </button>

            <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400 relative z-10">
              <span className="flex items-center gap-2"><Monitor size={16}/> Cần Laptop</span>
              <span className="flex items-center gap-2"><Mail size={16}/> Tài khoản Gmail</span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#020617] relative z-10 py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-500" size={24} />
            <span className="text-lg font-bold text-white tracking-tight">Google AI Ecosystem 2026</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Google AI Bootcamp. All rights reserved. 
          </p>
        </div>
      </footer>
    </div>
  );
}
