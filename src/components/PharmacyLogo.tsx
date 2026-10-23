import React from 'react';

interface PharmacyLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'red' | 'emerald' | 'white' | 'ruby' | 'gold';
}

export const PharmacyLogo: React.FC<PharmacyLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'red',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const isLight = variant === 'white';
  const isRuby = variant === 'ruby' || variant === 'gold';

  const bgClass = isLight
    ? 'bg-white text-red-600 shadow-md ring-1 ring-slate-200'
    : isRuby
    ? 'bg-gradient-to-br from-red-700 via-rose-800 to-red-950 text-red-200 shadow-md ring-1 ring-red-400/30'
    : 'bg-red-600 text-white shadow-sm ring-1 ring-red-500/30';

  return (
    <div
      className={`rounded-xl flex items-center justify-center shrink-0 ${sizeMap[size]} ${bgClass} ${className}`}
      title="شعار كبسولة صيدلانية - منصة نبض"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5"
      >
        <g transform="rotate(-45 24 24)">
          {/* Capsule Outer Pill Shell */}
          <rect
            x="14"
            y="7"
            width="20"
            height="34"
            rx="10"
            stroke="currentColor"
            strokeWidth="2.8"
            fill="none"
          />

          {/* Top Half of Capsule (Solid Fill) */}
          <path
            d="M14 17C14 11.4772 18.4772 7 24 7C29.5228 7 34 11.4772 34 17V24H14V17Z"
            fill="currentColor"
          />

          {/* Bottom Half of Capsule (Translucent Fill) */}
          <path
            d="M14 24H34V31C34 36.5228 29.5228 41 24 41C18.4772 41 14 36.5228 14 31V24Z"
            fill="currentColor"
            fillOpacity="0.2"
          />

          {/* Central Division Seam Band */}
          <line
            x1="13"
            y1="24"
            x2="35"
            y2="24"
            stroke={isLight ? '#dc2626' : '#ffffff'}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Pulse / Heartbeat Line inside the lower half (نبض) */}
          <path
            d="M18 32H20.5L22 28.5L24.5 35L26.5 30.5L28 32H30"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glossy Capsule Light Reflection Highlight */}
          <path
            d="M17.5 12C17.5 10 19 8.5 21 8.5"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
        </g>
      </svg>
    </div>
  );
};
