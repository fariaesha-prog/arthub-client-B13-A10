"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";

const CATEGORIES = ["All", "Digital Art", "Oil Painting", "Abstract", "Sculpture"];

export default function BrowseArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const fetchArtworks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/artworks/public");
        const data = await res.json();
        setArtworks(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch artworks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    let result = artworks;
    if (activeCategory !== "All") result = result.filter(a => a.category === activeCategory);
    if (search.trim()) result = result.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.artist?.name?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [activeCategory, search, artworks]);

  const handleBuy = async (artwork) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to purchase artwork.");
      return;
    }
    if (user?.role === "artist") {
      alert("Artists cannot purchase artworks.");
      return;
    }

    setBuyingId(artwork._id);
    try {
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ artworkId: artwork._id })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Artwork purchased successfully!");
      } else {
        alert(data.message || "Purchase failed.");
      }
    } catch (err) {
      alert("Could not connect to server.");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Browse Artworks</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} artworks available</p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or artist..."
            className="w-full sm:w-64 h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-sm">No artworks found.</p>
            <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="mt-3 text-xs text-purple-400 hover:text-purple-300">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((art, idx) => (
              <motion.div
                key={art._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group bg-[#111625] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111625]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#0b0f1a]/70 border border-white/10 text-gray-300 backdrop-blur-sm">
                    {art.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors truncate">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      by <span className="text-gray-400">{art.artist?.name || "Unknown"}</span>
                    </p>
                    {art.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{art.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-base font-bold text-orange-400">${Number(art.price).toFixed(2)}</span>
                    {user?.role === "artist" || art.artist?.email === user?.email ? (
                      <span className="text-xs text-gray-600 italic">Your artwork</span>
                    ) : (
                      <button
                        onClick={() => handleBuy(art)}
                        disabled={buyingId === art._id}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
                      >
                        {buyingId === art._id ? "Buying..." : "Buy Now"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}