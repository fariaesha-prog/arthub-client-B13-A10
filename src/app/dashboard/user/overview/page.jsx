"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserOverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://arthub-server-9t9m.onrender.com/api/sales/user", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = purchases.reduce((sum, p) => sum + p.price, 0);

  const STATS = [
    {
      title: "Total Purchases",
      value: purchases.length.toString(),
      trend: "All time",
      iconBg: "bg-purple-500/10", iconColor: "text-purple-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      trend: "All time",
      iconBg: "bg-amber-500/10", iconColor: "text-amber-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Artworks Owned",
      value: purchases.length.toString(),
      trend: "In your collection",
      iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      title: "Subscription",
      value: "Free",
      trend: "3 purchases max",
      iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400",
      icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-gray-400 mt-1.5">Here's an overview of your art collection and activity.</p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? [...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111625]/40 border border-white/5 rounded-2xl h-28 animate-pulse" />
        )) : STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-400 tracking-wide">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl flex-shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                  <Icon />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">{stat.trend}</p>
            </Card>
          );
        })}
      </div>

      {/* Recent Purchases */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent Purchases</h2>
          <Link href="/dashboard/user/purchases" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all →</Link>
        </div>
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-gray-400 text-sm">No purchases yet.</p>
              <Link href="/browse" className="mt-2 text-xs text-purple-400 hover:text-purple-300">Browse artworks →</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {purchases.slice(0, 5).map((p, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <img src={p.artworkImage} alt={p.artworkTitle} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{p.artworkTitle}</p>
                    <p className="text-xs text-gray-500">by {p.artist?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-orange-400">${Number(p.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-600">{new Date(p.purchasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Browse Artworks", desc: "Discover new pieces", href: "/browse", color: "from-purple-500 to-indigo-500" },
          { label: "My Collection", desc: "View purchased artworks", href: "/dashboard/user/collection", color: "from-amber-500 to-orange-500" },
          { label: "Upgrade Plan", desc: "Get more purchases", href: "/dashboard/user/subscription", color: "from-emerald-500 to-teal-500" }
        ].map((item, idx) => (
          <Link key={idx} href={item.href} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all group">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} mb-3`} />
            <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}