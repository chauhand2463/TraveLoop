import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { MapPin, Search, TrendingUp, DollarSign, Globe, Navigation, Activity, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-4">
           <span className="text-editorial">Destination Index</span>
           <h1 className="text-6xl lg:text-8xl font-black text-white font-display tracking-tighter uppercase leading-none">
             Global <span className="text-primary">Registry</span>
           </h1>
           <p className="text-text-muted text-xl max-w-2xl font-medium">
             Search and analyze global destination nodes to optimize your next movement protocol.
           </p>
        </div>

        {/* Search Protocol */}
        <form className="glass-pro p-4 rounded-3xl flex flex-wrap gap-4 items-center bg-white/[0.02]">
          <div className="relative flex-1 min-w-[300px]">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              name="q" 
              defaultValue={query} 
              className="input-pro pl-14 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.08]" 
              placeholder="Query city or sovereign state..." 
            />
          </div>
          <select 
            name="region" 
            defaultValue={region} 
            className="input-pro h-14 bg-white/[0.03] border-white/5 w-full md:w-64 cursor-pointer"
          >
            <option value="">All Global Regions</option>
            {regions.map((r: any) => (
              <option key={r.region} value={r.region || ""} className="bg-surface">{r.region}</option>
            ))}
          </select>
          <button type="submit" className="btn-pro-primary h-14 px-10 rounded-2xl whitespace-nowrap">
            Analyze Index
          </button>
        </form>

        {/* Tactical Results */}
        {cities.length === 0 ? (
          <div className="glass-pro p-24 text-center space-y-6">
            <Globe size={80} className="mx-auto text-text-muted opacity-20 animate-pulse" />
            <p className="text-xl text-text-muted font-black uppercase tracking-widest">No matching nodes detected in the registry.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cities.map((city: any) => (
              <div key={city.id} className="glass-pro group p-8 space-y-6 hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Navigation size={100} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white font-display tracking-tight uppercase group-hover:text-primary transition-colors">
                    {city.name}
                  </h3>
                  <p className="flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-widest text-text-muted">
                    <MapPin size={12} className="text-primary" /> {city.country}
                    {city.region && <span className="opacity-30">|</span>}
                    {city.region && <span>{city.region}</span>}
                  </p>
                </div>

                {city.description && (
                  <p className="text-sm text-text-muted leading-relaxed font-medium line-clamp-3">
                    {city.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-4">
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <Activity size={10} className="text-primary" />
                    <span className="text-[0.6rem] font-black text-white uppercase tracking-tighter">Pop: {city.popularity}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <DollarSign size={10} className="text-primary" />
                    <span className="text-[0.6rem] font-black text-white uppercase tracking-tighter">Index: {city.costIndex}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-[0.6rem] font-black text-white uppercase tracking-tighter">{city._count.activities} Acts</span>
                  </div>
                </div>

                <Link href={`/cities/${city.id}`} className="btn-pro-outline w-full h-12 text-[0.65rem] rounded-xl group-hover:bg-primary group-hover:text-surface group-hover:border-primary transition-all duration-500">
                  Execute Discovery
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
