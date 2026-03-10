import React, { useState, useEffect, useRef } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';
import PrayerHero from './components/PrayerHero';
import DailyCapsule from './components/DailyCapsule';
import QuickAccessGrid from './components/QuickAccessGrid';
import DailyChallenges from './components/DailyChallenges';
import AIWidget from './components/AIWidget';
import BottomNav from './components/BottomNav';
import AboutModal from './components/AboutModal';
import UpdateModal from './components/UpdateModal';
import RamadanTracker from './components/RamadanTracker';
import TasbeehCounter from './components/TasbeehCounter';
import GoalsManager from './components/GoalsManager';
import ZakatCalculator from './components/ZakatCalculator';
import DashboardStats from './components/DashboardStats';
import FeatureGrid from './components/FeatureGrid';
import AIAssistant from './components/AIAssistant';
import SalahModeSettings from './components/SalahModeSettings';
import SalahModeOverlay from './components/SalahModeOverlay';
import QuranReader from './components/QuranReader';
import HadithSection from './components/HadithSection';
import QiblaCompass from './components/QiblaCompass';
import AsmaulHusna from './components/AsmaulHusna';
import RamadanCards from './components/RamadanCards';
import QuranKhatma from './components/QuranKhatma';
import TafsirSection from './components/TafsirSection';
import RamadanPlanner from './components/RamadanPlanner';
import Achievements from './components/Achievements';
import FatawaFAQ from './components/FatawaFAQ';
import MosqueFinder from './components/MosqueFinder';
import NotificationSettings from './components/NotificationSettings';
import QadrWidget from './components/QadrWidget';
import LastTenDaysPlan from './components/LastTenDaysPlan';
import { AISuggestion, StreakCard, SpiritualAnalytics, PrayerTimes } from './features/dashboard';
import AdhkarSection from './components/AdhkarSection';
import { useUserStats } from './hooks/useUserStats';
import { STORAGE_SERVICE } from './services/storageService';
import { NOTIFICATION_SERVICE } from './services/notificationService';
import { FOREGROUND_SERVICE } from './services/foregroundService';
import { useSalahModeContext, SalahModeProvider } from './contexts/SalahModeContext';
import WebLandingPage from './components/WebLandingPage';

