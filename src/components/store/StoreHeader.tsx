import React, { useState } from 'react';
import { StorePage } from '../../types';
import { BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface StoreHeaderProps {
  currentPage: StorePage;
  onNavigate: (page: StorePage) => void;
  onOpenCart: () => void;
  cartCount: number;
  onSwitchToNotepad: () => void;
  onSearchQuery?: (q: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenCart,
  cartCount,
  onSwitchToNotepad,
  onSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearchQuery) onSearchQuery(searchInput);
      onNavigate('shop');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-xs py-1.5 px-4 text-center text-white flex items-center justify-between font-medium">
        <div className="hidden sm:flex items-center gap-3 mx-auto">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-blue-200" />
            Fast Shipping within West Malaysia & Self-pickup in Shah Alam
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            Malaysian Consumer Protection 1999 Compliant
          </span>
          <span className="text-white/40">•</span>
          <a
            href={buildWhatsAppOrderUrl("Hi! I'm interested in Tech Trend Hub gadgets and accessories.")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-100 flex items-center gap-0.5"
          >
            WhatsApp {BUSINESS_INFO.whatsappFormatted}
          </a>
          <span className="text-white/40">•</span>
          <a
            href="/google-merchant.xml"
            download="google-merchant.xml"
            className="bg-amber-400 text-neutral-950 font-bold px-2 py-0.5 rounded text-[10px] hover:bg-amber-300 transition inline-flex items-center gap-1"
            title="点击下载 google-merchant.xml 文件并上传至 GMC"
          >
            📥 下载 GMC XML
          </a>
        </div>
        <div className="sm:hidden text-center w-full flex items-center justify-center gap-2">
          <span>Shah Alam Pickup</span>
          <span>•</span>
          <a
            href="/google-merchant.xml"
            download="google-merchant.xml"
            className="bg-amber-400 text-neutral-950 font-bold px-1.5 py-0.2 rounded text-[10px]"
          >
            📥 下载 GMC XML
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
                T
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Tech Trend Hub
                  <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    MY
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 block -mt-0.5">
                  Shah Alam • Gadgets & Wholesale
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'home'
                  ? 'bg-neutral-800 text-blue-400 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'shop'
                  ? 'bg-neutral-800 text-blue-400 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              All Products
            </button>

            {/* Caps Promo Button */}
            <button
              onClick={() => onNavigate('caps')}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentPage === 'caps'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-semibold'
                  : 'text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60'
              }`}
            >
              <span>🧢 2 for RM30 Caps</span>
            </button>

            {/* Screen Protector Promo Button */}
            <button
              onClick={() => onNavigate('screen-protectors')}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentPage === 'screen-protectors'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                  : 'text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800/60'
              }`}
            >
              <span>🛡️ 2 for RM30 Glass</span>
            </button>

            <button
              onClick={() => onNavigate('blog')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'blog'
                  ? 'bg-neutral-800 text-blue-400 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              Blog
            </button>

            <button
              onClick={() => onNavigate('about')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'about'
                  ? 'bg-neutral-800 text-blue-400 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              About
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className={`px-3 py-2 rounded-lg transition ${
                currentPage === 'contact'
                  ? 'bg-neutral-800 text-blue-400 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              Contact & FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch to Nexus AI Notepad */}
            <button
              onClick={onSwitchToNotepad}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-semibold shadow-xs hover:border-purple-400 transition"
              title="Switch to Nexus AI Notepad (Photo & File upload, Notion AI tools)"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Nexus AI 记事本</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Direct WhatsApp Action */}
            <a
              href={buildWhatsAppOrderUrl("Hi Tech Trend Hub! I'd like to check product catalog and wholesale details.")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition flex items-center justify-center border border-neutral-700/60"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 lg:hidden transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Collapsible */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-neutral-800 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search phones, earbuds, caps, cables, cases..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-9 pr-20 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'home' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'shop' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => { onNavigate('caps'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
          >
            🧢 2 for RM30 Trendy Caps
          </button>
          <button
            onClick={() => { onNavigate('screen-protectors'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
          >
            🛡️ 2 for RM30 Tempered Glass
          </button>
          <button
            onClick={() => { onNavigate('blog'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'blog' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            Tech Blog & 2026 Guides
          </button>
          <button
            onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'about' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'contact' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            Contact & FAQ
          </button>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => { onSwitchToNotepad(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>切换到 Nexus AI 记事本</span>
            </button>
            <a
              href={buildWhatsAppOrderUrl("Hi! I'm reaching out from Tech Trend Hub.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: +60 16-678 7883</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
