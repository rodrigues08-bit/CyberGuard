import React, { useState } from 'react';
import { 
  Bomb,
  ShieldCheck, 
  ArrowRight,
  ArrowLeft, 
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Mail,
  FileDigit,
  UserX,
  PlayCircle,
  RotateCcw,
  LayoutDashboard,
  Info
} from 'lucide-react';

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 md:p-6 text-[#F2F0F5] ${onClick ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors' : ''} ${className}`}
  >
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
   SCENARIO DATA
========================================================= */

const SCENARIOS = [
  {
    id: 's-phishing-1',
    title: '🎣 Phishing Attack',
    description: 'You receive an urgent email claiming your college account will be suspended.',
    difficulty: 'Beginner',
    time: '~2 minutes',
    icon: Mail,
    maxScore: 30,
    reviewPoints: [
      "Don't trust urgency alone.",
      "Inspect sender and destination carefully.",
      "Never provide passwords or OTPs through unexpected messages.",
      "Verify important requests through an independent trusted channel.",
      "When in doubt, stop and verify."
    ],
    steps: [
      {
        id: 'step1',
        situation: 'You are checking your inbox when you receive an unexpected message.',
        simType: 'email',
        simData: {
          from: 'support@college-account-security.example',
          subject: 'URGENT: Your college account will be suspended today',
          body: 'To keep your account active, verify your credentials using the link below.\n\n[Verify Account]'
        },
        question: 'What do you do?',
        choices: [
          { id: 'c1', text: 'Click the link and verify my account.', points: 0, type: 'dangerous', feedback: 'Entering credentials through an unexpected link can give attackers access to your account.' },
          { id: 'c2', text: 'Reply to the email asking whether it is legitimate.', points: 1, type: 'risky', feedback: 'Replying to a suspicious message still communicates with the potentially malicious sender. Verify the request using an independent trusted channel instead.' },
          { id: 'c3', text: 'Check the sender, link, and message for suspicious signs.', points: 10, type: 'success', feedback: 'Checking the sender and destination before interacting with the message reduces the chance of falling for a phishing attempt.' },
          { id: 'c4', text: 'Ignore it immediately without checking anything.', points: 4, type: 'warning', feedback: 'Ignoring it keeps you safe from this attack, but you might miss a real alert. It is better to quickly verify.' }
        ]
      },
      {
        id: 'step2',
        situation: 'You decide to inspect the message closely.',
        simType: 'email',
        simData: {
          from: 'support@college-account-security.example',
          subject: 'URGENT: Your college account will be suspended today',
          body: 'Your account will be disabled within 30 minutes.\n\nLink destination: https://college-login-security.example/verify'
        },
        question: 'What stands out as suspicious?',
        choices: [
          { id: 'c1', text: 'The urgency ("within 30 minutes").', points: 4, type: 'warning', feedback: 'Urgency is a red flag, but there is more.' },
          { id: 'c2', text: 'The suspicious sender and link domain.', points: 4, type: 'warning', feedback: 'The domain looks fake, but there is more.' },
          { id: 'c3', text: 'The credential request via an unexpected link.', points: 4, type: 'warning', feedback: 'This is dangerous, but there is more.' },
          { id: 'c4', text: 'All of the above.', points: 10, type: 'success', feedback: 'Exactly. Attackers combine urgency, fake domains, and credential harvesting to steal accounts.' }
        ]
      },
      {
        id: 'step3',
        situation: 'You have identified the message as highly suspicious.',
        simType: 'none',
        question: 'What should you do next?',
        choices: [
          { id: 'c1', text: 'Click the link just to see what the website looks like.', points: 0, type: 'dangerous', feedback: 'Merely visiting a malicious website can expose your browser to exploits or tracking.' },
          { id: 'c2', text: 'Forward the email to all your friends to warn them.', points: 1, type: 'risky', feedback: 'Forwarding it might accidentally cause a friend to click the malicious link.' },
          { id: 'c3', text: 'Contact the college through an official website/known contact method and verify the warning independently.', points: 10, type: 'success', feedback: 'Perfect. Out-of-band verification ensures you are talking to the real organization.' }
        ]
      }
    ]
  },
  {
    id: 's-download-1',
    title: '💻 Suspicious Download',
    description: 'A classmate sends you an unexpected file attachment over chat.',
    difficulty: 'Beginner',
    time: '~1 minute',
    icon: FileDigit,
    maxScore: 10,
    reviewPoints: [
      "Unexpected executable files (.exe, .bat, .scr) can be highly dangerous.",
      "File extensions matter.",
      "Always verify unexpected files, even from trusted friends.",
      "Never disable antivirus or security controls to run suspicious software."
    ],
    steps: [
      {
        id: 'step1',
        situation: 'A classmate sends you a file over a chat app.',
        simType: 'message',
        simData: {
          sender: 'Classmate',
          attachment: 'Exam_Results_2026.exe',
          message: 'Open this quickly. It\'s your result 😂'
        },
        question: 'How do you handle this file?',
        choices: [
          { id: 'c1', text: 'Open it immediately to see the results.', points: 0, type: 'dangerous', feedback: 'Running unexpected executables (.exe) is a fast way to infect your computer with malware.' },
          { id: 'c2', text: 'Ask them in the chat why the file is an .exe.', points: 7, type: 'success', feedback: 'Good instinct to question the file extension. Even better to verify out-of-band in case their chat account is hacked.' },
          { id: 'c3', text: 'Verify with the classmate through another trusted channel (like a phone call).', points: 10, type: 'success', feedback: 'Excellent. Always verify unexpected attachments, even from friends, as their accounts may be compromised.' },
          { id: 'c4', text: 'Delete and ignore it without interacting with it.', points: 4, type: 'warning', feedback: 'Safe, but letting your friend know their account might be hacked is also helpful.' }
        ]
      }
    ]
  },
  {
    id: 's-compromise-1',
    title: '🔐 Compromised Account',
    description: 'You receive a notification that someone signed into your account from an unfamiliar location.',
    difficulty: 'Intermediate',
    time: '~2 minutes',
    icon: UserX,
    maxScore: 30,
    reviewPoints: [
      "Verify security alerts independently by visiting the official site.",
      "Change passwords using the official app/website, never via unexpected links.",
      "Revoke unknown sessions immediately.",
      "Enable 2FA to prevent credential reuse attacks.",
      "Check your account settings for any unauthorized changes."
    ],
    steps: [
      {
        id: 'step1',
        situation: 'Your phone buzzes with a notification from a service you use.',
        simType: 'message',
        simData: {
          sender: 'Security Alert',
          message: 'New sign-in detected from an unfamiliar location (Moscow, RU). If this was not you, secure your account immediately.'
        },
        question: 'What is your immediate response?',
        choices: [
          { id: 'c1', text: 'Ignore it. It is probably a glitch.', points: 0, type: 'dangerous', feedback: 'Ignoring security alerts allows attackers free reign over your account.' },
          { id: 'c2', text: 'Click the link in the notification immediately to fix it.', points: 0, type: 'dangerous', feedback: 'Fake security alerts are a common phishing tactic. Do not blindly click links in alerts.' },
          { id: 'c3', text: 'Open the official app or website independently and log in to check your security dashboard.', points: 10, type: 'success', feedback: 'Logging in directly avoids fake links and lets you see the real account status safely.' }
        ]
      },
      {
        id: 'step2',
        situation: 'You log in securely and confirm there is an active session from a location you have never visited.',
        simType: 'none',
        question: 'How do you secure the account?',
        choices: [
          { id: 'c1', text: 'Log out of your current browser and do nothing else.', points: 0, type: 'dangerous', feedback: 'Logging yourself out does nothing to stop the attacker. They still have your password!' },
          { id: 'c2', text: 'Change your password but leave the active sessions alone.', points: 1, type: 'risky', feedback: 'Changing the password prevents future logins, but the attacker is still actively logged in right now.' },
          { id: 'c3', text: 'Review active sessions, revoke the unfamiliar session, and then immediately change your password.', points: 10, type: 'success', feedback: 'Kicking the attacker out and immediately changing the keys is the correct, comprehensive move.' }
        ]
      },
      {
        id: 'step3',
        situation: 'The attacker is kicked out and your password is changed.',
        simType: 'none',
        question: 'What is the best way to prevent this from happening again?',
        choices: [
          { id: 'c1', text: 'Use a slightly longer password next time.', points: 1, type: 'risky', feedback: 'A longer password doesn\'t help if it gets leaked in a third-party data breach.' },
          { id: 'c2', text: 'Hide your email address from your public profile.', points: 4, type: 'warning', feedback: 'This helps slightly, but does not stop automated credential stuffing attacks.' },
          { id: 'c3', text: 'Enable Two-Factor Authentication (2FA).', points: 10, type: 'success', feedback: '2FA ensures that even if a password is stolen, the attacker cannot get in without your second factor.' }
        ]
      }
    ]
  }
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function IncidentSimulator({ incidentProgress = [], setIncidentProgress, setActivePath }) {
  const [activeScenarioId, setActiveScenarioId] = useState(null);
  
  // Active Scenario State
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Scoring Stats
  const [currentScore, setCurrentScore] = useState(0);
  const [stats, setStats] = useState({ correct: 0, risky: 0, dangerous: 0 });
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);

  // Derive active data
  const scenario = SCENARIOS.find(s => s.id === activeScenarioId);
  const step = scenario ? scenario.steps[stepIndex] : null;

  // ---------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------

  const handleStartScenario = (id) => {
    setActiveScenarioId(id);
    setStepIndex(0);
    setSelectedChoiceId(null);
    setShowFeedback(false);
    setCurrentScore(0);
    setStats({ correct: 0, risky: 0, dangerous: 0 });
    setIsScenarioComplete(false);
  };

  const handleChoiceSelect = (choice) => {
    if (showFeedback) return; // Prevent changing answer
    
    setSelectedChoiceId(choice.id);
    setShowFeedback(true);
    setCurrentScore(prev => prev + choice.points);
    
    setStats(prev => {
      if (choice.type === 'success') return { ...prev, correct: prev.correct + 1 };
      if (choice.type === 'risky' || choice.type === 'warning') return { ...prev, risky: prev.risky + 1 };
      if (choice.type === 'dangerous') return { ...prev, dangerous: prev.dangerous + 1 };
      return prev;
    });
  };

  const handleContinue = () => {
    if (stepIndex < scenario.steps.length - 1) {
      setStepIndex(prev => prev + 1);
      setSelectedChoiceId(null);
      setShowFeedback(false);
    } else {
      // Finish Scenario
      setIsScenarioComplete(true);
      if (setIncidentProgress && !incidentProgress.includes(scenario.id)) {
        setIncidentProgress(prev => [...prev, scenario.id]);
      }
    }
  };

  const handleBackToMenu = () => {
    setActiveScenarioId(null);
  };

  // ---------------------------------------------------------
  // RENDER: SCENARIO MENU
  // ---------------------------------------------------------
  if (!activeScenarioId) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Bomb size={28} className="text-[#9B8AFB]" />
              <h1 className="text-3xl font-bold text-[#F2F0F5]">Incident Simulator</h1>
            </div>
            <p className="text-[#9693A1] text-base max-w-xl">
              Real security incidents rarely come with a big red warning. Make the decision, see the consequences, and learn from it.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#0B0B0F] p-4 rounded-xl border border-[#292934]">
            {/* 👉 Updated Header Mascot */}
            <MascotImage 
              src="/assets/mascots/cyberguard-mascot-phishing.png" 
              alt="Vexel Simulator Mascot" 
              className="w-16 h-16 shrink-0" 
            />
            <div>
              <p className="text-sm font-semibold text-[#9B8AFB] mb-0.5">Okay, detective mode activated. 👀</p>
              <p className="text-xs text-[#9693A1]">Let's see what you'd do.</p>
            </div>
          </div>
        </div>

        {/* SCENARIO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {SCENARIOS.map(s => {
            const isCompleted = incidentProgress.includes(s.id);
            const Icon = s.icon;

            return (
              <Card key={s.id} className="flex flex-col h-full group border-[#292934] hover:border-[#9B8AFB]/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-[#9B8AFB]/10 text-[#9B8AFB]">
                    <Icon size={24} />
                  </div>
                  {isCompleted ? (
                    <span className="text-xs font-semibold px-2 py-1 bg-[#6FCF97]/10 text-[#6FCF97] rounded flex items-center gap-1">
                      <CheckCircle2 size={12} /> Completed
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-1 bg-[#1A1A22] border border-[#292934] rounded text-[#C4C0CC]">
                      {s.difficulty}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-[#F2F0F5] mb-2">{s.title}</h2>
                <p className="text-sm text-[#9693A1] mb-6 flex-1">{s.description}</p>

                <div className="mt-auto pt-4 border-t border-[#292934] space-y-4">
                  <div className="flex justify-between items-center text-xs text-[#9693A1]">
                    <span>{s.steps.length} steps</span>
                    <span>{s.time}</span>
                  </div>
                  <button 
                    onClick={() => handleStartScenario(s.id)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1A1A22] text-[#9B8AFB] group-hover:bg-[#9B8AFB] group-hover:text-[#0B0B0F] py-2.5 rounded-lg font-semibold transition-colors text-sm"
                  >
                    {isCompleted ? 'Replay Scenario' : 'Start Scenario'} <ArrowRight size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: SCENARIO COMPLETE SCREEN
  // ---------------------------------------------------------
  if (isScenarioComplete) {
    const finalScore = Math.round((currentScore / scenario.maxScore) * 100);
    let quality = 'Needs Practice';
    let qualityColor = 'text-[#E87575]';
    
    if (finalScore >= 80) {
      quality = 'Strong';
      qualityColor = 'text-[#6FCF97]';
    } else if (finalScore >= 60) {
      quality = 'Good';
      qualityColor = 'text-[#E6B566]';
    }

    return (
      <div className="max-w-4xl mx-auto py-8 animate-in zoom-in-95 duration-500">
        <h1 className="text-3xl font-bold text-[#F2F0F5] text-center mb-2">SIMULATION COMPLETE</h1>
        <p className="text-[#9693A1] text-center mb-8">Scenario: {scenario.title}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score Card */}
          <Card className="flex flex-col items-center justify-center py-8">
            <p className="text-sm font-semibold text-[#9693A1] mb-2 uppercase tracking-wider">Final Score</p>
            <div className="text-5xl font-mono font-bold text-[#F2F0F5] mb-4">
              {finalScore} <span className="text-2xl text-[#9693A1]">/ 100</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${qualityColor.replace('text-', 'border-')}/30 ${qualityColor.replace('text-', 'bg-')}/10`}>
              <span className={`font-bold text-sm ${qualityColor}`}>Decision Quality: {quality}</span>
            </div>
            
            <div className="w-full mt-8 pt-6 border-t border-[#292934] flex justify-around text-center">
              <div>
                <p className="text-xl font-bold text-[#6FCF97]">{stats.correct}</p>
                <p className="text-xs text-[#9693A1]">Correct</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#E6B566]">{stats.risky}</p>
                <p className="text-xs text-[#9693A1]">Risky</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#E87575]">{stats.dangerous}</p>
                <p className="text-xs text-[#9693A1]">Dangerous</p>
              </div>
            </div>
          </Card>

          {/* Review Card */}
          <Card>
            <h2 className="text-lg font-semibold text-[#F2F0F5] mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#9B8AFB]" /> What you should remember
            </h2>
            <ul className="space-y-4">
              {scenario.reviewPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#C4C0CC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B8AFB] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-[#0B0B0F] p-4 rounded-lg border border-[#292934] flex gap-4 items-center">
              {/* 👉 Updated review mascot */}
              <MascotImage src="/assets/mascots/cyberguard-mascot-learning.png" className="w-12 h-12" />
              <p className="text-sm text-[#9693A1] italic">
                "You survived the scenario. More importantly, you know what to look for next time."
              </p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => handleStartScenario(scenario.id)}
            className="bg-[#1A1A22] text-[#F2F0F5] border border-[#292934] hover:bg-[#292934] px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> Try Again
          </button>
          <button 
            onClick={handleBackToMenu}
            className="bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={18} /> Choose Another Scenario
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: ACTIVE SCENARIO STEP
  // ---------------------------------------------------------
  const selectedChoice = selectedChoiceId ? step.choices.find(c => c.id === selectedChoiceId) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={handleBackToMenu}
          className="text-[#9693A1] hover:text-[#F2F0F5] font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} /> Exit Scenario
        </button>
        <span className="text-xs font-semibold text-[#9B8AFB] uppercase tracking-wider px-3 py-1 bg-[#1A1A22] rounded-full border border-[#292934]">
          Step {stepIndex + 1} of {scenario.steps.length}
        </span>
      </div>

      <ProgressBar 
        progress={((stepIndex + 1) / scenario.steps.length) * 100} 
        className="h-1.5 mb-6" 
      />

      {/* Main Content */}
      <div className="space-y-6">
        <p className="text-lg text-[#F2F0F5]">{step.situation}</p>

        {/* SIMULATED UI */}
        {step.simType === 'email' && step.simData && (
          <div className="bg-[#0B0B0F] border border-[#292934] rounded-xl overflow-hidden mt-4 relative">
            <div className="absolute top-0 right-0 bg-[#E6B566]/20 text-[#E6B566] text-[10px] font-bold uppercase px-2 py-1 rounded-bl-lg tracking-widest border-b border-l border-[#E6B566]/20">
              Simulation
            </div>
            <div className="p-4 border-b border-[#292934] bg-[#14141A]">
              <div className="text-sm text-[#9693A1] mb-1">
                From: <span className="text-[#F2F0F5]">{step.simData.from}</span>
              </div>
              <div className="text-sm text-[#9693A1]">
                Subject: <span className="font-semibold text-[#F2F0F5]">{step.simData.subject}</span>
              </div>
            </div>
            <div className="p-6 text-sm text-[#C4C0CC] whitespace-pre-wrap leading-relaxed">
              {step.simData.body}
            </div>
          </div>
        )}

        {step.simType === 'message' && step.simData && (
          <div className="bg-[#0B0B0F] border border-[#292934] rounded-xl overflow-hidden mt-4 max-w-sm relative">
            <div className="absolute top-0 right-0 bg-[#E6B566]/20 text-[#E6B566] text-[10px] font-bold uppercase px-2 py-1 rounded-bl-lg tracking-widest border-b border-l border-[#E6B566]/20">
              Simulation
            </div>
            <div className="p-3 border-b border-[#292934] bg-[#14141A] font-semibold text-[#F2F0F5]">
              {step.simData.sender}
            </div>
            <div className="p-4 space-y-3">
              {step.simData.attachment && (
                <div className="flex items-center gap-2 p-2 rounded bg-[#1A1A22] border border-[#292934] w-fit">
                  <FileDigit size={16} className="text-[#E87575]" />
                  <span className="text-xs font-mono text-[#F2F0F5]">{step.simData.attachment}</span>
                </div>
              )}
              <div className="inline-block bg-[#292934] text-[#F2F0F5] px-3 py-2 rounded-lg rounded-tl-none text-sm">
                {step.simData.message}
              </div>
            </div>
          </div>
        )}

        {/* CHOICES */}
        <div className="pt-4">
          <h3 className="text-xl font-bold text-[#F2F0F5] mb-4 flex items-center gap-2">
            <PlayCircle size={20} className="text-[#9B8AFB]" /> {step.question}
          </h3>
          <div className="space-y-3">
            {step.choices.map((choice, i) => {
              const isSelected = selectedChoiceId === choice.id;
              const isDimmed = showFeedback && !isSelected;
              
              let btnClass = "border-[#292934] bg-[#14141A] hover:border-[#3A3A4A] hover:bg-[#1A1A22]";
              if (isSelected) {
                if (choice.type === 'success') btnClass = "border-[#6FCF97] bg-[#6FCF97]/10";
                else if (choice.type === 'warning' || choice.type === 'risky') btnClass = "border-[#E6B566] bg-[#E6B566]/10";
                else if (choice.type === 'dangerous') btnClass = "border-[#E87575] bg-[#E87575]/10";
              }

              return (
                <button
                  key={choice.id}
                  disabled={showFeedback}
                  onClick={() => handleChoiceSelect(choice)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${btnClass} ${isDimmed ? 'opacity-40' : ''}`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-[#F2F0F5]' : 'text-[#C4C0CC]'}`}>
                    {String.fromCharCode(65 + i)}. {choice.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK PANEL */}
        {showFeedback && selectedChoice && (
          <div className="mt-8 animate-in slide-in-from-bottom-2">
            <Card className="flex flex-col sm:flex-row gap-6 items-start">
              
              <div className="flex flex-col items-center shrink-0 w-24">
                {/* 👉 Updated dynamic choice reaction mascot */}
                <MascotImage 
                  src={
                    selectedChoice.type === 'success' ? '/assets/mascots/cyberguard-mascot-password.png' :
                    selectedChoice.type === 'dangerous' ? '/assets/mascots/cyberguard-mascot-incident.png' :
                    '/assets/mascots/cyberguard-mascot-phishing.png'
                  } 
                  className="w-16 h-16 mb-2" 
                />
                <span className="text-xs text-[#9693A1] font-semibold">Vexel says:</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedChoice.type === 'success' && <CheckCircle2 size={18} className="text-[#6FCF97]" />}
                  {(selectedChoice.type === 'warning' || selectedChoice.type === 'risky') && <AlertTriangle size={18} className="text-[#E6B566]" />}
                  {selectedChoice.type === 'dangerous' && <XCircle size={18} className="text-[#E87575]" />}
                  
                  <span className={`font-bold uppercase tracking-wider text-xs ${
                    selectedChoice.type === 'success' ? 'text-[#6FCF97]' :
                    (selectedChoice.type === 'warning' || selectedChoice.type === 'risky') ? 'text-[#E6B566]' :
                    'text-[#E87575]'
                  }`}>
                    {selectedChoice.type === 'success' ? 'Good Decision' :
                     selectedChoice.type === 'risky' ? 'Risky Decision' :
                     selectedChoice.type === 'warning' ? 'Safe but Incomplete' :
                     'Dangerous Decision'}
                  </span>
                </div>
                
                <p className="text-sm text-[#F2F0F5] mb-3">
                  {selectedChoice.type === 'success' ? '"Nice catch! 👀"' :
                   selectedChoice.type === 'dangerous' ? '"That\'s exactly the kind of move an attacker hopes you\'ll make."' :
                   '"Hmm... I\'d pause there."'}
                </p>
                <p className="text-sm text-[#C4C0CC] leading-relaxed bg-[#0B0B0F] p-3 rounded-lg border border-[#292934]">
                  {selectedChoice.feedback}
                </p>
                
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleContinue}
                    className="bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}