import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const DailyChallenges = () => {
    const initialTasks = [
        { id: 'fajr', title: 'صلاة الفجر في وقتها', xp: 20, done: false },
        { id: 'dhuhr', title: 'صلاة الظهر في وقتها', xp: 20, done: false },
        { id: 'asr', title: 'صلاة العصر في وقتها', xp: 20, done: false },
        { id: 'maghrib', title: 'صلاة المغرب في وقتها', xp: 20, done: false },
        { id: 'isha', title: 'صلاة العشاء في وقتها', xp: 20, done: false },
        { id: 'quran', title: 'قراءة ورد القرآن اليومي', xp: 30, done: false },
        { id: 'morning_azkar', title: 'أذكار الصباح والمساء', xp: 25, done: false },
        { id: 'sadaqah', title: 'الصدقة والعمل الصالح', xp: 25, done: false },
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
        const updated = tasks.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        );
        setTasks(updated);
        STORAGE_SERVICE.setItem('athr_daily_challenges', updated);
        calculateProgress(updated);
    };

    const doneCount = tasks.filter(t => t.done).length;
    const maxTotalXp = tasks.reduce((acc, curr) => acc + curr.xp, 0);

    return (
        <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-[15px] font-bold text-text-dark mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-gold to-green-light rounded-sm"></span>
                تحديات اليوم 🏆
            </h2>

            <div className="bg-white/95 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-black/5">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-bold text-text-dark">التحديات اليومية</div>
                    <div className="bg-gradient-to-br from-gold to-gold-dark text-white text-[10px] px-3 py-1 rounded-full font-semibold shadow-sm">
                        {doneCount}/{tasks.length} مكتمل
                    </div>
                </div>

                <div className="space-y-0">
                    {tasks.map((task, idx) => (
                        <button
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className={`w-full flex items-center gap-3 py-2.5 outline-none transition-all active:scale-[0.98] ${idx !== tasks.length - 1 ? 'border-b border-black/5' : ''
                                }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-colors ${task.done
                                    ? 'bg-gradient-to-br from-green-light to-green-mid text-white shadow-md'
                                    : 'bg-[#f0f0f0] text-[#bbb] border-2 border-[#e0e0e0]'
                                    }`}
                            >
                                {task.done ? '✓' : ''}
                            </div>
                            <div className={`text-[13px] font-medium flex-1 text-right transition-colors ${task.done ? 'text-text-mid line-through' : 'text-text-dark'}`}>
                                {task.title}
                            </div>
                            <div className="text-[11px] text-gold-dark font-bold">
                                +{task.xp} نقطة
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-4 pt-1">
                    <div className="flex justify-between text-[11px] text-text-mid mb-2.5">
                        <span className="font-medium">التقدم اليومي</span>
                        <span className="font-bold">{totalXp} نقطة من {maxTotalXp}</span>
                    </div>
                    <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-l from-gold to-green-light rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenges;
