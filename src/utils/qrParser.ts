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

  // 8. Plain Text / Barcode Numbers / Other
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