function App() {
  return (
    <ErrorBoundary>
      <SalahModeProvider>
        <AppContent />
      </SalahModeProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const isWeb = false; // Forced to false to show mobile UI on web
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [adhkarSubTab, setAdhkarSubTab] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => STORAGE_SERVICE.getItem('athr_dark_mode', true));
  const { stats } = useUserStats();
  const { isActive: isSalahMode } = useSalahModeContext();

  // 🌙 Auto Dark Mode Logic
  useEffect(() => {
    const checkAutoDark = () => {
      const settings = STORAGE_SERVICE.getItem('athr_notifications', {});
      if (!settings.auto_dark_mode) return;

      const timings = STORAGE_SERVICE.getItem('athr_prayer_times');
      if (!timings || !timings.Maghrib) return;

      const [h, m] = timings.Maghrib.split(':').map(Number);
      const sunset = new Date();
      sunset.setHours(h, m, 0, 0);

      const [fH, fM] = (timings.Fajr || "04:30").split(':').map(Number);
      const sunrise = new Date();
      sunrise.setHours(fH, fM, 0, 0);

      const now = new Date();
      // إذا كان الوقت بعد المغرب أو قبل الفجر -> تفعيل الوضع الداكن
      const shouldBeDark = now >= sunset || now < sunrise;
      
      if (shouldBeDark !== isDarkMode) {
        setIsDarkMode(shouldBeDark);
      }
    };

    checkAutoDark();
    const timer = setInterval(checkAutoDark, 1000 * 60 * 5); // فحص كل 5 دقائق
    return () => clearInterval(timer);
  }, [isDarkMode]);

  useEffect(() => {
    const handleSubTabChange = (e) => {
      setActiveTab('adhkar');
      setAdhkarSubTab(e.detail);
    };
    window.addEventListener('changeTab', handleSubTabChange);
    
    const handleNavigate = (e) => {
      if (e.detail.tab) setActiveTab(e.detail.tab);
      // إذا كان هناك prompt مقترح من AI، يمكن حفظه في storage مؤقتاً
      if (e.detail.prompt) {
        STORAGE_SERVICE.setItem('athr_pending_image_prompt', e.detail.prompt);
      }
    };
    window.addEventListener('athr_navigate', handleNavigate);

    return () => {
      window.removeEventListener('changeTab', handleSubTabChange);
      window.removeEventListener('athr_navigate', handleNavigate);
    };
  }, []);

  // Sync dark mode class and storage (user preference)
  useEffect(() => {
    const isDark = isSalahMode || isDarkMode;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Only save the explicit user preference, not the temporary Salah Mode override
    STORAGE_SERVICE.setItem('athr_dark_mode', isDarkMode);
  }, [isDarkMode, isSalahMode]);

  // ─── Notification + Foreground Service Init ───────────────────────────────
  useEffect(() => {
    // Expose for SalahModeOverlay reschedule
    window.NOTIFICATION_SERVICE_INTERNAL = NOTIFICATION_SERVICE;
    
    if (isWeb) return;
    if (!window.Capacitor || !window.Capacitor.Plugins.LocalNotifications) return;

    const { App: CapApp } = window.Capacitor.Plugins;

    /**
     * Main boot routine — runs on app open and every resume from background.
     */
    const syncNotifications = async () => {
      try {
        // 1. Request / verify permissions safely
        let granted = false;
        try {
          granted = await NOTIFICATION_SERVICE.requestPermissions();
        } catch (e) {
          console.warn('[App] requestPermissions rejected:', e);
        }

        if (!granted) {
          console.warn('[App] Notification permission not granted — skipping scheduling.');
          return;
        }

        const settings = STORAGE_SERVICE.getItem('athr_notifications', {});
        const timings = STORAGE_SERVICE.getItem('athr_prayer_times');

        // 2. Schedule Adhan notifications (7 days) if any prayer is enabled
        const anyPrayerEnabled =
          settings.fajr || settings.dhuhr || settings.asr ||
          settings.maghrib || settings.isha;

        if (timings && anyPrayerEnabled) {
          await NOTIFICATION_SERVICE.scheduleAdhan(
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
          console.log('[App] Adhan notifications scheduled ✓');
        }

        // 3. Schedule Salawat reminders (3 days) if enabled
        if (settings.salawat && settings.salawat_interval) {
          await NOTIFICATION_SERVICE.scheduleSalawat(
            settings.salawat_interval,
            settings.salawat_text,
            settings.salawat_sound
          );
          console.log('[App] Salawat reminders scheduled ✓');
        }

        // 4. Start / restart the live prayer countdown ticker
        if (timings) {
          await FOREGROUND_SERVICE.startService(timings);
          console.log('[App] Foreground ticker started ✓');
        } else {
          console.warn('[App] No prayer timings in storage — live ticker skipped.');
        }
      } catch (err) {
        console.error('[App] syncNotifications error:', err);
      }
    };

    // Run on app open
    syncNotifications();

    // Re-run every time the app comes back from the background
    let resumeListener = null;
    if (CapApp) {
      try {
        const promiseOrHandle = CapApp.addListener('appStateChange', ({ isActive }) => {
          if (isActive) {
            console.log('[App] Resumed from background — refreshing ticker...');
            syncNotifications();
          }
        });

        // Handle Capacitor 3+ Promises and older synchronous returns gracefully
        if (promiseOrHandle && promiseOrHandle.then) {
          promiseOrHandle
            .then(handle => { resumeListener = handle; })
            .catch(err => console.warn('[App] failed to get listener handle:', err));
        } else {
          resumeListener = promiseOrHandle;
        }
      } catch (err) {
        console.warn('[App] addListener threw error synchronously:', err);
      }
    }

    // Cleanup: stop the ticker and remove the resume listener when component unmounts
    return () => {
      FOREGROUND_SERVICE.stopService();
      if (resumeListener) resumeListener.remove();
    };
  }, [isWeb]);

  const handleFeatureClick = (id) => {
    setAdhkarSubTab(null);
    if (id === 'about') setIsAboutOpen(true);
    else if (id === 'home') setActiveTab('home');
    else if (id === 'prayer') setActiveTab('prayer');
    else if (id === 'goals') setActiveTab('goals');
    else if (id === 'quran_read') setActiveTab('quran');
    else if (id === 'quran_khatma') setActiveTab('quran');
    else if (id === 'adhkar') setActiveTab('adhkar');
    else if (id === 'hadiths') setActiveTab('hadiths');
    else if (id === 'extra') setActiveTab('hadiths');
    else if (id === 'qadr') setActiveTab('qadr');
    else if (id === 'duacards') setActiveTab('cards');
    else if (id === 'qibla') setActiveTab('qibla');
    else if (id === 'zakat') setActiveTab('zakat');
    else if (id === 'cards') setActiveTab('cards');
    else if (id === 'names') setActiveTab('names');
    else if (id === 'tafsir') setActiveTab('tafsir');
    else if (id === 'planner') setActiveTab('planner');
    else if (id === 'last10') setActiveTab('last10');
    else if (id === 'badges') setActiveTab('badges');
    else if (id === 'faq') setActiveTab('faq');
    else if (id === 'mosque') setActiveTab('mosque');
    else if (id === 'stats') setActiveTab('stats');
    else if (id === 'ai') setActiveTab('ai');
    else if (id === 'salah_settings') setActiveTab('salah_settings');
    else if (id === 'mosque') window.open('https://www.google.com/maps/search/mosque+near+me', '_blank');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-0 animate-in fade-in duration-700">
            {/* 1. Daily Capsule */}
            <DailyCapsule />

            {/* 2. Quick Access Grid */}
            <QuickAccessGrid onFeatureClick={handleFeatureClick} />

            {/* 3. Daily Challenges */}
            <DailyChallenges />

            {/* 4. Stats Row */}
            <DashboardStats stats={{
              streak: stats.streak || 0,
              points: stats.points || 0,
              tasbeeh: STORAGE_SERVICE.getItem('athr_tasbeeh_total_today', 0) || 0
            }} />
          </div>
        );
      case 'prayer':
        return (
          <div className="space-y-8 pb-24 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gold font-scheherazade mb-1">مواقيت الصلاة</h2>
              <div className="h-px w-20 bg-gold/30 mx-auto"></div>
            </div>
            <PrayerTimes />
            <div className="pt-8 border-t border-white/5">
              <NotificationSettings />
            </div>
            <div className="pt-8 border-t border-white/5">
              <SalahModeSettings />
            </div>
          </div>
        );
      case 'quran':
        return (
          <div className="space-y-8 pb-24">
            <QuranReader />
          </div>
        );
      case 'adhkar':
        return (
          <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            {adhkarSubTab ? (
              <div className="space-y-6">
                <button
                  onClick={() => setAdhkarSubTab(null)}
                  className="text-gold text-sm flex items-center gap-1 px-2"
                >
                  <span>→</span> العودة للمسبحة
                </button>
                <AdhkarSection type={adhkarSubTab} />
              </div>
            ) : (
              <TasbeehCounter />
            )}
          </div>
        );
      case 'qadr':
        return <QadrWidget />;
      case 'last10':
        return <LastTenDaysPlan />;
      case 'ai':
        return <AIAssistant />;
      case 'salah_settings':
        return <SalahModeSettings />;
      case 'more':
        return <FeatureGrid onFeatureClick={handleFeatureClick} />;
      case 'zakat':
        return <ZakatCalculator />;
      case 'goals':
        return <GoalsManager />;
      case 'qibla':
        return <QiblaCompass />;
      case 'names':
        return <AsmaulHusna />;
      case 'tafsir':
        return <TafsirSection />;
      case 'planner':
        return <RamadanPlanner />;
      case 'badges':
        return <Achievements />;
      case 'faq':
        return <FatawaFAQ />;
      case 'mosque':
        return <MosqueFinder />;
      case 'hadiths':
        return <HadithSection />;
      case 'cards':
        return <RamadanCards />;
      case 'stats':
        return (
          <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gold font-scheherazade">إحصائياتي</h2>
            </div>
            <SpiritualAnalytics />
            <StreakCard streak={stats.streak} points={stats.points} />
          </div>
        );
      default:
        return <div className="text-center py-20 text-white/50">قيد التطوير...</div>;
    }
  };

  if (isWeb) {
    return <WebLandingPage />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode || isSalahMode ? 'bg-[#03050f]' : 'bg-cream'} text-right relative overflow-hidden font-tajawal selection:bg-green-light/30 selection:text-green-main transition-colors duration-500`} dir="rtl">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="relative overflow-hidden bg-gradient-to-br from-green-main via-green-mid to-[#3d8b68] px-6 pt-6 pb-0">
          <div className="absolute top-6 left-6 z-50 flex items-center gap-3">

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl text-gold-light active:scale-95 transition-all shadow-lg"
              title="تغيير المظهر"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] rounded-full z-0"></div>
          <PrayerHero />
        </header>

        <div className="h-8 bg-green-mid relative -mt-[1px] z-0">
          <div className={`absolute bottom-0 left-0 right-0 h-8 ${isDarkMode || isSalahMode ? 'bg-[#03050f]' : 'bg-cream'} rounded-t-[30px] transition-colors duration-500`}></div>
        </div>

        <main className="flex-1 w-full max-w-xl mx-auto px-6 pt-4 pb-32">
          {renderContent()}
        </main>

        <SalahModeOverlay onQuickAction={handleFeatureClick} />
        <BottomNav activeTab={activeTab} onTabChange={(tab) => {
          setAdhkarSubTab(null);
          setActiveTab(tab);
        }} />
      </div>

      <UpdateModal />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
