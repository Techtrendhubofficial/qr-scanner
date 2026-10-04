import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Download,
  Upload,
  Trash2,
  Star,
  ExternalLink,
  Wifi,
  User,
  FileText,
  Copy,
  Check,
  Filter,
  FileSpreadsheet,
  FileCode,
  Layers,
  ArrowUpDown,
  Barcode,
} from 'lucide-react';
import { QRItem, QRCategory } from '../../types';
import { exportToCSV, exportToJSON, exportToTXT } from '../../utils/export';

interface HistoryViewProps {
  items: QRItem[];
  onSelectItem: (item: QRItem) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onImportItems: (newItems: QRItem[]) => void;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  items,
  onSelectItem,
  onToggleFavorite,
  onDeleteItem,
  onClearAll,
  onImportItems,
  isPro,
  onOpenPricing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter and search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter tab
      if (selectedFilter === 'favorites' && !item.isFavorite) return false;
      if (selectedFilter === 'scan' && item.type !== 'scan') return false;
      if (selectedFilter === 'generate' && item.type !== 'generate') return false;
      if (selectedFilter === 'wifi' && item.category !== 'wifi') return false;
      if (selectedFilter === 'url' && item.category !== 'url') return false;
      if (selectedFilter === 'contact' && item.category !== 'contact') return false;

      // Keyword search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query) ||
          item.rawText.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [items, selectedFilter, searchTerm]);

  const stats = useMemo(() => {
    const total = items.length;
    const scanned = items.filter((i) => i.type === 'scan').length;
    const generated = items.filter((i) => i.type === 'generate').length;
    const favorites = items.filter((i) => i.isFavorite).length;
    return { total, scanned, generated, favorites };
  }, [items]);

  const handleCopyText = (e: React.MouseEvent, item: QRItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.rawText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedList: QRItem[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.items)
          ? parsed.items
          : [];

        if (importedList.length > 0) {
          onImportItems(importedList);
          alert(`Successfully imported ${importedList.length} history records!`);
        } else {
          alert('No valid QR records found in the JSON file.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const getCategoryIcon = (category: QRCategory) => {
    switch (category) {
      case 'wifi':
        return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'url':
      case 'social':
        return <ExternalLink className="w-4 h-4 text-cyan-400" />;
      case 'contact':
        return <User className="w-4 h-4 text-amber-400" />;
      case 'product':
        return <Barcode className="w-4 h-4 text-orange-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header & Stat Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Total Records</span>
          <p className="mt-1 text-2xl font-bold text-slate-100 font-mono tabular-nums">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Scanned (Camera/Album)</span>
          <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {stats.scanned}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Generated Codes</span>
          <p className="mt-1 text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            {stats.generated}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Starred Favorites</span>
          <p className="mt-1 text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {stats.favorites}
          </p>
        </div>
      </div>

      {/* Action Toolbar: Search, Filters, and Export Buttons */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history by title, URL, SSID, or payload..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Toolbar Buttons: Export, Import, Clear */}
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 px-3.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/20 hover:bg-emerald-400 transition"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Export History</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-30 space-y-1 animate-in fade-in">
                <button
                  onClick={() => {
                    exportToCSV(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-medium block">Export as CSV</span>
                    <span className="text-[10px] text-slate-400">Excel / Google Sheets</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    exportToJSON(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition text-left"
                >
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-medium block">Export as JSON</span>
                    <span className="text-[10px] text-slate-400">Complete raw backup</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    exportToTXT(filteredItems);
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition text-left"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="font-medium block">Export as TXT</span>
                    <span className="text-[10px] text-slate-400">Formatted text report</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Import JSON */}
          <label className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer transition">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          {/* Clear All */}
          {items.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-900/40 bg-rose-950/20 py-2.5 px-3 text-xs font-medium text-rose-400 hover:bg-rose-900/30 transition"
              title="Clear all records"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'favorites', label: '★ Starred' },
          { id: 'scan', label: 'Scanned' },
          { id: 'generate', label: 'Generated' },
          { id: 'wifi', label: 'Wi-Fi' },
          { id: 'url', label: 'Websites' },
          { id: 'contact', label: 'Contacts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedFilter === tab.id
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Records List */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <History className="w-10 h-10 mx-auto text-slate-600" />
          <h4 className="text-sm font-semibold text-slate-300">No records found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'No items matched your search query. Try different terms or clear filters.'
              : 'Your scanned and generated QR codes will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition cursor-pointer group"
            >
              {/* Left Slot: Icon & Details */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/80 group-hover:border-slate-600">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100 truncate group-hover:text-emerald-400 transition">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider shrink-0">
                      {item.type === 'scan' ? `Scan · ${item.source}` : 'Generated'}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-400 truncate max-w-md font-mono">
                    {item.content}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Right Slot: Actions */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-amber-400 transition"
                  title="Toggle Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      item.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={(e) => handleCopyText(e, item)}
                  className="p-2 text-slate-400 hover:text-slate-200 transition"
                  title="Copy text"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl text-slate-100">
            <h3 className="text-sm font-bold text-slate-100">Clear Entire History?</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              This action will remove all {items.length} records from local device storage. You may want to export a CSV or JSON backup first.
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
