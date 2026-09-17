import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeTokens } from '../utils/themeStyles';

export interface InteractiveCurveBoxProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  showToolbar?: boolean;
  toolbarPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showGrid?: boolean;
  gridClassName?: string;
  badge?: string;
  title?: string;
  style?: React.CSSProperties;
  onReset?: () => void;
  height?: string | number;
}

export const InteractiveCurveBox: React.FC<InteractiveCurveBoxProps> = ({
  children,
  className = '',
  minScale = 0.5,
  maxScale = 8.0,
  initialScale = 1.0,
  showToolbar = true,
  toolbarPosition = 'top-right',
  showGrid = true,
  gridClassName = 'oscilloscope-grid',
  badge,
  title,
  style,
  onReset,
  height = '100%',
}) => {
  const { theme } = useApp();
  const tokens = getThemeTokens(theme);

  const [scale, setScale] = useState<number>(initialScale);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);

  // Wheel zoom with passive: false to prevent parent page scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

      setScale((prevScale) => {
        const nextScale = Math.min(maxScale, Math.max(minScale, prevScale * zoomFactor));
        
        // Adjust pan to zoom towards mouse cursor
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        
        setPan((prevPan) => {
          const ratio = nextScale / prevScale;
          const newPanX = mouseX - ratio * (mouseX - prevPan.x);
          const newPanY = mouseY - ratio * (mouseY - prevPan.y);
          return { x: newPanX, y: newPanY };
        });

        return nextScale;
      });
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, [minScale, maxScale]);

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only main button
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile / touch screens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.clientX;
      const dy = e.touches[0].clientY - dragStartRef.current.clientY;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / pinchStartDistRef.current;
      const nextScale = Math.min(maxScale, Math.max(minScale, pinchStartScaleRef.current * ratio));
      setScale(nextScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  // Zoom control buttons
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(maxScale, Number((prev * 1.25).toFixed(2))));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.max(minScale, Number((prev * 0.8).toFixed(2))));
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1.0);
    setPan({ x: 0, y: 0 });
    onReset?.();
  };

  const isTransformed = scale !== 1.0 || pan.x !== 0 || pan.y !== 0;

  // Position class for toolbar
  const positionClasses = {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  }[toolbarPosition];

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleReset}
      onMouseEnter={() => setShowHint(true)}
      className={`relative w-full overflow-hidden select-none group ${className}`}
      style={{
        height,
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style,
      }}
      title="按住鼠标左键可任意拖动平移 · 滚轮缩放 · 双击重置"
    >
      {/* Background Reticle Grid if enabled */}
      {showGrid && (
        <div 
          className={`absolute inset-0 pointer-events-none opacity-60 ${gridClassName}`}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.06s ease-out',
          }}
        />
      )}

      {/* Main Scalable & Pannable Curve Container */}
      <div
        className="w-full h-full relative"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.06s ease-out',
        }}
      >
        {children}
      </div>

      {/* Floating Interactive Toolbar (Zoom In, Out, Reset, Ratio, Drag indicator) */}
      {showToolbar && (
        <div
          className={`absolute ${positionClasses} z-20 flex items-center gap-1 p-1 rounded-lg shadow-md border backdrop-blur-md transition-opacity duration-200 ${
            isTransformed ? 'opacity-100 ring-1 ring-sky-500/50' : 'opacity-85 hover:opacity-100'
          }`}
          style={{
            backgroundColor: tokens.subcardBg,
            borderColor: tokens.borderColor,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            title="缩小 (滚轮向下)"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 active:scale-95"
            style={{ color: tokens.bodyColor }}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Percentage Pill */}
          <span
            onClick={handleReset}
            title="当前缩放倍率 (点击复位)"
            className="px-1.5 py-0.5 rounded text-[10px] font-mono-num font-bold cursor-pointer transition-colors hover:text-sky-400"
            style={{
              color: isTransformed ? '#38bdf8' : tokens.titleColor,
              backgroundColor: isTransformed ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            }}
          >
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            title="放大 (滚轮向上)"
            className="w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 active:scale-95"
            style={{ color: tokens.bodyColor }}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Reset Button (Visible always, highlighted when transformed) */}
          <button
            type="button"
            onClick={handleReset}
            title="重置缩放与平移 (双击空白处亦可重置)"
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
              isTransformed
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                : 'hover:bg-sky-500/20 text-slate-400 hover:text-sky-400'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Pan Drag Indicator icon */}
          <div
            title="按住鼠标左键可任意拖动平移视窗"
            className="pl-1 border-l flex items-center text-slate-400"
            style={{ borderColor: tokens.dividerColor }}
          >
            <Move className={`w-3 h-3 ${isDragging ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
        </div>
      )}

      {/* Floating Corner Indicator Pill for user guidance */}
      {isTransformed && (
        <div 
          className="absolute bottom-2 left-2 z-10 pointer-events-none px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-sky-500/30 text-[9px] font-mono-num text-sky-300 flex items-center gap-1.5"
        >
          <Move className="w-2.5 h-2.5 text-sky-400" />
          <span>拖拽平移: X {Math.round(pan.x)}px, Y {Math.round(pan.y)}px</span>
        </div>
      )}
    </div>
  );
};
