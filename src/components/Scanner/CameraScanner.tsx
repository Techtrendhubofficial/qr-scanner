import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Smartphone,
  ArrowRight,
  ScanText,
  FileText,
  Barcode,
  Loader2,
} from 'lucide-react';
import { QRItem, ScannerSettings } from '../../types';
import { parseQRContent } from '../../utils/qrParser';
import { playScanBeep, triggerHaptic } from '../../utils/audio';
import { getStripeCheckoutUrl, hasValidStripeLink, redirectToStripe } from '../../utils/stripe';
import { decodeCodeFromCanvas, performImageOCR } from '../../utils/universalScanner';

interface CameraScannerProps {
  onScanSuccess: (item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  onSwitchToAlbum: () => void;
  settings: ScannerSettings;
  isPro: boolean;
  onOpenPricing: () => void;
  scanCount?: number;
  onTriggerPaywall?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanSuccess,
  onSwitchToAlbum,
  settings,
  isPro,
  onOpenPricing,
  scanCount = 0,
  onTriggerPaywall,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [continuousMode, setContinuousMode] = useState(settings.continuousScan);
  const [recentScanNotice, setRecentScanNotice] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(settings.beepSound);

  // Mode: QR / Barcode live scanner VS. OCR photo text recognition
  const [cameraMode, setCameraMode] = useState<'code' | 'ocr'>('code');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const lastScannedTextRef = useRef<string | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const isDecodingRef = useRef<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera
  const startCamera = useCallback(async () => {
    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      setErrorMessage(null);
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setHasPermission(true);

      // Check for torch capability
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities ? (videoTrack.getCapabilities() as { torch?: boolean }) : {};
        setHasTorch(Boolean(capabilities?.torch));
      }
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      setHasPermission(false);
      const errName = (err as Error)?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser or use "Scan from Album".');
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setErrorMessage('No camera device detected on this hardware. Try "Scan from Album" to test decoding.');
      } else {
        setErrorMessage('Unable to initialize live video stream. You can upload or drop images via "Scan from Album".');
      }
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [startCamera]);

  // Real-time Barcode & QR Processing Loop
  const scanLoop = useCallback(async () => {
    // Only run real-time decoding when in 'code' mode
    if (cameraMode !== 'code') {
      animFrameIdRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    if (!videoRef.current || !canvasRef.current || isDecodingRef.current) {
      animFrameIdRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check ready state safely
    if ((video.readyState >= 2 || video.currentTime > 0) && video.videoWidth > 0) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        isDecodingRef.current = true;
        try {
          const detected = await decodeCodeFromCanvas(canvas);
          if (detected && detected.text) {
            const text = detected.text.trim();
            const now = Date.now();

            // 4th scan check: block scanning if limit reached and not pro
            if (!isPro && scanCount >= 3) {
              if (now - lastScannedTimeRef.current > 2500) {
                lastScannedTimeRef.current = now;
                onTriggerPaywall?.();
              }
              isDecodingRef.current = false;
              animFrameIdRef.current = requestAnimationFrame(scanLoop);
              return;
            }

            const isSameCode = lastScannedTextRef.current === text;
            const cooldown = isSameCode ? 2500 : 800;

            if (now - lastScannedTimeRef.current > cooldown) {
              lastScannedTextRef.current = text;
              lastScannedTimeRef.current = now;

              if (soundEnabled) {
                playScanBeep();
              }
              if (settings.vibrate) {
                triggerHaptic();
              }

              const parsed = parseQRContent(text);
              onScanSuccess({
                type: 'scan',
                source: 'camera',
                category: parsed.category === 'text' && detected.format.includes('BARCODE') ? 'barcode' : parsed.category,
                title: detected.format && detected.format !== 'QR_CODE' ? `${detected.format}: ${parsed.title}` : parsed.title,
                content: parsed.displayValue,
                rawText: text,
                metadata: {
                  Format: detected.format,
                  ...parsed.metadata,
                },
              });

              if (continuousMode) {
                setRecentScanNotice(`Scanned: ${parsed.title}`);
                setTimeout(() => setRecentScanNotice(null), 2000);
              }
            }
          }
        } catch {
          // ignore frame errors
        } finally {
          isDecodingRef.current = false;
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanLoop);
  }, [cameraMode, continuousMode, soundEnabled, settings.vibrate, isPro, scanCount, onScanSuccess, onTriggerPaywall]);

  useEffect(() => {
    if (hasPermission) {
      animFrameIdRef.current = requestAnimationFrame(scanLoop);
    }
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [hasPermission, scanLoop]);

  // Snap photo and run OCR Text Recognition
  const handleSnapOCR = async () => {
    if (!videoRef.current || !canvasRef.current || isOcrProcessing) return;

    // Check free limit
    if (!isPro && scanCount >= 3) {
      onTriggerPaywall?.();
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setIsOcrProcessing(true);
    triggerHaptic();

    try {
      const ocr = await performImageOCR(canvas);
      setIsOcrProcessing(false);

      if (ocr && ocr.text.trim().length > 0) {
        playScanBeep();
        const parsed = parseQRContent(ocr.text);
        onScanSuccess({
          type: 'ocr',
          source: 'camera',
          category: parsed.category === 'invoice' ? 'invoice' : 'ocr',
          title: parsed.category === 'invoice' ? parsed.title : `OCR Photo Text (${ocr.wordCount} words)`,
          content: parsed.category === 'invoice' ? parsed.displayValue : (ocr.text.length > 120 ? ocr.text.slice(0, 120) + '...' : ocr.text),
          rawText: ocr.text,
          metadata: {
            ...parsed.metadata,
            Confidence: `${ocr.confidence}%`,
            Words: String(ocr.wordCount),
            Lines: String(ocr.lineCount),
            Engine: 'Tesseract OCR (On-Device Sandbox)',
          },
        });
      } else {
        alert('未在画面中识别到清晰文字，请将镜头对准清晰印刷文本或文档。');
      }
    } catch (err) {
      console.warn('OCR error:', err);
      setIsOcrProcessing(false);
      alert('OCR 识别失败，请重试。');
    }
  };

  // Toggle Torch
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const next = !torchOn;
      await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
        advanced: [{ torch: next }],
      });
      setTorchOn(next);
    } catch {
      // Hardware constraint failed
    }
  };

