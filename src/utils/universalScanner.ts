import jsQR from 'jsqr';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { createWorker } from 'tesseract.js';

let zxingReader: BrowserMultiFormatReader | null = null;
function getZXingReader(): BrowserMultiFormatReader {
  if (!zxingReader) {
    zxingReader = new BrowserMultiFormatReader();
  }
  return zxingReader;
}

// Tesseract OCR worker singleton
let ocrWorkerPromise: Promise<Tesseract.Worker> | null = null;
async function getOCRWorker(onProgress?: (progressPercent: number) => void): Promise<Tesseract.Worker> {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      try {
        // Try initializing with English + Simplified Chinese for multilingual invoice/receipt support
        const worker = await createWorker(['eng', 'chi_sim'], undefined, {
          logger: (m) => {
            if (m && typeof m.progress === 'number' && onProgress) {
              onProgress(Math.round(m.progress * 100));
            }
          },
        });
        return worker;
      } catch (multiLangErr) {
        console.warn('Multilingual OCR init failed, falling back to English engine:', multiLangErr);
        // Fallback to English only
        const worker = await createWorker('eng', undefined, {
          logger: (m) => {
            if (m && typeof m.progress === 'number' && onProgress) {
              onProgress(Math.round(m.progress * 100));
            }
          },
        });
        return worker;
      }
    })();
  }
  return ocrWorkerPromise;
}

export interface BarcodeScanResult {
  text: string;
  format: string;
}

/**
 * Universal multi-engine QR and Barcode scanner
 * Tries Native BarcodeDetector -> ZXing MultiFormat -> jsQR with multi-pass contrast
 */
export async function decodeCodeFromCanvas(
  canvas: HTMLCanvasElement
): Promise<BarcodeScanResult | null> {
  // 1. Try Native BarcodeDetector if supported in browser (Chrome, Android, Safari 17+)
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const BarcodeDetectorClass = (window as unknown as { BarcodeDetector: new (opts?: { formats: string[] }) => {
        detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string; format: string }>>;
      } }).BarcodeDetector;

      const detector = new BarcodeDetectorClass({
        formats: [
          'qr_code',
          'ean_13',
          'ean_8',
          'upc_a',
          'upc_e',
          'code_128',
          'code_39',
          'code_93',
          'itf',
          'data_matrix',
          'aztec',
          'pdf417',
        ],
      });

      const barcodes = await detector.detect(canvas);
      if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
        return {
          text: barcodes[0].rawValue.trim(),
          format: barcodes[0].format || 'BARCODE',
        };
      }
    } catch {
      // Fall through to ZXing
    }
  }

  // 2. Try ZXing MultiFormat Reader
  try {
    const reader = getZXingReader();
    const result = reader.decodeFromCanvas(canvas);
    if (result && result.getText()) {
      return {
        text: result.getText().trim(),
        format: result.getBarcodeFormat() ? String(result.getBarcodeFormat()) : 'QR_CODE',
      };
    }
  } catch {
    // Fall through to jsQR
  }

  // 3. Try jsQR with multi-pass contrast & binarization
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      const w = canvas.width;
      const h = canvas.height;
      let imageData = ctx.getImageData(0, 0, w, h);
      let code = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });

      if (code && code.data) {
        return {
          text: code.data.trim(),
          format: 'QR_CODE',
        };
      }

      // Pass 2: Contrast threshold boost
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const val = avg > 128 ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      code = jsQR(data, w, h, { inversionAttempts: 'attemptBoth' });
      if (code && code.data) {
        return {
          text: code.data.trim(),
          format: 'QR_CODE',
        };
      }
    }
  } catch {
    // End of code passes
  }

  return null;
}

export interface OCRResult {
  text: string;
  confidence: number;
  wordCount: number;
  lineCount: number;
}

/**
 * Preprocess canvas for optimal OCR accuracy (contrast boost, grayscale)
 */
function prepareCanvasForOCR(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  try {
    const ocrCanvas = document.createElement('canvas');
    let w = sourceCanvas.width;
    let h = sourceCanvas.height;

    // Optimal dimension for OCR is at least 1000px, max 2400px
    if (w < 800 || h < 800) {
      const scale = Math.min(2.5, Math.max(1.5, 1200 / Math.max(w, h)));
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    } else if (w > 2600 || h > 2600) {
      const scale = 2400 / Math.max(w, h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }

    ocrCanvas.width = w;
    ocrCanvas.height = h;
    const ctx = ocrCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return sourceCanvas;

    // Draw with high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Mild contrast enhancement and grayscale conversion
    const contrast = 35; // Contrast boost factor
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      // Grayscale luminance
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Contrast stretch
      const adjusted = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
      data[i] = adjusted;
      data[i + 1] = adjusted;
      data[i + 2] = adjusted;
    }
    ctx.putImageData(imgData, 0, 0);
    return ocrCanvas;
  } catch {
    return sourceCanvas;
  }
}

/**
 * Perform Optical Character Recognition (OCR) on an image
 */
export async function performImageOCR(
  imageSource: string | HTMLCanvasElement,
  onProgress?: (progressPercent: number) => void
): Promise<OCRResult | null> {
  try {
    const worker = await getOCRWorker(onProgress);

    let targetSource = imageSource;
    if (typeof HTMLCanvasElement !== 'undefined' && imageSource instanceof HTMLCanvasElement) {
      targetSource = prepareCanvasForOCR(imageSource);
    }

    const ret = await worker.recognize(targetSource);

    const fullText = (ret.data.text || '').trim();
    if (!fullText) return null;

    // Filter out standalone punctuation noise
    const lines = fullText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !/^[\s.,;:~`\-=_+*&^%$#@!|\\/()\[\]{}]+$/.test(l));

    const words = fullText.split(/\s+/).filter((w) => w.trim().length > 0);

    return {
      text: fullText,
      confidence: Math.round(ret.data.confidence || 88),
      wordCount: words.length,
      lineCount: Math.max(1, lines.length),
    };
  } catch (err) {
    console.warn('OCR error:', err);
    return null;
  }
}
