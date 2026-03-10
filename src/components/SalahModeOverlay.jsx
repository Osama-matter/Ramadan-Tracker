import React, { useEffect, useRef, useCallback } from 'react';
import { useSalahModeContext } from '../contexts/SalahModeContext';

// ─── Notification suppression via Capacitor ──────────────────────────────────
// إيقاف الإشعارات أثناء وضع الصلاة (Android + iOS)
async function suppressNotifications() {
    if (!window.Capacitor?.Plugins?.LocalNotifications) return;
    try {
        const { LocalNotifications } = window.Capacitor.Plugins;
        
        // 1. إلغاء جميع الإشعارات المعلقة حالياً لمنع ظهورها أثناء الصلاة
        const pending = await LocalNotifications.getPending();
        console.log(`[SalahMode] Found ${pending.notifications.length} pending notifications to cancel`);
        if (pending.notifications.length > 0) {
            await LocalNotifications.cancel({ notifications: pending.notifications });
            console.log('[SalahMode] All pending notifications cancelled');
        }

        // 2. تعديل القنوات لتصبح صامتة تماماً (لأندرويد)
        if (window.Capacitor.getPlatform() === 'android') {
            const channels = [
                { id: 'adhan-channel-makkah', name: 'Adhan (Makkah)' },
                { id: 'adhan-channel-madina', name: 'Adhan (Madina)' },
                { id: 'adhan-channel-naseralqatamy', name: 'Adhan (Naser)' },
                { id: 'adhan-channel-default', name: 'Adhan (Default)' },
                { id: 'salawat-channel-v2', name: 'Salawat' },
                { id: 'prayer-live-ticker', name: 'Prayer Live' }
            ];

            for (const ch of channels) {
                await LocalNotifications.createChannel({
                    id: ch.id,
                    name: ch.name,
                    importance: 1, // Min importance
                    sound: null,
                    vibration: false,
                    visibility: -1 // Secret/None
                });
            }
        }
        console.log('[SalahMode] Notifications suppressed & pending cancelled ✓');
    } catch (e) {
        console.warn('[SalahMode] suppressNotifications error:', e);
    }
}

// استعادة الإشعارات بعد انتهاء وضع الصلاة
async function restoreNotifications() {
    if (!window.Capacitor?.Plugins?.LocalNotifications) return;
    try {
        const { LocalNotifications } = window.Capacitor.Plugins;
        
        // 1. استعادة القنوات لإعداداتها الأصلية (لأندرويد)
        if (window.Capacitor.getPlatform() === 'android') {
            await LocalNotifications.createChannel({
                id: 'adhan-channel-makkah', name: 'Adhan (Makkah)', importance: 5, sound: 'adhan_makkah.mp3', vibration: true
            });
            await LocalNotifications.createChannel({
                id: 'adhan-channel-madina', name: 'Adhan (Madina)', importance: 5, sound: 'adhan_madina.mp3', vibration: true
            });
            await LocalNotifications.createChannel({
                id: 'salawat-channel-v2', name: 'Salawat Reminders', importance: 5, sound: 'prophet_muhammad.mp3', vibration: true
            });
        }
        
        // 2. إعادة جدولة الإشعارات فوراً لأننا قمنا بإلغائها عند الدخول
        const timings = JSON.parse(localStorage.getItem('athr_prayer_times'));
        const settings = JSON.parse(localStorage.getItem('athr_notifications')) || {};
        
        if (timings && window.NOTIFICATION_SERVICE_INTERNAL) {
            await window.NOTIFICATION_SERVICE_INTERNAL.scheduleAdhan(
                timings,
                {
                    fajr: settings.fajr,
                    dhuhr: settings.dhuhr,
                    asr: settings.asr,
                    maghrib: settings.maghrib,
                    isha: settings.isha,
                },
                settings.adhan_voice_type || 'makkah'
            );
            
            if (settings.salawat && settings.salawat_interval) {
                await window.NOTIFICATION_SERVICE_INTERNAL.scheduleSalawat(
                    settings.salawat_interval,
                    settings.salawat_text,
                    settings.salawat_sound
                );
            }
        }

        console.log('[SalahMode] Notification channels restored & rescheduled ✓');
    } catch (e) {
        console.warn('[SalahMode] restoreNotifications error:', e);
    }
}

// ─── SVG constants ────────────────────────────────────────────────────────────
const R = 120;
const CX = 144;
const CY = 144;
const CIRCUMF = 2 * Math.PI * R; // 753.98

