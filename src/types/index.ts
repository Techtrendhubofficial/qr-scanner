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
  | 'product';

export interface QRItem {
  id: string;
  type: 'scan' | 'generate';
  source: 'camera' | 'album' | 'manual';
  category: QRCategory;
  title: string;
  content: string;
  rawText: string;
  metadata?: Record<string, string>;
  timestamp: number;
  isFavorite: boolean;
}

export interface SubscriptionState {
  isPro: boolean;
  trialActive: boolean;
  trialExpiresAt: number | null;
  purchasedAt: number | null;
  planType: 'none' | 'trial' | 'annual' | 'lifetime';
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
