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
        <div className="mb-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-text-dark dark:text-white font-scheherazade flex items-center gap-2">
                    <span className="text-2xl">✨</span> الكبسولة اليومية
                </h2>
                <span className="text-[10px] text-text-dark dark:text-gray-500 font-tajawal font-bold uppercase tracking-widest italic">{todaysHadith.category}</span>
            </div>

            <div className="bg-gradient-to-br from-green-main via-green-mid to-[#1B4332] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-white/5 group">
                {/* Decorative Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/15 transition-all duration-700"></div>

                {/* Decorative Flourish */}
                <div className="absolute top-4 right-6 text-5xl text-gold/5 pointer-events-none select-none font-serif opacity-40 group-hover:scale-110 transition-transform duration-1000">
                    ❝
                </div>

                <div className="relative z-10">
                    <p className="text-white text-lg font-bold font-amiri leading-[1.8] mb-6 text-right drop-shadow-sm">
                        «{todaysHadith.text}»
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gold-light text-[10px] font-bold uppercase tracking-tighter mb-0.5 opacity-80">المصدر</span>
                            <span className="text-gold-light text-xs font-bold font-tajawal">
                                رواه {todaysHadith.source}
                            </span>
                        </div>

                        <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2.5 rounded-2xl text-[11px] font-bold hover:bg-white/20 transition-all active:scale-95 shadow-lg flex items-center gap-2 group/btn">
                            <span>مشاركة</span>
                            <span className="transition-transform group-hover/btn:translate-x-[-2px]">📤</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Flourish */}
                <div className="absolute -bottom-4 -left-4 text-6xl text-gold/5 pointer-events-none select-none font-serif opacity-40 group-hover:scale-110 transition-transform duration-1000">
                    ❞
                </div>
            </div>
        </div>
    );
};

export default DailyCapsule;
