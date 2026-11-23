import React from 'react';
import { StorePage } from '../../types';
import { BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { ShieldCheck, MapPin, Truck, Phone } from 'lucide-react';

interface StoreFooterProps {
  onNavigate: (page: StorePage) => void;
  onSelectCategory: (cat: string) => void;
  onSwitchToNotepad: () => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  onNavigate,
  onSelectCategory,
  onSwitchToNotepad
}) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
                T
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Tech Trend Hub
              </span>
            </div>

            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              Premium phone gadgets, fast chargers, military cases, audio devices, and wholesale accessories based in Shah Alam, Malaysia. Wholesale & retail with fast nationwide shipping.
            </p>

            <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Shah Alam, Selangor, Malaysia (Self-pickup available)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: {BUSINESS_INFO.whatsappFormatted}</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Malaysian Consumer Protection Act 1999 Compliant</span>
              </p>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => { onSelectCategory('phones'); onNavigate('shop'); }}
                  className="hover:text-blue-400 transition"
                >
                  Phones
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('cases'); onNavigate('shop'); }}
                  className="hover:text-blue-400 transition"
                >
                  Cases & Covers
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('chargers'); onNavigate('shop'); }}
                  className="hover:text-blue-400 transition"
                >
                  Chargers & Cables
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onSelectCategory('earbuds'); onNavigate('shop'); }}
                  className="hover:text-blue-400 transition"
                >
                  Audio & Earbuds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('caps')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition"
                >
                  🧢 Trendy Caps (2 for RM30)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('screen-protectors')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  🛡️ Screen Protectors (2 for RM30)
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition">
                  FAQ & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={onSwitchToNotepad}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition"
                >
                  🤖 Nexus AI 记事本
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">
              Legal & Compliance
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="hover:text-blue-400 transition">
                  Refund Policy (14-Day)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-blue-400 transition">
                  Tech Blog
                </button>
              </li>
              <li>
                <a
                  href="/google-merchant.xml"
                  download="google-merchant.xml"
                  className="text-amber-400 hover:text-amber-300 font-medium transition inline-flex items-center gap-1"
                >
                  📥 Google Merchant XML
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppOrderUrl("Hi! I'm interested in wholesale opportunities in Malaysia.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                >
                  Wholesale Inquiry ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Tech Trend Hub. All rights reserved. Shah Alam, Malaysia.</p>
          <div className="flex items-center gap-4">
            <span>West Malaysia Express Delivery</span>
            <span>•</span>
            <span>Self-Pickup Available</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">WhatsApp Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
