"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 max-w-md"
      >
        {/* Illustration */}
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl" />
          <svg viewBox="0 0 200 200" className="w-full h-full relative z-10" fill="none">
            <circle cx="100" cy="100" r="80" stroke="#9353f7" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />
            <rect x="55" y="60" width="90" height="80" rx="12" fill="#111625" stroke="#9353f7" strokeWidth="1.5" opacity="0.8" />
            <rect x="70" y="78" width="30" height="4" rx="2" fill="#9353f7" opacity="0.6" />
            <rect x="70" y="88" width="50" height="4" rx="2" fill="#9353f7" opacity="0.3" />
            <rect x="70" y="98" width="40" height="4" rx="2" fill="#9353f7" opacity="0.3" />
            <circle cx="100" cy="125" r="10" fill="#9353f7" opacity="0.2" stroke="#9353f7" strokeWidth="1.5" />
            <path d="M96 125h8M100 121v8" stroke="#9353f7" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="55" r="6" fill="#f97316" opacity="0.6" />
            <circle cx="145" cy="65" r="4" fill="#9353f7" opacity="0.5" />
            <circle cx="150" cy="140" r="5" fill="#f97316" opacity="0.4" />
          </svg>
        </div>

        {/* 404 Text */}
        <div>
          <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 leading-none mb-2">
            404
          </h1>
          <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
          >
            Go Home
          </Link>
          <Link
            href="/browse"
            className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-colors text-center"
          >
            Browse Artworks
          </Link>
        </div>
      </motion.div>
    </div>
  );
}