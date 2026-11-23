import React, { useState } from 'react';
import { Product, PRODUCTS, TESTIMONIALS, BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { StorePage } from '../../types';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  Send, 
  Sparkles, 
  Flame, 
  Check, 
  CheckCircle2, 
  ChevronRight,
  Eye
} from 'lucide-react';

interface StoreHomeProps {
  onNavigate: (page: StorePage) => void;
  onSelectCategory: (cat: string) => void;
  onAddToCart: (p: Product) => void;
  onViewProduct: (p: Product) => void;
}

export const StoreHome: React.FC<StoreHomeProps> = ({
  onNavigate,
  onSelectCategory,
  onAddToCart,
  onViewProduct,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedProductId(p.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 3000);
      setNewsletterEmail('');
    }
  };

  const trendingProducts = PRODUCTS.slice(0, 10);

  return (
    <div className="space-y-16 pb-16">
      {/* 0. Wix-Style Top Global Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>🎉 Worldwide Tracked Shipping on All Orders • 100% Genuine Quality Guarantee • 24/7 Customer Care</span>
      </div>

      {/* 1. Hero Section - Wix Luxury Boutique Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pavilion Venture • Global Trending Collection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Pavilion Venture
                <span className="block text-2xl sm:text-3xl text-neutral-400 font-semibold mt-2">
                  Lifestyle, Tech &amp; European Fashion
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover our new season collection: anti-spy wireless signal detectors, European evening suspender slip dresses, athleisure activewear, and POEDAGAR multifunction dual-display timepieces.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    onNavigate('shop');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition transform hover:-translate-y-0.5"
                >
                  <span>Shop 10 Trending Items</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold text-sm sm:text-base border border-neutral-700 transition"
                >
                  Browse Full Catalog
                </button>

                <button
                  onClick={() => onNavigate('caps')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm sm:text-base border border-amber-500/40 flex items-center justify-center gap-2 transition"
                >
                  <span>🧢 2 for RM30 Deals</span>
                </button>
              </div>

              {/* Quick Features List */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Free Tracked Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified Google Merchant
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Stripe &amp; PayPal Encrypted
                </span>
              </div>
            </div>

            {/* Right Column - Hero Showcase Image */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-neutral-900 group">
                <img
                  src="https://cdn.b12.io/client_media/pahMcnrl/8928103f-2d4a-11f1-bcc3-0242ac110002-dqogjTOrMkA5l6e_qghcP.jpg"
                  alt="Tech Trend Hub Products Showcase"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Special Deal</span>
                    <h4 className="text-sm font-bold text-white">Beats Studio Pro Wireless ANC</h4>
                    <p className="text-xs text-neutral-400">Clearance: RM 800 (Save 45%) • 2 Units Left</p>
                  </div>
                  <button
                    onClick={() => {
                      const beats = PRODUCTS.find(p => p.id === 'beats-studio-pro-navy');
                      if (beats) onViewProduct(beats);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white">Shop by Category</h2>
          <p className="text-neutral-400 text-sm mt-2">
            Browse our wide selection of tech gadgets, accessories & daily lifestyle items
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Skincare */}
          <div
            onClick={() => { onSelectCategory('skincare'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-pink-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-pink-400 transition">护肤品</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Skincare</p>
          </div>

          {/* Makeup Tools */}
          <div
            onClick={() => { onSelectCategory('makeup-tools'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">💄</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-rose-400 transition">美妆工具</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Makeup Tools</p>
          </div>

          {/* Hair Straighteners */}
          <div
            onClick={() => { onSelectCategory('hair-styling'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">💇</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-purple-400 transition">直发与美发</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Hair Straighteners</p>
          </div>

          {/* Drones & Electronics */}
          <div
            onClick={() => { onSelectCategory('drone-electronics'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">🛸</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-cyan-400 transition">无人机与数码</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Drone &amp; Tech</p>
          </div>

          {/* Clothes */}
          <div
            onClick={() => { onSelectCategory('clothes'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">👚</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-amber-400 transition">潮流上衣</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Clothes &amp; Tops</p>
          </div>

          {/* Dresses */}
          <div
            onClick={() => { onSelectCategory('dresses'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-red-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">👗</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-red-400 transition">礼服与长裙</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Gowns &amp; Dresses</p>
          </div>

          {/* Pants */}
          <div
            onClick={() => { onSelectCategory('pants'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">👖</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-emerald-400 transition">裤装与瑜伽裤</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Pants &amp; Leggings</p>
          </div>

          {/* Watches */}
          <div
            onClick={() => { onSelectCategory('watches'); onNavigate('shop'); }}
            className="group cursor-pointer p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-yellow-500/60 hover:bg-neutral-850 transition-all text-center flex flex-col items-center justify-between"
          >
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
              <span className="text-2xl">⌚</span>
            </div>
            <h3 className="font-bold text-white text-xs group-hover:text-yellow-400 transition">名表腕表</h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Watches</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products / Trending Now */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Best-Selling Tech & Accessories</h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
          >
            <span>View All ({PRODUCTS.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="group cursor-pointer bg-neutral-900 rounded-2xl border border-neutral-800 hover:border-neutral-700 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
            >
              {/* Image & Badge */}
              <div className="relative p-4 bg-neutral-950 flex items-center justify-center overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover rounded-xl group-hover:scale-105 transition duration-500"
                  />
                )}
                {product.badge && (
                  <span className="absolute top-6 left-6 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-900/90 text-amber-400 border border-amber-500/40 backdrop-blur-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span className="capitalize text-blue-400 font-semibold">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-neutral-500">({product.reviews})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800/80">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-2xl font-black text-blue-400">
                      {product.displayPrice || `RM ${product.price}`}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-neutral-500 line-through">
                        RM {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => handleAdd(product, e)}
                      className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      {addedProductId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProduct(product);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>

                  {product.externalUrl && (
                    <a
                      href={product.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Buy on Pavilion Shop (Wed2C) ↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Wholesale Malaysia Opportunities Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-8 sm:p-12 border border-blue-700/50 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-blue-100 backdrop-blur-xs">
                🇲🇾 Direct From Shah Alam
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Wholesale Opportunities in Malaysia
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Grab premium phone gadgets, chargers, cases, and caps while stock lasts! We offer exceptional wholesale bulk pricing for reseller shops and night market businesses across West Malaysia.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-sm text-blue-100 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Competitive wholesale prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Fast shipping in West Malaysia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Self-pickup available in Shah Alam</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Flexible bulk MOQs</span>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={buildWhatsAppOrderUrl("Hi! I'm interested in wholesale bulk orders for phone gadgets and accessories in Malaysia. Please provide catalog and pricing details.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm sm:text-base transition shadow-xl"
                >
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Contact Wholesale via WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <img
                src="https://cdn.b12.io/client_media/pahMcnrl/633c2184-422f-11f1-83fe-0242ac110002-1688_image_share_d1633ca657f8c79a617b7614b5d542c6.jpg"
                alt="Wholesale Offer Tech Trend Hub"
                className="rounded-2xl shadow-2xl border border-white/20 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits & Trust Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Fast & Tracked Shipping</h3>
            <p className="text-neutral-400 text-sm">
              Quick and reliable courier delivery across West Malaysia, plus self-pickup at Shah Alam.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Quality Accessories</h3>
            <p className="text-neutral-400 text-sm">
              All gadgets rigorously tested for durability, certified safety standards and performance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Safe & Easy Orders</h3>
            <p className="text-neutral-400 text-sm">
              Direct verification and order placement via WhatsApp with transparent receipts and updates.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
            Real Buyer Feedback
          </span>
          <h2 className="text-3xl font-bold text-white">What Our Customers Say</h2>
          <p className="text-neutral-400 text-sm mt-2">
            Trusted by tech enthusiasts, students, and wholesale resellers in Malaysia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-neutral-800">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700"
                />
                <div>
                  <h4 className="font-bold text-sm text-white">{t.name}</h4>
                  <p className="text-xs text-neutral-400">{t.title} • <span className="text-blue-400">{t.product}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Subscription */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Stay Updated on Tech Drops & Wholesale Promos</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Subscribe to receive new product alerts, special Malaysian festival discounts, and clearance deals.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition"
            >
              Subscribe
            </button>
          </form>

          {newsletterSubscribed && (
            <p className="text-xs text-emerald-400 font-semibold animate-in fade-in">
              🎉 Thank you for subscribing! We'll keep you posted with the latest deals.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
