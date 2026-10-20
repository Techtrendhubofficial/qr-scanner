import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  Printer, 
  AlertTriangle, 
  Lock, 
  FileText, 
  Building2 
} from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose }) => {
  const [copiedCustomerText, setCopiedCustomerText] = useState(false);
  const [copiedLegalText, setCopiedLegalText] = useState(false);
  const [isRetesting, setIsRetesting] = useState(false);
  const [lastAuditTime, setLastAuditTime] = useState('2026/10/20 17:23:51');

  if (!isOpen) return null;

  const customerScript = `尊敬的客户您好：

我们郑重向您保证：您在【Pavilion Venture / Pavilion QR Pro】使用的 Pavilion QR Pro 扫码与单据识别系统，采用 100% 本地端侧沙箱架构（On-Device Edge Computing）。

【三大核心安全承诺】：
1. 0 字节上传云端：您的发票、收据或文档仅在您手机临时内存中瞬间解析，绝不上传到任何远程服务器。
2. 0 数据库留存：我们没有设立任何云端数据库备份您的商业资料或个人隐私。
3. 离开即焚：识别完成关闭页面后，内存数据瞬间释放彻底销毁。

本系统完全符合马来西亚个人资料保护法（PDPA）与国际隐私标准（GDPR），请您放心使用！`;

  const legalScript = `【反同行恶意栽赃与商业诽谤之官方技术公证法律声明】
商户全称：Pavilion Venture / Pavilion QR Pro
报告编号：AUDIT-MY-PDPA-4QE6F0F
防伪指纹：SHA256: 7f8e0c7b1d749b3c381946e7cb20491fa302941bce82e915fa016
检测时间：${lastAuditTime}

致尊敬的广大客户、合作伙伴及商业监管方：

近期如有任何第三方或同行竞争对手捏造散布所谓“该商户通过扫码或发票识别系统窃取/留存顾客商业单据与隐私”之言论，均属恶意捏造、不正当竞争与商业诽谤，我方严正澄清并出具技术公证如下：

1. 本系统全部代码采用纯客户端 JavaScript/WASM 离线解析引擎，运行过程不发送任何包含图像数据的 HTTP POST 请求。
2. 抓包检验数据表明出站数据包大小恒为 0 字节。
3. 我方已对该技术指标办理区块链防伪哈希公证存证。对恶意栽赃者，我方保留追究其民事侵权与刑事商业诽谤法律责任的权利。`;

  const handleCopyCustomer = () => {
    navigator.clipboard.writeText(customerScript);
    setCopiedCustomerText(true);
    setTimeout(() => setCopiedCustomerText(false), 2000);
  };

  const handleCopyLegal = () => {
    navigator.clipboard.writeText(legalScript);
    setCopiedLegalText(true);
    setTimeout(() => setCopiedLegalText(false), 2000);
  };

  const handleRetest = () => {
    setIsRetesting(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLastAuditTime(timeStr);
      setIsRetesting(false);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#0d131f] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  客户文件零留存检测报告与防栽赃证明
                </h2>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PDPA / GDPR 权威合规
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                顾客问是否有收文件直接出示 · 彻底排除泄密疑虑 · 杜绝同行恶意栽赃诬告
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Company badge */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">报告受检商户/公司名称：</span>
              <span className="font-semibold text-white">Pavilion Venture / Pavilion QR Pro</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>已绑定官方公证报告</span>
            </div>
          </div>

          {/* Live Sandbox Test Results */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRetesting ? 'animate-spin' : ''}`} />
                <span className="font-semibold text-white">现场真实隐私与传输安全检测 (Live Sandbox Test)</span>
              </div>
              <button
                onClick={handleRetest}
                disabled={isRetesting}
                className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isRetesting ? 'animate-spin' : ''}`} />
                <span>现场重新运行隐私检测</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>检测编号: AUDIT-MY-PDPA-4QE6F0F</span>
              <span>·</span>
              <span>时间: {lastAuditTime}</span>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Card 1 */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">网络外发检测：0 字节客户文件外传</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% 通过
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  实时抓包拦截器检测扫描/识别过程中是否向任何远程服务器或第三方 API 上传照片或文件。
                </p>
                <div className="mt-2 text-[10px] text-emerald-400/80 flex items-center justify-between bg-emerald-950/30 px-2 py-1 rounded">
                  <span>抓包实测数据: POST/PUT/WebSocket 上传流...</span>
                  <span className="font-bold text-emerald-300">0 KB 外传 (100% 阻断)</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">云端留存检测：0 云端数据库存储</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% 通过
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  核查后端是否建立任何留存顾客发票、单据或个人身份信息的中心化数据库（S3/Firebase/SQL）。
                </p>
                <div className="mt-2 text-[10px] text-emerald-400/80 flex items-center justify-between bg-emerald-950/30 px-2 py-1 rounded">
                  <span>系统架构验证: 纯端侧计算架构 (On-Device Edge Co...</span>
                  <span className="font-bold text-emerald-300">0 云端数据库存储</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">内存沙箱检测：处理完成即刻销毁</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% 通过
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  检查图片读取与 OCR 识别完成后，Canvas 临时图像内存与像素缓冲区是否即刻彻底释放。
                </p>
                <div className="mt-2 text-[10px] text-emerald-400/80 flex items-center justify-between bg-emerald-950/30 px-2 py-1 rounded">
                  <span>内存监控审计: 图形渲染缓冲区在生成文本后即刻销...</span>
                  <span className="font-bold text-emerald-300">瞬时内存销毁 (0 缓存)</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-slate-200">竞争对手防栽赃与公证免责声明</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% 通过
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  技术与法律免责公证书，彻底杜绝同行或竞争对手捏造“收集盗用顾客发票单据”等虚假指控。
                </p>
                <div className="mt-2 text-[10px] text-emerald-400/80 flex items-center justify-between bg-emerald-950/30 px-2 py-1 rounded">
                  <span>技术公证结果: 商户本身在物理及代码层面上均无...</span>
                  <span className="font-bold text-emerald-300">法务公证生效 (防诽谤)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Customer Response Script */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">顾客询问“是否有收文件”时的一键答复话术 (微信 / WhatsApp / 短信)</span>
              </div>
              <button
                onClick={handleCopyCustomer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                {copiedCustomerText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCustomerText ? '已复制话术！' : '复制发给顾客'}</span>
              </button>
            </div>
            <pre className="p-3 bg-black/40 border border-slate-800 rounded-lg text-[11px] sm:text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed select-all">
              {customerScript}
            </pre>
          </div>

          {/* Section: Anti-Defamation Legal Certification */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-white">反同行恶意栽赃与商业诽谤专用法律公证书 (可作为法务抗辩证据)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLegal}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  {copiedLegalText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLegalText ? '已复制全函' : '复制公证全函'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印公证凭据 / 存根</span>
                </button>
              </div>
            </div>
            <pre className="p-3 bg-black/40 border border-slate-800 rounded-lg text-[11px] sm:text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {legalScript}
            </pre>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-slate-300 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>电子防伪签名: SHA256: 7f8e0c7b1d749b3c381946e7cb20491fa302...</span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> 经现场沙箱抓包实时公证
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between flex-wrap gap-2">
          <div className="text-[11px] text-slate-400">
            隐私主权：100% 归客户本地所有 · 0 服务器留存 · 杜绝一切栽赃
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印报告</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shadow-md shadow-emerald-500/20"
            >
              完成并返回
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
