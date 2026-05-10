import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { PlusCircle, MapPin, Calendar, TrendingUp, Globe, ArrowRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      stops: { include: { city: true } },
      expenses: true,
    },
    orderBy: { startDate: "desc" },
    take: 5,
  });

  const totalTrips = await prisma.trip.count({
    where: { userId: session.user.id },
  });

  const totalExpenses = await prisma.expense.aggregate({
    where: { trip: { userId: session.user.id } },
    _sum: { amount: true },
  });

  const totalStops = await prisma.stop.count({
    where: { trip: { userId: session.user.id } },
  });

  const popularCities = await prisma.city.findMany({
    orderBy: { popularity: "desc" },
    take: 6,
  });

  const stats = [
    { label: "Total Itineraries", value: totalTrips, icon: MapPin, color: "var(--color-primary)" },
    { label: "Destinations Explored", value: totalStops, icon: Globe, color: "var(--color-accent)" },
    { label: "Cumulative Budget", value: formatCurrency(totalExpenses._sum.amount || 0), icon: TrendingUp, color: "oklch(0.75 0.15 320)" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        {/* Welcome Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-editorial">Personal Workspace</span>
             <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-display mb-4">
            WELCOME, <span className="text-primary">{user?.name?.toUpperCase() || "VOYAGER"}</span>
          </h1>
          <p className="text-xl text-text-muted max-w-2xl">
            Orchestrating your global movements with mathematical precision and cinematic vision.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-pro p-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon size={80} />
                </div>
                <div className="relative z-10">
                   <p className="text-editorial mb-4" style={{ color: s.color }}>{s.label}</p>
                   <div className="text-4xl font-black text-white font-display">
                     {s.value}
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Action */}
            <section>
              <Link
                href="/trips/new"
                className="group relative flex items-center justify-between p-10 glass-pro border-dashed border-primary/40 hover:border-primary transition-colors no-underline overflow-hidden"
              >
                <div className="relative z-10">
                  <h2 className="text-3xl font-black text-white mb-2 font-display">ORCHESTRATE NEW TRIP</h2>
                  <p className="text-text-muted">Initiate a multi-city sequence from the global map.</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-surface group-hover:scale-110 transition-transform">
                  <PlusCircle size={32} />
                </div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </section>

            {/* Recent Trips */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-white font-display tracking-tight uppercase">Recent Itineraries</h3>
                <Link href="/trips" className="text-primary text-sm font-bold no-underline hover:underline underline-offset-4">View All Sequences</Link>
              </div>

              {trips.length === 0 ? (
                <div className="glass-pro p-20 text-center">
                  <Sparkles size={48} className="mx-auto mb-6 text-primary/40" />
                  <p className="text-text-muted mb-8 text-lg">Your itinerary archive is currently empty.</p>
                  <Link href="/trips/new" className="btn-pro-primary">Initialize Sequence</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip: any) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="group flex flex-col md:flex-row md:items-center justify-between p-8 glass-pro hover:bg-white/5 no-underline transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-editorial text-white/40">Sequence #{trip.id.slice(-4)}</span>
                           <span className="h-1 w-1 rounded-full bg-primary" />
                           <span className="text-sm font-medium text-primary">{trip.stops.length} {trip.stops.length === 1 ? "Node" : "Nodes"}</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{trip.name}</h4>
                        <p className="text-text-muted text-sm uppercase tracking-widest">{formatDateRange(trip.startDate, trip.endDate)}</p>
                      </div>
                      <div className="mt-6 md:mt-0 flex items-center gap-4">
                         <div className="flex -space-x-3">
                            {trip.stops.map((s: any) => (
                              <div key={s.id} className="w-10 h-10 rounded-full border-2 border-surface bg-surface-raised flex items-center justify-center text-[0.6rem] font-bold text-white/60 uppercase">
                                {s.city.name.slice(0, 2)}
                              </div>
                            ))}
                         </div>
                         <ArrowRight className="text-white/20 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <section>
              <h3 className="text-2xl font-black text-white font-display tracking-tight uppercase mb-8">Popular Nodes</h3>
              <div className="space-y-4">
                {popularCities.map((city: any) => (
                  <div key={city.id} className="glass-pro p-6 hover:bg-white/5 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h5 className="text-lg font-bold text-white mb-1">{city.name}</h5>
                         <p className="text-text-muted text-xs uppercase tracking-widest">{city.country}</p>
                       </div>
                       <div className="text-primary font-black font-display">
                         {city.costIndex}
                       </div>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${city.costIndex}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-pro p-8 bg-primary/5 border-primary/20">
               <h3 className="text-xl font-black text-primary font-display mb-4 italic">INSIGHT</h3>
               <p className="text-sm text-text-muted leading-relaxed italic">
                 "Travel is the only thing you buy that makes you richer." 
                 Currently, your most frequent destination cluster is in Europe. Consider exploring Southeast Asia for optimized cost-to-experience ratios.
               </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
