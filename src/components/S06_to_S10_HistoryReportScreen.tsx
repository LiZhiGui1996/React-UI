import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HistorySubTab, HistoryRecordItem } from '../types';
import { InteractiveCurveBox } from './InteractiveCurveBox';
import { 
  INITIAL_HISTORY_RECORDS, 
  MOCK_DATABLOCK_RAW, 
  RAW_PARAMS_DATABLOCK_1_AND_2,
  RAW_DATABLOCK_3_AND_4,
  DEFAULT_GLOBAL_MEASURE,
  DEFAULT_MEASURE_DATA_POINTS 
} from '../data/mockData';
import { 
  History, 
  FileText, 
  Code, 
  TrendingUp, 
  ScatterChart, 
  Printer, 
  FolderOpen, 
  Download, 
  Trash2, 
  Copy, 
  Check, 
  FileCheck,
  Maximize2,
  Sliders,
  Table,
  RotateCw,
  Compass,
  Terminal,
  Info,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  Hash,
  Activity,
  FileCode2,
  BarChart3
} from 'lucide-react';

export const S06_to_S10_HistoryReportScreen: React.FC = () => {
  const { 
    historySubTab, 
    setHistorySubTab, 
    selectedRecord, 
    setSelectedRecord, 
    showToast,
    theme
  } = useApp();

  const isLight = theme === 'light-metrology';

  const [records, setRecords] = useState<HistoryRecordItem[]>(INITIAL_HISTORY_RECORDS);
  const [recordPath, setRecordPath] = useState('D:\\R-test\\Records');
  const [copied, setCopied] = useState(false);
  const [paramsViewMode, setParamsViewMode] = useState<'structured' | 'raw'>('structured');
  const [copiedParams, setCopiedParams] = useState(false);
  const [dataBlockViewMode, setDataBlockViewMode] = useState<'inspector' | 'raw34' | 'rawAll'>('inspector');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [copiedDataBlock34, setCopiedDataBlock34] = useState(false);
  const [copiedAllDataBlock, setCopiedAllDataBlock] = useState(false);

  // Sub navigation tabs
  const SUB_NAV_TABS: Array<{ id: HistorySubTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'records', label: '历史记录', icon: History },
    { id: 'params', label: '测量参数信息', icon: FileText },
    { id: 'datablock', label: '检测数据', icon: Code },
    { id: 'raw-analysis', label: '原始数据分析', icon: TrendingUp },
    { id: 'error-analysis', label: '误差分析图示', icon: ScatterChart },
    { id: 'export-pdf', label: '导出报告', icon: Printer },
  ];

  const handleSelectRecord = (record: HistoryRecordItem) => {
    setSelectedRecord(record);
    showToast(`已载入报告：${record.fileName}`);
    setHistorySubTab('params');
  };

  const handleDeleteRecord = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecords(records.filter((r) => r.id !== id));
    showToast('该条历史记录已移除');
  };

  const handleCopyDataBlock = () => {
    navigator.clipboard?.writeText(MOCK_DATABLOCK_RAW);
    setCopied(true);
    showToast('DATABLOCK 原始数据块已复制到剪贴板');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    showToast(`正在生成高精度测量报告 PDF: [${selectedRecord.machineId}_${selectedRecord.axisName}_METROLOGY_REPORT.pdf] ... 已完成下载！`);
  };

  const currentMachineSettings = selectedRecord.machineSettings || {
    machineName: '',
    machineStr: '',
    machineType: '',
    machineDateTime: selectedRecord.measureTime || '2019-03-08 16:13:28',
    machineOperator: selectedRecord.operator || '',
    machineAxis: '主轴旋转',
    workAxis: selectedRecord.axisName || 'A轴',
  };

  const currentRMatrix = selectedRecord.rMatrix || {
    r1: [0.099266, -0.172505, -0.000381],
    r2: [-0.000110, -0.002194, 0.198544],
    r3: [-0.177277, -0.100535, -0.004868],
  };

  const formatMatrixNum = (n: number) => {
    const fixed = Math.abs(n).toFixed(6);
    if (n < 0) return `-${fixed}`;
    return `0.${fixed.split('.')[1] || '000000'}`;
  };

  const rawParamsBlockText = `% DATABLOCK 1
% GLOBAL MACHINE SETTINGS
% TYPE STRING STRING
% NAME MACHINE VALUE
% SEPARATOR ~
% DIM 7*2
MACHINE NAME~${currentMachineSettings.machineName}
MACHINE STR~${currentMachineSettings.machineStr}
MACHINE TYPE~${currentMachineSettings.machineType}
MACHINE DATE_TIME~${currentMachineSettings.machineDateTime}
MACHINE OPERATOR~${currentMachineSettings.machineOperator}
MACHINE AXIS~${currentMachineSettings.machineAxis}
WORK AXIS~${currentMachineSettings.workAxis}

% DATABLOCK 2
% GLOBAL R_MATRIX
% TYPE DOUBLE DOUBLE DOUBLE
% NAME r1 r2 r3
% SEPARATOR \t
% DIM 3*3
${formatMatrixNum(currentRMatrix.r1[0])}\t${currentRMatrix.r1[1].toFixed(6)}\t${currentRMatrix.r1[2].toFixed(6)}
${currentRMatrix.r2[0].toFixed(6)}\t${currentRMatrix.r2[1].toFixed(6)}\t${formatMatrixNum(currentRMatrix.r2[2])}
${currentRMatrix.r3[0].toFixed(6)}\t${currentRMatrix.r3[1].toFixed(6)}\t${currentRMatrix.r3[2].toFixed(6)}`;

  const handleCopyParamsBlock = () => {
    navigator.clipboard?.writeText(rawParamsBlockText);
    setCopiedParams(true);
    showToast('DATABLOCK 1 & 2 测量参数文本已复制到剪贴板');
    setTimeout(() => setCopiedParams(false), 2000);
  };

  const currentGlobalMeasure = selectedRecord.globalMeasure || DEFAULT_GLOBAL_MEASURE;
  const currentMeasurePoints = selectedRecord.measureDataPoints || DEFAULT_MEASURE_DATA_POINTS;

  const rawDataBlock3And4Text = `% DATABLOCK 3
% GLOBAL MEASURE
% TYPE STRING DOUBLE
% NAME STATIC INPUT
% SEPARATOR ~
% DIM 5*2
START ANGLE~${currentGlobalMeasure.startAngle}
FINISHED ANGLE~${currentGlobalMeasure.finishedAngle}
THRESHOLD VALUE~${currentGlobalMeasure.thresholdValue}
INTERVAL ANGLE~${currentGlobalMeasure.intervalAngle}
MEASURE POINT NUMBER~${currentGlobalMeasure.measurePointNumber}

% DATABLOCK 4
% GLOBAL MEASURE DATA
% TYPE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE
% NAME ANGLE\tX\tY\tZ\tdX\tdY\tdZ
% SEPARATOR \\t
% DIM ${currentMeasurePoints.length}*7
${currentMeasurePoints.map(p => `${p.angle.toFixed(2)}\t${p.x.toFixed(10)}\t${p.y.toFixed(10)}\t${p.z.toFixed(10)}\t${p.dx.toFixed(10)}\t${p.dy.toFixed(10)}\t${p.dz.toFixed(10)}`).join('\n')}`;

  const rawFullDataBlockText = `${rawParamsBlockText}

${rawDataBlock3And4Text}
% END OF FILE`;

  const handleCopyDataBlock34 = () => {
    navigator.clipboard?.writeText(rawDataBlock3And4Text);
    setCopiedDataBlock34(true);
    showToast('DATABLOCK 3 & 4 检查数据文本已复制到剪贴板');
    setTimeout(() => setCopiedDataBlock34(false), 2000);
  };

  const handleCopyAllDataBlock = () => {
    navigator.clipboard?.writeText(rawFullDataBlockText);
    setCopiedAllDataBlock(true);
    showToast('全量 DATABLOCK (1~4) 完整文本已复制到剪贴板');
    setTimeout(() => setCopiedAllDataBlock(false), 2000);
  };

  const handleDownloadDatFile = () => {
    const blob = new Blob([rawFullDataBlockText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedRecord.fileName || 'RTEST_MEASURE_DATA.dat';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`已导出原始数采文件: ${selectedRecord.fileName || 'RTEST_MEASURE_DATA.dat'}`);
  };

  const handleDownloadPointsCsv = () => {
    const header = 'INDEX,ANGLE[deg],X[mm],Y[mm],Z[mm],dX[mm],dY[mm],dZ[mm],dR[mm],STATUS\n';
    const rows = currentMeasurePoints.map(p => {
      const dR = Math.sqrt(p.dx * p.dx + p.dy * p.dy + p.dz * p.dz).toFixed(6);
      const status = Number(dR) > currentGlobalMeasure.thresholdValue ? 'OVER_THRESHOLD' : 'PASS';
      return `${p.index},${p.angle.toFixed(2)},${p.x.toFixed(10)},${p.y.toFixed(10)},${p.z.toFixed(10)},${p.dx.toFixed(10)},${p.dy.toFixed(10)},${p.dz.toFixed(10)},${dR},${status}`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRecord.fileName?.replace('.dat', '') || 'MEASURE_DATA'}_POINTS.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已导出测点数据表 CSV');
  };

  const measurePointsStats = useMemo(() => {
    if (!currentMeasurePoints || currentMeasurePoints.length === 0) return null;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    let maxAbsDX = 0, maxAbsDY = 0, maxAbsDZ = 0, maxAbsDR = 0;
    let overThresholdCount = 0;

    const enriched = currentMeasurePoints.map(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;

      const absDX = Math.abs(p.dx);
      const absDY = Math.abs(p.dy);
      const absDZ = Math.abs(p.dz);
      const dR = Math.sqrt(p.dx * p.dx + p.dy * p.dy + p.dz * p.dz);

      if (absDX > maxAbsDX) maxAbsDX = absDX;
      if (absDY > maxAbsDY) maxAbsDY = absDY;
      if (absDZ > maxAbsDZ) maxAbsDZ = absDZ;
      if (dR > maxAbsDR) maxAbsDR = dR;

      const isOver = dR > currentGlobalMeasure.thresholdValue;
      if (isOver) overThresholdCount++;

      return {
        ...p,
        dR,
        isOver,
      };
    });

    return {
      points: enriched,
      count: currentMeasurePoints.length,
      rangeX: maxX - minX,
      rangeY: maxY - minY,
      rangeZ: maxZ - minZ,
      minX, maxX,
      minY, maxY,
      minZ, maxZ,
      maxAbsDX,
      maxAbsDY,
      maxAbsDZ,
      maxAbsDR,
      overThresholdCount,
    };
  }, [currentMeasurePoints, currentGlobalMeasure]);

  return (
    <div className="flex-1 flex overflow-hidden select-none">
      {/* Second-level Vertical Navigation Rail */}
      <div 
        className="w-40 shrink-0 border-r py-3 px-2 flex flex-col gap-1 transition-colors"
        style={{
          backgroundColor: isLight ? '#f1f5f9' : '#0c1017',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="px-2 py-1 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          报告导航
        </div>

        {SUB_NAV_TABS.map((tab) => {
          const isActive = historySubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setHistorySubTab(tab.id)}
              className={`px-2.5 py-2 rounded text-xs font-medium flex items-center gap-2 text-left transition-all ${
                isActive
                  ? isLight
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40 shadow-sm'
                  : isLight
                    ? 'text-slate-600 hover:bg-slate-200/60'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}

        {/* Selected record badge at bottom of rail */}
        <div className="mt-auto p-2 rounded bg-black/20 border border-white/5 text-[10px]">
          <span className="text-slate-500 block">当前载入:</span>
          <span className="font-mono-num text-sky-400 font-semibold truncate block">
            {selectedRecord.axisName} · {selectedRecord.machineId}
          </span>
          <span className="text-slate-500 block text-[9px] truncate">
            {selectedRecord.measureTime}
          </span>
        </div>
      </div>

      {/* Main Content Sub-Panels */}
      <div className="flex-1 flex flex-col p-3 overflow-hidden">
        {/* =========================================================================
            S06: 历史记录子页 (History Records Table)
           ========================================================================= */}
        {historySubTab === 'records' && (
          <div className="flex-1 flex flex-col gap-2.5 min-h-0">
            {/* Top Path Row */}
            <div 
              className="p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs shrink-0"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="text-slate-400 font-medium">历史记录清单路径:</span>
                <input
                  type="text"
                  value={recordPath}
                  onChange={(e) => setRecordPath(e.target.value)}
                  className="flex-1 max-w-md px-2 py-1 rounded bg-black/20 border border-white/10 text-slate-200 font-mono-num text-xs"
                />
                <button
                  onClick={() => showToast('已打开系统目录选择对话框')}
                  className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>浏览...</span>
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono-num">
                共找到 {records.length} 条测量记录
              </span>
            </div>

            {/* Hint text */}
            <div className="text-[11px] text-slate-500 px-1 flex items-center justify-between shrink-0">
              <span>💡 双击记录加载测量报告；右侧可快速点击「加载」或删除</span>
              <span>支持 CSV / DAT / TXT 格式自动解析</span>
            </div>

            {/* 6-Column Data Table */}
            <div 
              className="flex-1 rounded-lg border overflow-auto min-h-0 shadow-sm"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead 
                  className="sticky top-0 border-b text-[11px] font-bold text-slate-300 select-none z-10"
                  style={{
                    backgroundColor: isLight ? '#e2e8f0' : '#141c28',
                    borderColor: isLight ? '#cbd5e1' : '#222f42',
                  }}
                >
                  <tr>
                    <th className="py-2 px-3 w-14 text-center">序号</th>
                    <th className="py-2 px-3">转动轴名称</th>
                    <th className="py-2 px-3">测量座是否旋转</th>
                    <th className="py-2 px-3">测量时间</th>
                    <th className="py-2 px-3">测量人员</th>
                    <th className="py-2 px-3 text-right">测量报告</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono-num text-[11px]">
                  {records.map((r) => {
                    const isSelected = selectedRecord.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onDoubleClick={() => handleSelectRecord(r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? isLight ? 'bg-sky-100 text-sky-900 font-medium' : 'bg-sky-500/15 text-sky-200'
                            : r.id % 2 === 0
                              ? isLight ? 'bg-white' : 'bg-slate-900/30'
                              : isLight ? 'bg-slate-50' : 'bg-slate-800/20'
                        } hover:bg-sky-500/10`}
                      >
                        <td className="py-2 px-3 text-center text-slate-400">{r.id}</td>
                        <td className="py-2 px-3 font-semibold text-slate-200">{r.axisName}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            r.isRotated ? 'bg-indigo-500/15 text-indigo-300' : 'bg-slate-500/15 text-slate-400'
                          }`}>
                            {r.isRotated ? '是' : '否'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-300">{r.measureTime}</td>
                        <td className="py-2 px-3 text-slate-300">{r.operator}</td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSelectRecord(r)}
                              className="px-2.5 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-medium transition-colors"
                            >
                              加载报告
                            </button>
                            <button
                              onClick={(e) => handleDeleteRecord(r.id, e)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="删除记录"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            S07: 历史测量报告 · 测量参数信息 (DATABLOCK 1 & 2)
           ========================================================================= */}
        {historySubTab === 'params' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto pr-1">
            {/* 顶栏信息与快捷操作 */}
            <div 
              className="px-4 py-3 rounded-lg border flex items-center justify-between gap-4 shrink-0 transition-colors"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      历史测量报告 · 测量参数信息
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                      DATABLOCK 已校核
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-0.5">
                    <span className={`${isLight ? 'text-slate-500' : 'text-slate-300'} font-mono-num`}>
                      当前报告文件: <strong className={isLight ? 'text-slate-800' : 'text-white'}>{selectedRecord.fileName}</strong>
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className={`${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                      测量工况: <strong className="text-sky-400 font-medium">{currentMachineSettings.machineAxis}</strong> / <strong className="text-amber-400 font-medium">{currentMachineSettings.workAxis}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 动作区：视图切换与复制 */}
              <div className="flex items-center gap-2">
                <div className={`flex rounded border p-0.5 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-900 border-white/10'}`}>
                  <button
                    onClick={() => setParamsViewMode('structured')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all font-medium ${
                      paramsViewMode === 'structured'
                        ? isLight
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'bg-sky-600 text-white font-semibold'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    <span>结构化参数面板</span>
                  </button>
                  <button
                    onClick={() => setParamsViewMode('raw')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-all font-medium ${
                      paramsViewMode === 'raw'
                        ? isLight
                          ? 'bg-white text-sky-600 shadow-sm'
                          : 'bg-sky-600 text-white font-semibold'
                        : isLight
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>原始 DATABLOCK 文本</span>
                  </button>
                </div>

                <button
                  onClick={handleCopyParamsBlock}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border transition-colors ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                  }`}
                  title="复制参数数据块"
                >
                  {copiedParams ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                  <span>{copiedParams ? '已复制参数块' : '复制 DATABLOCK 1&2'}</span>
                </button>
              </div>
            </div>

            {/* 视图展现 */}
            {paramsViewMode === 'structured' ? (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
                {/* 模块 1: DATABLOCK 1 · GLOBAL MACHINE SETTINGS (全局机床设置参数) */}
                <div 
                  className="xl:col-span-6 rounded-lg border p-4 flex flex-col gap-3 transition-colors shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        % DATABLOCK 1 · GLOBAL MACHINE SETTINGS
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                      DIM 7*2 | SEPARATOR ~
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    全局机床环境参数定义 (GLOBAL MACHINE SETTINGS)。数据类型: <code className="font-mono text-sky-400">STRING STRING</code>
                  </p>

                  {/* 7 项键值参数表格 */}
                  <div className={`rounded border overflow-hidden ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
                    <table className="w-full text-xs text-left">
                      <thead 
                        className="text-[11px] font-semibold border-b"
                        style={{
                          backgroundColor: isLight ? '#f8fafc' : '#161f2e',
                          borderColor: isLight ? '#e2e8f0' : '#1e293b',
                          color: isLight ? '#475569' : '#cbd5e1',
                        }}
                      >
                        <tr>
                          <th className="py-2 px-3 w-10 text-center font-mono-num">#</th>
                          <th className="py-2 px-3 w-48">参数字段 (MACHINE)</th>
                          <th className="py-2 px-3">参数值 (VALUE)</th>
                          <th className="py-2 px-3 w-20 text-right">属性</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {/* 1. MACHINE NAME */}
                        <tr className={`${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-slate-500">01</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-sky-400">MACHINE NAME</td>
                          <td className={`py-2.5 px-3 font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {currentMachineSettings.machineName || <span className="text-slate-500 italic">-- (未指定/空)</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">系统</span>
                          </td>
                        </tr>

                        {/* 2. MACHINE STR */}
                        <tr className={`${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-slate-500">02</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-sky-400">MACHINE STR</td>
                          <td className={`py-2.5 px-3 font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {currentMachineSettings.machineStr || <span className="text-slate-500 italic">-- (未指定/空)</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">标识</span>
                          </td>
                        </tr>

                        {/* 3. MACHINE TYPE */}
                        <tr className={`${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-slate-500">03</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-sky-400">MACHINE TYPE</td>
                          <td className={`py-2.5 px-3 font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {currentMachineSettings.machineType || <span className="text-slate-500 italic">-- (未指定/空)</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">机型</span>
                          </td>
                        </tr>

                        {/* 4. MACHINE DATE_TIME */}
                        <tr className={`bg-sky-500/5 ${isLight ? 'hover:bg-sky-50/60' : 'hover:bg-sky-500/10'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-sky-400 font-bold">04</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-sky-300">MACHINE DATE_TIME</td>
                          <td className="py-2.5 px-3 font-mono-num font-bold text-white text-sm" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                            {currentMachineSettings.machineDateTime}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-medium">测量时刻</span>
                          </td>
                        </tr>

                        {/* 5. MACHINE OPERATOR */}
                        <tr className={`${isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-slate-500">05</td>
                          <td className="py-2.5 px-3 font-mono font-medium text-sky-400">MACHINE OPERATOR</td>
                          <td className={`py-2.5 px-3 font-medium ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            {currentMachineSettings.machineOperator || <span className="text-slate-500 italic">-- (未指定/空)</span>}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">人员</span>
                          </td>
                        </tr>

                        {/* 6. MACHINE AXIS */}
                        <tr className={`bg-sky-500/5 ${isLight ? 'hover:bg-sky-50/60' : 'hover:bg-sky-500/10'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-sky-400 font-bold">06</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-sky-300">MACHINE AXIS</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs bg-sky-500/20 text-white border border-sky-400/40 font-bold">
                              <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                              {currentMachineSettings.machineAxis}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 font-medium">主轴模式</span>
                          </td>
                        </tr>

                        {/* 7. WORK AXIS */}
                        <tr className={`bg-amber-500/5 ${isLight ? 'hover:bg-amber-50/60' : 'hover:bg-amber-500/10'}`}>
                          <td className="py-2.5 px-3 text-center font-mono-num text-amber-400 font-bold">07</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">WORK AXIS</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold font-mono">
                              <Compass className="w-3.5 h-3.5 text-amber-400" />
                              {currentMachineSettings.workAxis}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-medium">工作转轴</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-2.5 rounded bg-slate-500/5 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>键值分隔符: <code className="font-mono text-sky-400">~ (Tilde)</code></span>
                    <span>数据维度: <code className="font-mono text-slate-300">7 行 × 2 列</code></span>
                    <span>校准规范: <span className="text-slate-300">ISO 230-1 / 230-7</span></span>
                  </div>
                </div>

                {/* 模块 2: DATABLOCK 2 · GLOBAL R_MATRIX (全局空间旋转变换矩阵) */}
                <div 
                  className="xl:col-span-6 rounded-lg border p-4 flex flex-col gap-3 transition-colors shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        % DATABLOCK 2 · GLOBAL R_MATRIX
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      DIM 3*3 | SEPARATOR \t
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-tight">
                    空间姿态方向余弦变换矩阵 (GLOBAL R_MATRIX)。数据类型: <code className="font-mono text-emerald-400">DOUBLE DOUBLE DOUBLE</code>
                  </p>

                  {/* 3×3 科学计算矩阵视图 */}
                  <div className={`p-4 rounded border relative ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#090d15] border-white/10'
                  }`}>
                    {/* Matrix visual brackets */}
                    <div className="flex items-stretch justify-center gap-2">
                      {/* Left bracket */}
                      <div className="w-2.5 border-l-2 border-t-2 border-b-2 border-sky-400/80 rounded-l"></div>

                      {/* Matrix Grid */}
                      <div className="flex-1 py-1">
                        {/* Matrix Column Headers */}
                        <div className="grid grid-cols-3 text-center mb-2 pb-1 border-b border-white/10 text-[11px] font-mono font-semibold text-slate-400">
                          <div>r1 (X分量)</div>
                          <div>r2 (Y分量)</div>
                          <div>r3 (Z分量)</div>
                        </div>

                        {/* Rows */}
                        <div className="space-y-2">
                          {/* Row 1 */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {formatMatrixNum(currentRMatrix.r1[0])}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r1[1].toFixed(6)}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r1[2].toFixed(6)}
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r2[0].toFixed(6)}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r2[1].toFixed(6)}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {formatMatrixNum(currentRMatrix.r2[2])}
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r3[0].toFixed(6)}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r3[1].toFixed(6)}
                            </div>
                            <div className="py-2.5 px-2 rounded bg-sky-500/10 border border-sky-500/20 font-mono-num font-bold text-xs" style={{ color: isLight ? '#0f172a' : '#ffffff' }}>
                              {currentRMatrix.r3[2].toFixed(6)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right bracket */}
                      <div className="w-2.5 border-r-2 border-t-2 border-b-2 border-sky-400/80 rounded-r"></div>
                    </div>
                  </div>

                  {/* 矩阵解析特征指示 */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`}>
                      <div className="text-[11px] text-slate-400">行列式 det(R)</div>
                      <div className="text-sm font-bold font-mono-num text-emerald-400 mt-0.5">
                        +0.003920 <span className="text-[10px] text-slate-400 font-normal">(非奇异满秩)</span>
                      </div>
                    </div>

                    <div className={`p-2.5 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-white/5'}`}>
                      <div className="text-[11px] text-slate-400">矩阵维度及制表对齐</div>
                      <div className="text-sm font-bold font-mono-num text-sky-400 mt-0.5">
                        3 × 3 <span className="text-[10px] text-slate-400 font-normal">(\t Tab 对齐)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>该矩阵用于将 R-test 三维探针实测位移矢量 (dx, dy, dz) 空间刚体旋转映射至机床 A 轴回转坐标系中，是解算五轴几何与位置误差的核心变换阵。</span>
                  </div>
                </div>
              </div>
            ) : (
              /* 原始 DATABLOCK 1 & 2 文本代码块视图 */
              <div 
                className="rounded-lg border p-4 flex flex-col gap-3 transition-colors shadow-sm"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#111722',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                }}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span className={`text-xs font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>
                      %% DATABLOCK 1 & DATABLOCK 2 原始文本解析流
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono-num">
                    标准: R-test Metrology Standard v1.0 ASCII
                  </span>
                </div>

                <div 
                  className="p-4 rounded-md font-mono-num text-xs overflow-x-auto shadow-inner select-text border"
                  style={{
                    backgroundColor: isLight ? '#1e293b' : '#070a0e',
                    color: '#38bdf8',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <pre className="leading-relaxed whitespace-pre font-mono-num text-sm">
                    {rawParamsBlockText}
                  </pre>
                </div>
              </div>
            )}

            {/* 底部导航联动按钮 */}
            <div 
              className="p-3.5 rounded-lg border flex items-center justify-between gap-3 shrink-0 transition-colors"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>参数加载完整，可直接进行数据追溯或进入下阶段高精度拟合</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setHistorySubTab('datablock')}
                  className="px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>查看完整检测数据 (S08 DATABLOCK)</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('raw-analysis')}
                  className={`px-3.5 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>前往拟合曲线分析 (S09)</span>
                </button>
                <button
                  onClick={() => setHistorySubTab('error-analysis')}
                  className={`px-3.5 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                  }`}
                >
                  <ScatterChart className="w-3.5 h-3.5 text-amber-400" />
                  <span>误差分析图示 (S10)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            S08: 检查数据 (DATABLOCK 3 & 4 Inspector & Data Table)
           ========================================================================= */}
        {historySubTab === 'datablock' && (
          <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-hidden">
            {/* Top Toolbar */}
            <div 
              className="flex items-center justify-between px-3 py-2 rounded-lg border shrink-0 transition-colors shadow-sm"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              {/* Left: Title & File Badge */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-tight" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>
                      历史测量报告 · 检查数据 (DATABLOCK 3 &amp; 4)
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-num font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                      {selectedRecord.fileName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {currentMachineSettings.workAxis} • 10 采样点
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    工业数采标准格式 · 静态输入测量参数 (MEASURE) 与 7通道连续实测数据点集 (MEASURE DATA)
                  </span>
                </div>
              </div>

              {/* Center: View Switcher */}
              <div className={`flex items-center p-0.5 rounded-lg border text-xs ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-black/40 border-white/10'}`}>
                <button
                  onClick={() => setDataBlockViewMode('inspector')}
                  className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    dataBlockViewMode === 'inspector'
                      ? isLight
                        ? 'bg-white text-sky-700 shadow-sm font-semibold'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>结构化检查面板</span>
                </button>

                <button
                  onClick={() => setDataBlockViewMode('raw34')}
                  className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    dataBlockViewMode === 'raw34'
                      ? isLight
                        ? 'bg-white text-sky-700 shadow-sm font-semibold'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DATABLOCK 3&amp;4 原文</span>
                </button>

                <button
                  onClick={() => setDataBlockViewMode('rawAll')}
                  className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    dataBlockViewMode === 'rawAll'
                      ? isLight
                        ? 'bg-white text-sky-700 shadow-sm font-semibold'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>全量数据块 (1~4)</span>
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={dataBlockViewMode === 'rawAll' ? handleCopyAllDataBlock : handleCopyDataBlock34}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition-colors"
                  title="复制数据块文本到剪贴板"
                >
                  {copiedDataBlock34 || copiedAllDataBlock ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span>
                    {copiedDataBlock34 || copiedAllDataBlock
                      ? '已复制到剪贴板'
                      : dataBlockViewMode === 'rawAll'
                        ? '复制全量数据块'
                        : '复制 DATABLOCK 3&4'}
                  </span>
                </button>

                <button
                  onClick={handleDownloadPointsCsv}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 transition-colors"
                  title="导出 10 采样测点 CSV 表格"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>导出 CSV</span>
                </button>

                <button
                  onClick={handleDownloadDatFile}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-sm transition-colors"
                  title="下载 .dat 原始数采数据文件"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>导出 .dat 文件</span>
                </button>
              </div>
            </div>

            {/* View Mode 1: 结构化检查面板 (Structured Inspector) */}
            {dataBlockViewMode === 'inspector' && (
              <div className="flex-1 flex flex-col gap-2.5 min-h-0 overflow-y-auto pr-1">
                {/* 1. DATABLOCK 3: GLOBAL MEASURE (STATIC INPUT) */}
                <div 
                  className="rounded-lg border p-3 transition-colors shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  {/* Card Title & Protocol Badges */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold text-slate-200">
                        % DATABLOCK 3 · 静态输入测量参数 (GLOBAL MEASURE)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono-num text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5 text-amber-300">
                        TYPE: STRING DOUBLE
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5 text-sky-300">
                        NAME: STATIC INPUT
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5">
                        SEPARATOR: ~
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 font-bold border border-sky-500/20">
                        DIM: 5*2
                      </span>
                    </div>
                  </div>

                  {/* 5-Item Parameter Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {/* 1. START ANGLE */}
                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-mono-num">START ANGLE</span>
                        <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">起始角度</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono-num text-sky-400">
                          {currentGlobalMeasure.startAngle.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-num">°</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">主轴反向极限采样基准位</span>
                    </div>

                    {/* 2. FINISHED ANGLE */}
                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-mono-num">FINISHED ANGLE</span>
                        <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">终止角度</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono-num text-sky-400">
                          {currentGlobalMeasure.finishedAngle.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-num">°</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">扇形扫描终止位置</span>
                    </div>

                    {/* 3. THRESHOLD VALUE */}
                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex flex-col justify-between border-amber-500/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-amber-300 font-mono-num">THRESHOLD VALUE</span>
                        <span className="text-[9px] px-1 rounded bg-amber-500/10 text-amber-300">超差阈值</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono-num text-amber-400">
                          {currentGlobalMeasure.thresholdValue.toFixed(4)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-num">mm</span>
                        <span className="text-[10px] text-amber-300/80 font-mono-num ml-1">(3.0 µm)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">ISO 230 几何公差极限容限</span>
                    </div>

                    {/* 4. INTERVAL ANGLE */}
                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-mono-num">INTERVAL ANGLE</span>
                        <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">步进间隔</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono-num text-emerald-400">
                          {currentGlobalMeasure.intervalAngle.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-num">°</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">等距高密度角位移步长</span>
                    </div>

                    {/* 5. MEASURE POINT NUMBER */}
                    <div className="p-2.5 rounded-lg bg-black/20 border border-white/5 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 font-mono-num">MEASURE POINT NUMBER</span>
                        <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">测点总数</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono-num text-indigo-400">
                          {currentGlobalMeasure.measurePointNumber}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-num">点 (100% 采集)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">扇区 45° 测量完整性校验通过</span>
                    </div>
                  </div>
                </div>

                {/* 2. DATABLOCK 4: GLOBAL MEASURE DATA (TABLE & KPIS) */}
                <div 
                  className="rounded-lg border p-3 flex flex-col gap-2.5 transition-colors shadow-sm"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-sky-400" />
                      <h3 className="text-xs font-bold text-slate-200">
                        % DATABLOCK 4 · 全局实测数据点集 (GLOBAL MEASURE DATA)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono-num text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5 text-indigo-300">
                        TYPE: DOUBLE × 7
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5 text-sky-300">
                        NAME: ANGLE · X · Y · Z · dX · dY · dZ
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/5">
                        SEPARATOR: \t (Tab)
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                        DIM: 10*7
                      </span>
                    </div>
                  </div>

                  {/* Summary KPI Strip */}
                  {measurePointsStats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono-num">
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">测点总数:</span>
                        <span className="text-slate-200 font-bold text-xs">{measurePointsStats.count} 组采样</span>
                      </div>
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">X向极差 (ΔX):</span>
                        <span className="text-rose-400 font-semibold">{measurePointsStats.rangeX.toFixed(6)} mm</span>
                      </div>
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Y向极差 (ΔY):</span>
                        <span className="text-emerald-400 font-semibold">{measurePointsStats.rangeY.toFixed(6)} mm</span>
                      </div>
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">Z向极差 (ΔZ):</span>
                        <span className="text-sky-400 font-semibold">{measurePointsStats.rangeZ.toFixed(6)} mm</span>
                      </div>
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">空间最大绝对偏移:</span>
                        <span className="text-amber-400 font-bold">{measurePointsStats.maxAbsDY.toFixed(6)} mm</span>
                      </div>
                      <div className="p-2 rounded bg-black/20 border border-white/5">
                        <span className="text-slate-400 text-[10px] block">阈值校验 (0.003mm):</span>
                        <span className={measurePointsStats.overThresholdCount > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                          {measurePointsStats.overThresholdCount > 0 ? `${measurePointsStats.overThresholdCount} 点需精修拟合` : '全部在容差带内'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 10-Row High Precision Data Table */}
                  <div className="rounded-lg border border-white/10 overflow-hidden shadow-inner bg-black/20">
                    <div className="overflow-x-auto max-h-72">
                      <table className="w-full text-[11px] font-mono-num text-left border-collapse">
                        <thead className="sticky top-0 z-10 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-white/10 bg-slate-900/90 backdrop-blur">
                          <tr>
                            <th className="py-2 px-2.5 w-10 text-center">#</th>
                            <th className="py-2 px-3 text-sky-300">角度 ANGLE (°)</th>
                            <th className="py-2 px-3 text-rose-300">X 坐标 (mm)</th>
                            <th className="py-2 px-3 text-emerald-300">Y 坐标 (mm)</th>
                            <th className="py-2 px-3 text-sky-300">Z 坐标 (mm)</th>
                            <th className="py-2 px-3 text-rose-300/90">dX 偏差 (mm)</th>
                            <th className="py-2 px-3 text-emerald-300/90">dY 偏差 (mm)</th>
                            <th className="py-2 px-3 text-sky-300/90">dZ 偏差 (mm)</th>
                            <th className="py-2 px-3 text-amber-300">|dR| 空间偏差</th>
                            <th className="py-2 px-3 text-center">状态</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {currentMeasurePoints.map((pt, idx) => {
                            const isSelected = selectedPointIndex === idx;
                            const dR = Math.sqrt(pt.dx * pt.dx + pt.dy * pt.dy + pt.dz * pt.dz);
                            const isOver = dR > currentGlobalMeasure.thresholdValue;

                            return (
                              <tr 
                                key={pt.index || idx}
                                onClick={() => setSelectedPointIndex(isSelected ? null : idx)}
                                className={`cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-sky-500/20 text-white font-semibold' 
                                    : 'hover:bg-white/5 text-slate-300'
                                }`}
                              >
                                <td className="py-1.5 px-2.5 text-center text-slate-500 font-sans text-[10px]">
                                  {String(idx + 1).padStart(2, '0')}
                                </td>
                                <td className="py-1.5 px-3 text-sky-300 font-bold whitespace-nowrap">
                                  {pt.angle.toFixed(2)}°
                                </td>
                                <td className="py-1.5 px-3 text-slate-200 whitespace-nowrap">
                                  {pt.x >= 0 ? `+${pt.x.toFixed(10)}` : pt.x.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 text-slate-200 whitespace-nowrap">
                                  {pt.y >= 0 ? `+${pt.y.toFixed(10)}` : pt.y.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 text-slate-200 whitespace-nowrap">
                                  {pt.z >= 0 ? `+${pt.z.toFixed(10)}` : pt.z.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 text-rose-300 whitespace-nowrap">
                                  {pt.dx >= 0 ? `+${pt.dx.toFixed(10)}` : pt.dx.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 text-emerald-300 whitespace-nowrap">
                                  {pt.dy >= 0 ? `+${pt.dy.toFixed(10)}` : pt.dy.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 text-sky-300 whitespace-nowrap">
                                  {pt.dz >= 0 ? `+${pt.dz.toFixed(10)}` : pt.dz.toFixed(10)}
                                </td>
                                <td className="py-1.5 px-3 font-semibold text-amber-300 whitespace-nowrap">
                                  {dR.toFixed(6)} mm
                                </td>
                                <td className="py-1.5 px-3 text-center whitespace-nowrap">
                                  {isOver ? (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                      超差 ({(dR / currentGlobalMeasure.thresholdValue).toFixed(1)}x)
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                      合格
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Real-Time Geometric Trajectory Chart (dX, dY, dZ across -90° to -45°) */}
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-bold text-slate-200">
                          测点空间偏移走势速览 (10点随转角漂移曲线 · 步距 5.00°)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono-num">
                        <span className="flex items-center gap-1.5 text-rose-400">
                          <span className="w-2.5 h-1 bg-rose-500 rounded" />
                          dX(θ)
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="w-2.5 h-1 bg-emerald-500 rounded" />
                          dY(θ)
                        </span>
                        <span className="flex items-center gap-1.5 text-sky-400">
                          <span className="w-2.5 h-1 bg-sky-500 rounded" />
                          dZ(θ)
                        </span>
                        <span className="flex items-center gap-1 text-amber-400/80">
                          <span className="w-2.5 h-0.5 border-t border-dashed border-amber-400" />
                          ±0.003mm 阈值线
                        </span>
                      </div>
                    </div>

                    {/* SVG Trajectory Canvas with Zoom & Pan */}
                    <InteractiveCurveBox height="144px" className="rounded border border-white/5 p-2">
                      <svg className="w-full h-full" viewBox="0 0 760 140" preserveAspectRatio="none">
                        {/* Zero baseline (0.000000 mm) */}
                        <line x1="45" y1="92" x2="740" y2="92" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                        
                        {/* Upper & Lower Threshold envelope (±0.003mm) */}
                        <line x1="45" y1="87" x2="740" y2="87" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="2 2" />
                        <line x1="45" y1="97" x2="740" y2="97" stroke="rgba(251, 191, 36, 0.4)" strokeDasharray="2 2" />

                        {/* Y-axis ticks labels */}
                        <text x="5" y="24" fill="#94a3b8" fontSize="9" fontFamily="monospace">+0.040</text>
                        <text x="5" y="95" fill="#94a3b8" fontSize="9" fontFamily="monospace">0.000</text>
                        <text x="5" y="132" fill="#94a3b8" fontSize="9" fontFamily="monospace">-0.015</text>

                        {/* Polyline for dX */}
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={currentMeasurePoints.map((pt, i) => {
                            const x = 50 + (i / 9) * 680;
                            const y = 20 + ((0.045 - pt.dx) / 0.060) * 110;
                            return `${x},${y}`;
                          }).join(' ')}
                        />

                        {/* Polyline for dY */}
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={currentMeasurePoints.map((pt, i) => {
                            const x = 50 + (i / 9) * 680;
                            const y = 20 + ((0.045 - pt.dy) / 0.060) * 110;
                            return `${x},${y}`;
                          }).join(' ')}
                        />

                        {/* Polyline for dZ */}
                        <polyline
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={currentMeasurePoints.map((pt, i) => {
                            const x = 50 + (i / 9) * 680;
                            const y = 20 + ((0.045 - pt.dz) / 0.060) * 110;
                            return `${x},${y}`;
                          }).join(' ')}
                        />

                        {/* Circles for Points */}
                        {currentMeasurePoints.map((pt, i) => {
                          const x = 50 + (i / 9) * 680;
                          const yX = 20 + ((0.045 - pt.dx) / 0.060) * 110;
                          const yY = 20 + ((0.045 - pt.dy) / 0.060) * 110;
                          const yZ = 20 + ((0.045 - pt.dz) / 0.060) * 110;
                          const isSelected = selectedPointIndex === i;

                          return (
                            <g key={i}>
                              <circle cx={x} cy={yX} r={isSelected ? "4.5" : "2.5"} fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                              <circle cx={x} cy={yY} r={isSelected ? "4.5" : "2.5"} fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                              <circle cx={x} cy={yZ} r={isSelected ? "4.5" : "2.5"} fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                            </g>
                          );
                        })}
                      </svg>

                      {/* X-axis Angle Labels */}
                      <div className="absolute bottom-0 left-12 right-6 flex justify-between text-[9px] font-mono-num text-slate-400">
                        {currentMeasurePoints.map((pt, i) => (
                          <span 
                            key={i} 
                            onClick={() => setSelectedPointIndex(i)}
                            className={`cursor-pointer hover:text-sky-300 transition-colors ${
                              selectedPointIndex === i ? 'text-sky-300 font-bold underline' : ''
                            }`}
                          >
                            {pt.angle.toFixed(0)}°
                          </span>
                        ))}
                      </div>
                    </InteractiveCurveBox>
                  </div>

                  {/* Navigation Quick Link Buttons */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => setHistorySubTab('params')}
                      className={`px-3 py-1.5 rounded border font-medium transition-colors flex items-center gap-1.5 ${
                        isLight 
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                          : 'bg-white/5 hover:bg-white/10 text-white border-white/15'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>查看测量参数信息 (DATABLOCK 1&amp;2)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setHistorySubTab('raw-analysis')}
                        className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow transition-colors flex items-center gap-1.5"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>前往原始数据分析 (S09)</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setHistorySubTab('error-analysis')}
                        className="px-3.5 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow transition-colors flex items-center gap-1.5"
                      >
                        <ScatterChart className="w-3.5 h-3.5" />
                        <span>查看误差分析图示 (S10)</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode 2: 原始 DATABLOCK 3 & 4 文本 */}
            {dataBlockViewMode === 'raw34' && (
              <div 
                className="flex-1 rounded-lg border p-3 font-mono-num text-xs overflow-auto shadow-inner select-text relative"
                style={{
                  backgroundColor: isLight ? '#1e293b' : '#070a0e',
                  color: '#38bdf8',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-slate-400 font-sans">
                  <span>%% DATABLOCK 3 &amp; 4 原生数采文本数据块 (10 测点 · 制表符 Tab 分隔)</span>
                  <button
                    onClick={handleCopyDataBlock34}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-200 text-xs transition-colors"
                  >
                    {copiedDataBlock34 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{copiedDataBlock34 ? '已复制' : '复制文本'}</span>
                  </button>
                </div>
                <pre className="leading-relaxed whitespace-pre font-mono-num text-[12px]">
                  {rawDataBlock3And4Text}
                </pre>
              </div>
            )}

            {/* View Mode 3: 全量数据块 (1~4) */}
            {dataBlockViewMode === 'rawAll' && (
              <div 
                className="flex-1 rounded-lg border p-3 font-mono-num text-xs overflow-auto shadow-inner select-text relative"
                style={{
                  backgroundColor: isLight ? '#1e293b' : '#070a0e',
                  color: '#38bdf8',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                }}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[11px] text-slate-400 font-sans">
                  <span>%% 完整工业数采规范文件 (包含 DATABLOCK 1, 2, 3, 4 全部区块)</span>
                  <button
                    onClick={handleCopyAllDataBlock}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-200 text-xs transition-colors"
                  >
                    {copiedAllDataBlock ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{copiedAllDataBlock ? '已复制' : '复制全量文本'}</span>
                  </button>
                </div>
                <pre className="leading-relaxed whitespace-pre font-mono-num text-[12px]">
                  {rawFullDataBlockText}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            S09: 原始数据分析 (Statistical Values + Curve Fitting)
           ========================================================================= */}
        {historySubTab === 'raw-analysis' && (
          <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
            {/* Left Column: 统计值 (~200px) */}
            <div 
              className="w-56 shrink-0 rounded-lg border p-3 flex flex-col gap-3 transition-colors shadow-sm overflow-y-auto"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
                统计值
              </div>

              {/* Max X, Y, Z */}
              <div className="space-y-1.5 text-xs font-mono-num">
                <span className="text-[11px] font-sans text-slate-400 block font-semibold">最大值:</span>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-rose-400 font-bold">最大-x:</span>
                  <span className="text-slate-200">+0.0123 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-emerald-400 font-bold">最大-y:</span>
                  <span className="text-slate-200">-0.0087 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-sky-400 font-bold">最大-z:</span>
                  <span className="text-slate-200">+0.0056 mm</span>
                </div>
              </div>

              {/* Min X, Y, Z */}
              <div className="space-y-1.5 text-xs font-mono-num pt-1 border-t border-white/5">
                <span className="text-[11px] font-sans text-slate-400 block font-semibold">最小值:</span>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-rose-400 font-bold">最小-x:</span>
                  <span className="text-slate-200">-0.0091 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-emerald-400 font-bold">最小-y:</span>
                  <span className="text-slate-200">-0.0142 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-sky-400 font-bold">最小-z:</span>
                  <span className="text-slate-200">-0.0048 mm</span>
                </div>
              </div>

              {/* Range Sx, Sy, Sz */}
              <div className="space-y-1.5 text-xs font-mono-num pt-1 border-t border-white/5">
                <span className="text-[11px] font-sans text-slate-400 block font-semibold">全量程极差 (Sx/Sy/Sz):</span>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-rose-300 font-bold">Sx:</span>
                  <span className="text-slate-200 font-bold">0.0214 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-emerald-300 font-bold">Sy:</span>
                  <span className="text-slate-200 font-bold">0.0055 mm</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded bg-black/20 border border-white/5">
                  <span className="text-sky-300 font-bold">Sz:</span>
                  <span className="text-slate-200 font-bold">0.0104 mm</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dominant Fitted Curves Chart */}
            <div 
              className="flex-1 rounded-lg border p-3 flex flex-col min-w-0 transition-colors shadow-sm overflow-hidden"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    球心坐标偏移量随第一转动轴角度变化拟合曲线
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono-num">
                    X轴: 第一转动轴角度 [0° ~ 360°] • Y轴: 球心坐标偏移量 [mm] (多项式拟合)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono-num">
                  <span className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-1 bg-rose-500 rounded" /> X拟合
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-1 bg-emerald-500 rounded" /> Y拟合
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="w-2.5 h-1 bg-sky-500 rounded" /> Z拟合
                  </span>
                </div>
              </div>

              {/* Custom SVG Fitting Curve Graph with Zoom & Pan */}
              <InteractiveCurveBox className="flex-1 rounded border border-white/5 overflow-hidden p-4 min-h-[260px]">
                <svg className="w-full h-full" viewBox="0 0 720 300" preserveAspectRatio="none">
                  {/* Horizontal grid zero line */}
                  <line x1="0" y1="150" x2="720" y2="150" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                  
                  {/* Fitted Curve X (Red, Sine-like) */}
                  <path
                    d="M 0 150 C 120 70, 240 70, 360 150 C 480 230, 600 230, 720 150"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                  />
                  {/* Fitted Curve Y (Green, Cosine-like) */}
                  <path
                    d="M 0 100 C 180 180, 360 210, 540 120 C 630 80, 680 90, 720 100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  {/* Fitted Curve Z (Blue, Second Harmonic) */}
                  <path
                    d="M 0 150 Q 90 110, 180 150 T 360 150 T 540 150 T 720 150"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />

                  {/* Sample Discrete Measured Scatter Points */}
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map((deg, i) => {
                    const cx = (deg / 360) * 720;
                    const cyX = 150 - Math.sin((deg * Math.PI) / 180) * 80;
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cyX} r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      </g>
                    );
                  })}
                </svg>

                {/* Bottom Angle Axis Labels */}
                <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[10px] font-mono-num text-slate-500 pointer-events-none">
                  <span>0°</span>
                  <span>60°</span>
                  <span>120°</span>
                  <span>180°</span>
                  <span>240°</span>
                  <span>300°</span>
                  <span>360°</span>
                </div>
              </InteractiveCurveBox>
            </div>
          </div>
        )}

        {/* =========================================================================
            S10 (Part 1): 误差分析图示
           ========================================================================= */}
        {historySubTab === 'error-analysis' && (
          <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
            {/* Left Column: 误差分析值 & 倾斜角度 */}
            <div 
              className="w-64 shrink-0 rounded-lg border p-3 flex flex-col gap-3 transition-colors shadow-sm overflow-y-auto"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="pb-1.5 border-b border-white/10 text-xs font-bold text-slate-200">
                误差分析值
              </div>

              <div className="space-y-2 text-xs font-mono-num">
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="text-slate-400 text-[10px] block font-sans">XOB(轴线偏移量 X):</span>
                  <span className="text-emerald-400 font-bold text-sm">+0.0087 mm</span>
                </div>
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="text-slate-400 text-[10px] block font-sans">XOB(轴线偏移量 Y):</span>
                  <span className="text-emerald-400 font-bold text-sm">+0.0031 mm</span>
                </div>
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="text-slate-400 text-[10px] block font-sans">XOB(轴线垂直度 Z-X):</span>
                  <span className="text-amber-400 font-bold text-sm">-0.0022 mm</span>
                </div>
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="text-slate-400 text-[10px] block font-sans">XOB(轴线垂直度 Z-Y):</span>
                  <span className="text-amber-400 font-bold text-sm">+0.0018 mm</span>
                </div>
              </div>

              {/* Sub-section: 倾斜角度 */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-slate-300 mb-2">倾斜角度 (Tilt Angles)</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                  <div className="p-2 rounded bg-black/20 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">δCx:</span>
                    <span className="text-sky-400 font-semibold">+0.0012°</span>
                  </div>
                  <div className="p-2 rounded bg-black/20 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">δCy:</span>
                    <span className="text-sky-400 font-semibold">-0.0008°</span>
                  </div>
                  <div className="p-2 rounded bg-black/20 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">δAz:</span>
                    <span className="text-indigo-400 font-semibold">+0.0021°</span>
                  </div>
                  <div className="p-2 rounded bg-black/20 border border-white/5">
                    <span className="text-slate-400 text-[10px] block">δAy:</span>
                    <span className="text-indigo-400 font-semibold">-0.0015°</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-2 rounded bg-sky-500/10 border border-sky-500/20 text-[11px] text-slate-400">
                按 ISO 230-7 计算完成，机床各向误差处于合格公差带内 (&lt;0.015mm)。
              </div>
            </div>

            {/* Right Column: Three X-Y Relation Charts (2 Top, 1 Centered Bottom) */}
            <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto">
              {/* Top Row: Chart 1 & Chart 2 */}
              <div className="grid grid-cols-2 gap-3 h-56">
                {/* Chart 1: X-Y 图示 (X方向偏移-角度) */}
                <div 
                  className="rounded-lg border p-2.5 flex flex-col"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="text-[11px] font-bold text-slate-300 pb-1 border-b border-white/5 flex items-center justify-between">
                    <span>图1: X 方向偏移-角度关系</span>
                    <span className="text-[10px] text-rose-400 font-mono-num">ΔX(θ)</span>
                  </div>
                  <InteractiveCurveBox className="flex-1 rounded mt-1 border border-white/5 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                      <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.1)" />
                      <circle cx="100" cy="50" r="35" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                      <path d="M 65 50 Q 80 20 100 20 T 135 50 T 100 80 Z" fill="none" stroke="#f87171" strokeWidth="1.8" />
                    </svg>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono-num text-slate-500 pointer-events-none">
                      偏心极坐标
                    </span>
                  </InteractiveCurveBox>
                </div>

                {/* Chart 2: Y 方向偏移-角度关系 */}
                <div 
                  className="rounded-lg border p-2.5 flex flex-col"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#111722',
                    borderColor: isLight ? '#cbd5e1' : '#1e293b',
                  }}
                >
                  <div className="text-[11px] font-bold text-slate-300 pb-1 border-b border-white/5 flex items-center justify-between">
                    <span>图2: Y 方向偏移-角度关系</span>
                    <span className="text-[10px] text-emerald-400 font-mono-num">ΔY(θ)</span>
                  </div>
                  <InteractiveCurveBox className="flex-1 rounded mt-1 border border-white/5 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                      <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.1)" />
                      <path d="M 20 50 Q 60 15 100 50 T 180 50" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                    <span className="absolute bottom-1 right-2 text-[9px] font-mono-num text-slate-500 pointer-events-none">
                      相位差 90°
                    </span>
                  </InteractiveCurveBox>
                </div>
              </div>

              {/* Bottom Centered Chart: Z 方向偏移-角度 */}
              <div 
                className="rounded-lg border p-3 flex flex-col flex-1 min-h-[160px]"
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#111722',
                  borderColor: isLight ? '#cbd5e1' : '#1e293b',
                }}
              >
                <div className="text-[11px] font-bold text-slate-300 pb-1 border-b border-white/5 flex items-center justify-between">
                  <span>图3: Z 方向轴线倾角与垂直度偏移综合关系 (居中主图)</span>
                  <span className="text-[10px] text-sky-400 font-mono-num">ΔZ(θ) 轴向跳动</span>
                </div>
                <InteractiveCurveBox className="flex-1 rounded mt-2 border border-white/5 overflow-hidden min-h-[140px]">
                  <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                    <path
                      d="M 20 60 C 80 30, 140 90, 200 60 C 260 30, 320 90, 380 60"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[9px] font-mono-num text-slate-500 pointer-events-none">
                    <span>0°</span>
                    <span>90°</span>
                    <span>180°</span>
                    <span>270°</span>
                    <span>360°</span>
                  </div>
                </InteractiveCurveBox>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            S10 (Part 2): 导出报告 (A4 Paginated PDF Layout Preview)
           ========================================================================= */}
        {historySubTab === 'export-pdf' && (
          <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
            {/* Top Bar: Note + Green Primary Export Button */}
            <div 
              className="p-3 rounded-lg border flex items-center justify-between shrink-0"
              style={{
                backgroundColor: isLight ? '#ffffff' : '#111722',
                borderColor: isLight ? '#cbd5e1' : '#1e293b',
              }}
            >
              <div className="text-xs text-slate-400">
                下方为测量报告 PDF 版式预览，点击右上角按钮导出 PDF 文件 (A4国际标准版式)
              </div>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>导出报告 (PDF)</span>
              </button>
            </div>

            {/* A4 Paginated Preview Canvas (Scrollable Horizontal or Grid) */}
            <div 
              className="flex-1 rounded-lg border p-6 overflow-x-auto overflow-y-auto flex gap-6 items-start shadow-inner justify-center"
              style={{
                backgroundColor: isLight ? '#cbd5e1' : '#070a0f',
                borderColor: isLight ? '#94a3b8' : '#1e293b',
              }}
            >
              {/* Page 1: Report Cover */}
              <div className="w-[320px] h-[452px] bg-white text-slate-900 rounded shadow-2xl p-6 flex flex-col justify-between shrink-0 border border-slate-300">
                <div>
                  <div className="text-[10px] font-bold text-sky-700 tracking-wider uppercase mb-1">
                    R-TEST METROLOGY SYSTEM
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    数控机床空间精度检测报告
                  </h2>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Precision Inspection Report (ISO 230-1 / ISO 230-7)
                  </div>
                  <div className="w-12 h-1 bg-sky-600 my-4" />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">机床编号:</span>
                    <span className="font-bold font-mono">{selectedRecord.machineId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">机床型号:</span>
                    <span className="font-semibold">{selectedRecord.machineModel}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">检测轴线:</span>
                    <span className="font-bold text-sky-700">{selectedRecord.axisName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">检测人员:</span>
                    <span>{selectedRecord.operator}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">检测日期:</span>
                    <span className="font-mono">{selectedRecord.measureTime}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">评定结论:</span>
                    <span className="font-bold text-emerald-600">合格 (PASS)</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between text-[9px] text-slate-400">
                  <span>R-test Metrology Workstation</span>
                  <span>第 1 页 / 共 4 页</span>
                </div>
              </div>

              {/* Page 2: Data Tables */}
              <div className="w-[320px] h-[452px] bg-white text-slate-900 rounded shadow-2xl p-5 flex flex-col justify-between shrink-0 border border-slate-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b pb-1 mb-2">
                    测点空间坐标与误差数据表
                  </h3>
                  <table className="w-full text-[8px] border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="p-1">#</th>
                        <th className="p-1">角度</th>
                        <th className="p-1">X(mm)</th>
                        <th className="p-1">Y(mm)</th>
                        <th className="p-1">dx</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {[
                        ['01', '0°', '12.5013', '-0.0210', '+0.0013'],
                        ['02', '20°', '12.4977', '-0.0198', '-0.0023'],
                        ['03', '40°', '12.5030', '-0.0205', '+0.0030'],
                        ['04', '60°', '12.5064', '-0.0182', '+0.0064'],
                        ['05', '80°', '12.5085', '-0.0151', '+0.0085'],
                        ['06', '100°', '12.5072', '-0.0134', '+0.0072'],
                        ['07', '120°', '12.5038', '-0.0128', '+0.0038'],
                        ['08', '140°', '12.4986', '-0.0140', '-0.0014'],
                        ['09', '160°', '12.4931', '-0.0175', '-0.0069'],
                        ['10', '180°', '12.4909', '-0.0210', '-0.0091'],
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-1 font-bold text-slate-600">{row[0]}</td>
                          <td className="p-1">{row[1]}</td>
                          <td className="p-1">{row[2]}</td>
                          <td className="p-1">{row[3]}</td>
                          <td className="p-1 font-semibold text-sky-700">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t flex justify-between text-[9px] text-slate-400">
                  <span>原始采样点清单</span>
                  <span>第 2 页 / 共 4 页</span>
                </div>
              </div>

              {/* Page 3: Analysis Charts */}
              <div className="w-[320px] h-[452px] bg-white text-slate-900 rounded shadow-2xl p-5 flex flex-col justify-between shrink-0 border border-slate-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b pb-1 mb-2">
                    数据拟合分析图
                  </h3>
                  <div className="h-32 border border-slate-200 rounded p-1 bg-slate-50 mb-3">
                    <div className="text-[8px] text-slate-500 font-mono mb-1">球心轨迹拟合曲线 (X/Y/Z)</div>
                    <svg className="w-full h-24" viewBox="0 0 200 80">
                      <path d="M 10 40 Q 60 10 100 40 T 190 40" fill="none" stroke="#ef4444" strokeWidth="2" />
                      <path d="M 10 30 Q 80 50 140 25 T 190 35" fill="none" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="text-[9px] space-y-1 bg-slate-100 p-2 rounded">
                    <div className="font-bold text-slate-700">极值统计:</div>
                    <div className="flex justify-between font-mono"><span>最大偏差:</span><span>+0.0123 mm</span></div>
                    <div className="flex justify-between font-mono"><span>最小偏差:</span><span>-0.0091 mm</span></div>
                    <div className="flex justify-between font-mono"><span>全量程极差 Sx:</span><span>0.0214 mm</span></div>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between text-[9px] text-slate-400">
                  <span>多项式回归与残差</span>
                  <span>第 3 页 / 共 4 页</span>
                </div>
              </div>

              {/* Page 4: Error Diagrams */}
              <div className="w-[320px] h-[452px] bg-white text-slate-900 rounded shadow-2xl p-5 flex flex-col justify-between shrink-0 border border-slate-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 border-b pb-1 mb-2">
                    轴线综合几何误差图示
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="h-24 border border-slate-200 rounded p-1 bg-slate-50 flex flex-col justify-between">
                      <span className="text-[8px] text-slate-500">XOB 偏移极坐标</span>
                      <svg className="w-full h-16" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="25" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        <ellipse cx="42" cy="38" rx="20" ry="18" fill="none" stroke="#0284c7" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="h-24 border border-slate-200 rounded p-1 bg-slate-50 flex flex-col justify-between">
                      <span className="text-[8px] text-slate-500">垂直度摆动</span>
                      <svg className="w-full h-16" viewBox="0 0 80 80">
                        <line x1="40" y1="10" x2="40" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="38" y1="10" x2="42" y2="70" stroke="#f59e0b" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-[9px] space-y-1 bg-slate-100 p-2 rounded">
                    <div className="font-bold text-slate-700">几何公差判定:</div>
                    <div className="flex justify-between font-mono"><span>XOB(轴线偏移):</span><span>0.0087 mm</span></div>
                    <div className="flex justify-between font-mono"><span>XOB(垂直度):</span><span>-0.0022 mm</span></div>
                    <div className="flex justify-between font-mono"><span>倾角 δCx:</span><span>+0.0012°</span></div>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-between text-[9px] text-slate-400">
                  <span>报告签字与封签</span>
                  <span>第 4 页 / 共 4 页</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
