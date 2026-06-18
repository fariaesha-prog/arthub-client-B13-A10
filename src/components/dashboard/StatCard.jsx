"use client";

import { Card } from "@heroui/react";

export default function StatCard({ 
  title, 
  value, 
  subtext, 
  trend, 
  isPositive = true, 
  icon: Icon,
  iconBgColor = "bg-purple-500/10",
  iconColor = "text-purple-400"
}) {
  return (
    <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl text-left w-full shadow-md backdrop-blur-md">
      <div className="flex items-start justify-between">
        
        {/* Metric Value & Label Title */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-gray-400 tracking-wide">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {value}
          </h3>
        </div>

        {/* Dynamic Context Icon Block */}
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center`}>
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Optional Trend & Additional Meta Text Layout */}
      {(trend || subtext) && (
        <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm">
          {trend && (
            <span className={`font-semibold flex items-center gap-0.5 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}>
              {isPositive ? "↑" : "↓"} {trend}
            </span>
          )}
          {subtext && (
            <span className="text-gray-500 font-medium">
              {subtext}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}