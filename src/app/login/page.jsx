"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { authClient } from "@/lib/auth-client"; 

const EyeIcon = ({ visible }) => (
  visible ? (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.4m3.045-1.908A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.4M9.9 9.9l4.2 4.2m0-4.2l-4.2 4.2" />
    </svg>
  )
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000";
  const GOOGLE_CLIENT_ID = "1008811192795-b75hk9kdaipvgglsknmebu50jlofsslt.apps.googleusercontent.com";

  const handleGoogleCallback = async (response) => {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      authClient.setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(data.user.role?.toLowerCase() === "artist" ? "/dashboard/artist/overview" : "/");
      router.refresh();
    } catch (err) { setError("Google authentication failed."); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      authClient.setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
window.dispatchEvent(new Event("storage"));
      const routes = { admin: "/admin/dashboard", artist: "/dashboard/artist/overview", user: "/" };
      router.push(routes[data.user.role?.toLowerCase()] || "/");
      router.refresh();
    } catch (err) { setError(err.message || "Login failed."); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, []);

  return (
    <main className="w-full min-h-[90vh] bg-[#0b0f1a] text-white flex items-center justify-center px-4">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCallback,
          });
          window.google.accounts.id.renderButton(
            document.getElementById("google-signin-btn"),
            { theme: "outline", size: "large", width: "100%" }
          );
        }}
      />
      <div className="w-full max-w-md bg-[#111625] border border-white/5 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        {error && <div className="mb-4 p-3 bg-rose-500/10 text-rose-400 text-xs rounded-xl">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" required onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border rounded-xl" />
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" required onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 bg-white/5 border rounded-xl" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3"><EyeIcon visible={showPassword} /></button>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 rounded-xl">{loading ? "Signing In..." : "Sign In"}</button>
        </form>
        <div id="google-signin-btn" className="mt-5 w-full flex justify-center"></div>
      </div>
    </main>
  );
}