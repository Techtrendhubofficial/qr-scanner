import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  CreditCard,
  Key,
  Flame,
  CheckCircle2,
  ExternalLink,
  Settings,
} from 'lucide-react';
import { SubscriptionState } from '../../types';
import { getStoredStripeLink, saveStoredStripeLink } from '../../utils/storage';

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
  const [billingPlan, setBillingPlan] = useState<'trial_annual' | 'lifetime'>('trial_annual');
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [showPlaySheet, setShowPlaySheet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Stripe Link Management
  const [stripeLink, setStripeLink] = useState('');
  const [showStripeInput, setShowStripeInput] = useState(false);
  const [stripeInputVal, setStripeInputVal] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = getStoredStripeLink();
      setStripeLink(saved);
      setStripeInputVal(saved);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
      });
    } catch {
      // Ignored
    }
  };

  // Handle Stripe Payment Redirect
  const handleStripeCheckout = () => {
    if (!stripeLink.trim()) {
      setShowStripeInput(true);
      return;
    }

    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: 49.00,
        currency: 'USD',
        content_name: 'Stripe ScanCraft Pro $49',
      });
    }

    // Direct redirect to Stripe Checkout
    window.location.href = stripeLink.trim();
  };

  // Save new Stripe Link
  const handleSaveStripeLink = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = stripeInputVal.trim();
    saveStoredStripeLink(clean);
    setStripeLink(clean);
    setShowStripeInput(false);
    if (clean) {
      alert('Stripe 付款链接已保存！现在点击付款将直接跳转到您的 Stripe 收银台。');
    }
  };

  // Start 3-day free trial or subscribe with Google Play
  const handleStartGooglePlayBilling = () => {
    setIsProcessing(true);
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: 49.00,
        currency: 'USD',
        content_name: billingPlan === 'trial_annual' ? 'ScanCraft Pro 3-Day Trial' : 'ScanCraft Pro Lifetime VIP',
      });
    }
    setTimeout(() => {
      setIsProcessing(false);
      setShowPlaySheet(true);
    }, 400);
  };

  // Complete purchase in simulated Google Play sheet
  const handleConfirmGooglePlayPurchase = () => {
    const trialExpiry = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
    const updated: SubscriptionState = {
      isPro: true,
      trialActive: billingPlan === 'trial_annual',
      trialExpiresAt: billingPlan === 'trial_annual' ? trialExpiry : null,
      purchasedAt: Date.now(),
      planType: billingPlan === 'trial_annual' ? 'trial' : 'annual',
      orderId: `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onUpdateSubscription(updated);
    setShowPlaySheet(false);
    triggerCelebration();

    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      if (billingPlan === 'trial_annual') {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'StartTrial', {
          value: 49.00,
          currency: 'USD',
          predicted_ltv: 49.00,
        });
      } else {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Subscribe', {
          value: 49.00,
          currency: 'USD',
        });
      }
    }
  };

  // Redeem Promo code / License key
  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (['VIP49', 'PLAYSTORE', 'FREE3DAY', 'STORE49', 'PRO2026', 'LIFETIME'].includes(clean) || clean.length >= 6) {
      const updated: SubscriptionState = {
        isPro: true,
        trialActive: false,
        trialExpiresAt: null,
        purchasedAt: Date.now(),
        planType: 'lifetime',
        licenseKey: clean,
        orderId: `GPA.PROMO-${clean}-${Date.now().toString(36).toUpperCase()}`,
      };
      onUpdateSubscription(updated);
      setPromoStatus('License activated successfully! Enjoy Lifetime Pro VIP.');
      triggerCelebration();
    } else {
      setPromoStatus('Invalid promotional code. Try "VIP49" or "PLAYSTORE".');
    }
  };

  // Cancel subscription (for testing)
  const handleCancelSub = () => {
    const updated: SubscriptionState = {
      isPro: false,
      trialActive: false,
      trialExpiresAt: null,
      purchasedAt: null,
      planType: 'none',
    };
    onUpdateSubscription(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-b border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Crown className="w-4 h-4 text-emerald-400" />
            <span>Google Play Store Offer</span>
          </div>

          <h3 className="mt-1 text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            ScanCraft Pro VIP Pass
          </h3>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Free for 3 days, then just <strong className="text-emerald-400 font-bold">$49.00</strong>/year.
            Others charge <span className="line-through text-rose-400">$65.99</span> for the same features!
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Active Subscription Status Banner */}
          {subscription.isPro ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-slate-100">
                    VIP Pro Access Active
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  {subscription.trialActive ? '3-Day Free Trial' : 'Active Plan'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {subscription.trialActive && subscription.trialExpiresAt
                  ? `Your 3-day trial is active until ${new Date(subscription.trialExpiresAt).toLocaleDateString()}. Price after trial: $49.00/yr.`
                  : 'You have full access to unlimited batch scanning, 4K exports, and CSV backups.'}
              </p>
              {subscription.orderId && (
                <div className="text-[10px] text-slate-400 font-mono">
                  Google Play Order ID: {subscription.orderId}
                </div>
              )}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleCancelSub}
                  className="text-xs text-slate-400 hover:text-rose-400 underline transition"
                >
                  Reset / Cancel Subscription (Test Mode)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Pricing Plan Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 3-Day Free Trial + $49/yr */}
                <div
                  onClick={() => setBillingPlan('trial_annual')}
                  className={`relative p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    billingPlan === 'trial_annual'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                    Most Popular
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        3-DAY FREE TRIAL
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-100 font-mono">
                        $49.00
                      </span>
                      <span className="text-xs text-slate-400">/ year</span>
                    </div>

                    <p className="mt-1 text-xs text-slate-300">
                      $0.00 charged today. Cancel anytime with 1 tap.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Save 26% vs $65.99 competitors</span>
                  </div>
                </div>

                {/* Lifetime VIP $49 Option */}
                <div
                  onClick={() => setBillingPlan('lifetime')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    billingPlan === 'lifetime'
                      ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-cyan-400">
                      ONE-TIME LIFETIME
                    </span>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-100 font-mono">
                        $49.00
                      </span>
                      <span className="text-xs text-slate-400">once</span>
                    </div>

                    <p className="mt-1 text-xs text-slate-300">
                      Pay once, own forever. Never rebilled.
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Includes all future updates</span>
                  </div>
                </div>
              </div>

              {/* Competitor Benchmark Comparison Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Why ScanCraft Pro is Better Value
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">Annual Price</span>
                    <div className="flex items-center gap-3">
                      <span className="text-rose-400 line-through text-[11px]">
                        $65.99/yr (Others)
                      </span>
                      <span className="font-bold text-emerald-400 font-mono">
                        $49.00/yr (ScanCraft)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">Trial Period</span>
                    <span className="font-medium text-slate-200">
                      3 Days 100% Free
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">Scan from Album</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Included
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">CSV & JSON History Export</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Unlimited Downloads
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/60">
                    <span className="text-slate-300">Privacy & Security</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 100% On-Device Offline
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">4K Generator & Logos</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> No Watermarks
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual Payment CTAs: Stripe & Google Play */}
              <div className="space-y-2.5">
                {/* Stripe Checkout Button */}
                <button
                  onClick={handleStripeCheckout}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3.5 px-6 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 transition active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {billingPlan === 'trial_annual'
                      ? '通过 Stripe 支付 $49 (享试用与即时激活)'
                      : '通过 Stripe 购买 $49 终身版'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Google Play Simulated Button */}
                <button
                  onClick={handleStartGooglePlayBilling}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <span className="text-emerald-400">▶</span>
                  <span>Google Play In-App 订阅模式 (3天免费试用)</span>
                </button>
              </div>

              {/* Stripe Link Configurator Toggle */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>
                    {stripeLink ? 'Stripe 付款链接已绑定' : '使用内置演示收款或配置专属 Stripe'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStripeInput(!showStripeInput)}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  {showStripeInput ? '收起配置' : '配置 Stripe 链接'}
                </button>
              </div>

              {/* Stripe Link Input Field */}
              {showStripeInput && (
                <form
                  onSubmit={handleSaveStripeLink}
                  className="p-3.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between text-xs text-slate-200 font-semibold">
                    <span>设置您的 Stripe Payment Link</span>
                    <span className="text-[10px] text-slate-400">支持 buy.stripe.com</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={stripeInputVal}
                      onChange={(e) => setStripeInputVal(e.target.value)}
                      placeholder="https://buy.stripe.com/xxxxxx"
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                    >
                      保存
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    在您的 Stripe Dashboard 生成一个 $49.00 的 Payment Link，粘贴在此处即可完成全自动跳转收款！
                  </p>
                </form>
              )}

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 text-center pt-1">
                <span>Stripe 256位加密</span>
                <span aria-hidden="true">·</span>
                <span>支持信用卡 / Apple Pay / 支付宝</span>
                <span aria-hidden="true">·</span>
                <span>即时开通</span>
              </div>
            </>
          )}

          {/* Promo Code or License Key Box */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              Have a Google Play Promo Code or Gift Voucher?
            </span>
            <form onSubmit={handleRedeemCode} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Try: VIP49 or PLAYSTORE"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 uppercase font-mono focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
              >
                Redeem
              </button>
            </form>
            {promoStatus && (
              <p
                className={`text-xs ${
                  promoStatus.includes('success') ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {promoStatus}
              </p>
            )}
          </div>
        </div>

        {/* Google Play Purchase Bottom Sheet Simulator */}
        {showPlaySheet && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full bg-slate-900 border-t border-slate-700 rounded-t-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200 text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                    ▶
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    Google Play
                  </span>
                </div>
                <button
                  onClick={() => setShowPlaySheet(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-100">
                  ScanCraft Pro - QR Scanner & Generator
                </h4>
                <p className="text-xs text-slate-400">
                  By ScanCraft Mobile Apps · In-app subscription
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Starting today:</span>
                  <span className="font-semibold text-emerald-400">3 Days Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Starting on {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}:
                  </span>
                  <span className="font-mono font-bold text-slate-100">$49.00 / year</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Google Account:</span>
                  <span className="text-slate-300">jasonang9996@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment method:</span>
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    •••• 4242
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                You can cancel at any time in Subscriptions on Google Play. You will not be charged if you cancel before the trial ends.
              </p>

              <button
                onClick={handleConfirmGooglePlayPurchase}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition active:scale-[0.98]"
              >
                <span>Subscribe with Google Play</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
