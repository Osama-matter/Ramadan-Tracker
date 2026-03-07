import React from 'react';

const QuickAccessGrid = ({ onFeatureClick }) => {
    const features = [
        { id: 'adhkar', label: 'أذكار', icon: '📿' },
        { id: 'mosque', label: 'مساجد', icon: '🕌' },
        { id: 'qibla', label: 'القبلة', icon: '🧭' },
        { id: 'zakat', label: 'الزكاة', icon: '💰' },
        { id: 'goals', label: 'أهداف', icon: '🎯' },
        { id: 'cards', label: 'بطاقات', icon: '🃏' },
        { id: 'stats', label: 'إحصائيات', icon: '📊' },
        { id: 'ai', label: 'المساعد', icon: '🤖' },
    ];

    return (
        <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="text-[15px] font-bold text-text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-gold to-green-light rounded-sm"></span>
                الوصول السريع
            </h2>

            <div className="grid grid-cols-4 gap-2.5">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => onFeatureClick(feature.id)}
                        className="bg-white/95 border border-black/5 rounded-2xl py-3.5 px-2 flex flex-col items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 transition-transform"
                    >
                        <span className="text-[22px] mb-1.5 drop-shadow-sm">{feature.icon}</span>
                        <span className="text-[10px] font-bold text-text-mid">{feature.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickAccessGrid;