const SalahModeOverlay = ({ onQuickAction }) => {
    const {
        isActive,
        timeLeft,
        totalDuration, // ✅ يجب أن يُصدَّر من الـ context
        endSalahMode,
        extendSalahMode,
    } = useSalahModeContext();

    // ── Fallback لو totalDuration مش موجود في الـ context ──
    const total = totalDuration || 10 * 60;

    // ── تحويل الوقت ─────────────────────────────────────────
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // ── حساب التقدم (يأخذ التمديد بعين الاعتبار) ────────────
    const progressPct = Math.min(Math.max((timeLeft / total) * 100, 0), 100);
    const dashOffset = CIRCUMF - (CIRCUMF * progressPct) / 100;

    // ── هل الوقت على وشك الانتهاء؟ (أقل من دقيقتين) ─────────
    const isUrgent = timeLeft <= 120;

    // ── منع تمرير الصفحة خلف الـ overlay ────────────────────
    useEffect(() => {
        if (!isActive) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [isActive]);

    // ── كتم الإشعارات عند الدخول واستعادتها عند الخروج ───────
    useEffect(() => {
        if (!isActive) return;
        suppressNotifications();
        return () => { restoreNotifications(); };
    }, [isActive]);

    // ── تنظيف: استعادة الإشعارات لو انتهى الوقت تلقائياً ────
    useEffect(() => {
        if (isActive || timeLeft > 0) return;
        restoreNotifications();
    }, [isActive, timeLeft]);

    // ── Safe handler لـ onQuickAction ────────────────────────
    const handleQuickAction = useCallback((action) => {
        onQuickAction?.(action);
    }, [onQuickAction]);

    if (!isActive) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-between overflow-hidden"
            dir="rtl"
            style={{
                background: 'radial-gradient(ellipse at 50% 0%, #0d1117 0%, #03050f 60%, #000408 100%)',
                fontFamily: "'Noto Naskh Arabic', 'Tajawal', serif",
            }}
        >
            {/* ── Stars particle bg ────────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(28)].map((_, i) => (
                    <div key={i}
                        className="absolute rounded-full bg-gold/40 dark:bg-gold/20"
                        style={{
                            width: Math.random() * 2 + 1,
                            height: Math.random() * 2 + 1,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.1,
                            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* ── Ambient glow ─────────────────────────────────────────────── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

            {/* ── Notification silenced badge ──────────────────────────────── */}
            <div className="absolute top-14 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full animate-in fade-in duration-1000 delay-500"
                style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="text-xs">🔕</span>
                <span className="text-[10px] font-bold text-gold-light opacity-80">الإشعارات مكتومة</span>
            </div>

            {/* ══ HEADER ═══════════════════════════════════════════════════════ */}
            <div className="relative z-10 text-center pt-16 px-6 animate-in slide-in-from-top-6 duration-1000">
                {/* Crescent moon icon */}
                <div className="text-5xl mb-3 drop-shadow-[0_0_20px_rgba(201,168,76,0.5)]">🌙</div>

                <h2 className="text-3xl font-bold font-scheherazade mb-3 leading-tight"
                    style={{
                        background: 'linear-gradient(180deg, #FBDF93 0%, #c9a84c 50%, #a07830 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 8px rgba(201,168,76,0.3))',
                    }}>
                    وضع الصلاة والسكينة
                </h2>

                <div className="h-px w-24 mx-auto mb-3"
                    style={{ background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)' }} />

                <p className="text-sm text-white/60 font-tajawal leading-relaxed max-w-[260px] mx-auto">
                    «إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا»
                </p>
            </div>

            {/* ══ CIRCULAR TIMER ═══════════════════════════════════════════════ */}
            <div className="relative z-10 flex items-center justify-center animate-in zoom-in-75 duration-1000 delay-200">
                {/* Outer glow ring */}
                <div className="absolute w-72 h-72 rounded-full pointer-events-none"
                    style={{
                        boxShadow: `0 0 60px rgba(201,168,76,${isUrgent ? '0.25' : '0.1'}), inset 0 0 40px rgba(201,168,76,0.05)`,
                        transition: 'box-shadow 1s ease',
                    }} />

                <svg
                    width="288" height="288"
                    viewBox="0 0 288 288"  // ✅ viewBox صحيح
                    className="overflow-visible"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.3))' }}
                >
                    <defs>
                        {/* ✅ ID فريد لتجنب التعارض */}
                        <linearGradient id="goldGrad_salahOverlay" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7a5c1e" />
                            <stop offset="40%" stopColor="#FBDF93" />
                            <stop offset="100%" stopColor="#c9a84c" />
                        </linearGradient>
                        <linearGradient id="urgentGrad_salahOverlay" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7f1d1d" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>
                    </defs>

                    {/* Track ring */}
                    <circle cx={CX} cy={CY} r={R}
                        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />

                    {/* Glow blur ring (decorative) */}
                    <circle cx={CX} cy={CY} r={R}
                        fill="none"
                        stroke={isUrgent ? '#f87171' : '#c9a84c'}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMF}
                        strokeDashoffset={dashOffset}
                        opacity="0.15"
                        style={{ filter: 'blur(8px)', transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'stroke-dashoffset 1s linear, stroke 1s ease' }}
                    />

                    {/* ✅ Main progress ring — صحيح بعد إصلاح r و viewBox */}
                    <circle cx={CX} cy={CY} r={R}
                        fill="none"
                        stroke={`url(#${isUrgent ? 'urgentGrad_salahOverlay' : 'goldGrad_salahOverlay'})`}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMF}
                        strokeDashoffset={dashOffset}
                        style={{
                            transform: 'rotate(-90deg)',
                            transformOrigin: `${CX}px ${CY}px`,
                            transition: 'stroke-dashoffset 1s linear, stroke 1s ease',
                        }}
                    />

                    {/* Dot at progress tip */}
                    {progressPct > 2 && (
                        <circle
                            cx={CX + R * Math.cos((progressPct / 100) * 2 * Math.PI - Math.PI / 2)}
                            cy={CY + R * Math.sin((progressPct / 100) * 2 * Math.PI - Math.PI / 2)}
                            r="5"
                            fill={isUrgent ? '#f87171' : '#FBDF93'}
                            style={{ filter: 'drop-shadow(0 0 6px #FBDF93)' }}
                        />
                    )}
                </svg>

                {/* Time text inside ring */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                        className="text-6xl font-light tracking-widest tabular-nums"
                        style={{
                            fontFamily: 'monospace',
                            color: isUrgent ? '#f87171' : 'white',
                            textShadow: `0 0 20px ${isUrgent ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.3)'}`,
                            transition: 'color 1s ease, text-shadow 1s ease',
                        }}
                    >
                        {timeStr}
                    </div>
                    <div className="text-[11px] tracking-[0.25em] mt-3 font-bold font-tajawal"
                        style={{ color: isUrgent ? '#f87171' : 'rgba(201,168,76,0.8)' }}>
                        {isUrgent ? 'يوشك الوقت ينتهي' : 'حان وقت الخشوع'}
                    </div>
                    {/* progress percent */}
                    <div className="text-[10px] mt-1 opacity-30 text-white font-tajawal">
                        {Math.round(progressPct)}% متبقٍ
                    </div>
                </div>
            </div>

            {/* ══ QUICK ACTIONS ════════════════════════════════════════════════ */}
            <div className="relative z-10 w-full max-w-xs px-4 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                <p className="text-center text-[11px] opacity-30 text-white font-tajawal mb-3">
                    — أثرِ وقتك —
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { action: 'quran', icon: '📖', label: 'القرآن الكريم' },
                        { action: 'adhkar', icon: '📿', label: 'أذكار الصلاة' },
                    ].map(item => (
                        <button key={item.action}
                            onClick={() => handleQuickAction(item.action)}
                            className="flex flex-col items-center justify-center gap-2.5 py-5 rounded-3xl transition-all duration-300 active:scale-95 group"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(201,168,76,0.2)',
                                backdropFilter: 'blur(20px)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.15)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-90"
                                style={{ background: 'rgba(201,168,76,0.15)' }}>
                                <span className="text-2xl">{item.icon}</span>
                            </div>
                            <span className="text-xs font-bold font-tajawal text-white">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ══ CONTROLS ═════════════════════════════════════════════════════ */}
            <div className="relative z-10 w-full px-6 pb-12 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-500">
                {/* Extend button */}
                <button
                    onClick={() => extendSalahMode(5)}
                    className="w-full max-w-[280px] py-4 rounded-2xl font-bold font-tajawal text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: '#FBDF93',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.22)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,168,76,0.12)'}
                >
                    <span className="text-lg font-black">+</span>
                    تمديد ٥ دقائق إضافية
                </button>

                {/* End button */}
                <button
                    onClick={() => { restoreNotifications(); endSalahMode(); }}
                    className="text-sm font-tajawal font-bold transition-colors py-2"
                    style={{ color: 'rgba(248,113,113,0.6)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(248,113,113,0.9)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(248,113,113,0.6)'}
                >
                    إنهاء وضع الصلاة واستعادة الإشعارات
                </button>
            </div>

            {/* ── pulse animation keyframes ─────────────────────────────────── */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
        </div>
    );
};

export default SalahModeOverlay;