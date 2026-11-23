import React, { useState } from 'react';
import { BlogPost, BLOG_POSTS } from '../../data/storeData';
import { Calendar, User, ArrowRight, X, BookOpen } from 'lucide-react';

export const StoreBlog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Tech Guides & Reviews</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Tech Trend Hub Insights</h1>
        <p className="text-neutral-400 text-sm">
          Expert buying advice, 2026 gadget benchmarks, and audio trend analysis to help you pick the best tech
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="group cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
          >
            {/* Image */}
            <div className="relative h-60 bg-neutral-950 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-neutral-900/90 text-blue-400 border border-blue-500/30 backdrop-blur-xs">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300 gap-1.5">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedPost(null)} />
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] overflow-y-auto text-white space-y-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                {selectedPost.category} • {selectedPost.date}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{selectedPost.title}</h2>
              <p className="text-xs text-neutral-400 mt-1">Written by {selectedPost.author}</p>
            </div>

            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 sm:h-80 object-cover rounded-xl border border-neutral-800"
            />

            <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
