import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const BADGES = [
  { id: 'early_bird', name: 'الفجر في وقته', icon: '🌅', description: 'المحافظة على صلاة الفجر 3 أيام متتالية' },
  { id: 'dhikr_master', name: 'الذاكر', icon: '📿', description: 'إتمام 1000 تسبيحة في يوم واحد' },
  { id: 'quran_reader', name: 'القارئ', icon: '📖', description: 'قراءة 10 صفحات من المصحف' },
  { id: 'generous_soul', name: 'الكريم', icon: '🤲', description: 'تسجيل صدقة في المتتبع' },
  { id: 'consistent_user', name: 'المثابر', icon: '🔥', description: 'استخدام التطبيق لمدة 7 أيام متتالية' },
];

const Achievements = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    // Determine earned badges based on actual stats
    const stats = STORAGE_SERVICE.getItem('athr_stats', {});
    const ramadanDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
    const tasbeehTotal = STORAGE_SERVICE.getItem('athr_tasbeeh_total_today', 0);
    
    let earned = [];

    // 1. Early Bird (Fajr for 3 consecutive days)
    let consecutiveFajr = 0;
    for (let i = ramadanDays.length - 1; i >= 0; i--) {
      if (ramadanDays[i].tasks?.fajr) {
        consecutiveFajr++;
        if (consecutiveFajr >= 3) {
          earned.push('early_bird');
          break;
        }
      } else {
        consecutiveFajr = 0;
      }
    }

    // 2. Dhikr Master (1000 tasbeeh today)
    if (tasbeehTotal >= 1000) earned.push('dhikr_master');

    // 3. Generous Soul (Sadaqah task done at least once)
    const hasSadaqah = ramadanDays.some(day => day.tasks?.sadaqah);
    if (hasSadaqah) earned.push('generous_soul');

    // 4. Consistent User (Streak >= 7)
    if (stats.streak >= 7) earned.push('consistent_user');

    setEarnedBadges(earned);
    STORAGE_SERVICE.setItem('athr_earned_badges', earned);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">أوسمة الأثر</h2>
        <p className="text-text-mid text-sm font-amiri">إنجازاتك المباركة في رحلتك الإيمانية</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-2">
        {BADGES.map((badge) => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <div 
              key={badge.id}
              className={`relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center gap-3 ${
                isEarned 
                  ? 'bg-white dark:bg-[#1a1c23] border-gold/30 shadow-lg' 
                  : 'bg-black/5 border-black/5 grayscale opacity-40'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-2 ${
                isEarned ? 'bg-gold/10 scale-110 animate-bounce-subtle' : 'bg-black/5'
              }`}>
                {badge.icon}
              </div>
              <h3 className={`font-bold font-scheherazade text-lg ${isEarned ? 'text-gold-dark' : 'text-text-mid'}`}>
                {badge.name}
              </h3>
              <p className="text-[10px] text-text-mid leading-relaxed font-amiri px-2">
                {badge.description}
              </p>
              {isEarned && (
                <div className="absolute top-2 right-2 bg-green-main text-white text-[8px] px-2 py-0.5 rounded-full font-bold">
                  تم الإنجاز
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
