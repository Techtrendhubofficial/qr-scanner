import React, { useState, useMemo } from 'react';
import { Product, PRODUCTS } from '../../data/storeData';
import { Star, ShoppingBag, Eye, Search, Filter, Check } from 'lucide-react';

interface StoreShopProps {
  initialCategory?: string;
  onAddToCart: (p: Product) => void;
  onViewProduct: (p: Product) => void;
  searchFilter?: string;
}

export const StoreShop: React.FC<StoreShopProps> = ({
  initialCategory = 'all',
  onAddToCart,
  onViewProduct,
  searchFilter = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>(searchFilter);
  const [priceRange, setPriceRange] = useState<'all' | 'under30' | 'under100' | '100plus'>('all');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products / 全部商品' },
    { id: 'skincare', label: '✨ 护肤品 Skincare' },
    { id: 'makeup-tools', label: '💄 美妆工具 Makeup Tools' },
    { id: 'hair-styling', label: '💇 直发与美发 Hair Straighteners' },
    { id: 'drone-electronics', label: '🛸 无人机与数码 Drone & Electronics' },
    { id: 'clothes', label: '👚 潮流服饰与上衣 Clothes' },
    { id: 'dresses', label: '👗 礼服与长裙 Gowns & Dresses' },
    { id: 'pants', label: '👖 裤装与瑜伽裤 Pants' },
    { id: 'watches', label: '⌚ 名表腕表 Watches' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category match
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      // Price range
      if (priceRange === 'under30' && p.price > 30) return false;
      if (priceRange === 'under100' && (p.price < 30 || p.price > 100)) return false;
      if (priceRange === '100plus' && p.price <= 100) return false;

      return true;
    });
  }, [selectedCategory, search, priceRange]);

  const handleAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Our Product Catalog</h1>
        <p className="text-neutral-400 text-sm">
          Explore our complete collection of phones, accessories, fast chargers, and hot combo deals
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, features (e.g. 100W, ANC, Brooklyn cap, Privacy shield)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Price Range Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800/80 text-xs">
          <span className="text-neutral-400 flex items-center gap-1 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Price Filter:
          </span>
          <button
            onClick={() => setPriceRange('all')}
            className={`px-2.5 py-1 rounded-lg ${priceRange === 'all' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            All Prices
          </button>
          <button
            onClick={() => setPriceRange('under30')}
            className={`px-2.5 py-1 rounded-lg ${priceRange === 'under30' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Under RM30
          </button>
          <button
            onClick={() => setPriceRange('under100')}
            className={`px-2.5 py-1 rounded-lg ${priceRange === 'under100' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            RM30 - RM100
          </button>
          <button
            onClick={() => setPriceRange('100plus')}
            className={`px-2.5 py-1 rounded-lg ${priceRange === '100plus' ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            RM100+
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900 rounded-2xl border border-neutral-800 p-8 space-y-3">
          <p className="text-lg font-bold text-neutral-300">No products found matching your filters</p>
          <p className="text-sm text-neutral-500">Try adjusting your search query or reset category filter</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearch(''); setPriceRange('all'); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
                      {addedId === product.id ? (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
