import React from 'react';
import { Camera, Image as ImageIcon, QrCode, History, Crown } from 'lucide-react';
import { ActiveTab, SubscriptionState } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  subscription: SubscriptionState;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  subscription,
}) => {
  const tabs = [
    {
      id: 'scan' as ActiveTab,
      label: 'Live Scan',
      icon: Camera,
    },
    {
      id: 'album' as ActiveTab,
      label: 'From Album',
      icon: ImageIcon,
    },
    {
      id: 'generate' as ActiveTab,
      label: 'Create QR',
      icon: QrCode,
    },
    {
      id: 'history' as ActiveTab,
      label: 'History',
      icon: History,
    },
    {
      id: 'vip' as ActiveTab,
      label: subscription.isPro ? 'VIP Active' : 'Plans (RM59)',
      icon: Crown,
      highlight: !subscription.isPro,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-lg">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-all ${
                isActive
                  ? 'text-[#00ff88] font-bold'
                  : tab.highlight
                  ? 'text-[#00ff88] hover:text-[#33ff9f]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'scale-100'
                  }`}
                />
                {tab.id === 'vip' && !subscription.isPro && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
