import React from 'react';
import { useSalahModeContext } from '../contexts/SalahModeContext';
import { STORAGE_SERVICE } from '../services/storageService';

const BottomNav = ({ activeTab, onTabChange }) => {
  const { isActive: isSalahMode } = useSalahModeContext();
  const isDarkMode = STORAGE_SERVICE.getItem('athr_dark_mode', true);
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: '🏠' },
    { id: 'adhkar', label: 'أذكار', icon: '📿' },
    { id: 'stats', label: 'إحصائيات', icon: '📊' },
    { id: 'goals', label: 'أهداف', icon: '🎯' },
    { id: 'more', label: 'المزيد', icon: '⚙️' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode || isSalahMode ? 'bg-[#0a0c1a] border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]' : 'bg-surface border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'} border-t z-50 safe-area-bottom pb-4 pt-2 rounded-t-[42px] max-w-xl mx-auto transition-all duration-500`}>
      <div className="flex justify-around items-center px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            data-testid={`nav-${item.id}`}
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
