import { HistoryRecordItem, AuditEventItem, SdCardFile, MeasurementPoint, MachineSettings, RMatrix3x3, GlobalMeasureSettings, MeasureDataPoint } from '../types';

export const DEFAULT_MACHINE_SETTINGS: MachineSettings = {
  machineName: '',
  machineStr: '',
  machineType: '',
  machineDateTime: '2019-03-08 16:13:28',
  machineOperator: '',
  machineAxis: '主轴旋转',
  workAxis: 'A轴',
  isRTCP: true,
};

export const DEFAULT_R_MATRIX: RMatrix3x3 = {
  r1: [0.099266, -0.172505, -0.000381],
  r2: [-0.000110, -0.002194, 0.198544],
  r3: [-0.177277, -0.100535, -0.004868],
};

export const DEFAULT_GLOBAL_MEASURE: GlobalMeasureSettings = {
  startAngle: -90,
  finishedAngle: -45,
  thresholdValue: 0.003,
  intervalAngle: 5,
  measurePointNumber: 10,
};

export const DEFAULT_MEASURE_DATA_POINTS: MeasureDataPoint[] = [
  { index: 1, angle: -90.00, x: 0.0056798027, y: -0.0015839521, z: -0.0127643766, dx: 0.0056798027, dy: -0.0015839521, dz: -0.0127643766 },
  { index: 2, angle: -85.00, x: -0.0032665869, y: -0.0003916702, z: -0.0130962262, dx: -0.0032665869, dy: -0.0003916702, dz: -0.0130962262 },
  { index: 3, angle: -80.00, x: 0.0024165082, y: 0.0121720614, z: -0.0113663061, dx: 0.0024165082, dy: 0.0121720614, dz: -0.0113663061 },
  { index: 4, angle: -75.00, x: 0.0093123199, y: 0.0190035075, z: -0.0068392024, dx: 0.0093123199, dy: 0.0190035075, dz: -0.0068392024 },
  { index: 5, angle: -70.00, x: 0.0127821921, y: 0.0259545150, z: -0.0020044104, dx: 0.0127821921, dy: 0.0259545150, dz: -0.0020044104 },
  { index: 6, angle: -65.00, x: 0.0147726791, y: 0.0320689797, z: 0.0006881977, dx: 0.0147726791, dy: 0.0320689797, dz: 0.0006881977 },
  { index: 7, angle: -60.00, x: 0.0162760092, y: 0.0370587062, z: 0.0043812305, dx: 0.0162760092, dy: 0.0370587062, dz: 0.0043812305 },
  { index: 8, angle: -55.00, x: 0.0179577350, y: 0.0373233755, z: 0.0104525454, dx: 0.0179577350, dy: 0.0373233755, dz: 0.0104525454 },
  { index: 9, angle: -50.00, x: 0.0164980478, y: 0.0377601426, z: 0.0159532972, dx: 0.0164980478, dy: 0.0377601426, dz: 0.0159532972 },
  { index: 10, angle: -45.00, x: 0.0187136157, y: 0.0417986723, z: 0.0185326028, dx: 0.0187136157, dy: 0.0417986723, dz: 0.0185326028 },
];

export const RAW_PARAMS_DATABLOCK_1_AND_2 = `% DATABLOCK 1
% GLOBAL MACHINE SETTINGS
% TYPE STRING STRING
% NAME MACHINE VALUE
% SEPARATOR ~
% DIM 7*2
MACHINE NAME~
MACHINE STR~
MACHINE TYPE~
MACHINE DATE_TIME~2019-03-08 16:13:28
MACHINE OPERATOR~
MACHINE AXIS~主轴旋转
WORK AXIS~A轴

% DATABLOCK 2
% GLOBAL R_MATRIX
% TYPE DOUBLE DOUBLE DOUBLE
% NAME r1 r2 r3
% SEPARATOR \\t
% DIM 3*3
0.099266\t-0.172505\t-0.000381
-0.000110\t-0.002194\t0.198544
-0.177277\t-0.100535\t-0.004868`;

