import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Crown,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { SubscriptionState } from '../../types';
import { STRIPE_PLANS } from '../../utils/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionState;
  onUpdateSubscription: (sub: SubscriptionState) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpdateSubscription,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff88', '#33ff9f', '#ffffff', '#00cc6a'],
      });
    } catch {
      // Ignored
    }
  };

  const handleCheckout = (link: string, planName: string, price: number) => {
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: price,
        currency: 'MYR',
        content_name: `Pavilion QR Pro ${planName}`,
      });
    }
    // Clean Stripe link redirect, no ?success_url params
    window.location.href = link;
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (['VIP49', 'PLAYSTORE', 'FREE3DAY', 'STORE49', 'PRO2026', 'LIFETIME', 'ULTRA'].includes(clean) || clean.length >= 6) {
      const updated: SubscriptionState = {
        isPro: true,
        trialActive: false,
        trialExpiresAt: null,
        purchasedAt: Date.now(),
        planType: 'annual',
        orderId: `VOUCHER.${clean}`,
      };
      onUpdateSubscription(updated);
      setPromoStatus('success');
      triggerCelebration();
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setPromoStatus('invalid');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#00ff88]/30 bg-[#09090b] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,136,0.15)] text-white space-y-6 my-auto">
        {/* Glow backdrop */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00ff88]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#00ff88]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#00ff88]">
            <Crown className="w-3.5 h-3.5" />
            <span>Pavilion QR Pro · Monthly Subscription</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Starter RM59 · Pro RM159 · Ultra RM299 /月
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            按月自动订阅扣款 · 纯净轻量无PDF · OCR扫描 · 导出 Excel / Resit / SQL Acc Sheet
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
              官方域名与后台：<span className="text-emerald-400">https://qr.pavilionventure.com</span>
            </span>
          </div>
        </div>

        {/* 3 Monthly Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {STRIPE_PLANS.map((plan) => {
            const isPro = plan.id === 'pro';
            const priceNum = plan.id === 'starter' ? 59 : plan.id === 'pro' ? 159 : 299;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all border ${
                  isPro
                    ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_25px_rgba(0,255,136,0.2)] md:-translate-y-1'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff88] text-black text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Most Popular · 财务推荐
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      {plan.badge}
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">{plan.name}</h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white font-mono">{plan.price}</span>
                    <span className="text-xs text-zinc-400">{plan.period}</span>
                    <span className="ml-auto text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {plan.scanLimit}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#00ff88] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan.link, plan.name, priceNum)}
                    className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-3 px-4 text-xs font-black transition active:scale-[0.98] cursor-pointer ${
                      isPro
                        ? 'bg-[#00ff88] hover:bg-[#33ff9f] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    <span>订阅 {plan.name} ({plan.price}{plan.period})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo code redemption section */}
        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            Have a VIP Promo Code or License Key?
          </span>
          <form onSubmit={handleRedeemCode} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="e.g. VIP49 or ULTRA"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 uppercase font-mono focus:border-[#00ff88] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-bold text-white transition"
            >
              Redeem
            </button>
          </form>

          {promoStatus === 'success' && (
            <p className="text-xs text-[#00ff88] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Code activated! Pro VIP privileges unlocked.
            </p>
          )}
          {promoStatus === 'invalid' && (
            <p className="text-xs text-rose-400">
              Invalid code. Try VIP49 or subscribe above.
            </p>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 text-center pt-1">
          <span>Stripe 256-bit Encryption</span>
          <span aria-hidden="true">·</span>
          <span>Instant Automatic Activation</span>
          <span aria-hidden="true">·</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
};
