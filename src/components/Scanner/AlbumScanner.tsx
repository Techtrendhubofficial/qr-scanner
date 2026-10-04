import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileSearch,
  Sparkles,
  Wifi,
  ExternalLink,
  User,
  Tag,
  Loader2,
} from 'lucide-react';
import { QRItem } from '../../types';
import { parseQRContent } from '../../utils/qrParser';
import { playScanBeep, triggerHaptic } from '../../utils/audio';

interface AlbumScannerProps {
  onScanSuccess: (item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  onSwitchToCamera: () => void;
}

interface SamplePreset {
  id: string;
  name: string;
  type: string;
  icon: typeof Wifi;
  payload: string;
  description: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'wifi-coffee',
    name: 'Café Wi-Fi Access',
    type: 'Wi-Fi',
    icon: Wifi,
    payload: 'WIFI:S:BlueBottle_Coffee_Guest;T:WPA;P:CoffeeBeans2026;H:false;;',
    description: 'Connects directly to guest Wi-Fi network',
  },
  {
    id: 'store-url',
    name: 'Google Play Store',
    type: 'Website',
    icon: ExternalLink,
    payload: 'https://play.google.com/store/apps/details?id=com.scancraft.qr',
    description: 'Official verified Play Store landing page',
  },
  {
    id: 'vcard-ceo',
    name: 'Executive Contact',
    type: 'vCard',
    icon: User,
    payload:
      'BEGIN:VCARD\nVERSION:3.0\nFN:Elena Rostova\nORG:Apex Global Dynamics\nTITLE:Chief Technology Officer\nTEL:+1-415-555-0143\nEMAIL:elena.r@apex-dynamics.io\nURL:https://apex-dynamics.io\nEND:VCARD',
    description: 'Full business contact with email, phone, and title',
  },
  {
    id: 'promo-coupon',
    name: 'VIP $49 Promo Voucher',
    type: 'Voucher',
    icon: Tag,
    payload: 'SCANCRAFT_VOUCHER:PLAYSTORE49:DISCOUNT_26_PERCENT:VALID_2026',
    description: 'Exclusive Google Play Store 26% discount voucher',
  },
];

export const AlbumScanner: React.FC<AlbumScannerProps> = ({
  onScanSuccess,
  onSwitchToCamera,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [detectedBox, setDetectedBox] = useState<{
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  } | null>(null);

  // Decode Image using Canvas and jsQR with multi-pass contrast
  const processImageElement = (img: HTMLImageElement) => {
    setIsProcessing(true);
    setErrorStatus(null);
    setDetectedBox(null);

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      setIsProcessing(false);
      setErrorStatus('Failed to initialize 2D decoding canvas.');
      return;
    }

    // Set dimensions with max limit to keep high-res photos responsive
    const maxDim = 1600;
    let w = img.naturalWidth || img.width;
    let h = img.naturalHeight || img.height;

    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);

    // Pass 1: Standard read
    let imageData = ctx.getImageData(0, 0, w, h);
    let code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });

    // Pass 2: High contrast enhancement if pass 1 fails
    if (!code) {
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Simple binarization/contrast boost
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const val = avg > 128 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      code = jsQR(data, w, h, { inversionAttempts: 'attemptBoth' });
    }

    setIsProcessing(false);

    if (code && code.data) {
      playScanBeep();
      triggerHaptic();

      // Store detected location box
      setDetectedBox({
        topLeft: code.location.topLeftCorner,
        bottomRight: code.location.bottomRightCorner,
      });

      const parsed = parseQRContent(code.data.trim());
      onScanSuccess({
        type: 'scan',
        source: 'album',
        category: parsed.category,
        title: parsed.title,
        content: parsed.displayValue,
        rawText: code.data.trim(),
        metadata: parsed.metadata,
      });
    } else {
      setErrorStatus('No recognizable QR code or barcode detected in this image. Ensure the code is sharp and not glare-obscured.');
    }
  };

  // Handle uploaded file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorStatus('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewImage(dataUrl);

      const img = new Image();
      img.onload = () => processImageElement(img);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreviewImage(dataUrl);
        const img = new Image();
        img.onload = () => processImageElement(img);
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // Load a simulated sample preset QR
  const handleLoadSample = async (preset: SamplePreset) => {
    setIsProcessing(true);
    setErrorStatus(null);
    try {
      const dataUrl = await QRCode.toDataURL(preset.payload, {
        width: 600,
        margin: 3,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setPreviewImage(dataUrl);

      const img = new Image();
      img.onload = () => processImageElement(img);
      img.src = dataUrl;
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setErrorStatus('Failed to generate test sample.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl bg-slate-900/60 hover:bg-slate-900/90 transition-all p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px] overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewImage ? (
          <div className="relative max-h-72 w-full flex items-center justify-center">
            <img
              src={previewImage}
              alt="Uploaded photo preview"
              className="max-h-72 rounded-2xl object-contain shadow-2xl border border-slate-800"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/70 rounded-2xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-xs font-semibold text-slate-200">
                  Scanning image pixels...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">
                Upload Photo from Album
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                Click or drag & drop screenshots, saved photos, posters, or packaging images containing a QR code or barcode.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>JPG</span>
              <span aria-hidden="true">·</span>
              <span>PNG</span>
              <span aria-hidden="true">·</span>
              <span>WebP</span>
              <span aria-hidden="true">·</span>
              <span>Screenshots</span>
            </div>
          </div>
        )}

        {previewImage && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Choose Another Image
            </button>
          </div>
        )}
      </div>

      {/* Error Message if scan failed */}
      {errorStatus && (
        <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 p-4 text-xs text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-slate-200">Decoding Notice</span>
            <p className="mt-0.5 text-rose-300/90">{errorStatus}</p>
          </div>
        </div>
      )}

      {/* Sample Album Photos Section (Crucial for Instant Testing) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Try Sample QR Codes from Album</span>
          </div>
          <span className="text-[11px] text-slate-400">1-click test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => handleLoadSample(preset)}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-850 hover:border-emerald-500/40 text-left transition group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition">
                  <Icon className="w-5 h-5 text-slate-300 group-hover:text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{preset.type}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {preset.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
