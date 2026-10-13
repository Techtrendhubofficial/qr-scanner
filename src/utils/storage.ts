import { QRItem, ScannerSettings, SubscriptionState } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'pavilion_qr_history_v1',
  SUBSCRIPTION: 'pavilion_qr_subscription_v1',
  SETTINGS: 'pavilion_qr_settings_v1',
  STRIPE_LINK: 'pavilion_qr_stripe_link_v1',
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

export function getStoredHistory(): QRItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) {
      return [];
    }
    const items: QRItem[] = JSON.parse(raw);
    // Filter out any legacy demo / seed items
    const cleanItems = items.filter((item) => !item.id.startsWith('seed-'));
    if (cleanItems.length !== items.length) {
      saveStoredHistory(cleanItems);
    }
    return cleanItems;
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
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

/**
 * 检查用户是否为解锁 Pro 用户 (基于 localStorage isPremium)
 */
export function isPro(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('isPremium') === 'true';
  } catch {
    return false;
  }
}

export function setPremiumStatus(isPremium: boolean): void {
  try {
    if (isPremium) {
      localStorage.setItem('isPremium', 'true');
      localStorage.removeItem('scanCount');
    } else {
      localStorage.removeItem('isPremium');
    }
  } catch (e) {
    console.error('Failed to set premium status:', e);
  }
}

/**
 * 获取当前已用扫描次数
 */
export function getScanCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('scanCount');
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * 增加扫描次数并返回新计数
 */
export function incrementScanCount(): number {
  try {
    const current = getScanCount();
    const next = current + 1;
    localStorage.setItem('scanCount', next.toString());
    return next;
  } catch {
    return 1;
  }
}

/**
 * 重置扫描次数
 */
export function resetScanCount(): void {
  try {
    localStorage.removeItem('scanCount');
  } catch (e) {
    console.error('Failed to reset scan count:', e);
  }
}


