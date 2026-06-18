"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function MyArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyArtworks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/artworks"); 
        const data = await response.json();
        
        if (response.ok) {
          setArtworks(data);
        }
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyArtworks();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this masterpiece?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/artworks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setArtworks((prev) => prev.filter((item) => item._id !== id));
        alert("Artwork deleted successfully.");
      } else {
        alert("Failed to delete artwork.");
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 text-left">
      {/* Top Bar Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Manage Artworks</h1>
          <p className="text-xs text-gray-400">Track, edit, or remove your published canvas listings.</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/artist/upload-artwork")}
          className="bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 px-4"
        >
          + Add New Piece
        </Button>
      </div>

      {/* Main Table Layer */}
      <div className="bg-[#111625]/40 border border-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-gray-400 font-semibold text-xs border-b border-white/5">
              <th className="py-3 px-4 font-semibold text-[11px] tracking-wider text-gray-400">ARTWORK</th>
              <th className="py-3 px-4 font-semibold text-[11px] tracking-wider text-gray-400">CATEGORY</th>
              <th className="py-3 px-4 font-semibold text-[11px] tracking-wider text-gray-400">PRICE (USD)</th>
              <th className="py-3 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center">ACTIONS</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-xs text-gray-500">
                  Loading collections...
                </td>
              </tr>
            ) : artworks.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-xs text-gray-500">
                  No artworks published yet.
                </td>
              </tr>
            ) : (
              artworks.map((artwork) => (
                <tr key={artwork._id} className="hover:bg-white/[0.01] transition-colors group text-xs text-gray-300">
                  
                  {/* Artwork Column */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={artwork.imageUrl} 
                        alt={artwork.title || "Artwork preview"} 
                        className="w-10 h-10 object-cover rounded-xl border border-white/10 flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-medium text-xs truncate">{artwork.title}</span>
                        <span className="text-[10px] text-gray-500 line-clamp-1 max-w-[250px] mt-0.5">{artwork.description}</span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Category Column */}
                  <td className="py-4 px-4 align-middle">
                    <span className="px-2 py-0.5 bg-white/[0.04] border border-white/5 rounded-md text-[10px] text-gray-400">
                      {artwork.category}
                    </span>
                  </td>
                  
                  {/* Price Column */}
                  <td className="py-4 px-4 font-medium text-white align-middle">
                    ${parseFloat(artwork.price || 0).toFixed(2)}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => router.push(`/dashboard/artist/edit-artwork/${artwork._id}`)}
                        className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-gray-300 text-[11px] rounded-lg h-8 px-3"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => handleDelete(artwork._id)}
                        className="bg-danger/10 hover:bg-danger/20 text-danger text-[11px] rounded-lg h-8 px-3"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}