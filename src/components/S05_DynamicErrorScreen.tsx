import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OscilloscopeChart } from './OscilloscopeChart';
import { getThemeTokens } from '../utils/themeStyles';
import { 
  Play, 
  Square, 
  FileCode, 
  Save, 
  XCircle, 
  Target, 
  RotateCw,
  Compass
} from 'lucide-react';

export const S05_DynamicErrorScreen: React.FC = () => {
  const { 
    measurementMode, 
    sensorData, 
    recordOrigin, 
    showToast, 
    errorSubTab, 
    setErrorSubTab,
    theme,
    setWorkflowStepIndex,
    setCurrentMainTab,
    displacementHistory
  } = useApp();

  const isLight = theme === 'light-metrology';
  const tokens = getThemeTokens(theme);

  // Two rotary axes
  const [axis1Start, setAxis1Start] = useState(0);
  const [axis1End, setAxis1End] = useState(90);
  const [axis2Start, setAxis2Start] = useState(0);
  const [axis2End, setAxis2End] = useState(360);

  // Dynamic acquisition state
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureTime, setCaptureTime] = useState(0);

  // Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFileName, setSaveFileName] = useState('');

  useEffect(() => {
    if (!isCapturing) return;
    const timer = setInterval(() => {
      setCaptureTime((t) => Number((t + 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(timer);
  }, [isCapturing]);

  const handleToggleCapture = () => {
    if (isCapturing) {
      setIsCapturing(false);
      showToast(`动态采集已完成，连续采集时长: ${captureTime}s，共采集 ${(captureTime * 10).toFixed(0)} 帧`);
      setWorkflowStepIndex(6); // 保存
    } else {
      setIsCapturing(true);
      setCaptureTime(0);
      showToast('动态误差连续高速采集已启动 (10Hz)...');
      setWorkflowStepIndex(5); // 开始采集
    }
  };

  const handleExportNC = () => {
    showToast('动态误差测量NC程序已导出：NC_VMG05_DYNAMIC_C_AXIS.NC');
  };

  const handleSave = () => {
    setShowSaveModal(false);
    showToast('动态误差测量报告保存成功！已归档至历史数据库。');
    setWorkflowStepIndex(7); // 采集完成
    setTimeout(() => {
      setCurrentMainTab('history-report');
    }, 600);
  };

  const dynamicChannels = [
    { key: 'x', name: 'X偏移', color: '#ef4444', unit: 'mm' }, // Red
    { key: 'y', name: 'Y偏移', color: '#10b981', unit: 'mm' }, // Green
    { key: 'z', name: 'Z偏移', color: '#3b82f6', unit: 'mm' }, // Blue
  ];

  return (
    <div className="flex-1 flex flex-col gap-2.5 p-3 overflow-hidden select-none">
      {/* 1. Top Parameters Row (Locked Read-only) */}
      <div 
        className="px-3 py-2 rounded-lg border flex items-center justify-between gap-3 text-xs shrink-0 transition-colors shadow-sm"
        style={{
          backgroundColor: tokens.cardBg,
          borderColor: tokens.borderColor,
        }}
      >
        <div className="flex items-center gap-4 flex-wrap" style={{ color: tokens.bodyColor }}>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量方式:</span>
            <span className="font-semibold text-sky-400">动态误差测量</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>机床编号:</span>
            <span className="font-mono-num font-bold" style={{ color: tokens.titleColor }}>VMG-05</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>机床型号:</span>
            <span className="font-medium" style={{ color: tokens.titleColor }}>五轴联动加工中心</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量座旋转:</span>
            <span className="font-medium" style={{ color: tokens.titleColor }}>是</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>转动轴:</span>
            <span className="font-bold text-amber-400">C轴 (连续旋转)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量时间:</span>
            <span className="font-mono-num" style={{ color: tokens.mutedColor }}>2026-09-14 10:30</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量人员:</span>
            <span className="font-medium" style={{ color: tokens.titleColor }}>张工</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono-num bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            参数已锁定
          </span>
        </div>
      </div>

      {/* 2. Main Middle Area Split */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Center Dominant: Subtabs, Two Axis Cards, Large Dynamic Live Chart */}
        <div 
          className="flex-1 rounded-lg border flex flex-col min-w-0 transition-colors shadow-sm overflow-hidden"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          {/* Subtabs Header */}
          <div 
            className="px-3 py-1.5 border-b flex items-center justify-between shrink-0"
            style={{
              backgroundColor: tokens.subcardBg,
              borderColor: tokens.dividerColor,
            }}
          >
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setErrorSubTab('structural')}
                className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-colors ${
                  errorSubTab === 'structural'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'hover:text-sky-400'
                }`}
                style={errorSubTab !== 'structural' ? { color: tokens.mutedColor } : undefined}
              >
                结构误差测量
              </button>
              <button
                onClick={() => setErrorSubTab('dynamic')}
                className={`px-3 py-1 rounded text-xs font-semibold tracking-wide transition-colors ${
                  errorSubTab === 'dynamic'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'hover:text-sky-400'
                }`}
                style={errorSubTab !== 'dynamic' ? { color: tokens.mutedColor } : undefined}
              >
                动态误差测量
              </button>
            </div>

            {/* Live Capture Elapsed Time Indicator */}
            <div className="flex items-center gap-2 text-xs font-mono-num">
              <span className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`} />
              <span style={{ color: tokens.mutedColor }}>采集计时:</span>
              <span className="font-bold text-sky-400 text-sm">{captureTime.toFixed(1)} s</span>
            </div>
          </div>

          {/* Two Side-by-side Parameter Cards: 第一转动轴 / 第二转动轴 */}
          <div 
            className="p-3 border-b grid grid-cols-2 gap-3 text-xs shrink-0"
            style={{ borderColor: tokens.dividerColor }}
          >
            {/* 第一转动轴 */}
            <div 
              className="p-2.5 rounded border flex items-center justify-between"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
              }}
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold font-sans" style={{ color: tokens.titleColor }}>第一转动轴:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ color: tokens.mutedColor }}>起始:</span>
                  <input
                    type="number"
                    value={axis1Start}
                    onChange={(e) => setAxis1Start(Number(e.target.value))}
                    className={`w-14 px-1 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                  />
                  <span style={{ color: tokens.mutedColor }}>°</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ color: tokens.mutedColor }}>终止:</span>
                  <input
                    type="number"
                    value={axis1End}
                    onChange={(e) => setAxis1End(Number(e.target.value))}
                    className={`w-14 px-1 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                  />
                  <span style={{ color: tokens.mutedColor }}>°</span>
                </div>
                <button
                  onClick={() => showToast('第一转动轴参数已确认')}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium transition-colors shadow-xs cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>

            {/* 第二转动轴 */}
            <div 
              className="p-2.5 rounded border flex items-center justify-between"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
              }}
            >
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold font-sans" style={{ color: tokens.titleColor }}>第二转动轴:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ color: tokens.mutedColor }}>起始:</span>
                  <input
                    type="number"
                    value={axis2Start}
                    onChange={(e) => setAxis2Start(Number(e.target.value))}
                    className={`w-14 px-1 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                  />
                  <span style={{ color: tokens.mutedColor }}>°</span>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ color: tokens.mutedColor }}>终止:</span>
                  <input
                    type="number"
                    value={axis2End}
                    onChange={(e) => setAxis2End(Number(e.target.value))}
                    className={`w-14 px-1 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                  />
                  <span style={{ color: tokens.mutedColor }}>°</span>
                </div>
                <button
                  onClick={() => showToast('第二转动轴参数已确认')}
                  className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium transition-colors shadow-xs cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>

          {/* Large Live Dynamic Chart Filling Remaining Height */}
          <div className="flex-1 p-2 min-h-0">
            <OscilloscopeChart
              title="动态球心偏移量随时间变化曲线 (X / Y / Z 三通道连续轨迹)"
              yAxisLabel="mm"
              yRange={[-0.015, 0.015]}
              data={displacementHistory}
              channels={dynamicChannels}
              showZeroLine={true}
            />
          </div>
        </div>

        {/* Right Column: Fixed ~250px with Sensor Card & 4 Action Buttons */}
        <div className="w-60 shrink-0 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1: 传感器测量数据 */}
          <div 
            className="rounded-lg border p-3 flex flex-col gap-2 transition-colors shadow-sm"
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <div 
              className="flex items-center justify-between pb-1.5 border-b"
              style={{ borderColor: tokens.dividerColor }}
            >
              <span className="text-xs font-bold font-sans" style={{ color: tokens.titleColor }}>传感器实时数据</span>
              <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>实时</span>
            </div>

            <div className="space-y-1.5 font-mono-num text-xs">
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-pink-400 font-bold">L1:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>{sensorData.l1.toFixed(4)} mm</span>
              </div>
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-purple-400 font-bold">L2:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>{sensorData.l2.toFixed(4)} mm</span>
              </div>
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-cyan-400 font-bold">L3:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>{sensorData.l3.toFixed(4)} mm</span>
              </div>
            </div>

            <div className="pt-2 border-t" style={{ borderColor: tokens.dividerColor }}>
              <span className="text-[11px] block mb-1 font-medium" style={{ color: tokens.mutedColor }}>球心空间坐标 (mm):</span>
              <div className="grid grid-cols-3 gap-1 font-mono-num text-[11px] text-center">
                <div 
                  className="px-1 py-1 rounded border text-rose-400 font-bold"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.borderColor,
                  }}
                >
                  {sensorData.x.toFixed(3)}
                </div>
                <div 
                  className="px-1 py-1 rounded border text-emerald-400 font-bold"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.borderColor,
                  }}
                >
                  {sensorData.y.toFixed(3)}
                </div>
                <div 
                  className="px-1 py-1 rounded border text-sky-400 font-bold"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.borderColor,
                  }}
                >
                  {sensorData.z.toFixed(3)}
                </div>
              </div>
            </div>

            <button
              onClick={recordOrigin}
              className={`mt-1 w-full py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <Target className="w-3.5 h-3.5 text-sky-400" />
              <span>重新记录原点</span>
            </button>
          </div>

          {/* Card 2: 采集操作竖排 4 钮 */}
          <div 
            className="rounded-lg border p-3 flex flex-col gap-2 transition-colors shadow-sm"
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <div 
              className="pb-1.5 border-b text-xs font-bold font-sans"
              style={{ 
                borderColor: tokens.dividerColor,
                color: tokens.titleColor 
              }}
            >
              采集控制
            </div>

            {/* 1. 开始采集 (Primary Emphasized) */}
            <button
              onClick={handleToggleCapture}
              className={`w-full py-2.5 px-3 rounded text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isCapturing
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {isCapturing ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>停止采集 ({captureTime}s)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>开始采集</span>
                </>
              )}
            </button>

            {/* 2. 导出 NC 程序 */}
            <button
              onClick={handleExportNC}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>导出 NC 程序</span>
            </button>

            {/* 3. 保存 (Green Confirm Action) */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存报告</span>
            </button>

            {/* 4. 取消 (Red Danger Action) */}
            <button
              onClick={() => {
                setIsCapturing(false);
                showToast('已取消当前采集');
              }}
              className="w-full py-2 px-3 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>取消</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div 
            className="w-96 rounded-xl border p-5 shadow-2xl flex flex-col gap-4 text-xs"
            style={{
              backgroundColor: tokens.cardBg,
              borderColor: tokens.borderColor,
            }}
          >
            <div 
              className="flex items-center gap-2 font-bold text-sm pb-2 border-b"
              style={{ 
                borderColor: tokens.dividerColor,
                color: tokens.titleColor 
              }}
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>保存动态测量文件</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ color: tokens.mutedColor }} className="text-xs">
                文件名称（留空按默认名保存）：
              </label>
              <input
                type="text"
                placeholder="VMG05_C_DYN_20260914.dat"
                value={saveFileName}
                onChange={(e) => setSaveFileName(e.target.value)}
                className={`w-full px-3 py-2 rounded border font-mono-num text-xs ${tokens.inputClass}`}
              />
            </div>

            <div 
              className="flex items-center justify-end gap-2 pt-2 border-t"
              style={{ borderColor: tokens.dividerColor }}
            >
              <button
                onClick={() => setShowSaveModal(false)}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                确定保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
