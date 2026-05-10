"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Map,
  Globe,
  User,
  Layers,
  X,
  LogOut,
  Menu,
  Plus,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SIDEBAR = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/trips", label: "Trips", icon: Map },
  { href: "/cities", label: "Cities", icon: Globe },
  { href: "/profile", label: "Account", icon: User },
];

export type AppChromeProps = {
  children: React.ReactNode;
  contentClassName?: string;
};

export default function AppChrome({
  children,
  contentClassName = "page-shell py-10 lg:py-14 pb-16",
}: AppChromeProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sidebarActive = (href: string) => {
    if (href === "/trips") return pathname.startsWith("/trips");
    if (href === "/cities") return pathname.startsWith("/cities");
    if (href === "/profile") return pathname.startsWith("/profile");
    return pathname === href;
  };

  const loading = status === "loading";

  return (
    <div className="flex min-h-dvh bg-bg text-[#fafafa] font-sans text-[15px] leading-normal antialiased">
      {/* Desktop Sidebar - Fixed, Premium with smooth animations */}
      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 72 : 240,
          x: 0 
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className={cn(
          "hidden md:flex md:flex-col fixed left-0 top-0 bottom-0 z-[60]",
          "border-r border-white/[0.06] bg-gradient-to-b from-[#0c0c0c] to-[#080808]",
          "overflow-hidden"
        )}
      >
        {/* Logo Section */}
        <div className="pt-6 pb-4 px-3 lg:px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-lime to-accent-cyan shadow-lg shadow-accent-lime/20"
            >
              <Layers className="h-4 w-4 text-bg" strokeWidth={2.5} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: sidebarCollapsed ? 0 : 1,
                width: sidebarCollapsed ? 0 : 'auto'
              }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block text-lg font-bold text-white font-display whitespace-nowrap overflow-hidden"
            >
              Traveloop
            </motion.span>
          </Link>
          
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex p-1.5 rounded-lg hover:bg-white/[0.06] text-muted hover:text-white transition-all",
              sidebarCollapsed && "rotate-180"
            )}
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Quick Action */}
        <div className="px-3 lg:px-4 mb-4">
          <Link href="/trips/new">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "bg-white/10 hover:bg-white/15 border border-white/[0.08] transition-all group",
                sidebarCollapsed && "justify-center"
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-lime/20 group-hover:bg-accent-lime/30 transition-colors shrink-0">
                <Plus size={14} className="text-accent-lime" />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: sidebarCollapsed ? 0 : 1,
                  width: sidebarCollapsed ? 0 : 'auto'
                }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-white whitespace-nowrap overflow-hidden"
              >
                New Trip
              </motion.span>
            </motion.button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 lg:px-3 py-2 space-y-1 overflow-y-auto">
          {SIDEBAR.map(({ href, label, icon: Icon }) => {
            const on = sidebarActive(href);
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHoveredItem(href)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline",
                  on
                    ? "bg-white/[0.08] text-white"
                    : "text-muted hover:text-white hover:bg-white/[0.04]"
                )}
              >
                {/* Active indicator */}
                {on && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-lime rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0",
                    on ? "bg-accent-lime/20 text-accent-lime" : "bg-white/[0.04]"
                  )}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: sidebarCollapsed ? 0 : 1,
                    width: sidebarCollapsed ? 0 : 'auto'
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Banner */}
        <div className="px-3 lg:px-4 mb-3">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={cn(
              "p-3 rounded-xl bg-gradient-to-r from-accent-pink/10 to-accent-cyan/10 border border-white/[0.06]",
              sidebarCollapsed && "p-2"
            )}
          >
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-accent-pink shrink-0" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: sidebarCollapsed ? 0 : 1,
                  width: sidebarCollapsed ? 0 : 'auto'
                }}
                className="overflow-hidden"
              >
                <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
                <p className="text-[10px] text-muted">Unlock premium features</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* User Section */}
        <div className="p-3 lg:p-4 border-t border-white/[0.06]">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer",
            sidebarCollapsed && "justify-center"
          )}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative shrink-0"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent-pink via-accent-cyan to-accent-lime p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-card text-xs font-bold uppercase text-white">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : session?.user?.name ? (
                    session.user.name.slice(0, 2)
                  ) : (
                    <User size={12} />
                  )}
                </div>
              </div>
              {session?.user && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-lime border-2 border-card" />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: sidebarCollapsed ? 0 : 1,
                width: sidebarCollapsed ? 0 : 'auto'
              }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.name || "Guest"}
              </p>
              <p className="text-xs text-muted truncate">
                {session?.user?.email || "Not signed in"}
              </p>
            </motion.div>
            <AnimatePresence>
              {session && !sidebarCollapsed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors shrink-0"
                >
                  <LogOut size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ 
              type: "spring", 
              bounce: 0.15, 
              damping: 25,
              stiffness: 300
            }}
            className="fixed left-0 top-0 bottom-0 z-[80] w-[300px] flex flex-col border-r border-white/[0.06] bg-[#0c0c0c] md:hidden"
          >
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-lime to-accent-cyan">
                    <Layers className="h-5 w-5 text-bg" />
                  </div>
                  <span className="text-lg font-bold text-white font-display">Traveloop</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.06] text-muted"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-4">
              <Link href="/trips/new" onClick={() => setMobileOpen(false)}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-pro-primary justify-center"
                >
                  <Plus size={18} />
                  New Trip
                </motion.button>
              </Link>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-2">
              {SIDEBAR.map(({ href, label, icon: Icon }) => {
                const on = sidebarActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-xl transition-all",
                      on
                        ? "bg-accent-lime/10 text-accent-lime"
                        : "text-muted hover:text-white hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                    <span className="text-base font-medium">{label}</span>
                    {on && (
                      <motion.div
                        layoutId="mobileActive"
                        className="ml-auto w-2 h-2 rounded-full bg-accent-lime"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/[0.06]">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-400/20 text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-center text-sm text-muted hover:text-white">
                  Sign In
                </Link>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="flex-1 flex flex-col min-w-0"
        initial={false}
        animate={{ 
          marginLeft: 72 
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        {/* Mobile Menu Button - Fixed FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-accent-lime to-accent-cyan text-bg shadow-lg shadow-accent-lime/30 md:hidden"
        >
          <Menu size={22} strokeWidth={2.5} />
        </motion.button>
        
        <div className={cn("flex-1 w-full min-h-0", contentClassName)}>{children}</div>
      </motion.div>
    </div>
  );
}