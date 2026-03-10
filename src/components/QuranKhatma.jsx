import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const QuranKhatma = () => {
  const [juzData, setJuzData] = useState(() => STORAGE_SERVICE.getItem('athr_juz_progress', Array(30).fill(0)));
  const [khatmaCount, setKhatmaCount] = useState(() => STORAGE_SERVICE.getItem('athr_khatma_count', 1));

  useEffect(() => {
    STORAGE_SERVICE.setItem('athr_juz_progress', juzData);
  }, [juzData]);

  const toggleJuz = (index) => {
    const updated = [...juzData];
    // Toggle: 0 (not started) -> 1 (done) -> 0
    updated[index] = updated[index] === 1 ? 0 : 1;
    setJuzData(updated);
  };

  const completedJuz = juzData.filter(v => v === 1).length;
  const progressPercent = Math.round((completedJuz / 30) * 100);

  const juzNames = [
    "الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر",
    "١١", "١٢", "١٣", "١٤", "١٥", "١٦", "١٧", "١٨", "١٩", "٢٠",
    "٢١", "٢٢", "٢٣", "٢٤", "٢٥", "٢٦", "٢٧", "٢٨", "٢٩", "٣٠"
  ];

  const getMilestone = () => {
    if (completedJuz >= 30) return "ما شاء الله! ختمت القرآن الكريم 🎉";
    if (completedJuz >= 20) return "وصلت للثلث الأخير! استمر 🌟";
    if (completedJuz >= 10) return "أتممت الثلث الأول، بوركت جهودك ✨";
    return "انطلق في رحلة الختمة المباركة 💪";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-24 px-2">
      <div className="text-center relative py-10 overflow-hidden rounded-[3rem] bg-gradient-to-b from-gold/20 via-transparent to-transparent">
        {/* Animated background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/10 blur-[80px] rounded-full animate-pulse" />

        <h2 className="text-5xl font-bold text-green-main dark:text-gold-light font-scheherazade relative">خريطة الختمة</h2>
        <p className="text-text-mid dark:text-gold/60 text-[10px] font-tajawal tracking-[0.4em] uppercase mt-2">Quran Journey Map</p>

        <div className="mt-8 flex justify-center items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/5 dark:text-white/5" />
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progressPercent) / 100} strokeLinecap="round" className="text-gold transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-green-main dark:text-white">{progressPercent}%</span>
              <span className="text-[10px] text-text-mid dark:text-gold/40 font-bold uppercase">إنجاز</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gold-dark dark:text-gold font-scheherazade">{completedJuz}/30</div>
            <div className="text-sm font-amiri text-text-mid dark:text-[#9ea4b0]">جزءاً مكتملاً</div>
          </div>
        </div>
      </div>

      <div className="bg-surface/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2.5rem] p-6 shadow-sm">
        <p className="text-center text-lg font-amiri text-green-main dark:text-gold-light italic">
          "{getMilestone()}"
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="text-2xl font-bold text-green-main dark:text-white font-scheherazade">الأجزاء الثلاثون</h3>
          <span className="text-[10px] text-gold-dark dark:text-gold font-bold bg-gold/10 px-3 py-1 rounded-full uppercase tracking-tighter">Tap to Check</span>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {juzData.map((status, i) => (
            <button
              key={i}
              onClick={() => toggleJuz(i)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-500 transform active:scale-90 border-2 ${status === 1
                  ? 'bg-gold border-gold text-green-main shadow-lg shadow-gold/20 scale-105'
                  : 'bg-surface dark:bg-white/5 border-black/5 dark:border-white/10 text-text-mid dark:text-white/40 hover:border-gold/30'
                }`}
            >
              <span className={`text-xl font-bold font-scheherazade transition-all ${status === 1 ? 'scale-125' : ''}`}>
                {status === 1 ? '✓' : juzNames[i]}
              </span>
              <span className="text-[8px] font-bold mt-1 opacity-60 uppercase tracking-tighter">Juz {i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-main to-green-mid p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
        <div className="relative flex justify-between items-center">
          <div className="space-y-1">
            <h4 className="text-xl font-bold font-scheherazade">برنامج الختمة</h4>
            <p className="text-xs opacity-70 font-amiri">كم ختمة تنوي هذا الشهر؟</p>
          </div>
          <select
            value={khatmaCount}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setKhatmaCount(val);
              STORAGE_SERVICE.setItem('athr_khatma_count', val);
            }}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm outline-none backdrop-blur-md"
          >
            <option value="1" className="text-black">ختمة واحدة</option>
            <option value="2" className="text-black">ختمتان</option>
            <option value="3" className="text-black">٣ ختمات</option>
          </select>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="text-[10px] opacity-60 uppercase mb-1">المعدل اليومي</div>
            <div className="text-lg font-bold">{Math.round((30 * khatmaCount / 30) * 10) / 10} جزء</div>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="text-[10px] opacity-60 uppercase mb-1">الصفحات الكلية</div>
            <div className="text-lg font-bold">{604 * khatmaCount} ص</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuranKhatma;
