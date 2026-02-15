import { useState, useEffect } from 'react';

const UI_PREFERENCES_KEY = 'app_ui_preferences';

export const useUIPreferences = () => {
  const [preferences, setPreferences] = useState({
    sidebarCollapsed: false,
    theme: 'light',
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(UI_PREFERENCES_KEY);
    if (stored) {
      try {
        setPreferences(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse UI preferences:', e);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const updatePreferences = (updates) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, ...updates };
      localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  const toggleSidebarCollapsed = () => {
    updatePreferences({ sidebarCollapsed: !preferences.sidebarCollapsed });
  };

  const setTheme = (theme) => {
    updatePreferences({ theme });
  };

  return {
    ...preferences,
    updatePreferences,
    toggleSidebarCollapsed,
    setTheme,
  };
};
