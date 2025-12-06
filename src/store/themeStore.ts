import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggle: () => set((state) => {
    const newTheme = !state.isDark;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
    return { isDark: newTheme };
  }),
}));

// Initialize theme on load
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}
