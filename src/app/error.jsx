"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl" />
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center relative z-10">
            <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            An unexpected error occurred. You can try reloading the page or go back home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <button
            onClick={reset}
            className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}