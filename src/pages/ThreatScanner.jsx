import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Info, 
  ArrowRight,
  Shield,
  RefreshCw,
  Zap
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
   HEURISTIC LOGIC (Local Analysis)
========================================================= */

const analyzeUrl = (url) => {
  const indicators = [];
  const lowerUrl = url.toLowerCase().trim();
  
  if (!lowerUrl) return null;

  if (lowerUrl.startsWith('http://')) {
    indicators.push({
      title: 'Unencrypted Connection',
      desc: 'Uses HTTP instead of HTTPS. Data sent over this connection is not secure.',
      severity: 'medium'
    });
  }

  if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(lowerUrl)) {
    indicators.push({
      title: 'IP Address Format',
      desc: 'Uses a direct IP address instead of a domain name. Often used to hide the true host.',
      severity: 'high'
    });
  }

  if (lowerUrl.length > 75) {
    indicators.push({
      title: 'Excessive Length',
      desc: 'The URL is unusually long. Attackers sometimes use long URLs to hide the true destination off-screen.',
      severity: 'low'
    });
  }

  if (lowerUrl.includes('@')) {
    indicators.push({
      title: 'Contains @ Symbol',
      desc: 'Browsers ignore everything before the "@" symbol. Attackers use this to spoof trusted domains.',
      severity: 'high'
    });
  }

  if (lowerUrl.includes('xn--')) {
    indicators.push({
      title: 'Punycode/IDN Domain',
      desc: 'Uses internationalized characters. This is often used in homograph attacks to look like a trusted site.',
      severity: 'high'
    });
  }

  const keywords = ['login', 'verify', 'account', 'secure', 'update', 'password', 'bank', 'payment', 'confirm'];
  const foundKeywords = keywords.filter(kw => lowerUrl.includes(kw));
  if (foundKeywords.length > 0) {
    indicators.push({
      title: 'Suspicious Keywords',
      desc: `Contains sensitive keywords (${foundKeywords.join(', ')}). Phishing sites use these to appear legitimate.`,
      severity: 'medium'
    });
  }

  let score = indicators.length;
  let level = 'Low';
  let color = 'text-[#6FCF97]'; 
  let bg = 'bg-[#6FCF97]';

  if (score >= 3 || indicators.some(i => i.severity === 'high')) {
    level = 'High';
    color = 'text-[#E87575]'; 
    bg = 'bg-[#E87575]';
  } else if (score >= 1) {
    level = 'Medium';
    color = 'text-[#E6B566]'; 
    bg = 'bg-[#E6B566]';
  }

  return { indicators, level, color, bg, score };
};

