import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  RotateCcw,
  LayoutDashboard,
  Info,
  ShieldAlert,
  Shield
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

const ProgressBar = ({ progress, colorClass = 'bg-[#9B8AFB]', className = '' }) => (
  <div className={`w-full bg-[#0B0B0F] rounded-full h-2 overflow-hidden border border-[#292934] ${className}`}>
    <div
      className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

/* =========================================================
   ASSESSMENT DATA
========================================================= */

const CATEGORIES = {
  PASSWORDS: 'Password Security',
  ACCOUNT: 'Account Protection',
  BROWSING: 'Safe Browsing',
  AWARENESS: 'Cyber Awareness',
  PRIVACY: 'Privacy'
};

const QUESTIONS = [
  {
    id: 1,
    category: CATEGORIES.PASSWORDS,
    text: "Do you use unique passwords for your most important accounts (email, banking, etc.)?",
    recommendation: "Use unique passwords for important accounts to ensure one breach doesn't compromise everything."
  },
  {
    id: 2,
    category: CATEGORIES.PASSWORDS,
    text: "Do you use a password manager to securely store and generate your passwords?",
    recommendation: "Use a password manager. It makes securely managing unique, complex passwords effortless."
  },
  {
    id: 3,
    category: CATEGORIES.ACCOUNT,
    text: "Is Two-Factor Authentication (2FA) enabled on your important accounts?",
    recommendation: "Enable two-factor authentication on all important accounts for a critical extra layer of security."
  },
  {
    id: 4,
    category: CATEGORIES.ACCOUNT,
    text: "Do you avoid sharing OTPs (One-Time Passwords) or security codes with others?",
    recommendation: "Never share OTPs or security codes. Legitimate support staff will never ask for them."
  },
  {
    id: 5,
    category: CATEGORIES.BROWSING,
    text: "Do you verify suspicious links and email sender addresses before opening them?",
    recommendation: "Always verify suspicious links and sender addresses before clicking or downloading."
  },
  {
    id: 6,
    category: CATEGORIES.BROWSING,
    text: "Do you download software and apps only from trusted sources or official stores?",
    recommendation: "Download software only from official stores or verified developer websites to avoid hidden malware."
  },
  {
    id: 7,
    category: CATEGORIES.AWARENESS,
    text: "Do you know how to recognize common phishing attempts and social engineering?",
    recommendation: "Learn how to identify phishing messages. Be highly cautious of urgent requests for credentials or money."
  },
  {
    id: 8,
    category: CATEGORIES.AWARENESS,
    text: "Do you maintain recent backups of your most important files and data?",
    recommendation: "Create regular backups of important files to protect against ransomware and hardware failure."
  },
  {
    id: 9,
    category: CATEGORIES.AWARENESS,
    text: "Do you regularly update your operating system, browser, and applications?",
    recommendation: "Keep your operating system and applications updated to patch known security vulnerabilities."
  },
  {
    id: 10,
    category: CATEGORIES.PRIVACY,
    text: "Do you periodically review the privacy and sharing settings on your social media accounts?",
    recommendation: "Review privacy settings regularly to ensure you aren't oversharing personal information publicly."
  }
];

const OPTIONS = [
  { id: 'yes', label: 'Yes', score: 10, icon: CheckCircle2, color: 'text-[#6FCF97]', border: 'border-[#6FCF97]', bgHover: 'hover:bg-[#6FCF97]/10' },
  { id: 'sometimes', label: 'Sometimes', score: 5, icon: AlertTriangle, color: 'text-[#E6B566]', border: 'border-[#E6B566]', bgHover: 'hover:bg-[#E6B566]/10' },
  { id: 'no', label: 'No', score: 0, icon: XCircle, color: 'text-[#E87575]', border: 'border-[#E87575]', bgHover: 'hover:bg-[#E87575]/10' },
  { id: 'notsure', label: 'Not sure', score: 0, icon: HelpCircle, color: 'text-[#9693A1]', border: 'border-[#9693A1]', bgHover: 'hover:bg-[#9693A1]/10' }
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SecurityCheckup({ setActivePath, setSecurityScore }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({}); 
  const [showResults, setShowResults] = useState(false);

  // Derive scores and results
  const results = useMemo(() => {
    if (!showResults) return null;

    let totalScore = 0;
    const categoryTotals = {};
    const categoryMax = {};
    const weakQuestions = [];

    QUESTIONS.forEach(q => {
      if (!categoryTotals[q.category]) {
        categoryTotals[q.category] = 0;
        categoryMax[q.category] = 0;
      }
      
      categoryMax[q.category] += 10; 
      
      const answerId = answers[q.id];
      const option = OPTIONS.find(opt => opt.id === answerId);
      const score = option ? option.score : 0;
      
      totalScore += score;
      categoryTotals[q.category] += score;

      if (!option || option.score <= 5) {
        weakQuestions.push(q);
      }
    });

    const finalScore = Math.round((totalScore / (QUESTIONS.length * 10)) * 100);
    
    const categoryBreakdown = Object.keys(categoryTotals).map(cat => ({
      name: cat,
      score: Math.round((categoryTotals[cat] / categoryMax[cat]) * 100)
    }));

    let riskLevel = 'High Risk';
    let riskColor = 'text-[#E87575]';
    let riskIcon = ShieldAlert;
    let mascotMsg = "No judgment. Let's fix the biggest weaknesses one step at a time.";
    // 👉 Updated low score mascot
    let mascotImg = "/assets/mascots/cyberguard-mascot-phishing.png";

    if (finalScore >= 80) {
      riskLevel = 'Excellent';
      riskColor = 'text-[#6FCF97]';
      riskIcon = ShieldCheck;
      mascotMsg = "Nice work! Your security habits are looking solid.";
      // 👉 Updated high score mascot
      mascotImg = "/assets/mascots/cyberguard-mascot-password.png";
    } else if (finalScore >= 60) {
      riskLevel = 'Good';
      riskColor = 'text-[#9B8AFB]';
      riskIcon = ShieldCheck;
      mascotMsg = "You're doing some things right. Let's strengthen a few weak spots.";
      // 👉 Updated medium score mascot
      mascotImg = "/assets/mascots/cyberguard-mascot-learning.png";
    } else if (finalScore >= 40) {
      riskLevel = 'Needs Improvement';
      riskColor = 'text-[#E6B566]';
      riskIcon = AlertTriangle;
    }

    return {
      score: finalScore,
      riskLevel,
      riskColor,
      riskIcon,
      mascotMsg,
      mascotImg,
      categoryBreakdown,
      recommendations: weakQuestions.map(q => q.recommendation)
    };
  }, [answers, showResults]);

  useEffect(() => {
    if (showResults && results) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (typeof setSecurityScore === 'function') {
        setSecurityScore(results.score);
      }
    }
  }, [showResults, results, setSecurityScore]);

  const handleSelectOption = (optionId) => {
    const currentQ = QUESTIONS[currentStep];
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
  };

  const currentQ = QUESTIONS[currentStep];
  const selectedOptionId = answers[currentQ?.id];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={28} className="text-[#9B8AFB]" />
            <h1 className="text-3xl font-bold text-[#F2F0F5]">Security Checkup</h1>
          </div>
          <p className="text-[#9693A1] text-base max-w-xl mb-4">
            Answer a few questions to understand your current cybersecurity habits and uncover blind spots.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1A22] border border-[#292934] text-xs text-[#9693A1]">
            <Info size={14} className="text-[#9B8AFB]" />
            This checkup is educational and does not inspect your device or accounts.
          </div>
        </div>
      </div>

      {!showResults ? (
        /* =========================================================
           QUESTIONNAIRE VIEW
        ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Mascot Context Panel (Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center p-6 bg-[#14141A] border border-[#292934] rounded-xl h-full">
            {/* 👉 Sidebar learning mascot stays the same */}
            <MascotImage 
              src="/assets/mascots/cyberguard-mascot-learning.png" 
              alt="Vexel Mascot" 
              className="w-32 h-32 mb-6" 
            />
            <div className="bg-[#0B0B0F] border border-[#292934] p-4 rounded-lg relative w-full text-center">
              {/* Little speech bubble triangle */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0B0B0F] border-t border-l border-[#292934] rotate-45" />
              <p className="text-sm font-semibold text-[#9B8AFB] mb-1">Vexel says:</p>
              <p className="text-sm text-[#9693A1]">Take your time. Be honest—there are no wrong answers here, only room to improve.</p>
            </div>
          </div>

          {/* Question Card */}
          <Card className="md:col-span-2 flex flex-col min-h-[400px]">
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-[#9693A1] uppercase tracking-wider">
                  Question {currentStep + 1} of {QUESTIONS.length}
                </span>
                <span className="text-xs text-[#9B8AFB] bg-[#9B8AFB]/10 px-2 py-1 rounded-md">
                  {currentQ.category}
                </span>
              </div>
              <ProgressBar progress={((currentStep + 1) / QUESTIONS.length) * 100} />
            </div>

            <div className="flex-1 flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold text-[#F2F0F5] mb-8 leading-snug">
                {currentQ.text}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {OPTIONS.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${isSelected 
                          ? `${opt.border} bg-[#1A1A22]` 
                          : `border-[#292934] bg-[#0B0B0F] hover:border-[#3A3A4A] ${opt.bgHover}`
                        }
                      `}
                    >
                      <Icon size={20} className={isSelected ? opt.color : 'text-[#9693A1]'} />
                      <span className={`font-semibold ${isSelected ? 'text-[#F2F0F5]' : 'text-[#9693A1]'}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-[#292934] mt-auto">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-[#9693A1] hover:text-[#F2F0F5] disabled:opacity-30 transition-colors font-medium text-sm"
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!selectedOptionId}
                className="flex items-center gap-2 bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-lg font-bold transition-all text-sm"
              >
                {currentStep === QUESTIONS.length - 1 ? 'Finish Checkup' : 'Next'}
                {currentStep !== QUESTIONS.length - 1 && <ArrowRight size={16} />}
              </button>
            </div>
          </Card>
        </div>
      ) : (
        /* =========================================================
           RESULTS VIEW
        ========================================================= */
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Score Card */}
            <Card className="flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Background glow based on score */}
              <div className={`absolute w-64 h-64 rounded-full blur-3xl opacity-10 -top-20 -right-20 pointer-events-none ${results.riskColor.replace('text-', 'bg-')}`} />
              
              <h2 className="text-lg font-semibold text-[#F2F0F5] mb-2 w-full text-left">Your Security Score</h2>
              
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center w-36 h-36">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle cx="72" cy="72" r="64" stroke="#292934" strokeWidth="8" fill="none" />
                    <circle 
                      cx="72" cy="72" r="64" 
                      stroke="currentColor" 
                      strokeWidth="8" fill="none" strokeLinecap="round" 
                      className={`transition-all duration-1000 ease-out ${results.riskColor}`}
                      style={{ strokeDasharray: 402, strokeDashoffset: 402 - (results.score / 100) * 402 }} 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-mono font-bold text-[#F2F0F5]">{results.score}</span>
                    <span className="text-xs text-[#9693A1] mt-1">/ 100</span>
                  </div>
                </div>

                <div className={`mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${results.riskColor.replace('text-', 'border-')}/30 ${results.riskColor.replace('text-', 'bg-')}/10`}>
                  <results.riskIcon size={16} className={results.riskColor} />
                  <span className={`font-bold text-sm ${results.riskColor}`}>{results.riskLevel}</span>
                </div>
              </div>
            </Card>

            {/* Category Breakdown */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-[#F2F0F5] mb-6">Category Breakdown</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {results.categoryBreakdown.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-[#9693A1]">{cat.name}</span>
                      <span className="text-sm font-mono font-bold text-[#F2F0F5]">{cat.score}%</span>
                    </div>
                    <ProgressBar 
                      progress={cat.score} 
                      colorClass={cat.score >= 80 ? 'bg-[#6FCF97]' : cat.score >= 50 ? 'bg-[#E6B566]' : 'bg-[#E87575]'} 
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Recommendations List */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-[#F2F0F5] mb-6 flex items-center gap-2">
                <Shield size={20} className="text-[#9B8AFB]" /> Action Plan
              </h2>
              
              {results.recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-[#0B0B0F] border border-[#292934] rounded-xl">
                  <CheckCircle2 size={40} className="text-[#6FCF97] mb-3" />
                  <p className="font-semibold text-[#F2F0F5] mb-1">Perfect Score!</p>
                  <p className="text-sm text-[#9693A1]">Your cybersecurity habits are excellent. Keep up the great work.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-[#0B0B0F] border border-[#292934]">
                      <ArrowRight size={18} className="text-[#E6B566] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#C4C0CC] leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Mascot & Actions */}
            <div className="flex flex-col gap-6">
              <Card className="flex flex-col items-center text-center">
                <MascotImage 
                  src={results.mascotImg}
                  alt="Vexel" 
                  className="w-24 h-24 mb-4" 
                />
                <p className="text-sm font-medium text-[#F2F0F5]">
                  "{results.mascotMsg}"
                </p>
              </Card>

              <Card className="flex flex-col gap-3">
                <button
                  onClick={handleRetake}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1A22] text-[#F2F0F5] border border-[#292934] hover:bg-[#292934] py-3 rounded-lg font-semibold transition-colors text-sm"
                >
                  <RotateCcw size={16} /> Retake Checkup
                </button>
                
                {/* Only render dashboard return if hook exists */}
                {setActivePath && (
                  <button
                    onClick={() => setActivePath('dashboard')}
                    className="w-full flex items-center justify-center gap-2 bg-[#9B8AFB]/10 text-[#9B8AFB] hover:bg-[#9B8AFB]/20 py-3 rounded-lg font-semibold transition-colors text-sm"
                  >
                    <LayoutDashboard size={16} /> Back to Dashboard
                  </button>
                )}
              </Card>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}