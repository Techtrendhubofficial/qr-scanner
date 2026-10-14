/**
 * Official Stripe Payment Links for Pavilion QR Pro
 * Single unified pricing: US$59 / year ($59.00/yr)
 */
import { getStoredStripeLink } from './storage';

export const STRIPE_LINKS: Record<'annual' | 'starter' | 'pro' | 'ultra', string> = {
  annual: 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07',
  starter: 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07',
  pro: 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07',
  ultra: 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07',
};

export interface StripePlan {
  id: 'annual' | 'starter' | 'pro' | 'ultra';
  name: string;
  price: string;
  period: string;
  description: string;
  badge: string;
  popular?: boolean;
  link: string;
  features: readonly string[];
  scanLimit: string;
}

export const STRIPE_PLANS: readonly StripePlan[] = [
  {
    id: 'annual',
    name: 'Pavilion QR Pro VIP',
    price: 'US$59',
    period: '/年',
    description: '年度尊享订阅 · US$59/年 · 解锁全部无限扫码与高清制码特权',
    badge: '年度尊享版 (US$59/年)',
    popular: true,
    link: 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07',
    scanLimit: '无限次扫码',
    features: [
      '无限次极速相机扫码与相册图片解码 (QR & 条形码)',
      '高清 4K 矢量二维码制作生成 (网址 / Wi-Fi / 名片 / 社交)',
      '批量快速连续扫描模式与暗光手电筒辅助',
      '扫描与生成历史记录加密本地持久化',
      '一键导出 CSV / JSON / TXT 数据明细',
      '100% 设备端侧本地运算，0 字节上传云端，隐私零泄露',
      '支持多设备随时解约与无忧管理',
    ],
  },
] as const;

/**
 * Returns current Stripe payment link for Pavilion QR Pro.
 * Rejects any legacy DocuMorph OCR links or outdated test links.
 */
export function getStripeCheckoutUrl(_planId?: string): string {
  const custom = getStoredStripeLink();
  if (custom && !custom.includes('aFa5kEaRLaG6eIK8UobbG00') && !custom.includes('00wcN69NHdSifMOb2wbbG06')) {
    return custom;
  }
  if (STRIPE_LINKS.annual && !STRIPE_LINKS.annual.includes('aFa5kEaRLaG6eIK8UobbG00') && !STRIPE_LINKS.annual.includes('00wcN69NHdSifMOb2wbbG06')) {
    return STRIPE_LINKS.annual;
  }
  return 'https://buy.stripe.com/cNifZi4tnbKagQSc6AbbG07';
}

/**
 * Checks if a valid, active Stripe link is configured
 */
export function hasValidStripeLink(): boolean {
  return Boolean(getStripeCheckoutUrl());
}

/**
 * Direct Stripe redirect with Meta Pixel checkout initiation.
 * Returns true if redirect initiated, false if no link is configured.
 */
export function redirectToStripe(_planId = 'annual', priceNum = 59): boolean {
  if (typeof window !== 'undefined') {
    const checkoutUrl = getStripeCheckoutUrl();
    if (!checkoutUrl) {
      return false;
    }

    const fbqObj = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (fbqObj) {
      fbqObj('track', 'InitiateCheckout', {
        value: priceNum,
        currency: 'USD',
        content_name: 'Pavilion QR Pro Annual VIP ($59/yr)',
      });
    }

    try {
      const opened = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        window.location.href = checkoutUrl;
      }
    } catch {
      window.location.href = checkoutUrl;
    }
    return true;
  }
  return false;
}
