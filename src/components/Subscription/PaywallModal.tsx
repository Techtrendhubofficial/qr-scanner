import React from 'react';
import {
  Lock,
  Check,
  ArrowRight,
  Sparkles,
  X,
  Crown,
} from 'lucide-react';
import { STRIPE_PLANS, getStripeCheckoutUrl } from '../../utils/stripe';

interface PaywallModalProps {
  isOpen: boolean;
  onClose?: () => void;
  scanCount: number;
  onOpenPricing?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  scanCount,
  onOpenPricing,
}) => {
  if (!isOpen) return null;

  const handleRedirect = () => {
    const checkoutUrl = getStripeCheckoutUrl();
    if (!checkoutUrl) {
      if (onOpenPricing) {
        onClose?.();
        onOpenPricing();
      }
      return;
    }

    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: 59.00,
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
  };

  const plan = STRIPE_PLANS[0];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#00ff88]/30 bg-[#09090b] p-6 sm:p-7 shadow-[0_0_50px_rgba(0,255,136,0.18)] text-white space-y-5 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00ff88]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Optional Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 shadow-[0_0_25px_rgba(0,255,136,0.25)]">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-0.5 rounded-full">
              免费额度已用尽 (3/3 次扫描)
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              解锁无限扫码与高清制码
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              您已使用全部 3 次免费试用额度。只需 US$59/年，即可全年畅享无限极速扫码与 4K 二维码制作。
            </p>
          </div>
        </div>

        {/* Single Plan Display Box */}
        <div className="rounded-2xl p-4 border border-[#00ff88]/40 bg-[#00ff88]/10 shadow-[0_0_25px_rgba(0,255,136,0.15)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#00ff88]" />
              <div>
                <span className="text-sm font-black text-white block">Pavilion QR Pro VIP</span>
                <span className="text-[10px] text-emerald-400 font-semibold">年度尊享版 (全年有效)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white font-mono">US$59</span>
              <span className="text-xs text-zinc-400">/年</span>
              <span className="text-[9px] text-emerald-400 block font-semibold">Google Play / Stripe 同价</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-zinc-800/80 text-xs text-zinc-300">
            {plan.features.slice(0, 4).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-zinc-200 text-[11px]">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleRedirect}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-black text-base py-3.5 px-6 shadow-[0_0_30px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-[0.98] transition text-center cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>立即解锁年度 VIP (US$59 / 年)</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {onOpenPricing && (
            <button
              type="button"
              onClick={() => {
                onClose?.();
                onOpenPricing();
              }}
              className="w-full py-2.5 text-xs text-zinc-400 hover:text-[#00ff88] transition text-center underline underline-offset-4"
            >
              已有激活码 / 开发者专属兑换入口 →
            </button>
          )}
        </div>

        {/* Guarantee */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] text-zinc-500 text-center flex-wrap">
          <span>Google Play 与 Stripe 统一同价 (US$59/年)</span>
          <span aria-hidden="true">·</span>
          <span>即时自动解锁</span>
          <span aria-hidden="true">·</span>
          <span>无广告无二次扣费</span>
        </div>
      </div>
    </div>
  );
};
