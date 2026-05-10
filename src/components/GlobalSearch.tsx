"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Calendar, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  id: string;
  type: "trip" | "city" | "activity";
  title: string;
  subtitle: string;
  href: string;
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Mock search - in production, this would be an API call
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      const mockResults: SearchResult[] = [
        { id: "1", type: "trip" as const, title: "Europe Summer 2026", subtitle: "Paris, Rome, Barcelona", href: "/trips/1" },
        { id: "2", type: "city" as const, title: "Tokyo", subtitle: "Japan • $1,200/week", href: "/cities/1" },
        { id: "3", type: "trip" as const, title: "Japan Adventure", subtitle: "Tokyo, Kyoto, Osaka", href: "/trips/2" },
        { id: "4", type: "city" as const, title: "Paris", subtitle: "France • $1,800/week", href: "/cities/2" },
        { id: "5", type: "activity" as const, title: "Eiffel Tower Visit", subtitle: "Paris • $25", href: "/cities/2" },
      ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
      
      setResults(mockResults);
      setIsLoading(false);
      setSelectedIndex(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(results[selectedIndex].href);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const typeIcons = {
    trip: <Calendar size={14} className="text-accent-cyan" />,
    city: <MapPin size={14} className="text-accent-lime" />,
    activity: <TrendingUp size={14} className="text-accent-pink" />,
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl",
          "bg-white/[0.04] border border-white/[0.08] text-muted",
          "hover:bg-white/[0.06] hover:text-white transition-all",
          "min-w-[200px] lg:min-w-[280px]"
        )}
      >
        <Search size={16} />
        <span className="text-sm flex-1 text-left">Search trips, cities...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-medium">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={cn(
              "absolute top-full mt-3 w-full bg-card border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-[110]",
              "max-h-[400px] overflow-y-auto"
            )}
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-4 border-b border-white/[0.06]">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search trips, cities, activities..."
                  className="w-full pl-12 pr-10 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-muted focus:outline-none focus:border-accent-cyan/50"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/[0.06] text-muted"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="p-2">
              {isLoading ? (
                <div className="p-8 text-center text-muted">
                  <div className="animate-pulse flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-accent-cyan/50 animate-bounce" />
                    <span>Searching...</span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl transition-all",
                      index === selectedIndex ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="p-2 rounded-lg bg-white/[0.04]">
                      {typeIcons[result.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{result.title}</p>
                      <p className="text-xs text-muted truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted px-2 py-1 rounded bg-white/[0.04]">
                      {result.type}
                    </span>
                  </Link>
                ))
              ) : query.length >= 2 ? (
                <div className="p-8 text-center text-muted">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="p-8 text-center text-muted">
                  <p className="text-sm">Type at least 2 characters to search</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between text-xs text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">↵</kbd>
                    to select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06]">esc</kbd>
                  to close
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}