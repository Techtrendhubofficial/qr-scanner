/**
 * Official Stripe Payment Links
 * No ?success_url parameter (redirects are configured in Stripe Dashboard to /success.html?plan=xxx)
 */
export const STRIPE_LINKS = {
  starter: 'https://buy.stripe.com/aFa5kEaRLaG6eIK8UobbG00',
  pro: 'https://buy.stripe.com/4gM6oI9NHeWmdEGfiMbbG01',
  ultra: 'https://buy.stripe.com/aFa00kf81cOe4463A4bbG02',
} as const;

export interface StripePlan {
  id: 'starter' | 'pro' | 'ultra';
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
    id: 'starter',
    name: 'Starter',
    price: 'RM59',
    period: '/月',
    description: '每月自动扣款 · 100次扫描/月 · 适合个人自由职业者',
    badge: '入门订阅版',
    popular: false,
    link: STRIPE_LINKS.starter,
    scanLimit: '100次扫描/月',
    features: [
      '每月 100 次极速 OCR 智能扫描',
      '月度自动续订 (Monthly Subscription)',
      '高精度单据发票文字识别',
      '无限制随时管理与取消订阅',
      '纯净轻量无PDF极速体验',
      '100% 本地运算，0 隐私泄露',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'RM159',
    period: '/月',
    description: '每月自动扣款 · 500次扫描/月 · 支持导出 Excel / Resit',
    badge: '最受欢迎 · 会计财务首选',
    popular: true,
    link: STRIPE_LINKS.pro,
    scanLimit: '500次扫描/月',
    features: [
      '每月 500 次极速 OCR 智能扫描',
      '月度自动续订 (Monthly Subscription)',
      '包含 Starter 所有扫描功能',
      '导出 Excel 格式明细表',
      '导出 Resit / 商业收据凭证',
      '发票单据自动结构化解析',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: 'RM299',
    period: '/月',
    description: '每月自动扣款 · 无限次扫描 · 导出 SQL Acc Sheet',
    badge: '企业旗舰版',
    popular: false,
    link: STRIPE_LINKS.ultra,
    scanLimit: '无限次扫描',
    features: [
      '无限次极速 OCR 批量识别',
      '月度自动续订 (Monthly Subscription)',
      '包含 Pro 所有导出权益 (Excel + Resit)',
      '导出 SQL Acc Sheet (SQL Accounting 导入表)',
      '企业级批量扫描与流水线导出',
      'VIP 专属技术服务与优先通道',
    ],
  },
] as const;

import { getStoredStripeLink } from './storage';

/**
 * Default paywall link or plan-specific Stripe link
 * Checks user custom link from settings first, then falls back to official links
 */
export function getStripeCheckoutUrl(planId: 'starter' | 'pro' | 'ultra' = 'starter'): string {
  const custom = getStoredStripeLink();
  if (custom && planId === 'starter') {
    return custom;
  }
  return STRIPE_LINKS[planId] || STRIPE_LINKS.starter;
}

/**
 * Direct Stripe redirect with Meta Pixel checkout initiation
 */
export function redirectToStripe(planId: 'starter' | 'pro' | 'ultra' = 'starter', priceNum = 59): void {
  if (typeof window !== 'undefined') {
    const fbqObj = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (fbqObj) {
      fbqObj('track', 'InitiateCheckout', {
        value: priceNum,
        currency: 'MYR',
        content_name: `Pavilion QR Pro ${planId.toUpperCase()}`,
      });
    }
    const checkoutUrl = getStripeCheckoutUrl(planId);
    window.location.href = checkoutUrl;
  }
}
