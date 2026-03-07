import { useState, useEffect } from 'react';
import { PRAYER_SERVICE } from '../services/prayerService';
import { NOTIFICATION_SERVICE } from '../services/notificationService';

export const usePrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTimes = async () => {
      if (!navigator.geolocation) {
        setError('تحديد الموقع غير مدعوم');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await PRAYER_SERVICE.fetchTimings(latitude, longitude);
          if (data) {
            setTimings(data.timings);
            setLocation(data.meta.timezone);
            // Auto schedule notifications
            await NOTIFICATION_SERVICE.scheduleAdhan(data.timings);
          }
        } catch (err) {
          setError('فشل جلب مواقيت الصلاة');
        } finally {
          setLoading(false);
        }
      }, (err) => {
        setError('يرجى تفعيل صلاحية الموقع');
        setLoading(false);
      });
    };

    loadTimes();
  }, []);

  return { timings, location, loading, error };
};
