"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useToast } from "@/components/Toast";

const CATEGORIES = ["All", "Digital Art", "Oil Painting", "Abstract", "Sculpture"];
const ITEMS_PER_PAGE = 8;

export default function BrowseArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const fetchArtworks = async () => {
      try {
        const res = await fetch("https://arthub-server-9t9m.onrender.com/api/artworks/public");
        const data = await res.json();
        setArtworks(data);
      } catch (err) {
        addToast("Failed to load artworks.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, search, minPrice, maxPrice, sortBy]);

  const filtered = useMemo(() => {
    let result = [...artworks];
    if (activeCategory !== "All") result = result.filter(a => a.category === activeCategory);
    if (search.trim()) result = result.filter(a =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.artist?.name?.toLowerCase().includes(search.toLowerCase())
    );
    if (minPrice !== "") result = result.filter(a => Number(a.price) >= Number(minPrice));
    if (maxPrice !== "") result = result.filter(a => Number(a.price) <= Number(maxPrice));
    if (sortBy === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "price-low") result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === "price-high") result.sort((a, b) => Number(b.price) - Number(a.price));
    return result;
  }, [artworks, activeCategory, search, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleBuy = async (artwork) => {
    const token = localStorage.getItem("token");
    if (!token) { addToast("Please sign in to purchase artwork.", "warning"); return; }
    if (user?.role === "artist") { addToast("Artists cannot purchase artworks.", "warning"); return; }
    setBuyingId(artwork._id);
    try {
      const res = await fetch("https://arthub-server-9t9m.onrender.com/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ artworkId: artwork._id })
      });
      const data = await res.json();
      if (res.ok) {
        addToast("Artwork purchased successfully!", "success");
      } else {
        addToast(data.message || "Purchase failed.", "error");
      }
    } catch (err) {
      addToast("Could not connect to server.", "error");
    } finally {
      setBuyingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const hasActiveFilters = search || activeCategory !== "All" || minPrice || maxPrice || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">

      {/* Sticky Header */}
      <div className="border-b border-white/5 bg-[#0b0f1a]/90 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Browse Artworks</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {loading ? "Loading..." : `${filtered.length} artworks found`}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or artist..."
                className="w-full h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50 shrink-0"
            >
              <option value="newest" className="bg-[#111625]">Newest</option>
              <option value="price-low" className="bg-[#111625]">Price: Low to High</option>
              <option value="price-high" className="bg-[#111625]">Price: High to Low</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-3 rounded-xl border text-xs font-medium transition-colors shrink-0 ${showFilters ? "bg-purple-600 border-purple-600 text-white" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"}`}
            >
              Filters {hasActiveFilters && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 shrink-0">Price range:</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-24 h-8 pl-6 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <span className="text-gray-600 text-xs">—</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-24 h-8 pl-6 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-rose-400 hover:text-rose-300 transition-colors ml-2">
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {!showFilters && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? "bg-purple-600 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#111625] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-8 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-sm">No artworks found.</p>
            <button onClick={clearFilters} className="mt-3 text-xs text-purple-400 hover:text-purple-300">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginated.map((art, idx) => (
                <motion.div
                  key={art._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="group bg-[#111625] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
                >
                  <Link href={`/artworks/${art._id}`} className="relative w-full aspect-[4/3] overflow-hidden bg-white/5 block">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111625]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#0b0f1a]/70 border border-white/10 text-gray-300 backdrop-blur-sm">
                      {art.category}
                    </span>
                  </Link>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <Link href={`/artworks/${art._id}`}>
                        <h3 className="font-bold text-sm text-gray-100 group-hover:text-white transition-colors truncate hover:text-purple-300">
                          {art.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        by <span className="text-gray-400">{art.artist?.name || "Unknown"}</span>
                      </p>
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl text-xs font-medium transition-colors ${currentPage === page ? "bg-purple-600 text-white" : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20"}`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (Math.abs(page - currentPage) === 2) {
                      return <span key={page} className="text-gray-600 text-xs px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <p className="text-center text-xs text-gray-600 mt-3">
                Page {currentPage} of {totalPages} · {filtered.length} total artworks
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}