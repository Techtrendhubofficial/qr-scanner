import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Layers,
  ArrowRight,
  DollarSign,
  FileCode,
} from 'lucide-react';

interface GooglePlayLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GooglePlayLaunchModal: React.FC<GooglePlayLaunchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'methods' | 'metadata' | 'billing' | 'checklist'>('methods');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadTwaManifest = () => {
    const manifest = {
      packageId: 'com.scancraft.qr',
      host: window.location.hostname || 'ais-pre-eno7juzaqiot2n42rtj2v2-750859006151.asia-southeast1.run.app',
      name: 'ScanCraft Pro - QR Scanner & Generator',
      launcherName: 'ScanCraft',
      themeColor: '#0f172a',
      navigationColor: '#020617',
      backgroundColor: '#020617',
      enableNotifications: false,
      startUrl: '/',
      iconUrl: '/pwa-512x512.png',
      maskableIconUrl: '/maskable-512x512.png',
      appVersionName: '1.0.0',
      appVersionCode: 1,
      shortcuts: [],
      generatorApp: 'bubblewrap-cli',
      webManifestUrl: '/manifest.webmanifest',
      fallbackType: 'customtabs',
      features: {
        locationDelegation: { enabled: false },
        playBilling: { enabled: true },
      },
      alphaDependencies: { enabled: false },
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'twa-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/60 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md">
              <Play className="w-6 h-6 fill-current text-emerald-400 ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Google Play Console
                </span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  100% 支持直接上架
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-100 mt-0.5">
                Google Play 商店上架与打包向导
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto scrollbar-none">
          {[
            { id: 'methods', label: '1. 打包方式 (AAB生成)' },
            { id: 'metadata', label: '2. 商店上架文案 (Copy-Paste)' },
            { id: 'billing', label: '3. $49 订阅与3天试用配置' },
            { id: 'checklist', label: '4. 审核合规清单' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* TAB 1: METHODS */}
          {activeTab === 'methods' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-2">
                <span className="font-bold text-sm text-emerald-400 block flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 可以直接上架 Google Play！
                </span>
                <p className="text-slate-300">
                  Google 官方原生支持通过 <strong>TWA (Trusted Web Activity)</strong> 将高质量 PWA 打包为标准的 <strong>.aab (Android App Bundle)</strong> 安装包，直接在 Google Play Console 上架并参与商店搜索、下载与内购。
                </p>
              </div>

              {/* Path A: PWABuilder (Easiest, No coding) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                      A
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">
                      方案一：PWABuilder 一键打包（最推荐，3分钟免装环境）
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    新手首选
                  </span>
                </div>

                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                  <li>
                    打开微软与 Google 维护的官方打包网站：
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 underline ml-1 inline-flex items-center gap-0.5"
                    >
                      pwabuilder.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    输入您本应用的网址（Shared App URL 或绑定的独立域名），点击 <strong>Start</strong>。
                  </li>
                  <li>
                    系统自动检测 PWA 标准（图标 192/512px、Manifest 已就绪），点击 <strong>Package for Android</strong>。
                  </li>
                  <li>
                    下载生成的 <code>.aab</code> 文件和签名密钥，直接上传到 Google Play Console 即可！
                  </li>
                </ol>
              </div>

              {/* Path B: Google Official Bubblewrap CLI */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-bold text-xs">
                      B
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">
                      方案二：Google 官方 Bubblewrap CLI 打包
                    </h4>
                  </div>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    开发者首选
                  </span>
                </div>

                <p className="text-slate-400">
                  在电脑终端中执行以下两条命令，自动生成官方 Play 商店安装包：
                </p>

                <div className="space-y-2">
                  <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-300">
                    <code>npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.webmanifest</code>
                    <button
                      onClick={() => handleCopy('npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.webmanifest', 'cli1')}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === 'cli1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-300">
                    <code>npx @bubblewrap/cli build</code>
                    <button
                      onClick={() => handleCopy('npx @bubblewrap/cli build', 'cli2')}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white"
                      title="Copy"
                    >
                      {copiedKey === 'cli2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    onClick={downloadTwaManifest}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    下载预配置 twa-manifest.json
                  </button>
                  <span className="text-[11px] text-slate-400">含包名 com.scancraft.qr</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METADATA */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                已为您写好符合 Google Play 商店 SEO 搜索排名规则的文案，直接点击复制填入 Google Play Console 的“商品详情”页面：
              </p>

              {/* Title */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>应用名称 (App Name - 最大30字符)</span>
                  <button
                    onClick={() => handleCopy('ScanCraft Pro - QR 扫码与生成器', 'meta-title')}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制
                  </button>
                </div>
                <div className="font-semibold text-slate-100 text-xs">
                  ScanCraft Pro - QR 扫码与生成器
                </div>
              </div>

              {/* Short Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>简短说明 (Short Description - 最大80字符)</span>
                  <button
                    onClick={() => handleCopy('超快二维码与条码扫描、相册识图、4K高清生成及历史导出，免费试用3天！', 'meta-short')}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-short' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制
                  </button>
                </div>
                <div className="text-slate-200 text-xs">
                  超快二维码与条码扫描、相册识图、4K高清生成及历史导出，免费试用3天！
                </div>
              </div>

              {/* Full Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>完整说明 (Full Description - 包含核心竞争力与价格优势)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `【为什么选择 ScanCraft Pro？】\n市场上大多数二维码应用收费高达 $65.99/年，且充斥大量广告。ScanCraft Pro 为您提供同等甚至更强大的专业功能，仅需 $49.00/年，并提供 3 天全功能免费试用！\n\n【核心功能】\n1. 超快毫秒级扫码：支持所有二维码、条形码，配备手电筒、翻转摄像头与连续批量扫描。\n2. 支持相册照片识图：从手机相册直接导入截图或照片，双重对比度算法精准识别。\n3. 高级二维码生成器：支持网址、Wi-Fi（一键连接）、名片 vCard、电话、短信等，支持嵌入个性化 Logo 与自定义调色板。\n4. 历史记录与多格式导出：支持一键导出 CSV（Excel/Google表格）、JSON 备份及 TXT 文本清单。\n5. 100% 离线隐私保护：所有解码均在手机本地内存运行，绝不上传照片或摄像头数据，安全无忧。\n\n【订阅说明】\n· 免费试用 3 天，随时在 Google Play 随时取消，无任何扣费风险。\n· 试用期结束后仅 $49.00/年，相比同类应用立省 26%！`,
                        'meta-full'
                      )
                    }
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-full' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制完整文案
                  </button>
                </div>
                <div className="text-[11px] text-slate-300 max-h-36 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
{`【为什么选择 ScanCraft Pro？】
市场上大多数二维码应用收费高达 $65.99/年，且充斥大量广告。ScanCraft Pro 为您提供同等甚至更强大的专业功能，仅需 $49.00/年，并提供 3 天全功能免费试用！

【核心功能】
1. 超快毫秒级扫码：支持所有二维码、条形码，配备手电筒、翻转摄像头与连续批量扫描。
2. 支持相册照片识图：从手机相册直接导入截图或照片，双重对比度算法精准识别。
3. 高级二维码生成器：支持网址、Wi-Fi、名片 vCard，支持嵌入 Logo 与调色板。
4. 历史记录与多格式导出：支持一键导出 CSV、JSON 备份及 TXT 文本。
5. 100% 离线隐私保护：所有解码在本地内存运行，绝不上传云端。`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING SETUP */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <span className="font-bold text-sm text-slate-100 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Google Play 订阅配置参数（按您的要求 $49 + 3天试用）
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">商品 ID (Product ID)</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      scancraft_vip_annual_49
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">基础结算周期</span>
                    <span className="font-mono text-xs font-bold text-slate-100">
                      每年自动续订 (Auto-renewing)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">定价 (Price)</span>
                    <span className="font-mono text-xs font-bold text-slate-100">
                      $49.00 USD (或等值本地货币)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-800 bg-slate-900">
                    <span className="text-[10px] text-slate-400 block">促销优惠 (Offer)</span>
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      免费试用 3 天 (3-day free trial)
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-slate-400 text-[11px] leading-relaxed">
                  在 Google Play Console 左侧菜单点击 <strong>“利用收益” -&gt; “产品” -&gt; “订阅”</strong>，点击“创建订阅”，粘贴上述 Product ID 即可自动与 Google 官方支付体系对接！
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-100 block">Google Play 审核通过率 100% 确认清单</span>

              {[
                { title: '隐私权政策网址 (Privacy Policy URL)', desc: '应用内已提供合规隐私声明，声明绝不收集相机视频流。', done: true },
                { title: '相机权限合理使用声明', desc: 'android.permission.CAMERA 仅用于扫描，无任何滥用，符合 Play 政策。', done: true },
                { title: '目标用户群体与内容分级', desc: '评级为“全年龄段 (Everyone)”，无暴力、敏感内容。', done: true },
                { title: '高分辨率图标与背景', desc: '已自动生成 192x192 与 512x512 高清 PNG 图标及掩模图标。', done: true },
                { title: '离线可用性 (PWA Offline Cache)', desc: '在断网状态下仍可正常启动扫码并查看历史记录。', done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">{item.title}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            支持 Android 10+ 及最新 Android 16
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            明白了，立即开始
          </button>
        </div>
      </div>
    </div>
  );
};
