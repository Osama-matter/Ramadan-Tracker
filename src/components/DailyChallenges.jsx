import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';
import { useUserStats } from '../hooks/useUserStats';

const DailyChallenges = () => {
    const { stats: globalStats, updateStats } = useUserStats();
    const initialTasks = [
        { id: 'fajr', title: 'صلاة الفجر في وقتها', xp: 20, done: false, icon: '🕌' },
        { id: 'dhuhr', title: 'صلاة الظهر في وقتها', xp: 20, done: false, icon: '☀️' },
        { id: 'asr', title: 'صلاة العصر في وقتها', xp: 20, done: false, icon: '🌥️' },
        { id: 'maghrib', title: 'صلاة المغرب في وقتها', xp: 20, done: false, icon: '🌅' },
        { id: 'isha', title: 'صلاة العشاء في وقتها', xp: 20, done: false, icon: '🌙' },
        { id: 'quran', title: 'قراءة ورد القرآن اليومي', xp: 30, done: false, icon: '📖' },
        { id: 'morning_azkar', title: 'أذكار الصباح والمساء', xp: 25, done: false, icon: '📿' },
        { id: 'sadaqah', title: 'الصدقة والعمل الصالح', xp: 25, done: false, icon: '🤝' },
    ];

    const [tasks, setTasks] = useState(initialTasks);

    const [progress, setProgress] = useState(0);
    const [totalXp, setTotalXp] = useState(0);

    useEffect(() => {
        // Load today's progress (simplified for redesign preview)
        const saved = STORAGE_SERVICE.getItem('athr_daily_challenges', null);
        if (saved && saved.length === initialTasks.length) {
            setTasks(saved);
            calculateProgress(saved);
        } else {
            setTasks(initialTasks);
            calculateProgress(initialTasks);
        }
    }, []);

    const calculateProgress = (currentTasks) => {
        const doneCount = currentTasks.filter(t => t.done).length;
        setProgress(Math.round((doneCount / currentTasks.length) * 100));

        const xp = currentTasks.filter(t => t.done).reduce((acc, curr) => acc + curr.xp, 0);
        setTotalXp(xp);
    };

    const toggleTask = (id) => {
        const taskToToggle = tasks.find(t => t.id === id);
        const isNowDone = !taskToToggle.done;

        const updated = tasks.map(t =>
            t.id === id ? { ...t, done: isNowDone } : t
        );

        setTasks(updated);
        STORAGE_SERVICE.setItem('athr_daily_challenges', updated);
        calculateProgress(updated);

        // 1. Sync Points with Global Stats
        const pDelta = isNowDone ? taskToToggle.xp : -taskToToggle.xp;
        const currentPoints = globalStats.points || 0;
        updateStats({ points: Math.max(0, currentPoints + pDelta) });

        // Dispatch event for components not using the hook directly
        window.dispatchEvent(new CustomEvent('athr_stats_updated', { 
            detail: { points: Math.max(0, currentPoints + pDelta) } 
        }));

        // 2. Sync with 30-day Tracker (athr_ramadan_days)
        const ramadanDays = STORAGE_SERVICE.getItem('athr_ramadan_days', []);
        if (ramadanDays.length > 0) {
            // Find current day (for simplicity, we assume the first day that isn't fully completed or just day 1 for now)
            // In a real app, this would be tied to the current Hijri date.
            const currentDayIdx = ramadanDays.findIndex(d => !d.completed) || 0;
            const targetDayIdx = currentDayIdx === -1 ? 0 : currentDayIdx;

            const trackerId = id === 'morning_azkar' ? 'dhikr' : id;

            if (ramadanDays[targetDayIdx] && ramadanDays[targetDayIdx].tasks) {
                ramadanDays[targetDayIdx].tasks[trackerId] = isNowDone;

                // Recalculate if all tasks for that day are done
                const allDone = Object.values(ramadanDays[targetDayIdx].tasks).every(status => status === true);
                ramadanDays[targetDayIdx].completed = allDone;

                STORAGE_SERVICE.setItem('athr_ramadan_days', ramadanDays);
            }
        }
    };

    const doneCount = tasks.filter(t => t.done).length;
    const maxTotalXp = tasks.reduce((acc, curr) => acc + curr.xp, 0);

    return (
        <div className="mb-8 bg-surface/40 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-6 border border-black/5 dark:border-white/5 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-dark dark:text-white font-scheherazade flex items-center gap-2">
                        <span className="text-2xl">🏆</span> تحديات اليوم
                    </h2>
                    <p className="text-[10px] text-text-dark dark:text-gray-400 font-tajawal mt-1 font-medium italic">أثمر يومك بالطاعات والذكر</p>
                </div>
                <div className="bg-gold/10 dark:bg-gold/20 text-gold-dark dark:text-gold-light text-[10px] px-3 py-1.5 rounded-full font-bold border border-gold/20 shadow-sm">
                    {doneCount} من {tasks.length} مكتمل
                </div>
            </div>

            <div className="space-y-1">
                {tasks.map((task, idx) => (
                    <button
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full group flex items-center gap-4 py-3.5 px-3 rounded-2xl transition-all active:scale-[0.98] ${task.done ? 'bg-gold/5 dark:bg-white/5' : 'hover:bg-black/5 dark:hover:bg-white/[0.02]'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-500 ${task.done
                            ? 'bg-gold shadow-[0_0_15px_rgba(201,168,76,0.4)] text-white scale-110'
                            : 'bg-black/5 dark:bg-white/10 text-text-mid dark:text-gray-400 group-hover:scale-105'
                            }`}>
                            {task.done ? '✓' : task.icon}
                        </div>

                        <div className="text-right flex-1">
                            <div className={`text-sm font-bold transition-all duration-300 ${task.done ? 'text-gold line-through opacity-60' : 'text-text-dark dark:text-gray-100'
                                }`}>
                                {task.title}
                            </div>
                            <div className={`text-[10px] font-bold mt-0.5 ${task.done ? 'text-text-dark/40 opacity-40' : 'text-text-dark dark:text-gray-500'}`}>
                                +{task.xp} نقطة أثر
                            </div>
                        </div>

                        {!task.done && (
                            <div className="w-5 h-5 rounded-full border-2 border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 rounded-full bg-gold"></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between items-end mb-3">
                    <div className="text-right">
                        <div className="text-[10px] text-text-dark dark:text-gray-400 font-bold mb-1">التقدم المحرز اليوم</div>
                        <div className="text-lg font-black text-text-dark dark:text-white tabular-nums">
                            {totalXp} <span className="text-[10px] text-text-dark dark:text-gray-500 font-bold">/ {maxTotalXp} نقطة</span>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gold/20 italic tabular-nums">{progress}%</div>
                </div>

                <div className="h-2.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                    <div
                        className="h-full bg-gradient-to-r from-gold via-gold-light to-gold rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(201,168,76,0.3)]"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenges;
