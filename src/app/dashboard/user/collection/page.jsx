"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CollectionPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://https://arthub-server-9t9m.onrender.com/api/sales/user", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-6xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">My Collection</h1>
        <p className="text-sm text-gray-400 mt-1.5">{purchases.length} artwork{purchases.length !== 1 ? "s" : ""} in your collection.</p>
      </div>

      {loading ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[#111625]/40 border border-white/5 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-64 text-center">
          <p className="text-gray-400 text-sm font-medium">Your collection is empty</p>
          <p className="text-gray-600 text-xs mt-1 mb-4">Purchase artworks to add them to your collection.</p>
          <Link href="/browse" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors">
            Browse Artworks
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchases.map((p, idx) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group bg-[#111625] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={p.artworkImage}
                  alt={p.artworkTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111625]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-white truncate">{p.artworkTitle}</h3>
                <p className="text-xs text-gray-500 mt-0.5">by <span className="text-gray-400">{p.artist?.name}</span></p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-orange-400">${Number(p.price).toFixed(2)}</span>
                  <Link
                    href={`/artworks/${p.artworkId}`}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}