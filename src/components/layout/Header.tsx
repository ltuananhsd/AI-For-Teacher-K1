import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary">
              <span className="material-symbols-outlined text-white">smart_toy</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white uppercase">
              Google AI 2026
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#chuong-trinh">
              Chương Trình
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#van-de">
              Vấn Đề
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#loi-ich">
              Lợi Ích
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Đăng Nhập
            </Link>
            <Link
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              href="/register"
            >
              Đăng Ký Ngay
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
