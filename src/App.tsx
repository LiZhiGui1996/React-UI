import React, { useEffect, useState, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TitleBar } from './components/TitleBar';
import { SidebarNav } from './components/SidebarNav';
import { WorkflowStepBar } from './components/WorkflowStepBar';
import { S01_StartupScreen } from './components/S01_StartupScreen';
import { S02_RealtimeScreen } from './components/S02_RealtimeScreen';
import { S03_CalibrationScreen } from './components/S03_CalibrationScreen';
import { S04_StructuralErrorScreen } from './components/S04_StructuralErrorScreen';
import { S05_DynamicErrorScreen } from './components/S05_DynamicErrorScreen';
import { S06_to_S10_HistoryReportScreen } from './components/S06_to_S10_HistoryReportScreen';
import { S11_FileDownloadScreen } from './components/S11_FileDownloadScreen';
import { S12_EventLogScreen } from './components/S12_EventLogScreen';
import { S13_MachineConnectScreen } from './components/S13_MachineConnectScreen';
import { S14_FaultDialog } from './components/S14_FaultDialog';
import { S15_to_S17_CalibSoftwareScreen } from './components/S15_to_S17_CalibSoftwareScreen';
import { 
  Compass, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Move, 
  Expand, 
  Layers, 
  Check, 
  Eye, 
  ZoomIn, 
  ZoomOut,
  SlidersHorizontal
} from 'lucide-react';

const MIN_WIDTH = 1728;
const MIN_HEIGHT = 926;

