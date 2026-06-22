"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
function DashboardDropdown({ userRole }) {
  const [open, setOpen] = useState(false);

  const artistItems = [
    { label: "Overview", href: "/dashboard/artist/overview" },
    { label: "My Artworks", href: "/dashboard/artist/my-artworks" },
    { label: "Sales History", href: "/dashboard/artist/sales" },
    { label: "Settings", href: "/dashboard/artist/settings" },
  ];

  const userItems = [
    { label: "My Purchases", href: "/dashboard/user/purchases" },
    { label: "My Collection", href: "/dashboard/user/collection" },
    { label: "Settings", href: "/dashboard/user/settings" },
  ];

  const adminItems = [
    { label: "Analytics", href: "/dashboard/admin/overview" },
    { label: "Manage Users", href: "/dashboard/admin/users" },
    { label: "Manage Artworks", href: "/dashboard/admin/artworks" },
    { label: "Transactions", href: "/dashboard/admin/transactions" },
  ];

  const items = userRole === "artist" ? artistItems : userRole === "admin" ? adminItems : userItems;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors font-normal cursor-pointer bg-transparent border-none"
      >
        Dashboard
        <span className="text-[10px] text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-44 bg-[#111625] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const BACKEND_URL = "https://arthub-server-9t9m.onrender.com";
  const userRole = user?.role;

  useEffect(() => {
    const fetchUserSession = async () => {
      const token = authClient.getToken();

      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          authClient.clearToken();
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to verify authentication server session:", err);
      }
    };

    fetchUserSession();
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    authClient.clearToken();
    setIsLoggedIn(false);
    setUser(null);
    setIsMenuOpen(false);
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
    <nav className="w-full bg-[#0b0f1a]/95 text-white border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Brand/Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white md:hidden focus:outline-none p-1 text-xl"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
              ArtHub
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
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

          {isLoggedIn && userRole && (
            <li>
              <DashboardDropdown userRole={userRole} />
            </li>
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artworks..."
              className="w-44 lg:w-56 h-8 rounded-full bg-white/5 border border-white/10 px-3.5 pr-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
            <button type="submit" aria-label="Run search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 hidden lg:inline">
                  Hi, <span className="text-gray-200 font-medium">{user?.name?.split(" ")[0]}</span>
                </span>
                <Button
                  size="sm"
                  variant="bordered"
                  onClick={handleSignOut}
                  className="rounded-full border-white/10 hover:border-rose-500/30 text-xs font-medium text-gray-400 hover:text-rose-400 min-w-0"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-300 hover:text-white px-4 py-1.5 rounded-full transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-purple-900/20 rounded-full px-4 py-1.5 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0b0f1a] border-t border-white/10 px-4 pb-6 space-y-4 pt-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artworks..."
              className="w-full h-10 rounded-xl bg-white/5 border border-white/10 px-3.5 pr-9 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm rounded-lg transition-colors ${
                  pathname === link.href ? "text-purple-400 font-semibold" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

  {isLoggedIn && userRole && (
  <>
    {userRole === "artist" && (
      <>
        <Link href="/dashboard/artist/overview" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Overview</Link>
        <Link href="/dashboard/artist/my-artworks" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">My Artworks</Link>
        <Link href="/dashboard/artist/sales" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Sales History</Link>
        <Link href="/dashboard/artist/settings" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Settings</Link>
      </>
    )}
    {userRole === "user" && (
      <>
        <Link href="/dashboard/user/purchases" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">My Purchases</Link>
        <Link href="/dashboard/user/collection" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">My Collection</Link>
        <Link href="/dashboard/user/settings" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Settings</Link>
      </>
    )}
    {userRole === "admin" && (
      <>
        <Link href="/dashboard/admin/overview" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Analytics</Link>
        <Link href="/dashboard/admin/users" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Manage Users</Link>
        <Link href="/dashboard/admin/artworks" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Manage Artworks</Link>
        <Link href="/dashboard/admin/transactions" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-300 hover:text-white transition-colors">Transactions</Link>
      </>
    )}
  </>
)}
          </div>

          <div className="pt-4 border-t border-white/5 w-full">
            {isLoggedIn ? (
              <div className="space-y-3 w-full">
                <div className="text-xs text-gray-500 px-1">
                  Signed in as: <span className="text-gray-300 font-medium">{user?.email}</span>
                </div>
                <Button
                  fullWidth
                  onClick={handleSignOut}
                  className="bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm font-medium rounded-xl h-11"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 w-full">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 h-11 flex items-center justify-center transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white rounded-xl shadow-lg h-11 flex items-center justify-center"
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