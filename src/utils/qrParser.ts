import { QRCategory } from '../types';

export interface ParsedQR {
  category: QRCategory;
  title: string;
  displayValue: string;
  metadata: Record<string, string>;
  actionUrl?: string;
  actionLabel?: string;
  isActionable: boolean;
}

export function parseQRContent(rawText: string): ParsedQR {
  const trimmed = (rawText || '').trim();

  // 1. Wi-Fi: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  if (trimmed.toUpperCase().startsWith('WIFI:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]+)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);
    const hiddenMatch = trimmed.match(/H:([^;]+)/i);

    const ssid = ssidMatch ? ssidMatch[1] : 'Unknown Network';
    const password = passMatch ? passMatch[1] : '';
    const security = typeMatch ? typeMatch[1].toUpperCase() : 'WPA/WPA2';
    const hidden = hiddenMatch ? hiddenMatch[1] : 'false';

    return {
      category: 'wifi',
      title: `Wi-Fi: ${ssid}`,
      displayValue: `SSID: ${ssid} · Security: ${security}`,
      metadata: {
        SSID: ssid,
        Password: password,
        Security: security,
        Hidden: hidden,
      },
      isActionable: true,
      actionLabel: 'Copy Password',
    };
  }

  // 2. vCard / Contact Card
  if (trimmed.toUpperCase().startsWith('BEGIN:VCARD') || trimmed.toUpperCase().startsWith('MECARD:')) {
    let name = '';
    let phone = '';
    let email = '';
    let org = '';
    let title = '';

    if (trimmed.toUpperCase().startsWith('BEGIN:VCARD')) {
      const fnMatch = trimmed.match(/FN:(.+)/i);
      const nMatch = trimmed.match(/N:(.+)/i);
      const telMatch = trimmed.match(/TEL.*:(.+)/i);
      const emailMatch = trimmed.match(/EMAIL.*:(.+)/i);
      const orgMatch = trimmed.match(/ORG:(.+)/i);
      const titleMatch = trimmed.match(/TITLE:(.+)/i);

      name = fnMatch ? fnMatch[1].trim() : (nMatch ? nMatch[1].replace(/;/g, ' ').trim() : 'Contact Card');
      phone = telMatch ? telMatch[1].trim() : '';
      email = emailMatch ? emailMatch[1].trim() : '';
      org = orgMatch ? orgMatch[1].trim() : '';
      title = titleMatch ? titleMatch[1].trim() : '';
    } else {
      // MECARD:N:John Doe;TEL:12345678;EMAIL:test@test.com;;
      const nMatch = trimmed.match(/N:([^;]+)/i);
      const telMatch = trimmed.match(/TEL:([^;]+)/i);
      const emailMatch = trimmed.match(/EMAIL:([^;]+)/i);
      name = nMatch ? nMatch[1].replace(/,/g, ' ').trim() : 'Contact Card';
      phone = telMatch ? telMatch[1].trim() : '';
      email = emailMatch ? emailMatch[1].trim() : '';
    }

    const metadata: Record<string, string> = { Name: name };
    if (phone) metadata.Phone = phone;
    if (email) metadata.Email = email;
    if (org) metadata.Company = org;
    if (title) metadata.Title = title;

    return {
      category: 'contact',
      title: name || 'Contact Card',
      displayValue: `${name} ${phone ? `· ${phone}` : ''}`,
      metadata,
      isActionable: !!phone || !!email,
      actionUrl: phone ? `tel:${phone}` : (email ? `mailto:${email}` : undefined),
      actionLabel: phone ? 'Call Contact' : 'Send Email',
    };
  }

  // 3. Email: mailto: or MATMSG:
  if (trimmed.toLowerCase().startsWith('mailto:') || trimmed.toUpperCase().startsWith('MATMSG:')) {
    let email = '';
    let subject = '';
    let body = '';

    if (trimmed.toLowerCase().startsWith('mailto:')) {
      try {
        const url = new URL(trimmed);
        email = url.pathname;
        subject = url.searchParams.get('subject') || '';
        body = url.searchParams.get('body') || '';
      } catch {
        email = trimmed.replace(/^mailto:/i, '');
      }
    } else {
      const toMatch = trimmed.match(/TO:([^;]+)/i);
      const subMatch = trimmed.match(/SUB:([^;]+)/i);
      const bodyMatch = trimmed.match(/BODY:([^;]+)/i);
      email = toMatch ? toMatch[1] : '';
      subject = subMatch ? subMatch[1] : '';
      body = bodyMatch ? bodyMatch[1] : '';
    }

    return {
      category: 'email',
      title: `Email: ${email}`,
      displayValue: email,
      metadata: {
        Recipient: email,
        Subject: subject || '(No Subject)',
        Body: body || '(No Content)',
      },
      isActionable: true,
      actionUrl: `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`,
      actionLabel: 'Compose Email',
    };
  }

  // 4. Phone: tel:
  if (trimmed.toLowerCase().startsWith('tel:')) {
    const phone = trimmed.replace(/^tel:/i, '');
    return {
      category: 'phone',
      title: `Phone: ${phone}`,
      displayValue: phone,
      metadata: { Phone: phone },
      isActionable: true,
      actionUrl: `tel:${phone}`,
      actionLabel: 'Call Phone',
    };
  }

  // 5. SMS: smsto: or sms:
  if (trimmed.toLowerCase().startsWith('smsto:') || trimmed.toLowerCase().startsWith('sms:')) {
    const parts = trimmed.replace(/^(smsto:|sms:)/i, '').split(':');
    const phone = parts[0] || '';
    const body = parts.slice(1).join(':') || '';
    return {
      category: 'sms',
      title: `SMS: ${phone}`,
      displayValue: `${phone} ${body ? `· "${body}"` : ''}`,
      metadata: {
        Phone: phone,
        Message: body,
      },
      isActionable: true,
      actionUrl: `sms:${phone}`,
      actionLabel: 'Send Message',
    };
  }

  // 6. Geo Location: geo:lat,lng or maps links
  if (trimmed.toLowerCase().startsWith('geo:') || trimmed.includes('maps.google.com') || trimmed.includes('goo.gl/maps')) {
    let lat = '';
    let lng = '';
    if (trimmed.toLowerCase().startsWith('geo:')) {
      const coords = trimmed.replace(/^geo:/i, '').split('?')[0].split(',');
      lat = coords[0] || '';
      lng = coords[1] || '';
    }

    return {
      category: 'location',
      title: 'Geographic Location',
      displayValue: lat && lng ? `${lat}, ${lng}` : trimmed,
      metadata: lat && lng ? { Latitude: lat, Longitude: lng } : { Location: trimmed },
      isActionable: true,
      actionUrl: lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : trimmed,
      actionLabel: 'Open in Maps',
    };
  }

  // 7. URL / Web Links & Social Profiles
  const urlPattern = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
  if (urlPattern.test(trimmed) || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const validUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;

    // Check for social links
    let category: QRCategory = 'url';
    let label = 'Open Website';
    let brand = 'Website';

    if (validUrl.includes('instagram.com')) {
      category = 'social';
      brand = 'Instagram Profile';
      label = 'Open Instagram';
    } else if (validUrl.includes('twitter.com') || validUrl.includes('x.com')) {
      category = 'social';
      brand = 'X (Twitter)';
      label = 'Open X Profile';
    } else if (validUrl.includes('youtube.com') || validUrl.includes('youtu.be')) {
      category = 'social';
      brand = 'YouTube';
      label = 'Watch Video';
    } else if (validUrl.includes('wa.me') || validUrl.includes('whatsapp.com')) {
      category = 'social';
      brand = 'WhatsApp';
      label = 'Chat on WhatsApp';
    } else if (validUrl.includes('tiktok.com')) {
      category = 'social';
      brand = 'TikTok';
      label = 'Open TikTok';
    } else if (validUrl.includes('linkedin.com')) {
      category = 'social';
      brand = 'LinkedIn';
      label = 'View LinkedIn';
    }

    try {
      const urlObj = new URL(validUrl);
      return {
        category,
        title: `${brand}: ${urlObj.hostname}`,
        displayValue: validUrl,
        metadata: {
          Domain: urlObj.hostname,
          Path: urlObj.pathname,
          Protocol: urlObj.protocol.replace(':', ''),
        },
        isActionable: true,
        actionUrl: validUrl,
        actionLabel: label,
      };
    } catch {
      return {
        category: 'url',
        title: 'Web Link',
        displayValue: validUrl,
        metadata: { URL: validUrl },
        isActionable: true,
        actionUrl: validUrl,
        actionLabel: 'Open Link',
      };
    }
  }

  // 8. Invoice / Bill / Commercial Receipt detection
  const upper = trimmed.toUpperCase();
  const isInvoice =
    upper.includes('INVOICE') ||
    upper.includes('TAX INVOICE') ||
    upper.includes('RECEIPT') ||
    upper.includes('BILL TO') ||
    upper.includes('FAKTUR') ||
    upper.includes('RESIT') ||
    upper.includes('发票') ||
    upper.includes('单据') ||
    upper.includes('账单') ||
    upper.includes('收据') ||
    /INV[-\s#:]*[A-Z0-9]{3,}/i.test(trimmed);

  if (isInvoice) {
    const lines = trimmed.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    // 1. Detect Merchant / Issuer name from first few lines
    let merchantName = '';
    const merchantKeywords = ['SDN BHD', 'BHD', 'ENTERPRISE', 'TRADING', 'SERVICES', 'COMPANY', 'CO.', 'STORE', 'SHOP', 'RESTAURANT', 'CAFE', 'LLC', 'PTE LTD', 'LTD', 'CORP', '有限公司', '企业', '商行'];
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const lineUpper = lines[i].toUpperCase();
      if (merchantKeywords.some((kw) => lineUpper.includes(kw))) {
        merchantName = lines[i];
        break;
      }
    }
    if (!merchantName && lines.length > 0) {
      // First line if not generic "INVOICE"
      const firstLine = lines[0];
      if (!/^(INVOICE|TAX INVOICE|RECEIPT|BILL|发票|收据)$/i.test(firstLine)) {
        merchantName = firstLine.slice(0, 40);
      }
    }

    // 2. Extract Real Invoice / Receipt Number
    const invNoMatch =
      trimmed.match(/(?:TAX\s*INVOICE|INVOICE\s*(?:NO|NUMBER|#)?|INV\s*(?:NO|#)?|RECEIPT\s*(?:NO|#)?|BILL\s*(?:NO|#)?|ORDER\s*(?:NO|#)?|REF\s*(?:NO|#)?|发票号码|单据编号|账单号|发票号|单号)[\s:：#\.\-]*([A-Z0-9\-_/]{3,30})/i) ||
      trimmed.match(/(?:INV|REC|BILL)[-:\s#]+([A-Z0-9\-_/]{3,24})/i);
    const realInvNo = invNoMatch ? invNoMatch[1].trim() : '';

    // 3. Extract Real Amount
    const totalMatch =
      trimmed.match(/(?:GRAND\s*TOTAL|TOTAL\s*AMOUNT|TOTAL\s*PAYABLE|BALANCE\s*DUE|NET\s*TOTAL|TOTAL|AMOUNT|SUBTOTAL|应付金额|合计|总额|总计|实付)[\s:：]*(?:RM|\$|MYR|SGD|USD|CNY|¥|€)?\s*([\d,]+\.\d{2})/i) ||
      trimmed.match(/(?:RM|\$|MYR|SGD|USD)\s*([\d,]+\.\d{2})/i) ||
      trimmed.match(/(?:GRAND\s*TOTAL|TOTAL|总计|合计)[\s:：]*([\d,]+\.?\d*)/i);

    let detectedAmount = '';
    if (totalMatch) {
      const numStr = totalMatch[1].trim();
      const rawMatchText = totalMatch[0].toUpperCase();
      if (rawMatchText.includes('$') || trimmed.includes('$')) {
        detectedAmount = `$ ${numStr}`;
      } else if (rawMatchText.includes('SGD') || trimmed.includes('SGD')) {
        detectedAmount = `SGD ${numStr}`;
      } else if (rawMatchText.includes('USD') || trimmed.includes('USD')) {
        detectedAmount = `USD ${numStr}`;
      } else {
        detectedAmount = `RM ${numStr}`;
      }
    }

    // 4. Extract Real Date
    const dateMatch =
      trimmed.match(/(?:DATE|INVOICE\s*DATE|BILL\s*DATE|日期|开票日期)[\s:：]*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}年\d{1,2}月\d{1,2}日)/i) ||
      trimmed.match(/(\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/);
    const detectedDate = dateMatch ? dateMatch[1].trim() : '';

    // Title construction without dummy fallback
    let docTitle = '';
    if (merchantName) {
      docTitle = realInvNo ? `${merchantName} (${realInvNo})` : merchantName;
    } else if (realInvNo) {
      docTitle = `Invoice #${realInvNo}`;
    } else {
      docTitle = lines[0] ? lines[0].slice(0, 30) : 'Commercial Document';
    }

    // Summary display
    const summaryParts: string[] = [];
    if (merchantName) summaryParts.push(merchantName);
    if (realInvNo) summaryParts.push(`#${realInvNo}`);
    if (detectedAmount) summaryParts.push(detectedAmount);
    if (detectedDate) summaryParts.push(detectedDate);
    const displayVal = summaryParts.length > 0 ? summaryParts.join(' · ') : trimmed.slice(0, 80);

    const metadata: Record<string, string> = {
      'Document Type': 'Commercial Invoice / Receipt',
    };
    if (merchantName) metadata['Merchant / Issuer'] = merchantName;
    if (realInvNo) metadata['Invoice No'] = realInvNo;
    if (detectedAmount) metadata['Total Amount'] = detectedAmount;
    if (detectedDate) metadata['Date'] = detectedDate;
    metadata['Lines Count'] = `${lines.length} lines detected`;
    metadata['Privacy & Zero-Leak'] = '100% On-Device Sandbox (0 Server Upload)';

    return {
      category: 'invoice',
      title: docTitle,
      displayValue: displayVal,
      metadata,
      isActionable: true,
      actionLabel: 'Copy Invoice Details',
    };
  }

  // 9. Plain Text / Barcode Numbers / Other
  const isBarcode = /^\d{8,14}$/.test(trimmed);
  return {
    category: isBarcode ? 'product' : 'text',
    title: isBarcode ? `Barcode (${trimmed.length} digits)` : 'Plain Text Note',
    displayValue: trimmed,
    metadata: {
      Length: `${trimmed.length} characters`,
      Type: isBarcode ? 'EAN/UPC Barcode' : 'Raw Text',
    },
    isActionable: isBarcode,
    actionUrl: isBarcode ? `https://www.google.com/search?q=${encodeURIComponent(trimmed)}` : undefined,
    actionLabel: isBarcode ? 'Search Product' : 'Copy Text',
  };
}
