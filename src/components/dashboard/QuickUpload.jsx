"use client";

import { useState } from "react";
import { Card, Input, Button } from "@heroui/react";

export default function QuickUpload() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Digital Art");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, price, category, file });
    // Execute your backend API upload route handling here
  };

  return (
    <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl text-left h-full">
      <h3 className="text-base font-semibold text-white tracking-tight mb-4">Quick Upload</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full justify-between">
        <div className="space-y-4">
          {/* Drag & Drop File Upload Container */}
          <label className="border border-dashed border-white/10 hover:border-purple-500/50 bg-white/[0.02] rounded-xl p-6 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors group">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
              {file ? file.name : "Drop artwork file here"}
            </p>
            <p className="text-[10px] text-gray-500">
              PNG, JPG, SVG · Max 50MB
            </p>
          </label>

          {/* Title Field Container */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Title</label>
            <Input
              type="text"
              value={title}
              onValueChange={setTitle}
              placeholder="e.g. Neon Reverie No. 4"
              classNames={{
                input: "text-xs placeholder-gray-600 text-white",
                inputWrapper: "bg-white/[0.03] border border-white/5 rounded-xl h-10 focus-within:!border-purple-500/50",
              }}
            />
          </div>

          {/* Price Field Container */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Price (USD)</label>
            <Input
              type="text"
              value={price}
              onValueChange={setPrice}
              placeholder="$0.00"
              classNames={{
                input: "text-xs placeholder-gray-600 text-white",
                inputWrapper: "bg-white/[0.03] border border-white/5 rounded-xl h-10 focus-within:!border-purple-500/50",
              }}
            />
          </div>

          {/* Category Dropdown Container */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl h-10 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer"
              >
                <option value="Digital Art" className="bg-[#111625]">Digital Art</option>
                <option value="Oil Painting" className="bg-[#111625]">Oil Painting</option>
                <option value="Abstract" className="bg-[#111625]">Abstract</option>
                <option value="Sculpture" className="bg-[#111625]">Sculpture</option>
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">▼</span>
            </div>
          </div>
        </div>

        {/* Submit Execution Trigger Button */}
        <Button
          type="submit"
          className="w-full bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 mt-4 shadow-lg shadow-purple-900/10 transition-colors"
        >
          Publish artwork
        </Button>
      </form>
    </Card>
  );
}