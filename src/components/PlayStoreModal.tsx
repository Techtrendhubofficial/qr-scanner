import React, { useState } from 'react';
import { 
  Smartphone, X, Download, CheckCircle, ExternalLink, Shield, 
  Sparkles, Copy, Check, AlertTriangle, Link2, Key, RefreshCw, Info 
} from 'lucide-react';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'deeplink' | 'pwa' | 'twa'>('deeplink');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  
  // Customizable Package Name & Fingerprint for assetlinks.json
  const [packageName, setPackageName] = useState('com.pavilionventure.qr');
  const [sha256Fingerprint, setSha256Fingerprint] = useState('');

  if (!isOpen) return null;

  const appUrl = 'https://qr.pavilionventure.com';
  const assetlinksUrl = 'https://qr.pavilionventure.com/.well-known/assetlinks.json';

  const defaultFingerprint = sha256Fingerprint.trim() || '14:6D:E9:7D:0F:52:CC:E3:42:F2:66:3D:28:C2:59:E4:0C:EB:4D:DF:2A:B7:C5:7A:B4:73:96:A8:1E:52:95:C9';

  const generatedAssetLinks = JSON.stringify([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName.trim() || "com.pavilionventure.qr",
        sha256_cert_fingerprints: [
          defaultFingerprint
        ]
      }
    }
  ], null, 2);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generatedAssetLinks);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([generatedAssetLinks], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetlinks.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto bg-[#0b101b] border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Google Play Console 验证与排查中心
                </h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  深层链接排查
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                目标域名：qr.pavilionventure.com
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2 gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('deeplink')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'deeplink'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>解决深层链接未验证 (图片报错)</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'pwa'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>手机即时安装 (免商店审核)</span>
          </button>

          <button
            onClick={() => setActiveTab('twa')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition-all shrink-0 ${
              activeTab === 'twa'
                ? 'border-blue-400 text-blue-300 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>AAB 签名与上架流程</span>
          </button>
        </div>

        {/* Tab 1: Deep Link Diagnosis (Directly fixing the user's screenshot) */}
        {activeTab === 'deeplink' && (
          <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm max-h-[75vh] overflow-y-auto">
            
            {/* Diagnosis Banner */}
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>截图问题诊断：为什么出现“未通过域名检查”？</span>
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed">
                您的 Android 应用配置了 <strong>Android App Links</strong>（试图让用户点击 <code className="bg-rose-900/60 px-1 py-0.5 rounded text-rose-200">https://qr.pavilionventure.com/*</code> 链接时直接唤起 APP）。
                Google Play 控制台要求必须在该域名的根目录下能公开访问到数字资产关联文件：<br />
                <code className="text-cyan-300 font-mono bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-500/30 text-[11px] block my-1">
                  https://qr.pavilionventure.com/.well-known/assetlinks.json
                </code>
                因为该文件之前不存在或 SHA-256 证书指纹不匹配，导致 Google 域名验证爬虫检测失败，显示了红色感叹号 <strong>“有 1 个域名未验证”</strong> 和 <strong>“有 1 个链接不起作用”</strong>。
              </p>
            </div>

            {/* 3 Steps Fix */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>快速 3 步消除 Google Play 控制台红框：</span>
              </h3>

              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px] font-bold">1</span>
                    获取应用签名密钥的 SHA-256 指纹
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">来自 Google Play</span>
                </div>
                <p className="text-xs text-slate-300">
                  在 Google Play Console 左侧菜单点击：<strong>设置 (Settings) → 应用完整性 (App integrity)</strong>，在 <strong>“应用签名密钥证书 (App signing key certificate)”</strong> 下方复制 <strong>“SHA-256 证书指纹”</strong>。
                  （如果使用上传密钥，则复制上传密钥指纹）。
                </p>
                <div className="pt-1">
                  <label className="text-[11px] text-slate-400 block mb-1">粘贴您的 SHA-256 指纹（选填，粘贴后自动生成专属文件）：</label>
                  <input
                    type="text"
                    value={sha256Fingerprint}
                    onChange={(e) => setSha256Fingerprint(e.target.value)}
                    placeholder="例如: 14:6D:E9:7D:0F:52:CC:E3:42:F2:66:3D:28:C2:59:E4:0C:EB:4D:DF..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="pt-1">
                  <label className="text-[11px] text-slate-400 block mb-1">应用包名 (Package Name)：</label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="com.pavilionventure.qr"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px] font-bold">2</span>
                    项目已自动生成并部署 assetlinks.json
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">已就绪</span>
                </div>
                <p className="text-xs text-slate-300">
                  我们已经在当前代码库的 <code className="text-cyan-300">/public/.well-known/assetlinks.json</code> 及服务端配置了专有 JSON 路由与 CORS 头。
                </p>

                {/* Code Preview */}
                <div className="relative bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                  <pre>{generatedAssetLinks}</pre>
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      onClick={handleCopyJson}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px] flex items-center gap-1 transition-colors"
                      title="复制 JSON 内容"
                    >
                      {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedJson ? '已复制' : '复制 JSON'}</span>
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] flex items-center gap-1 transition-colors"
                      title="下载 assetlinks.json 文件"
                    >
                      <Download className="w-3 h-3" />
                      <span>下载文件</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="/.well-known/assetlinks.json"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>查看当前本站 assetlinks.json 端点</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-bold">3</span>
                    在 Google Play Console 点击“重新验证”
                  </span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">最后一步</span>
                </div>
                <p className="text-xs text-slate-300">
                  确保您的独立站域名 <code>qr.pavilionventure.com</code> 绑定的服务器（如 Vercel 或托管主机）已更新该文件后：<br />
                  回到 Google Play 控制台的 <strong>深层链接 (Deep links)</strong> 页面，点击 <strong>qr.pavilionventure.com</strong> 最右侧的箭头 <strong>→</strong>，进入详情后点击 <strong>“重新验证 (Re-verify)”</strong> 或 <strong>“重新检查”</strong>。<br />
                  验证通过后，状态将变为 <strong className="text-emerald-400">已验证 (0 个问题)</strong>！
                </p>
              </div>

            </div>

            {/* Google Official Verification Helper */}
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong>Google 官方在线测试工具：</strong><br />
                您也可以随时使用 Google 官方数字资产链接测试工具验证域名是否已生效：
                <div className="pt-1">
                  <a
                    href="https://developers.google.com/digital-asset-links/tools/generator"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                  >
                    Google Digital Asset Links Statement Generator &amp; Tester
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: PWA Fast Add */}
        {activeTab === 'pwa' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 推荐方式：手机一秒添加到桌面（免 Play 商店审核与手续费）
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  即装即用
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                在手机 Chrome / Edge 浏览器打开当前网址，点击右上角三个点 <strong>⋮</strong>，选择 <strong>“添加到主屏幕”</strong> 或 <strong>“安装应用”</strong>。即可在手机桌面上生成带有 Pavilion 专属图标的独立 APP，启动速度更快且全屏无网址栏干扰！
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
          </div>
        )}

        {/* Tab 3: TWA / Bubblewrap workflow */}
        {activeTab === 'twa' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Google Play Console 上架流程 (TWA 打包规范)</span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-300">
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
                    <strong>数字资产关联 (assetlinks.json)</strong>：如第一标签页所示，配置好 <code>assetlinks.json</code> 后，Android 客户端就会自动消除顶部 Chrome 导航栏，以原生沉浸模式呈现应用。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Pavilion Venture • Google Play Console &amp; App Links 部署
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            完成并关闭
          </button>
        </div>

      </div>
    </div>
  );
};
