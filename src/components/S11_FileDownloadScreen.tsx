import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SdCardFile } from '../types';
import { INITIAL_SD_FILES } from '../data/mockData';
import { 
  HardDrive, 
  RefreshCw, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  FolderArchive,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';

export const S11_FileDownloadScreen: React.FC = () => {
  const { showToast, theme, isConnected, setIsConnected } = useApp();
  const isLight = theme === 'light-metrology';

  // Files data loaded from SD card
  const [files, setFiles] = useState<SdCardFile[]>(INITIAL_SD_FILES);
  const [hasLoadedFiles, setHasLoadedFiles] = useState(true);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(['1']);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string>(
    '就绪：已与下位机存储建立连接，可选择文件并下载保存至本地工作目录'
  );

  // Filtered files by search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(f => f.name.toLowerCase().includes(q) || f.status.includes(q));
  }, [files, searchQuery]);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(filteredFiles.map(f => f.id));
    }
  };

  // Toggle row selection
  const handleRowClick = (id: string, e?: React.MouseEvent) => {
    if (e && (e.ctrlKey || e.metaKey)) {
      if (selectedFileIds.includes(id)) {
        setSelectedFileIds(selectedFileIds.filter(item => item !== id));
      } else {
        setSelectedFileIds([...selectedFileIds, id]);
      }
    } else {
      // Toggle single selection
      if (selectedFileIds.includes(id) && selectedFileIds.length === 1) {
        setSelectedFileIds([]);
      } else {
        setSelectedFileIds([id]);
      }
    }
  };

  // Checkbox toggle
  const handleToggleCheckbox = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter(item => item !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  // Refresh action
  const handleRefresh = () => {
    if (!isConnected) {
      setIsConnected(true);
    }
    setHasLoadedFiles(true);
    setFiles(INITIAL_SD_FILES);
    setStatusMessage('刷新完成：成功读取采集仪 SD 卡 FAT32 分区，共检索到 18 个原始测量数据文件');
    showToast('SD 卡文件列表刷新成功！');
  };

  // Download action
  const handleDownload = () => {
    if (!hasLoadedFiles || files.length === 0) {
      showToast('当前暂无可下载文件，请先点击[刷新]获取文件列表');
      return;
    }
    if (selectedFileIds.length === 0) {
      showToast('请先在表格中选中需要下载的文件！');
      return;
    }

    const targetFiles = files.filter(f => selectedFileIds.includes(f.id));
    const targetNames = targetFiles.map(f => f.name).join(', ');

    setIsDownloading(true);
    setDownloadProgress(0);
    setStatusMessage(`正在下载：${targetNames} ...`);

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        current = 100;
        setDownloadProgress(100);
        clearInterval(interval);
        setIsDownloading(false);
        // Mark selected as 已下载
        setFiles(prev =>
          prev.map(f => selectedFileIds.includes(f.id) ? { ...f, status: '已下载' } : f)
        );
        setStatusMessage(`下载完成：已成功将 ${targetFiles.length} 个测量数据包保存至本地工作区，格式自动解析就绪`);
        showToast(`已成功下载 ${targetFiles.length} 个文件`);
      } else {
        setDownloadProgress(current);
      }
    }, 180);
  };

  // Single file quick download
  const handleDownloadSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileIds([id]);
    const f = files.find(item => item.id === id);
    if (!f) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setStatusMessage(`正在下载单文件：${f.name} ...`);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        current = 100;
        setDownloadProgress(100);
        clearInterval(interval);
        setIsDownloading(false);
        setFiles(prev =>
          prev.map(item => item.id === id ? { ...item, status: '已下载' } : item)
        );
        setStatusMessage(`下载完成：${f.name} 已保存至本地目录`);
        showToast(`文件 ${f.name} 下载成功！`);
      } else {
        setDownloadProgress(current);
      }
    }, 150);
  };

  // Delete action
  const handleDelete = () => {
    if (selectedFileIds.length === 0) {
      showToast('请先选中需要删除的文件！');
      return;
    }
    const count = selectedFileIds.length;
    setFiles(prev => prev.filter(f => !selectedFileIds.includes(f.id)));
    setSelectedFileIds([]);
    setStatusMessage(`已从设备 SD 卡中安全移除 ${count} 个选中文件`);
    showToast(`成功删除 ${count} 个 SD 卡文件`);
  };

  // Stats calculation
  const downloadedCount = files.filter(f => f.status === '已下载').length;
  const pendingCount = files.length - downloadedCount;

  return (
    <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden select-none">
      {/* 1. Header Card: SD Card Status & Summary Info */}
      <div 
        className="rounded-lg border p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs transition-colors shrink-0"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        {/* Left: Device & Storage Badge */}
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isLight ? 'bg-sky-50 text-sky-600' : 'bg-sky-500/10 text-sky-400'}`}>
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                采集仪 SD 卡存储
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                isConnected 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
              }`}>
                {isConnected ? '已连接在线' : '离线'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono border border-sky-500/20">
                FAT32
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                文件总数: <strong className="font-mono-num text-sky-600 dark:text-sky-400">{files.length}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                已下载: <strong className="font-mono-num text-emerald-600 dark:text-emerald-400">{downloadedCount}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                剩余容量: <strong className="font-mono-num text-slate-800 dark:text-slate-200">27,648 MB</strong> / 32,768 MB
              </span>
            </div>
          </div>
        </div>

        {/* Right: Storage Progress Pill & Hint */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden lg:flex flex-col gap-1 w-44 text-[11px]">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>空间占用</span>
              <span className="font-mono-num font-medium">15.6%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full w-[15.6%]" />
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文件名..."
              className={`pl-8 pr-3 py-1.5 text-xs rounded-md border transition-colors outline-none w-40 sm:w-48 ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white' 
                  : 'bg-black/30 border-slate-700 text-slate-100 focus:border-sky-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 2. Action Toolbar */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            id="sd-file-refresh-btn"
            onClick={handleRefresh}
            className={`px-3.5 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs' 
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 shadow-xs'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
            <span>刷新列表</span>
          </button>

          {/* Download Button (Primary) */}
          <button
            id="sd-file-download-btn"
            onClick={handleDownload}
            disabled={isDownloading || selectedFileIds.length === 0}
            className="px-4 py-1.5 rounded-md bg-sky-600 hover:bg-sky-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? '正在下载...' : `下载选中文件 (${selectedFileIds.length})`}</span>
          </button>

          {/* Delete Button */}
          <button
            id="sd-file-delete-btn"
            onClick={handleDelete}
            disabled={selectedFileIds.length === 0}
            className={`px-3.5 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isLight 
                ? 'bg-white hover:bg-rose-50 border-rose-200 text-rose-600' 
                : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>删除</span>
          </button>
        </div>

        {/* Selected count info */}
        <div className="text-xs text-slate-500 dark:text-slate-400">
          已选择 <strong className="font-mono-num text-sky-600 dark:text-sky-400">{selectedFileIds.length}</strong> / {filteredFiles.length} 项
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div 
        className="flex-1 rounded-lg border overflow-auto min-h-0 shadow-xs transition-colors"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <table className="w-full text-left text-xs border-collapse">
          {/* Clean modern table header */}
          <thead 
            className="sticky top-0 z-10 border-b select-none text-[12px] font-semibold"
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#161f2e',
              borderColor: isLight ? '#e2e8f0' : '#222f42',
              color: isLight ? '#475569' : '#cbd5e1',
            }}
          >
            <tr>
              <th className="py-2.5 px-4 w-12 text-center">
                <input 
                  type="checkbox"
                  checked={selectedFileIds.length === filteredFiles.length && filteredFiles.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-4 font-semibold">文件名</th>
              <th className="py-2.5 px-4 font-semibold text-center w-36">文件大小</th>
              <th className="py-2.5 px-4 font-semibold text-center w-36">状态</th>
              <th className="py-2.5 px-4 font-semibold text-right w-28">操作</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono-num text-[12px]">
            {hasLoadedFiles && filteredFiles.length > 0 ? (
              filteredFiles.map((file, idx) => {
                const isSelected = selectedFileIds.includes(file.id);
                const isDownloaded = file.status === '已下载';

                return (
                  <tr
                    key={file.id}
                    onClick={(e) => handleRowClick(file.id, e)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-sky-50/80 border-l-2 border-l-sky-500'
                          : 'bg-sky-500/20 border-l-2 border-l-sky-400'
                        : idx % 2 === 0
                          ? isLight ? 'bg-white' : 'bg-transparent'
                          : isLight ? 'bg-slate-50/60' : 'bg-slate-900/30'
                    } hover:bg-sky-500/10`}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-4 text-center" onClick={(e) => handleToggleCheckbox(file.id, e)}>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                    </td>

                    {/* File Name */}
                    <td className="py-2.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-slate-300'}`}>
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <span className={`font-medium ${
                          isSelected 
                            ? 'text-sky-400 font-semibold' 
                            : isLight ? 'text-slate-900 font-semibold' : 'text-white'
                        }`}
                        style={{ color: isSelected ? undefined : (isLight ? '#0f172a' : '#ffffff') }}
                        >
                          {file.name}
                        </span>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-2.5 px-4 text-center">
                      <span className={`font-mono-num ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {file.sizeStr}
                      </span>
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-2.5 px-4 text-center">
                      {isDownloaded ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          已下载
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                          <Clock className="w-3 h-3" />
                          未下载
                        </span>
                      )}
                    </td>

                    {/* Quick Single Action */}
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => handleDownloadSingle(file.id, e)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          isDownloaded
                            ? isLight 
                              ? 'text-slate-600 hover:bg-slate-100' 
                              : 'text-slate-400 hover:bg-white/5'
                            : 'text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40'
                        }`}
                      >
                        {isDownloaded ? '重新下载' : '下载'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="py-16 text-center text-slate-400 text-xs">
                  未匹配到相关文件。请确认关键字无误或点击 [刷新列表] 重新扫描 SD 卡。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Sleek Dynamic Download Progress Bar */}
      <div 
        className="rounded-lg border p-3 flex flex-col gap-2 transition-colors shrink-0 shadow-xs"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#111722',
          borderColor: isLight ? '#cbd5e1' : '#1e293b',
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isDownloading ? (
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
            <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>
              {statusMessage}
            </span>
          </div>
          <span className="font-mono-num font-bold text-sky-600 dark:text-sky-400 text-xs">
            {downloadProgress}%
          </span>
        </div>

        {/* Modern styled progress line */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
