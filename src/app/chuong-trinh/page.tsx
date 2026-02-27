"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Target,
  Brain,
  Wrench,
  PlaySquare,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Workflow,
  Lightbulb,
} from "lucide-react";

import Header from "@/components/layout/Header";

// DỮ LIỆU CHƯƠNG TRÌNH (Bảo toàn 100% nội dung gốc)
const programData = [
  {
    id: 1,
    title: "TƯ DUY AI & HỆ SINH THÁI GOOGLE AI 2026",
    duration: "2.5 - 3 giờ",
    practice: "60% Thực hành",
    leftCol: [
      {
        icon: <Brain className="w-5 h-5 text-blue-400" />,
        title: "1. Tư duy AI Literacy chuẩn doanh nghiệp",
        items: [
          "Thay vì học mẹo vặt, bạn sẽ hiểu bản chất AI (LLM) qua các khái niệm: Token, xác suất, Hallucination, Context Window, Temperature.",
          "Tư duy: AI là \"dự đoán\", không phải \"thấu hiểu\" -> Cần kiểm chứng.",
          "Kỹ thuật: Giao việc theo Framework: Role - Context - Goal - Constraints."
        ]
      },
      {
        icon: <Wrench className="w-5 h-5 text-blue-400" />,
        title: "2. Giải mã Hệ sinh thái Google AI 2026",
        items: [
          "Bức tranh toàn cảnh 20+ công cụ theo nghiệp vụ/quy trình thực tế:",
          "Model (Trái tim): Phân cấp từ Gemini 3 Fast (tốc độ), Pro (cân bằng) đến Thinking/Deep Think (logic chuyên sâu).",
          "Build & Dev: Triển khai nhanh với Opal (no-code), Antigravity (Agent platform), Jules (coding) và AI Studio.",
          "Productivity: Tối ưu hóa qua Gemini Gems, NotebookLM và tích hợp trực tiếp vào Workspace/Chrome.",
          "Sáng tạo: Xử lý đa phương thức (Multimodal) với Imagen 3 (ảnh), Veo 3.1 (video), Nano Banana.",
          "Automation: Tự động hóa hành động với Project Mariner & Genie."
        ]
      },
      {
        icon: <Lightbulb className="w-5 h-5 text-blue-400" />,
        title: "3. Tư duy Chiến lược & Thực hành (Hands-on)",
        items: [
          "Chiến lược: Cách chọn đúng Model và kết nối: Data -> Model -> App -> Workflow.",
          "Thực hành: Setup Google AI Studio & so sánh hiệu suất 4 Model.",
          "Tạo và tinh chỉnh Gemini Gem (AI Persona) cá nhân."
        ]
      }
    ],
    practiceTasks: [
      "Setup Google AI Studio",
      "So sánh 4 model với cùng một task",
      "Tạo và tinh chỉnh Gemini Gem (AI Persona cá nhân)",
      "Quan sát sự thay đổi khi điều chỉnh"
    ],
    outcomes: [
      "Sở hữu 01 AI Persona hoạt động thực tế.",
      "Nắm trọn Bản đồ hệ sinh thái Google AI 2026.",
      "Kỹ năng chọn đúng công cụ cho từng bài toán kinh doanh.",
      "Chuyển đổi tư duy: AI là Cộng sự (Teammate), không phải Chatbot."
    ]
  },
  {
    id: 2,
    title: "AI TRONG NGHIÊN CỨU, PHÂN TÍCH & QUẢN LÝ TRI THỨC",
    duration: "2.5 - 3 giờ",
    practice: "70% Thực hành",
    leftCol: [
      {
        icon: <Brain className="w-5 h-5 text-blue-400" />,
        title: "1. Tư duy: Từ Dữ liệu rời rạc đến Trí tuệ tổ chức",
        items: [
          "Chuyển từ việc hỏi AI dữ liệu chung chung sang huấn luyện AI hiểu sâu sắc sản phẩm, khách hàng và quy trình nội bộ thông qua kỹ thuật RAG (Truy xuất dữ liệu tăng cường).",
          "Nguyên tắc Grounding: Buộc AI bám sát thực tế tài liệu, loại bỏ hoàn toàn \"ảo tưởng\" (hallucination).",
          "Quy trình 4 bước: Xác định mục tiêu -> Thu thập nguồn -> Phân tích đối chiếu -> Kết luận chiến lược."
        ]
      },
      {
        icon: <Wrench className="w-5 h-5 text-blue-400" />,
        title: "2. Hệ thống công cụ Nghiên cứu chuyên sâu",
        items: [
          "Biến dữ liệu thô (PDF, Excel, Web, Video) thành tài sản chiến lược:",
          "NotebookLM (Trung tâm trí tuệ): Xây dựng Kho tri thức (Knowledge Base) an toàn; tính năng Audio Overview biến báo cáo thành Podcast thảo luận sinh động.",
          "Ứng dụng Gemini + Chrome để đọc web nhanh và phân tích đối thủ cạnh tranh.",
          "Gemini Deep Research: Thực hiện nghiên cứu đa bước, tự động tổng hợp dữ liệu thị trường và trích dẫn nguồn (citations) minh bạch.",
          "Multimodal Analysis (Phân tích đa phương thức): Đọc hiểu hình ảnh, video quy trình và số hóa hóa đơn/chứng từ thành bảng dữ liệu có cấu trúc."
        ]
      }
    ],
    practiceTasks: [
      "Xây dựng \"Thư viện chuyên gia\": Nạp hồ sơ năng lực/quy trình công ty vào NotebookLM để tạo trợ lý tư vấn nội bộ.",
      "Lập báo cáo đối thủ: Dùng Deep Research so sánh chi tiết sản phẩm của bạn với 03 đối thủ hàng đầu.",
      "Xử lý tài liệu khổng lồ: Dùng Gemini Pro (Context Window lớn) để tóm tắt văn bản hàng trăm trang.",
      "Trích xuất Video: Tự động tóm tắt nội dung và trích xuất \"Action items\" từ video họp Zoom hoặc đào tạo."
    ],
    outcomes: [
      "Sở hữu 01 Kho tri thức số (NotebookLM) chứa toàn bộ dữ liệu chuyên môn.",
      "Hoàn thành 01 Bản báo cáo nghiên cứu thị trường chuyên sâu, có nguồn dẫn.",
      "Làm chủ kỹ năng trích xuất dữ liệu từ mọi định dạng (Văn bản, Ảnh, Video, Audio).",
      "Quy trình cá nhân hóa AI để biến nó thành chuyên gia am hiểu doanh nghiệp nhất."
    ]
  },
  {
    id: 3,
    title: "TỰ ĐỘNG HÓA SÁNG TẠO: HÌNH ẢNH, VIDEO & TRUYỀN THÔNG",
    duration: "2.5 - 3 giờ",
    practice: "70% Thực hành",
    leftCol: [
      {
        icon: <Brain className="w-5 h-5 text-blue-400" />,
        title: "1. Tư duy: Creative Pipeline - Tốc độ là lợi thế",
        items: [
          "Loại bỏ rào cản kỹ thuật thiết kế/dựng phim để tập trung vào hiện thực hóa ý tưởng với độ chính xác thương hiệu tuyệt đối.",
          "Tính nhất quán (Consistency): Giữ vững đặc điểm nhân vật/sản phẩm qua nhiều bối cảnh.",
          "Chất lượng thương mại: Tạo ra sản phẩm sử dụng được ngay cho marketing thực tế, không tạo cảm giác \"ảnh AI giả tạo\"."
        ]
      },
      {
        icon: <Sparkles className="w-5 h-5 text-blue-400" />,
        title: "2. Hệ thống công cụ Sáng tạo Đa phương tiện 2026",
        items: [
          "Quy trình phối hợp liên hoàn để tạo bộ nhận diện truyền thông:",
          "Hình ảnh (Imagen 3 & Nano Banana): Tạo ảnh chi tiết cao, xử lý tốt chữ viết và ánh sáng. Sử dụng Subject Consistency để giữ nguyên nhân vật và Whisk để tuân thủ Brand Guidelines.",
          "Video (Veo 3.1 & Vids): Chế tác video chất lượng điện ảnh từ văn bản/hình ảnh. Google Vids tự động lắp ghép kịch bản, hình ảnh và lồng tiếng thành video hoàn chỉnh.",
          "Thiết kế & Chỉnh sửa: Mixboard hỗ trợ bố cục nhanh; Magic Editor chỉnh sửa vật thể và mở rộng khung hình bằng lệnh văn bản thay thế Photoshop."
        ]
      }
    ],
    practiceTasks: [
      "Thiết kế Campaign Visual: Tạo 01 ảnh chủ đạo và 05 biến thể giữ nguyên nhân vật/sản phẩm (Hero Image).",
      "Chế tác Video Marketing 15s: Phối hợp Veo và Vids tạo video giới thiệu sản phẩm có nhạc nền và lời bình tự động.",
      "Xây dựng Moodboard tự động: Từ Slogan, yêu cầu AI xuất bảng màu và phong cách hình ảnh tương ứng.",
      "AI Editing: Thực hành thay đổi trang phục, bối cảnh mẫu ảnh chỉ bằng câu lệnh."
    ],
    outcomes: [
      "Sở hữu 01 Bộ Creative Marketing Package hoàn chỉnh (Ảnh chủ đạo & Social assets).",
      "Sở hữu 01 Video quảng cáo AI sẵn sàng đăng tải đa nền tảng.",
      "Làm chủ công thức Prompt chuyên sâu: Subject - Setting - Lighting - Camera Angle - Style.",
      "Kỹ năng điều khiển AI theo nhận diện thương hiệu, giải phóng sức lao động thủ công."
    ]
  },
  {
    id: 4,
    title: "TỰ XÂY ỨNG DỤNG & TỰ ĐỘNG HÓA QUY TRÌNH (NO-CODE AI)",
    duration: "2.5 - 3 giờ",
    practice: "70% Thực hành",
    leftCol: [
      {
        icon: <Brain className="w-5 h-5 text-blue-400" />,
        title: "1. Tư duy: Người xây dựng hệ thống (AI Builder)",
        items: [
          "Chuyển đổi từ \"người dùng AI\" sang \"người xây dựng ứng dụng\" mà không cần kiến thức lập trình.",
          "Tư duy No-code: Sử dụng ngôn ngữ tự nhiên để thiết lập logic và cấu trúc phần mềm.",
          "Nguyên tắc hệ thống: Chia nhỏ quy trình kinh doanh thành mô hình Input - Process - Output.",
          "Kiểm soát: Thiết lập cơ chế Human-in-the-loop để con người kiểm duyệt các bước quan trọng."
        ]
      },
      {
        icon: <Workflow className="w-5 h-5 text-blue-400" />,
        title: "2. Hệ thống công cụ Xây dựng & Tự động hóa 2026",
        items: [
          "Biến ngôn ngữ tự nhiên thành các thực thể kỹ thuật có khả năng thực thi:",
          "Google Opal: Tạo ứng dụng chuyên biệt (CRM, Quản lý kho, Chấm công) chỉ bằng cách mô tả yêu cầu. AI tự thiết kế giao diện và cấu trúc dữ liệu.",
          "Workspace Studio: Thiết lập kịch bản tự động hóa liên ứng dụng (Cross-App). Ví dụ: Email khách hàng -> Phân loại AI -> Lưu Sheets -> Thông báo nhóm chat.",
          "Google AppSheet: Biến Google Sheets thành ứng dụng di động chuyên nghiệp có khả năng quét mã vạch, GPS và tự động hóa luồng phê duyệt (nhắc nợ, nghỉ phép)."
        ]
      }
    ],
    practiceTasks: [
      "Xây dựng Mini App: Dùng Opal tạo ứng dụng quản lý công việc hoặc khách hàng hoạt động thực tế.",
      "Thiết lập Chuỗi tự động hóa: Tạo luồng: Nhận Form -> AI phân tích cảm xúc -> Tự động soạn thư phản hồi.",
      "Xây dựng Dashboard thông minh: Kết nối dữ liệu đa nguồn về bảng điều khiển trung tâm để theo dõi KPI thời gian thực.",
      "Thực hành AppSheet: Chuyển đổi file Sheets có sẵn thành ứng dụng di động trong 5 phút."
    ],
    outcomes: [
      "Sở hữu 01 Mini App hoạt động thực tế trên điện thoại/máy tính.",
      "Thiết lập 01 Quy trình tự động hóa giúp tiết kiệm ít nhất 1-2 giờ làm việc mỗi ngày.",
      "Kỹ năng thiết kế logic ứng dụng hoàn toàn bằng ngôn ngữ tự nhiên.",
      "Nắm vững tư duy giải quyết vấn đề bằng hệ thống thay vì sức người thủ công."
    ]
  },
  {
    id: 5,
    title: "THIẾT KẾ HỆ THỐNG AI TOÀN DIỆN & CHIẾN LƯỢC VẬN HÀNH",
    duration: "2.5 - 3 giờ",
    practice: "70% Thực hành",
    leftCol: [
      {
        icon: <Brain className="w-5 h-5 text-blue-400" />,
        title: "1. Tư duy: Kiến trúc sư AI (AI Architect)",
        items: [
          "Chuyển từ sử dụng công cụ rời rạc sang thiết kế bộ máy vận hành thống nhất, biến AI thành thành phần cốt lõi trong sơ đồ tổ chức.",
          "Framework AI First (5 lớp): Dữ liệu -> Truy xuất (RAG) -> Tác nhân (Agent) -> Quy trình (Workflow) -> Kiểm soát (Human-in-the-loop).",
          "Agentic Workflow: Phân biệt giữa quy trình cố định và trợ lý tự suy luận; ứng dụng Project Mariner & Genie để AI tự thực hiện chuỗi nhiệm vụ phức tạp."
        ]
      },
      {
        icon: <Wrench className="w-5 h-5 text-blue-400" />,
        title: "2. Quản trị & Thiết kế Hệ thống 2026",
        items: [
          "Tập trung vào tính quy mô, bảo mật và hiệu quả tài chính:",
          "AI Governance: Thiết lập quy định sử dụng AI, bảo mật dữ liệu doanh nghiệp và đảm bảo tính nhất quán của đầu ra.",
          "System Design Canvas: Bản đồ trực quan hóa luồng thông tin và công việc trong toàn tổ chức.",
          "Chiến lược ROI: Công thức chuyển đổi năng suất và thời gian tiết kiệm được thành con số tài chính cụ thể."
        ]
      }
    ],
    practiceTasks: [
      "Hoàn thiện System Design Canvas: Thiết kế kiến trúc AI giải quyết bài toán thực tế của chính doanh nghiệp bạn.",
      "Xây dựng Prototype: Kết nối liên hoàn các thành phần (ví dụ: NotebookLM + Workspace Automation) để trình diễn khả năng vận hành.",
      "Tính toán bài toán kinh tế: Sử dụng Template ROI để ước tính chi phí và nhân lực tiết kiệm được sau khi triển khai.",
      "Thuyết trình Capstone: Trình bày giải pháp AI toàn diện và nhận phản hồi thực tế từ chuyên gia."
    ],
    outcomes: [
      "Sở hữu 01 Bản thiết kế hệ thống AI hoàn chỉnh cho cá nhân/doanh nghiệp.",
      "Bảng tính toán ROI với số liệu cụ thể về hiệu quả kinh tế.",
      "Lộ trình triển khai (Roadmap) chi tiết để áp dụng vào thực tế ngay sau khóa học.",
      "Chứng nhận hoàn thành Bootcamp, khẳng định năng lực làm chủ hệ sinh thái Google AI 2026."
    ]
  }
];

