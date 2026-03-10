import React, { useMemo } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const DashboardStats = ({ stats: propStats }) => {
  const stats = useMemo(() => {
    if (propStats) return propStats;

    const savedDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
    const completedTasks = savedDays.reduce((acc, day) => {
      return acc + Object.values(day.tasks || {}).filter(t => t).length;
    }, 0);
    const totalPossibleTasks = 30 * 8; // 8 tasks per day

    const completedDaysCount = savedDays.filter(d => d.completed).length;

    return {
      today: new Date().toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }),
      ramadanDay: `اليوم ${completedDaysCount + 1}`,
      completed: `${completedTasks} / ${totalPossibleTasks}`,
      remaining: 30 - completedDaysCount
    };
  }, [propStats]);

  const statCards = [
    { label: 'يوم متواصل', value: stats.streak ?? 0, icon: '🔥' },
    { label: 'نقاط أثر', value: stats.points ?? 0, icon: '⭐' },
    { label: 'تسبيحة اليوم', value: stats.tasbeeh ?? 0, icon: '📿' },
  ];

  return (
    <div className="mb-8 animate-in fade-in duration-700 delay-300 px-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-text-dark dark:text-white font-scheherazade flex items-center gap-2">
          <span className="text-2xl">📊</span> إحصائياتك
        </h2>
        <span className="text-[10px] text-text-dark dark:text-gray-400 font-tajawal font-bold uppercase tracking-widest italic">Ramadan 1447</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-surface/40 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl py-5 flex flex-col items-center justify-center text-center shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold/5 dark:bg-gold/10 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
              {card.icon}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-text-dark tabular-nums leading-none">
                {card.value}
              </span>
              <span className="text-[10px] text-text-dark font-bold mt-2 whitespace-nowrap">
                {card.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
