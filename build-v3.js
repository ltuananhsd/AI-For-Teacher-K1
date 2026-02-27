const fs = require('fs');

const mdPath = 'src/app/home-v2/mã mới.md';
const pageV1Path = 'src/app/page.tsx';
const outPath = 'src/app/home-v2/page.tsx';

let text = fs.readFileSync(mdPath, 'utf8');

// 1. Remove weird backticks wrapping HTML tags: `<div ... >` -> <div ... >
text = text.replace(/`</g, '<').replace(/>`/g, '>');

// 2. Remove other isolated backticks that are just typos wrapping text or tags, 
// using a clever regex to preserve those used for string templates containing ${
text = text.replace(/`([^`$]+)`/g, (match, p1) => {
    // If it contains interpolation, keep the backticks
    if (p1.includes('${')) return match;
    // Otherwise it was just a strange code styling, so remove them
    return p1;
});

// 3. Fix missing spaces
text = text.replace(/exportdefaultfunctionApp/, 'export default function App');
text = text.replace(/importReact/g, 'import React');
text = text.replace(/\}from'lucide-react'/g, "} from 'lucide-react'");
text = text.replace(/\}from'framer-motion'/g, "} from 'framer-motion'");
text = text.replace(/Phiên bản 2026Mới Nhất/, 'Phiên bản 2026 Mới Nhất');
text = text.replace(/LÀMCHỦ/, 'LÀM CHỦ');
text = text.replace(/GOOGLEAI/, 'GOOGLE AI');
text = text.replace(/CESGlobal/, 'CES Global');

// Fix classNames that lost quotes or were badly formatted
text = text.replace(/className=\{fixed/g, 'className={`fixed');

// 4. Map Colors for Dark Theme
text = text
  .replace(/bg-slate-50/g, 'bg-[#020617]')
  .replace(/bg-white\/90/g, 'bg-[#020617]/90')
  // We don't want to replace all 'bg-white' indiscriminately because some are valid overlays
  .replace(/bg-white/g, 'bg-slate-900/40 backdrop-blur-md')
  .replace(/text-slate-800/g, 'text-slate-200')
  .replace(/text-gray-900/g, 'text-white')
  .replace(/text-gray-800/g, 'text-slate-200')
  .replace(/text-gray-700/g, 'text-slate-300')
  .replace(/text-gray-600/g, 'text-slate-400')
  .replace(/text-gray-500/g, 'text-slate-500')
  .replace(/bg-blue-50/g, 'bg-blue-900/20')
  .replace(/bg-blue-100/g, 'bg-blue-900/40')
  .replace(/bg-slate-100/g, 'bg-white/5')
  .replace(/border-gray-50/g, 'border-white/5')
  .replace(/border-gray-100/g, 'border-white/10')
  .replace(/border-gray-200/g, 'border-white/20')
  .replace(/border-blue-100/g, 'border-blue-500/20')
  .replace(/shadow-sm/g, 'shadow-lg shadow-black/30')
  .replace(/bg-blue-950/g, 'bg-transparent') // Used in old hero
  .replace(/bg-blue-900\/200/g, 'bg-blue-900/20'); // Fixing accidental replace

// 5. Replace Hero Section
let heroMatch = text.match(/<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden[^>]*>/);
if(heroMatch) {
  text = text.replace(heroMatch[0], `<section className="relative w-full min-h-[100vh] flex flex-col">\n<TubesBackground className="absolute inset-0 z-0" enableClickInteraction={true}>\n<div className="container mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center justify-center h-full">`);
  // End of section mapping
  // We need to carefully add </TubesBackground> before the closing </section> of the hero
  text = text.replace(/(<\/div>\s*<\/section>)/, '</div>\n</TubesBackground>\n</section>');
}

// 6. Header/Navbar Setup
text = text.replace(/<nav[\s\S]*?<\/nav>/, '<Header />');
text = text.replace(/const\s*\[isScrolled,\s*setIsScrolled\]\s*=\s*useState\(false\);/, '');
text = text.replace(/useEffect\(\(\)\s*=>\s*\{\s*const handleScroll[\s\S]*?\},\[\]\);/, '');

// Extract TubesBackground and other utils from page.tsx (V1)
let oldPage = fs.readFileSync(pageV1Path, 'utf8');
const tubesRegex = /\/\/\s*={10,}\s*\/\/\s*INTERACTIVE 3D TUBES BACKGROUND COMPONENT[\s\S]*?(?=\/\/\s*={10,}\s*\/\/\s*NAVIGATION COMPONENT)/;
let tubesBgCode = oldPage.match(tubesRegex)[0];

const finalFile = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Clock, Target, PieChart, Quote, Check, Crown, Users,
  Megaphone, Settings, Laptop, Trophy, Keyboard, Briefcase,
  Layers, Zap, Flag, Mail, Phone, ArrowRight, ArrowDown, ChevronDown, MousePointer2
} from 'lucide-react';
import Header from "@/components/layout/Header";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

${tubesBgCode}

${text.split('// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---')[1]}
`;

fs.writeFileSync(outPath, finalFile);
console.log('Build V3 Successful');
