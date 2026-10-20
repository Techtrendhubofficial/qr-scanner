import React from 'react';
import { TabType } from '../types';
import { Scan, Image as ImageIcon, PlusCircle, History, Crown } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  openVipModal: () => void;
  isVip: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  openVipModal,
  isVip,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        {/* 扫码 */}
        <button
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'scan'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'scan' ? 'bg-emerald-500/15' : ''}`}>
            <Scan className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">扫码</span>
        </button>

        {/* 相册识别 */}
        <button
          onClick={() => setActiveTab('album')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'album'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'album' ? 'bg-emerald-500/15' : ''}`}>
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">相册</span>
        </button>

        {/* 制作二维码 (Center Accent) */}
        <button
          onClick={() => setActiveTab('generate')}
          className="flex flex-col items-center justify-center -mt-3.5"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center transform active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <span className={`text-[11px] mt-1 ${activeTab === 'generate' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
            制作
          </span>
        </button>

        {/* 历史记录 */}
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            activeTab === 'history'
              ? 'text-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'history' ? 'bg-emerald-500/15' : ''}`}>
            <History className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">历史</span>
        </button>

        {/* 会员 */}
        <button
          onClick={openVipModal}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isVip
              ? 'text-amber-400 font-semibold'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <div className={`p-1 rounded-lg ${isVip ? 'bg-amber-500/15' : ''}`}>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[11px] mt-0.5">VIP</span>
        </button>
      </div>
    </nav>
  );
};
