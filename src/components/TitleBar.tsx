import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppTheme, MainTab } from '../types';
import { 
  Activity, 
  Clock, 
  Wifi, 
  Minus, 
  Square, 
  X, 
  Palette, 
  AlertOctagon, 
  Layers, 
  Radio, 
  Cpu, 
  Compass,
  ChevronDown,
  Thermometer,
  Droplets,
  Sliders,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move
} from 'lucide-react';

export const TitleBar: React.FC = () => {
  const {
    theme,
    setTheme,
    appMode,
    setAppMode,
    currentMainTab,
    setCurrentMainTab,
    errorSubTab,
    setErrorSubTab,
    historySubTab,
    setHistorySubTab,
    deviceId,
    isConnected,
    setIsConnected,
    triggerFaultDialog,
    calibSoftwarePage,
    setCalibSoftwarePage,
    showToast,
    environment,
    setEnvironment,
    windowWidth,
    setWindowWidth,
    windowHeight,
    setWindowHeight,
    isMaximized,
    setIsMaximized,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    resetWindowSize,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showScreenMenu, setShowScreenMenu] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const str = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setCurrentTime(str);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getWindowTitle = () => {
    if (appMode === 'calib-software-contact') return '仪器基准校准软件（接触式）v1.0';
    if (appMode === 'calib-software-noncontact') return '仪器基准校准软件（非接触式）v1.0';
    if (appMode === 'startup') return 'R-test 测量系统 - 开机选择';
    return 'R-test 测量系统 v1.0';
  };

  const screensList = [
    { id: 'S01', name: 'S01 开机选择页', mode: 'startup' },
    { id: 'S02', name: 'S02 实时曲线页', mode: 'main', tab: 'realtime' },
    { id: 'S03', name: 'S03 校准页 (仪器安装校准)', mode: 'main', tab: 'calibration' },
    { id: 'S04', name: 'S04 误差测量 · 结构误差', mode: 'main', tab: 'error-measure', subTab: 'structural' },
    { id: 'S05', name: 'S05 误差测量 · 动态误差', mode: 'main', tab: 'error-measure', subTab: 'dynamic' },
    { id: 'S06', name: 'S06 历史报告 · 历史记录', mode: 'main', tab: 'history-report', histTab: 'records' },
    { id: 'S07', name: 'S07 报告 · 测量参数信息', mode: 'main', tab: 'history-report', histTab: 'params' },
    { id: 'S08', name: 'S08 报告 · 检测数据 (DATABLOCK)', mode: 'main', tab: 'history-report', histTab: 'datablock' },
    { id: 'S09', name: 'S09 报告 · 原始数据分析 (拟合曲线)', mode: 'main', tab: 'history-report', histTab: 'raw-analysis' },
    { id: 'S10_1', name: 'S10 报告 · 误差分析图示', mode: 'main', tab: 'history-report', histTab: 'error-analysis' },
    { id: 'S10_2', name: 'S10 报告 · 导出报告 (PDF预览)', mode: 'main', tab: 'history-report', histTab: 'export-pdf' },
    { id: 'S11', name: 'S11 文件下载页 (SD卡管理)', mode: 'main', tab: 'files' },
    { id: 'S12', name: 'S12 事件记录页 (审计日志)', mode: 'main', tab: 'events' },
    { id: 'S13', name: 'S13 机床连接页 (预留占位)', mode: 'main', tab: 'machine-connect' },
    { id: 'S15', name: 'S15 仪器校准安装页 (基准校准软件)', mode: 'calib-software-contact', calibPage: 'calib-setup' },
    { id: 'S16', name: 'S16 仪器标定页 · 接触式 (6点2×2网格)', mode: 'calib-software-contact', calibPage: 'calib-workbench' },
    { id: 'S17', name: 'S17 仪器标定页 · 非接触式 (27点网格)', mode: 'calib-software-noncontact', calibPage: 'calib-workbench' },
  ];

  const handleSelectScreen = (screen: typeof screensList[0]) => {
    setShowScreenMenu(false);
    if (screen.mode === 'startup') {
      setAppMode('startup');
      return;
    }
    if (screen.mode === 'main') {
      setAppMode('main');
      if (screen.tab) setCurrentMainTab(screen.tab as MainTab);
      if (screen.subTab) setErrorSubTab(screen.subTab as any);
      if (screen.histTab) setHistorySubTab(screen.histTab as any);
      return;
    }
    if (screen.mode.startsWith('calib-software')) {
      setAppMode(screen.mode as any);
      if (screen.calibPage) setCalibSoftwarePage(screen.calibPage as any);
    }
  };

  return (
    <header 
      id="custom-title-bar" 
      className="h-9 px-3 flex items-center justify-between text-xs select-none border-b shrink-0 z-50 transition-colors"
      style={{
        backgroundColor: 
          theme === 'light-metrology' ? '#e2e8f0' : 
          theme === 'precision-blue' ? '#0c192d' : 
          '#0c1017',
        borderColor: 
          theme === 'light-metrology' ? '#cbd5e1' : 
          theme === 'precision-blue' ? '#1d375a' : 
          '#1e293b',
        color: 
          theme === 'light-metrology' ? '#1e293b' : 
          theme === 'precision-blue' ? '#bfdbfe' : 
          '#cbd5e1'
      }}
    >
      {/* Left: App icon, Title, Device ID */}
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-cyan-600/30 text-cyan-400 border border-cyan-500/40">
          <Compass className="w-3.5 h-3.5" />
        </div>
        <span className="font-semibold tracking-wide text-sm font-sans flex items-center gap-1.5">
          {getWindowTitle()}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[11px] font-mono-num bg-black/20 border border-white/10 text-slate-400">
          ID: {deviceId}
        </span>
      </div>

      {/* Middle: Heartbeat, Connection, Temperature & Humidity, Live Clock */}
      <div className="flex items-center gap-3">
        {/* Heartbeat Status */}
        <div 
          className="flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-white/5"
          onClick={() => setIsConnected(!isConnected)}
          title="点击可模拟断开/重连状态"
        >
          <span className="relative flex h-2 w-2">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            )}
          </span>
          <span className={`text-[11px] font-medium ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isConnected ? '● 已连接' : '○ 已断开'}
          </span>
        </div>

        {/* Environmental Monitor Capsule: Temperature & Humidity */}
        <div className="relative">
          <button 
            id="env-th-capsule"
            onClick={() => setShowEnvModal(!showEnvModal)}
            className="flex items-center gap-2 px-2 py-0.5 rounded border transition-all hover:border-amber-400/50 cursor-pointer"
            style={{
              backgroundColor: theme === 'light-metrology' ? '#f1f5f9' : '#141a24',
              borderColor: showEnvModal 
                ? '#f59e0b' 
                : (theme === 'light-metrology' ? '#cbd5e1' : '#263345'),
            }}
            title="环境温湿度监控 (ISO 230-1 标准基准 20.0°C) - 点击查看与配置"
          >
            {/* Temperature */}
            <div className="flex items-center gap-1 text-[11px]">
              <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] text-slate-400">温度</span>
              <span className="font-mono-num font-semibold text-amber-300">
                {environment.temperature.toFixed(1)}°C
              </span>
              {Math.abs(environment.tempOffset) > 0.04 && (
                <span 
                  className={`text-[9px] font-mono-num px-1 rounded ${
                    Math.abs(environment.tempOffset) <= 0.5 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                  title={`较 20.0°C 标准温度偏离 ${environment.tempOffset > 0 ? '+' : ''}${environment.tempOffset.toFixed(2)}°C`}
                >
                  {environment.tempOffset > 0 ? `+${environment.tempOffset.toFixed(1)}` : environment.tempOffset.toFixed(1)}
                </span>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="w-[1px] h-3 bg-slate-600/40" />

            {/* Humidity */}
            <div className="flex items-center gap-1 text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] text-slate-400">湿度</span>
              <span className="font-mono-num font-semibold text-cyan-300">
                {environment.humidity.toFixed(1)}%
              </span>
              <span className="text-[9px] text-slate-400">RH</span>
            </div>

            {/* Status dot / tag */}
            <span 
              className={`w-1.5 h-1.5 rounded-full ${
                environment.temperature >= 19.0 && environment.temperature <= 21.0 && environment.humidity >= 40 && environment.humidity <= 60
                  ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'
              }`}
              title={
                environment.temperature >= 19.0 && environment.temperature <= 21.0 && environment.humidity >= 40 && environment.humidity <= 60
                  ? '环境状态：符合 ISO 230 精密机床测量等级'
                  : '环境状态：温湿度偏离标准，已触发测头线性补偿'
              }
            />
          </button>

          {/* Environmental Details & Compensation Popover */}
          {showEnvModal && (
            <div 
              id="env-details-popup"
              className="absolute left-1/2 -translate-x-1/2 top-8 w-80 rounded-md shadow-2xl p-3 z-50 text-[11px] border backdrop-blur-sm transition-all"
              style={{
                backgroundColor: theme === 'light-metrology' ? '#ffffff' : '#0f172a',
                borderColor: theme === 'light-metrology' ? '#cbd5e1' : '#334155',
                color: theme === 'light-metrology' ? '#1e293b' : '#e2e8f0',
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-[12px]">工作站环境温湿度监控</span>
                </div>
                <button 
                  onClick={() => setShowEnvModal(false)}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2.5">
                {/* Temp Card */}
                <div 
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: theme === 'light-metrology' ? '#f8fafc' : '#1e293b',
                    borderColor: theme === 'light-metrology' ? '#e2e8f0' : '#334155',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" /> 环境温度
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      基准 20.0°C
                    </span>
                  </div>
                  <div className="text-lg font-mono-num font-bold text-amber-400">
                    {environment.temperature.toFixed(2)} <span className="text-xs font-normal">°C</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                    <span>温度偏移:</span>
                    <span className={`font-mono-num font-medium ${environment.tempOffset === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {environment.tempOffset > 0 ? `+${environment.tempOffset.toFixed(2)}` : environment.tempOffset.toFixed(2)} °C
                    </span>
                  </div>
                </div>

                {/* Hum Card */}
                <div 
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: theme === 'light-metrology' ? '#f8fafc' : '#1e293b',
                    borderColor: theme === 'light-metrology' ? '#e2e8f0' : '#334155',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> 相对湿度
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400">
                      标称 40~60%
                    </span>
                  </div>
                  <div className="text-lg font-mono-num font-bold text-cyan-400">
                    {environment.humidity.toFixed(1)} <span className="text-xs font-normal">% RH</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                    <span>环境等级:</span>
                    <span className="text-emerald-400 font-medium">Class 1 优良</span>
                  </div>
                </div>
              </div>

              {/* Thermal Compensation Setting */}
              <div 
                className="p-2 rounded border mb-2.5"
                style={{
                  backgroundColor: theme === 'light-metrology' ? '#f8fafc' : '#1e293b',
                  borderColor: theme === 'light-metrology' ? '#e2e8f0' : '#334155',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-slate-200">测头热膨胀线性补偿 (α)</span>
                  <button 
                    onClick={() => {
                      setEnvironment(prev => ({ ...prev, compensationEnabled: !prev.compensationEnabled }));
                      showToast(environment.compensationEnabled ? '已旁路环境温度热膨胀补偿' : '已激活测头热膨胀自动补偿');
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      environment.compensationEnabled 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-slate-700/50 text-slate-400 border-slate-600'
                    }`}
                  >
                    {environment.compensationEnabled ? '● 补偿激活 (ON)' : '○ 旁路关闭 (OFF)'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>钢质基座热膨胀系数:</span>
                  <span className="font-mono-num text-slate-300">11.7 µm/(m·°C)</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>当前计算热伸长量:</span>
                  <span className="font-mono-num text-amber-300">
                    {environment.compensationEnabled 
                      ? `${(environment.tempOffset * 11.7 * 0.15).toFixed(3)} µm` 
                      : '0.000 µm (未补偿)'}
                  </span>
                </div>
              </div>

              {/* Manual adjustment for field test demonstration */}
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>车间温湿度模拟调节:</span>
                  <button 
                    onClick={() => {
                      setEnvironment({
                        temperature: 20.0,
                        humidity: 50.0,
                        tempOffset: 0.0,
                        standardTemp: 20.0,
                        compensationEnabled: true,
                      });
                      showToast('温湿度已复位至 20.0°C / 50.0% RH 标准条件');
                    }}
                    className="flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> 复位 20°C
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">温度:</span>
                  <input 
                    type="range"
                    min="16.0"
                    max="28.0"
                    step="0.1"
                    value={environment.temperature}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value);
                      setEnvironment(prev => ({
                        ...prev,
                        temperature: t,
                        tempOffset: Number((t - prev.standardTemp).toFixed(2))
                      }));
                    }}
                    className="flex-1 accent-amber-400 h-1 cursor-pointer"
                  />
                  <span className="font-mono-num text-[11px] text-amber-300 w-12 text-right">
                    {environment.temperature.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-8">湿度:</span>
                  <input 
                    type="range"
                    min="20.0"
                    max="80.0"
                    step="0.5"
                    value={environment.humidity}
                    onChange={(e) => {
                      const h = parseFloat(e.target.value);
                      setEnvironment(prev => ({
                        ...prev,
                        humidity: h
                      }));
                    }}
                    className="flex-1 accent-cyan-400 h-1 cursor-pointer"
                  />
                  <span className="font-mono-num text-[11px] text-cyan-300 w-12 text-right">
                    {environment.humidity.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Close footer */}
              <div className="mt-2.5 pt-2 border-t border-white/10 flex justify-end">
                <button 
                  onClick={() => setShowEnvModal(false)}
                  className="px-2.5 py-1 rounded text-[11px] bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono-num">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentTime || '2026-09-14 10:32:15'}</span>
        </div>
      </div>

      {/* Right: Quick Screen Switcher, Fault Trigger, Theme Dropdown, Window Buttons */}
      <div className="flex items-center gap-2">
        {/* Quick Screen Switcher Dropdown (for testing all 17 screens easily) */}
        <div className="relative">
          <button
            onClick={() => setShowScreenMenu(!showScreenMenu)}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors"
            title="快速切换 17 个界面 (S01~S17) 或校准模式"
          >
            <Layers className="w-3 h-3" />
            <span>屏幕导航 (17屏)</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showScreenMenu && (
            <div 
              className="absolute right-0 top-7 w-72 max-h-96 overflow-y-auto rounded shadow-2xl py-1 z-50 text-[11px] border"
              style={{
                backgroundColor: theme === 'light-metrology' ? '#ffffff' : '#141a24',
                borderColor: theme === 'light-metrology' ? '#cbd5e1' : '#2a3648',
                color: theme === 'light-metrology' ? '#1e293b' : '#e2e8f0',
              }}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                主测量系统屏幕 (S01 ~ S13)
              </div>
              {screensList.slice(0, 14).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectScreen(s)}
                  className="w-full text-left px-3 py-1.5 hover:bg-sky-500/15 flex items-center justify-between transition-colors"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] font-mono-num text-slate-500">{s.id}</span>
                </button>
              ))}

              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border-t border-b border-white/10 mt-1">
                仪器基准校准软件屏幕 (S15 ~ S17)
              </div>
              {screensList.slice(14).map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectScreen(s)}
                  className="w-full text-left px-3 py-1.5 hover:bg-amber-500/15 flex items-center justify-between text-amber-300 transition-colors"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] font-mono-num text-amber-500">{s.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fault Alert Simulation Button (S14) */}
        <button
          onClick={() => triggerFaultDialog('FATAL')}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
          title="触发 S14 设备故障弹窗演示 (FATAL / Error)"
        >
          <AlertOctagon className="w-3 h-3" />
          <span>S14 故障</span>
        </button>

        {/* Theme Dropdown (3 Distinct Styles) */}
        <div className="flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded border border-white/10 shadow-xs">
          <Palette className="w-3.5 h-3.5 text-sky-400" />
          <select
            id="theme-style-selector"
            value={theme}
            onChange={(e) => {
              const newTheme = e.target.value as AppTheme;
              setTheme(newTheme);
              const themeNames: Record<AppTheme, string> = {
                'dark-industrial': '风格一：工业深灰 (工业测控)',
                'light-metrology': '风格二：实验室浅灰 (精密计量)',
                'precision-blue': '风格三：航空蓝灰 (深海航空)',
              };
              showToast(`已切换至 ${themeNames[newTheme]}`);
            }}
            className="bg-transparent text-[11px] font-medium text-slate-200 outline-none cursor-pointer"
            aria-label="选择界面风格"
          >
            <option value="dark-industrial" className="bg-slate-900 text-slate-200">风格一：工业深灰 (工业测控)</option>
            <option value="light-metrology" className="bg-slate-100 text-slate-900">风格二：实验室浅灰 (精密计量)</option>
            <option value="precision-blue" className="bg-[#0b172a] text-blue-200">风格三：航空蓝灰 (深海航空)</option>
          </select>
        </div>

        {/* Window Resolution Indicator */}
        <div 
          className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-black/25 text-[10px] font-mono-num text-slate-300 border border-white/10"
          title="窗口最小尺寸 1728×926，所有控件绑定窗口并跟随缩放"
        >
          <span className="text-slate-500">视口:</span>
          <span className="text-sky-400 font-bold">{windowWidth}×{windowHeight}</span>
          <span className="text-[9px] text-slate-500">(最小 1728×926)</span>
        </div>

        {/* Window Controls: 缩小, 还原/自由拖拽, 全屏, 退出 */}
        <div className="flex items-center gap-0.5 ml-1 border-l border-white/10 pl-1">
          {/* 缩小 (Minimize) */}
          <button 
            id="window-minimize-btn"
            className="w-7 h-6 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              setIsMinimized(true);
              showToast('窗口已缩小至底部状态托盘');
            }}
            title="缩小窗口至托盘"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* 还原 / 自由拖拽大小 (Restore / Free Drag Resizing) */}
          <button 
            id="window-restore-btn"
            className={`w-7 h-6 flex items-center justify-center rounded transition-colors ${
              !isMaximized 
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
            onClick={() => {
              if (isMaximized) {
                setIsMaximized(false);
                setWindowWidth(1728);
                setWindowHeight(926);
                showToast('已切换至自由拖动与缩放窗口模式 (1728×926)');
              } else {
                setIsMaximized(true);
                setWindowWidth(Math.max(1728, window.innerWidth));
                setWindowHeight(Math.max(926, window.innerHeight));
                showToast('已最大化窗口');
              }
            }}
            title={isMaximized ? "还原为自由窗口 (可任意拖动/拉伸，最小1728×926)" : "最大化铺满窗口"}
          >
            {isMaximized ? <Square className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>

          {/* 全屏 (Fullscreen) */}
          <button 
            id="window-fullscreen-btn"
            className={`w-7 h-6 flex items-center justify-center rounded transition-colors ${
              isFullscreen 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
            onClick={() => {
              toggleFullscreen();
              showToast(isFullscreen ? '已退出全屏' : '已进入全屏显示模式');
            }}
            title="全屏显示 (F11)"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          {/* 关闭 / 返回 */}
          <button 
            id="window-close-btn"
            className="w-7 h-6 flex items-center justify-center rounded hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
            onClick={() => {
              if (appMode !== 'startup') {
                setAppMode('startup');
                showToast('已返回开机选择界面');
              } else {
                showToast('已退出测量系统');
              }
            }}
            title="关闭 / 返回开机"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
