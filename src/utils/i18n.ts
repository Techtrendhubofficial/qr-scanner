export type Language = 'en' | 'zh';

export interface Translations {
  // Navigation
  brand: string;
  scanTab: string;
  albumTab: string;
  generateTab: string;
  historyTab: string;
  vipTab: string;

  // Bottom Nav
  navScan: string;
  navCreate: string;
  navHistory: string;
  navAlbum: string;

  // Scanner
  scanQrMode: string;
  scanOcrMode: string;
  scanHint: string;
  torchOn: string;
  torchOff: string;
  soundEnabled: string;
  soundDisabled: string;
  continuousOn: string;
  continuousOff: string;
  continuousTooltip: string;
  cameraPermissionTitle: string;
  cameraError: string;
  retryPermission: string;
  useAlbum: string;
  switchCamera: string;
  resumeScan: string;

  // Results
  scanSuccess: string;
  copyText: string;
  copied: string;
  openUrl: string;
  scannedAt: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brand: 'Pavilion QR Pro',
    scanTab: 'Scan QR',
    albumTab: 'Album Scan',
    generateTab: 'Create QR',
    historyTab: 'History',
    vipTab: 'Pro Features',

    navScan: 'Scan',
    navCreate: 'Create',
    navHistory: 'History',
    navAlbum: 'Album',

    scanQrMode: 'Live Camera',
    scanOcrMode: 'Album Image',
    scanHint: 'Align QR code or barcode inside the frame',
    torchOn: 'Turn Off Flashlight',
    torchOff: 'Turn On Flashlight',
    soundEnabled: 'Beep Sound: ON',
    soundDisabled: 'Beep Sound: OFF',
    continuousOn: 'Continuous: ON',
    continuousOff: 'Continuous: OFF',
    continuousTooltip: 'Continuous scan mode (auto-scan without pausing)',
    cameraPermissionTitle: 'Camera Permission Required',
    cameraError: 'Unable to access camera. Please allow camera permission in your browser or app settings.',
    retryPermission: 'Retry Camera',
    useAlbum: 'Scan from Album',
    switchCamera: 'Flip Camera',
    resumeScan: 'Scan Again',

    scanSuccess: 'Scan Successful',
    copyText: 'Copy',
    copied: 'Copied!',
    openUrl: 'Open Link',
    scannedAt: 'Scanned at',
  },
  zh: {
    brand: 'Pavilion QR Pro',
    scanTab: '极速扫码',
    albumTab: '相册识别',
    generateTab: '制作二维码',
    historyTab: '历史与导出',
    vipTab: '会员配套',

    navScan: '扫码',
    navCreate: '制作',
    navHistory: '历史',
    navAlbum: '相册',

    scanQrMode: '实时扫码',
    scanOcrMode: '相册选图',
    scanHint: '将二维码 / 条码放入框内，即可毫秒自动识别',
    torchOn: '关闭手电筒',
    torchOff: '开启手电筒',
    soundEnabled: '提示音已开启',
    soundDisabled: '提示音已关闭',
    continuousOn: '连续扫码: 开',
    continuousOff: '连续扫码: 关',
    continuousTooltip: '连续扫码模式（无需关闭弹窗自动识别）',
    cameraPermissionTitle: '需要相机权限',
    cameraError: '无法访问后置摄像头，请在浏览器权限设置中允许“相机”权限。',
    retryPermission: '重新请求授权',
    useAlbum: '改用相册选图',
    switchCamera: '切换前后摄像头',
    resumeScan: '继续扫码',

    scanSuccess: '识别成功',
    copyText: '复制内容',
    copied: '已复制！',
    openUrl: '打开网址',
    scannedAt: '扫描时间',
  },
};
