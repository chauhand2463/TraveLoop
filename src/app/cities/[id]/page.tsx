"use client";

import { useState } from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Clock, DollarSign, Sparkles, Search, Filter, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  id: string;
  name: string;
  type: string;
  duration: number | null;
  description: string | null;
  cost: number;
};

export default function CityActivitiesPage({ 
  params 
}: { 
  params: Promise<{ id: string }>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  return (
    <AppChrome>
      <div className="page-shell py-10 lg:py-14 pb-16">
        <Breadcrumbs />
        
        <Link
          href="/cities"
          className="inline-flex mt-6 items-center gap-2 text-sm font-medium text-muted hover:text-accent-cyan transition-colors no-underline"
        >
          <ArrowLeft size={16} /> Back to Cities
        </Link>

        <div className="mt-8 mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white font-display">City Activities</h1>
          <p className="text-muted mt-2">Discover things to do in this destination</p>
        </div>

        {false && (
          <p className="text-muted max-w-[720px] text-lg mb-8 leading-relaxed">City description here</p>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities..."
              className="input-pro pl-12"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Sightseeing", "Food", "Adventure", "Culture", "Nightlife"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                  activeFilter === filter
                    ? "bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan"
                    : "border-white/[0.1] text-muted hover:text-white hover:border-white/[0.2]"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="rounded-full border border-accent-cyan/45 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-cyan bg-accent-cyan/[0.08]">
            Popularity: 85/100
          </span>
          <span className="rounded-full border border-accent-pink/35 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-pink bg-accent-pink/[0.08]">
            Cost index: 72/100
          </span>
          <span className="rounded-full border border-accent-lime/35 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-lime bg-accent-lime/[0.06]">
            24 activities
          </span>
        </div>

        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-white">
          <Sparkles size={24} className="text-accent-cyan" /> Things to Do
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { id: "1", name: "Eiffel Tower Visit", type: "Sightseeing", duration: 120, description: "Iconic iron lattice tower with panoramic city views", cost: 25 },
            { id: "2", name: "Louvre Museum Tour", type: "Culture", duration: 180, description: "World's largest art museum with Mona Lisa", cost: 22 },
            { id: "3", name: "Seine River Cruise", type: "Sightseeing", duration: 60, description: "Scenic boat ride past Parisian landmarks", cost: 15 },
            { id: "4", name: "French Cooking Class", type: "Food", duration: 180, description: "Learn to make croissants and macarons", cost: 85 },
            { id: "5", name: "Montmartre Walking Tour", type: "Culture", duration: 90, description: "Explore artistic neighborhood and Sacré-Cœur", cost: 20 },
            { id: "6", name: "Paris Night Tour", type: "Nightlife", duration: 180, description: "See the City of Lights at night", cost: 45 },
            { id: "7", name: "Versailles Day Trip", type: "Sightseeing", duration: 300, description: "Historic royal palace and gardens", cost: 35 },
            { id: "8", name: "Wine Tasting Experience", type: "Food", duration: 90, description: "Sample finest French wines", cost: 55 },
            { id: "9", name: "Catacombs Underground", type: "Adventure", duration: 120, description: "Explore eerie underground ossuary", cost: 30 },
          ].map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-pro p-6 group hover:border-accent-cyan/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium border border-accent-cyan/30 text-accent-cyan bg-accent-cyan/[0.08]">
                  {act.type}
                </span>
                {act.duration && (
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={12} />
                    {act.duration} min
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-cyan transition-colors">
                {act.name}
              </h3>
              
              <p className="text-sm text-muted mb-6 line-clamp-2">
                {act.description}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2 text-accent-cyan">
                  <DollarSign size={16} strokeWidth={1.75} />
                  <span className="text-lg font-semibold">{formatCurrency(act.cost)}</span>
                </div>
                <button className="btn-pro-outline py-2 px-4 text-xs">
                  Add to Trip
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppChrome>
  );
}