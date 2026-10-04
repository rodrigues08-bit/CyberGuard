import React, { useState } from 'react';
import { 
  Network, 
  Globe, 
  Search, 
  Zap, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Server,
  Info,
  Shield,
  ArrowRight
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
   NETWORK LOGIC
========================================================= */

const analyzeIPv4 = (ip) => {
  if (!ip) return { valid: false, error: "Please enter an IPv4 address." };
  
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return { valid: false, error: "An IPv4 address must have exactly 4 octets separated by dots." };

  const octets = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!/^\d+$/.test(p)) return { valid: false, error: `Invalid characters in octet ${i + 1} ("${p}"). Only numbers are allowed.` };
    const num = parseInt(p, 10);
    if (num < 0 || num > 255) return { valid: false, error: `Octet ${i + 1} is out of bounds (${num}). It must be between 0 and 255.` };
    if (p.length > 1 && p.startsWith('0')) return { valid: false, error: `Leading zeros are not allowed in octet ${i + 1} ("${p}").` };
    octets.push(num);
  }

  const [o1, o2, o3, o4] = octets;
  
  // Determine Class
  let ipClass = "Unknown";
  if (o1 >= 1 && o1 <= 126) ipClass = "A";
  else if (o1 === 127) ipClass = "Loopback";
  else if (o1 >= 128 && o1 <= 191) ipClass = "B";
  else if (o1 >= 192 && o1 <= 223) ipClass = "C";
  else if (o1 >= 224 && o1 <= 239) ipClass = "D (Multicast)";
  else if (o1 >= 240 && o1 <= 255) ipClass = "E (Reserved)";

  // Determine Type (Private, Public, Loopback, Link-Local)
  let type = "Public";
  if (o1 === 10) type = "Private";
  else if (o1 === 172 && o2 >= 16 && o2 <= 31) type = "Private";
  else if (o1 === 192 && o2 === 168) type = "Private";
  else if (o1 === 127) type = "Loopback";
  else if (o1 === 169 && o2 === 254) type = "Link-Local";
  else if (o1 >= 224) type = "Reserved / Multicast";

  const binary = octets.map(num => num.toString(2).padStart(8, '0')).join('.');

  return { valid: true, ip: octets.join('.'), ipClass, type, binary, octets };
};

