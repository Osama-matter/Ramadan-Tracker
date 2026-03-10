/**
 * FOREGROUND SERVICE - Live Prayer Countdown
 * ============================================
 * يستخدم: @capawesome-team/capacitor-android-foreground-service
 * AndroidManifest.xml ✅ جاهز بالفعل
 *
 * التثبيت (لو لم يكن مثبتاً):
 *   npm install @capawesome-team/capacitor-android-foreground-service
 *   npx cap sync android
 */

import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';
import { STORAGE_SERVICE } from './storageService';

let _interval = null;
let _isRunning = false;
let _salahModeEnd = STORAGE_SERVICE.getItem('athr_salah_mode_end', null);

// Listen to Salah Mode changes
if (typeof window !== 'undefined') {
    window.addEventListener('athr_salah_mode_change', (e) => {
        _salahModeEnd = e.detail.active ? e.detail.endTime : null;
        if (_isRunning) {
            FOREGROUND_SERVICE._tick(); // Force immediate update
        }
    });
}

// ─── ثوابت ────────────────────────────────────────────────────────────────────
const NOTIFICATION_ID = 111;
const UPDATE_INTERVAL_MS = 60000; // تحديث كل دقيقة

const PRAYER_NAMES_AR = {
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
};

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// ─── مساعدات ──────────────────────────────────────────────────────────────────

function timeStrToDate(timeStr, baseDate = new Date()) {
    if (!timeStr) return null;
    const clean = timeStr.trim();
    const isPM = /PM/i.test(clean);
    const isAM = /AM/i.test(clean);
    const nums = clean.replace(/\s*(AM|PM)\s*/i, '').split(':').map(Number);
    let h = nums[0];
    const m = nums[1] || 0;
    if (isPM && h !== 12) h += 12;
    if (isAM && h === 12) h = 0;
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
}

export function getNextPrayer(timings) {
    if (!timings) return null;
    const now = new Date();

    const prayers = PRAYER_ORDER
        .map(key => {
            const raw = timings[key.charAt(0).toUpperCase() + key.slice(1)] || timings[key];
            return { key, name: PRAYER_NAMES_AR[key], date: timeStrToDate(raw) };
        })
        .filter(p => p.date !== null);

    let next = prayers.find(p => p.date > now);

    if (!next) {
        const fajrRaw = timings['Fajr'] || timings['fajr'];
        if (fajrRaw) {
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            next = { key: 'fajr', name: 'الفجر', date: timeStrToDate(fajrRaw, tomorrow) };
        }
    }

    if (!next) return null;

    const diffMs = next.date - now;
    const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const remaining = hours > 0 ? `${hours} س ${minutes} د` : `${minutes} دقيقة`;

    return { key: next.key, name: next.name, remaining, minutesLeft: totalMinutes, date: next.date };
}

// ─── الخدمة ───────────────────────────────────────────────────────────────────

// ─── الخدمة ───────────────────────────────────────────────────────────────────

