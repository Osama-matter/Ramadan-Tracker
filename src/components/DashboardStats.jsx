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
    <div className="mb-6 animate-in fade-in duration-500 delay-300">
      <h2 className="text-[15px] font-bold text-text-dark mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-gold to-green-light rounded-sm"></span>
        إحصائياتك 📊
      </h2>
      <div className="grid grid-cols-3 gap-2.5">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/95 border border-black/5 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:scale-105 transition-transform"
          >
            <span className="text-[20px] mb-1">{card.icon}</span>
            <span className="text-[20px] font-extrabold text-text-dark">{card.value}</span>
            <span className="text-[10px] text-text-mid mt-0.5">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
