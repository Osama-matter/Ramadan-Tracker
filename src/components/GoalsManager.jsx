import React, { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

const GoalsManager = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');

  // Load goals on mount
  useEffect(() => {
    const savedGoals = STORAGE_SERVICE.getItem('athr_goals', [
      { id: 1, text: 'ختم القرآن الكريم', completed: false, category: 'قرآن' },
      { id: 2, text: 'المحافظة على صلاة الضحى', completed: true, category: 'صلاة' },
      { id: 3, text: 'إفطار صائم', completed: false, category: 'صدقة' },
    ]);
    setGoals(savedGoals);

    // Listen for custom event from AI Assistant
    const handleGoalUpdate = () => {
      const updated = STORAGE_SERVICE.getItem('athr_goals', []);
      setGoals(updated);
    };
    window.addEventListener('athr_goals_updated', handleGoalUpdate);
    return () => window.removeEventListener('athr_goals_updated', handleGoalUpdate);
  }, []);

  const toggleGoal = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    setGoals(updated);
    STORAGE_SERVICE.setItem('athr_goals', updated);
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    const updated = [...goals, { id: Date.now(), text: newGoal, completed: false, category: 'عام' }];
    setGoals(updated);
    STORAGE_SERVICE.setItem('athr_goals', updated);
    setNewGoal('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎯</span>
        <h2 className="text-xl font-bold text-gold font-scheherazade">أهدافي الرمضانية</h2>
      </div>

      <form onSubmit={addGoal} className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="أضف هدفاً جديداً..."
          className="flex-1 bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm text-text-dark outline-none focus:border-gold/50 transition-all"
        />
        <button type="submit" className="bg-gold text-green-main font-bold px-6 rounded-xl text-sm active:scale-95 transition-all">
          إضافة
        </button>
      </form>

      <div className="grid gap-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              goal.completed 
                ? 'bg-gold/10 border-gold/30 opacity-60' 
                : 'bg-black/5 border-black/10 hover:bg-black/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                goal.completed ? 'bg-gold border-gold' : 'border-black/20'
              }`}>
                {goal.completed && <span className="text-[10px] text-green-main">✓</span>}
              </div>
              <span className={`text-sm ${goal.completed ? 'line-through text-text-mid' : 'text-text-dark'}`}>
                {goal.text}
              </span>
            </div>
            <span className="text-[10px] bg-black/5 px-2 py-1 rounded-lg text-gold">{goal.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalsManager;
