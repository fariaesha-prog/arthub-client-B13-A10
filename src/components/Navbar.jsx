"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar({ userRole = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Artworks", href: "/browse" },
    { name: "Artists", href: "/artists" },
    { name: "Categories", href: "/categories" },
    { name: "Pricing", href: "/pricing" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="w-full bg-[#0b0f1a] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="bg-linear-to-r from-purple-500 to-orange-400 bg-clip-text text-transparent">
            ArtHub
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`hover:text-white transition ${
                  pathname === link.href ? "text-white font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Dashboard Dropdown */}
          {userRole && (
            <li className="relative">
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className="hover:text-white transition"
              >
                Dashboard ▾
              </button>

              {dashboardOpen && (
                <div className="absolute top-8 left-0 bg-[#111827] border border-white/10 rounded-md w-44 shadow-lg">
                  <Link
                    href={`/${userRole}/dashboard`}
                    className="block px-4 py-2 hover:bg-white/5"
                  >
                    Overview
                  </Link>
                  <Link
                    href={`/${userRole}/uploads`}
                    className="block px-4 py-2 hover:bg-white/5"
                  >
                    My Artworks
                  </Link>
                  <Link
                    href={`/${userRole}/settings`}
                    className="block px-4 py-2 hover:bg-white/5"
                  >
                    Settings
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks..."
            className="bg-transparent outline-none text-sm px-2 w-48"
          />
        </form>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full border border-white/20 hover:border-white/50 text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 rounded-full bg-white text-black font-medium hover:bg-gray-200 text-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-[#0b0f1a] border-t border-white/10">
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artworks..."
              className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm"
            />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-gray-300"
            >
              {link.name}
            </Link>
          ))}

          {userRole && (
            <Link
              href={`/${userRole}/dashboard`}
              className="block py-2 text-gray-300"
            >
              Dashboard
            </Link>
          )}

          <div className="flex gap-2 pt-2">
            <Link
              href="/login"
              className="flex-1 text-center px-3 py-2 border border-white/20 rounded-md"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center px-3 py-2 bg-white text-black rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}