/**
 * SalahModeContext
 * ═══════════════════════════════════════════════════════
 * - يراقب الوقت كل ثانية
 * - عند دخول وقت أي صلاة → يُشغّل وضع الصلاة تلقائياً
 * - المستخدم يقدر يشغله يدوياً من أي مكان
 * - يحفظ إعدادات المستخدم (أي صلوات + المدة الافتراضية)
 */

import React, {
  createContext, useContext, useState,
  useEffect, useRef, useCallback,
} from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

// ─── مدة كل صلاة الافتراضية بالدقائق ────────────────────────────────────────
const DEFAULT_DURATIONS = {
  fajr:    10,
  dhuhr:   10,
  asr:     10,
  maghrib: 10,
  isha:    10,
};

// ─── أسماء الصلوات ────────────────────────────────────────────────────────────
const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const PRAYER_NAMES_AR = {
  fajr:    'الفجر',
  dhuhr:   'الظهر',
  asr:     'العصر',
  maghrib: 'المغرب',
  isha:    'العشاء',
};

// ─── Helper: "HH:MM" → Date اليوم ─────────────────────────────────────────────
function timeStrToDate(str) {
  if (!str) return null;
  const clean = str.trim().replace(/\s*(AM|PM)\s*/i, '');
  const isPM  = /PM/i.test(str);
  const isAM  = /AM/i.test(str);
  const [hStr, mStr] = clean.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const SalahModeContext = createContext(null);

export const useSalahModeContext = () => {
  const ctx = useContext(SalahModeContext);
  if (!ctx) throw new Error('useSalahModeContext must be used inside SalahModeProvider');
  return ctx;
};

export const SalahModeProvider = ({ children }) => {
  // ── الإعدادات المحفوظة ───────────────────────────────────────────────────
  const [settings, setSettings] = useState(() =>
    STORAGE_SERVICE.getItem('athr_salah_mode_settings', {
      enabled:    true,          // تفعيل الوضع التلقائي
      prayers: {                 // أي صلوات تُفعّله
        fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true,
      },
      durations: DEFAULT_DURATIONS, // مدة كل صلاة
    })
  );

  // ── حالة وضع الصلاة ─────────────────────────────────────────────────────
  const [isActive,       setIsActive]       = useState(false);
  const [timeLeft,       setTimeLeft]       = useState(0);
  const [totalDuration,  setTotalDuration]  = useState(0);
  const [currentPrayer,  setCurrentPrayer]  = useState(null); // اسم الصلاة الحالية

  // ── مراجع داخلية ────────────────────────────────────────────────────────
  const countdownRef   = useRef(null); // interval العداد التنازلي
  const watcherRef     = useRef(null); // interval مراقبة الوقت
  const triggeredRef   = useRef({});   // لتجنب التشغيل المزدوج لنفس الصلاة

  // ── جلب مواقيت الصلاة من Storage ────────────────────────────────────────
  const getTimings = useCallback(() => {
    return STORAGE_SERVICE.getItem('athr_prayer_times', null);
  }, []);

  // ── بدء العداد التنازلي ──────────────────────────────────────────────────
  const startCountdown = useCallback((durationSeconds) => {
    if (countdownRef.current) clearInterval(countdownRef.current);

    setTimeLeft(durationSeconds);
    setTotalDuration(prev => {
      // لو كان شغّالاً بالفعل وتمديد → نزيد
      return prev > 0 ? prev + durationSeconds : durationSeconds;
    });
    setIsActive(true);

    countdownRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
          setIsActive(false);
          setCurrentPrayer(null);
          setTotalDuration(0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  // ── تشغيل يدوي ──────────────────────────────────────────────────────────
  const startSalahMode = useCallback((prayerKey = null, customMinutes = null) => {
    const mins = customMinutes
      || (prayerKey ? settings.durations[prayerKey] : 15)
      || 15;
    setCurrentPrayer(prayerKey ? PRAYER_NAMES_AR[prayerKey] : 'الصلاة');
    setTotalDuration(mins * 60);
    startCountdown(mins * 60);
  }, [settings.durations, startCountdown]);

  // ── تمديد الوقت ─────────────────────────────────────────────────────────
  const extendSalahMode = useCallback((extraMinutes = 5) => {
    const extra = extraMinutes * 60;
    setTimeLeft(t => {
      const newTime = t + extra;
      const endTime = Date.now() + (newTime * 1000);
      STORAGE_SERVICE.setItem('athr_salah_mode_end', endTime);
      window.dispatchEvent(new CustomEvent('athr_salah_mode_change', { 
        detail: { active: true, endTime } 
      }));
      return newTime;
    });
    setTotalDuration(t => t + extra);
  }, []);

  // ── إنهاء يدوي ──────────────────────────────────────────────────────────
  const endSalahMode = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setIsActive(false);
    setTimeLeft(0);
    setTotalDuration(0);
    setCurrentPrayer(null);
    STORAGE_SERVICE.removeItem('athr_salah_mode_end');
    window.dispatchEvent(new CustomEvent('athr_salah_mode_change', { 
      detail: { active: false } 
    }));
  }, []);

  // ── حفظ الإعدادات ────────────────────────────────────────────────────────
  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    STORAGE_SERVICE.setItem('athr_salah_mode_settings', merged);
  }, [settings]);

  // ── مراقب الوقت: يتحقق كل 30 ثانية من دخول وقت الصلاة ─────────────────
  useEffect(() => {
    if (!settings.enabled) return;

    const checkPrayerTime = () => {
      const timings = getTimings();
      if (!timings) return;

      const now        = new Date();
      const nowTime    = now.getTime();
      const todayKey   = now.toDateString(); // مفتاح اليوم لتجنب التكرار

      PRAYER_KEYS.forEach(key => {
        // هل هذه الصلاة مفعّلة في الإعدادات؟
        if (!settings.prayers[key]) return;

        const timeRaw  = timings[key.charAt(0).toUpperCase() + key.slice(1)] || timings[key];
        const prayerDate = timeStrToDate(timeRaw);
        if (!prayerDate) return;

        const prayerTime  = prayerDate.getTime();
        const diffSeconds = Math.abs((nowTime - prayerTime) / 1000);
        const triggerKey  = `${todayKey}_${key}`;

        // نافذة التشغيل: ±90 ثانية من وقت الصلاة
        const isWithinWindow = diffSeconds <= 90;
        // لم يُشغَّل اليوم بعد
        const notTriggeredYet = !triggeredRef.current[triggerKey];
        // الوضع مش شغّال حالياً
        const notAlreadyActive = !isActive;

        if (isWithinWindow && notTriggeredYet && notAlreadyActive) {
          console.log(`[SalahMode] Auto-trigger: ${PRAYER_NAMES_AR[key]}`);
          triggeredRef.current[triggerKey] = true;
          startSalahMode(key);
        }
      });
    };

    // فحص فوري عند التحميل
    checkPrayerTime();

    // ثم كل 30 ثانية
    watcherRef.current = setInterval(checkPrayerTime, 30_000);

    return () => {
      if (watcherRef.current) clearInterval(watcherRef.current);
    };
  }, [settings, isActive, getTimings, startSalahMode]);

  // ── تنظيف عند unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (watcherRef.current)   clearInterval(watcherRef.current);
    };
  }, []);

  const value = {
    // الحالة
    isActive,
    timeLeft,
    totalDuration,
    currentPrayer,

    // الأفعال
    startSalahMode,
    extendSalahMode,
    endSalahMode,

    // الإعدادات
    settings,
    updateSettings,

    // ثوابت مفيدة
    PRAYER_NAMES_AR,
    PRAYER_KEYS,
    DEFAULT_DURATIONS,
  };

  return (
    <SalahModeContext.Provider value={value}>
      {children}
    </SalahModeContext.Provider>
  );
};

export default SalahModeContext;

