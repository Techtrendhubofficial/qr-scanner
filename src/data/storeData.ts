export interface Product {
  id: string;
  name: string;
  category: 'skincare' | 'makeup-tools' | 'hair-styling' | 'drone-electronics' | 'clothes' | 'dresses' | 'pants' | 'watches' | 'security' | 'fashion' | 'accessories' | 'phones' | 'cases' | 'chargers' | 'earbuds' | 'caps' | 'screen-protectors';
  price: number; // numeric price in RM or base currency
  displayPrice?: string; // e.g. "RM30 (Promo: 2 for RM30)"
  originalPrice?: number;
  rating: number;
  reviews: number;
  image?: string;
  badge?: string;
  shortDescription: string;
  fullDescription: string;
  specs: Record<string, string>;
  whatsappLink?: string;
  externalUrl?: string;
  featured?: boolean;
  gtin?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  rating: number;
  text: string;
  product: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  content: string;
}

export interface CapStyle {
  id: number;
  name: string;
  colorName: string;
  colorClasses: string;
  bgGradient: string;
}

export interface ScreenProtectorType {
  id: number;
  name: string;
  feature: string;
  bgGradient: string;
}

export const BUSINESS_INFO = {
  name: "Pavilion Venture",
  brandName: "Pavilion Venture",
  slogan: "Phone Gadgets & Lifestyle Accessories • Wholesale & Retail in Malaysia",
  location: "Shah Alam, Selangor, Malaysia",
  domain: "pavilionventure.com",
  websiteUrl: "https://pavilionventure.com",
  whatsappNumber: "60166787883",
  whatsappFormatted: "+60 16-678 7883",
  email: "support@pavilionventure.com",
  operatingHours: "Monday - Saturday: 9:00 AM - 6:00 PM (GMT+8)",
  shippingCoverage: "Fast shipping throughout West Malaysia & East Malaysia. Self-pickup available at Shah Alam."
};

export const CAP_STYLES: CapStyle[] = [
  { id: 1, name: "Classic Navy Brooklyn", colorName: "Navy", colorClasses: "bg-blue-600", bgGradient: "from-blue-600 to-blue-800" },
  { id: 2, name: "Star Hip-hop", colorName: "Urban Red", colorClasses: "bg-red-600", bgGradient: "from-red-600 to-red-800" },
  { id: 3, name: "Classic UI Star", colorName: "Black Essential", colorClasses: "bg-neutral-800", bgGradient: "from-neutral-800 to-neutral-950" },
  { id: 4, name: "Classy Bucket", colorName: "Forest Green", colorClasses: "bg-emerald-600", bgGradient: "from-emerald-600 to-teal-800" },
  { id: 5, name: "Classic Logo", colorName: "Royal Purple", colorClasses: "bg-purple-600", bgGradient: "from-purple-600 to-indigo-800" },
  { id: 6, name: "Classic Disney", colorName: "Golden Yellow", colorClasses: "bg-amber-500", bgGradient: "from-amber-500 to-amber-700" },
  { id: 7, name: "Classic Frawds", colorName: "Blush Pink", colorClasses: "bg-pink-500", bgGradient: "from-pink-500 to-rose-700" },
  { id: 8, name: "Classic Brooklyn", colorName: "Teal Coastal", colorClasses: "bg-teal-600", bgGradient: "from-teal-600 to-cyan-800" },
  { id: 9, name: "Vintage Navy Logo", colorName: "Burnt Orange", colorClasses: "bg-orange-600", bgGradient: "from-orange-600 to-red-700" },
  { id: 10, name: "Classic Burny", colorName: "Deep Indigo", colorClasses: "bg-indigo-700", bgGradient: "from-indigo-700 to-blue-900" },
];

export const SCREEN_PROTECTORS: ScreenProtectorType[] = [
  { id: 1, name: "Ultra Clear HD 9H", feature: "99.9% High Definition Transparency", bgGradient: "from-sky-500 to-blue-600" },
  { id: 2, name: "Anti-Glare Matte Pro", feature: "Fingerprint Resistant & Sunproof", bgGradient: "from-red-500 to-rose-700" },
  { id: 3, name: "28° Privacy Shield", feature: "Anti-Peeping Side Blackout Guard", bgGradient: "from-zinc-800 to-neutral-950" },
  { id: 4, name: "Ultra Durable Armor Pro", feature: "Military-grade Edge Drop Impact Protection", bgGradient: "from-emerald-600 to-green-800" },
  { id: 5, name: "Curved 3D Edge Premium", feature: "Full Edge-to-Edge Seamless Fit", bgGradient: "from-purple-600 to-violet-800" },
  { id: 6, name: "Oleophobic Coating Master", feature: "Silky Smooth Gaming Surface", bgGradient: "from-amber-500 to-orange-600" },
  { id: 7, name: "Matte Finish Anti-Blue", feature: "Eye Care Blue Light Filter", bgGradient: "from-pink-500 to-rose-600" },
  { id: 8, name: "Full Screen Diamond Cover", feature: "Reinforced 10D Shatterproof Glass", bgGradient: "from-teal-600 to-cyan-800" },
  { id: 9, name: "Impact Shield Extreme", feature: "Flexible Explosion-Proof TPU Composite", bgGradient: "from-orange-600 to-amber-700" },
  { id: 10, name: "Premium Ultra Thin 0.15mm", feature: "Zero Touch Delay for Fast Gamers", bgGradient: "from-indigo-600 to-blue-800" },
];

