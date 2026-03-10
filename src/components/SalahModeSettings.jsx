/**
 * SalahModeSettings
 * ═══════════════════════════════════════════════════════
 * واجهة إعدادات وضع الصلاة — يُضاف في صفحة الإعدادات أو
 * صفحة مواقيت الصلاة
 */

import React from 'react';
import { useSalahModeContext } from '../contexts/SalahModeContext';

const SalahModeSettings = () => {
  const {
    settings, updateSettings,
    PRAYER_NAMES_AR, PRAYER_KEYS, DEFAULT_DURATIONS,
    startSalahMode, isActive,
  } = useSalahModeContext();

  const toggleEnabled = () =>
    updateSettings({ enabled: !settings.enabled });

  const togglePrayer = (key) =>
    updateSettings({
      prayers: { ...settings.prayers, [key]: !settings.prayers[key] },
    });

  const updateDuration = (key, val) =>
    updateSettings({
      durations: { ...settings.durations, [key]: Number(val) },
    });

  return (
    <div className="space-y-5 pb-8" dir="rtl">

      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-2xl">🕌</span>
        <div>
          <h3 className="text-base font-bold text-white font-scheherazade">وضع الصلاة التلقائي</h3>
          <p className="text-[11px] opacity-40 text-white font-tajawal">
            يُفعَّل تلقائياً عند دخول وقت الصلاة ويكتم الإشعارات
          </p>
        </div>
        {/* Master toggle */}
        <button
          onClick={toggleEnabled}
          className="mr-auto flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 relative"
          style={{
            background: settings.enabled
              ? 'linear-gradient(90deg, #c9a84c, #FBDF93)'
              : 'rgba(255,255,255,0.1)',
          }}
        >
          <div className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300"
            style={{ left: settings.enabled ? 'calc(100% - 20px)' : '4px' }} />
        </button>
      </div>

      {/* Per-prayer settings */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {PRAYER_KEYS.map((key, i) => (
          <div key={key}
            className="flex items-center gap-3 px-4 py-3 transition-all"
            style={{
              borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              opacity: settings.enabled ? 1 : 0.35,
            }}>
            {/* Prayer name */}
            <span className="text-sm font-bold font-scheherazade text-white w-14 flex-shrink-0">
              {PRAYER_NAMES_AR[key]}
            </span>

            {/* Duration slider */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min={5} max={30} step={5}
                value={settings.durations[key] || DEFAULT_DURATIONS[key]}
                disabled={!settings.enabled || !settings.prayers[key]}
                onChange={e => updateDuration(key, e.target.value)}
                className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#c9a84c' }}
              />
              <span className="text-[11px] font-bold w-8 text-center flex-shrink-0"
                style={{ color: '#c9a84c' }}>
                {settings.durations[key] || DEFAULT_DURATIONS[key]}د
              </span>
            </div>

            {/* Prayer toggle */}
            <button
              onClick={() => togglePrayer(key)}
              disabled={!settings.enabled}
              className="flex-shrink-0 w-10 h-5 rounded-full transition-all duration-300 relative disabled:opacity-30"
              style={{
                background: settings.prayers[key]
                  ? 'rgba(201,168,76,0.4)'
                  : 'rgba(255,255,255,0.08)',
                border: `1px solid ${settings.prayers[key] ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)'}`,
              }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                style={{
                  background: settings.prayers[key] ? '#FBDF93' : 'rgba(255,255,255,0.3)',
                  left: settings.prayers[key] ? 'calc(100% - 18px)' : '2px',
                }} />
            </button>
          </div>
        ))}
      </div>

      {/* Manual trigger */}
      <div className="rounded-2xl p-4"
        style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <p className="text-[11px] opacity-50 text-white font-tajawal mb-3 text-center">
          أو شغّل الوضع يدوياً الآن
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {PRAYER_KEYS.map(key => (
            <button key={key}
              onClick={() => startSalahMode(key)}
              disabled={isActive}
              className="py-2 rounded-xl text-[11px] font-bold font-scheherazade transition-all active:scale-90 disabled:opacity-30"
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: '#FBDF93',
              }}>
              {PRAYER_NAMES_AR[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="flex gap-2 items-start px-1">
        <span className="text-sm mt-0.5">💡</span>
        <p className="text-[10px] leading-relaxed font-tajawal"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          عند دخول وقت الصلاة بـ ±90 ثانية سيُفعَّل الوضع تلقائياً،
          وستُكتم جميع الإشعارات لمدة ١٠ دقائق (قابلة للتعديل) حتى تنتهي المدة أو تُنهيه يدوياً.
        </p>
      </div>
    </div>
  );
};

export default SalahModeSettings;
