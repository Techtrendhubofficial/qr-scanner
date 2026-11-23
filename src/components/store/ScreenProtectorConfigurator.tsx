import React, { useState } from 'react';
import { SCREEN_PROTECTORS, BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { CartItem } from '../../types';
import { Send, ShoppingBag, MapPin, Truck, Check, Sparkles, Shield, CheckCircle2 } from 'lucide-react';

interface ScreenProtectorConfiguratorProps {
  onAddToCart: (item: CartItem) => void;
}

export const ScreenProtectorConfigurator: React.FC<ScreenProtectorConfiguratorProps> = ({ onAddToCart }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<number>(1);
  const [selectedSecondTypeId, setSelectedSecondTypeId] = useState<number>(3); // default Privacy
  const [quantity, setQuantity] = useState<number>(2);
  const [phoneModel, setPhoneModel] = useState<string>('iPhone 15 / 16');
  const [added, setAdded] = useState(false);

  const selectedFirst = SCREEN_PROTECTORS.find(s => s.id === selectedTypeId) || SCREEN_PROTECTORS[0];
  const selectedSecond = SCREEN_PROTECTORS.find(s => s.id === selectedSecondTypeId) || SCREEN_PROTECTORS[2];

  const pairs = Math.floor(quantity / 2);
  const singles = quantity % 2;
  const totalPrice = pairs * 30 + singles * 30;

  const handleAddToCart = () => {
    const optionText = `Model: ${phoneModel} | Type #${selectedFirst.id} (${selectedFirst.name}) + Type #${selectedSecond.id} (${selectedSecond.name})`;
    const cartItem: CartItem = {
      id: `protector-combo-${Date.now()}`,
      productId: 'screen-protector-promo',
      name: `Tempered Glass Screen Protector (2 for RM30)`,
      price: totalPrice / quantity,
      quantity: quantity,
      image: "https://cdn.b12.io/client_media/pahMcnrl/88ffaeb6-2d4a-11f1-bc1a-0242ac110002-PZvjK-YCZHa6EczzMtc6_.jpg",
      category: 'screen-protectors',
      selectedOption: optionText
    };

    onAddToCart(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleConfirmViaWhatsApp = () => {
    const msg = `Hi Tech Trend Hub! I want to order "Tempered Glass Screen Protectors (2 for RM30)":
- Phone Model: ${phoneModel}
- Type 1: #${selectedFirst.id} ${selectedFirst.name}
- Type 2: #${selectedSecond.id} ${selectedSecond.name}
- Quantity: ${quantity} pieces
- Total Price: RM ${totalPrice.toFixed(2)}
- Location: Shah Alam / West Malaysia
Please confirm stock for my phone model. Thank you!`;

    window.open(buildWhatsAppOrderUrl(msg), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Product Summary Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Visual Badge */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-neutral-900 to-teal-950 rounded-2xl p-8 border border-neutral-800 text-center relative overflow-hidden">
            <div className="text-8xl mb-3 select-none">🛡️</div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Wholesaler & Reseller Friendly
            </div>
            <p className="text-xs text-neutral-400 mt-2">10D Diamond 9H Hardness</p>
          </div>

          {/* Right Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              SPECIAL BULK RATES & RETAIL COMBO
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Screen Protectors (Tempered Glass)
            </h1>

            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                2 for RM30 💫
              </span>
              <span className="text-lg text-neutral-500 line-through">
                RM30 per piece
              </span>
            </div>

            <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-4">
              <p className="text-sm sm:text-base text-emerald-300 font-semibold flex items-center gap-2">
                <span>💼 Wholesale Welcome:</span>
                <span>Price Worth It! Special bulk rates for shop owners and resellers in Malaysia</span>
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
                <span>Crystal Clear 9H Tempered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Types Grid */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Choose Your 10 Screen Protector Types</h2>
          <p className="text-neutral-400 text-sm">
            Select 2 protectors for your RM30 bundle. Mix & match Clear HD, Privacy Shield, or Matte Gaming!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SCREEN_PROTECTORS.map((item) => {
            const isSelectedFirst = selectedTypeId === item.id;
            const isSelectedSecond = selectedSecondTypeId === item.id;
            const isSelected = isSelectedFirst || isSelectedSecond;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isSelectedFirst && !isSelectedSecond) {
                    setSelectedSecondTypeId(item.id);
                  }
                }}
                className={`group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 transform hover:-translate-y-1 ${
                  isSelected
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-xl shadow-emerald-500/10'
                    : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
                }`}
              >
                <div className={`h-36 bg-gradient-to-br ${item.bgGradient} flex flex-col items-center justify-center text-white text-4xl font-black relative select-none p-3 text-center`}>
                  {item.id}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 bg-emerald-400 text-neutral-950 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                      ✓
                    </div>
                  )}
                  <span className="text-[11px] font-normal opacity-90 mt-1 line-clamp-1">
                    {item.feature}
                  </span>
                </div>
                <div className="p-3 text-center bg-neutral-900">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.name}</h4>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTypeId(item.id);
                      }}
                      className={`text-[10px] px-2 py-1 rounded font-semibold transition ${
                        isSelectedFirst
                          ? 'bg-emerald-400 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Piece #1
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSecondTypeId(item.id);
                      }}
                      className={`text-[10px] px-2 py-1 rounded font-semibold transition ${
                        isSelectedSecond
                          ? 'bg-emerald-400 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Piece #2
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration & Order Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-white mb-6">
          选择规格 & 手机型号 (Select Options & Phone Model)
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Phone model input */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Your Phone Brand & Model (Required for precise cutting)
              </label>
              <input
                type="text"
                value={phoneModel}
                onChange={(e) => setPhoneModel(e.target.value)}
                placeholder="e.g. iPhone 15 Pro Max, Samsung S24 Ultra, Xiaomi 14..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Selected items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Protector 1:
                </span>
                <p className="text-base font-bold text-white">#{selectedFirst.id} {selectedFirst.name}</p>
                <p className="text-xs text-neutral-400 mt-1">{selectedFirst.feature}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Protector 2:
                </span>
                <p className="text-base font-bold text-white">#{selectedSecond.id} {selectedSecond.name}</p>
                <p className="text-xs text-neutral-400 mt-1">{selectedSecond.feature}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="text-sm font-semibold text-white block">Quantity (Pieces)</label>
                <span className="text-xs text-neutral-400">Minimum: 2 (Pairs promo)</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(2, quantity - 2))}
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-lg border border-neutral-700 transition"
                >
                  -2
                </button>
                <span className="text-xl font-black text-emerald-400 px-3">{quantity} pcs</span>
                <button
                  onClick={() => setQuantity(quantity + 2)}
                  className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-lg border border-neutral-700 transition"
                >
                  +2
                </button>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
            <h4 className="font-bold text-white text-base">Price Summary</h4>

            <div className="space-y-2 text-sm text-neutral-400 border-b border-neutral-800 pb-4">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="text-white font-semibold truncate max-w-[150px]">{phoneModel}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="text-white font-semibold">{quantity} pieces</span>
              </div>
              <div className="flex justify-between">
                <span>Combo:</span>
                <span className="text-emerald-400 font-semibold">{pairs} x Combo (2 for RM30)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-base font-bold text-white">Total:</span>
              <span className="text-3xl font-black text-emerald-400">RM {totalPrice.toFixed(2)}</span>
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
              Each package includes alignment wet/dry wipes and dust absorption stickers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
