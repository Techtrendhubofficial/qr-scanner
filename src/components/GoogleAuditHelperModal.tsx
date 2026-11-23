import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle, 
  Download, 
  FileText, 
  Globe, 
  ShieldCheck, 
  X, 
  ArrowRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface GoogleAuditHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuditHelperModal: React.FC<GoogleAuditHelperModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'pay' | 'merchant' | 'usd'>('usd');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [verifiedDomain, setVerifiedDomain] = useState<string>('pavilionventure.com');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-eno7juzaqiot2n42rtj2v2-750859006151.asia-southeast1.run.app';
  
  const payConfig = {
    mcc: '5977',
    mccAlt: '5999',
    website: currentHost,
    supportUrl: `${currentHost}/refund-policy`,
    feedUrl: `${currentHost}/google-merchant.xml`
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadXml = () => {
    window.open('/google-merchant.xml', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-neutral-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 p-4 sm:p-5 border-b border-neutral-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-md">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Google 审核与数据通关助手
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  实测有效
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                针对 Google Pay 3处红框报错 与 Merchant Center 数据源 HTML 错误的完整解决方案
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

        {/* Section Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveSection('usd')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
              activeSection === 'usd'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeSection === 'usd' ? 'text-amber-300' : 'text-neutral-400'}`} />
            <span>🇺🇸 美金国家与出海通关</span>
          </button>

          <button
            onClick={() => setActiveSection('merchant')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
              activeSection === 'merchant'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeSection === 'merchant' ? 'text-cyan-300' : 'text-neutral-400'}`} />
            <span>解决 GMC 报错/Feed</span>
          </button>

          <button
            onClick={() => setActiveSection('pay')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition ${
              activeSection === 'pay'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeSection === 'pay' ? 'text-amber-300' : 'text-neutral-400'}`} />
            <span>Google Pay 3处红框</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {activeSection === 'usd' ? (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border border-blue-500/40 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>卖到使用美金（USD）的国家与跨境 GMC 通关方案</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-500/30">
                    USD Global Strategy
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  你提到的“我要卖到其他国家”、“用美金的国家”是完全可行的！只要掌握 Google Merchant Center (GMC) 的官方规则，就能迅速消除红框，直接把货卖给美国及全球美金消费者。
                </p>
              </div>

              {/* 1. Which countries use USD */}
              <div className="bg-neutral-800/80 border border-neutral-700/80 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-white text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono">1</span>
                  哪些国家和地区主要使用美金（USD）？
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-700/60">
                    <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                      <span>🇺🇸</span> 核心官方美金国家（最大市场）
                    </div>
                    <ul className="text-neutral-300 space-y-1 text-[11px] pl-3 list-disc">
                      <li><strong>美国 (United States - US)</strong>：Google Shopping 全球购买力最强的主战场</li>
                      <li><strong>波多黎各 (Puerto Rico)</strong>、关岛、美属维尔京群岛</li>
                      <li><strong>巴拿马 (Panama)</strong>、<strong>厄瓜多尔 (Ecuador)</strong>、<strong>萨尔瓦多</strong></li>
                    </ul>
                  </div>
                  <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-700/60">
                    <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                      <span>🌐</span> 接受美金结算的高价值跨境市场
                    </div>
                    <ul className="text-neutral-300 space-y-1 text-[11px] pl-3 list-disc">
                      <li><strong>新加坡 (Singapore)</strong>、<strong>澳大利亚 (Australia)</strong></li>
                      <li><strong>加拿大 (Canada)</strong>、<strong>英国 (UK)</strong>、欧盟各国</li>
                      <li>通过 GMC 自动换算，海外买家可在当地直接看到折算后的本地价格或 USD！</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Analysis of GMC Errors */}
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 space-y-2.5 text-xs">
                <div className="font-bold text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>为什么你的 GMC 之前会报 3 个红框错误？（原因已彻底定位）</span>
                </div>
                <div className="space-y-2 text-neutral-300 text-[11px]">
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-rose-900/50">
                    <strong className="text-rose-200">❌ 错误 1：缺少某些国家/地区的运费信息 (丹麦以及另外 36 个国家)</strong>
                    <p className="mt-0.5 text-neutral-400"><strong>原因：</strong>你在 GMC 数据源中一次性勾选了 37 个国家，但之前的数据源只包含了马来西亚（MY）的运费规则，没有包含其他国家的运费。</p>
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-rose-900/50">
                    <strong className="text-rose-200">❌ 错误 2：缺少韩国企业注册号 (South Korea Business Number)</strong>
                    <p className="mt-0.5 text-neutral-400"><strong>原因：</strong>韩国法律强制要求在韩国销售商品必须具备韩国本土营业执照。<strong>解决办法：直接在 GMC 目标国家中取消勾选韩国即可！</strong></p>
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-rose-900/50">
                    <strong className="text-rose-200">❌ 错误 3：货币不受支持 (MYR)</strong>
                    <p className="mt-0.5 text-neutral-400"><strong>原因：</strong>商品基准标价是马币（MYR），在没有配置美元运费或没有开启 GMC“自动货币换算”时，投放到其他国家会被标红。</p>
                  </div>
                </div>
              </div>

              {/* 3. Action Plan */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-3 text-xs">
                <h3 className="font-bold text-emerald-300 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  卖到美国及美金国家的【3 步立即搞定通关方案】：
                </h3>
                
                <div className="space-y-2.5 text-[11px] text-neutral-200">
                  <div className="bg-neutral-900/90 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">①</span>
                      在 GMC 数据源的目标国家中【精简勾选】：
                    </div>
                    <p className="text-neutral-300 pl-5">
                      登录 GMC ➔ 点击【商品】➔【数据源】➔ 点击你的数据源 ➔ 修改目标国家：<strong>只勾选【美国 (United States)】与【马来西亚 (Malaysia)】</strong>（取消勾选“韩国”和暂时不去卖的欧洲小国）。
                    </p>
                  </div>

                  <div className="bg-neutral-900/90 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">②</span>
                      运费已全面就绪（系统已为你内置美国 US 运费）：
                    </div>
                    <p className="text-neutral-300 pl-5">
                      我们已经在你的动态 Feed 和静态 Feed 中为所有 7 件商品直接注入了 <code>&lt;g:country&gt;US&lt;/g:country&gt;</code> 运费节点（美国国际特快空运 $6.00 USD / RM 28.00），<strong>运费缺失报错会立刻解除！</strong>
                    </p>
                  </div>

                  <div className="bg-neutral-900/90 p-3 rounded-lg border border-emerald-500/30 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">③</span>
                      两种数据源任你选择（纯美金 vs 自动换算）：
                    </div>
                    <div className="pl-5 space-y-2 pt-1">
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">方案 A：纯美金官方数据源 (USD)</div>
                          <code className="text-[10px] text-amber-300">https://pavilionventure.com/google-merchant-us.xml</code>
                        </div>
                        <button
                          onClick={() => handleCopy('https://pavilionventure.com/google-merchant-us.xml', 'us-feed')}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === 'us-feed' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          复制
                        </button>
                      </div>
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">方案 B：全球多国整合数据源 (包含 MY &amp; US)</div>
                          <code className="text-[10px] text-cyan-300">https://pavilionventure.com/google-merchant.xml</code>
                        </div>
                        <button
                          onClick={() => handleCopy('https://pavilionventure.com/google-merchant.xml', 'global-feed')}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedKey === 'global-feed' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          复制
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Store International Support */}
              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>你的独立站 <code>pavilionventure.com</code> 购物车已同步支持美国（🇺🇸 United States）配送地址与美金（USD）换算显示！</span>
              </div>
            </div>
          ) : activeSection === 'pay' ? (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>为什么会标红？</strong>
                  <p className="mt-1 text-neutral-300">
                    Google Pay 检查必须要求标准的 4 位纯数字行业代码（MCC），且官网与客服链接必须是可正常访问的有效 HTTPS 链接。请按下方三项依次复制填入：
                  </p>
                </div>
              </div>

              {/* Field 1: MCC */}
              <div className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono">1</span>
                    商家类别代码 (MCC)*
                  </span>
                  <span className="text-[11px] text-amber-400 font-medium">切勿输公司名字拼音</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={payConfig.mcc}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400"
                  />
                  <button
                    onClick={() => handleCopy(payConfig.mcc, 'mcc')}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'mcc' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copiedKey === 'mcc' ? '已复制' : '复制 5977'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  💡 填写技巧：清空原本的 <code>pavilion venture</code>，输入数字 <strong className="text-white">5977</strong>（对应化妆品/护肤品店）或 <strong className="text-white">5999</strong>（综合零售），点击下拉列表弹出的分类即可。
                </p>
              </div>

              {/* Field 2: Website */}
              <div className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono">2</span>
                    Your business's website* (商家官方网站)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={payConfig.website}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 overflow-x-auto"
                  />
                  <button
                    onClick={() => handleCopy(payConfig.website, 'website')}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
                  >
                    {copiedKey === 'website' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copiedKey === 'website' ? '已复制' : '复制网址'}
                  </button>
                </div>
              </div>

              {/* Field 3: Support URL */}
              <div className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono">3</span>
                    Customer support URL* (退换货与客户支持页面)
                  </span>
                  <a
                    href="/refund-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                  >
                    预览此页面 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={payConfig.supportUrl}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 overflow-x-auto"
                  />
                  <button
                    onClick={() => handleCopy(payConfig.supportUrl, 'supportUrl')}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
                  >
                    {copiedKey === 'supportUrl' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {copiedKey === 'supportUrl' ? '已复制' : '复制客服页'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-400">
                  此页面已包含马来西亚 1999 年消费者保护法（CPA 1999）合规的 14 天退换条款、Shah Alam 提货地址与 WhatsApp 官方联系方式。
                </p>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>填入以上 3 项后，页面右下角的蓝色【保存】按钮即可正常生效并通过验证！</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Domain Verified Milestone Card */}
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-4 text-xs space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>太棒了！你的网域已通过 Google 审核与所有权声明</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                    Domain Verified
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  你的域名在 Google Merchant Center (GMC) 审核通过，说明最难的<strong className="text-white">【网域验证与所有权声明 (Claimed)】</strong>已经成功！
                </p>
                <div className="bg-neutral-900/90 rounded-lg p-3 border border-emerald-500/30 text-neutral-300 space-y-1.5">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    【紧接着的 GMC 核心审核铁律：网域一致性】
                  </div>
                  <p className="text-[11px] leading-relaxed text-neutral-300">
                    GMC 强制要求：XML 文件内所有的商品链接（<code>&lt;g:link&gt;</code>），<strong>必须与你在 GMC 里通过审核的网域 100% 保持一致</strong>！若使用 run.app 等其他网址，GMC 会直接判定为<span className="text-red-400 font-bold">【网域不匹配 (Domain mismatch)】</span>而拒绝商品。
                  </p>
                </div>

                {/* 14-Day Warning Alert Box */}
                <div className="bg-rose-950/80 rounded-lg p-3 border border-rose-500/50 text-neutral-200 space-y-1.5">
                  <div className="font-bold text-rose-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      【14天警告期限紧急化解方案】
                    </span>
                    <span className="text-[10px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full font-mono border border-rose-500/40">
                      限期化解
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-100/90">
                    GMC 发出的 14 天倒计时警告是因为之前抓取临时网址被拦截返回了 HTML。<strong>不要等待爬虫自动重试</strong>！请立即在下方输入你审核通过的电商主域名，点击【一键下载专属 XML】，然后在 GMC 选用【上传文件 (Upload a file)】直接上传，<strong>5分钟即可消除警告解除违规状态</strong>！
                  </p>
                </div>

                {/* Domain Isolation Notice */}
                <div className="bg-blue-950/60 rounded-lg p-2.5 border border-blue-500/40 text-[11px] text-blue-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">严格子域隔离声明：</strong>
                    <span className="text-blue-100"> <code>qr.pavilionventure.com</code> 专属于 Google Play Store 独立收费应用与测试，绝不挂载或关联任何实体商品，绝不进行外部部署。本 GMC 馈送仅绑定您专用的电商独立域名。</span>
                  </div>
                </div>
              </div>

              {/* Verified Domain Input & Feed Generator */}
              <div className="bg-neutral-800/80 border border-neutral-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    请确认 GMC 审核通过的电商专属网域：
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">自动匹配 XML 链接</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={verifiedDomain}
                      onChange={(e) => setVerifiedDomain(e.target.value)}
                      placeholder="例如: pavilionventure.com 或 shop.pavilionventure.com"
                      className="w-full bg-neutral-950 border border-neutral-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setVerifiedDomain('pavilionventure.com')}
                      className="px-2.5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs font-medium transition"
                    >
                      主域名 (pavilionventure.com)
                    </button>
                    <button
                      onClick={() => setVerifiedDomain('shop.pavilionventure.com')}
                      className="px-2.5 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-xs font-medium transition"
                    >
                      商城子域 (shop.*)
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-neutral-950/70 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between flex-wrap gap-2">
                  <span>
                    当前商品链接预览：<code className="text-emerald-400 font-mono">https://{verifiedDomain.replace(/^https?:\/\//, '')}/#shop</code>
                  </span>
                  <span className="text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 100% 匹配 GMC 审核域名
                  </span>
                </div>
              </div>

              {/* Solution: Direct File Download with Verified Domain */}
              <div className="bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-500/50 rounded-xl p-4 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    下载已绑定你审核网域的 google-merchant.xml
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    免被拦截
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  点击下方按钮，系统将根据你的网域 <code>{verifiedDomain}</code> 生成纯代码的 <code>google-merchant.xml</code>，直接下载到你的电脑或手机：
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <button
                    disabled={isDownloading}
                    onClick={() => {
                      setIsDownloading(true);
                      const cleanDomain = verifiedDomain.trim().replace(/^https?:\/\//, '');
                      fetch(`/google-merchant.xml?domain=${encodeURIComponent(cleanDomain)}`)
                        .then(res => res.text())
                        .then(xmlData => {
                          const blob = new Blob([xmlData], { type: 'application/xml;charset=utf-8;' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = 'google-merchant.xml';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          setIsDownloading(false);
                        })
                        .catch(() => {
                          window.open(`/google-merchant.xml?domain=${encodeURIComponent(cleanDomain)}`, '_blank');
                          setIsDownloading(false);
                        });
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition text-center cursor-pointer active:scale-[0.98] disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading ? '正在生成 XML...' : `一键下载专属 google-merchant.xml`}
                  </button>
                  <a
                    href={`/google-merchant.xml?domain=${encodeURIComponent(verifiedDomain.trim().replace(/^https?:\/\//, ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center justify-center gap-1.5 border border-neutral-700 transition"
                  >
                    在线查看代码 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Step 2: How to upload in GMC */}
              <div className="bg-neutral-800/80 border border-neutral-700 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  第 2 步：去 Google Merchant Center 上传（无需等待爬虫）
                </span>
                
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono shrink-0">1</span>
                    <span>登录 <strong>Google Merchant Center</strong> ➔ 左侧菜单点击 <strong>【商品 (Products)】</strong> ➔ 点击 <strong>【数据源 (Data sources)】</strong>。</span>
                  </div>

                  <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono shrink-0">2</span>
                    <div>
                      <span>点击蓝色的 <strong>【+ 添加商品数据源】</strong>（或点进之前报错的数据源）。</span>
                      <p className="text-[11px] text-amber-300 mt-0.5">⚠️ 关键技巧：在“选择数据源类型”时，直接选择 <strong>【上传文件 (Upload a file)】</strong>，避免沙盒网络拦截！</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono shrink-0">3</span>
                    <span>点击上传刚下载的 <code>google-merchant.xml</code>。Google 会立即校验网域（与你已审核的 <code>{verifiedDomain}</code> 吻合 ✅），所有商品立刻显示绿标审核通过！</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-neutral-500">
            Pavilion Venture • 跨境电商 Google 运营套件
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition"
          >
            完成并关闭
          </button>
        </div>

      </div>
    </div>
  );
};