  // Flip Camera
  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Toggle Continuous / Batch Mode
  const toggleContinuousMode = () => {
    if (!isPro && !continuousMode) {
      onOpenPricing();
      return;
    }
    setContinuousMode(!continuousMode);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[500px] h-[calc(100vh-130px)] md:h-[620px] bg-black overflow-hidden rounded-2xl border border-zinc-800">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          hasPermission ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Camera Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

      {/* Top Engine Mode Switcher Bar */}
      {hasPermission && (
        <div className="absolute top-3 inset-x-0 z-30 flex items-center justify-center px-4 pointer-events-auto">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/85 backdrop-blur-md border border-zinc-800 shadow-xl">
            <button
              type="button"
              onClick={() => setCameraMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                cameraMode === 'code'
                  ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Barcode className="w-3.5 h-3.5" />
              <span>QR / 条码扫码</span>
            </button>

            <button
              type="button"
              onClick={() => setCameraMode('ocr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                cameraMode === 'ocr'
                  ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>OCR 拍照识字</span>
            </button>
          </div>
        </div>
      )}

      {/* Viewfinder Target Frame */}
      {hasPermission && (
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-[#00ff88]/30 rounded-3xl overflow-hidden backdrop-brightness-105 shadow-[0_0_50px_rgba(0,255,136,0.15)] flex flex-col items-center justify-center">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00ff88] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00ff88] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00ff88] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00ff88] rounded-br-2xl" />

            {!isPro && scanCount >= 3 ? (
              /* Blocked Locked Paywall Screen */
              <div className="absolute inset-0 bg-black/95 backdrop-blur-md p-4 sm:p-5 flex flex-col items-center justify-center text-center space-y-3 z-20 pointer-events-auto">
                <div className="h-12 w-12 rounded-2xl bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.25)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white">Free Limit Reached (3/3)</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Please upgrade to unlock unlimited scanning</p>
                </div>

                {/* Primary Button */}
                <div className="w-full space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (hasValidStripeLink()) {
                        redirectToStripe('annual', 59);
                      } else if (onTriggerPaywall) {
                        onTriggerPaywall();
                      } else {
                        onOpenPricing();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] hover:bg-[#33ff9f] py-3.5 px-4 text-sm font-black text-black shadow-[0_0_25px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
                  >
                    <span className="text-base">🔓</span>
                    <span>立即开通年度 VIP (US$59 / 年)</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerPaywall?.()}
                    className="w-full text-center text-xs text-zinc-400 hover:text-[#00ff88] py-1 transition underline"
                  >
                    查看 VIP 会员特权与方案 ➔
                  </button>
                </div>
              </div>
            ) : isOcrProcessing ? (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md p-4 flex flex-col items-center justify-center text-center space-y-2.5 z-20">
                <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
                <h4 className="text-sm font-bold text-white">OCR 文字识别中...</h4>
                <p className="text-[11px] text-zinc-400">正在分析提取画面中的所有文字</p>
              </div>
            ) : (
              <>
                {/* Animated Laser Scanning Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_15px_#00ff88] animate-[scanLaser_2.2s_ease-in-out_infinite]" />

                {/* Subtle Crosshair in Center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25">
                  <div className="w-6 h-[1.5px] bg-white" />
                  <div className="h-6 w-[1.5px] bg-white absolute" />
                </div>
              </>
            )}
          </div>

          {!isPro && scanCount < 3 ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#00ff88] bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#00ff88]/30">
                免费试用剩余: <strong className="text-white">{3 - scanCount}</strong> 次
              </span>
            </div>
          ) : (
            <p className="mt-3 text-xs font-medium text-zinc-300 tracking-wide bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800">
              {cameraMode === 'ocr' ? '将文本置于框内并点击下方拍照' : 'Align QR or Barcode within frame'}
            </p>
          )}
        </div>
      )}

      {/* OCR Snap Shutter Button (Visible in OCR Mode) */}
      {hasPermission && cameraMode === 'ocr' && (!isPro && scanCount >= 3 ? null : (
        <div className="absolute bottom-20 z-30 flex items-center justify-center w-full">
          <button
            type="button"
            onClick={handleSnapOCR}
            disabled={isOcrProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#00ff88] hover:bg-[#33ff9f] text-black font-black text-sm shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>拍照识别文字</span>
          </button>
        </div>
      ))}

      {/* Continuous Scan Toast Indicator */}
      {recentScanNotice && (
        <div className="absolute top-16 z-30 flex items-center gap-2 rounded-full bg-[#00ff88] text-black font-bold px-4 py-1.5 text-xs shadow-lg animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span className="truncate max-w-xs">{recentScanNotice}</span>
        </div>
      )}

      {/* Permission Denied or Hardware Missing State */}
      {hasPermission === false && (
        <div className="relative z-20 flex flex-col items-center max-w-md p-6 mx-4 text-center rounded-2xl bg-zinc-950 border border-zinc-800 backdrop-blur-md shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Camera Unavailable</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            {errorMessage || 'Unable to access hardware camera.'}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              onClick={onSwitchToAlbum}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#00ff88] py-2.5 px-4 text-xs font-bold text-black shadow-md shadow-[#00ff88]/20 hover:bg-[#33ff9f] transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Scan from Album / Gallery</span>
            </button>
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 py-2.5 px-4 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Permission</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {hasPermission && (
        <div className="absolute bottom-4 z-20 flex items-center justify-between w-[92%] max-w-md px-4 py-2.5 rounded-2xl bg-black/85 border border-zinc-800 backdrop-blur-lg shadow-xl">
          {/* Torch toggle */}
          <button
            onClick={toggleTorch}
            disabled={!hasTorch}
            className={`p-2 rounded-xl transition ${
              torchOn
                ? 'bg-[#00ff88] text-black shadow-md shadow-[#00ff88]/30'
                : hasTorch
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title={hasTorch ? (torchOn ? 'Flashlight On' : 'Flashlight Off') : 'Torch unavailable'}
          >
            {torchOn ? <Flashlight className="w-4 h-4" /> : <FlashlightOff className="w-4 h-4" />}
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition ${
              soundEnabled
                ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={soundEnabled ? 'Mute beep' : 'Enable beep sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00ff88]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Continuous Scan mode */}
          <button
            onClick={toggleContinuousMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
              continuousMode
                ? 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
            title="Continuous batch scanning without pause"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Batch</span>
          </button>

          {/* Camera flip */}
          <button
            onClick={flipCamera}
            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition"
            title="Switch front/back camera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Album direct shortcut */}
          <button
            onClick={onSwitchToAlbum}
            className="p-2 text-zinc-300 hover:text-[#00ff88] hover:bg-zinc-800 rounded-xl transition"
            title="Scan from album photo"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
