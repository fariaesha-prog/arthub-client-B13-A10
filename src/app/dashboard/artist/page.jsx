"use client";

import { useState } from "react";
import { Card, Input, Button, Select, ListBox } from "@heroui/react";

// --- MOCK DATA ---
const STATS_DATA = [
  {
    title: "Total earnings",
    value: "$12,480",
    trend: "24% this month",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  {
    title: "Total sales",
    value: "142",
    trend: "12% this month",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
  },
  {
    title: "Profile views",
    value: "28.4K",
    trend: "18% this month",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  },
  {
    title: "Published works",
    value: "18",
    trend: "Published works",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  }
];

const REVENUE_DATA = [
  { month: "Jan", amount: 2200 },
  { month: "Feb", amount: 3100 },
  { month: "Mar", amount: 1800 },
  { month: "Apr", amount: 4100 },
  { month: "May", amount: 2900 },
  { month: "Jun", amount: 5600, isCurrent: true },
];

export default function ArtistDashboard() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Digital Art");
  const [file, setFile] = useState(null);

  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.amount), 1);

  return (
    <div className="space-y-8 p-1">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Artist Studio</h1>
          <p className="text-xs text-gray-400 mt-0.5">Aria Nakamura · 18 artworks published</p>
        </div>
        <Button 
          className="bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 px-4 self-start sm:self-auto"
        >
          Upload new
        </Button>
      </div>

      {/* 2. Top Stats Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_DATA.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-400 tracking-wide">{stat.title}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl flex-shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon />
                </div>
              </div>
              <div className="mt-4 text-xs font-medium">
                <span className={idx === 3 ? "text-gray-500" : "text-emerald-400"}>
                  {idx !== 3 && "↑ "} {stat.trend}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Operational Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Monthly Revenue Chart */}
        <div className="lg:col-span-2">
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Monthly revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months · $12,480 total</p>
            </div>

            <div className="flex items-end justify-between gap-3 pt-12 pb-2 h-52 w-full">
              {REVENUE_DATA.map((item, idx) => {
                const heightPercent = (item.amount / maxRevenue) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ease-out origin-bottom ${
                        item.isCurrent 
                          ? "bg-[#9353f7] shadow-[0_0_25px_rgba(147,83,247,0.3)]" 
                          : "bg-[#252243] group-hover:bg-[#322d5a]"
                      }`}
                    />
                    <span className={`text-xs font-medium ${item.isCurrent ? "text-[#9353f7] font-semibold" : "text-gray-500"}`}>
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Quick Upload Form */}
        <div>
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-white tracking-tight">Quick Upload</h3>
              
              <label className="border border-dashed border-white/10 hover:border-[#9353f7]/50 bg-white/[0.01] rounded-xl p-6 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                  {file ? file.name : "Drop artwork file here"}
                </p>
                <p className="text-[10px] text-gray-500">PNG, JPG, SVG · Max 50MB</p>
              </label>

              {/* Title Field Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-gray-400">Title</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Neon Reverie No. 4"
                  variant="flat"
                  className="w-full h-10 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white"
                />
              </div>

              {/* Price Field Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-gray-400">Price (USD)</label>
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$0.00"
                  variant="flat"
                  className="w-full h-10 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white"
                />
              </div>

              {/* Category Select Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-gray-400">Category</label>
                <Select
                  placeholder={category || "Select a category"}
                  className="w-full"
                >
                  <Select.Trigger className="bg-white/[0.02] border border-white/5 rounded-xl h-10 px-3 text-xs text-white flex items-center justify-between w-full hover:bg-white/[0.04]">
                    <Select.Value className="text-xs text-white" />
                  </Select.Trigger>
                  <Select.Popover className="bg-[#111625] border border-white/10 text-white rounded-xl shadow-xl">
                    <ListBox 
                      selectedKeys={new Set([category])}
                      onSelectionChange={(keys) => setCategory(Array.from(keys)[0])}
                      selectionMode="single"
                    >
                      <ListBox.Item id="Digital Art" textValue="Digital Art" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Digital Art</ListBox.Item>
                      <ListBox.Item id="Oil Painting" textValue="Oil Painting" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Oil Painting</ListBox.Item>
                      <ListBox.Item id="Abstract" textValue="Abstract" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Abstract</ListBox.Item>
                      <ListBox.Item id="Sculpture" textValue="Sculpture" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Sculpture</ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>
            </div>

            <Button
              className="w-full bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 mt-6 shadow-md transition-colors"
            >
              Publish artwork
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}