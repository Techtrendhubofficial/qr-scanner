// Pavilion QR Pro - Bilingual Internationalization Engine (English & 中文)
(function () {
  'use strict';

  // Translation dictionary mapping Chinese (source) to English (target)
  const DICT = {
    // Top Brand & Nav
    "实时扫码": "Live Scan",
    "极速扫码": "Live Scan",
    "极速扫码 (Scan)": "Live Scan",
    "相册识别": "Album Scan",
    "相册识别 (Album)": "Album Decode",
    "生成QR": "Generate",
    "制作二维码": "Create QR",
    "制作二维码 (Generate)": "Generate QR",
    "二维码制作": "QR Generator",
    "历史导出": "History",
    "历史与导出 (History)": "History & Export",
    "扫码与制码历史": "Scan & Creation History",
    "会员配套": "VIP Pricing",
    "会员配套 (VIP)": "VIP Membership",
    "VIP尊享": "VIP Pro",
    "Play 商店上架": "Play Store Kit",
    "Play 上架": "Store Kit",
    "零留存报告": "Privacy Audit",
    "零留存检测与防栽赃证明报告": "Zero-Retention Privacy Audit Report",
    "🛡️ 客户防嫁祸公证报告": "🛡️ Zero-Retention Proof Report",
    "客户文件零留存检测与防栽赃证明报告": "Client Zero-Retention & Privacy Verification Audit",

    // AAB Download Banner
    "Google Play 正式 AAB 安装包已编译就绪": "Official Google Play AAB Package Ready",
    "已匹配控制台包名与正式签名，点击右侧绿色按钮直接下载保存至手机或电脑": "Signed with release keystore for com.pavilionventure.qrpro. Tap download to save.",
    "点此直接下载 AAB": "Download AAB",
    "正在保存文件...": "Downloading...",
    "查看证书": "View Keys",

    // Top VIP Promotional Banner
    "Pavilion QR Pro · 年度尊享会员": "Pavilion QR Pro · Annual VIP Plan",
    "US$59 / 年 (Annual)": "US$59 / Year (Annual)",
    "免费扫码": "Free Scans",
    "US$59/年解锁全部功能 · 无限次相机扫码 · 相册识别 · 4K矢量QR生成 · 全格式数据导出": "Unlock all features for US$59/yr · Unlimited live scans · Album decoding · 4K vector QR · Full data export",
    "查看会员特权": "View Benefits",
    "立即开通 (US$59/年)": "Upgrade Now ($59/yr)",

    // Camera Scanner Tab
    "Pavilion QR Pro · 极速扫码面板 (Live Scanner)": "Pavilion QR Pro · Ultra-fast Live Scanner",
    "秒级精准识别二维码与各类条形码，支持弱光手电筒与连续快速扫描，100% 本地端侧隐私解析。": "Sub-second detection for QR & barcodes. Supports torch, continuous scans, and 100% on-device private parsing.",
    "QR / 条码扫码": "QR / Barcode Scan",
    "OCR 拍照识字": "OCR Photo Text",
    "OCR 文字识别中...": "Recognizing text via OCR...",
    "正在分析提取画面中的所有文字": "Extracting text locally from captured image...",
    "拍照识别文字": "Capture & Extract Text",
    "将文本置于框内并点击下方拍照": "Align text inside frame and tap to capture",
    "免费试用剩余:": "Free trial remaining:",
    "免费试用剩余": "Free trial remaining",
    "Free Limit Reached (3/3)": "Free Limit Reached (3/3)",
    "Please upgrade to unlock unlimited scanning": "Please upgrade to unlock unlimited scanning",
    "立即开通年度 VIP (US$59 / 年)": "Unlock Annual VIP ($59 / Year)",
    "查看 VIP 会员特权与方案 ➔": "View VIP Benefits & Plans ➔",
    "相机不可用": "Camera Unavailable",
    "Camera Unavailable": "Camera Unavailable",
    "从设备相册选择图片识别": "Scan from Album / Gallery",
    "Scan from Album / Gallery": "Scan from Album / Gallery",
    "重试相机权限": "Retry Camera Permission",
    "Retry Permission": "Retry Camera Permission",
    "未检测到可用摄像头或权限被拒绝": "No camera detected or permission denied",

    // Album Scanner Tab
    "相册二维码识别面板 (Album Scanner)": "Album QR & Barcode Scanner",
    "从设备相册导入照片或截图，瞬间本地离线解析各类二维码与条形码，0 字节上传。": "Import photos or screenshots to decode QR codes and barcodes offline. 0 bytes uploaded to servers.",
    "点击或拖拽二维码图片至此处": "Click or drag QR image here",
    "支持 PNG, JPG, WEBP, GIF 等所有常见图片格式": "Supports PNG, JPG, WEBP, GIF and all standard formats",
    "选择相册图片": "Select Image from Album",
    "或者选择以下示例快速体验": "Or select a sample below to test immediately",
    "商业发票 / 收据 (Invoice)": "Invoice / Receipt",
    "极速识别成功！": "Decoded Successfully!",
    "识别结果": "Decoded Content",
    "内容类型": "Content Type",
    "复制内容": "Copy Content",
    "已复制到剪贴板": "Copied to clipboard",
    "导出为 Excel": "Export to Excel",
    "导出为收据": "Export as Receipt",
    "导出为 SQL Acc Sheet": "Export SQL Acc Sheet",
    "重新选择图片": "Choose Another Image",

    // QR Generator Tab
    "二维码制作生成面板 (QR Generator)": "QR Generator & Creator",
    "一键制作生成高解析度矢量二维码，支持网址、Wi-Fi 密码、名片通讯录 vCard 及社交媒体链接。": "Generate high-resolution vector QR codes for URLs, Wi-Fi credentials, vCard contacts, and social media.",
    "网址链接 (URL)": "Website URL",
    "纯文本 (Text)": "Plain Text",
    "Wi-Fi 密码": "Wi-Fi Network",
    "名片 (vCard)": "Contact (vCard)",
    "输入网址链接": "Enter website URL",
    "输入文本内容": "Enter plain text content",
    "网络名称 (SSID)": "Network Name (SSID)",
    "Wi-Fi 密码": "Wi-Fi Password",
    "加密类型": "Security Type",
    "全名": "Full Name",
    "电话号码": "Phone Number",
    "电子邮箱": "Email Address",
    "公司与职位": "Company & Title",
    "颜色与样式定制": "Color & Customization",
    "二维码前景色": "QR Foreground Color",
    "背景颜色": "Background Color",
    "容错级别": "Error Correction",
    "低 (7%)": "Low (7%)",
    "中 (15%)": "Medium (15%)",
    "较高 (25%)": "Quartile (25%)",
    "高 (30%)": "High (30%)",
    "下载 PNG 图片": "Download PNG",
    "下载 SVG 矢量图": "Download SVG Vector",
    "保存到历史记录": "Save to History",
    "已成功保存至历史记录": "Successfully saved to history",

    // History Tab
    "扫码与制码历史记录面板 (History & Export)": "Scan & Creation History",
    "本地加密持久化历史记录，支持即时分类检索、标星收藏及一键导出 CSV / TXT / SQL Acc Sheet。": "Encrypted persistent local history with category filtering, favorites, and 1-click CSV/TXT export.",
    "全部记录": "All Records",
    "标星收藏": "Favorites",
    "仅扫码记录": "Scanned Only",
    "仅制码记录": "Generated Only",
    "搜索历史内容...": "Search history content...",
    "导出 CSV": "Export CSV",
    "导出 TXT": "Export TXT",
    "清空全部历史": "Clear All History",
    "暂无历史记录": "No history records yet",
    "在此处查看所有扫描与生成的二维码": "All scanned and created QR codes will be stored here.",
    "确认清空所有历史记录？": "Are you sure you want to clear all history?",
    "清空后数据将无法找回": "This operation cannot be undone.",
    "取消": "Cancel",
    "确认清空": "Confirm Clear",

    // VIP Tab
    "Pavilion QR Pro · 全功能年度会员配套": "Pavilion QR Pro · Full Annual VIP Access",
    "US$59 / 年": "US$59 / Year",
    "Google Play Store 与 Stripe 全渠道统一定价：US$59.00 / 年": "Unified pricing across Google Play & Stripe: US$59.00 / Year",
    "年度订阅 · 无限极速扫码 · 相册瞬间解码 · 4K矢量QR生成 · 完整数据导出 · 100% 端侧隐私": "Annual subscription · Unlimited live scans · Instant album decode · 4K vector QR · Full data export · 100% on-device privacy",
    "Pavilion QR Pro VIP 年度配套": "Pavilion QR Pro VIP Annual Plan",
    "无限次畅享 (全年有效)": "Unlimited Access (1 Year Valid)",
    "一次订阅全年无忧，精准识别所有二维码与商业条码、高清矢量图制作、批量连续快速扫描与财务格式数据导出。": "Enjoy peace of mind for an entire year with precision QR & barcode scanning, vector generation, and full data export.",
    "您的账户已开通 VIP 会员权限（永久无限次扫码）": "Your account is activated with VIP Pro (Unlimited Scans)",
    "Stripe 官方安全收银台直连": "Stripe Official Secure Checkout",
    "立即前往 Stripe 安全收银台付款": "Proceed to Stripe Secure Checkout",
    "兑换码激活通道": "Redeem Promo Code",
    "输入 VIP 激活兑换码": "Enter VIP Promo Code",
    "激活兑换码": "Redeem Code",
    "站长与开发者特权通道 (Owner VIP)": "Owner & QA VIP Switch",
    "一键为自己开通 VIP (免付费)": "Instant 1-Click VIP Activation (Free)",
    "取消 VIP 权限 (恢复限制测试)": "Revoke VIP (Test Paywall Limits)",
    "重置免费额度 (0/3)": "Reset Free Quota (0/3)",
    "已开通 VIP (无限扫码)": "VIP Activated (Unlimited)",
    "免费体验:": "Free trial:",

    // Settings Modal
    "Scanner Preferences": "Scanner Preferences & Settings",
    "Scan Beep Audio": "Scan Audio Beep",
    "Crystal confirmation beep on successful scan": "Play audio chime on successful scan detection",
    "Haptic Vibration": "Haptic Vibration",
    "Tactile feedback when code is locked": "Tactile vibration feedback when code is locked",
    "Default Continuous Batch": "Continuous Batch Mode",
    "Keep camera running without pausing for results": "Keep camera running without pausing for results",
    "Auto Copy to Clipboard": "Auto Copy to Clipboard",
    "Copies scanned text immediately upon detection": "Copies scanned text immediately upon detection",
    "Stripe 付款链接 (Payment Link)": "Stripe Payment Link",
    "已保存": "Saved",
    "保存": "Save",
    "Privacy Policy": "Privacy Policy",
    "Done": "Done"
  };

  // Build reverse dictionary for English -> Chinese if needed
  const REVERSE_DICT = {};
  for (const [zh, en] of Object.entries(DICT)) {
    REVERSE_DICT[en] = zh;
  }

  // Determine initial language:
  // 1. Check saved preference
  // 2. If not set, check browser language (if starts with zh -> zh, otherwise en)
  const savedLang = localStorage.getItem('pavilion_app_lang');
  let currentLang = savedLang || (navigator.language && navigator.language.startsWith('zh') ? 'zh' : 'en');

  // Function to apply translation across the entire DOM
  function translateNode(node, targetLang) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;

      if (targetLang === 'en') {
        const trimmed = text.trim();
        // Check exact match
        if (DICT[trimmed]) {
          if (!node.__zh_orig) node.__zh_orig = text;
          node.nodeValue = text.replace(trimmed, DICT[trimmed]);
          return;
        }
        // Check partial replacements for known key phrases
        for (const [zh, en] of Object.entries(DICT)) {
          if (zh.length >= 3 && text.includes(zh)) {
            if (!node.__zh_orig) node.__zh_orig = text;
            node.nodeValue = node.nodeValue.replace(zh, en);
          }
        }
      } else if (targetLang === 'zh') {
        if (node.__zh_orig) {
          node.nodeValue = node.__zh_orig;
          delete node.__zh_orig;
        } else {
          const trimmed = text.trim();
          if (REVERSE_DICT[trimmed]) {
            node.nodeValue = text.replace(trimmed, REVERSE_DICT[trimmed]);
          }
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't translate script, style, code blocks
      const tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript') return;

      // Translate attributes
      ['placeholder', 'title', 'aria-label'].forEach((attr) => {
        const val = node.getAttribute(attr);
        if (val) {
          if (targetLang === 'en') {
            if (DICT[val]) {
              if (!node[`__zh_${attr}`]) node[`__zh_${attr}`] = val;
              node.setAttribute(attr, DICT[val]);
            }
          } else if (targetLang === 'zh') {
            if (node[`__zh_${attr}`]) {
              node.setAttribute(attr, node[`__zh_${attr}`]);
              delete node[`__zh_${attr}`];
            }
          }
        }
      });

      // Recurse children
      for (let child = node.firstChild; child; child = child.nextSibling) {
        translateNode(child, targetLang);
      }
    }
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('pavilion_app_lang', lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';

    // Translate DOM
    if (document.body) {
      translateNode(document.body, lang);
    }

    // Update switcher UI
    updateSwitcherUI();

    // Fire event for any listeners
    window.dispatchEvent(new CustomEvent('pavilion_language_changed', { detail: { lang } }));
  }

  // Create UI Toggle Button
  function createLanguageSwitcher() {
    if (document.getElementById('pavilion-lang-switcher')) return;

    const container = document.createElement('div');
    container.id = 'pavilion-lang-switcher';
    container.className = 'fixed top-3.5 right-4 z-50 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full p-1 shadow-lg backdrop-blur-md transition-all';
    container.innerHTML = `
      <div class="flex items-center gap-1 text-[11px] font-bold select-none">
        <span class="pl-1.5 pr-0.5 text-slate-400">🌐</span>
        <button type="button" id="pavilion-lang-en" class="px-2 py-0.5 rounded-full transition cursor-pointer">EN</button>
        <span class="text-slate-600 text-[10px]">|</span>
        <button type="button" id="pavilion-lang-zh" class="px-2 py-0.5 rounded-full transition cursor-pointer">中文</button>
      </div>
    `;

    document.body.appendChild(container);

    const btnEn = document.getElementById('pavilion-lang-en');
    const btnZh = document.getElementById('pavilion-lang-zh');

    btnEn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage('en');
    });

    btnZh.addEventListener('click', (e) => {
      e.stopPropagation();
      applyLanguage('zh');
    });

    updateSwitcherUI();
  }

  function updateSwitcherUI() {
    const btnEn = document.getElementById('pavilion-lang-en');
    const btnZh = document.getElementById('pavilion-lang-zh');
    if (!btnEn || !btnZh) return;

    if (currentLang === 'en') {
      btnEn.className = 'px-2 py-0.5 rounded-full bg-[#00ff88] text-black font-black shadow-sm transition';
      btnZh.className = 'px-2 py-0.5 rounded-full text-slate-400 hover:text-white transition';
    } else {
      btnZh.className = 'px-2 py-0.5 rounded-full bg-[#00ff88] text-black font-black shadow-sm transition';
      btnEn.className = 'px-2 py-0.5 rounded-full text-slate-400 hover:text-white transition';
    }
  }

  // MutationObserver to auto-translate any dynamic updates (React renders, tab changes, toasts)
  let observer = null;
  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      if (currentLang !== 'en') return;
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateNode(mutation.target, 'en');
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            // Avoid observing our own switcher
            if (node.id === 'pavilion-lang-switcher') return;
            translateNode(node, 'en');
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // Initialize once DOM is ready
  function init() {
    createLanguageSwitcher();
    if (currentLang === 'en') {
      translateNode(document.body, 'en');
    }
    startObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose helper globally
  window.pavilionI18n = {
    setLanguage: applyLanguage,
    getLanguage: () => currentLang,
  };
})();
