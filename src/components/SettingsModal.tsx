import React, { useState, useEffect } from 'react';
import { X, Volume2, Smartphone, Layers, Copy, ExternalLink, RefreshCw, ShieldCheck, CreditCard, Check } from 'lucide-react';
import { ScannerSettings } from '../types';
import { getStoredStripeLink, saveStoredStripeLink } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ScannerSettings;
  onUpdateSettings: (newSettings: ScannerSettings) => void;
  onOpenPrivacy: () => void;
  scanCount?: number;
  onResetScanCount?: () => void;
  isPro?: boolean;
  onToggleTestPro?: () => void;
  onOpenPrivacyAudit?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenPrivacy,
  scanCount = 0,
  onResetScanCount,
  isPro = false,
  onToggleTestPro,
  onOpenPrivacyAudit,
}) => {
  const [stripeLink, setStripeLink] = useState('');
  const [linkSaved, setLinkSaved] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStripeLink(getStoredStripeLink());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (key: keyof ScannerSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleSaveStripeLink = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredStripeLink(stripeLink);
    setLinkSaved(true);
    setTimeout(() => setLinkSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">Scanner Preferences</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Beep sound toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Scan Beep Audio
                </span>
                <span className="text-[11px] text-slate-400">
                  Crystal confirmation beep on successful scan
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.beepSound}
              onChange={() => toggle('beepSound')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Haptic vibration toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Haptic Vibration
                </span>
                <span className="text-[11px] text-slate-400">
                  Tactile feedback when code is locked
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.vibrate}
              onChange={() => toggle('vibrate')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Continuous Batch Scan */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Default Continuous Batch
                </span>
                <span className="text-[11px] text-slate-400">
                  Keep camera running without pausing for results
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.continuousScan}
              onChange={() => toggle('continuousScan')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Auto Copy text */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Copy className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Auto Copy to Clipboard
                </span>
                <span className="text-[11px] text-slate-400">
                  Copies scanned text immediately upon detection
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoCopy}
              onChange={() => toggle('autoCopy')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Stripe Payment Link Setting */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Stripe 付款链接 (Payment Link)</span>
              </div>
              {linkSaved && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> 已保存
                </span>
              )}
            </div>
            <form onSubmit={handleSaveStripeLink} className="flex gap-2">
              <input
                type="url"
                value={stripeLink}
                onChange={(e) => setStripeLink(e.target.value)}
                placeholder="https://buy.stripe.com/xxxxxx"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                保存
              </button>
            </form>
            <p className="text-[10px] text-slate-400">
              设置后，网页端点击订阅即可直接调用您的专属 Stripe 页面进行全球收款。
            </p>
          </div>

          {/* QA & Test Debugging Tools */}
          <div className="p-3.5 rounded-2xl bg-black border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#00ff88]" />
                测试调试工具 (QA Test Tool)
              </span>
              <span className="text-[10px] font-mono text-[#00ff88]">
                免费额度: {scanCount}/3 次
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetScanCount?.();
                  setTestNotice('已重置为 0/3 次！可以重新测试免费扫描');
                  setTimeout(() => setTestNotice(null), 2500);
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition text-center"
              >
                重置免费次数 (0/3)
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleTestPro?.();
                  setTestNotice(isPro ? '已取消 Pro，恢复免费测试' : '已激活 Pro VIP！');
                  setTimeout(() => setTestNotice(null), 2500);
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition text-center ${
                  isPro
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/40'
                }`}
              >
                {isPro ? '取消 Pro 权限' : '一键模拟 Pro'}
              </button>
            </div>

            {testNotice && (
              <p className="text-[11px] text-[#00ff88] font-medium animate-in fade-in">
                ✓ {testNotice}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            {onOpenPrivacyAudit && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacyAudit();
                }}
                className="text-xs text-[#00ff88] hover:underline flex items-center gap-1 transition"
              >
                <span>🛡️ 客户防嫁祸公证报告</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
