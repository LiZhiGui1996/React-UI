import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalibSoftwarePage } from '../types';
import { CONTACT_CALIB_6_POINTS, NON_CONTACT_27_POINTS } from '../data/mockData';
import { OscilloscopeChart } from './OscilloscopeChart';
import { InteractiveCurveBox } from './InteractiveCurveBox';
import { 
  Wifi, 
  RefreshCw, 
  Unlink, 
  CheckCircle2, 
  Wrench, 
  FileCode, 
  Calculator, 
  Save, 
  FileLock, 
  Trash2, 
  Plus, 
  Layers, 
  ArrowLeft,
  Check,
  AlertTriangle,
  Radio
} from 'lucide-react';

export const S15_to_S17_CalibSoftwareScreen: React.FC = () => {
  const { 
    appMode, 
    setAppMode, 
    sensorData, 
    displacementHistory, 
    originRecorded, 
    recordOrigin, 
    calibSoftwarePage, 
    setCalibSoftwarePage, 
    showToast,
    theme
  } = useApp();

  const isLight = theme === 'light-metrology';
  const isNonContact = appMode === 'calib-software-noncontact';

  // Basic Info Form
  const [operatorName, setOperatorName] = useState('张工');
  const [calibDate, setCalibDate] = useState('2026-09-14');

  // S15 3-direction coordinates
  const [p1Coords, setP1Coords] = useState({ x: '0.2001', y: '-0.0002', z: '0.0001' });
  const [p2Coords, setP2Coords] = useState({ x: '0.0003', y: '0.1998', z: '-0.0002' });
  const [p3Coords, setP3Coords] = useState({ x: '-0.0001', y: '0.0002', z: '0.2003' });
  const [lcCx, setLcCx] = useState('254.00');
  const [lcCy, setLcCy] = useState('254.00');

  // Sensor range
  const [sensorRange, setSensorRange] = useState('1 mm');

  // S16 / S17 Point acquisition table
  const defaultContactRows = [
    { index: 1, l1: 1.8600, l2: 1.7921, l3: 1.8455 },
    { index: 2, l1: 1.8802, l2: 1.7920, l3: 1.8453 },
    { index: 3, l1: 1.8601, l2: 1.8123, l3: 1.8454 },
    { index: 4, l1: 1.8598, l2: 1.7922, l3: 1.8659 },
    { index: 5, l1: 1.8800, l2: 1.8121, l3: 1.8456 },
    { index: 6, l1: 1.8803, l2: 1.8124, l3: 1.8657 },
  ];

  const defaultNonContactRows = Array.from({ length: 27 }, (_, i) => ({
    index: i + 1,
    l1: Number((1.8600 + 0.01 * (i % 3)).toFixed(4)),
    l2: Number((1.7920 + 0.01 * Math.floor((i % 9) / 3)).toFixed(4)),
    l3: Number((1.8450 + 0.01 * Math.floor(i / 9)).toFixed(4)),
  }));

  const [collectedRows, setCollectedRows] = useState(isNonContact ? defaultNonContactRows : defaultContactRows);
  const [isCalculated, setIsCalculated] = useState(true);

  // S16 Contact polynomial coefficients (a, b, c, d)
  const contactCoefficients = [
    { id: 1, a: 0.1234, b: -0.0021, c: 0.0000, d: 0.0000 },
    { id: 2, a: -0.0019, b: 0.1245, c: 0.0000, d: 0.0000 },
    { id: 3, a: 0.0002, b: -0.0003, c: 0.1238, d: 0.0000 },
  ];

  // S17 Non-contact polynomial coefficients (c0 ~ c9)
  const nonContactCoefficients = [
    { id: 1, c0: 0.1234, c1: -0.0021, c2: 0.0012, c3: -0.0004, c4: 0.0001, c5: 0.0000, c6: 0.0000, c7: 0.0001, c8: -0.0002, c9: 0.0000 },
    { id: 2, c0: -0.0019, c1: 0.1245, c2: -0.0008, c3: 0.0015, c4: -0.0003, c5: 0.0001, c6: 0.0000, c7: 0.0000, c8: 0.0001, c9: -0.0001 },
    { id: 3, c0: 0.0002, c1: -0.0003, c2: 0.1238, c3: -0.0009, c4: 0.0004, c5: -0.0001, c6: 0.0000, c7: 0.0000, c8: 0.0000, c9: 0.0001 },
  ];

  const handleAddCollectedPoint = () => {
    const nextIdx = collectedRows.length + 1;
    const maxIdx = isNonContact ? 27 : 6;
    if (nextIdx > maxIdx) {
      showToast(`已达到标定点数量上限 (${maxIdx} 点)`);
      return;
    }
    const newRow = {
      index: nextIdx,
      l1: sensorData.l1,
      l2: sensorData.l2,
      l3: sensorData.l3,
    };
    setCollectedRows([...collectedRows, newRow]);
    showToast(`已追加第 ${nextIdx} 点采样读数`);
  };

  const handleCalculateParams = () => {
    setIsCalculated(true);
    showToast('标定参数计算完成！多项式系数矩阵拟合成功。');
  };

  const handleExportNC = () => {
    showToast('校准 NC 程序已生成：CALIB_SETUP_6PTS.NC (已导出)');
  };

  const handleExportEncryptedConfig = () => {
    showToast('标定参数加密交接配置文件导出成功：R_test_2609009A_CALIB_CONFIG.ENC');
  };

  const handleClear = () => {
    setCollectedRows([]);
    setIsCalculated(false);
    showToast('已清空逐点采集数据');
  };

  const displacementChannels = [
    { key: 'l1', name: 'L1', color: '#ec4899', unit: 'mm' },
    { key: 'l2', name: 'L2', color: '#8b5cf6', unit: 'mm' },
    { key: 'l3', name: 'L3', color: '#06b6d4', unit: 'mm' },
  ];

  return (
    <div 
      className="flex-1 flex flex-col justify-between p-3 gap-2.5 overflow-hidden select-none"
      style={{
        backgroundColor: isLight ? '#f1f5f9' : '#0a0e16',
        color: isLight ? '#1e293b' : '#e2e8f0',
      }}
    >
      {/* 1. Header Banner + Embedded DAQ Connection Group */}
      <div 
        className="px-3 py-2 rounded-lg border flex items-center justify-between gap-4 text-xs shrink-0 transition-colors shadow-sm"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAppMode('main')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回主测量软件</span>
          </button>

          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-200">
              {isNonContact ? '仪器基准校准软件（非接触式）' : '仪器基准校准软件（接触式）'}
            </span>
          </div>

          {/* Toggle between Contact S16 and Non-contact S17 */}
          <div className="inline-flex rounded p-0.5 bg-black/30 border border-white/10 text-[11px]">
            <button
              onClick={() => {
                setAppMode('calib-software-contact');
                setCollectedRows(defaultContactRows);
                showToast('已切换至【接触式】仪器基准校准软件');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                !isNonContact ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              接触式 (6点)
            </button>
            <button
              onClick={() => {
                setAppMode('calib-software-noncontact');
                setCollectedRows(defaultNonContactRows);
                showToast('已切换至【非接触式】仪器基准校准软件 (27点)');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                isNonContact ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              非接触式 (27点网格)
            </button>
          </div>
        </div>

        {/* Embedded DAQ Connection Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono-num">
            <span className="text-slate-400 font-sans">DAQ 连接:</span>
            <select className="px-2 py-0.5 rounded bg-black/20 border border-white/10 text-slate-200 text-xs">
              <option value="R_test_2609009A">R_test_2609009A</option>
              <option value="R_test_2609009B">R_test_2609009B</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast('WiFi DAQ 热点扫描完成，信号良好 (-42 dBm)')}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 transition-colors"
            >
              扫描
            </button>
            <button
              onClick={() => showToast('已连接 DAQ 设备 (IP: 192.168.4.1)')}
              className="px-2.5 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
            >
              连接
            </button>
            <button
              onClick={() => showToast('已断开连接')}
              className="px-2 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-colors"
            >
              断开
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono-num text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>● 已连接 心跳正常 时间已同步</span>
            </span>
            <span className="text-slate-500 font-sans text-[10px]">默认IP：192.168.4.1</span>
          </div>
        </div>
      </div>

      {/* 2. Top Info Row: 基本信息卡 + 使用步骤说明卡 (+ 标定点坐标卡 for Non-contact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs shrink-0">
        {/* Card 1: 基本信息卡 */}
        <div 
          className="rounded-lg border p-2.5 flex flex-col justify-between transition-colors shadow-sm"
          style={{
            backgroundColor: isLight ? '#ffffff' : '#111722',
            borderColor: isLight ? '#cbd5e1' : '#1e293b',
          }}
        >
          <div className="text-xs font-bold text-slate-200 pb-1 border-b border-white/10">
            基本信息
          </div>
          <div className="space-y-1.5 mt-1 font-mono-num text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">仪器编号:</span>
              <span className="font-bold text-sky-400">R_test_2609009A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans">校准人员:</span>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="请输入校准人员姓名"
                className="w-32 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-slate-200 text-[11px] font-sans text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-sans">校准日期:</span>
              <input
                type="text"
                value={calibDate}
                onChange={(e) => setCalibDate(e.target.value)}
                className="w-28 px-1.5 py-0.5 rounded bg-black/20 border border-white/10 text-slate-200 text-[11px] text-right"
              />
            </div>
          </div>
        </div>

        {/* Card 2: 使用步骤说明卡 */}
        <div 
          className={`rounded-lg border p-2.5 flex flex-col justify-between transition-colors shadow-sm ${
            !isNonContact ? 'md:col-span-2' : ''
          }`}
          style={{
            backgroundColor: isLight ? '#ffffff' : '#111722',
            borderColor: isLight ? '#cbd5e1' : '#1e293b',
          }}
        >
          <div className="text-xs font-bold text-slate-200 pb-1 border-b border-white/10">
            使用步骤说明
          </div>
          <div className="grid grid-cols-3 gap-2 mt-1 text-[11px] text-slate-300">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-mono-num flex items-center justify-center font-bold text-[10px]">1</span>
              <span>连接 WiFi</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-mono-num flex items-center justify-center font-bold text-[10px]">2</span>
              <span>填写基本信息</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-mono-num flex items-center justify-center font-bold text-[10px]">3</span>
              <span>确定原点</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-mono-num flex items-center justify-center font-bold text-[10px]">4</span>
              <span>逐点采集</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-sky-500/20 text-sky-400 font-mono-num flex items-center justify-center font-bold text-[10px]">5</span>
              <span>计算标定参数</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-num flex items-center justify-center font-bold text-[10px]">6</span>
              <span className="font-semibold text-emerald-400">确定保存</span>
            </div>
          </div>
        </div>

        {/* Card 3 (Only in Non-Contact S17): 标定点坐标（27 点网格，固定） */}
        {isNonContact && (
          <div 
            className="rounded-lg border p-2 flex flex-col justify-between transition-colors shadow-sm overflow-hidden h-24"
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111722',
              borderColor: isLight ? '#cbd5e1' : '#1e293b',
            }}
          >
            <div className="text-[11px] font-bold text-slate-200 pb-1 border-b border-white/10 flex justify-between">
              <span>标定点坐标（27 点网格，固定）</span>
              <span className="text-[9px] text-slate-500 font-mono-num">3×3×3 网格</span>
            </div>
            <div className="flex-1 overflow-y-auto text-[10px] font-mono-num">
              <table className="w-full text-left">
                <thead className="text-slate-400">
                  <tr>
                    <th>#</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {NON_CONTACT_27_POINTS.slice(0, 9).map((p) => (
                    <tr key={p.index}>
                      <td className="text-slate-500">{p.index}</td>
                      <td>{p.x.toFixed(3)}</td>
                      <td>{p.y.toFixed(3)}</td>
                      <td>{p.z.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Main Content Row: Left Column (~260px) + Right Area (Page 1 or Page 2) */}
      <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
        {/* Left Column (~260px): 传感器测量数据 */}
        <div 
          className="w-64 shrink-0 rounded-lg border p-3 flex flex-col justify-between transition-colors shadow-sm overflow-y-auto"
          style={{
            backgroundColor: isLight ? '#ffffff' : '#111722',
            borderColor: isLight ? '#cbd5e1' : '#1e293b',
          }}
        >
          <div className="space-y-3">
            <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
              传感器测量数据
            </div>

            {/* Sub-section 1: 原始电压值 */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                原始电压值 (V):
              </span>
              <div className="space-y-1 font-mono-num text-xs">
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-amber-400 font-bold">U1:</span>
                  <span className="text-slate-200">{sensorData.u1.toFixed(4)} V</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-emerald-400 font-bold">U2:</span>
                  <span className="text-slate-200">{sensorData.u2.toFixed(4)} V</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-sky-400 font-bold">U3:</span>
                  <span className="text-slate-200">{sensorData.u3.toFixed(4)} V</span>
                </div>
              </div>
            </div>

            {/* Sub-section 2: 传感器值 */}
            <div className="pt-1.5 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                传感器值 (mm):
              </span>
              <div className="space-y-1 font-mono-num text-xs">
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-pink-400 font-bold">L1:</span>
                  <span className="text-slate-200">{sensorData.l1.toFixed(4)} mm</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-purple-400 font-bold">L2:</span>
                  <span className="text-slate-200">{sensorData.l2.toFixed(4)} mm</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/20">
                  <span className="text-cyan-400 font-bold">L3:</span>
                  <span className="text-slate-200">{sensorData.l3.toFixed(4)} mm</span>
                </div>
              </div>
            </div>

            {/* Sub-section 3: 确定原点值 */}
            <div className="pt-1.5 border-t border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                确定原点值 (mm):
              </span>
              <div className="space-y-1 font-mono-num text-xs">
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/30 border border-white/5">
                  <span className="text-slate-400">L1_0:</span>
                  <span className="text-emerald-400 font-bold">1.8600</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/30 border border-white/5">
                  <span className="text-slate-400">L2_0:</span>
                  <span className="text-emerald-400 font-bold">1.7921</span>
                </div>
                <div className="flex justify-between px-2 py-0.5 rounded bg-black/30 border border-white/5">
                  <span className="text-slate-400">L3_0:</span>
                  <span className="text-emerald-400 font-bold">1.8455</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={recordOrigin}
            className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>确定原点</span>
          </button>
        </div>

        {/* Right Area: Page 1 (S15 仪器校准安装) or Page 2 (S16/S17 仪器标定 2x2 网格) */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* =====================================================================
              PAGE 1: S15 仪器校准安装页
             ===================================================================== */}
          {calibSoftwarePage === 'calib-setup' && (
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
              {/* Three equal-width direction calibration cards in a row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Direction Card 1 */}
                <div 
                  className="rounded-lg border p-3 flex flex-col justify-between gap-3 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
                    校准点（0,2,0,0）实际测量坐标
                  </div>
                  <div className="space-y-2 text-xs font-mono-num">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">X1_0:</span>
                      <input
                        type="text"
                        value={p1Coords.x}
                        onChange={(e) => setP1Coords({ ...p1Coords, x: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Y1_0:</span>
                      <input
                        type="text"
                        value={p1Coords.y}
                        onChange={(e) => setP1Coords({ ...p1Coords, y: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Z1_0:</span>
                      <input
                        type="text"
                        value={p1Coords.z}
                        onChange={(e) => setP1Coords({ ...p1Coords, z: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('校准点（0,2,0,0）实际测量坐标已锁定')}
                    className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
                  >
                    确定
                  </button>
                </div>

                {/* Direction Card 2 */}
                <div 
                  className="rounded-lg border p-3 flex flex-col justify-between gap-3 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
                    校准点（0,0,2,0）实际测量坐标
                  </div>
                  <div className="space-y-2 text-xs font-mono-num">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">X1_0:</span>
                      <input
                        type="text"
                        value={p2Coords.x}
                        onChange={(e) => setP2Coords({ ...p2Coords, x: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Y1_0:</span>
                      <input
                        type="text"
                        value={p2Coords.y}
                        onChange={(e) => setP2Coords({ ...p2Coords, y: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Z1_0:</span>
                      <input
                        type="text"
                        value={p2Coords.z}
                        onChange={(e) => setP2Coords({ ...p2Coords, z: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('校准点（0,0,2,0）实际测量坐标已锁定')}
                    className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
                  >
                    确定
                  </button>
                </div>

                {/* Direction Card 3 */}
                <div 
                  className="rounded-lg border p-3 flex flex-col justify-between gap-3 shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
                    校准点（0,0,0,2）实际测量坐标
                  </div>
                  <div className="space-y-2 text-xs font-mono-num">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">X1_0:</span>
                      <input
                        type="text"
                        value={p3Coords.x}
                        onChange={(e) => setP3Coords({ ...p3Coords, x: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Y1_0:</span>
                      <input
                        type="text"
                        value={p3Coords.y}
                        onChange={(e) => setP3Coords({ ...p3Coords, y: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Z1_0:</span>
                      <input
                        type="text"
                        value={p3Coords.z}
                        onChange={(e) => setP3Coords({ ...p3Coords, z: e.target.value })}
                        className="w-24 px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-100 text-right font-bold"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('校准点（0,0,0,2）实际测量坐标已锁定')}
                    className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
                  >
                    确定
                  </button>
                </div>
              </div>

              {/* Slim Card: LC 力臂 (mm) */}
              <div 
                className="rounded-lg border p-3 flex items-center justify-between text-xs shadow-sm"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#111722',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                }}
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-slate-200">LC 力臂补偿值 (mm):</span>
                </div>
                <div className="flex items-center gap-4 font-mono-num">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">LC_Cx:</span>
                    <input
                      type="text"
                      value={lcCx}
                      onChange={(e) => setLcCx(e.target.value)}
                      className="w-20 px-2 py-0.5 rounded bg-black/20 border border-white/10 text-slate-100 text-center font-bold"
                    />
                    <span className="text-slate-500">mm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">LC_Cy:</span>
                    <input
                      type="text"
                      value={lcCy}
                      onChange={(e) => setLcCy(e.target.value)}
                      className="w-20 px-2 py-0.5 rounded bg-black/20 border border-white/10 text-slate-100 text-center font-bold"
                    />
                    <span className="text-slate-500">mm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              PAGE 2: S16 (接触式 2x2) 或 S17 (非接触式 2x2) 仪器标定页
             ===================================================================== */}
          {calibSoftwarePage === 'calib-workbench' && (
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2.5 min-h-0 overflow-hidden">
              {/* Card 1: 实时曲线 (L1/L2/L3, mm) */}
              <div className="h-full min-h-0">
                <OscilloscopeChart
                  title="实时曲线（L1/L2/L3，mm）"
                  yAxisLabel="mm"
                  yRange={[1.5, 2.1]}
                  data={displacementHistory}
                  channels={displacementChannels}
                />
              </div>

              {/* Card 2: 
                  If Contact (S16) -> 标定点坐标（6 点，固定）
                  If Non-Contact (S17) -> 逐点采集 (27 点，含归一化说明)
              */}
              {!isNonContact ? (
                // S16 Card 2: 标定点坐标 (6点固定)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>标定点坐标（6 点，固定）</span>
                    <span className="text-[10px] text-slate-500 font-mono-num">理论坐标</span>
                  </div>
                  <div className="flex-1 overflow-auto text-xs font-mono-num">
                    <table className="w-full text-left">
                      <thead className="text-[11px] text-slate-400 border-b border-white/5">
                        <tr>
                          <th className="py-1 px-2">序号</th>
                          <th className="py-1 px-2">X</th>
                          <th className="py-1 px-2">Y</th>
                          <th className="py-1 px-2">Z</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[11px]">
                        {CONTACT_CALIB_6_POINTS.map((p) => (
                          <tr key={p.index}>
                            <td className="py-1 px-2 text-slate-400 font-bold">{p.index}</td>
                            <td className="py-1 px-2 text-slate-200">{p.x.toFixed(3)}</td>
                            <td className="py-1 px-2 text-slate-200">{p.y.toFixed(3)}</td>
                            <td className="py-1 px-2 text-slate-200">{p.z.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // S17 Card 2: 逐点采集 (27 点)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>逐点采集（27 点网格）</span>
                    <span className="text-[10px] text-sky-400 font-mono-num">{collectedRows.length}/27 已采集</span>
                  </div>
                  <div className="flex-1 overflow-auto text-xs font-mono-num">
                    <table className="w-full text-left">
                      <thead className="text-[11px] text-slate-400 border-b border-white/5">
                        <tr>
                          <th className="py-1 px-2">序号</th>
                          <th className="py-1 px-2">L1 (mm)</th>
                          <th className="py-1 px-2">L2 (mm)</th>
                          <th className="py-1 px-2">L3 (mm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[11px]">
                        {collectedRows.map((r) => (
                          <tr key={r.index}>
                            <td className="py-1 px-2 text-slate-400 font-bold">{r.index}</td>
                            <td className="py-1 px-2 text-pink-400 font-semibold">{r.l1.toFixed(4)}</td>
                            <td className="py-1 px-2 text-purple-400 font-semibold">{r.l2.toFixed(4)}</td>
                            <td className="py-1 px-2 text-cyan-400 font-semibold">{r.l3.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[9px] text-slate-500 pt-1 border-t border-white/5 font-sans">
                    归一化显示：显示 mm 原始值（电压 0-4V 对应传感器量程 1~2mm）
                  </div>
                </div>
              )}

              {/* Card 3: 
                  If Contact (S16) -> 逐点采集 (6行)
                  If Non-Contact (S17) -> 标定参数 c0~c9 宽表横向滚动
              */}
              {!isNonContact ? (
                // S16 Card 3: 逐点采集 (6行)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>逐点采集（实测读数）</span>
                    <span className="text-[10px] text-sky-400 font-mono-num">{collectedRows.length}/6 点</span>
                  </div>
                  <div className="flex-1 overflow-auto text-xs font-mono-num">
                    <table className="w-full text-left">
                      <thead className="text-[11px] text-slate-400 border-b border-white/5">
                        <tr>
                          <th className="py-1 px-2">序号</th>
                          <th className="py-1 px-2">L1 (mm)</th>
                          <th className="py-1 px-2">L2 (mm)</th>
                          <th className="py-1 px-2">L3 (mm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[11px]">
                        {collectedRows.map((r) => (
                          <tr key={r.index}>
                            <td className="py-1 px-2 text-slate-400 font-bold">{r.index}</td>
                            <td className="py-1 px-2 text-pink-400 font-semibold">{r.l1.toFixed(4)}</td>
                            <td className="py-1 px-2 text-purple-400 font-semibold">{r.l2.toFixed(4)}</td>
                            <td className="py-1 px-2 text-cyan-400 font-semibold">{r.l3.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // S17 Card 3: 标定参数 (序号 | c0 ... c9 宽表横向滚动)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>标定参数（多项式系数 c0~c9 拟合矩阵）</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num">3行 × 11列</span>
                  </div>
                  <div className="flex-1 overflow-x-auto overflow-y-auto text-xs font-mono-num">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="text-[10px] text-slate-400 border-b border-white/5">
                        <tr>
                          <th className="py-1 px-2">轴</th>
                          <th className="py-1 px-2">c0</th>
                          <th className="py-1 px-2">c1</th>
                          <th className="py-1 px-2">c2</th>
                          <th className="py-1 px-2">c3</th>
                          <th className="py-1 px-2">c4</th>
                          <th className="py-1 px-2">c5</th>
                          <th className="py-1 px-2">c6</th>
                          <th className="py-1 px-2">c7</th>
                          <th className="py-1 px-2">c8</th>
                          <th className="py-1 px-2">c9</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[10px]">
                        {nonContactCoefficients.map((r) => (
                          <tr key={r.id}>
                            <td className="py-1 px-2 text-slate-400 font-bold">{r.id === 1 ? 'X' : r.id === 2 ? 'Y' : 'Z'}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c0.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c1.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c2.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c3.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c4.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c5.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c6.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c7.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c8.toFixed(4)}</td>
                            <td className="py-1 px-1.5 text-slate-200">{r.c9.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Card 4:
                  If Contact (S16) -> 标定参数 (序号 | a | b | c | d)
                  If Non-Contact (S17) -> 回代偏差 (残差散点图)
              */}
              {!isNonContact ? (
                // S16 Card 4: 标定参数 (a, b, c, d)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>标定参数（多项式系数 a/b/c/d）</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num">收敛判定: PASS</span>
                  </div>
                  <div className="flex-1 overflow-auto text-xs font-mono-num">
                    <table className="w-full text-left">
                      <thead className="text-[11px] text-slate-400 border-b border-white/5">
                        <tr>
                          <th className="py-1 px-2">序号</th>
                          <th className="py-1 px-2">a</th>
                          <th className="py-1 px-2">b</th>
                          <th className="py-1 px-2">c</th>
                          <th className="py-1 px-2">d</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[11px]">
                        {contactCoefficients.map((r) => (
                          <tr key={r.id}>
                            <td className="py-1 px-2 text-slate-400 font-bold">{r.id}</td>
                            <td className="py-1 px-2 text-slate-200">{r.a.toFixed(4)}</td>
                            <td className="py-1 px-2 text-slate-200">{r.b.toFixed(4)}</td>
                            <td className="py-1 px-2 text-slate-200">{r.c.toFixed(4)}</td>
                            <td className="py-1 px-2 text-slate-200">{r.d.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // S17 Card 4: 回代偏差 (残差图)
                <div 
                  className="rounded-lg border p-2.5 flex flex-col justify-between overflow-hidden shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200 flex justify-between">
                    <span>回代偏差（Residuals vs Point ID）</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num">残差: 0.0006 mm</span>
                  </div>
                  <InteractiveCurveBox className="flex-1 rounded border border-white/5 p-2 overflow-hidden min-h-[140px]">
                    <svg className="w-full h-full" viewBox="0 0 270 100">
                      <line x1="0" y1="50" x2="270" y2="50" stroke="rgba(255,255,255,0.2)" strokeDasharray="2 2" />
                      {Array.from({ length: 27 }, (_, i) => {
                        const cx = i * 10 + 5;
                        const cy = 50 + (Math.sin(i * 1.7) * 15 + (i % 2 === 0 ? 5 : -5));
                        return (
                          <g key={i}>
                            <circle cx={cx} cy={cy} r="2.5" fill="#38bdf8" />
                            <line x1={cx} y1="50" x2={cx} y2={cy} stroke="rgba(56, 189, 248, 0.4)" />
                          </g>
                        );
                      })}
                    </svg>
                  </InteractiveCurveBox>
                  <div className="text-[10px] text-slate-400 pt-1 flex justify-between font-mono-num">
                    <span>X: 点号 1 ~ 27</span>
                    <span>Y: 回代偏差 [-0.002 ~ +0.002 mm]</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Action Bar */}
      <div 
        className="p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 transition-colors shadow-sm"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="flex items-center gap-3">
          {/* 传感器量程 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">传感器量程:</span>
            <select
              value={sensorRange}
              onChange={(e) => setSensorRange(e.target.value)}
              className="px-2 py-0.5 rounded bg-black/20 border border-white/10 text-slate-200"
            >
              <option value="1 mm">1 mm</option>
              <option value="1.5 mm">1.5 mm</option>
              <option value="2 mm">2 mm</option>
            </select>
          </div>

          {/* Tab toggle buttons: 仪器校准安装 vs 仪器标定 */}
          <div className="inline-flex rounded-lg p-0.5 bg-black/30 border border-white/10">
            <button
              onClick={() => setCalibSoftwarePage('calib-setup')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                calibSoftwarePage === 'calib-setup'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              仪器校准安装 (S15)
            </button>
            <button
              onClick={() => setCalibSoftwarePage('calib-workbench')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                calibSoftwarePage === 'calib-workbench'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              仪器标定 ({isNonContact ? 'S17 27点' : 'S16 6点'})
            </button>
          </div>

          {/* 输出 NC 程序 */}
          <button
            onClick={handleExportNC}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>输出 NC 程序</span>
          </button>
        </div>

        {/* Right-aligned Group */}
        <div className="flex items-center gap-2">
          {/* 添加 */}
          <button
            onClick={handleAddCollectedPoint}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>添加</span>
          </button>

          {/* 计算标定参数 */}
          <button
            onClick={handleCalculateParams}
            className="flex items-center gap-1 px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>计算标定参数</span>
          </button>

          {/* 确定 (Green, disabled if not calculated) */}
          <button
            onClick={() => showToast('标定参数已确定并写入当前仪器出厂配置区！')}
            disabled={!isCalculated}
            className="flex items-center gap-1 px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>确定</span>
          </button>

          {/* 导出加密配置 */}
          <button
            onClick={handleExportEncryptedConfig}
            className="flex items-center gap-1 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <FileLock className="w-3.5 h-3.5" />
            <span>导出加密配置</span>
          </button>

          {/* 清除 */}
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/15 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清除</span>
          </button>
        </div>
      </div>
    </div>
  );
};