export const PRODUCTS: Product[] = [
  {
    id: "pv-detector-camera-01",
    name: "Hotel Camera Detection Wireless Signal Detector",
    category: "drone-electronics",
    price: 135,
    displayPrice: "$30.07 USD (RM 135)",
    originalPrice: 199,
    rating: 5,
    reviews: 146,
    image: "/images/products/item1-detector.jpg",
    badge: "🔥 Best Seller",
    featured: true,
    shortDescription: "Anti-spy RF wireless camera and GPS tracking signal detector for hotel privacy",
    fullDescription: "High-precision handheld RF signal detector engineered to detect hidden pinhole wireless cameras, tracking locators, and wiretapping bugs. Ideal for travelers, business trips, hotel stays, and personal privacy protection. Features ultra-sensitive multi-band detection.",
    specs: {
      "Frequency Range": "1MHz - 6.5GHz",
      "Detection Range": "Up to 10 meters",
      "Battery Life": "Up to 25 hours continuous scan",
      "Weight": "Ultra lightweight 65g portable",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYK4kAB2-Y"
  },
  {
    id: "pv-yoga-vest-halter-02",
    name: "Women's Yoga Vest Halter Beautiful Back Tank-Top",
    category: "clothes",
    price: 88,
    displayPrice: "$19.56 USD (RM 88)",
    originalPrice: 139,
    rating: 4.9,
    reviews: 89,
    image: "/images/products/item2-yoga-vest.jpg",
    badge: "✨ Trending",
    featured: true,
    shortDescription: "Premium breathable halter yoga top with elegant crisscross back support",
    fullDescription: "Designed for freedom of movement and modern athletic style. Crafted with buttery-soft, four-way stretch fabric that wicks sweat instantly. Ergonomic halter neck and beautiful cross-back cut highlight body lines during yoga, gym workouts, or casual streetwear.",
    specs: {
      "Fabric": "80% Nylon, 20% Spandex (Breathable Stretch)",
      "Design": "Halter Neck with Cross Back Cut",
      "Care": "Machine washable, color-fade resistant",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYbwDpP28Y"
  },
  {
    id: "pv-drexlee-sunscreen-03",
    name: "Dr.exlee Outdoor Whitening Sunscreen Lotion SPF50 PA+++ (Thin & Light)",
    category: "skincare",
    price: 158,
    displayPrice: "$35.20 USD (RM 158)",
    originalPrice: 238,
    rating: 5,
    reviews: 168,
    image: "/images/products/item3-drexlee-sunscreen.jpg",
    badge: "☀️ High UV Defense",
    featured: true,
    shortDescription: "Medical-grade SPF50 PA+++ high-protection outdoor whitening sunscreen lotion with non-greasy breathable finish",
    fullDescription: "Dr.exlee Outdoor Whitening Sunscreen Lotion provides advanced broad-spectrum SPF50 PA+++ invisible UV shield protection. Formulated with potent skin brightening actives that prevent sunspots and photo-aging from the root. Ultra-thin, lightweight, non-sticky and fast absorbing, ideal for tropical climate, daily outdoor sports and makeup primer base.",
    specs: {
      "Brand": "Dr.exlee 艾斯黎",
      "SPF Rating": "SPF50 PA+++ Broad Spectrum UVA/UVB",
      "Key Benefits": "High UV Defense, Whitening & Brightening, Non-greasy",
      "Texture": "Ultra Thin & Light Breathable Milk Lotion",
      "Net Weight": "Premium Silver Luxury Gift Box Edition",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/product/drexlee-outdoor-whitening-sunscreen-spf50"
  },
  {
    id: "pv-dress-burgundy-slip-04",
    name: "European Style Burgundy Sexy Suspender Slip Skirt Dress",
    category: "dresses",
    price: 195,
    displayPrice: "$43.54 USD (RM 195)",
    originalPrice: 280,
    rating: 5,
    reviews: 64,
    image: "/images/products/item4-burgundy-dress.jpg",
    badge: "Luxury Edition",
    featured: true,
    shortDescription: "Versatile hot girl style burgundy sexy bodycon suspender slip dress",
    fullDescription: "Make a striking impression with this European & American style burgundy suspender slip dress. Tailored with premium silky-touch stretch fabric that hugs curves naturally. Features adjustable delicate straps and side hem slit for evening parties, date nights, and upscale occasions.",
    specs: {
      "Color": "Deep Wine Burgundy",
      "Fit": "Slim Bodycon with Adjustable Spaghetti Straps",
      "Occasion": "Party, Evening Dinner, Club, Cocktail",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYbwFfE1c8"
  },
  {
    id: "pv-watch-poedagar-05",
    name: "POEDAGAR Multifunction Dual Display Luminous Quartz Men's Watch",
    category: "watches",
    price: 129,
    displayPrice: "$29.90 USD (RM 129)",
    originalPrice: 220,
    rating: 4.9,
    reviews: 178,
    image: "/images/products/item5-poedagar-watch.jpg",
    badge: "Top Rated",
    featured: true,
    shortDescription: "Luxury stainless steel analog & digital dual display waterproof watch with night glow",
    fullDescription: "The POEDAGAR Dual-Display timepiece combines precision analog quartz movement with an illuminated digital sub-dial. Features high-hardness mineral crystal glass, luminous hands for night viewing, 30M life waterproof rating, stopwatch chronograph, and auto-calendar.",
    specs: {
      "Movement": "Japanese Quartz + Digital Dual Core",
      "Dial Diameter": "45mm Masculine Fit",
      "Strap": "Solid Stainless Steel with Double Butterfly Buckle",
      "Features": "Luminous, Stopwatch, Alarm, Date, 30M Waterproof",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/product/poedagar-dual-display-watch"
  },
  {
    id: "pv-top-korean-fleece-06",
    name: "Plus Velvet Thick Fashion All-Match Korean Loose Top Sweatshirt",
    category: "clothes",
    price: 31,
    displayPrice: "$6.99 USD (RM 31)",
    originalPrice: 69,
    rating: 4.8,
    reviews: 230,
    image: "/images/products/item6-korean-top.jpg",
    badge: "Super Promo",
    featured: true,
    shortDescription: "Warm winter fleece-lined thick Korean casual crewneck pullover top",
    fullDescription: "Super cozy and lightweight yet exceptionally warm. Lined with ultra-soft thermal micro-fleece to lock in body heat during chilly seasons. Casual Korean drop-shoulder silhouette pairs effortlessly with jeans, leggings, and skirts.",
    specs: {
      "Lining": "Thermal Plus Velvet Microfleece",
      "Collar": "Ribbed Crewneck",
      "Style": "Korean Oversized Streetwear",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYb+DqXAwv"
  },
  {
    id: "pv-drone-4k-pro-07",
    name: "3 Batteries Pro Drone 4K Selfie Camera Wifi FPV Foldable RC Quadcopter",
    category: "drone-electronics",
    price: 745,
    displayPrice: "$165.55 USD (RM 745)",
    originalPrice: 999,
    rating: 5,
    reviews: 142,
    image: "https://cf.cjdropshipping.com/38719179-6fbd-4822-8b8c-cf3aad912581.jpg",
    badge: "🛸 High Tech Flagship",
    featured: true,
    shortDescription: "Foldable 4K dual-camera aerial drone with 3 high-capacity batteries & optical flow hover",
    fullDescription: "Experience professional aerial cinematography. Equipped with 4K UHD dual cameras, optical flow positioning, 50x zoom, and real-time WiFi FPV transmission. Includes 3 modular batteries providing up to 60 minutes total flight time, obstacle avoidance, and intelligent one-key return.",
    specs: {
      "Camera": "4K Ultra HD Dual Camera with 90° Electronic Adjustment",
      "Batteries": "3 x Modular Lithium Rechargeable Batteries Included",
      "Flight Time": "Approx. 20-25 mins per battery (Up to 60 mins total)",
      "Transmission": "High-frequency 2.4GHz WiFi Real-Time FPV Phone Sync",
      "Features": "One-key Takeoff/Landing, Optical Flow Hover, Gesture Photo",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYijCx23gC"
  },
  {
    id: "pv-hair-straightener-08",
    name: "2-in-1 Ceramic Coating Cordless Portable Hair Straightener & Curler",
    category: "hair-styling",
    price: 128,
    displayPrice: "$28.50 USD (RM 128)",
    originalPrice: 189,
    rating: 4.9,
    reviews: 97,
    image: "/images/products/item8-hair-straightener.jpg",
    badge: "💇 Hot Styling Tool",
    featured: true,
    shortDescription: "Rechargeable travel-friendly ceramic tourmaline 2-in-1 flat iron straightener and curler",
    fullDescription: "Salon-grade hair styling anywhere you go. Features ceramic tourmaline floating heating plates that release millions of negative ions to eliminate frizz, lock in moisture, and prevent heat damage. Cordless rechargeable design heats up in 30 seconds with 3 smart temperature settings.",
    specs: {
      "Plate Material": "Nano Ceramic Tourmaline Floating Plates",
      "Temperature Settings": "3 Levels (160°C / 180°C / 200°C) with Smart Heat Lock",
      "Battery": "USB-C Fast Charging Built-in Lithium Battery",
      "Heating Time": "30 Seconds Rapid PTC Heating",
      "Safety": "Auto Shut-off after 20 minutes idle",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/VoU72Cf1"
  },
  {
    id: "pv-dress-french-asym-09",
    name: "French-Style Asymmetrical One-Shoulder Vacation Casual Dress",
    category: "dresses",
    price: 74,
    displayPrice: "$16.49 USD (RM 74)",
    originalPrice: 129,
    rating: 4.9,
    reviews: 81,
    image: "/images/products/item9-asym-dress.jpg",
    badge: "New Arrival",
    featured: true,
    shortDescription: "Chic French-inspired irregular one-shoulder solid color A-line dress",
    fullDescription: "Infuse effortless Parisian chic into your wardrobe. Asymmetrical one-shoulder neckline with a delicate flowing A-line drape. Ideal for beach vacations, weekend brunches, and rooftop parties.",
    specs: {
      "Neckline": "Asymmetrical Single Shoulder",
      "Drape": "Fluid A-Line Flattering Cut",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/2GYbw7C7QTM"
  },
  {
    id: "pv-guasha-cupping-10",
    name: "Electric Negative Pressure Guasha & Cupping Meridian Beauty Instrument",
    category: "skincare",
    price: 120,
    displayPrice: "$26.80 USD (RM 120)",
    originalPrice: 179,
    rating: 5,
    reviews: 188,
    image: "/images/products/item10-guasha-cupping.jpg",
    badge: "✨ Spa Wellness",
    featured: true,
    shortDescription: "Smart negative pressure electric scraping, cupping, and thermal meridian relaxation massager",
    fullDescription: "Experience professional TCM meridian therapy at home. Combines adjustable dynamic negative pressure suction, red light therapy, and constant temperature hot compress. Relieves deep muscle tension, promotes lymphatic detox, and firms body contours effortlessly.",
    specs: {
      "Suction Gear": "6 / 12 Adjustable Negative Pressure Suction Levels",
      "Thermal Heating": "Constant Temperature Red Light Warm Compress (38°C - 48°C)",
      "Battery": "USB Rechargeable Wireless High-Capacity Battery",
      "Display": "Digital Visual LED Control Panel",
      "Application": "Back, Shoulders, Legs, Arms, Neck Meridian Care",
      "Shipping": "Free Worldwide Tracked Delivery"
    },
    externalUrl: "https://shop.pavilionventure.com/s/iOBFbykH"
  },
  {
    id: "phone-1",
    name: "Premium Smartphone 5G",
    category: "phones",
    price: 899,
    displayPrice: "RM 899",
    originalPrice: 1199,
    rating: 5,
    reviews: 128,
    image: "https://cdn.b12.io/client_media/pahMcnrl/891e7368-2d4a-11f1-9855-0242ac110002-O907lVlT-0FqOlH-vCCq7.jpg",
    badge: "Hot Seller",
    featured: true,
    shortDescription: "High performance mobile device with 120Hz AMOLED & 108MP camera",
    fullDescription: "The Premium Smartphone features cutting-edge technology with a 6.7\" AMOLED display, 120Hz refresh rate, and the latest generation high-speed processor. Ideal for mobile gaming, professional mobile photography, and day-to-day multitasking. Official warranty included.",
    specs: {
      "display": "6.7\" AMOLED, 120Hz Refresh Rate",
      "processor": "Snapdragon Flagship Generation",
      "ram": "12GB High-speed LPDDR5",
      "storage": "256GB UFS 3.1",
      "camera": "108MP Main + 50MP Ultra Wide + 16MP Selfie",
      "battery": "4500mAh with 65W Fast Charge"
    }
  },
  {
    id: "beats-studio-pro-navy",
    name: "Beats Studio Pro Wireless ANC (Navy Blue)",
    category: "earbuds",
    price: 800,
    displayPrice: "RM 800",
    originalPrice: 1449,
    rating: 5,
    reviews: 42,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88eb6227-2d4a-11f1-a717-0242ac110002-OJNyToAINv5ETB4VLrJ2U.jpg",
    badge: "Limited Stock: 2 Left",
    featured: true,
    shortDescription: "Original Beats Studio Pro with Active Noise Cancelling & Spatial Audio",
    fullDescription: "Special clearance deal! Retail Price RM1,449, now RM800 (Save 45%). Features custom acoustic platform, Personalized Spatial Audio with dynamic head tracking, Active Noise Cancelling & Transparency mode, up to 40 hours battery life. Ready for immediate pickup in Shah Alam or fast shipping across West Malaysia.",
    specs: {
      "brand": "Beats by Dr. Dre",
      "model": "Studio Pro",
      "color": "Navy Blue",
      "battery": "Up to 40 hours (24h with ANC)",
      "connectivity": "Bluetooth 5.3 + USB-C lossless audio + 3.5mm",
      "stockLocation": "Shah Alam Warehouse (Only 2 Units Left)"
    }
  },
  {
    id: "case-1",
    name: "Military Armor Protective Phone Case",
    category: "cases",
    price: 29,
    displayPrice: "RM 29",
    originalPrice: 49,
    rating: 4.8,
    reviews: 95,
    image: "https://cdn.b12.io/client_media/pahMcnrl/89007708-2d4a-11f1-bcaa-0242ac110002-F2jqPq0saehI196nbHs3d.jpg",
    badge: "Bestseller",
    featured: true,
    shortDescription: "Military-grade drop protection with raised bezel shock absorption",
    fullDescription: "This protective case combines military-grade durability with an ultra-sleek, ergonomic profile. Features dual-layer TPU shock absorption technology, honeycomb interior heat dissipation, and 1.5mm raised bezels safeguarding your screen and camera lenses.",
    specs: {
      "material": "German Bayer TPU + Polycarbonate Backing",
      "colors": "Matte Black, Navy Blue, Crimson Red",
      "dropRating": "Passed 10-foot military drop test (MIL-STD-810G)",
      "compatibility": "iPhone 13-16 series, Samsung S22-S25, Xiaomi"
    }
  },
  {
    id: "cable-1",
    name: "100W PD Ultra Fast Braided USB-C Cable (2M)",
    category: "chargers",
    price: 19,
    displayPrice: "RM 19",
    originalPrice: 35,
    rating: 5,
    reviews: 234,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88f71865-2d4a-11f1-ad7a-0242ac110002-za2bo3uFua5Ub6Pal8c83.jpg",
    badge: "Best Value",
    featured: true,
    shortDescription: "100W Power Delivery with E-marker chip and military nylon braid",
    fullDescription: "Heavy-duty 2-meter USB-C to USB-C cable supporting up to 100W Power Delivery and 480Mbps high-speed data transfer. Built-in smart E-Marker smart chip balances power to protect phone batteries against overheating and short-circuits.",
    specs: {
      "length": "2 Meters (6.6 ft)",
      "maxPower": "100W (20V/5A) Power Delivery 3.0",
      "material": "Double-braided ballistic nylon & zinc alloy connectors",
      "certifications": "CE, FCC, RoHS certified safe"
    }
  },
  {
    id: "charger-1",
    name: "50W GaN Dual-Port Super Fast Charger",
    category: "chargers",
    price: 39,
    displayPrice: "RM 39",
    originalPrice: 69,
    rating: 5,
    reviews: 87,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88dd6846-2d4a-11f1-bc79-0242ac110002-0A8LvXhd6RAp9pDH0b1Uk.jpg",
    badge: "GaN Fast Tech",
    featured: true,
    shortDescription: "Dual USB-C 50W Gallium Nitride ultra-compact fast adapter",
    fullDescription: "Super-fast 50W GaN III charger that juices a phone to 80% in under 28 minutes. Features dual USB-C ports to charge your phone and smartwatch/tablet at the exact same time without slowing down.",
    specs: {
      "powerOutput": "50W Max GaN III Technology",
      "ports": "2x USB-C Power Delivery",
      "plugType": "UK 3-Pin (Standard Malaysia Plug)",
      "protection": "Over-voltage, over-current, short-circuit, temperature control"
    }
  },
  {
    id: "earbuds-1",
    name: "True Wireless ANC Studio Earbuds",
    category: "earbuds",
    price: 79,
    displayPrice: "RM 79",
    originalPrice: 129,
    rating: 5,
    reviews: 156,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88eb6227-2d4a-11f1-a717-0242ac110002-OJNyToAINv5ETB4VLrJ2U.jpg",
    badge: "Crystal Sound",
    featured: true,
    shortDescription: "Active Noise Cancellation, 12mm drivers, 36h total battery",
    fullDescription: "Experience immersive bass and pristine highs with true active hybrid noise cancelling. Up to 10 hours of continuous playback per charge, extended to 36 hours with the wireless charging case. IPX5 sweat and rain water resistance.",
    specs: {
      "batteryLife": "10h on earbuds + 26h in case",
      "noiseCancellation": "Hybrid Active ANC (-35dB)",
      "drivers": "12mm Titanium Diaphragm",
      "waterResistance": "IPX5 Sweatproof for sports & gym"
    }
  },
  {
    id: "stand-1",
    name: "Foldable Aluminum Desktop Phone & Tablet Stand",
    category: "accessories",
    price: 24,
    displayPrice: "RM 24",
    originalPrice: 42,
    rating: 4.9,
    reviews: 62,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88d31191-2d4a-11f1-acc5-0242ac110002-v0lu6aDmm_HZsvA7ctJQh.jpg",
    badge: "Ergonomic",
    featured: false,
    shortDescription: "Aviation-grade aluminum dual-axis adjustable ergonomic stand",
    fullDescription: "Premium CNC aluminum stand with dual damping hinges allowing infinite angle adjustment. Features non-slip silicone pads protecting your device from scratches, and reserve cable cutout for comfortable charging during calls.",
    specs: {
      "material": "Aviation-grade Sandblasted Aluminum",
      "adjustability": "Dual-axis 270° tilt + foldable pocket size",
      "maxLoad": "Supports up to 1.2kg (iPad & Pro phones)",
      "color": "Space Gray / Silver"
    }
  },
  {
    id: "cap-promo-combo",
    name: "Trendy Caps & Headwear (2 for RM30 Promo)",
    category: "caps",
    price: 30,
    displayPrice: "2 for RM30",
    originalPrice: 60,
    rating: 5,
    reviews: 280,
    image: "https://cdn.b12.io/client_media/pahMcnrl/633c2184-422f-11f1-83fe-0242ac110002-1688_image_share_d1633ca657f8c79a617b7614b5d542c6.jpg",
    badge: "🔥 2 for RM30 Combo",
    featured: true,
    shortDescription: "100+ Urban styles • 10 top designs • Shah Alam self-pickup or fast delivery",
    fullDescription: "Limited time Malaysia promotion! Choose any 2 caps from 10 popular designs for only RM30. High quality cotton twill, 3D embroidered lettering, adjustable brass buckle strap. Suitable for streetwear, outdoor sports, and casual fashion.",
    specs: {
      "promotion": "RM30 for 2 Caps (Original RM30 each)",
      "stylesAvailable": "10 Distinct Designs (Brooklyn, Star Hip-Hop, UI Star, Bucket, etc.)",
      "material": "100% Breathable Washed Cotton Twill",
      "fulfillment": "Self-pickup in Shah Alam or fast shipping across West Malaysia"
    }
  },
  {
    id: "screen-protector-promo",
    name: "Tempered Glass Screen Protector (2 for RM30)",
    category: "screen-protectors",
    price: 30,
    displayPrice: "2 for RM30",
    originalPrice: 60,
    rating: 5,
    reviews: 310,
    image: "https://cdn.b12.io/client_media/pahMcnrl/88ffaeb6-2d4a-11f1-bc1a-0242ac110002-PZvjK-YCZHa6EczzMtc6_.jpg",
    badge: "🛡️ Wholesale Friendly",
    featured: true,
    shortDescription: "9H Diamond hardness • Anti-peep / HD Clear / Matte • 2 for RM30",
    fullDescription: "Wholesaler-friendly pricing from Shah Alam! Choose 2 tempered glass protectors (Clear HD, Anti-Peep Privacy, Matte Gaming, etc.) for only RM30. Includes installation alignment kits and wet wipes. Bulk reseller rates available.",
    specs: {
      "promotion": "2 for RM30 (Wholesale bulk MOQ available)",
      "options": "HD Clear, 28° Anti-Peeping Privacy, Matte Anti-Glare, Blue Light Cut",
      "thickness": "0.26mm with 2.5D arc edges",
      "package": "Each protector includes cleaning wipes and dust sticker"
    }
  },
  {
    id: "tts-platinum-rejuvenating-mask",
    name: "TTS 铂金焕颜面膜 (华熙生物透明质酸钠 + 40%玻色因)",
    category: "skincare",
    price: 59,
    displayPrice: "RM 59 (5片/盒)",
    originalPrice: 99,
    rating: 5,
    reviews: 142,
    image: "/assets/aistudio/IMG_20261027_200440_7b7916e0.jpg",
    badge: "⭐ 华熙生物+玻色因",
    featured: true,
    gtin: "6977125109182",
    shortDescription: "华熙生物玻尿酸 + 40%玻色因溶液，中国发明专利抗初老焕颜",
    fullDescription: "甄选多种植物萃取精华，搭配40%玻色因溶液（羟丙基四氢吡喃三醇）、华熙生物透明质酸钠、水解胶原及依克多因。舒缓紧致，改善干燥粗糙，细致毛孔，赋予肌肤丰盈弹润光泽。内含多重发明专利配方，每盒5片大容量精粹。",
    specs: {
      "规格容量": "25ml x 5片/盒",
      "核心成分": "40% 玻色因溶液 + 华熙生物透明质酸钠 + 依克多因",
      "专利编号": "ZL 2021 1 1296847.5 / ZL 2017 1 0962362.2",
      "条形码 / GTIN": "6977125109182",
      "备案编号": "粤G妆网备字2025104591",
      "发货仓储": "西马现货闪发 / 莎阿南 (Shah Alam) 支持自取"
    }
  },
  {
    id: "yingsimilan-hydrating-firming-mask",
    name: "英思米兰 YINGSIMILAN 补水保湿紧致提亮面膜",
    category: "skincare",
    price: 49,
    displayPrice: "RM 49 (5片/盒)",
    originalPrice: 89,
    rating: 4.9,
    reviews: 118,
    image: "/assets/aistudio/IMG_20261027_200457_f4de81f2.jpg",
    badge: "深层补水·提亮",
    featured: true,
    gtin: "6923569595890",
    shortDescription: "神经酰胺多肽 + 积雪草 + 人参提取物，深层滋养锁水焕亮",
    fullDescription: "紧致焕肤补水配方，实现深层呵护与调理肌底状态。令肌肤清爽滋润、持久保湿，改善干纹细纹。富含神经酰胺NP/AS/AP、积雪草提取物与棕榈酰多肽抗皱因子，28ml大容量精华液贴肤即透。",
    specs: {
      "规格容量": "28ml x 5片/盒",
      "主要成分": "神经酰胺多肽组 + 积雪草 + 人参提取物 + 麦冬提取物",
      "核心功效": "深层补水、紧致淡纹、提亮焕颜、舒缓修护",
      "条形码 / GTIN": "6923569595890",
      "备案编号": "粤G妆网备字2025269634"
    }
  },
  {
    id: "yiscokin-collagen-throwing-essence",
    name: "YISCOKIN 胶原多肽次抛精华液 (30支礼盒装)",
    category: "skincare",
    price: 79,
    displayPrice: "RM 79 (30支/盒)",
    originalPrice: 139,
    rating: 5,
    reviews: 215,
    image: "/assets/aistudio/IMG_20261027_202241_f2fe86a2.jpg",
    badge: "🔥 紧塑润颜·次抛锁鲜",
    featured: true,
    shortDescription: "次抛独立无菌保鲜，高活性胶原多肽，淡纹抗皱莹润补水",
    fullDescription: "专研次抛无菌密封包装，一支一次锁鲜活性。胶原蛋白结合仿生多肽，深入肌底层层撑起松弛轮廓，淡化法令纹与干纹，令面部充盈嘭弹有弹性。",
    specs: {
      "规格包装": "2ml x 30支 (整盒大容量装)",
      "核心成分": "胶原多肽复合精粹 + 仿生玻尿酸",
      "包装形式": "次抛便携式独立安瓶（防二次污染）",
      "功效定位": "紧塑润颜、弹嫩嘭弹、淡纹抗皱、莹润补水"
    }
  },
  {
    id: "kuge-whitening-essence",
    name: "KUGE 酷格 溶斑液 美白淡斑精华液",
    category: "skincare",
    price: 49,
    displayPrice: "RM 49",
    originalPrice: 89,
    rating: 5,
    reviews: 176,
    image: "/assets/aistudio/IMG_20261027_202127_bf08648e.jpg",
    badge: "⭐ 国妆特字 20240653",
    featured: true,
    shortDescription: "持证美白淡斑，质地清润细腻，源头抑制黑色素，白皙透光",
    fullDescription: "国家药监局美白特证认证（国妆特字 20240653）。质地清润细腻，舒缓修护，美白祛斑，缓解肌肤粗糙，锁住肌肤水分，紧致抗皱，提亮肤色，令肌肤细腻白皙、透现光泽美肌。",
    specs: {
      "特证备案": "国妆特字 20240653 (持证美白保证)",
      "核心功效": "清润细腻、舒缓修护、美白祛斑、紧致抗皱",
      "使用设计": "滚珠旋盖精准涂抹，针对眼周及斑点暗沉",
      "适用范围": "面部斑点、晒斑、暗黄不均肤质"
    }
  },
  {
    id: "ouzicui-firming-soothing-mask",
    name: "OUZICUI 紧致舒缓精华面膜 (Firming & Soothing)",
    category: "skincare",
    price: 45,
    displayPrice: "RM 45 (5片/盒)",
    originalPrice: 79,
    rating: 4.8,
    reviews: 94,
    image: "/assets/aistudio/IMG_20261027_201450_521273e9.jpg",
    badge: "高浓缩安瓶",
    featured: false,
    shortDescription: "改善皮肤粗糙，舒缓肌底修护，密集水润紧致",
    fullDescription: "安瓶精纯配方，帮助舒缓泛红与干燥，深入肌底密集补水锁水。提升肌肤光泽感与紧实度，使肌肤光滑细腻、焕发年轻透亮光彩。",
    specs: {
      "容量规格": "30ml x 5片/盒",
      "主要功效": "改善粗糙、舒缓泛红、安瓶补水、紧致柔滑",
      "使用建议": "洁面后敷15-20分钟，适合熬夜修护"
    }
  },
  {
    id: "yabi-sea-fennel-eye-serum",
    name: "YABI 海茴香多肽淡纹眼部精华液",
    category: "skincare",
    price: 39,
    displayPrice: "RM 39",
    originalPrice: 69,
    rating: 4.9,
    reviews: 87,
    image: "/assets/aistudio/IMG_20261027_202015_9cc278e6.jpg",
    badge: "淡化细纹·眼周紧致",
    featured: false,
    shortDescription: "珍贵海茴香提取物 + 紧致多肽，滚珠抚纹淡化眼袋黑眼圈",
    fullDescription: "海茴香多肽活性精萃，质地清爽好吸收不长脂肪粒。针对熬夜眼袋、眼周干纹细纹、黑眼圈具有显著紧致提亮效果。",
    specs: {
      "产品品类": "眼部紧致多肽精华液",
      "核心成分": "海茴香精粹 + 抚纹多肽复合因子",
      "使用感受": "清爽水感，快速吸收，紧致眼周"
    }
  },
  {
    id: "blue-copper-peptide-essence",
    name: "羊茵美 蓝铜胜肽抗皱精华液",
    category: "skincare",
    price: 69,
    displayPrice: "RM 69",
    originalPrice: 119,
    rating: 5,
    reviews: 133,
    image: "/assets/aistudio/IMG_20261027_202221_44b51dfb.jpg",
    badge: "5大发明专利",
    featured: true,
    shortDescription: "高浓度蓝铜胜肽 + 依克多因，奢华修护赋活胶原抗老",
    fullDescription: "高端蓝铜胜肽抗衰配方，涵盖5大发明专利成分。具有极高胶原合成促进力，修护受损屏障，舒缓敏感泛红，平抚岁月痕迹，令面部紧实饱满。",
    specs: {
      "核心成分": "蓝铜胜肽 (Copper Tripeptide-1) + 依克多因",
      "核心专利": "含5项国家发明专利配方",
      "主要功效": "抗老抚纹、屏障强韧修护、细腻毛孔、充盈紧弹"
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Sarah Johnson",
    title: "Professional Photographer",
    rating: 5,
    text: "The smartphone from Tech Trend Hub exceeded my expectations! The camera quality is outstanding, and the processing power handles my heavy workload seamlessly. Highly recommended!",
    product: "Premium Smartphone 5G",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
  },
  {
    id: "testimonial-2",
    name: "Michael Chen",
    title: "Business Executive (KL)",
    rating: 5,
    text: "I've purchased multiple accessories from Tech Trend Hub, and the quality is consistently excellent. The Beats Studio Pro deal was incredible. Self-pickup at Shah Alam was super fast and convenient!",
    product: "Beats Studio Pro & Earbuds",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Michael"
  },
  {
    id: "testimonial-3",
    name: "Emma Williams",
    title: "Student (Shah Alam)",
    rating: 5,
    text: "The protective case saved my phone from a terrible drop on concrete. It's durable, stylish, and affordable. Also bought the 2 for RM30 caps—super worth it! Recommended to all my campus friends.",
    product: "Military Armor Case & Caps",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma"
  },
  {
    id: "testimonial-4",
    name: "David Rodriguez",
    title: "Content Creator",
    rating: 5,
    text: "The 100W fast cable and 50W GaN charger are game-changers for my mobile setup. Charges my phone to 80% in under 30 minutes, and the metal connectors feel solid.",
    product: "50W GaN Charger & 100W Cable",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=David"
  },
  {
    id: "testimonial-5",
    name: "Jessica Lee",
    title: "Fitness Enthusiast",
    rating: 5,
    text: "The wireless earbuds stay completely locked in my ears during HIIT workouts. Active noise cancellation blocks the gym gym music, and sound is punchy and crisp!",
    product: "Wireless ANC Earbuds",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jessica"
  },
  {
    id: "testimonial-6",
    name: "Robert Martinez",
    title: "Tech Enthusiast",
    rating: 5,
    text: "Great selection of quality products at wholesale prices in Malaysia. Fast response on WhatsApp when I asked questions about cap sizing and bulk orders. Will order again!",
    product: "Trendy Caps & Screen Protectors",
    image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Robert"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "buying-guide-2026",
    title: "Complete Phone Buying Guide 2026",
    author: "Tech Trend Experts",
    date: "2026-03-15",
    category: "Buying Guides",
    excerpt: "Learn how to choose the perfect smartphone based on your needs and budget. Our comprehensive guide covers AMOLED screens, cameras, and battery benchmarks.",
    image: "https://cdn.b12.io/client_media/pahMcnrl/891e7368-2d4a-11f1-9855-0242ac110002-O907lVlT-0FqOlH-vCCq7.jpg",
    content: "Choosing the right smartphone can be overwhelming with so many options available. In 2026, keep these primary benchmarks in mind:\n\n1. Display Quality: Prioritize 120Hz refresh rate AMOLED with peak 1000+ nits brightness for crystal outdoor visibility in sunny Malaysia.\n2. Camera Setup: Look for optical image stabilization (OIS) rather than raw megapixel counts. Large sensors capture superior low-light photos.\n3. Fast Charging & Battery: Choose minimum 4500mAh with 50W+ fast charging capabilities so you never stay tied to a power outlet for more than 30 minutes.\n4. RAM & Storage: 8GB RAM and 256GB storage is the optimal sweet spot for gaming and video editing apps.\n\nBrowse our shop to test and purchase the latest devices with local Shah Alam warranty support!"
  },
  {
    id: "wireless-earbuds-trends",
    title: "The Future of Wireless Audio: 2026 Trends & ANC",
    author: "Audio Specialist",
    date: "2026-03-10",
    category: "Tech Trends",
    excerpt: "Discover the latest innovations in spatial audio, hybrid noise cancellation, and all-day battery life in modern wireless earbuds.",
    image: "https://cdn.b12.io/client_media/pahMcnrl/88eb6227-2d4a-11f1-a717-0242ac110002-OJNyToAINv5ETB4VLrJ2U.jpg",
    content: "Wireless audio has made massive leaps forward. Spatial audio with dynamic head tracking brings cinema-grade sound right to your commute. Modern ANC algorithms utilize multi-mic arrays to cancel rumbling city traffic while letting important announcements through in Transparency mode. Check our Beats Studio Pro Navy special offer for one of the greatest high-fidelity experiences at nearly half the retail price!"
  },
  {
    id: "protect-your-phone",
    title: "How to Properly Protect Your Smartphone in Daily Life",
    author: "Protection Specialist",
    date: "2026-03-05",
    category: "Product Guides",
    excerpt: "A comprehensive guide on selecting military-grade cases and 9H tempered glass to safeguard your phone against drops and scratches.",
    image: "https://cdn.b12.io/client_media/pahMcnrl/89007708-2d4a-11f1-bcaa-0242ac110002-F2jqPq0saehI196nbHs3d.jpg",
    content: "A premium phone is an expensive investment. Repairing an OLED screen often costs more than RM600! Pairing a dual-layer TPU shockproof case with 9H hardness tempered glass absorbs 90% of drop energy before it reaches the phone glass. Our 2 for RM30 screen protector bundle gives you a primary protector and a backup spare for total peace of mind."
  },
  {
    id: "fast-charging-explained",
    title: "Understanding Fast Charging & GaN Technology",
    author: "Hardware Engineer",
    date: "2026-02-28",
    category: "Tech Trends",
    excerpt: "Learn what GaN (Gallium Nitride) means, wattage calculations, and why certified cables protect battery longevity.",
    image: "https://cdn.b12.io/client_media/pahMcnrl/88dd6846-2d4a-11f1-bc79-0242ac110002-0A8LvXhd6RAp9pDH0b1Uk.jpg",
    content: "GaN chargers replace traditional silicon with Gallium Nitride semiconductors, generating significantly less heat in a body half the size. Combined with smart E-Marker cables, the charger negotiates voltage step-by-step with your phone, preventing overvoltage and prolonging battery health over years of daily usage."
  }
];

export const FAQS = [
  {
    q: "How long does shipping take within Malaysia?",
    a: "Orders within West Malaysia typically arrive in 1 to 2 business days. For East Malaysia (Sabah & Sarawak), delivery takes 3 to 5 business days. All shipments include live tracking numbers."
  },
  {
    q: "Can I do self-pickup in Shah Alam?",
    a: "Yes! Self-pickup is warmly welcomed at our Shah Alam location. Place your order online or message us on WhatsApp, and we'll have your items packaged and ready for immediate collection."
  },
  {
    q: "How does the '2 for RM30' promo for Caps and Screen Protectors work?",
    a: "You can mix and match any 2 caps from our 10 styles, or choose any 2 screen protector types (Clear, Privacy, Matte) for just RM30 total! Just add 2 to your cart or select your styles in our interactive configurator."
  },
  {
    q: "Do you offer wholesale bulk prices for resellers?",
    a: "Yes! We specialize in wholesale distribution for phone shops and night market resellers across Malaysia. Contact us directly on WhatsApp at +60 16-678 7883 for bulk carton pricing and catalog."
  },
  {
    q: "What is your return & refund policy?",
    a: "We offer a 14-day replacement or refund guarantee in compliance with the Malaysian Consumer Protection Act 1999. If an item is defective or damaged in transit, message us on WhatsApp with photos for instant replacement."
  }
];

export function buildWhatsAppOrderUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`;
}
