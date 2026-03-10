import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const TasbeehCounter = () => {
  const [count, setCount] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [target, setTarget] = useState(33);
  const [currentDhikr, setCurrentDhikr] = useState('سبحان الله');
  const [view, setView] = useState('categories'); // 'categories' or 'counter'

  const categories = [
    { id: 'tasbeeh', name: 'المسبحة الإلكترونية', icon: '📿' },
    { id: 'morning', name: 'أذكار الصباح', icon: '🌅' },
    { id: 'evening', name: 'أذكار المساء', icon: '🌙' },
    { id: 'after_prayer', name: 'أذكار بعد الصلاة', icon: '🕌' },
    { id: 'general', name: 'أدعية عامة', icon: '✨' },
  ];

  const adhkars = [
    { text: 'سبحان الله', target: 33 },
    { text: 'الحمد لله', target: 33 },
    { text: 'الله أكبر', target: 33 },
    { text: 'لا إله إلا الله', target: 100 },
    { text: 'أستغفر الله', target: 100 },
    { text: 'اللهم صلِّ على محمد', target: 100 },
  ];

  useEffect(() => {
    const savedTotal = STORAGE_SERVICE.getItem('athr_tasbeeh_total_today', 0);
    setTotalToday(savedTotal);
  }, []);

  const handleIncrement = (e) => {
    if (e) e.preventDefault();
    const newCount = count + 1;
    setCount(newCount);

    const newTotal = totalToday + 1;
    setTotalToday(newTotal);
    STORAGE_SERVICE.setItem('athr_tasbeeh_total_today', newTotal);

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  if (view === 'categories') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">الأذكار والتسبيح</h2>
          <p className="text-text-mid text-sm font-amiri">«ألا بذكر الله تطمئن القلوب»</p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => cat.id === 'tasbeeh' ? setView('counter') : window.dispatchEvent(new CustomEvent('changeTab', { detail: cat.id }))}
              className="group flex items-center justify-between p-6 bg-black/5 border border-black/10 rounded-3xl hover:border-gold/30 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl bg-gold/10 w-14 h-14 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-gold-light font-scheherazade">{cat.name}</div>
                  {cat.id === 'tasbeeh' && (
                    <div className="text-[10px] text-gold font-bold">إجمالي تسبيح اليوم: {totalToday.toLocaleString('ar-SA')}</div>
                  )}
                </div>
              </div>
              <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity">←</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between px-4">
        <button onClick={() => setView('categories')} className="text-gold text-sm flex items-center gap-1">
          <span>→</span> القائمة
        </button>
        <div className="text-[10px] text-gold font-bold">إجمالي اليوم: {totalToday.toLocaleString('ar-SA')}</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
        {adhkars.map((dhikr, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentDhikr(dhikr.text);
              setTarget(dhikr.target);
              setCount(0);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] transition-all border font-bold ${currentDhikr === dhikr.text
              ? 'bg-gold text-green-main border-gold'
              : 'bg-black/5 text-text-dark border-black/10'
              }`}
          >
            {dhikr.text}
          </button>
        ))}
      </div>

      <button
        onClick={handleIncrement}
        className="relative aspect-square max-w-[300px] mx-auto flex flex-col items-center justify-center bg-surface rounded-full border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] group active:scale-95 transition-transform duration-75 w-full cursor-pointer overflow-hidden"
        aria-label="تسبيح"
      >
        <div className="absolute inset-0 rounded-full border-[6px] border-gold/10 pointer-events-none"></div>
        <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse pointer-events-none m-2"></div>
        <div className="text-gold-dark text-lg mb-2 font-scheherazade z-20 pointer-events-none font-bold">{currentDhikr}</div>
        <div className="text-7xl font-bold text-green-main font-mono mb-2 z-20 drop-shadow-sm pointer-events-none">{count}</div>
        <div className="text-text-mid text-[10px] uppercase tracking-[0.2em] z-20 pointer-events-none">الهدف: {target.toLocaleString('ar-SA')}</div>
      </button>

      <div className="flex justify-center gap-4 px-4">
        <button
          onClick={handleReset}
          className="flex-1 py-4 rounded-2xl bg-black/5 border border-black/10 text-text-dark text-sm font-bold hover:bg-black/10 transition-all active:scale-95"
        >
          صفر العداد
        </button>
      </div>
    </div>
  );
};

export default TasbeehCounter;
