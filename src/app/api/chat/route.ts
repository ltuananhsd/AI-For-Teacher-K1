import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { courseFAQs } from '@/data/chatbot-faq';

// Khởi tạo interface của DeepSeek thông qua thư viện OpenAI
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Chuyển toàn bộ kịch bản FAQ thành một chuỗi văn bản cho AI hiểu
    const faqContext = courseFAQs.map(faq => `[Câu hỏi gốc hoặc chủ đề]: ${faq.question}\n[Câu trả lời mẫu]: ${faq.answer}`).join('\n\n');

    const systemPrompt = `Bạn là "CES Assistant", trợ lý ảo AI cao cấp của trung tâm CES Global chuyên hỗ trợ, chăm sóc khách hàng và tư vấn về chương trình "Google AI Bootcamp 2026". 

DƯỚI ĐÂY LÀ DỮ LIỆU FAQ ĐỘC QUYỀN (HÃY BÁM SÁT):
${faqContext}

QUY TẮC GIAO TIẾP DÀNH CHO BẠN:
1. Bạn đại diện cho CES Global, luôn trả lời lịch sự, thông minh, dùng tiếng Việt Nam chuẩn mực, có dạ thưa/chào hỏi đàng hoàng.
2. TUYỆT ĐỐI chỉ dùng thông tin từ DỮ LIỆU FAQ. Nếu học viên hỏi nằm ngoài FAQ, hãy khéo léo thông báo "Hiện tại mình là trợ lý AI tập sự nên chưa có thông tin chính xác về vấn đề này. Tuy nhiên, bạn có thể để lại thắc mắc để đội ngũ CES Global giải đáp trực tiếp nhé!".
3. Trả lời KHÔNG QUÁ DÀI DÒNG. Hỗ trợ đầy đủ các Markdown như in đậm (**chữ**) cho những từ khóa quan trọng và gạch đầu dòng mục lục.
4. Mọi câu trả lời của bạn sẽ được đem đi tư vấn và có thể mang ý định chốt sale, hãy khéo léo và thuyết phục.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    // Gửi yêu cầu lên mô hình deepseek-reasoner
    const completion = await openai.chat.completions.create({
      model: 'deepseek-reasoner',
      messages: formattedMessages,
    });

    // Lấy nội dung AI trả lời 
    // Ghi chú: deepseek-reasoner có thể có 'reasoning_content' nhưng ta chỉ trả về kết quả 'content' thẳng cho User.
    const botReply = completion.choices[0].message.content || 'Xin lỗi, hệ thống bị nghẽn và không thể trả lời.';

    return NextResponse.json({ content: botReply });

  } catch (error: any) {
    console.error('Lỗi khi gọi DeepSeek API:', error);
    return NextResponse.json(
      { error: '*(Hệ thống)* API DeepSeek không phản hồi. Lỗi kết nối hoặc API Key sai/hết hạn. Vui lòng kiểm tra lại log server.' },
      { status: 500 }
    );
  }
}
