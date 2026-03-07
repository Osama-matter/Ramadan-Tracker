import React from 'react';

const AdhkarCard = ({ text, hint, count, currentCount, onIncrement }) => {
  const isDone = currentCount >= count;

  return (
    <div 
      onClick={!isDone ? onIncrement : undefined}
      className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
        isDone 
          ? 'bg-gold/10 border-gold/30 opacity-60' 
          : 'bg-black/5 border-black/10 active:scale-[0.98] hover:border-gold/20'
      }`}
    >
      <p className="text-right text-lg text-ivory font-amiri leading-relaxed mb-4">
        {text}
      </p>
      
      {hint && (
        <p className="text-right text-xs text-gold/80 font-amiri mb-4 border-r-2 border-gold/30 pr-3">
          {hint}
        </p>
      )}

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1">
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-colors ${
                i < currentCount ? 'bg-gold shadow-[0_0_5px_#d4af37]' : 'bg-black/10'
              }`}
            />
          ))}
        </div>
        <div className="text-[10px] font-bold text-gold-light px-3 py-1 bg-black/5 rounded-full border border-black/5">
          {currentCount} / {count}
        </div>
      </div>

      {isDone && (
        <div className="absolute top-2 left-2 text-gold animate-in zoom-in duration-300">
          ✨
        </div>
      )}
    </div>
  );
};

export default AdhkarCard;
