import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeTokens } from '../utils/themeStyles';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

interface ChannelConfig {
  key: string;
  name: string;
  color: string;
  unit: string;
}

interface OscilloscopeChartProps {
  title?: string;
  yAxisLabel: string;
  yRange: [number, number]; // [min, max]
  data: Array<{ time: number; [key: string]: number }>;
  channels: ChannelConfig[];
  height?: number | string;
  showZeroLine?: boolean;
}

export const OscilloscopeChart: React.FC<OscilloscopeChartProps> = ({
  title,
  yAxisLabel,
  yRange,
  data,
  channels,
  height = '100%',
  showZeroLine = false,
}) => {
  const { theme } = useApp();
  const tokens = getThemeTokens(theme);
  const isLight = theme === 'light-metrology';

  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Zoom & Pan states
  const [scale, setScale] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  const [minY, maxY] = yRange;
  const rangeY = maxY - minY || 1;
  const pointsCount = data.length || 1;

  // Wheel Zoom with passive: false to prevent scrolling parent container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

      setScale((prevScale) => {
        const nextScale = Math.min(8.0, Math.max(0.5, prevScale * zoomFactor));
        
        // Zoom toward mouse pointer
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

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Map value to Y coordinate (0 to 100%)
  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return 100 - ((clamped - minY) / rangeY) * 100;
  };

  // Generate SVG path for a channel
  const generatePath = (key: string) => {
    if (data.length === 0) return '';
    return data.map((d, i) => {
      const x = (i / (pointsCount - 1)) * 100;
      const y = getY(d[key]);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(' ');
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary button
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy,
      });
      setHoverIndex(null);
      return;
    }

    if (!containerRef.current || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Map mouse position unapplying scale & pan
    const centerX = rect.width / 2;
    const mouseXFromCenter = e.clientX - rect.left - centerX;
    const unscaledXFromCenter = (mouseXFromCenter - pan.x) / scale;
    const unscaledX = unscaledXFromCenter + centerX;
    const relX = unscaledX / rect.width;

    if (relX >= 0 && relX <= 1) {
      const idx = Math.min(data.length - 1, Math.max(0, Math.round(relX * (data.length - 1))));
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  }, [isDragging, data.length, pan.x, pan.y, scale]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverIndex(null);
  };

  // Touch Handlers for touchscreens
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
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
      setScale(Math.min(8.0, Math.max(0.5, pinchStartScaleRef.current * ratio)));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchStartDistRef.current = null;
  };

  // Toolbar Actions
  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.min(8.0, Number((prev * 1.25).toFixed(2))));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((prev) => Math.max(0.5, Number((prev * 0.8).toFixed(2))));
  };

  const handleReset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1.0);
    setPan({ x: 0, y: 0 });
  };

  const isTransformed = scale !== 1.0 || pan.x !== 0 || pan.y !== 0;
  const hoveredItem = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div 
      className="relative flex flex-col w-full h-full rounded border overflow-hidden select-none transition-colors"
      style={{
        backgroundColor: isLight ? '#ffffff' : '#080c12',
        borderColor: tokens.borderColor,
      }}
    >
      {/* Top Chart Header: Title & Channel Legends & Zoom/Pan Toolbar */}
      <div 
        className="px-2.5 py-1 flex items-center justify-between border-b text-[11px] shrink-0 gap-2"
        style={{
          backgroundColor: tokens.subcardBg,
          borderColor: tokens.dividerColor,
        }}
      >
        <div className="flex items-center gap-2">
          {title && <span className="font-semibold tracking-wide font-sans" style={{ color: tokens.titleColor }}>{title}</span>}
          <span className="text-[10px] font-mono-num" style={{ color: tokens.mutedColor }}>
            [{minY.toFixed(1)} ~ {maxY.toFixed(1)} {yAxisLabel}]
          </span>
        </div>

        {/* Center: Channels Legend */}
        <div className="flex items-center gap-3">
          {channels.map((ch) => {
            const currentVal = hoveredItem ? hoveredItem[ch.key] : (data[data.length - 1]?.[ch.key] ?? 0);
            return (
              <div key={ch.key} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: ch.color }} />
                <span className="font-medium" style={{ color: tokens.mutedColor }}>{ch.name}:</span>
                <span className="font-mono-num font-semibold" style={{ color: ch.color }}>
                  {typeof currentVal === 'number' ? currentVal.toFixed(4) : '--'}
                </span>
                <span style={{ color: tokens.mutedColor }}>{ch.unit}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Integrated Zoom & Pan Controls */}
        <div 
          className="flex items-center gap-1 px-1.5 py-0.5 rounded border shadow-2xs"
          style={{
            backgroundColor: isLight ? '#f1f5f9' : 'rgba(0,0,0,0.4)',
            borderColor: tokens.borderColor,
          }}
          title="滚轮缩放 · 按住左键拖拽平移 · 双击复位"
        >
          {/* Zoom Out */}
          <button
            type="button"
            onClick={handleZoomOut}
            title="缩小 (滚轮向下)"
            className="w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer hover:bg-sky-500/20 text-slate-400 hover:text-sky-400"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          {/* Scale ratio badge */}
          <span 
            onClick={handleReset}
            title="当前缩放比率 (点击复位)"
            className="px-1 text-[10px] font-mono-num font-bold cursor-pointer transition-colors hover:text-sky-400"
            style={{ color: isTransformed ? '#38bdf8' : tokens.bodyColor }}
          >
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom In */}
          <button
            type="button"
            onClick={handleZoomIn}
            title="放大 (滚轮向上)"
            className="w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer hover:bg-sky-500/20 text-slate-400 hover:text-sky-400"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={handleReset}
            title="复位至 100% 原始视窗 (双击图表亦可复位)"
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer ${
              isTransformed 
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-2xs' 
                : 'hover:bg-sky-500/20 text-slate-400 hover:text-sky-400'
            }`}
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>

          {/* Drag Indicator */}
          <div 
            title="支持鼠标左键按住拖动平移视窗"
            className="pl-1 border-l flex items-center"
            style={{ borderColor: tokens.dividerColor }}
          >
            <Move className={`w-3 h-3 ${isDragging ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
        </div>
      </div>

      {/* Main Chart Body: Graticule grid, curves, axis annotations */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleReset}
        className="relative flex-1 w-full h-full overflow-hidden select-none"
        style={{ 
          height,
          cursor: isDragging ? 'grabbing' : isTransformed ? 'grab' : 'crosshair'
        }}
      >
        {/* Scaled & Translated Layer (Grid, Zero Line, and SVG Curves) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.06s ease-out',
          }}
        >
          {/* Oscilloscope Reticle Grid */}
          <div className="absolute inset-0 oscilloscope-grid opacity-70" />

          {/* Zero baseline if requested */}
          {showZeroLine && minY < 0 && maxY > 0 && (
            <div 
              className="absolute left-0 right-0 border-b border-dashed border-sky-400/40"
              style={{ top: `${getY(0)}%` }}
            />
          )}

          {/* SVG Trace Curves */}
          <svg 
            className="absolute inset-0 w-full h-full overflow-visible"
            preserveAspectRatio="none" 
            viewBox="0 0 100 100"
          >
            <defs>
              {channels.map((ch) => (
                <filter key={`glow-${ch.key}`} id={`glow-${ch.key}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              ))}
            </defs>

            {channels.map((ch) => (
              <path
                key={ch.key}
                d={generatePath(ch.key)}
                fill="none"
                stroke={ch.color}
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
                filter={`url(#glow-${ch.key})`}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            {/* Hover Crosshair Vertical Line (Rendered in transformed space) */}
            {hoverIndex !== null && !isDragging && (
              <line
                x1={(hoverIndex / (pointsCount - 1)) * 100}
                y1="0"
                x2={(hoverIndex / (pointsCount - 1)) * 100}
                y2="100"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="1"
                strokeDasharray="2 2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        </div>

        {/* Static Y Axis Grid Divisions (Fixed on screen for reference) */}
        <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none text-[9px] font-mono-num" style={{ color: tokens.mutedColor }}>
          {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
            const val = minY + ratio * rangeY;
            return (
              <div key={ratio} className="w-full flex items-center justify-between border-b border-white/[0.04]">
                <span className="bg-black/30 px-1 rounded backdrop-blur-2xs">{val.toFixed(2)}</span>
                <span className="text-[8px] text-slate-600">{ratio === 0.5 ? 'REF' : ''}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Time Axis Indicator */}
        <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[9px] font-mono-num pointer-events-none" style={{ color: tokens.mutedColor }}>
          <span>-10.0 s</span>
          <span>-7.5 s</span>
          <span>-5.0 s</span>
          <span>-2.5 s</span>
          <span>0.0 s (NOW)</span>
        </div>

        {/* Transformed Indicator Pill */}
        {isTransformed && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs border border-sky-500/30 text-[9px] font-mono-num text-sky-300 flex items-center gap-1.5 shadow-md">
            <Move className="w-2.5 h-2.5 text-sky-400" />
            <span>拖拽平移 [X:{Math.round(pan.x)}, Y:{Math.round(pan.y)}] · 缩放 {Math.round(scale * 100)}%</span>
          </div>
        )}

        {/* Hover Tooltip Overlay */}
        {hoverIndex !== null && hoveredItem && !isDragging && (
          <div 
            className="absolute pointer-events-none px-2 py-1 rounded bg-black/85 border border-white/20 text-[10px] shadow-xl z-20"
            style={{
              left: `${Math.min(80, Math.max(10, ((hoverIndex / (pointsCount - 1)) * 100) * scale + pan.x))}%`,
              top: '12%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-slate-400 font-mono-num mb-0.5">T: {(hoveredItem.time ?? 0).toFixed(1)}s</div>
            {channels.map((ch) => (
              <div key={ch.key} className="flex items-center gap-1.5 font-mono-num">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ch.color }} />
                <span className="text-slate-400">{ch.name}:</span>
                <span className="font-semibold" style={{ color: ch.color }}>
                  {(hoveredItem[ch.key] ?? 0).toFixed(4)} {ch.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

