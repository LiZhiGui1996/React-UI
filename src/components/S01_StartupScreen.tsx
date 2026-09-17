import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeTokens } from '../utils/themeStyles';
import { 
  ChevronRight, 
  UploadCloud, 
  Wifi, 
  Bluetooth, 
  Box, 
  ShieldCheck, 
  ShieldAlert, 
  FileCode, 
  Wrench,
  ChevronDown
} from 'lucide-react';

export const S01_StartupScreen: React.FC = () => {
  const { 
    setAppMode, 
    setMeasurementMode, 
    connectionType, 
    setConnectionType, 
    showToast,
    theme
  } = useApp();

  const [showConfigMenu, setShowConfigMenu] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);

  const tokens = getThemeTokens(theme);
  const isLight = theme === 'light-metrology';

  const configMenuItems = [
    '加载接触式标定文件',
    '加载非接触式标定文件',
    '加载结构误差测量标定NC文件',
    '加载动态误差测量标定NC文件',
    '加载接触式授权文件',
    '加载非接触式授权文件',
  ];

  const handleSelectMode = (mode: 'contact' | 'non-contact') => {
    if (!hasLicense && mode === 'non-contact') {
      showToast('非接触式授权已到期，请先加载有效授权文件！');
      return;
    }
    setMeasurementMode(mode);
    setAppMode('main');
    showToast(`已进入【${mode === 'contact' ? '接触式' : '非接触式'}】测量流程`);
  };

  const handleConfigItemClick = (item: string) => {
    setShowConfigMenu(false);
    showToast(`正在导入：${item} ... 校验通过，导入成功`);
  };

  return (
    <div 
      className="relative flex-1 flex flex-col justify-between p-8 select-none transition-colors overflow-hidden"
      style={{
        backgroundColor: tokens.canvasBg,
        color: tokens.titleColor,
      }}
    >
      {/* Background subtle metrology grid */}
      <div className="absolute inset-0 oscilloscope-grid opacity-30 pointer-events-none" />

      {/* Top Banner or Instrument Subtitle */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs font-mono-num" style={{ color: tokens.mutedColor }}>
          <span>PRECISION METROLOGY SYSTEM</span>
          <span>•</span>
          <span>BUILD 2026.09</span>
        </div>

        {/* Quick link to Factory Calibration Software */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppMode('calib-software-contact')}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
            title="启动厂家级基准标定工具"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>进入仪器基准校准软件 (S15-S17)</span>
          </button>
        </div>
      </div>

      {/* Center Hero: Title, Badge, Mode Selection Cards */}
      <div className="flex flex-col items-center justify-center my-auto z-10 max-w-4xl mx-auto w-full">
        {/* Decorative Divider */}
        <div className="w-16 h-1 rounded-full bg-cyan-500/80 mb-6" />

        {/* 48px Line-Art Cube Badge */}
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-5 border shadow-lg transition-transform hover:scale-105"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <Box className="w-8 h-8 text-cyan-400 stroke-[1.5]" />
        </div>

        {/* Large Heading & Subtitle */}
        <h1 className="text-2xl font-bold tracking-wider font-sans mb-1 text-center" style={{ color: tokens.titleColor }}>
          请选择测量方式
        </h1>
        <p className="text-[11px] uppercase tracking-[0.25em] font-mono-num mb-10 text-center" style={{ color: tokens.mutedColor }}>
          SELECT MEASUREMENT MODE
        </p>

        {/* Two Mode Cards Side by Side (approx 428 x 126 each) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Card 1: 接触式方案卡 */}
          <div
            onClick={() => handleSelectMode('contact')}
            className={`group relative p-6 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <div className="flex items-center gap-5">
              {/* Measurement ball on three-point mount icon */}
              <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-sky-500/10 text-sky-400 border border-sky-500/30 group-hover:bg-sky-500/20 transition-colors">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.6]">
                  {/* Sphere */}
                  <circle cx="12" cy="9" r="5" />
                  {/* 3-point support legs */}
                  <line x1="7" y1="12" x2="4" y2="20" />
                  <line x1="12" y1="14" x2="12" y2="21" />
                  <line x1="17" y1="12" x2="20" y2="20" />
                  <circle cx="12" cy="9" r="1" fill="currentColor" />
                </svg>
              </div>

              <div>
                <div className="text-lg font-bold tracking-wide font-sans mb-1 group-hover:text-sky-400 transition-colors" style={{ color: tokens.titleColor }}>
                  接触式
                </div>
                <div className="text-xs" style={{ color: tokens.mutedColor }}>
                  机械探针三方向直接接触测量 • 精密稳态标定
                </div>
              </div>
            </div>

            {/* Circular Chevron Button */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center border group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-400 transition-all"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
                color: tokens.bodyColor,
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: 非接触式方案卡 */}
          <div
            onClick={() => handleSelectMode('non-contact')}
            className={`group relative p-6 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <div className="flex items-center gap-5">
              {/* Floating ball with dashed optical beam */}
              <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 group-hover:bg-indigo-500/20 transition-colors">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-current fill-none stroke-[1.6]">
                  {/* Sphere floating */}
                  <circle cx="12" cy="8" r="4.5" />
                  {/* Optical dashed beams */}
                  <line x1="12" y1="13" x2="12" y2="21" strokeDasharray="2 2" />
                  <line x1="6" y1="18" x2="12" y2="15" strokeDasharray="2 2" />
                  <line x1="18" y1="18" x2="12" y2="15" strokeDasharray="2 2" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
              </div>

              <div>
                <div className="text-lg font-bold tracking-wide font-sans mb-1 group-hover:text-indigo-400 transition-colors" style={{ color: tokens.titleColor }}>
                  非接触式
                </div>
                <div className="text-xs" style={{ color: tokens.mutedColor }}>
                  高频电涡流/光学无损测量 • 27点网格立体标定
                </div>
              </div>
            </div>

            {/* Circular Chevron Button */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center border group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400 transition-all"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
                color: tokens.bodyColor,
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Centered Helper Text */}
        <p className="mt-8 text-xs text-center tracking-wide" style={{ color: tokens.mutedColor }}>
          选择测量方式后进入对应测量流程；如需更换方案请重新启动程序
        </p>
      </div>

      {/* Bottom Row, Full Width */}
      <div 
        className="z-10 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: tokens.dividerColor }}
      >
        {/* Left: Load Config Menu + License Status */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowConfigMenu(!showConfigMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>加载配置文件 ▾</span>
            </button>

            {showConfigMenu && (
              <div 
                className="absolute left-0 bottom-9 w-64 rounded-lg shadow-2xl py-1 z-50 text-xs border"
                style={{
                  backgroundColor: tokens.cardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                {configMenuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleConfigItemClick(item)}
                    className="w-full text-left px-3.5 py-2 hover:bg-sky-500/15 flex items-center gap-2 transition-colors cursor-pointer"
                    style={{ color: tokens.bodyColor }}
                  >
                    <UploadCloud className="w-3 h-3 text-sky-400" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* License Status Badges */}
          <div className="flex items-center gap-3 text-xs font-mono-num">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>接触: 已授权 · 剩29天</span>
            </span>
            <span style={{ color: tokens.mutedColor }}>|</span>
            <span className="flex items-center gap-1 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>非接触: 授权到期</span>
            </span>
          </div>
        </div>

        {/* Right: Communication Mode Toggles */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="font-medium" style={{ color: tokens.mutedColor }}>通信方式:</span>
          <div 
            className="inline-flex rounded-lg p-0.5 border"
            style={{
              backgroundColor: tokens.subcardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <button
              onClick={() => {
                setConnectionType('wifi');
                showToast('已连接 WiFi DAQ 设备 (192.168.4.1)');
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                connectionType === 'wifi'
                  ? 'bg-sky-600 text-white font-medium shadow-xs'
                  : 'hover:text-sky-400'
              }`}
              style={connectionType !== 'wifi' ? { color: tokens.bodyColor } : undefined}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>WiFi</span>
            </button>
            <button
              onClick={() => {
                setConnectionType('bluetooth');
                showToast('已扫描并配对蓝牙 DAQ 设备');
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                connectionType === 'bluetooth'
                  ? 'bg-sky-600 text-white font-medium shadow-xs'
                  : 'hover:text-sky-400'
              }`}
              style={connectionType !== 'bluetooth' ? { color: tokens.bodyColor } : undefined}
            >
              <Bluetooth className="w-3.5 h-3.5" />
              <span>蓝牙</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
