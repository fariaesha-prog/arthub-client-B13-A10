"use client";

import StatCard from "@/components/dashboard/StatCard";

// Mock implementation helper components for visual placeholder icons
const EarningsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SalesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
);
const ViewsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const WorksIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

export default function ArtistOverview() {
  const statsData = [
    {
      title: "Total earnings",
      value: "$12,480",
      trend: "24%",
      subtext: "this month",
      isPositive: true,
      icon: EarningsIcon,
      iconBgColor: "bg-purple-500/10",
      iconColor: "text-purple-400"
    },
    {
      title: "Total sales",
      value: "142",
      trend: "12%",
      subtext: "this month",
      isPositive: true,
      icon: SalesIcon,
      iconBgColor: "bg-amber-500/10",
      iconColor: "text-amber-400"
    },
    {
      title: "Profile views",
      value: "28.4K",
      trend: "18%",
      subtext: "this month",
      isPositive: true,
      icon: ViewsIcon,
      iconBgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400"
    },
    {
      title: "Published works",
      value: "18",
      trend: null, // No trend percentage tracking for this item
      subtext: "Published works",
      isPositive: true,
      icon: WorksIcon,
      iconBgColor: "bg-indigo-500/10",
      iconColor: "text-indigo-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Upper Layout Block header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Artist Studio</h1>
        <p className="text-xs text-gray-400 mt-1">Aria Nakamura · 18 artworks published</p>
      </div>

      {/* Grid placement matching your exactly captured four-column flow exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}