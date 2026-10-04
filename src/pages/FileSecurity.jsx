import React, { useState, useRef } from 'react';
import { 
  FileDigit, 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw, 
  File, 
  Shield, 
  Info, 
  ArrowRight,
  Lock,
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
   HELPERS
========================================================= */

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function FileSecurity() {
  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Baseline & Verification state
  const [baselineHash, setBaselineHash] = useState('');
  const [baselineFileName, setBaselineFileName] = useState('');
  const [verifyResult, setVerifyResult] = useState(null); // 'match' | 'mismatch' | null

  const inputRef = useRef(null);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setSelectedFile(file);
    setVerifyResult(null); // Reset verification when a new file is loaded
    setIsHashing(true);
    
    try {
      // Use Web Crypto API to hash the file locally
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setFileHash(hashHex);
    } catch (error) {
      console.error("Error hashing file:", error);
      setFileHash("Error generating hash");
    } finally {
      setIsHashing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!fileHash || fileHash === "Error generating hash") return;
    try {
      await navigator.clipboard.writeText(fileHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleSetBaseline = () => {
    if (fileHash && fileHash !== "Error generating hash") {
      setBaselineHash(fileHash);
      setBaselineFileName(selectedFile.name);
      setVerifyResult(null);
    }
  };

  const handleVerify = () => {
    if (fileHash && baselineHash) {
      if (fileHash === baselineHash) {
        setVerifyResult('match');
      } else {
        setVerifyResult('mismatch');
      }
    }
  };

  const clearCurrentFile = () => {
    setSelectedFile(null);
    setFileHash('');
    setVerifyResult(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const clearEverything = () => {
    clearCurrentFile();
    setBaselineHash('');
    setBaselineFileName('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileDigit size={28} className="text-[#9B8AFB]" />
            <h1 className="text-3xl font-bold text-[#F2F0F5]">File Security</h1>
          </div>
          <p className="text-[#9693A1] text-base max-w-xl">
            Verify whether a file has changed by generating and comparing its cryptographic fingerprint.
          </p>
        </div>
        <MascotImage 
          src="/assets/mascots/cyberguard-mascot-main.png" 
          alt="File Security Mascot" 
          className="w-24 h-24 hidden md:block" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* =========================================================
            FILE UPLOAD & HASH GENERATION
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
              <UploadCloud size={20} />
            </div>
            <h2 className="text-xl font-bold">File Integrity Checker</h2>
          </div>

          <div className="bg-[#1A1A22] border border-[#292934] rounded-lg p-3 flex items-start gap-3">
            <Lock size={16} className="text-[#6FCF97] shrink-0 mt-0.5" />
            <p className="text-xs text-[#9693A1]">
              <strong className="text-[#F2F0F5]">Local Processing:</strong> Your file is processed entirely in your browser. It is never uploaded to any server.
            </p>
          </div>

          {!selectedFile ? (
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-[#9B8AFB] bg-[#9B8AFB]/5' : 'border-[#292934] hover:border-[#9B8AFB]/50 hover:bg-[#1A1A22]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1A1A22] flex items-center justify-center text-[#9B8AFB]">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F2F0F5]">Click or drag a file here</p>
                  <p className="text-xs text-[#9693A1] mt-1">Supports any file type and size</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#0B0B0F] border border-[#292934] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File size={24} className="text-[#9B8AFB] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#F2F0F5] truncate pr-4">{selectedFile.name}</p>
                      <p className="text-xs text-[#9693A1]">
                        {formatBytes(selectedFile.size)} • {selectedFile.type || 'Unknown Type'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={clearCurrentFile}
                    className="p-1.5 text-[#9693A1] hover:text-[#E87575] hover:bg-[#1A1A22] rounded-md transition-colors shrink-0"
                    title="Remove file"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-[#292934]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#9693A1] uppercase tracking-wider">SHA-256 Fingerprint</span>
                    {!isHashing && fileHash && fileHash !== "Error generating hash" && (
                      <button 
                        onClick={copyToClipboard}
                        className="text-[#9B8AFB] hover:text-[#C4B5FD] text-xs flex items-center gap-1 transition-colors"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />} 
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                  
                  {isHashing ? (
                    <div className="text-sm font-mono text-[#9693A1] animate-pulse py-2">
                      Calculating hash...
                    </div>
                  ) : (
                    <div className="font-mono text-sm text-[#9B8AFB] break-all bg-[#14141A] p-3 rounded border border-[#292934]">
                      {fileHash}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* =========================================================
            INTEGRITY VERIFICATION
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#6FCF97]">
                <Scale size={20} />
              </div>
              <h2 className="text-xl font-bold">Integrity Verification</h2>
            </div>
          </div>

          {!baselineHash ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-[#292934] rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#1A1A22] flex items-center justify-center text-[#9693A1] mb-3">
                <Shield size={24} />
              </div>
              <p className="text-sm font-semibold text-[#F2F0F5] mb-1">No Baseline Set</p>
              <p className="text-xs text-[#9693A1] mb-6 max-w-xs">
                To verify if a file changes in the future, set its current hash as the trusted baseline first.
              </p>
              <button
                onClick={handleSetBaseline}
                disabled={!fileHash || isHashing || fileHash === "Error generating hash"}
                className="bg-[#1A1A22] text-[#F2F0F5] border border-[#292934] hover:bg-[#292934] disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
              >
                Set Current File as Baseline
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-[#0B0B0F] border border-[#292934] rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[#9693A1] uppercase tracking-wider">Trusted Baseline</span>
                  <button onClick={clearEverything} className="text-xs text-[#E87575] hover:underline">Reset</button>
                </div>
                <p className="text-xs text-[#F2F0F5] mb-2 truncate" title={baselineFileName}>{baselineFileName}</p>
                <div className="font-mono text-xs text-[#6FCF97] break-all bg-[#14141A] p-2 rounded border border-[#292934]">
                  {baselineHash}
                </div>
              </div>

              <div className="flex justify-center">
                <ArrowRight size={20} className="text-[#292934] rotate-90 lg:rotate-0" />
              </div>

              <div className="bg-[#0B0B0F] border border-[#292934] rounded-lg p-4">
                <span className="text-xs font-semibold text-[#9693A1] uppercase tracking-wider mb-2 block">Current Selection</span>
                {selectedFile && fileHash && !isHashing ? (
                  <div className="font-mono text-xs text-[#9B8AFB] break-all bg-[#14141A] p-2 rounded border border-[#292934]">
                    {fileHash}
                  </div>
                ) : (
                  <p className="text-xs text-[#9693A1] italic">Select a file to compare...</p>
                )}
              </div>

              {!verifyResult ? (
                <button
                  onClick={handleVerify}
                  disabled={!fileHash || isHashing || fileHash === "Error generating hash"}
                  className="w-full bg-[#6FCF97] text-[#0B0B0F] hover:bg-[#5EBC86] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Verify Against Baseline
                </button>
              ) : verifyResult === 'match' ? (
                <div className="bg-[#6FCF97]/10 border border-[#6FCF97]/20 p-4 rounded-lg flex items-start gap-3 animate-in zoom-in-95">
                  <CheckCircle size={20} className="text-[#6FCF97] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#6FCF97] mb-1">Integrity Verified</h3>
                    <p className="text-xs text-[#9693A1]">Both hashes match. The file contents appear unchanged. Hash comparison indicates whether the file contents have changed.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#E87575]/10 border border-[#E87575]/20 p-4 rounded-lg flex items-start gap-3 animate-in zoom-in-95">
                  <AlertTriangle size={20} className="text-[#E87575] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#E87575] mb-1">File Changed</h3>
                    <p className="text-xs text-[#9693A1]">The hashes do not match. The file contents are different from the baseline.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* =========================================================
          EDUCATIONAL SECTION
      ========================================================= */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-[#F2F0F5] mb-4">Why does this work?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[#9B8AFB] mb-2 flex items-center gap-2">
              <FileDigit size={16} /> The Digital Fingerprint
            </h4>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              A cryptographic hash acts like a digital fingerprint for file contents. Every byte of the file is processed by a mathematical algorithm (SHA-256). If even a single period or letter changes inside the file, the resulting hash will drastically change.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#E6B566] mb-2 flex items-center gap-2">
              <Info size={16} /> Limitations
            </h4>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              This process verifies integrity—it proves a file is identical to the baseline you set. It does <strong>not</strong> prove whether a file is safe or malicious. A perfectly matching hash could belong to a file that was already malware when you created the baseline.
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
}