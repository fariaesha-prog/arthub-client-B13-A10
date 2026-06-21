"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ArtworkDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [artwork, setArtwork] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [buying, setBuying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [buyMsg, setBuyMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchArtwork();
  }, [id]);

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`);
      if (res.status === 404) { setNotFound(true); return; }
      const data = await res.json();
      setArtwork(data);
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    setBuying(true);
    setBuyMsg({ type: "", text: "" });
    try {
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ artworkId: id })
      });
      const data = await res.json();
      if (res.ok) {
        setBuyMsg({ type: "success", text: "Artwork purchased successfully! Check your collection." });
      } else {
        setBuyMsg({ type: "error", text: data.message || "Purchase failed." });
      }
    } catch (err) {
      setBuyMsg({ type: "error", text: "Could not connect to server." });
    } finally {
      setBuying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        router.push("/dashboard/artist/my-artworks");
      } else {
        alert("Failed to delete artwork.");
      }
    } catch (err) {
      alert("Could not connect to server.");
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = user && artwork && user.email === artwork.artist?.email;
  const isUser = user?.role === "user";
  const isGuest = !user;

  // Loading skeleton
  if (loading) return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded-xl animate-pulse w-3/4" />
          <div className="h-4 bg-white/5 rounded-xl animate-pulse w-1/4" />
          <div className="h-24 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-12 bg-white/5 rounded-xl animate-pulse w-1/3" />
        </div>
      </div>
    </div>
  );

  // Not found
  if (notFound) return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2">
        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Artwork not found</h1>
      <p className="text-gray-400 text-sm">This artwork may have been removed or doesn't exist.</p>
      <Link href="/browse" className="mt-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
        Browse Artworks
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Category badge */}
            <span className="self-start text-[10px] font-semibold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              {artwork.category}
            </span>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{artwork.title}</h1>
              <p className="text-sm text-gray-400 mt-2">
                by{" "}
                <Link
                  href={`/browse?artist=${artwork.artist?.email}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {artwork.artist?.name || "Unknown Artist"}
                </Link>
              </p>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <p className="text-sm text-gray-300 leading-relaxed">{artwork.description}</p>
              </div>
            )}

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Price</p>
                <p className="text-2xl font-bold text-orange-400">${Number(artwork.price).toFixed(2)}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Uploaded</p>
                <p className="text-sm text-white font-medium">
                  {new Date(artwork.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            {/* Buy message */}
            {buyMsg.text && (
              <div className={`p-3 rounded-xl text-sm ${buyMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
                {buyMsg.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Owner controls */}
              {isOwner && (
                <div className="flex gap-3">
                  <Link
                    href={`/dashboard/artist/edit/${id}`}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-xl transition-colors text-center"
                  >
                    Edit Artwork
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete Artwork"}
                  </button>
                </div>
              )}

              {/* Buy button for users */}
              {!isOwner && (
                <>
                  {isGuest ? (
                    <Link
                      href="/login"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
                    >
                      Sign in to Purchase
                    </Link>
                  ) : isUser ? (
                    <button
                      onClick={handleBuy}
                      disabled={buying || buyMsg.type === "success"}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      {buying ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : buyMsg.type === "success" ? "Purchased ✓" : `Buy Now · $${Number(artwork.price).toFixed(2)}`}
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-white/5 border border-white/10 text-gray-500 text-sm font-semibold rounded-xl text-center cursor-not-allowed">
                      Artists cannot purchase artworks
                    </div>
                  )}
                </>
              )}

              <Link
                href="/browse"
                className="w-full py-3 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-sm font-semibold rounded-xl transition-colors text-center"
              >
                Browse More Artworks
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}