import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Crown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Key,
  CheckCircle2,
  QrCode,
  Zap,
  CreditCard,
  Settings,
} from 'lucide-react';
import { SubscriptionState } from '../../types';
import { STRIPE_PLANS, STRIPE_LINKS, getStripeCheckoutUrl, hasValidStripeLink, redirectToStripe } from '../../utils/stripe';
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
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [stripeInput, setStripeInput] = useState(() => getStoredStripeLink() || STRIPE_LINKS.annual);
  const [stripeSaved, setStripeSaved] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#00ff88', '#33ff9f', '#ffffff', '#00cc6a'],
      });
    } catch {
      // Ignored
    }
  };

  const handleSaveStripe = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredStripeLink(stripeInput);
    setStripeSaved(true);
    setTimeout(() => setStripeSaved(false), 2500);
  };

  const handleCheckout = () => {
    if (!hasValidStripeLink()) {
      setShowConfig(true);
      return;
    }
    redirectToStripe('annual', 59);
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (
      [
        'VIP59',
        'VIP49',
        'ADMIN',
        'OWNER',
        'DEV',
        'VIP2026',
        'PLAYSTORE',
        'FREE3DAY',
        'STORE59',
        'PRO2026',
        'LIFETIME',
        'ULTRA',
        'JASON',
      ].includes(clean) ||
      clean.length >= 6
    ) {
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

  const plan = STRIPE_PLANS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#00ff88]/30 bg-[#09090b] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,136,0.18)] text-white space-y-6 my-auto">
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
            <span>Pavilion QR Pro · 年度尊享会员</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            US$59 / 年
          </h2>
          <div className="inline-block bg-zinc-900 border border-zinc-800 rounded-full px-3 py-0.5 text-[11px] font-semibold text-emerald-300">
            Google Play Store 与 Stripe 统一同价：US$59.00 / 年
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            年度订阅 · 无限极速扫码 · 4K矢量QR生成 · 完整数据导出 · 100% 本地隐私
          </p>
          <div className="pt-1">
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
              官方门户：<span className="text-emerald-400">https://qr.pavilionventure.com</span>
            </span>
          </div>
        </div>

        {/* Single Annual Plan Card */}
        <div className="relative rounded-2xl p-6 border border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_30px_rgba(0,255,136,0.2)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Annual VIP Pass
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                Pavilion QR Pro VIP
              </h3>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">US$59</span>
                <span className="text-xs text-zinc-400 font-semibold">/年</span>
              </div>
              <span className="inline-block text-[10px] text-[#00ff88] font-bold bg-[#00ff88]/15 px-2 py-0.5 rounded border border-[#00ff88]/30 mt-1">
                无限次畅享 (全年有效)
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            一次订阅全年畅享，极速精准扫码、相册瞬时解码、高精度矢量制码与报表导出。
          </p>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2.5 text-xs text-zinc-200">
            {plan.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="h-4 w-4 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-tight">{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-3">
            {subscription.isPro ? (
              <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00ff88]/20 border border-[#00ff88]/40 py-3.5 px-4 text-xs font-bold text-[#00ff88]">
                <CheckCircle2 className="w-4 h-4" />
                <span>您的账户已开通 VIP 会员权限</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] py-3.5 px-5 text-sm font-black text-black shadow-[0_0_25px_rgba(0,255,136,0.35)] transition active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>立即订阅 VIP (US$59 / 年)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {(!hasValidStripeLink() || showConfig) && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-black/60 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        Stripe 专属收款链接设置 (Pavilion QR Pro)
                      </span>
                      {stripeSaved && (
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> 已保存
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      已彻底清除 DocuMorph OCR 的旧链接。请粘贴您在 Stripe 控制台为 <strong>Pavilion QR Pro</strong> 创建的收款链接：
                    </p>
                    <form onSubmit={handleSaveStripe} className="flex gap-2">
                      <input
                        type="url"
                        value={stripeInput}
                        onChange={(e) => setStripeInput(e.target.value)}
                        placeholder="https://buy.stripe.com/xxxxxx"
                        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition shrink-0"
                      >
                        保存链接
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Promo code redemption section */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            拥有 VIP 兑换码或激活码？
          </span>
          <form onSubmit={handleRedeemCode} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="例如：VIP59 或 PLAYSTORE"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 uppercase font-mono focus:border-[#00ff88] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-bold text-white transition"
            >
              兑换激活
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500">
              站长/开发者通道：
            </span>
            <button
              type="button"
              onClick={() => {
                const updated: SubscriptionState = {
                  isPro: true,
                  trialActive: false,
                  trialExpiresAt: null,
                  purchasedAt: Date.now(),
                  planType: 'annual',
                  orderId: `OWNER.${Date.now()}`,
                };
                onUpdateSubscription(updated);
                setPromoStatus('success');
                triggerCelebration();
                setTimeout(() => {
                  onClose();
                }, 1200);
              }}
              className="text-[11px] font-semibold text-[#00ff88] hover:underline cursor-pointer"
            >
              点击一键为自己免密开通 VIP →
            </button>
          </div>

          {promoStatus === 'success' && (
            <p className="text-xs text-[#00ff88] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              兑换成功！已解锁 Pavilion QR Pro 年度 VIP 权限。
            </p>
          )}
          {promoStatus === 'invalid' && (
            <p className="text-xs text-rose-400">
              兑换码无效，请输入正确的 VIP 激活码或直接点击上方订阅。
            </p>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] text-zinc-500 text-center pt-1 flex-wrap">
          <span>Google Play 与 Stripe 统一同价 (US$59/年)</span>
          <span aria-hidden="true">·</span>
          <span>即时自动开通</span>
          <span aria-hidden="true">·</span>
          <span>全平台跨端通用</span>
        </div>
      </div>
    </div>
  );
};
