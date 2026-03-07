import React, { useState, useEffect } from 'react';
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
import { AISuggestion, StreakCard, SpiritualAnalytics, PrayerTimes } from './features/dashboard';
import AdhkarSection from './components/AdhkarSection';
import { useUserStats } from './hooks/useUserStats';
import { STORAGE_SERVICE } from './services/storageService';
import { NOTIFICATION_SERVICE } from './services/notificationService';
import { FOREGROUND_SERVICE } from './services/foregroundService';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [adhkarSubTab, setAdhkarSubTab] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => STORAGE_SERVICE.getItem('athr_dark_mode', true)); // Default to dark or saved preference
  const { stats } = useUserStats();

  useEffect(() => {
    const handleSubTabChange = (e) => {
      setActiveTab('adhkar');
      setAdhkarSubTab(e.detail);
    };
    window.addEventListener('changeTab', handleSubTabChange);
    return () => window.removeEventListener('changeTab', handleSubTabChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    STORAGE_SERVICE.setItem('athr_dark_mode', isDarkMode);
  }, [isDarkMode]);

  // Sync Background Notifications on App Load
  useEffect(() => {
    const syncNotifications = async () => {
      if (window.Capacitor && window.Capacitor.Plugins.LocalNotifications) {
        const settings = STORAGE_SERVICE.getItem('athr_notifications', {});
        const timings = STORAGE_SERVICE.getItem('athr_prayer_times');

        // Push Adhan 7 days forward if any enabled
        if (timings && (settings.fajr || settings.dhuhr || settings.asr || settings.maghrib || settings.isha)) {
          await NOTIFICATION_SERVICE.scheduleAdhan(
            timings,
            { fajr: settings.fajr, dhuhr: settings.dhuhr, asr: settings.asr, maghrib: settings.maghrib, isha: settings.isha },
            settings.adhan_voice_type || 'makkah'
          );
        }

        // Push Salawat 3 days forward if enabled
        if (settings.salawat && settings.salawat_interval) {
          await NOTIFICATION_SERVICE.scheduleSalawat(settings.salawat_interval, settings.salawat_text, settings.salawat_sound);
        }

        // Start Foreground Service Live Ticker if timings exist
        if (timings) {
          console.log("Found timings, initiating Foreground Service in 2s...", timings);
          setTimeout(async () => {
            try {
              await FOREGROUND_SERVICE.startService(timings);
              console.log("Foreground Service start command sent.");
            } catch (err) {
              console.error("Error starting service from App.jsx:", err);
            }
          }, 2000);
        } else {
          console.warn("No prayer timings found in storage, FG service won't start.");
        }
      }
    };
    syncNotifications();
  }, []);

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
    else if (id === 'duacards') setActiveTab('adhkar');
    else if (id === 'qibla') setActiveTab('qibla');
    else if (id === 'zakat') setActiveTab('zakat');
    else if (id === 'cards') setActiveTab('cards');
    else if (id === 'names') setActiveTab('names');
    else if (id === 'tafsir') setActiveTab('tafsir');
    else if (id === 'planner') setActiveTab('planner');
    else if (id === 'badges') setActiveTab('badges');
    else if (id === 'faq') setActiveTab('faq');
    else if (id === 'mosque') setActiveTab('mosque');
    else if (id === 'stats') setActiveTab('stats');
    else if (id === 'ai') setActiveTab('ai');
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
      case 'ai':
        return <AIAssistant />;
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

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-cream text-right relative overflow-hidden font-tajawal selection:bg-green-light/30 selection:text-green-main" dir="rtl">
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="relative overflow-hidden bg-gradient-to-br from-green-main via-green-mid to-[#3d8b68] px-6 pt-6 pb-0">
          <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
            <img 
              src="/Atherlogo.jpeg" 
              alt="Logo" 
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-lg"
              onError={(e) => e.target.style.display = 'none'}
            />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-xl text-gold-light active:scale-95 transition-all shadow-lg"
              title="تغيير المظهر"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          {/* Decorative Circle Background in Header */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] rounded-full z-0"></div>

          {/* PrayerHero */}
          <PrayerHero />
        </header>

        {/* Curved Header Bottom */}
        <div className="h-8 bg-green-mid relative -mt-[1px] z-0">
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-cream rounded-t-[30px]"></div>
        </div>

        <main className="flex-1 w-full max-w-xl mx-auto px-6 pt-4 pb-32">
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <UpdateModal />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
