import React, { useEffect, useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  KeyRound,
  Fingerprint,
  ScanSearch,
  Network,
  FileLock2,
  ShieldCheck,
  GraduationCap,
  Bomb,
  BookOpen,
  Settings as SettingsIcon,
  Info,
  Bell,
  ArrowRight,
  Link as LinkIcon,
  MailX,
  FileDigit,
  X,
} from 'lucide-react';

// 👉 ALL WORKING PAGE IMPORTS
import PasswordLab from './pages/PasswordLab';
import CryptoLab from './pages/CryptoLab';
import ThreatScanner from './pages/ThreatScanner';
import NetworkLab from './pages/NetworkLab';
import FileSecurity from './pages/FileSecurity';
import SecurityCheckup from './pages/SecurityCheckup';
import CyberAcademy from './pages/CyberAcademy';
import CyberGlossary from './pages/CyberGlossary';
import IncidentSimulator from './pages/IncidentSimulator';
import Settings from './pages/Settings';
import About from './pages/About';

// 👉 IMPORT REUSABLE COMPONENTS
import Header from './components/Header';
import Footer from './components/Footer';

/* =========================================================
   MASCOT
========================================================= */
const MascotImage = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-[#14141A] border border-[#292934] rounded-xl overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center opacity-40">
          <Shield size={32} className="text-[#9693A1] mb-2" />
          <span className="text-xs text-[#9693A1] font-medium">Mascot Asset</span>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} className={`object-contain ${className}`} onError={() => setHasError(true)} />;
};

/* =========================================================
   CARD & PROGRESS COMPONENTS
========================================================= */
const Card = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 text-[#F2F0F5] ${onClick ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors' : ''} ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ progress, colorClass = 'bg-[#9B8AFB]' }) => (
  <div className="w-full bg-[#0B0B0F] rounded-full h-2 mt-2 overflow-hidden border border-[#292934]">
    <div className={`${colorClass} h-2 rounded-full transition-all duration-500 ease-out`} style={{ width: `${progress}%` }} />
  </div>
);

const CircularProgress = ({ value, displayValue, label, size = 120, strokeWidth = 8, color = '#9B8AFB' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#292934" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-mono font-bold text-[#F2F0F5]">{displayValue !== undefined ? displayValue : value}</span>
        {label && <span className="text-xs text-[#9693A1] mt-1">{label}</span>}
      </div>
    </div>
  );
};

