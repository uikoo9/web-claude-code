export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'developer-dark',
    name: 'Developer Dark',
    colors: {
      primary: '#22C55E',
      secondary: '#10B981',
      accent: '#34D399',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      border: '#334155',
    },
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      accent: '#60A5FA',
      background: '#EFF6FF',
      surface: '#FFFFFF',
      text: '#1E3A8A',
      textSecondary: '#3B82F6',
      border: '#BFDBFE',
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FB923C',
      background: '#FFF7ED',
      surface: '#FFFFFF',
      text: '#7C2D12',
      textSecondary: '#EA580C',
      border: '#FDBA74',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#ECFDF5',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#047857',
      border: '#6EE7B7',
    },
  },
  {
    id: 'purple-passion',
    name: 'Purple Passion',
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#4C1D95',
      textSecondary: '#7C3AED',
      border: '#C4B5FD',
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#818CF8',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#E0E7FF',
      textSecondary: '#C7D2FE',
      border: '#4C1D95',
    },
  },
];

export const getTheme = (themeId: string): Theme => {
  return themes.find((t) => t.id === themeId) || themes[0];
};
