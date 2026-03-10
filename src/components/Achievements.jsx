import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const BADGES = [
  {
    id: 'early_bird',
    name: 'الفجر في وقته',
    icon: '🌅',
    description: 'المحافظة على صلاة الفجر 3 أيام متتالية',
    condition: (data) => {
      const days = data.ramadanDays || [];
      let streak = 0;
      for (let i = days.length - 1; i >= 0; i--) {
        if (days[i]?.tasks?.fajr) { streak++; if (streak >= 3) return true; }
        else streak = 0;
      }
      return false;
    },
  },
  {
    id: 'dhikr_master',
    name: 'الذاكر',
    icon: '📿',
    description: 'إتمام 500 تسبيحة في يوم واحد',
    condition: (data) => (data.tasbeehTotal || 0) >= 500,
  },
  {
    id: 'quran_reader',
    name: 'القارئ',
    icon: '📖',
    description: 'قراءة 10 صفحات من المصحف',
    condition: (data) => (data.quranPages || 0) >= 10,
  },
  {
    id: 'generous_soul',
    name: 'الكريم',
    icon: '🤲',
    description: 'تسجيل صدقة في المتتبع',
    condition: (data) => (data.ramadanDays || []).some(d => d?.tasks?.sadaqah),
  },
  {
    id: 'consistent_user',
    name: 'المثابر',
    icon: '🔥',
    description: 'استخدام التطبيق لمدة 7 أيام متتالية',
    condition: (data) => (data.stats?.streak || 0) >= 7,
  },
  {
    id: 'last10_starter',
    name: 'ابن العشر',
    icon: '⭐',
    description: 'إكمال خطة يوم كامل من العشر الأواخر',
    condition: (data) => {
      for (let d = 21; d <= 30; d++) {
        const prog = STORAGE_SERVICE.getItem(`athr_last10_day_${d}`, {});
        if (Object.values(prog).filter(Boolean).length >= 5) return true;
      }
      return false;
    },
  },
  {
    id: 'planner_pro',
    name: 'المخطط',
    icon: '🗓️',
    description: 'إضافة 3 مهام في جدول الأثر',
    condition: () => {
      let total = 0;
      for (let d = 1; d <= 30; d++) {
        const tasks = STORAGE_SERVICE.getItem(`athr_planner_tasks_day_${d}`, []);
        total += tasks.length;
        if (total >= 3) return true;
      }
      return false;
    },
  },
  {
    id: 'zakat_giver',
    name: 'المزكي',
    icon: '💰',
    description: 'حساب الزكاة في حاسبة الأثر',
    condition: (data) => !!data.zakatCalculated,
  },
  {
    id: 'points_100',
    name: 'مبتدئ الأثر',
    icon: '🎖️',
    description: 'جمع أول 100 نقطة أثر',
    condition: (data) => (data.stats?.points || 0) >= 100,
  },
  {
    id: 'points_500',
    name: 'مجتهد الأثر',
    icon: '🥇',
    description: 'جمع 500 نقطة أثر',
    condition: (data) => (data.stats?.points || 0) >= 500,
  },
];

const Achievements = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    const stats = STORAGE_SERVICE.getItem('athr_user_stats', {});
    const ramadanDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
    const tasbeehTotal = STORAGE_SERVICE.getItem('athr_tasbeeh_total_today', 0);
    const quranPages = STORAGE_SERVICE.getItem('athr_quran_pages_total', 0);
    const zakatCalc = STORAGE_SERVICE.getItem('athr_zakat_calculated', false);

    const data = { stats, ramadanDays, tasbeehTotal, quranPages, zakatCalculated: zakatCalc };

    const earned = BADGES.filter(b => {
      try { return b.condition(data); }
      catch { return false; }
    }).map(b => b.id);

    setEarnedBadges(earned);
    STORAGE_SERVICE.setItem('athr_earned_badges', earned);
  }, []);

  const earnedCount = earnedBadges.length;
  const totalCount = BADGES.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-1">
          🏅 أوسمة الأثر
        </h2>
        <p className="text-text-mid text-sm font-amiri">
          إنجازاتك المباركة في رحلتك الإيمانية
        </p>
      </div>

      {/* Progress */}
      <div className="mx-2 bg-surface border border-black/5 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-green-main font-tajawal">
            الوسوم المحققة
          </span>
          <span className="text-sm font-bold text-gold font-mono">
            {earnedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-light to-gold-dark rounded-full transition-all duration-1000"
            style={{ width: `${totalCount > 0 ? (earnedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        {BADGES.map((badge) => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center gap-2 ${isEarned
                ? 'bg-surface border-gold/30 shadow-lg shadow-gold/10'
                : 'bg-black/3 border-black/5 grayscale opacity-40'
                }`}
            >
              {isEarned && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark rounded-t-full" />
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${isEarned ? 'bg-gold/10 scale-110' : 'bg-black/5'
                }`}>
                {badge.icon}
              </div>

              <h3 className={`font-bold font-scheherazade text-base ${isEarned ? 'text-gold-dark' : 'text-text-mid'
                }`}>
                {badge.name}
              </h3>

              <p className="text-[10px] text-text-mid leading-relaxed font-amiri px-1">
                {badge.description}
              </p>

              {isEarned && (
                <div className="mt-1 bg-green-main text-white text-[9px] px-3 py-0.5 rounded-full font-bold">
                  ✓ تم الإنجاز
                </div>
              )}
            </div>
          );
        })}
      </div>

      {earnedCount === 0 && (
        <div className="text-center py-8 text-text-mid text-sm font-amiri opacity-60">
          <div className="text-4xl mb-3">🔒</div>
          <p>أكمل العبادات والمهام لفتح الأوسمة</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