const calculateCIDR = (input) => {
  if (!input) return { valid: false, error: "Please enter a CIDR notation." };
  
  const parts = input.trim().split('/');
  if (parts.length !== 2) return { valid: false, error: "Format must be IP/Prefix (e.g., 192.168.1.0/24)." };

  const ipAnalysis = analyzeIPv4(parts[0]);
  if (!ipAnalysis.valid) return { valid: false, error: `Invalid IP: ${ipAnalysis.error}` };

  if (!/^\d+$/.test(parts[1])) return { valid: false, error: "Prefix must be a valid number between 0 and 32." };
  const prefix = parseInt(parts[1], 10);
  if (prefix < 0 || prefix > 32) return { valid: false, error: "CIDR prefix must be between 0 and 32." };

  // Calculate Subnet Mask carefully to avoid JS 32-bit signed bitwise overflow
  const maskOctets = [];
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(Math.max(prefix - (i * 8), 0), 8);
    maskOctets.push(256 - Math.pow(2, 8 - bits));
  }
  const maskStr = maskOctets.join('.');

  // Calculate Network and Broadcast
  const netOctets = ipAnalysis.octets.map((oct, i) => oct & maskOctets[i]);
  const bcOctets = netOctets.map((oct, i) => oct | (255 - maskOctets[i]));
  
  const netStr = netOctets.join('.');
  const bcStr = bcOctets.join('.');

  // Helper to safely manipulate IP mathematics
  const ipToFloat = (octs) => octs[0] * 16777216 + octs[1] * 65536 + octs[2] * 256 + octs[3];
  const floatToIp = (num) => [
    Math.floor(num / 16777216) % 256,
    Math.floor(num / 65536) % 256,
    Math.floor(num / 256) % 256,
    num % 256
  ].join('.');

  const totalAddresses = Math.pow(2, 32 - prefix);
  let usableHosts = 0;
  let firstHost = "N/A";
  let lastHost = "N/A";

  if (prefix === 32) {
    usableHosts = 1;
    firstHost = netStr;
    lastHost = netStr;
  } else if (prefix === 31) {
    usableHosts = 2;
    firstHost = netStr;
    lastHost = bcStr;
  } else {
    usableHosts = totalAddresses - 2;
    firstHost = floatToIp(ipToFloat(netOctets) + 1);
    lastHost = floatToIp(ipToFloat(bcOctets) - 1);
  }

  return {
    valid: true,
    ip: ipAnalysis.ip,
    prefix,
    mask: maskStr,
    network: netStr,
    broadcast: bcStr,
    totalAddresses,
    usableHosts,
    firstHost,
    lastHost,
    is31or32: prefix >= 31
  };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function NetworkLab() {
  // IPv4 Validator State
  const [ipv4Input, setIpv4Input] = useState('');
  const [ipv4Result, setIpv4Result] = useState(null);

  // CIDR Explorer State
  const [cidrInput, setCidrInput] = useState('');
  const [cidrResult, setCidrResult] = useState(null);

  const handleValidateIpv4 = () => {
    setIpv4Result(analyzeIPv4(ipv4Input));
  };

  const handleCalculateCidr = () => {
    setCidrResult(calculateCIDR(cidrInput));
  };

  const loadExampleIpv4 = () => {
    setIpv4Input('192.168.1.10');
    setIpv4Result(null);
  };

  const loadExampleCidr = () => {
    setCidrInput('192.168.1.0/24');
    setCidrResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-[#14141A] border border-[#292934] rounded-2xl p-6 md:p-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={28} className="text-[#9B8AFB]" />
            <h1 className="text-3xl font-bold text-[#F2F0F5]">Network Lab</h1>
          </div>
          <p className="text-[#9693A1] text-base max-w-xl">
            Explore and understand IPv4 addresses and network subnet structure.
          </p>
        </div>
        <MascotImage 
          src="/assets/mascots/cyberguard-mascot-main.png" 
          alt="Network Lab Mascot" 
          className="w-24 h-24 hidden md:block" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* =========================================================
            IPv4 VALIDATOR
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#9B8AFB]">
              <Search size={20} />
            </div>
            <h2 className="text-xl font-bold">IPv4 Validator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">IPv4 Address</label>
              <input
                type="text"
                value={ipv4Input}
                onChange={(e) => setIpv4Input(e.target.value)}
                placeholder="e.g., 192.168.1.10"
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#9B8AFB] transition-colors font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleValidateIpv4}
                disabled={!ipv4Input.trim()}
                className="flex-1 bg-[#9B8AFB] text-[#0B0B0F] hover:bg-[#AA9BFF] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Validate
              </button>
              <button
                onClick={loadExampleIpv4}
                className="px-4 py-2 bg-[#1A1A22] text-[#9B8AFB] border border-[#292934] hover:bg-[#292934] rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                title="Load Example"
              >
                <Zap size={16} /> Example
              </button>
            </div>
          </div>

          {ipv4Result && (
            <div className="border-t border-[#292934] pt-6 animate-in slide-in-from-top-2 space-y-4">
              
              {!ipv4Result.valid ? (
                <div className="bg-[#E87575]/10 border border-[#E87575]/20 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[#E87575] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#E87575] mb-1">Invalid IPv4 Address</h3>
                    <p className="text-sm text-[#9693A1]">{ipv4Result.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#6FCF97] font-bold text-lg bg-[#6FCF97]/10 p-3 rounded-lg border border-[#6FCF97]/20">
                    <CheckCircle size={20} /> Valid IPv4 Address
                  </div>
                  
                  <div className="bg-[#0B0B0F] rounded-lg border border-[#292934] overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-[#292934] border-b border-[#292934]">
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">IP Address</p>
                        <p className="font-mono text-[#F2F0F5]">{ipv4Result.ip}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Network Type</p>
                        <p className={`font-semibold ${ipv4Result.type === 'Private' ? 'text-[#9B8AFB]' : ipv4Result.type === 'Public' ? 'text-[#6FCF97]' : 'text-[#E6B566]'}`}>
                          {ipv4Result.type}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-[#292934]">
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Address Class</p>
                        <p className="text-[#F2F0F5]">Class {ipv4Result.ipClass}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Octet Count</p>
                        <p className="text-[#F2F0F5]">4 / 32-bit</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#9693A1] mb-1">Binary Representation</label>
                    <div className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg p-3 text-[#C4B5FD] font-mono text-sm break-all text-center">
                      {ipv4Result.binary}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setIpv4Input(''); setIpv4Result(null); }}
                className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2 pt-2"
              >
                <RefreshCw size={14} /> Clear Result
              </button>
            </div>
          )}
        </Card>

        {/* =========================================================
            CIDR / SUBNET EXPLORER
        ========================================================= */}
        <Card className="flex flex-col space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-[#1A1A22] text-[#6FCF97]">
              <Server size={20} />
            </div>
            <h2 className="text-xl font-bold">CIDR / Subnet Explorer</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9693A1] mb-1">Network & Prefix</label>
              <input
                type="text"
                value={cidrInput}
                onChange={(e) => setCidrInput(e.target.value)}
                placeholder="e.g., 192.168.1.0/24"
                className="w-full bg-[#0B0B0F] border border-[#292934] rounded-lg px-4 py-3 text-[#F2F0F5] focus:outline-none focus:border-[#6FCF97] transition-colors font-mono text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCalculateCidr}
                disabled={!cidrInput.trim()}
                className="flex-1 bg-[#6FCF97] text-[#0B0B0F] hover:bg-[#5EBC86] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Calculate Subnet
              </button>
              <button
                onClick={loadExampleCidr}
                className="px-4 py-2 bg-[#1A1A22] text-[#6FCF97] border border-[#292934] hover:bg-[#292934] rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                title="Load Example"
              >
                <Zap size={16} /> Example
              </button>
            </div>
          </div>

          {/* Educational Visual Aid (Always visible for context) */}
          {!cidrResult && (
            <div className="bg-[#1A1A22] border border-[#292934] rounded-lg p-4 mt-2">
              <h3 className="text-sm font-semibold text-[#6FCF97] mb-2 flex items-center gap-2">
                <Network size={16} /> What does /24 mean?
              </h3>
              <p className="text-xs text-[#9693A1] mb-3">
                The "/24" indicates that the first 24 bits of the IP address form the network identifier, leaving the remaining 8 bits to assign to host devices.
              </p>
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-[#F2F0F5] bg-[#0B0B0F] p-3 rounded border border-[#292934]">
                <span className="text-[#9693A1]">IP</span>
                <ArrowRight size={14} className="text-[#6FCF97]" />
                <span className="text-[#6FCF97]">Prefix (/N)</span>
                <ArrowRight size={14} className="text-[#6FCF97]" />
                <span className="text-[#F2F0F5]">Subnet Range</span>
              </div>
            </div>
          )}

          {cidrResult && (
            <div className="border-t border-[#292934] pt-6 animate-in slide-in-from-top-2 space-y-4">
              
              {!cidrResult.valid ? (
                <div className="bg-[#E87575]/10 border border-[#E87575]/20 p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[#E87575] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-[#E87575] mb-1">Invalid CIDR Format</h3>
                    <p className="text-sm text-[#9693A1]">{cidrResult.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {cidrResult.is31or32 && (
                    <div className="bg-[#E6B566]/10 border border-[#E6B566]/20 p-3 rounded-lg flex items-start gap-3">
                      <Info size={16} className="text-[#E6B566] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#E6B566]">
                        Note: /{cidrResult.prefix} is a special case. /32 designates a single host. /31 designates a point-to-point link with only 2 addresses (no separate network/broadcast addresses in modern implementations).
                      </p>
                    </div>
                  )}

                  <div className="bg-[#0B0B0F] rounded-lg border border-[#292934] overflow-hidden text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#292934] border-b border-[#292934]">
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Network Address</p>
                        <p className="font-mono text-[#6FCF97] font-bold">{cidrResult.network}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Broadcast Address</p>
                        <p className="font-mono text-[#E87575]">{cidrResult.broadcast}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#292934] border-b border-[#292934]">
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Subnet Mask</p>
                        <p className="font-mono text-[#F2F0F5]">{cidrResult.mask}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Usable Host Range</p>
                        <p className="font-mono text-[#F2F0F5] text-xs mt-0.5">
                          {cidrResult.firstHost} – {cidrResult.lastHost}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-[#292934] bg-[#1A1A22]">
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Total Addresses</p>
                        <p className="font-semibold text-[#F2F0F5]">{cidrResult.totalAddresses.toLocaleString()}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#9693A1] mb-1">Usable Hosts</p>
                        <p className="font-semibold text-[#6FCF97]">{cidrResult.usableHosts.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setCidrInput(''); setCidrResult(null); }}
                className="text-[#9693A1] hover:text-[#F2F0F5] text-sm font-medium transition-colors flex items-center gap-2 pt-2"
              >
                <RefreshCw size={14} /> Clear Result
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* =========================================================
          EDUCATIONAL SECTION
      ========================================================= */}
      <Card className="mt-6">
        <h3 className="text-lg font-semibold text-[#F2F0F5] mb-4">What are IPv4 and CIDR?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-bold text-[#9B8AFB] mb-2 flex items-center gap-2">
              <Globe size={16} /> IPv4 Addresses
            </h4>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              An IPv4 address identifies a device or interface on an IP network using four numbers (octets), each ranging from 0 to 255. Private addresses are used inside local networks (like your home Wi-Fi), while Public addresses are accessible across the internet.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#6FCF97] mb-2 flex items-center gap-2">
              <Network size={16} /> CIDR Notation
            </h4>
            <p className="text-sm text-[#9693A1] leading-relaxed">
              CIDR (Classless Inter-Domain Routing) uses a prefix such as /24 to indicate how much of the address belongs to the "network portion". The remaining bits determine how many individual host devices can fit inside that specific network.
            </p>
          </div>
        </div>
      </Card>

    </div>
  );
}