export default function AIProgramCurriculum() {
  return (
    <>
      <Header />

      {/* Sử dụng màu nền tối (Dark Navy) tham khảo từ hình ảnh */}
      <section className="bg-[#050B14] min-h-screen py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* TIÊU ĐỀ SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              Nội Dung Chương Trình<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Google AI 2026 Bootcamp
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Chương trình đào tạo thực chiến được thiết kế hệ thống, giúp bạn làm chủ công nghệ và tự động hóa quy trình ngay tại lớp.
            </p>
          </motion.div>

          {/* DANH SÁCH CÁC BUỔI HỌC (TIMELINE CARDS) */}
          <div className="space-y-12 relative">
            {/* Đường timeline mờ dọc theo các card ở desktop */}
            <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-900/50 via-blue-800/30 to-transparent z-0"></div>

            {programData.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative z-10"
              >
                {/* Box chứa Nội dung từng buổi */}
                <div className="bg-[#0A1128] border border-blue-900/40 rounded-3xl overflow-hidden shadow-2xl hover:border-blue-500/50 transition-colors duration-300">
                  {/* Header của Buổi học */}
                  <div className="p-6 md:p-8 border-b border-blue-900/40 bg-gradient-to-r from-[#0d1633] to-[#0A1128]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Vòng tròn số thứ tự */}
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          {session.id}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
                          {session.title}
                        </h3>
                      </div>

                      {/* Meta data: Thời lượng & Thực hành */}
                      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                        <div className="flex items-center gap-2 bg-blue-950/50 border border-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          Thời lượng: {session.duration}
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-950/50 border border-indigo-900/50 text-indigo-300 px-4 py-2 rounded-full text-sm font-medium">
                          <Target className="w-4 h-4" />
                          Tỷ trọng: {session.practice}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body của Buổi học - Grid Layout phân bổ nội dung */}
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* CỘT TRÁI: Lý thuyết & Công cụ (Chiếm 7 cột) */}
                    <div className="p-6 md:p-8 lg:col-span-7 space-y-6">
                      {session.leftCol.map((section, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: idx * 0.15 }}
                          className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-6 hover:border-blue-700/50 hover:bg-[#0c1638]/60 transition-all duration-300 shadow-sm hover:shadow-md group"
                        >
                          <h4 className="flex items-center gap-3 text-lg font-semibold text-slate-100 mb-5">
                            <span className="p-2.5 bg-blue-900/40 rounded-xl border border-blue-800/50 group-hover:scale-110 group-hover:bg-blue-800/60 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300">
                              {section.icon}
                            </span>
                            {section.title}
                          </h4>
                          <ul className="space-y-3.5 pl-2 text-slate-300">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <ChevronRight className="w-5 h-5 shrink-0 text-blue-500 mt-[2px]" />
                                <span className="leading-relaxed text-sm md:text-base">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>

                    {/* CỘT PHẢI: Thực hành & Kết quả (Chiếm 5 cột) */}
                    <div className="p-6 md:p-8 lg:col-span-5 bg-[#070D1F] border-t lg:border-t-0 lg:border-l border-blue-900/40 space-y-8">
                      {/* Khối Thực hành Hands-on */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-3 text-lg font-semibold text-indigo-300">
                          <span className="p-2 bg-indigo-900/30 rounded-lg">
                            <PlaySquare className="w-5 h-5 text-indigo-400" />
                          </span>
                          {session.id === 1 ? "4. 60% thực hành Hands-on" : `${session.practice} Hands-on (Trọng tâm)`}
                        </h4>
                        <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-5">
                          <ul className="space-y-3 text-slate-300 text-sm md:text-base">
                            {session.practiceTasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                                <span className="leading-relaxed">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Khối Kết quả đạt được */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-3 text-lg font-semibold text-emerald-400">
                          <span className="p-2 bg-emerald-900/30 rounded-lg">
                            <Target className="w-5 h-5 text-emerald-400" />
                          </span>
                          🎯 Kết quả đạt được
                        </h4>
                        <ul className="space-y-3 text-slate-300 text-sm md:text-base">
                          {session.outcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                              <span className="leading-relaxed font-medium text-slate-200">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
