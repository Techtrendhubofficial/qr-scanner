import React from 'react';
import { Crown, Check, X, Sparkles, Shield, Zap, Infinity as InfinityIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  setIsVip: (val: boolean) => void;
}

export const VipModal: React.FC<VipModalProps> = ({ isOpen, onClose, isVip, setIsVip }) => {
  if (!isOpen) return null;

  const handleActivate = () => {
    setIsVip(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
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
                  Pavilion QR Pro 商业尊享版
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isVip ? '已激活' : '终身授权'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                专为 Pavilion Venture 打造的旗舰级商用二维码引擎
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
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">当前套餐级别</span>
                <h3 className="text-lg font-extrabold text-white">Pavilion Enterprise Ultimate</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-emerald-400 font-bold">永久有效</div>
                <div className="text-[11px] text-slate-400">免年费 / 免续费</div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 space-y-2 text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>无限制极速扫码（毫秒级对焦，暗光自动补光）</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>高清矢量二维码生成（支持 Logo 嵌入与多颜色定制）</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>一键导出 Excel / CSV 历史记录（无条数上限）</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>独家 0 留存隐私公证凭证（杜绝商业诽谤与同行诬陷）</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>独立专属域名绑定与 PWA 桌面无缝运行</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>商户绑定识别码：PV-ENT-2026-VIP</span>
            <span className="text-emerald-400 font-semibold">● 系统状态正常</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {isVip ? '您的商户授权已完全生效' : '随时免费一键激活'}
          </span>
          <div className="flex items-center gap-2">
            {!isVip ? (
              <button
                onClick={handleActivate}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>一键激活企业 VIP</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                关闭
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
