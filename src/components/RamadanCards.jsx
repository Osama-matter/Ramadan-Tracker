import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const RamadanCards = () => {
  const cards = [
    { id: 1, text: 'رمضان كريم - كل عام وأنتم بخير', bg: 'from-[#0d1952] to-[#03050f]' },
    { id: 2, text: 'اللهم بلغنا ليلة القدر', bg: 'from-[#2e004f] to-[#03050f]' },
    { id: 3, text: 'مبارك عليكم الشهر الفضيل', bg: 'from-[#003d2e] to-[#03050f]' },
    { id: 4, text: 'تقبل الله صيامكم وقيامكم', bg: 'from-[#4b0000] to-[#03050f]' },
  ];

  const [customText, setCustomText] = useState('');
  const [selectedBg, setSelectedBg] = useState(cards[0].bg);

  const handleShare = async (text) => {
    if (window.Capacitor && window.Capacitor.Plugins.Share) {
      try {
        await window.Capacitor.Plugins.Share.share({
          title: 'بطاقة رمضانية',
          text: text,
          url: 'https://github.com/osama-matter/Ramadan-Tracker',
          dialogTitle: 'شارك التهنئة مع أحبابك'
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: 'بطاقة رمضانية',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('تم نسخ النص لمشاركته!');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 text-center">
      <div className="py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">بطاقات رمضانية</h2>
        <p className="text-text-mid text-sm">صمم وشارك أجمل التهاني مع أحبابك</p>
      </div>

      <div className="space-y-6 px-4">
        <div className={`aspect-square w-full max-w-sm mx-auto bg-gradient-to-br ${selectedBg} border-2 border-gold rounded-3xl flex flex-col items-center justify-center p-8 shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0 0 L100 100 M100 0 L0 100%22 stroke=%22%23d4af37%22 stroke-width=%220.5%22/%3E%3C/svg%3E')]"></div>
          <p className="text-2xl font-bold text-gold font-scheherazade leading-relaxed z-10">
            {customText || cards[0].text}
          </p>
          <div className="absolute bottom-6 text-[10px] text-gold/60 font-scheherazade tracking-widest">تطبيق أثر</div>
        </div>

        <div className="flex gap-2 justify-center">
          {cards.map(c => (
            <button 
              key={c.id}
              onClick={() => setSelectedBg(c.bg)}
              className={`w-8 h-8 rounded-full border border-black/20 bg-gradient-to-br ${c.bg} ${selectedBg === c.bg ? 'ring-2 ring-gold' : ''}`}
            />
          ))}
        </div>

        <textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="اكتب نصك الخاص هنا..."
          className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 text-text-dark text-sm font-amiri h-24 outline-none focus:border-gold/30 transition-all"
        />

        <button 
          onClick={() => handleShare(customText || cards[0].text)}
          className="w-full py-4 bg-gold text-green-main font-bold rounded-2xl active:scale-95 transition-all shadow-lg"
        >
          مشاركة البطاقة ✨
        </button>
      </div>
    </div>
  );
};

export default RamadanCards;
