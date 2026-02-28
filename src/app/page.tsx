
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import {
  Rocket, Clock, Target, PieChart, Quote, Check, Crown, Users,
  Megaphone, Settings, Laptop, Trophy, Keyboard, Briefcase,
  Layers, Zap, Flag, Mail, Phone, ArrowRight, ArrowDown, ChevronDown, MousePointer2
} from 'lucide-react';
import Header from "@/components/layout/Header";

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
  // Sử dụng any ở đây vì thư viện threejs-components load qua CDN không có sẵn TypeScript types
  const tubesRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Tải động thư viện threejs-components chứa hiệu ứng Tubes1 từ CDN
        // Sử dụng new Function thay cho import() trực tiếp để tránh lỗi context của Turbopack trong Next.js (SSR)
        const importFunc = new Function('url', 'return import(url)');
        const _module = await importFunc('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = _module.default;

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
      className={cn("relative w-full h-full overflow-hidden bg-[#0A1128]", className)}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-crosshair pointer-events-none md:pointer-events-auto"
        style={{ touchAction: 'none' }}
      />
      
      {/* Lớp mờ (Gradient Overlay) để làm dịu phần viền dưới, giúp chuyển tiếp mượt mà sang nội dung bên dưới */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#0A1128] to-transparent z-0 pointer-events-none"></div>
      
      {/* Lớp chứa nội dung (Children Overlay). 
          Quan trọng: Sử dụng pointer-events-none ở container và pointer-events-auto ở các thẻ con cần tương tác */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
};



// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---


const fadeInUp: Variants ={

  hidden:{ opacity:0, y:40},

  visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:"easeOut"}}

};

const staggerContainer: Variants ={

  hidden:{ opacity:0},

  visible:{

    opacity:1,

    transition:{

    staggerChildren:0.15

    }

  }

};

const cardVariant: Variants ={

  hidden:{ opacity:0, scale:0.95, y:20},

  visible:{ opacity:1, scale:1, y:0, transition:{ duration:0.5}}

};

// --- DỮ LIỆU LỘ TRÌNH 5 BUỔI ---

const courseModules =[
  {
    id:1,
    title:"Tư duy AI & Bản đồ Hệ sinh thái Google AI",
    colorTheme:"blue",
    objective:"Xây dựng nền tảng tư duy đúng và giúp doanh nghiệp nắm bắt toàn cảnh tất cả công cụ trong hệ sinh thái Google AI mới nhất.",
    points:[
    { name:"Xây nền tảng AI Literacy:", desc:"Hiểu cách LLM hoạt động (token, xác suất, hallucination, context window)."},
    { name:"Chuyển tư duy từ “chat với AI” sang AI = Đồng nghiệp:", desc:"Theo framework Role – Context – Goal – Constraints."},
    { name:"Giải mã Hệ sinh thái Google AI 2026:", desc:"Theo pipeline: Data → Model → App → Workflow → Agent → Business."},
    { name:"Thực hành setup:", desc:"Google AI Studio và so sánh các model Gemini (Fast, Pro, Thinking, Deep Think)."},
    { name:"Tạo và tinh chỉnh Gemini Gems:", desc:"Xây dựng AI Persona cá nhân hoạt động thực tế."}
    ],
    practice:" Kết thúc buổi học: có persona riêng + bản đồ công cụ + khả năng chọn đúng AI cho đúng bài toán."
  },
  {
    id:2,
    title:"AI trong Nghiên cứu, Phân tích & Quản lý Tri thức",
    colorTheme:"cyan",
    objective:"Biến AI thành chuyên gia nghiên cứu thị trường và quản lý kho dữ liệu nội bộ của doanh nghiệp.",
    points:[
    { name:"Trợ lý đa năng:", desc:"Biến Gemini thành trợ lý nghiên cứu, phân tích và sản xuất nội dung chuyên nghiệp."},
    { name:"Xây Knowledge Base bằng NotebookLM:", desc:"Dùng Deep Research có citations đáng tin cậy."},
    { name:"Ứng dụng Gemini + Chrome:", desc:"Để đọc web nhanh và phân tích đối thủ cạnh tranh."},
    { name:"Tạo các Gems Persona chuyên biệt:", desc:"Marketing AI, Sales AI, HR AI."},
    { name:"Thực hành pipeline:", desc:"Research → Analyze → Draft → Refine để viết proposal hoàn chỉnh."}
    ],
    practice:" Kết thúc buổi học: sở hữu bộ nghiên cứu thị trường + bảng phân tích đối thủ + proposal sẵn sàng triển khai."
  },
  {
    id:3,
    title:"Tự động hóa Sáng tạo: Hình ảnh, Video & Truyền thông",
    colorTheme:"purple",
    objective:"Sản xuất các tài sản truyền thông chuyên nghiệp với quy trình tự động, giúp tối ưu thời gian và chi phí thiết kế.",
    points:[
    { name:"Làm chủ pipeline sáng tạo:", desc:"Để tự tạo bộ asset marketing mà không cần designer."},
    { name:"Tạo hình với Imagen 3:", desc:"Thực hành theo công thức Subject–Style–Lighting–Composition–Mood."},
    { name:"Dùng Nano Banana:", desc:"Để edit và giữ subject/brand consistency xuyên suốt nhiều biến thể."},
    { name:"Blend style & mood bằng Whisk + Mixboard:", desc:"Để ra moodboard và visual direction rõ ràng."},
    { name:"Tạo video ngắn:", desc:"Bằng Veo 3.1 / Vids từ prompt + script có sẵn."}
    ],
    practice:" Kết thúc buổi học: có moodboard + hero image + 4 social variants + 1 video + 1 landing slide cho 1 chiến dịch."
  },
  {
    id:4,
    title:"Tự xây dựng Ứng dụng & Tự động hóa quy trình (Không cần lập trình)",
    colorTheme:"blue",// Dùng lại màu xanh dương cho đồng bộ
    objective:"Giúp nhân sự không chuyên về kỹ thuật có thể tự tạo công cụ làm việc và quy trình tự động hóa chỉ trong vài phút.",
    points:[
    { name:"Mô tả → Tạo App:", desc:"Không cần biết code vẫn có thể mô tả → tạo app và tự động hóa quy trình công việc."},
    { name:"Khởi tạo ứng dụng nhanh (Google Opal):", desc:"Tự tạo mini app (CRM/form/dashboard) và iterate liên tục bằng ngôn ngữ tự nhiên."},
    { name:"Opal vs Antigravity:", desc:"Hiểu khi nào dùng Opal (prototype nhanh) và khi nào cần Antigravity (app phức tạp hơn/tuỳ biến sâu)."},
    { name:"Workflow automation bằng Workspace Studio:", desc:"Cho Gmail–Drive–Sheets theo mô hình Input → Process → Output → Alert."},
    { name:"Tạo 1 pipeline mẫu:", desc:"Form → Sheet phân loại → Email phản hồi → Dashboard → Alert hot lead."}
    ],
    practice:" Kết thúc buổi học: có 1 mini CRM + 1 app riêng + 1 workflow automation chạy end-to-end."
  },
  {
    id:5,
    title:"Thiết kế Hệ thống AI Toàn diện cho Doanh nghiệp",
    colorTheme:"indigo",
    isFinal:true,// Đánh dấu buổi cuối để hiển thị phần Dự án
    objective:"Tổng hợp kiến thức để xây dựng cấu trúc vận hành tối ưu bằng AI cho toàn tổ chức.",
    points:[
    { name:"Tư duy hệ thống:", desc:"Từ “biết dùng tool” nâng lên “biết thiết kế hệ thống AI cho phòng ban/doanh nghiệp”."},
    { name:"Kiểm soát quy trình:", desc:"Phân biệt rõ Workflow vs Agent và cách kiểm soát bằng guardrails + human-in-the-loop."},
    { name:"Năng lực agent nâng cao:", desc:"Làm quen Project Mariner (browser agent) và Project Genie (mô phỏng/visualization)."},
    { name:"Framework AI First Platform 5 lớp:", desc:"Áp dụng cấu trúc Data → RAG → Agent → Workflow → Human-in-the-loop."},
    { name:"Thiết kế kiến trúc nhóm:", desc:"Map pain points → tool → workflow, kèm ước tính ROI."}
    ],
    practice:" Kết thúc bootcamp: có bản thiết kế hệ thống + prototype demo + ROI + bài thuyết trình 3 phút."
  }
];

