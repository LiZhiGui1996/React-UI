import React from 'react';
import { useApp } from '../context/AppContext';
import { MainTab } from '../types';
import { getThemeTokens } from '../utils/themeStyles';
import { 
  Activity, 
  Target, 
  Gauge, 
  FileText, 
  DownloadCloud, 
  Network, 
  ListFilter,
  CheckCircle2
} from 'lucide-react';

interface TabItem {
  id: MainTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: 'realtime', label: '实时曲线', icon: Activity },
  { id: 'calibration', label: '校准', icon: Target },
  { id: 'error-measure', label: '误差测量', icon: Gauge },
  { id: 'history-report', label: '历史测量报告', icon: FileText },
  { id: 'files', label: '文件下载', icon: DownloadCloud, badge: '12' },
  { id: 'machine-connect', label: '机床连接', icon: Network },
  { id: 'events', label: '事件记录', icon: ListFilter },
];

export const SidebarNav: React.FC = () => {
  const { currentMainTab, setCurrentMainTab, theme, measurementMode, originRecorded } = useApp();
  const tokens = getThemeTokens(theme);
  const isLight = theme === 'light-metrology';

  return (
    <aside 
      id="main-sidebar-nav" 
      className="w-44 shrink-0 flex flex-col justify-between border-r select-none transition-colors"
      style={{
        backgroundColor: tokens.sidebarBg,
        borderColor: tokens.borderColor,
      }}
    >
      {/* Upper Navigation Tabs */}
      <div className="py-2.5 flex flex-col gap-1">
        {/* Mode Tag */}
        <div 
          className="px-3 pb-2 mb-1 border-b flex items-center justify-between"
          style={{ borderColor: tokens.dividerColor }}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: tokens.mutedColor }}>
            当前模式
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
            measurementMode === 'contact' 
              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
          }`}>
            {measurementMode === 'contact' ? '接触式测量' : '非接触式测量'}
          </span>
        </div>

        {/* Navigation Tab Buttons */}
        {TABS.map((tab) => {
          const isActive = currentMainTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentMainTab(tab.id)}
              className={`relative mx-2 px-3 py-3 rounded-md text-xs font-semibold flex items-center justify-center transition-all group cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-white text-sky-600 shadow-xs border border-slate-200/80 font-bold'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs font-bold'
                  : 'hover:bg-white/5'
              }`}
              style={!isActive ? { color: tokens.bodyColor } : undefined}
            >
              {/* Active bottom accent bar */}
              {isActive && (
                <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-sky-500" />
              )}

              <span className="tracking-wide text-center font-sans text-[13px]">{tab.label}</span>

              {tab.badge && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono-num ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700/60 text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}

              {/* Origin locked icon for calibration tab */}
              {tab.id === 'calibration' && originRecorded && (
                <CheckCircle2 className="ml-1.5 w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div 
        className="p-3 border-t text-[11px] flex flex-col gap-1"
        style={{ borderColor: tokens.dividerColor, color: tokens.mutedColor }}
      >
        <div className="flex items-center justify-between text-[10px]">
          <span>采样率</span>
          <span className="font-mono-num" style={{ color: tokens.titleColor }}>100 ms/帧</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span>下位通信</span>
          <span className="font-mono-num text-emerald-400">WiFi 192.168.4.1</span>
        </div>
        <div 
          className="mt-1 pt-1 border-t text-[9px] text-center"
          style={{ borderColor: tokens.dividerColor, color: tokens.mutedColor }}
        >
          ISO 230-1 / ISO 230-7 工业标准
        </div>
      </div>
    </aside>
  );
};
