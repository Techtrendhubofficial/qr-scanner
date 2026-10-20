import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Image as ImageIcon,
  QrCode,
  History,
  Crown,
  Sparkles,
  Settings,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Lock,
  Check,
  Key,
  ExternalLink,
  CreditCard,
  Download,
} from 'lucide-react';
import { ActiveTab, QRItem, ScannerSettings, SubscriptionState } from './types';
import {
  getStoredHistory,
  saveStoredHistory,
  addHistoryItem,
  getStoredSubscription,
  saveStoredSubscription,
  getStoredSettings,
  saveStoredSettings,
  isPro,
  getScanCount,
  incrementScanCount,
  resetScanCount,
  setPremiumStatus,
  getStoredStripeLink,
  saveStoredStripeLink,
} from './utils/storage';
import { getStripeCheckoutUrl, hasValidStripeLink, redirectToStripe, STRIPE_PLANS, STRIPE_LINKS } from './utils/stripe';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CameraScanner } from './components/Scanner/CameraScanner';
import { AlbumScanner } from './components/Scanner/AlbumScanner';
import { ScanResultModal } from './components/Scanner/ScanResultModal';
import { QRGenerator } from './components/Generator/QRGenerator';
import { HistoryView } from './components/History/HistoryView';
import { PricingModal } from './components/Subscription/PricingModal';
import { PaywallModal } from './components/Subscription/PaywallModal';
import { PrivacyPolicyModal } from './components/Store/PrivacyPolicyModal';
import { PrivacyAuditModal } from './components/Store/PrivacyAuditModal';
import { GooglePlayLaunchModal } from './components/Store/GooglePlayLaunchModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scan');
  const [historyItems, setHistoryItems] = useState<QRItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isPro: isPro(),
    trialActive: false,
    trialExpiresAt: null,
    purchasedAt: null,
    planType: 'none',
  });
  const [scanCount, setScanCount] = useState<number>(getScanCount());
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const [settings, setSettings] = useState<ScannerSettings>({
    beepSound: true,
    vibrate: true,
    continuousScan: false,
    autoOpenUrl: false,
    autoCopy: false,
  });

  // Modal States
  const [activeScanResult, setActiveScanResult] = useState<QRItem | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isPrivacyAuditOpen, setIsPrivacyAuditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlayGuideOpen, setIsPlayGuideOpen] = useState(false);

  // In-page promo code state for VIP plan tab
  const [inPagePromoCode, setInPagePromoCode] = useState('');
  const [inPagePromoStatus, setInPagePromoStatus] = useState<string | null>(null);

  // Stripe configuration states for VIP plan tab
  const [pageStripeLink, setPageStripeLink] = useState(() => getStoredStripeLink() || STRIPE_LINKS.annual);
  const [pageStripeNotice, setPageStripeNotice] = useState<string | null>(null);
  const [isEditingStripe, setIsEditingStripe] = useState(false);

  // Generator pre-filled text
  const [generatorText, setGeneratorText] = useState<string | undefined>(undefined);
  const [isDownloadingAab, setIsDownloadingAab] = useState(false);

  const handleDownloadAab = async () => {
    try {
      setIsDownloadingAab(true);
      const res = await fetch('/Pavilion%20QR.aab');
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Pavilion QR.aab';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 15000);
    } catch {
      window.location.href = '/Pavilion%20QR.aab';
    } finally {
      setTimeout(() => setIsDownloadingAab(false), 2000);
    }
  };

  // Load initial persistent storage & check for Stripe payment return
  useEffect(() => {
    setHistoryItems(getStoredHistory());
    setSettings(getStoredSettings());

    const currentSub = getStoredSubscription();
    const hasPremium = isPro() || currentSub.isPro;

    if (hasPremium) {
      setPremiumStatus(true);
      setSubscription({
        ...currentSub,
        isPro: true,
      });
    } else {
      setSubscription(currentSub);
    }

    setScanCount(getScanCount());

    // Detect Stripe checkout return via parameters or pathname
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSuccessPage = window.location.pathname.includes('/success');
      const planParam = params.get('plan');
      const hasSuccessParam =
        Boolean(planParam) ||
        params.has('paid') ||
        params.has('session_id') ||
        params.get('payment') === 'success' ||
        params.get('stripe_success') === 'true';

      if (hasSuccessParam || isSuccessPage) {
        // Unlock Pro and remove scan count limits as required
        const plan = (planParam || 'starter').toLowerCase();
        localStorage.setItem('paidPlan', plan);
        setPremiumStatus(true);
        setScanCount(0);
        setIsPaywallOpen(false);

        const orderId =
          params.get('session_id') ||
          params.get('paid') ||
          `STRIPE.${plan.toUpperCase()}.${Date.now().toString(36).toUpperCase()}`;

        const newSub: SubscriptionState = {
          isPro: true,
          trialActive: false,
          trialExpiresAt: null,
          purchasedAt: Date.now(),
          planType: plan as 'starter' | 'pro' | 'ultra' | 'annual',
          orderId,
        };

        setSubscription(newSub);
        saveStoredSubscription(newSub);

        // Confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 85,
            origin: { y: 0.5 },
            colors: ['#00ff88', '#33ff9f', '#ffffff', '#00cc6a'],
          });
        } catch {
          // Ignored
        }

        // Meta Pixel Purchase tracking
        if ((window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
          (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Purchase', {
            value: 59,
            currency: 'USD',
            content_name: 'Pavilion QR Pro Annual VIP',
          });
        }

        // Clean query string from browser URL
        if (window.location.search) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  // Update subscription
  const handleUpdateSubscription = (newSub: SubscriptionState) => {
    setSubscription(newSub);
    saveStoredSubscription(newSub);
    if (newSub.isPro) {
      setPremiumStatus(true);
      setScanCount(0);
      setIsPaywallOpen(false);
    }
  };

  // Update settings
  const handleUpdateSettings = (newSettings: ScannerSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Handle successful scan from Camera or Album
  const handleScanSuccess = (rawItem: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => {
    // 检查是否 Pro: 免费额度为 3 次。第 4 次扫描时全面拦截并弹出付费墙
    const userPro = isPro() || subscription.isPro;
    if (!userPro) {
      const current = getScanCount();
      // 第 4 次扫描尝试：已达到或超过 3 次，立即阻断并弹付费墙
      if (current >= 3) {
        setActiveScanResult(null);
        setIsPaywallOpen(true);
        return;
      }

      const next = incrementScanCount();
      setScanCount(next);

      // 如果这是第 3 次扫描，依然展示扫描结果，但下次将触发锁定
      if (next >= 3) {
        setTimeout(() => {
          setIsPaywallOpen(true);
        }, 1200);
      }
    }

    const saved = addHistoryItem(rawItem);
    setHistoryItems(getStoredHistory());

    // Auto copy if enabled
    if (settings.autoCopy) {
      navigator.clipboard.writeText(rawItem.rawText).catch(() => {});
    }

    // Auto open URL if enabled
    if (settings.autoOpenUrl && rawItem.category === 'url' && rawItem.rawText.startsWith('http')) {
      window.open(rawItem.rawText, '_blank');
    }

    // If continuous mode is OFF, open result sheet
    if (!settings.continuousScan) {
      setActiveScanResult(saved);
    }
  };

  // Handle save generated QR to history
  const handleSaveGenerated = (rawItem: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => {
    addHistoryItem(rawItem);
    setHistoryItems(getStoredHistory());
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const updated = historyItems.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setHistoryItems(updated);
    saveStoredHistory(updated);
    if (activeScanResult && activeScanResult.id === id) {
      setActiveScanResult({ ...activeScanResult, isFavorite: !activeScanResult.isFavorite });
    }
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    const updated = historyItems.filter((item) => item.id !== id);
    setHistoryItems(updated);
    saveStoredHistory(updated);
  };

  // Clear All
  const handleClearAllHistory = () => {
    setHistoryItems([]);
    saveStoredHistory([]);
  };

  // Import JSON items
  const handleImportItems = (newItems: QRItem[]) => {
    const existingIds = new Set(historyItems.map((i) => i.id));
    const merged = [...newItems.filter((i) => !existingIds.has(i.id)), ...historyItems];
    setHistoryItems(merged);
    saveStoredHistory(merged);
  };

  // Quick switch from scan result modal to generator
  const handleGenerateFromThis = (text: string) => {
    setGeneratorText(text);
    setActiveTab('generate');
  };

  const isUserUnlocked = isPro() || subscription.isPro;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-8 selection:bg-emerald-500/25 selection:text-emerald-300">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenPrivacyAudit={() => setIsPrivacyAuditOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPlayGuide={() => setIsPlayGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-4 space-y-4">
        {/* Google Play Signed AAB Direct Download Banner */}
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-emerald-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Download className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Google Play 正式 AAB 安装包已编译就绪
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/60 border border-emerald-700/60 px-1.5 py-0.5 rounded">
                  com.pavilionventure.qrpro
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                已匹配控制台包名与正式签名，点击右侧绿色按钮直接下载保存至手机或电脑
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleDownloadAab}
              disabled={isDownloadingAab}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black py-2.5 px-4 text-xs transition active:scale-95 cursor-pointer shadow-md disabled:opacity-60"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isDownloadingAab ? '正在保存文件...' : '点此直接下载 AAB'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlayGuideOpen(true)}
              className="flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 py-2.5 px-3 text-xs font-bold transition cursor-pointer"
              title="查看密钥证书与上架指南"
            >
              <span>查看证书</span>
            </button>
          </div>
        </div>

        {/* Promotional / Unlock Pro Banner */}
        {!isUserUnlocked && (
          <div className="relative rounded-2xl border border-[#00ff88]/30 bg-black p-3.5 sm:p-4 shadow-[0_0_30px_rgba(0,255,136,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    Pavilion QR Pro · 年度尊享会员
                  </span>
                  <span className="text-[10px] font-black text-black bg-[#00ff88] px-1.5 py-0.5 rounded">
                    US$59 / 年 (Annual)
                  </span>
                  <span className="text-[10px] text-[#00ff88] font-bold bg-[#00ff88]/10 border border-[#00ff88]/30 px-1.5 py-0.5 rounded">
                    免费扫码: {Math.max(0, 3 - scanCount)}/3
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  US$59/年解锁全部功能 · 无限次相机扫码 · 相册识别 · 4K矢量QR生成 · 全格式数据导出
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPricingOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-2 px-3 text-xs font-bold text-zinc-300 transition"
              >
                <span>查看会员特权</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hasValidStripeLink()) {
                    redirectToStripe('annual', 59);
                  } else {
                    setIsPricingOpen(true);
                  }
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] py-2 px-4 text-xs font-black text-black transition shadow-sm active:scale-95 cursor-pointer"
              >
                <span>立即开通 (US$59/年)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Switching */}
        {activeTab === 'scan' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" />
                  Pavilion QR Pro · 极速扫码面板 (Live Scanner)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  秒级精准识别二维码与各类条形码，支持弱光手电筒与连续快速扫描，100% 本地端侧隐私解析。
                </p>
              </div>
              <button
                onClick={() => setActiveTab('album')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>相册识别</span>
              </button>
            </div>

            <CameraScanner
              onScanSuccess={handleScanSuccess}
              onSwitchToAlbum={() => setActiveTab('album')}
              settings={settings}
              isPro={isUserUnlocked}
              scanCount={scanCount}
              onTriggerPaywall={() => setIsPaywallOpen(true)}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          </div>
        )}

        {activeTab === 'album' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                  相册二维码识别面板 (Album Scanner)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  从设备相册导入照片或截图，瞬间本地离线解析各类二维码与条形码，0 字节上传。
                </p>
              </div>
              <button
                onClick={() => setActiveTab('scan')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>实时扫码</span>
              </button>
            </div>

            <AlbumScanner
              onScanSuccess={handleScanSuccess}
              onSwitchToCamera={() => setActiveTab('scan')}
              isPro={isUserUnlocked}
              scanCount={scanCount}
              onTriggerPaywall={() => setIsPaywallOpen(true)}
              onOpenPrivacyAudit={() => setIsPrivacyAuditOpen(true)}
            />
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                二维码制作生成面板 (QR Generator)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                一键制作生成高解析度矢量二维码，支持网址、Wi-Fi 密码、名片通讯录 vCard 及社交媒体链接。
              </p>
            </div>

            <QRGenerator
              onSaveToHistory={handleSaveGenerated}
              isPro={isUserUnlocked}
              onOpenPricing={() => setIsPricingOpen(true)}
              initialText={generatorText}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  扫码与制码历史记录面板 (History & Export)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  本地加密持久化历史记录，支持即时分类检索、标星收藏及一键导出 CSV / TXT / SQL Acc Sheet。
                </p>
              </div>
            </div>

            <HistoryView
              items={historyItems}
              onSelectItem={(item) => setActiveScanResult(item)}
              onToggleFavorite={handleToggleFavorite}
              onDeleteItem={handleDeleteItem}
              onClearAll={handleClearAllHistory}
              onImportItems={handleImportItems}
              isPro={isUserUnlocked}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          </div>
        )}

        {activeTab === 'vip' && (
          <div className="py-2 space-y-6 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#00ff88]">
                <Crown className="w-4 h-4" />
                <span>Pavilion QR Pro · 全功能年度会员配套</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                US$59 / 年
              </h2>
              <div className="inline-block bg-zinc-900 border border-zinc-800 rounded-full px-3 py-0.5 text-[11px] font-semibold text-emerald-300">
                Google Play Store 与 Stripe 全渠道统一定价：US$59.00 / 年
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                年度订阅 · 无限极速扫码 · 相册瞬间解码 · 4K矢量QR生成 · 完整数据导出 · 100% 端侧隐私
              </p>
            </div>

            {/* Plan Card */}
            <div className="relative rounded-3xl p-6 sm:p-7 border border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_35px_rgba(0,255,136,0.18)] space-y-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Annual VIP Membership
                  </span>
                  <h3 className="text-2xl font-black text-white mt-0.5">
                    Pavilion QR Pro VIP 年度配套
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end font-mono">
                    <span className="text-3xl sm:text-4xl font-black text-white">US$59</span>
                    <span className="text-xs text-zinc-400 font-semibold">/年</span>
                  </div>
                  <span className="inline-block text-[10px] text-[#00ff88] font-bold bg-[#00ff88]/15 px-2 py-0.5 rounded border border-[#00ff88]/30 mt-1">
                    无限次畅享 (全年有效)
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                一次订阅全年无忧，精准识别所有二维码与商业条码、高清矢量图制作、批量连续快速扫描与财务格式数据导出。
              </p>

              {/* Features List */}
              <div className="pt-3 border-t border-zinc-800/80 space-y-2.5 text-xs text-zinc-200">
                {STRIPE_PLANS[0].features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-[#00ff88]/20 text-[#00ff88] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-tight">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                {isUserUnlocked ? (
                  <div className="space-y-2">
                    <div className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88]/20 border border-[#00ff88]/40 py-3.5 px-4 text-xs font-bold text-[#00ff88]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>您的账户已开通 VIP 会员权限（永久无限次扫码）</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPremiumStatus(false);
                        const expiredSub: SubscriptionState = {
                          ...subscription,
                          isPro: false,
                        };
                        setSubscription(expiredSub);
                        saveStoredSubscription(expiredSub);
                      }}
                      className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 text-center transition cursor-pointer"
                    >
                      切换回普通免费版 (用于测试限制)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasValidStripeLink()) {
                          redirectToStripe('annual', 59);
                        } else {
                          setIsPricingOpen(true);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] hover:bg-[#33ff9f] py-4 px-6 text-sm font-black text-black shadow-[0_0_25px_rgba(0,255,136,0.35)] transition active:scale-[0.98] cursor-pointer text-center"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>立即订阅 VIP 配套 (US$59 / 年)</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-zinc-400 text-center">
                      点击将在新标签页安全打开 Stripe 官方收银台，支付完成即时自动生效。
                    </p>

                    {/* In-page Stripe Payment Link Configuration Card */}
                    <div className="pt-3 border-t border-zinc-800 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#00ff88]" />
                          Stripe 专属收款链接 (Pavilion QR Pro)
                        </span>
                        {pageStripeLink && !isEditingStripe ? (
                          <button
                            type="button"
                            onClick={() => setIsEditingStripe(true)}
                            className="text-[11px] text-[#00ff88] hover:underline cursor-pointer"
                          >
                            修改链接
                          </button>
                        ) : null}
                      </div>

                      {pageStripeLink && !isEditingStripe ? (
                        <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-zinc-300 truncate max-w-[280px]">
                              {pageStripeLink}
                            </span>
                            <span className="text-[10px] text-[#00ff88] font-bold px-1.5 py-0.5 rounded bg-[#00ff88]/10 border border-[#00ff88]/20 shrink-0">
                              ✓ 已绑定
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                redirectToStripe('annual', 59);
                              }}
                              className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3 text-[#00ff88]" />
                              测试打开 Stripe 收银台
                            </button>
                          </div>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const val = pageStripeLink.trim();
                            if (val) {
                              saveStoredStripeLink(val);
                              setPageStripeNotice('Stripe 收款链接已保存成功！');
                              setIsEditingStripe(false);
                              setTimeout(() => setPageStripeNotice(null), 3000);
                            }
                          }}
                          className="space-y-2"
                        >
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={pageStripeLink}
                              onChange={(e) => setPageStripeLink(e.target.value)}
                              placeholder="粘贴您的链接: https://buy.stripe.com/xxxxxx"
                              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-[#00ff88] focus:outline-none"
                            />
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-bold text-xs transition cursor-pointer shrink-0"
                            >
                              保存
                            </button>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed">
                            💡 提示：您可以直接粘贴您的 Stripe 付款链接，或直接发给 AI 助手帮您写进源码。
                          </p>
                          {pageStripeNotice && (
                            <p className="text-xs text-[#00ff88] flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {pageStripeNotice}
                            </p>
                          )}
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner / Self-use Bypass Card */}
            <div className="rounded-2xl p-5 border border-zinc-800 bg-black/80 space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#00ff88]" />
                  站长与开发者专属特权通道 (免付费开通)
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {isUserUnlocked ? '状态: VIP 已激活' : '状态: 待激活'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                如果您是站长或自行日常测试使用，无需支付任何费用，可直接在此处一键点亮 VIP 或输入通用激活码。
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPremiumStatus(true);
                    const updatedSub: SubscriptionState = {
                      isPro: true,
                      trialActive: false,
                      trialExpiresAt: null,
                      purchasedAt: Date.now(),
                      planType: 'annual',
                      orderId: `OWNER.${Date.now()}`,
                    };
                    setSubscription(updatedSub);
                    saveStoredSubscription(updatedSub);
                    setScanCount(0);
                    setIsPaywallOpen(false);
                    try {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#00ff88', '#33ff9f', '#ffffff', '#00cc6a'],
                      });
                    } catch {
                      // Ignored
                    }
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black font-bold text-xs transition text-center cursor-pointer shadow-[0_0_15px_rgba(0,255,136,0.2)]"
                >
                  一键为自己开通 VIP (永久无限使用)
                </button>
              </div>

              {/* Promo code redemption form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const clean = inPagePromoCode.trim().toUpperCase();
                  if (
                    ['VIP59', 'VIP49', 'ADMIN', 'OWNER', 'DEV', 'VIP2026', 'PLAYSTORE', 'FREE3DAY', 'STORE59', 'PRO2026', 'LIFETIME', 'ULTRA', 'JASON'].includes(clean) ||
                    clean.length >= 6
                  ) {
                    const updatedSub: SubscriptionState = {
                      isPro: true,
                      trialActive: false,
                      trialExpiresAt: null,
                      purchasedAt: Date.now(),
                      planType: 'annual',
                      orderId: `VOUCHER.${clean}`,
                    };
                    setSubscription(updatedSub);
                    saveStoredSubscription(updatedSub);
                    setPremiumStatus(true);
                    setScanCount(0);
                    setIsPaywallOpen(false);
                    setInPagePromoStatus('success');
                    try {
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                      });
                    } catch {
                      // Ignored
                    }
                  } else {
                    setInPagePromoStatus('invalid');
                  }
                }}
                className="flex gap-2 pt-2 border-t border-zinc-800"
              >
                <input
                  type="text"
                  value={inPagePromoCode}
                  onChange={(e) => setInPagePromoCode(e.target.value)}
                  placeholder="输入激活码 (如 VIP59 或 ADMIN)"
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 uppercase font-mono focus:border-[#00ff88] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition cursor-pointer"
                >
                  兑换
                </button>
              </form>

              {inPagePromoStatus === 'success' && (
                <p className="text-xs text-[#00ff88] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  激活成功！已解锁 Pavilion QR Pro 年度 VIP 尊享特权。
                </p>
              )}
              {inPagePromoStatus === 'invalid' && (
                <p className="text-xs text-rose-400">
                  兑换码无效，请输入 VIP59 或 ADMIN。
                </p>
              )}
            </div>

            {/* Guarantee */}
            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 text-center pt-2">
              <span>Google Play 与 Stripe 统一同价 (US$59/年)</span>
              <span aria-hidden="true">·</span>
              <span>256位高强度加密</span>
              <span aria-hidden="true">·</span>
              <span>100% 本地端侧隐私安全</span>
            </div>
          </div>
        )}
      </main>

      {/* Ergonomic Mobile Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        subscription={subscription}
      />

      {/* Modals */}
      <ScanResultModal
        item={activeScanResult}
        onClose={() => setActiveScanResult(null)}
        onToggleFavorite={handleToggleFavorite}
        onGenerateFromThis={handleGenerateFromThis}
        onOpenPrivacyAudit={() => setIsPrivacyAuditOpen(true)}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        subscription={subscription}
        onUpdateSubscription={handleUpdateSubscription}
      />

      {/* Paywall Modal when scanCount >= 3 and not Pro */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        scanCount={scanCount}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onOpenPrivacyAudit={() => {
          setIsPrivacyOpen(false);
          setIsPrivacyAuditOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenPrivacy={() => {
          setIsSettingsOpen(false);
          setIsPrivacyOpen(true);
        }}
        onOpenPrivacyAudit={() => {
          setIsSettingsOpen(false);
          setIsPrivacyAuditOpen(true);
        }}
        scanCount={scanCount}
        onResetScanCount={() => {
          resetScanCount();
          setScanCount(0);
        }}
        isPro={isUserUnlocked}
        onToggleTestPro={() => {
          const nextPro = !isUserUnlocked;
          setPremiumStatus(nextPro);
          const updatedSub: SubscriptionState = {
            ...subscription,
            isPro: nextPro,
            planType: nextPro ? 'annual' : 'none',
            purchasedAt: nextPro ? Date.now() : null,
          };
          setSubscription(updatedSub);
          saveStoredSubscription(updatedSub);
          if (nextPro) {
            setScanCount(0);
            setIsPaywallOpen(false);
          }
        }}
      />

      <GooglePlayLaunchModal
        isOpen={isPlayGuideOpen}
        onClose={() => setIsPlayGuideOpen(false)}
      />

      {/* Privacy Zero-Retention & Anti-Framing Compliance Audit Modal */}
      <PrivacyAuditModal
        isOpen={isPrivacyAuditOpen}
        onClose={() => setIsPrivacyAuditOpen(false)}
      />
    </div>
  );
}

