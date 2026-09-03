import React from 'react';

export function HeaderDecor() {
  return (
    <div className="flex flex-col items-center mb-6 select-none" aria-hidden="true">
      {/* Decorative Star Motif */}
      <div className="w-12 h-12 mb-3 text-[#1B4332] opacity-85 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          {/* 8-pointed Islamic Star geometry */}
          <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(0 50 50)" fill="#1B4332" />
          <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" fill="#1B4332" />
          <circle cx="50" cy="50" r="14" fill="#FBF9F4" />
          <circle cx="50" cy="50" r="8" fill="#C5A880" />
        </svg>
      </div>

      {/* Bismillah Text */}
      <p className="font-['Amiri',serif] text-lg md:text-xl text-[#3D5A4C] tracking-wide text-center">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      {/* Subtle divider */}
      <div className="flex items-center gap-2 mt-3 w-36">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"></div>
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A880]"></div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent"></div>
      </div>
    </div>
  );
}
