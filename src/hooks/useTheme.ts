import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.tsx';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme должен использоваться внутри ThemeProvider');
  return context;
};