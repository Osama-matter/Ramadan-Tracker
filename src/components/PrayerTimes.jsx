import React, { useState, useEffect } from 'react';

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [location, setLocation] = useState('جاري التحديد...');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState('');

  const prayerNames = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  const fetchTimes = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
      const data = await res.json();
      if (data.code === 200) {
        setTimings(data.data.timings);
        setLocation(data.data.meta.timezone);
        calculateNextPrayer(data.data.timings);
      } else {
        setError('تعذر جلب المواقيت');
      }
    } catch (err) {
      console.error('Failed to fetch prayer times', err);
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const calculateNextPrayer = (times) => {
    const now = new Date();
    const prayerTimes = Object.entries(times)
      .filter(([key]) => prayerNames[key])
      .map(([key, time]) => {
        const [hours, minutes] = time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        return { key, name: prayerNames[key], date: prayerDate };
      })
      .sort((a, b) => a.date - b.date);

    let next = prayerTimes.find(p => p.date > now);
    if (!next) {
      next = { ...prayerTimes[0] };
      next.date.setDate(next.date.getDate() + 1);
    }
    setNextPrayer(next);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (nextPrayer) {
        const now = new Date();
        const diff = nextPrayer.date - now;

        if (diff <= 0) {
          if (timings) calculateNextPrayer(timings);
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown(`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextPrayer, timings]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchTimes(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('يرجى تفعيل GPS لتحديد الموقع');
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  if (loading && !timings) return (
    <div className="p-8 bg-white/95 rounded-3xl animate-pulse flex flex-col items-center justify-center gap-4 border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
      <div className="text-gold-dark font-scheherazade text-xl">جاري تحديد الموقع وحساب المواقيت...</div>
    </div>
  );

  if (error && !timings) return (
    <div className="bg-white/95 p-8 rounded-3xl border border-red-500/20 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="text-4xl mb-4">📍</div>
      <p className="text-red-400 text-sm mb-4 font-amiri">{error}</p>
      <button
        onClick={detectLocation}
        className="px-6 py-2 bg-gold/10 text-gold rounded-full text-xs border border-gold/20 hover:bg-gold/20 transition-all"
      >
        إعادة المحاولة
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Next Prayer Countdown Card */}
      {nextPrayer && (
        <div className="bg-gradient-to-br from-green-main to-green-mid p-6 rounded-3xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🌙</div>
          <div className="text-gold text-xs uppercase tracking-[0.2em] mb-2 font-scheherazade">الصلاة القادمة</div>
          <div className="text-3xl font-bold text-gold font-scheherazade mb-1">{nextPrayer.name}</div>
          <div className="text-4xl font-mono text-gold-light tracking-widest dir-ltr" dir="ltr">{countdown}</div>
          <div className="mt-4 flex justify-center items-center gap-2 text-[10px] text-text-mid">
            <span>📍 {location}</span>
            <button onClick={detectLocation} className="text-gold hover:underline">تحديث</button>
          </div>
        </div>
      )}

      {/* Prayer Times Grid */}
      <div className="bg-white p-5 rounded-3xl border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-3 gap-3">
          {timings && Object.entries(prayerNames).map(([key, name]) => {
            const isNext = nextPrayer?.key === key;
            return (
              <div
                key={key}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all border ${isNext
                    ? 'bg-gold/10 border-gold/30 shadow-lg scale-105 z-10'
                    : 'bg-black/5 border-black/5 opacity-80'
                  }`}
              >
                <span className={`text-[10px] mb-1 ${isNext ? 'text-green-main font-bold' : 'text-text-mid'}`}>
                  {name}
                </span>
                <span className={`text-sm font-bold ${isNext ? 'text-green-main' : 'text-text-dark'}`}>
                  {timings[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
