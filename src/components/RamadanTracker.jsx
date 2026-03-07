import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const RamadanTracker = () => {
  const [progress, setRamadanProgress] = useState(0);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const TASKS = [
    { id: 'fajr', name: 'صلاة الفجر', icon: '🌙' },
    { id: 'dhuhr', name: 'صلاة الظهر', icon: '☀️' },
    { id: 'asr', name: 'صلاة العصر', icon: '🌤' },
    { id: 'maghrib', name: 'المغرب والإفطار', icon: '🌅' },
    { id: 'isha', name: 'العشاء والتراويح', icon: '🌌' },
    { id: 'quran', name: 'تلاوة القرآن', icon: '📖' },
    { id: 'dhikr', name: 'الأذكار', icon: '📿' },
    { id: 'sadaqah', name: 'الصدقة والخير', icon: '🤲' },
  ];

  useEffect(() => {
    const savedDays = STORAGE_SERVICE.getItem('athr_ramadan_days', null);

    if (savedDays) {
      setDays(savedDays);
      calculateOverallProgress(savedDays);
    } else {
      const initialDays = Array.from({ length: 30 }, (_, i) => ({
        num: i + 1,
        arNum: (i + 1).toLocaleString('ar-SA'),
        completed: false,
        tasks: TASKS.reduce((acc, task) => ({ ...acc, [task.id]: false }), {})
      }));
      setDays(initialDays);
      STORAGE_SERVICE.setItem('athr_ramadan_days', initialDays);
    }
  }, []);

  const calculateOverallProgress = (currentDays) => {
    const totalTasks = 30 * TASKS.length;
    const completedTasks = currentDays.reduce((acc, day) => {
      return acc + Object.values(day.tasks || {}).filter(t => t).length;
    }, 0);
    setRamadanProgress(Math.round((completedTasks / totalTasks) * 100));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const toggleTask = (taskId) => {
    const updatedDays = days.map(d => {
      if (d.num === selectedDay.num) {
        const updatedTasks = { ...d.tasks, [taskId]: !d.tasks[taskId] };
        const allTasksDone = Object.values(updatedTasks).every(t => t);
        return { ...d, tasks: updatedTasks, completed: allTasksDone };
      }
      return d;
    });

    setDays(updatedDays);
    setSelectedDay(updatedDays.find(d => d.num === selectedDay.num));
    STORAGE_SERVICE.setItem('athr_ramadan_days', updatedDays);
    calculateOverallProgress(updatedDays);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center p-6 bg-gradient-to-b from-gold/10 to-transparent rounded-3xl border border-gold/5">
        <h2 className="text-3xl font-bold text-gold font-scheherazade mb-2">متابعة رمضان</h2>
        <p className="text-text-dark text-sm font-amiri italic">«كل عمل ابن آدم له إلا الصوم فإنه لي وأنا أجزي به»</p>

        <div className="mt-8 flex justify-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="80" cy="80" r="70" className="stroke-white/5 fill-none" strokeWidth="8" />
              <circle
                cx="80" cy="80" r="70"
                className="stroke-gold fill-none transition-all duration-1000"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="440"
                strokeDashoffset={440 - (440 * progress) / 100}
              />
            </svg>
            <div className="text-center">
              <span className="text-3xl font-bold text-gold-light">{progress}%</span>
              <div className="text-[10px] text-gold uppercase tracking-widest">إجمالي التقدم</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 px-2">
        {days.map((day) => {
          const tasksDone = Object.values(day.tasks || {}).filter(t => t).length;
          const dayProgress = (tasksDone / TASKS.length) * 100;

          return (
            <button
              key={day.num}
              onClick={() => handleDayClick(day)}
              className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all active:scale-90 ${day.completed
                  ? 'bg-gold/20 border-gold/40'
                  : tasksDone > 0
                    ? 'bg-black/10 border-gold/30'
                    : 'bg-black/5 border-black/10'
                }`}
            >
              <div className="text-xs font-bold text-gold-light">{day.arNum}</div>
              {tasksDone > 0 && !day.completed && (
                <div className="absolute bottom-1 w-1/2 h-0.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gold transition-all" style={{ width: `${dayProgress}%` }} />
                </div>
              )}
              {day.completed && <div className="absolute top-0 right-0 -mt-1 -mr-1 text-[10px]">⭐</div>}
            </button>
          );
        })}
      </div>

      {showModal && selectedDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white border border-black/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 text-text-dark">
            <div className="flex justify-between items-center mb-6">
              <div className="text-right">
                <h3 className="text-xl font-bold text-gold font-scheherazade">مهام اليوم {selectedDay.arNum}</h3>
                <p className="text-xs text-text-mid font-amiri">تقبل الله منا ومنكم صالح الأعمال</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full text-gold">✕</button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
              {TASKS.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-95 ${selectedDay.tasks[task.id]
                      ? 'bg-gold/10 border-gold/30'
                      : 'bg-black/5 border-black/10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{task.icon}</span>
                    <span className={`text-sm ${selectedDay.tasks[task.id] ? 'text-green-main font-bold' : 'text-text-mid'}`}>
                      {task.name}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedDay.tasks[task.id]
                      ? 'bg-gold border-gold text-green-main'
                      : 'border-black/20'
                    }`}>
                    {selectedDay.tasks[task.id] && <span className="text-xs font-bold">✓</span>}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center text-[10px] text-gold italic font-amiri">
              «أحب الأعمال إلى الله أدومها وإن قل»
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RamadanTracker;
