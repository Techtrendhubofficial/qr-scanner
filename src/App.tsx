import React, { useState, useEffect } from 'react';
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
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CameraScanner } from './components/Scanner/CameraScanner';
import { AlbumScanner } from './components/Scanner/AlbumScanner';
import { ScanResultModal } from './components/Scanner/ScanResultModal';
import { QRGenerator } from './components/Generator/QRGenerator';
import { HistoryView } from './components/History/HistoryView';
import { PricingModal } from './components/Subscription/PricingModal';
import { PrivacyPolicyModal } from './components/Store/PrivacyPolicyModal';
import { GooglePlayLaunchModal } from './components/Store/GooglePlayLaunchModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scan');
  const [historyItems, setHistoryItems] = useState<QRItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isPro: false,
    trialActive: false,
    trialExpiresAt: null,
    purchasedAt: null,
    planType: 'none',
  });
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlayGuideOpen, setIsPlayGuideOpen] = useState(false);

  // Generator pre-filled text
  const [generatorText, setGeneratorText] = useState<string | undefined>(undefined);

  // Load initial persistent storage
  useEffect(() => {
    setHistoryItems(getStoredHistory());
    setSubscription(getStoredSubscription());
    setSettings(getStoredSettings());
  }, []);

  // Update subscription
  const handleUpdateSubscription = (newSub: SubscriptionState) => {
    setSubscription(newSub);
    saveStoredSubscription(newSub);
  };

  // Update settings
  const handleUpdateSettings = (newSettings: ScannerSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Handle successful scan from Camera or Album
  const handleScanSuccess = (rawItem: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-8 selection:bg-emerald-500/25 selection:text-emerald-300">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPlayGuide={() => setIsPlayGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-4 space-y-4">
        {/* Promotional / Competitor Price Banner */}
        {!subscription.isPro && (
          <div className="relative rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-3.5 sm:p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100">
                    Google Play Special: 3-Day Free Trial
                  </span>
                  <button
                    onClick={() => setIsPlayGuideOpen(true)}
                    className="text-[10px] font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-1.5 py-0.5 rounded transition"
                    title="查看 Google Play 上架配置"
                  >
                    SAVE 26% · 上架就绪 ↗
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ScanCraft Pro is only <strong className="text-emerald-400">$49.00/yr</strong> (others charge <span className="line-through text-rose-400">$65.99</span>). Unlimited high-res QR, batch scanning & full history export.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsPlayGuideOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 py-2 px-3 text-xs font-semibold text-emerald-400 transition"
              >
                <span>上架向导</span>
              </button>
              <button
                onClick={() => setIsPricingOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2 px-3.5 text-xs font-bold text-slate-950 transition shadow-sm active:scale-95"
              >
                <span>Try 3 Days Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
              isPro={subscription.isPro}
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
              isPro={subscription.isPro}
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
              isPro={subscription.isPro}
              onOpenPricing={() => setIsPricingOpen(true)}
            />
          </div>
        )}

        {activeTab === 'vip' && (
          <div className="py-2">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg">
                <Crown className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-100">
                ScanCraft Pro Membership
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Enjoy 3 days free trial with zero risk, then only <strong className="text-emerald-400">$49.00/yr</strong> compared to standard store apps charging <span className="line-through text-rose-400">$65.99</span>.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setIsPricingOpen(true)}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 px-8 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 transition active:scale-95"
                >
                  {subscription.isPro ? 'Manage Google Play Subscription' : 'Start 3-Day Free Trial'}
                </button>
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
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        subscription={subscription}
        onUpdateSubscription={handleUpdateSubscription}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
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
      />

      <GooglePlayLaunchModal
        isOpen={isPlayGuideOpen}
        onClose={() => setIsPlayGuideOpen(false)}
      />
    </div>
  );
}
