import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MeasurementPoint } from '../types';
import { INITIAL_MEASUREMENT_POINTS } from '../data/mockData';
import { getThemeTokens } from '../utils/themeStyles';
import { InteractiveCurveBox } from './InteractiveCurveBox';
import { 
  Lock, 
  Unlock, 
  FileCode, 
  Play, 
  Square, 
  Plus, 
  Hand, 
  Save, 
  XCircle, 
  Target, 
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  Table as TableIcon,
  LineChart
} from 'lucide-react';

export const S04_StructuralErrorScreen: React.FC = () => {
  const { 
    measurementMode, 
    sensorData, 
    recordOrigin, 
    showToast, 
    errorSubTab, 
    setErrorSubTab,
    theme,
    setWorkflowStepIndex,
    setCurrentMainTab
  } = useApp();

  const isLight = theme === 'light-metrology';
  const tokens = getThemeTokens(theme);

  // Top Parameters Row
  const [isParamLocked, setIsParamLocked] = useState(true);
  const [machineId, setMachineId] = useState('VMG-05');
  const [machineModel, setMachineModel] = useState('五轴联动加工中心');
  const [isBaseRotated, setIsBaseRotated] = useState('否');
  const [axisName, setAxisName] = useState('C轴');
  const [measureTime, setMeasureTime] = useState('2026-09-14 10:30');
  const [operator, setOperator] = useState('张工');

  // Angle Parameters
  const [startAngle, setStartAngle] = useState(0);
  const [endAngle, setEndAngle] = useState(360);
  const [stepAngle, setStepAngle] = useState(20);
  const [threshold, setThreshold] = useState(0.01);
  const [intervalTime, setIntervalTime] = useState(5);

  const [points, setPoints] = useState<MeasurementPoint[]>(INITIAL_MEASUREMENT_POINTS);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'table' | 'curve'>('table');

  // Auto Measurement Simulation
  const [isAutoMeasuring, setIsAutoMeasuring] = useState(false);
  const [currentMeasuringIndex, setCurrentMeasuringIndex] = useState<number | null>(null);

  // Save Modal
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveFileName, setSaveFileName] = useState('');

  // Calculate total points
  const pointsCount = Math.floor(Math.abs(endAngle - startAngle) / (stepAngle || 20)) + (endAngle % stepAngle === 0 ? 0 : 1);

  const handleGeneratePoints = () => {
    const newPoints: MeasurementPoint[] = [];
    const count = Math.max(1, Math.floor((endAngle - startAngle) / stepAngle));
    for (let i = 0; i <= count; i++) {
      const angle = startAngle + i * stepAngle;
      if (angle > endAngle) break;
      const rad = (angle * Math.PI) / 180;
      const x = Number((12.5000 + 0.0085 * Math.sin(rad)).toFixed(4));
      const y = Number((-0.0200 + 0.0072 * Math.cos(rad)).toFixed(4));
      const z = Number((3.3090 + 0.0035 * Math.sin(2 * rad)).toFixed(4));
      newPoints.push({
        index: i + 1,
        angle,
        x,
        y,
        z,
        dx: Number((x - 12.5000).toFixed(4)),
        dy: Number((y - (-0.0200)).toFixed(4)),
        dz: Number((z - 3.3090).toFixed(4)),
      });
    }
    setPoints(newPoints);
    showToast(`已按参数生成 ${newPoints.length} 个测量点`);
  };

  // Run auto measurement simulation
  useEffect(() => {
    if (!isAutoMeasuring) return;
    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx < points.length) {
        setCurrentMeasuringIndex(currentIdx);
        currentIdx++;
      } else {
        setIsAutoMeasuring(false);
        setCurrentMeasuringIndex(null);
        showToast(`自动测量完成，共 ${points.length} 个测点采集完毕`);
        setWorkflowStepIndex(9); // 等待完成 / 保存
        clearInterval(timer);
      }
    }, 600);
    return () => clearInterval(timer);
  }, [isAutoMeasuring, points.length]);

  const handleStartAutoMeasure = () => {
    if (!isParamLocked) {
      showToast('请先点击右上角【确定】锁定测量任务参数！');
      return;
    }
    if (isAutoMeasuring) {
      setIsAutoMeasuring(false);
      setCurrentMeasuringIndex(null);
      showToast('自动测量已中止');
    } else {
      setIsAutoMeasuring(true);
      showToast('自动测量已启动，机床按角度间隔依次采集...');
      setWorkflowStepIndex(8); // 自动测量
    }
  };

  const handleExportNC = () => {
    showToast(`NC程序生成成功：NC_${machineId}_${axisName}_STRUCT.NC (已就绪导出)`);
    setWorkflowStepIndex(6); // 导出NC程序
  };

  const handleAddPoint = () => {
    const nextIdx = points.length + 1;
    const nextAngle = (points[points.length - 1]?.angle ?? 0) + stepAngle;
    const newPt: MeasurementPoint = {
      index: nextIdx,
      angle: nextAngle,
      x: sensorData.x,
      y: sensorData.y,
      z: sensorData.z,
      dx: Number((sensorData.x - 12.5).toFixed(4)),
      dy: Number((sensorData.y - (-0.02)).toFixed(4)),
      dz: Number((sensorData.z - 3.309).toFixed(4)),
    };
    setPoints([...points, newPt]);
    showToast(`已添加第 ${nextIdx} 个测点 (角度: ${nextAngle}°)`);
  };

  const handleManualMeasure = () => {
    showToast(`手动测量点 #${selectedPointIndex + 1} 采集完成：X=${sensorData.x.toFixed(4)}, Y=${sensorData.y.toFixed(4)}, Z=${sensorData.z.toFixed(4)}`);
  };

  const handleSaveReport = () => {
    const finalName = saveFileName.trim() || `${machineId}_${axisName}_${new Date().toISOString().slice(0,10)}.dat`;
    setShowSaveModal(false);
    showToast(`测量数据已保存至本地数据库：${finalName}`);
    setWorkflowStepIndex(10); // 保存
    setTimeout(() => {
      setWorkflowStepIndex(11); // 采集完成
      setCurrentMainTab('history-report');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col gap-2.5 p-3 overflow-hidden select-none">
      {/* 1. Top Parameters Row (Single Dense Row with Lock/Unlock) */}
      <div 
        className="px-3 py-2 rounded-lg border flex items-center justify-between gap-3 text-xs shrink-0 transition-colors shadow-sm"
        style={{
          backgroundColor: tokens.cardBg,
          borderColor: tokens.borderColor,
        }}
      >
        <div className="flex items-center gap-3.5 flex-wrap flex-1">
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量方式:</span>
            <span className="font-semibold text-sky-400 font-sans">
              {measurementMode === 'contact' ? '接触式' : '非接触式'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>机床编号:</span>
            <input
              type="text"
              value={machineId}
              disabled={isParamLocked}
              onChange={(e) => setMachineId(e.target.value)}
              placeholder="请输入机床编号"
              className={`w-24 px-2 py-0.5 rounded border text-xs disabled:opacity-85 ${tokens.inputClass}`}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>机床型号:</span>
            <input
              type="text"
              value={machineModel}
              disabled={isParamLocked}
              onChange={(e) => setMachineModel(e.target.value)}
              className={`w-36 px-2 py-0.5 rounded border text-xs disabled:opacity-85 ${tokens.inputClass}`}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量座旋转:</span>
            <select
              value={isBaseRotated}
              disabled={isParamLocked}
              onChange={(e) => setIsBaseRotated(e.target.value)}
              className={`px-2 py-0.5 rounded border text-xs disabled:opacity-85 ${tokens.inputClass}`}
            >
              <option value="否">否</option>
              <option value="是">是</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>转动轴:</span>
            <select
              value={axisName}
              disabled={isParamLocked}
              onChange={(e) => setAxisName(e.target.value)}
              className={`px-2 py-0.5 rounded border text-xs font-semibold disabled:opacity-85 ${tokens.inputClass}`}
            >
              <option value="A轴">A轴</option>
              <option value="B轴">B轴</option>
              <option value="C轴">C轴</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>时间:</span>
            <input
              type="text"
              value={measureTime}
              disabled={isParamLocked}
              onChange={(e) => setMeasureTime(e.target.value)}
              className={`w-32 px-2 py-0.5 rounded border font-mono-num text-[11px] disabled:opacity-85 ${tokens.inputClass}`}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>测量人员:</span>
            <input
              type="text"
              value={operator}
              disabled={isParamLocked}
              onChange={(e) => setOperator(e.target.value)}
              className={`w-16 px-2 py-0.5 rounded border text-xs disabled:opacity-85 ${tokens.inputClass}`}
            />
          </div>
        </div>

        {/* Lock/Unlock Toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              setIsParamLocked(!isParamLocked);
              showToast(isParamLocked ? '参数已解锁，可编辑机床与任务信息' : '参数已锁定保存');
            }}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isParamLocked
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isParamLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isParamLocked ? '修改' : '确定'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Split: Left (Parameters + Table) | Right (Sensor + Buttons) */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Middle Left: Sub-tabs, Angle Parameters Grid, Measurement Points Table */}
        <div 
          className="flex-1 rounded-lg border flex flex-col min-w-0 transition-colors shadow-sm overflow-hidden"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          {/* Sub-tabs Header: 结构误差测量 vs 动态误差测量 */}
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

            <span className="text-[11px] font-sans" style={{ color: tokens.mutedColor }}>
              自动测量使用 • 逐点采样模式
            </span>
          </div>

          {/* Angle Parameter Grid */}
          <div 
            className="p-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs shrink-0"
            style={{ borderColor: tokens.dividerColor }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <span style={{ color: tokens.mutedColor }}>起始角度:</span>
                <input
                  type="number"
                  value={startAngle}
                  onChange={(e) => setStartAngle(Number(e.target.value))}
                  className={`w-16 px-1.5 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                />
                <span style={{ color: tokens.mutedColor }}>°</span>
              </div>

              <div className="flex items-center gap-1">
                <span style={{ color: tokens.mutedColor }}>终止角度:</span>
                <input
                  type="number"
                  value={endAngle}
                  onChange={(e) => setEndAngle(Number(e.target.value))}
                  className={`w-16 px-1.5 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                />
                <span style={{ color: tokens.mutedColor }}>°</span>
              </div>

              <div className="flex items-center gap-1">
                <span style={{ color: tokens.mutedColor }}>间隔角度:</span>
                <input
                  type="number"
                  value={stepAngle}
                  onChange={(e) => setStepAngle(Number(e.target.value))}
                  className={`w-16 px-1.5 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                />
                <span style={{ color: tokens.mutedColor }}>°</span>
              </div>

              <div className="flex items-center gap-1">
                <span style={{ color: tokens.mutedColor }}>阈值:</span>
                <input
                  type="number"
                  step="0.001"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className={`w-16 px-1.5 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                />
                <span style={{ color: tokens.mutedColor }}>mm</span>
              </div>

              <div className="flex items-center gap-1">
                <span style={{ color: tokens.mutedColor }}>间隔时间:</span>
                <input
                  type="number"
                  value={intervalTime}
                  onChange={(e) => setIntervalTime(Number(e.target.value))}
                  className={`w-14 px-1.5 py-0.5 rounded border font-mono-num text-center text-xs ${tokens.inputClass}`}
                />
                <span style={{ color: tokens.mutedColor }}>s</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-num" style={{ color: tokens.bodyColor }}>
                测量点数: <strong className="text-sky-400 font-bold">{points.length}</strong>
              </span>
              <button
                onClick={handleGeneratePoints}
                className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow-xs"
              >
                确定
              </button>
            </div>
          </div>

          {/* Helper Note & View Mode Switcher */}
          <div 
            className="px-3 py-1.5 text-[11px] border-b flex items-center justify-between shrink-0"
            style={{ 
              backgroundColor: tokens.subcardBg,
              borderColor: tokens.dividerColor,
              color: tokens.mutedColor 
            }}
          >
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>注：此页面球心坐标为机床实测条件下的空间坐标 (X/Y/Z) 与误差残差 (dx/dy/dz)</span>
            </div>
            <div className="flex items-center gap-1 rounded p-0.5 border" style={{ borderColor: tokens.dividerColor }}>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'hover:text-sky-400'
                }`}
                style={viewMode !== 'table' ? { color: tokens.mutedColor } : undefined}
              >
                <TableIcon className="w-3 h-3" />
                <span>表格数据</span>
              </button>
              <button
                onClick={() => setViewMode('curve')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'curve'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'hover:text-sky-400'
                }`}
                style={viewMode !== 'curve' ? { color: tokens.mutedColor } : undefined}
              >
                <LineChart className="w-3 h-3" />
                <span>误差曲线 (可拖动缩放)</span>
              </button>
            </div>
          </div>

          {/* Conditional Display: 8-Column Measurement Point Table vs Interactive Curve */}
          {viewMode === 'table' ? (
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead 
                  className={`sticky top-0 border-b text-[11px] font-bold select-none z-10 ${tokens.tableHeaderClass}`}
                  style={{ borderColor: tokens.borderColor }}
                >
                  <tr>
                    <th className="py-2 px-3 w-12 text-center">序号</th>
                    <th className="py-2 px-3">角度 (°)</th>
                    <th className="py-2 px-3">X (mm)</th>
                    <th className="py-2 px-3">Y (mm)</th>
                    <th className="py-2 px-3">Z (mm)</th>
                    <th className="py-2 px-3">dx (mm)</th>
                    <th className="py-2 px-3">dy (mm)</th>
                    <th className="py-2 px-3">dz (mm)</th>
                  </tr>
                </thead>
                <tbody 
                  className="divide-y font-mono-num text-[11px]"
                  style={{ borderColor: tokens.dividerColor }}
                >
                  {points.map((pt, idx) => {
                    const isMeasuringThis = currentMeasuringIndex === idx;
                    const isSelected = selectedPointIndex === idx;

                    return (
                      <tr
                        key={pt.index}
                        onClick={() => setSelectedPointIndex(idx)}
                        className={`cursor-pointer transition-colors ${
                          isMeasuringThis
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : isSelected
                              ? isLight ? 'bg-sky-100 text-sky-900 font-semibold' : 'bg-sky-500/20 text-sky-200'
                              : idx % 2 === 0
                                ? isLight ? 'bg-white' : 'bg-transparent'
                                : isLight ? 'bg-slate-50' : 'bg-black/15'
                        } hover:bg-sky-500/10`}
                      >
                        <td className="py-1.5 px-3 text-center font-bold" style={{ color: tokens.mutedColor }}>
                          {isMeasuringThis ? '▶' : pt.index}
                        </td>
                        <td className="py-1.5 px-3 font-semibold" style={{ color: tokens.bodyColor }}>
                          {pt.angle.toFixed(1)}°
                        </td>
                        <td className="py-1.5 px-3" style={{ color: tokens.titleColor }}>{pt.x.toFixed(4)}</td>
                        <td className="py-1.5 px-3" style={{ color: tokens.titleColor }}>{pt.y.toFixed(4)}</td>
                        <td className="py-1.5 px-3" style={{ color: tokens.titleColor }}>{pt.z.toFixed(4)}</td>
                        <td className={`py-1.5 px-3 ${pt.dx >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pt.dx >= 0 ? `+${pt.dx.toFixed(4)}` : pt.dx.toFixed(4)}
                        </td>
                        <td className={`py-1.5 px-3 ${pt.dy >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pt.dy >= 0 ? `+${pt.dy.toFixed(4)}` : pt.dy.toFixed(4)}
                        </td>
                        <td className={`py-1.5 px-3 ${pt.dz >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pt.dz >= 0 ? `+${pt.dz.toFixed(4)}` : pt.dz.toFixed(4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-3 gap-2 min-h-0 overflow-hidden">
              {/* Curve Header & Legend */}
              <div className="flex items-center justify-between text-xs pb-1 border-b" style={{ borderColor: tokens.dividerColor }}>
                <div className="flex items-center gap-3">
                  <span className="font-semibold" style={{ color: tokens.titleColor }}>空间误差走势曲线 (θ ∈ [{startAngle}°, {endAngle}°])</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono-num">
                    <span className="flex items-center gap-1 text-rose-400">
                      <span className="w-2.5 h-0.5 bg-rose-500 inline-block rounded"></span>
                      dx (X轴偏差)
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2.5 h-0.5 bg-emerald-500 inline-block rounded"></span>
                      dy (Y轴偏差)
                    </span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <span className="w-2.5 h-0.5 bg-sky-500 inline-block rounded"></span>
                      dz (Z轴跳动)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-mono-num" style={{ color: tokens.mutedColor }}>
                  当前基准零位: ±{threshold} mm 阈值
                </div>
              </div>

              {/* Interactive Draggable & Zoomable Curve Box */}
              <InteractiveCurveBox className="flex-1 rounded border border-white/10 overflow-hidden p-2">
                <svg className="w-full h-full" viewBox="0 0 800 280" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="50" y1="140" x2="780" y2="140" stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" />
                  
                  {/* Threshold Envelope Lines */}
                  <line x1="50" y1="90" x2="780" y2="90" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="2 2" />
                  <line x1="50" y1="190" x2="780" y2="190" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="2 2" />

                  {/* Y Axis Labels */}
                  <text x="5" y="40" fill="#94a3b8" fontSize="10" fontFamily="monospace">+{ (threshold * 2).toFixed(3) } mm</text>
                  <text x="5" y="93" fill="#fbbf24" fontSize="9" fontFamily="monospace">+{ threshold.toFixed(3) } mm</text>
                  <text x="5" y="144" fill="#94a3b8" fontSize="10" fontFamily="monospace"> 0.000 mm</text>
                  <text x="5" y="193" fill="#fbbf24" fontSize="9" fontFamily="monospace">-{ threshold.toFixed(3) } mm</text>
                  <text x="5" y="250" fill="#94a3b8" fontSize="10" fontFamily="monospace">-{ (threshold * 2).toFixed(3) } mm</text>

                  {/* Polyline dx (Red) */}
                  <polyline
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.map((pt, i) => {
                      const x = 50 + (i / Math.max(1, points.length - 1)) * 720;
                      const y = 140 - (pt.dx / (threshold * 2 || 0.02)) * 100;
                      return `${x},${Math.max(20, Math.min(260, y))}`;
                    }).join(' ')}
                  />

                  {/* Polyline dy (Green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.map((pt, i) => {
                      const x = 50 + (i / Math.max(1, points.length - 1)) * 720;
                      const y = 140 - (pt.dy / (threshold * 2 || 0.02)) * 100;
                      return `${x},${Math.max(20, Math.min(260, y))}`;
                    }).join(' ')}
                  />

                  {/* Polyline dz (Sky Blue) */}
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.map((pt, i) => {
                      const x = 50 + (i / Math.max(1, points.length - 1)) * 720;
                      const y = 140 - (pt.dz / (threshold * 2 || 0.02)) * 100;
                      return `${x},${Math.max(20, Math.min(260, y))}`;
                    }).join(' ')}
                  />

                  {/* Point circles */}
                  {points.map((pt, i) => {
                    const x = 50 + (i / Math.max(1, points.length - 1)) * 720;
                    const yX = Math.max(20, Math.min(260, 140 - (pt.dx / (threshold * 2 || 0.02)) * 100));
                    const yY = Math.max(20, Math.min(260, 140 - (pt.dy / (threshold * 2 || 0.02)) * 100));
                    const yZ = Math.max(20, Math.min(260, 140 - (pt.dz / (threshold * 2 || 0.02)) * 100));
                    const isSelected = selectedPointIndex === i;

                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setSelectedPointIndex(i)}>
                        <circle cx={x} cy={yX} r={isSelected ? "5" : "3"} fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                        <circle cx={x} cy={yY} r={isSelected ? "5" : "3"} fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                        <circle cx={x} cy={yZ} r={isSelected ? "5" : "3"} fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                      </g>
                    );
                  })}
                </svg>

                {/* X Axis Angles labels */}
                <div className="absolute bottom-1 left-12 right-6 flex justify-between text-[10px] font-mono-num text-slate-400 pointer-events-none">
                  {points.filter((_, i) => i === 0 || i === Math.floor(points.length / 2) || i === points.length - 1).map((pt, i) => (
                    <span key={i}>{pt.angle.toFixed(1)}°</span>
                  ))}
                </div>
              </InteractiveCurveBox>

              {/* Selected Point Inspector Footer */}
              {points[selectedPointIndex] && (
                <div 
                  className="px-3 py-1.5 rounded border flex items-center justify-between text-xs shrink-0 font-mono-num"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.dividerColor,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: tokens.titleColor }}>
                      选中点 #{points[selectedPointIndex].index} ({points[selectedPointIndex].angle.toFixed(1)}°)
                    </span>
                    <span>X: {points[selectedPointIndex].x.toFixed(4)}</span>
                    <span>Y: {points[selectedPointIndex].y.toFixed(4)}</span>
                    <span>Z: {points[selectedPointIndex].z.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-rose-400 font-semibold">dx: {points[selectedPointIndex].dx >= 0 ? `+${points[selectedPointIndex].dx.toFixed(4)}` : points[selectedPointIndex].dx.toFixed(4)}</span>
                    <span className="text-emerald-400 font-semibold">dy: {points[selectedPointIndex].dy >= 0 ? `+${points[selectedPointIndex].dy.toFixed(4)}` : points[selectedPointIndex].dy.toFixed(4)}</span>
                    <span className="text-sky-400 font-semibold">dz: {points[selectedPointIndex].dz >= 0 ? `+${points[selectedPointIndex].dz.toFixed(4)}` : points[selectedPointIndex].dz.toFixed(4)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Fixed Narrow (~250px) with Real-time Sensor Data & Operation Buttons */}
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
              <span className="text-xs font-bold tracking-wide font-sans" style={{ color: tokens.titleColor }}>
                传感器实时数据
              </span>
              <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
                实时
              </span>
            </div>

            {/* L1, L2, L3 */}
            <div className="space-y-1.5 font-mono-num text-xs">
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-pink-400 font-bold">L1:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>
                  {sensorData.l1.toFixed(4)} mm
                </span>
              </div>
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-purple-400 font-bold">L2:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>
                  {sensorData.l2.toFixed(4)} mm
                </span>
              </div>
              <div 
                className="flex items-center justify-between px-2 py-1 rounded border"
                style={{
                  backgroundColor: tokens.subcardBg,
                  borderColor: tokens.borderColor,
                }}
              >
                <span className="text-cyan-400 font-bold">L3:</span>
                <span className="font-semibold" style={{ color: tokens.titleColor }}>
                  {sensorData.l3.toFixed(4)} mm
                </span>
              </div>
            </div>

            {/* 球心坐标 X, Y, Z */}
            <div className="pt-2 border-t" style={{ borderColor: tokens.dividerColor }}>
              <span className="text-[11px] block mb-1 font-medium" style={{ color: tokens.mutedColor }}>
                球心坐标 (mm):
              </span>
              <div className="grid grid-cols-3 gap-1 font-mono-num text-[11px] text-center">
                <div 
                  className="px-1 py-1 rounded border text-sky-400 font-bold"
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
                  className="px-1 py-1 rounded border text-amber-400 font-bold"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.borderColor,
                  }}
                >
                  {sensorData.z.toFixed(3)}
                </div>
              </div>
            </div>

            {/* Confirm Origin Button */}
            <button
              onClick={recordOrigin}
              className={`mt-1 w-full py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <Target className="w-3.5 h-3.5 text-sky-400" />
              <span>确定原点</span>
            </button>
          </div>

          {/* Card 2: 操作按钮竖排 6 钮 */}
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
              操作按钮
            </div>

            {/* 1. 导出 NC 程序 */}
            <button
              onClick={handleExportNC}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>导出 NC 程序</span>
            </button>

            {/* 2. 自动测量 (Primary Emphasized) */}
            <button
              onClick={handleStartAutoMeasure}
              className={`w-full py-2 px-3 rounded text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAutoMeasuring
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              {isAutoMeasuring ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>停止测量 (进行中...)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>自动测量</span>
                </>
              )}
            </button>

            {/* 3. 添加 */}
            <button
              onClick={handleAddPoint}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>添加测点</span>
            </button>

            {/* 4. 手动测量 */}
            <button
              onClick={handleManualMeasure}
              className={`w-full py-2 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${tokens.secondaryButtonClass}`}
            >
              <Hand className="w-3.5 h-3.5 text-indigo-400" />
              <span>手动测量</span>
            </button>

            {/* 5. 保存 (Green Confirm Action) */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存测量报告</span>
            </button>

            {/* 6. 取消 (Red Danger/Cancel Action) */}
            <button
              onClick={() => {
                showToast('已取消当前测量任务操作');
              }}
              className="w-full py-2 px-3 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>取消</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal Dialog */}
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
              <span>保存测量文件</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label style={{ color: tokens.mutedColor }} className="text-xs">
                文件名称（留空按默认名保存）：
              </label>
              <input
                type="text"
                placeholder={`${machineId}_${axisName}_${new Date().toISOString().slice(0, 10)}.dat`}
                value={saveFileName}
                onChange={(e) => setSaveFileName(e.target.value)}
                className={`w-full px-3 py-2 rounded border font-mono-num text-xs ${tokens.inputClass}`}
              />
              <span className="text-[10px]" style={{ color: tokens.mutedColor }}>
                将同时归档原始 DATABLOCK 数据块与几何拟合系数
              </span>
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
                onClick={handleSaveReport}
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
