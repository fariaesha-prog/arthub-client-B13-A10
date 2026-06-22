"use client";

import { useState, useEffect } from "react";
import { Card, Input, Button, Select, ListBox, Form } from "@heroui/react";
import { useRouter } from "next/navigation";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ArtistDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalEarnings: 0, totalSales: 0, publishedWorks: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Digital Art");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [salesRes, artworksRes] = await Promise.all([
        fetch("https://arthub-server-9t9m.onrender.com/api/sales/artist", {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch("https://arthub-server-9t9m.onrender.com/api/artworks", {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      const sales = await salesRes.json();
      const artworks = await artworksRes.json();

      // Calculate stats
      const totalEarnings = sales.reduce((sum, s) => sum + s.price, 0);
      const totalSales = sales.length;
      const publishedWorks = artworks.length;

      setStats({ totalEarnings, totalSales, publishedWorks });

      // Build last 6 months revenue
      const now = new Date();
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        return { month: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), monthIndex: d.getMonth(), amount: 0 };
      });

      sales.forEach((sale) => {
        const saleDate = new Date(sale.purchasedAt);
        const match = last6Months.find(
          m => m.monthIndex === saleDate.getMonth() && m.year === saleDate.getFullYear()
        );
        if (match) match.amount += sale.price;
      });

      const currentMonth = MONTH_NAMES[now.getMonth()];
      setRevenueData(last6Months.map(m => ({ ...m, isCurrent: m.month === currentMonth && m.year === now.getFullYear() })));
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.amount), 1);

  const STATS_CARDS = [
    {
      title: "Total earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      trend: "All time earnings",
      iconBg: "bg-purple-500/10", iconColor: "text-purple-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Total sales",
      value: stats.totalSales.toString(),
      trend: "All time sales",
      iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
    {
      title: "Published works",
      value: stats.publishedWorks.toString(),
      trend: "Total artworks",
      iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      title: "Avg. sale price",
      value: stats.totalSales > 0 ? `$${(stats.totalEarnings / stats.totalSales).toFixed(2)}` : "$0.00",
      trend: "Per artwork sold",
      iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    }
  ];

  return (
    <div className="space-y-8 p-1">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Artist Studio</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.name} · {stats.publishedWorks} artworks published
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/artist/upload-artwork")}
          className="bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 px-4 self-start sm:self-auto"
        >
          Upload new
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#111625]/40 border border-white/5 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_CARDS.map((stat, idx) => {
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
                  <span className="text-gray-500">{stat.trend}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Revenue Chart + Quick Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">Monthly revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Last 6 months · ${stats.totalEarnings.toFixed(2)} total
              </p>
            </div>
            <div className="flex items-end justify-between gap-3 pt-12 pb-2 h-52 w-full">
              {revenueData.map((item, idx) => {
                const heightPercent = maxRevenue > 0 ? (item.amount / maxRevenue) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <div
                      style={{ height: `${Math.max(heightPercent, 4)}%` }}
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

        {/* Quick Upload */}
        <div>
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full flex flex-col justify-between">
            <Form onSubmit={(e) => { e.preventDefault(); router.push("/dashboard/artist/upload-artwork"); }} className="space-y-4 w-full flex flex-col justify-between h-full">
              <div className="space-y-4 w-full">
                <h3 className="text-base font-semibold text-white tracking-tight">Quick Upload</h3>
                <label className="border border-dashed border-white/10 hover:border-[#9353f7]/50 bg-white/[0.01] rounded-xl p-6 flex flex-col items-center justify-center gap-1 text-center cursor-pointer transition-colors group w-full">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                  <p className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                    {file ? file.name : "Drop artwork file here"}
                  </p>
                  <p className="text-[10px] text-gray-500">PNG, JPG, SVG · Max 50MB</p>
                </label>
                <div className="space-y-1.5 text-left w-full">
                  <label className="text-xs font-medium text-gray-400">Title</label>
                  <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Neon Reverie No. 4" classNames={{ input: "text-xs placeholder-gray-600 text-white", inputWrapper: "bg-white/[0.02] border border-white/5 rounded-xl h-10 focus-within:!border-[#9353f7]/50 data-[hover=true]:border-white/10" }} />
                </div>
                <div className="space-y-1.5 text-left w-full">
                  <label className="text-xs font-medium text-gray-400">Price (USD)</label>
                  <Input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$0.00" classNames={{ input: "text-xs placeholder-gray-600 text-white", inputWrapper: "bg-white/[0.02] border border-white/5 rounded-xl h-10 focus-within:!border-[#9353f7]/50 data-[hover=true]:border-white/10" }} />
                </div>
                <div className="space-y-1.5 text-left w-full">
                  <label className="text-xs font-medium text-gray-400">Category</label>
                  <Select placeholder={category || "Select a category"} className="w-full">
                    <Select.Trigger className="bg-white/[0.02] border border-white/5 rounded-xl h-10 px-3 text-xs text-white flex items-center justify-between w-full hover:bg-white/[0.04]">
                      <Select.Value className="text-xs text-white" />
                    </Select.Trigger>
                    <Select.Popover className="bg-[#111625] border border-white/10 text-white rounded-xl shadow-xl">
                      <ListBox selectedKeys={new Set([category])} onSelectionChange={(keys) => setCategory(Array.from(keys)[0])} selectionMode="single">
                        <ListBox.Item id="Digital Art" textValue="Digital Art" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Digital Art</ListBox.Item>
                        <ListBox.Item id="Oil Painting" textValue="Oil Painting" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Oil Painting</ListBox.Item>
                        <ListBox.Item id="Abstract" textValue="Abstract" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Abstract</ListBox.Item>
                        <ListBox.Item id="Sculpture" textValue="Sculpture" className="text-xs text-gray-300 px-3 py-2 cursor-pointer hover:bg-white/5 hover:text-white rounded-lg transition-colors">Sculpture</ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#9353f7] hover:bg-[#8247df] text-white text-xs font-semibold rounded-xl h-10 mt-6 shadow-md transition-colors">
                Publish artwork
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}