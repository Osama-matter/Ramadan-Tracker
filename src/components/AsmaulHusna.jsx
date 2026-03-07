import React, { useState } from 'react';
import { ASMAUL_HUSNA } from '../data/adhkar/asmaulHusnaData';

const AsmaulHusna = () => {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 text-center">
      <div className="py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">أسماء الله الحسنى</h2>
        <p className="text-text-mid text-sm">وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا</p>
      </div>

      <div className="grid grid-cols-3 gap-3 px-2">
        {ASMAUL_HUSNA.map((item, index) => (
          <button 
            key={index}
            onClick={() => setSelectedName(item)}
            className="p-4 bg-black/5 border border-black/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-gold/30 transition-all shadow-lg backdrop-blur-sm group active:scale-95"
          >
            <span className="text-gold text-[8px] font-mono opacity-50">{(index + 1).toLocaleString('ar-SA')}</span>
            <span className="text-lg font-bold text-gold-light font-scheherazade group-hover:scale-110 transition-transform">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {selectedName && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedName(null)} />
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] border border-gold/30 rounded-[2.5rem] p-8 text-center shadow-2xl animate-in zoom-in-95">
            <button 
              onClick={() => setSelectedName(null)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-black/5 rounded-full text-gold"
            >✕</button>
            
            <div className="mb-6 text-6xl font-bold text-gold font-scheherazade drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              {selectedName.name}
            </div>
            <div className="h-px w-20 bg-gold/20 mx-auto mb-6"></div>
            <p className="text-text-dark text-lg leading-relaxed font-amiri italic">
              {selectedName.meaning}
            </p>
            <button 
              onClick={() => setSelectedName(null)}
              className="mt-8 w-full py-3 bg-gold/10 text-gold border border-gold/20 rounded-xl font-bold active:scale-95 transition-all"
            >
              سبحان الله
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsmaulHusna;
