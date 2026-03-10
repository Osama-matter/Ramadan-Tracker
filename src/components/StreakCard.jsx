import React from 'react';

const StreakCard = ({ streak = 0, points = 0 }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl">🔥</div>
        <div className="text-center">
          <div className="text-2xl font-black text-text-dark dark:text-white leading-none">{streak}</div>
          <div className="text-[10px] text-text-mid dark:text-gray-400 font-bold mt-1">أيام متتالية</div>
        </div>
      </div>

      <div className="bg-surface/50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl">⭐</div>
        <div className="text-center">
          <div className="text-2xl font-black text-text-dark dark:text-white leading-none">{points}</div>
          <div className="text-[10px] text-text-mid dark:text-gray-400 font-bold mt-1">نقطة أثر</div>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;
