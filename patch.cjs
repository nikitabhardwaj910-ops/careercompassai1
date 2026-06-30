const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'routes', 'index.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Restore Landing component and add HeroBackground import
content = content.replace('component: PremiumHero,', 'component: Landing,');
if (!content.includes('import { HeroBackground }')) {
  content = content.replace('import { PremiumHero } from "@/components/PremiumHero";', 'import { HeroBackground } from "@/components/HeroBackground";');
}

// 2. Modify Landing wrapper
content = content.replace(
  '<div className="min-h-screen bg-background text-foreground cyber-grid overflow-x-hidden relative">',
  '<div className="min-h-screen bg-black text-white dark overflow-x-hidden relative">\n      <HeroBackground />'
);

// 3. Modify SiteHeader
content = content.replace(
  /className=\{`sticky top-0 z-50 border-b transition-all duration-500 \$\{\s*scrolled\s*\?\s*"[^"]*"\s*:\s*"[^"]*"\s*\}`\}/s,
  'className={`sticky top-0 z-50 transition-all duration-500 py-6 px-4 ${scrolled ? "backdrop-blur-md bg-black/50" : ""}`}'
);
content = content.replace(
  '<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">',
  '<div className="liquid-glass mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 rounded-full">'
);

// 4. Modify Hero texts
content = content.replace(
  'className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"',
  'className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "\'Instrument Serif\', serif" }}'
);
content = content.replace(
  'className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"',
  'className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "\'Instrument Serif\', serif" }}'
);
content = content.replace(
  'className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"',
  'className="text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "\'Instrument Serif\', serif" }}'
);

// 5. Modify Hero buttons
content = content.replace(
  'className="rounded-full gradient-bg text-white border-0 hover:opacity-95 shadow-glow h-12 px-7 text-base hover:scale-[1.03] transition-all animate-border-shimmer"',
  'className="liquid-glass rounded-full h-12 px-7 text-base hover:scale-[1.03] transition-all text-white border-0"'
);
content = content.replace(
  'className="rounded-full h-12 px-7 text-base bg-card/40 hover:bg-card/75 border-border/80 hover:scale-[1.03] transition-all"',
  'className="liquid-glass rounded-full h-12 px-7 text-base hover:scale-[1.03] transition-all text-white border-0"'
);

// 6. Modify HeroResumeSimulator container
content = content.replace(
  '<div className="relative overflow-hidden rounded-3xl glass border border-border/80 card-shadow p-6 bg-card/45 backdrop-blur-xl">',
  '<div className="relative overflow-hidden liquid-glass rounded-3xl p-6 text-white shadow-2xl">'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched index.tsx');
