import React, { useState } from 'react';
import { Product } from '../../data/storeData';
import { BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { X, Star, ShoppingBag, Send, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedOption?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const msg = `Hi Tech Trend Hub! I want to order "${product.name}" (Qty: ${quantity}, Price: ${product.displayPrice || `RM ${product.price}`}). Please let me know the payment details and delivery options.`;
    window.open(buildWhatsAppOrderUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden text-white my-8 z-10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Image Preview */}
            <div className="bg-neutral-950 rounded-xl p-4 border border-neutral-800 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 md:h-80 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-72 flex items-center justify-center text-neutral-600">
                  No image available
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              {product.badge && (
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {product.badge}
                </span>
              )}

              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-600'}`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-white">{product.rating}</span>
                <span className="text-neutral-400">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-extrabold text-blue-400">
                  {product.displayPrice || `RM ${product.price}`}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through">
                    RM {product.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Quantity selector */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-400">Quantity:</span>
                <div className="flex items-center border border-neutral-700 rounded-lg bg-neutral-950 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

                {/* Action Buttons */}
              <div className="pt-4 space-y-2.5">
                {/* 1. Official Google Pay Quick Buy Button */}
                {product.externalUrl ? (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-bold bg-black hover:bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center gap-2.5 transition shadow-xl hover:shadow-2xl group"
                  >
                    <span className="text-sm font-semibold tracking-wide">Buy with</span>
                    <span className="inline-flex items-center gap-1 font-bold text-base tracking-tight">
                      <span className="text-white">G</span><span className="text-neutral-300">Pay</span>
                    </span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30 ml-1">
                      Fast &amp; Secure
                    </span>
                  </a>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="w-full py-3.5 px-4 rounded-xl font-bold bg-black hover:bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center gap-2.5 transition shadow-xl"
                  >
                    <span className="text-sm font-semibold tracking-wide">Buy with</span>
                    <span className="inline-flex items-center gap-1 font-bold text-base tracking-tight">
                      <span className="text-white">G</span><span className="text-neutral-300">Pay</span>
                    </span>
                  </button>
                )}

                {/* 2. Direct Buy Online on Wed2C Store */}
                {product.externalUrl && (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/20"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Buy Online on Pavilion Store (Wed2C)</span>
                  </a>
                )}

                {/* 3. Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart (RM {(product.price * quantity).toFixed(2)})</span>
                    </>
                  )}
                </button>

                {/* 4. WhatsApp Direct Order */}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Order Directly via WhatsApp</span>
                </button>

                {/* Trust and Payment Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-[11px] text-neutral-400 border-t border-neutral-800/80">
                  <span className="flex items-center gap-1 font-medium text-neutral-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Google Verified
                  </span>
                  <span>•</span>
                  <span>Google Pay</span>
                  <span>•</span>
                  <span>Apple Pay</span>
                  <span>•</span>
                  <span>Visa / MC</span>
                  <span>•</span>
                  <span>256-Bit SSL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="border-t border-neutral-800 pt-6">
              <h3 className="text-base font-bold text-white mb-3">Specifications & Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-neutral-200 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="border-t border-neutral-800 pt-4 grid grid-cols-3 gap-3 text-center text-xs text-neutral-400">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>West Malaysia Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Guaranteed Authentic</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>14-Day Return Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
