importReact,{ useState, useEffect }from'react';

import{ motion,AnimatePresence}from'framer-motion';

import{

  Rocket,Clock,Target,PieChart,Quote,Check,Crown,Users,

  Megaphone,Settings,Laptop,Trophy,Keyboard,Briefcase,

  Layers,Zap,Flag,Mail,Phone,ArrowRight,ArrowDown,ChevronDown

}from'lucide-react';

// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---

const fadeInUp ={

  hidden:{ opacity:0, y:40},

  visible:{ opacity:1, y:0, transition:{ duration:0.6, ease:"easeOut"}}

};

const staggerContainer ={

  hidden:{ opacity:0},

  visible:{

    opacity:1,

    transition:{

    staggerChildren:0.15

    }

  }

};

const cardVariant ={

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

    { name:"Tư duy Cộng sự AI:", desc:"Thay đổi cách tiếp cận từ\"công cụ chat\" sang \"trợ lý ảo đắc lực\" thông qua bộ khung giao tiếp chuẩn (Bối cảnh + Vai trò + Mục tiêu + Giới hạn)."},

    { name:"Giải mã Hệ sinh thái Google AI:", desc:"Lộ trình chuyển đổi số từ Dữ liệu → Mô hình → Ứng dụng → Quy trình → Trợ lý tự vận hành → Doanh nghiệp."}

    ],

    practice:"Thiết lập các\"Gem\" (Trợ lý chuyên biệt) cho từng phòng ban và sử dụng Google AI Studio để lựa chọn các dòng mô hình phù hợp (Bản chuyên sâu, Bản suy luận hay Bản tốc độ cao)."

  },

  {

    id:2,

    title:"AI trong Nghiên cứu, Phân tích & Quản lý Tri thức",

    colorTheme:"cyan",

    objective:"Biến AI thành chuyên gia nghiên cứu thị trường và quản lý kho dữ liệu nội bộ của doanh nghiệp.",

    points:[

    { name:"Xây dựng Kho tri thức số (NotebookLM):", desc:"Tập hợp tài liệu nội bộ để AI hỗ trợ hỏi đáp theo ngữ cảnh doanh nghiệp và tự động tạo tóm tắt âm thanh (Podcast) từ dữ liệu có sẵn."},

    { name:"Chế độ Nghiên cứu chuyên sâu:", desc:"Sử dụng AI để rà soát dữ liệu mạng, phân tích đối thủ và xu hướng ngành với nguồn trích dẫn minh bạch."}

    ],

    practice:"Tự động hóa việc lập hồ sơ nghiên cứu thị trường và soạn thảo các bản đề xuất dự án (Proposal) từ các nguồn dữ liệu thô."

  },

  {

    id:3,

    title:"Tự động hóa Sáng tạo: Hình ảnh, Video & Truyền thông",

    colorTheme:"purple",

    objective:"Sản xuất các tài sản truyền thông chuyên nghiệp với quy trình tự động, giúp tối ưu thời gian và chi phí thiết kế.",

    points:[

    { name:"Quy trình tạo ảnh (Imagen 3):", desc:"Kỹ thuật tạo hình ảnh từ ý tưởng, duy trì tính nhất quán của nhân vật/sản phẩm và phối trộn phong cách đặc trưng của thương hiệu."},

    { name:"Quy trình tạo Video (Veo & Vids):", desc:"Ứng dụng AI để chuyển đổi kịch bản hoặc tài liệu thuyết trình thành video quảng bá chất lượng cao."}

    ],

    practice:"Hoàn thiện bộ tài liệu truyền thông gồm: Bảng ý tưởng (Moodboard), Ảnh đại diện chiến dịch, bộ bài đăng mạng xã hội và Video ngắn giới thiệu."

  },

  {

    id:4,

    title:"Tự xây dựng Ứng dụng & Tự động hóa (Không code)",

    colorTheme:"blue",// Dùng lại màu xanh dương cho đồng bộ

    objective:"Giúp nhân sự không chuyên về kỹ thuật có thể tự tạo công cụ làm việc và quy trình tự động hóa chỉ trong vài phút.",

    points:[

    { name:"Khởi tạo ứng dụng nhanh (Google Opal):", desc:"Tự xây dựng các công cụ quản lý nội bộ như Quản lý khách hàng (CRM), Bảng theo dõi công việc chỉ bằng cách mô tả yêu cầu với AI."},

    { name:"Tự động hóa văn phòng (Workspace Studio):", desc:"Thiết lập các Trợ lý tự vận hành trên Gmail, Drive và Sheets (Tự phân loại thư, tự nhập liệu và báo cáo thông minh)."}

    ],

    practice:"Thiết lập quy trình liên hoàn từ\"Thu thập thông tin → Xử lý dữ liệu → Báo cáo tự động\" và thông báo tức thời cho đội ngũ."

  },

  {

    id:5,

    title:"Thiết kế Hệ thống AI Toàn diện cho Doanh nghiệp",

    colorTheme:"indigo",

    isFinal:true,// Đánh dấu buổi cuối để hiển thị phần Dự án

    objective:"Tổng hợp kiến thức để xây dựng cấu trúc vận hành tối ưu bằng AI cho toàn tổ chức.",

    points:[

    { name:"Tư duy về AI AGENT:", desc:"Giới thiệu về AI Agent và cách sử dụng hiệu quả AI Agent trong công việc."},

    { name:"Mô hình vận hành 5 lớp:", desc:"Cấu trúc từ lớp Dữ liệu, Truy xuất thông tin (RAG), Trợ lý tự hành (Agent), Quy trình đến lớp Kiểm soát bởi con người."},

    { name:"Chiến lược AI First:", desc:"Xác định các điểm chạm có thể thay thế bằng AI để tối ưu năng suất, phân biệt giữa Quy trình cố định và Trợ lý tự suy luận."},

    { name:"Đo lường hiệu quả (ROI):", desc:"Áp dụng công thức tính toán lợi nhuận dựa trên thời gian và chi phí nhân sự tiết kiệm được sau khi triển khai hệ thống."}

    ],

    practice:"Trình bày bản thiết kế hệ thống AI giải quyết trực tiếp một bài toán thực tế của doanh nghiệp học viên."

  }

];

