import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import { deleteTrip } from "@/actions/trips";
import { MapPin, PlusCircle, Eye, Pencil, Trash2, Calendar, Globe, Plane, DollarSign, Clock, Share2, Bookmark } from "lucide-react";

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      stops: { include: { city: true } },
      expenses: true,
      packingItems: true,
      notes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const getTripStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "ongoing";
    return "completed";
  };

  const statusColors = {
    upcoming: { bg: "bg-accent-cyan/10", text: "text-accent-cyan", border: "border-accent-cyan/30" },
    ongoing: { bg: "bg-accent-lime/10", text: "text-accent-lime", border: "border-accent-lime/30" },
    completed: { bg: "bg-accent-pink/10", text: "text-accent-pink", border: "border-accent-pink/30" },
  };

  return (
    <AppChrome>
      <main className="page-shell py-10 lg:py-14 pb-16">
        <Breadcrumbs />
        
        <header className="mb-12 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Your <span className="text-accent-lime">Trips</span>
              </h1>
              <p className="text-muted mt-3">
                Manage and track all your travel adventures
              </p>
            </div>
            <Link href="/trips/new" className="btn-pro-primary shrink-0">
              <PlusCircle size={18} />
              New Trip
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total Trips", value: trips.length, icon: Plane, color: "text-accent-cyan" },
              { label: "Upcoming", value: trips.filter(t => getTripStatus(t.startDate, t.endDate) === "upcoming").length, icon: Calendar, color: "text-accent-lime" },
              { label: "Total Stops", value: trips.reduce((s, t) => s + t.stops.length, 0), icon: MapPin, color: "text-accent-pink" },
              { label: "Total Spent", value: formatCurrency(trips.reduce((s, t) => s + t.expenses.reduce((e, x) => e + x.amount, 0), 0)), icon: DollarSign, color: "text-accent-yellow" },
            ].map((stat, i) => (
              <div key={i} className="glass-pro p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${stat.color.replace('text', 'bg')}/10`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {trips.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No Trips Yet"
            description="Start planning your first adventure. Create a multi-city itinerary with budgets, activities, and more."
            action={
              <Link href="/trips/new" className="btn-pro-primary">
                <PlusCircle size={18} /> Create Your First Trip
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {trips.map((trip: any) => {
              const totalCost = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0);
              const days = getDaysBetween(trip.startDate, trip.endDate);
              const status = getTripStatus(trip.startDate, trip.endDate);
              const packedItems = trip.packingItems?.filter((i: any) => i.isPacked).length || 0;
              const totalItems = trip.packingItems?.length || 0;
              const packingProgress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

              return (
                <div key={trip.id} className="glass-pro group p-6 lg:p-8 relative overflow-hidden transition-all duration-300 hover:border-accent-cyan/30">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Plane size={120} />
                  </div>

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-editorial text-muted">#{trip.id.slice(-6)}</span>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border", statusColors[status as keyof typeof statusColors].bg, statusColors[status as keyof typeof statusColors].text, statusColors[status as keyof typeof statusColors].border)}>
                          {status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {trip.isPublic && (
                          <button className="p-2 rounded-lg hover:bg-white/[0.06] text-muted">
                            <Share2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 font-display group-hover:text-accent-cyan transition-colors line-clamp-1">
                      {trip.name}
                    </h3>

                    {/* Trip Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent-cyan" />
                        <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-accent-lime" />
                        <span>{days} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-accent-pink" />
                        <span>{trip.stops.length} stops</span>
                      </div>
                    </div>

                    {/* City Pills */}
                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                      {trip.stops.slice(0, 3).map((s: any) => (
                        <span key={s.id} className="px-3 py-1.5 bg-white/5 border border-white/[0.06] rounded-full text-[11px] font-medium text-white/70">
                          {s.city.name}
                        </span>
                      ))}
                      {trip.stops.length > 3 && (
                        <span className="text-xs text-muted">+{trip.stops.length - 3} more</span>
                      )}
                    </div>

                    {/* Progress Bars */}
                    {(totalItems > 0 || totalCost > 0) && (
                      <div className="space-y-3 mb-6">
                        {totalItems > 0 && (
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted">Packing</span>
                              <span className="text-white/70">{packedItems}/{totalItems}</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                              <div className="h-full bg-accent-lime rounded-full transition-all" style={{ width: `${packingProgress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1">Total Budget</p>
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

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}