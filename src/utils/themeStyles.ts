import { AppTheme } from '../types';

export interface ThemeStyles {
  cardBg: string;
  subcardBg: string;
  canvasBg: string;
  sidebarBg: string;
  borderColor: string;
  dividerColor: string;
  titleColor: string;
  bodyColor: string;
  mutedColor: string;
  inputClass: string;
  cardClass: string;
  subcardClass: string;
  tableHeaderClass: string;
  tableRowClass: string;
  primaryButtonClass: string;
  secondaryButtonClass: string;
}

export function getThemeTokens(theme: AppTheme): ThemeStyles {
  switch (theme) {
    case 'light-metrology':
      return {
        cardBg: '#ffffff',
        subcardBg: '#f8fafc',
        canvasBg: '#f1f5f9',
        sidebarBg: '#f8fafc',
        borderColor: '#cbd5e1',
        dividerColor: '#e2e8f0',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        mutedColor: '#64748b',
        inputClass: 'bg-white border-slate-300 text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500',
        cardClass: 'bg-white border-slate-300 text-slate-800 shadow-xs',
        subcardClass: 'bg-slate-50 border-slate-200 text-slate-800',
        tableHeaderClass: 'bg-slate-100 text-slate-700 border-slate-300',
        tableRowClass: 'hover:bg-slate-50 border-slate-200 text-slate-800',
        primaryButtonClass: 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs',
        secondaryButtonClass: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
      };
    case 'precision-blue':
      return {
        cardBg: '#0a162a',
        subcardBg: '#070f1e',
        canvasBg: '#050b14',
        sidebarBg: '#09111c',
        borderColor: '#1e3a63',
        dividerColor: 'rgba(30, 58, 99, 0.6)',
        titleColor: '#f0f9ff',
        bodyColor: '#cbd5e1',
        mutedColor: '#7dd3fc',
        inputClass: 'bg-[#050b14] border-sky-800/80 text-sky-100 focus:border-sky-400 focus:ring-1 focus:ring-sky-400',
        cardClass: 'bg-[#0a162a] border-[#1e3a63] text-slate-200 shadow-sm',
        subcardClass: 'bg-[#070f1e] border-sky-950/80 text-slate-200',
        tableHeaderClass: 'bg-[#0d1e38] text-sky-200 border-[#1e3a63]',
        tableRowClass: 'hover:bg-sky-950/30 border-sky-900/30 text-slate-200',
        primaryButtonClass: 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs',
        secondaryButtonClass: 'bg-white/5 hover:bg-white/10 text-sky-200 border border-sky-800/60',
      };
    case 'dark-industrial':
    default:
      return {
        cardBg: '#111722',
        subcardBg: '#0c1017',
        canvasBg: '#0c1119',
        sidebarBg: '#0e131b',
        borderColor: '#1e293b',
        dividerColor: 'rgba(255, 255, 255, 0.08)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        mutedColor: '#94a3b8',
        inputClass: 'bg-black/30 border-white/10 text-slate-100 focus:border-sky-400 focus:ring-1 focus:ring-sky-400',
        cardClass: 'bg-[#111722] border-slate-800 text-slate-200 shadow-sm',
        subcardClass: 'bg-black/30 border-white/5 text-slate-200',
        tableHeaderClass: 'bg-slate-900/80 text-slate-300 border-slate-800',
        tableRowClass: 'hover:bg-white/5 border-white/5 text-slate-200',
        primaryButtonClass: 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs',
        secondaryButtonClass: 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10',
      };
  }
}
