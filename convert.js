const fs = require('fs');

try {
  let content = fs.readFileSync('nội dung khoá học/chương trình.md', 'utf8');

  // Strip backticks wrapping HTML/JSX tags
  content = content.replace(/`(<[^>]+>)`/g, '$1');
  
  // Strip isolated backticks that might have remained
  content = content.replace(/`/g, '');

  content = content.replace('exportdefaultfunctionAIProgramCurriculum(){', 'export default function AIProgramCurriculum() {');
  
  // Wrap return in <> <Header /> ... </>
  // Ensure we don't duplicate if already wrapped.
  content = content.replace('export default function AIProgramCurriculum() {', `
import Header from "@/components/layout/Header";

export default function AIProgramCurriculum() {`);

  content = content.replace('return(', 'return (');
  content = content.replace('return (', `return (
    <>
      <Header />
`);
  content = content.replace(');', '    </>\n  );');

  // Add explicit spaces back to imports
  content = content.replace('importReactfrom"react";', 'import React from "react";');
  content = content.replace('import{ motion }from"framer-motion";', 'import { motion } from "framer-motion";');
  content = content.replace('import{', 'import {');
  content = content.replace('}from"lucide-react";', '} from "lucide-react";');

  fs.mkdirSync('src/app/chuong-trinh', { recursive: true });
  fs.writeFileSync('src/app/chuong-trinh/page.tsx', content);
  console.log('Successfully wrote src/app/chuong-trinh/page.tsx');
} catch (e) {
  console.error(e);
}