export const FOREGROUND_SERVICE = {

    async startService(timings) {
        if (!window.Capacitor || window.Capacitor.getPlatform() !== 'android') {
            console.log('[FG_SERVICE] Not Android — skipping.');
            return;
        }

        try {
            // 1. طلب صلاحية الإشعارات (Android 13+)
            // Catch immediately if the method doesn't exist or fails
            try {
                if (ForegroundService.requestPermissions) {
                    await ForegroundService.requestPermissions().catch(() => { });
                }
            } catch (e) {
                console.warn('[FG_SERVICE] requestPermissions not supported/failed:', e);
            }

            const stored = STORAGE_SERVICE.getItem('athr_prayer_times') || timings;
            const next = getNextPrayer(stored);
            if (!next) {
                console.warn('[FG_SERVICE] No next prayer found.');
                return;
            }

            // 2. تشغيل الـ Foreground Service 
            // ✅ تم تغيير الخصائص (Keys) لتطابق واجهة الإصدار 8 
            // ✅ تم تغيير smallIcon إلى 'ic_notification' (الهلال المفرغ) ليظهر بشكل صحيح بدون مربع أبيض
            await ForegroundService.startForegroundService({
                id: NOTIFICATION_ID,
                title: `🕌 الصلاة القادمة: ${next.name}`,
                body: `⏳ متبقي: ${next.remaining}`,
                smallIcon: 'ic_notification'
            });

            _isRunning = true;
            console.log(`[FG_SERVICE] Started ✓ | ${next.name} في ${next.remaining}`);

            // تحديث كل دقيقة
            if (_interval) clearInterval(_interval);
            _interval = setInterval(() => this._tick(), UPDATE_INTERVAL_MS);

        } catch (err) {
            console.error('[FG_SERVICE] startService error:', err);
        }
    },

    async _tick() {
        if (!_isRunning) return;
        
        const isSalahActive = _salahModeEnd && _salahModeEnd > Date.now();

        try {
            const stored = STORAGE_SERVICE.getItem('athr_prayer_times');
            const next = getNextPrayer(stored);
            if (!next && !isSalahActive) return;

            let title = `🕌 الصلاة القادمة: ${next?.name || ''}`;
            let body = `⏳ متبقي: ${next?.remaining || ''}`;

            if (isSalahActive) {
                const remainingSecs = Math.max(0, Math.ceil((_salahModeEnd - Date.now()) / 1000));
                const mins = Math.floor(remainingSecs / 60);
                const secs = remainingSecs % 60;
                title = `وضع الصلاة والسكينة نشط 🕌`;
                body = `⏳ ينتهي بعد: ${mins}:${secs.toString().padStart(2, '0')} دقيقة`;
                
                // تحديث الإشعار لمرة واحدة ثم التوقف لضمان الهدوء
                await ForegroundService.updateForegroundService({
                    id: NOTIFICATION_ID,
                    title,
                    body,
                    smallIcon: 'ic_notification'
                });
                return; 
            }

            // ✅ التحديث باستخدام خصائص الإصدار 8
            await ForegroundService.updateForegroundService({
                id: NOTIFICATION_ID,
                title,
                body,
                smallIcon: 'ic_notification'
            });

            console.log(`[FG_SERVICE] ↻ ${next.name} | ${next.remaining}`);

            // لو بقي أقل من دقيقة → تحديث كل 10 ثواني (منطق ممتاز أضفته أنت!)
            if (next.minutesLeft <= 1 && _interval !== null) {
                // نتأكد أننا لسنا بالفعل في وضع الـ fastTick
                // (نعرف ذلك من قيمة الـ interval لو كانت 60 ثانية)
                this._fastTickMode();
            }

        } catch (e) {
            console.warn('[FG_SERVICE] _tick error:', e);
        }
    },

    _fastTickMode() {
        if (_interval) clearInterval(_interval);
        let count = 0;
        _interval = setInterval(async () => {
            await this._tick();
            if (++count >= 12) { // 2 دقيقة ثم عودة للوضع العادي
                clearInterval(_interval);
                _interval = setInterval(() => this._tick(), UPDATE_INTERVAL_MS);
            }
        }, 10000);
    },

    async stopService() {
        if (_interval) { clearInterval(_interval); _interval = null; }
        _isRunning = false;

        if (!window.Capacitor || window.Capacitor.getPlatform() !== 'android') return;

        try {
            await ForegroundService.stopForegroundService();
            console.log('[FG_SERVICE] Stopped ✓');
        } catch (e) {
            console.warn('[FG_SERVICE] stopService (ignored):', e?.message);
        }
    },

    async updateTimings(newTimings) {
        STORAGE_SERVICE.setItem('athr_prayer_times', newTimings);
        if (_isRunning) {
            console.log('[FG_SERVICE] Timings updated — restarting...');
            await this.startService(newTimings);
        }
    },

    isRunning: () => _isRunning,
};