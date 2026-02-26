import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <span className="material-symbols-outlined text-primary text-xl drop-shadow-[0_0_8px_currentColor]">smart_toy</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase drop-shadow-md">
              Google AI 2026
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/#chuong-trinh">
              Chương Trình
            </Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/#van-de">
              Vấn Đề
            </Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/#loi-ich">
              Lợi Ích
            </Link>
            <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/login">
              Đăng Nhập
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
