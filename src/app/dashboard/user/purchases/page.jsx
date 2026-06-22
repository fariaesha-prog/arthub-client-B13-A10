"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://arthub-server-9t9m.onrender.com/api/sales/user", {
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

  const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-6xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Purchase History</h1>
        <p className="text-sm text-gray-400 mt-1.5">All artworks you've purchased on ArtHub.</p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Purchases", value: purchases.length },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}` },
          { label: "Avg. Price", value: purchases.length > 0 ? `$${(totalSpent / purchases.length).toFixed(2)}` : "$0.00" }
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</span>
            <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artwork</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artist</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Price</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <p className="text-gray-400 text-sm font-medium">No purchases yet</p>
              <p className="text-gray-600 text-xs mt-1">Browse artworks and make your first purchase.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {purchases.map((p, idx) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="col-span-1 text-xs text-gray-600">{idx + 1}</span>
                  <div className="col-span-4 flex items-center gap-3">
                    <img src={p.artworkImage} alt={p.artworkTitle} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                    <span className="text-sm text-gray-200 font-medium truncate">{p.artworkTitle}</span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-300 truncate">{p.artist?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">{new Date(p.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-orange-400">${Number(p.price).toFixed(2)}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}