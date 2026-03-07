import React, { useState, useEffect } from 'react';
import AdhkarCard from './AdhkarCard';
import ALL_ADHKAR from '../data/adhkar';
import { STORAGE_SERVICE } from '../services/storageService';

const AdhkarSection = ({ type }) => {
  const [adhkars, setAdhkars] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const data = ALL_ADHKAR[type] || [];
    setAdhkars(data);
    
    const savedCounts = STORAGE_SERVICE.getItem(`athr_adhkar_${type}`, {});
    setCounts(savedCounts);
  }, [type]);

  const handleIncrement = (id, maxCount) => {
    const current = counts[id] || 0;
    if (current < maxCount) {
      const newCounts = { ...counts, [id]: current + 1 };
      setCounts(newCounts);
      STORAGE_SERVICE.setItem(`athr_adhkar_${type}`, newCounts);
      
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  };

  const titles = {
    morning: 'أذكار الصباح',
    evening: 'أذكار المساء',
    after_prayer: 'أذكار بعد الصلاة',
    qadr: 'أدعية ليلة القدر',
    general: 'أدعية عامة'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-gold font-scheherazade">{titles[type]}</h3>
        <button 
          onClick={() => {
            setCounts({});
            STORAGE_SERVICE.setItem(`athr_adhkar_${type}`, {});
          }}
          className="text-[10px] text-text-mid hover:text-gold transition-colors"
        >
          إعادة ضبط الكل
        </button>
      </div>

      <div className="grid gap-4">
        {adhkars.map((adhkar) => (
          <AdhkarCard
            key={adhkar.id}
            text={adhkar.text}
            hint={adhkar.hint}
            count={adhkar.count}
            currentCount={counts[adhkar.id] || 0}
            onIncrement={() => handleIncrement(adhkar.id, adhkar.count)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdhkarSection;
