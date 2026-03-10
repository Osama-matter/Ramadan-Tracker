import { STORAGE_SERVICE } from './storageService'; // ✅ FIX: was missing — caused ReferenceError crash

export const NOTIFICATION_SERVICE = {
  isCapacitor: typeof window !== 'undefined' && window.hasOwnProperty('Capacitor'),

  async requestPermissions() {
    if (!this.isCapacitor) return false;

    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      if (!LocalNotifications) return false;

      // Sometimes checkPermissions isn't available on all platforms
      const perm = await LocalNotifications.checkPermissions().catch(() => ({ display: 'granted' }));
      console.log('Current notification permissions:', perm);

      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions().catch(() => ({ display: 'denied' }));
        console.log('Requested notification permissions:', req);
        return req.display === 'granted';
      }
      return true;
    } catch (err) {
      console.error('Error checking/requesting permissions:', err);
      return false; // Degrading gracefully
    }
  },

  async clearChannel(channelId) {
    if (!this.isCapacitor) return;
    const { LocalNotifications } = window.Capacitor.Plugins;
    const pending = await LocalNotifications.getPending();
    const toCancel = pending.notifications.filter(n => n.channelId === channelId);
    if (toCancel.length > 0) {
      await LocalNotifications.cancel({ notifications: toCancel });
    }
  },

  async createAdhanChannel(voiceType) {
    if (!this.isCapacitor || window.Capacitor.getPlatform() !== 'android') return;
    const { LocalNotifications } = window.Capacitor.Plugins;
    await LocalNotifications.createChannel({
      id: `adhan-channel-${voiceType}`,
      name: `Adhan Notifications (${voiceType})`,
      importance: 5,
      visibility: 1,
      sound: `adhan_${voiceType}.mp3`,
      vibration: true
    });
  },

  async createSalawatChannel() {
    if (!this.isCapacitor || window.Capacitor.getPlatform() !== 'android') return;
    const { LocalNotifications } = window.Capacitor.Plugins;
    await LocalNotifications.createChannel({
      id: 'salawat-channel-v2',
      name: 'Salawat Reminders',
      importance: 5,
      visibility: 1,
      sound: 'prophet_muhammad.mp3',
      vibration: true
    });
  },

  async scheduleAdhan(timings, activePrayers, voiceType = 'makkah') {
    if (!this.isCapacitor || !timings) return;
    const { LocalNotifications } = window.Capacitor.Plugins;

    try {
      // ✅ FIX: Cancel only adhan IDs (100-805), NOT all notifications
      // This preserves: live ticker (ID 9999) and salawat reminders (IDs 5000+)
      const pending = await LocalNotifications.getPending();
      const adhanIds = pending.notifications.filter(n =>
        n.id !== 9999 &&   // keep live ticker
        n.id < 5000        // keep salawat reminders
      );
      if (adhanIds.length > 0) {
        await LocalNotifications.cancel({ notifications: adhanIds });
      }

      // 2. Ensure Channel exists
      await this.createAdhanChannel(voiceType);

      const prayers = [
        { id: 101, name: 'الفجر', key: 'fajr', time: timings.Fajr || timings.fajr },
        { id: 102, name: 'الظهر', key: 'dhuhr', time: timings.Dhuhr || timings.dhuhr },
        { id: 103, name: 'العصر', key: 'asr', time: timings.Asr || timings.asr },
        { id: 104, name: 'المغرب', key: 'maghrib', time: timings.Maghrib || timings.maghrib },
        { id: 105, name: 'العشاء', key: 'isha', time: timings.Isha || timings.isha }
      ].filter(p => activePrayers[p.key] && p.time);

      if (prayers.length === 0) return;

      const notifications = [];
      const daysToSchedule = 7;

      for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset++) {
        prayers.forEach(p => {
          const [h, m] = p.time.split(':').map(Number);
          const scheduleDate = new Date();
          scheduleDate.setDate(scheduleDate.getDate() + dayOffset);
          scheduleDate.setHours(h, m, 0, 0);

          if (scheduleDate > new Date()) {
            notifications.push({
              title: `حان الآن موعد أذان ${p.name}`,
              body: 'حي على الصلاة.. حي على الفلاح',
              id: p.id + (dayOffset * 100),
              schedule: {
                at: scheduleDate,
                allowPause: false,
                repeats: false
              },
              sound: `adhan_${voiceType}.mp3`,
              channelId: `adhan-channel-${voiceType}`,
              smallIcon: 'ic_launcher',
              largeIcon: 'ic_launcher',
              importance: 5
            });
          }
        });

        // Add Suhoor Alert
        const settings = STORAGE_SERVICE.getItem('athr_notifications', {});
        if (settings.suhoor_alert && timings.Fajr) {
          const [fH, fM] = (timings.Fajr || timings.fajr).split(':').map(Number);
          const suhoorDate = new Date();
          suhoorDate.setDate(suhoorDate.getDate() + dayOffset);
          suhoorDate.setHours(fH, fM, 0, 0);
          suhoorDate.setMinutes(suhoorDate.getMinutes() - (settings.suhoor_offset || 30));

          if (suhoorDate > new Date()) {
            notifications.push({
              title: 'تنبيه السحور',
              body: `باقي ${settings.suhoor_offset || 30} دقيقة على أذان الفجر`,
              id: 200 + (dayOffset * 100),
              schedule: { at: suhoorDate, allowPause: false },
              sound: 'prophet_muhammad.mp3',
              channelId: 'salawat-channel-v2',
              smallIcon: 'ic_launcher',
              importance: 5
            });
          }
        }

        // Add Imsak Alert
        if (settings.imsak_alert && timings.Fajr) {
          const [fH, fM] = (timings.Fajr || timings.fajr).split(':').map(Number);
          const imsakDate = new Date();
          imsakDate.setDate(imsakDate.getDate() + dayOffset);
          imsakDate.setHours(fH, fM, 0, 0);
          imsakDate.setMinutes(imsakDate.getMinutes() - (settings.imsak_offset || 10));

          if (imsakDate > new Date()) {
            notifications.push({
              title: 'تنبيه الإمساك',
              body: `باقي ${settings.imsak_offset || 10} دقائق على أذان الفجر (وقت الإمساك)`,
              id: 300 + (dayOffset * 100),
              schedule: { at: imsakDate, allowPause: false },
              sound: 'prophet_muhammad.mp3',
              channelId: 'salawat-channel-v2',
              smallIcon: 'ic_launcher',
              importance: 5
            });
          }
        }
      }

      if (notifications.length > 0) {
        console.log(`Scheduling ${notifications.length} notifications (Adhan + Alerts)...`);
        await LocalNotifications.schedule({ notifications });
      }

    } catch (err) {
      console.error('Error scheduling adhan:', err);
    }
  },

  async scheduleSalawat(intervalMinutes, text, soundEnabled) {
    if (!this.isCapacitor) return;
    const { LocalNotifications } = window.Capacitor.Plugins;

    try {
      await this.clearChannel('salawat-channel-v2');
      if (!intervalMinutes) return; // Means disabled

      if (soundEnabled) {
        await this.createSalawatChannel();
      }

      const notifications = [];
      const daysToSchedule = 3; // Schedule 3 days of intervals
      const intervalMs = intervalMinutes * 60 * 1000;
      let nextSchedule = new Date(Date.now() + intervalMs);

      // Start at top of next hour/half-hour for cleanness if desired, but here we just start from now.
      for (let i = 0; i < (daysToSchedule * 24 * 60) / intervalMinutes; i++) {
        notifications.push({
          title: 'صلاة على النبي ﷺ',
          body: text || 'اللهم صلِّ وسلم على نبينا محمد',
          id: 5000 + i,
          schedule: { at: new Date(nextSchedule), allowPause: false },
          sound: soundEnabled ? 'prophet_muhammad.mp3' : undefined,
          channelId: 'salawat-channel-v2'
        });
        nextSchedule = new Date(nextSchedule.getTime() + intervalMs);
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (err) {
      console.error('Error scheduling salawat:', err);
    }
  }
};
