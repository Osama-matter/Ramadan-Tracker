import { useState, useEffect } from 'react';
import { STORAGE_SERVICE } from '../services/storageService';

export const useUserStats = () => {
  const [stats, setStats] = useState({
    streak: 0,
    points: 0,
    lastActive: null
  });

  useEffect(() => {
    STORAGE_SERVICE.migrateLegacyData();
    const loadStats = () => {
      const savedStats = STORAGE_SERVICE.getItem('athr_user_stats', {
        streak: 0,
        points: 0,
        lastActive: null
      });
      setStats(savedStats);
    };

    loadStats();

    // Listen for manual updates
    window.addEventListener('athr_stats_updated', loadStats);
    return () => window.removeEventListener('athr_stats_updated', loadStats);
  }, []);

  const updateStats = (newStats) => {
    const updated = { ...stats, ...newStats };
    setStats(updated);
    STORAGE_SERVICE.setItem('athr_user_stats', updated);
  };

  return { stats, updateStats };
};
