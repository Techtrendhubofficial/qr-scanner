import React from 'react';
import { Target, Award, Heart, CheckCircle2, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const StoreAbout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">About Us</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About Tech Trend Hub
        </h1>
        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
          Your trusted partner for the latest phone gadgets, audio devices, and wholesale accessories based in Shah Alam, Malaysia.
        </p>
      </div>

      {/* Story & 5+ Years Badge */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Story</h2>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Tech Trend Hub was founded with a straightforward mission: to bring the highest quality phone gadgets, charging solutions, protective cases, and lifestyle accessories to tech enthusiasts and retailers across Malaysia without inflated markups.
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Starting as a local initiative in Shah Alam, we have grown to become a recognized name in the Malaysian gadget and accessories distribution market. Our growth is built upon genuine passion for reliable technology and an unwavering commitment to rapid, customer-centric service.
            </p>
            <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
              Today, we serve thousands of satisfied individual buyers and wholesale partners across West and East Malaysia, offering carefully curated products backed by comprehensive warranties.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-center">
            <span className="text-6xl font-black text-amber-400">5+</span>
            <span className="text-lg font-bold text-white mt-1">Years of Excellence</span>
            <p className="text-xs text-neutral-400 mt-2">Serving customers throughout Malaysia</p>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Our Mission & Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              To empower tech lovers and retail businesses with premium mobile accessories while delivering unparalleled value, transparent pricing, and prompt delivery.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Quality First</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We carefully inspect and test every batch of fast cables, tempered glass, and audio gear before shipment. Your satisfaction is our benchmark.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Customer Care</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your happiness matters to us. Our Shah Alam support team is always available via WhatsApp for order tracking, compatibility checks, and warranty questions.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-10 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Why Choose Tech Trend Hub?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Wide Product Selection</h4>
              <p className="text-xs text-neutral-400 mt-1">From flagship 5G smartphones to 10 distinct streetwear caps and anti-peeping tempered glass.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Competitive Wholesale Pricing</h4>
              <p className="text-xs text-neutral-400 mt-1">Direct supplier relationships allow us to deliver retail and wholesale rates that protect your margins.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">Fast & Reliable Courier</h4>
              <p className="text-xs text-neutral-400 mt-1">Orders dispatched daily across West Malaysia with same-day Shah Alam self-collection options.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">14-Day Malaysian Warranty</h4>
              <p className="text-xs text-neutral-400 mt-1">Full compliance with the Malaysian Consumer Protection Act 1999 for complete peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-3xl sm:text-4xl font-black text-blue-400">10K+</span>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">Happy Customers</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-3xl sm:text-4xl font-black text-amber-400">500+</span>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">Products Available</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-3xl sm:text-4xl font-black text-emerald-400">98%</span>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">Customer Satisfaction</p>
        </div>
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <span className="text-3xl sm:text-4xl font-black text-purple-400">24/7</span>
          <p className="text-xs text-neutral-400 mt-1 font-semibold">WhatsApp Support</p>
        </div>
      </div>
    </div>
  );
};
