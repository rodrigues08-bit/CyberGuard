import React, { useState } from 'react';
import { 
  Hash, 
  Copy, 
  Check, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Shield,
  FileDigit,
  RefreshCw,
  Info,
  Scale
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
   MAIN CRYPTO LAB COMPONENT
========================================================= */

export default function CryptoLab() {
  // --- CAESAR CIPHER STATE ---
  const [plaintext, setPlaintext] = useState('');
  const [shift, setShift] = useState(3);
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [copiedCipher, setCopiedCipher] = useState(false);
  
  // --- SHA-256 HASH STATE ---
  const [hashInputA, setHashInputA] = useState('');
  const [hashOutputA, setHashOutputA] = useState('');
  const [copiedHashA, setCopiedHashA] = useState(false);
  
  const [showAvalanche, setShowAvalanche] = useState(false);
  const [hashInputB, setHashInputB] = useState('');
  const [hashOutputB, setHashOutputB] = useState('');
  const [copiedHashB, setCopiedHashB] = useState(false);

  /* =========================================================
     CAESAR CIPHER LOGIC
  ========================================================= */
  
  const handleShiftChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    setShift(val);
  };

  const applyCaesar = (text, shiftAmount) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpper = code >= 65 && code <= 90;
        const base = isUpper ? 65 : 97;
        // Normalize shift to always be positive and within 0-25
        const normalizedShift = ((shiftAmount % 26) + 26) % 26;
        return String.fromCharCode(((code - base + normalizedShift) % 26) + base);
      }
      return char;
    }).join('');
  };

  const handleEncrypt = () => {
    if (!plaintext.trim()) return;
    setCiphertext(applyCaesar(plaintext, shift));
    setDecryptedText('');
  };

  const handleDecrypt = () => {
    if (!ciphertext) return;
    setDecryptedText(applyCaesar(ciphertext, -shift));
  };

  const handleClearCaesar = () => {
    setPlaintext('');
    setShift(3);
    setCiphertext('');
    setDecryptedText('');
  };

  /* =========================================================
     SHA-256 HASH LOGIC
  ========================================================= */

  const generateSHA256 = async (message) => {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.error("Hashing failed", err);
      return "Error generating hash";
    }
  };

  const handleHashA = async () => {
    if (!hashInputA.trim()) return;
    const hash = await generateSHA256(hashInputA);
    setHashOutputA(hash);
  };

  const handleHashB = async () => {
    if (!hashInputB.trim()) return;
    const hash = await generateSHA256(hashInputB);
    setHashOutputB(hash);
  };

  const handleClearHash = () => {
    setHashInputA('');
    setHashOutputA('');
    setHashInputB('');
    setHashOutputB('');
    setShowAvalanche(false);
  };

  const copyToClipboard = async (text, setCopiedState) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Calculate difference for Avalanche effect
  const calculateDifference = () => {
    if (!hashOutputA || !hashOutputB || hashOutputA === "Error generating hash" || hashOutputA.length !== 64) return null;
    let diffCount = 0;
    for (let i = 0; i < 64; i++) {
      if (hashOutputA[i] !== hashOutputB[i]) {
        diffCount++;
      }
    }
    const percent = Math.round((diffCount / 64) * 100);
    return { diffCount, percent };
  };

  const diffStats = calculateDifference();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#F2F0F5] mb-2">Crypto Lab</h1>
          <p className="text-[#9693A1] text-base max-w-xl">
            Explore encryption and hashing through interactive, browser-based cryptography simulations.
          </p>
        </div>
        <MascotImage 
          src="/assets/mascots/cyberguard-mascot-main.png" 
          alt="Crypto Mascot" 
          className="w-24 h-24 hidden md:block" 
        />
      </div>

      {/* TOOLS GRID - items-start prevents equal-height stretching */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* =========================================================
            CAESAR CIPHER TOOL
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
              <Lock size={20} />
            </div>
            <h2 className="text-xl font-bold">Caesar Cipher</h2>
          </div>

          {/* Educational Banner */}
          <div className="bg-[#1A1A22] border border-[#292934] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#C4B5FD] mb-2 flex items-center gap-2">
              <Shield size={16} /> How it works
            </h3>
            <p className="text-xs text-[#9693A1] mb-3">
              The Caesar Cipher replaces each letter with another letter a fixed number of positions (the shift) away in the alphabet.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#F2F0F5] bg-[#0B0B0F] p-3 rounded border border-[#292934]">
              <span>Plaintext</span>
              <ArrowRight size={14} className="text-[#9B8AFB]" />
              <span className="text-[#9B8AFB]">Shift (+N)</span>
              <ArrowRight size={14} className="text-[#9B8AFB]" />
              <span>Ciphertext</span>
            </div>
          </div>

          {/* Plaintext Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">Plaintext</label>
              <textarea
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter text to encrypt..."
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#9B8AFB] transition-colors resize-none h-24"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-[#9693A1] mb-1">Shift Value</label>
                <input
                  type="number"
                  value={shift}
                  onChange={handleShiftChange}
                  className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-2.5 text-[#F2F0F5] focus:outline-none focus:border-[#9B8AFB] transition-colors"
                />
              </div>
              <div className="w-2/3 flex items-end">
                <button
                  onClick={handleEncrypt}
                  disabled={!plaintext.trim()}
                  className="w-full bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Lock size={18} /> Encrypt
                </button>
              </div>
            </div>
          </div>

          {/* Ciphertext Output */}
          <div className="space-y-4 border-t border-[#292934] pt-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#9693A1]">Ciphertext</label>
                {ciphertext && (
                  <button 
                    onClick={() => copyToClipboard(ciphertext, setCopiedCipher)}
                    className="text-[#9B8AFB] hover:text-[#C4B5FD] text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedCipher ? <Check size={14} /> : <Copy size={14} />} 
                    {copiedCipher ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={ciphertext}
                placeholder="Encrypted result will appear here..."
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#9B8AFB] font-mono focus:outline-none resize-none h-24"
              />
            </div>

            <button
              onClick={handleDecrypt}
              disabled={!ciphertext}
              className="w-full bg-[#1A1A22] text-[#F2F0F5] border border-[#292934] hover:bg-[#292934] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Unlock size={18} /> Decrypt Ciphertext
            </button>
          </div>

          {/* Decrypted Output */}
          {decryptedText && (
            <div className="space-y-4 border-t border-[#292934] pt-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="block text-sm font-medium text-[#9693A1] mb-1">Decrypted Plaintext</label>
                <textarea
                  readOnly
                  value={decryptedText}
                  className="w-full bg-[#0B0B0F] border border-[#6FCF97]/30 rounded-lg px-4 py-3 text-[#6FCF97] font-mono focus:outline-none resize-none h-24"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleClearCaesar}
              className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Clear Cipher
            </button>
          </div>
        </Card>

        {/* =========================================================
            SHA-256 HASH PLAYGROUND
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#6FCF97]">
              <Hash size={20} />
            </div>
            <h2 className="text-xl font-bold">SHA-256 Playground</h2>
          </div>

          {/* Educational Banner */}
          <div className="bg-[#1A1A22] border border-[#292934] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#6FCF97] mb-2 flex items-center gap-2">
              <FileDigit size={16} /> Irreversible Hashing
            </h3>
            <p className="text-xs text-[#9693A1] mb-3">
              SHA-256 is a hashing algorithm, NOT encryption. It scrambles data into a unique, fixed-size 64-character signature that cannot be reversed or "decrypted" back into text.
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#F2F0F5] bg-[#0B0B0F] p-3 rounded border border-[#292934]">
              <span>Input</span>
              <ArrowRight size={14} className="text-[#6FCF97]" />
              <span className="text-[#6FCF97]">SHA-256</span>
              <ArrowRight size={14} className="text-[#6FCF97]" />
              <span>Fixed Hash</span>
            </div>
          </div>

          {/* Hash Input A */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">Input Data</label>
              <textarea
                value={hashInputA}
                onChange={(e) => setHashInputA(e.target.value)}
                placeholder="Enter text to hash..."
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#6FCF97] transition-colors resize-none h-16"
              />
            </div>
            <button
              onClick={handleHashA}
              disabled={!hashInputA.trim()}
              className="w-full bg-[#6FCF97] text-[#0B0B0F] hover:bg-[#5EBC86] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Hash size={18} /> Generate Hash
            </button>
          </div>

          {/* Hash Output A */}
          {hashOutputA && (
            <div className="space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#9693A1]">Resulting SHA-256 Hash</label>
                <button 
                  onClick={() => copyToClipboard(hashOutputA, setCopiedHashA)}
                  className="text-[#6FCF97] hover:text-[#5EBC86] text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedHashA ? <Check size={14} /> : <Copy size={14} />} 
                  {copiedHashA ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-[#0B0B0F] border border-[#292934] rounded-lg p-4 font-mono text-[#6FCF97] text-sm break-all">
                {hashOutputA}
              </div>
            </div>
          )}

          {/* Avalanche Effect Section */}
          <div className="border-t border-[#292934] pt-6">
            {!showAvalanche ? (
              <button
                onClick={() => setShowAvalanche(true)}
                disabled={!hashOutputA}
                className="w-full bg-[#1A1A22] text-[#F2F0F5] border border-[#292934] hover:bg-[#292934] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Scale size={16} className="text-[#E6B566]" /> Try the Avalanche Effect
              </button>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#E6B566] mb-2 flex items-center gap-2">
                    <Scale size={16} /> The Avalanche Effect
                  </h3>
                  <p className="text-xs text-[#9693A1] mb-4">
                    Modify the input slightly (e.g., change one letter). Notice how drastically the hash changes.
                  </p>
                  
                  <div className="space-y-4">
                    <textarea
                      value={hashInputB}
                      onChange={(e) => setHashInputB(e.target.value)}
                      placeholder="Enter slightly modified text..."
                      className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#E6B566] transition-colors resize-none h-16"
                    />
                    <button
                      onClick={handleHashB}
                      disabled={!hashInputB.trim()}
                      className="w-full bg-[#1A1A22] text-[#E6B566] border border-[#E6B566]/30 hover:bg-[#E6B566]/10 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Hash size={18} /> Generate Second Hash
                    </button>
                  </div>
                </div>

                {hashOutputB && (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-[#9693A1]">Second SHA-256 Hash</label>
                    </div>
                    <div className="bg-[#0B0B0F] border border-[#292934] rounded-lg p-4 font-mono text-[#E6B566] text-sm break-all">
                      {hashOutputB}
                    </div>
                    
                    {/* Comparison Stats */}
                    {diffStats && (
                      <div className="mt-4 p-3 bg-[#E6B566]/10 border border-[#E6B566]/20 rounded-lg">
                        <p className="text-sm text-[#E6B566] font-medium text-center">
                          {diffStats.diffCount} out of 64 characters changed ({diffStats.percent}%)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearHash}
              className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Clear Hash Playground
            </button>
          </div>
        </Card>
      </div>

      {/* =========================================================
          WHAT IS THE DIFFERENCE? (Educational Section)
      ========================================================= */}
      <Card className="flex flex-col md:flex-row gap-6 mt-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#1A1A22] flex items-center justify-center">
            <Info className="text-[#C4B5FD]" size={24} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#F2F0F5] mb-2">Encryption vs. Hashing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="text-sm font-bold text-[#9B8AFB] mb-1">Encryption (Caesar)</h4>
              <p className="text-sm text-[#9693A1]">
                Designed to be a two-way street. You lock (encrypt) the data to hide it, but as long as you have the key (the shift value), you can unlock (decrypt) it back to its original form.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#6FCF97] mb-1">Hashing (SHA-256)</h4>
              <p className="text-sm text-[#9693A1]">
                A one-way street. It mathematically crushes data into a unique signature. It is impossible to reverse-engineer a hash back into the original text, making it perfect for securely storing passwords.
              </p>
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}