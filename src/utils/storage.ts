import { QRItem, ScannerSettings, SubscriptionState } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'scancraft_history_v1',
  SUBSCRIPTION: 'scancraft_subscription_v1',
  SETTINGS: 'scancraft_settings_v1',
  STRIPE_LINK: 'scancraft_stripe_link_v1',
};

const DEFAULT_SETTINGS: ScannerSettings = {
  beepSound: true,
  vibrate: true,
  continuousScan: false,
  autoOpenUrl: false,
  autoCopy: false,
};

const DEFAULT_SUBSCRIPTION: SubscriptionState = {
  isPro: false,
  trialActive: false,
  trialExpiresAt: null,
  purchasedAt: null,
  planType: 'none',
};

const SEED_HISTORY: QRItem[] = [
  {
    id: 'seed-1',
    type: 'scan',
    source: 'camera',
    category: 'wifi',
    title: 'Wi-Fi: Google_Fiber_5G',
    content: 'SSID: Google_Fiber_5G · Security: WPA/WPA2',
    rawText: 'WIFI:S:Google_Fiber_5G;T:WPA;P:SuperSecretPass2026;;',
    metadata: {
      SSID: 'Google_Fiber_5G',
      Password: 'SuperSecretPass2026',
      Security: 'WPA/WPA2',
    },
    timestamp: Date.now() - 3600 * 1000 * 4,
    isFavorite: true,
  },
  {
    id: 'seed-2',
    type: 'scan',
    source: 'album',
    category: 'url',
    title: 'Website: play.google.com',
    content: 'https://play.google.com/store/apps',
    rawText: 'https://play.google.com/store/apps',
    metadata: {
      Domain: 'play.google.com',
      Protocol: 'https',
    },
    timestamp: Date.now() - 3600 * 1000 * 24,
    isFavorite: false,
  },
  {
    id: 'seed-3',
    type: 'generate',
    source: 'manual',
    category: 'contact',
    title: 'Jason Ang (Developer)',
    content: 'Jason Ang · +1 800 555 0199',
    rawText: 'BEGIN:VCARD\nVERSION:3.0\nFN:Jason Ang\nTEL:+18005550199\nEMAIL:jasonang9996@gmail.com\nORG:ScanCraft Team\nTITLE:Lead Engineer\nEND:VCARD',
    metadata: {
      Name: 'Jason Ang',
      Phone: '+1 800 555 0199',
      Email: 'jasonang9996@gmail.com',
      Company: 'ScanCraft Team',
    },
    timestamp: Date.now() - 3600 * 1000 * 48,
    isFavorite: true,
  },
];

export function getStoredHistory(): QRItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(SEED_HISTORY));
      return SEED_HISTORY;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load history:', e);
    return SEED_HISTORY;
  }
}

export function saveStoredHistory(items: QRItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}

export function addHistoryItem(item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>): QRItem {
  const newItem: QRItem = {
    ...item,
    id: `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    isFavorite: false,
  };

  const current = getStoredHistory();
  // Put new item at front, keep up to 1000 items
  const updated = [newItem, ...current.slice(0, 999)];
  saveStoredHistory(updated);
  return newItem;
}

export function getStoredSubscription(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (!raw) return DEFAULT_SUBSCRIPTION;
    const sub: SubscriptionState = JSON.parse(raw);

    // Verify trial expiry
    if (sub.trialActive && sub.trialExpiresAt && Date.now() > sub.trialExpiresAt) {
      const expired: SubscriptionState = {
        ...sub,
        trialActive: false,
        isPro: false,
      };
      saveStoredSubscription(expired);
      return expired;
    }
    return sub;
  } catch {
    return DEFAULT_SUBSCRIPTION;
  }
}

export function saveStoredSubscription(sub: SubscriptionState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  } catch (e) {
    console.error('Failed to save subscription:', e);
  }
}

export function getStoredSettings(): ScannerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: ScannerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getStoredStripeLink(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.STRIPE_LINK) || '';
  } catch {
    return '';
  }
}

export function saveStoredStripeLink(link: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STRIPE_LINK, link.trim());
  } catch (e) {
    console.error('Failed to save Stripe link:', e);
  }
}

