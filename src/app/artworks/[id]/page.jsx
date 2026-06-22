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
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentMsg, setCommentMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchArtwork();
    fetchComments(); // Added this so comments actually load when entering the page!
  }, [id]);

  useEffect(() => {
    if (user) checkPurchase();
  }, [user, id]);

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/artworks/${id}`);
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
    const res = await fetch("https://arthub-server-9t9m.onrender.com/api/payments/artwork", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ artworkId: id })
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url; // Redirect to Stripe Checkout
    } else {
      setBuyMsg({ type: "error", text: data.message || "Failed to start checkout." });
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
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/artworks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        router.push("/dashboard/artist/my-artworks");
      } else {
       addToast("Failed to delete artwork.", "error");
      }
    } catch (err) {
      addToast("Could not connect to server.", "error");
    } finally {
      setDeleting(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/artworks/${id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const checkPurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;
    try {
      const res = await fetch("https://arthub-server-9t9m.onrender.com/api/sales/user", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const purchases = await res.json();
      const purchased = purchases.some(p => p.artworkId?.toString() === id);
      setHasPurchased(purchased);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    setCommentMsg({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/artworks/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ comment: newComment })
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => [data, ...prev]);
        setNewComment("");
        setCommentMsg({ type: "success", text: "Comment posted!" });
      } else {
        setCommentMsg({ type: "error", text: data.message });
      }
    } catch (err) {
      setCommentMsg({ type: "error", text: "Failed to post comment." });
    } finally {
      setPostingComment(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ comment: editText })
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, comment: editText, updatedAt: new Date() } : c));
        setEditingId(null);
        setEditText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://arthub-server-9t9m.onrender.com/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error(err);
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
                <p className="text-2xl font-bold text-orange-400">${OriginalPrice => Number(artwork.price).toFixed(2)}</p>
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

      {/* Comments Section */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="border-t border-white/5 pt-10">
          <h2 className="text-xl font-bold text-white mb-2">
            Comments
            {comments.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({comments.length})</span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mb-8">Only buyers of this artwork can leave comments.</p>

          {/* Comment Form */}
          {user && hasPurchased && (
            <div className="mb-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
              <p className="text-xs text-gray-400 mb-3 font-medium">Leave a comment</p>
              {commentMsg.text && (
                <div className={`mb-3 p-2.5 rounded-xl text-xs ${commentMsg.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                  {commentMsg.text}
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this artwork..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/60 transition-all resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handlePostComment}
                  disabled={postingComment || !newComment.trim()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {postingComment ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          )}

          {/* Not purchased notice */}
          {user && !hasPurchased && !isOwner && (
            <div className="mb-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-400">Purchase this artwork to leave a comment.</p>
            </div>
          )}

          {/* Not logged in notice */}
          {!user && (
            <div className="mb-8 bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-center">
              <p className="text-sm text-gray-400">
                <Link href="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link> and purchase this artwork to comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {commentsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/5" />
                    <div className="h-3 bg-white/5 rounded w-32" />
                  </div>
                  <div className="h-3 bg-white/5 rounded w-full mb-2" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {c.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{c.userName}</p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {c.updatedAt && <span className="ml-1 text-gray-600">(edited)</span>}
                        </p>
                      </div>
                    </div>

                    {/* Edit/Delete for own comments */}
                    {user?.email === c.userEmail && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setEditingId(c._id); setEditText(c.comment); }}
                          className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="text-xs text-gray-500 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment text or edit form */}
                  {editingId === c._id ? (
                    <div className="mt-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/60 transition-all resize-none"
                      />
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => { setEditingId(null); setEditText(""); }}
                          className="px-4 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(c._id)}
                          className="px-4 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 mt-3 leading-relaxed">{c.comment}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}