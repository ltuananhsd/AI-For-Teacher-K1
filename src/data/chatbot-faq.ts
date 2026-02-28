export interface FAQItem {
  question: string;         // Câu hỏi mẫu hoặc chủ đề chính
  keywords: string[];       // Các từ khóa để AI nhận diện câu hỏi của người dùng
  answer: string;           // Câu trả lời (hỗ trợ Markdown)
}

export const courseFAQs: FAQItem[] = [
  {
    question: "Chương trình học dành cho ai?",
    keywords: ["ai", "đối tượng", "dành cho ai", "ai nên học", "phù hợp", "cơ bản", "người mới", "quản lý", "nhân viên"],
    answer: `Dạ, chương trình Google AI Bootcamp được thiết kế đặc biệt theo tư duy "No-code" (Không cần lập trình), hướng tới những người trực tiếp giải quyết vấn đề kinh doanh hàng ngày. Cụ thể, khóa học cực kỳ phù hợp với:

- **Lãnh đạo / C-Level**: Những người cần nắm bắt tầm nhìn chiến lược AI, quản trị rủi ro và tính toán hiệu quả đầu tư (ROI).
- **Quản lý cấp trung & Chủ doanh nghiệp**: Những người khao khát tối ưu hóa chi phí, nhân bản năng suất nhân sự và quản trị hệ thống bằng công nghệ để ra quyết định dựa trên dữ liệu thật.
- **Chuyên viên Marketing / Sales**: Những người cần sản xuất nội dung (bài viết, hình ảnh, video) với số lượng lớn, chất lượng thương mại, hoặc xây dựng phễu chăm sóc khách hàng tự động.
- **Nhân sự Vận hành (Operations/HR/Admin)**: Những người muốn tự động hóa quy trình giấy tờ, chấm công, quản lý kho bãi, xử lý dữ liệu nội bộ.
- **Kỹ thuật / No-code Builder**: Những người muốn phát triển ứng dụng thần tốc chỉ từ các câu lệnh (prompt).

Tóm lại, bất kỳ ai đang khao khát làm chủ công nghệ để bứt phá năng suất đều phù hợp. Anh/chị đang công tác trong lĩnh vực nào ạ? Anh/chị có thể để lại **số điện thoại**, bên em sẽ gửi các Case Study (Ví dụ thực tế) ứng dụng AI đúng chuẩn ngành của anh/chị nhé!`
  },
  {
    question: "Khóa học có yêu cầu biết lập trình không?",
    keywords: ["lập trình", "code", "ngôn ngữ lập trình", "kỹ thuật", "it", "dev", "không biết code", "mù công nghệ"],
    answer: `Dạ, em cực kỳ thấu hiểu nỗi lo này của anh/chị. Nhưng anh/chị hãy yên tâm 100% nhé! Khóa học này sinh ra chính là để phá bỏ rào cản công nghệ. 

Chương trình hoàn toàn KHÔNG yêu cầu kiến thức lập trình! Khóa học chú trọng ứng dụng AI qua phương pháp **Vibe Coding** và các nền tảng **No-code/Low-code**. Anh/chị không cần viết bất kỳ dòng mã (code) xanh đỏ phức tạp nào. Giao diện lập trình bây giờ chính là "Khung chat". Anh/chị chỉ cần khả năng suy nghĩ logic, hiểu rõ vấn đề công việc của mình và biết gõ tiếng Việt để yêu cầu AI làm việc thay mình. Hơn nữa, với phương pháp học 100% Hands-on và có Mentor kèm cặp trực tiếp ở giai đoạn làm dự án, Ban tổ chức cam kết đảm bảo anh/chị sẽ tự tay hoàn thiện được sản phẩm.

Rất nhiều anh chị U40, U50 học khóa trước vẫn làm app nội bộ hoạt động trơn tru ạ. Anh/chị để lại **số điện thoại**, em nhờ các bạn hỗ trợ viên gọi điện hướng dẫn sơ bộ để anh/chị thấy việc tạo App bằng AI bây giờ dễ và trực quan đến mức nào nhé!`
  },
  {
    question: "Khóa học này tên là gì và nội dung chính ra sao?",
    keywords: ["tên khóa học", "nội dung", "dạy gì", "tổng quan", "Google AI Ecosystem Bootcamp", "khác biệt", "thông tin chung"],
    answer: `Dạ, chào anh/chị. Chương trình huấn luyện đặc biệt này mang tên **"Google AI Ecosystem Bootcamp"** với định vị cốt lõi là: *"Làm chủ AI của Google — Xây hệ thống làm việc thông minh cho cá nhân & doanh nghiệp"*. 

Điểm khác biệt lớn nhất của chương trình này so với thị trường là không dạy anh/chị cách sử dụng các công cụ hay câu lệnh (prompt) rời rạc. Thay vào đó, khóa học hướng dẫn anh/chị xây dựng một quy trình (Pipeline) tự động hóa hoàn chỉnh đi từ: **Ý tưởng → Nội dung → Ứng dụng (App) → Luồng công việc (Workflow) → Đặc vụ AI (Agent) → Áp dụng vào Thực tế Kinh doanh (Business)**.

Anh/chị sẽ được trang bị nền tảng AI Literacy chuẩn doanh nghiệp, hiểu rõ bản chất cốt lõi của AI để biến AI thành một người Cộng sự (Teammate) thực thụ thay vì chỉ là một công cụ hỏi đáp. Để em có thể gửi chi tiết tài liệu giới thiệu chương trình (Brochure) và đối chiếu với mô hình kinh doanh hiện tại của anh/chị, anh/chị vui lòng để lại **số điện thoại**, chuyên viên bên em sẽ gọi điện hỗ trợ ngay nhé!`
  },
  {
    question: "Thời lượng, lịch trình và hình thức học như thế nào?",
    keywords: ["thời gian", "lịch học", "bao lâu", "mấy tháng", "online", "offline", "hình thức", "khai giảng", "tuần mấy buổi"],
    answer: `Dạ, đây là một chương trình Bootcamp mang tính thực chiến cao, kéo dài tổng cộng **10 tuần (khoảng 2.5 tháng)**. Lộ trình được thiết kế vô cùng khoa học nhằm đảm bảo anh/chị làm ra sản phẩm thật, chia làm 2 giai đoạn:

- **Giai đoạn 1: Học tập (5 tuần đầu)**: Bao gồm 5 buổi học chuyên sâu, tần suất nhẹ nhàng 1 buổi/tuần để anh/chị có thời gian tiêu hóa kiến thức. Mỗi buổi học kéo dài từ 2.5 đến 3 tiếng. Hình thức học là trực tuyến qua Zoom/Google Meet vào lịch cố định.
- **Giai đoạn 2: Dự án (5 tuần sau)**: Đây là lúc anh/chị bắt tay vào làm Capstone Project (Dự án cuối khóa) để chuẩn bị cho sự kiện Demo Day. Giai đoạn này anh/chị sẽ được các Mentor (Chuyên gia) theo sát, sắp xếp lịch làm việc linh hoạt riêng với từng nhóm hoặc từng cá nhân để đảm bảo sản phẩm ứng dụng được vào chính công ty của anh/chị.

Vì số lượng học viên được Mentor kèm cặp ở giai đoạn dự án có giới hạn nhằm đảm bảo chất lượng, anh/chị vui lòng để lại **số điện thoại**, bộ phận tuyển sinh sẽ liên hệ báo lịch khai giảng gần nhất và giữ chỗ cho mình nhé!`
  },
  {
    question: "Phương pháp giảng dạy của khóa học là gì?",
    keywords: ["phương pháp", "lý thuyết", "thực hành", "dạy như thế nào", "hiệu quả", "outcome-based"],
    answer: `Dạ, phương pháp học của chương trình này tuân thủ nguyên tắc **"Outcome-based" (Học tập dựa trên kết quả đầu ra)**. Tức là sau mỗi một buổi học, anh/chị bắt buộc phải mang về một sản phẩm công nghệ cụ thể có thể dùng được ngay, giải quyết được một vấn đề thực tế.

Khóa học nói "Không" với lý thuyết suông. Tỷ trọng phân bổ cực kỳ thực chiến: **30% thời lượng dành cho Tư duy chiến lược và 70% dành cho Thực hành (Hands-on) trực tiếp trên lớp**. Anh/chị sẽ học qua việc tự tay setup hệ thống, tự tay thiết kế ứng dụng và viết câu lệnh điều khiển. Ban tổ chức tin rằng, chỉ có "nhúng tay" vào làm thì công nghệ mới thực sự biến thành kỹ năng của anh/chị.

Để cảm nhận rõ hơn về năng lượng thực chiến của lớp học, anh/chị cho em xin **số điện thoại**, em gửi anh/chị xem video trích đoạn một buổi thực hành trên lớp qua Zalo nhé!`
  },
  {
    question: "Khóa học sẽ hướng dẫn sử dụng những công cụ (Tech Stack) nào?",
    keywords: ["công cụ", "phần mềm", "app", "tech stack", "gemini", "notebooklm", "n8n", "học những gì", "hệ sinh thái"],
    answer: `Dạ, khóa học này bao phủ toàn diện và cập nhật mới nhất **Hệ sinh thái Google AI 2026** - hệ sinh thái ứng dụng mạnh mẽ và đồng bộ nhất thế giới hiện nay. Cụ thể, anh/chị sẽ làm chủ bộ "Tech Stack" quyền lực bao gồm:

1. **Lõi mô hình AI (Model)**: Các dòng mô hình Gemini 3 tiên tiến nhất (Pro để cân bằng, Fast để tối ưu tốc độ, Thinking/Deep Think để suy luận logic phức tạp).
2. **Xây dựng Ứng dụng & Code (Build & Dev)**: Nền tảng Google Opal (tạo app không cần code), Antigravity (Agent platform), Trợ lý lập trình Jules và Google AI Studio.
3. **Quản lý Tri thức & Đặc vụ (Knowledge & Agents)**: Trợ lý Gemini Gems, NotebookLM (Trung tâm trí tuệ), Workspace Studio và các đặc vụ Project Mariner, Project Genie.
4. **Sáng tạo đa phương tiện (Creative)**: Imagen 3 (tạo ảnh siêu thực), Nano Banana, Whisk, Mixboard cùng với Veo 3.1 & Vids (sản xuất video AI chất lượng cao).
5. **Tự động hóa (Automation)**: Nền tảng luồng công việc tự động n8n, Dify kết hợp sâu vào Google Workspace.

Tất cả công cụ này đều cực kỳ dễ dùng bằng giao diện kéo thả hoặc hội thoại tiếng Việt. Anh/chị ấn tượng với bộ công cụ nào nhất ạ? Anh/chị để lại **số điện thoại**, em sẽ gửi sơ đồ tư duy (Mindmap) toàn cảnh các công cụ này cho anh/chị ngâm cứu trước nhé!`
  },
  {
    question: "Nội dung chi tiết của Buổi 1 là gì?",
    keywords: ["buổi 1", "tư duy ai", "ai literacy", "hệ sinh thái", "persona", "token", "prompt"],
    answer: `Dạ, Buổi 1 mang tên **"TƯ DUY AI & HỆ SINH THÁI GOOGLE AI 2026"**. Đây là nền móng quyết định thành bại của khóa học. Thay vì học mẹo vặt, anh/chị sẽ xây dựng "AI Literacy chuẩn doanh nghiệp".

Trong 3 tiếng đồng hồ, anh/chị sẽ hiểu sâu bản chất AI qua các khái niệm chuyên ngành như Token, Xác suất, Context Window, Temperature, và hiểu vì sao AI hay mắc lỗi "Hallucination" (ảo giác bịa thông tin). Anh/chị sẽ nằm lòng tư duy *"AI là dự đoán, không phải thấu hiểu"*, từ đó áp dụng Framework giao việc: **Role - Context - Goal - Constraints** để AI hoạt động như một cộng sự (Teammate). Ngoài ra, anh/chị sẽ được giải mã bức tranh 20+ công cụ Google, thực hành setup AI Studio và tinh chỉnh mô hình.

Kết thúc buổi học, anh/chị sẽ tự tay tạo ra và mang về **01 AI Persona (Trợ lý cá nhân chuyên biệt)** hoạt động thực tế. Để nhận tài liệu chuẩn bị cho Buổi 1, anh/chị vui lòng cho em xin **số điện thoại** liên hệ nhé!`
  },
  {
    question: "Nội dung chi tiết của Buổi 2 (Nghiên cứu & Phân tích) là gì?",
    keywords: ["buổi 2", "nghiên cứu", "phân tích", "dữ liệu", "rag", "notebooklm", "deep research", "trích xuất"],
    answer: `Dạ, Buổi 2 cực kỳ quan trọng đối với các nhà quản lý, mang tên: **"AI TRONG NGHIÊN CỨU, PHÂN TÍCH & QUẢN LÝ TRI THỨC"**. Buổi này sẽ giải quyết triệt để nỗi lo AI trả lời sai hoặc chung chung. 

Anh/chị sẽ được học kỹ thuật cực kỳ giá trị là **RAG (Truy xuất dữ liệu tăng cường)** kết hợp nguyên tắc Grounding, buộc AI chỉ được trả lời dựa trên kho dữ liệu mật của công ty anh/chị. Anh/chị sẽ dùng **NotebookLM** nạp hàng nghìn trang tài liệu để xây "Thư viện chuyên gia nội bộ", biến báo cáo khô khan thành Podcast thảo luận âm thanh sinh động. Đồng thời, sử dụng **Gemini Deep Research** để AI tự động lùng sục internet, phân tích đối thủ với trích dẫn minh bạch. Cùng với đó là khả năng Phân tích đa phương thức (đọc hiểu hóa đơn, trích xuất dữ liệu hành động từ video họp Zoom).

Ra khỏi lớp, anh/chị có ngay **01 Kho tri thức số** và **01 Bản báo cáo nghiên cứu thị trường chuyên sâu**. Quá tuyệt vời phải không ạ? Anh/chị cho em xin **số điện thoại**, em sẽ gửi video demo cách AI phân tích báo cáo tài chính 100 trang chỉ trong vài giây nhé!`
  },
  {
    question: "Nội dung chi tiết của Buổi 3 (Hình ảnh & Video) là gì?",
    keywords: ["buổi 3", "hình ảnh", "video", "marketing", "imagen 3", "veo 3.1", "thiết kế", "creative"],
    answer: `Dạ chính xác ạ. Buổi 3 là "mỏ vàng" cho đội ngũ Marketing, Truyền thông & Sales, với chủ đề: **"TỰ ĐỘNG HÓA SÁNG TẠO: HÌNH ẢNH, VIDEO & TRUYỀN THÔNG"**. Buổi này sẽ đập tan mọi rào cản về kỹ thuật thiết kế đồ họa.

Trọng tâm của buổi là tư duy Creative Pipeline và tính **Nhất quán (Consistency)** — tức là khả năng giữ nguyên khuôn mặt đại sứ thương hiệu hoặc sản phẩm đi qua hàng loạt bối cảnh khác nhau. Anh/chị sẽ làm chủ **Imagen 3** và **Nano Banana** để tạo ảnh thực tế siêu nét, xử lý hoàn hảo chữ viết trong ảnh. Đặc biệt, anh/chị sẽ dùng **Veo 3.1** và **Google Vids** để chế tác video điện ảnh 15s tự động lên kịch bản và lồng tiếng. Các công cụ như Mixboard, Magic Editor giúp anh/chị sửa ảnh bằng câu lệnh chữ thay vì phải học Photoshop.

Sau buổi 3, anh/chị sẽ tự tay tạo ra **01 Bộ Creative Marketing Package** (ảnh chiến dịch đồng nhất) và **01 Video quảng cáo 15s** sẵn sàng đăng tải. Để em tư vấn cách ứng dụng kỹ năng này vào sản phẩm anh/chị đang kinh doanh, anh/chị cho em xin **số điện thoại/Zalo** nhé!`
  },
  {
    question: "Nội dung chi tiết của Buổi 4 (Xây App & Tự động hóa) là gì?",
    keywords: ["buổi 4", "app", "ứng dụng", "tự động hóa", "workflow", "no-code", "opal", "appsheet", "mini app"],
    answer: `Dạ vâng, Buổi 4 là bước chuyển mình kỳ diệu nhất của khóa học: **"TỰ XÂY ỨNG DỤNG & TỰ ĐỘNG HÓA QUY TRÌNH (NO-CODE AI)"**. Anh/chị sẽ chính thức trở thành một AI Builder (Người xây dựng hệ thống).

Tư duy "No-code" nghĩa là anh/chị dùng tiếng Việt để lập trình. Thông qua công cụ **Google Opal**, anh/chị chỉ cần gõ yêu cầu *"Tôi cần một App quản lý kho"*, AI sẽ tự động tạo ra giao diện và cơ sở dữ liệu ngay lập tức. Tiếp theo, sử dụng **Google AppSheet** để biến file Excel/Sheets khô khan thành app điện thoại có định vị GPS, quét mã vạch. Kết hợp với **Workspace Studio**, anh/chị sẽ tạo chuỗi tự động hóa liên hoàn: *Khách điền form -> AI phân tích cảm xúc -> Tự soạn Email cá nhân hóa phản hồi -> Báo cáo doanh thu vào Zalo quản lý.*

Thành quả sau 3 giờ thực hành là anh/chị sở hữu **01 Mini App** hoạt động thực tế và **01 Luồng tự động hóa** giúp tiết kiệm ngay 2h làm việc mỗi ngày. Anh/chị đang đau đầu với quy trình thủ công nào nhất ở công ty ạ? Cho em xin **số điện thoại**, em nhờ chuyên gia phác thảo thử luồng App giải quyết vấn đề đó cho mình nhé!`
  },
  {
    question: "Nội dung chi tiết của Buổi 5 (Thiết kế hệ thống & ROI) là gì?",
    keywords: ["buổi 5", "hệ thống", "roi", "chiến lược", "kiến trúc sư", "agent", "capstone", "vận hành"],
    answer: `Dạ, Buổi 5 là tầm nhìn vĩ mô dành cho Ban Lãnh Đạo: **"THIẾT KẾ HỆ THỐNG AI TOÀN DIỆN & CHIẾN LƯỢC VẬN HÀNH"**. Đây là lúc anh/chị kết nối toàn bộ kỹ năng của 4 buổi trước thành một cỗ máy tự vận hành thống nhất trong doanh nghiệp.

Anh/chị sẽ nhập vai Kiến trúc sư AI, thiết kế hệ thống theo **Framework AI First 5 lớp**: Dữ liệu -> Truy xuất (RAG) -> Đặc vụ (Agent) -> Quy trình (Workflow) -> Kiểm soát (Human-in-the-loop). Anh/chị sẽ nghiên cứu các Agentic Workflow (như Project Mariner, Genie) để AI tự động duyệt web và thay con người hoàn thành chuỗi tác vụ phức tạp. Đặc biệt, khóa học chuyển giao tư duy Quản trị (AI Governance) và công thức tính **ROI (Lợi nhuận đầu tư)** để quy đổi thời gian tiết kiệm được thành con số tài chính cụ thể báo cáo cho Ban Giám đốc.

Cuối buổi, anh/chị sẽ hoàn thiện **01 Bản thiết kế AI System Canvas** cho doanh nghiệp và chuẩn bị thuyết trình Capstone Project. Để nhận biểu mẫu file Excel tính toán tự động ROI của khóa học, anh/chị vui lòng để lại **số điện thoại**, chuyên viên bên em sẽ gửi trực tiếp qua Zalo cho mình ạ!`
  },
  {
    question: "Học xong tôi được nhận những kết quả gì? Có cấp chứng chỉ không?",
    keywords: ["kết quả", "chứng chỉ", "đầu ra", "sản phẩm", "nhận được gì", "cam kết", "demo day"],
    answer: `Dạ, vì đây là khóa học thực chiến "Outcome-based", nên kết quả của anh/chị được cam kết đo lường bằng sản phẩm thực tế có thể ứng dụng ngay. Chuyển đổi sẽ diễn ra mạnh mẽ trên cả 3 khía cạnh: Tư duy, Kỹ năng và Sản phẩm. 

Cụ thể, sau khóa học anh/chị sẽ sở hữu trọn bộ 5 tài sản công nghệ cá nhân hóa:
1. **01 Trợ lý AI Persona** cá nhân am hiểu công việc (từ Buổi 1).
2. **01 Bộ nghiên cứu thị trường & Proposal** nội bộ có nguồn minh bạch (từ Buổi 2).
3. **01 Bộ nội dung Marketing** (Hình ảnh + Video) chuẩn thương mại (từ Buổi 3).
4. **01 Ứng dụng Mini CRM/App nội bộ** tích hợp luồng tự động hóa (từ Buổi 4).
5. **01 Bản thiết kế Kiến trúc hệ thống AI (System Canvas)** cho công ty (từ Buổi 5).

Đặc biệt, sau khi tham gia tối thiểu 4/5 buổi học, hoàn thành bài tập thực hành và bảo vệ thành công dự án cuối khóa tại sự kiện Demo Day, anh/chị sẽ được cấp chứng nhận danh giá **"Google AI Ecosystem Bootcamp — Completion Certificate"**. Đây là minh chứng mạnh mẽ cho năng lực chuyển đổi số của anh/chị. Để chuyên viên tư vấn rõ hơn về giá trị của chứng chỉ này trên con đường thăng tiến, anh/chị vui lòng cho em xin **số điện thoại** nhé!`
  },
  {
    question: "Học phí của khóa học là bao nhiêu? Tiền cọc hoàn trả thế nào?",
    keywords: ["học phí", "giá", "bao nhiêu tiền", "đặt cọc", "hoàn tiền", "miễn phí", "cam kết"],
    answer: `Dạ, đây là một chương trình mang tính cộng đồng và tri ân đặc biệt từ CES Global. Khóa học có một điểm khác biệt vô cùng lớn: **HỌC PHÍ 0 ĐỒNG**. 

Tuy nhiên, để đảm bảo chất lượng lớp học cao nhất, sự nghiêm túc và tạo động lực thực hành thực chiến, Ban tổ chức áp dụng mô hình "Học miễn phí – Đặt cọc cam kết". Anh/chị chỉ cần đóng một khoản **phí cam kết là 1.499.000 VNĐ**. Xin anh/chị lưu ý, đây hoàn toàn không phải là học phí, mà là sự cam kết hai chiều: Ban tổ chức cam kết trao giá trị giảng dạy tốt nhất, và học viên cam kết nỗ lực hết mình. 

Anh/chị sẽ được **hoàn trả 100% (1.499.000 VNĐ)** ngay sau khóa học nếu đáp ứng đủ các điều kiện rất thực tế nhằm đảm bảo quyền lợi đầu ra cho anh/chị: Tham gia tối thiểu 80% thời lượng, hoàn thành bài tập sản phẩm (App/Workflow) và tham gia bảo vệ dự án.

Mô hình tạo kỷ luật này đang thu hút rất nhiều anh chị quản lý đăng ký. Để em hỗ trợ giữ một slot (chỗ) trong đợt tuyển sinh này cho mình và gửi hợp đồng minh bạch, anh/chị cho em xin **số điện thoại** để chuyên viên hướng dẫn thủ tục nhé!`
  },
  {
    question: "Tôi tự học ChatGPT ở nhà được không, khóa học này khác gì?",
    keywords: ["tự học", "chatgpt", "khác gì", "tại sao phải học", "trên mạng", "tự mò", "tự tìm hiểu"],
    answer: `Dạ, đó là một góc nhìn rất phổ biến ạ! Việc dùng các bản ChatGPT miễn phí ở nhà để hỏi đáp linh tinh (viết email, dịch thuật) giống như anh/chị đang có một cậu thực tập sinh giỏi văn. Nhưng khóa Bootcamp này đào tạo anh/chị tư duy tạo ra một **Hệ thống vận hành doanh nghiệp**. Sự khác biệt cốt lõi nằm ở 3 điểm sống còn:

1. **Sự kết nối Hệ thống (System Integration)**: Tự mò, anh/chị chỉ làm được các tác vụ rời rạc tốn thời gian. Khóa học dạy cách kết nối AI vào File Excel/Sheets, luân chuyển qua Email, tự động duyệt dữ liệu và tạo thành App nội bộ hoạt động 24/7 (với n8n, Opal, AppSheet). 
2. **Độ chính xác tuyệt đối (No Hallucination)**: Dùng AI trên mạng, nó hay bịa thông tin và rò rỉ dữ liệu mật. Khóa học dạy kỹ thuật RAG và NotebookLM để AI học theo đúng quy trình tài chính/vận hành của công ty anh/chị, chính xác 100% trong môi trường bảo mật.
3. **Tính quản trị AI & ROI**: Anh/chị học cách thiết kế kiến trúc hệ thống 5 lớp, kiểm soát dữ liệu, tính toán Lợi nhuận đầu tư (ROI) bằng công nghệ - những thứ kiến thức quản lý cấp cao không bao giờ có sẵn trên mạng.

Nói ngắn gọn, tự mò là học chiêu thức rời rạc, tham gia Bootcamp là học Tư duy Kiến trúc sư AI để làm chủ cuộc chơi. Để chuyên viên bên em tư vấn bài toán tự động hóa phù hợp nhất với định hướng công ty của anh/chị, anh/chị vui lòng để lại **số điện thoại** nhé!`
  },
  {
    question: "Giảng viên của khóa học là ai? Ai sẽ là người dạy?",
    keywords: ["giảng viên", "người dạy", "thầy", "cô", "trainer", "chuyên gia", "tiệp", "tuấn anh", "kim anh"],
    answer: `Dạ, khóa học được những chuyên gia thực chiến hàng đầu trong lĩnh vực AI và Chuyển đổi số trực tiếp huấn luyện. Đội ngũ giảng viên bao gồm:

**1. Mr. Nguyễn Văn Tiệp (Co-founder CES Global | Chuyên gia Chiến lược Chuyển đổi số & GenAI)**
- *"Người kiến tạo tư duy chiến lược, đưa doanh nghiệp Việt tiếp cận chuẩn mực quản trị AI quốc tế."*
- **Tầm nhìn quốc tế:** Tu nghiệp Lãnh đạo toàn cầu & Tái cấu trúc doanh nghiệp trong kỷ nguyên AI tại Đại học Harvard.
- **Chuyên môn:** Thạc sĩ Khoa học máy tính (ĐH Colorado) và Chuyên gia đánh giá hệ thống quản lý AI theo tiêu chuẩn ISO/IEC 42001:2023.
- **Kinh nghiệm:** Tư vấn/đào tạo cho các "ông lớn" như Viettel, VNPT, Bảo Việt và Văn phòng Quốc hội, Sở TT&TT TP.HCM.

**2. Mr. Lưu Tuấn Anh (Team Leader AI Automation | Chuyên gia Ứng dụng AI Sáng tạo & Tự động hóa)**
- *"Biến ý tưởng thành sản phẩm thực tế thông qua sức mạnh của AI Agents và Automation."*
- **Thực chiến Kỹ thuật:** 5+ năm nghiên cứu chuyên sâu về Generative AI & AI Art, trực tiếp xây dựng các hệ thống AI tự động hóa quy trình (Automation).
- **Tư duy sản phẩm:** Đồng sáng lập Loverse & Cố vấn chuyên môn (Heatmob, Modeli), tối ưu hóa luồng làm việc sáng tạo và Marketing.
- **Vai trò:** Trực tiếp hướng dẫn học viên xây dựng Workflow, AI Agents và làm chủ các công cụ (Imagen, Veo) của Google.

**3. Ms. Nguyễn Kim Anh (Chuyên gia Đào tạo & Thiết kế trải nghiệm học tập AI)**
- *"Cầu nối sư phạm giúp đơn giản hóa công nghệ phức tạp, biến AI thành công cụ dễ dùng cho mọi nhân sự."*
- **Bề dày đào tạo:** Giảng dạy và ứng dụng AI cho hơn 5.000 học viên và giáo viên trên toàn quốc.
- **Sư phạm:** Sở hữu chứng chỉ AI for Education (Advanced), giúp học viên "Non-tech" tiếp cận AI vô cùng mượt mà.
- **Ứng dụng:** Trực tiếp tối ưu hóa quy trình nghiên cứu và sản xuất nội dung cho Báo chí, Truyền thông & Giáo dục.

Đội ngũ giảng viên sẽ đồng hành sát sao cùng anh/chị suốt cả chặng đường. Anh/chị ấn tượng với mảng nào nhất trong 3 thế mạnh trên ạ?`
  }
];