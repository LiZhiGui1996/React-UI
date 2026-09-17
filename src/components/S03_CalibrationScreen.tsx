import React from 'react';
import { useApp } from '../context/AppContext';
import { getThemeTokens } from '../utils/themeStyles';
import { 
  Target, 
  CheckCircle2, 
  RotateCcw, 
  Compass, 
  ArrowRight, 
  AlertCircle,
  Check,
  Crosshair,
  Sliders,
  ShieldCheck,
  Layers
} from 'lucide-react';

export const S03_CalibrationScreen: React.FC = () => {
  const { 
    sensorData, 
    originRecorded, 
    originValues, 
    recordOrigin, 
    calibPointLocks, 
    lockCalibPoint, 
    resetCalibPoint, 
    setCurrentMainTab, 
    setWorkflowStepIndex,
    showToast,
    theme,
    lcArm,
    setLcArm,
  } = useApp();

  const isLight = theme === 'light-metrology';
  const tokens = getThemeTokens(theme);

  const allPointsLocked = calibPointLocks.p1.locked && calibPointLocks.p2.locked && calibPointLocks.p3.locked;

  const handleFinishCalibration = () => {
    if (!originRecorded) {
      showToast('请先确定原点！');
      return;
    }
    if (!allPointsLocked) {
      showToast('请先锁定全部三个校准点的球心偏差！');
      return;
    }
    showToast('校准完成！正在跳转至误差测量页面...');
    setWorkflowStepIndex(3);
    setTimeout(() => {
      setCurrentMainTab('error-measure');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-3 gap-3 overflow-y-auto select-none">
      {/* Two Main Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
        {/* Left Column: 传感器测量数据 & 确定原点 */}
        <div 
          className="rounded-lg border p-3 flex flex-col justify-between transition-colors shadow-sm"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <div>
            {/* Header */}
            <div 
              className="flex items-center justify-between pb-2 border-b mb-3"
              style={{ borderColor: tokens.dividerColor }}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                <h2 
                  className="text-xs md:text-sm font-bold tracking-wide font-sans"
                  style={{ color: tokens.titleColor }}
                >
                  传感器测量数据与基准原点
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono-num border font-medium ${
                originRecorded 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/40'
              }`}>
                {originRecorded ? '✓ 原点已记录' : '待确定原点'}
              </span>
            </div>

            {/* Sensor Displacement Digits L1, L2, L3 */}
            <div className="grid grid-cols-3 gap-2.5 mb-3.5">
              {[
                { label: 'L1', name: 'X轴位移', val: sensorData.l1, color: '#ec4899' },
                { label: 'L2', name: 'Y轴位移', val: sensorData.l2, color: '#8b5cf6' },
                { label: 'L3', name: 'Z轴位移', val: sensorData.l3, color: '#06b6d4' },
              ].map((s) => (
                <div 
                  key={s.label}
                  className="p-2.5 rounded-md border flex flex-col gap-1 transition-colors"
                  style={{
                    backgroundColor: tokens.subcardBg,
                    borderColor: tokens.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono" style={{ color: s.color }}>
                      {s.label}
                    </span>
                    <span className="text-[10px]" style={{ color: tokens.mutedColor }}>
                      {s.name}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1 mt-0.5">
                    <span className="text-lg font-bold font-mono-num tracking-tight" style={{ color: s.color }}>
                      {s.val.toFixed(4)}
                    </span>
                    <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
                      mm
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Spherical Center Coordinates X, Y, Z */}
            <div 
              className="p-3 rounded-lg border mb-3.5 transition-colors"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
              }}
            >
              <div className="text-xs font-semibold mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5" style={{ color: tokens.titleColor }}>
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>实时球心相对坐标 (几何模型合成)</span>
                </div>
                <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
                  单位: mm
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono-num text-xs">
                <div 
                  className="flex items-center justify-between p-2 rounded border"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.25)',
                    borderColor: tokens.borderColor,
                  }}
                >
                  <span className="font-bold text-sky-400 text-xs">X:</span>
                  <span className="text-sky-400 font-bold text-sm">
                    {sensorData.x >= 0 ? `+${sensorData.x.toFixed(4)}` : sensorData.x.toFixed(4)}
                  </span>
                </div>
                <div 
                  className="flex items-center justify-between p-2 rounded border"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.25)',
                    borderColor: tokens.borderColor,
                  }}
                >
                  <span className="font-bold text-emerald-400 text-xs">Y:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {sensorData.y >= 0 ? `+${sensorData.y.toFixed(4)}` : sensorData.y.toFixed(4)}
                  </span>
                </div>
                <div 
                  className="flex items-center justify-between p-2 rounded border"
                  style={{
                    backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.25)',
                    borderColor: tokens.borderColor,
                  }}
                >
                  <span className="font-bold text-amber-400 text-xs">Z:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {sensorData.z >= 0 ? `+${sensorData.z.toFixed(4)}` : sensorData.z.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Confirm Origin Button */}
            <button
              onClick={recordOrigin}
              className="w-full py-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{originRecorded ? '重新确定原点 (覆盖基准零位)' : '确定原点 (记录当前零位参考)'}</span>
            </button>
          </div>

          {/* Operation Steps Helper */}
          <div 
            className="mt-3 pt-2.5 border-t text-xs leading-relaxed"
            style={{ 
              borderColor: tokens.dividerColor,
              color: tokens.mutedColor 
            }}
          >
            <div 
              className="font-semibold mb-1 flex items-center gap-1 text-[11px]"
              style={{ color: tokens.titleColor }}
            >
              <AlertCircle className="w-3 h-3 text-sky-400" />
              <span>标定操作指引:</span>
            </div>
            <ol className="list-decimal list-inside space-y-0.5 text-[10px]" style={{ color: tokens.bodyColor }}>
              <li>装夹测量球并调整至测头三触点几何居中位置；</li>
              <li>点击【确定原点】按钮锁定基准零位参考；</li>
              <li>机床依次步进到三正交标定位置，分别点击对应行【确定】锁定球心偏差；</li>
              <li>确认下方 LC 力臂参数无误，点击【完成校准】进入正式误差测量。</li>
            </ol>
          </div>
        </div>

        {/* Right Column: 校准点确认 */}
        <div 
          className="rounded-lg border p-3 flex flex-col justify-between transition-colors shadow-sm"
          style={{
            backgroundColor: tokens.cardBg,
            borderColor: tokens.borderColor,
          }}
        >
          <div>
            <div 
              className="flex items-center justify-between pb-2 border-b mb-3"
              style={{ borderColor: tokens.dividerColor }}
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-sky-400" />
                <h2 
                  className="text-xs md:text-sm font-bold tracking-wide font-sans"
                  style={{ color: tokens.titleColor }}
                >
                  校准点确认 (锁定各轴球心偏差)
                </h2>
              </div>
              <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
                {allPointsLocked ? '✓ 3/3 全部已锁定' : '需全部锁定 (3点)'}
              </span>
            </div>

            {/* Three Calibration Rows */}
            <div className="flex flex-col gap-2.5">
              {[
                { key: 'p1' as const, name: '校准点 1 (0.2, 0, 0)', axis: 'X轴偏移', target: '+0.2000 mm' },
                { key: 'p2' as const, name: '校准点 2 (0, 0.2, 0)', axis: 'Y轴偏移', target: '+0.2000 mm' },
                { key: 'p3' as const, name: '校准点 3 (0, 0, 0.2)', axis: 'Z轴偏移', target: '+0.2000 mm' },
              ].map((row) => {
                const lockState = calibPointLocks[row.key];
                return (
                  <div
                    key={row.key}
                    className={`p-2.5 rounded-md border flex flex-col gap-2 transition-colors ${
                      lockState.locked
                        ? isLight 
                          ? 'bg-emerald-50/70 border-emerald-300' 
                          : 'bg-emerald-950/20 border-emerald-600/40'
                        : ''
                    }`}
                    style={!lockState.locked ? {
                      backgroundColor: tokens.subcardBg,
                      borderColor: tokens.borderColor,
                    } : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${lockState.locked ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span className="text-xs font-bold font-sans" style={{ color: tokens.titleColor }}>
                          {row.name}
                        </span>
                        <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
                          [{row.axis}]
                        </span>
                      </div>
                      {lockState.locked && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> 已锁定
                        </span>
                      )}
                    </div>

                    {/* Three Inputs X, Y, Z */}
                    <div className="grid grid-cols-3 gap-2">
                      <div 
                        className="flex items-center justify-between px-2 py-1 rounded border text-xs font-mono-num"
                        style={{
                          backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.3)',
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <span className="text-[10px]" style={{ color: tokens.mutedColor }}>X:</span>
                        <span className="font-bold" style={{ color: tokens.titleColor }}>
                          {lockState.x !== null ? lockState.x.toFixed(4) : '--'}
                        </span>
                      </div>
                      <div 
                        className="flex items-center justify-between px-2 py-1 rounded border text-xs font-mono-num"
                        style={{
                          backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.3)',
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <span className="text-[10px]" style={{ color: tokens.mutedColor }}>Y:</span>
                        <span className="font-bold" style={{ color: tokens.titleColor }}>
                          {lockState.y !== null ? lockState.y.toFixed(4) : '--'}
                        </span>
                      </div>
                      <div 
                        className="flex items-center justify-between px-2 py-1 rounded border text-xs font-mono-num"
                        style={{
                          backgroundColor: isLight ? '#ffffff' : 'rgba(0, 0, 0, 0.3)',
                          borderColor: tokens.borderColor,
                        }}
                      >
                        <span className="text-[10px]" style={{ color: tokens.mutedColor }}>Z:</span>
                        <span className="font-bold" style={{ color: tokens.titleColor }}>
                          {lockState.z !== null ? lockState.z.toFixed(4) : '--'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons per row */}
                    <div className="flex items-center justify-end gap-2 pt-0.5">
                      <button
                        onClick={() => lockCalibPoint(row.key)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          lockState.locked
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                        }`}
                      >
                        {lockState.locked ? '更新锁定' : '确定锁定'}
                      </button>
                      <button
                        onClick={() => resetCalibPoint(row.key)}
                        className="px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                        style={{
                          backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                          color: tokens.mutedColor,
                          border: `1px solid ${tokens.borderColor}`
                        }}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>重置</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LC 力臂 (mm) - Below Z-axis Calibration */}
            <div 
              className="mt-3 p-2.5 rounded-md border flex flex-col gap-2 transition-colors"
              style={{
                backgroundColor: tokens.subcardBg,
                borderColor: tokens.borderColor,
              }}
            >
              {/* Header with pill tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-bold tracking-wide" style={{ color: tokens.titleColor }}>
                    LC 力臂参数设定 (mm)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  刀长补偿基准
                </span>
              </div>

              {/* Two Input Controls Side-by-Side: LC_Cx and LC_Cy */}
              <div className="grid grid-cols-2 gap-3 items-center pt-0.5">
                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="lc-cx-input" 
                    className="text-xs font-semibold shrink-0"
                    style={{ color: tokens.bodyColor }}
                  >
                    LC_Cx:
                  </label>
                  <input
                    id="lc-cx-input"
                    type="number"
                    step="0.1"
                    value={lcArm.cx}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setLcArm((prev) => ({ ...prev, cx: val }));
                    }}
                    className={`flex-1 px-2.5 py-1 rounded border text-center font-bold font-mono-num text-xs outline-none transition-all ${tokens.inputClass}`}
                  />
                  <span className="text-[10px]" style={{ color: tokens.mutedColor }}>mm</span>
                </div>

                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="lc-cy-input" 
                    className="text-xs font-semibold shrink-0"
                    style={{ color: tokens.bodyColor }}
                  >
                    LC_Cy:
                  </label>
                  <input
                    id="lc-cy-input"
                    type="number"
                    step="0.1"
                    value={lcArm.cy}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setLcArm((prev) => ({ ...prev, cy: val }));
                    }}
                    className={`flex-1 px-2.5 py-1 rounded border text-center font-bold font-mono-num text-xs outline-none transition-all ${tokens.inputClass}`}
                  />
                  <span className="text-[10px]" style={{ color: tokens.mutedColor }}>mm</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="text-[10px] mt-2.5 p-2 rounded border"
            style={{
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(0, 0, 0, 0.2)',
              borderColor: tokens.borderColor,
              color: tokens.mutedColor,
            }}
          >
            提示：三正交基准点校准用于解算传感器各向灵敏度与坐标系偏角误差矩阵。
          </div>
        </div>
      </div>

      {/* Bottom Unified Status & Action Bar */}
      <div 
        className="rounded-lg border px-4 py-2.5 flex items-center justify-between gap-4 transition-colors shadow-xs shrink-0"
        style={{
          backgroundColor: tokens.cardBg,
          borderColor: tokens.borderColor,
        }}
      >
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>原点基准:</span>
            <span className={`font-semibold ${originRecorded ? 'text-emerald-400' : 'text-amber-400'}`}>
              {originRecorded ? '已就绪 (0, 0, 0)' : '未记录'}
            </span>
          </div>

          <div className="h-3 w-px" style={{ backgroundColor: tokens.dividerColor }} />

          <div className="flex items-center gap-1.5">
            <span style={{ color: tokens.mutedColor }}>标定点状态:</span>
            <span className={`font-semibold font-mono-num ${allPointsLocked ? 'text-emerald-400' : 'text-amber-400'}`}>
              {allPointsLocked ? '3/3 全部就绪' : `${[calibPointLocks.p1, calibPointLocks.p2, calibPointLocks.p3].filter(p => p.locked).length}/3 需锁定`}
            </span>
          </div>

          <div className="h-3 w-px" style={{ backgroundColor: tokens.dividerColor }} />

          <div className="flex items-center gap-1.5 font-mono-num text-[11px]">
            <span style={{ color: tokens.mutedColor }}>力臂补偿:</span>
            <span style={{ color: tokens.bodyColor }}>Cx={lcArm.cx} mm, Cy={lcArm.cy} mm</span>
          </div>
        </div>

        <button
          onClick={handleFinishCalibration}
          className="px-6 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-[0.99] shrink-0"
        >
          <span>完成校准 (进入误差测量)</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};