/* =========================================================
   NAVIGATION DATA
========================================================= */
const NAVIGATION = [
  { section: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { section: 'SECURITY TOOLS', items: [
      { id: 'password-lab', label: 'Password Lab', icon: KeyRound },
      { id: 'crypto-lab', label: 'Crypto Lab', icon: Fingerprint },
      { id: 'threat-scanner', label: 'Threat Scanner', icon: ScanSearch },
      { id: 'network-lab', label: 'Network Lab', icon: Network },
      { id: 'file-security', label: 'File Security', icon: FileLock2 },
    ]
  },
  { section: 'SECURITY', items: [{ id: 'security-checkup', label: 'Security Checkup', icon: ShieldCheck }] },
  { section: 'LEARN', items: [
      { id: 'cyber-academy', label: 'Cyber Academy', icon: GraduationCap },
      { id: 'incident-simulator', label: 'Incident Simulator', icon: Bomb },
      { id: 'cyber-glossary', label: 'Cyber Glossary', icon: BookOpen },
    ]
  },
  { section: 'BOTTOM', items: [
      { id: 'settings', label: 'Settings', icon: SettingsIcon },
      { id: 'about', label: 'About', icon: Info },
    ]
  },
];

/* =========================================================
   SIDEBAR COMPONENT
========================================================= */
const SidebarContent = ({ activePath, setActivePath, closeMobile }) => (
  <div className="flex flex-col h-full bg-[#0B0B0F] border-r border-[#292934] text-[#9693A1] overflow-y-auto font-sans">
    <div className="p-6 flex items-center gap-3 text-[#F2F0F5]">
      <Shield size={28} className="text-[#9B8AFB]" />
      <span className="text-xl font-bold tracking-wide">CyberGuard</span>
    </div>

    <div className="flex-1 px-4 space-y-6 pb-6">
      {NAVIGATION.filter((group) => group.section !== 'BOTTOM').map((group) => (
        <div key={group.section}>
          <h3 className="text-xs font-semibold text-[#9693A1]/60 tracking-wider mb-2 px-3">{group.section}</h3>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = activePath === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActivePath(item.id); closeMobile?.(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]' : 'hover:bg-[#1A1A22] hover:text-[#F2F0F5]'}`}
                >
                  <Icon size={18} className={isActive ? 'text-[#9B8AFB]' : 'text-[#9693A1]'} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <div className="p-4 border-t border-[#292934] space-y-1">
      {NAVIGATION.find((group) => group.section === 'BOTTOM').items.map((item) => {
        const Icon = item.icon;
        const isActive = activePath === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { setActivePath(item.id); closeMobile?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]' : 'hover:bg-[#1A1A22] hover:text-[#F2F0F5]'}`}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* =========================================================
   VEXEL INTRODUCTION
========================================================= */
const VexelIntro = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full bg-[#080C12] flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-[#9B8AFB]/10 rounded-full blur-3xl -top-32 -right-32" />
      <div className="absolute w-80 h-80 bg-[#55D6FF]/5 rounded-full blur-3xl -bottom-32 -left-32" />
      <div className="relative w-full max-w-4xl">
        <div className="bg-[#0F1118] border border-[#292934] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex items-center justify-center bg-[#0B0B0F] min-h-[420px] p-10 relative">
              <div className="absolute top-8 left-8 flex items-center gap-2 text-[#9693A1] text-xs font-medium tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#55D68A]" /> CyberGuard Online
              </div>
              <MascotImage src="/assets/mascots/cyberguard-mascot-main.png" alt="Vexel" className="w-64 h-64 md:w-80 md:h-80" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-[#9B8AFB] text-sm font-medium mb-5">
                <Shield size={17} /> Meet your cybersecurity companion
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#F2F0F5] tracking-tight mb-4">Hey! I'm Vexel. 👋</h1>
              <p className="text-lg text-[#C4C0CC] leading-relaxed mb-8">
                I'm your guide inside <span className="text-[#9B8AFB] font-semibold">CyberGuard</span> — your platform to learn, check, and improve your digital security.
              </p>
              <button onClick={onEnter} className="w-full flex items-center justify-center gap-3 bg-[#9B8AFB] hover:bg-[#AA9BFF] text-[#0B0B0F] py-3.5 px-5 rounded-xl font-semibold transition-all">
                Enter CyberGuard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DASHBOARD
========================================================= */
const Dashboard = ({ setActivePath, securityScore, showVexel }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2">Dashboard</h1>
          <p className="text-[#9693A1] text-base">Your cybersecurity command center</p>
        </div>
        <div className="flex items-center gap-6">
          {showVexel && <MascotImage src="/assets/mascots/cyberguard-mascot-main.png" alt="Vexel" className="w-24 h-24 md:w-32 md:h-32" />}
          <button className="hidden md:flex p-2.5 rounded-full bg-[#1A1A22] border border-[#292934] hover:bg-[#292934] text-[#9693A1] hover:text-[#F2F0F5] transition-colors relative self-start">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#9B8AFB] rounded-full" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center text-center">
          <h2 className="text-lg font-semibold mb-6 w-full text-left text-[#F2F0F5]">Security Score</h2>
          <CircularProgress value={securityScore !== null ? securityScore : 0} displayValue={securityScore !== null ? securityScore : '--'} label="/ 100" />
          <p className="text-sm text-[#9693A1] mt-6 mb-6">
            {securityScore !== null ? "Based on your latest security checkup" : "Complete your security checkup to get your score."}
          </p>
          <button onClick={() => setActivePath('security-checkup')} className="w-full flex items-center justify-center gap-2 bg-[#9B8AFB]/10 text-[#9B8AFB] border border-[#9B8AFB]/20 hover:bg-[#9B8AFB]/20 py-2.5 rounded-lg text-sm font-medium transition-colors">
            {securityScore !== null ? 'View Checkup' : 'Take Checkup'} <ArrowRight size={16} />
          </button>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Password Checker', desc: 'Check basic password characteristics.', icon: KeyRound, path: 'password-lab' },
            { title: 'URL Checker', desc: 'Analyze basic URL warning indicators.', icon: LinkIcon, path: 'threat-scanner' },
            { title: 'Phishing Detector', desc: 'Analyze suspicious messages.', icon: MailX, path: 'threat-scanner' },
            { title: 'File Hash', desc: 'Generate a SHA-256 hash.', icon: FileDigit, path: 'file-security' }
          ].map((tool, idx) => (
            <Card key={idx} onClick={() => setActivePath(tool.path)} className="group flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]"><tool.icon size={20} /></div>
                <ArrowRight size={16} className="text-[#9693A1] group-hover:text-[#9B8AFB]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#F2F0F5] mb-1">{tool.title}</h3>
                <p className="text-xs text-[#9693A1]">{tool.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

/* =========================================================
   MAIN APP
========================================================= */
export default function App() {
  const [activePath, setActivePath] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // GLOBAL STATE
  const [securityScore, setSecurityScore] = useState(null);
  const [academyProgress, setAcademyProgress] = useState({});
  const [incidentProgress, setIncidentProgress] = useState([]); 
  
  // SETTINGS STATE
  const [theme, setTheme] = useState('dark');
  const [showVexel, setShowVexel] = useState(true);
  const [securityReminders, setSecurityReminders] = useState(true);
  const [vexelTips, setVexelTips] = useState(true);
  const [instantQuizFeedback, setInstantQuizFeedback] = useState(true);
  const [learningDifficulty, setLearningDifficulty] = useState('Beginner');

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('cyberguard_intro_seen');
    if (hasSeenIntro === 'true') setShowIntro(false);
  }, []);

  const enterCyberGuard = () => {
    localStorage.setItem('cyberguard_intro_seen', 'true');
    setShowIntro(false);
  };

  const resetAcademyProgress = () => setAcademyProgress({});
  const resetSimulatorProgress = () => setIncidentProgress([]);
  const resetAllData = () => {
    setSecurityScore(null);
    setAcademyProgress({});
    setIncidentProgress([]);
    setTheme('dark');
    setShowVexel(true);
    setSecurityReminders(true);
    setVexelTips(true);
    setInstantQuizFeedback(true);
    setLearningDifficulty('Beginner');
  };

  if (showIntro) {
    return <VexelIntro onEnter={enterCyberGuard} />;
  }

  const renderActiveView = () => {
    switch (activePath) {
      case 'dashboard': return <Dashboard setActivePath={setActivePath} securityScore={securityScore} showVexel={showVexel} />;
      case 'password-lab': return <PasswordLab />;
      case 'crypto-lab': return <CryptoLab />;
      case 'threat-scanner': return <ThreatScanner />;
      case 'network-lab': return <NetworkLab />;
      case 'file-security': return <FileSecurity />; 
      case 'security-checkup': return <SecurityCheckup setActivePath={setActivePath} setSecurityScore={setSecurityScore} />;
      case 'cyber-academy': return <CyberAcademy academyProgress={academyProgress} setAcademyProgress={setAcademyProgress} showVexel={showVexel} />; 
      case 'cyber-glossary': return <CyberGlossary />; 
      case 'incident-simulator': return <IncidentSimulator incidentProgress={incidentProgress} setIncidentProgress={setIncidentProgress} setActivePath={setActivePath} />;
      case 'settings':
        return (
          <Settings 
            theme={theme} setTheme={setTheme}
            showVexel={showVexel} setShowVexel={setShowVexel}
            securityReminders={securityReminders} setSecurityReminders={setSecurityReminders}
            vexelTips={vexelTips} setVexelTips={setVexelTips}
            instantQuizFeedback={instantQuizFeedback} setInstantQuizFeedback={setInstantQuizFeedback}
            learningDifficulty={learningDifficulty} setLearningDifficulty={setLearningDifficulty}
            securityScore={securityScore}
            resetAcademyProgress={resetAcademyProgress}
            resetSimulatorProgress={resetSimulatorProgress}
            resetAllData={resetAllData}
            setActivePath={setActivePath}
          />
        );
      case 'about': return <About showVexel={showVexel} />;
      default: return <Dashboard setActivePath={setActivePath} securityScore={securityScore} showVexel={showVexel} />;
    }
  };

  return (
    <div className={`min-h-screen text-[#F2F0F5] flex selection:bg-[#9B8AFB]/30 ${theme === 'light' ? 'theme-light' : 'bg-[#080C12]'} ${!showVexel ? 'hide-vexel' : ''}`}>
      <style>{`
        .theme-light { background-color: #F3F4F6 !important; color: #111827 !important; }
        .theme-light .bg-\\[\\#14141A\\] { background-color: #FFFFFF !important; }
        .theme-light .bg-\\[\\#0B0B0F\\] { background-color: #F9FAFB !important; }
        .theme-light .bg-\\[\\#080C12\\] { background-color: #F3F4F6 !important; }
        .theme-light .bg-\\[\\#1A1A22\\] { background-color: #F3F4F6 !important; }
        .theme-light .border-\\[\\#292934\\] { border-color: #E5E7EB !important; }
        .theme-light .border-\\[\\#202631\\] { border-color: #E5E7EB !important; }
        .theme-light .text-\\[\\#F2F0F5\\] { color: #111827 !important; }
        .theme-light .text-\\[\\#9693A1\\] { color: #6B7280 !important; }
        .theme-light .text-\\[\\#C4C0CC\\] { color: #4B5563 !important; }
        .hide-vexel img[src*="mascot"] { display: none !important; }
      `}</style>

      {/* Existing Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 bg-[#0B0B0F]">
        <SidebarContent activePath={activePath} setActivePath={setActivePath} />
      </aside>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-72 h-full bg-[#0B0B0F]">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[#14141A] text-[#9693A1]">
              <X size={20} />
            </button>
            <SidebarContent activePath={activePath} setActivePath={setActivePath} closeMobile={() => setIsMobileMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content wrapper */}
      <main className="flex-1 lg:ml-64 min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* GLOBAL HEADER */}
        <Header activePath={activePath} setActivePath={setActivePath} showVexel={showVexel} />

        {/* Scrollable Page Body + Footer */}
        <div className="flex-1 overflow-y-auto flex flex-col relative">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </div>
          
          {/* GLOBAL FOOTER */}
          <Footer setActivePath={setActivePath} />
        </div>
        
      </main>
    </div>
  );
}