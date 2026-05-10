"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Globe,
  LayoutDashboard,
  Map,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const loading = status === "loading";

  const links = [
    { href: "/dashboard", label: "Registry", icon: LayoutDashboard },
    { href: "/trips", label: "Trajectories", icon: Map },
    { href: "/cities", label: "Global Index", icon: Globe },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 inset-x-0 z-50 p-6 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-pro px-6 h-16 flex items-center gap-8 pointer-events-auto border-white/5 shadow-2xl"
      >
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-3 group no-underline">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-surface group-hover:rotate-12 transition-transform">
            <Navigation size={16} fill="currentColor" />
          </div>
          <span className="text-sm font-black uppercase tracking-tighter text-white font-display hidden sm:block">Traveloop</span>
        </Link>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-20 h-4 bg-white/5 animate-pulse rounded-full"
              />
            ) : session ? (
              <motion.div
                key="session"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="hidden md:flex items-center gap-2 mr-4">
                  {links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`
                          relative flex items-center gap-2 px-4 py-2 rounded-inner text-[0.65rem] font-black uppercase tracking-widest transition-colors no-underline z-10
                          ${isActive(link.href) ? "text-surface" : "text-text-muted hover:text-white"}
                        `}
                      >
                        {isActive(link.href) && (
                          <motion.div
                            layoutId="active-pill"
                            className="absolute inset-0 bg-primary rounded-inner -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon size={14} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="h-4 w-px bg-white/10 mr-4 hidden md:block" />

                <Link 
                  href="/profile" 
                  className="w-10 h-10 rounded-inner flex items-center justify-center text-text-muted hover:text-primary transition-colors hover:bg-white/5 no-underline"
                >
                  <User size={18} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-10 h-10 rounded-inner flex items-center justify-center text-text-muted hover:text-red-400 transition-colors hover:bg-red-500/5 bg-transparent border-none cursor-pointer p-0"
                >
                  <LogOut size={18} />
                </button>
                <button
                  className="w-10 h-10 rounded-inner flex items-center justify-center text-text-muted md:hidden bg-transparent border-none cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <X size={20} /> : <Menu size={20} />}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="guest"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <Link href="/login" className="px-5 py-2 text-[0.65rem] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors no-underline">
                  Login
                </Link>
                <Link href="/register" className="px-5 py-2 text-[0.65rem] font-black uppercase tracking-widest bg-primary text-surface rounded-inner hover:scale-105 transition-all no-underline">
                  Join
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && session && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-24 left-6 right-6 p-6 glass-pro md:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`
                      flex items-center gap-4 p-4 rounded-inner text-xs font-black uppercase tracking-widest no-underline
                      ${isActive(link.href) ? "bg-primary text-surface" : "text-white/60 hover:bg-white/5"}
                    `}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
