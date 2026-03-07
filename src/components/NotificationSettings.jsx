import React, { useState, useEffect, useRef } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';
import { NOTIFICATION_SERVICE } from '../services/notificationService';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    suhoor: false,
    iftar: false,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false, // ✅ FIX 1: maghrib was missing from initial state entirely
    isha: false,
    quran_remind: false,
    qadr_remind: false,
    adhan_voice: false,
    salawat: false,
    adhan_voice_type: 'makkah',
    salawat_interval: 60,
    salawat_text: 'اللهم صلِّ وسلم على نبينا محمد',
    salawat_sound: true
  });

  // ✅ FIX 2: Separate state for adhan vs salawat preview to avoid conflict
  const [playingPreview, setPlayingPreview] = useState(null); // 'adhan' | 'salawat' | null
  const adhanAudioRef = useRef(null);
  const salawatAudioRef = useRef(null);

  useEffect(() => {
    const savedSettings = STORAGE_SERVICE.getItem('athr_notifications', settings);
    setSettings(prev => ({ ...prev, ...savedSettings }));
  }, []);

  // ✅ FIX 3: Cleanup audio on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current = null;
      }
      if (salawatAudioRef.current) {
        salawatAudioRef.current.pause();
        salawatAudioRef.current = null;
      }
    };
  }, []);

  const updateSettings = (updates) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    STORAGE_SERVICE.setItem('athr_notifications', updated);
    return updated;
  };

  const toggleNotif = async (key) => {
    const updated = updateSettings({ [key]: !settings[key] });

    if (window.Capacitor && window.Capacitor.Plugins.LocalNotifications) {
      if (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'adhan_voice'].includes(key) || key === 'adhan_voice_type') {
        const timings = STORAGE_SERVICE.getItem('athr_prayer_times');
        if (timings) {
          await NOTIFICATION_SERVICE.scheduleAdhan(
            timings,
            {
              fajr: updated.fajr,
              dhuhr: updated.dhuhr,
              asr: updated.asr,
              maghrib: updated.maghrib, // ✅ FIX 4: maghrib was missing here too
              isha: updated.isha
            },
            updated.adhan_voice && updated.adhan_voice_type ? updated.adhan_voice_type : 'makkah'
          );
        }
      }

      if (['salawat', 'salawat_interval', 'salawat_sound', 'salawat_text'].includes(key)) {
        if (updated.salawat) {
          await NOTIFICATION_SERVICE.scheduleSalawat(
            updated.salawat_interval,
            updated.salawat_text,
            updated.salawat_sound
          );
        } else {
          await NOTIFICATION_SERVICE.clearChannel('salawat-channel-v2');
        }
      }
    }
  };

  const handleSalawatChange = (e) => {
    const { name, value } = e.target;
    const updated = updateSettings({ [name]: name === 'salawat_interval' ? parseInt(value) : value });
    if (updated.salawat && window.Capacitor) {
      NOTIFICATION_SERVICE.scheduleSalawat(updated.salawat_interval, updated.salawat_text, updated.salawat_sound);
    }
  };

  // ✅ FIX 5: Unified audio player helper — avoids duplicated logic between previewAdhan & previewSalawat
  const playPreview = (type, audioRef, paths) => {
    // Stop if already playing this type
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (playingPreview === type) {
      setPlayingPreview(null);
      return;
    }

    // Stop the other audio too
    const otherRef = type === 'adhan' ? salawatAudioRef : adhanAudioRef;
    if (otherRef.current) {
      otherRef.current.pause();
      otherRef.current = null;
    }

    let idx = 0;
    const tryPlay = (path) => {
      const audio = new Audio(path);
      audioRef.current = audio;

      audio.onplay = () => setPlayingPreview(type);
      audio.onended = () => {
        setPlayingPreview(null);
        audioRef.current = null;
      };
      audio.onerror = () => {
        idx++;
        if (idx < paths.length) {
          tryPlay(paths[idx]);
        } else {
          setPlayingPreview(null);
          audioRef.current = null;
          alert('⚠️ عذراً، تعذر تشغيل ملف الصوت. يرجى التأكد من وجود الملفات في مجلد Imge/sounds');
        }
      };

      // ✅ FIX 6: Handle play() promise rejection properly (browser autoplay policy)
      audio.play().catch((err) => {
        console.error('Audio play failed:', err);
        setPlayingPreview(null);
        audioRef.current = null;
      });
    };

    tryPlay(paths[idx]);
  };

  const previewAdhan = () => {
    const paths = [
      `Imge/sounds/adhan_${settings.adhan_voice_type}.mp3`,
      `/Imge/sounds/adhan_${settings.adhan_voice_type}.mp3`,
      `assets/Imge/sounds/adhan_${settings.adhan_voice_type}.mp3`
    ];
    playPreview('adhan', adhanAudioRef, paths);
  };

  const previewSalawat = () => {
    const paths = [
      `Imge/sounds/prophet_muhammad.mp3`,
      `/Imge/sounds/prophet_muhammad.mp3`,
      `assets/Imge/sounds/prophet_muhammad.mp3`
    ];
    playPreview('salawat', salawatAudioRef, paths);
  };

  const testNotification = async (type) => {
    if (!window.Capacitor) {
      alert('⚠️ هذه الميزة تعمل فقط على تطبيق الموبايل');
      return;
    }
    const { LocalNotifications } = window.Capacitor.Plugins;

    try {
      const soundFile = type === 'adhan'
        ? `adhan_${settings.adhan_voice_type}`
        : 'prophet_muhammad';

      if (window.Capacitor.getPlatform() === 'android') {
        const channelId = type === 'adhan'
          ? `adhan-channel-${settings.adhan_voice_type}`
          : 'salawat-channel-v2';
        const channelName = type === 'adhan'
          ? `Adhan Notifications (${settings.adhan_voice_type})`
          : 'Salawat Reminders';

        await LocalNotifications.createChannel({
          id: channelId,
          name: channelName,
          importance: 5,
          visibility: 1,
          sound: `${soundFile}.mp3`,
          vibration: true
        });
      }

      // ✅ FIX 7: Use unique IDs per test to avoid Android silently dropping duplicate IDs
      const notifId = type === 'adhan' ? Math.floor(Math.random() * 900) + 100 : Math.floor(Math.random() * 900) + 1000;

      const notif = type === 'adhan' ? {
        title: 'تجربة تنبيه الأذان',
        body: 'إذا سمعت الصوت، فهذا يعني أن النظام يعمل بنجاح',
        id: notifId,
        schedule: { at: new Date(Date.now() + 2000) }, // ✅ FIX 8: 2s delay — 1s is too fast and often dropped
        sound: `${soundFile}.mp3`,
        channelId: `adhan-channel-${settings.adhan_voice_type}`
      } : {
        title: 'تجربة صلاة على النبي ﷺ',
        body: settings.salawat_text,
        id: notifId,
        schedule: { at: new Date(Date.now() + 2000) },
        sound: `prophet_muhammad.mp3`,
        channelId: 'salawat-channel-v2'
      };

      await LocalNotifications.schedule({ notifications: [notif] });
      alert('🔔 تم إرسال تنبيه تجريبي، سيظهر خلال ثانيتين');
    } catch (err) {
      console.error('Test notif error:', err);
      alert('❌ فشل إرسال التنبيه: ' + err.message);
    }
  };

  const rows = [
    { key: 'suhoor', label: '🌙 تنبيه السحور (قبل ٣٠ دقيقة)' },
    { key: 'iftar', label: '🌅 تنبيه الإفطار (عند الأذان)' },
    { key: 'fajr', label: '🌙 تنبيه الفجر' },
    { key: 'dhuhr', label: '☀️ تنبيه الظهر' },
    { key: 'asr', label: '🌤 تنبيه العصر' },
    { key: 'maghrib', label: '🌇 تنبيه المغرب' }, // ✅ FIX 9: maghrib row was missing from UI entirely
    { key: 'isha', label: '🌌 تنبيه العشاء' },
    { key: 'quran_remind', label: '📖 تذكير التلاوة اليومي' },
    { key: 'qadr_remind', label: '⭐ تنبيه العشر الأواخر' },
    { key: 'adhan_voice', label: '🕌 تفعيل صوت الأذان الكامل' },
    { key: 'salawat', label: '✨ التذكير بالصلاة على النبي ﷺ' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="text-center py-4">
        <h2 className="text-xl font-bold text-gold font-scheherazade">🔔 إعدادات التنبيهات</h2>
      </div>

      <div className="bg-black/5 border border-black/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
        {rows.map((row) => (
          <React.Fragment key={row.key}>
            <div className="flex justify-between items-center p-4 hover:bg-black/5 transition-colors">
              <span className="text-sm text-text-dark">{row.label}</span>
              <button
                onClick={() => toggleNotif(row.key)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings[row.key] ? 'bg-gold' : 'bg-black/10'
                  }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings[row.key] ? 'right-1' : 'left-1'  // ✅ FIX 10: 'right-7' was wrong — thumb went off-screen when OFF
                    }`}
                />
              </button>
            </div>

            {row.key === 'adhan_voice' && settings.adhan_voice && (
              <div className="p-4 bg-gold/5 space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gold">صوت المؤذن:</label>
                  <div className="flex gap-2">
                    <select
                      name="adhan_voice_type"
                      value={settings.adhan_voice_type}
                      onChange={(e) => {
                        const updated = updateSettings({ adhan_voice_type: e.target.value });
                        const timings = STORAGE_SERVICE.getItem('athr_prayer_times');
                        if (timings && window.Capacitor) {
                          NOTIFICATION_SERVICE.scheduleAdhan(
                            timings,
                            {
                              fajr: updated.fajr,
                              dhuhr: updated.dhuhr,
                              asr: updated.asr,
                              maghrib: updated.maghrib,
                              isha: updated.isha
                            },
                            updated.adhan_voice_type
                          );
                        }
                      }}
                      className="flex-1 bg-black/40 border border-gold/20 rounded-lg p-2 text-sm text-ivory outline-none"
                    >
                      <option value="makkah">أذان مكة المكرمة</option>
                      <option value="madinah">أذان المدينة المنورة</option>
                      <option value="naseralqatamy">أذان ناصر القطامي</option>
                    </select>
                    <button
                      onClick={previewAdhan}
                      className="bg-gold/20 border border-gold/30 rounded-lg px-4 py-2 text-xs text-gold hover:bg-gold/30 transition-all"
                    >
                      {playingPreview === 'adhan' ? '⏸ إيقاف' : '▶ استماع'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => testNotification('adhan')}
                  className="w-full bg-black/5 border border-black/10 rounded-lg py-2 text-xs text-text-dark hover:bg-black/10 transition-all"
                >
                  🔔 تجربة الأذان الآن
                </button>
              </div>
            )}

            {row.key === 'salawat' && settings.salawat && (
              <div className="p-4 bg-gold/5 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gold">تكرار التذكير:</label>
                    <select
                      name="salawat_interval"
                      value={settings.salawat_interval}
                      onChange={handleSalawatChange}
                      className="bg-black/40 border border-gold/20 rounded-lg p-2 text-sm text-ivory outline-none"
                    >
                      <option value="30">كل ٣٠ دقيقة</option>
                      <option value="60">كل ساعة</option>
                      <option value="120">كل ساعتين</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gold">نص التذكير:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="salawat_text"
                        value={settings.salawat_text}
                        onChange={handleSalawatChange}
                        placeholder="نص التذكير..."
                        className="flex-1 bg-black/40 border border-gold/20 rounded-lg p-2 text-sm text-ivory outline-none text-right"
                      />
                      <button
                        onClick={previewSalawat}
                        className="bg-gold/20 border border-gold/30 rounded-lg px-4 py-2 text-xs text-gold hover:bg-gold/30 transition-all"
                      >
                        {playingPreview === 'salawat' ? '⏸' : '▶'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-gold">تنبيه بالصوت:</span>
                    <button
                      onClick={() => updateSettings({ salawat_sound: !settings.salawat_sound })}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${settings.salawat_sound ? 'bg-gold' : 'bg-black/10'
                        }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.salawat_sound ? 'right-0.5' : 'left-0.5' // ✅ FIX 10 (same): fix toggle thumb
                          }`}
                      />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => testNotification('salawat')}
                  className="w-full bg-black/5 border border-black/10 rounded-lg py-2 text-xs text-text-dark hover:bg-black/10 transition-all"
                >
                  ✨ تجربة الصلاة على النبي الآن
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-[10px] text-gold text-center opacity-60">التنبيهات تعمل في الخلفية عبر نظام الموبايل</p>
    </div>
  );
};

export default NotificationSettings;