// Hàm hỗ trợ lấy class màu sắc linh hoạt

const getColorClasses =(theme)=>{

  const colors ={

    blue:{ badge:'bg-blue-600 shadow-blue-500/50', border:'border-blue-500', text:'text-blue-600', bgLight:'bg-blue-50/50', borderLight:'border-blue-100/50'},

    cyan:{ badge:'bg-cyan-500 shadow-cyan-500/50', border:'border-cyan-500', text:'text-cyan-600', bgLight:'bg-cyan-50/50', borderLight:'border-cyan-100/50'},

    purple:{ badge:'bg-purple-500 shadow-purple-500/50', border:'border-purple-500', text:'text-purple-600', bgLight:'bg-purple-50/50', borderLight:'border-purple-100/50'},

    indigo:{ badge:'bg-indigo-600 shadow-indigo-600/50', border:'border-indigo-600', text:'text-indigo-600', bgLight:'bg-indigo-50/50', borderLight:'border-indigo-100/50'}

  };

  return colors[theme]|| colors.blue;

};

// --- COMPONENT CHÍNH ---

exportdefaultfunctionApp(){

  const[isScrolled, setIsScrolled]= useState(false);

  const[activeSession, setActiveSession]= useState(1);// Mặc định mở Buổi 1

  // Hàm xử lý việc mở/đóng module

  const toggleSession =(id)=>{

    setActiveSession(activeSession === id ?null: id);

  };

  // Xử lý hiệu ứng Navbar Glassmorphism khi cuộn

  useEffect(()=>{

    const handleScroll =()=>{

    setIsScrolled(window.scrollY >50);

    };

    window.addEventListener('scroll', handleScroll);

    return()=> window.removeEventListener('scroll', handleScroll);

  },[]);

  return(

    `<div className="bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">`

    {/* 0. NAVBAR */}

    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ?'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 py-2':'bg-transparent py-4'}`}>

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    `<div className="flex justify-between items-center h-16">`

    `<div className="flex-shrink-0 flex items-center gap-3">`

    <motion.div

    whileHover={{ rotate:90}}

    className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"

    >

    C

    </motion.div>

    <span className={`font-bold text-2xl tracking-tight transition-colors ${isScrolled ?'text-blue-900':'text-white'}`}>

    CESGlobal`<span className="text-blue-500">`.


    `</div>`

    <div className={`hidden md:flex space-x-8 ${isScrolled ?'text-slate-600':'text-blue-100'}`}>

    `<a href="#tong-quan" className="hover:text-blue-500 font-medium transition-colors">`Tổng quan`</a>`

    `<a href="#lo-trinh" className="hover:text-blue-500 font-medium transition-colors">`Lộ trình`</a>`

    `<a href="#ecosystem" className="hover:text-blue-500 font-medium transition-colors">`Hệ sinh thái`</a>`

    `</div>`

    `<div>`

    <motion.a

    whileHover={{ scale:1.05, y:-2}}

    whileTap={{ scale:0.95}}

    href="#dang-ky"

    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-blue-500/30 transition-all inline-block"

    >

    Đăng ký ngay

    </motion.a>

    `</div>`

    `</div>`

    `</div>`

    `</nav>`

    {/* 1. HERO SECTION */}

    `<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-blue-950">`

    `<div className="absolute inset-0 overflow-hidden pointer-events-none">`

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

    `</div>`

    `<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">`

    <motion.div

    initial={{ opacity:0, y:-20}}

    animate={{ opacity:1, y:0}}

    transition={{ duration:0.5}}

    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm"

    >

    `<Rocket size={16} />` Phiên bản 2026Mới Nhất

    </motion.div>

    <motion.h1

    initial={{ opacity:0, y:20}}

    animate={{ opacity:1, y:0}}

    transition={{ duration:0.7, delay:0.2}}

    className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"

    >

    LÀMCHỦ`<br/>` `<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">`GOOGLEAI

    </motion.h1>

    <motion.p

    initial={{ opacity:0}}

    animate={{ opacity:1}}

    transition={{ duration:0.7, delay:0.4}}

    className="mt-4 text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-12"

    >

    Xây dựng hệ thống làm việc thông minh & tựđộng hóa dành cho Cấp quản lý,Chuyên viên vàDoanh nghiệp vừa và nhỏ(SME).

    </motion.p>

    <motion.div

    variants={staggerContainer}

    initial="hidden"

    animate="visible"

    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10"

    >

    {[

    { icon:Clock, title:"Thời lượng", text:"5 buổi (2.5 - 3h/buổi)", sub:"+ 4 tuần làm SP có Mentor"},

    { icon:Target, title:"Phương pháp", text:"Outcome-based", sub:"(Ra sản phẩm thực tế)"},

    { icon:PieChart, title:"Tỷ lệ học", text:"30% Tư duy - 70% Thực chiến", sub:"Thực hành liên tục", isHighlight:true}

    ].map((item, idx)=>(

    <motion.div

    key={idx}

    variants={cardVariant}

    whileHover={{ y:-5, backgroundColor:"rgba(255,255,255,0.15)"}}

    className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white text-left flex flex-col items-center md:items-start text-center md:text-left"

    >

    <item.icon size={36} className="text-blue-400 mb-4" />

    `<h3 className="text-lg font-semibold text-blue-200 uppercase tracking-wider mb-2">`{item.title}`</h3>`

    {item.isHighlight ?(

    `<p className="font-medium text-lg text-blue-400 mt-2 text-2xl leading-tight">`

    30%`<span className="text-lg text-white font-normal">`Tư duy`<br/>`70%`<span className="text-lg text-white font-normal">`Thực chiến

    `</p>`

    ):(

    `<p className="font-medium text-lg leading-tight">`

    {item.text}`<br/><span className="text-sm font-normal text-blue-200 mt-1 block">`{item.sub}

    `</p>`

    )}

    </motion.div>

    ))}

    </motion.div>

    `</div>`

    `</section>`

    {/* 2. TỔNG QUAN & TRIẾT LÝ */}

    `<section id="tong-quan" className="py-20 bg-white">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true, margin:"-100px"}}

    className="text-center max-w-3xl mx-auto mb-16"

    >

    `<h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">`Phần I`</h2>`

    `<h3 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">`Tổng QuanChương Trình`</h3>`

    `<div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>`

    </motion.div>

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}

    className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-sm relative overflow-hidden"

    >

    <Quote size={80} className="absolute top-8 right-10 text-blue-200 opacity-50" />

    `<h4 className="text-2xl font-bold text-blue-900 mb-4 relative z-10">`Triết lýđào tạo`</h4>`

    `<p className="text-lg text-gray-700 leading-relaxed mb-8 relative z-10">`

    Chúng tôi không dạy "tool rời rạc"— màđi theo quy trình thực tế giúp học viên làm chủ toàn bộ hệ sinh thái AI của Googleđểáp dụng ngay vào công việc và kinh doanh.

    `</p>`

    {/* Flow Diagram */}

    `<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 my-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative z-10">`

    {['Idea','Content','App','Workflow','Agent'].map((step, idx)=>(

    <React.Fragment key={step}>

    <motion.div

    initial={{ opacity:0, scale:0.8}} whileInView={{ opacity:1, scale:1}} transition={{ delay: idx *0.1}}

    className="flex items-center"

    >

    `<span className="text-blue-700 font-bold bg-blue-100 px-4 py-2 rounded-lg">`{step}

    </motion.div>

    <motion.div

    initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{ delay:(idx *0.1)+0.05}}

    className="text-blue-500 mx-2 hidden md:block"

    >

    `<ArrowRight size={20} />`

    </motion.div>

    <motion.div

    initial={{ opacity:0}} whileInView={{ opacity:1}} transition={{ delay:(idx *0.1)+0.05}}

    className="text-blue-500 my-2 block md:hidden"

    >

    `<ArrowDown size={20} />`

    </motion.div>

    </React.Fragment>

    ))}

    <motion.div

    initial={{ opacity:0, scale:0.8}} whileInView={{ opacity:1, scale:1}} transition={{ delay:0.6}}

    className="flex items-center"

    >

    `<span className="text-white font-bold bg-blue-600 px-6 py-2 rounded-lg shadow-md shadow-blue-500/30">`Business

    </motion.div>

    `</div>`

    `<p className="text-lg text-gray-700 font-medium text-center bg-white/60 p-4 rounded-xl relative z-10">`

    Học viên sẽ không chỉ học cách dùng từng công cụ riêng lẻ màđược hướng dẫn xây dựng một quy trình/ hệ thống hoàn chỉnh từý tưởng đến triển khai thực tế.

    `</p>`

    </motion.div>

    `</div>`

    `</section>`

    {/* 3. ĐIỂM KHÁC BIỆT */}

    `<section className="py-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:30px_30px] bg-slate-50 relative">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}

    className="text-center mb-16"

    >

    `<h3 className="text-3xl font-bold text-gray-900">`SựKhác Biệt Cốt Lõi`</h3>`

    `<p className="mt-4 text-gray-600 text-lg">`Tại sao chương trình của CESGlobal là duy nhất?`</p>`

    </motion.div>

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}

    className="overflow-x-auto shadow-2xl shadow-blue-900/5 rounded-2xl bg-white border border-gray-100"

    >

    `<table className="w-full text-left border-collapse">`

    `<thead>`

    `<tr>`

    `<th className="py-5 px-6 bg-slate-50 font-bold text-gray-700 text-lg border-b border-gray-200 w-1/4">`Tiêu chí`</th>`

    `<th className="py-5 px-6 bg-slate-100 font-bold text-gray-600 text-lg border-b border-gray-200 w-1/3">`Đào tạo AI thông thường`</th>`

    `<th className="py-5 px-6 bg-blue-600 font-bold text-white text-lg border-b border-blue-700 w-5/12">`GoogleAIEcosystemBootcamp`</th>`

    `</tr>`

    `</thead>`

    `<tbody className="text-gray-700 divide-y divide-gray-100">`

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

    className="hover:bg-slate-50 transition-colors"

    >

    `<td className="py-4 px-6 font-semibold">`{row.k}`</td>`

    `<td className="py-4 px-6 text-gray-500 line-through decoration-red-300">`{row.o}`</td>`

    `<td className="py-4 px-6 font-medium text-blue-800 bg-blue-50/50 flex items-start gap-2">`

    `<Check className="text-green-500 shrink-0 mt-0.5" size={20} />`

    `<span>`{row.n}

    `</td>`

    </motion.tr>

    ))}

    `</tbody>`

    `</table>`

    </motion.div>

    `</div>`

    `</section>`

    {/* 4. ĐỐI TƯỢNG */}

    `<section className="py-20 bg-blue-900 text-white">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    <motion.div

    variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}

    className="text-center max-w-3xl mx-auto mb-16"

    >

    `<h2 className="text-blue-300 font-semibold tracking-wide uppercase text-sm">`Phần II`</h2>`

    `<h3 className="mt-2 text-3xl md:text-4xl font-bold">`Đối Tượng ThamGia`</h3>`

    `<p className="mt-4 text-blue-100 text-lg">`Chương trình được thiết kế cá nhân hóa để mang lại giá trị thực tế cho từng nhóm đối tượng:`</p>`

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

    whileHover={{ scale:1.03, backgroundColor:"rgba(30, 64, 175, 1)"}}// bg-blue-800

    className="bg-blue-800/50 p-6 rounded-2xl border border-blue-700 transition-colors duration-300 group"

    >

    `<div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">`

    <role.icon size={28} />

    `</div>`

    `<h4 className="text-xl font-bold mb-3">`{role.title}`<span className="text-blue-300 font-normal text-sm block mt-1">`{role.sub}`</h4>`

    `<p className="text-blue-100 leading-relaxed text-sm md:text-base">`{role.desc}`</p>`

    </motion.div>

    ))}

    </motion.div>

    `</div>`

    `</section>`

    {/* 5. PHƯƠNG PHÁP */}

    `<section className="py-20 bg-white overflow-hidden">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    `<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">`

    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true}}>

    <motion.h3 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-8">Triết lý phương pháp đào tạo</motion.h3>

    `<div className="space-y-8">`

    {[

    { icon:Trophy, title:"Học đi đôi với thực chiến", sub:"(Outcome-based)", desc:"Mỗi buổi học kết thúc với sản phẩm đầu ra hoàn chỉnh, áp dụng được ngay."},

    { icon:Keyboard, title:"Làm trực tiếp trên công cụ mới nhất", sub:"(Learning by Doing)", desc:"Thực hành trực tiếp trên các công cụ, mô hình AI mới nhất của Google."},

    { icon:Briefcase, title:"Giải quyết bài toán thực tế", sub:"(Real-world Cases)", desc:"Luôn sử dụng các bài toán thực tế, cấp thiết từ hoạt động doanh nghiệp."},

    { icon:Layers, title:"Lộ trình bài bản dễ hiểu", sub:"(Progressive Complexity)", desc:"Học theo lộ trình tăng dần: Từ nền tảng tư duy → Ứng dụng thực tế → Hệ thống hóa tổng thể."}

    ].map((item, idx)=>(

    <motion.div key={idx} variants={fadeInUp} className="flex gap-5 group">

    `<div className="flex-shrink-0 w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">`

    <item.icon size={24} />

    `</div>`

    `<div>`

    `<h4 className="text-xl font-bold text-gray-900 mb-1">`{item.title}`<span className="text-blue-600 text-base font-normal">`{item.sub}`</h4>`

    `<p className="text-gray-600">`{item.desc}`</p>`

    `</div>`

    </motion.div>

    ))}

    `</div>`

    </motion.div>

    <motion.div

    initial={{ opacity:0, scale:0.9, x:50}}

    whileInView={{ opacity:1, scale:1, x:0}}

    transition={{ duration:0.8}}

    viewport={{ once:true}}

    className="relative"

    >

    `<div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>`

    `<img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Đội ngũ làm việc với AI" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover h-[400px] md:h-[500px]" />`

    </motion.div>

    `</div>`

    `</div>`

    `</section>`

    {/* 6. HỆ SINH THÁI (ECOSYSTEM MAP) */}

    `<section id="ecosystem" className="py-20 bg-slate-900 border-t-4 border-blue-500">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}} className="text-center mb-16">

    `<h2 className="text-blue-400 font-semibold tracking-wide uppercase text-sm flex items-center justify-center gap-2"><Zap size={16}/>` Phần III`</h2>`

    `<h3 className="mt-2 text-3xl md:text-5xl font-bold text-white mb-6">`BẢNĐỒHỆSINHTHÁIGOOGLEAI2026`</h3>`

    `<p className="text-blue-200 text-lg">`Học viên sẽ có cơ hội làm chủ sức mạnh của hơn 20 công cụ tiên tiến nhất:`</p>`

    </motion.div>

    {/* Ecosystem UI Map */}

    `<div className="relative max-w-5xl mx-auto p-4 md:p-8 border-2 border-blue-500/30 rounded-3xl bg-slate-800/50 backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.15)]">`

    <motion.div

    initial={{ opacity:0, y:-20}} whileInView={{ opacity:1, y:0}} viewport={{ once:true}}

    className="flex justify-center mb-12 relative z-20"

    >

    `<div className="border-2 border-blue-400 bg-blue-900/90 py-4 px-10 rounded-xl text-center shadow-[0_0_20px_rgba(96,165,250,0.4)] backdrop-blur-md">`

    `<h4 className="text-2xl font-black text-white tracking-widest">`GOOGLEAIECOSYSTEM`</h4>`

    `<p className="text-blue-300 font-mono mt-1 text-sm">`TheCompleteMap2026`</p>`

    `</div>`

    </motion.div>

    {/* Desktop Connectors */}

    `<div className="hidden md:block absolute top-[110px] left-1/2 w-[2px] h-[40px] bg-blue-500/50 -translate-x-1/2 z-10"></div>`

    `<div className="hidden md:block absolute top-[150px] left-[16.66%] right-[16.66%] h-[2px] bg-blue-500/50 z-10"></div>`

    `<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative mt-8 md:mt-0 z-20">`

    {/* Col 1 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.2}} viewport={{ once:true}} className="space-y-8 relative">

    `<div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-500/50 -translate-x-1/2"></div>`

    `<div className="border border-indigo-500/50 hover:border-indigo-400 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-indigo-900/80 py-3 text-center border-b border-indigo-500/30 font-bold text-white tracking-wider text-sm">`MODELS`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-indigo-200 text-center text-sm">`

    {['Pro','Thinking','DeepThin(k)','Fast'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}`</div>`)}

    `</div>`

    `</div>`

    `<div className="flex justify-center text-indigo-500"><ArrowDown size={20} />``</div>`

    `<div className="border border-indigo-500/50 hover:border-indigo-400 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-indigo-900/80 py-3 text-center border-b border-indigo-500/30 font-bold text-white tracking-wider text-sm">`ASSISTANTS`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-indigo-200 text-center text-sm">`

    {['Notebook LM','Gemini Gems','Workspace'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}`</div>`)}

    `</div>`

    `</div>`

    </motion.div>

    {/* Col 2 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.4}} viewport={{ once:true}} className="space-y-8 relative">

    `<div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-500/50 -translate-x-1/2"></div>`

    `<div className="border border-cyan-500/50 hover:border-cyan-400 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-cyan-900/80 py-3 text-center border-b border-cyan-500/30 font-bold text-white tracking-wider text-sm">`BUILD&CODE`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-cyan-200 text-center text-sm">`

    {['Opal','Antigravity','Jules','AI Studio'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}`</div>`)}

    `</div>`

    `</div>`

    `<div className="flex justify-center text-cyan-500"><ArrowDown size={20} />``</div>`

    `<div className="border border-cyan-500/50 hover:border-cyan-400 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-cyan-900/80 py-3 text-center border-b border-cyan-500/30 font-bold text-white tracking-wider text-sm">`AGENTS`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-cyan-200 text-center text-sm">`

    {['Project Genie','Project Mariner'].map(t =><div key={t} className="py-2 hover:bg-slate-700/50 rounded transition cursor-default">{t}`</div>`)}

    `</div>`

    `</div>`

    </motion.div>

    {/* Col 3 */}

    <motion.div initial={{ opacity:0, y:30}} whileInView={{ opacity:1, y:0}} transition={{ delay:0.6}} viewport={{ once:true}} className="space-y-8 relative">

    `<div className="hidden md:block absolute -top-[40px] left-1/2 w-[2px] h-[40px] bg-blue-500/50 -translate-x-1/2"></div>`

    `<div className="border border-blue-400/50 hover:border-blue-300 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-blue-800/80 py-3 text-center border-b border-blue-400/30 font-bold text-white tracking-wider text-sm">`CREATIVE`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-blue-100 text-center text-sm">`

    {['Imagen 3','Nano Banana','Mixboard','Veo 3.1','Vids'].map(t =><div key={t} className="py-1 hover:bg-slate-700/50 rounded transition cursor-default">{t}`</div>`)}

    `</div>`

    `</div>`

    `<div className="flex justify-center text-blue-400"><ArrowDown size={20} />``</div>`

    `<div className="border border-blue-400/50 hover:border-blue-300 transition-colors rounded-xl overflow-hidden bg-slate-800/80 shadow-lg">`

    `<div className="bg-blue-800/80 py-3 text-center border-b border-blue-400/30 font-bold text-white tracking-wider text-sm">`PIPELINE`</div>`

    `<div className="p-3 flex flex-col gap-1 font-mono text-blue-200 text-center text-sm">`

    `<div className="py-1">`Data`</div>`

    `<div className="text-blue-500 leading-none">`↓`</div>`

    `<div className="py-1">`Model`</div>`

    `<div className="text-blue-500 leading-none">`↓`</div>`

    `<div className="py-1">`Workflow`</div>`

    `<div className="text-blue-500 leading-none">`↓`</div>`

    `<div className="py-1 font-bold text-white">`Agent`</div>`

    `</div>`

    `</div>`

    </motion.div>

    `</div>`

    `</div>`

    `</div>`

    `</section>`

    {/* 7. HEADER LỘ TRÌNH */}

    `<section id="lo-trinh" className="pt-24 bg-blue-50">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">`

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}>

    `<h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">`Phần IV`</h2>`

    `<h3 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">`LỘTRÌNHTINHGỌN5BUỔI`</h3>`

    `<p className="mt-4 max-w-3xl mx-auto text-gray-600 text-lg">`

    Dưới đây là nội dung tóm tắt chuyên nghiệp cho từng buổi học trong chương trình GoogleAIEcosystemBootcamp,được thiết kế nhằm giúp doanh nghiệp làm chủ hệ sinh thái AI của Googleđể tối ưu hóa hiệu suất và quy trình làm việc.

    `</p>`

    </motion.div>

    `</div>`

    `</section>`

    {/* 8. CÁC BUỔI HỌC (ACCORDION TOGGLE) */}

    `<section className="py-12 bg-blue-50">`

    `<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative">`

    {/* Đường line chạy dọc background (ẩn trên mobile nhỏ) */}

    `<div className="hidden md:block absolute left-[44px] top-6 bottom-6 w-1 bg-gradient-to-b from-blue-300 via-cyan-300 to-indigo-300 rounded-full z-0"></div>`

    {courseModules.map((module, index)=>{

    const isActive = activeSession ===module.id;

    const colors = getColorClasses(module.colorTheme);

    return(

    <motion.div

    key={module.id}

    initial={{ opacity:0, y:20}}

    whileInView={{ opacity:1, y:0}}

    transition={{ duration:0.4, delay: index *0.1}}

    viewport={{ once:true, margin:"-50px"}}

    className={`bg-white rounded-3xl ml-0 md:ml-12 relative z-10 transition-all duration-300 border ${isActive ?'shadow-lg border-blue-200':'shadow-sm border-gray-100 hover:border-blue-300 hover:shadow-md'}`}

    >

    {/* Con số đánh dấu (Badge) bên trái */}

    <div className={`md:absolute -left-12 top-5 w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 md:mb-0 border-4 border-white shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-colors duration-500 ${isActive ? colors.badge :'bg-slate-300'}`}>

    {module.id}

    `</div>`

    {/* Phần Header cho phép Click để Toggle */}

    <div

    onClick={()=> toggleSession(module.id)}

    className="p-6 md:px-8 md:py-6 cursor-pointer flex justify-between items-center group"

    >

    <h3 className={`text-xl md:text-2xl font-bold pr-4 transition-colors duration-300 ${isActive ? colors.text :'text-gray-800 group-hover:text-blue-600'}`}>

    {module.title}

    `</h3>`

    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ?'bg-blue-100 text-blue-600 rotate-180':'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>

    `<ChevronDown size={24} />`

    `</div>`

    `</div>`

    {/* Phần Nội dung mở rộng (Content) có hiệu ứng */}

    `<AnimatePresence>`

    {isActive &&(

    <motion.div

    initial={{ height:0, opacity:0}}

    animate={{ height:"auto", opacity:1}}

    exit={{ height:0, opacity:0}}

    transition={{ duration:0.3, ease:"easeInOut"}}

    className="overflow-hidden"

    >

    `<div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 border-t border-gray-50 mt-2">`

    <p className={`${colors.text} font-medium mb-6 flex items-start gap-2 pt-4`}>

    `<Target className="shrink-0 mt-1" size={18}/>`

    `<span><strong className="text-gray-900 mr-1">`Mục tiêu:`</strong>`{module.objective}

    `</p>`

    `<h4 className="font-bold text-gray-800 mb-3 border-b pb-2">`Nội dung trọng tâm:`</h4>`

    `<ul className="space-y-3 text-gray-600 mb-6">`

    {module.points.map((point, i)=>(

    <li key={i} className="flex items-start gap-3">

    `<Check className="text-green-500 shrink-0 mt-0.5" size={18}/>`

    `<span><strong className="text-gray-800">`{point.name}`</strong>`{point.desc}

    `</li>`

    ))}

    `</ul>`

    {/* Box Thực hành */}

    <div className={`${colors.bgLight} p-5 rounded-xl border ${colors.borderLight}`}>

    `<p className="text-gray-700 flex items-start gap-2">`

    <Zap className={`${colors.text} shrink-0 mt-0.5`} size={18}/>

    `<span>`

    <strong className={`${colors.text}`}>Thực hành:`</strong>`{module.practice}


    `</p>`

    `</div>`

    {/* Box Dự án cuối khóa (Chỉ hiện ở Buổi cuối) */}

    {module.isFinal &&(

    `<div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-inner mt-6">`

    `<h4 className="text-xl font-bold text-indigo-800 mb-2 flex items-center gap-2">`

    `<Flag size={20}/>` Dựán cuối khóa:

    `</h4>`

    `<p className="text-gray-700">`Trình bày bản thiết kế hệ thống AI giải quyết trực tiếp một bài toán thực tế của doanh nghiệp học viên.`</p>`

    `</div>`

    )}

    `</div>`

    </motion.div>

    )}

    `</AnimatePresence>`

    </motion.div>

    );

    })}

    `</div>`

    `</section>`

    {/* 9. GIẢNG VIÊN & YÊU CẦU CHUẨN BỊ */}

    `<section className="py-24 bg-white border-t border-gray-100">`

    `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`

    `<div className="grid grid-cols-1 md:grid-cols-2 gap-16">`

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}}>

    `<h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">`Phần V`</h2>`

    `<h3 className="mt-2 text-3xl font-bold text-gray-900 mb-8">`Giới Thiệu Giảng Viên`</h3>`

    `<div className="flex items-center gap-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow cursor-default">`

    `<div className="w-24 h-24 bg-blue-200/50 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">`

    `<Briefcase className="text-blue-500" size={40} />`

    `</div>`

    `<div>`

    `<h4 className="text-xl font-bold text-gray-900">`Giới thiệu giảng viên khóa học`</h4>`

    `<p className="text-gray-600 mt-2">`Chuyên gia hàng đầu trong lĩnh vực triển khai và tích hợp hệ thống AI thực chiến cho Doanh nghiệp.`</p>`

    `</div>`

    `</div>`

    </motion.div>

    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once:true}} transition={{ delay:0.2}}>

    `<h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">`Phần VI`</h2>`

    `<h3 className="mt-2 text-3xl font-bold text-gray-900 mb-8">`Yêu Cầu &Tài Nguyên`</h3>`

    `<div className="bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] rounded-2xl p-8 border border-gray-100">`

    `<h4 className="font-bold text-xl mb-6 text-gray-800 border-b pb-4">`Điều kiện tham gia`</h4>`

    `<ul className="space-y-5">`

    `<li className="flex items-start gap-4">`

    `<div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600"><Mail size={18}/>``</div>`

    `<div><strong className="text-gray-900 block mb-1">`Tài khoản:`</strong><span className="text-gray-600">`Dùng Gmail cá nhân hoặc tài khoản GoogleWorkspaceđang hoạt động ổn định.`</div>`

    `</li>`

    `<li className="flex items-start gap-4">`

    `<div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600"><Laptop size={18}/>``</div>`

    `<div><strong className="text-gray-900 block mb-1">`Thiết bị:`</strong><span className="text-gray-600">`Laptop/Máy tính cá nhân có kết nối Internet tốc độ cao.`</div>`

    `</li>`

    `<li className="flex items-start gap-4">`

    `<div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600"><Check size={18}/>``</div>`{/* Fallback for chrome icon */}

    `<div><strong className="text-gray-900 block mb-1">`Nền tảng:`</strong><span className="text-gray-600">`Cài đặt sẵn GoogleChrome phiên bản mới nhất.`</div>`

    `</li>`

    `<li className="flex items-start gap-4">`

    `<div className="mt-1 bg-red-100 p-2 rounded-lg text-red-500"><Zap size={18}/>``</div>`{/* Fallback for fire icon */}

    `<div><strong className="text-gray-900 block mb-1">`Tinh thần:`</strong><span className="text-gray-600">`Khát khao thực chiến.Đặc biệt, khóa học này KHÔNG yêu cầu kinh nghiệm, kỹ năng lập trình trước đó.`</div>`

    `</li>`

    `</ul>`

    `</div>`

    </motion.div>

    `</div>`

    `</div>`

    `</section>`

    {/* 10. FOOTER & CALL TO ACTION */}

    `<section id="dang-ky" className="py-24 bg-blue-900 text-white relative overflow-hidden">`

    {/* Decor Wave */}

    `<div className="absolute inset-0 opacity-10 pointer-events-none">`

    `<svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">`

    `<path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>`

    `</svg>`

    `</div>`

    `<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">`

    <motion.div

    initial={{ scale:0.8, opacity:0}} whileInView={{ scale:1, opacity:1}} transition={{ duration:0.5}} viewport={{ once:true}}

    className="text-yellow-400 text-3xl mb-6 flex justify-center gap-1"

    >

    {[1,2,3,4,5].map(i =><Crown key={i} size={24} fill="currentColor" />)}

    </motion.div>

    <motion.h2

    initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.2}} viewport={{ once:true}}

    className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight"

    >

    Không chỉ học AI mà xây hệ thống AI cho tương lai

    </motion.h2>

    <motion.p

    initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.4}} viewport={{ once:true}}

    className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto"

    >

    Vui lòng liên hệđểđược tư vấn lộ trình vàđăng ký giữ chỗ ngay hôm nay.

    </motion.p>

    <motion.div

    initial={{ y:20, opacity:0}} whileInView={{ y:0, opacity:1}} transition={{ delay:0.6}} viewport={{ once:true}}

    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"

    >

    <motion.a

    whileHover={{ scale:1.05, backgroundColor:"rgba(255,255,255,0.2)"}} whileTap={{ scale:0.95}}

    href="mailto:dichvukhachhang@cesglobal.com.vn"

    className="flex items-center gap-3 bg-white/10 px-8 py-4 rounded-full transition-all border border-white/20 w-full sm:w-auto justify-center"

    >

    `<Mail size={20} />`

    `<span className="font-medium text-lg">`dichvukhachhang@cesglobal.com.vn

    </motion.a>

    <motion.a

    whileHover={{ scale:1.05, y:-2}} whileTap={{ scale:0.95}}

    href="tel:0911991288"

    className="flex items-center gap-3 bg-blue-500 hover:bg-blue-400 px-8 py-4 rounded-full transition-all shadow-lg shadow-blue-500/50 w-full sm:w-auto justify-center"

    >

    `<Phone size={20} />`

    `<span className="font-bold text-lg">`Hotline:0911991288

    </motion.a>

    </motion.div>

    `<p className="text-blue-400 text-sm">`©2026CESGlobal.All rights reserved.`</p>`

    `</div>`

    `</section>`

    `</div>`

  );

}
