"use client";

import { useState } from "react";
import { Input, TextArea, Button, Select, ListBox } from "@heroui/react";
import imageCompression from "browser-image-compression";

const CATEGORIES = ["Digital Art", "Oil Painting", "Abstract", "Sculpture"];

export default function ArtworkForm({ initialData = null, onSubmit, isSubmitting }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [category, setCategory] = useState(initialData?.category || "Digital Art");
  const [file, setFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [compressingImage, setCompressingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  // Handle local file selection, compress it, and set preview
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setCompressingImage(true);

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Local client-side compression error:", error);
    } finally {
      setCompressingImage(false);
    }
  };

  // Upload image to imgBB
  const uploadToImgBB = async (imageFile) => {
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
    if (!IMGBB_API_KEY) {
      console.error("imgBB API key is missing in your .env.local file!");
      return initialData?.image || ""; 
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url; 
    } else {
      throw new Error(data.error?.message || "imgBB upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadingImage(true);

    try {
      let imageUrl = imagePreview;

      if (file) {
        imageUrl = await uploadToImgBB(file);
      }

      await onSubmit({
        title,
        description,
        price: parseFloat(price),
        category,
        imageUrl,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Failed to upload image or save artwork.");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-[#111625]/40 border border-white/5 p-6 rounded-2xl text-left">
      <h2 className="text-xl font-bold text-white tracking-tight">
        {initialData ? "Edit Artwork" : "Add New Artwork"}
      </h2>

      {/* Image Upload Area */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Artwork Image</label>
        <label className="border border-dashed border-white/10 hover:border-[#9353f7]/50 bg-white/[0.01] rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors group relative overflow-hidden h-48">
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          
          {imagePreview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
          ) : null}

          <div className="relative z-10 flex flex-col items-center gap-1">
            <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
              {compressingImage ? "Optimizing image weights..." : file ? file.name : "Click or drop artwork file here"}
            </p>
            <p className="text-[10px] text-gray-500">PNG, JPG, WEBP · Max 32MB</p>
          </div>
        </label>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Title</label>
        <Input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Neon Reverie No. 4"
          className="bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white focus-within:border-[#9353f7]/50"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-400">Description</label>
        <TextArea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the inspiration, medium, or story behind this piece..."
          className="bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white focus-within:border-[#9353f7]/50 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Price (USD)</label>
          <Input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white focus-within:border-[#9353f7]/50"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-400">Category</label>
          <Select placeholder={category} className="w-full">
            <Select.Trigger className="bg-white/[0.02] border border-white/5 rounded-xl h-10 px-3 text-xs text-white flex items-center justify-between w-full hover:bg-white/[0.04]">
              <Select.Value className="text-xs text-white" />
            </Select.Trigger>
            <Select.Popover className="bg-[#111625] border border-white/10 text-white rounded-xl shadow-xl">
              <ListBox
                selectedKeys={new Set([category])}
                onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
                selectionMode="single"
              >
                {CATEGORIES.map((cat) => (
                  <ListBox.Item key={cat} id={cat} textValue={cat} className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                    {cat}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </div>

      {/* Action Button */}
      <Button
        type="submit"
        isLoading={compressingImage || uploadingImage || isSubmitting}
        className="w-full bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 shadow-md transition-colors"
      >
        {compressingImage ? "Compressing canvas..." : uploadingImage ? "Uploading to CDN..." : isSubmitting ? "Saving artwork..." : initialData ? "Update Artwork" : "Publish Artwork"}
      </Button>
    </form>
  );
}