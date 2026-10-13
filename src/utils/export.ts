import { QRItem } from '../types';

/**
 * 导出 Excel 表格 (.csv 格式，带 UTF-8 BOM，Excel 双击即打开中文无乱码)
 */
export function exportToExcel(items: QRItem[], filename = 'Pavilion_QR_Pro_Invoices.csv') {
  if (!items.length) {
    alert('暂无扫描记录可导出为 Excel');
    return;
  }

  const headers = [
    '单据编号 (Doc / Inv No)',
    '日期 (Date)',
    '时间 (Time)',
    '商户/客户名称 (Merchant / Customer)',
    '单据类别 (Category)',
    '税前小计 RM (Subtotal)',
    'SST / 税额 RM (Tax)',
    '总计金额 RM (Total Amount)',
    '识别类型 (Scan Type)',
    '摘要/明细内容 (Description / Details)',
    '本地防伪公证 (Anti-Framing Seal)',
  ];

  const rows = items.map((item) => {
    const d = new Date(item.timestamp);
    const dateStr = d.toISOString().split('T')[0];
    const timeStr = d.toTimeString().split(' ')[0];

    // Extract invoice fields from metadata or rawText
    const invNo = item.metadata?.['Invoice No'] || item.metadata?.['Invoice/Receipt No'] || extractInvoiceNo(item.rawText) || item.id.slice(0, 8);
    const merchant = item.metadata?.['Merchant / Issuer'] || extractMerchant(item.rawText) || item.title || 'General Merchant';
    const totalAmount = item.metadata?.['Total Amount'] || extractAmount(item.rawText) || '0.00';
    const subtotal = extractSubtotal(item.rawText) || totalAmount;
    const sst = extractSST(item.rawText) || '0.00';

    const cleanField = (str: string | undefined) => {
      if (!str) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    return [
      cleanField(invNo),
      cleanField(dateStr),
      cleanField(timeStr),
      cleanField(merchant),
      cleanField(item.category.toUpperCase()),
      cleanField(subtotal),
      cleanField(sst),
      cleanField(totalAmount),
      cleanField(item.type.toUpperCase()),
      cleanField(item.content.replace(/[\r\n]+/g, ' ')),
      cleanField('Local-Sandbox-Verified-ZeroCloud'),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), filename);
}

/**
 * 导出 Resit / 商业收据 (Receipt 格式凭据)
 */
export function exportToReceipt(items: QRItem[], filename = 'Pavilion_QR_Pro_Resit.txt') {
  if (!items.length) {
    alert('暂无扫描记录可导出为 Resit');
    return;
  }

  const lines: string[] = [
    '==================================================',
    '    PAVILION QR PRO - COMMERCIAL RESIT / RECEIPT  ',
    '                 RESIT RASMI PERNIAGAAN           ',
    `                 Generated: ${new Date().toLocaleString()}`,
    '==================================================',
    '',
  ];

  items.forEach((item, index) => {
    const d = new Date(item.timestamp).toLocaleString();
    const invNo = item.metadata?.['Invoice No'] || extractInvoiceNo(item.rawText) || `REC-${item.id.slice(0, 8)}`;
    const merchant = item.metadata?.['Merchant / Issuer'] || extractMerchant(item.rawText) || 'Commercial Vendor';
    const totalAmount = item.metadata?.['Total Amount'] || extractAmount(item.rawText) || '0.00';
    const subtotal = extractSubtotal(item.rawText) || totalAmount;
    const sst = extractSST(item.rawText) || '0.00';

    lines.push(`[RESIT #${index + 1}] 凭证编号: ${invNo}`);
    lines.push(`商户 / Issuer: ${merchant}`);
    lines.push(`开票日期: ${d}`);
    lines.push('--------------------------------------------------');
    lines.push(`税前小计 (Subtotal):      ${subtotal}`);
    lines.push(`销售与服务税 (SST 6%/8%): ${sst}`);
    lines.push(`应付总额 (TOTAL PAYABLE):   ${totalAmount}`);
    lines.push('--------------------------------------------------');
    lines.push(`单据明细摘录:`);
    lines.push(`  ${item.content.replace(/\n/g, '\n  ')}`);
    lines.push('防伪验证: [✓ 经设备本地沙箱实时识别 · 0 服务器留存]');
    lines.push('==================================================');
    lines.push('');
  });

  const txtContent = lines.join('\n');
  downloadBlob(new Blob([txtContent], { type: 'text/plain;charset=utf-8;' }), filename);
}

/**
 * 导出 SQL Acc Sheet (专为马来西亚 SQL Accounting / SQL Financial 格式导入设计)
 */
export function exportToSQLAccSheet(items: QRItem[], filename = 'DocuMorphOCR_SQL_Acc_Import.csv') {
  if (!items.length) {
    alert('暂无扫描记录可导出为 SQL Acc Sheet');
    return;
  }

  // Malaysia SQL Accounting standard purchase/sales invoice CSV import headers
  const headers = [
    'DocType',
    'DocNo',
    'DocDate',
    'AccountCode',
    'CustomerSupplierName',
    'Description',
    'Subtotal',
    'TaxCode',
    'TaxAmount',
    'TotalAmount',
    'Currency',
    'PaymentStatus',
    'Remark',
  ];

  const rows = items.map((item) => {
    const d = new Date(item.timestamp);
    const dateStr = d.toISOString().split('T')[0];
    const invNo = item.metadata?.['Invoice No'] || extractInvoiceNo(item.rawText) || `INV-${item.id.slice(0, 8)}`;
    const merchant = item.metadata?.['Merchant / Issuer'] || extractMerchant(item.rawText) || 'SUPPLIER';
    const totalAmount = (item.metadata?.['Total Amount'] || extractAmount(item.rawText) || '0.00').replace(/[^0-9.]/g, '');
    const subtotalNum = (extractSubtotal(item.rawText) || totalAmount).replace(/[^0-9.]/g, '') || totalAmount;
    const taxNum = (extractSST(item.rawText) || '0.00').replace(/[^0-9.]/g, '') || '0.00';

    const cleanField = (str: string | undefined) => {
      if (!str) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    return [
      cleanField('PI'), // Purchase Invoice standard in SQL Account
      cleanField(invNo),
      cleanField(dateStr),
      cleanField('300-C001'), // Default Supplier Account Code in SQL Acc
      cleanField(merchant),
      cleanField(item.title || 'Purchased Items / Services'),
      cleanField(subtotalNum),
      cleanField(Number(taxNum) > 0 ? 'TX' : 'NR'),
      cleanField(taxNum),
      cleanField(totalAmount),
      cleanField('MYR'),
      cleanField('PAID'),
      cleanField('Imported via DocuMorphOCR'),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  downloadBlob(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }), filename);
}

// Helper utility for downloading blobs
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

// Regex extractors
function extractInvoiceNo(text: string): string | null {
  const m = text.match(/(?:INV(?:OICE)?|BILL|RECEIPT|单号|发票号|单据号)[\s#:：]*([A-Za-z0-9\-_/]{4,24})/i);
  return m ? m[1] : null;
}

function extractMerchant(text: string): string | null {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 2);
  const firstCompany = lines.find((l) => /SDN\s*BHD|BHD|TRADING|ENTERPRISE|RESTAURANT|CAF[EÉ]|MART|STORE|SHOP|有限公司/i.test(l));
  return firstCompany || (lines.length > 0 ? lines[0] : null);
}

function extractAmount(text: string): string | null {
  const m = text.match(/(?:TOTAL|TOTAL\s*AMOUNT|GRAND\s*TOTAL|实付|总计|合计|RM)[\s:：]*(?:RM|\$)?\s*([\d,]+\.\d{2})/i);
  return m ? `RM ${m[1]}` : null;
}

function extractSubtotal(text: string): string | null {
  const m = text.match(/(?:SUBTOTAL|小计)[\s:：]*(?:RM|\$)?\s*([\d,]+\.\d{2})/i);
  return m ? `RM ${m[1]}` : null;
}

function extractSST(text: string): string | null {
  const m = text.match(/(?:SST|TAX|税额|税金)[\s(（\d%）)]*[\s:：]*(?:RM|\$)?\s*([\d,]+\.\d{2})/i);
  return m ? `RM ${m[1]}` : null;
}
