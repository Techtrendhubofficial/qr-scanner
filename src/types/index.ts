export type QRCategory =
  | 'url'
  | 'wifi'
  | 'text'
  | 'contact'
  | 'email'
  | 'phone'
  | 'sms'
  | 'location'
  | 'social'
  | 'product'
  | 'barcode'
  | 'ocr'
  | 'invoice';

export interface QRItem {
  id: string;
  type: 'scan' | 'generate' | 'ocr';
  source: 'camera' | 'album' | 'manual';
  category: QRCategory;
  title: string;
  content: string;
  rawText: string;
  metadata?: Record<string, string>;
  timestamp: number;
  isFavorite: boolean;
}

export type PlanType = 'none' | 'trial' | 'annual' | 'lifetime' | 'starter' | 'pro' | 'ultra';

export interface SubscriptionState {
  isPro: boolean;
  trialActive: boolean;
  trialExpiresAt: number | null;
  purchasedAt: number | null;
  planType: PlanType;
  licenseKey?: string;
  orderId?: string;
}

export interface ScannerSettings {
  beepSound: boolean;
  vibrate: boolean;
  continuousScan: boolean;
  autoOpenUrl: boolean;
  autoCopy: boolean;
}

export type ActiveTab = 'scan' | 'album' | 'generate' | 'history' | 'vip';
