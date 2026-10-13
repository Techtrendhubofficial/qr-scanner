import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Copy,
  Check,
  Wifi,
  User,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  ScanText,
  FileSpreadsheet,
  FileText,
  Star,
  Share2,
  QrCode,
  ShieldCheck,
  Barcode,
} from 'lucide-react';
import { QRItem } from '../../types';
import { parseQRContent } from '../../utils/qrParser';
import { exportToExcel, exportToReceipt, exportToSQLAccSheet } from '../../utils/export';

interface ScanResultModalProps {
  item: QRItem | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onGenerateFromThis?: (rawText: string) => void;
  onOpenPrivacyAudit?: () => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  item,
  onClose,
  onToggleFavorite,
  onGenerateFromThis,
  onOpenPrivacyAudit,
}) => {
  const [copied, setCopied] = useState(false);
  const [passCopied, setPassCopied] = useState(false);
  const [invCopied, setInvCopied] = useState(false);

  if (!item) return null;

  const parsed = parseQRContent(item.rawText);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    setPassCopied(true);
    setTimeout(() => setPassCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.rawText,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy(item.rawText);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'wifi':
        return <Wifi className="w-5 h-5 text-emerald-400" />;
      case 'url':
      case 'social':
        return <ExternalLink className="w-5 h-5 text-cyan-400" />;
      case 'contact':
        return <User className="w-5 h-5 text-amber-400" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-green-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-indigo-400" />;
      case 'sms':
        return <MessageSquare className="w-5 h-5 text-sky-400" />;
      case 'location':
        return <MapPin className="w-5 h-5 text-rose-400" />;
      case 'product':
      case 'barcode':
        return <Barcode className="w-5 h-5 text-orange-400" />;
      case 'ocr':
        return <ScanText className="w-5 h-5 text-[#00ff88]" />;
      case 'invoice':
        return <FileSpreadsheet className="w-5 h-5 text-[#00ff88]" />;
      default:
        return <FileText className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Grab Handle for mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
              {getCategoryIcon(parsed.category)}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                {parsed.category.toUpperCase()} DETECTED
              </span>
              <h3 className="text-base font-bold text-slate-100 truncate">{parsed.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(item.id)}
                className="p-2 text-slate-400 hover:text-amber-400 transition"
                title="Favorite"
              >
                <Star
                  className={`w-4 h-4 ${
                    item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            )}
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-200 transition"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Main Action Bar for URLs / Calls / Maps */}
          {parsed.actionUrl && (
            <div className="flex gap-2">
              <a
                href={parsed.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 px-4 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                {parsed.actionLabel || 'Open Link'}
              </a>
              <button
                onClick={() => handleCopy(item.rawText)}
                className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 text-slate-200 hover:bg-slate-700 transition"
                title="Copy raw content"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Wi-Fi Special Card */}
          {parsed.category === 'wifi' && (
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Network (SSID)</span>
                <span className="text-sm font-semibold text-slate-100 font-mono">
                  {parsed.metadata.SSID}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Security Type</span>
                <span className="text-xs font-medium text-slate-300">
                  {parsed.metadata.Security || 'WPA/WPA2'}
                </span>
              </div>
              {parsed.metadata.Password && (
                <div className="pt-2 border-t border-emerald-900/40 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-xs text-slate-400 block">Password</span>
                    <span className="text-sm font-mono text-emerald-400 font-bold tracking-wider select-all">
                      {parsed.metadata.Password}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyPassword(parsed.metadata.Password)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition"
                  >
                    {passCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Password
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Invoice / Commercial Receipt Inspector Card */}
          {(parsed.category === 'invoice' || item.category === 'invoice' || item.type === 'ocr') && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white">Commercial Invoice Details</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/60">
                  On-Device Parsed
                </span>
              </div>

              {/* Key invoice metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {parsed.metadata['Merchant / Issuer'] && (
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Merchant / Issuer</span>
                    <span className="text-xs font-bold text-slate-100 truncate block mt-0.5">
                      {parsed.metadata['Merchant / Issuer']}
                    </span>
                  </div>
                )}
                {parsed.metadata['Invoice No'] && (
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Invoice / Receipt No.</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 truncate block mt-0.5">
                      #{parsed.metadata['Invoice No']}
                    </span>
                  </div>
                )}
                {parsed.metadata['Total Amount'] && (
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Detected Total Amount</span>
                      <span className="text-base font-black text-[#00ff88]">
                        {parsed.metadata['Total Amount']}
                      </span>
                    </div>
                    {parsed.metadata['Date'] && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Document Date</span>
                        <span className="text-xs font-mono text-slate-200">
                          {parsed.metadata['Date']}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dedicated Privacy Audit callout for customers */}
              <div className="pt-2 border-t border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-black/40 p-2.5 rounded-xl">
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>顾客问是否有收文件？出示零留存公证书</span>
                </div>
                {onOpenPrivacyAudit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPrivacyAudit();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#00ff88] hover:bg-[#33ff9f] text-black text-[11px] font-black transition flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-sm shadow-[#00ff88]/20"
                  >
                    <span>🛡️ 运行隐私检测与防嫁祸报告</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contact Special Card */}
          {parsed.category === 'contact' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2 text-xs">
              {Object.entries(parsed.metadata).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-slate-800/60 last:border-none">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-slate-200 font-medium font-mono">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Raw Text Content Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Scanned Content</span>
              <span className="font-mono text-[11px]">{item.rawText.length} chars</span>
            </div>
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-mono text-slate-300 break-all select-all max-h-40 overflow-y-auto leading-relaxed">
              {item.rawText}
            </div>
          </div>

          {/* 3 Core Exports (No-PDF Light Edition) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 block">
              专业数据导出 (Pavilion QR Pro):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => exportToExcel([item], `Invoice_${item.id.slice(0, 6)}.csv`)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 transition cursor-pointer"
                title="导出 Excel"
              >
                <FileSpreadsheet className="w-4 h-4 mb-0.5 text-emerald-400" />
                <span className="text-[10px] font-bold">导出 Excel</span>
              </button>

              <button
                type="button"
                onClick={() => exportToReceipt([item], `Resit_${item.id.slice(0, 6)}.txt`)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-amber-500/30 text-amber-300 transition cursor-pointer"
                title="导出 Resit / Receipt"
              >
                <FileText className="w-4 h-4 mb-0.5 text-amber-400" />
                <span className="text-[10px] font-bold">导出 Resit</span>
              </button>

              <button
                type="button"
                onClick={() => exportToSQLAccSheet([item], `SQL_Acc_${item.id.slice(0, 6)}.csv`)}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 transition cursor-pointer"
                title="导出 SQL Acc Sheet"
              >
                <FileSpreadsheet className="w-4 h-4 mb-0.5 text-cyan-400" />
                <span className="text-[10px] font-bold">导出 SQL Acc</span>
              </button>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleCopy(item.rawText)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-3 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Text
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Raw Text
                </>
              )}
            </button>

            {onGenerateFromThis && (
              <button
                onClick={() => {
                  onGenerateFromThis(item.rawText);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-3 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-emerald-400 transition"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                Customize QR
              </button>
            )}
          </div>

          {/* Security & Verification note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Decoded securely on-device · Zero network uploads</span>
          </div>
        </div>
      </div>
    </div>
  );
};
