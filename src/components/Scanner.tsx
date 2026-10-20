import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { 
  Flashlight, 
  FlashlightOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Image as ImageIcon,
  Sparkles,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { ScanItem } from '../types';

interface ScannerProps {
  onScanResult: (result: ScanItem) => void;
  onOpenAlbum: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanResult, onOpenAlbum }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [continuousScan, setContinuousScan] = useState<boolean>(false);
  const [scanMode, setScanMode] = useState<'qr' | 'ocr'>('qr');

  const [scannedItem, setScannedItem] = useState<ScanItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isScanningRef = useRef<boolean>(true);
  const lastScannedContentRef = useRef<string>('');
  const lastScannedTimeRef = useRef<number>(0);

  // Play crisp synthetic beep using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Start Camera
  const startCamera = async () => {
    stopCamera();
    try {
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setHasPermission(true);

      // Check torch support
      const track = stream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities && track.getCapabilities()) as { torch?: boolean } | undefined;
        setHasTorch(Boolean(capabilities?.torch));
      }
    } catch (err: unknown) {
      console.error('Camera error:', err);
      setHasPermission(false);
      setErrorMessage('无法访问后置摄像头，请在浏览器权限设置中允许“相机”权限。');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  // Toggle Torch
  const toggleTorch = async () => {
    if (!mediaStreamRef.current) return;
    const track = mediaStreamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const next = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: next } as unknown as MediaTrackConstraintSet],
        });
        setTorchOn(next);
      } catch {
        // Torch constraint error
      }
    }
  };

  // Switch Camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  // Scanning Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (
        isScanningRef.current &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data.trim()) {
            const now = Date.now();
            const content = code.data.trim();

            // Throttle duplicate scans within 2 seconds
            if (content !== lastScannedContentRef.current || now - lastScannedTimeRef.current > 2000) {
              lastScannedContentRef.current = content;
              lastScannedTimeRef.current = now;

              // Vibrate
              if (navigator.vibrate) {
                try { navigator.vibrate(80); } catch {}
              }
              playBeep();

              const category = content.startsWith('http://') || content.startsWith('https://')
                ? 'url'
                : content.startsWith('WIFI:')
                ? 'wifi'
                : content.startsWith('tel:')
                ? 'phone'
                : 'text';

              const newItem: ScanItem = {
                id: 'scan_' + Date.now(),
                type: 'qr',
                content,
                timestamp: Date.now(),
                category,
              };

              onScanResult(newItem);
              setScannedItem(newItem);

              if (!continuousScan) {
                isScanningRef.current = false;
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [soundEnabled, continuousScan, onScanResult]);

  const handleCopy = () => {
    if (!scannedItem) return;
    navigator.clipboard.writeText(scannedItem.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resumeScanning = () => {
    setScannedItem(null);
    isScanningRef.current = true;
    lastScannedContentRef.current = '';
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] flex flex-col items-center justify-between overflow-hidden bg-black select-none">
      
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video stream */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        autoPlay
        playsInline
      />

      {/* Dark overlay backdrop with clear viewfinder window */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Top Floating Pill: Mode Selector */}
      <div className="relative z-10 pt-3 sm:pt-4 px-4 w-full flex justify-center">
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg">
          <button
            onClick={() => setScanMode('qr')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              scanMode === 'qr'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            QR / 条码扫码
          </button>
          <button
            onClick={() => {
              setScanMode('ocr');
              onOpenAlbum();
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              scanMode === 'ocr'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            OCR 拍照识字
          </button>
        </div>
      </div>

      {/* Central Viewfinder Focus Frame */}
      <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 my-auto flex items-center justify-center">
        {/* Frame Box */}
        <div className="relative w-full h-full rounded-2xl border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
          
          {/* Animated Scanning Laser Line */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-laser" />

          {/* 4 Corner Accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
        </div>

        {/* Viewfinder helper text */}
        <div className="absolute -bottom-8 text-center text-xs text-slate-300 font-medium drop-shadow bg-black/40 px-3 py-1 rounded-full border border-slate-700/50 backdrop-blur-sm">
          将二维码 / 条码放入框内，即可毫秒自动识别
        </div>
      </div>

      {/* Permission Error Banner */}
      {hasPermission === false && (
        <div className="relative z-20 m-4 p-4 rounded-xl bg-red-950/90 border border-red-500/50 text-white max-w-md text-xs sm:text-sm space-y-2 backdrop-blur-md">
          <div className="flex items-center gap-2 font-bold text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>相机权限受限</span>
          </div>
          <p className="text-slate-200">{errorMessage}</p>
          <div className="pt-2 flex gap-2">
            <button
              onClick={startCamera}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs"
            >
              重新请求授权
            </button>
            <button
              onClick={onOpenAlbum}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
            >
              改用相册选图
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 pb-20 md:pb-6 px-4 w-full flex justify-center">
        <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-slate-900/85 backdrop-blur-lg border border-slate-700/60 shadow-xl">
          
          {/* Flashlight */}
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={`p-2.5 rounded-xl transition-all ${
                torchOn
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
              title="手电筒补光"
            >
              {torchOn ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
            </button>
          )}

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl transition-all ${
              soundEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800/80 text-slate-400'
            }`}
            title={soundEnabled ? '提示音已开启' : '提示音已关闭'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Continuous scan toggle */}
          <button
            onClick={() => setContinuousScan(!continuousScan)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              continuousScan
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:text-white'
            }`}
            title="连续扫码模式（无需关闭弹窗自动识别）"
          >
            连续扫码: {continuousScan ? '开' : '关'}
          </button>

          {/* Flip camera */}
          <button
            onClick={switchCamera}
            className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition-all"
            title="切换前后摄像头"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Album direct picker */}
          <button
            onClick={onOpenAlbum}
            className="p-2.5 rounded-xl bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40 border border-emerald-500/30 transition-all flex items-center gap-1"
            title="从相册识别二维码"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scanned Result Drawer / Popup */}
      {scannedItem && !continuousScan && (
        <div className="absolute inset-x-0 bottom-16 md:bottom-4 z-30 px-3 sm:px-6 flex justify-center animate-in slide-in-from-bottom duration-200">
          <div className="w-full max-w-lg p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-xl shadow-2xl text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>识别成功</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {scannedItem.category}
                </span>
              </div>
              <button
                onClick={resumeScanning}
                className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md"
              >
                继续扫码
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-xs sm:text-sm font-mono break-all max-h-28 overflow-y-auto select-all text-slate-200">
              {scannedItem.content}
            </div>

            <div className="flex items-center gap-2 pt-1">
              {scannedItem.category === 'url' && (
                <a
                  href={scannedItem.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>打开网址</span>
                </a>
              )}
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已复制！' : '复制内容'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
