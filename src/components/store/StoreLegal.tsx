import React, { useState } from 'react';
import { StorePage } from '../../types';
import { ShieldCheck, FileText, ArrowLeft, Send } from 'lucide-react';
import { BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';

interface StoreLegalProps {
  initialTab?: 'refund' | 'terms';
  onBack: () => void;
}

export const StoreLegal: React.FC<StoreLegalProps> = ({ initialTab = 'refund', onBack }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'terms'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 gap-4">
        <button
          onClick={() => setActiveTab('refund')}
          className={`pb-3 px-2 text-base font-bold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'refund'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Refund & Return Policy (14-Day)</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 px-2 text-base font-bold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'terms'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Terms of Service & PDPA</span>
        </button>
      </div>

      {/* Refund Policy Content */}
      {activeTab === 'refund' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-6 text-neutral-300 leading-relaxed text-sm sm:text-base">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              Malaysian Consumer Protection Act 1999 Compliant
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Tech Trend Hub Refund & Return Policy
            </h1>
            <p className="text-xs text-neutral-500 mt-1">Last Updated: 2026</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">1. Return Eligibility (14 Days)</h3>
            <p>
              We accept returns or exchanges within 14 calendar days from the date of purchase or courier delivery confirmation for any of the following reasons:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-neutral-300">
              <li>Product is defective, malfunctioning, or arrived with physical transit damage.</li>
              <li>Product specifications do not match the online description.</li>
              <li>Wrong item or variation was received.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">2. Simple WhatsApp Return Process</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2 text-neutral-300">
              <li>Message our Shah Alam support team on WhatsApp at <strong>+60 16-678 7883</strong> with photos/video of the issue.</li>
              <li>Provide your order details or invoice reference number.</li>
              <li>Once approved, return the item via courier or drop off at our Shah Alam location.</li>
              <li>Replacements or refunds will be processed within 3 to 5 business days.</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">3. Wholesale & Bulk Order Terms</h3>
            <p>
              Wholesale customers are covered by manufacturer warranty. Defective items reported within 14 days will be credited or replaced with equivalent stock on the next shipment.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-neutral-400">
              Need immediate assistance? Contact us directly via WhatsApp.
            </p>
            <a
              href={buildWhatsAppOrderUrl("Hi! I have an inquiry about returns and refunds.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp: +60 16-678 7883</span>
            </a>
          </div>
        </div>
      )}

      {/* Terms of Service Content */}
      {activeTab === 'terms' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-6 text-neutral-300 leading-relaxed text-sm sm:text-base">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              Google Merchant Center & Legal Terms
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Website Terms of Service & Privacy
            </h1>
            <p className="text-xs text-neutral-500 mt-1">Effective 2026</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">1. Agreement to Terms</h3>
            <p>
              By accessing Tech Trend Hub (pavilionventure.com) and placing orders via our website or verified WhatsApp channel, you agree to comply with Malaysian commercial laws and these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">2. Pricing & Currency</h3>
            <p>
              All prices are displayed in Malaysian Ringgit (RM) or USD where explicitly stated. Wholesale promotional offers such as "2 for RM30 Trendy Caps" and "2 for RM30 Tempered Glass" are valid while stocks last.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">3. Personal Data Protection Act 2010 (PDPA)</h3>
            <p>
              We treat your privacy with highest seriousness. Customer contact details collected through order placements and WhatsApp messages are used exclusively for shipping fulfillment and customer warranty support. We never sell or share user data with third parties.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">4. Jurisdiction & Governing Law</h3>
            <p>
              These terms are governed by the laws of Malaysia. Any disputes arising shall be resolved under the jurisdiction of the courts of Malaysia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
