import React from 'react';
import { toPersianDigits } from '../lib/persianUtils';
import { TOTAL_PAGES_IN_QURAN } from '../lib/khatmService';
import { CheckCircle2, BookmarkCheck } from 'lucide-react';

interface KhatmStatsProps {
  currentKhatm: number;
  lastAssignedPage: number;
  completedKhatms: number;
  isLoading?: boolean;
}

export function KhatmStats({
  currentKhatm,
  lastAssignedPage,
  completedKhatms,
  isLoading = false
}: KhatmStatsProps) {
  const percentage = Math.min(100, Math.round((lastAssignedPage / TOTAL_PAGES_IN_QURAN) * 100));

  return (
    <div className="w-full bg-[#F4EFE6]/70 rounded-2xl p-4 border border-[#E3DAC9] mb-6 text-right transition-all">
      <div className="flex items-center justify-between gap-2 text-sm text-[#3E5247] mb-2 font-medium">
        <div className="flex items-center gap-1.5">
          <BookmarkCheck className="w-4 h-4 text-[#1B4332]" />
          <span>ختم جاری:</span>
          <span className="font-bold text-[#1B4332] text-base">
            ختم شماره {toPersianDigits(currentKhatm)}
          </span>
        </div>

        {completedKhatms > 0 && (
          <div className="flex items-center gap-1 text-xs bg-[#E2ECE5] text-[#1B4332] px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{toPersianDigits(completedKhatms)} ختم کامل‌شده</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center text-xs text-[#5D6B63] mb-1.5 font-medium">
          <span>
            {lastAssignedPage > 0
              ? `${toPersianDigits(lastAssignedPage)} صفحه از ${toPersianDigits(TOTAL_PAGES_IN_QURAN)} صفحه`
              : 'شروع یک ختم تازه'}
          </span>
          <span>{toPersianDigits(percentage)}٪</span>
        </div>

        <div className="w-full bg-[#E5DDCF] h-2.5 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-l from-[#1B4332] to-[#2D6A4F] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
