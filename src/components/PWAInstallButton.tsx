import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWA';
import { Language } from '../utils/i18n';

interface PWAInstallButtonProps {
  lang: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors cursor-pointer shrink-0"
        title={lang === 'en' ? 'Install App' : '安装应用'}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{lang === 'en' ? 'Install' : '安装'}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors cursor-pointer shrink-0"
          title={lang === 'en' ? 'Install on iPhone / iPad' : '添加到主屏幕'}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'en' ? 'Install' : '安装'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-[#0f172a] p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  {lang === 'en' ? 'Install on iPhone / iPad' : '添加到 iPhone / iPad 主屏幕'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white p-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {lang === 'en' ? (
                  <>
                    1. Tap the <strong>Share</strong> button in the Safari toolbar.
                    <br />
                    2. Scroll down and tap <strong>Add to Home Screen</strong>.
                  </>
                ) : (
                  <>
                    1. 点击 Safari 底部的 <strong>分享</strong> 按钮。
                    <br />
                    2. 向下滑动并选择 <strong>添加到主屏幕</strong>。
                  </>
                )}
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2 text-sm font-semibold text-white transition-colors"
              >
                {lang === 'en' ? 'Got it' : '知道了'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
