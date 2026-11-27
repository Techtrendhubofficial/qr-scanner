import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Scanner } from './components/Scanner';
import { AlbumScanner } from './components/AlbumScanner';
import { Generator } from './components/Generator';
import { History } from './components/History';
import { VipModal } from './components/VipModal';
import { TabType, ScanItem, GeneratedQrItem } from './types';
import { Language } from './utils/i18n';
import { OfflineIndicator } from './components/OfflineIndicator';

export const App: React.FC = () => {
  // Language State (Defaults to English 'en' for Google Play and global users, with easy toggle to Chinese)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('pavilion_app_lang');
    if (saved === 'en' || saved === 'zh') return saved;
    return 'en';
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next: Language = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('pavilion_app_lang', next);
      return next;
    });
  };

  // Default to QR Scanner view with optional query tab routing
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tabParam = url.searchParams.get('tab');
      if (tabParam === 'album' || tabParam === 'generate' || tabParam === 'history' || tabParam === 'scan') {
        return tabParam;
      }
    }
    return 'scan';
  });

  // VIP Status Modal
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  // VIP Status
  const [isVip, setIsVip] = useState<boolean>(() => {
    return localStorage.getItem('pavilion_vip_active') === 'true';
  });

  const handleSetVip = (val: boolean) => {
    setIsVip(val);
    localStorage.setItem('pavilion_vip_active', val ? 'true' : 'false');
  };

  // Scans History
  const [scans, setScans] = useState<ScanItem[]>(() => {
    try {
      const saved = localStorage.getItem('pavilion_scans_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Generations History
  const [generations, setGenerations] = useState<GeneratedQrItem[]>(() => {
    try {
      const saved = localStorage.getItem('pavilion_gens_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('pavilion_scans_history', JSON.stringify(scans));
  }, [scans]);

  useEffect(() => {
    localStorage.setItem('pavilion_gens_history', JSON.stringify(generations));
  }, [generations]);

  const handleScanResult = (result: ScanItem) => {
    setScans((prev) => [result, ...prev]);
  };

  const handleSaveQr = (item: GeneratedQrItem) => {
    setGenerations((prev) => [item, ...prev]);
  };

  const handleClearHistory = () => {
    const confirmMsg =
      lang === 'en'
        ? 'Are you sure you want to clear all local history? This cannot be undone.'
        : '确定要清空全部本地历史记录吗？此操作无法撤销。';
    if (window.confirm(confirmMsg)) {
      setScans([]);
      setGenerations([]);
      localStorage.removeItem('pavilion_scans_history');
      localStorage.removeItem('pavilion_gens_history');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openVipModal={() => setIsVipModalOpen(true)}
        isVip={isVip}
        lang={lang}
        toggleLang={toggleLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'scan' && (
          <Scanner
            onScanResult={handleScanResult}
            onOpenAlbum={() => setActiveTab('album')}
            lang={lang}
          />
        )}

        {activeTab === 'album' && (
          <AlbumScanner onScanResult={handleScanResult} lang={lang} />
        )}

        {activeTab === 'generate' && (
          <Generator onSaveQr={handleSaveQr} lang={lang} />
        )}

        {activeTab === 'history' && (
          <History
            scans={scans}
            generations={generations}
            onClearHistory={handleClearHistory}
            lang={lang}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
      />

      {/* VIP Modal */}
      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        isVip={isVip}
        setIsVip={handleSetVip}
        lang={lang}
      />

      {/* Offline Status Indicator */}
      <OfflineIndicator lang={lang} />
    </div>
  );
};

export default App;
