"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import ArtworkForm from "@/app/dashboard/artist/components/ArtworkForm";
import { UploadCloud, Sparkles, ImageIcon } from "lucide-react";
 
export default function UploadArtworkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleAddArtwork = async (formData) => {
    // 🔍 Guard block to ensure image is optimized and uploaded to CDN first
    if (!formData.imageUrl || formData.imageUrl.trim() === "") {
      alert("Please select and wait for your artwork image file to finish optimization before publishing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("https://arthub-server-9t9m.onrender.com/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 💡 Added your auth token so the backend can verify the artist session!
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Artwork published successfully!");
        router.push("/dashboard/artist/my-artworks"); 
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to save artwork to backend database.");
      }
    } catch (error) {
      console.error("Backend submission error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              New Release
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Create New Release
            </h1>
            <p className="text-sm text-gray-400 mt-1.5">
              Fill in the details below to deploy your latest masterpiece onto the platform catalog.
            </p>
          </div>
 
          {/* Subtle Status Indicator */}
          {isSubmitting && (
            <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Uploading metadata...
            </div>
          )}
        </div>
      </div>
 
      {/* Helper stat strip — mirrors Overview's card language */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-3 hover:border-purple-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">File formats</p>
            <p className="text-sm font-semibold text-white">PNG, JPG, WEBP</p>
          </div>
        </div>
 
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-3 hover:border-purple-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Max file size</p>
            <p className="text-sm font-semibold text-white">32MB</p>
          </div>
        </div>
 
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-3 hover:border-purple-500/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Review time</p>
            <p className="text-sm font-semibold text-white">Instant publish</p>
          </div>
        </div>
      </div>
 
      {/* Form Content Wrapper */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shrink-0">
              <UploadCloud className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Add New Artwork</h2>
              <p className="text-xs text-gray-500">All fields are saved as a draft until published</p>
            </div>
          </div>
 
          <ArtworkForm onSubmit={handleAddArtwork} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
}