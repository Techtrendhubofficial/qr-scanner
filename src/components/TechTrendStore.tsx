import React, { useState, useEffect } from 'react';
import { StorePage, CartItem } from '../types';
import { Product, PRODUCTS } from '../data/storeData';
import { StoreHeader } from './store/StoreHeader';
import { StoreFooter } from './store/StoreFooter';
import { StoreHome } from './store/StoreHome';
import { StoreShop } from './store/StoreShop';
import { CapsConfigurator } from './store/CapsConfigurator';
import { ScreenProtectorConfigurator } from './store/ScreenProtectorConfigurator';
import { StoreAbout } from './store/StoreAbout';
import { StoreBlog } from './store/StoreBlog';
import { StoreContact } from './store/StoreContact';
import { StoreLegal } from './store/StoreLegal';
import { CartDrawer } from './store/CartDrawer';
import { ProductDetailModal } from './store/ProductDetailModal';

interface TechTrendStoreProps {
  onSwitchToNotepad: () => void;
}

export const TechTrendStore: React.FC<TechTrendStoreProps> = ({ onSwitchToNotepad }) => {
  const [currentPage, setCurrentPage] = useState<StorePage>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('refund') || path.includes('return') || hash.includes('refund')) return 'refund';
      if (path.includes('terms') || hash.includes('terms')) return 'terms';
      if (path.includes('shop') || hash.includes('shop')) return 'shop';
      if (path.includes('caps') || hash.includes('caps')) return 'caps';
      if (path.includes('screen') || hash.includes('screen')) return 'screen-protectors';
      if (path.includes('contact') || hash.includes('contact')) return 'contact';
      if (path.includes('about') || hash.includes('about')) return 'about';
    }
    return 'home';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Auto-detect product deep-links like /s/2GYK4kAB2-Y or /product/...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path !== '/' && path !== '') {
        const found = PRODUCTS.find((p) => {
          if (p.externalUrl && p.externalUrl.toLowerCase().includes(path)) return true;
          if (path.includes(p.id.toLowerCase())) return true;
          const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          if (path.includes(slug)) return true;
          return false;
        });
        if (found) {
          setActiveProductModal(found);
        }
      }
    }
  }, []);

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('techtrendhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('techtrendhub_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product, quantity = 1, selectedOption?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedOption === selectedOption
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
          category: product.category,
          selectedOption: selectedOption
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const handleAddDirectCartItem = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchQuery = (q: string) => {
    setSearchFilter(q);
    setSelectedCategory('all');
    setCurrentPage('shop');
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchFilter('');
    setCurrentPage('shop');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans">
      {/* Store Header */}
      <StoreHeader
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        onSwitchToNotepad={onSwitchToNotepad}
        onSearchQuery={handleSearchQuery}
      />

      {/* Main Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <StoreHome
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCategory={handleSelectCategory}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onViewProduct={(p) => setActiveProductModal(p)}
          />
        )}

        {currentPage === 'shop' && (
          <StoreShop
            initialCategory={selectedCategory}
            searchFilter={searchFilter}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onViewProduct={(p) => setActiveProductModal(p)}
          />
        )}

        {currentPage === 'caps' && (
          <CapsConfigurator onAddToCart={handleAddDirectCartItem} />
        )}

        {currentPage === 'screen-protectors' && (
          <ScreenProtectorConfigurator onAddToCart={handleAddDirectCartItem} />
        )}

        {currentPage === 'about' && <StoreAbout />}

        {currentPage === 'blog' && <StoreBlog />}

        {currentPage === 'contact' && <StoreContact />}

        {(currentPage === 'refund' || currentPage === 'terms') && (
          <StoreLegal
            initialTab={currentPage === 'refund' ? 'refund' : 'terms'}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </main>

      {/* Store Footer */}
      <StoreFooter
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={handleSelectCategory}
        onSwitchToNotepad={onSwitchToNotepad}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={(p, qty, option) => handleAddToCart(p, qty, option)}
      />
    </div>
  );
};
