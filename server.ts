import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for large payload (images/files base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.resolve(__dirname, 'public'), { dotfiles: 'allow' }));
app.use('/assets/aistudio', express.static(path.resolve(__dirname, 'public/assets/aistudio')));

import fs from 'fs';

// Android App Links verification for Google Play Console Deep Links (qr.pavilionventure.com)
app.get(['/.well-known/assetlinks.json', '/assetlinks.json'], (_req: Request, res: Response) => {
  try {
    const assetlinksPath = path.resolve(__dirname, 'public/.well-known/assetlinks.json');
    const content = fs.readFileSync(assetlinksPath, 'utf8');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).send(content);
  } catch (error) {
    return res.status(404).json({ error: 'assetlinks.json not found' });
  }
});

// Explicit Download Endpoint for GitHub & Vercel Update Zip
app.get(['/quick-update.zip', '/github-update.zip', '/qr-pro-update.zip'], (req: Request, res: Response) => {
  const filename = req.path.includes('qr-pro')
    ? 'qr-pro-update.zip'
    : req.path.includes('github')
    ? 'github-update.zip'
    : 'quick-update.zip';
  const filePath = path.resolve(__dirname, 'public', filename);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.sendFile(filePath);
  }
  return res.status(404).send('Update package not found');
});

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint for multimodal AI (text, images, documents, OCR, note actions)
app.post('/api/ai/notepad', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, imageParts, contextNote, actionType } = req.body;

    // Build multimodal contents
    const contents: any[] = [];

    // If there are uploaded files/images (base64)
    if (Array.isArray(imageParts) && imageParts.length > 0) {
      for (const img of imageParts) {
        if (img && img.mimeType && img.data) {
          contents.push({
            inlineData: {
              mimeType: img.mimeType,
              data: img.data, // base64 string without data:mime;base64, prefix
            },
          });
        }
      }
    }

    let userPromptText = prompt || '';
    if (contextNote) {
      userPromptText = `【当前笔记上下文 / Current Note Context】:\n${contextNote}\n\n【用户指令 / User Request】:\n${userPromptText}`;
    }
    contents.push({ text: userPromptText });

    const defaultSystem = `你是一个内置在 Nexus Notepad（超级智能多模态记事本）中的顶级 AI 助手，具备超越 Notion AI 的强大能力。
用户的痛点是 Notion AI 每年收费千余马币太贵，而在 Nexus Notepad 中，你为用户提供完全自主、强大的多模态智能笔记助手体验。

核心能力：
1. 多模态识别（OCR / 图表 / 手写 / 文档 / 截图）：
   - 能精准识别用户上传的任何图片（白板、纸质书本、手写笔记、收据账单、网页截图、架构图、思维导图）。
   - 将图片内容完整提取并整理为排版精美、层级清晰的 Markdown 笔记。
2. Notion 级别智能文本处理：
   - 总结提炼（Executive Summary & 核心要点）
   - 提取行动项（Action Items / 待办事项 To-Do Checklist）
   - 智能扩写与续写（深入发散思路）
   - 语言润色与错别字纠正（专业且自然的文笔）
   - 多语言互译（中文、英文、马来语 Bahasa Melayu、粤语等，特别擅长马来西亚中英马混杂语境）
   - 深度头脑风暴与创意建议
3. 回复规范：
   - 输出清晰规范的 Markdown 格式（支持一级/二级标题、粗体、有序/无序列表、待办方框 - [ ]、代码块、表格、引用块等）。
   - 直接给出高质量内容，减少不必要的客套寒暄，让用户可以直接一键复制或插入笔记中使用。`;

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let resultText = '';
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: { parts: contents },
          config: {
            systemInstruction: systemInstruction || defaultSystem,
          },
        });
        resultText = response.text || '';
        if (resultText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} request failed, attempting next model if available...`, err.message);
      }
    }

    if (!resultText && lastError) {
      throw lastError;
    }

    return res.json({ success: true, text: resultText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI 服务响应异常，请稍后重试',
    });
  }
});

// Intercept Feedfetcher-Google or explicit xml query on root path
app.use((req, _res, next) => {
  const ua = req.headers['user-agent'] || '';
  if (
    (req.path === '/' || req.path === '') &&
    (ua.includes('Feedfetcher-Google') || req.query.feed === 'xml' || req.query.format === 'xml')
  ) {
    req.url = '/google-merchant.xml';
  }
  next();
});

// Google Merchant Center Standard RSS/XML & TSV Feeds with support for typos (.xm) and root routes
app.get([
  '/api/feed/google-merchant.xml',
  '/api/feed/google-merchant.xm',
  '/google-merchant.xml',
  '/google-merchant.xm',
  '/feed.xml',
  '/feed',
  '/products.xml',
  '/products-feed.xml',
  '/google-feed.xml',
  '/api/feed.xml'
], (req: Request, res: Response) => {
  const customDomain = (req.query.domain as string) || (req.query.host as string) || '';
  const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
  
  // Default base domain for e-commerce products (matches verified GMC store on pavilionventure.com)
  let baseUrl = 'https://pavilionventure.com';
  if (customDomain) {
    baseUrl = customDomain.startsWith('http') ? customDomain.replace(/\/+$/, '') : `https://${customDomain.replace(/\/+$/, '')}`;
  } else if (req.headers.host && !req.headers.host.includes('run.app') && !req.headers.host.includes('localhost') && !req.headers.host.includes('127.0.0.1')) {
    baseUrl = `${protocol}://${req.headers.host}`;
  }

  const products = [
    // 1. Skincare & Beauty Collection (Real inventory with Barcodes)
    {
      id: "tts-platinum-rejuvenating-mask",
      title: "TTS 铂金焕颜面膜 5片盒装 (华熙生物透明质酸钠 + 40%玻色因)",
      description: "华熙生物玻尿酸配方，40%玻色因溶液加依克多因。中国发明专利抗初老紧致提亮面膜，改善干燥粗糙细纹，西马现货闪发。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_200440_7b7916e0.jpg`,
      price: "59.00 MYR",
      brand: "TTS",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Masks",
      gtin: "6977125109182"
    },
    {
      id: "yingsimilan-hydrating-firming-mask",
      title: "英思米兰 YINGSIMILAN 补水保湿紧致提亮面膜 (28mlx5片)",
      description: "神经酰胺多肽 + 积雪草 + 人参提取物。深层滋养锁水焕亮，改善干纹细纹，清爽好吸收。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_200457_f4de81f2.jpg`,
      price: "49.00 MYR",
      brand: "YINGSIMILAN",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Masks",
      gtin: "6923569595890"
    },
    {
      id: "yiscokin-collagen-throwing-essence",
      title: "YISCOKIN 胶原多肽次抛精华液 30支礼盒装 (2mlx30)",
      description: "专研次抛无菌锁鲜包装，胶原蛋白结合仿生多肽，深入肌底紧塑润颜，弹嫩嘭弹，淡纹抗皱莹润补水。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_202241_f2fe86a2.jpg`,
      price: "79.00 MYR",
      brand: "YISCOKIN",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer"
    },
    {
      id: "kuge-whitening-essence",
      title: "KUGE 酷格 溶斑液 美白淡斑精华液 (国妆特字持证)",
      description: "国家药监局特证认证(国妆特字20240653)。清润细腻，舒缓修护，美白祛斑，源头抑制黑色素，白皙透光。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_202127_bf08648e.jpg`,
      price: "49.00 MYR",
      brand: "KUGE",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer"
    },
    {
      id: "ouzicui-firming-soothing-mask",
      title: "OUZICUI 紧致舒缓精华面膜 (30mlx5片安瓶级)",
      description: "安瓶精纯高浓缩精华面膜，舒缓泛红干燥，深入肌底密集补水锁水，提亮柔滑抗粗糙。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_201450_521273e9.jpg`,
      price: "45.00 MYR",
      brand: "OUZICUI",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Masks"
    },
    {
      id: "yabi-sea-fennel-eye-serum",
      title: "YABI 海茴香多肽淡纹眼部精华液 滚珠紧致",
      description: "法国海茴香干细胞多肽精萃，滚珠抚纹紧致眼周，针对熬夜黑眼圈、眼袋与干纹细纹，质地轻盈水感不长脂肪粒。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_202015_9cc278e6.jpg`,
      price: "39.00 MYR",
      brand: "YABI",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Eye Care"
    },
    {
      id: "blue-copper-peptide-essence",
      title: "羊茵美 蓝铜胜肽抗皱精华液 5大发明专利奢护",
      description: "高浓度蓝铜胜肽加依克多因，多重发明专利成分，抗老抚纹，促进胶原蛋白赋活，充盈紧弹肌底。",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_202221_44b51dfb.jpg`,
      price: "69.00 MYR",
      brand: "羊茵美",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer"
    },

    // 2. Tech & Gadgets Collection
    {
      id: "phone-1",
      title: "Premium Smartphone 5G 12GB+256GB Flagship",
      description: "High performance 5G mobile device with 6.7 inch AMOLED 120Hz display and 108MP camera. Fast shipping across West Malaysia.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/891e7368-2d4a-11f1-9855-0242ac110002-O907lVlT-0FqOlH-vCCq7.jpg",
      price: "899.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phones"
    },
    {
      id: "beats-studio-pro-navy",
      title: "Beats Studio Pro Wireless Active Noise Cancelling Headphones - Navy",
      description: "Original Beats Studio Pro with Active Noise Cancelling, Spatial Audio, 40 hours battery. Clearance deal in Shah Alam, Malaysia.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88eb6227-2d4a-11f1-a717-0242ac110002-OJNyToAINv5ETB4VLrJ2U.jpg",
      price: "800.00 MYR",
      brand: "Beats",
      category: "Electronics > Audio > Audio Components > Headphones & Headsets"
    },
    {
      id: "case-1",
      title: "Military Armor Protective Phone Case Shockproof",
      description: "Military-grade drop protection with raised bezel shock absorption for iPhone, Samsung, and Android devices.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/89007708-2d4a-11f1-bcaa-0242ac110002-F2jqPq0saehI196nbHs3d.jpg",
      price: "29.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases"
    },
    {
      id: "cable-1",
      title: "100W PD Ultra Fast Braided USB-C Cable (2M)",
      description: "Heavy-duty 2-meter USB-C to USB-C cable supporting 100W Power Delivery and smart E-marker protection chip.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88f71865-2d4a-11f1-ad7a-0242ac110002-za2bo3uFua5Ub6Pal8c83.jpg",
      price: "19.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Electronics Accessories > Cables > USB Cables"
    },
    {
      id: "charger-1",
      title: "50W GaN Dual-Port USB-C Fast Wall Charger Adapter UK 3-Pin",
      description: "Original 50W Gallium Nitride dual USB-C high-speed wall power adapter for mobile phones and tablet devices. Certified safe electronic accessory in Malaysia.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88dd6846-2d4a-11f1-bc79-0242ac110002-0A8LvXhd6RAp9pDH0b1Uk.jpg",
      price: "39.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Electronics Accessories > Power > Power Adapters & Chargers"
    },
    {
      id: "earbuds-1",
      title: "True Wireless ANC Studio Earbuds with Charging Case",
      description: "Active hybrid noise cancellation, 12mm drivers, 36 hours total battery, IPX5 sweatproof.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88eb6227-2d4a-11f1-a717-0242ac110002-OJNyToAINv5ETB4VLrJ2U.jpg",
      price: "79.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Audio > Audio Components > Headphones & Headsets"
    },
    {
      id: "stand-1",
      title: "Foldable Aluminum Desktop Phone & Tablet Stand",
      description: "Aviation-grade aluminum dual-axis adjustable ergonomic desktop stand for video calls and streaming.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88d31191-2d4a-11f1-acc5-0242ac110002-v0lu6aDmm_HZsvA7ctJQh.jpg",
      price: "24.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Stands"
    },
    {
      id: "cap-promo-combo",
      title: "Trendy Caps & Headwear (2 for RM30 Bundle)",
      description: "Limited time promotion! Choose any 2 urban streetwear embroidered caps from 10 styles for RM30. Shah Alam self-pickup available.",
      link: `${baseUrl}/#caps`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/633c2184-422f-11f1-83fe-0242ac110002-1688_image_share_d1633ca657f8c79a617b7614b5d542c6.jpg",
      price: "30.00 MYR",
      brand: "Pavilion Venture",
      category: "Apparel & Accessories > Clothing Accessories > Hats"
    },
    {
      id: "screen-protector-promo",
      title: "9H Tempered Glass Screen Protector (2 for RM30 Combo)",
      description: "Wholesale & retail 9H diamond hardness tempered glass. Available in HD Clear, 28 degree Anti-peep privacy, and Matte Gaming.",
      link: `${baseUrl}/#screen-protectors`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88ffaeb6-2d4a-11f1-bc1a-0242ac110002-PZvjK-YCZHa6EczzMtc6_.jpg",
      price: "30.00 MYR",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Screen Protectors"
    }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>Pavilion Venture Official Store</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>Skincare, Phone Gadgets, Fast Chargers, Caps &amp; Screen Protectors in Shah Alam, Malaysia</description>\n`;

  for (const item of products) {
    xml += `    <item>\n`;
    xml += `      <g:id>${item.id}</g:id>\n`;
    xml += `      <g:title><![CDATA[${item.title}]]></g:title>\n`;
    xml += `      <g:description><![CDATA[${item.description}]]></g:description>\n`;
    xml += `      <g:link>${item.link}</g:link>\n`;
    xml += `      <g:image_link>${item.image_link}</g:image_link>\n`;
    xml += `      <g:condition>new</g:condition>\n`;
    xml += `      <g:availability>in_stock</g:availability>\n`;
    xml += `      <g:price>${item.price}</g:price>\n`;
    xml += `      <g:brand><![CDATA[${item.brand}]]></g:brand>\n`;
    xml += `      <g:google_product_category><![CDATA[${item.category}]]></g:google_product_category>\n`;
    if ((item as any).gtin) {
      xml += `      <g:gtin>${(item as any).gtin}</g:gtin>\n`;
      xml += `      <g:identifier_exists>yes</g:identifier_exists>\n`;
    } else {
      xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
    }
    xml += `      <g:shipping>\n`;
    xml += `        <g:country>MY</g:country>\n`;
    xml += `        <g:service>West Malaysia Courier</g:service>\n`;
    xml += `        <g:price>8.00 MYR</g:price>\n`;
    xml += `      </g:shipping>\n`;
    xml += `      <g:shipping>\n`;
    xml += `        <g:country>US</g:country>\n`;
    xml += `        <g:service>Standard International Air Express</g:service>\n`;
    xml += `        <g:price>28.00 MYR</g:price>\n`;
    xml += `      </g:shipping>\n`;
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  return res.send(xml);
});

// Dedicated US Dollars (USD) Feed for Google Merchant Center USA targeting
app.get([
  '/google-merchant-us.xml',
  '/api/feed/google-merchant-us.xml',
  '/feed-us.xml',
  '/feed-usd.xml'
], (req: Request, res: Response) => {
  const protocol = (req.headers['x-forwarded-proto'] as string) || 'https';
  let baseUrl = 'https://pavilionventure.com';
  if (req.headers.host && !req.headers.host.includes('run.app') && !req.headers.host.includes('localhost') && !req.headers.host.includes('127.0.0.1')) {
    baseUrl = `${protocol}://${req.headers.host}`;
  }

  // 1 USD approx 4.45 MYR for retail items
  const usdProducts = [
    {
      id: "pv-us-cap-promo-combo",
      title: "Trendy Caps & Headwear (2 for $6.99 USD Combo Deal)",
      description: "Limited promotion! Pick any 2 urban streetwear embroidered caps from 10 stylish colors. International air tracked delivery to the United States.",
      link: `${baseUrl}/#caps`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/633c2184-422f-11f1-83fe-0242ac110002-1688_image_share_d1633ca657f8c79a617b7614b5d542c6.jpg",
      price: "6.99 USD",
      brand: "Pavilion Venture",
      category: "Apparel & Accessories > Clothing Accessories > Hats"
    },
    {
      id: "pv-us-screen-protector-promo",
      title: "9H Tempered Glass Screen Protector (2 for $6.99 USD Combo)",
      description: "Premium 9H diamond hardness tempered glass. Available in HD Clear, 28 degree Anti-peep privacy, and Matte Gaming for iPhone and Samsung.",
      link: `${baseUrl}/#screen-protectors`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88ffaeb6-2d4a-11f1-bc1a-0242ac110002-PZvjK-YCZHa6EczzMtc6_.jpg",
      price: "6.99 USD",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Screen Protectors"
    },
    {
      id: "pv-us-case-military-1",
      title: "Military Armor Protective Phone Case Shockproof - Black",
      description: "Military-grade drop protection with raised bezel shock absorption for flagship smartphones. Fast international shipping to USA.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/89007708-2d4a-11f1-bcaa-0242ac110002-F2jqPq0saehI196nbHs3d.jpg",
      price: "6.80 USD",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Cases"
    },
    {
      id: "pv-us-cable-100w-2m",
      title: "100W PD Ultra Fast Braided USB-C Cable (2M)",
      description: "Heavy-duty 2-meter USB-C to USB-C charging cable supporting 100W Power Delivery and smart E-marker protection chip.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88f71865-2d4a-11f1-ad7a-0242ac110002-za2bo3uFua5Ub6Pal8c83.jpg",
      price: "4.50 USD",
      brand: "Pavilion Venture",
      category: "Electronics > Electronics Accessories > Cables > USB Cables"
    },
    {
      id: "pv-us-charger-50w-gan",
      title: "50W GaN Dual-Port USB-C High-Speed Fast Wall Charger Adapter",
      description: "Original 50W Gallium Nitride dual USB-C high-speed wall power adapter for phones and tablet devices. Global voltage 100-240V compatible.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88dd6846-2d4a-11f1-bc79-0242ac110002-0A8LvXhd6RAp9pDH0b1Uk.jpg",
      price: "8.99 USD",
      brand: "Pavilion Venture",
      category: "Electronics > Electronics Accessories > Power > Power Adapters & Chargers"
    },
    {
      id: "pv-us-stand-aluminum-1",
      title: "Foldable Aluminum Desktop Phone & Tablet Stand",
      description: "Aviation-grade aluminum dual-axis adjustable ergonomic desktop stand for phones and iPads.",
      link: `${baseUrl}/#shop`,
      image_link: "https://cdn.b12.io/client_media/pahMcnrl/88d31191-2d4a-11f1-acc5-0242ac110002-v0lu6aDmm_HZsvA7ctJQh.jpg",
      price: "5.50 USD",
      brand: "Pavilion Venture",
      category: "Electronics > Communications > Telephony > Mobile Phone Accessories > Mobile Phone Stands"
    },
    {
      id: "pv-us-blue-copper-peptide-essence",
      title: "Blue Copper Peptide Anti-Wrinkle Facial Firming Essence (50ml)",
      description: "High concentration blue copper peptide and ectoin luxury youth restoring face serum. Deep hydration and elasticity support.",
      link: `${baseUrl}/#shop`,
      image_link: `${baseUrl}/assets/aistudio/IMG_20261027_202221_44b51dfb.jpg`,
      price: "15.99 USD",
      brand: "Pavilion Venture",
      category: "Health & Beauty > Personal Care > Cosmetics > Skin Care > Lotion & Moisturizer"
    }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n`;
  xml += `  <channel>\n`;
  xml += `    <title>Pavilion Venture Official Store (US / USD)</title>\n`;
  xml += `    <link>${baseUrl}</link>\n`;
  xml += `    <description>Phone Gadgets, Fast Chargers, Caps &amp; Screen Protectors - United States &amp; International Delivery</description>\n`;

  for (const item of usdProducts) {
    xml += `    <item>\n`;
    xml += `      <g:id>${item.id}</g:id>\n`;
    xml += `      <g:title><![CDATA[${item.title}]]></g:title>\n`;
    xml += `      <g:description><![CDATA[${item.description}]]></g:description>\n`;
    xml += `      <g:link>${item.link}</g:link>\n`;
    xml += `      <g:image_link>${item.image_link}</g:image_link>\n`;
    xml += `      <g:condition>new</g:condition>\n`;
    xml += `      <g:availability>in_stock</g:availability>\n`;
    xml += `      <g:price>${item.price}</g:price>\n`;
    xml += `      <g:brand><![CDATA[${item.brand}]]></g:brand>\n`;
    xml += `      <g:google_product_category><![CDATA[${item.category}]]></g:google_product_category>\n`;
    xml += `      <g:identifier_exists>no</g:identifier_exists>\n`;
    xml += `      <g:shipping>\n`;
    xml += `        <g:country>US</g:country>\n`;
    xml += `        <g:service>USPS / International Air Standard Tracked</g:service>\n`;
    xml += `        <g:price>6.00 USD</g:price>\n`;
    xml += `      </g:shipping>\n`;
    xml += `    </item>\n`;
  }

  xml += `  </channel>\n`;
  xml += `</rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  return res.send(xml);
});

