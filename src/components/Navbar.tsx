import React from 'react';
import { TabType } from '../types';
import {
  QrCode,
  Scan,
  Image as ImageIcon,
  PlusCircle,
  History as HistoryIcon,
  Crown,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openVipModal: () => void;
  isVip: boolean;
  lang: Language;
  toggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openVipModal,
  isVip,
  lang,
  toggleLang,
}) => {
  const t = translations[lang];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('scan')}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                Pavilion QR Pro
              </span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                  isVip
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {isVip ? 'VIP' : 'PRO'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              qr.pavilionventure.com
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
              activeTab === 'scan'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>{t.scanTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('album')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
              activeTab === 'album'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t.albumTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
              activeTab === 'generate'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.generateTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HistoryIcon className="w-4 h-4" />
            <span>{t.historyTab}</span>
          </button>

          <button
            onClick={openVipModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
              activeTab === 'vip' || isVip
                ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>{t.vipTab}</span>
          </button>
        </nav>

        {/* Action Buttons Right Side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <PWAInstallButton lang={lang} />

          {/* Language Switcher (English / 中文) */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer shrink-0"
            title="Switch Language / 切换语言 (English / 中文)"
          >
            <Globe className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'en' ? '中文' : 'English'}</span>
          </button>

          {/* Privacy Policy Link */}
          <a
            href="/privacy.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            title={lang === 'en' ? 'Privacy Policy (Zero Data Retention)' : '隐私政策（本地零留存）'}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Privacy' : '隐私声明'}</span>
          </a>

          {/* VIP Badge button for mobile */}
          <button
            onClick={openVipModal}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-colors"
            title={lang === 'en' ? 'Pro Features' : '会员服务'}
          >
            <Crown className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
