export const PRAYER_SERVICE = {
  async fetchTimings(lat, lng) {
    const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
    const data = await res.json();
    return data.code === 200 ? data.data : null;
  },
  
  getPrayerNamesAr() {
    return {
      Fajr: 'الفجر',
      Dhuhr: 'الظهر',
      Asr: 'العصر',
      Maghrib: 'المغرب',
      Isha: 'العشاء'
    };
  }
};
