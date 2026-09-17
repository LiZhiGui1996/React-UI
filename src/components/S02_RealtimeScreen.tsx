import React from 'react';
import { useApp } from '../context/AppContext';
import { OscilloscopeChart } from './OscilloscopeChart';
import { getThemeTokens } from '../utils/themeStyles';
import { Activity, Gauge, Zap, Info } from 'lucide-react';

export const S02_RealtimeScreen: React.FC = () => {
  const { 
    sensorData, 
    sampleCount, 
    sampleRate, 
    voltageHistory, 
    displacementHistory, 
    isConnected,
    theme 
  } = useApp();

  const isLight = theme === 'light-metrology';
  const tokens = getThemeTokens(theme);

  const voltageChannels = [
    { key: 'u1', name: 'U1', color: '#f59e0b', unit: 'V' }, // Amber
    { key: 'u2', name: 'U2', color: '#10b981', unit: 'V' }, // Emerald
    { key: 'u3', name: 'U3', color: '#38bdf8', unit: 'V' }, // Sky
  ];

  const displacementChannels = [
    { key: 'l1', name: 'L1', color: '#ec4899', unit: 'mm' }, // Pink
    { key: 'l2', name: 'L2', color: '#8b5cf6', unit: 'mm' }, // Purple
    { key: 'l3', name: 'L3', color: '#06b6d4', unit: 'mm' }, // Cyan
  ];

  return (
    <div className="flex-1 flex gap-3 p-3 overflow-hidden select-none">
      {/* Left Column: Fixed Width (~260px) with Two Value Card Groups & Stats */}
      <div className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto">
        {/* Card Group 1: 原始电压值 */}
        <div 
          className="rounded-lg border p-3 flex flex-col gap-2.5 transition-colors shadow-sm"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <div 
            className="flex items-center justify-between pb-1.5 border-b"
            style={{ borderColor: tokens.dividerColor }}
          >
            <div 
              className="flex items-center gap-1.5 text-xs font-bold tracking-wide"
              style={{ color: tokens.titleColor }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>原始电压值</span>
            </div>
            <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
              0 ~ 4.0 V
            </span>
          </div>

          {/* Value Cards U1, U2, U3 */}
          <div className="flex flex-col gap-2">
            {[
              { label: 'U1', val: sensorData.u1, color: '#f59e0b', tooltip: 'U1 通道原始电压（V），设备每 100ms 上送一帧' },
              { label: 'U2', val: sensorData.u2, color: '#10b981', tooltip: 'U2 通道原始电压（V），设备每 100ms 上送一帧' },
              { label: 'U3', val: sensorData.u3, color: '#38bdf8', tooltip: 'U3 通道原始电压（V），设备每 100ms 上送一帧' },
            ].map((item) => (
              <div
                key={item.label}
                title={item.tooltip}
                className="p-2.5 rounded-md border flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold font-sans" style={{ color: tokens.mutedColor }}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-lg font-bold font-mono-num tracking-tight"
                    style={{ color: item.color }}
                  >
                    {isConnected ? item.val.toFixed(4) : '--'}
                  </span>
                  <span className="text-[11px] font-mono-num" style={{ color: tokens.mutedColor }}>
                    V
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div 
            className="text-[10px] flex items-center gap-1 pt-1"
            style={{ color: tokens.mutedColor }}
          >
            <Info className="w-3 h-3 shrink-0" />
            <span>100ms/帧 DAQ 差分输入采集</span>
          </div>
        </div>

        {/* Card Group 2: 传感器测量值 */}
        <div 
          className="rounded-lg border p-3 flex flex-col gap-2.5 transition-colors shadow-sm"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <div 
            className="flex items-center justify-between pb-1.5 border-b"
            style={{ borderColor: tokens.dividerColor }}
          >
            <div 
              className="flex items-center gap-1.5 text-xs font-bold tracking-wide"
              style={{ color: tokens.titleColor }}
            >
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>传感器测量值</span>
            </div>
            <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
              0 ~ 2.0 mm
            </span>
          </div>

          {/* Value Cards L1, L2, L3 */}
          <div className="flex flex-col gap-2">
            {[
              { label: 'L1', val: sensorData.l1, color: '#ec4899', desc: 'X方向位移' },
              { label: 'L2', val: sensorData.l2, color: '#8b5cf6', desc: 'Y方向位移' },
              { label: 'L3', val: sensorData.l3, color: '#06b6d4', desc: 'Z方向位移' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-2.5 rounded-md border flex items-center justify-between transition-colors"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold font-sans" style={{ color: tokens.mutedColor }}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span 
                    className="text-lg font-bold font-mono-num tracking-tight"
                    style={{ color: item.color }}
                  >
                    {isConnected ? item.val.toFixed(4) : '--'}
                  </span>
                  <span className="text-[11px] font-mono-num" style={{ color: tokens.mutedColor }}>
                    mm
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div 
            className="text-[10px] flex items-center gap-1 pt-1"
            style={{ color: tokens.mutedColor }}
          >
            <Info className="w-3 h-3 shrink-0" />
            <span>0~4V 线性标定映射至量程</span>
          </div>
        </div>

        {/* Stats Section: Records & Sampling Rate */}
        <div 
          className="rounded-lg border p-3 flex flex-col gap-1.5 transition-colors text-xs font-mono-num mt-auto"
          style={{
            backgroundColor: tokens.subcardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ color: tokens.mutedColor }}>Records:</span>
            <span className="font-bold text-sky-400">{sampleCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: tokens.mutedColor }}>Rate:</span>
            <span className="font-bold text-emerald-400">{sampleRate} S/s</span>
          </div>
          <div 
            className="flex items-center justify-between text-[10px] pt-1 border-t"
            style={{ 
              borderColor: tokens.dividerColor,
              color: tokens.mutedColor 
            }}
          >
            <span>Buffer Window:</span>
            <span>10 s (500 pts)</span>
          </div>
        </div>
      </div>

      {/* Right Column: Dominant Width with Two Stacked Live Oscilloscope Charts */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 h-full overflow-hidden">
        {/* Top Chart: Voltage (0 - 4 V) */}
        <div className="flex-1 min-h-[220px]">
          <OscilloscopeChart
            title="电压曲线 (U1 / U2 / U3 原始采集)"
            yAxisLabel="V"
            yRange={[0, 4]}
            data={voltageHistory}
            channels={voltageChannels}
          />
        </div>

        {/* Bottom Chart: Displacement (0 - 2 mm) */}
        <div className="flex-1 min-h-[220px]">
          <OscilloscopeChart
            title="位移曲线 (L1 / L2 / L3 换算测量)"
            yAxisLabel="mm"
            yRange={[1.5, 2.1]}
            data={displacementHistory}
            channels={displacementChannels}
          />
        </div>
      </div>
    </div>
  );
};

