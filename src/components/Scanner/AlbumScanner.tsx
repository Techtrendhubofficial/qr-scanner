import React, { useState, useRef } from 'react';
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
  FileText,
  ScanText,
  Copy,
  Check,
  RefreshCw,
  Barcode,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { QRItem } from '../../types';
import { parseQRContent } from '../../utils/qrParser';
import { playScanBeep, triggerHaptic } from '../../utils/audio';
import { decodeCodeFromCanvas, performImageOCR, OCRResult } from '../../utils/universalScanner';
import { exportToExcel, exportToReceipt, exportToSQLAccSheet } from '../../utils/export';

interface AlbumScannerProps {
  onScanSuccess: (item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  onSwitchToCamera: () => void;
  isPro?: boolean;
  scanCount?: number;
  onTriggerPaywall?: () => void;
  onOpenPrivacyAudit?: () => void;
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
    id: 'sample-invoice',
    name: '商业发票 / 收据 (Invoice)',
    type: 'Invoice',
    icon: FileSpreadsheet,
    payload: `TAX INVOICE
Mega Hardware Trading Sdn Bhd
Invoice No: INV-2026/8942
Date: 2026-10-05
Customer: Jason Ang

Items:
1. Industrial Barcode Scanner x 2 - RM 480.00
2. Thermal Label Roll (5pk) x 1 - RM 65.00
3. System Integration & Setup - RM 200.00

Subtotal: RM 745.00
SST (6%): RM 44.70
Total Amount: RM 789.70

Privacy: Processed On-Device Edge. Thank you!`,
    description: '真实商业发票格式：商户、项目明细与金额',
  },
  {
    id: 'wifi-coffee',
    name: 'Café Wi-Fi Access',
    type: 'Wi-Fi',
    icon: Wifi,
    payload: 'WIFI:S:BlueBottle_Coffee_Guest;T:WPA;P:CoffeeBeans2026;H:false;;',
    description: 'Connects directly to guest Wi-Fi network',
  },
  {
    id: 'barcode-book',
    name: 'Book ISBN Barcode',
    type: 'Barcode',
    icon: Barcode,
    payload: '9780132350884',
    description: 'Standard 13-digit EAN/ISBN product barcode',
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
];

export const AlbumScanner: React.FC<AlbumScannerProps> = ({
  onScanSuccess,
  onSwitchToCamera,
  isPro = false,
  scanCount = 0,
  onTriggerPaywall,
  onOpenPrivacyAudit,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scanMode, setScanMode] = useState<'auto' | 'code' | 'ocr'>('auto');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Direct Text Paste Test Drawer
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [pastedInvoiceText, setPastedInvoiceText] = useState('');

  // Main Image Decoder: QR/Barcode + OCR Text Recognition
  const processImageElement = async (img: HTMLImageElement) => {
    // 4th scan check: block scanning if limit reached and not pro
    if (!isPro && scanCount >= 3) {
      onTriggerPaywall?.();
      return;
    }

    setIsProcessing(true);
    setErrorStatus(null);
    setOcrResult(null);

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      setIsProcessing(false);
      setErrorStatus('Failed to initialize decoding canvas.');
      return;
    }

    // Set responsive dimensions
    const maxDim = 1800;
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

    // Mode: 'code' or 'auto' -> Try QR and Barcode first
    if (scanMode === 'auto' || scanMode === 'code') {
      setProcessingStatus('Searching for QR & Barcodes...');
      try {
        const detected = await decodeCodeFromCanvas(canvas);
        if (detected && detected.text) {
          setIsProcessing(false);
          setProcessingStatus(null);
          playScanBeep();
          triggerHaptic();

          const parsed = parseQRContent(detected.text);
          onScanSuccess({
            type: 'scan',
            source: 'album',
            category: parsed.category === 'text' && detected.format.includes('BARCODE') ? 'barcode' : parsed.category,
            title: detected.format && detected.format !== 'QR_CODE' ? `${detected.format}: ${parsed.title}` : parsed.title,
            content: parsed.displayValue,
            rawText: detected.text,
            metadata: {
              Format: detected.format,
              ...parsed.metadata,
            },
          });
          return;
        }
      } catch (err) {
        console.warn('Code decoding error:', err);
      }
    }

    // If Mode is 'ocr' OR 'auto' (and no code was found) -> Perform OCR Text Recognition
    if (scanMode === 'auto' || scanMode === 'ocr') {
      setProcessingStatus('Running OCR text recognition (0% on-device)...');
      try {
        const ocr = await performImageOCR(canvas, (progressPercent) => {
          setProcessingStatus(`Recognizing document text (${progressPercent}%)...`);
        });
        setIsProcessing(false);
        setProcessingStatus(null);

        if (ocr && ocr.text.trim().length > 0) {
          setOcrResult(ocr);
          playScanBeep();
          triggerHaptic();

          // Intelligent Parsing: detect if text is invoice / commercial receipt
          const parsed = parseQRContent(ocr.text);

          // Push to history & trigger scan success
          onScanSuccess({
            type: 'ocr',
            source: 'album',
            category: parsed.category === 'invoice' ? 'invoice' : 'ocr',
            title: parsed.category === 'invoice' ? parsed.title : `OCR Text (${ocr.wordCount} words)`,
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
          return;
        }
      } catch (ocrErr) {
        console.warn('OCR processing error:', ocrErr);
      }
    }

    setIsProcessing(false);
    setProcessingStatus(null);
    setErrorStatus(
      scanMode === 'ocr'
        ? 'No readable text could be recognized. Please upload a clear photo with visible text.'
        : 'No QR code, barcode, or recognizable text detected. Please ensure the image is clear and well-lit.'
    );
  };

  // File selection
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

    // Reset input so re-selecting same file triggers onChange
    if (e.target) e.target.value = '';
  };

  // Drag and drop
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

  // Sample presets
  const handleLoadSample = async (preset: SamplePreset) => {
    if (!isPro && scanCount >= 3) {
      onTriggerPaywall?.();
      return;
    }

    setIsProcessing(true);
    setErrorStatus(null);
    setOcrResult(null);

    try {
      const dataUrl = await QRCode.toDataURL(preset.payload, {
        width: 600,
        margin: 3,
        color: {
          dark: '#000000',
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

  const handleCopyOcrText = () => {
    if (!ocrResult) return;
    navigator.clipboard.writeText(ocrResult.text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Mode Selector Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-black border border-zinc-800">
        <div className="flex items-center gap-2">
          <ScanText className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs font-bold text-white">Recognition Engine:</span>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setScanMode('auto')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'auto'
                ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Auto (All)</span>
          </button>

          <button
            type="button"
            onClick={() => setScanMode('ocr')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'ocr'
                ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OCR Text Only</span>
          </button>

          <button
            type="button"
            onClick={() => setScanMode('code')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              scanMode === 'code'
                ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>QR / Barcode</span>
          </button>
        </div>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          if (!isPro && scanCount >= 3) {
            onTriggerPaywall?.();
            return;
          }
          fileInputRef.current?.click();
        }}
        className="relative group cursor-pointer border-2 border-dashed border-zinc-800 hover:border-[#00ff88] rounded-3xl bg-black hover:bg-zinc-950 transition-all p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[290px] overflow-hidden"
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
              className="max-h-72 rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col items-center justify-center gap-2.5">
                <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
                <span className="text-xs font-bold text-white">
                  {processingStatus || 'Analyzing image pixels...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,136,0.15)]">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">
                Upload Photo, Screenshot, or Document
              </h3>
              <p className="text-xs text-zinc-400">
                Drag and drop or tap to browse. Automatically extracts QR codes, 1D/2D barcodes, and printed text.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                ✓ QR Codes
              </span>
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                ✓ Barcodes & ISBN
              </span>
              <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-2.5 py-1 rounded-full">
                ✓ OCR Text Recognition
              </span>
            </div>
          </div>
        )}
      </div>

      {/* OCR Result Preview Card if text was recognized */}
      {ocrResult && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#09090b] border border-[#00ff88]/40 shadow-[0_0_30px_rgba(0,255,136,0.15)] space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#00ff88]/15 text-[#00ff88] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">OCR Extracted Text</h4>
                <span className="text-[10px] text-zinc-400">
                  {ocrResult.wordCount} words · {ocrResult.lineCount} lines · Confidence: {ocrResult.confidence}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyOcrText}
              className="px-3 py-1.5 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-200 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed select-text">
            {ocrResult.text}
          </div>

          {/* Quick 1-click Exports for OCR result */}
          <div className="pt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const dummyItem: QRItem = {
                  id: `ocr-${Date.now()}`,
                  type: 'ocr',
                  category: 'invoice',
                  source: 'album',
                  title: `OCR单据导出 (${ocrResult.wordCount}字)`,
                  content: ocrResult.text.slice(0, 100),
                  rawText: ocrResult.text,
                  timestamp: Date.now(),
                  isFavorite: false,
                  metadata: {
                    Engine: 'Tesseract OCR On-Device',
                    Confidence: `${ocrResult.confidence}%`,
                  },
                };
                exportToExcel([dummyItem]);
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>导出 Excel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const dummyItem: QRItem = {
                  id: `ocr-${Date.now()}`,
                  type: 'ocr',
                  category: 'invoice',
                  source: 'album',
                  title: `OCR单据导出 (${ocrResult.wordCount}字)`,
                  content: ocrResult.text.slice(0, 100),
                  rawText: ocrResult.text,
                  timestamp: Date.now(),
                  isFavorite: false,
                  metadata: {
                    Engine: 'Tesseract OCR On-Device',
                    Confidence: `${ocrResult.confidence}%`,
                  },
                };
                exportToReceipt([dummyItem]);
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>导出 Resit</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const dummyItem: QRItem = {
                  id: `ocr-${Date.now()}`,
                  type: 'ocr',
                  category: 'invoice',
                  source: 'album',
                  title: `OCR单据导出 (${ocrResult.wordCount}字)`,
                  content: ocrResult.text.slice(0, 100),
                  rawText: ocrResult.text,
                  timestamp: Date.now(),
                  isFavorite: false,
                  metadata: {
                    Engine: 'Tesseract OCR On-Device',
                    Confidence: `${ocrResult.confidence}%`,
                  },
                };
                exportToSQLAccSheet([dummyItem]);
              }}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              <span>导出 SQL Acc</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorStatus && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorStatus}</span>
        </div>
      )}

      {/* Direct Invoice & Text Input Testing Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsPasteOpen(!isPasteOpen)}
            className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#00ff88] transition text-left cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#00ff88]" />
            <span>📝 粘贴发票 / 单据文本快速识别与解析 (Paste Invoice Text)</span>
            {isPasteOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
            100% On-Device Parser
          </span>
        </div>

        {isPasteOpen && (
          <div className="space-y-3 pt-2 border-t border-zinc-800/80 animate-in fade-in">
            <p className="text-[11px] text-zinc-400">
              如果您有现成的发票内容、聊天记录单据或文字，可直接粘贴在此处。系统将自动提取商家名称、发票单号、日期、明细与总金额，零云端上传：
            </p>
            <textarea
              value={pastedInvoiceText}
              onChange={(e) => setPastedInvoiceText(e.target.value)}
              placeholder={`例如：\nTAX INVOICE\nMega Trading Sdn Bhd\nInvoice No: INV-2026/8899\nDate: 2026-10-05\nTotal Amount: RM 350.00`}
              rows={4}
              className="w-full rounded-xl bg-black border border-zinc-800 p-3 text-xs font-mono text-zinc-200 outline-none focus:border-[#00ff88] transition resize-y"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setPastedInvoiceText(`TAX INVOICE\nMega Hardware Trading Sdn Bhd\nInvoice No: INV-2026/8942\nDate: 2026-10-05\nCustomer: Jason Ang\nTotal Amount: RM 789.70\nStatus: Paid`);
                }}
                className="text-[11px] text-[#00ff88] hover:underline cursor-pointer"
              >
                + 填入真实发票样例
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!pastedInvoiceText.trim()) return;
                  if (!isPro && scanCount >= 3) {
                    onTriggerPaywall?.();
                    return;
                  }
                  playScanBeep();
                  triggerHaptic();
                  const parsed = parseQRContent(pastedInvoiceText.trim());
                  onScanSuccess({
                    type: 'ocr',
                    source: 'album',
                    category: parsed.category === 'invoice' ? 'invoice' : 'text',
                    title: parsed.title,
                    content: parsed.displayValue,
                    rawText: pastedInvoiceText.trim(),
                    metadata: {
                      ...parsed.metadata,
                      Source: 'Direct Invoice Text Input',
                    },
                  });
                }}
                disabled={!pastedInvoiceText.trim()}
                className="px-4 py-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#00ff88]/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>立即解析发票单据</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Protection & Customer Anti-Framing Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-black border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00ff88]/15 text-[#00ff88] shrink-0 border border-[#00ff88]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              客户隐私安全与防栽赃保障 (Zero Customer File Retention)
            </h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              顾客若质疑有无收文件？可随时出示现场沙箱测试公证书 · 杜绝同行恶意诽谤
            </p>
          </div>
        </div>

        {onOpenPrivacyAudit && (
          <button
            type="button"
            onClick={onOpenPrivacyAudit}
            className="px-4 py-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-black text-xs transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>查看防嫁祸与零留存报告</span>
          </button>
        )}
      </div>

      {/* Sample presets for 1-click test */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300">
            Or test with instant sample presets:
          </span>
          <button
            type="button"
            onClick={onSwitchToCamera}
            className="text-xs text-[#00ff88] hover:underline flex items-center gap-1"
          >
            <span>Switch to Live Camera</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadSample(preset)}
                className="flex flex-col items-start p-3 rounded-2xl bg-black border border-zinc-800 hover:border-[#00ff88]/50 hover:bg-zinc-950 text-left transition group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 group-hover:bg-[#00ff88]/20 group-hover:text-[#00ff88] transition text-zinc-400 mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white truncate w-full">
                  {preset.name}
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
