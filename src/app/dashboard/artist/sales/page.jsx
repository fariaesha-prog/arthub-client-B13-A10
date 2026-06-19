"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ArtistSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/sales/artist", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSales(data);
      } catch (err) {
        setError("Failed to load sales.");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + s.price, 0);
  const totalSales = sales.length;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Sales History
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">Track every artwork sold and your total earnings.</p>
      </div>

      {/* Stat Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-colors">
          <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-colors">
          <p className="text-xs text-gray-400 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-white">{totalSales}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-purple-500/20 transition-colors">
          <p className="text-xs text-gray-400 mb-1">Avg. Sale Price</p>
          <p className="text-2xl font-bold text-white">
            ${totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artwork</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Buyer</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Amount</span>
          </div>

          {/* States */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-rose-400 text-sm">{error}</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm font-medium">No sales yet</p>
              <p className="text-gray-600 text-xs mt-1">When someone buys your artwork, it'll appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {sales.map((sale, idx) => (
                <motion.div
                  key={sale._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
                >
                  {/* Index */}
                  <span className="col-span-1 text-xs text-gray-600">{idx + 1}</span>

                  {/* Artwork */}
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={sale.artworkImage}
                      alt={sale.artworkTitle}
                      className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                    />
                    <span className="text-sm text-gray-200 font-medium truncate">{sale.artworkTitle}</span>
                  </div>

                  {/* Buyer */}
                  <div className="col-span-3">
                    <p className="text-sm text-gray-300 truncate">{sale.buyer?.name}</p>
                    <p className="text-xs text-gray-600 truncate">{sale.buyer?.email}</p>
                  </div>

                  {/* Date */}
                  <div className="col-span-3">
                    <p className="text-sm text-gray-400">
                      {new Date(sale.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                      })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(sale.purchasedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-orange-400">${Number(sale.price).toFixed(2)}</span>
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