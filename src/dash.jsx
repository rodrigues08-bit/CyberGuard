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
  Settings,
  Info,
  Bell,
  ArrowRight,
  Link as LinkIcon,
  MailX,
  FileDigit,
  AlertTriangle,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

/* =========================================================
   MASCOT
========================================================= */

const MascotImage = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-[#14141A] border border-[#292934] rounded-xl overflow-hidden ${className}`}
      >
        <div className="flex flex-col items-center justify-center opacity-40">
          <Shield size={32} className="text-[#9693A1] mb-2" />
          <span className="text-xs text-[#9693A1] font-medium">
            Mascot Asset
          </span>
        </div>
      </div>
    );
  }

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
   CARD
========================================================= */

const Card = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 text-[#F2F0F5] ${
      onClick
        ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors'
        : ''
    } ${className}`}
  >
    {children}
  </div>
);

/* =========================================================
   PROGRESS BAR
========================================================= */

const ProgressBar = ({
  progress,
  colorClass = 'bg-[#9B8AFB]',
}) => (
  <div className="w-full bg-[#0B0B0F] rounded-full h-2 mt-2 overflow-hidden border border-[#292934]">
    <div
      className={`${colorClass} h-2 rounded-full transition-all duration-500 ease-out`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

/* =========================================================
   CIRCULAR PROGRESS
========================================================= */

const CircularProgress = ({
  value,
  label,
  size = 120,
  strokeWidth = 8,
  color = '#9B8AFB',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset =
    circumference - (value / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#292934"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-mono font-bold text-[#F2F0F5]">
          {value}
        </span>

        {label && (
          <span className="text-xs text-[#9693A1] mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   NAVIGATION
========================================================= */

const NAVIGATION = [
  {
    section: 'MAIN',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  {
    section: 'SECURITY TOOLS',
    items: [
      {
        id: 'password-lab',
        label: 'Password Lab',
        icon: KeyRound,
      },
      {
        id: 'crypto-lab',
        label: 'Crypto Lab',
        icon: Fingerprint,
      },
      {
        id: 'threat-scanner',
        label: 'Threat Scanner',
        icon: ScanSearch,
      },
      {
        id: 'network-lab',
        label: 'Network Lab',
        icon: Network,
      },
      {
        id: 'file-security',
        label: 'File Security',
        icon: FileLock2,
      },
    ],
  },

  {
    section: 'SECURITY',
    items: [
      {
        id: 'security-checkup',
        label: 'Security Checkup',
        icon: ShieldCheck,
      },
    ],
  },

  {
    section: 'LEARN',
    items: [
      {
        id: 'cyber-academy',
        label: 'Cyber Academy',
        icon: GraduationCap,
      },
      {
        id: 'incident-simulator',
        label: 'Incident Simulator',
        icon: Bomb,
      },
      {
        id: 'cyber-glossary',
        label: 'Cyber Glossary',
        icon: BookOpen,
      },
    ],
  },

  {
    section: 'BOTTOM',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
      },
      {
        id: 'about',
        label: 'About',
        icon: Info,
      },
    ],
  },
];

/* =========================================================
   SIDEBAR
========================================================= */

const SidebarContent = ({
  activePath,
  setActivePath,
  closeMobile,
}) => (
  <div className="flex flex-col h-full bg-[#0B0B0F] border-r border-[#292934] text-[#9693A1] overflow-y-auto font-sans">

    {/* Logo */}
    <div className="p-6 flex items-center gap-3 text-[#F2F0F5]">
      <Shield
        size={28}
        className="text-[#9B8AFB]"
      />

      <span className="text-xl font-bold tracking-wide">
        CyberGuard
      </span>
    </div>

    {/* Main navigation */}
    <div className="flex-1 px-4 space-y-6 pb-6">

      {NAVIGATION
        .filter((group) => group.section !== 'BOTTOM')
        .map((group) => (
          <div key={group.section}>

            <h3 className="text-xs font-semibold text-[#9693A1]/60 tracking-wider mb-2 px-3">
              {group.section}
            </h3>

            <div className="space-y-1">

              {group.items.map((item) => {
                const isActive =
                  activePath === item.id;

                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePath(item.id);
                      closeMobile?.();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]'
                        : 'hover:bg-[#1A1A22] hover:text-[#F2F0F5]'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-[#9B8AFB]'
                          : 'text-[#9693A1]'
                      }
                    />

                    {item.label}
                  </button>
                );
              })}

            </div>
          </div>
        ))}

    </div>

    {/* Bottom navigation */}
    <div className="p-4 border-t border-[#292934] space-y-1">

      {NAVIGATION
        .find((group) => group.section === 'BOTTOM')
        .items.map((item) => {

          const Icon = item.icon;

          const isActive =
            activePath === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActivePath(item.id);
                closeMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]'
                  : 'hover:bg-[#1A1A22] hover:text-[#F2F0F5]'
              }`}
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

      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-[#9B8AFB]/10 rounded-full blur-3xl -top-32 -right-32" />

      <div className="absolute w-80 h-80 bg-[#55D6FF]/5 rounded-full blur-3xl -bottom-32 -left-32" />

      {/* Main intro card */}
      <div className="relative w-full max-w-4xl">

        <div className="bg-[#0F1118] border border-[#292934] rounded-3xl overflow-hidden shadow-2xl">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Mascot side */}
            <div className="flex items-center justify-center bg-[#0B0B0F] min-h-[420px] p-10 relative">

              <div className="absolute top-8 left-8 flex items-center gap-2 text-[#9693A1] text-xs font-medium tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#55D68A]" />
                CyberGuard Online
              </div>

              <MascotImage
                src="/assets/mascots/cyberguard-mascot-main.png"
                alt="Vexel - CyberGuard Mascot"
                className="w-64 h-64 md:w-80 md:h-80"
              />

            </div>

            {/* Introduction */}
            <div className="p-8 md:p-12 flex flex-col justify-center">

              <div className="inline-flex items-center gap-2 text-[#9B8AFB] text-sm font-medium mb-5">
                <Shield size={17} />
                Meet your cybersecurity companion
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-[#F2F0F5] tracking-tight mb-4">
                Hey! I'm Vexel. 👋
              </h1>

              <p className="text-lg text-[#C4C0CC] leading-relaxed mb-5">
                I'm your guide inside <span className="text-[#9B8AFB] font-semibold">CyberGuard</span> —
                a place where you can learn, check, and improve your digital security.
              </p>

              <p className="text-sm text-[#9693A1] leading-relaxed mb-8">
                From stronger passwords and safer links to phishing awareness,
                privacy checks, encryption and cybersecurity learning,
                we'll keep things practical and easy to understand.
              </p>

              {/* What CyberGuard contains */}
              <div className="grid grid-cols-2 gap-3 mb-8">

                <div className="flex items-center gap-2 text-sm text-[#C4C0CC]">
                  <KeyRound
                    size={16}
                    className="text-[#9B8AFB]"
                  />
                  Password Security
                </div>

                <div className="flex items-center gap-2 text-sm text-[#C4C0CC]">
                  <ScanSearch
                    size={16}
                    className="text-[#9B8AFB]"
                  />
                  Threat Detection
                </div>

                <div className="flex items-center gap-2 text-sm text-[#C4C0CC]">
                  <Network
                    size={16}
                    className="text-[#9B8AFB]"
                  />
                  Network Tools
                </div>

                <div className="flex items-center gap-2 text-sm text-[#C4C0CC]">
                  <GraduationCap
                    size={16}
                    className="text-[#9B8AFB]"
                  />
                  Cyber Learning
                </div>

              </div>

              <button
                onClick={onEnter}
                className="w-full flex items-center justify-center gap-3 bg-[#9B8AFB] hover:bg-[#AA9BFF] text-[#0B0B0F] py-3.5 px-5 rounded-xl font-semibold transition-all duration-200 hover:translate-y-[-1px]"
              >
                Enter CyberGuard
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-xs text-[#66636E] mt-4">
                Your cybersecurity journey starts here.
              </p>

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

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2">
            Dashboard
          </h1>

          <p className="text-[#9693A1] text-base">
            Your cybersecurity command center
          </p>
        </div>

        <div className="flex items-center gap-6">

          <MascotImage
            src="/assets/mascots/cyberguard-mascot-main.png"
            alt="CyberGuard Friendly Mascot"
            className="w-24 h-24 md:w-32 md:h-32"
          />

          <button className="hidden md:flex p-2.5 rounded-full bg-[#1A1A22] border border-[#292934] hover:bg-[#292934] text-[#9693A1] hover:text-[#F2F0F5] transition-colors relative self-start">

            <Bell size={20} />

            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#9B8AFB] rounded-full" />

          </button>

        </div>

      </header>

      {/* Score + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Security Score */}
        <Card className="flex flex-col items-center justify-center text-center">

          <h2 className="text-lg font-semibold mb-6 w-full text-left text-[#F2F0F5]">
            Security Score
          </h2>

          <CircularProgress
            value={78}
            label="/ 100"
          />

          <p className="text-sm text-[#9693A1] mt-6 mb-6">
            Based on your latest security checkup
          </p>

          <button className="w-full flex items-center justify-center gap-2 bg-[#9B8AFB]/10 text-[#9B8AFB] border border-[#9B8AFB]/20 hover:bg-[#9B8AFB]/20 py-2.5 rounded-lg text-sm font-medium transition-colors">
            View Checkup
            <ArrowRight size={16} />
          </button>

        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Card
            onClick={() => {}}
            className="group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
                <KeyRound size={20} />
              </div>

              <ArrowRight
                size={16}
                className="text-[#9693A1] group-hover:text-[#9B8AFB]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#F2F0F5] mb-1">
                Password Checker
              </h3>

              <p className="text-xs text-[#9693A1]">
                Check basic password characteristics.
              </p>
            </div>
          </Card>

          <Card
            onClick={() => {}}
            className="group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
                <LinkIcon size={20} />
              </div>

              <ArrowRight
                size={16}
                className="text-[#9693A1] group-hover:text-[#9B8AFB]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#F2F0F5] mb-1">
                URL Checker
              </h3>

              <p className="text-xs text-[#9693A1]">
                Analyze basic URL warning indicators.
              </p>
            </div>
          </Card>

          <Card
            onClick={() => {}}
            className="group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
                <MailX size={20} />
              </div>

              <ArrowRight
                size={16}
                className="text-[#9693A1] group-hover:text-[#9B8AFB]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#F2F0F5] mb-1">
                Phishing Detector
              </h3>

              <p className="text-xs text-[#9693A1]">
                Analyze suspicious messages.
              </p>
            </div>
          </Card>

          <Card
            onClick={() => {}}
            className="group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
                <FileDigit size={20} />
              </div>

              <ArrowRight
                size={16}
                className="text-[#9693A1] group-hover:text-[#9B8AFB]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#F2F0F5] mb-1">
                File Hash
              </h3>

              <p className="text-xs text-[#9693A1]">
                Generate a SHA-256 hash.
              </p>
            </div>
          </Card>

        </div>
      </div>

      {/* Security Overview */}
      <div className="pt-2">

        <h2 className="text-lg font-semibold text-[#F2F0F5] mb-4">
          Security Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[#9693A1]">
                Password Security
              </span>
              <span className="text-lg font-mono font-bold">
                80%
              </span>
            </div>

            <ProgressBar
              progress={80}
              colorClass="bg-[#6FCF97]"
            />
          </Card>

          <Card>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[#9693A1]">
                Privacy
              </span>
              <span className="text-lg font-mono font-bold">
                64%
              </span>
            </div>

            <ProgressBar
              progress={64}
              colorClass="bg-[#E6B566]"
            />
          </Card>

          <Card>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[#9693A1]">
                Account Security
              </span>
              <span className="text-lg font-mono font-bold">
                90%
              </span>
            </div>

            <ProgressBar
              progress={90}
              colorClass="bg-[#6FCF97]"
            />
          </Card>

          <Card>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[#9693A1]">
                Cyber Awareness
              </span>
              <span className="text-lg font-mono font-bold">
                82%
              </span>
            </div>

            <ProgressBar
            progress={82}
              colorClass="bg-[#C4B5FD]"
            />
          </Card>

        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">

        {/* Recommended Actions */}
        <Card className="flex flex-col h-full">

          <h2 className="text-lg font-semibold mb-4">
            Recommended Actions
          </h2>

          <div className="flex flex-col gap-3 flex-1">

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0B0B0F] border border-[#292934]">

              <AlertTriangle
                size={18}
                className="text-[#E6B566] shrink-0 mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">
                  Review privacy settings
                </p>

                <p className="text-xs text-[#9693A1] mt-0.5">
                  3 settings need attention
                </p>
              </div>

            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0B0B0F] border border-[#292934]">

              <CheckCircle2
                size={18}
                className="text-[#6FCF97] shrink-0 mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">
                  Check password strength
                </p>

                <p className="text-xs text-[#9693A1] mt-0.5">
                  All passwords meet criteria
                </p>
              </div>

            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0B0B0F] border border-[#292934]">

              <AlertTriangle
                size={18}
                className="text-[#E6B566] shrink-0 mt-0.5"
              />

              <div>
                <p className="text-sm font-medium">
                  Enable 2FA
                </p>

                <p className="text-xs text-[#9693A1] mt-0.5">
                  Recommended for 2 accounts
                </p>
              </div>

            </div>

          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="flex flex-col h-full">

          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="flex flex-col gap-4 flex-1">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9B8AFB]" />

                <span className="text-sm">
                  Password strength checked
                </span>
              </div>

              <span className="text-xs font-mono text-[#9693A1]">
                2h ago
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#C4B5FD]" />

                <span className="text-sm">
                  URL analyzed
                </span>
              </div>

              <span className="text-xs font-mono text-[#9693A1]">
                5h ago
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#9B8AFB]" />

                <span className="text-sm">
                  Malware quiz completed
                </span>
              </div>

              <span className="text-xs font-mono text-[#9693A1]">
                1d ago
              </span>

            </div>

          </div>
        </Card>

        {/* Cyber Academy */}
        <Card className="flex flex-col h-full justify-between">

          <div>

            <div className="flex items-center justify-between mb-4">

              <h2 className="text-lg font-semibold">
                Cyber Academy
              </h2>

              <GraduationCap
                size={20}
                className="text-[#9B8AFB]"
              />

            </div>

            <div className="flex items-end justify-between mb-2">

              <span className="text-3xl font-mono font-bold">
                68%
              </span>

              <span className="text-sm text-[#9693A1] mb-1">
                5 / 8 modules completed
              </span>

            </div>

            <ProgressBar
              progress={68}
              colorClass="bg-[#9B8AFB]"
            />

          </div>

          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-[#F2F0F5] text-[#0B0B0F] hover:bg-[#D4D2D9] py-2.5 rounded-lg text-sm font-semibold transition-colors">

            Continue Learning
            <ArrowRight size={16} />

          </button>

        </Card>

      </div>
    </div>
  );
};

/* =========================================================
   MODULE VIEW
========================================================= */

const ModuleView = ({
  mascot,
  title,
  description,
}) => (
  <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20">

    <MascotImage
      src={mascot}
      alt={`${title} Mascot`}
      className="w-48 h-48 mb-8"
    />

    <h2 className="text-3xl font-bold text-[#F2F0F5] mb-4">
      {title}
    </h2>

    <p className="text-[#9693A1] max-w-lg mb-8">
      {description}
    </p>

    <Card className="w-full max-w-md bg-[#0B0B0F]">
      <p className="text-sm text-[#9693A1]">
        This module will be connected to the CyberGuard security tools.
      </p>
    </Card>

  </div>
);

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {

  const [activePath, setActivePath] =
    useState('dashboard');

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [showIntro, setShowIntro] =
    useState(true);

  /* Check if Vexel intro has already been seen */
  useEffect(() => {

    const hasSeenIntro =
      localStorage.getItem('cyberguard_intro_seen');

    if (hasSeenIntro === 'true') {
      setShowIntro(false);
    }

  }, []);

  /* Enter CyberGuard */
  const enterCyberGuard = () => {

    localStorage.setItem(
      'cyberguard_intro_seen',
      'true'
    );

    setShowIntro(false);

  };

  /* Show Vexel introduction */
  if (showIntro) {
    return (
      <VexelIntro
        onEnter={enterCyberGuard}
      />
    );
  }

  /* Render current page */
  const renderActiveView = () => {

    switch (activePath) {

      case 'dashboard':
        return <Dashboard />;

      case 'password-lab':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-password.png"
            title="Password Lab"
            description="Explore password strength, password generation and practical password security."
          />
        );

      case 'crypto-lab':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="Crypto Lab"
            description="Explore encryption, decryption and introductory cryptography concepts."
          />
        );

      case 'threat-scanner':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-phishing.png"
            title="Threat Scanner"
            description="Analyze suspicious messages and URLs using basic cybersecurity warning indicators."
          />
        );

      case 'network-lab':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="Network Lab"
            description="Explore IP addresses, network concepts and practical cybersecurity checks."
          />
        );

      case 'file-security':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="File Security"
            description="Explore file hashing and file integrity verification using SHA-256."
          />
        );

      case 'security-checkup':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="Security Checkup"
            description="Review your cybersecurity hygiene, privacy habits and account security."
          />
        );

      case 'cyber-academy':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-learning.png"
            title="Cyber Academy"
            description="Learn cybersecurity through interactive modules, quizzes and real-world scenarios."
          />
        );

      case 'incident-simulator':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="Incident Simulator"
            description="Practice responding to common cybersecurity situations through interactive scenarios."
          />
        );

      case 'cyber-glossary':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-learning.png"
            title="Cyber Glossary"
            description="Understand cybersecurity terminology without drowning in technical jargon."
          />
        );

      case 'settings':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="Settings"
            description="Manage your CyberGuard preferences and application settings."
          />
        );

      case 'about':
        return (
          <ModuleView
            mascot="/assets/mascots/cyberguard-mascot-main.png"
            title="About CyberGuard"
            description="CyberGuard is an educational cybersecurity platform designed to make security concepts practical and approachable."
          />
        );

      default:
        return <Dashboard />;
    }

  };

  return (
    <div className="min-h-screen bg-[#080C12] text-[#F2F0F5] flex">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0">
        <SidebarContent
          activePath={activePath}
          setActivePath={setActivePath}
        />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
          />

          {/* Drawer */}
          <aside className="relative w-72 h-full">

            <button
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[#14141A] text-[#9693A1]"
            >
              <X size={20} />
            </button>

            <SidebarContent
              activePath={activePath}
              setActivePath={setActivePath}
              closeMobile={() =>
                setIsMobileMenuOpen(false)
              }
            />

          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-w-0">

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-[#080C12]/95 backdrop-blur border-b border-[#202631]">

          <button
            onClick={() =>
              setIsMobileMenuOpen(true)
            }
            className="p-2 rounded-lg bg-[#14141A] border border-[#292934]"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 font-semibold">
            <Shield
              size={20}
              className="text-[#9B8AFB]"
            />
            CyberGuard
          </div>

          <div className="w-9" />

        </div>

        {/* Page */}
        <div className="p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </div>

      </main>

    </div>
  );
}