import { ForegroundService } from '@capawesome-team/capacitor-android-foreground-service';
import { STORAGE_SERVICE } from './storageService';

class ForegroundTimerService {
    constructor() {
        this.interval = null;
        this.prayerTimes = null;
        this.isActive = false;
    }

    async checkPermissions() {
        if (!window.Capacitor || window.Capacitor.getPlatform() !== 'android') return true;

        const { LocalNotifications } = window.Capacitor.Plugins;
        const perm = await LocalNotifications.checkPermissions();
        if (perm.display !== 'granted') {
            const req = await LocalNotifications.requestPermissions();
            return req.display === 'granted';
        }
        return true;
    }

    async startService(timings) {
        if (!window.Capacitor || window.Capacitor.getPlatform() !== 'android') {
            console.log('Foreground Service: platform is not Android, skipping.');
            return;
        }

        console.log('Foreground Service: Requesting permissions...');
        const hasPerms = await this.checkPermissions();
        if (!hasPerms) {
            console.error('Foreground Service: Permissions NOT granted.');
            return;
        }

        this.prayerTimes = timings;
        if (!this.prayerTimes) {
            console.error('Foreground Service: No timings provided.');
            return;
        }

        // ✅ FIX 1: Also request POST_NOTIFICATIONS permission for Android 13+
        try {
            await ForegroundService.requestPermissions();
        } catch (e) {
            console.warn('Foreground Service: requestPermissions not supported or already granted:', e);
        }

        try {
            this.isActive = true;
            console.log('Foreground Service: Starting service...');

            const initialData = this.calculateNextPrayer() || { name: '...', timeLeft: 'جاري الحساب' };
            console.log('Foreground Service: Initial Calculation:', initialData);

            // ✅ FIX 2: Use `notificationImportance` instead of `importance`
            await ForegroundService.startForegroundService({
                id: 111,
                title: `الصلاة القادمة: ${initialData.name}`,
                body: `باقي: ${initialData.timeLeft}`,
                smallIcon: 'ic_launcher',
                notificationImportance: 3,
            });

            console.log('Foreground Service: Service started successfully.');
            this.startTicker();
        } catch (e) {
            console.error('Foreground Service error in startService:', e);
            this.isActive = false;
        }
    }

    startTicker() {
        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(async () => {
            if (!this.isActive) return;

            const nextPrayerDetails = this.calculateNextPrayer();
            if (nextPrayerDetails) {
                try {
                    // ✅ FIX 3: Plugin has no `updateForegroundService` — call `startForegroundService`
                    // again with the same ID to update the notification content
                    await ForegroundService.startForegroundService({
                        id: 111,
                        title: `الصلاة القادمة: ${nextPrayerDetails.name}`,
                        body: `باقي: ${nextPrayerDetails.timeLeft}`,
                        smallIcon: 'ic_launcher',
                        notificationImportance: 3,
                    });
                } catch (e) {
                    console.error('Failed to update Foreground Service', e);
                }
            }
        }, 60000);
    }

    calculateNextPrayer() {
        if (!this.prayerTimes) return null;

        const now = new Date();
        const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // ✅ FIX 4: Support both capitalized (Fajr) and lowercase (fajr) key formats
        const t = this.prayerTimes;
        const prayers = [
            { id: 'fajr', label: 'الفجر', time: t.Fajr || t.fajr },
            { id: 'dhuhr', label: 'الظهر', time: t.Dhuhr || t.dhuhr },
            { id: 'asr', label: 'العصر', time: t.Asr || t.asr },
            { id: 'maghrib', label: 'المغرب', time: t.Maghrib || t.maghrib },
            { id: 'isha', label: 'العشاء', time: t.Isha || t.isha }
        ];

        let nextPrayer = null;
        for (const prayer of prayers) {
            if (prayer.time && currentTimeStr < prayer.time) {
                nextPrayer = prayer;
                break;
            }
        }

        // Wrap around to next day Fajr
        if (!nextPrayer) {
            nextPrayer = { id: 'fajr', label: 'الفجر', time: prayers[0].time };
        }

        if (!nextPrayer.time) return null;

        let [pHours, pMins] = nextPrayer.time.split(':').map(Number);
        let nHours = now.getHours();
        let nMins = now.getMinutes();

        if (nHours > pHours || (nHours === pHours && nMins > pMins)) {
            pHours += 24;
        }

        let diffMins = (pHours * 60 + pMins) - (nHours * 60 + nMins);
        const hrsLeft = Math.floor(diffMins / 60);
        const minsLeft = diffMins % 60;

        let timeLeftStr = '';
        if (hrsLeft > 0) timeLeftStr += `${hrsLeft} ساعة و `;
        timeLeftStr += `${minsLeft} دقيقة`;

        return {
            name: nextPrayer.label,
            timeLeft: timeLeftStr
        };
    }

    async stopService() {
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        if (window.Capacitor && window.Capacitor.getPlatform() === 'android') {
            try {
                await ForegroundService.stopForegroundService();
            } catch (e) {
                console.error('Failed to stop Foreground Service', e);
            }
        }
    }
}

export const FOREGROUND_SERVICE = new ForegroundTimerService();