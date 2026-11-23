import React, { useState } from 'react';
import { FAQS, BUSINESS_INFO, buildWhatsAppOrderUrl } from '../../data/storeData';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';

export const StoreContact: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `💬 *Contact Form Inquiry*\nFrom: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\n\nMessage:\n${message}`;
    window.open(buildWhatsAppOrderUrl(formatted), '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact Us & Support</h1>
        <p className="text-neutral-400 text-sm">
          Have questions regarding gadgets, wholesale MOQ, or order status? We are always here to help!
        </p>
      </div>

      {/* Contact Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Contact Details</h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">WhatsApp & Phone</h4>
                <a
                  href={buildWhatsAppOrderUrl("Hello Tech Trend Hub, I have an inquiry.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline block font-semibold mt-0.5"
                >
                  {BUSINESS_INFO.whatsappFormatted}
                </a>
                <p className="text-xs text-neutral-400">Instant WhatsApp replies during hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Email Address</h4>
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="text-blue-400 hover:underline block font-semibold mt-0.5"
                >
                  {BUSINESS_INFO.email}
                </a>
                <p className="text-xs text-neutral-400">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Warehouse & Self-Pickup</h4>
                <p className="text-neutral-300 font-semibold mt-0.5">Shah Alam, Selangor</p>
                <p className="text-xs text-neutral-400">Malaysia (Self-pickup upon WhatsApp confirmation)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white">Operating Hours</h4>
                <p className="text-neutral-300 text-xs mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM (GMT+8)</p>
                <p className="text-xs text-neutral-400">Sunday & Public Holidays: Closed</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <a
              href={buildWhatsAppOrderUrl("Hi Tech Trend Hub! I'd like to ask a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Direct Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-2">Send us a Message</h2>
          <p className="text-xs text-neutral-400 mb-6">
            Fill in the details below. We'll automatically route your message to our support representative on WhatsApp for lightning-fast replies.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jason Ang"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jason@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+60 12-345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Inquiry Subject <span className="text-red-400">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Product Inquiry">Product Inquiry (Phones, Accessories)</option>
                  <option value="Wholesale Bulk Order">Wholesale Bulk Order (Malaysia)</option>
                  <option value="Caps Promo 2 for RM30">Caps Promo (2 for RM30)</option>
                  <option value="Screen Protector 2 for RM30">Screen Protector Promo</option>
                  <option value="Order & Shipping Tracking">Order & Shipping Tracking</option>
                  <option value="Return / Warranty Claim">Return / Warranty Claim</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Your Message <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="How can we help you? Describe product models, quantities, or specific requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Message via WhatsApp</span>
            </button>

            {submitted && (
              <p className="text-xs text-emerald-400 font-semibold text-center animate-in fade-in">
                ✅ Opening WhatsApp with your message!
              </p>
            )}
          </form>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-neutral-400 text-sm">
            Answers to common questions regarding delivery, returns, and wholesale pricing
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-white flex items-center justify-between hover:text-blue-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-neutral-850 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
