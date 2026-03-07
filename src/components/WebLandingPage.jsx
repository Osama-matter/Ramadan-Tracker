import React from 'react';

const WebLandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fdfcf7] flex flex-col items-center justify-center p-6 text-center font-tajawal">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-main/10 blur-[40px] rounded-full" />
          <img 
            src="/Atherlogo.jpeg" 
            alt="Athar Logo" 
            className="w-24 h-24 mx-auto rounded-2xl shadow-xl border border-gold/20 relative z-10"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-green-main font-scheherazade">تطبيق أثر - رفيقك في رمضان</h1>
          <div className="h-1 w-16 bg-gold mx-auto rounded-full" />
          <p className="text-xl text-text-dark font-medium">تم إغلاق الموقع كنسخة ويب</p>
          <p className="text-text-mid text-sm leading-relaxed">
            للحصول على أفضل تجربة ومتابعة عباداتك بكل سهولة، يرجى تحميل التطبيق الرسمي لنظام الأندرويد والـ iOS.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <a 
            href="https://t.me/Osama_matter" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-green-main text-white rounded-2xl font-bold shadow-lg hover:bg-green-mid active:scale-95 transition-all"
          >
            <span className="text-xl">✈️</span>
            <span>تحميل التطبيق عبر تلجرام</span>
          </a>
          
          <p className="text-[10px] text-gold-dark uppercase tracking-widest font-bold opacity-60">
            Available for Android & iOS
          </p>
        </div>

        <div className="pt-12 text-[10px] text-text-mid">
          &copy; 2026 تطبيق أثر - جميع الحقوق محفوظة
        </div>
      </div>
    </div>
  );
};

export default WebLandingPage;
