import React from 'react';

const StreakCard = ({ streak = 0, points = 0 }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-center">
        <div className="text-2xl mb-1">🔥</div>
        <div className="text-green-main font-bold text-lg">{streak}</div>
        <div className="text-text-mid text-[10px]">أيام متتالية</div>
      </div>
      <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-center">
        <div className="text-2xl mb-1">⭐</div>
        <div className="text-green-main font-bold text-lg">{points}</div>
        <div className="text-text-mid text-[10px]">نقطة أثر</div>
      </div>
    </div>
  );
};

export default StreakCard;
