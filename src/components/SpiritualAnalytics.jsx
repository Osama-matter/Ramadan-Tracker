import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { STORAGE_SERVICE } from '../services/storageService';

const SpiritualAnalytics = ({ data: propData }) => {
  const chartData = useMemo(() => {
    if (propData && propData.length > 0) return propData;

    const savedDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
    const last7Days = savedDays.slice(-7);

    if (last7Days.length === 0) {
      // Default placeholder data if no history yet
      return [
        { day: 'يوم ١', prayers: 0 },
        { day: 'يوم ٢', prayers: 0 },
        { day: 'يوم ٣', prayers: 0 },
        { day: 'يوم ٤', prayers: 0 },
        { day: 'يوم ٥', prayers: 0 },
        { day: 'يوم ٦', prayers: 0 },
        { day: 'يوم ٧', prayers: 0 },
      ];
    }

    return last7Days.map(day => {
      const tasks = day.tasks || {};
      const prayersDone = [tasks.fajr, tasks.dhuhr, tasks.asr, tasks.maghrib, tasks.isha].filter(Boolean).length;
      return {
        day: day.arNum || day.num || `يوم ${last7Days.indexOf(day) + 1}`,
        prayers: prayersDone
      };
    });
  }, [propData]);

  const stats = useMemo(() => {
    const savedDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
    if (savedDays.length === 0) return { prayers: 0, dhikr: 0, quran: 0 };

    const totalDays = savedDays.length;
    const prayerTotal = savedDays.reduce((acc, day) => {
      const t = day.tasks || {};
      return acc + [t.fajr, t.dhuhr, t.asr, t.maghrib, t.isha].filter(Boolean).length;
    }, 0);

    const dhikrTotal = savedDays.filter(day => day.tasks?.dhikr).length;
    const quranTotal = savedDays.filter(day => day.tasks?.quran).length;

    return {
      prayers: totalDays ? Math.round((prayerTotal / (totalDays * 5)) * 100) : 0,
      dhikr: totalDays ? Math.round((dhikrTotal / totalDays) * 100) : 0,
      quran: totalDays ? Math.round((quranTotal / totalDays) * 100) : 0
    };
  }, []);

  return (
    <div className="mb-8 bg-white dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-5 border border-black/10 dark:border-white/5 shadow-xl animate-in fade-in duration-700 delay-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-black dark:text-white font-scheherazade flex items-center gap-2">
            <span className="text-2xl">📈</span> تحليلاتك الإيمانية
          </h2>
          <p className="text-[10px] text-gray-900 dark:text-gray-400 font-tajawal mt-1 font-bold">مراقبة التطور الروحي للأسبوع الحالي</p>
        </div>
        <span className="text-gold-dark dark:text-gold-light text-[9px] px-3 py-1 bg-gold/20 dark:bg-gold/10 rounded-full border border-gold/30 font-bold tracking-wider capitalize whitespace-nowrap">الأسبوع السابع</span>
      </div>

      <div className="h-44 w-full min-h-[176px] min-w-[280px] mb-4 overflow-hidden bg-gray-50/50 rounded-2xl p-2 border border-black/5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrayers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#000000', fontSize: 10, fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '12px', textAlign: 'right', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
              itemStyle={{ color: '#C9A84C', fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--text-dark)', marginBottom: '4px', fontWeight: 'bold' }}
            />
            <Area
              type="monotone"
              dataKey="prayers"
              name="الصلوات"
              stroke="#2D6A4F"
              fillOpacity={1}
              fill="url(#colorPrayers)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-gray-100 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm rounded-3xl flex flex-col items-center justify-center group hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
          <div className="text-[8px] text-black dark:text-gray-400 mb-1 text-center font-bold tracking-wide uppercase leading-tight">التزام الصلاة</div>
          <div className="text-green-main dark:text-green-light font-black text-center text-xl tabular-nums drop-shadow-sm">{stats.prayers.toLocaleString('ar-SA')}٪</div>
        </div>
        <div className="p-3 bg-gray-100 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-sm rounded-3xl flex flex-col items-center justify-center group hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
          <div className="text-[8px] text-black dark:text-gray-400 mb-1 text-center font-bold tracking-wide uppercase leading-tight">ورد الأذكار</div>
          <div className="text-green-main dark:text-green-light font-black text-center text-xl tabular-nums drop-shadow-sm">{stats.dhikr.toLocaleString('ar-SA')}٪</div>
        </div>
        <div className={`p-3 border transition-all rounded-3xl flex flex-col items-center justify-center shadow-sm group ${stats.quran > 0
          ? 'bg-gold/20 dark:bg-gold/10 border-gold/40'
          : 'bg-gray-100 dark:bg-white/5 border-transparent'
          }`}>
          <p className="text-[8px] text-black dark:text-gray-400 mb-1 text-center font-bold tracking-wide uppercase leading-tight">تلاوة القرآن</p>
          <p className={`text-xl font-black text-center tabular-nums drop-shadow-sm ${stats.quran > 0 ? 'text-gold-dark dark:text-gold-light' : 'text-black dark:text-gray-300'}`}>{stats.quran.toLocaleString('ar-SA')}%</p>
        </div>
      </div>
    </div>
  );
};

export default SpiritualAnalytics;
