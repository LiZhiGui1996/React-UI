export type AppTheme = 'dark-industrial' | 'light-metrology' | 'precision-blue';

export interface LcArmData {
  cx: number; // mm
  cy: number; // mm
}

export type MainTab = 
  | 'realtime'        // 实时曲线
  | 'calibration'     // 校准
  | 'error-measure'   // 误差测量
  | 'error-measurement'
  | 'history-report'  // 历史测量报告
  | 'files'           // 文件下载
  | 'file-download'
  | 'machine-connect' // 机床连接
  | 'events'          // 事件记录
  | 'event-log'
  | 'startup';

export type AppMode = 
  | 'main'
  | 'startup'
  | 'calib-software-contact'
  | 'calib-software-noncontact';

export type ErrorSubTab = 'structural' | 'dynamic';

export type HistorySubTab = 
  | 'records'        // 历史记录
  | 'params'         // 测量参数信息
  | 'datablock'      // 检测数据
  | 'raw-analysis'   // 原始数据分析
  | 'error-analysis' // 误差分析图示
  | 'export-pdf';    // 导出报告

export type CalibSoftwarePage = 'calib-setup' | 'calib-workbench';

export interface SensorData {
  u1: number; // V
  u2: number;
  u3: number;
  l1: number; // mm
  l2: number;
  l3: number;
  x: number;  // mm
  y: number;
  z: number;
}

export interface CalibrationPointLock {
  locked: boolean;
  x: number | null;
  y: number | null;
  z: number | null;
}

export interface MeasurementPoint {
  index: number;
  angle: number;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

export interface MachineSettings {
  machineName: string;
  machineStr: string;
  machineType: string;
  machineDateTime: string;
  machineOperator: string;
  machineAxis: string;
  workAxis: string;
  isRTCP?: boolean;
}

export interface RMatrix3x3 {
  r1: [number, number, number];
  r2: [number, number, number];
  r3: [number, number, number];
}

export interface GlobalMeasureSettings {
  startAngle: number;
  finishedAngle: number;
  thresholdValue: number;
  intervalAngle: number;
  measurePointNumber: number;
  intervalTime?: number;
}

export interface MeasureDataPoint {
  index: number;
  angle: number;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}

export interface HistoryRecordItem {
  id: number;
  axisName: string;
  isRotated: boolean;
  isRTCP?: boolean;
  measureTime: string;
  operator: string;
  machineId: string;
  machineModel: string;
  measureType: string;
  fileName: string;
  machineSettings?: MachineSettings;
  rMatrix?: RMatrix3x3;
  globalMeasure?: GlobalMeasureSettings;
  measureDataPoints?: MeasureDataPoint[];
}

export interface AuditEventItem {
  id: number;
  time: string;
  source: 'R-test' | 'Calib-Contact' | 'Calib-NonContact';
  module: 'SYS' | 'ADC' | 'RS485' | 'SD' | 'ESP' | 'RTC' | '采集' | '连接' | '文件' | '标定' | '故障' | '操作' | '环境';
  event: string;
  level: '信息' | '警告' | '错误';
  detail: string;
}

export interface SdCardFile {
  id: string;
  name: string;
  fatTime: string;
  sizeStr: string;
  bytes: number;
  status: '未下载' | '待下载' | '已下载' | '不存在';
  selected?: boolean;
}

export interface FaultDialogState {
  isOpen: boolean;
  severity: 'FATAL' | 'Error';
  code: string;
  module: string;
  deviceTime: string;
  detail: string;
  cause: string;
  solution: string;
}

export interface EnvironmentData {
  temperature: number; // °C
  humidity: number;    // %RH
  tempOffset: number;  // °C 偏差
  standardTemp: number; // 标准基准温度通常 20.0 °C
  compensationEnabled: boolean;
}
