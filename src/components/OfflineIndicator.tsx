import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWA';
import { Language } from '../utils/i18n';

interface OfflineIndicatorProps {
  lang: Language;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500/95 px-3 py-1.5 text-xs font-medium text-slate-950 shadow-lg backdrop-blur-sm">
      <WifiOff className="w-3.5 h-3.5" />
      <span>
        {lang === 'en'
          ? 'Offline Mode — QR scanning & generation still work'
          : '离线模式 — 扫码与制作功能仍可正常使用'}
      </span>
    </div>
  );
};
