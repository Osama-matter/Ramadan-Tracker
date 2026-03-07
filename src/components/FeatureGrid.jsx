import React from 'react';

const FeatureGrid = ({ onFeatureClick }) => {
  const features = [
    // --- Worship & Quran ---
    { id: 'home', label: 'متابعة رمضان', icon: '📅' },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: '🕌' },
    { id: 'quran_read', label: 'قراءة القرآن', icon: '📖', highlight: true },
    { id: 'quran_khatma', label: 'ختمة القرآن', icon: '📚' },
    { id: 'tafsir', label: 'تفسير الجلالين', icon: '📝' },
    { id: 'adhkar', label: 'الأذكار والتسبيح', icon: '📿' },
    { id: 'qadr', label: 'العشر الأواخر', icon: '⭐' },

    // --- Development & Goals ---
    { id: 'goals', label: 'أهدافي الإيمانية', icon: '🎯' },
    { id: 'planner', label: 'تخطيط الشهر', icon: '🗓️', highlight: true },
    { id: 'stats', label: 'إحصائيات الأثر', icon: '📊' },
    { id: 'badges', label: 'أوسمة الأثر', icon: '🏅', highlight: true },

    // --- Knowledge & Tools ---
    { id: 'hadiths', label: 'أحاديث نبوية', icon: '📜' },
    { id: 'names', label: 'أسماء الله الحسنى', icon: '✨' },
    { id: 'faq', label: 'فتاوى الصيام', icon: '❓' },
    { id: 'qibla', label: 'اتجاه القبلة', icon: '📍' },
    { id: 'zakat', label: 'حاسبة الزكاة', icon: '💰' },
    { id: 'duacards', label: 'مكتبة البطاقات', icon: '🖼️' },
    { id: 'mosque', label: 'المساجد القريبة', icon: '🕋', highlight: true },
    { id: 'ai', label: 'المساعد الذكي', icon: '🤖' },

    // --- App Info ---
    { id: 'about', label: 'عن الأثر', icon: 'ℹ️' },
  ];

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="text-center mb-6 mt-4">
        <div className="inline-flex items-center justify-center p-3 bg-gold/10 rounded-full mb-4 ring-1 ring-gold/20">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-3xl font-bold text-green-main font-scheherazade mb-2">
          المزيد من الأثر
        </h2>
        <p className="text-text-mid text-sm font-amiri">أدوات إيمانية تعينك على الطاعة</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onFeatureClick(feature.id)}
            className={`relative overflow-hidden bg-white border ${feature.highlight ? 'border-gold shadow-[0_8px_30px_rgba(212,175,55,0.15)] ring-1 ring-gold' : 'border-black/5 shadow-sm'} rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300 active:scale-95 group`}
          >
            {feature.highlight && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark"></div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 ${feature.highlight ? 'bg-gold/10 shadow-inner' : 'bg-black/5 group-hover:bg-gold/5 group-hover:text-gold'}`}>
              {feature.icon}
            </div>

            <span className={`font-bold font-tajawal text-xs text-center leading-tight ${feature.highlight ? 'text-gold-dark' : 'text-text-dark group-hover:text-gold-dark transition-colors'}`}>
              {feature.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;
