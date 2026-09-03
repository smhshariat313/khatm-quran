import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  subscribeToKhatmState,
  allocateNextQuranPage,
} from './lib/khatmService';
import { KhatmState, AllocationResult } from './types';
import { HeaderDecor } from './components/HeaderDecor';
import { KhatmStats } from './components/KhatmStats';
import { AssignedPageCard } from './components/AssignedPageCard';
import { BookOpen, AlertCircle, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { toPersianDigits } from './lib/persianUtils';

const LOCAL_STORAGE_KEY = 'quran_khatm_my_assigned_page';

export default function App() {
  const [khatmState, setKhatmState] = useState<KhatmState>({
    currentKhatm: 1,
    lastAssignedPage: 0,
    completedKhatms: 0,
    totalAssignedPagesAllTime: 0,
  });

  const [currentAllocation, setCurrentAllocation] = useState<AllocationResult | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved allocation:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isThrottled, setIsThrottled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialConnecting, setIsInitialConnecting] = useState(true);

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    setIsInitialConnecting(true);
    const unsubscribe = subscribeToKhatmState(
      (updatedState) => {
        setKhatmState(updatedState);
        setIsInitialConnecting(false);
        setErrorMessage(null);
      },
      (error) => {
        console.error('Firestore connection error:', error);
        setIsInitialConnecting(false);
        setErrorMessage(
          'خطا در برقراری ارتباط با پایگاه داده. لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.'
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle page request button click
  const handleGetPage = async () => {
    if (isLoading || isThrottled) return;

    // Prevent fast double-clicks
    setIsLoading(true);
    setIsThrottled(true);
    setErrorMessage(null);

    try {
      const result = await allocateNextQuranPage();
      setCurrentAllocation(result);

      // Save to localStorage for this user so they don't lose their assigned page
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }

      // Gentle celebratory confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#1B4332', '#2D6A4F', '#C5A880', '#D8F3DC'],
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti is purely decorative
      }
    } catch (error: any) {
      console.error('Error assigning page:', error);
      setErrorMessage(
        'متأسفانه در دریافت صفحه خطایی رخ داد. لطفاً چند لحظه بعد مجدداً دکمه را بزنید.'
      );
    } finally {
      setIsLoading(false);
      // Throttle rapid clicks by 1200ms
      setTimeout(() => {
        setIsThrottled(false);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1E3A2F] flex flex-col items-center justify-between p-4 sm:p-6 select-none relative overflow-x-hidden font-['Vazirmatn',sans-serif]">
      {/* Background Islamic Arabesque Ambient Pattern (Subtle) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#1B4332 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Container */}
      <main className="w-full max-w-lg mx-auto my-auto py-6 sm:py-8 z-10 flex flex-col items-center">
        {/* Decorative Top Accent */}
        <HeaderDecor />

        {/* Card Frame */}
        <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#1B4332]/5 border border-[#E8E0D2] flex flex-col items-center text-center">
          {/* Main Title: «ختم قرآن» */}
          <h1 className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tight mb-2 font-['Vazirmatn',sans-serif]">
            ختم قرآن
          </h1>

          {/* Prompt Description: «برای دریافت صفحه‌ای که باید بخوانید، دکمه زیر را بزنید.» */}
          <p className="text-[#4E6156] text-sm sm:text-base font-normal leading-relaxed mb-6 max-w-sm">
            برای دریافت صفحه‌ای که باید بخوانید، دکمه زیر را بزنید.
          </p>

          {/* Live Khatm Stats Summary */}
          <KhatmStats
            currentKhatm={khatmState.currentKhatm}
            lastAssignedPage={khatmState.lastAssignedPage}
            completedKhatms={khatmState.completedKhatms}
            isLoading={isInitialConnecting}
          />

          {/* Error Message if any */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full mb-5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] p-3.5 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 text-right"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#DC2626]" />
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{errorMessage}</p>
                  <button
                    onClick={handleGetPage}
                    className="mt-2 text-xs font-semibold underline hover:text-[#7F1D1D] inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>تلاش دوباره</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Big Action Button: «دریافت صفحه» */}
          <button
            id="get-quran-page-btn"
            onClick={handleGetPage}
            disabled={isLoading || isThrottled}
            aria-label="دریافت صفحه از قرآن کریم"
            className={`
              w-full py-4 sm:py-4.5 px-6 rounded-2xl font-bold text-lg sm:text-xl
              flex items-center justify-center gap-3 transition-all duration-300
              shadow-lg active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#1B4332]/25
              ${
                isLoading || isThrottled
                  ? 'bg-[#3A5D4D] text-white/80 cursor-not-allowed opacity-90 shadow-none'
                  : 'bg-[#1B4332] hover:bg-[#153628] text-white shadow-[#1B4332]/25 hover:shadow-xl hover:shadow-[#1B4332]/30 cursor-pointer'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="font-semibold">در حال دریافت صفحه...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-6 h-6 text-[#E9D5B3]" />
                <span className="font-bold">دریافت صفحه</span>
                <Sparkles className="w-4 h-4 text-[#E9D5B3] opacity-80" />
              </>
            )}
          </button>

          {/* Assigned Page Display */}
          <div className="w-full mt-6">
            <AnimatePresence mode="wait">
              {currentAllocation ? (
                <AssignedPageCard
                  key={`${currentAllocation.khatmNumber}-${currentAllocation.pageNumber}`}
                  allocation={currentAllocation}
                  onGetAnotherPage={handleGetPage}
                  isLoading={isLoading || isThrottled}
                />
              ) : (
                <div className="py-6 px-4 rounded-2xl bg-[#FAF7F0]/60 border border-dashed border-[#DDD5C5] text-[#7A8A81] text-xs sm:text-sm">
                  <p>
                    صفحات به ترتیب از ۱ تا ۶۰۴ بین تمامی مشارکت‌کنندگان تخصیص داده می‌شود.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Explanation Note */}
        <div className="mt-6 text-center text-xs text-[#6B7E74] leading-relaxed max-w-sm">
          <p>
            تخصیص صفحات به صورت زنده و اشتراکی بین تمام مؤمنین انجام می‌شود.
            {khatmState.completedKhatms > 0 && (
              <span className="block mt-1 font-medium text-[#1B4332]">
                تاکنون {toPersianDigits(khatmState.completedKhatms)} دور ختم کامل قرآن در این سامانه انجام شده است.
              </span>
            )}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-3 text-center text-xs text-[#8F9E96] z-10 font-light">
        <p>همگام در ثواب تلاوت کلام‌الله مجید</p>
      </footer>
    </div>
  );
}
