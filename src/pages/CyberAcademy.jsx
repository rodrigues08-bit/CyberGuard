import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Award, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Lightbulb,
  Target,
  FileText
} from 'lucide-react';

/* =========================================================
   REUSABLE LOCAL COMPONENTS
========================================================= */

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#14141A] border border-[#292934] rounded-xl p-6 text-[#F2F0F5] ${onClick ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors' : ''} ${className}`}
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
   SUBSTANTIAL LESSON DATA (Cybersecurity Foundations)
========================================================= */

const ACADEMY_MODULES = [
  {
    id: 'cyber-foundations',
    title: 'Cybersecurity Foundations',
    description: 'Understand the fundamental definitions, models, and reasoning behind digital defense.',
    icon: ShieldCheck,
    difficulty: 'Beginner',
    isComingSoon: false,
    lessons: [
      {
        id: 'foundations-1',
        title: 'Understanding Cybersecurity',
        sections: [
          // 01 — LEARN
          {
            type: 'learn',
            title: 'What is Cybersecurity?',
            content: [
              "Cybersecurity is the practice of protecting systems, networks, devices, and programs from digital attacks.",
              "As our lives become increasingly digital, protecting this information is no longer just for IT experts—it is a necessary life skill for everyone.",
              "At its core, cybersecurity protects three primary pillars:",
              "• Devices: The hardware you use (laptops, phones, smart home tech).",
              "• Data: The information you create, store, or transmit (passwords, photos, documents).",
              "• Accounts / Identities: The credentials and digital representations of who you are online."
            ]
          },
          // 02 — UNDERSTAND
          {
            type: 'understand',
            title: 'Threat, Vulnerability & Risk',
            intro: 'To think like a security professional, you must understand that Threat, Vulnerability, and Risk are distinct concepts:',
            items: [
              { term: 'THREAT', desc: 'Something capable of causing harm (e.g., a malware strain or a malicious actor).' },
              { term: 'VULNERABILITY', desc: 'A weakness that could be exploited (e.g., an outdated application or weak password).' },
              { term: 'RISK', desc: 'The potential for a threat to exploit a vulnerability and cause an unwanted impact.' }
            ],
            flow: ['Threat', 'Vulnerability', 'Exploitation', 'Impact', 'Risk'],
            example: {
              title: 'Practical Example: The Outdated Laptop',
              text: 'A student has not updated their laptop for several months. One application contains a known security flaw.',
              breakdown: [
                'Threat: An active attacker scanning the internet for unpatched systems.',
                'Vulnerability: The outdated application running on the student\'s laptop.',
                'Exploitation: The attacker triggers the software flaw remotely.',
                'Impact: The attacker gains unauthorized access to personal files.',
                'Risk: The probability and overall consequence of that data compromise.'
              ]
            }
          },
          // 03 — REAL SCENARIO
          {
            type: 'scenario',
            title: 'Real Scenario: Analyzing the System',
            situation: "A student has not updated their laptop for several months. One application contains a known security weakness. An attacker is actively looking for systems that have not received the relevant security update.",
            questions: [
              {
                id: 'sq1',
                prompt: 'What represents the vulnerability in this scenario?',
                options: [
                  { id: 'a', text: 'The attacker searching the internet', isCorrect: false, feedback: 'Incorrect. The attacker is the external danger, which constitutes a Threat.' },
                  { id: 'b', text: 'The outdated application with a known security flaw', isCorrect: true, feedback: 'Correct! The software flaw is the underlying weakness or Vulnerability.' },
                  { id: 'c', text: 'The lost data impact', isCorrect: false, feedback: 'Incorrect. Data loss is the potential Impact or Risk, not the weakness itself.' }
                ]
              },
              {
                id: 'sq2',
                prompt: 'What represents the threat?',
                options: [
                  { id: 'a', text: 'The active attacker scanning for unpatched systems', isCorrect: true, feedback: 'Correct! The malicious actor looking to cause harm is the Threat.' },
                  { id: 'b', text: 'The laptop battery level', isCorrect: false, feedback: 'Incorrect. Battery status has nothing to do with malicious actors.' }
                ]
              }
            ]
          },
          // 04 — THINK ABOUT IT
          {
            type: 'think',
            title: 'Think About It: The Urgent Alert',
            situation: "You receive a message saying:\n\n'Your account has been flagged. Verify your password immediately using this link.'\n\nBefore doing anything, what should you consider?",
            choices: [
              {
                id: 'tc1',
                text: 'Evaluate the artificial urgency, check the sender address, and inspect the link destination independently.',
                isBest: true,
                explanation: 'Best decision! Pausing to check the source, spotting artificial panic tactics, and refusing to click blind links prevents credential theft.'
              },
              {
                id: 'tc2',
                text: 'Click the link right away so your account doesn’t get locked.',
                isBest: false,
                explanation: 'Risky. Panic is exactly what attackers rely on to bypass your critical thinking.'
              },
              {
                id: 'tc3',
                text: 'Reply to the sender asking if they are real.',
                isBest: false,
                explanation: 'Risky. Communicating directly with a potential scammer validates your active contact info.'
              }
            ]
          },
          // 05 — KNOWLEDGE CHECK
          {
            type: 'quiz',
            title: 'Knowledge Check',
            questions: [
              {
                id: 'kq1',
                text: 'Why are threat, vulnerability, and risk not interchangeable terms?',
                options: [
                  { id: 'a', text: 'They describe completely different parts of a security equation (the danger, the weakness, and the resulting potential consequence).', isCorrect: true, explanation: 'Correct! A threat is the actor/danger, a vulnerability is the flaw, and risk is the calculated consequence.' },
                  { id: 'b', text: 'They are interchangeable; security professionals just use different words to sound smart.', isCorrect: false, explanation: 'Not true. Each term has a distinct definition used in risk management.' }
                ]
              },
              {
                id: 'kq2',
                text: 'Which of the following best protects your digital identity across multiple online services?',
                options: [
                  { id: 'a', text: 'Using the exact same complex password everywhere so you never forget it.', isCorrect: false, explanation: 'Incorrect. Password reuse means one website breach compromises all your accounts.' },
                  { id: 'b', text: 'Using unique passwords for each service combined with Two-Factor Authentication (2FA).', isCorrect: true, explanation: 'Correct! This implements Defense in Depth for your accounts.' }
                ]
              }
            ]
          },
          // 06 — WHAT TO REMEMBER
          {
            type: 'summary',
            title: 'What to Remember',
            points: [
              'Cybersecurity protects systems, data, and identities.',
              'A threat is capable of causing harm.',
              'A vulnerability is a weakness in a system or procedure.',
              'Risk describes the potential consequences of exploitation.',
              'Security is about reducing risk, not eliminating every possible threat.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'passwords-auth',
    title: 'Passwords & Authentication',
    description: 'Learn how to secure your accounts properly.',
    icon: Lock,
    difficulty: 'Beginner',
    isComingSoon: true,
    lessons: []
  },
  {
    id: 'phishing-social',
    title: 'Phishing & Social Engineering',
    description: 'Spot deception and manipulation tactics.',
    icon: ShieldCheck,
    difficulty: 'Intermediate',
    isComingSoon: true,
    lessons: []
  }
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CyberAcademy({ academyProgress = {}, setAcademyProgress, showVexel = true }) {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  // Interactive step states inside sections
  const [scenarioAnswers, setScenarioAnswers] = useState({}); // { sq1: 'b' }
  const [thinkChoiceId, setThinkChoiceId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({}); // { kq1: 'a' }
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const activeModule = ACADEMY_MODULES.find(m => m.id === activeModuleId);
  const activeLesson = activeModule ? activeModule.lessons[0] : null;
  const currentSection = activeLesson ? activeLesson.sections[activeSectionIndex] : null;

  const totalSections = activeLesson ? activeLesson.sections.length : 1;
  const progressPercent = Math.round(((activeSectionIndex + 1) / totalSections) * 100);

  // Handlers
  const handleOpenModule = (mod) => {
    if (mod.isComingSoon) return;
    setActiveModuleId(mod.id);
    setActiveSectionIndex(0);
    setScenarioAnswers({});
    setThinkChoiceId(null);
    setQuizAnswers({});
    setLessonCompleted(false);
  };

  const handleBackToAcademy = () => {
    setActiveModuleId(null);
  };

  const handleNextSection = () => {
    if (activeSectionIndex < totalSections - 1) {
      setActiveSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached the end
      setLessonCompleted(true);
      if (setAcademyProgress && activeModule && activeLesson) {
        setAcademyProgress(prev => ({
          ...prev,
          [activeModule.id]: {
            completedLessons: [activeLesson.id]
          }
        }));
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ---------------------------------------------------------
  // RENDER: ACADEMY HOME (Grid)
  // ---------------------------------------------------------
  if (!activeModuleId) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap size={28} className="text-[#9B8AFB]" />
              <h1 className="text-3xl font-bold text-[#F2F0F5]">Cyber Academy</h1>
            </div>
            <p className="text-[#9693A1] text-base max-w-xl">
              Deep, guided cybersecurity lessons designed for genuine conceptual understanding.
            </p>
          </div>
          
          {showVexel && (
            <div className="flex items-center gap-4 bg-[#0B0B0F] p-4 rounded-xl border border-[#292934]">
              <MascotImage 
                src="/assets/mascots/cyberguard-mascot-learning.png" 
                alt="Vexel Academy Mascot" 
                className="w-16 h-16 shrink-0" 
              />
              <div>
                <p className="text-sm font-semibold text-[#9B8AFB] mb-0.5">Let's slow this down. 👀</p>
                <p className="text-xs text-[#9693A1]">Understand how the pieces connect.</p>
              </div>
            </div>
          )}
        </div>

        {/* MODULE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {ACADEMY_MODULES.map(mod => {
            const isCompleted = academyProgress[mod.id]?.completedLessons?.length > 0;
            const Icon = mod.icon;

            return (
              <Card 
                key={mod.id} 
                className={`flex flex-col h-full ${mod.isComingSoon ? 'opacity-70' : 'group cursor-pointer'}`}
                onClick={() => handleOpenModule(mod)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${mod.isComingSoon ? 'bg-[#1A1A22] text-[#9693A1]' : 'bg-[#9B8AFB]/10 text-[#9B8AFB]'}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-[#1A1A22] border border-[#292934] rounded text-[#C4C0CC]">
                    {mod.difficulty}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#F2F0F5] mb-2">{mod.title}</h2>
                <p className="text-sm text-[#9693A1] mb-6 flex-1">{mod.description}</p>

                {mod.isComingSoon ? (
                  <div className="mt-auto pt-4 border-t border-[#292934]">
                    <span className="text-sm font-medium text-[#9693A1] flex items-center gap-2">
                      <Lock size={14} /> Coming Soon
                    </span>
                  </div>
                ) : (
                  <div className="mt-auto pt-4 border-t border-[#292934] space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#9693A1]">
                      <span>1 comprehensive lesson</span>
                      <span className="font-mono">{isCompleted ? '100%' : '0%'}</span>
                    </div>
                    <ProgressBar progress={isCompleted ? 100 : 0} colorClass={isCompleted ? 'bg-[#6FCF97]' : 'bg-[#9B8AFB]'} />
                    <button className="w-full flex items-center justify-center gap-2 bg-[#1A1A22] text-[#9B8AFB] group-hover:bg-[#9B8AFB] group-hover:text-[#0B0B0F] py-2.5 rounded-lg font-semibold transition-colors text-sm">
                      {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: LESSON COMPLETION SCREEN
  // ---------------------------------------------------------
  if (lessonCompleted) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-in zoom-in-95 duration-500 text-center">
        <div className="w-24 h-24 mx-auto bg-[#6FCF97]/10 text-[#6FCF97] rounded-full flex items-center justify-center mb-6">
          <Award size={48} />
        </div>
        <h1 className="text-4xl font-bold text-[#F2F0F5] mb-4">🎉 Lesson Complete!</h1>
        <p className="text-lg text-[#9693A1] mb-8">
          You successfully completed <span className="text-[#F2F0F5] font-semibold">{activeLesson.title}</span>.
        </p>

        {showVexel && (
          <div className="flex items-center gap-4 bg-[#14141A] border border-[#292934] p-5 rounded-2xl max-w-md mx-auto mb-10 text-left">
            <MascotImage src="/assets/mascots/cyberguard-mascot-main.png" className="w-14 h-14 shrink-0" />
            <p className="text-sm text-[#C4C0CC] italic">
              "Nice. You didn't just memorize the definitions. You used them." — Vexel
            </p>
          </div>
        )}

        <button 
          onClick={handleBackToAcademy}
          className="bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 mx-auto"
        >
          Back to Academy <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------
  // RENDER: ACTIVE SUBSTANTIAL LESSON
  // ---------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Nav & Progress */}
      <div className="flex flex-col gap-4 bg-[#14141A] border border-[#292934] rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBackToAcademy}
            className="text-[#9693A1] hover:text-[#F2F0F5] font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Academy
          </button>
          <span className="text-xs font-mono font-semibold text-[#9B8AFB] bg-[#9B8AFB]/10 px-3 py-1 rounded-full border border-[#9B8AFB]/20">
            Section {activeSectionIndex + 1} of {totalSections}
          </span>
        </div>

        <div>
          <div className="flex justify-between items-end text-xs text-[#9693A1] mb-1.5 font-mono">
            <span>Lesson progress</span>
            <span>{progressPercent}%</span>
          </div>
          <ProgressBar progress={progressPercent} className="h-1.5" />
        </div>
      </div>

      {/* SECTION CONTENT CARD */}
      <Card className="p-6 md:p-10 space-y-8">
        
        {/* 01 — LEARN */}
        {currentSection.type === 'learn' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              01 — Learn
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>
            
            <div className="space-y-4 text-[#C4C0CC] leading-relaxed text-base">
              {currentSection.content.map((par, i) => (
                <p key={i} className={par.startsWith('•') ? 'pl-4 text-[#9693A1] font-medium' : ''}>
                  {par}
                </p>
              ))}
            </div>

            {showVexel && activeSectionIndex === 0 && (
              <div className="bg-[#0B0B0F] border border-[#292934] p-4 rounded-xl flex items-center gap-4 mt-6">
                <MascotImage src="/assets/mascots/cyberguard-mascot-learning.png" className="w-12 h-12 shrink-0" />
                <p className="text-sm text-[#9693A1] italic">
                  "Let's slow this down. You don't need to memorize everything. Understand how the pieces connect."
                </p>
              </div>
            )}
          </div>
        )}

        {/* 02 — UNDERSTAND */}
        {currentSection.type === 'understand' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              02 — Understand
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>
            <p className="text-[#C4C0CC]">{currentSection.intro}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSection.items.map((item, idx) => (
                <div key={idx} className="bg-[#0B0B0F] border border-[#292934] p-5 rounded-xl space-y-2">
                  <h3 className="font-mono text-sm font-bold text-[#9B8AFB]">{item.term}</h3>
                  <p className="text-xs text-[#9693A1] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Visual Flow */}
            <div className="bg-[#0B0B0F] border border-[#292934] p-6 rounded-xl space-y-4">
              <h3 className="text-xs font-bold text-[#F2F0F5] uppercase tracking-wider flex items-center gap-2">
                <Target size={16} className="text-[#9B8AFB]" /> How the model connects:
              </h3>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                {currentSection.flow.map((step, i) => (
                  <React.Fragment key={i}>
                    <span className="px-3 py-1.5 bg-[#14141A] border border-[#292934] rounded-lg text-xs font-mono font-semibold text-[#F2F0F5]">
                      {step}
                    </span>
                    {i < currentSection.flow.length - 1 && <ArrowRight size={14} className="text-[#9693A1]" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Example Box */}
            <div className="bg-[#E6B566]/10 border border-[#E6B566]/20 p-6 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-[#E6B566] flex items-center gap-2">
                <Lightbulb size={16} /> {currentSection.example.title}
              </h3>
              <p className="text-sm text-[#C4C0CC] italic">"{currentSection.example.text}"</p>
              <div className="space-y-1.5 pt-2 border-t border-[#E6B566]/20 text-xs text-[#C4C0CC]">
                {currentSection.example.breakdown.map((b, i) => (
                  <p key={i}>• {b}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 03 — REAL SCENARIO */}
        {currentSection.type === 'scenario' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              03 — Real Scenario
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>
            
            <div className="bg-[#0B0B0F] border border-[#292934] p-6 rounded-xl text-sm text-[#C4C0CC] leading-relaxed italic border-l-4 border-l-[#9B8AFB]">
              "{currentSection.situation}"
            </div>

            {showVexel && (
              <div className="bg-[#0B0B0F] border border-[#292934] p-3 rounded-lg flex items-center gap-3">
                <MascotImage src="/assets/mascots/cyberguard-mascot-phishing.png" className="w-10 h-10 shrink-0" />
                <p className="text-xs text-[#9693A1] italic">
                  "Look at the situation again. Which part is actually the weakness?"
                </p>
              </div>
            )}

            <div className="space-y-6 pt-2">
              {currentSection.questions.map((q) => {
                const selectedOptId = scenarioAnswers[q.id];
                return (
                  <div key={q.id} className="bg-[#0B0B0F] border border-[#292934] p-5 rounded-xl space-y-4">
                    <p className="font-semibold text-[#F2F0F5] text-sm">{q.prompt}</p>
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        const isSelected = selectedOptId === opt.id;
                        let btnStyle = "border-[#292934] bg-[#14141A] hover:border-[#3A3A4A]";
                        if (isSelected) {
                          btnStyle = opt.isCorrect ? "border-[#6FCF97] bg-[#6FCF97]/10" : "border-[#E87575] bg-[#E87575]/10";
                        }
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setScenarioAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <span className="text-xs font-mono font-bold mt-0.5">{opt.isCorrect && isSelected ? '✓' : '•'}</span>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-[#F2F0F5]">{opt.text}</span>
                              {isSelected && (
                                <p className={`text-xs mt-2 leading-relaxed ${opt.isCorrect ? 'text-[#6FCF97]' : 'text-[#E87575]'}`}>
                                  {opt.feedback}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 04 — THINK ABOUT IT */}
        {currentSection.type === 'think' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              04 — Think About It
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>
            
            <div className="bg-[#0B0B0F] border border-[#292934] p-6 rounded-xl text-sm text-[#C4C0CC] whitespace-pre-wrap leading-relaxed border-l-4 border-l-[#E6B566]">
              {currentSection.situation}
            </div>

            <div className="space-y-3">
              {currentSection.choices.map((choice) => {
                const isSelected = thinkChoiceId === choice.id;
                let btnStyle = "border-[#292934] bg-[#0B0B0F] hover:border-[#3A3A4A]";
                if (isSelected) {
                  btnStyle = choice.isBest ? "border-[#6FCF97] bg-[#6FCF97]/10" : "border-[#E6B566] bg-[#E6B566]/10";
                }
                return (
                  <button
                    key={choice.id}
                    onClick={() => setThinkChoiceId(choice.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-[#F2F0F5]">{choice.text}</span>
                      {isSelected && (
                        <p className={`text-xs mt-2 leading-relaxed ${choice.isBest ? 'text-[#6FCF97]' : 'text-[#E6B566]'}`}>
                          {choice.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 05 — KNOWLEDGE CHECK */}
        {currentSection.type === 'quiz' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              05 — Knowledge Check
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>

            <div className="space-y-6">
              {currentSection.questions.map((q) => {
                const selectedOptId = quizAnswers[q.id];
                return (
                  <div key={q.id} className="bg-[#0B0B0F] border border-[#292934] p-5 rounded-xl space-y-4">
                    <p className="font-semibold text-[#F2F0F5] text-sm">{q.text}</p>
                    <div className="space-y-2">
                      {q.options.map(opt => {
                        const isSelected = selectedOptId === opt.id;
                        let btnStyle = "border-[#292934] bg-[#14141A] hover:border-[#3A3A4A]";
                        if (isSelected) {
                          btnStyle = opt.isCorrect ? "border-[#6FCF97] bg-[#6FCF97]/10" : "border-[#E87575] bg-[#E87575]/10";
                        }
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                            className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${btnStyle}`}
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-[#F2F0F5]">{opt.text}</span>
                              {isSelected && (
                                <p className={`text-xs mt-2 leading-relaxed ${opt.isCorrect ? 'text-[#6FCF97]' : 'text-[#E87575]'}`}>
                                  {opt.explanation}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 06 — WHAT TO REMEMBER */}
        {currentSection.type === 'summary' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9B8AFB] uppercase tracking-wider bg-[#9B8AFB]/10 px-3 py-1 rounded">
              06 — What to Remember
            </div>
            <h2 className="text-3xl font-bold text-[#F2F0F5]">{currentSection.title}</h2>

            <ul className="space-y-3 bg-[#0B0B0F] border border-[#292934] p-6 rounded-xl">
              {currentSection.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#C4C0CC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9B8AFB] mt-2 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>

            {showVexel && (
              <div className="bg-[#14141A] border border-[#292934] p-5 rounded-xl flex items-center gap-4">
                <MascotImage src="/assets/mascots/cyberguard-mascot-main.png" className="w-12 h-12 shrink-0" />
                <p className="text-sm text-[#C4C0CC] italic">
                  "Nice. You didn't just memorize the definitions. You used them."
                </p>
              </div>
            )}
          </div>
        )}

        {/* NAVIGATION CONTROLS */}
        <div className="pt-8 border-t border-[#292934] flex items-center justify-between">
          <button
            onClick={handlePrevSection}
            disabled={activeSectionIndex === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0B0B0F] border border-[#292934] text-[#9693A1] hover:text-[#F2F0F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleNextSection}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] font-bold transition-all text-sm"
          >
            {activeSectionIndex === totalSections - 1 ? 'Complete Lesson' : 'Next'} <ArrowRight size={16} />
          </button>
        </div>

      </Card>
    </div>
  );
}