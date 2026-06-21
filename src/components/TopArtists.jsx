"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Avatar } from "@heroui/react";

export default function TopArtists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/artists/top");
        const data = await res.json();
        setArtists(data);
      } catch (err) {
        console.error("Failed to fetch top artists", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopArtists();
  }, []);

  return (
    <section className="w-full bg-[#0b0f1a] text-white py-16 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Top Artists
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Creators with the highest sales and global collectors this month
            </p>
          </div>
          <Link
            href="/artists"
            className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            See all creators →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
        ) : artists.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400 text-sm">No artists yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artists.map((artist, idx) => (
              <motion.div
                key={artist.email}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full relative group"
              >
                <Card className="w-full h-full relative flex flex-row items-center gap-4 bg-[#111625] border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-300 shadow-lg text-white">

                  {/* Rank */}
                  <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-600/20 group-hover:border-purple-500/40 transition-all duration-300 z-20">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-purple-400">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar
                    isBordered
                    color="secondary"
                    radius="full"
                    name={artist.name}
                    className="w-14 h-14 text-large flex-shrink-0 border-purple-500/30 z-10"
                  />

                  {/* Info */}
                  <div className="space-y-1 pr-6 z-10 text-left">
                    <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-xs text-gray-400">{artist.email}</p>
                    <div className="pt-1 flex items-center gap-2">
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {artist.totalSales} sales
                      </span>
                      <span className="text-xs text-gray-500">
                        ${artist.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}