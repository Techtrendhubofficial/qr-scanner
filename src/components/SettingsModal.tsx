import React from 'react';
import { X, Volume2, Smartphone, Layers, Copy, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { ScannerSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ScannerSettings;
  onUpdateSettings: (newSettings: ScannerSettings) => void;
  onOpenPrivacy: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  const toggle = (key: keyof ScannerSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100">Scanner Preferences</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Beep sound toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Scan Beep Audio
                </span>
                <span className="text-[11px] text-slate-400">
                  Crystal confirmation beep on successful scan
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.beepSound}
              onChange={() => toggle('beepSound')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Haptic vibration toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Haptic Vibration
                </span>
                <span className="text-[11px] text-slate-400">
                  Tactile feedback when code is locked
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.vibrate}
              onChange={() => toggle('vibrate')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Continuous Batch Scan */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Default Continuous Batch
                </span>
                <span className="text-[11px] text-slate-400">
                  Keep camera running without pausing for results
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.continuousScan}
              onChange={() => toggle('continuousScan')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Auto Copy text */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Copy className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold block text-slate-200">
                  Auto Copy to Clipboard
                </span>
                <span className="text-[11px] text-slate-400">
                  Copies scanned text immediately upon detection
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoCopy}
              onChange={() => toggle('autoCopy')}
              className="h-4 w-4 rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenPrivacy();
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Privacy & Policies</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
