import { prisma } from "@/lib/db";
import AppChrome from "@/components/AppChrome";
import { MapPin, Search, DollarSign, Globe, Navigation, Activity, Sparkles } from "lucide-react";
import Link from "next/link";

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

  return (
    <AppChrome>
      <main className="page-shell py-10 lg:py-14 pb-16 space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-editorial text-accent-cyan">Discover</span>
            <div className="h-px flex-1 bg-white/10 max-w-[180px]" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
            Explore <span className="text-accent-cyan">Cities</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl">
            Search destinations, compare costs, and preview activities to plan your perfect itinerary.
          </p>
        </header>

        <form className="glass-pro p-4 rounded-2xl flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              name="q" 
              defaultValue={query} 
              className="input-pro pl-12 h-12 bg-white/[0.03] border-white/[0.06]" 
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

        {cities.length === 0 ? (
          <div className="glass-pro p-16 text-center">
            <Globe size={64} className="mx-auto text-muted opacity-30 mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">No Cities Found</h3>
            <p className="text-muted">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city: any) => (
              <div key={city.id} className="glass-pro group p-6 hover:border-accent-cyan/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Navigation size={80} />
                </div>

                <div className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-white font-display group-hover:text-accent-cyan transition-colors">
                      {city.name}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-muted mt-1">
                      <MapPin size={12} className="text-accent-cyan" />
                      {city.country}
                      {city.region && <span className="opacity-50">•</span>}
                      {city.region && <span>{city.region}</span>}
                    </p>
                  </div>

                  {city.description && (
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                      {city.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
                      <Activity size={12} className="text-accent-lime" />
                      <span className="text-xs font-medium text-white/80">{city.popularity}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
                      <DollarSign size={12} className="text-accent-yellow" />
                      <span className="text-xs font-medium text-white/80">{city.costIndex}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center gap-2">
                      <Sparkles size={12} className="text-accent-pink" />
                      <span className="text-xs font-medium text-white/80">{city._count.activities}</span>
                    </div>
                  </div>

                  <Link href={`/cities/${city.id}`} className="btn-pro-outline w-full justify-center py-2.5 text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppChrome>
  );
}