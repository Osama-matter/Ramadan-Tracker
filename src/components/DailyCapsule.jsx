import React, { useMemo } from 'react';
import { HADITH_DATA } from '../data/adhkar/hadithData';

const DailyCapsule = () => {
    // Select a hadith based on the day of the year to keep it consistent for the whole day
    const todaysHadith = useMemo(() => {
        const today = new Date();
        const start = new Date(today.getFullYear(), 0, 0);
        const diff = today - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        return HADITH_DATA[dayOfYear % HADITH_DATA.length];
    }, []);

    return (
        <div className="mb-6 animate-in fade-in duration-500">
            <h2 className="text-[15px] font-bold text-text-dark mb-3 flex items-center gap-2 relative">
                <span className="w-1 h-5 bg-gradient-to-b from-gold to-green-light rounded-sm"></span>
                الكبسولة اليومية ✨
            </h2>

            <div className="bg-gradient-to-br from-green-main to-green-mid rounded-2xl p-5 relative overflow-hidden shadow-lg">
                {/* Decorative Star */}
                <div className="absolute top-2 right-4 text-4xl text-gold/15 pointer-events-none select-none">
                    ✦
                </div>

                <div className="text-gold-light text-[11px] font-bold tracking-wider uppercase mb-2">
                    حديث اليوم - {todaysHadith.category}
                </div>

                <p className="text-white text-[15px] font-medium leading-[1.7] mb-3 relative z-10">
                    «{todaysHadith.text}»
                </p>

                <div className="text-text-mid text-[11px] italic mb-4">
                    رواه {todaysHadith.source}
                </div>

                <button className="bg-gold/25 border border-gold/50 text-gold-light px-4 py-2 rounded-full text-xs font-semibold hover:bg-gold/30 transition-colors active:scale-95">
                    مشاركة الكبسولة →
                </button>
            </div>
        </div>
    );
};

export default DailyCapsule;
