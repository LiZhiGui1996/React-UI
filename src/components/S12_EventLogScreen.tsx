import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AuditEventItem } from '../types';
import { generateFullAuditEvents } from '../data/mockData';
import { 
  Calendar, 
  Search, 
  FileSpreadsheet, 
  Filter, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Clock,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export const S12_EventLogScreen: React.FC = () => {
  const { showToast, theme } = useApp();
  const isLight = theme === 'light-metrology';

  // Filters state
  const [startTime, setStartTime] = useState('2026-09-06 03:26:59');
  const [endTime, setEndTime] = useState('2026-09-13 03:26:59');
  const [selectedSource, setSelectedSource] = useState('全部来源');
  const [selectedLevel, setSelectedLevel] = useState('全部级别');
  const [selectedType, setSelectedType] = useState('全部类型');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Selected row for detail inspection
  const [selectedEvent, setSelectedEvent] = useState<AuditEventItem | null>(null);

  // Memoized audit dataset (5901 total events)
  const fullEvents = useMemo(() => {
    return generateFullAuditEvents();
  }, []);

  // Filtered dataset
  const filteredEvents = useMemo(() => {
    return fullEvents.filter((ev) => {
      if (selectedSource !== '全部来源' && ev.source !== selectedSource) return false;
      if (selectedLevel !== '全部级别' && ev.level !== selectedLevel) return false;
      if (selectedType !== '全部类型' && ev.module !== selectedType) return false;
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const match = 
          ev.event.toLowerCase().includes(q) || 
          ev.detail.toLowerCase().includes(q) || 
          ev.time.includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [fullEvents, selectedSource, selectedLevel, selectedType, searchKeyword]);

  const totalRecords = filteredEvents.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Current page records
  const paginatedEvents = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredEvents.slice(startIdx, startIdx + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
    showToast(`查询完成：当前筛选范围共匹配到 ${totalRecords} 条事件记录 (第 1/${totalPages} 页)`);
  };

  const handleResetFilters = () => {
    setSelectedSource('全部来源');
    setSelectedLevel('全部级别');
    setSelectedType('全部类型');
    setSearchKeyword('');
    setCurrentPage(1);
    showToast('筛选条件已重置');
  };

  const handleExportCSV = () => {
    const header = '序号,时间,来源,模块,事件,级别,详情\n';
    const rows = filteredEvents.slice(0, 1000).map((ev, index) => {
      const cleanDetail = (ev.detail || '').replace(/"/g, '""');
      return `${index + 1},"${ev.time}","${ev.source}","${ev.module}","${ev.event}","${ev.level}","${cleanDetail}"`;
    }).join('\n');

    const csvContent = '\uFEFF' + header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `R_TEST_AUDIT_LOG_${startTime.slice(0, 10)}_${endTime.slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`已成功导出前 ${Math.min(filteredEvents.length, 1000)} 条审计日志为标准 CSV 文件`);
  };

  return (
    <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden select-none">
      {/* 1. Header Toolbar Card: Date Range, Filters, Search, and Action Buttons */}
      <div 
        className="rounded-lg border p-3 flex flex-col gap-2.5 shadow-xs transition-colors shrink-0"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Datetime Range Pickers & Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Start Time */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                起始时间:
              </span>
              <div className="relative flex items-center">
                <Calendar className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-40 pl-7 pr-2 py-1.5 rounded-md border font-mono-num text-xs transition-colors outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white' 
                      : 'bg-black/30 border-slate-700 text-slate-100 focus:border-sky-400'
                  }`}
                />
              </div>
            </div>

            {/* End Time */}
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                截止时间:
              </span>
              <div className="relative flex items-center">
                <Calendar className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-40 pl-7 pr-2 py-1.5 rounded-md border font-mono-num text-xs transition-colors outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white' 
                      : 'bg-black/30 border-slate-700 text-slate-100 focus:border-sky-400'
                  }`}
                />
              </div>
            </div>

            {/* Source Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedSource}
                onChange={(e) => {
                  setSelectedSource(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer transition-colors outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-sky-500' 
                    : 'bg-black/30 border-slate-700 text-slate-200 focus:border-sky-400'
                }`}
              >
                <option value="全部来源">全部来源</option>
                <option value="R-test">R-test 采集系统</option>
                <option value="Calib-Contact">接触式标定模组</option>
                <option value="Calib-NonContact">非接触式标定模组</option>
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer transition-colors outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-sky-500' 
                    : 'bg-black/30 border-slate-700 text-slate-200 focus:border-sky-400'
                }`}
              >
                <option value="全部级别">全部级别</option>
                <option value="信息">信息</option>
                <option value="警告">警告</option>
                <option value="错误">错误</option>
              </select>
            </div>

            {/* Module Type Dropdown */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-md border text-xs cursor-pointer transition-colors outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-sky-500' 
                    : 'bg-black/30 border-slate-700 text-slate-200 focus:border-sky-400'
                }`}
              >
                <option value="全部类型">全部模块</option>
                <option value="操作">操作记录</option>
                <option value="连接">通信连接</option>
                <option value="文件">文件传输</option>
                <option value="标定">标定解算</option>
                <option value="环境">环境监控</option>
                <option value="故障">系统诊断</option>
              </select>
            </div>
          </div>

          {/* Right: Search Keyword & Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Keyword Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索事件或详情..."
                className={`pl-8 pr-3 py-1.5 text-xs rounded-md border transition-colors outline-none w-44 ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white' 
                    : 'bg-black/30 border-slate-700 text-slate-100 focus:border-sky-400'
                }`}
              />
            </div>

            {/* Query Button */}
            <button
              id="event-search-btn"
              onClick={handleSearch}
              className="px-3.5 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            {/* Export CSV Button */}
            <button
              id="event-export-csv-btn"
              onClick={handleExportCSV}
              className={`px-3.5 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 shadow-xs'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>导出 CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Audit Log Table */}
      <div 
        className="flex-1 rounded-lg border overflow-auto min-h-0 shadow-xs transition-colors"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <table className="w-full text-left text-xs border-collapse">
          {/* Subtle Modern Header */}
          <thead 
            className="sticky top-0 z-10 border-b select-none text-[12px] font-semibold"
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#161f2e',
              borderColor: isLight ? '#e2e8f0' : '#222f42',
              color: isLight ? '#475569' : '#cbd5e1',
            }}
          >
            <tr>
              <th className="py-2.5 px-4 w-44 font-semibold text-left">时间</th>
              <th className="py-2.5 px-4 w-28 font-semibold text-left">来源</th>
              <th className="py-2.5 px-4 w-24 font-semibold text-center">模块</th>
              <th className="py-2.5 px-4 w-60 font-semibold text-left">事件</th>
              <th className="py-2.5 px-4 w-24 font-semibold text-center">级别</th>
              <th className="py-2.5 px-4 font-semibold text-left">详情描述</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono-num text-[12px]">
            {paginatedEvents.length > 0 ? (
              paginatedEvents.map((ev, idx) => {
                const isSelected = selectedEvent?.id === ev.id;
                
                return (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? isLight
                          ? 'bg-sky-50/90 border-l-2 border-l-sky-500 font-medium'
                          : 'bg-sky-500/20 border-l-2 border-l-sky-400 font-medium'
                        : idx % 2 === 0
                          ? isLight ? 'bg-white' : 'bg-transparent'
                          : isLight ? 'bg-slate-50/60' : 'bg-slate-900/30'
                    } hover:bg-sky-500/10`}
                  >
                    {/* 时间 */}
                    <td className={`py-2.5 px-4 font-mono-num whitespace-nowrap ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {ev.time}
                    </td>

                    {/* 来源 */}
                    <td className="py-2.5 px-4 font-sans whitespace-nowrap">
                      <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {ev.source}
                      </span>
                    </td>

                    {/* 模块分类 Badge */}
                    <td className="py-2.5 px-4 font-sans whitespace-nowrap text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${
                        ev.module === '操作'
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
                          : ev.module === '连接'
                            ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                            : ev.module === '标定'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                              : ev.module === '故障'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                      }`}>
                        {ev.module}
                      </span>
                    </td>

                    {/* 事件名称: 用户要求显示白色，清晰醒目 */}
                    <td 
                      className={`py-2.5 px-4 font-sans font-medium text-xs truncate max-w-xs ${
                        isLight ? 'text-slate-900 font-semibold' : 'text-white'
                      }`}
                      style={{ color: isLight ? '#0f172a' : '#ffffff' }}
                    >
                      {ev.event}
                    </td>

                    {/* 级别 Pill */}
                    <td className="py-2.5 px-4 font-sans whitespace-nowrap text-center">
                      {ev.level === '错误' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          错误
                        </span>
                      ) : ev.level === '警告' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          警告
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Info className="w-3 h-3" />
                          信息
                        </span>
                      )}
                    </td>

                    {/* 详情 */}
                    <td className={`py-2.5 px-4 font-sans truncate max-w-md ${
                      isLight ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      {ev.detail || '--'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-20 text-center text-slate-400 text-xs">
                  暂无匹配的审计事件记录。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Bottom Modern Pagination Toolbar */}
      <div 
        className="rounded-lg border p-2.5 flex items-center justify-between text-xs transition-colors shrink-0 shadow-xs"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="flex items-center gap-3">
          <span className={`font-mono-num text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            共 <strong className="text-slate-900 dark:text-slate-100">{totalRecords}</strong> 条事件记录 · 每页 {pageSize} 条
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className={`font-mono-num text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            第 <strong className="text-sky-600 dark:text-sky-400">{currentPage}</strong> / {totalPages} 页
          </span>
        </div>

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="event-prev-page-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border text-xs font-medium flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>上一页</span>
          </button>

          <button
            id="event-next-page-btn"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border text-xs font-medium flex items-center gap-1 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <span>下一页</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Optional Detailed Event Inspector Bottom Drawer */}
      {selectedEvent && (
        <div 
          className="p-3 rounded-lg border flex items-center justify-between text-xs transition-colors shrink-0 shadow-xs"
          style={{
            backgroundColor: isLight ? '#f8fafc' : '#161f2e',
            borderColor: isLight ? '#cbd5e1' : '#283548',
          }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-1.5 rounded bg-sky-500/10 text-sky-500 shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 overflow-hidden flex-wrap">
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                事件 #{selectedEvent.id}:
              </span>
              <span className={`font-mono-num ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>
                {selectedEvent.time}
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 font-medium border border-sky-500/20">
                [{selectedEvent.module}] {selectedEvent.event}
              </span>
              <span className={`truncate max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-200'}`}>
                {selectedEvent.detail}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSelectedEvent(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
