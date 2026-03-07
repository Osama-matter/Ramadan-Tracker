import React, { useState, useEffect } from 'react';
import { HADITH_DATA } from '../data/adhkar/hadithData';

const HadithSection = () => {
  const [hadiths, setHadiths] = useState([]);
  const [dailyHadith, setDailyHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setHadiths(HADITH_DATA);
    // Select a random hadith for today
    const todayIndex = new Date().getDate() % HADITH_DATA.length;
    setDailyHadith(HADITH_DATA[todayIndex]);
    setLoading(false);
  }, []);

  const categories = ['all', ...new Set(HADITH_DATA.map(h => h.category))];

  const filteredHadiths = filter === 'all' ? hadiths : hadiths.filter(h => h.category === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">أحاديث نبوية</h2>
        <p className="text-text-mid text-sm">كلام النبي ﷺ نور يضيء قلوبنا</p>
      </div>

      {dailyHadith && (
        <div className="bg-gradient-to-br from-gold/20 to-transparent p-6 rounded-3xl border border-gold/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-2 bg-gold text-green-main text-[10px] font-bold rounded-bl-xl">حديث اليوم</div>
          <p className="text-xl font-bold text-gold-light font-amiri leading-relaxed mb-4 text-center mt-4">
            "{dailyHadith.text}"
          </p>
          <div className="text-center text-xs text-gold">المصدر: {dailyHadith.source}</div>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-xs transition-all border ${
              filter === cat
                ? 'bg-gold text-green-main border-gold font-bold'
                : 'bg-black/5 text-text-dark border-black/10'
            }`}
          >
            {cat === 'all' ? 'الكل' : cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredHadiths.map(hadith => (
          <div key={hadith.id} className="p-5 bg-black/5 border border-black/10 rounded-2xl hover:border-gold/20 transition-all">
            <p className="text-lg font-amiri text-text-dark mb-3 leading-relaxed">"{hadith.text}"</p>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gold">{hadith.source}</span>
              <span className="px-2 py-1 bg-black/5 rounded-lg text-gold-light">{hadith.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HadithSection;