// Hàm hỗ trợ lấy class màu sắc linh hoạt

const getColorClasses =(theme: string)=>{

  const colors ={

    blue:{ badge:'bg-blue-600 shadow-blue-500/50', border:'border-blue-500', text:'text-blue-400', bgLight:'bg-blue-900/20', borderLight:'border-blue-500/30'},

    cyan:{ badge:'bg-cyan-500 shadow-cyan-500/50', border:'border-cyan-500', text:'text-cyan-400', bgLight:'bg-cyan-900/20', borderLight:'border-cyan-500/30'},

    purple:{ badge:'bg-purple-500 shadow-purple-500/50', border:'border-purple-500', text:'text-purple-400', bgLight:'bg-purple-900/20', borderLight:'border-purple-500/30'},

    indigo:{ badge:'bg-indigo-600 shadow-indigo-600/50', border:'border-indigo-600', text:'text-indigo-400', bgLight:'bg-indigo-900/20', borderLight:'border-indigo-500/30'}

  };

  return (colors as any)[theme]|| colors.blue;

};

// --- COMPONENT CHÍNH ---

export default function App(){

  

  const[activeSession, setActiveSession]= useState<number|null>(1);// Mặc định mở Buổi 1

  // Hàm xử lý việc mở/đóng module

  const toggleSession =(id: number)=>{

    setActiveSession(activeSession === id ?null: id);

  };

  // Xử lý hiệu ứng Navbar Glassmorphism khi cuộn

  

  return(
    <div className="bg-[#0A1128] text-white antialiased selection:bg-blue-900/40 selection:text-white font-sans overflow-x-hidden pt-12 md:pt-24">

    {/* 0. NAVBAR */}

    <Header />

    {/* 1. HERO SECTION */}
    <section className="relative w-full min-h-screen flex flex-col">
<TubesBackground className="flex-1 w-full min-h-screen" enableClickInteraction={true}>

    <div className="absolute inset-0 overflow-hidden pointer-events-none">

    <motion.div

    animate={{ scale:[1,1.1,1], opacity:[0.3,0.4,0.3]}}

    transition={{ duration:8, repeat:Infinity, ease:"easeInOut"}}

    className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-blue-800/30 blur-3xl"

    />

    <motion.div

    animate={{ scale:[1,1.2,1], opacity:[0.2,0.3,0.2]}}

    transition={{ duration:10, repeat:Infinity, ease:"easeInOut", delay:1}}

    className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-blue-600/20 blur-3xl"

    />

    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left pt-10">

      <div className="relative w-full max-w-7xl mx-auto bg-[#131B33]/80 border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md overflow-hidden flex flex-col lg:flex-row gap-16">
        {/* macOS Controls */}
        <div className="absolute top-6 left-6 flex gap-2 z-20">
          <div className="w-3 h-3 rounded-full bg-[#EA4335] shadow-inner shadow-black/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#FBBC04] shadow-inner shadow-black/20"></div>
          <div className="w-3 h-3 rounded-full bg-[#34A853] shadow-inner shadow-black/20"></div>
        </div>
        
        {/* Bottom Google Line */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC04] to-[#EA4335]"></div>

        {/* Left Column: Text Content */}
        <div className="flex-1 pt-4 relative z-10 lg:pr-10">
          <motion.div
          initial={{ opacity:0, y:-20}}
          animate={{ opacity:1, y:0}}
          transition={{ duration:0.5}}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1A2542] border border-blue-500/20 text-white font-semibold mb-8 backdrop-blur-xl shadow-xl"
          >
          <Rocket size={14} className="text-[#4285F4]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-200">Google AI System</span>
          </motion.div>

          <motion.h1
          initial={{ opacity:0, y:20}}
          animate={{ opacity:1, y:0}}
          transition={{ duration:0.7, delay:0.2}}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8"
          >
          LÀM CHỦ<br/>HỆ SINH THÁI<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC04]">GOOGLE AI.</span>
          </motion.h1>

          <motion.p
          initial={{ opacity:0}}
          animate={{ opacity:1}}
          transition={{ duration:0.7, delay:0.4}}
          className="mt-4 text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-xl"
          >
          Xây dựng hệ thống làm việc thông minh & tự động hóa dành cho Cấp quản lý, Chuyên viên và Doanh nghiệp vừa và nhỏ (SME).
          </motion.p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8 w-full">
            <span className="bg-[#4285F4] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase">Bootcamp 2026</span>
            <span className="bg-[#34A853] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase">70% Thực Hành</span>
            <span className="bg-[#FBBC04] text-[#131B33] px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase">Dành Cho SME</span>
          </div>
        </div>

        {/* Right Column: Timeline / Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="lg:w-[400px] border border-white/5 bg-black/20 rounded-[2rem] p-8 relative flex flex-col gap-6"
        >
          <motion.div variants={fadeInUp} className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 w-full text-center flex items-center justify-center gap-2 mb-2 relative z-20">
            <span className="text-[#FBBC04]">C</span> NỘI DUNG KHOÁ HỌC
          </motion.div>
          
          <div className="absolute left-1/2 top-24 bottom-16 w-px bg-white/5 -translate-x-1/2"></div>
        
          {[
          { icon:Clock, title:"Thời lượng", text:"5 buổi (2.5 - 3h/buổi)"},
          { icon:Target, title:"Phương pháp", text:"Outcome-based"},
          { icon:PieChart, title:"Tỷ lệ học", text:"30% Tư duy - 70% Thực chiến"}
          ].map((item, idx)=>(
          <motion.div
          key={idx}
          variants={cardVariant}
          whileHover={{ scale: 1.05, y: -5, boxShadow: "0 0 30px rgba(66, 133, 244, 0.4)" }}
          className="bg-[#1A2542] border border-white/10 hover:border-blue-500/50 rounded-2xl text-white flex flex-col items-center text-center p-6 shadow-xl relative z-10 w-full group overflow-hidden transition-colors"
          >
            {/* Halo background hidden initially, shows on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
          <item.icon size={28} className="text-[#4285F4] mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">{item.title}</h3>
          <p className="font-extrabold text-lg leading-tight text-white relative z-10">{item.text}</p>
          </motion.div>
          ))}
          
        </motion.div>

      </div>

    </div>

      </TubesBackground>
    </section>

    {/* 2. TỔNG QUAN & TRIẾT LÝ */}

    <section id="tong-quan" className="py-24 relative bg-[#0A1128]">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <motion.div
    className="text-center max-w-4xl mx-auto mb-16 bg-white/5 border border-white/10 backdrop-blur-xl py-8 px-10 rounded-full"
    >
      <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">Tổng Quan Chương Trình</h3>

    <div className="w-24 h-1 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC04] mx-auto mt-6 rounded-full"></div>

    </motion.div>

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}

    className="bg-blue-900/20 rounded-3xl p-8 md:p-12 border border-blue-500/20 shadow-lg shadow-black/30 relative overflow-hidden"

    >

    <Quote size={80} className="absolute top-8 right-10 text-blue-200 opacity-50" />

    <h4 className="text-2xl font-bold text-white mb-4 relative z-10">Triết lý đào tạo</h4>

    <p className="text-lg text-slate-300 leading-relaxed mb-8 relative z-10">

    Chúng tôi không dạy &quot;tool rời rạc&quot; mà đi theo quy trình thực tế giúp học viên làm chủ toàn bộ hệ sinh thái AI của Google để áp dụng ngay vào công việc và kinh doanh.

    </p>

    {/* Flow Diagram */}

    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 my-10 bg-[#131B33]/40 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-black/30 border border-white/20 relative z-10">

    {['Idea','Content','App','Workflow','Agent'].map((step, idx)=>(

    <React.Fragment key={step}>

    <motion.div

    initial={{ opacity:0, scale:0.8}} whileInView={{ opacity:1, scale:1}} transition={{ delay: idx *0.1}}

    className="flex items-center"

    >

    <span className="text-blue-100 font-semibold tracking-wide bg-blue-600/30 border border-blue-500/40 px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/20">{step}</span>

    </motion.div>

    <motion.div

    initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{ delay:(idx *0.1)+0.05}}

    className="text-blue-500 mx-2 hidden md:block"

    >

    <ArrowRight size={20} />

    </motion.div>

    <motion.div

    initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{ delay:(idx *0.1)+0.05}}

    className="text-blue-500 my-2 block md:hidden"

    >

    <ArrowDown size={20} />

    </motion.div>

    </React.Fragment>

    ))}

    <motion.div

    initial={{ opacity:0, scale:0.8}} whileInView={{ opacity:1, scale:1}} transition={{ delay:0.6}}

    className="flex items-center"

    >

    <span className="text-white font-bold bg-blue-600 px-6 py-2 rounded-lg shadow-md shadow-blue-500/30">Business</span>

    </motion.div>

    </div>

    <p className="text-lg text-slate-300 font-medium text-center bg-[#131B33]/40 backdrop-blur-md/60 p-4 rounded-xl relative z-10">

    Học viên sẽ không chỉ học cách dùng từng công cụ riêng lẻ mà được hướng dẫn xây dựng một quy trình/ hệ thống hoàn chỉnh từ ý tưởng đến triển khai thực tế.

    </p>

    </motion.div>

    </div>

    </section>

    {/* 3. ĐIỂM KHÁC BIỆT */}

    <section className="py-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:30px_30px] bg-[#131B33] relative">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <motion.div
    className="text-center max-w-4xl mx-auto mb-16 bg-[#131B33]/70 backdrop-blur-xl google-gradient-border py-8 px-10 rounded-2xl glow-border"
    >
      <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Sự Khác Biệt Cốt Lõi</h3>
      <p className="mt-5 text-gray-300 text-lg font-medium">Tại sao chương trình của CES Global là duy nhất?</p>

    </motion.div>

    <motion.div
    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}
    className="overflow-x-auto rounded-2xl bg-[#131B33]/60 backdrop-blur-xl google-gradient-border google-halo p-1"
    >

    <table className="w-full text-left border-collapse">

    <thead>

    <tr>

    <th className="py-5 px-6 bg-[#131B33] font-bold text-slate-300 text-lg border-b border-r border-white/10 w-1/4">Tiêu chí</th>
    <th className="py-5 px-6 bg-[#131B33]/80 font-bold text-slate-400 text-lg border-b border-r border-white/10 w-1/3">Đào tạo AI thông thường</th>
    <th className="py-5 px-6 bg-blue-600 font-bold text-white text-lg border-b border-blue-700 w-5/12 shadow-[0_0_20px_rgba(37,99,235,0.4)] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      Google AI Ecosystem Bootcamp
    </th>
    </tr>
    </thead>
    <tbody className="text-slate-300 divide-y divide-gray-100">
    {[
    { k:"Cách tiếp cận", o:"Dạy từng tool riêng lẻ", n:"Dạy theo quy trình/hệ thống liên hoàn"},
    { k:"Trọng tâm", o:"Chỉ tập trung viết prompt", n:"Xây dựng tư duy hệ thống AI"},
    { k:"Thực hành", o:"Lý thuyết chiếm đa số", n:"70% thực hành, mỗi buổi có output"},
    { k:"Nền tảng", o:"Sử dụng nhiều nền tảng rời rạc", n:"Tận dụng hệ sinh thái Google đồng bộ"},
    { k:"Kết quả", o:"Kết quả chung chung, mơ hồ", n:"Mỗi buổi có sản phẩm đầu ra cụ thể"},
    ].map((row, idx)=>(
    <motion.tr
    key={idx}
    initial={{ opacity:0, x:-20}}
    whileInView={{ opacity:1, x:0}}
    transition={{ delay: idx *0.1}}
    viewport={{ once:true}}
    className="hover:bg-[#131B33] transition-colors"
    >
    <td className="py-4 px-6 font-semibold border-r border-white/10">{row.k}</td>
    <td className="py-4 px-6 text-slate-300 line-through decoration-red-500 decoration-2 border-r border-white/10">{row.o}</td>
    <td className="py-4 px-6 font-medium text-blue-50 bg-blue-900/40 flex items-start gap-3 relative">
    <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none"></div>
    <Check className="text-green-400 shrink-0 mt-0.5 relative z-10 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" size={20} />
    <span className="relative z-10 font-semibold tracking-wide">{row.n}</span>
    </td>
    </motion.tr>

    ))}

    </tbody>

    </table>

    </motion.div>

    </div>

    </section>

    {/* 4. ĐỐI TƯỢNG */}

    <section className="py-20 bg-[#0A1128] relative text-white">

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[40vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
    <div className="absolute inset-0 bg-blue-900/5 pointer-events-none z-0"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    <motion.div
    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}
    className="text-center max-w-4xl mx-auto mb-16 bg-[#131B33]/70 backdrop-blur-xl google-gradient-border py-8 px-10 rounded-2xl glow-border"
    >
      <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">Đối Tượng Tham Gia</h3>
      <div className="w-24 h-1 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC04] mx-auto mt-6 rounded-full"></div>
      <p className="mt-5 text-gray-300 text-lg font-medium">Chương trình được thiết kế cá nhân hóa để mang lại giá trị thực tế cho từng nhóm đối tượng:</p>
    </motion.div>

    <motion.div

    variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-50px"}}

    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

    >

    {[

    { icon:Crown, title:"Lãnh đạo / C-Level", sub:"(Chiến lược)", desc:"Nắm bắt tầm nhìn chiến lược AI, thiết kế AI system tổng thể cho doanh nghiệp phát triển bền vững."},

    { icon:Users, title:"Quản lý cấp trung", sub:"(Tối ưu hóa)", desc:"Tối ưu hóa quy trình làm việc đội nhóm, xây dựng các workflow tự động hóa thông minh."},

    { icon:Megaphone, title:"Marketing / Sales", sub:"(Sáng tạo)", desc:"Sản xuất nội dung hàng loạt, nghiên cứu thị trường chuyên sâu và creative automation."},

    { icon:Settings, title:"Vận hành / Operations", sub:"(Thực thi)", desc:"Xây dựng ứng dụng nội bộ (mini app) và tự động hóa báo cáo, xử lý dữ liệu quy trình."},

    { icon:Laptop, title:"Kỹ thuật / No-code", sub:"(Kỹ thuật)", desc:"Phát triển ứng dụng từ prompt, lập trình agent (hệ thống đại lý tự hành) cơ bản."},

    { icon:Rocket, title:"Founder / Startup", sub:"(Khởi nghiệp)", desc:"Thiết kế cấu trúc và vận hành hệ thống AI-First ngay từ những ngày đầu."}

    ].map((role, idx)=>(

    <motion.div
    key={idx} variants={cardVariant}
    whileHover={{ scale:1.02, y:-8 }}
    className="bg-[#131B33]/40 backdrop-blur-md p-6 rounded-2xl transition-all duration-300 group border border-slate-700 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden"
    >
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all pointer-events-none"></div>
    <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:text-white group-hover:from-blue-500 group-hover:to-cyan-400 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all z-10 relative">

    <role.icon size={26} strokeWidth={1.5} />

    </div>

    <h4 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white relative z-10 transition-colors">{role.title}<span className="text-blue-300/80 font-medium text-sm block mt-1">{role.sub}</span></h4>

    <p className="text-slate-400 leading-relaxed text-sm md:text-base relative z-10">{role.desc}</p>

    </motion.div>

    ))}

    </motion.div>

    </div>

    </section>

    {/* 5. PHƯƠNG PHÁP */}

    <section className="py-20 bg-[#131B33]/40 backdrop-blur-md overflow-hidden">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true}}>

    <motion.h3 variants={fadeInUp} className="text-3xl font-bold text-white mb-8">Triết lý phương pháp đào tạo</motion.h3>

    <div className="space-y-8">

    {[

    { icon:Trophy, title:"Học đi đôi với thực chiến", sub:" (Outcome-based)", desc:"Mỗi buổi học kết thúc với sản phẩm đầu ra hoàn chỉnh, áp dụng được ngay."},

    { icon:Keyboard, title:"Làm trực tiếp trên công cụ mới nhất", sub:" (Learning by Doing)", desc:"Thực hành trực tiếp trên các công cụ, mô hình AI mới nhất của Google."},

    { icon:Briefcase, title:"Giải quyết bài toán thực tế", sub:" (Real-world Cases)", desc:"Luôn sử dụng các bài toán thực tế, cấp thiết từ hoạt động doanh nghiệp."},

    { icon:Layers, title:"Lộ trình bài bản dễ hiểu", sub:" (Progressive Complexity)", desc:"Học theo lộ trình tăng dần: Từ nền tảng tư duy → Ứng dụng thực tế → Hệ thống hóa tổng thể."}

    ].map((item, idx)=>(

    <motion.div key={idx} variants={fadeInUp} className="flex gap-5 group">

    <div className="flex-shrink-0 w-14 h-14 bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-lg shadow-black/30 border border-blue-500/20">

    <item.icon size={24} />

    </div>

    <div>

    <h4 className="text-xl font-bold text-white mb-1">{item.title}<span className="text-blue-600 text-base font-normal">{item.sub}</span></h4>

    <p className="text-slate-400">{item.desc}</p>

    </div>

    </motion.div>

    ))}

    </div>

    </motion.div>

    <motion.div

    initial={{ opacity:0, scale:0.9, x:50}}

    whileInView={{ opacity:1, scale:1, x:0}}

    transition={{ duration:0.8}}

    viewport={{ once:true}}

    className="relative"

    >

    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>

    <img src="/images/ai_automation_system.png" alt="Hệ thống Chatbot và Agentic AI tự động hóa" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px] md:h-[500px]" />

    </motion.div>

    </div>

    </div>

    </section>

    {/* 6. HỆ SINH THÁI (ECOSYSTEM MAP) */}

    <section id="ecosystem" className="py-20 bg-[#131B33]/40 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Ecosystem UI Map */}
    <div className="relative max-w-5xl mx-auto p-4 md:p-8 rounded-3xl">

    <motion.div
    initial={{ opacity:0, y:-20}} whileInView={{ opacity:1, y:0}} viewport={{ once:true}}
    className="text-center max-w-4xl mx-auto mb-16 bg-[#131B33]/70 backdrop-blur-xl google-gradient-border py-8 px-10 rounded-2xl glow-border relative z-20"
    >
      <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">BẢN ĐỒ HỆ SINH THÁI GOOGLE AI 2026</h3>
      <div className="w-24 h-1 bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC04] mx-auto mt-6 rounded-full"></div>
      <p className="mt-5 text-gray-300 text-lg font-medium">Học viên sẽ có cơ hội làm chủ sức mạnh của hơn 20 công cụ tiên tiến nhất:</p>
    </motion.div>

    {/* Desktop Connectors */}

    <div className="hidden md:block absolute top-[110px] left-1/2 w-[2px] h-[40px] bg-blue-900/20/50 -translate-x-1/2 z-10"></div>

    <div className="hidden md:block absolute top-[150px] left-[16.66%] right-[16.66%] h-[2px] bg-blue-900/20/50 z-10"></div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative mt-8 md:mt-0 z-20">

    {/* Col 1 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.2}} viewport={{ once:true}} className="space-y-8 relative">

    <div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-900/20/50 -translate-x-1/2"></div>

    <div className="border border-indigo-500/50 hover:border-indigo-400 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-indigo-900/80 py-3 text-center border-b border-indigo-500/30 font-bold text-white tracking-wider text-sm">MODELS</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-indigo-200 text-center text-sm">

    {['Pro','Thinking','DeepThin(k)','Fast'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}</div>)}

    </div>

    </div>

    <div className="flex justify-center text-indigo-500"><ArrowDown size={20} /></div>

    <div className="border border-indigo-500/50 hover:border-indigo-400 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-indigo-900/80 py-3 text-center border-b border-indigo-500/30 font-bold text-white tracking-wider text-sm">ASSISTANTS</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-indigo-200 text-center text-sm">

    {['Notebook LM','Gemini Gems','Workspace'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}</div>)}

    </div>

    </div>

    </motion.div>

    {/* Col 2 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.4}} viewport={{ once:true}} className="space-y-8 relative">

    <div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-900/20/50 -translate-x-1/2"></div>

    <div className="border border-cyan-500/50 hover:border-cyan-400 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-cyan-900/80 py-3 text-center border-b border-cyan-500/30 font-bold text-white tracking-wider text-sm">BUILD&CODE</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-cyan-200 text-center text-sm">

    {['Opal','Antigravity','Jules','AI Studio'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}</div>)}

    </div>

    </div>

    <div className="flex justify-center text-cyan-500"><ArrowDown size={20} /></div>

    <div className="border border-cyan-500/50 hover:border-cyan-400 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-cyan-900/80 py-3 text-center border-b border-cyan-500/30 font-bold text-white tracking-wider text-sm">AGENTS</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-cyan-200 text-center text-sm">

    {['Project Genie','Project Mariner'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}</div>)}

    </div>

    </div>

    </motion.div>

    {/* Col 3 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.6}} viewport={{ once:true}} className="space-y-8 relative">

    <div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-900/20/50 -translate-x-1/2"></div>

    <div className="border border-blue-400/50 hover:border-blue-300 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-blue-800/80 py-3 text-center border-b border-blue-400/30 font-bold text-white tracking-wider text-sm">CREATIVE</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-blue-100 text-center text-sm">

    {['Imagen 3','Nano Banana','Mixboard','Veo 3.1','Vids'].map(t =><div key={t} className="py-1 hover:bg-slate-700/50 rounded transition cursor-default">{t}</div>)}

    </div>

    </div>

    <div className="flex justify-center text-blue-400"><ArrowDown size={20} /></div>

    <div className="border border-blue-400/50 hover:border-blue-300 transition-colors rounded-xl overflow-hidden bg-[#131B33]/80 shadow-lg">

    <div className="bg-blue-800/80 py-3 text-center border-b border-blue-400/30 font-bold text-white tracking-wider text-sm">PIPELINE</div>

    <div className="p-3 flex flex-col gap-1 font-mono text-blue-200 text-center text-sm">

    <div className="py-1">Data</div>

    <div className="text-blue-500 leading-none">↓</div>

    <div className="py-1">Model</div>

    <div className="text-blue-500 leading-none">↓</div>

    <div className="py-1">Workflow</div>

    <div className="text-blue-500 leading-none">↓</div>

    <div className="py-1 font-bold text-white">Agent</div>

    </div>

    </div>

    </motion.div>

    </div>

    </div>

    </div>

    </section>

    {/* 7. KIẾN TRÚC 5 TẦNG (DASHBOARD LAYOUT) */}
    <section id="lo-trinh" className="py-24 bg-[#0B1221] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#131B33] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-[340px] lg:w-[400px] bg-[#0A1128]/80 border-r border-white/5 p-6 md:py-10 md:px-8 flex flex-col gap-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2 ml-4">Kiến trúc 5 tầng</h3>
            
            <div className="flex flex-col gap-3">
              {courseModules.map((module, index) => {
                const isActive = activeSession === module.id;
                const subTitles = [
                  "Nền tảng tư duy & giao tiếp AI",
                  "Tối ưu hóa hiệu suất vận hành",
                  "Hệ thống sản xuất nội dung tự động",
                  "Tự động hóa quy trình & trợ lý Agent",
                  "Chiến lược & Quản trị AI cấp cao"
                ];
                
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveSession(module.id)}
                    className={`text-left p-5 rounded-3xl transition-all duration-300 relative border ${isActive ? 'bg-[#1A2542] border-blue-500/30 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                  >
                    {isActive && (
                      <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-[#EA4335] via-[#FBBC04] to-[#4285F4] rounded-r-full"></div>
                    )}
                    <h4 className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#EA4335] via-[#FBBC04] to-[#4285F4]' : 'text-gray-500'}`}>TẦNG {module.id} — {subTitles[index]}</h4>
                    <h3 className={`font-bold text-base leading-snug ${isActive ? 'text-white' : 'text-slate-400'}`}>{module.title}</h3>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-8 md:p-12 lg:p-16 relative bg-[#131B33]">
            <AnimatePresence mode="wait">
              {courseModules.map((module) => {
                if (activeSession !== module.id) return null;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                  >
                    <div className="mb-10">
                      <span className="inline-block px-5 py-1.5 rounded-full bg-gradient-to-r from-[#EA4335] to-[#4285F4] text-[10px] font-bold text-white mb-6 uppercase tracking-widest shadow-lg">CHƯƠNG TRÌNH CHI TIẾT</span>
                      <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-[1.15] mb-4 tracking-tight">{module.title}</h2>
                      <h3 className="text-lg font-bold text-[#FBBC04]">{module.objective}</h3>
                    </div>

                    <div className="mb-10">
                      <h4 className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">
                        <Layers size={14} /> ỨNG DỤNG & CÔNG CỤ ({module.points.length})
                      </h4>
                      <div className="flex flex-col gap-5">
                        {module.points.map((point, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4285F4] mt-2.5 shrink-0 shadow-[0_0_10px_rgba(66,133,244,0.8)]"></div>
                            <p className="text-slate-300 text-base leading-relaxed"><strong className="text-white font-semibold">{point.name}</strong> {point.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto relative pt-8">
                      <div className="absolute top-2 left-6 w-12 h-12 bg-[#FBBC04] rounded-full flex items-center justify-center text-[#131B33] z-20 shadow-lg shadow-yellow-500/20 transform -rotate-12">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <div className="bg-[#1A2542] border border-white/5 rounded-[2.5rem] p-8 md:p-12 pl-12 md:pl-16 shadow-2xl relative overflow-hidden ml-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                        <h4 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-3 relative z-10">MỤC TIÊU ĐẦU RA</h4>
                        <p className="text-xl md:text-2xl font-bold text-white leading-snug relative z-10 pb-2 italic">
                          "{module.practice.replace('Kết thúc buổi học:', '').replace(' Kết thúc bootcamp: ', '').trim()}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>

    {/* 9. GIẢNG VIÊN & YÊU CẦU CHUẨN BỊ */}

    <section className="py-24 bg-[#131B33]/40 backdrop-blur-md border-t border-white/20 relative overflow-hidden">

    <div className="absolute top-0 right-0 w-1/2 h-full bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
    <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none z-0"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    <div className="flex flex-col gap-24">

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}>

    <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm text-center"></h2>

    <h3 className="mt-2 text-3xl font-bold text-white mb-12 text-center">Giới Thiệu Giảng Viên</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { 
          name: "Mr. Lưu Tuấn Anh", 
          title: "Team Leader AI Automation",
          sub: "Chuyên gia Ứng dụng AI Sáng tạo & Tự động hóa",
          quote: "Biến ý tưởng thành sản phẩm thực tế thông qua sức mạnh của AI Agents và Automation.",
          img: "/images/tuan-anh.jpg",
          imgPos: "object-top"
        },
        { 
          name: "Mr. Nguyễn Văn Tiệp", 
          title: "Co-founder CES Global",
          sub: "Chuyên gia Chiến lược Chuyển đổi số & GenAI",
          quote: "Người kiến tạo tư duy chiến lược, đưa doanh nghiệp Việt tiếp cận chuẩn mực quản trị AI quốc tế.",
          img: "/images/anh-tiep.jpg",
          imgPos: "object-top"
        },
        { 
          name: "Ms. Nguyễn Kim Anh", 
          title: "Chuyên gia Đào tạo",
          sub: "Thiết kế trải nghiệm học tập AI",
          quote: "Cầu nối sư phạm giúp đơn giản hóa công nghệ phức tạp, biến AI thành công cụ dễ dùng cho mọi nhân sự.",
          img: "/images/kim-anh.png",
          imgPos: "object-top"
        }
      ].map((instructor, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ scale: 1.02, backgroundColor:"rgba(30, 58, 138, 0.2)" }}
          className="flex flex-col items-center text-center gap-6 p-8 bg-[#131B33]/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.5)] hover:border-blue-500/50 transition-all duration-300 group cursor-default relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-blue-500/30 flex-shrink-0 relative shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] group-hover:border-blue-400 transition-colors">
            {instructor.img ? (
              <Image src={instructor.img} alt={instructor.name} fill className={`object-cover ${instructor.imgPos || 'object-center'} group-hover:scale-110 transition-transform duration-500 ease-in-out`} />
            ) : (
              <div className="w-full h-full bg-[#131B33] flex items-center justify-center group-hover:bg-blue-900/50 transition-colors">
                <Briefcase className="text-blue-500/50 group-hover:text-blue-400 transition-colors" size={32} />
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <h4 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">{instructor.name}</h4>
            <div className="text-blue-400 font-medium text-sm mt-2 mb-4">
              {instructor.title} 
              <span className="block text-blue-300/80 mt-1">{instructor.sub}</span>
            </div>
            <p className="text-slate-300 italic leading-relaxed text-sm">
              <span className="text-blue-500 text-lg leading-none mr-1">"</span>
              {instructor.quote}
              <span className="text-blue-500 text-lg leading-none ml-1">"</span>
            </p>
          </div>
        </motion.div>
      ))}
    </div>

    </motion.div>

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}} transition={{ delay:0.2}} className="max-w-4xl mx-auto w-full relative">

    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

    <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm text-center relative z-10"></h2>

    <h3 className="mt-2 text-3xl font-bold text-white mb-8 text-center relative z-10">Yêu Cầu & Tài Nguyên</h3>

    <div className="bg-[#131B33]/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl p-8 border border-white/20 relative z-10">

    <h4 className="font-bold text-xl mb-6 text-slate-200 border-b pb-4">Điều kiện tham gia</h4>

    <ul className="space-y-5">

    <li className="flex items-start gap-4">

    <div className="mt-1 bg-blue-900/40 p-2 rounded-lg text-blue-600"><Mail size={18}/></div>

    <div><strong className="text-white block mb-1">Tài khoản:</strong><span className="text-slate-400">Dùng Gmail cá nhân hoặc tài khoản Google Workspace đang hoạt động ổn định.</span></div>

    </li>

    <li className="flex items-start gap-4">

    <div className="mt-1 bg-blue-900/40 p-2 rounded-lg text-blue-600"><Laptop size={18}/></div>

    <div><strong className="text-white block mb-1">Thiết bị:</strong><span className="text-slate-400">Laptop/Máy tính cá nhân có kết nối Internet tốc độ cao.</span></div>

    </li>

    <li className="flex items-start gap-4">

    <div className="mt-1 bg-blue-900/40 p-2 rounded-lg text-blue-600"><Check size={18}/></div>{/* Fallback for chrome icon */}

    <div><strong className="text-white block mb-1">Nền tảng:</strong><span className="text-slate-400">Cài đặt sẵn GoogleChrome phiên bản mới nhất.</span></div>

    </li>

    <li className="flex items-start gap-4">

    <div className="mt-1 bg-red-100 p-2 rounded-lg text-red-500"><Zap size={18}/></div>{/* Fallback for fire icon */}

    <div><strong className="text-white block mb-1">Tinh thần:</strong><span className="text-slate-400">Khát khao thực chiến.</span>Đặc biệt, khóa học này KHÔNG yêu cầu kinh nghiệm, kỹ năng lập trình trước đó.</div>

    </li>

    </ul>

    </div>

    </motion.div>

    </div>

    </div>

    </section>

    {/* 10. FOOTER & CALL TO ACTION */}

    <section id="dang-ky" className="py-24 bg-[#131B33] border-t border-white/5 text-white relative overflow-hidden">

    {/* Decor Wave */}

    <div className="absolute inset-0 opacity-5 pointer-events-none text-blue-500">

    <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">

    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>

    </svg>

    </div>

    {/* Glow Effect */}
    
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

    {/* Đã gỡ bỏ 5 icon vương miện */}

    <motion.h2

    initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.2}} viewport={{ once:true}}

    className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight"

    >

    Không chỉ học AI mà <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">xây hệ thống AI cho tương lai</span>

    </motion.h2>

    <motion.div
      initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.4}} viewport={{ once:true}}
      className="max-w-[1200px] mx-auto my-16 relative px-4 xl:px-0"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>
      
      <div className="bg-[#1A2542] border border-white/10 hover:border-blue-500/40 transition-colors duration-500 rounded-[2rem] p-6 sm:p-8 lg:p-12 relative z-10 shadow-2xl overflow-hidden text-left group">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC04] to-[#EA4335] opacity-80 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="text-center mb-10">
          <span className="inline-block bg-[#131B33] border border-white/5 text-blue-400 text-[10px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4 shadow-sm">Mô hình: Cam kết đầu ra</span>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">GOOGLE AI BOOTCAMP</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-8 items-stretch">
          
          {/* BOX 1: PRICING (Left) */}
          <div className="flex flex-col justify-between bg-[#0A1128]/60 rounded-2xl p-6 lg:p-8 xl:p-10 border border-white/5 shadow-inner">
            <div className="w-full flex-1 flex flex-col justify-center">
              
              <div className="flex flex-wrap items-center justify-between gap-3 w-full mb-6 pb-6 border-b border-white/5">
                <div className="text-slate-300 font-medium text-sm md:text-base flex items-center gap-3">
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">Giá gốc</span>
                  <span className="whitespace-nowrap">Giá trị chương trình:</span>
                </div>
                <span className="text-[#EA4335] font-black line-through text-2xl md:text-3xl decoration-red-500/60 decoration-[3px] drop-shadow-[0_0_10px_rgba(234,67,53,0.3)] shrink-0">3.000.000 VNĐ</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-3 w-full mb-8 pb-6 border-b border-white/5">
                <span className="text-slate-400 font-medium text-sm md:text-base">Học phí:</span>
                <span className="text-green-400 font-extrabold text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(74,222,128,0.4)] shrink-0">0 VNĐ</span>
              </div>
              
              <div className="text-center w-full mb-8 mt-2">
                <span className="block text-slate-400 font-medium mb-3 text-sm uppercase tracking-widest">Phí cam kết</span>
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FBBC04] to-[#FFF1BA] drop-shadow-md py-1">899.000 VNĐ</div>
              </div>
            </div>

            <div className="w-full mt-auto">
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-5 shadow-inner relative overflow-hidden text-left">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#FBBC04]"></div>
                <p className="text-sm text-blue-100 font-medium leading-relaxed">
                  <span className="text-[#FBBC04] font-bold uppercase text-[11px] tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#FBBC04] text-slate-900 flex items-center justify-center text-[10px]">C</span> 
                    Lưu ý quan trọng
                  </span> 
                  Không phải học phí. Đây là khoản <strong className="text-white">cam kết</strong> để bạn học nghiêm túc và ra sản phẩm thực tế.
                </p>
              </div>
            </div>
          </div>

          {/* BOX 2: REFUND + ACTION (Right) */}
          <div className="flex flex-col justify-between gap-6 lg:gap-8">
            <div className="bg-[#131B33]/50 p-6 lg:p-10 rounded-2xl border border-white/5 flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-white mb-6 text-center text-sm uppercase tracking-wider text-green-400">Hoàn trả 100% khi bạn:</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-1 rounded-full shrink-0">
                    <Check className="text-green-500" size={18} />
                  </div>
                  <span className="text-slate-300 font-medium text-[15px] pt-0.5">Tham gia tối thiểu 80% thời lượng</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-1 rounded-full shrink-0">
                    <Check className="text-green-500" size={18} />
                  </div>
                  <span className="text-slate-300 font-medium text-[15px] pt-0.5">Hoàn thành bài tập & project cuối khóa</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-1 rounded-full shrink-0">
                    <Check className="text-green-500" size={18} />
                  </div>
                  <span className="text-slate-300 font-medium text-[15px] pt-0.5">Trình bày và bảo vệ thành công sản phẩm</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 md:py-5 rounded-full bg-gradient-to-r from-[#4285F4] to-blue-600 hover:from-blue-500 hover:to-blue-400 text-white font-black text-lg text-center shadow-[0_0_30px_rgba(66,133,244,0.4)] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <Rocket size={20} className="group-hover/btn:translate-y-[-2px] transition-transform" /> ĐĂNG KÝ NGAY
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                href="tel:0911991288"
                className="w-full py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-sm text-center transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Hotline hỗ trợ: 0911 991 288
              </motion.a>
            </div>
          </div>

        </div>
      </div>
    </motion.div>

    {/* Subdued Email Info */}
    <motion.div
      initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.6}} viewport={{ once:true}}
      className="mt-12 mb-16 text-slate-500 flex flex-col items-center gap-2"
    >
      <p className="text-xs uppercase tracking-widest font-semibold text-slate-600 mb-1">Email liên hệ hợp tác</p>
      <a href="mailto:dichvukhachhang@cesglobal.com.vn" className="flex items-center gap-2 hover:text-blue-400 transition-colors bg-white/5 px-6 py-2 rounded-full border border-white/5 text-sm">
        <Mail size={16} /> dichvukhachhang@cesglobal.com.vn
      </a>
    </motion.div>

    <p className="text-blue-400 text-sm">©2026CES Global.All rights reserved.</p>

    </div>

    </section>

    </div>

  );

}

