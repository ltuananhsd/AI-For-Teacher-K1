import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0A101E]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-32 h-10">
              <Image src="/images/logo-ces.png" alt="Google AI 2026 Logo" fill className="object-contain" />
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/chuong-trinh">
              Chương Trình
            </Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/#van-de">
              Vấn Đề
            </Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/#loi-ich">
              Lợi Ích
            </Link>
            <Link
              className="inline-flex items-center justify-center px-5 py-2 rounded-full glass-card hover:bg-white/10 border border-white/20 text-white text-sm font-bold transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] relative overflow-hidden group"
              href="/register"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 drop-shadow-sm">Đăng Ký Ngay</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
