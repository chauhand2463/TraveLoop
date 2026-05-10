import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { formatDateRange, formatCurrency } from "@/lib/utils";
import { deleteTrip } from "@/actions/trips";
import { MapPin, PlusCircle, Eye, Pencil, Trash2, Calendar, Globe, Plane } from "lucide-react";

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
    <AppChrome>
      <main className="page-shell py-10 lg:py-14 pb-16">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-editorial text-accent-cyan">Trip Archive</span>
                <div className="h-px flex-1 bg-white/10 max-w-[200px]" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Your <span className="text-accent-lime">Itineraries</span>
              </h1>
              <p className="text-muted mt-3 max-w-xl">
                Manage, refine, or delete your trips. All data stays synced with your dashboard.
              </p>
            </div>
            <Link href="/trips/new" className="btn-pro-primary shrink-0">
              <PlusCircle size={18} />
              New Trip
            </Link>
          </div>
        </header>

        {trips.length === 0 ? (
          <div className="glass-pro p-16 lg:p-24 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-lime/10 flex items-center justify-center">
              <Plane size={40} className="text-accent-lime" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 font-display">No Trips Yet</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Start planning your first adventure. Create a multi-city itinerary with budgets, activities, and more.
            </p>
            <Link href="/trips/new" className="btn-pro-primary">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {trips.map((trip: any) => {
              const totalCost = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0);
              return (
                <div key={trip.id} className="glass-pro group p-6 lg:p-8 relative overflow-hidden transition-all duration-300 hover:border-accent-cyan/30">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MapPin size={100} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-editorial text-muted">#{trip.id.slice(-6)}</span>
                        {trip.isPublic && (
                          <span className="px-3 py-1 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-semibold uppercase tracking-wider">
                            Public
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4 font-display group-hover:text-accent-cyan transition-colors line-clamp-1">
                      {trip.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent-cyan" />
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-accent-lime" />
                        <span>{trip.stops.length} stops</span>
                      </div>
                    </div>

                    {trip.description && (
                      <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-2">
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                      {trip.stops.slice(0, 4).map((s: any) => (
                        <span key={s.id} className="px-3 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-[11px] font-medium text-white/70">
                          {s.city.name}
                        </span>
                      ))}
                      {trip.stops.length > 4 && (
                        <span className="text-xs text-muted">+{trip.stops.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">Total Cost</p>
                        <p className="text-2xl font-semibold text-white font-display">
                          {totalCost > 0 ? formatCurrency(totalCost) : "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/trips/${trip.id}`} className="btn-pro-primary py-2.5 px-4 text-sm">
                          <Eye size={16} />
                          View
                        </Link>
                        <Link href={`/trips/${trip.id}/builder`} className="btn-pro-outline p-2.5">
                          <Pencil size={16} />
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteTrip(trip.id);
                        }}>
                          <button type="submit" className="btn-pro-outline p-2.5 text-red-400 hover:text-red-300">
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
    </AppChrome>
  );
}