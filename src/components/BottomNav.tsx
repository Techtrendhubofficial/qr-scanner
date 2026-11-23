import React from 'react';
import { TabType } from '../types';
import { Image as ImageIcon, Scan, PlusCircle, History } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  lang?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lang = 'en',
}) => {
  const t = translations[lang];
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-4 items-center justify-around">
        {/* 极速扫码 */}
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
          <span className="text-[11px] mt-0.5">{t.navScan}</span>
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
          <span className="text-[11px] mt-0.5">{t.navAlbum}</span>
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
            {t.navCreate}
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
          <span className="text-[11px] mt-0.5">{t.navHistory}</span>
        </button>
      </div>
    </nav>
  );
};
