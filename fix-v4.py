import re
import os

md_path = r'src\app\home-v2\mã mới.md'
page_v1_path = r'src\app\page.tsx'
out_path = r'src\app\home-v2\page.tsx'

with open(md_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean backticks wrapping tags
text = re.sub(r'`(<[^>]+>)`', r'\1', text)
# Any other string containing `<` and `>` wrapped in backticks
text = re.sub(r'`\s*(<[^>]+>\s*)`', r'\1', text)

# Remove any remaining backticks that don't look like template literals
def clean_backticks(m):
    content = m.group(1)
    if '${' in content:
        return m.group(0)
    return content
text = re.sub(r'`([^`]*)`', clean_backticks, text)

# 2. Fix syntax errors and missing spaces
text = text.replace('importReact', 'import React')
text = text.replace("}from'react';", "} from 'react';")
text = text.replace("}from'framer-motion';", "} from 'framer-motion';")
text = text.replace("}from'lucide-react';", "} from 'lucide-react';")

text = text.replace('exportdefaultfunctionApp', 'export default function App')
text = text.replace('export default functionApp', 'export default function App')
text = text.replace('exportdefault functionApp', 'export default function App')
text = text.replace('exportdefault function App', 'export default function App')

text = text.replace('Phiên bản 2026Mới Nhất', 'Phiên bản 2026 Mới Nhất')
text = text.replace('LÀMCHỦ', 'LÀM CHỦ')
text = text.replace('GOOGLEAI', 'GOOGLE AI')
text = text.replace('CESGlobal', 'CES Global')
text = text.replace('Đối Tượng ThamGia', 'Đối Tượng Tham Gia')

# Fix className template strings that lack backticks
text = re.sub(r'className=\{([^}]+)\}', lambda m: f'className={{`{m.group(1)}`}}' if '${' in m.group(1) and not m.group(1).startswith('`') else m.group(0), text)

# 3. Fix unclosed tags (specifically the span dot span issue)
# e.g. CESGlobal<span className="text-blue-500">.
text = re.sub(r'(CES Global.*?<span className="text-blue-500">.*?)\.(?!<)', r'\1.</span>', text)
text = re.sub(r'(<span[^>]*>[^<]*)\.(?!<)', r'\1.</span>', text)

# Also check for "30%<span..." where it is unclosed
text = re.sub(r'(30%<span[^>]*>Tư duy<br/>70%<span[^>]*>Thực chiến(?!<))', r'\1</span></span>', text)

# Fix <span className="text-blue-600 text-base font-normal">{item.sub}</h4> which is bad nesting
text = re.sub(r'(<span[^>]+>\{[^\}]+\})(</h4>)', r'\1</span>\2', text)

# 4. Color replacements
replacements = {
    'bg-slate-50': 'bg-[#020617]',
    'bg-white/90': 'bg-[#020617]/90',
    'bg-white': 'bg-slate-900/40 backdrop-blur-md',
    'text-slate-800': 'text-slate-200',
    'text-gray-900': 'text-white',
    'text-gray-800': 'text-slate-200',
    'text-gray-700': 'text-slate-300',
    'text-gray-600': 'text-slate-400',
    'text-gray-500': 'text-slate-500',
    'bg-blue-50': 'bg-blue-900/20',
    'bg-blue-100': 'bg-blue-900/40',
    'bg-slate-100': 'bg-white/5',
    'border-gray-50': 'border-white/5',
    'border-gray-100': 'border-white/10',
    'border-gray-200': 'border-white/20',
    'border-blue-100': 'border-blue-500/20',
    'shadow-sm': 'shadow-lg shadow-black/30',
    'bg-blue-950': 'bg-transparent',
    'bg-blue-900/200': 'bg-blue-900/20',
    'decoration-red-300': 'decoration-red-500/50 text-slate-500 line-through'
}

for k, v in replacements.items():
    text = text.replace(k, v)

# Fix hero block replacement
hero_match = re.search(r'<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden[^>]*>', text)
if hero_match:
    hero_str = hero_match.group(0)
    text = text.replace(hero_str, '<section className="relative w-full min-h-[100vh] flex flex-col">\n<TubesBackground className="absolute inset-0 z-0" enableClickInteraction={true}>\n<div className="container mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center justify-center h-full">')
    text = re.sub(r'(</div>\s*</section>)', r'</div>\n</TubesBackground>\n</section>', text, count=1)

# Use Header
text = re.sub(r'<nav[\s\S]*?</nav>', '<Header />', text)
text = re.sub(r'const\s*\[isScrolled,\s*setIsScrolled\]\s*=\s*useState\(false\);', '', text)
text = re.sub(r'useEffect\(\(\)\s*=>\s*\{\s*const handleScroll[\s\S]*?\},\[\]\);', '', text)

# Extract Tubes from V1
with open(page_v1_path, 'r', encoding='utf-8') as f:
    old_page = f.read()

import re
tubes_bg_match = re.search(r'// =+\s*// INTERACTIVE 3D TUBES BACKGROUND COMPONENT[\s\S]*?(?=(?:// =+\s*// NAVIGATION COMPONENT|// --- BIẾN HIỆU ỨNG))', old_page)
tubes_bg_code = tubes_bg_match.group(0) if tubes_bg_match else ""

# Extract everything after `// --- BIẾN HIỆU ỨNG`
parts = text.split('// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---')
if len(parts) > 1:
    body = parts[1]
else:
    body = text

final_file = f"""
"use client";
import React, {{ useState, useEffect, useRef }} from 'react';
import {{ motion, AnimatePresence }} from 'framer-motion';
import {{
  Rocket, Clock, Target, PieChart, Quote, Check, Crown, Users,
  Megaphone, Settings, Laptop, Trophy, Keyboard, Briefcase,
  Layers, Zap, Flag, Mail, Phone, ArrowRight, ArrowDown, ChevronDown, MousePointer2
}} from 'lucide-react';
import Header from "@/components/layout/Header";

function cn(...inputs: (string | undefined | null | false)[]) {{
  return inputs.filter(Boolean).join(" ");
}}

const randomColors = (count: number) => {{
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
}};

{tubes_bg_code}

// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---
{body}
"""

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(final_file)

print("Python Fix Script Complete")
