"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Track the logged-in states manually using basic React state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const BACKEND_URL = "http://localhost:5000";
  const userRole = user?.role; 

  // Fires dynamically on initial render and during layout route updates
  useEffect(() => {
    const fetchUserSession = async () => {
      const token = authClient.getToken();
      
      // If there's no custom token saved, don't ping the backend
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          // Token is invalid or expired, clear it out safely
          authClient.clearToken();
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to verify authentication server session:", err);
      }
    };

    fetchUserSession();
  }, [pathname]); // Keeps the sync fresh across route changes

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setMobileOpen(false);
  };

  const handleSignOut = () => {
    // Wipe client storage strings entirely
    authClient.clearToken();
    
    // Reset layout configuration parameters
    setIsLoggedIn(false);
    setUser(null);
    setMobileOpen(false);
    setDashboardOpen(false);
    
    // Send user back to home base
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Artworks", href: "/browse" },
    { name: "Artists", href: "/artists" },
    { name: "Categories", href: "/categories" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="w-full bg-[#0b0f1a] border-b border-white/10 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="bg-linear-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
            ArtHub
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-white transition-colors duration-200 ${
                  pathname === link.href ? "text-white font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Conditional Dashboard Dropdown */}
          {isLoggedIn && userRole && (
            <li className="relative">
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="hover:text-white transition-colors duration-200 flex items-center gap-1"
              >
                Dashboard <span className="text-[10px] text-gray-500">{dashboardOpen ? "▲" : "▼"}</span>
              </button>

              {dashboardOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDashboardOpen(false)} />
                  
                  <div className="absolute top-8 left-0 bg-[#111625] border border-white/10 rounded-xl w-48 shadow-2xl py-1.5 z-20 backdrop-blur-sm">
                    <Link
                      href={`/${userRole}/dashboard`}
                      onClick={() => setDashboardOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Overview
                    </Link>
                    <Link
                      href={`/${userRole}/uploads`}
                      onClick={() => setDashboardOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      My Artworks
                    </Link>
                    <Link
                      href={`/${userRole}/settings`}
                      onClick={() => setDashboardOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Settings
                    </Link>
                  </div>
                </>
              )}
            </li>
          )}
        </ul>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 focus-within:border-purple-500/50 transition-colors"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks..."
            className="bg-transparent outline-none text-xs px-1 w-44 lg:w-56 text-white placeholder-gray-500"
          />
          <button type="submit" aria-label="Run search" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Auth Action Buttons Block (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 mr-1 hidden lg:inline">
                Hi, <span className="text-gray-200 font-medium">{user?.name?.split(" ")[0]}</span>
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 rounded-full border border-white/10 hover:border-rose-500/30 text-xs font-medium text-gray-400 hover:text-rose-400 transition-all duration-200 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-purple-900/20 transition-all duration-200 active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white focus:outline-none p-1 text-xl"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Sidebar Panel */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-6 space-y-4 bg-[#0b0f1a] border-t border-white/10">
          
          <form onSubmit={handleSearch} className="flex mt-4 relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artworks..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-purple-500 text-white"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm rounded-lg transition-colors ${
                  pathname === link.href ? "text-purple-400 font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn && userRole && (
              <Link
                href={`/${userRole}/dashboard`}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm text-purple-400 font-medium hover:text-purple-300 transition-colors"
              >
                Dashboard Overview
              </Link>
            )}
          </div>

          {/* Conditional Action Bars (Mobile) */}
          <div className="pt-2 border-t border-white/5">
            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="text-xs text-gray-500 px-1">
                  Signed in as: <span className="text-gray-300 font-medium">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-center py-2.5 bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white rounded-xl shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}