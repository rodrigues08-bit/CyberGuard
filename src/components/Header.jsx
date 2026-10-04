import React, { useState } from 'react';
import { Shield, Menu, X, Settings as SettingsIcon } from 'lucide-react';

/* =========================================================
   MASCOT AVATAR
========================================================= */
const MascotAvatar = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <div className="w-8 h-8 rounded-full bg-[#1A1A22] border border-[#292934]" />;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-8 h-8 rounded-full object-contain bg-[#1A1A22] border border-[#292934] p-0.5" 
      onError={() => setHasError(true)} 
    />
  );
};

/* =========================================================
   HEADER COMPONENT
========================================================= */
export default function Header({ activePath, setActivePath, showVexel }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Map 'Tools' to the primary tools page (password-lab), 
  // users can navigate to other tools via the Dashboard.
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cyber-academy', label: 'Academy' },
    { id: 'password-lab', label: 'Tools' },
    { id: 'about', label: 'About' }
  ];

  const handleNav = (id) => {
    setActivePath(id);
    setMobileMenuOpen(false);
  };

  // Helper to highlight 'Tools' if any tool is active
  const isToolActive = ['password-lab', 'crypto-lab', 'threat-scanner', 'network-lab', 'file-security'].includes(activePath);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-md border-b border-[#292934]">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        
        {/* LEFT: Logo */}
        <button 
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Shield size={24} className="text-[#9B8AFB]" />
          <span className="text-lg font-bold text-[#F2F0F5] tracking-wide hidden sm:block">CyberGuard</span>
        </button>

        {/* CENTER: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map(item => {
            const isActive = activePath === item.id || (item.label === 'Tools' && isToolActive);
            
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]' 
                    : 'text-[#9693A1] hover:text-[#F2F0F5] hover:bg-[#1A1A22]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Vexel & Settings (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => handleNav('settings')}
            className={`p-2 rounded-lg transition-colors ${
              activePath === 'settings' 
                ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]' 
                : 'text-[#9693A1] hover:text-[#F2F0F5] hover:bg-[#1A1A22]'
            }`}
          >
            <SettingsIcon size={20} />
          </button>
          
          {showVexel && (
            <MascotAvatar src="/assets/mascots/cyberguard-mascot-main.png" alt="Vexel Avatar" />
          )}
        </div>

        {/* MOBILE: Hamburger & Vexel */}
        <div className="flex lg:hidden items-center gap-3">
          {showVexel && (
            <MascotAvatar src="/assets/mascots/cyberguard-mascot-main.png" alt="Vexel Avatar" />
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9693A1] hover:text-[#F2F0F5] rounded-lg bg-[#14141A] border border-[#292934] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#14141A] border-b border-[#292934] shadow-xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
          {[...navItems, { id: 'settings', label: 'Settings' }].map(item => {
            const isActive = activePath === item.id || (item.label === 'Tools' && isToolActive);
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#9B8AFB]/10 text-[#9B8AFB]'
                    : 'text-[#9693A1] hover:text-[#F2F0F5] hover:bg-[#1A1A22]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}