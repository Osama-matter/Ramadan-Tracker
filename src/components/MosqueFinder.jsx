import React, { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

const MosqueFinder = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          setError("يرجى منح إذن الوصول للموقع الجغرافي لتحديد المساجد القريبة");
          setLoading(false);
          return;
        }
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setLocation(pos);
      setLoading(false);
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("تعذر الوصول لموقعك بدقة. يرجى تفعيل الـ GPS والتأكد من قوة الإشارة");
      setLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/mosque/@${location.lat},${location.lng},15z`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/mosque/`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 px-2">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">المساجد القريبة</h2>
        <p className="text-text-mid text-sm font-amiri text-balance">استخدم خرائط جوجل للعثور على أقرب المساجد بدقة عالية</p>
      </div>

      <div className="bg-white/5 border border-black/10 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-sm text-center space-y-6">
        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-5xl mx-auto border border-gold/20 shadow-inner animate-bounce-subtle">
          🕌
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-dark font-tajawal">خرائط جوجل</h3>
          <p className="text-sm text-text-mid font-amiri leading-relaxed">
            للحصول على أدق النتائج وأحدث بيانات المساجد، نوصي باستخدام تطبيق خرائط جوجل مباشرة.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gold-dark font-tajawal">جاري تحديد موقعك...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-xs text-red-500 font-tajawal">{error}</p>
            <button
              onClick={getUserLocation}
              className="text-xs text-gold-dark underline font-bold"
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : (
          <div className="p-4 bg-green-main/5 rounded-2xl border border-green-main/10">
            <p className="text-xs text-green-main font-bold">✅ تم تحديد موقعك بنجاح</p>
          </div>
        )}

        <button
          onClick={openGoogleMaps}
          className="w-full py-4 bg-gold text-green-main rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:shadow-gold/20"
        >
          <span>فتح في خرائط جوجل</span>
          <span className="text-xl">📍</span>
        </button>

        <p className="text-[10px] text-text-mid italic px-4">
          سيتم فتح نتائج البحث عن "مساجد" في المنطقة المحيطة بك مباشرة.
        </p>
      </div>
    </div>
  );
};

export default MosqueFinder;
