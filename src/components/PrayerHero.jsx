import React, { useState, useEffect } from 'react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useSalahModeContext } from '../contexts/SalahModeContext';

const PrayerHero = () => {
    const { timings, loading, error } = usePrayerTimes();
    const { startSalahMode } = useSalahModeContext();
    const [nextPrayer, setNextPrayer] = useState({ name: '...', time: '...', diff: '...' });

    const prayerNamesAr = {
        Fajr: 'الفجر',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
    };

    useEffect(() => {
        if (!timings) return;

        const updateCountdown = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            let nextP = null;
            let minDiff = Infinity;

            const relevantPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            for (const key of relevantPrayers) {
                const [timeStr] = timings[key].split(' ');
                const [h, m] = timeStr.split(':').map(Number);
                const prayerTime = h * 60 + m;

                if (prayerTime > currentTime && (prayerTime - currentTime) < minDiff) {
                    minDiff = prayerTime - currentTime;
                    nextP = {
                        key,
                        name: prayerNamesAr[key],
                        hr: h,
                        min: m,
                        diffMinutes: minDiff
                    };
                }
            }

            // If all prayers today have passed, next is Fajr tomorrow
            if (!nextP) {
                const [timeStr] = timings.Fajr.split(' ');
                const [h, m] = timeStr.split(':').map(Number);
                const tomorrowFajr = (h + 24) * 60 + m;
                nextP = {
                    key: 'Fajr',
                    name: prayerNamesAr.Fajr,
                    hr: h,
                    min: m,
                    diffMinutes: tomorrowFajr - currentTime
                };
            }

            const formatTime = (h, m) => {
                const period = h >= 12 ? 'مساءً' : 'صباحاً';
                const h12 = h % 12 || 12;
                return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
            };

            const hoursLeft = Math.floor(nextP.diffMinutes / 60);
            const minsLeft = nextP.diffMinutes % 60;

            setNextPrayer({
                key: nextP.key,
                name: nextP.name,
                time: formatTime(nextP.hr, nextP.min),
                diff: `${hoursLeft}:${minsLeft.toString().padStart(2, '0')}`
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, [timings]);

    if (loading) return <div className="text-text-mid text-center py-4 text-sm animate-pulse">جاري جلب المواقيت...</div>;
    if (error) return <div className="text-red-400/80 text-center py-4 text-xs">{error}</div>;

    const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <div className="bg-[#1B4332]/40 backdrop-blur-md border border-black/10 rounded-2xl p-4 mb-5 relative z-10 shadow-lg mt-2">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="text-text-dark text-xs mb-1 font-medium tracking-wide">الصلاة القادمة</div>
                    <div className="text-white text-3xl font-extrabold tracking-wide font-scheherazade">{nextPrayer.name}</div>
                    <div className="text-gold-light text-sm font-bold mt-1 tracking-wider">{nextPrayer.time}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="bg-gold/20 border border-gold/30 rounded-xl px-4 py-2 text-center shadow-inner min-w-[80px]">
                        <div className="text-white/60 text-[10px] font-medium mb-1 tracking-widest">بعد</div>
                        <div className="text-gold-light text-xl font-extrabold tabular-nums tracking-widest">{nextPrayer.diff}</div>
                    </div>
                    <button
                        onClick={() => startSalahMode(10)}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-colors text-[10px] font-bold text-white shadow-sm"
                    >
                        <span>وضع الصلاة</span>
                        <span className="text-base leading-none">🕌</span>
                    </button>
                </div>
            </div>

            <div className="flex justify-between gap-1.5 mt-2">
                {mainPrayers.map((key) => {
                    const isActive = nextPrayer.key === key;
                    const timeStr = timings[key].split(' ')[0];
                    const [h, m] = timeStr.split(':').map(Number);
                    const h12 = h % 12 || 12;
                    const formattedTime = `${h12}:${m.toString().padStart(2, '0')}`;

                    return (
                        <div
                            key={key}
                            className={`flex-1 text-center py-2.5 px-1 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 shadow-md transform scale-105'
                                : 'bg-black/5 border border-black/5'
                                }`}
                        >
                            <div className={`text-[10px] mb-1.5 font-bold tracking-wider ${isActive ? 'text-gold-light' : 'text-text-mid'}`}>
                                {prayerNamesAr[key]}
                            </div>
                            <div className={`text-sm font-extrabold tabular-nums ${isActive ? 'text-white' : 'text-text-dark'}`}>
                                {formattedTime}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PrayerHero;
