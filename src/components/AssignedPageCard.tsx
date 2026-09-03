import React from 'react';
import { motion } from 'motion/react';
import { toPersianDigits, getJuzForPage, getQuranPageUrl } from '../lib/persianUtils';
import { AllocationResult } from '../types';
import { BookOpen, ExternalLink, RefreshCw } from 'lucide-react';

interface AssignedPageCardProps {
  key?: React.Key;
  allocation: AllocationResult;
  onGetAnotherPage?: () => void;
  isLoading?: boolean;
}

export function AssignedPageCard({
  allocation,
  onGetAnotherPage,
  isLoading = false,
}: AssignedPageCardProps) {
  const juz = getJuzForPage(allocation.pageNumber);
  const quranUrl = getQuranPageUrl(allocation.pageNumber);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full bg-gradient-to-b from-white to-[#FDFCF9] rounded-3xl p-6 sm:p-8 border-2 border-[#1B4332]/20 shadow-xl shadow-[#1B4332]/5 text-center relative overflow-hidden"
    >
      {/* Decorative corner embellishments */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-25">
        <svg viewBox="0 0 64 64" className="w-full h-full text-[#1B4332] fill-current">
          <path d="M0,0 L64,0 C40,0 20,20 20,44 L20,64 L0,0 Z" />
        </svg>
      </div>
      <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-25 scale-x-[-1]">
        <svg viewBox="0 0 64 64" className="w-full h-full text-[#1B4332] fill-current">
          <path d="M0,0 L64,0 C40,0 20,20 20,44 L20,64 L0,0 Z" />
        </svg>
      </div>

      {/* Khatm Number Tag */}
      <div className="inline-flex items-center gap-1.5 bg-[#EAF2ED] text-[#1B4332] px-3.5 py-1.5 rounded-full text-sm font-semibold mb-4 border border-[#CADED1]">
        <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse"></span>
        <span>ختم شماره {toPersianDigits(allocation.khatmNumber)}</span>
      </div>

      {/* Main Announcement: «صفحه ۱۲۷ قرآن را بخوانید» */}
      <div className="my-3">
        <p className="text-gray-600 text-sm md:text-base font-medium mb-1">
          سهم شما از تلاوت قرآن کریم:
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B4332] leading-tight font-['Vazirmatn',sans-serif]">
          صفحه <span className="font-['Amiri',serif] text-4xl sm:text-5xl text-[#1B4332] px-1 font-bold inline-block">{toPersianDigits(allocation.pageNumber)}</span> قرآن را بخوانید
        </h2>
      </div>

      {/* Secondary info badge: Juz */}
      <div className="flex items-center justify-center gap-3 my-4 text-xs sm:text-sm text-[#4A5D52] font-medium">
        <span className="bg-[#F3EEE3] px-3 py-1 rounded-lg border border-[#E5DAC6]">
          جزء {toPersianDigits(juz)} قرآن کریم
        </span>
        <span className="bg-[#F3EEE3] px-3 py-1 rounded-lg border border-[#E5DAC6]">
          صفحه {toPersianDigits(allocation.pageNumber)} از ۶۰۴
        </span>
      </div>

      {/* Online reading action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={quranUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F6F2EA] hover:bg-[#ECE5D8] text-[#1B4332] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors border border-[#DCD3C1]"
        >
          <BookOpen className="w-4 h-4 text-[#1B4332]" />
          <span>مشاهده آنلاین صفحه در قرآن کریم</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>

        {onGetAnotherPage && (
          <button
            onClick={onGetAnotherPage}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#436453] hover:text-[#1B4332] hover:bg-[#F2EFE8] font-medium px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>دریافت یک صفحه دیگر</span>
          </button>
        )}
      </div>

      <p className="mt-5 text-xs text-[#7A8A81] font-light">
        التماس دعا • طاعات و عبادات شما قبول درگاه حق
      </p>
    </motion.div>
  );
}
