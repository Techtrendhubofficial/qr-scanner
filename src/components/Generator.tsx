import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  PlusCircle,
  Download,
  Copy,
  Check,
  Link as LinkIcon,
  Type,
  Wifi,
  MessageCircle,
  User,
  Palette,
  QrCode as QrCodeIcon,
} from 'lucide-react';
import { GeneratedQrItem } from '../types';
import { Language } from '../utils/i18n';

interface GeneratorProps {
  onSaveQr: (item: GeneratedQrItem) => void;
  lang?: Language;
}

export const Generator: React.FC<GeneratorProps> = ({ onSaveQr, lang = 'en' }) => {
  const isEn = lang === 'en';
  const [qrType, setQrType] = useState<'url' | 'text' | 'whatsapp' | 'wifi' | 'contact'>('url');

  // Input fields
  const [urlInput, setUrlInput] = useState('https://qr.pavilionventure.com');
  const [textInput, setTextInput] = useState('');

  // WhatsApp
  const [waPhone, setWaPhone] = useState('60123456789');
  const [waMessage, setWaMessage] = useState('Hello, I would like to connect via Pavilion QR Pro');

  // WiFi
  const [wifiSsid, setWifiSsid] = useState('Pavilion_VIP_Guest');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Contact
  const [contactName, setContactName] = useState('Jason Ang');
  const [contactPhone, setContactPhone] = useState('+60123456789');
  const [contactCompany, setContactCompany] = useState('Pavilion Venture');

  // Styling
  const [fgColor, setFgColor] = useState('#10b981');
  const [bgColor] = useState('#090d16');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Compute final string to encode
  const getEncodedString = () => {
    switch (qrType) {
      case 'url':
        return urlInput.trim();
      case 'text':
        return textInput.trim();
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPass};;`;
      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${contactName}\nORG:${contactCompany}\nTEL:${contactPhone}\nEND:VCARD`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const rawContent = getEncodedString();
    if (!rawContent) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(rawContent, {
      width: 480,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR Generate Error:', err);
      });
  }, [qrType, urlInput, textInput, waPhone, waMessage, wifiSsid, wifiPass, wifiType, contactName, contactPhone, contactCompany, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `pavilion_qr_${Date.now()}.png`;
    a.click();

    // Auto save to history
    const item: GeneratedQrItem = {
      id: 'gen_' + Date.now(),
      title:
        qrType === 'url'
          ? urlInput
          : qrType === 'whatsapp'
          ? isEn
            ? 'WhatsApp QR'
            : 'WhatsApp 联系码'
          : isEn
          ? 'Custom QR Code'
          : '自定义二维码',
      content: getEncodedString(),
      timestamp: Date.now(),
      type: qrType,
      color: fgColor,
    };
    onSaveQr(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      navigator.clipboard.writeText(getEncodedString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const colors = [
    { label: isEn ? 'Emerald' : '极速绿', color: '#10b981' },
    { label: isEn ? 'Sky Blue' : '科技蓝', color: '#38bdf8' },
    { label: isEn ? 'Amber Gold' : '尊享金', color: '#f59e0b' },
    { label: isEn ? 'Violet' : '星空紫', color: '#a855f7' },
    { label: isEn ? 'Crisp White' : '炫酷白', color: '#ffffff' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24 md:pb-12 text-slate-100">
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <PlusCircle className="w-6 h-6 text-emerald-400" />
          <span>{isEn ? 'Custom QR Code Generator' : '制作专属商业二维码'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isEn
            ? 'Create HD QR codes for URLs, WhatsApp, Wi-Fi, vCards, and plain text'
            : '支持网址、WhatsApp 直达、WiFi 密码、名片与纯文本，生成高清矢量码'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Section */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800">
            <button
              onClick={() => setQrType('url')}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                qrType === 'url' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{isEn ? 'URL' : '网址'}</span>
            </button>
            <button
              onClick={() => setQrType('whatsapp')}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                qrType === 'whatsapp' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setQrType('wifi')}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                qrType === 'wifi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>{isEn ? 'Wi-Fi' : 'WiFi'}</span>
            </button>
            <button
              onClick={() => setQrType('contact')}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                qrType === 'contact' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isEn ? 'vCard' : '名片'}</span>
            </button>
            <button
              onClick={() => setQrType('text')}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                qrType === 'text' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isEn ? 'Text' : '纯文本'}</span>
            </button>
          </div>

          {/* Form fields based on selected type */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            {qrType === 'url' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isEn ? 'Website Link (URL)' : '网页链接 (URL)'}
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://your-domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
            )}

            {qrType === 'whatsapp' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isEn ? 'WhatsApp Phone Number (with country code)' : 'WhatsApp 电话号码 (含国家代码)'}
                  </label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="60123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isEn ? 'Pre-filled Chat Message' : '自动预填聊天消息'}
                  </label>
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder={isEn ? 'e.g. Hello, I have an inquiry' : '例如：您好，我想了解更多业务'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
              </div>
            )}

            {qrType === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isEn ? 'Wi-Fi Network Name (SSID)' : 'WiFi 名称 (SSID)'}
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isEn ? 'Wi-Fi Password' : 'WiFi 密码'}
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder={isEn ? 'Leave blank if open network' : '若无密码可留空'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
              </div>
            )}

            {qrType === 'contact' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {isEn ? 'Full Name' : '姓名'}
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {isEn ? 'Phone' : '电话'}
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {isEn ? 'Organization / Company' : '公司/商号'}
                  </label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                  />
                </div>
              </div>
            )}

            {qrType === 'text' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {isEn ? 'Text Content' : '文本内容'}
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={isEn ? 'Enter any text content...' : '输入任何文本内容...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
            )}

            {/* Color Palette */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isEn ? 'QR Color Theme' : '二维码颜色定制'}</span>
              </label>
              <div className="flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setFgColor(c.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      fgColor === c.color ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview Section */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start space-y-4">
          <div className="w-full max-w-xs p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-2xl flex flex-col items-center space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isEn ? 'Live HD Preview' : '实时高清渲染预览'}
            </div>

            <div className="p-3 bg-[#090d16] rounded-2xl border border-slate-800 shadow-inner flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-56 h-56 rounded-xl object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <QrCodeIcon className="w-12 h-12" />
                  <span className="text-xs">{isEn ? 'Enter valid content' : '请输入有效内容'}</span>
                </div>
              )}
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                <span>
                  {saved
                    ? isEn
                      ? 'Saved to History!'
                      : '已保存到历史！'
                    : isEn
                    ? 'Download HD PNG'
                    : '下载高清 PNG 图片'}
                </span>
              </button>

              <button
                onClick={handleCopyImage}
                disabled={!qrDataUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors disabled:opacity-40"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>
                  {copied
                    ? isEn
                      ? 'Copied to Clipboard!'
                      : '已复制到剪贴板！'
                    : isEn
                    ? 'Copy QR Code'
                    : '复制二维码'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
