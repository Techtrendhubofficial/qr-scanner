import React from 'react';
import { Crown, Sparkles, ShieldCheck, Download, Settings, History, QrCode, Image as ImageIcon, Camera } from 'lucide-react';
import { ActiveTab, SubscriptionState } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: SubscriptionState;
  onOpenPricing: () => void;
  onOpenPrivacy: () => void;
  onOpenSettings: () => void;
  onOpenPlayGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  onOpenPricing,
  onOpenPrivacy,
  onOpenSettings,
  onOpenPlayGuide,
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
              ScanCraft Pro
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
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
              title="Manage Pro Subscription"
            >
              <Crown className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">VIP Active</span>
              <span className="sm:hidden">VIP</span>
            </button>
          ) : (
            <button
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-slate-950 fill-current" />
              <span>3-Day Free Trial</span>
              <span className="hidden sm:inline text-slate-900/80 font-normal">($49/yr)</span>
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
