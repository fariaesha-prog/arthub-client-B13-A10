"use client";

import { useState, useEffect } from "react"; // 🔥 Added useEffect here
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script"; // 🔥 Added Next.js Script to load Google SDK
import { authClient } from "@/lib/auth-client"; // 🔥 Imported to manage cookie/local storage token mapping

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // 'user' (Buyer) or 'artist'
  });
  
  // Visibility states for password inputs
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://arthub-server-9t9m.onrender.com";
  const GOOGLE_CLIENT_ID = "1008811192795-b75hk9kdaipvgglsknmebu50jlofsslt.apps.googleusercontent.com";

  // 🔥 Callback function for when a user selects their Google account
  const handleGoogleCallback = async (response) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Google registration failed.");
        return;
      }

      console.log("Google Account authentication completely successful!");
      authClient.setToken(data.token);

      if (data.user.role?.toLowerCase() === "artist") {
        router.push("/artist/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError("Unable to connect to the authentication server via Google.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Initialize the Google Identity element on mounted load states
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "filled_dark", size: "large", width: "382", text: "signup_with" }
      );
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Hit your standalone Express backend endpoint directly
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      console.log("Registered successfully and logging user in instantly!");
      
      // 🔥 1. Capture and save the token automatically so they don't have to sign in manually
      authClient.setToken(data.token);

      // 🔥 2. Perform role-based routing layout drops seamlessly
      switch (data.user.role?.toLowerCase()) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "artist":
          router.push("/artist/dashboard");
          break;
        case "user":
        default:
          router.push("/"); // Direct normal collector home instantly
          break;
      }
      
      router.refresh();
    } catch (err) {
      setError("Unable to connect to the authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Shared Eye/Eye-Slash Icon Component for cleaner code
  const EyeIcon = ({ visible }) => (
    visible ? (
      /* Eye Open Icon */
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      /* Eye Closed (Slash) Icon */
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.4m3.045-1.908A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.4M9.9 9.9l4.2 4.2m0-4.2l-4.2 4.2" />
      </svg>
    )
  );

  return (
    <main className="w-full min-h-[90vh] bg-[#0b0f1a] text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 🔥 Async Script mounting loader block for Google Infrastructure API */}
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={() => {
          if (window.google) {
            window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleGoogleCallback,
            });
            window.google.accounts.id.renderButton(
              document.getElementById("google-signup-btn"),
              { theme: "filled_dark", size: "large", width: "382", text: "signup_with" }
            );
          }
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#111625] border border-white/5 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
        
        {/* Header Block */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-2xl font-bold bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent mb-2">
            ArtHub
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Create an account
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Join our curated community of digital creators and collectors
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Custom Role Selector Toggle Cards */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("user")}
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  formData.role === "user"
                    ? "bg-purple-600/10 border-purple-500 text-purple-400 font-semibold shadow-md"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm">Buyer / Collector</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("artist")}
                className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                  formData.role === "artist"
                    ? "bg-purple-600/10 border-purple-500 text-purple-400 font-semibold shadow-md"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm">Artist / Creator</span>
              </button>
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Email Address Input */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Password Input (With Toggle) */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pr-12 pl-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon visible={showPassword} />
              </button>
            </div>
          </div>

          {/* Confirm Password Input (With Toggle) */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pr-12 pl-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors p-1"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <EyeIcon visible={showConfirmPassword} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-xl transition-all duration-300 shadow-lg shadow-purple-900/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none pt-2.5"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Divider Layout Line */}
        <div className="relative my-5 text-center">
          <hr className="border-white/5" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111625] px-3 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
            or
          </span>
        </div>

        {/* 🔥 Mount target container for the Google secure client iframe */}
        <div className="flex justify-center w-full">
          <div id="google-signup-btn" className="w-full transition-all duration-300"></div>
        </div>

        {/* Back Link Toggle */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}