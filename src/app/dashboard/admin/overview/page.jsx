"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CATEGORY_COLORS = ["#9353f7", "#f97316", "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const STATS = analytics ? [
    { title: "Total Users", value: analytics.totalUsers, iconBg: "bg-purple-500/10", iconColor: "text-purple-400", icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { title: "Total Artists", value: analytics.totalArtists, iconBg: "bg-amber-500/10", iconColor: "text-amber-400", icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg> },
    { title: "Total Artworks", value: analytics.totalArtworks, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { title: "Total Revenue", value: `$${analytics.totalRevenue.toFixed(2)}`, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400", icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ] : [];

  const maxRevenue = analytics ? Math.max(...analytics.salesByMonth.map(m => m.amount), 1) : 1;
  const totalCategoryCount = analytics ? analytics.artworksByCategory.reduce((sum, c) => sum + c.count, 0) : 0;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Admin Analytics</h1>
        <p className="text-sm text-gray-400 mt-1.5">Platform-wide overview and performance metrics.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111625]/40 border border-white/5 rounded-2xl h-28 animate-pulse" />
        )) : STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 tracking-wide">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl flex-shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full">
            <h3 className="text-base font-semibold text-white mb-1">Monthly Sales Revenue</h3>
            <p className="text-xs text-gray-400 mb-6">Last 6 months platform revenue</p>
            {loading ? (
              <div className="h-48 animate-pulse bg-white/5 rounded-xl" />
            ) : (
              <div className="flex items-end justify-between gap-3 pb-2 h-48 w-full">
                {analytics.salesByMonth.map((item, idx) => {
                  const heightPercent = (item.amount / maxRevenue) * 100;
                  const isCurrentMonth = item.month === MONTH_NAMES[new Date().getMonth()];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1f35] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap z-10">
                        ${item.amount.toFixed(0)}
                      </div>
                      <div
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        className={`w-full rounded-t-xl transition-all duration-500 ${isCurrentMonth ? "bg-[#9353f7] shadow-[0_0_20px_rgba(147,83,247,0.3)]" : "bg-[#252243] group-hover:bg-[#322d5a]"}`}
                      />
                      <span className={`text-[10px] font-medium ${isCurrentMonth ? "text-purple-400" : "text-gray-500"}`}>{item.month}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl h-full">
            <h3 className="text-base font-semibold text-white mb-1">Artworks by Category</h3>
            <p className="text-xs text-gray-400 mb-6">Distribution across categories</p>
            {loading ? (
              <div className="h-48 animate-pulse bg-white/5 rounded-xl" />
            ) : analytics.artworksByCategory.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">No data yet</div>
            ) : (
              <div className="space-y-3">
                {analytics.artworksByCategory.map((cat, idx) => {
                  const pct = totalCategoryCount > 0 ? Math.round((cat.count / totalCategoryCount) * 100) : 0;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-300">{cat.name}</span>
                        <span className="text-xs text-gray-500">{cat.count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}