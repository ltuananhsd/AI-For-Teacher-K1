const fs = require('fs');

const mdPath = 'src/app/home-v2/mã mới.md';
const pageV1Path = 'src/app/page.tsx';
const outPath = 'src/app/home-v2/page.tsx';

let mdContent = fs.readFileSync(mdPath, 'utf8');

// The markdown file wraps tags with backticks: `<div...>` and also texts maybe?
// Actually we can simply use regex to fix JSX template literals.
// Let's strip ALL backticks FIRST, then add them back where needed!
let text = mdContent.replace(/`/g, '');

// Fix template strings in className
text = text.replace(/className=\{([^}]+)\}/g, (match, p1) => {
  // if p1 contains ${ it needs backticks instead of being a bare expression
  if (p1.includes('${')) {
    // but wait, sometimes it's like `className={isActive ? "x" : "y"}` which is valid JS
    // if it looks like: fixed w-full z-50 transition-all duration-300 ${isScrolled ? ...
    if (!p1.trim().startsWith('"') && !p1.trim().startsWith("'") && !p1.trim().startsWith('`') && p1.includes('${')) {
      return `className={\`${p1}\`}`;
    }
  }
  return match;
});

// There is one place: <p className={${colors.text} font-medium ...}>
text = text.replace(/className=\{([^}]+)\}/g, (match, p1) => {
   if (p1.startsWith('${') && !p1.startsWith('`${')) {
       return `className={\`${p1}\`}`;
   }
   return match;
});

// Let's map light theme to dark theme
text = text
  .replace(/bg-slate-50/g, 'bg-[#020617]')
  .replace(/bg-white\/90/g, 'bg-[#020617]/90')
  .replace(/bg-white/g, 'bg-slate-900/40 backdrop-blur-md')
  .replace(/text-slate-800/g, 'text-slate-200')
  .replace(/text-gray-900/g, 'text-white')
  .replace(/text-gray-800/g, 'text-slate-200')
  .replace(/text-gray-700/g, 'text-slate-300')
  .replace(/text-gray-600/g, 'text-slate-400')
  .replace(/text-gray-500/g, 'text-slate-500')
  .replace(/bg-blue-[5]0/g, 'bg-blue-900/20')
  .replace(/bg-blue-[1]00/g, 'bg-blue-900/40')
  .replace(/bg-slate-[1]00/g, 'bg-white/5')
  .replace(/border-gray-50/g, 'border-white/5')
  .replace(/border-gray-100/g, 'border-white/10')
  .replace(/border-gray-200/g, 'border-white/20')
  .replace(/shadow-sm/g, 'shadow-lg shadow-black/30')
  .replace(/bg-blue-950/g, '')

// Replace Navbar with the actual Header component
// First remove the old Navbar component in the file
text = text.replace(/export\s+default\s+function\s+App/, 'export default function App');

// We need TubesBackground from V1
let oldPage = fs.readFileSync(pageV1Path, 'utf8');
const tubesRegex = /\/\/\s*={10,}\s*\/\/\s*INTERACTIVE 3D TUBES BACKGROUND COMPONENT[\s\S]*?(?=\/\/\s*={10,}\s*\/\/\s*NAVIGATION COMPONENT)/;
let tubesBgCode = oldPage.match(tubesRegex)[0];

const utilsRegex = /function cn[\s\S]*?(?=\/\/ ={10,})/
let utilsCode = oldPage.match(utilsRegex);

// Hero replacement
let heroMatch = text.match(/<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden[^>]*>/);
if(heroMatch) {
  text = text.replace(heroMatch[0], `<section className="relative w-full min-h-[100vh] flex flex-col">\n<TubesBackground className="absolute inset-0 z-0" enableClickInteraction={true}>\n<div className="container mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center justify-center h-full">`);
  text = text.replace(/(<\/section>)/, '</div></TubesBackground>\n$1');
}

// Now replace Navbar
text = text.replace(/<nav[\s\S]*?<\/nav>/, '<Header />');

// Remove original navbar component state hooks since we import it
text = text.replace(/const\s*\[isScrolled,\s*setIsScrolled\]\s*=\s*useState\(false\);/, '');
text = text.replace(/useEffect\(\(\)\s*=>\s*\{\s*const handleScroll[\s\S]*?\},\[\]\);/, '');

// Add Header import
text = text.replace(/import\s*\{\s*motion/, `import Header from "@/components/layout/Header";\nimport { motion`);

let finalFile = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Clock, Target, PieChart, Quote, Check, Crown, Users,
  Megaphone, Settings, Laptop, Trophy, Keyboard, Briefcase,
  Layers, Zap, Flag, Mail, Phone, ArrowRight, ArrowDown, ChevronDown, MousePointer2
} from 'lucide-react';
import Header from "@/components/layout/Header";

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

${tubesBgCode}

${text.split('// --- COMPONENT CHÍNH ---')[1]}
`;

fs.writeFileSync(outPath, finalFile);
console.log('Fixed build-v2 successful');