export const RAW_DATABLOCK_3_AND_4 = `% DATABLOCK 3
% GLOBAL MEASURE
% TYPE STRING DOUBLE
% NAME STATIC INPUT
% SEPARATOR ~
% DIM 5*2
START ANGLE~-90
FINISHED ANGLE~-45
THRESHOLD VALUE~0.003
INTERVAL ANGLE~5
MEASURE POINT NUMBER~10

% DATABLOCK 4
% GLOBAL MEASURE DATA
% TYPE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE
% NAME ANGLE\tX\tY\tZ\tdX\tdY\tdZ
% SEPARATOR \\t
% DIM 10*7
-90.00\t0.0056798027\t-0.0015839521\t-0.0127643766\t0.0056798027\t-0.0015839521\t-0.0127643766
-85.00\t-0.0032665869\t-0.0003916702\t-0.0130962262\t-0.0032665869\t-0.0003916702\t-0.0130962262
-80.00\t0.0024165082\t0.0121720614\t-0.0113663061\t0.0024165082\t0.0121720614\t-0.0113663061
-75.00\t0.0093123199\t0.0190035075\t-0.0068392024\t0.0093123199\t0.0190035075\t-0.0068392024
-70.00\t0.0127821921\t0.0259545150\t-0.0020044104\t0.0127821921\t0.0259545150\t-0.0020044104
-65.00\t0.0147726791\t0.0320689797\t0.0006881977\t0.0147726791\t0.0320689797\t0.0006881977
-60.00\t0.0162760092\t0.0370587062\t0.0043812305\t0.0162760092\t0.0370587062\t0.0043812305
-55.00\t0.0179577350\t0.0373233755\t0.0104525454\t0.0179577350\t0.0373233755\t0.0104525454
-50.00\t0.0164980478\t0.0377601426\t0.0159532972\t0.0164980478\t0.0377601426\t0.0159532972
-45.00\t0.0187136157\t0.0417986723\t0.0185326028\t0.0187136157\t0.0417986723\t0.0185326028`;

export const INITIAL_MEASUREMENT_POINTS: MeasurementPoint[] = Array.from({ length: 18 }, (_, i) => {
  const angle = i * 20;
  const rad = (angle * Math.PI) / 180;
  // Simulating small machine geometric deviations on the order of microns (0.001 - 0.015 mm)
  const x = Number((12.5000 + 0.0085 * Math.sin(rad) + (Math.random() * 0.001 - 0.0005)).toFixed(4));
  const y = Number((-0.0200 + 0.0072 * Math.cos(rad) + (Math.random() * 0.001 - 0.0005)).toFixed(4));
  const z = Number((3.3090 + 0.0035 * Math.sin(2 * rad) + (Math.random() * 0.0008 - 0.0004)).toFixed(4));
  const dx = Number((x - 12.5000).toFixed(4));
  const dy = Number((y - (-0.0200)).toFixed(4));
  const dz = Number((z - 3.3090).toFixed(4));
  return {
    index: i + 1,
    angle,
    x,
    y,
    z,
    dx,
    dy,
    dz,
  };
});

