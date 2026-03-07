import React, { useState, useEffect, useMemo } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const RamadanPlanner = () => {
  // Calculate current Ramadan day (assuming 21st = March 12, 2026)
  const defaultDay = useMemo(() => {
    const today = new Date();
    const ramadanStart = new Date('2026-02-20T00:00:00');
    const diff = today - ramadanStart;
    const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(day, 1), 30);
  }, []);

  const [currentDay, setCurrentDay] = useState(defaultDay);
  const [tasks, setTasks] = useState([]);
  const [planText, setPlanText] = useState(() => STORAGE_SERVICE.getItem('athr_ramadan_plan', ''));
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('عام');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load tasks when currentDay changes
  useEffect(() => {
    const dayTasks = STORAGE_SERVICE.getItem(`athr_planner_tasks_day_${currentDay}`, []);
    setTasks(dayTasks);
  }, [currentDay]);

  useEffect(() => {
    const handleUpdate = () => {
      setPlanText(STORAGE_SERVICE.getItem('athr_ramadan_plan', ''));
    };
    window.addEventListener('athr_plan_updated', handleUpdate);
    return () => window.removeEventListener('athr_plan_updated', handleUpdate);
  }, []);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    STORAGE_SERVICE.setItem(`athr_planner_tasks_day_${currentDay}`, updatedTasks);
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id);
    saveTasks(updated);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      category: newTaskCategory
    };
    saveTasks([newTask, ...tasks]);
    setNewTaskText('');
    setShowAddForm(false);
  };

  const categories = ['قرآن', 'صلاة', 'ذكر', 'صدقة', 'عام'];

  const stats = categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const completed = catTasks.filter(t => t.completed).length;
    return { name: cat, total: catTasks.length, completed, percent: catTasks.length ? Math.round((completed / catTasks.length) * 100) : 0 };
  });

  const scrollDayIntoView = (el) => {
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-32 px-4 min-h-screen -mx-4 pt-8 bg-[#fdfcf7] transition-colors overflow-hidden">
      {/* Header */}
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-16 bg-gold/5 blur-[60px] rounded-full opacity-60" />
        <h2 className="text-4xl font-bold text-green-main font-scheherazade relative">جدول الأثر اليومي</h2>
        <p className="text-gold-dark text-[10px] font-tajawal tracking-[0.4em] uppercase font-bold opacity-60 mt-2">Personal Growth Planner</p>
      </div>

      {/* Day Selector */}
      <div className="relative p-2">
        <div className="flex gap-3 overflow-x-auto pb-6 pt-2 no-scrollbar px-4 mask-fade-edges">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              ref={day === currentDay ? scrollDayIntoView : null}
              onClick={() => setCurrentDay(day)}
              className={`flex-shrink-0 w-16 h-20 rounded-[1.8rem] flex flex-col items-center justify-center border-2 transition-all duration-500 ${currentDay === day
                  ? 'bg-gold border-gold text-green-main shadow-lg shadow-gold/30 -translate-y-2'
                  : 'bg-white border-black/5 text-text-mid shadow-sm'
                }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">يوم</span>
              <span className="text-2xl font-bold font-scheherazade">{day.toLocaleString('ar-SA')}</span>
              {day === defaultDay && <div className="absolute top-1 right-2 text-[8px]">⭐</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Progress for SELECTED DAY */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.filter(s => s.total > 0).map(s => (
          <div key={s.name} className="bg-white p-5 rounded-[2rem] border border-black/5 shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-bold text-green-main">{s.name}</span>
              <span className="text-[10px] text-text-mid font-mono font-bold">{s.completed}/{s.total}</span>
            </div>
            <div className="w-full h-[3px] bg-black/5 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-1000"
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Narrative Card (Static/Shared) */}
      {planText && (
        <div className="bg-white border border-black/5 rounded-[3rem] p-9 shadow-sm relative overflow-hidden">
          <h3 className="text-2xl font-bold text-green-main font-scheherazade flex items-center gap-4 mb-6">
            <span className="text-xl">📑</span> خطة رمضان الشاملة
          </h3>
          <p className="text-text-dark text-[19px] leading-[1.8] font-amiri text-justify whitespace-pre-wrap">
            {planText}
          </p>
        </div>
      )}

      {/* Daily Tasks Feed */}
      <div className="space-y-8">
        <div className="flex justify-between items-center px-4">
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-green-main font-scheherazade">مهام اليوم {currentDay.toLocaleString('ar-SA')}</h3>
            <div className="h-1 w-12 bg-gold/50 rounded-full" />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 active:scale-90 ${showAddForm
                ? 'bg-red-500/10 text-red-500 rotate-45 border border-red-500/20'
                : 'bg-gold text-green-main shadow-lg border border-gold/40'
              }`}
          >
            +
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={addTask}
            className="bg-white border-2 border-gold/40 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-500"
          >
            <input
              autoFocus
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="اكتب هدفاً لهذا اليوم..."
              className="w-full bg-transparent border-b border-black/10 pb-6 outline-none font-tajawal text-text-dark text-3xl placeholder:opacity-20"
            />
            <div className="mt-10 space-y-10">
              <div className="flex flex-wrap gap-2.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewTaskCategory(cat)}
                    className={`px-6 py-3 rounded-2xl text-[11px] font-bold transition-all border-2 ${newTaskCategory === cat
                        ? 'bg-gold border-gold text-green-main shadow-xl scale-110'
                        : 'bg-black/5 text-text-mid border-transparent hover:border-gold/30'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-green-main text-white py-6 rounded-2xl text-xl font-bold"
              >
                حفظ في جدول اليوم
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-5 px-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-6 bg-white border border-black/5 rounded-[2.5rem] transition-all duration-700 hover:border-gold/50 shadow-sm ${task.completed ? 'opacity-30' : ''
                  }`}
              >
                <div
                  className="flex items-center gap-6 flex-1 cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <div className={`w-12 h-12 rounded-[1.3rem] border-2 flex items-center justify-center transform transition-all duration-1000 ${task.completed
                      ? 'bg-green-mid border-green-mid rotate-[360deg] shadow-lg shadow-gold/20'
                      : 'border-gold/30 group-hover:border-gold/60'
                    }`}>
                    {task.completed && <span className="text-white text-xl font-bold">✓</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`text-[21px] font-tajawal transition-all duration-300 ${task.completed
                        ? 'line-through text-text-mid'
                        : 'text-text-dark font-medium'
                      }`}>
                      {task.text}
                    </span>
                    <span className="text-[10px] text-gold-dark font-bold uppercase tracking-widest opacity-60">
                      {task.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="p-4 text-red-500/20 hover:text-red-500 bg-red-500/0 hover:bg-red-500/5 rounded-3xl transition-all transform active:scale-125"
                >
                  <span className="text-2xl">🗑️</span>
                </button>
              </div>
            ))
          ) : (
            <div className="py-24 text-center space-y-8 bg-white/40 border-2 border-dashed border-black/5 rounded-[4rem] opacity-30">
              <div className="text-8xl">🗓️</div>
              <div className="px-12 space-y-3">
                <p className="text-3xl font-scheherazade text-green-main">جدول اليوم فارغ</p>
                <p className="text-xs font-tajawal text-gold-dark tracking-widest uppercase italic">Create your unique plan for this day</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RamadanPlanner;
