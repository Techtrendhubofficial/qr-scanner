import React, { useState } from 'react';
import { CAP_STYLES, BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { CartItem } from '../../types';
import { Send, ShoppingBag, MapPin, Truck, Check, Sparkles, CheckCircle2 } from 'lucide-react';

interface CapsConfiguratorProps {
  onAddToCart: (item: CartItem) => void;
}

export const CapsConfigurator: React.FC<CapsConfiguratorProps> = ({ onAddToCart }) => {
  const [selectedStyleId, setSelectedStyleId] = useState<number>(1);
  const [selectedSecondStyleId, setSelectedSecondStyleId] = useState<number>(2);
  const [quantity, setQuantity] = useState<number>(2); // min 2 for the promo
  const [added, setAdded] = useState(false);

  const selectedFirstStyle = CAP_STYLES.find(s => s.id === selectedStyleId) || CAP_STYLES[0];
  const selectedSecondStyle = CAP_STYLES.find(s => s.id === selectedSecondStyleId) || CAP_STYLES[1];

  // Price calculation: Promo is 2 for RM30 (RM15 each when bought in pairs)
  // If odd number >= 3: pairs at 15 each, remainder at 30
  const pairs = Math.floor(quantity / 2);
  const singles = quantity % 2;
  const totalPrice = pairs * 30 + singles * 30;

  const handleAddToCart = () => {
    const optionText = `Style #${selectedFirstStyle.id} (${selectedFirstStyle.name}) + Style #${selectedSecondStyle.id} (${selectedSecondStyle.name})`;
    const cartItem: CartItem = {
      id: `cap-combo-${Date.now()}`,
      productId: 'cap-promo-combo',
      name: `Trendy Caps (2 for RM30 Promo)`,
      price: totalPrice / quantity, // effective unit price
      quantity: quantity,
      image: "https://cdn.b12.io/client_media/pahMcnrl/633c2184-422f-11f1-83fe-0242ac110002-1688_image_share_d1633ca657f8c79a617b7614b5d542c6.jpg",
      category: 'caps',
      selectedOption: optionText
    };

    onAddToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleConfirmViaWhatsApp = () => {
    const msg = `Hi Tech Trend Hub! I want to order the "Trendy Caps (2 for RM30 Promo)":
- Cap 1: #${selectedFirstStyle.id} ${selectedFirstStyle.name} (${selectedFirstStyle.colorName})
- Cap 2: #${selectedSecondStyle.id} ${selectedSecondStyle.name} (${selectedSecondStyle.colorName})
- Quantity: ${quantity} pieces
- Total Price: RM ${totalPrice.toFixed(2)}
- Delivery: Shah Alam Self-Pickup / West Malaysia Courier
Please confirm stock availability. Thank you!`;

    window.open(buildWhatsAppOrderUrl(msg), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Product Summary Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Product visual preview */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-neutral-900 to-indigo-950 rounded-2xl p-8 border border-neutral-800 text-center relative overflow-hidden">
            <div className="text-8xl mb-3 animate-bounce select-none">🧢</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Limited Time Malaysia Promo
            </div>
            <p className="text-xs text-neutral-400 mt-2">100+ Urban Styles Available</p>
          </div>

          {/* Right: Info & Pricing */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              HOT SPECIAL OFFER
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trendy Caps & Headwear
            </h1>

            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400">
                2 for RM30 💫
              </span>
              <span className="text-lg text-neutral-500 line-through">
                RM30 per cap
              </span>
            </div>

            <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4">
              <p className="text-sm sm:text-base text-amber-300 font-semibold flex items-center gap-2">
                <span>⏰ Limited Time Offer:</span>
                <span>Get any 2 premium urban caps for just RM30!</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-neutral-300 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Shah Alam Self-Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Fast West Malaysia Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Premium Washed Cotton</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Styles Showcase Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Choose Your 10 Premium Styles</h2>
          <p className="text-neutral-400 text-sm">
            Click any cap style below to select for your 2 for RM30 bundle. Mix & match freely!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CAP_STYLES.map((cap) => {
            const isSelectedFirst = selectedStyleId === cap.id;
            const isSelectedSecond = selectedSecondStyleId === cap.id;
            const isSelected = isSelectedFirst || isSelectedSecond;

            return (
              <div
                key={cap.id}
                onClick={() => {
                  if (isSelectedFirst) {
                    // keep
                  } else if (isSelectedSecond) {
                    // switch
                  } else {
                    // replace second style
                    setSelectedSecondStyleId(cap.id);
                  }
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 transform hover:-translate-y-1 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/10'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div className={`h-40 bg-gradient-to-br ${cap.bgGradient} flex items-center justify-center text-white text-5xl font-black relative select-none shadow-inner`}>
                  {cap.id}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                      ✓
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-white/90">
                    {cap.colorName}
                  </span>
                </div>
                <div className="p-3 text-center bg-neutral-900">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{cap.name}</h4>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStyleId(cap.id);
                      }}
                      className={`text-[10px] px-2 py-1 rounded font-semibold transition ${
                        isSelectedFirst
                          ? 'bg-amber-400 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Cap #1
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSecondStyleId(cap.id);
                      }}
                      className={`text-[10px] px-2 py-1 rounded font-semibold transition ${
                        isSelectedSecond
                          ? 'bg-amber-400 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Cap #2
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Combo & Order Summary */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>选择规格 & 数量 (Select Quantity & Styles)</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Selected Styles Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Selected Cap 1 (First Choice)
                </span>
                <p className="text-base font-bold text-white">#{selectedFirstStyle.id} {selectedFirstStyle.name}</p>
                <p className="text-xs text-neutral-400 mt-1">Color: {selectedFirstStyle.colorName}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Selected Cap 2 (Second Choice)
                </span>
                <p className="text-base font-bold text-white">#{selectedSecondStyle.id} {selectedSecondStyle.name}</p>
                <p className="text-xs text-neutral-400 mt-1">Color: {selectedSecondStyle.colorName}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="text-sm font-semibold text-white block">Quantity (Pieces)</label>
                <span className="text-xs text-neutral-400">Minimum: 2 (for promo pricing)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(2, quantity - 2))}
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-lg border border-neutral-700 transition"
                >
                  -2
                </button>
                <span className="text-xl font-black text-amber-400 px-3">{quantity} pcs</span>
                <button
                  onClick={() => setQuantity(quantity + 2)}
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-lg border border-neutral-700 transition"
                >
                  +2
                </button>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h4 className="font-bold text-white text-base">Order Summary</h4>

            <div className="space-y-2 text-sm text-neutral-400 border-b border-neutral-800 pb-4">
              <div className="flex justify-between">
                <span>Selected:</span>
                <span className="text-white font-semibold">Styles #{selectedFirstStyle.id} & #{selectedSecondStyle.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Quantity:</span>
                <span className="text-white font-semibold">{quantity} pieces</span>
              </div>
              <div className="flex justify-between">
                <span>Promotion:</span>
                <span className="text-amber-400 font-semibold">{pairs} x Combo (2 for RM30)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-base font-bold text-white">Total Price:</span>
              <span className="text-3xl font-black text-amber-400">RM {totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleConfirmViaWhatsApp}
                className="w-full py-3 px-4 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </button>
            </div>
            <p className="text-[11px] text-center text-neutral-500">
              Self-pickup at Shah Alam or speedy courier to anywhere in West Malaysia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
