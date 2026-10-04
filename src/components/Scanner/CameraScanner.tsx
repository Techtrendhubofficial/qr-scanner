import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
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
} from 'lucide-react';
import { QRItem, ScannerSettings } from '../../types';
import { parseQRContent } from '../../utils/qrParser';
import { playScanBeep, triggerHaptic } from '../../utils/audio';

interface CameraScannerProps {
  onScanSuccess: (item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  onSwitchToAlbum: () => void;
  settings: ScannerSettings;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanSuccess,
  onSwitchToAlbum,
  settings,
  isPro,
  onOpenPricing,
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

  const lastScannedTextRef = useRef<string | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
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
        setErrorMessage('No camera device detected on this hardware. Try "Scan from Album" to test QR decoding.');
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

  // QR Processing Loop
  const scanLoop = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth',
      });

      if (code && code.data) {
        const text = code.data.trim();
        const now = Date.now();

        // Throttle repeated triggers of same QR
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
            category: parsed.category,
            title: parsed.title,
            content: parsed.displayValue,
            rawText: text,
            metadata: parsed.metadata,
          });

          if (continuousMode) {
            setRecentScanNotice(`Scanned: ${parsed.title}`);
            setTimeout(() => setRecentScanNotice(null), 2000);
          }
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(scanLoop);
  }, [continuousMode, soundEnabled, settings.vibrate, onScanSuccess]);

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
      // Highlight VIP / Trial feature
      onOpenPricing();
      return;
    }
    setContinuousMode(!continuousMode);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[500px] h-[calc(100vh-130px)] md:h-[620px] bg-slate-950 overflow-hidden rounded-2xl border border-slate-800">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />

      {/* Viewfinder Target Frame */}
      {hasPermission && (
        <div className="relative z-10 flex flex-col items-center pointer-events-none">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-emerald-500/30 rounded-3xl overflow-hidden backdrop-brightness-105 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />

            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[scanLaser_2.2s_ease-in-out_infinite]" />

            {/* Subtle Crosshair in Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <div className="w-6 h-[1.5px] bg-white" />
              <div className="h-6 w-[1.5px] bg-white absolute" />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-300/90 tracking-wide bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/50">
            Align QR or Barcode within frame
          </p>
        </div>
      )}

      {/* Continuous Scan Toast Indicator */}
      {recentScanNotice && (
        <div className="absolute top-16 z-30 flex items-center gap-2 rounded-full bg-emerald-500/90 text-slate-950 font-semibold px-4 py-1.5 text-xs shadow-lg animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span className="truncate max-w-xs">{recentScanNotice}</span>
        </div>
      )}

      {/* Permission Denied or Hardware Missing State */}
      {hasPermission === false && (
        <div className="relative z-20 flex flex-col items-center max-w-md p-6 mx-4 text-center rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Camera Unavailable</h3>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            {errorMessage || 'Unable to access hardware camera.'}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 w-full">
            <button
              onClick={onSwitchToAlbum}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 px-4 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition"
            >
              <ImageIcon className="w-4 h-4" />
              Scan from Album (Photo)
            </button>
            <button
              onClick={startCamera}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-4 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Camera
            </button>
          </div>
        </div>
      )}

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Batch Mode toggle button */}
        <button
          onClick={toggleContinuousMode}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-md border transition ${
            continuousMode
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-900/70 border-slate-700/60 text-slate-300 hover:text-white'
          }`}
          title="Continuous Batch Scanning"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Batch Scan</span>
          {!isPro && (
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/20 px-1 rounded">
              VIP
            </span>
          )}
        </button>

        {/* Audio Beep Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition ${
            soundEnabled
              ? 'bg-slate-900/70 border-slate-700/60 text-slate-200'
              : 'bg-slate-900/70 border-slate-700/60 text-slate-500'
          }`}
          title={soundEnabled ? 'Mute beep sound' : 'Enable beep sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-4 px-4 pointer-events-auto">
        {/* Flashlight button */}
        {hasTorch && (
          <button
            onClick={toggleTorch}
            className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md border transition shadow-lg ${
              torchOn
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/30'
                : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
            title={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
          >
            {torchOn ? <Flashlight className="w-5 h-5 fill-current" /> : <FlashlightOff className="w-5 h-5" />}
          </button>
        )}

        {/* Scan from Album Quick Button */}
        <button
          onClick={onSwitchToAlbum}
          className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 hover:border-emerald-500/50 py-2.5 px-5 text-xs font-semibold text-slate-100 backdrop-blur-md shadow-lg hover:bg-slate-800 transition active:scale-95"
        >
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span>Scan from Album</span>
        </button>

        {/* Flip Camera Button */}
        <button
          onClick={flipCamera}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-slate-200 hover:bg-slate-800 backdrop-blur-md transition shadow-lg active:rotate-180 duration-300"
          title="Switch front / rear camera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
