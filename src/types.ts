export type TabType = 'scan' | 'album' | 'generate' | 'history' | 'vip';

export type StorePage = 'home' | 'shop' | 'caps' | 'screen-protectors' | 'about' | 'blog' | 'contact' | 'terms' | 'refund';

export interface CartItem {
  id: string; // unique item entry in cart
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  selectedOption?: string; // e.g. "Style 1: Classic Navy Brooklyn" or "28° Privacy Shield"
}

export interface NoteAttachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  data: string; // base64 without prefix
  previewUrl?: string;
  type: 'image' | 'document' | 'other';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  attachments?: NoteAttachment[];
}

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
