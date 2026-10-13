import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Link,
  Wifi,
  FileText,
  User,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Share2,
  Download,
  Copy,
  Printer,
  Sparkles,
  Check,
  Palette,
  Image as ImageIcon,
  ShieldAlert,
  Crown,
} from 'lucide-react';
import { QRCategory, QRItem } from '../../types';

interface QRGeneratorProps {
  onSaveToHistory: (item: Omit<QRItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  isPro: boolean;
  onOpenPricing: () => void;
  initialText?: string;
}

type GeneratorTab = 'url' | 'wifi' | 'text' | 'contact' | 'email' | 'phone' | 'sms' | 'social';

interface ColorPreset {
  name: string;
  fg: string;
  bg: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Classic Dark', fg: '#020617', bg: '#ffffff' },
  { name: 'Emerald OLED', fg: '#10b981', bg: '#020617' },
  { name: 'Cyber Cyan', fg: '#06b6d4', bg: '#090d16' },
  { name: 'Sunset Amber', fg: '#f59e0b', bg: '#1c1917' },
  { name: 'Royal Indigo', fg: '#6366f1', bg: '#0b0f19' },
];

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  onSaveToHistory,
  isPro,
  onOpenPricing,
  initialText,
}) => {
  const [activeTab, setActiveTab] = useState<GeneratorTab>('url');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form Fields
  const [url, setUrl] = useState('https://play.google.com');
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SuperSecretPass');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [plainText, setPlainText] = useState(initialText || 'Pavilion QR Pro - Premium QR Engine');

  const [contactName, setContactName] = useState('Jason Ang');
  const [contactPhone, setContactPhone] = useState('+1 800 555 0199');
  const [contactEmail, setContactEmail] = useState('jasonang9996@gmail.com');
  const [contactCompany, setContactCompany] = useState('Pavilion Venture');
  const [contactTitle, setContactTitle] = useState('Software Architect');

  const [emailTo, setEmailTo] = useState('jasonang9996@gmail.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry');
  const [emailBody, setEmailBody] = useState('Hello Team,');

  const [phoneNum, setPhoneNum] = useState('+18005550199');
  const [smsNum, setSmsNum] = useState('+18005550199');
  const [smsBody, setSmsBody] = useState('Hi there!');

  const [socialPlatform, setSocialPlatform] = useState('whatsapp');
  const [socialHandle, setSocialHandle] = useState('18005550199');

  // Customization
  const [fgColor, setFgColor] = useState('#020617');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [eccLevel, setEccLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H'); // High allows center logos cleanly!
  const [centerLogo, setCenterLogo] = useState<'none' | 'star' | 'wifi' | 'link' | 'custom'>('none');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);

  // Determine current payload
  const computePayload = (): { payload: string; category: QRCategory; title: string } => {
    switch (activeTab) {
      case 'url':
        const validUrl = url.startsWith('http') ? url : `https://${url}`;
        return { payload: validUrl, category: 'url', title: `Link: ${url}` };
      case 'wifi':
        const wifiString = `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};H:${wifiHidden};;`;
        return { payload: wifiString, category: 'wifi', title: `Wi-Fi: ${wifiSsid}` };
      case 'text':
        return { payload: plainText, category: 'text', title: `Text: ${plainText.slice(0, 20)}...` };
      case 'contact':
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nORG:${contactCompany}\nTITLE:${contactTitle}\nEND:VCARD`;
        return { payload: vcard, category: 'contact', title: `Contact: ${contactName}` };
      case 'email':
        const mailto = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        return { payload: mailto, category: 'email', title: `Email: ${emailTo}` };
      case 'phone':
        return { payload: `tel:${phoneNum}`, category: 'phone', title: `Phone: ${phoneNum}` };
      case 'sms':
        return { payload: `smsto:${smsNum}:${smsBody}`, category: 'sms', title: `SMS: ${smsNum}` };
      case 'social':
        let socUrl = '';
        if (socialPlatform === 'whatsapp') socUrl = `https://wa.me/${socialHandle.replace(/\D/g, '')}`;
        else if (socialPlatform === 'instagram') socUrl = `https://instagram.com/${socialHandle.replace('@', '')}`;
        else if (socialPlatform === 'x') socUrl = `https://x.com/${socialHandle.replace('@', '')}`;
        else if (socialPlatform === 'youtube') socUrl = `https://youtube.com/@${socialHandle.replace('@', '')}`;
        return { payload: socUrl, category: 'social', title: `${socialPlatform.toUpperCase()}: ${socialHandle}` };
      default:
        return { payload: url, category: 'url', title: 'QR Code' };
    }
  };

  // Render QR Code onto Canvas with optional Center Logo
  useEffect(() => {
    const { payload } = computePayload();
    if (!payload || !canvasRef.current) return;

    const canvas = canvasRef.current;
    QRCode.toCanvas(canvas, payload, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: eccLevel,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then(() => {
        // Draw Center Logo if enabled
        if (centerLogo !== 'none') {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const size = canvas.width;
          const logoSize = Math.round(size * 0.22);
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw logo white background protective rounded square
          ctx.fillStyle = bgColor === '#ffffff' ? '#ffffff' : '#020617';
          ctx.beginPath();
          ctx.roundRect(logoX - 6, logoY - 6, logoSize + 12, logoSize + 12, 12);
          ctx.fill();

          ctx.strokeStyle = fgColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          if (centerLogo === 'custom' && customLogoUrl) {
            const logoImg = new Image();
            logoImg.onload = () => {
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
            };
            logoImg.src = customLogoUrl;
          } else {
            // Draw clean vector badge
            ctx.fillStyle = fgColor;
            ctx.font = `bold ${Math.round(logoSize * 0.5)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let iconSymbol = '★';
            if (centerLogo === 'wifi') iconSymbol = '📶';
            else if (centerLogo === 'link') iconSymbol = '🔗';
            else if (centerLogo === 'star') iconSymbol = '★';

            ctx.fillText(iconSymbol, size / 2, size / 2);
          }
        }
      })
      .catch((err) => {
        console.error('QR rendering error:', err);
      });
  }, [
    activeTab,
    url,
    wifiSsid,
    wifiPassword,
    wifiSecurity,
    wifiHidden,
    plainText,
    contactName,
    contactPhone,
    contactEmail,
    contactCompany,
    contactTitle,
    emailTo,
    emailSubject,
    emailBody,
    phoneNum,
    smsNum,
    smsBody,
    socialPlatform,
    socialHandle,
    fgColor,
    bgColor,
    eccLevel,
    centerLogo,
    customLogoUrl,
  ]);

  // Download High-Res PNG
  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const { title, payload, category } = computePayload();
    const link = document.createElement('a');
    link.download = `pavilion_qr_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();

    // Auto-save to history
    onSaveToHistory({
      type: 'generate',
      source: 'manual',
      category,
      title,
      content: payload,
      rawText: payload,
    });
    setSavedToHistory(true);
    setTimeout(() => setSavedToHistory(false), 2500);
  };

  // Download Vector SVG
  const handleDownloadSVG = async () => {
    const { payload, title, category } = computePayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: eccLevel,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pavilion_qr_${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);

      onSaveToHistory({
        type: 'generate',
        source: 'manual',
        category,
        title,
        content: payload,
        rawText: payload,
      });
      setSavedToHistory(true);
      setTimeout(() => setSavedToHistory(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch {
      // Fallback
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomLogoUrl(ev.target?.result as string);
        setCenterLogo('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'url', label: 'Website URL', icon: Link },
          { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'contact', label: 'vCard Contact', icon: User },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone', icon: Phone },
          { id: 'sms', label: 'SMS', icon: MessageSquare },
          { id: 'social', label: 'Social Media', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as GeneratorTab)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form & Style Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Dynamic Content Inputs */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Content Details
            </h4>

            {activeTab === 'url' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Destination URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Wi-Fi Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Home_5G"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Password</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Enter network password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300">Security</label>
                    <select
                      value={wifiSecurity}
                      onChange={(e) => setWifiSecurity(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="hiddenNet"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                    />
                    <label htmlFor="hiddenNet" className="text-xs text-slate-300 cursor-pointer">
                      Hidden Network
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Plain Text Note</label>
                <textarea
                  rows={4}
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Type any message, coupon code, or product information..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Phone</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Company</label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'phone' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300">Phone Number to Call</label>
                <input
                  type="tel"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    value={smsNum}
                    onChange={(e) => setSmsNum(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Message Body</label>
                  <textarea
                    rows={2}
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Platform</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'whatsapp', name: 'WhatsApp' },
                      { id: 'instagram', name: 'Instagram' },
                      { id: 'x', name: 'X / Twitter' },
                      { id: 'youtube', name: 'YouTube' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSocialPlatform(p.id)}
                        className={`py-1.5 text-[11px] font-medium rounded-lg border transition ${
                          socialPlatform === p.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Handle / Number</label>
                  <input
                    type="text"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                    placeholder={socialPlatform === 'whatsapp' ? '1234567890' : '@username'}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* QR Design & Color Customizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                Color & Appearance
              </h4>
              <span className="text-[11px] text-slate-400">High Resolution</span>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Quick Palette Presets</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setFgColor(preset.fg);
                      setBgColor(preset.bg);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                      fgColor === preset.fg && bgColor === preset.bg
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-slate-700 shrink-0"
                      style={{ backgroundColor: preset.fg }}
                    />
                    <span className="text-[11px] font-medium text-slate-200 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Pickers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Pattern Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-1.5">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-300">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Background Color</label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 p-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-300">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Center Logo Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Center Logo / Badge
                </label>
                {!isPro && (
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    VIP 3-Day Trial
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'star', label: '★ Star' },
                  { id: 'wifi', label: '📶 Wi-Fi' },
                  { id: 'link', label: '🔗 Link' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (!isPro && item.id !== 'none') {
                        onOpenPricing();
                        return;
                      }
                      setCenterLogo(item.id as typeof centerLogo);
                    }}
                    className={`py-2 text-xs font-medium rounded-xl border transition ${
                      centerLogo === item.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Logo Upload */}
              <div className="pt-1">
                <label className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950 text-xs text-slate-400 hover:text-slate-200 cursor-pointer transition">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Upload Custom Brand Logo (PNG/SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (!isPro) {
                        onOpenPricing();
                        return;
                      }
                      handleLogoUpload(e);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Render Canvas & Export Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center justify-center text-center shadow-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Live Vector Preview
            </span>

            {/* Canvas Container */}
            <div className="p-4 bg-white/5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl shadow-lg"
              />
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              Error Correction: Level {eccLevel} (30% redundancy)
            </p>

            {savedToHistory && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Saved to History & Ready to Export!
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={handleDownloadPNG}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download High-Res PNG</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Vector SVG
              </button>
              <button
                onClick={handleCopyImage}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    Copy Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
