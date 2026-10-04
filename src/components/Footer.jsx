import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ setActivePath }) {
  // Navigation mapping. 'Tools' redirects to the primary tools landing/Password Lab.
  const navLinks = [
    { id: 'cyber-academy', label: 'Cyber Academy' },
    { id: 'password-lab', label: 'Security Tools' },
    { id: 'about', label: 'About' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <footer className="w-full border-t border-[#292934] mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-8">
          
          {/* LEFT: Branding & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <button 
              onClick={() => setActivePath('dashboard')}
              className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            >
              <div className="p-1.5 bg-[#9B8AFB]/10 rounded-lg text-[#9B8AFB]">
                <Shield size={20} />
              </div>
              <span className="text-lg font-bold text-[#F2F0F5] tracking-wide">CyberGuard</span>
            </button>
            <p className="text-sm text-[#9693A1]">Learn. Explore. Stay safer.</p>
          </div>

          {/* RIGHT: Navigation */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActivePath(link.id)}
                className="text-sm font-medium text-[#9693A1] hover:text-[#9B8AFB] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          
        </div>

        {/* BOTTOM: Divider & Info */}
        <div className="border-t border-[#292934] pt-6 flex justify-center md:justify-start text-center md:text-left">
          <p className="text-xs text-[#9693A1] tracking-wide">
            CyberGuard • Educational Project • v1.0
          </p>
        </div>
        
      </div>
    </footer>
  );
}