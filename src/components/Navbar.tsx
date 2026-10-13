import React from 'react';
import { Crown, Sparkles, ShieldCheck, Download, Settings, History, QrCode, Image as ImageIcon, Camera } from 'lucide-react';
import { ActiveTab, SubscriptionState } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { getStripeCheckoutUrl } from '../utils/stripe';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: SubscriptionState;
  onOpenPricing: () => void;
  onOpenPrivacy: () => void;
  onOpenSettings: () => void;
  onOpenPlayGuide: () => void;
  onOpenPrivacyAudit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
  onOpenPrivacy,
  onOpenSettings,
  onOpenPlayGuide,
  onOpenPrivacyAudit,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('scan')}
            className="flex items-center gap-2 text-left group transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-sm shadow-emerald-500/20">
              <QrCode className="h-4 w-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-bold tracking-tight text-slate-100 text-base flex items-center gap-1.5">
              Pavilion QR Pro
              {subscription.isPro ? (
                <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  VIP
                </span>
              ) : null}
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop 4 Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('scan')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'scan' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Scan
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'album' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Scan from Album
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'generate' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Generate QR
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'history' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History & Export
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Google Play Launch Kit trigger */}
          <button
            onClick={onOpenPlayGuide}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-slate-800 transition"
            title="Google Play 上架指南与打包助手"
          >
            <span className="hidden sm:inline">Play 商店上架</span>
            <span className="sm:hidden">Play 上架</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Pricing / VIP CTA */}
          {subscription.isPro ? (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 px-3 py-1.5 text-xs font-bold text-[#00ff88] transition hover:bg-[#00ff88]/20"
              title="Manage Subscription"
            >
              <Crown className="h-3.5 w-3.5 text-[#00ff88]" />
              <span className="hidden sm:inline">Active Plan</span>
              <span className="sm:hidden">Active</span>
            </button>
          ) : (
            <a
              href={getStripeCheckoutUrl()}
              onClick={() => {
                if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
                  (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
                    value: 29.00,
                    currency: 'MYR',
                    content_name: 'Navbar Unlock Starter',
                  });
                }
              }}
              className="flex items-center gap-1.5 rounded-lg bg-[#00ff88] hover:bg-[#33ff9f] px-3 py-1.5 text-xs font-black text-black shadow-sm shadow-[#00ff88]/30 transition hover:brightness-105 active:scale-95 no-underline"
            >
              <Sparkles className="h-3.5 w-3.5 text-black fill-current" />
              <span>Unlock</span>
              <span className="hidden sm:inline font-bold text-black/90">(RM59/mo)</span>
            </a>
          )}

          {/* Privacy Audit / Anti-Framing Report button */}
          {onOpenPrivacyAudit && (
            <button
              onClick={onOpenPrivacyAudit}
              className="flex items-center gap-1 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/10 px-2.5 py-1.5 text-xs font-bold text-[#00ff88] hover:bg-[#00ff88]/20 transition"
              title="客户文件零留存检测与防栽赃证明报告"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#00ff88]" />
              <span className="hidden sm:inline">零留存报告</span>
            </button>
          )}

          {/* Store / Privacy Policy button */}
          <button
            onClick={onOpenPrivacy}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Google Play Store & Privacy Policy"
            aria-label="Google Play Store Policy"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
