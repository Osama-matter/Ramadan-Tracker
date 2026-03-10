import React, { useState, useEffect, useMemo } from 'react';
import AdhkarSection from './AdhkarSection';
import { STORAGE_SERVICE } from '../services/storageService';

const QadrWidget = () => {
  // Use today's Ramadan day if it's in the last ten days (21-30), otherwise default to 21
  const defaultNight = useMemo(() => {
    const today = new Date();
    const ramadanStart = new Date('2026-02-20T00:00:00');
    const diff = today - ramadanStart;
    const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(day, 21), 30);
  }, []);

  const [currentNight, setCurrentNight] = useState(defaultNight);
  const [daysLeft, setDaysLeft] = useState(0);
  const [completion, setCompletion] = useState({});
  const qadrStartDate = new Date('2026-03-12T00:00:00');

  useEffect(() => {
    const calculateDays = () => {
      const diff = qadrStartDate.getTime() - new Date().getTime();
      setDaysLeft(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    };
    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  // Load completion state for the selected night
  useEffect(() => {
    const saved = STORAGE_SERVICE.getItem(`athr_qadr_prog_night_${currentNight}`, {});
    setCompletion(saved);
  }, [currentNight]);

  const toggleAction = (id) => {
    const updated = { ...completion, [id]: !completion[id] };
    setCompletion(updated);
    STORAGE_SERVICE.setItem(`athr_qadr_prog_night_${currentNight}`, updated);
  };

  const oddNights = [21, 23, 25, 27, 29];
  const allLastTenNights = Array.from({ length: 10 }, (_, i) => 21 + i);

  const dailyProgram = [
    { id: 'qadr_quran', title: 'ورد القرآن اليومي', icon: '📖', desc: 'قراءة جزء أو أكثر بتدبر' },
    { id: 'qadr_salah', title: 'القيام والتهجد', icon: '📿', desc: 'صلاة ١١ ركعة أو أكثر' },
    { id: 'qadr_dua', title: 'دعاء ليلة القدر', icon: '🤲', desc: 'الإلحاح بدعاء العفو' },
    { id: 'qadr_charity', title: 'الصدقة اليومية', icon: '💰', desc: 'تصدق ولو بمبلغ بسيط' },
    { id: 'qadr_dhikr', title: 'ذكر السحر', icon: '✨', desc: 'الاستغفار والتسبيح قبل الفجر' },
  ];

  const copyDua = () => {
    navigator.clipboard.writeText("اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي");
    if (navigator.vibrate) navigator.vibrate(50);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-32 px-2 transition-colors">
      {/* Dynamic Header */}
      <div className="text-center py-10 relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-green-main/10 to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gold/10 blur-[100px] rounded-full animate-pulse" />
        <div className="text-4xl mb-4 relative">⭐</div>
        <h2 className="text-4xl font-bold text-green-main dark:text-white font-scheherazade mb-2 relative">العشر الأواخر</h2>
        <p className="text-text-mid dark:text-gold text-[10px] font-tajawal tracking-[0.4em] uppercase relative">The Golden Ten Nights</p>
      </div>

      {/* Countdown Card - High Contrast Theme */}
      <div className="relative overflow-hidden bg-green-main dark:bg-[#0d1348] border-2 border-gold/40 rounded-[2.5rem] p-10 text-center shadow-2xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'%23d4af37\'/%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 space-y-2">
          <div className="text-gold-light text-[11px] tracking-[0.3em] font-bold">باقي على الانطلاق</div>
          <div className="text-6xl font-bold text-gold font-scheherazade drop-shadow-[0_2px_15px_rgba(212,175,55,0.4)]">{daysLeft} يوم</div>
          <div className="text-white/80 text-xs font-amiri tracking-widest leading-relaxed pt-2">
            ٢١ - ٣٠ رمضان ١٤٤٧ هـ<br />
            (١٢ مارس - ١٩ مارس ٢٠٢٦ م)
          </div>
        </div>
      </div>

      {/* Night Selection Grid */}
      <div className="space-y-6">
        <h3 className="text-green-main dark:text-gold text-xs font-bold text-center tracking-widest uppercase">اختر الليلة لمتابعة البرنامج</h3>
        <div className="grid grid-cols-5 gap-3">
          {allLastTenNights.map(n => {
            const isOdd = oddNights.includes(n);
            return (
              <button
                key={n}
                onClick={() => setCurrentNight(n)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${currentNight === n
                    ? 'bg-gold border-gold text-green-main shadow-lg scale-110'
                    : 'bg-surface dark:bg-white/5 border-black/5 dark:border-white/10 text-text-mid dark:text-gold-light/60'
                  }`}
              >
                <div className={`text-lg font-bold ${isOdd ? 'underline decoration-gold/50 underline-offset-4' : ''}`}>
                  {n.toLocaleString('ar-SA')}
                </div>
                <span className="text-[8px] font-bold uppercase">{isOdd ? 'وترية' : 'زوجية'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Practical Program Section */}
      <div className="space-y-6">
        <div className="flex flex-col items-center px-4">
          <h3 className="text-3xl font-bold text-green-main dark:text-white font-scheherazade">برنامج ليلة {currentNight.toLocaleString('ar-SA')}</h3>
          <div className="h-1 w-12 bg-gold/50 rounded-full mt-2" />
        </div>

        <div className="grid gap-4">
          {dailyProgram.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleAction(item.id)}
              className={`flex items-center gap-5 p-6 rounded-[2.2rem] border transition-all duration-500 text-right group shadow-sm ${completion[item.id]
                  ? 'bg-gold/15 border-gold/60 dark:bg-gold/20'
                  : 'bg-surface dark:bg-white/5 border-black/5 dark:border-white/20 hover:border-gold/30'
                }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-700 ${completion[item.id] ? 'bg-gold text-green-main scale-110' : 'bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10'
                }`}>
                {completion[item.id] ? '✓' : item.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className={`text-xl font-bold font-tajawal transition-all ${completion[item.id] ? 'line-through text-green-main/60 dark:text-gold' : 'text-text-dark dark:text-white'}`}>
                  {item.title}
                </div>
                <div className={`text-[13px] leading-relaxed font-amiri ${completion[item.id] ? 'text-black/40 dark:text-white/40' : 'text-text-mid dark:text-white/70'}`}>
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Master Dua Card */}
      <div className="bg-gradient-to-br from-green-main to-green-mid dark:from-[#1a1f4d] dark:to-[#0a0c12] border-2 border-gold/40 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 p-5 text-white/20 dark:text-gold/20 text-[10px] font-scheherazade">دعاء ليلة القدر</div>

        <p className="text-4xl font-bold text-gold-light dark:text-gold font-scheherazade leading-relaxed mb-8 drop-shadow-md">
          اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ<br />تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
        </p>

        <button
          onClick={copyDua}
          className="w-full bg-gold text-green-main hover:bg-gold-light rounded-2xl py-4 text-sm font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
        >
          <span>📋</span> نسخ الدعاء المأثور
        </button>
      </div>

      {/* Recommended Adhkar Subsection */}
      <div className="space-y-8 pt-6">
        <div className="flex items-center justify-center gap-4 text-gold/30">
          <div className="h-[2px] w-12 bg-current"></div>
          <span className="font-scheherazade text-3xl text-green-main dark:text-gold">خلوة الأذكار</span>
          <div className="h-[2px] w-12 bg-current"></div>
        </div>
        <div className="bg-surface dark:bg-white/5 rounded-[2.5rem] p-4 border border-black/5 dark:border-white/10 shadow-sm relative z-10">
          <AdhkarSection type="qadr" />
        </div>
      </div>
    </div>
  );
};

export default QadrWidget;
