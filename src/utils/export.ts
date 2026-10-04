import { QRItem } from '../types';

export function exportToCSV(items: QRItem[], filename = 'scancraft_history.csv') {
  if (!items.length) {
    alert('No history records to export.');
    return;
  }

  const headers = ['ID', 'Date', 'Time', 'Type', 'Source', 'Category', 'Title', 'Content', 'Raw_Text', 'Favorite'];

  const rows = items.map((item) => {
    const d = new Date(item.timestamp);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toTimeString().split(' ')[0];

    const cleanField = (str: string | undefined) => {
      if (!str) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    return [
      cleanField(item.id),
      cleanField(dateStr),
      cleanField(timeStr),
      cleanField(item.type),
      cleanField(item.source),
      cleanField(item.category),
      cleanField(item.title),
      cleanField(item.content),
      cleanField(item.rawText),
      cleanField(item.isFavorite ? 'YES' : 'NO'),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), filename);
}

export function exportToJSON(items: QRItem[], filename = 'scancraft_backup.json') {
  const data = {
    app: 'ScanCraft Pro',
    version: '1.0.0',
    exportTimestamp: Date.now(),
    totalRecords: items.length,
    items,
  };
  const jsonContent = JSON.stringify(data, null, 2);
  downloadBlob(new Blob([jsonContent], { type: 'application/json' }), filename);
}

export function exportToTXT(items: QRItem[], filename = 'scancraft_report.txt') {
  const lines = [
    '========================================',
    '       SCANCRAFT PRO - HISTORY REPORT   ',
    `       Generated: ${new Date().toLocaleString()}`,
    `       Total Records: ${items.length}`,
    '========================================',
    '',
  ];

  items.forEach((item, index) => {
    const d = new Date(item.timestamp).toLocaleString();
    lines.push(`[#${index + 1}] ${item.title}`);
    lines.push(`· Type: ${item.type.toUpperCase()} | Source: ${item.source} | Category: ${item.category}`);
    lines.push(`· Date: ${d}`);
    lines.push(`· Content: ${item.content}`);
    lines.push(`· Raw Payload:\n  ${item.rawText.replace(/\n/g, '\n  ')}`);
    lines.push('----------------------------------------');
  });

  const txtContent = lines.join('\n');
  downloadBlob(new Blob([txtContent], { type: 'text/plain;charset=utf-8;' }), filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
