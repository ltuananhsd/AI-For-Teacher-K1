const fs = require('fs');

const mdPath = 'src/app/home-v2/mã mới.md';
const pageV1Path = 'src/app/page.tsx';
const outPath = 'src/app/home-v2/page.tsx';

let mdContent = fs.readFileSync(mdPath, 'utf8');
let oldPage = fs.readFileSync(pageV1Path, 'utf8');

const tubesRegex = /\/\/\s*={10,}\s*\/\/\s*INTERACTIVE 3D TUBES BACKGROUND COMPONENT[\s\S]*?(?=\/\/\s*={10,}\s*\/\/\s*NAVIGATION COMPONENT)/;
let tubesBg = oldPage.match(tubesRegex)[0];

const navRegex = /\/\/\s*={10,}\s*\/\/\s*NAVIGATION COMPONENT[\s\S]*?(?=\/\/\s*={10,}\s*\/\/\s*MAIN LANDING PAGE)/;
let navBg = oldPage.match(navRegex)[0];

// Clean text
let cleanMd = mdContent.replace(/`/g, '');
cleanMd = cleanMd.replace(/export\s+default\s+function\s+App/g, 'export default function App');

// Dark theme mapping
let darkMd = cleanMd
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
  .replace(/border-blue-100/g, 'border-blue-500/20')
  .replace(/shadow-sm/g, 'shadow-lg shadow-black/30')
  .replace(/bg-blue-950/g, '') // Clear hardcoded hero bg

// Prepare Hero insertion with Tube background
let heroRegex = /(<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden)[^>]*>/;
darkMd = darkMd.replace(heroRegex, '<section className="relative w-full min-h-[100vh] flex flex-col">\n<TubesBackground className="absolute inset-0 z-0" enableClickInteraction={true}>\n<div className="container mx-auto px-6 md:px-12 py-32 flex flex-col items-center text-center justify-center h-full">');

// We need to close the TubesBackground
darkMd = darkMd.replace(/(<\/section>)/, '</div></TubesBackground>\n$1');

// Imports
let imports = `"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Clock, Target, PieChart, Quote, Check, Crown, Users,
  Megaphone, Settings, Laptop, Trophy, Keyboard, Briefcase,
  Layers, Zap, Flag, Mail, Phone, ArrowRight, ArrowDown, ChevronDown, MousePointer2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};
\n`;

let restOfCode = darkMd.split('// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---')[1];

let finalOutput = imports + '\n' + tubesBg + '\n' + navBg + '\n// --- BIẾN HIỆU ỨNG (FRAMER MOTION VARIANTS) ---\n' + restOfCode;

// Fix Navbar
finalOutput = finalOutput.replace(/<nav[\s\S]*?<\/nav>/, '<Navbar />');

fs.writeFileSync(outPath, finalOutput);
console.log('Build successful');
