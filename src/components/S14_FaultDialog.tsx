import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertOctagon, AlertTriangle, X } from 'lucide-react';

export const S14_FaultDialog: React.FC = () => {
  const { faultDialog, closeFaultDialog, triggerFaultDialog, showToast, theme } = useApp();
  const isLight = theme === 'light-metrology';

  if (!faultDialog.isOpen) return null;

  const isFatal = faultDialog.severity === 'FATAL';

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-[1px] flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[440px] rounded-xl border shadow-2xl overflow-hidden flex flex-col transition-all"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#131822',
          borderColor: isFatal ? '#ef4444' : '#f59e0b',
          boxShadow: isFatal 
            ? '0 0 30px rgba(239, 68, 68, 0.25)' 
            : '0 0 30px rgba(245, 158, 11, 0.25)',
        }}
      >
        {/* Header with 3px accent line and icon */}
        <div 
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isFatal 
              ? 'bg-rose-950/40 border-rose-500/30 text-rose-400' 
              : 'bg-amber-950/40 border-amber-500/30 text-amber-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${isFatal ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
              {isFatal ? (
                <AlertOctagon className="w-7 h-7 stroke-[2] animate-bounce" />
              ) : (
                <AlertTriangle className="w-7 h-7 stroke-[2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-wide uppercase font-mono">
                {isFatal ? 'FATAL FAULT 严重故障' : 'Error Detected 运行告警'}
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-num">
                ISO 230 DAQ SAFETY INTERLOCK
              </span>
            </div>
          </div>

          <button
            onClick={closeFaultDialog}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: Six Label / Value Rows */}
        <div className="p-4 flex flex-col gap-2.5 text-xs">
          <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400 font-medium shrink-0 w-24">故障码:</span>
            <span className="font-bold font-mono-num text-rose-400 text-right">
              {faultDialog.code}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400 font-medium shrink-0 w-24">模块:</span>
            <span className="font-semibold text-slate-200 text-right">
              {faultDialog.module}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400 font-medium shrink-0 w-24">设备时间:</span>
            <span className="font-mono-num text-slate-300 text-right">
              {faultDialog.deviceTime}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400 font-medium shrink-0 w-24">详情:</span>
            <span className="text-slate-200 text-right leading-snug">
              {faultDialog.detail}
            </span>
          </div>

          <div className="flex items-start justify-between border-b border-white/5 pb-1.5">
            <span className="text-slate-400 font-medium shrink-0 w-24">可能原因:</span>
            <span className="text-slate-300 text-right leading-snug">
              {faultDialog.cause}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <span className="text-slate-400 font-medium shrink-0 w-24">排查修复:</span>
            <span className="text-sky-300 font-medium text-right leading-snug">
              {faultDialog.solution}
            </span>
          </div>
        </div>

        {/* Footer with severity switch and Acknowledge Button */}
        <div className="px-4 py-3 bg-black/30 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-slate-500">演示切换:</span>
            <button
              onClick={() => triggerFaultDialog('FATAL')}
              className={`px-1.5 py-0.5 rounded ${isFatal ? 'bg-rose-500/30 text-rose-300 font-bold' : 'text-slate-400'}`}
            >
              FATAL (红)
            </button>
            <button
              onClick={() => triggerFaultDialog('Error')}
              className={`px-1.5 py-0.5 rounded ${!isFatal ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-slate-400'}`}
            >
              Error (黄)
            </button>
          </div>

          <button
            onClick={() => {
              closeFaultDialog();
              showToast('故障报警已确认 (Acknowledge)，系统安全挂起解除');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-md transition-colors cursor-pointer ${
              isFatal ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
            }`}
          >
            确认 (Acknowledge)
          </button>
        </div>
      </div>
    </div>
  );
};
