import React, { useState } from 'react';
import {
  Lock,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Crown,
  X,
} from 'lucide-react';
import { STRIPE_LINKS, STRIPE_PLANS } from '../../utils/stripe';

interface PaywallModalProps {
  isOpen: boolean;
  onClose?: () => void;
  scanCount: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  scanCount,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'ultra'>('starter');

  if (!isOpen) return null;

  const handleRedirect = (link: string, planName: string, price: number) => {
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: price,
        currency: 'MYR',
        content_name: `Pavilion QR Pro ${planName}`,
      });
    }
    // Requirement 3: Use window.location.href = that link. No ?success_url params.
    window.location.href = link;
  };

  const currentPlanObj = STRIPE_PLANS.find((p) => p.id === selectedPlan) || STRIPE_PLANS[0];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#00ff88]/30 bg-[#09090b] p-6 sm:p-7 shadow-[0_0_50px_rgba(0,255,136,0.15)] text-white space-y-5 overflow-hidden">
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
              Free Limit Reached (3/3 Scans)
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Unlock Unlimited Scans
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              You've used all 3 free scans. Choose a plan to unlock instant unlimited scanning and power features.
            </p>
          </div>
        </div>

        {/* 3 Plan Selection Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {STRIPE_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id as 'starter' | 'pro' | 'ultra')}
                className={`cursor-pointer rounded-2xl p-3 text-center transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_20px_rgba(0,255,136,0.18)] scale-[1.02]'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#00ff88] text-black text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow-sm">
                    Best
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-bold text-zinc-300">{plan.name}</h4>
                  <div className="mt-1 text-base font-black text-white font-mono">
                    {plan.price}
                  </div>
                  <span className="text-[10px] text-zinc-500 block font-normal">{plan.period}</span>
                </div>
                <div className="mt-2 pt-1 border-t border-zinc-800/80">
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-[#00ff88]' : 'text-zinc-500'}`}>
                    {isSelected ? '✓ Selected' : 'Choose'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature List for Selected Plan */}
        <div className="space-y-2 rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 text-xs text-zinc-300">
          <div className="text-[11px] font-bold text-[#00ff88] uppercase tracking-wider mb-1">
            {currentPlanObj.name} Features Included:
          </div>
          {currentPlanObj.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-zinc-200">{feat}</span>
            </div>
          ))}
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2.5 pt-1">
          {/* Primary button goes to RM59 Starter: window.location.href, no ?success_url params */}
          <button
            type="button"
            onClick={() => {
              const priceNum = selectedPlan === 'starter' ? 59 : selectedPlan === 'pro' ? 159 : 299;
              handleRedirect(currentPlanObj.link, currentPlanObj.name, priceNum);
            }}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-black text-base py-4 px-6 shadow-[0_0_30px_rgba(0,255,136,0.35)] hover:scale-[1.02] active:scale-[0.98] transition text-center cursor-pointer"
          >
            <span className="text-lg">🔓</span>
            <span>
              立即订阅 {currentPlanObj.name} ({currentPlanObj.price}{currentPlanObj.period})
            </span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Quick 1-click Starter Button if not already selected */}
          {selectedPlan !== 'starter' && (
            <button
              type="button"
              onClick={() => handleRedirect(STRIPE_LINKS.starter, 'Starter', 59)}
              className="w-full text-center text-xs text-zinc-400 hover:text-[#00ff88] py-1 transition underline"
            >
              或选择入门 Starter (RM59 / 月) ➔
            </button>
          )}
        </div>

        {/* Guarantee */}
        <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 text-center">
          <span>Stripe Secure 256-bit Checkout</span>
          <span aria-hidden="true">·</span>
          <span>Instant Unlock</span>
          <span aria-hidden="true">·</span>
          <span>Cancel Anytime</span>
        </div>
      </div>
    </div>
  );
};
