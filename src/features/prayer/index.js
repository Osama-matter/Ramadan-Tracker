import { PRAYER_SERVICE } from '../../services/prayerService';
import { NOTIFICATION_SERVICE } from '../../services/notificationService';

export const PRAYER_MANAGER = {
  async updatePrayers(lat, lng) {
    const data = await PRAYER_SERVICE.fetchTimings(lat, lng);
    if (data) {
      await NOTIFICATION_SERVICE.scheduleAdhan(data.timings);
      return data.timings;
    }
    return null;
  }
};