const MainAppContent: React.FC = () => {
  const { 
    appMode, 
    currentMainTab, 
    errorSubTab, 
    theme, 
    toastMessage, 
    isMaximized,
    setIsMaximized,
    isMinimized,
    setIsMinimized,
    isFullscreen,
    toggleFullscreen,
    windowWidth,
    setWindowWidth,
    windowHeight,
    setWindowHeight,
    resetWindowSize,
    showToast
  } = useApp();

  const isLight = theme === 'light-metrology';

  // Window position for free dragging mode
  const [windowPos, setWindowPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Window resizing
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef<string | null>(null);
  const resizeStartRef = useRef<{ 
    mouseX: number; 
    mouseY: number; 
    startW: number; 
    startH: number; 
    startX: number; 
    startY: number; 
  }>({ mouseX: 0, mouseY: 0, startW: MIN_WIDTH, startH: MIN_HEIGHT, startX: 0, startY: 0 });

  // Viewport Zoom Scale (for laptops / preview screens < 1728px)
  const [scaleMode, setScaleMode] = useState<'100' | 'fit'>('100');
  const [customScale, setCustomScale] = useState<number>(1);
  const outerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isLight]);

  // Handle auto fit scale calculation if user selects 'fit'
  useEffect(() => {
    const handleResizeViewport = () => {
      if (scaleMode === 'fit' && outerContainerRef.current) {
        const clientW = outerContainerRef.current.clientWidth - 32;
        const clientH = outerContainerRef.current.clientHeight - 32;
        const scaleW = clientW / windowWidth;
        const scaleH = clientH / windowHeight;
        const fitScale = Math.min(1, Math.min(scaleW, scaleH));
        setCustomScale(Math.max(0.4, Number(fitScale.toFixed(2))));
      } else {
        setCustomScale(1);
      }
    };

    handleResizeViewport();
    window.addEventListener('resize', handleResizeViewport);
    return () => window.removeEventListener('resize', handleResizeViewport);
  }, [scaleMode, windowWidth, windowHeight]);

  // Window drag & resize global mouse listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Dragging Window
      if (isDraggingRef.current && !isMaximized) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        setWindowPos({
          x: dragStartRef.current.startX + dx,
          y: dragStartRef.current.startY + dy,
        });
      }

      // 2. Resizing Window (All 8 Directions)
      if (isResizingRef.current) {
        const mode = isResizingRef.current;
        const dx = e.clientX - resizeStartRef.current.mouseX;
        const dy = e.clientY - resizeStartRef.current.mouseY;

        let nextW = resizeStartRef.current.startW;
        let nextH = resizeStartRef.current.startH;
        let nextX = resizeStartRef.current.startX;
        let nextY = resizeStartRef.current.startY;

        // Horizontal resizing
        if (mode.includes('e')) {
          nextW = Math.max(MIN_WIDTH, resizeStartRef.current.startW + dx);
        } else if (mode.includes('w')) {
          const proposedW = resizeStartRef.current.startW - dx;
          if (proposedW >= MIN_WIDTH) {
            nextW = proposedW;
            nextX = resizeStartRef.current.startX + dx;
          } else {
            nextW = MIN_WIDTH;
            nextX = resizeStartRef.current.startX + (resizeStartRef.current.startW - MIN_WIDTH);
          }
        }

        // Vertical resizing
        if (mode.includes('s')) {
          nextH = Math.max(MIN_HEIGHT, resizeStartRef.current.startH + dy);
        } else if (mode.includes('n')) {
          const proposedH = resizeStartRef.current.startH - dy;
          if (proposedH >= MIN_HEIGHT) {
            nextH = proposedH;
            nextY = resizeStartRef.current.startY + dy;
          } else {
            nextH = MIN_HEIGHT;
            nextY = resizeStartRef.current.startY + (resizeStartRef.current.startH - MIN_HEIGHT);
          }
        }

        setWindowWidth(nextW);
        setWindowHeight(nextH);
        if (nextX !== resizeStartRef.current.startX || nextY !== resizeStartRef.current.startY) {
          setWindowPos({ x: nextX, y: nextY });
        }
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
      }
      if (isResizingRef.current) {
        isResizingRef.current = null;
        setIsResizing(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized, setWindowWidth, setWindowHeight]);

  const handleStartResize = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMaximized) {
      setIsMaximized(false);
    }
    setIsResizing(true);
    isResizingRef.current = direction;
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startW: windowWidth,
      startH: windowHeight,
      startX: windowPos.x,
      startY: windowPos.y,
    };
  };

  // Determine theme background and text
  const getThemeClass = () => {
    switch (theme) {
      case 'light-metrology':
        return 'theme-light-metrology bg-[#f1f5f9] text-[#0f172a] border-slate-300';
      case 'precision-blue':
        return 'theme-precision-blue bg-[#070f1e] text-[#dbeafe] border-sky-900/60';
      case 'dark-industrial':
      default:
        return 'theme-dark-industrial bg-[#090d14] text-[#e2e8f0] border-slate-800';
    }
  };

  return (
    <div 
      ref={outerContainerRef}
      className="w-screen h-screen overflow-auto bg-[#04060a] flex items-center justify-center p-4 relative select-none font-sans"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Top Floating Control Dock: Quick access for Window Operations */}
      <div 
        id="desktop-window-quick-bar"
        className="fixed top-3 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-md shadow-2xl text-xs text-slate-300"
      >
        <div className="flex items-center gap-1.5 text-sky-400 font-bold tracking-wider mr-1">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>R-TEST 窗口管理</span>
        </div>

        <div className="h-3.5 w-px bg-white/10 mx-0.5" />

        {/* Current Size Indicator */}
        <div 
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/40 font-mono-num text-[11px] border border-white/5"
          title="当前窗口物理尺寸 (最小保证 1728×926)"
        >
          <span className="text-slate-400">尺寸:</span>
          <span className="text-sky-300 font-bold">{windowWidth} × {windowHeight}</span>
          {windowWidth === MIN_WIDTH && windowHeight === MIN_HEIGHT && (
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-300 ml-1">最小基准</span>
          )}
        </div>

        {/* 1728 x 926 Reset Button */}
        <button
          onClick={() => {
            setWindowWidth(MIN_WIDTH);
            setWindowHeight(MIN_HEIGHT);
            setWindowPos({ x: 0, y: 0 });
            setIsMaximized(false);
            showToast('已重置为标准最小尺寸 1728 × 926');
          }}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          title="还原为标准最小尺寸 1728 × 926 并居中"
        >
          <RotateCcw className="w-3 h-3" />
          <span>1728×926基准</span>
        </button>

        {/* 1920 x 1080 Preset */}
        <button
          onClick={() => {
            setWindowWidth(1920);
            setWindowHeight(1080);
            setWindowPos({ x: 0, y: 0 });
            setIsMaximized(false);
            showToast('已调整为 1080P 高清规格 (1920 × 1080)');
          }}
          className="px-2 py-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-[11px]"
          title="切换至 1920 × 1080"
        >
          1080P
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={() => {
            if (isMaximized) {
              setIsMaximized(false);
              setWindowWidth(MIN_WIDTH);
              setWindowHeight(MIN_HEIGHT);
              setWindowPos({ x: 0, y: 0 });
              showToast('已还原为自由窗口 (可任意拖动与拉伸)');
            } else {
              setIsMaximized(true);
              setWindowPos({ x: 0, y: 0 });
              showToast('已最大化窗口');
            }
          }}
          className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px] ${
            isMaximized 
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
              : 'hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
          title={isMaximized ? "还原为自由窗口" : "最大化铺满窗口"}
        >
          {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{isMaximized ? '还原窗口' : '最大化'}</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => {
            toggleFullscreen();
            showToast(isFullscreen ? '已退出全屏' : '已进入全屏工作模式');
          }}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          title="全屏显示"
        >
          <Expand className="w-3 h-3" />
          <span>全屏</span>
        </button>

        {/* Minimize */}
        <button
          onClick={() => {
            setIsMinimized(true);
            showToast('窗口已缩小至底部任务托盘');
          }}
          className="px-2.5 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
          title="缩小至托盘"
        >
          <Eye className="w-3 h-3" />
          <span>缩小</span>
        </button>

        {/* Fit Screen Toggle for Small Screens */}
        <div className="h-3.5 w-px bg-white/10 mx-0.5" />
        <button
          onClick={() => {
            if (scaleMode === '100') {
              setScaleMode('fit');
              showToast('已开启自适应屏幕等比缩放');
            } else {
              setScaleMode('100');
              setCustomScale(1);
              showToast('已切换至 1:1 原始物理尺寸');
            }
          }}
          className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px] ${
            scaleMode === 'fit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
              : 'hover:bg-white/10 text-slate-400 hover:text-white'
          }`}
          title="笔记本或窄视口时，等比自适应当前屏幕"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{scaleMode === 'fit' ? `自适应 (${Math.round(customScale * 100)}%)` : '100% 原始'}</span>
        </button>
      </div>

      {/* Minimized Floating Taskbar Dock Capsule */}
      {isMinimized && (
        <div 
          id="minimized-dock-bar"
          onClick={() => {
            setIsMinimized(false);
            showToast('已还原主测量窗口');
          }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 px-6 py-3 rounded-full shadow-2xl border border-sky-500/50 bg-slate-900/95 backdrop-blur-md cursor-pointer hover:scale-105 transition-all text-slate-100"
          title="点击还原 R-test 测量系统窗口"
        >
          <Compass className="w-5 h-5 text-sky-400 animate-spin" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide">R-test 测量系统 (已缩小)</span>
            <span className="text-[10px] text-slate-400 font-mono-num">
              规格: {windowWidth} × {windowHeight} (最小限制 1728×926)
            </span>
          </div>
          <button className="ml-3 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>点击还原窗口</span>
          </button>
        </div>
      )}

      {/* Active Resizing Dimensions Tooltip Badge */}
      {isResizing && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full bg-sky-600 text-white text-xs font-mono-num font-bold shadow-2xl flex items-center gap-2 animate-pulse">
          <Move className="w-3.5 h-3.5" />
          <span>拉伸窗口中：{windowWidth} × {windowHeight} px</span>
          {windowWidth === MIN_WIDTH || windowHeight === MIN_HEIGHT ? (
            <span className="text-amber-200 bg-amber-900/40 px-1.5 py-0.2 rounded text-[10px]">
              已达到最小限制
            </span>
          ) : null}
        </div>
      )}

      {/* Main Workstation Window */}
      {!isMinimized && (
        <div 
          id="main-applet-window"
          className={`relative flex flex-col overflow-hidden font-sans transition-shadow ${getThemeClass()} ${
            isMaximized 
              ? 'w-full h-full' 
              : 'rounded-xl shadow-2xl border ring-1 ring-black/60'
          }`}
          style={{
            minWidth: `${MIN_WIDTH}px`,
            minHeight: `${MIN_HEIGHT}px`,
            width: isMaximized ? '100%' : `${windowWidth}px`,
            height: isMaximized ? '100%' : `${windowHeight}px`,
            transform: !isMaximized 
              ? `translate(${windowPos.x}px, ${windowPos.y}px) scale(${customScale})` 
              : `scale(${customScale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* 1. Global Custom Frameless Title Bar (Supports free drag and double-click to maximize) */}
          <div 
            onMouseDown={(e) => {
              if (isMaximized) return;
              // Only start drag if clicked on empty titlebar space (not buttons/selects)
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('select') || target.closest('input')) return;
              isDraggingRef.current = true;
              dragStartRef.current = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                startX: windowPos.x,
                startY: windowPos.y,
              };
            }}
            onDoubleClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('select') || target.closest('input')) return;
              setIsMaximized(!isMaximized);
              showToast(!isMaximized ? '已最大化窗口' : '已还原窗口');
            }}
            className={!isMaximized ? 'cursor-move' : ''}
            title={!isMaximized ? "按住可拖动窗口位置，双击可最大化/还原" : "双击可还原窗口"}
          >
            <TitleBar />
          </div>

          {/* 2. Mode Router */}
          {appMode === 'main' ? (
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
              {/* Main workspace: Sidebar + Screen content */}
              <div className="flex-1 flex min-h-0 min-w-0 overflow-hidden">
                {/* Left Vertical Navigation Rail */}
                <SidebarNav />

                {/* Active Screen Container: Fully bound and responsive */}
                <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative">
                  {currentMainTab === 'startup' && <S01_StartupScreen />}
                  {currentMainTab === 'realtime' && <S02_RealtimeScreen />}
                  {currentMainTab === 'calibration' && <S03_CalibrationScreen />}
                  {(currentMainTab === 'error-measurement' || currentMainTab === 'error-measure') && (
                    errorSubTab === 'structural' ? <S04_StructuralErrorScreen /> : <S05_DynamicErrorScreen />
                  )}
                  {currentMainTab === 'history-report' && <S06_to_S10_HistoryReportScreen />}
                  {(currentMainTab === 'file-download' || currentMainTab === 'files') && <S11_FileDownloadScreen />}
                  {(currentMainTab === 'event-log' || currentMainTab === 'events') && <S12_EventLogScreen />}
                  {currentMainTab === 'machine-connect' && <S13_MachineConnectScreen />}
                </main>
              </div>

              {/* Workflow Step Bar along bottom of Main Measurement Software */}
              <WorkflowStepBar />
            </div>
          ) : (
            /* Standalone Instrument Calibration Software (S15, S16, S17) */
            <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
              <S15_to_S17_CalibSoftwareScreen />
            </div>
          )}

          {/* S14 Critical Fault Dialog (Non-modal global overlay) */}
          <S14_FaultDialog />

          {/* 8-Direction Resizing Handles (Active around the window frame) */}
          {!isMaximized && (
            <>
              {/* Right edge */}
              <div 
                className="resize-handle-e hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('e', e)}
                title="按住向右拖动拉伸窗口宽度 (最小 1728px)"
              />
              {/* Left edge */}
              <div 
                className="resize-handle-w hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('w', e)}
                title="按住向左拖动拉伸窗口宽度 (最小 1728px)"
              />
              {/* Bottom edge */}
              <div 
                className="resize-handle-s hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('s', e)}
                title="按住向下拖动拉伸窗口高度 (最小 926px)"
              />
              {/* Top edge */}
              <div 
                className="resize-handle-n hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('n', e)}
                title="按住向上拖动拉伸窗口高度 (最小 926px)"
              />
              {/* Bottom-right corner */}
              <div 
                className="resize-handle-se flex items-center justify-center hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('se', e)}
                title="按住自由拖动调整窗口宽高 (最小 1728×926)"
              />
              {/* Bottom-left corner */}
              <div 
                className="resize-handle-sw flex items-center justify-center hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('sw', e)}
                title="按住向左下拖动调整窗口 (最小 1728×926)"
              />
              {/* Top-right corner */}
              <div 
                className="resize-handle-ne flex items-center justify-center hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('ne', e)}
                title="按住向右上拖动调整窗口 (最小 1728×926)"
              />
              {/* Top-left corner */}
              <div 
                className="resize-handle-nw flex items-center justify-center hover:bg-sky-500/40 transition-colors"
                onMouseDown={(e) => handleStartResize('nw', e)}
                title="按住向左上拖动调整窗口 (最小 1728×926)"
              />

              {/* Visual Corner Resize Grip at Bottom-Right */}
              <div 
                onMouseDown={(e) => handleStartResize('se', e)}
                className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize z-60 flex flex-col items-end justify-end p-0.5 opacity-60 hover:opacity-100 transition-opacity"
                title="自由拖动拉伸窗口大小 (最小限制 1728 × 926)"
              >
                <div className="w-3 h-0.5 bg-slate-400 rounded-full mb-0.5" />
                <div className="w-2 h-0.5 bg-slate-400 rounded-full mb-0.5" />
                <div className="w-1 h-0.5 bg-slate-400 rounded-full" />
              </div>
            </>
          )}

          {/* Toast Notifications */}
          {toastMessage && (
            <div className="fixed bottom-12 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-4 py-2 rounded-lg bg-slate-900/95 text-slate-100 border border-sky-500/40 shadow-xl text-xs font-mono-num flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>{toastMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
