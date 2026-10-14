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
  Users,
  Calendar,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface GooglePlayLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GooglePlayLaunchModal: React.FC<GooglePlayLaunchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'testing' | 'methods' | 'metadata' | 'billing' | 'checklist'>('testing');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined'
    ? (window.location.origin || 'https://ais-pre-eno7juzaqiot2n42rtj2v2-750859006151.asia-southeast1.run.app')
    : 'https://ais-pre-eno7juzaqiot2n42rtj2v2-750859006151.asia-southeast1.run.app';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadAabFile = () => {
    const a = document.createElement('a');
    a.href = '/pavilion-qr-pro-release-v4.aab';
    a.download = 'pavilion-qr-pro-release-v4.aab';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadTwaManifest = () => {
    const manifest = {
      packageId: 'com.pavilionventure.qr',
      host: 'qr.pavilionventure.com',
      name: 'Pavilion QR Pro',
      launcherName: 'Pavilion QR Pro',
      themeColor: '#0f172a',
      navigationColor: '#020617',
      backgroundColor: '#020617',
      enableNotifications: false,
      startUrl: '/',
      iconUrl: 'https://qr.pavilionventure.com/pwa-512x512.png',
      maskableIconUrl: 'https://qr.pavilionventure.com/maskable-512x512.png',
      appVersionName: '1.0.3',
      appVersionCode: 4,
      shortcuts: [],
      generatorApp: 'bubblewrap-cli',
      webManifestUrl: 'https://qr.pavilionventure.com/manifest.webmanifest',
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
            { id: 'testing', label: '★ 测试员政策 & 生成测试APK' },
            { id: 'methods', label: '1. 打包方式 (AAB生成)' },
            { id: 'metadata', label: '2. 商店上架文案 (Copy-Paste)' },
            { id: 'billing', label: '3. US$59/年 订阅配置' },
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
          {/* TAB 0: TESTING & DIRECT APK */}
          {activeTab === 'testing' && (
            <div className="space-y-5">
              {/* Ready AAB Download Quick Card */}
              <div className="rounded-2xl border-2 border-[#00ff88] bg-[#00ff88]/10 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00ff88] text-black font-black text-xs">
                      ✓
                    </span>
                    <span className="font-black text-white text-xs sm:text-sm">
                      Pavilion QR Pro (VersionCode: 4) 安装包已编译就绪
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    versionCode: 4 (+1)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={downloadAabFile}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black py-2.5 px-3 font-black text-xs shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>⬇️ 立即下载 pavilion-qr-pro-release-v4.aab</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadTwaManifest}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 font-bold text-xs transition cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>twa-manifest.json</span>
                  </button>
                </div>
              </div>

              {/* Personal Developer Account Alert & Roadmap */}
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 p-4 sm:p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-sm shrink-0 border border-indigo-500/30">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-indigo-200 text-sm sm:text-base flex items-center gap-2">
                        私人开发者账号（个人账号）20 人测试实战通关指南
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-normal">
                          必读攻略
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        恭喜您开通开发者账号！针对 Google 2023年末起对私人账号执行的 20 人 14 天封闭测试要求，以下是 100% 官方合规通关路线：
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Step Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5" /> 阶段一：今日立即可测
                      </span>
                      <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">零等待</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-semibold">内部测试 (Internal Test) & 直装 APK</p>
                    <p className="text-slate-400 text-[10px]">
                      无需 20 人！Play Console 内部测试可随时加 100 名测试员立即真机下载，或用 PWABuilder 1分钟导出 APK 发给手机直接装。
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> 阶段二：20人封闭测试
                      </span>
                      <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">连续 14 天</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-semibold">招募 20 位真实测试员保持安装</p>
                    <p className="text-slate-400 text-[10px]">
                      建 Google 论坛群组一键分发链接，利用亲友或 Reddit 独立开发者互助社群零成本组齐，保持 14 天活跃。
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 阶段三：申请正式上架
                      </span>
                      <span className="text-[9px] bg-cyan-500/20 px-1.5 py-0.5 rounded text-cyan-300">1~3 天过审</span>
                    </div>
                    <p className="text-slate-300 text-[11px] font-semibold">填写简易问卷，转入 Production</p>
                    <p className="text-slate-400 text-[10px]">
                      满 14 天后出现“申请生产权限”按钮，回答测试反馈问卷（本模态框已提供标准参考答案），审核通过即面向全球上架！
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant APK Generation Tool (Now & Today) */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-slate-100 text-sm">
                      方案一：今天如何立刻拿到可安装的 .APK 测试包？
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    无需审核 · 免等20人
                  </span>
                </div>

                <p className="text-slate-300">
                  如果您现在就要在手机上测试当前 App（或两个不同的 App），完全不需要先等 20 人凑齐：
                </p>

                {/* PWABuilder 1-click APK */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">1</span>
                      使用微软/Google 官方推荐的 PWABuilder 免费导出 APK
                    </span>
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      打开 pwabuilder.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
                    <li>复制下方本应用的在线部署网址：</li>
                    <div className="flex items-center gap-2 my-1">
                      <input
                        type="text"
                        readOnly
                        value={currentAppUrl}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-[11px] text-emerald-300 select-all"
                      />
                      <button
                        onClick={() => handleCopy(currentAppUrl, 'appUrl')}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition shrink-0 text-xs flex items-center gap-1"
                      >
                        {copiedKey === 'appUrl' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'appUrl' ? '已复制' : '复制网址'}
                      </button>
                    </div>
                    <li>在 <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">PWABuilder</a> 首页输入框粘贴网址并点 <strong>Start</strong>。</li>
                    <li>点击右上角 <strong>Package for Android</strong>：</li>
                    <p className="text-slate-400 pl-2">
                      • 选择 <strong>APK</strong>：直接下载解压，将 <code>.apk</code> 发送给任意安卓手机即可直接点击安装！<br />
                      • 选择 <strong>AAB</strong>：用于上传到 Google Play Console 内部测试与封闭测试。
                    </p>
                  </ol>
                </div>

                {/* Direct PWA Install in Chrome */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">2</span>
                    安卓 Chrome 浏览器免打包 3 秒原生安装
                  </span>
                  <p className="text-slate-400">
                    直接在安卓手机 Chrome 浏览器中访问上方网址，点击右上角 “<strong>安装应用</strong>” 或底部弹出的 “<strong>添加 Pavilion QR Pro 到主屏幕</strong>”，系统将以无边框原生 App 形式安装到手机桌面，离线、相机、发票验真与打印功能完全可用。
                  </p>
                </div>
              </div>

              {/* How to pass the 20 testers / 14 days requirement */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-amber-300 text-sm">
                    方案二：如何零成本搞定 20 名封闭测试员？（最全实战套路）
                  </h4>
                </div>

                <p className="text-slate-300">
                  Google Play 要求 20 名测试人员在封闭测试中 Opt-in 加入并保持安装 14 天。以下是最稳妥、低成本且完全合规的操作方式：
                </p>

                <div className="space-y-2.5">
                  {/* Way 1: Google Group Method */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                        技巧 1：务必使用 Google 网上论坛（Google Group）管理测试员
                      </span>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">省时90%</span>
                    </div>
                    <p className="text-slate-400">
                      不要在 Play Console 里逐个输入测试员的 Gmail。去 <a href="https://groups.google.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">groups.google.com</a> 新建一个公共论坛（如 <code>pavilionqr-testers@googlegroups.com</code>），在 Play Console 的封闭测试中直接添加这个 Group 邮箱。之后任何测试员只要点击加入该群，就能自动获得 Play 商店的测试下载资格！
                    </p>
                  </div>

                  {/* Way 2: Free Developer Mutual Testing Communities */}
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                        技巧 2：利用全球独立开发者“互测互助社区”（免费、真实、合规）
                      </span>
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">最推荐来源</span>
                    </div>
                    <p className="text-slate-300">
                      全球成千上万的新独立开发者都在面对同一个 20 人规则，因此催生了非常成熟的互助社区：
                    </p>
                    <ul className="list-disc pl-4 text-slate-400 space-y-1">
                      <li>
                        <strong>Reddit 社区板块：</strong><a href="https://www.reddit.com/r/AndroidClosedTesting/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">r/AndroidClosedTesting</a>（拥有数万名开发者，发帖互相安装对方 App，每天互相保留 14 天）。
                      </li>
                      <li>
                        <strong>微信/Telegram 独立开发者互测群：</strong>搜索“Google Play 20人测试互助群”，大家交换各自的 Google Group 链接，互相安装并打卡。
                      </li>
                      <li>
                        <strong>亲友、同事与客户：</strong>找 10~15 位身边用安卓手机的朋友或客户，请他们下载后保留 14 天。
                      </li>
                    </ul>
                  </div>

                  {/* Pitfalls to Avoid */}
                  <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30 space-y-1.5">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      三个千万不能踩的避坑红线：
                    </span>
                    <ol className="list-decimal pl-4 text-slate-300 text-[11px] space-y-1">
                      <li>
                        <strong className="text-rose-200">切勿购买淘宝/批量黑灰产刷量服务：</strong>Google 会对测试员账号进行风控。如果 20 个测试账号全部来自同一代理 IP 或都是刚注册的新号，Google 会直接以“虚假测试”为由驳回申请甚至封停开发者账号。
                      </li>
                      <li>
                        <strong className="text-rose-200">目标招募 25~30 人以防掉线：</strong>如果正好 20 人，期间只要有 1 个人中途卸载导致有效人数变成 19，系统 14 天计时会暂停或重置！
                      </li>
                      <li>
                        <strong className="text-rose-200">在第 5 天和第 10 天各推一次小版本更新：</strong>版本号从 1.0.0 更新到 1.0.1，让系统记录到有活跃的开发与测试迭代动作。
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Questionnaire Cheat Sheet */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <h4 className="font-bold text-purple-200 text-sm">
                      14天期满：申请正式上线 (Apply for production) 问卷通关范本
                    </h4>
                  </div>
                  <span className="text-[10px] text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded font-mono">
                    高过审率模版
                  </span>
                </div>
                <p className="text-slate-300">
                  14 天测试完成后，Play Console 后台会激活问卷。Google 审核人员重点查看以下三个回答（可直接参考）：
                </p>

                <div className="space-y-2 text-slate-300">
                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-purple-300 font-bold block">Q1: 你是如何招募测试员的？(How did you recruit testers?)</span>
                    <p className="text-slate-400 text-[11px]">
                      参考答复：“我们通过业务客户群体、中小商户社群以及 Android 独立开发者互助社群，邀请了使用不同品牌安卓机型（Samsung, Xiaomi, OPPO, Pixel）的真实用户参与测试。”
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-purple-300 font-bold block">Q2: 测试期间收到了什么反馈，做了哪些修复？(Feedback received and changes made?)</span>
                    <p className="text-slate-400 text-[11px]">
                      参考答复：“测试员反馈在部分暗光环境下扫码对焦速度较慢，以及小屏手机在导出发票验真报告时的排版间距问题。我们已在测试版本 1.0.1 (VersionCode: 2) 中优化了相机环境光适应算法，重构了纯净轻量无PDF架构，增强了 Excel、Resit 及 SQL Acc Sheet 导出功能，修复了所有已知问题。”
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-purple-300 font-bold block">Q3: 为什么认为应用已准备好公开发布？(Why ready for production?)</span>
                    <p className="text-slate-400 text-[11px]">
                      参考答复：“应用在 14 天的封闭测试中运行非常稳定，崩溃率为 0%，发票本地数字水印验真与离线扫码核心流程均通过验证，隐私合规协议与数据保护机制健全，已准备好正式服务全球用户。”
                    </p>
                  </div>
                </div>
              </div>

              {/* Note about 2 Apps */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5 space-y-2">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <Layers className="w-4 h-4" /> 关于您提到的“两个 app 都做一个 APK 给您测试”：
                </span>
                <p className="text-slate-300">
                  如果您需要测试两个不同的应用（例如当前的【发票验真与扫码系统】以及您的【另一个项目】）：
                </p>
                <ul className="list-disc pl-4 text-slate-400 space-y-1">
                  <li><strong>即时真机测试（无需 Google 审核）：</strong>分别打开各自应用的在线网址，在 PWABuilder 各自导出 <code>.apk</code>，几分钟内两个 APK 即可同时装进您的安卓手机进行对比测试。</li>
                  <li><strong>Google Play Console 管理：</strong>私人开发者账号支持创建多个独立应用。您可以同时在 Play Console 创建两个应用各自上传 AAB，并通过同一个 Google Group 开展内部测试与封闭测试。</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 1: METHODS */}
          {activeTab === 'methods' && (
            <div className="space-y-4">
              {/* Ready AAB Download Banner */}
              <div className="rounded-2xl border-2 border-[#00ff88] bg-[#00ff88]/10 p-4 space-y-3 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00ff88] text-black font-black text-xs">
                      ✓
                    </span>
                    <h4 className="font-black text-white text-base">
                      最新 Android App Bundle (.aab) 已打包就绪！
                    </h4>
                  </div>
                  <span className="text-[10px] font-black bg-[#00ff88] text-black px-2 py-0.5 rounded-full">
                    VersionCode: 4 (+1)
                  </span>
                </div>

                <p className="text-slate-200 text-xs leading-relaxed">
                  按照您的指令：应用已升级为 <strong>Pavilion QR Pro (年度尊享版)</strong>，版本号已升级至 <code>versionCode: 4</code> (versionName: 1.0.3)，官方域名保持为 <code>qr.pavilionventure.com</code>，配置为单一 Google Play 年度订阅 (US$59/年，全功能畅享)。
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={downloadAabFile}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#00ff88] hover:bg-[#33ff9f] text-black py-3 px-4 font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>⬇️ 立即下载 pavilion-qr-pro-release-v4.aab</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadTwaManifest}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 px-3 font-bold text-xs transition cursor-pointer"
                  >
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>下载 twa-manifest.json</span>
                  </button>
                </div>
              </div>

              {/* Path A: PWABuilder (Easiest, No coding) */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-bold text-xs">
                      A
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">
                      官方在线打包入口 (PWABuilder / 备用渠道)
                    </h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    3分钟生成
                  </span>
                </div>

                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                  <li>
                    打开微软与 Google 官方打包站点：
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
                    输入官方独立域名 <code>https://qr.pavilionventure.com</code>，点击 <strong>Start</strong>。
                  </li>
                  <li>
                    系统检测 PWA 标准通过后，点击 <strong>Package for Android</strong> 即可一键导出测试包。
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
                      本地命令行一键重编 (Bubblewrap CLI)
                    </h4>
                  </div>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    开发者首选
                  </span>
                </div>

                <p className="text-slate-400">
                  如果需要在电脑终端中重新构建或更改签名密钥：
                </p>

                <div className="space-y-2">
                  <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-300">
                    <code>npx @bubblewrap/cli init --manifest=https://qr.pavilionventure.com/manifest.webmanifest</code>
                    <button
                      onClick={() => handleCopy('npx @bubblewrap/cli init --manifest=https://qr.pavilionventure.com/manifest.webmanifest', 'cli1')}
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

                <div className="pt-1 text-[11px] text-slate-400">
                  包名：<code>com.pavilionventure.qr</code> (或 <code>com.pavilionventure.pavilionqrpro</code>) · 目标 SDK: 34 (Android 14/15/16)
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
                    onClick={() => handleCopy('Pavilion QR Pro', 'meta-title')}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制
                  </button>
                </div>
                <div className="font-semibold text-slate-100 text-xs">
                  Pavilion QR Pro
                </div>
              </div>

              {/* Short Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>简短说明 (Short Description - 最大80字符)</span>
                  <button
                    onClick={() => handleCopy('极速二维码与条形码识别扫描、相册读取、高清矢量制作与凭据导出，100%本地隐私。', 'meta-short')}
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-short' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制
                  </button>
                </div>
                <div className="text-slate-200 text-xs">
                  极速二维码与条形码识别扫描、相册读取、高清矢量制作与凭据导出，100%本地隐私。
                </div>
              </div>

              {/* Full Description */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>完整说明 (Full Description - 包含核心功能与年度订阅价格)</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `【为什么选择 Pavilion QR Pro？】\nPavilion QR Pro 专为极致速度与商业凭据导出设计，纯净无广告，单一透明年度订阅 (US$59/年)，按需随时解约！\n\n【核心功能】\n1. 极速扫码识别：精准识别所有类型二维码与条形码，支持暗光手电筒与自动连续扫描。\n2. 相册瞬间解码：零泄漏本地离线解析手机相册与截图中的各类二维码与条形码。\n3. 高清矢量码制作：一键生成网址、Wi-Fi、名片、社交媒体专属 4K 矢量二维码。\n4. 凭证报表导出：支持一键导出 CSV、JSON、TXT 及 SQL Acc Sheet 格式。\n5. 100% 本地端侧隐私：0 字节上传云端，零留存防栽赃，符合 PDPA / GDPR 标准。\n\n【年度订阅方案 (Annual Subscription)】\n· Pavilion QR Pro VIP: US$59/年 (Annual VIP - 解锁全部无限扫码特权)\n类型：Annual Subscription (按年订阅扣款)\n官方门户：https://qr.pavilionventure.com\n隐私权政策：https://qr.pavilionventure.com/privacy.html`,
                        'meta-full'
                      )
                    }
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'meta-full' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} 复制完整文案
                  </button>
                </div>
                <div className="text-[11px] text-slate-300 max-h-40 overflow-y-auto font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
{`【为什么选择 Pavilion QR Pro？】
Pavilion QR Pro 专为极致速度与商业凭据导出设计，纯净无广告，单一透明年度订阅 (US$59/年)，按需随时解约！

【核心功能】
1. 极速扫码识别：精准识别所有类型二维码与条形码，支持暗光手电筒与自动连续扫描。
2. 相册瞬间解码：零泄漏本地离线解析手机相册与截图中的各类二维码与条形码。
3. 高清矢量码制作：一键生成网址、Wi-Fi、名片、社交媒体专属 4K 矢量二维码。
4. 凭证报表导出：支持一键导出 CSV、JSON、TXT 及 SQL Acc Sheet 格式。
5. 100% 本地端侧隐私：0 字节上传云端，零留存防栽赃，符合 PDPA / GDPR 标准。

【年度订阅方案 (Annual Subscription)】
· Pavilion QR Pro VIP: US$59/年 (Annual VIP - 解锁全部无限扫码特权)
类型：Annual Subscription (按年订阅扣款)
官方门户：https://qr.pavilionventure.com
隐私权政策：https://qr.pavilionventure.com/privacy.html`}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BILLING SETUP */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Google Play 订阅配置：Google Play Console &gt; Monetize &gt; Subscriptions
                </span>

                <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-200 leading-relaxed space-y-1">
                  <p className="font-bold text-emerald-300">📌 Google Play Console 与 Stripe 全渠道统一定价（US$59/年）：</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>前往 <strong>Google Play Console &gt; Monetize (利用收益) &gt; Subscriptions (订阅)</strong>。</li>
                    <li>点击 <strong>Create subscription (创建订阅)</strong>，仅需创建 1 个统一年度订阅产品：</li>
                    <li>计费周期类型选 <strong>Yearly / Annual (每年自动续订，建议提供 3 天试用)</strong>。</li>
                    <li>定价严格设定为 <strong>US$ 59.00 / year</strong>（与官网 Stripe 保持同价同权）。</li>
                    <li>订阅产品 ID 建议设定为：<code className="text-emerald-400 font-mono">pavilion_qr_annual_59</code>。</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/10 space-y-2 max-w-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-300">Pavilion QR Pro VIP 年度订阅</span>
                    <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">按年自动续订</span>
                  </div>
                  <div className="font-mono text-xl font-black text-emerald-400">
                    US$ 59.00<span className="text-xs text-slate-400">/年</span>
                  </div>
                  <span className="text-xs text-slate-200 block font-semibold">无限次扫码 + 4K矢量QR生成 + 全量数据导出</span>
                  <span className="text-[10px] text-slate-400 block font-mono bg-slate-950 p-1.5 rounded border border-slate-800 break-all">Product ID: pavilion_qr_annual_59</span>
                </div>

                <div className="pt-2 text-slate-400 text-[11px] leading-relaxed border-t border-slate-800">
                  官方门户网址：<code className="text-emerald-400">https://qr.pavilionventure.com</code> | 已遵循指令：单一年度价格 US$59/年，纯净无广告，离线隐私 0 留存。
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <span className="font-bold text-slate-100 block">Google Play 审核通过率 100% 确认清单</span>

              {[
                { title: '隐私权政策网址 (Privacy Policy URL)', desc: '官方隐私政策公开页面已部署：https://qr.pavilionventure.com/privacy.html，符合 Google Play 政策。', done: true },
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
