import { prisma } from "@/lib/db";
import AppChrome from "@/components/AppChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MapPin, Search, DollarSign, Globe, Navigation, Activity, Sparkles, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CitiesPage({ searchParams }: { searchParams: Promise<{ q?: string; region?: string }> }) {
  const sp = await searchParams;
  const query = sp.q || "";
  const region = sp.region || "";

  const cities = await prisma.city.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { name: { contains: query } },
            { country: { contains: query } },
          ],
        } : {},
        region ? { region: { contains: region } } : {},
      ],
    },
    include: {
      _count: { select: { activities: true } },
    },
    orderBy: { popularity: "desc" },
  });

  const regions = await prisma.city.findMany({
    select: { region: true },
    distinct: ["region"],
    where: { region: { not: null } },
  });

  const getCostLevel = (index: number) => {
    if (index < 30) return { label: "Budget", color: "text-accent-lime" };
    if (index < 60) return { label: "Moderate", color: "text-accent-yellow" };
    return { label: "Premium", color: "text-accent-pink" };
  };

  return (
    <AppChrome>
      <main className="page-shell py-10 lg:py-14 pb-16 space-y-10">
        <Breadcrumbs />
        
        <header className="space-y-4">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Explore <span className="text-accent-cyan">Cities</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Discover destinations worldwide with cost estimates, activities, and travel insights.
          </p>
        </header>

        {/* Search and Filters */}
        <form className="glass-pro p-4 rounded-2xl flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              name="q" 
              defaultValue={query} 
              className="input-pro pl-12" 
              placeholder="Search cities..." 
            />
          </div>
          <select 
            name="region" 
            defaultValue={region} 
            className="input-pro h-12 bg-white/[0.03] border-white/[0.06] w-full md:w-56 cursor-pointer"
          >
            <option value="">All Regions</option>
            {regions.map((r: any) => (
              <option key={r.region} value={r.region || ""}>{r.region}</option>
            ))}
          </select>
          <button type="submit" className="btn-pro-primary h-12 px-8">
            Search
          </button>
        </form>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="glass-pro px-6 py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-accent-cyan/10">
              <Globe size={20} className="text-accent-cyan" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{cities.length}</p>
              <p className="text-xs text-muted">Destinations</p>
            </div>
          </div>
          <div className="glass-pro px-6 py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-accent-lime/10">
              <Activity size={20} className="text-accent-lime" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{cities.reduce((s, c: any) => s + (c._count?.activities || 0), 0)}</p>
              <p className="text-xs text-muted">Activities</p>
            </div>
          </div>
          <div className="glass-pro px-6 py-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-accent-pink/10">
              <TrendingUp size={20} className="text-accent-pink" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">{regions.length}</p>
              <p className="text-xs text-muted">Regions</p>
            </div>
          </div>
        </div>

        {cities.length === 0 ? (
          <div className="glass-pro p-16 text-center">
            <Globe size={64} className="mx-auto text-muted opacity-30 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">No Cities Found</h3>
            <p className="text-muted">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city: any) => {
              const costLevel = getCostLevel(city.costIndex);
              return (
                <Link 
                  key={city.id} 
                  href={`/cities/${city.id}`}
                  className="glass-pro group p-6 hover:border-accent-cyan/30 transition-all duration-300"
                >
                  {/* City Image Placeholder */}
                  <div className="relative h-32 mb-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 via-accent-lime/10 to-accent-pink/20 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe size={40} className="text-white/20 group-hover:text-white/40 transition-colors" />
                    </div>
                    {/* Popularity Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg/80 backdrop-blur-sm text-[10px] font-semibold">
                        <Star size={10} className="text-accent-yellow" fill="currentColor" />
                        {city.popularity}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-accent-cyan transition-colors">
                        {city.name}
                      </h3>
                      <p className="flex items-center gap-2 text-sm text-muted mt-1">
                        <MapPin size={12} className="text-accent-cyan" />
                        {city.country}
                        {city.region && <span className="opacity-50">•</span>}
                        {city.region && <span>{city.region}</span>}
                      </p>
                    </div>

                    {/* Cost & Activities */}
                    <div className="flex flex-wrap gap-2">
                      <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]", costLevel.color)}>
                        <DollarSign size={12} />
                        <span className="text-xs font-medium">{costLevel.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-muted">
                        <Activity size={12} />
                        <span className="text-xs font-medium">{city._count?.activities || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-muted">
                        <Sparkles size={12} />
                        <span className="text-xs font-medium">{city.costIndex}</span>
                      </div>
                    </div>

                    {city.description && (
                      <p className="text-sm text-muted leading-relaxed line-clamp-2">
                        {city.description}
                      </p>
                    )}

                    <div className="pt-4 border-t border-white/[0.06]">
                      <span className="text-sm font-medium text-accent-cyan group-hover:text-white transition-colors flex items-center gap-2">
                        Explore Activities <Sparkles size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </AppChrome>
  );
}