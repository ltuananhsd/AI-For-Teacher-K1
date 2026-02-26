import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded bg-primary">
            <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase">
            Google AI Ecosystem 2026
          </span>
        </div>
        <p className="text-xs text-slate-500">
          © 2026 Google AI Bootcamp. All rights reserved. This is a training program landing page mockup.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-slate-500 hover:text-primary">
            <span className="material-symbols-outlined">social_leaderboard</span>
          </Link>
          <Link href="#" className="text-slate-500 hover:text-primary">
            <span className="material-symbols-outlined">share</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
