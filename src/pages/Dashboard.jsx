import React from 'react';
import { Shield, Lock, Globe, AlertTriangle, FileDigit, CheckCircle2, ChevronRight, Activity, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import MascotImage from '../components/MascotImage';

export default function Dashboard({ setActivePath }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#F2F0F5]">Dashboard</h1>
          <p className="text-[#9693A1] mt-1">Your cybersecurity command center</p>
        </div>
        <div className="flex items-center space-x-3 bg-[#14141A] border border-[#292934] px-4 py-2 rounded-lg">
          <Activity className="w-4 h-4 text-[#6FCF97]" />
          <span className="text-sm text-[#F2F0F5]">System Secure</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Shield className="w-32 h-32 text-[#9B8AFB]" />
          </div>
          <div>
            <h3 className="text-[#9693A1] font-medium mb-6">Overall Security Score</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold text-[#F2F0F5]">78</span>
              <span className="text-xl text-[#9693A1] mb-1">/ 100</span>
            </div>
            <p className="text-sm text-[#9693A1]">Based on your latest security checkup</p>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={() => setActivePath('security-checkup')}
              className="w-full flex items-center justify-center space-x-2 bg-[#1A1A22] hover:bg-[#292934] text-[#C4B5FD] py-3 rounded-lg transition-colors border border-[#292934]"
            >
              <span>View Checkup</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard 
            icon={<Lock className="text-[#9B8AFB]" />}
            title="Password Checker"
            desc="Analyze password strength"
            onClick={() => setActivePath('password-lab')}
          />
          <ActionCard 
            icon={<Globe className="text-[#C4B5FD]" />}
            title="URL Checker"
            desc="Scan links for threats"
            onClick={() => setActivePath('threat-scanner')}
          />
          <ActionCard 
            icon={<AlertTriangle className="text-[#E6B566]" />}
            title="Phishing Detector"
            desc="Analyze suspicious messages"
            onClick={() => setActivePath('threat-scanner')}
          />
          <ActionCard 
            icon={<FileDigit className="text-[#6FCF97]" />}
            title="File Hash"
            desc="Generate SHA-256 signatures"
            onClick={() => setActivePath('file-security')}
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#14141A] border border-[#292934] hover:bg-[#1A1A22] hover:border-[#9B8AFB]/50 p-5 rounded-xl text-left transition-all group flex flex-col justify-between h-full w-full"
    >
      <div className="mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#1A1A22] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="font-semibold text-[#F2F0F5] mb-1">{title}</h4>
        <p className="text-sm text-[#9693A1]">{desc}</p>
      </div>
      <div className="flex items-center text-[#9B8AFB] text-sm font-medium mt-2">
        Launch Tool <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}