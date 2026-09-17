import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppTheme,
  MainTab,
  AppMode,
  ErrorSubTab,
  HistorySubTab,
  CalibSoftwarePage,
  SensorData,
  CalibrationPointLock,
  HistoryRecordItem,
  FaultDialogState,
  EnvironmentData,
  LcArmData,
} from '../types';
import { INITIAL_HISTORY_RECORDS } from '../data/mockData';

export const WORKFLOW_STEPS_STRUCTURAL = [
  '校准',
  '新建测量',
  '选择测量方式',
  '结构误差测量',
  '设定角度参数',
  '确定',
  '导出NC程序',
  '等待机床运行',
  '自动测量',
  '等待完成',
  '保存',
  '采集完成',
];

export const WORKFLOW_STEPS_DYNAMIC = [
  '校准',
  '新建测量',
  '选择测量方式',
  '动态误差测量',
  '设定转动轴参数',
  '导出NC程序',
  '等待机床运行',
  '开始采集',
  '等待完成',
  '保存',
  '采集完成',
];

interface AppContextType {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  appMode: AppMode;
  setAppMode: (m: AppMode) => void;
  currentMainTab: MainTab;
  setCurrentMainTab: (tab: MainTab) => void;
  errorSubTab: ErrorSubTab;
  setErrorSubTab: (st: ErrorSubTab) => void;
  historySubTab: HistorySubTab;
  setHistorySubTab: (st: HistorySubTab) => void;
  calibSoftwarePage: CalibSoftwarePage;
  setCalibSoftwarePage: (p: CalibSoftwarePage) => void;
  
  // Device & Connection
  deviceId: string;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  connectionType: 'wifi' | 'bluetooth';
  setConnectionType: (type: 'wifi' | 'bluetooth') => void;
  measurementMode: 'contact' | 'non-contact';
  setMeasurementMode: (mode: 'contact' | 'non-contact') => void;
  
  // Real-time Sensor Data
  sensorData: SensorData;
  originRecorded: boolean;
  originValues: { l1: number; l2: number; l3: number };
  recordOrigin: () => void;
  calibPointLocks: {
    p1: CalibrationPointLock;
    p2: CalibrationPointLock;
    p3: CalibrationPointLock;
  };
  lockCalibPoint: (pointKey: 'p1' | 'p2' | 'p3') => void;
  resetCalibPoint: (pointKey: 'p1' | 'p2' | 'p3') => void;
  
  // Stats
  sampleCount: number;
  sampleRate: number;
  voltageHistory: Array<{ time: number; u1: number; u2: number; u3: number }>;
  displacementHistory: Array<{ time: number; l1: number; l2: number; l3: number; x: number; y: number; z: number }>;
  
  // Workflow Step Bar
  workflowStepIndex: number;
  setWorkflowStepIndex: (idx: number) => void;
  activeWorkflowSteps: string[];
  
  // History Record Selected for Viewing
  selectedRecord: HistoryRecordItem;
  setSelectedRecord: (r: HistoryRecordItem) => void;
  historyRecords: HistoryRecordItem[];
  setHistoryRecords: React.Dispatch<React.SetStateAction<HistoryRecordItem[]>>;
  saveHistoryRecord: (record: HistoryRecordItem) => void;
  deleteHistoryRecord: (id: number) => void;
  
  // Fault Dialog State
  faultDialog: FaultDialogState;
  triggerFaultDialog: (severity?: 'FATAL' | 'Error') => void;
  closeFaultDialog: () => void;
  
  // Global Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // LC Force Arm (mm)
  lcArm: LcArmData;
  setLcArm: React.Dispatch<React.SetStateAction<LcArmData>>;

  // Window Management (Min 1728 x 926, Drag, Resize, Fullscreen, Minimize)
  windowWidth: number;
  setWindowWidth: (w: number) => void;
  windowHeight: number;
  setWindowHeight: (h: number) => void;
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  resetWindowSize: () => void;

