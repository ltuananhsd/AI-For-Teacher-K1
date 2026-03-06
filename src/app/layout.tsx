import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/layout/Chatbot";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Khai Mở Sức Mạnh AI | CES GLOBAL",
  description:
    "Khóa học thực chiến ứng dụng Hệ sinh thái Google AI dành riêng cho giáo viên kỷ nguyên số.",
  openGraph: {
    title: "Khai Mở Sức Mạnh AI | CES GLOBAL",
    description:
      "Khóa học thực chiến ứng dụng AI (Gemini, NotebookLM, AI Studio...) cho giáo viên kỷ nguyên số.",
    images: ["https://ai4edu.cesglobal.com.vn/images/logo-xanh.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} antialiased min-h-screen flex flex-col bg-[#0A101E] text-slate-100`}
      >
        <main className="flex-grow">{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}
