import React from 'react';
import { useApp } from '../context/AppContext';
import { Network, Cpu, Lock, Server } from 'lucide-react';

export const S13_MachineConnectScreen: React.FC = () => {
  const { theme, showToast } = useApp();
  const isLight = theme === 'light-metrology';

  return (
    <div className="flex-1 flex items-center justify-center p-6 select-none">
      <div 
        className="w-full max-w-md p-8 rounded-xl border flex flex-col items-center text-center shadow-lg transition-colors"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        {/* CNC Machine Line-art Icon */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-current fill-none stroke-[1.5]">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
            <circle cx="15" cy="15" r="2.5" />
            <path d="M15 12.5 v-1 M15 18.5 v-1 M12.5 15 h-1 M17.5 15 h-1" />
          </svg>
        </div>

        <h3 className="text-base font-bold text-slate-200 tracking-wide mb-2">
          机床连接（预留接口）
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
          机床直连功能将在后续版本提供。支持发那科 (FANUC)、西门子 (SIEMENS 840D sl/ONE)、海德汉 (HEIDENHAIN) 及华中数控等主流工业数控系统总线通信协议。
        </p>

        {/* Feature Preview Specs */}
        <div className="w-full grid grid-cols-2 gap-2 text-[11px] font-mono-num mb-6 text-left">
          <div className="p-2 rounded bg-black/20 border border-white/5 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">协议: OPC UA / FOCAS</span>
          </div>
          <div className="p-2 rounded bg-black/20 border border-white/5 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">实时位置同步: 1 kHz</span>
          </div>
        </div>

        {/* Disabled Button */}
        <button
          disabled
          onClick={() => showToast('机床直连接口开发中，请稍候...')}
          className="w-full py-2.5 px-4 rounded-lg bg-white/5 text-slate-500 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>连接机床 (功能未实装)</span>
        </button>
      </div>
    </div>
  );
};
