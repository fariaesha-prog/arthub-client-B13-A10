"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/transactions", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.price, 0);

  const filtered = transactions.filter(t =>
    t.artworkTitle?.toLowerCase().includes(search.toLowerCase()) ||
    t.buyer?.email?.toLowerCase().includes(search.toLowerCase()) ||
    t.artist?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">All Transactions</h1>
          <p className="text-sm text-gray-400 mt-1.5">{transactions.length} total transactions · ${totalRevenue.toFixed(2)} revenue</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by artwork or email..."
          className="w-64 h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Summary */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Transactions", value: transactions.length },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}` },
          { label: "Avg. Transaction", value: transactions.length > 0 ? `$${(totalRevenue / transactions.length).toFixed(2)}` : "$0.00" }
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artwork</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Buyer</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artist</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</span>
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Amount</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No transactions found.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((t, idx) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="col-span-1 text-xs text-gray-600">{idx + 1}</span>
                  <div className="col-span-3 flex items-center gap-2">
                    <img src={t.artworkImage} alt={t.artworkTitle} className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0" />
                    <span className="text-xs text-gray-200 truncate">{t.artworkTitle}</span>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-300 truncate">{t.buyer?.name}</p>
                    <p className="text-[10px] text-gray-600 truncate">{t.buyer?.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 truncate">{t.artist?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">{new Date(t.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-xs font-bold text-orange-400">${Number(t.price).toFixed(2)}</span>
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