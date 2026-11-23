import React from 'react';
import { Crown, Check, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../utils/i18n';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  setIsVip: (val: boolean) => void;
  lang?: Language;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  isVip,
  setIsVip,
  lang = 'en',
}) => {
  if (!isOpen) return null;

  const isEn = lang === 'en';

  const handleActivate = () => {
    setIsVip(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto bg-[#0d131f] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {isEn ? 'Pavilion QR Pro Edition' : 'Pavilion QR Pro 尊享版'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isVip
                    ? isEn
                      ? 'Active'
                      : '已激活'
                    : isEn
                    ? 'Free Unlock'
                    : '免费解锁'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn
                  ? 'Fast, private, offline-ready QR & Barcode engine'
                  : '极速、隐私安全、支持离线扫码的旗舰二维码引擎'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/20 to-slate-900/60 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {isEn ? 'Current Edition' : '当前版本'}
                </span>
                <h3 className="text-lg font-extrabold text-white">Pavilion QR Pro</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-400 font-bold">
                  {isEn ? 'No Subscription' : '永久免费'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isEn ? 'Zero Ads • Zero Tracking' : '无广告 · 零追踪'}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 space-y-2 text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Unlimited ultra-fast QR & Barcode scanning with flashlight assist'
                    : '无限制极速扫码（毫秒级对焦，暗光手电筒补光）'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Album photo QR decoding for saved screenshots & images'
                    : '相册图片识别，支持本地截图与照片扫码'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Custom QR code generator (URL, Wi-Fi, Contact, WhatsApp, Text)'
                    : '自定义二维码生成（网址、Wi-Fi、名片、文本等）'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? 'One-click CSV history export stored 100% locally on your device'
                    : '一键导出 CSV 历史记录，数据 100% 仅保存在本地设备'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isEn
                    ? 'Strict Zero Server Retention — camera frames never leave your device'
                    : '严格零留存隐私保护 — 画面绝不上传服务器'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{isEn ? 'Privacy Mode: On-Device Only' : '隐私模式：纯本地端侧运行'}</span>
            <span className="text-emerald-400 font-semibold">
              ● {isEn ? 'Ready' : '运行正常'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {isVip
              ? isEn
                ? 'All Pro features are unlocked'
                : '全部高级功能已解锁'
              : isEn
              ? 'Unlock all Pro themes & badges for free'
              : '免费一键激活全部高级功能'}
          </span>
          <div className="flex items-center gap-2">
            {!isVip ? (
              <button
                onClick={handleActivate}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEn ? 'Activate Pro' : '一键激活 Pro'}</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                {isEn ? 'Close' : '关闭'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
