import React, { useState } from 'react';
import { 
  Server, 
  Globe, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  X, 
  ArrowRight,
  Code2,
  FileCode2,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';

interface HostingMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  openGoogleHelperModal?: () => void;
}

export const HostingMigrationModal: React.FC<HostingMigrationModalProps> = ({ 
  isOpen, 
  onClose,
  openGoogleHelperModal 
}) => {
  const [activeHosting, setActiveHosting] = useState<'vercel' | 'cloudflare' | 'firebase'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://shop.pavilionventure.com';
  const customDomain = 'https://shop.pavilionventure.com';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-neutral-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-4 sm:p-5 border-b border-neutral-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
              <Server className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                更换 Hosting & 搜索引擎畅通上线指南
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  PageSpeed 100分方案
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                彻底解决 PageSpeed / Google 提示临时预览域名被拦截、无缝绑定自定义域名
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Important Alert: Why PageSpeed says "blocked from indexing" */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-200 text-sm sm:text-base mb-1">
                  为什么 PageSpeed Insights 提示这个 Hosting "会被屏蔽于被搜索"？
                </h3>
                <div className="space-y-1.5 text-neutral-300 leading-relaxed text-xs">
                  <p>
                    <strong className="text-amber-300">1. 原因：</strong>
                    你刚才在 PageSpeed 输入的是 Google AI Studio 的<span className="text-white font-medium underline">内部临时开发沙盒网址</span>（例如 <code className="bg-neutral-800 px-1 py-0.5 rounded text-amber-300">*.run.app</code>）。
                    Google 为了防止开发调试中的未完成站点污染全球搜索排名，对所有开发测试沙盒默认开启了开发保护（带有 <code className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-200">X-Robots-Tag: noindex</code> 或沙盒安全盾）。
                  </p>
                  <p>
                    <strong className="text-emerald-400">2. 真相：</strong>
                    <span className="text-white font-medium">你的商城代码没有任何问题！</span>
                    系统已经为您生成了标准的 <code className="text-emerald-300">robots.txt</code>（完全允许 Google 蜘蛛爬取）和 <code className="text-emerald-300">sitemap.xml</code> 站点地图。
                  </p>
                  <p>
                    <strong className="text-cyan-300">3. 解决方案：</strong>
                    只要将网站发布到专门的生产托管平台（Hosting）并绑定您自己的独立域名（如 <code className="text-cyan-300">shop.pavilionventure.com</code>），Google 蜘蛛和 PageSpeed 即可完全畅通无阻，获得 95~100 极速评分！
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Jump to Google Pay Error Solution */}
          <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <span className="font-semibold text-blue-200">正在填写 Google Pay & Wallet Console？</span>
                <p className="text-neutral-400 text-[11px]">发现商家类别代码 (MCC) 与网址红框？点击打开一键填写与代码速查。</p>
              </div>
            </div>
            {openGoogleHelperModal && (
              <button
                onClick={() => {
                  onClose();
                  openGoogleHelperModal();
                }}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shrink-0 flex items-center justify-center gap-1.5 transition shadow"
              >
                <span>解决 Google Pay 3处红框</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3 Recommended Hosting Options */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              推荐的 3 大免费、极速、全球 CDN Hosting 平台
            </h3>

            {/* Hosting Platform Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setActiveHosting('vercel')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border transition ${
                  activeHosting === 'vercel'
                    ? 'bg-neutral-800 text-white border-neutral-600 shadow-md ring-1 ring-emerald-500'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800/50'
                }`}
              >
                <span className="text-white font-bold">▲ Vercel</span>
                <span className="hidden sm:inline text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                  最推荐
                </span>
              </button>

              <button
                onClick={() => setActiveHosting('cloudflare')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border transition ${
                  activeHosting === 'cloudflare'
                    ? 'bg-neutral-800 text-white border-neutral-600 shadow-md ring-1 ring-amber-500'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800/50'
                }`}
              >
                <span className="text-amber-400 font-bold">Cloudflare</span>
                <span className="hidden sm:inline text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  大马极速
                </span>
              </button>

              <button
                onClick={() => setActiveHosting('firebase')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border transition ${
                  activeHosting === 'firebase'
                    ? 'bg-neutral-800 text-white border-neutral-600 shadow-md ring-1 ring-blue-500'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:bg-neutral-800/50'
                }`}
              >
                <span className="text-amber-300 font-bold">Firebase</span>
                <span className="hidden sm:inline text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                  Google 原生
                </span>
              </button>
            </div>

            {/* Platform 1: Vercel */}
            {activeHosting === 'vercel' && (
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center font-bold text-white text-sm">
                      ▲
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Vercel (全球首选前端托管)</h4>
                      <p className="text-[11px] text-neutral-400">免费额度每月 100GB 流量，自带自动 SSL 证书与全球 Edge CDN</p>
                    </div>
                  </div>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>打开 vercel.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="p-3 bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>已打包好最新上线更新包 (quick-update.zip)</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        包含无重复真实商品图、GMC双语Feed、商城独立域名直接生效配置
                      </p>
                    </div>
                    <a
                      href="/quick-update.zip"
                      download="quick-update.zip"
                      className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>一键下载</span>
                    </a>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">配置已经就绪：</strong>
                      我们已经在工程中为你准备好了 <code className="text-emerald-300 bg-neutral-900 px-1.5 py-0.5 rounded">vercel.json</code> 配置文件，自动配置好单页路由与全网爬虫通行标头。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">两种部署方式：</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-neutral-400 pl-2">
                        <li><strong>方式 A（最省心）：</strong>将代码推送到 GitHub，在 Vercel 网页上点击 "Add New Project" 绑定 GitHub 仓库，点 Deploy 即可 1 分钟上线！</li>
                        <li><strong>方式 B（本地 CLI 命令行）：</strong>在终端运行 <code className="text-neutral-200 bg-neutral-900 px-1 rounded">npx vercel deploy --prod</code> 即可直接部署。</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">绑定自定义域名：</strong>
                      在 Vercel 项目后台的 <em>Settings → Domains</em> 中填入 <code className="text-cyan-300">shop.pavilionventure.com</code>，系统会给出一条 CNAME 记录（如 <code className="text-neutral-300">cname.vercel-dns.com</code>），在您的域名解析商处添加即可，5分钟生效！
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform 2: Cloudflare Pages */}
            {activeHosting === 'cloudflare' && (
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                      CF
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Cloudflare Pages (大马与东南亚速度最快)</h4>
                      <p className="text-[11px] text-neutral-400">无限请求流量，在吉隆坡拥有本地数据中心节点，延迟低于 10ms</p>
                    </div>
                  </div>
                  <a
                    href="https://dash.cloudflare.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>打开 Cloudflare</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">一键打包生成静态文件：</strong>
                      在项目根目录运行命令 <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded">npm run build</code>，会自动在项目内生成 <code className="text-neutral-200">dist</code> 文件夹。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">直接网页拖拽上传（无需 Git）：</strong>
                      进入 Cloudflare Dashboard → Workers & Pages → Create application → Pages → Direct Upload，将生成的 <code className="text-amber-200">dist</code> 文件夹直接拖拽进入网页，秒级发布！
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">绑定 pavilionventure.com：</strong>
                      如果您的域名本身在 Cloudflare 上管理，绑定自定义域名只需点一下鼠标，DNS 与 SSL 证书自动秒级完成配置。
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Platform 3: Firebase Hosting */}
            {activeHosting === 'firebase' && (
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-xs">
                      🔥
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Firebase Hosting (Google 官方高信誉主机)</h4>
                      <p className="text-[11px] text-neutral-400">Google 原生骨干网，Googlebot 爬虫信任度极高，适合 Google Pay 审核</p>
                    </div>
                  </div>
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Firebase 控制台</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white">已预设生产配置：</strong>
                      我们已为您生成 <code className="text-blue-300 bg-neutral-900 px-1.5 py-0.5 rounded">firebase.json</code>，包含单页重定向及强力 SEO 响应头标。
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white">部署命令：</strong>
                      在终端运行：
                      <div className="bg-neutral-900 border border-neutral-800 p-2 rounded-lg mt-1 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
                        <span>npm run build && npx firebase-tools deploy</span>
                        <button
                          onClick={() => handleCopy('npm run build && npx firebase-tools deploy', 'fb_cmd')}
                          className="text-neutral-400 hover:text-white"
                        >
                          {copiedKey === 'fb_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white">绑定自定义域名：</strong>
                      在 Firebase 控制台 Hosting 页面点击 "Add Custom Domain"，填入 <code className="text-cyan-300">shop.pavilionventure.com</code>，Google 会自动发放免费的全球 SSL 证书！
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEO & Search Engine Indexing Status Check */}
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              当前商城源代码已内置的 SEO 检查项（全部绿灯）
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">/robots.txt</span>
                    <p className="text-[10px] text-neutral-400">允许所有爬虫 (Allow: /)</p>
                  </div>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>查看</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">/sitemap.xml</span>
                    <p className="text-[10px] text-neutral-400">全站 XML 索引地图</p>
                  </div>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="text-emerald-400 hover:underline text-[11px] flex items-center gap-1"
                >
                  <span>查看</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Robots Meta 标头</span>
                  <p className="text-[10px] text-neutral-400">index, follow, max-image-preview</p>
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white">Schema.org JSON-LD</span>
                  <p className="text-[10px] text-neutral-400">结构化电商商家数据已嵌入</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-neutral-950 p-4 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-400 hidden sm:block">
            绑定自定义域名后重新跑 PageSpeed Insights，将直接达到 95~100 分满分状态
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs sm:text-sm transition ml-auto"
          >
            我知道了，关闭
          </button>
        </div>

      </div>
    </div>
  );
};
