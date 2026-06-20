"use client";

import { useState } from "react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    max: 3,
    description: "Get started with ArtHub",
    features: ["Up to 3 artwork purchases", "Browse all artworks", "Basic collection view"],
    color: "border-white/10",
    badge: null,
    current: true
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/ month",
    max: 9,
    description: "For growing collectors",
    features: ["Up to 9 artwork purchases", "Priority support", "Collection analytics"],
    color: "border-purple-500/50",
    badge: "Popular",
    current: false
  },
  {
    name: "Premium",
    price: "$19.99",
    period: "/ month",
    max: null,
    description: "For serious collectors",
    features: ["Unlimited purchases", "Early access to new art", "Dedicated support", "Advanced analytics"],
    color: "border-amber-500/50",
    badge: "Best Value",
    current: false
  }
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = (tierName) => {
    setLoading(tierName);
    // Stripe integration will go here later
    setTimeout(() => {
      alert(`Stripe payment for ${tierName} plan coming soon!`);
      setLoading(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-5xl mx-auto border-b border-white/5 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Subscription</h1>
        <p className="text-sm text-gray-400 mt-1.5">Choose a plan that fits your collecting style.</p>
      </div>

      {/* Current Plan Banner */}
      <div className="max-w-5xl mx-auto bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">You're on the Free plan</p>
          <p className="text-xs text-gray-400 mt-0.5">You can purchase up to 3 artworks. Upgrade to unlock more.</p>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white/[0.01] border ${tier.color} rounded-2xl p-6 flex flex-col gap-5 transition-all hover:border-opacity-80`}
          >
            {tier.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                {tier.badge}
              </span>
            )}

            <div>
              <h3 className="text-base font-bold text-white">{tier.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{tier.description}</p>
            </div>

            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-white">{tier.price}</span>
              <span className="text-xs text-gray-500 mb-1">{tier.period}</span>
            </div>

            <div className="text-xs text-gray-400 font-medium">
              {tier.max ? `Up to ${tier.max} purchases` : "Unlimited purchases"}
            </div>

            <ul className="space-y-2 flex-1">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                  <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !tier.current && handleUpgrade(tier.name)}
              disabled={tier.current || loading === tier.name}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                tier.current
                  ? "bg-white/5 text-gray-500 cursor-default"
                  : tier.name === "Premium"
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {tier.current ? "Current Plan" : loading === tier.name ? "Loading..." : `Upgrade to ${tier.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}