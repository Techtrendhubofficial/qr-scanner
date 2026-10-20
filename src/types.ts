export type TabType = 'scan' | 'album' | 'generate' | 'history' | 'vip';

export interface ScanItem {
  id: string;
  type: 'qr' | 'barcode' | 'ocr';
  content: string;
  timestamp: number;
  category: 'url' | 'text' | 'wifi' | 'contact' | 'email' | 'phone';
}

export interface GeneratedQrItem {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  type: 'url' | 'text' | 'wifi' | 'contact' | 'whatsapp';
  color: string;
}
