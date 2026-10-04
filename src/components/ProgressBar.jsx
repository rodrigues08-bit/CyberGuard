import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-[#14141A] border border-[#292934] rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}