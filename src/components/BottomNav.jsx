import React from 'react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'more', label: 'المزيد', icon: '⚙️' },
    { id: 'goals', label: 'أهداف', icon: '🎯' },
    { id: 'stats', label: 'إحصائيات', icon: '📊' },
    { id: 'adhkar', label: 'أذكار', icon: '📿' },
    { id: 'home', label: 'الرئيسية', icon: '🏠' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 z-50 safe-area-bottom pb-4 pt-2 rounded-t-[42px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] max-w-xl mx-auto">
      <div className="flex justify-around items-center px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors px-3 py-1.5 rounded-xl ${activeTab === item.id ? 'bg-green-mid/10' : ''
              }`}
          >
            <span className={`text-[20px] transition-transform ${activeTab === item.id ? 'drop-shadow-[0_0_3px_rgba(45,106,79,0.3)]' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[9px] font-semibold transition-colors ${activeTab === item.id ? 'text-green-mid' : 'text-text-mid'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
