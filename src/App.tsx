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
} from './utils/storage';
import { getStripeCheckoutUrl } from './utils/stripe';
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

  // Generator pre-filled text
  const [generatorText, setGeneratorText] = useState<string | undefined>(undefined);

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
          const priceMap: Record<string, number> = { starter: 49, pro: 199, ultra: 599 };
          (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Purchase', {
            value: priceMap[plan] || 49,
            currency: 'MYR',
            content_name: `Pavilion QR Pro ${plan.toUpperCase()}`,
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
                    Pavilion QR Pro · 月度订阅
                  </span>
                  <span className="text-[10px] font-black text-black bg-[#00ff88] px-1.5 py-0.5 rounded">
                    FROM RM59/月 (Monthly)
                  </span>
                  <span className="text-[10px] text-[#00ff88] font-bold bg-[#00ff88]/10 border border-[#00ff88]/30 px-1.5 py-0.5 rounded">
                    Free Scans: {Math.max(0, 3 - scanCount)}/3
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Starter (RM59/月·100次) · Pro (RM159/月·500次+Excel/Resit) · Ultra (RM299/月·无限次+SQL)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPricingOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 py-2 px-3 text-xs font-bold text-zinc-300 transition"
              >
                <span>3 大月度订阅 (RM59-RM299/月)</span>
              </button>
              <a
                href={getStripeCheckoutUrl()}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] py-2 px-4 text-xs font-black text-black transition shadow-sm active:scale-95 no-underline"
              >
                <span>Subscribe (RM59/mo)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Tab Content Switching */}
        {activeTab === 'scan' && (
          <div className="space-y-4">
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
                  Scan from Album / Gallery
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select screenshots or photos from your device to decode QR codes and barcodes with zero privacy leaks.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('scan')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Switch to Camera</span>
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
                Custom QR Code Generator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate high-resolution vector QR codes for websites, Wi-Fi networks, business contact vCards, and social profiles.
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
                  Scan & Creation History
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete local records with one-tap search, categorization, and instant CSV/JSON/TXT export.
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
          <div className="py-2">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30 shadow-[0_0_25px_rgba(0,255,136,0.2)]">
                <Crown className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Pavilion QR Pro Subscription Plans
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Enjoy unlimited instant scanning, photo decoding, 4K vector QR generation, and full data export with official Stripe billing.
              </p>

              <div className="pt-2">
                {isUserUnlocked ? (
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-[#00ff88]/15 border border-[#00ff88]/40 py-3 px-6 text-sm font-bold text-[#00ff88]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Account is Active & Unlocked</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsPricingOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] hover:bg-[#33ff9f] py-3.5 px-8 text-sm font-black text-black shadow-[0_0_30px_rgba(0,255,136,0.35)] transition active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>查看 3 大月度订阅方案 (From RM59/月)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ergonomic Mobile Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'vip') {
            setIsPricingOpen(true);
          } else {
            setActiveTab(tab);
          }
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
          setSubscription((prev) => ({
            ...prev,
            isPro: nextPro,
          }));
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

