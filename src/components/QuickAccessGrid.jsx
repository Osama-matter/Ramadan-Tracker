import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Moon, 
  Sparkles, 
  Compass, 
  Wallet, 
  Target, 
  Image as ImageIcon, 
  BarChart3, 
  Bot 
} from 'lucide-react';

const QuickAccessGrid = ({ onFeatureClick }) => {
    const features = [
        { id: 'quran_read', label: 'القرآن', icon: <BookOpen className="text-emerald-600" /> },
        { id: 'prayer', label: 'الصلاة', icon: <Clock className="text-blue-600" /> },
        { id: 'last10', label: 'العشر الأواخر', icon: <Moon className="text-indigo-600" /> },
        { id: 'adhkar', label: 'أذكار', icon: <Sparkles className="text-amber-600" /> },
        { id: 'qibla', label: 'القبلة', icon: <Compass className="text-rose-600" /> },
        { id: 'zakat', label: 'الزكاة', icon: <Wallet className="text-green-600" /> },
        { id: 'goals', label: 'أهداف', icon: <Target className="text-red-600" /> },
        { id: 'cards', label: 'بطاقات', icon: <ImageIcon className="text-purple-600" /> },
        { id: 'stats', label: 'إحصائيات', icon: <BarChart3 className="text-cyan-600" /> },
        { id: 'ai', label: 'المساعد', icon: <Bot className="text-slate-600" /> },
    ];

    return (
        <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-100 px-1">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-text-dark dark:text-white font-scheherazade flex items-center gap-2">
                    <span className="text-2xl">⚡</span> الوصول السريع
                </h2>
                <span className="text-[10px] text-text-dark dark:text-gray-500 font-tajawal font-bold uppercase tracking-widest italic">المميزات</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {features.map((feature) => (
                    <button
                        key={feature.id}
                        onClick={() => onFeatureClick(feature.id)}
                        className="bg-surface/40 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl py-4 flex flex-col items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 dark:bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            {React.cloneElement(feature.icon, { size: 24 })}
                        </div>
                        <span className="text-[11px] font-bold text-text-dark dark:text-gray-200 font-tajawal">
                            {feature.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickAccessGrid;
