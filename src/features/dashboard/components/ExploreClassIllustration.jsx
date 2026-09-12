import React from 'react';

export function LaptopIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="laptopBase" x1="20" y1="100" x2="140" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E8F0" />
          <stop offset="1" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="laptopScreen" x1="30" y1="20" x2="130" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="codeOrange" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
        <filter id="laptopShadow" x="10" y="105" width="140" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#EA580C" floodOpacity="0.15" />
        </filter>
      </defs>
      <ellipse cx="80" cy="124" rx="55" ry="10" fill="#FED7AA" opacity="0.6" filter="url(#laptopShadow)" />
      <rect x="32" y="22" width="96" height="66" rx="8" fill="#334155" stroke="#94A3B8" strokeWidth="2" />
      <rect x="36" y="26" width="88" height="56" rx="4" fill="url(#laptopScreen)" />
      <circle cx="44" cy="33" r="2" fill="#EF4444" />
      <circle cx="50" cy="33" r="2" fill="#F59E0B" />
      <circle cx="56" cy="33" r="2" fill="#10B981" />
      <rect x="44" y="41" width="32" height="3" rx="1.5" fill="#38BDF8" opacity="0.9" />
      <rect x="80" y="41" width="20" height="3" rx="1.5" fill="#F43F5E" opacity="0.8" />
      <rect x="48" y="48" width="40" height="3" rx="1.5" fill="#A855F7" opacity="0.85" />
      <rect x="52" y="55" width="28" height="3" rx="1.5" fill="#34D399" opacity="0.85" />
      <rect x="44" y="63" width="22" height="3" rx="1.5" fill="#FBBF24" opacity="0.9" />
      <rect x="70" y="63" width="34" height="3" rx="1.5" fill="#38BDF8" opacity="0.7" />
      <path d="M16 95 L144 95 L132 112 L28 112 Z" fill="url(#laptopBase)" stroke="#94A3B8" strokeWidth="1.5" />
      <rect x="68" y="99" width="24" height="9" rx="2" fill="#94A3B8" opacity="0.6" />
      <path d="M70 95 L90 95 L88 97 L72 97 Z" fill="#64748B" />
      <g transform="translate(108, 16)">
        <rect width="36" height="24" rx="7" fill="url(#codeOrange)" />
        <text x="18" y="16" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">&lt;/&gt;</text>
      </g>
    </svg>
  );
}

export function BrainIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="brainGrad" x1="40" y1="30" x2="120" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
        <filter id="brainShadow" x="20" y="105" width="120" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#059669" floodOpacity="0.2" />
        </filter>
      </defs>
      <ellipse cx="80" cy="122" rx="48" ry="9" fill="#A7F3D0" opacity="0.5" filter="url(#brainShadow)" />
      <path d="M42 62 C35 50 48 30 70 34 C76 25 94 25 100 36 C116 32 126 50 120 66 C128 78 122 96 108 98 C100 108 80 110 72 100 C56 106 40 92 44 78 C36 72 36 65 42 62 Z" fill="url(#brainGrad)" opacity="0.95" />
      <path d="M58 50 C65 44 76 48 78 58 C80 68 70 76 60 76" stroke="#ECFDF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M102 50 C95 44 84 48 82 58 C80 68 90 76 100 76" stroke="#ECFDF5" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 82 C70 88 80 88 88 80 C92 76 96 84 94 92" stroke="#ECFDF5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="56" cy="48" r="3.5" fill="#FFFFFF" />
      <circle cx="80" cy="42" r="3" fill="#FFFFFF" />
      <circle cx="104" cy="48" r="3.5" fill="#FFFFFF" />
      <circle cx="70" cy="66" r="3" fill="#FFFFFF" />
      <circle cx="90" cy="66" r="3" fill="#FFFFFF" />
      <circle cx="80" cy="90" r="3.5" fill="#FFFFFF" />
      <line x1="56" y1="48" x2="70" y2="66" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="104" y1="48" x2="90" y2="66" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="70" y1="66" x2="80" y2="90" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="90" y1="66" x2="80" y2="90" stroke="#A7F3D0" strokeWidth="1.5" />
      <g transform="translate(110, 20)">
        <rect width="32" height="24" rx="7" fill="url(#chipGrad)" />
        <text x="16" y="16" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">AI</text>
      </g>
    </svg>
  );
}

