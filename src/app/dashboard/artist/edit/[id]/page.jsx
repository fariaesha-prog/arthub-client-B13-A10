"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ArtworkForm from "@/app/dashboard/artist/components/ArtworkForm";
import { Sparkles, PencilLine } from "lucide-react";

export default function EditArtworkPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await fetch(`http://https://arthub-server-9t9m.onrender.com/api/artworks/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error("Failed to load artwork", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtwork();
  }, [id]);

  const handleEditArtwork = async (formData) => {
    if (!formData.imageUrl || formData.imageUrl.trim() === "") {
      alert("Please wait for the image to finish uploading before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://https://arthub-server-9t9m.onrender.com/api/artworks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/artist/my-artworks");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update artwork.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mb-3"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to My Artworks
            </button>
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <PencilLine className="w-3 h-3" />
              Editing
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Edit Artwork
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Update your artwork details. Changes go live immediately after saving.
            </p>
          </div>

          {isSubmitting && (
            <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Saving changes...
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shrink-0">
              <PencilLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Update Artwork</h2>
              <p className="text-xs text-gray-500">You can replace the image or update any field below</p>
            </div>
          </div>

          <ArtworkForm
            initialData={initialData}
            onSubmit={handleEditArtwork}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}