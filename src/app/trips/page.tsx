import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { deleteTrip } from "@/actions/trips";
import { MapPin, PlusCircle, Eye, Pencil, Trash2, Calendar, Globe, Sparkles } from "lucide-react";

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      stops: { include: { city: true } },
      expenses: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <span className="text-editorial">Itinerary Archive</span>
               <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-display uppercase">
              Your <span className="text-primary">Sequences</span>
            </h1>
            <p className="text-xl text-text-muted mt-4">
              Access and manage your global movement protocols.
            </p>
          </div>
          <Link href="/trips/new" className="btn-pro-primary h-fit">
            <PlusCircle size={20} />
            Initialize Sequence
          </Link>
        </header>

        {trips.length === 0 ? (
          <div className="glass-pro p-24 text-center">
            <Globe size={64} className="mx-auto mb-8 text-primary/20 animate-pulse" />
            <h3 className="text-3xl font-black text-white mb-4 font-display uppercase">Zero Sequences Found</h3>
            <p className="text-text-muted mb-10 max-w-md mx-auto">The world is waiting. Initialize your first movement protocol to begin tracking your global trajectory.</p>
            <Link href="/trips/new" className="btn-pro-primary">
               Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {trips.map((trip: any) => {
              const totalCost = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0);
              return (
                <div key={trip.id} className="glass-pro p-10 group relative overflow-hidden flex flex-col md:flex-row gap-10">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <MapPin size={120} />
                  </div>

                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                       <span className="text-editorial text-primary">Protocol #{trip.id.slice(-6)}</span>
                       {trip.isPublic && <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[0.65rem] font-black uppercase tracking-widest">Public</span>}
                    </div>

                    <h3 className="text-3xl font-black text-white mb-4 font-display group-hover:text-primary transition-colors uppercase">
                      {trip.name}
                    </h3>

                    <div className="flex items-center gap-6 mb-8 text-sm text-text-muted font-medium">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-primary" />
                          {formatDateRange(trip.startDate, trip.endDate)}
                       </div>
                       <div className="flex items-center gap-2">
                          <Globe size={14} className="text-primary" />
                          {trip.stops.length} Nodes
                       </div>
                    </div>

                    {trip.description && (
                      <p className="text-text-muted leading-relaxed mb-8 line-clamp-2">
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {trip.stops.map((s: any) => (
                        <span key={s.id} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[0.65rem] font-bold text-white/60 uppercase tracking-widest">
                          {s.city.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-6 relative z-10 min-w-[140px]">
                     <div className="text-right">
                        <p className="text-editorial text-white/20 mb-1">Estimated Net</p>
                        <div className="text-3xl font-black text-white font-display">
                           {totalCost > 0 ? formatCurrency(totalCost) : "N/A"}
                        </div>
                     </div>

                     <div className="flex flex-col w-full gap-3">
                        <Link href={`/trips/${trip.id}`} className="btn-pro-primary w-full py-3 text-sm">
                           <Eye size={16} /> View
                        </Link>
                        <div className="flex gap-3">
                           <Link href={`/trips/${trip.id}/builder`} className="btn-pro-outline flex-1 py-3 text-sm">
                              <Pencil size={16} />
                           </Link>
                           <form
                             className="flex-1"
                             action={async () => {
                               "use server";
                               await deleteTrip(trip.id);
                             }}
                           >
                             <button type="submit" className="btn-pro-outline w-full py-3 text-sm text-red-400 hover:text-red-300">
                               <Trash2 size={16} />
                             </button>
                           </form>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