// Dedicated HTML Shipping & International Delivery Policy for Google Merchant Center Verification Crawlers
app.get(['/shipping-policy', '/delivery-policy', '/shipping'], (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping & Delivery Policy | Pavilion Venture</title>
  <meta name="description" content="Shipping policy, transit times, rates, and worldwide international delivery information for Pavilion Venture.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 850px; margin: 40px auto; padding: 0 20px; background: #fafafa; }
    .card { background: white; padding: 36px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    h1 { color: #0f172a; font-size: 26px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; }
    h2 { color: #1e293b; font-size: 18px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; color: #334155; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px; margin-bottom: 12px; }
    .highlight-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Worldwide &amp; Domestic Shipping Available</span>
    <h1>Pavilion Venture - Shipping &amp; Delivery Policy</h1>
    <p><strong>Website:</strong> https://pavilionventure.com | <strong>Operating Location:</strong> Shah Alam, Selangor, Malaysia</p>

    <h2>1. Shipping Rates &amp; Delivery Estimates</h2>
    <table>
      <thead>
        <tr>
          <th>Destination</th>
          <th>Courier Service</th>
          <th>Estimated Transit Time</th>
          <th>Shipping Fee</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>West Malaysia</strong></td>
          <td>J&amp;T Express / Pos Laju / Flash</td>
          <td>1 - 3 Business Days</td>
          <td>RM 8.00 (Free over RM 50.00)</td>
        </tr>
        <tr>
          <td><strong>East Malaysia (Sabah &amp; Sarawak)</strong></td>
          <td>Pos Laju / J&amp;T Express</td>
          <td>3 - 5 Business Days</td>
          <td>RM 15.00</td>
        </tr>
        <tr>
          <td><strong>United States (USA)</strong></td>
          <td>USPS / DHL International Air Express</td>
          <td>5 - 10 Business Days</td>
          <td>$6.00 USD (Approx. RM 28.00)</td>
        </tr>
        <tr>
          <td><strong>International (Global)</strong></td>
          <td>Tracked International Air Mail</td>
          <td>7 - 14 Business Days</td>
          <td>$8.00 USD (Approx. RM 35.00)</td>
        </tr>
      </tbody>
    </table>

    <div class="highlight-box">
      <strong>Order Processing &amp; Handling Time:</strong><br>
      All orders are handled, inspected, and packed within <strong>24 to 48 hours</strong> (Monday to Saturday). Orders placed on Sundays or public holidays are dispatched on the next business day.
    </div>

    <h2>2. Shipment Tracking</h2>
    <p>Once your order has been dispatched, you will receive an automated tracking number via email or WhatsApp. You can monitor the real-time parcel status directly via the courier tracking portal.</p>

    <h2>3. Customs, Duties &amp; Taxes</h2>
    <p>For international shipments (including the United States), orders are generally dispatched under standard consumer de minimis thresholds. Any customs duties, import taxes, or brokerage fees imposed by the destination country's customs authority are the responsibility of the recipient.</p>

    <h2>4. Self-Pickup Option (Malaysia)</h2>
    <p>Customers located in Selangor / Klang Valley can opt for free self-pickup at our Shah Alam warehouse by scheduling an appointment via WhatsApp at +60 16-678 7883.</p>

    <h2>5. Contact Us</h2>
    <p>For inquiries regarding shipment status or address modifications, contact our support team:</p>
    <ul>
      <li><strong>WhatsApp:</strong> <a href="https://wa.me/60166787883">+60 16-678 7883</a></li>
      <li><strong>Email:</strong> support@pavilionventure.com</li>
      <li><strong>Operating Hours:</strong> Monday - Saturday: 9:00 AM - 6:00 PM (GMT+8)</li>
    </ul>
  </div>
</body>
</html>`;
  res.header('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

// Dedicated HTML Refund & Support Policy for Google Merchant Center Verification Crawlers
app.get(['/refund-policy', '/return-policy', '/customer-support', '/support', '/help'], (_req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund & Return Policy | Pavilion Venture</title>
  <meta name="description" content="14-day refund and return policy for Pavilion Venture phone gadgets and accessories in Malaysia. Compliant with Consumer Protection Act 1999.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #fafafa; }
    .card { background: white; padding: 36px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    h1 { color: #0f172a; font-size: 26px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; }
    h2 { color: #1e293b; font-size: 18px; margin-top: 24px; }
    ul, ol { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 600; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
    .contact-box { background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin-top: 24px; border-radius: 0 8px 8px 0; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Malaysian Consumer Protection Act 1999 Compliant</span>
    <h1>Pavilion Venture - Refund & Return Policy</h1>
    <p><strong>Effective Date:</strong> 2026 | <strong>Store Name:</strong> Pavilion Venture | <strong>Website:</strong> https://pavilionventure.com</p>

    <h2>1. Return & Exchange Window (14 Days)</h2>
    <p>At Pavilion Venture, customer satisfaction is our top priority. We accept returns and exchanges within <strong>14 calendar days</strong> from the date of delivery for both defective and eligible non-defective items.</p>

    <h2>2. Eligibility for Returns & Exchanges</h2>
    <ul>
      <li><strong>Defective or Damaged Products:</strong> If an item arrives damaged, defective, or does not match specifications, we offer immediate 100% free exchange or full refund.</li>
      <li><strong>Non-Defective Products (Change of Mind):</strong> Must be in original, unused condition with all original packaging, seals, cables, and accessories intact.</li>
    </ul>

    <h2>3. Return Process (WhatsApp & Courier)</h2>
    <ol>
      <li>Contact our customer support team via WhatsApp at <strong>+60 16-678 7883</strong> or email <strong>support@pavilionventure.com</strong> with your order details and photos/videos of the item.</li>
      <li>Our team will verify the request and provide return dispatch instructions within 24 hours.</li>
      <li>Ship the package via any tracked courier or arrange self-dropoff at our Shah Alam location.</li>
      <li>Once received and inspected, replacements are dispatched immediately or refunds processed within <strong>3 to 5 business days</strong>.</li>
    </ol>

    <h2>4. Refund Method & Timelines</h2>
    <p>Refunds will be processed back to the original payment method (bank transfer, card, or e-wallet) within 3 to 5 business days following inspection.</p>

    <h2>5. Return Shipping Costs</h2>
    <ul>
      <li><strong>Defective/Wrong Items:</strong> Pavilion Venture covers all return shipping costs.</li>
      <li><strong>Customer Preference/Change of Mind:</strong> Customer is responsible for courier return shipping to Shah Alam, Malaysia.</li>
    </ul>

    <h2>6. Self-Pickup Option (Shah Alam)</h2>
    <p>Customers choosing self-pickup can drop off or exchange items directly at our Shah Alam warehouse upon WhatsApp appointment.</p>

    <div class="contact-box">
      <strong>Customer Support & Return Address:</strong><br>
      Pavilion Venture (Business Registration: Shah Alam, Selangor, Malaysia)<br>
      WhatsApp: <a href="https://wa.me/60166787883">+60 16-678 7883</a><br>
      Email: support@pavilionventure.com<br>
      Operating Hours: Monday - Saturday: 9:00 AM - 6:00 PM (GMT+8)
    </div>
  </div>
</body>
</html>`;
  res.header('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pavilion & Nexus server running on port ${PORT}`);
  });
}

startServer();