  // Environment Temperature & Humidity
  environment: EnvironmentData;
  setEnvironment: React.Dispatch<React.SetStateAction<EnvironmentData>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<AppTheme>('dark-industrial');
  const [appMode, setAppMode] = useState<AppMode>('main');
  const [currentMainTab, setCurrentMainTab] = useState<MainTab>('realtime');
  const [errorSubTab, setErrorSubTab] = useState<ErrorSubTab>('structural');
  const [historySubTab, setHistorySubTab] = useState<HistorySubTab>('records');
  const [calibSoftwarePage, setCalibSoftwarePage] = useState<CalibSoftwarePage>('calib-setup');
  
  const [deviceId] = useState<string>('R_test_2609009A');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [connectionType, setConnectionType] = useState<'wifi' | 'bluetooth'>('wifi');
  const [measurementMode, setMeasurementMode] = useState<'contact' | 'non-contact'>('contact');
  
  // LC Force Arm (mm) inputs: default 254 mm each as requested
  const [lcArm, setLcArm] = useState<LcArmData>({ cx: 254, cy: 254 });

  // Window sizing & drag state (Min dimensions: 1728 x 926)
  const [windowWidth, setWindowWidth] = useState<number>(1728);
  const [windowHeight, setWindowHeight] = useState<number>(926);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      setIsMaximized(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const resetWindowSize = () => {
    setWindowWidth(1728);
    setWindowHeight(926);
    setIsMaximized(false);
  };
  
  // Sensor State
  const [sensorData, setSensorData] = useState<SensorData>({
    u1: 2.4813,
    u2: 2.3902,
    u3: 2.4417,
    l1: 1.8600,
    l2: 1.7921,
    l3: 1.8455,
    x: 0.0012,
    y: -0.0008,
    z: 0.0021,
  });
  
  const [originRecorded, setOriginRecorded] = useState<boolean>(true);
  const [originValues, setOriginValues] = useState({ l1: 1.8600, l2: 1.7921, l3: 1.8455 });
  
  const [calibPointLocks, setCalibPointLocks] = useState<{
    p1: CalibrationPointLock;
    p2: CalibrationPointLock;
    p3: CalibrationPointLock;
  }>({
    p1: { locked: true, x: 0.2001, y: -0.0002, z: 0.0001 },
    p2: { locked: true, x: 0.0003, y: 0.1998, z: -0.0002 },
    p3: { locked: true, x: -0.0001, y: 0.0002, z: 0.2003 },
  });

  const [sampleCount, setSampleCount] = useState<number>(10240);
  const [sampleRate] = useState<number>(38);
  
  // Buffers for oscilloscope charts
  const [voltageHistory, setVoltageHistory] = useState<Array<{ time: number; u1: number; u2: number; u3: number }>>(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const t = i * 0.1;
      return {
        time: t,
        u1: 2.48 + 0.03 * Math.sin(t * 1.5) + (Math.random() * 0.008 - 0.004),
        u2: 2.39 + 0.02 * Math.cos(t * 1.2) + (Math.random() * 0.008 - 0.004),
        u3: 2.44 + 0.025 * Math.sin(t * 0.8) + (Math.random() * 0.008 - 0.004),
      };
    });
  });

  const [displacementHistory, setDisplacementHistory] = useState<Array<{ time: number; l1: number; l2: number; l3: number; x: number; y: number; z: number }>>(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const t = i * 0.1;
      const l1 = 1.8600 + 0.002 * Math.sin(t * 1.5);
      const l2 = 1.7920 + 0.0015 * Math.cos(t * 1.2);
      const l3 = 1.8455 + 0.0018 * Math.sin(t * 0.8);
      return {
        time: t,
        l1,
        l2,
        l3,
        x: Number((0.0010 + 0.0015 * Math.sin(t)).toFixed(4)),
        y: Number((-0.0008 + 0.0012 * Math.cos(t)).toFixed(4)),
        z: Number((0.0020 + 0.0009 * Math.sin(2 * t)).toFixed(4)),
      };
    });
  });

  // Tick sensor values realistically
  useEffect(() => {
    if (!isConnected) return;
    const timer = setInterval(() => {
      setSampleCount((c) => c + 4);
      setSensorData((prev) => {
        const jitter = () => (Math.random() - 0.5) * 0.0008;
        const vJitter = () => (Math.random() - 0.5) * 0.002;
        const newU1 = Math.max(0, Math.min(4, Number((prev.u1 + vJitter()).toFixed(4))));
        const newU2 = Math.max(0, Math.min(4, Number((prev.u2 + vJitter()).toFixed(4))));
        const newU3 = Math.max(0, Math.min(4, Number((prev.u3 + vJitter()).toFixed(4))));
        const newL1 = Number((prev.l1 + jitter()).toFixed(4));
        const newL2 = Number((prev.l2 + jitter()).toFixed(4));
        const newL3 = Number((prev.l3 + jitter()).toFixed(4));
        const newX = Number((prev.x + jitter() * 0.5).toFixed(4));
        const newY = Number((prev.y + jitter() * 0.5).toFixed(4));
        const newZ = Number((prev.z + jitter() * 0.5).toFixed(4));

        // update history
        setVoltageHistory((vh) => {
          const now = (vh[vh.length - 1]?.time || 0) + 0.1;
          const next = [...vh.slice(1), { time: now, u1: newU1, u2: newU2, u3: newU3 }];
          return next;
        });

        setDisplacementHistory((dh) => {
          const now = (dh[dh.length - 1]?.time || 0) + 0.1;
          const next = [...dh.slice(1), { time: now, l1: newL1, l2: newL2, l3: newL3, x: newX, y: newY, z: newZ }];
          return next;
        });

        return {
          u1: newU1,
          u2: newU2,
          u3: newU3,
          l1: newL1,
          l2: newL2,
          l3: newL3,
          x: newX,
          y: newY,
          z: newZ,
        };
      });
    }, 150);
    return () => clearInterval(timer);
  }, [isConnected]);

  // Workflow progress
  const [workflowStepIndex, setWorkflowStepIndex] = useState<number>(3); // e.g. 结构误差测量
  const activeWorkflowSteps = useMemo(() => {
    return errorSubTab === 'dynamic' ? WORKFLOW_STEPS_DYNAMIC : WORKFLOW_STEPS_STRUCTURAL;
  }, [errorSubTab]);

  const [historyRecords, setHistoryRecords] = useState<HistoryRecordItem[]>(INITIAL_HISTORY_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecordItem>(INITIAL_HISTORY_RECORDS[0]);

  const saveHistoryRecord = (newRecord: HistoryRecordItem) => {
    setHistoryRecords((prev) => {
      // If record exists with same id or fileName, replace it, else unshift
      const existsIdx = prev.findIndex((r) => r.id === newRecord.id || (r.fileName && r.fileName === newRecord.fileName));
      if (existsIdx >= 0) {
        const next = [...prev];
        next[existsIdx] = newRecord;
        return next;
      }
      return [newRecord, ...prev];
    });
    setSelectedRecord(newRecord);
  };

  const deleteHistoryRecord = (id: number) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Environment Temperature & Humidity Monitoring (ISO 230-1 standard: 20.0°C base)
  const [environment, setEnvironment] = useState<EnvironmentData>({
    temperature: 20.2,
    humidity: 48.6,
    tempOffset: 0.2,
    standardTemp: 20.0,
    compensationEnabled: true,
  });

  // Micro-fluctuations for laboratory environmental sensors
  useEffect(() => {
    if (!isConnected) return;
    const envTimer = setInterval(() => {
      setEnvironment((prev) => {
        // Temperature softly drifts around 20.1 ~ 20.3 °C
        const tempDelta = (Math.random() - 0.5) * 0.04;
        const newTemp = Number(Math.max(19.8, Math.min(20.6, prev.temperature + tempDelta)).toFixed(1));
        // Humidity drifts around 48% ~ 50%
        const humDelta = (Math.random() - 0.5) * 0.15;
        const newHum = Number(Math.max(45, Math.min(55, prev.humidity + humDelta)).toFixed(1));
        const offset = Number((newTemp - prev.standardTemp).toFixed(2));
        return {
          ...prev,
          temperature: newTemp,
          humidity: newHum,
          tempOffset: offset,
        };
      });
    }, 2500);
    return () => clearInterval(envTimer);
  }, [isConnected]);

  // Fault dialog
  const [faultDialog, setFaultDialog] = useState<FaultDialogState>({
    isOpen: false,
    severity: 'FATAL',
    code: '0x11 - SD卡已满',
    module: 'SD 存储',
    deviceTime: '2026-09-14 10:31:05',
    detail: 'SD 卡剩余空间不足 5MB，采集已自动保护性挂起',
    cause: '长时间连续高速采集，历史 .DAT 文件未及时下载清理',
    solution: '请转至【文件下载】界面下载并删除历史文件后重新启动采集',
  });

  const triggerFaultDialog = (severity: 'FATAL' | 'Error' = 'FATAL') => {
    if (severity === 'FATAL') {
      setFaultDialog({
        isOpen: true,
        severity: 'FATAL',
        code: '0x11 - SD卡已满',
        module: 'SD 存储',
        deviceTime: '2026-09-14 10:31:05',
        detail: 'SD 卡剩余空间不足 5MB，采集已自动保护性挂起',
        cause: '长时间连续高速采集，历史 .DAT 文件未及时下载清理',
        solution: '请转至【文件下载】界面下载并删除历史文件后重新启动采集',
      });
    } else {
      setFaultDialog({
        isOpen: true,
        severity: 'Error',
        code: '0x22 - ADC采样微抖动告警',
        module: 'ADC 采集',
        deviceTime: '2026-09-14 10:33:12',
        detail: '采样帧间隔轻微抖动，已启动自动缓冲平滑补帧机制',
        cause: 'WiFi 信号存在微量多径反射干扰或通道高频噪声',
        solution: '请检查 DAQ 设备天线朝向或切换至有线/蓝牙连接模式',
      });
    }
  };

  const closeFaultDialog = () => {
    setFaultDialog((prev) => ({ ...prev, isOpen: false }));
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  const recordOrigin = () => {
    setOriginRecorded(true);
    setOriginValues({ l1: sensorData.l1, l2: sensorData.l2, l3: sensorData.l3 });
    showToast(`原点锁定成功：L1=${sensorData.l1.toFixed(4)}, L2=${sensorData.l2.toFixed(4)}, L3=${sensorData.l3.toFixed(4)} mm`);
  };

  const lockCalibPoint = (pointKey: 'p1' | 'p2' | 'p3') => {
    setCalibPointLocks((prev) => ({
      ...prev,
      [pointKey]: {
        locked: true,
        x: sensorData.x,
        y: sensorData.y,
        z: sensorData.z,
      },
    }));
    showToast(`校准点 ${pointKey.toUpperCase()} 偏差已锁定`);
  };

  const resetCalibPoint = (pointKey: 'p1' | 'p2' | 'p3') => {
    setCalibPointLocks((prev) => ({
      ...prev,
      [pointKey]: {
        locked: false,
        x: null,
        y: null,
        z: null,
      },
    }));
    showToast(`校准点 ${pointKey.toUpperCase()} 已重置`);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        appMode,
        setAppMode,
        currentMainTab,
        setCurrentMainTab,
        errorSubTab,
        setErrorSubTab,
        historySubTab,
        setHistorySubTab,
        calibSoftwarePage,
        setCalibSoftwarePage,
        deviceId,
        isConnected,
        setIsConnected,
        connectionType,
        setConnectionType,
        measurementMode,
        setMeasurementMode,
        sensorData,
        originRecorded,
        originValues,
        recordOrigin,
        calibPointLocks,
        lockCalibPoint,
        resetCalibPoint,
        sampleCount,
        sampleRate,
        voltageHistory,
        displacementHistory,
        workflowStepIndex,
        setWorkflowStepIndex,
        activeWorkflowSteps,
        selectedRecord,
        setSelectedRecord,
        historyRecords,
        setHistoryRecords,
        saveHistoryRecord,
        deleteHistoryRecord,
        faultDialog,
        triggerFaultDialog,
        closeFaultDialog,
        toastMessage,
        showToast,
        lcArm,
        setLcArm,
        windowWidth,
        setWindowWidth,
        windowHeight,
        setWindowHeight,
        isMaximized,
        setIsMaximized,
        isMinimized,
        setIsMinimized,
        isFullscreen,
        toggleFullscreen,
        resetWindowSize,
        environment,
        setEnvironment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
