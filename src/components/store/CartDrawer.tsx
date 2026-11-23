import React, { useState } from 'react';
import { CartItem } from '../../types';
import { BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { ShoppingBag, X, Trash2, Plus, Minus, Send, MapPin, Truck, CheckCircle2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'shipping' | 'us' | 'international' | 'pickup'>('shipping');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  let shippingFee = 8;
  let deliveryTitle = 'West Malaysia Courier';
  if (deliveryMethod === 'pickup') {
    shippingFee = 0;
    deliveryTitle = 'Self-Pickup (Shah Alam)';
  } else if (deliveryMethod === 'us') {
    shippingFee = 28; // approx $6.20 USD
    deliveryTitle = 'United States (USPS / Tracked Air Express)';
  } else if (deliveryMethod === 'international') {
    shippingFee = 35; // approx $7.80 USD
    deliveryTitle = 'International Worldwide Tracked';
  } else {
    shippingFee = subtotal >= 50 ? 0 : 8;
    deliveryTitle = 'West Malaysia Courier';
  }

  const grandTotal = subtotal + shippingFee;
  const grandTotalUsd = (grandTotal / 4.45).toFixed(2);
  const subtotalUsd = (subtotal / 4.45).toFixed(2);
  const shippingFeeUsd = (shippingFee / 4.45).toFixed(2);

  const handleCheckoutViaWhatsApp = () => {
    if (cartItems.length === 0) return;

    let message = `🛒 *New Order from Pavilion Venture Store*\n`;
    message += `--------------------------------------\n`;
    if (customerName) message += `👤 *Customer:* ${customerName}\n`;
    if (customerPhone) message += `📞 *Phone:* ${customerPhone}\n`;
    message += `📦 *Delivery Method:* ${deliveryTitle}\n`;
    if (deliveryMethod !== 'pickup' && customerAddress) {
      message += `📍 *Delivery Address:* ${customerAddress}\n`;
    }
    message += `\n*Order Items:*\n`;

    cartItems.forEach((item, index) => {
      const optionText = item.selectedOption ? ` (${item.selectedOption})` : '';
      const itemUsd = (item.price / 4.45).toFixed(2);
      message += `${index + 1}. ${item.name}${optionText}\n   Qty: ${item.quantity} x RM ${item.price} (~$${itemUsd} USD) = RM ${item.quantity * item.price}\n`;
    });

    message += `--------------------------------------\n`;
    message += `💰 *Subtotal:* RM ${subtotal.toFixed(2)} (~$${subtotalUsd} USD)\n`;
    if (deliveryMethod !== 'pickup') {
      message += `🚚 *Shipping Fee:* ${shippingFee === 0 ? 'FREE (Orders over RM50)' : `RM ${shippingFee.toFixed(2)} (~$${shippingFeeUsd} USD)`}\n`;
    }
    message += `✨ *Grand Total:* RM ${grandTotal.toFixed(2)} (~$${grandTotalUsd} USD)\n`;

    if (customerNotes) {
      message += `📝 *Notes:* ${customerNotes}\n`;
    }
    message += `\n_Please confirm stock availability and international/local payment details. Thank you!_`;

    window.open(buildWhatsAppOrderUrl(message), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold">Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-neutral-600 mb-4" />
                <p className="text-lg font-semibold text-neutral-300">Your cart is empty</p>
                <p className="text-sm mt-1">Browse our gadgets, 2 for RM30 caps, and screen protectors!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-neutral-800/80 rounded-xl p-3 border border-neutral-700/60 flex gap-3 items-center"
                >
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-neutral-950 shrink-0 border border-neutral-700" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-neutral-100 truncate">{item.name}</h4>
                    {item.selectedOption && (
                      <p className="text-xs text-blue-400 mt-0.5 truncate">{item.selectedOption}</p>
                    )}
                    <p className="text-sm font-bold text-amber-400 mt-1">RM {item.price}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-neutral-900 rounded-lg p-1 border border-neutral-700">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold px-1 min-w-[20px] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-700/50 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={onClearCart}
                  className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" /> Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Delivery & Checkout Details */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-4">
              {/* Delivery selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Destination / Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryMethod('shipping')}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      deliveryMethod === 'shipping'
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-sm'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                    <span>🇲🇾 West Malaysia (RM8)</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('us')}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      deliveryMethod === 'us'
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-sm'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>🇺🇸 United States (~$6.20)</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('international')}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      deliveryMethod === 'international'
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-sm'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span>🌍 Worldwide (~$7.80)</span>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`py-2 px-2.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                      deliveryMethod === 'pickup'
                        ? 'border-blue-500 bg-blue-500/15 text-blue-400 shadow-sm'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>🏬 Shah Alam Pickup (Free)</span>
                  </button>
                </div>
              </div>

              {/* Optional Quick Info */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="WhatsApp / Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
                {deliveryMethod !== 'pickup' && (
                  <input
                    type="text"
                    placeholder={deliveryMethod === 'us' ? "Street Address, City, State, ZIP (USA)" : "Delivery Address (City, Country)"}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              {/* Price summary */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">RM {subtotal.toFixed(2)} <span className="text-neutral-500 text-[10px]">(~${subtotalUsd} USD)</span></span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Shipping:</span>
                  <span className="font-semibold text-white">
                    {deliveryMethod === 'pickup'
                      ? 'FREE (Shah Alam Pickup)'
                      : deliveryMethod === 'shipping' && subtotal >= 50
                      ? 'FREE (Malaysia Order > RM50)'
                      : `RM ${shippingFee.toFixed(2)} (~$${shippingFeeUsd} USD)`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total:</span>
                  <div className="text-right">
                    <span className="text-amber-400">RM {grandTotal.toFixed(2)}</span>
                    <span className="text-xs text-emerald-400 font-semibold ml-2">~${grandTotalUsd} USD</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <button
                onClick={handleCheckoutViaWhatsApp}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition transform active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </button>
              <p className="text-[11px] text-center text-neutral-400">
                Direct connection to WhatsApp (+60 16-678 7883) for instant fulfillment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
