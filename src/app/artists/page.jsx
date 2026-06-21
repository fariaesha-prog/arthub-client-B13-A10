"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Avatar } from "@heroui/react";

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/artists");
        const data = await res.json();
        setArtists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filtered = artists.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">All Artists</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} creators on ArtHub</p>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artists..."
            className="w-full sm:w-64 h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#111625] border border-white/5 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-white/5 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-5 bg-white/5 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-400 text-sm">No artists found.</p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-2 text-xs text-purple-400 hover:text-purple-300">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((artist, idx) => (
              <motion.div
                key={artist.email}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group relative bg-[#111625] border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-lg"
              >
                {/* Rank */}
                {idx < 3 && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-purple-400">#{idx + 1}</span>
                  </div>
                )}

                {/* Avatar */}
                <Avatar
                  isBordered
                  color="secondary"
                  radius="full"
                  name={artist.name}
                  className="w-14 h-14 text-large flex-shrink-0 border-purple-500/30"
                />

                {/* Info */}
                <div className="space-y-1 pr-6 flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-white group-hover:text-purple-300 transition-colors truncate">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{artist.email}</p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {artist.totalSales} sales
                    </span>
                    <span className="text-xs text-gray-500">
                      ${artist.totalRevenue?.toFixed(2)} earned
                    </span>
                  </div>
                </div>

                {/* Browse their art link */}
                <Link
                  href={`/browse?artist=${encodeURIComponent(artist.email)}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${artist.name}'s artworks`}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}