import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Smartphone, Mail, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Google Play Compliance & Privacy Policy
              </h3>
              <p className="text-[11px] text-slate-400">
                Effective: October 2026 · ScanCraft Pro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed pr-1">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3.5 space-y-1">
            <span className="font-semibold text-emerald-400 block flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> 100% On-Device Processing Guarantee
            </span>
            <p className="text-slate-300 text-[11px]">
              ScanCraft Pro decodes all QR codes and barcodes strictly in volatile device memory using WebAssembly / Canvas. No video frames, camera streams, or uploaded album photos are ever uploaded to remote servers or third parties.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-200">1. Permissions Disclosures</h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
              <li>
                <strong className="text-slate-200">Camera Permission (`android.permission.CAMERA`):</strong> Used solely to display real-time video frames to locate and decode QR codes. We do not record or store camera footage.
              </li>
              <li>
                <strong className="text-slate-200">Photos / Storage Permission:</strong> Used only when you explicitly select an image from your device gallery/album to scan.
              </li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-200">2. Data Ownership & Export</h4>
            <p className="text-slate-400 text-[11px]">
              Your scan and creation history resides exclusively in your browser/device local storage. You retain 100% ownership and can export your complete history into CSV, JSON, or TXT formats at any time.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-200">3. In-App Purchases & Subscriptions</h4>
            <p className="text-slate-400 text-[11px]">
              Subscriptions ($49.00/year, with an optional 3-day free trial) and lifetime VIP passes are processed securely via Google Play In-App Billing or licensed keys. You can cancel active subscriptions anytime directly in your Google Play Store account settings.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-200">4. Developer Contact</h4>
            <p className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Direct inquiries: </span>
              <a href="mailto:jasonang9996@gmail.com" className="text-emerald-400 underline">
                jasonang9996@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-100 transition"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