export const INITIAL_HISTORY_RECORDS: HistoryRecordItem[] = [
  {
    id: 1,
    axisName: 'A轴',
    isRotated: true,
    isRTCP: true,
    measureTime: '2019-03-08 16:13:28',
    operator: '张工',
    machineId: 'VMG-05',
    machineModel: '五轴联动加工中心',
    measureType: '结构误差测量',
    fileName: 'RTEST_A_AXIS_20190308_1613.dat',
    machineSettings: DEFAULT_MACHINE_SETTINGS,
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 2,
    axisName: 'A轴',
    isRotated: false,
    isRTCP: false,
    measureTime: '2026-09-12 09:05',
    operator: '李工',
    machineId: 'VMG-05',
    machineModel: '五轴联动加工中心',
    measureType: '结构误差测量',
    fileName: 'VMG05_A_AXIS_20260912_0905.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-09-12 09:05:00',
      workAxis: 'A轴',
      isRTCP: false,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 3,
    axisName: 'B轴',
    isRotated: true,
    isRTCP: true,
    measureTime: '2026-09-10 16:47',
    operator: '王工',
    machineId: 'HMC-800',
    machineModel: '卧式五轴精密中心',
    measureType: '结构误差测量',
    fileName: 'HMC800_B_AXIS_20260910_1647.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-09-10 16:47:00',
      workAxis: 'B轴',
      isRTCP: true,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 4,
    axisName: 'C轴',
    isRotated: true,
    isRTCP: true,
    measureTime: '2026-09-08 11:15',
    operator: '张工',
    machineId: 'VMG-05',
    machineModel: '五轴联动加工中心',
    measureType: '动态误差测量',
    fileName: 'VMG05_C_DYN_20260908_1115.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-09-08 11:15:00',
      workAxis: 'C轴',
      isRTCP: true,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 5,
    axisName: 'A轴',
    isRotated: false,
    isRTCP: false,
    measureTime: '2026-09-05 15:30',
    operator: '赵工',
    machineId: 'DMG-60',
    machineModel: '高速五轴铣削加工中心',
    measureType: '结构误差测量',
    fileName: 'DMG60_A_AXIS_20260905_1530.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-09-05 15:30:00',
      workAxis: 'A轴',
      isRTCP: false,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 6,
    axisName: 'B轴',
    isRotated: false,
    isRTCP: false,
    measureTime: '2026-09-01 10:12',
    operator: '李工',
    machineId: 'HMC-800',
    machineModel: '卧式五轴精密中心',
    measureType: '结构误差测量',
    fileName: 'HMC800_B_AXIS_20260901_1012.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-09-01 10:12:00',
      workAxis: 'B轴',
      isRTCP: false,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 7,
    axisName: 'C轴',
    isRotated: true,
    isRTCP: true,
    measureTime: '2026-08-28 17:04',
    operator: '张工',
    machineId: 'VMG-05',
    machineModel: '五轴联动加工中心',
    measureType: '动态误差测量',
    fileName: 'VMG05_C_DYN_20260828_1704.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-08-28 17:04:00',
      workAxis: 'C轴',
      isRTCP: true,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
  {
    id: 8,
    axisName: 'A轴',
    isRotated: true,
    isRTCP: true,
    measureTime: '2026-08-22 13:40',
    operator: '孙工',
    machineId: 'DMG-60',
    machineModel: '高速五轴铣削加工中心',
    measureType: '结构误差测量',
    fileName: 'DMG60_A_AXIS_20260822_1340.dat',
    machineSettings: {
      ...DEFAULT_MACHINE_SETTINGS,
      machineDateTime: '2026-08-22 13:40:00',
      workAxis: 'A轴',
      isRTCP: true,
    },
    rMatrix: DEFAULT_R_MATRIX,
    globalMeasure: DEFAULT_GLOBAL_MEASURE,
    measureDataPoints: DEFAULT_MEASURE_DATA_POINTS,
  },
];

export const MOCK_DATABLOCK_RAW = `% DATABLOCK 1
% GLOBAL MACHINE SETTINGS
% TYPE STRING STRING
% NAME MACHINE VALUE
% SEPARATOR ~
% DIM 7*2
MACHINE NAME~
MACHINE STR~
MACHINE TYPE~
MACHINE DATE_TIME~2019-03-08 16:13:28
MACHINE OPERATOR~
MACHINE AXIS~主轴旋转
WORK AXIS~A轴

% DATABLOCK 2
% GLOBAL R_MATRIX
% TYPE DOUBLE DOUBLE DOUBLE
% NAME r1 r2 r3
% SEPARATOR \\t
% DIM 3*3
0.099266\t-0.172505\t-0.000381
-0.000110\t-0.002194\t0.198544
-0.177277\t-0.100535\t-0.004868

% DATABLOCK 3
% GLOBAL MEASURE
% TYPE STRING DOUBLE
% NAME STATIC INPUT
% SEPARATOR ~
% DIM 5*2
START ANGLE~-90
FINISHED ANGLE~-45
THRESHOLD VALUE~0.003
INTERVAL ANGLE~5
MEASURE POINT NUMBER~10

% DATABLOCK 4
% GLOBAL MEASURE DATA
% TYPE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE DOUBLE
% NAME ANGLE\tX\tY\tZ\tdX\tdY\tdZ
% SEPARATOR \\t
% DIM 10*7
-90.00\t0.0056798027\t-0.0015839521\t-0.0127643766\t0.0056798027\t-0.0015839521\t-0.0127643766
-85.00\t-0.0032665869\t-0.0003916702\t-0.0130962262\t-0.0032665869\t-0.0003916702\t-0.0130962262
-80.00\t0.0024165082\t0.0121720614\t-0.0113663061\t0.0024165082\t0.0121720614\t-0.0113663061
-75.00\t0.0093123199\t0.0190035075\t-0.0068392024\t0.0093123199\t0.0190035075\t-0.0068392024
-70.00\t0.0127821921\t0.0259545150\t-0.0020044104\t0.0127821921\t0.0259545150\t-0.0020044104
-65.00\t0.0147726791\t0.0320689797\t0.0006881977\t0.0147726791\t0.0320689797\t0.0006881977
-60.00\t0.0162760092\t0.0370587062\t0.0043812305\t0.0162760092\t0.0370587062\t0.0043812305
-55.00\t0.0179577350\t0.0373233755\t0.0104525454\t0.0179577350\t0.0373233755\t0.0104525454
-50.00\t0.0164980478\t0.0377601426\t0.0159532972\t0.0164980478\t0.0377601426\t0.0159532972
-45.00\t0.0187136157\t0.0417986723\t0.0185326028\t0.0187136157\t0.0417986723\t0.0185326028
% END OF FILE`;

export const INITIAL_AUDIT_EVENTS: AuditEventItem[] = [
  {
    id: 1,
    time: '2026-09-13 03:37:12',
    source: 'R-test',
    module: '操作',
    event: '开机入口选择：直接进入测量系统',
    level: '信息',
    detail: '操作员进入接触式五轴机床测量工作台 (五轴结构: TT_AC)',
  },
  {
    id: 2,
    time: '2026-09-13 03:36:58',
    source: 'R-test',
    module: '操作',
    event: '鼠标点击：误差测量',
    level: '信息',
    detail: '主菜单切换导航至误差测量模块 (S04/S05)',
  },
  {
    id: 3,
    time: '2026-09-13 03:36:45',
    source: 'R-test',
    module: '操作',
    event: '测量方式：动态误差测量',
    level: '信息',
    detail: '激活多通道动态连续高速采样 (采样频率 50Hz, 转动范围 0°~360°)',
  },
  {
    id: 4,
    time: '2026-09-13 03:36:20',
    source: 'R-test',
    module: '操作',
    event: '鼠标点击：设定转动轴参数',
    level: '信息',
    detail: '设定第一轴 C 轴 (0°~360°), 第二轴 A 轴 (-30°~90°)',
  },
  {
    id: 5,
    time: '2026-09-13 03:35:58',
    source: 'R-test',
    module: '操作',
    event: '测量方式：结构误差测量',
    level: '信息',
    detail: '选择静态步进式几何结构测量 (规划 18 测点, 间隔 20.00°)',
  },
  {
    id: 6,
    time: '2026-09-13 03:35:32',
    source: 'R-test',
    module: '操作',
    event: '鼠标点击：历史测量报告',
    level: '信息',
    detail: '查看归档报告列表, 选中记录: VMG05_C_AXIS_20260913.dat',
  },
  {
    id: 7,
    time: '2026-09-13 03:35:05',
    source: 'R-test',
    module: '操作',
    event: '鼠标点击：文件下载',
    level: '信息',
    detail: '枚举设备 SD 卡存储器 FAT32 根分区, 已检索 12 个文件',
  },
  {
    id: 8,
    time: '2026-09-13 03:34:40',
    source: 'R-test',
    module: '文件',
    event: '历史记录刷新成功',
    level: '信息',
    detail: '完成本地磁盘测量报告检索，成功载入 18 条历史检验记录',
  },
  {
    id: 9,
    time: '2026-09-13 03:33:55',
    source: 'R-test',
    module: '连接',
    event: 'DAQ 状态：心跳正常',
    level: '信息',
    detail: '采集仪心跳维持包交互成功, RSSI: -42dBm, 电池电压: 4.12V',
  },
  {
    id: 10,
    time: '2026-09-13 03:33:10',
    source: 'R-test',
    module: '操作',
    event: '主窗口装配完成',
    level: '信息',
    detail: '系统内核加载完成, 初始化工作站分辨率 1440×900, 刷新率 60Hz',
  },
  {
    id: 11,
    time: '2026-09-13 03:32:18',
    source: 'R-test',
    module: '文件',
    event: '历史记录刷新成功',
    level: '信息',
    detail: '扫描报告存储路径 /reports/vmg/ 完成 (18 个数据文件就绪)',
  },
  {
    id: 12,
    time: '2026-09-13 03:31:05',
    source: 'R-test',
    module: '操作',
    event: '开机入口选择：非接触式校准',
    level: '信息',
    detail: '加载三维 27 点空间网格拟合矩阵与非线性电感校正表',
  },
  {
    id: 13,
    time: '2026-09-13 03:30:12',
    source: 'R-test',
    module: '连接',
    event: '链路建立，握手成功',
    level: '信息',
    detail: 'WiFi TCP Socket 建立, 目标 IP: 192.168.4.1, 端口: 8080',
  },
  {
    id: 14,
    time: '2026-09-13 03:29:45',
    source: 'R-test',
    module: '连接',
    event: '认证通过 (Token: 0x2609009A)',
    level: '信息',
    detail: '仪器安全挑战通过, 序列号: R_test_2609009A 授权状态: 正常',
  },
  {
    id: 15,
    time: '2026-09-13 03:29:02',
    source: 'R-test',
    module: '连接',
    event: '已发送认证握手请求',
    level: '信息',
    detail: '向硬件端点发送 32 字节加密会话证书 (SEQ: 0x01)',
  },
  {
    id: 16,
    time: '2026-09-13 03:28:15',
    source: 'R-test',
    module: '操作',
    event: '鼠标点击：确定原点',
    level: '信息',
    detail: '完成机械球心初定位基准锁定 (L1=1.8600, L2=1.7921, L3=1.8455 mm)',
  },
  {
    id: 17,
    time: '2026-09-13 03:27:30',
    source: 'R-test',
    module: '连接',
    event: '读取SD卡目录成功',
    level: '信息',
    detail: '读取 SD 卡扇区 0x00002000, 检索到 12 个 RAW 测量数据包',
  },
  {
    id: 18,
    time: '2026-09-13 03:26:59',
    source: 'R-test',
    module: '连接',
    event: '连接断开，重连中',
    level: '警告',
    detail: '无线网络信号瞬时抖动, 启动自动指数退避重连机制 (重试 1/3)',
  },
  {
    id: 19,
    time: '2026-09-13 03:25:40',
    source: 'R-test',
    module: '环境',
    event: '环境温度采样：20.2°C',
    level: '信息',
    detail: '计量室环境温度稳定在 20.2°C (偏离标准 20.0°C 仅 +0.2°C, 湿度 48.6% RH)',
  },
  {
    id: 20,
    time: '2026-09-13 03:24:12',
    source: 'R-test',
    module: '标定',
    event: '测头热膨胀线性补偿激活',
    level: '信息',
    detail: '依据 ISO 230-1 计算钢质基体伸长补偿量: +0.035 µm',
  },
  {
    id: 21,
    time: '2026-09-13 03:22:05',
    source: 'R-test',
    module: '操作',
    event: '导出NC代码完成',
    level: '信息',
    detail: '生成五轴联动数控轨迹 G 代码: VMG_C_AXIS_AUTO.NC (512 行)',
  },
  {
    id: 22,
    time: '2026-09-13 03:20:10',
    source: 'Calib-Contact',
    module: '标定',
    event: '6点标定数据计算完成',
    level: '信息',
    detail: '四阶多项式矩阵拟合完成, 标定残差标准差 σ=0.0004 mm',
  },
  {
    id: 23,
    time: '2026-09-13 03:18:22',
    source: 'R-test',
    module: '故障',
    event: '设备故障消除',
    level: '信息',
    detail: '传感器量程警告自动复位, 通道 L1/L2/L3 电压恢复线性区间',
  },
  {
    id: 24,
    time: '2026-09-13 03:15:00',
    source: 'R-test',
    module: '文件',
    event: '下载文件完成：001.DAT',
    level: '信息',
    detail: '从设备 SD 卡下载 001.DAT (2.4 MB) 完成，校验 CRC32: 0x8F9A1B2C',
  },
  {
    id: 25,
    time: '2026-09-13 03:10:45',
    source: 'Calib-NonContact',
    module: '标定',
    event: '27点空间标定数据采集',
    level: '信息',
    detail: 'X(-1,0,1) Y(-1,0,1) Z(-1,0,1) 三维网格数据采样并解算系数 c0~c9',
  },
  {
    id: 26,
    time: '2026-09-13 03:05:12',
    source: 'R-test',
    module: '连接',
    event: 'WiFi 信号微弱告警',
    level: '警告',
    detail: '接收信号强度 RSSI 低于 -78dBm, 建议调整设备天线朝向',
  },
  {
    id: 27,
    time: '2026-09-13 03:00:00',
    source: 'R-test',
    module: '操作',
    event: '操作员安全登录',
    level: '信息',
    detail: '用户 Administrator 登录 R-test 测量系统 v1.0',
  }
];

export const INITIAL_SD_FILES: SdCardFile[] = [
  { id: '1', name: '001.DAT', fatTime: '09-14 03:41', sizeStr: '2.4 MB', bytes: 2516582, status: '已下载' },
  { id: '2', name: '002.DAT', fatTime: '09-14 03:40', sizeStr: '2.4 MB', bytes: 2516582, status: '未下载' },
  { id: '3', name: '003.DAT', fatTime: '09-13 18:02', sizeStr: '1.1 MB', bytes: 1153433, status: '已下载' },
  { id: '4', name: '004.DAT', fatTime: '09-13 14:22', sizeStr: '3.2 MB', bytes: 3355443, status: '未下载' },
  { id: '5', name: '005.DAT', fatTime: '09-12 16:10', sizeStr: '1.8 MB', bytes: 1887436, status: '已下载' },
  { id: '6', name: '006.DAT', fatTime: '09-12 09:05', sizeStr: '2.1 MB', bytes: 2202009, status: '未下载' },
  { id: '7', name: '007.DAT', fatTime: '09-11 15:33', sizeStr: '1.5 MB', bytes: 1572864, status: '未下载' },
  { id: '8', name: '008.DAT', fatTime: '09-10 16:47', sizeStr: '2.9 MB', bytes: 3040870, status: '已下载' },
  { id: '9', name: '009.DAT', fatTime: '09-09 11:20', sizeStr: '0.8 MB', bytes: 838860, status: '未下载' },
  { id: '10', name: '010.DAT', fatTime: '09-08 17:05', sizeStr: '2.6 MB', bytes: 2726297, status: '未下载' },
  { id: '11', name: '011.DAT', fatTime: '09-06 14:15', sizeStr: '1.9 MB', bytes: 1992294, status: '未下载' },
  { id: '12', name: '012.DAT', fatTime: '09-05 10:00', sizeStr: '3.0 MB', bytes: 3145728, status: '已下载' },
  { id: '13', name: 'VMG05_C_AXIS_20260913.DAT', fatTime: '09-13 03:22', sizeStr: '5.8 MB', bytes: 6081740, status: '已下载' },
  { id: '14', name: 'VMG05_A_AXIS_20260913.DAT', fatTime: '09-13 02:45', sizeStr: '4.9 MB', bytes: 5138022, status: '未下载' },
  { id: '15', name: 'CALIB_CONTACT_6P.DAT', fatTime: '09-13 03:20', sizeStr: '1.2 MB', bytes: 1258291, status: '已下载' },
  { id: '16', name: 'CALIB_NONCONTACT_27P.DAT', fatTime: '09-12 11:45', sizeStr: '3.5 MB', bytes: 3670016, status: '已下载' },
  { id: '17', name: 'DYNAMIC_TRAJ_50HZ.RAW', fatTime: '09-11 16:30', sizeStr: '7.4 MB', bytes: 7759462, status: '未下载' },
  { id: '18', name: 'STRUCT_18POINTS_STEP.DAT', fatTime: '09-10 14:10', sizeStr: '2.8 MB', bytes: 2936012, status: '已下载' },
];

export const CONTACT_CALIB_6_POINTS = [
  { index: 1, x: 0.000, y: 0.000, z: 0.000 },
  { index: 2, x: 0.200, y: 0.000, z: 0.000 },
  { index: 3, x: 0.000, y: 0.200, z: 0.000 },
  { index: 4, x: 0.000, y: 0.000, z: 0.200 },
  { index: 5, x: 0.200, y: 0.200, z: 0.000 },
  { index: 6, x: 0.200, y: 0.200, z: 0.200 },
];

export const NON_CONTACT_27_POINTS = Array.from({ length: 27 }, (_, i) => {
  const ix = (i % 3) * 0.1 - 0.1;
  const iy = (Math.floor(i / 3) % 3) * 0.1 - 0.1;
  const iz = Math.floor(i / 9) * 0.1 - 0.1;
  return {
    index: i + 1,
    x: Number(ix.toFixed(3)),
    y: Number(iy.toFixed(3)),
    z: Number(iz.toFixed(3)),
  };
});

// Procedural generator to support 5901 audit events across 119 pages (50 items/page)
const ACTION_POOL: Array<{
  module: AuditEventItem['module'];
  event: string;
  level: AuditEventItem['level'];
  detail: string;
}> = [
  { module: '操作', event: '开机入口选择：直接进入测量系统', level: '信息', detail: '操作员进入接触式五轴机床测量工作台' },
  { module: '操作', event: '鼠标点击：误差测量', level: '信息', detail: '切换主功能工作台至空间几何误差测量模块' },
  { module: '操作', event: '测量方式：动态误差测量', level: '信息', detail: '激活多通道动态连续高速采样 (50 S/s)' },
  { module: '操作', event: '鼠标点击：设定转动轴参数', level: '信息', detail: '设定第一轴 C 轴 (0°~360°), 第二轴 A 轴 (-30°~90°)' },
  { module: '操作', event: '测量方式：结构误差测量', level: '信息', detail: '规划 18 测点静态等角度步进采样' },
  { module: '操作', event: '鼠标点击：历史测量报告', level: '信息', detail: '调取本地归档数据库' },
  { module: '操作', event: '鼠标点击：文件下载', level: '信息', detail: '枚举采集仪 SD 卡存储器 FAT32 分区' },
  { module: '文件', event: '历史记录刷新成功', level: '信息', detail: '完成本地磁盘测量报告检索，成功载入 18 条记录' },
  { module: '连接', event: 'DAQ 状态：采样正常', level: '信息', detail: '采样率 25 S/s, 信号强度 -42dBm, 电池 4.12V' },
  { module: '操作', event: '主窗口装配完成', level: '信息', detail: '系统内核加载完成, 初始化工作站分辨率 1440×900' },
  { module: '操作', event: '开机入口选择：非接触式校准', level: '信息', detail: '加载三维 27 点空间网格拟合矩阵' },
  { module: '连接', event: '链路建立，握手成功', level: '信息', detail: 'TCP Socket 建立, 目标 IP: 192.168.4.1 端口: 8080' },
  { module: '连接', event: '认证通过 (Token: 0x2609009A)', level: '信息', detail: '硬件密钥认证通过, 序列号 R_test_2609009A' },
  { module: '连接', event: '已发送认证握手请求', level: '信息', detail: '向硬件端点发送 32 字节会话证书 (SEQ: 0x01)' },
  { module: '操作', event: '鼠标点击：确定原点', level: '信息', detail: '原点标定锁定成功 (L1=1.8600, L2=1.7921, L3=1.8455 mm)' },
  { module: '连接', event: '读取SD卡目录成功', level: '信息', detail: '成功枚举 12 个 RAW 测量数据包' },
  { module: '连接', event: '连接断开，重连中', level: '警告', detail: '无线网络信号瞬时抖动, 启动自动指数退避重连' },
  { module: '环境', event: '环境温度采样：20.2°C', level: '信息', detail: '计量室温度稳定 (偏离基准 20.0°C +0.2°C, 湿度 48.6% RH)' },
  { module: '标定', event: '测头热膨胀线性补偿激活', level: '信息', detail: '依据 ISO 230-1 计算钢质基体伸长补偿量: +0.035 µm' },
  { module: '操作', event: '导出NC代码完成', level: '信息', detail: '生成五轴联动轨迹 G 代码: VMG_C_AXIS_AUTO.NC' },
  { module: '标定', event: '6点标定数据计算完成', level: '信息', detail: '四阶多项式拟合完成, 残差标准差 σ=0.0004 mm' },
  { module: '故障', event: '设备故障消除', level: '信息', detail: '传感器量程警告自动复位, 通道电压恢复线性区间' },
  { module: '文件', event: '下载文件完成：001.DAT', level: '信息', detail: '从设备 SD 卡下载 001.DAT (2.4 MB) 校验通过' },
  { module: '标定', event: '27点空间标定数据采集', level: '信息', detail: '空间网格数据采样并解算多项式系数 c0~c9' },
  { module: '连接', event: 'WiFi 信号微弱告警', level: '警告', detail: '接收信号强度 RSSI 低于 -78dBm' },
  { module: '故障', event: 'SD卡空间低于15%预警', level: '警告', detail: 'SD卡可用空间 4.2 GB / 32 GB, 建议及时归档清理' },
];

export function generateFullAuditEvents(): AuditEventItem[] {
  const list: AuditEventItem[] = [...INITIAL_AUDIT_EVENTS];
  const targetCount = 5901;
  const baseTime = new Date('2026-09-13T03:26:00Z').getTime();

  for (let i = INITIAL_AUDIT_EVENTS.length; i < targetCount; i++) {
    const template = ACTION_POOL[i % ACTION_POOL.length];
    // Each event spaced back by 15~120 seconds
    const timeMs = baseTime - (i * 45000);
    const d = new Date(timeMs);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
    
    list.push({
      id: i + 1,
      time: timeStr,
      source: 'R-test',
      module: template.module,
      event: template.event,
      level: '信息',
      detail: template.detail,
    });
  }

  return list;
}

