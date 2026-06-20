"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/artworks", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork permanently?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setArtworks(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = artworks.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.artist?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Manage Artworks</h1>
          <p className="text-sm text-gray-400 mt-1.5">{artworks.length} total artworks on the platform.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or artist..."
          className="w-64 h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</span>
            <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artwork</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Artist</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Category</span>
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Price</span>
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Action</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No artworks found.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((art, idx) => (
                <motion.div
                  key={art._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="col-span-1 text-xs text-gray-600">{idx + 1}</span>
                  <div className="col-span-4 flex items-center gap-3">
                    <img src={art.imageUrl} alt={art.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                    <span className="text-sm text-gray-200 font-medium truncate">{art.title}</span>
                  </div>
                  <div className="col-span-3">
                    <span className="text-sm text-gray-400 truncate">{art.artist?.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500">{art.category}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-bold text-orange-400">${Number(art.price).toFixed(2)}</span>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => handleDelete(art._id)}
                      disabled={deletingId === art._id}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === art._id ? "..." : "Delete"}
                    </button>
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