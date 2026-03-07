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
    const savedStats = STORAGE_SERVICE.getItem('athr_user_stats', {
      streak: 0,
      points: 0,
      lastActive: null
    });
    setStats(savedStats);
  }, []);

  const updateStats = (newStats) => {
    const updated = { ...stats, ...newStats };
    setStats(updated);
    STORAGE_SERVICE.setItem('athr_user_stats', updated);
  };

  return { stats, updateStats };
};
