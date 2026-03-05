import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

/**
 * Collapsible info/help card for admin pages.
 * Props: { title, children, defaultOpen=false }
 */
export default function InfoCard({ title = 'Hướng dẫn', children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="bg-blue-50 border border-blue-100 rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-100/50 transition-colors"
            >
                <div className="flex items-center gap-2 text-blue-700">
                    <Info size={15} className="shrink-0" />
                    <span className="text-sm font-medium">{title}</span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-blue-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="px-4 pb-4 text-sm text-blue-700 space-y-1.5 leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );
}
