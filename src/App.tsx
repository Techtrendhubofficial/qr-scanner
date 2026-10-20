import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Scanner } from './components/Scanner';
import { AlbumScanner } from './components/AlbumScanner';
import { Generator } from './components/Generator';
import { History } from './components/History';
import { AuditReportModal } from './components/AuditReportModal';
import { PlayStoreModal } from './components/PlayStoreModal';
import { VipModal } from './components/VipModal';
import { TabType, ScanItem, GeneratedQrItem } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scan');
  
  // Modals
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPlayStoreModalOpen, setIsPlayStoreModalOpen] = useState(false);
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
    if (window.confirm('确定要清空全部本地历史记录吗？此操作无法撤销。')) {
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
        openAuditModal={() => setIsAuditModalOpen(true)}
        openPlayStoreModal={() => setIsPlayStoreModalOpen(true)}
        openVipModal={() => setIsVipModalOpen(true)}
        isVip={isVip}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'scan' && (
          <Scanner
            onScanResult={handleScanResult}
            onOpenAlbum={() => setActiveTab('album')}
          />
        )}

        {activeTab === 'album' && (
          <AlbumScanner onScanResult={handleScanResult} />
        )}

        {activeTab === 'generate' && (
          <Generator onSaveQr={handleSaveQr} />
        )}

        {activeTab === 'history' && (
          <History
            scans={scans}
            generations={generations}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openVipModal={() => setIsVipModalOpen(true)}
        isVip={isVip}
      />

      {/* Modals */}
      <AuditReportModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <PlayStoreModal
        isOpen={isPlayStoreModalOpen}
        onClose={() => setIsPlayStoreModalOpen(false)}
      />

      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        isVip={isVip}
        setIsVip={handleSetVip}
      />
    </div>
  );
};

export default App;
