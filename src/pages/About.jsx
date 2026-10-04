import React, { useState } from 'react';
import { 
  Shield, 
  Wrench, 
  GraduationCap, 
  BookOpen, 
  Bomb, 
  ShieldCheck, 
  Code2, 
  Info,
  Cpu
} from 'lucide-react';

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 md:p-6 text-[#F2F0F5] ${className}`}>
    {children}
  </div>
);

const MascotImage = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      onError={() => setHasError(true)}
    />
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function About({ showVexel }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9B8AFB]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex items-center justify-center w-16 h-16 bg-[#9B8AFB]/10 rounded-2xl border border-[#9B8AFB]/20 shrink-0">
          <Shield size={32} className="text-[#9B8AFB]" />
        </div>
        <div className="flex-1 z-10">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2">About CyberGuard</h1>
          <p className="text-[#9693A1] text-base max-w-xl">
            An interactive cybersecurity learning and awareness platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* MAIN CONTENT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* What is CyberGuard */}
          <Card>
            <h2 className="text-xl font-bold text-[#F2F0F5] mb-3">What is CyberGuard?</h2>
            <p className="text-[#C4C0CC] leading-relaxed">
              CyberGuard is designed to make cybersecurity easier to understand and practice. The platform combines practical security tools, interactive learning, security awareness, and simulated real-world scenarios to build safer digital habits.
            </p>
          </Card>

          {/* Feature Grid */}
          <Card>
            <h2 className="text-xl font-bold text-[#F2F0F5] mb-6">What You Can Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#1A1A22] rounded-lg text-[#9B8AFB] shrink-0 border border-[#292934]">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F0F5] mb-1">Security Tools</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">Password checking, threat analysis, file security and other practical utilities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#1A1A22] rounded-lg text-[#9B8AFB] shrink-0 border border-[#292934]">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F0F5] mb-1">Cyber Academy</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">Short cybersecurity lessons and quizzes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#1A1A22] rounded-lg text-[#9B8AFB] shrink-0 border border-[#292934]">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F0F5] mb-1">Cyber Glossary</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">Beginner-friendly explanations of cybersecurity terminology.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#1A1A22] rounded-lg text-[#9B8AFB] shrink-0 border border-[#292934]">
                  <Bomb size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F0F5] mb-1">Incident Simulator</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">Practice making security decisions through simulated incidents.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-2.5 bg-[#1A1A22] rounded-lg text-[#9B8AFB] shrink-0 border border-[#292934]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F2F0F5] mb-1">Security Checkup</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">Assess security habits and receive a security score.</p>
                </div>
              </div>

            </div>
          </Card>

          {/* Project Purpose */}
          <Card>
            <h2 className="text-xl font-bold text-[#F2F0F5] mb-3">Why CyberGuard?</h2>
            <p className="text-[#C4C0CC] leading-relaxed">
              Cybersecurity is not only about advanced tools. Everyday decisions such as recognizing phishing, protecting accounts, understanding suspicious files, and using strong authentication matter too.
            </p>
          </Card>
        </div>

        {/* SIDEBAR COLUMN */}
        <div className="space-y-6">
          
          {/* Vexel Section (Conditional) */}
          {showVexel && (
            <Card className="flex flex-col items-center text-center">
              <h2 className="text-lg font-bold text-[#F2F0F5] mb-4 w-full text-left flex items-center gap-2">
                <Info size={20} className="text-[#9B8AFB]" /> Meet Vexel
              </h2>
              
              <div className="bg-[#0B0B0F] border border-[#292934] p-4 rounded-xl relative w-full mb-6">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0B0B0F] border-b border-r border-[#292934] rotate-45" />
                <p className="text-sm text-[#C4C0CC] font-medium">
                  "Hey there! I'm Vexel. I'll be around whenever you need a little help."
                </p>
              </div>

              <MascotImage 
                src="/assets/mascots/cyberguard-mascot-main.png" 
                alt="Vexel Mascot" 
                className="w-32 h-32 mb-4" 
              />
              
              <p className="text-xs text-[#9693A1] leading-relaxed text-left">
                Vexel is CyberGuard's friendly cybersecurity companion, helping users navigate the platform, understand difficult concepts, and learn through interactive guidance.
              </p>
            </Card>
          )}

          {/* Technology */}
          <Card>
            <h2 className="text-lg font-bold text-[#F2F0F5] mb-4 flex items-center gap-2">
              <Code2 size={20} className="text-[#9B8AFB]" /> Built With
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#1A1A22] border border-[#292934] rounded-lg text-xs font-semibold text-[#C4C0CC] flex items-center gap-1.5">
                <Cpu size={14} className="text-[#61DAFB]" /> React
              </span>
              <span className="px-3 py-1.5 bg-[#1A1A22] border border-[#292934] rounded-lg text-xs font-semibold text-[#C4C0CC] flex items-center gap-1.5">
                <Cpu size={14} className="text-[#646CFF]" /> Vite
              </span>
              <span className="px-3 py-1.5 bg-[#1A1A22] border border-[#292934] rounded-lg text-xs font-semibold text-[#C4C0CC] flex items-center gap-1.5">
                <Cpu size={14} className="text-[#38B2AC]" /> Tailwind CSS
              </span>
              <span className="px-3 py-1.5 bg-[#1A1A22] border border-[#292934] rounded-lg text-xs font-semibold text-[#C4C0CC] flex items-center gap-1.5">
                <Cpu size={14} className="text-[#F2F0F5]" /> Lucide React
              </span>
            </div>
          </Card>

          {/* Version & Credits */}
          <Card>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-[#F2F0F5]">CyberGuard</h3>
                <p className="text-xs text-[#9693A1] mt-0.5">Version 1.0</p>
              </div>
              <span className="px-2 py-1 bg-[#9B8AFB]/10 text-[#9B8AFB] text-[10px] font-bold uppercase tracking-wider rounded border border-[#9B8AFB]/20">
                Learning Platform
              </span>
            </div>
            <div className="pt-4 border-t border-[#292934]">
              <p className="text-xs text-[#9693A1]">Created as an educational cybersecurity project.</p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}