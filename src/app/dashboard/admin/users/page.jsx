"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ROLES = ["user", "artist", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      artist: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      user: "bg-gray-500/10 text-gray-400 border-gray-500/20"
    };
    return styles[role] || styles.user;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-8 lg:p-12 space-y-8">
      <div className="max-w-7xl mx-auto border-b border-white/5 pb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Manage Users</h1>
          <p className="text-sm text-gray-400 mt-1.5">{users.length} registered users on ArtHub.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-64 h-9 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <span className="col-span-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">#</span>
            <span className="col-span-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</span>
            <span className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</span>
            <span className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Change Role</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-400 text-sm">No users found.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map((user, idx) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors items-center"
                >
                  <span className="col-span-1 text-xs text-gray-600">{idx + 1}</span>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-200 truncate">{user.name}</span>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <span className="text-sm text-gray-400 truncate">{user.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updatingId === user._id}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500/50 disabled:opacity-50"
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r} className="bg-[#111625]">{r}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}