import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
  PenSquare,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../auth/supabaseClient.js";

const publicNavItems = [
  { label: "Home", path: "/" },
  { label: "Blog", path: "/blog" },
  { label: "Resources", path: "/resources" },
  { label: "Contact", path: "/contact" },
];

const privateNavItems = [
  { label: "Home", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Coach", path: "/coach" },
  { label: "Blog", path: "/blog" },
  { label: "Resources", path: "/resources" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserData(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserData(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();

    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <span className="text-lg font-bold text-white">AI</span>
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              SpeakAI
            </h1>

            <p className="text-xs text-gray-400">AI Interview Coach</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {userData ? privateNavItems : publicNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA */}
        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {!userData ? (
            <Link
              to="/login"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30"
            >
              Start Practice
            </Link>
          ) : (
            <div className="relative" ref={profileRef}>
              {/* Profile Trigger */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/[0.08] transition"
              >
                {/* Avatar */}
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                  {userData.email?.[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">
                    {userData.email?.split("@")[0]}
                  </p>

                  <p className="text-xs text-gray-400">Interview Candidate</p>
                </div>

                <ChevronDown size={18} className="text-gray-400" />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-4 w-64 rounded-2xl border border-white/10 bg-[#0f172a]/95 p-3 shadow-2xl ring-1 ring-white/10 backdrop-blur z-50">
                  {/* User Info */}
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="font-semibold text-white">{userData.email}</p>

                    <p className="mt-1 text-sm text-gray-400">
                      SpeakAI Premium User
                    </p>
                  </div>

                  {/* Links */}
                  <div className="mt-3 space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      to="/coach"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                    >
                      <User size={18} />
                      Interview Coach
                    </Link>

                    <Link
                      to="/admin/blog-generator"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                    >
                      <PenSquare size={18} />
                      Blog Generator
                    </Link>

                    <a
                      href="mailto:sreekanthm138@gmail.com"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:bg-white/[0.06] hover:text-white transition"
                    >
                      <Mail size={18} />
                      Contact Support
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <button
                      onClick={signOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-300 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-white/10 bg-[#050816]"
          >
            <div className="flex flex-col gap-5 px-6 py-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium ${
                      isActive ? "text-white" : "text-gray-400"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {!userData ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Start Practice
                </Link>
              ) : (
                <div className="space-y-3 border-t border-white/10 pt-5">
                  {/* User */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white">
                      {userData.email?.[0]?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {userData.email?.split("@")[0]}
                      </p>

                      <p className="text-sm text-gray-400">SpeakAI User</p>
                    </div>
                  </div>

                  {/* Links */}
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-white/[0.06]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <Link
                    to="/coach"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-white/[0.06]"
                  >
                    <User size={18} />
                    Interview Coach
                  </Link>

                  <button
                    onClick={signOut}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
