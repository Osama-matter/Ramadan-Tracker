import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';
import { MORNING_ADHKAR, EVENING_ADHKAR, GENERAL_ADHKAR } from '../data/adhkar';

const DhikrInspiration = () => {
  const [dhikr, setDhikr] = useState(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = STORAGE_SERVICE.getItem('athr_dhikr_day', null);

    if (saved && saved.date === today) {
      setDhikr(saved.data);
    } else {
      const all = [...MORNING_ADHKAR, ...EVENING_ADHKAR, ...GENERAL_ADHKAR];
      const random = all[Math.floor(Math.random() * all.length)];
      const newData = { date: today, data: random };
      STORAGE_SERVICE.setItem('athr_dhikr_day', newData);
      setDhikr(random);
    }
  }, []);

  if (!dhikr) return null;

  const handleShare = async () => {
    if (window.Capacitor && window.Capacitor.Plugins.Share) {
      await window.Capacitor.Plugins.Share.share({
        title: 'خاطرة اليوم - تطبيق أثر',
        text: `${dhikr.text}\n\nتمت المشاركة من تطبيق أثر - رفيقك في رمضان`,
        url: 'https://github.com/osama-matter/Ramadan-Tracker',
        dialogTitle: 'شارك الخاطرة مع أحبابك'
      });
    }
  };

  return (
    <div className="mx-2 my-6 animate-in fade-in zoom-in duration-700">
      <div className="relative overflow-hidden bg-[#1a1c23] rounded-[2.5rem] border border-gold/20 shadow-2xl p-8 group">
        {/* Animated Ornaments */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-700"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-main/10 rounded-full blur-2xl group-hover:bg-green-main/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-gold/20 mb-2">
              ✨
            </div>
            <span className="text-xs font-bold text-gold tracking-[0.2em] uppercase font-tajawal">خاطرة اليوم</span>
          </div>

          <div className="relative">
            <span className="absolute -top-4 -right-4 text-4xl text-gold/20 font-serif">"</span>
            <p className="text-xl md:text-2xl font-scheherazade leading-relaxed text-gray-100 px-4">
              {dhikr.text}
            </p>
            <span className="absolute -bottom-8 -left-4 text-4xl text-gold/20 font-serif">"</span>
          </div>

          <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>

          <button 
            onClick={handleShare}
            className="flex items-center gap-3 px-6 py-3 bg-gold/10 hover:bg-gold/20 border border-gold/20 rounded-2xl text-xs font-bold text-gold transition-all active:scale-95 group/btn"
          >
            <span className="group-hover/btn:scale-110 transition-transform">🔗</span>
            <span>مشاركة الأجر</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DhikrInspiration;
