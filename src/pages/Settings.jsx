import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bot, 
  Bell, 
  GraduationCap, 
  Database, 
  ShieldCheck, 
  AlertOctagon, 
  Info,
  ArrowRight,
  Moon,
  Sun
} from 'lucide-react';

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 md:p-6 text-[#F2F0F5] ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <h2 className="text-lg font-bold text-[#F2F0F5] mb-4 flex items-center gap-2 border-b border-[#292934] pb-3">
    <Icon size={20} className="text-[#9B8AFB]" /> {title}
  </h2>
);

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-start justify-between py-3">
    <div className="pr-4">
      <div className="text-sm font-semibold text-[#F2F0F5]">{label}</div>
      <div className="text-xs text-[#9693A1] mt-1 leading-relaxed">{description}</div>
    </div>
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[#9B8AFB]' : 'bg-[#292934]'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const ConfirmResetBlock = ({ title, description, onConfirm, buttonText, danger = false }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className={`p-4 rounded-lg border ${danger ? 'bg-[#E87575]/10 border-[#E87575]/30' : 'bg-[#1A1A22] border-[#292934]'}`}>
        <p className={`text-sm font-medium mb-4 ${danger ? 'text-[#E87575]' : 'text-[#F2F0F5]'}`}>{description}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsConfirming(false)}
            className="flex-1 bg-[#0B0B0F] border border-[#292934] hover:bg-[#292934] text-[#F2F0F5] py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); setIsConfirming(false); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors text-[#0B0B0F] ${danger ? 'bg-[#E87575] hover:bg-[#D66666]' : 'bg-[#E6B566] hover:bg-[#D4A355]'}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-[#F2F0F5]">{title}</span>
      <button 
        onClick={() => setIsConfirming(true)}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${danger ? 'bg-[#14141A] text-[#E87575] border-[#E87575]/30 hover:bg-[#E87575]/10' : 'bg-[#1A1A22] text-[#9693A1] border-[#292934] hover:text-[#F2F0F5] hover:bg-[#292934]'}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Settings({
  theme, setTheme,
  showVexel, setShowVexel,
  securityReminders, setSecurityReminders,
  vexelTips, setVexelTips,
  instantQuizFeedback, setInstantQuizFeedback,
  learningDifficulty, setLearningDifficulty,
  securityScore,
  resetAcademyProgress,
  resetSimulatorProgress,
  resetAllData,
  setActivePath
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon size={28} className="text-[#9B8AFB]" />
            <h1 className="text-3xl font-bold text-[#F2F0F5]">Settings</h1>
          </div>
          <p className="text-[#9693A1] text-base">
            Customize your CyberGuard experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          
          {/* Appearance */}
          <Card>
            <SectionHeader icon={Palette} title="Appearance" />
            <div className="space-y-4">
              <div className="text-sm font-semibold text-[#F2F0F5] mb-2">Theme</div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${theme === 'dark' ? 'border-[#9B8AFB] bg-[#9B8AFB]/10 text-[#9B8AFB]' : 'border-[#292934] bg-[#0B0B0F] text-[#9693A1] hover:bg-[#1A1A22]'}`}
                >
                  <Moon size={16} /> Dark
                </button>
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${theme === 'light' ? 'border-[#9B8AFB] bg-[#9B8AFB]/10 text-[#9B8AFB]' : 'border-[#292934] bg-[#0B0B0F] text-[#9693A1] hover:bg-[#1A1A22]'}`}
                >
                  <Sun size={16} /> Light
                </button>
              </div>
            </div>
          </Card>

          {/* Vexel Assistant */}
          <Card>
            <SectionHeader icon={Bot} title="Vexel Assistant" />
            <div className="divide-y divide-[#292934]">
              <Toggle 
                label="Show Vexel" 
                description="Show Vexel throughout CyberGuard as your security learning assistant."
                checked={showVexel} 
                onChange={setShowVexel} 
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <SectionHeader icon={Bell} title="Notifications" />
            <div className="divide-y divide-[#292934]">
              <Toggle 
                label="Security reminders" 
                description="Receive helpful reminders about security checks and learning progress."
                checked={securityReminders} 
                onChange={setSecurityReminders} 
              />
              <Toggle 
                label="Vexel tips" 
                description="Allow Vexel to show occasional cybersecurity tips."
                checked={vexelTips} 
                onChange={setVexelTips} 
              />
            </div>
          </Card>

          {/* About */}
          <Card className="bg-gradient-to-br from-[#14141A] to-[#0B0B0F]">
            <SectionHeader icon={Info} title="About CyberGuard" />
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-[#9B8AFB]/10 rounded-xl flex items-center justify-center text-[#9B8AFB]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#F2F0F5]">CyberGuard</h3>
                <p className="text-xs text-[#9693A1] font-mono">v1.0</p>
              </div>
            </div>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              An interactive cybersecurity learning and awareness platform. Built for learning, experimentation, and safer digital habits.
            </p>
          </Card>
          
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Learning Preferences */}
          <Card>
            <SectionHeader icon={GraduationCap} title="Learning Preferences" />
            <div className="divide-y divide-[#292934]">
              <Toggle 
                label="Instant quiz feedback" 
                description="Show feedback immediately after answering a quiz question."
                checked={instantQuizFeedback} 
                onChange={setInstantQuizFeedback} 
              />
              <div className="py-4">
                <div className="text-sm font-semibold text-[#F2F0F5] mb-3">Difficulty</div>
                <div className="flex flex-wrap gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setLearningDifficulty(lvl)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${learningDifficulty === lvl ? 'bg-[#9B8AFB] text-[#0B0B0F] border-[#9B8AFB]' : 'bg-[#0B0B0F] text-[#9693A1] border-[#292934] hover:border-[#3A3A4A] hover:text-[#F2F0F5]'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Security Score Info */}
          <Card>
            <SectionHeader icon={ShieldCheck} title="Security Score" />
            <div className="flex items-center justify-between mb-4 bg-[#0B0B0F] border border-[#292934] p-4 rounded-xl">
              <div>
                <p className="text-sm text-[#9693A1] mb-1">Current Score</p>
                <p className="text-2xl font-mono font-bold text-[#F2F0F5]">
                  {securityScore !== null ? securityScore : '--'} <span className="text-lg text-[#9693A1]">/ 100</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-[#292934] flex items-center justify-center">
                {securityScore !== null && <span className="w-2 h-2 rounded-full bg-[#9B8AFB]" />}
              </div>
            </div>
            <button 
              onClick={() => setActivePath('security-checkup')}
              className="w-full flex items-center justify-center gap-2 text-[#9B8AFB] hover:text-[#AA9BFF] hover:bg-[#9B8AFB]/10 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Open Security Checkup <ArrowRight size={16} />
            </button>
          </Card>

          {/* Data & Progress */}
          <Card>
            <SectionHeader icon={Database} title="Data & Progress" />
            <div className="divide-y divide-[#292934]">
              <div className="py-1">
                <ConfirmResetBlock 
                  title="Learning Progress" 
                  description="Reset all Cyber Academy progress? (Checkups and Simulator history will remain)."
                  buttonText="Reset Progress"
                  onConfirm={resetAcademyProgress}
                />
              </div>
              <div className="py-1">
                <ConfirmResetBlock 
                  title="Simulator Progress" 
                  description="Reset Incident Simulator completion history?"
                  buttonText="Reset Simulator"
                  onConfirm={resetSimulatorProgress}
                />
              </div>
            </div>
            <p className="text-xs text-[#9693A1] mt-3">
              Your CyberGuard progress is securely stored for this current session.
            </p>
          </Card>

          {/* Danger Zone */}
          <Card className="border-[#E87575]/30">
            <h2 className="text-lg font-bold text-[#E87575] mb-4 flex items-center gap-2 border-b border-[#E87575]/20 pb-3">
              <AlertOctagon size={20} /> Danger Zone
            </h2>
            <ConfirmResetBlock 
              title="Factory Reset" 
              description="This will instantly reset your CyberGuard session data, including Security Checkup score, Academy progress, Simulator history, Glossary favorites, and Settings. This cannot be undone."
              buttonText="Reset All App Data"
              danger={true}
              onConfirm={resetAllData}
            />
          </Card>

        </div>
      </div>
    </div>
  );
}