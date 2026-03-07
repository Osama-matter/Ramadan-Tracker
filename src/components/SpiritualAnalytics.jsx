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
    <div className="space-y-6 p-4 bg-white rounded-3xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-text-dark">
      <div className="flex justify-between items-center">
        <h3 className="text-gold font-bold text-lg font-scheherazade">تحليلاتك الإيمانية</h3>
        <span className="text-text-mid text-[10px] px-2 py-1 bg-gold-light/5 rounded-full border border-gold-light/10">آخر ٧ أيام</span>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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
              tick={{ fill: '#a8a29e', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '12px', textAlign: 'right', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
              itemStyle={{ color: '#C9A84C', fontWeight: 'bold' }}
              labelStyle={{ color: '#1A1A2E', marginBottom: '4px', fontWeight: 'bold' }}
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
        <div className="p-3 bg-white border border-black/5 shadow-sm rounded-2xl">
          <div className="text-[10px] text-text-mid mb-1 text-center font-bold">التزام الصلاة</div>
          <div className="text-green-main font-bold text-center text-lg">{stats.prayers.toLocaleString('ar-SA')}٪</div>
        </div>
        <div className="p-3 bg-white border border-black/5 shadow-sm rounded-2xl">
          <div className="text-[10px] text-text-mid mb-1 text-center font-bold">ورد الأذكار</div>
          <div className="text-green-main font-bold text-center text-lg">{stats.dhikr.toLocaleString('ar-SA')}٪</div>
        </div>
        <div className="p-3 bg-white border border-black/5 shadow-sm rounded-2xl">
          <div className="text-[10px] text-text-mid mb-1 text-center font-bold">تلاوة القرآن</div>
          <div className="text-green-main font-bold text-center text-lg">{stats.quran.toLocaleString('ar-SA')}٪</div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualAnalytics;
