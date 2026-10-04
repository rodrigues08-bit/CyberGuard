import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function MascotImage({ mascot = 'main', className = 'w-12 h-12', fallbackSize = '24' }) {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`bg-[#1A1A22] rounded-full flex items-center justify-center border border-[#292934] ${className}`}>
        <User size={fallbackSize} className="text-[#9B8AFB]" />
      </div>
    );
  }

  return (
    <img
      src={`/assets/mascots/vexel/vexel-${mascot}.png`}
      alt={`Vexel ${mascot} mascot`}
      className={`object-contain ${className}`}
      onError={() => setError(true)}
    />
  );
}