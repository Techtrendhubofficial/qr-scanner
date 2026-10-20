import React, { useState } from 'react';
import { Smartphone, X, Download, CheckCircle, ExternalLink, Shield, Sparkles, Copy, Check } from 'lucide-react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const appUrl = 'https://qr.pavilionventure.com';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto bg-[#0d131f] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Google Play 商店上架与手机端直装
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                官方独立域名：qr.pavilionventure.com
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
          
          {/* Method 1: Instant PWA Install (Zero Play Store fees, works immediately) */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> 推荐方式：手机一秒添加到桌面（免下载 APK）
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                即装即用
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              在手机 Chrome 浏览器打开当前网址，点击右上角三个点 <strong>⋮</strong>，选择 <strong>“添加到主屏幕”</strong> 或 <strong>“安装应用”</strong>。即可在手机桌面上生成带有 Pavilion 专属图标的独立 APP，启动速度更快且全屏无网址栏干扰！
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? '已复制网址！' : '复制专属网址'}</span>
              </button>
            </div>
          </div>

          {/* Method 2: Google Play Console (TWA / Bubblewrap) */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Google Play Console 上架流程 (TWA 打包)</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 text-[11px] font-bold">1</span>
                <div>
                  <strong>准备 Google Play 开发者账号</strong>：前往 play.google.com/console 注册开发者资格（一次性 25 美元）。
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 text-[11px] font-bold">2</span>
                <div>
                  <strong>生成 Android AAB 安装包</strong>：利用 Google 官方 <code>Bubblewrap CLI</code> 工具，直接将 <code>https://qr.pavilionventure.com</code> 打包成合规的 <code>.aab</code> 文件。
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 text-[11px] font-bold">3</span>
                <div>
                  <strong>数字资产关联 (assetlinks.json)</strong>：将 Google Play 签名公钥配置到您的域名下，即可实现无缝信任与原生沉浸体验。
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            知道了
          </button>
        </div>

      </div>
    </div>
  );
};
