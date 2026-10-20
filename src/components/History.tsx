import React, { useState } from 'react';
import { History as HistoryIcon, Download, Trash2, Search, ExternalLink, Copy, Check, QrCode, Scan, Calendar } from 'lucide-react';
import { ScanItem, GeneratedQrItem } from '../types';

interface HistoryProps {
  scans: ScanItem[];
  generations: GeneratedQrItem[];
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ scans, generations, onClearHistory }) => {
  const [tab, setTab] = useState<'scans' | 'generations'>('scans');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (tab === 'scans') {
      csvContent += 'ID,类型,识别分类,内容,时间\n';
      scans.forEach((s) => {
        const timeStr = new Date(s.timestamp).toLocaleString();
        csvContent += `"${s.id}","${s.type}","${s.category}","${s.content.replace(/"/g, '""')}","${timeStr}"\n`;
      });
    } else {
      csvContent += 'ID,标题,类型,内容,时间\n';
      generations.forEach((g) => {
        const timeStr = new Date(g.timestamp).toLocaleString();
        csvContent += `"${g.id}","${g.title}","${g.type}","${g.content.replace(/"/g, '""')}","${timeStr}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pavilion_qr_${tab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredScans = scans.filter((s) =>
    s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGens = generations.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24 md:pb-12 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-emerald-400" />
            <span>历史与导出 (本地加密存储)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            所有记录仅保存在您当前设备中，支持无上限导出 CSV / Excel
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={tab === 'scans' ? scans.length === 0 : generations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出 CSV</span>
          </button>
          <button
            onClick={onClearHistory}
            disabled={scans.length === 0 && generations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 text-xs border border-slate-700 transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>清空记录</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          <button
            onClick={() => setTab('scans')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'scans' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>扫码记录 ({scans.length})</span>
          </button>
          <button
            onClick={() => setTab('generations')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'generations' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>制作记录 ({generations.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索记录内容..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {tab === 'scans' ? (
          filteredScans.length > 0 ? (
            filteredScans.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-slate-200 break-all select-all">
                    {item.content}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.category === 'url' && (
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="打开链接"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleCopy(item.id, item.content)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="复制内容"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
              <Scan className="w-8 h-8 mx-auto text-slate-500" />
              <div className="text-sm">暂无扫码记录</div>
              <div className="text-xs text-slate-500">开启极速扫码后，识别结果将自动同步至此</div>
            </div>
          )
        ) : (
          filteredGens.length > 0 ? (
            filteredGens.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                      {item.type}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-slate-200 break-all select-all">
                    {item.content}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(item.id, item.content)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="复制内容"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 text-slate-400 space-y-2">
              <QrCode className="w-8 h-8 mx-auto text-slate-500" />
              <div className="text-sm">暂无制作记录</div>
              <div className="text-xs text-slate-500">在“制作二维码”页面生成并保存的码会显示在这里</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
