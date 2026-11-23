import React, { useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Upload, Image as ImageIcon, Copy, ExternalLink, Check, AlertCircle, FileSearch, CheckCircle2 } from 'lucide-react';
import { ScanItem } from '../types';
import { Language } from '../utils/i18n';

interface AlbumScannerProps {
  onScanResult: (result: ScanItem) => void;
  lang?: Language;
}

type AlbumErrorCode = 'invalidFile' | 'canvasError' | 'notFound' | 'loadError' | null;

export const AlbumScanner: React.FC<AlbumScannerProps> = ({ onScanResult, lang = 'en' }) => {
  const isEn = lang === 'en';
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<AlbumErrorCode>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getErrorText = (code: AlbumErrorCode): string => {
    switch (code) {
      case 'invalidFile':
        return isEn
          ? 'Please select a valid image file (JPG, PNG, WebP, etc.).'
          : '请选择有效的图片文件（JPG, PNG, WebP 等）';
      case 'canvasError':
        return isEn
          ? 'Failed to initialize browser image canvas.'
          : '浏览器绘图上下文初始化失败';
      case 'notFound':
        return isEn
          ? 'No clear QR code was detected in this image. Please try a sharper crop or higher resolution photo.'
          : '未在图片中检测到清晰的二维码，请尝试裁剪更清晰的图片后重试。';
      case 'loadError':
        return isEn
          ? 'Failed to load image. Please try another photo.'
          : '图片加载失败，请换一张图片重试';
      default:
        return '';
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorCode('invalidFile');
      return;
    }

    setErrorCode(null);
    setResultText(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          setErrorCode('canvasError');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        setIsProcessing(false);

        if (code && code.data.trim()) {
          const content = code.data.trim();
          setResultText(content);

          const category = content.startsWith('http://') || content.startsWith('https://')
            ? 'url'
            : content.startsWith('WIFI:')
            ? 'wifi'
            : content.startsWith('tel:')
            ? 'phone'
            : 'text';

          const item: ScanItem = {
            id: 'album_' + Date.now(),
            type: 'qr',
            content,
            timestamp: Date.now(),
            category,
          };
          onScanResult(item);
        } else {
          setErrorCode('notFound');
        }
      };

      img.onerror = () => {
        setIsProcessing(false);
        setErrorCode('loadError');
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 pb-24 md:pb-12 text-slate-100">
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <ImageIcon className="w-6 h-6 text-emerald-400" />
          <span>{isEn ? 'Album Photo QR Scanner' : '相册图片识别 (QR & 条码)'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isEn
            ? 'Select a screenshot, photo, or receipt to decode QR codes 100% locally'
            : '直接上传截屏、手机相册照片或发票单据，全本地瞬间解析'}
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 sm:p-10 text-center bg-slate-900/40 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center space-y-3 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 flex items-center justify-center text-emerald-400 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <div>
          <div className="text-sm sm:text-base font-semibold text-slate-200">
            {isEn ? 'Tap to choose an image, or drag & drop here' : '点击选择相册照片，或将图片拖拽至此处'}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {isEn
              ? 'Supports JPG, PNG, WebP, GIF (Runs 100% on-device, never uploaded)'
              : '支持 JPG, PNG, WebP, GIF 等格式（完全本地端运行，绝不外发）'}
          </div>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-3 text-emerald-400 text-sm">
          <FileSearch className="w-5 h-5 animate-spin" />
          <span>{isEn ? 'Decoding image pixels locally...' : '正在高速解析图像像素与定位码...'}</span>
        </div>
      )}

      {/* Error Message */}
      {errorCode && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>{getErrorText(errorCode)}</div>
        </div>
      )}

      {/* Result Card */}
      {resultText && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>{isEn ? 'QR Code Detected' : '检测到二维码内容'}</span>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
              {isEn ? '100% Decoded Locally' : '100% 本地已解码'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 text-sm font-mono break-all max-h-40 overflow-y-auto select-all text-slate-200">
            {resultText}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {resultText.startsWith('http') && (
              <a
                href={resultText}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isEn ? 'Open Link' : '立即打开网址'}</span>
              </a>
            )}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>
                {copied
                  ? isEn
                    ? 'Copied to Clipboard!'
                    : '已复制到剪贴板！'
                  : isEn
                  ? 'Copy Content'
                  : '复制内容'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {imagePreview && (
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <div className="text-xs font-semibold text-slate-400">
            {isEn ? 'Selected Photo Preview:' : '已选照片预览：'}
          </div>
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="max-h-60 rounded-xl object-contain border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