export function ShieldIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="shieldMain" x1="50" y1="20" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="shieldFacet" x1="80" y1="25" x2="115" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="lockGold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <filter id="shieldShadow" x="25" y="105" width="110" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#6D28D9" floodOpacity="0.2" />
        </filter>
      </defs>
      <ellipse cx="80" cy="122" rx="46" ry="9" fill="#DDD6FE" opacity="0.6" filter="url(#shieldShadow)" />
      <path d="M80 20 L118 34 C118 72 102 98 80 112 C58 98 42 72 42 34 L80 20 Z" fill="url(#shieldMain)" stroke="#A78BFA" strokeWidth="2" />
      <path d="M80 22 L116 35 C116 71 101 96 80 110 L80 22 Z" fill="url(#shieldFacet)" />
      <line x1="80" y1="22" x2="80" y2="110" stroke="#C4B5FD" strokeWidth="1.5" opacity="0.7" />
      <rect x="66" y="60" width="28" height="24" rx="5" fill="url(#lockGold)" stroke="#FDE68A" strokeWidth="1.5" />
      <path d="M72 60 V50 C72 45 88 45 88 50 V60" stroke="#FDE68A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="80" cy="70" r="2.5" fill="#78350F" />
      <path d="M79 71 L81 71 L82 77 L78 77 Z" fill="#78350F" />
      <g transform="translate(108, 18)">
        <circle cx="12" cy="12" r="12" fill="#10B981" />
        <path d="M7 12 L10 15 L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ChartIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="bar1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="bar2" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="bar3" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <filter id="chartShadow" x="15" y="105" width="130" height="30" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#2563EB" floodOpacity="0.2" />
        </filter>
      </defs>
      <ellipse cx="80" cy="122" rx="50" ry="9" fill="#BFDBFE" opacity="0.6" filter="url(#chartShadow)" />
      <path d="M26 102 L80 114 L134 102 L80 92 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
      <path d="M38 78 L52 74 L52 98 L38 102 Z" fill="#1D4ED8" />
      <path d="M52 74 L62 77 L62 101 L52 98 Z" fill="#2563EB" />
      <path d="M38 78 L48 75 L62 77 L52 74 Z" fill="#60A5FA" />
      <path d="M68 56 L82 52 L82 102 L68 106 Z" fill="#0369A1" />
      <path d="M82 52 L92 55 L92 105 L82 102 Z" fill="#0284C7" />
      <path d="M68 56 L78 53 L92 55 L82 52 Z" fill="#38BDF8" />
      <path d="M98 34 L112 30 L112 106 L98 110 Z" fill="#4338CA" />
      <path d="M112 30 L122 33 L122 109 L112 106 Z" fill="#4F46E5" />
      <path d="M98 34 L108 31 L122 33 L112 30 Z" fill="#818CF8" />
      <path d="M42 66 Q 74 46, 114 22" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <polygon points="112,18 124,20 118,30" fill="#F59E0B" />
      <circle cx="44" cy="66" r="3" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="78" cy="48" r="3.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="115" cy="24" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
}

export function GenericIllustration({ className = 'w-24 h-24' }) {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="80" cy="70" r="40" fill="#EEF2F6" stroke="#CBD5E1" strokeWidth="2" />
      <circle cx="80" cy="70" r="26" fill="#E2E8F0" />
      <polygon points="80,48 94,84 66,84" fill="#6366F1" />
    </svg>
  );
}


