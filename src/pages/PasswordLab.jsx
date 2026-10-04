import React, { useState, useEffect, useCallback } from 'react';
import { 
  KeyRound, ScanSearch, Sparkles, 
  Eye, EyeOff, Copy, RefreshCw, Check, X, ShieldAlert, SlidersHorizontal
} from 'lucide-react';

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#14141A] border border-[#292934] rounded-xl p-5 text-[#F2F0F5] shadow-sm ${       onClick ? 'cursor-pointer hover:bg-[#1A1A22] transition-colors duration-200' : ''     } ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ progress, colorClass = 'bg-[#9B8AFB]', className = '' }) => (
  <div className={`w-full bg-[#0B0B0F] rounded-full h-2 overflow-hidden border border-[#292934] ${className}`}>
    <div 
      className={`${colorClass} h-full rounded-full transition-all duration-700 ease-out`} 
      style={{ width: `${progress}%` }}
    />
  </div>
);

const MascotImage = ({ src, alt, className = '', fallbackSize = 32 }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-[#1A1A22] border border-[#292934] rounded-2xl overflow-hidden shadow-inner ${className}`}>
        <div className="flex flex-col items-center justify-center opacity-60 text-[#9B8AFB]">
          <KeyRound size={fallbackSize} className="mb-2" />
          <span className="text-[10px] font-medium px-2 text-center text-[#9693A1]">Mascot Asset</span>
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

export default function PasswordLab() {
  // Checker State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Generator State
  const [genLength, setGenLength] = useState(16);
  const [incUpper, setIncUpper] = useState(true);
  const [incLower, setIncLower] = useState(true);
  const [incNum, setIncNum] = useState(true);
  const [incSym, setIncSym] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showGenerated, setShowGenerated] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Checker Logic
  const checkStrength = (pw) => {
    if (!pw) return { score: 0, label: 'None', color: 'bg-[#292934]', text: 'text-[#9693A1]', criteria: {}, suggestion: 'Enter a password to begin.' };

    const criteria = {
      length: pw.length >= 12,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };

    let score = 0;
    if (criteria.length) score += 20;
    if (criteria.upper) score += 20;
    if (criteria.lower) score += 20;
    if (criteria.number) score += 20;
    if (criteria.special) score += 20;

    if (pw.length < 8 && score > 40) score = 40;

    let label = 'Very Weak';
    let color = 'bg-[#E87575]';
    let text = 'text-[#E87575]';
    let suggestion = 'Add more characters and mix types.';

    if (score === 100) {
      label = 'Very Strong'; color = 'bg-[#6FCF97]'; text = 'text-[#6FCF97]'; suggestion = 'Excellent password! 🔐';
    } else if (score >= 80) {
      label = 'Strong'; color = 'bg-[#6FCF97]'; text = 'text-[#6FCF97]'; suggestion = 'Looks good! Consider making it a bit longer for maximum security.';
    } else if (score >= 60) {
      label = 'Moderate'; color = 'bg-[#E6B566]'; text = 'text-[#E6B566]'; suggestion = 'Not bad, but try adding missing character types.';
    } else if (score >= 40) {
      label = 'Weak'; color = 'bg-[#E87575]'; text = 'text-[#E87575]'; suggestion = 'This is quite easily guessable. Increase length and variety.';
    }

    if (!criteria.length && score < 100) suggestion = 'Make your password at least 12 characters long.';
    else if (!criteria.special && score < 100) suggestion = 'Add a symbol (e.g., ! @ # $ %).';
    else if (!criteria.number && score < 100) suggestion = 'Include at least one number.';

    return { score, label, color, text, criteria, suggestion };
  };

  const strength = checkStrength(password);

  // Generator Logic
  const generatePassword = useCallback(() => {
    let charset = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const sym = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    if (incUpper) charset += upper;
    if (incLower) charset += lower;
    if (incNum) charset += num;
    if (incSym) charset += sym;

    if (!charset) {
      setGeneratedPassword('');
      return;
    }

    let newPw = '';
    const mandatoryChars = [];
    if (incUpper) mandatoryChars.push(upper[Math.floor(Math.random() * upper.length)]);
    if (incLower) mandatoryChars.push(lower[Math.floor(Math.random() * lower.length)]);
    if (incNum) mandatoryChars.push(num[Math.floor(Math.random() * num.length)]);
    if (incSym) mandatoryChars.push(sym[Math.floor(Math.random() * sym.length)]);

    for (let i = mandatoryChars.length; i < genLength; i++) {
      newPw += charset[Math.floor(Math.random() * charset.length)];
    }

    const finalPw = mandatoryChars.concat(newPw.split('')).sort(() => 0.5 - Math.random()).join('');
    setGeneratedPassword(finalPw);
    setCopySuccess(false);
  }, [genLength, incUpper, incLower, incNum, incSym]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const hasNoOptions = !incUpper && !incLower && !incNum && !incSym;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8 shadow-sm">
        <MascotImage 
          src="/assets/mascots/cyberguard-mascot-password.png" 
          alt="Password Lab Mascot" 
          className="w-24 h-24 shrink-0 drop-shadow-md"
          fallbackSize={48}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2 tracking-tight flex items-center gap-3">
            <KeyRound className="text-[#9B8AFB]" size={28} /> Password Lab
          </h1>
          <p className="text-[#9693A1] text-base max-w-2xl">
            Check the resilience of your current passwords against modern cracking techniques, or generate mathematically secure alternatives on the fly.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Checker Card */}
        <Card className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 text-[#F2F0F5] flex items-center gap-2">
            <ScanSearch size={20} className="text-[#C4B5FD]" /> Check Your Password
          </h2>
          
          <div className="relative mb-6">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to test..."
              className="w-full bg-[#0B0B0F] border border-[#292934] focus:border-[#9B8AFB] outline-none rounded-xl py-3 pl-4 pr-12 text-[#F2F0F5] font-mono text-lg transition-colors placeholder:font-sans placeholder:text-[#9693A1]/50"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9693A1] hover:text-[#F2F0F5] transition-colors p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-[#9693A1]">Strength Score</span>
              <span className={`text-lg font-bold font-mono ${strength.text}`}>{password ? `${strength.score}/100` : '-'}</span>
            </div>
            <ProgressBar progress={strength.score} colorClass={strength.color} />
            <div className={`text-sm font-semibold mt-2 text-right ${strength.text}`}>
              {password ? strength.label : ''}
            </div>
          </div>

          <div className="space-y-3 mb-6 bg-[#0B0B0F] p-4 rounded-xl border border-[#292934] flex-1">
            <h3 className="text-sm font-semibold text-[#F2F0F5] mb-3">Password Criteria</h3>
            {[
              { label: 'At least 12 characters', met: strength.criteria.length },
              { label: 'Uppercase letter', met: strength.criteria.upper },
              { label: 'Lowercase letter', met: strength.criteria.lower },
              { label: 'Number', met: strength.criteria.number },
              { label: 'Special character', met: strength.criteria.special },
            ].map((crit, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {crit.met 
                  ? <div className="bg-[#6FCF97]/10 text-[#6FCF97] rounded-full p-1"><Check size={14} /></div>
                  : <div className="bg-[#E87575]/10 text-[#E87575] rounded-full p-1"><X size={14} /></div>
                }
                <span className={`text-sm ${crit.met ? 'text-[#F2F0F5]' : 'text-[#9693A1]'}`}>{crit.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            {password && (
              <div className="mb-4 text-sm text-[#E6B566] bg-[#E6B566]/10 p-3 rounded-lg border border-[#E6B566]/20 flex gap-2 items-start">
                <Sparkles size={16} className="shrink-0 mt-0.5" />
                <p>{strength.suggestion}</p>
              </div>
            )}
            
            <p className="text-xs text-[#9693A1] flex items-start gap-2 pt-2 border-t border-[#292934]">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              This is an educational password-strength check, not a guarantee against all forms of password cracking.
            </p>
          </div>
        </Card>

        {/* Generator Card */}
        <Card className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 text-[#F2F0F5] flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-[#C4B5FD]" /> Generate a Strong Password
          </h2>

          <div className="relative mb-6">
            <div className="w-full bg-[#0B0B0F] border border-[#292934] rounded-xl py-4 pl-4 pr-14 flex items-center min-h-[60px]">
              <span className={`font-mono text-lg break-all select-all ${hasNoOptions ? 'text-[#E87575]' : 'text-[#F2F0F5]'}`}>
                {hasNoOptions ? 'Select at least one option' : (showGenerated ? generatedPassword : '•'.repeat(Math.min(generatedPassword.length, 32)))}
              </span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button 
                onClick={() => setShowGenerated(!showGenerated)}
                disabled={hasNoOptions}
                className="text-[#9693A1] hover:text-[#F2F0F5] transition-colors p-2 disabled:opacity-50"
              >
                {showGenerated ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={handleCopy}
              disabled={hasNoOptions || !generatedPassword}
              className="flex items-center justify-center gap-2 bg-[#1A1A22] border border-[#292934] hover:bg-[#292934] text-[#F2F0F5] py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {copySuccess ? <Check size={16} className="text-[#6FCF97]" /> : <Copy size={16} />}
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={generatePassword}
              disabled={hasNoOptions}
              className="flex items-center justify-center gap-2 bg-[#9B8AFB]/10 border border-[#9B8AFB]/20 hover:bg-[#9B8AFB]/20 text-[#9B8AFB] py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} /> Regenerate
            </button>
          </div>

          <div className="space-y-6 flex-1 bg-[#0B0B0F] p-5 rounded-xl border border-[#292934]">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#F2F0F5]">Password Length</label>
                <span className="text-lg font-mono text-[#9B8AFB]">{genLength}</span>
              </div>
              <input 
                type="range" 
                min="8" 
                max="64" 
                value={genLength} 
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full accent-[#9B8AFB] h-2 bg-[#1A1A22] rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-[#292934]">
              <label className="text-sm font-medium text-[#F2F0F5] block">Characters to include:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'upper', label: 'Uppercase (A-Z)', state: incUpper, setter: setIncUpper },
                  { id: 'lower', label: 'Lowercase (a-z)', state: incLower, setter: setIncLower },
                  { id: 'num', label: 'Numbers (0-9)', state: incNum, setter: setIncNum },
                  { id: 'sym', label: 'Symbols (!@#$)', state: incSym, setter: setIncSym },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={opt.state} 
                        onChange={(e) => opt.setter(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded border border-[#292934] bg-[#14141A] peer-checked:bg-[#9B8AFB] peer-checked:border-[#9B8AFB] transition-colors"></div>
                      <Check size={14} className="absolute text-[#0B0B0F] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm text-[#9693A1] group-hover:text-[#F2F0F5] transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
}