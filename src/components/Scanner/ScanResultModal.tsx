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
  FileText,
  Star,
  Share2,
  QrCode,
  ShieldCheck,
  Barcode,
} from 'lucide-react';
import { QRItem } from '../../types';
import { parseQRContent } from '../../utils/qrParser';

interface ScanResultModalProps {
  item: QRItem | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onGenerateFromThis?: (rawText: string) => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  item,
  onClose,
  onToggleFavorite,
  onGenerateFromThis,
}) => {
  const [copied, setCopied] = useState(false);
  const [passCopied, setPassCopied] = useState(false);

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
        return <Barcode className="w-5 h-5 text-orange-400" />;
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
