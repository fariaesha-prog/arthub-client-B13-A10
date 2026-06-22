"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const type = searchParams.get("type");
    const tier = searchParams.get("tier");

    if (!sessionId) { router.push("/"); return; }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ sessionId, type })
        });
        const data = await res.json();

        if (res.ok) {
          if (type === "subscription") {
            // Update localStorage with new tier
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...user, subscriptionTier: tier }));
            setMessage(`You've upgraded to ${tier.charAt(0).toUpperCase() + tier.slice(1)}!`);
          } else {
            setMessage("Your artwork has been added to your collection!");
          }
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Could not verify payment.");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 max-w-md text-center"
      >
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-xl font-bold text-white">Verifying payment...</h2>
            <p className="text-sm text-gray-400">Please wait while we confirm your payment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
              <p className="text-sm text-gray-400">{message}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/dashboard/user/collection"
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors text-center"
              >
                View My Collection
              </Link>
              <Link
                href="/browse"
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-semibold rounded-xl transition-colors text-center"
              >
                Browse More
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
              <p className="text-sm text-gray-400">{message}</p>
            </div>
            <Link href="/browse" className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Go Back
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}