const analyzeMessage = (text) => {
  const indicators = [];
  const lowerText = text.toLowerCase().trim();
  
  if (!lowerText) return null;

  let score = 0;
  let hasUrgency = false;
  let hasCredentialReq = false;
  let hasOtpReq = false;
  let hasFinancialReq = false;
  let hasAccountThreat = false;
  let hasSuspiciousUrl = false;
  let hasPackageLure = false;

  // 1. URL PRESENCE
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const urls = lowerText.match(urlRegex) || [];
  
  if (urls.length > 0) {
    indicators.push({
      title: 'Contains a Link',
      desc: 'Contains a link. Links are common in legitimate messages, so this alone does not indicate phishing.',
      severity: 'info'
    });

    const suspicious = urls.some(url => {
      return /\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(url) || 
             url.includes('@') || 
             url.includes('xn--') || 
             url.length > 100 ||
             /\b(bit\.ly|tinyurl\.com|t\.co|ow\.ly|is\.gd|buff\.ly)\b/i.test(url) || // Shorteners
             (url.startsWith('http://') && !url.includes('localhost')); // HTTP instead of HTTPS
    });

    if (suspicious) {
      hasSuspiciousUrl = true;
      score += 20; 
      indicators.push({
        title: 'Suspicious URL Characteristic',
        desc: 'The URL contains characteristics commonly associated with deceptive links (e.g., URL shorteners, unencrypted HTTP, or direct IPs).',
        severity: 'medium'
      });
    }
  }

  // 2. MODERATE SIGNALS
  if (/\b(urgent|immediately|act now|within (24|48|72) hours|final warning|last chance|action required|without delay|quickly|asap|as soon as possible)\b/.test(lowerText)) {
    hasUrgency = true;
    score += 15;
    indicators.push({
      title: 'Urgency Detected',
      desc: 'The message pressures you to act quickly, which can reduce the chance of verifying the request.',
      severity: 'medium'
    });
  }

  if (/\b(account will be suspended|account will be locked|account will be deleted|unauthorized activity|unusual activity|suspicious activity|verify your account immediately|account needs attention|suspend your account|close your account|temporarily restricted|access restricted|account on hold|locked out)\b/.test(lowerText)) {
    hasAccountThreat = true;
    score += 20;
    indicators.push({
      title: 'Account Threat',
      desc: 'Threatens the status of your account or claims unusual activity to cause panic and force a reaction.',
      severity: 'medium'
    });
  }

  if (/\b(package delivery|deliver a package|shipment|failed delivery|undelivered package|track your package|delivery attempt|missed delivery|delivery location|schedule a new delivery|post office)\b/.test(lowerText)) {
    hasPackageLure = true;
    score += 20;
    indicators.push({
      title: 'Delivery / Shipping Lure',
      desc: 'Uses common delivery/shipping language often used by scammers to trick victims into clicking fake tracking links.',
      severity: 'medium'
    });
  }

  if (/\b(open this attachment|download this file|enable macros|run this file|execute this attachment)\b/.test(lowerText)) {
    score += 20;
    indicators.push({
      title: 'Suspicious Attachment Language',
      desc: 'Instructs you to open or execute a file, which is a common method for malware delivery.',
      severity: 'medium'
    });
  }

  // 3. STRONG SIGNALS (Forces HIGH risk immediately)
  if (/\b(enter your password|provide your password|verify your password|confirm your password|confirm your login|verify your credentials|username and password|sign in to continue|update your password|login credentials|verify your identity|confirm your identity|validate your account|restore complete access|restore access)\b/.test(lowerText)) {
    hasCredentialReq = true;
    score += 45; 
    indicators.push({
      title: 'Identity / Credential Request',
      desc: 'The message asks for sensitive login information or identity verification. Legitimate organizations rarely ask you to verify identity via unsolicited links.',
      severity: 'high'
    });
  }

  if (/\b(send me the otp|share the verification code|provide the security code|tell me the code|enter the otp|otp security code|enter the security code|verification code|one time password|tell me the otp|what is the otp)\b/.test(lowerText)) {
    hasOtpReq = true;
    score += 45;
    indicators.push({
      title: 'Security Code Request',
      desc: 'Attackers need your OTP to bypass Two-Factor Authentication. Never share or forward these codes.',
      severity: 'high'
    });
  }

  if (/\b(send money|make a payment|verify your card|update payment information|update your card|bank account|credit card|debit card|transfer funds|payment failed|routing number|bank-alert|transaction id)\b/.test(lowerText)) {
    hasFinancialReq = true;
    score += 45;
    indicators.push({
      title: 'Financial Request',
      desc: 'The message asks for payment or mentions sensitive financial details unexpectedly.',
      severity: 'high'
    });
  }

  // 4. WEAK SIGNALS
  if (/\b(dear customer|dear user|valued member)\b/.test(lowerText)) {
    score += 2;
    indicators.push({
      title: 'Generic Greeting',
      desc: 'Phishing campaigns are often sent in bulk and lack your actual name.',
      severity: 'low'
    });
  }

  // 5. COMBINATION BONUSES (Contextual Multipliers)
  const comboMessages = [];
  const hasSensitiveReq = hasCredentialReq || hasOtpReq || hasFinancialReq;

  if (hasUrgency && hasSensitiveReq) {
    score += 20;
    comboMessages.push('urgency with a request for sensitive information');
  }

  if (hasUrgency && hasSuspiciousUrl) {
    score += 15;
    comboMessages.push('urgency with a suspicious destination');
  }

  if (hasSensitiveReq && hasSuspiciousUrl) {
    score += 20;
    comboMessages.push('a request for sensitive information via a suspicious link');
  }

  if (hasAccountThreat && hasCredentialReq) {
    score += 20;
    comboMessages.push('an account threat combined with a credential/identity request');
  }

  if (hasPackageLure && hasUrgency) {
    score += 20;
    comboMessages.push('a delivery notification with unexpected urgency');
  }
  
  if (hasPackageLure && hasSuspiciousUrl) {
    score += 15;
    comboMessages.push('a delivery notification containing a suspicious link');
  }

  if (comboMessages.length > 0) {
    const comboString = comboMessages.length === 1 
      ? comboMessages[0] 
      : comboMessages.slice(0, -1).join(', ') + ', and ' + comboMessages[comboMessages.length - 1];

    indicators.push({
      title: 'High-Risk Context Detected',
      desc: `This message combines ${comboString}, which substantially increases the risk.`,
      severity: 'high'
    });
  }

  // 6. RISK LEVELS & SUMMARY TEXT
  let level = 'Low';
  let color = 'text-[#6FCF97]'; 
  let bg = 'bg-[#6FCF97]';
  let summary = "No strong phishing indicators were detected. Remember that this does not guarantee the message is safe.";

  if (score >= 70) {
    level = 'High';
    color = 'text-[#E87575]'; 
    bg = 'bg-[#E87575]';
    summary = "Multiple high-risk indicators appear together: urgency, sensitive-information requests, and a suspicious destination or action. Treat this message as potentially malicious.";
  } else if (score >= 45) {
    level = 'High';
    color = 'text-[#E87575]'; 
    bg = 'bg-[#E87575]';
    summary = "This message contains multiple phishing indicators, including a request for sensitive information and pressure to act. Do not provide credentials, OTPs, or payment information until you independently verify the request.";
  } else if (score >= 20) {
    level = 'Medium';
    color = 'text-[#E6B566]'; 
    bg = 'bg-[#E6B566]';
    summary = "This message contains some suspicious characteristics. Verify the sender and request independently before taking action.";
  }

  return { indicators, level, color, bg, score, summary };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ThreatScanner() {
  // URL State
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState(null);

  // Message State
  const [messageInput, setMessageInput] = useState('');
  const [messageResult, setMessageResult] = useState(null);

  const handleUrlAnalyze = () => {
    setUrlResult(analyzeUrl(urlInput));
  };

  const handleMessageAnalyze = () => {
    setMessageResult(analyzeMessage(messageInput));
  };

  const loadExampleUrl = () => {
    setUrlInput('http://192.168.1.50/login.php?secure_update=true&user=@verify');
    setUrlResult(null);
  };

  const loadExampleMessage = () => {
    setMessageInput('URGENT! Your bank account will be suspended today. Click here and enter your password and OTP.');
    setMessageResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2">Threat Scanner</h1>
          <p className="text-[#9693A1] text-base max-w-xl">
            Analyze URLs and messages for common phishing and cybersecurity warning indicators using local heuristics.
          </p>
        </div>
        <MascotImage 
          src="/assets/mascots/cyberguard-mascot-phishing.png" 
          alt="Threat Scanner Mascot" 
          className="w-24 h-24 hidden md:block" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* =========================================================
            URL SAFETY CHECKER
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
                <Globe size={20} />
              </div>
              <h2 className="text-xl font-bold">URL Safety Checker</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">Web Address</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#9B8AFB] transition-colors font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUrlAnalyze}
                disabled={!urlInput.trim()}
                className="flex-1 bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Search size={18} /> Analyze URL
              </button>
              <button
                onClick={loadExampleUrl}
                className="px-4 py-2 bg-[#1A1A22] text-[#9B8AFB] border border-[#292934] hover:bg-[#292934] rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                title="Load Example"
              >
                <Zap size={16} /> Example
              </button>
            </div>
          </div>

          {urlResult && (
            <div className="border-t border-[#292934] pt-6 animate-in slide-in-from-top-2 space-y-6">
              
              <div className="flex items-center justify-between bg-[#0B0B0F] p-4 rounded-xl border border-[#292934]">
                <div>
                  <p className="text-sm text-[#9693A1] mb-1">Risk Level</p>
                  <div className={`text-xl font-bold flex items-center gap-2 ${urlResult.color}`}>
                    {urlResult.level === 'Low' && <CheckCircle size={20} />}
                    {urlResult.level === 'Medium' && <AlertTriangle size={20} />}
                    {urlResult.level === 'High' && <ShieldAlert size={20} />}
                    {urlResult.level} Risk
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#9693A1] mb-1">Indicators Found</p>
                  <p className="text-xl font-bold font-mono">{urlResult.score}</p>
                </div>
              </div>

              {urlResult.indicators.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#F2F0F5]">Detected Characteristics:</h3>
                  {urlResult.indicators.map((ind, idx) => (
                    <div key={idx} className="bg-[#1A1A22] p-3 rounded-lg border border-[#292934]">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className={ind.severity === 'high' ? 'text-[#E87575]' : ind.severity === 'medium' ? 'text-[#E6B566]' : 'text-[#C4B5FD]'} />
                        <h4 className="text-sm font-semibold text-[#F2F0F5]">{ind.title}</h4>
                      </div>
                      <p className="text-xs text-[#9693A1] ml-6">{ind.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#6FCF97]/10 border border-[#6FCF97]/20 p-4 rounded-lg">
                  <p className="text-sm text-[#6FCF97] flex items-start gap-2">
                    <CheckCircle size={18} className="shrink-0 mt-0.5" />
                    No obvious structural threats detected locally. However, malicious sites can easily use clean-looking URLs. Always verify the source!
                  </p>
                </div>
              )}

              <button
                onClick={() => { setUrlInput(''); setUrlResult(null); }}
                className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} /> Clear Results
              </button>
            </div>
          )}
          
          <div className="mt-auto pt-6 text-xs text-[#9693A1] flex gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            <p>
              This scanner uses local heuristic checks. It does not verify the URL against live threat databases.<br/>
              <span className="font-medium mt-1 block">Risk scores are indicators, not proof. Always verify suspicious requests independently.</span>
            </p>
          </div>
        </Card>

        {/* =========================================================
            PHISHING MESSAGE ANALYZER
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#C4B5FD]">
                <Mail size={20} />
              </div>
              <h2 className="text-xl font-bold">Phishing Analyzer</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">Message Content</label>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Paste email, SMS, or DM content here..."
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#C4B5FD] transition-colors resize-none h-28 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleMessageAnalyze}
                disabled={!messageInput.trim()}
                className="flex-1 bg-[#C4B5FD] text-[#0B0B0F] hover:bg-[#AA9BFF] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Search size={18} /> Analyze Message
              </button>
              <button
                onClick={loadExampleMessage}
                className="px-4 py-2 bg-[#1A1A22] text-[#C4B5FD] border border-[#292934] hover:bg-[#292934] rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                title="Load Example"
              >
                <Zap size={16} /> Example
              </button>
            </div>
          </div>

          {messageResult && (
            <div className="border-t border-[#292934] pt-6 animate-in slide-in-from-top-2 space-y-6">
              
              <div className="flex items-center justify-between bg-[#0B0B0F] p-4 rounded-xl border border-[#292934]">
                <div>
                  <p className="text-sm text-[#9693A1] mb-1">Risk Level</p>
                  <div className={`text-xl font-bold flex items-center gap-2 ${messageResult.color}`}>
                    {messageResult.level === 'Low' && <CheckCircle size={20} />}
                    {messageResult.level === 'Medium' && <AlertTriangle size={20} />}
                    {messageResult.level === 'High' && <ShieldAlert size={20} />}
                    {messageResult.level} Risk
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#9693A1] mb-1">Total Score</p>
                  <p className="text-xl font-bold font-mono">{messageResult.score}</p>
                </div>
              </div>

              {/* EDUCATIONAL SUMMARY BANNER */}
              <div className={`p-4 rounded-lg border ${
                messageResult.level === 'High' 
                  ? 'bg-[#E87575]/10 border-[#E87575]/20' 
                  : messageResult.level === 'Medium'
                  ? 'bg-[#E6B566]/10 border-[#E6B566]/20'
                  : 'bg-[#6FCF97]/10 border-[#6FCF97]/20'
              }`}>
                <p className={`text-sm flex items-start gap-2 ${
                  messageResult.level === 'High' ? 'text-[#E87575]' : 
                  messageResult.level === 'Medium' ? 'text-[#E6B566]' : 'text-[#6FCF97]'
                }`}>
                  {messageResult.level === 'Low' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                  {messageResult.summary}
                </p>
              </div>

              {messageResult.indicators.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#F2F0F5]">Detected Characteristics:</h3>
                  {messageResult.indicators.map((ind, idx) => (
                    <div key={idx} className="bg-[#1A1A22] p-3 rounded-lg border border-[#292934]">
                      <div className="flex items-center gap-2 mb-1">
                        {ind.severity === 'info' ? (
                          <Info size={14} className="text-[#9B8AFB]" />
                        ) : ind.severity === 'low' ? (
                          <Info size={14} className="text-[#9693A1]" />
                        ) : (
                          <AlertTriangle size={14} className={
                            ind.severity === 'high' ? 'text-[#E87575]' : 
                            ind.severity === 'medium' ? 'text-[#E6B566]' : 
                            'text-[#C4B5FD]'
                          } />
                        )}
                        <h4 className="text-sm font-semibold text-[#F2F0F5]">{ind.title}</h4>
                      </div>
                      <p className="text-xs text-[#9693A1] ml-6">{ind.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setMessageInput(''); setMessageResult(null); }}
                className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} /> Clear Results
              </button>
            </div>
          )}
          
          <div className="mt-auto pt-6 text-xs text-[#9693A1] flex gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            <p>
              This scanner uses local heuristic checks. It does not verify a message against live threat databases.<br/>
              <span className="font-medium mt-1 block">Risk scores are indicators, not proof. Always verify suspicious requests independently.</span>
            </p>
          </div>
        </Card>
      </div>

      {/* =========================================================
          EDUCATIONAL SECTION
      ========================================================= */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-[#F2F0F5] mb-4">How Phishing Works</h3>
        
        {/* Flow Diagram */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#0B0B0F] p-6 rounded-xl border border-[#292934] mb-6 gap-4 text-center md:text-left">
          
          <div className="flex flex-col items-center max-w-[120px]">
            <div className="w-12 h-12 rounded-full bg-[#1A1A22] text-[#9B8AFB] flex items-center justify-center mb-2">
              <Mail size={20} />
            </div>
            <span className="text-sm font-medium">Message Sent</span>
          </div>

          <ArrowRight className="hidden md:block text-[#292934]" size={24} />
          
          <div className="flex flex-col items-center max-w-[120px]">
            <div className="w-12 h-12 rounded-full bg-[#1A1A22] text-[#E6B566] flex items-center justify-center mb-2">
              <ShieldAlert size={20} />
            </div>
            <span className="text-sm font-medium text-center">Social Engineering</span>
          </div>

          <ArrowRight className="hidden md:block text-[#292934]" size={24} />

          <div className="flex flex-col items-center max-w-[120px]">
            <div className="w-12 h-12 rounded-full bg-[#1A1A22] text-[#C4B5FD] flex items-center justify-center mb-2">
              <Globe size={20} />
            </div>
            <span className="text-sm font-medium text-center">Victim Acts</span>
          </div>

          <ArrowRight className="hidden md:block text-[#292934]" size={24} />

          <div className="flex flex-col items-center max-w-[120px]">
            <div className="w-12 h-12 rounded-full bg-[#E87575]/20 text-[#E87575] flex items-center justify-center mb-2">
              <AlertTriangle size={20} />
            </div>
            <span className="text-sm font-medium text-[#E87575]">Data Exposed</span>
          </div>

        </div>

        {/* Description Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[#F2F0F5] mb-2 flex items-center gap-2">
              <Shield size={16} className="text-[#9B8AFB]" /> What is Social Engineering?
            </h4>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              Phishing relies on human psychology, not just technical hacking. Attackers create fake scenarios to induce panic, greed, or curiosity, pushing the victim to bypass their own logical security checks and hand over sensitive information willingly.
            </p>
          </div>
          <div className="bg-[#1A1A22] p-4 rounded-lg border border-[#292934]">
            <h4 className="text-sm font-bold text-[#F2F0F5] mb-2">Remember:</h4>
            <ul className="text-sm text-[#9693A1] space-y-2 list-disc pl-4">
              <li>A suspicious message can look highly professional.</li>
              <li>A secure-looking website (with a padlock) can still be malicious.</li>
              <li>Never use the links provided in a warning email. Always navigate to the service independently.</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  );
}