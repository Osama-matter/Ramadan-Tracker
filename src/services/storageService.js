export const STORAGE_SERVICE = {
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from storage`, e);
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage`, e);
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing ${key} from storage`, e);
    }
  },

  // Migration logic for old app keys
  migrateLegacyData() {
    const legacyTracker = this.getItem('rm47_tracker');
    if (legacyTracker && !this.getItem('athr_user_stats')) {
      const completedDays = Object.values(legacyTracker).filter(day => day.completed).length;
      this.setItem('athr_user_stats', {
        streak: completedDays,
        points: completedDays * 50,
        lastActive: new Date().toISOString()
      });
    }
  }
};
