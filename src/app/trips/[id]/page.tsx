import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import EmptyState from "@/components/EmptyState";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import { Calendar, DollarSign, Pencil, Share2, ListChecks, StickyNote, ArrowLeft, Globe, Navigation, MapPin, Plus } from "lucide-react";

export default async function TripViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const trip = await prisma.trip.findUnique({
    where: { id, userId: session.user.id },
    include: {
      stops: {
        include: {
          city: true,
          activities: { include: { activity: true } },
        },
        orderBy: { order: "asc" },
      },
      expenses: true,
      packingItems: true,
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!trip) notFound();

  const totalBudget = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0);
  const activityCost = trip.stops.reduce(
    (s: number, stop: any) => s + stop.activities.reduce((a: number, sa: any) => a + sa.cost, 0),
    0
  );
  const days = getDaysBetween(trip.startDate, trip.endDate);
  const packedCount = trip.packingItems.filter((i: any) => i.isPacked).length;

  return (
    <AppChrome contentClassName="max-w-none w-full px-0 py-0">
      <div className="bg-bg pb-24">
        <div className="relative flex min-h-[min(40vh,400px)] items-end overflow-hidden pb-10 pt-24">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
          <div className="mesh-gradient absolute inset-0 z-0 opacity-[0.4]" />

          <div className="page-shell relative z-20 w-full">
            <Breadcrumbs />
            
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mt-6">
              <div className="min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                  {trip.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-muted">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-accent-cyan" />
                    <span className="text-sm">{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-accent-lime" />
                    <span className="text-sm">{days} days</span>
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent-pink" />
                    <span className="text-sm">{trip.stops.length} stops</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/trips/${trip.id}/builder`} className="btn-pro-primary">
                  <Pencil size={16} />
                  Edit Trip
                </Link>
                {trip.isPublic && (
                  <button type="button" className="btn-pro-outline p-3">
                    <Share2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="page-shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:py-12">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-editorial text-accent-cyan">Itinerary</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {trip.stops.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No Stops Yet"
                description="Add cities and activities to your itinerary to start planning your adventure."
                action={
                  <Link href={`/trips/${trip.id}/builder`} className="btn-pro-primary">
                    <Plus size={18} /> Add First Stop
                  </Link>
                }
              />
            ) : (
              <div className="space-y-6 relative">
                <div className="absolute left-[20px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-accent-cyan/40 via-accent-lime/40 to-accent-pink/40" />
                
                {trip.stops.map((stop: any, idx: number) => (
                  <div key={stop.id} className="relative group">
                    <div className="flex gap-6">
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-card border-2 border-accent-lime flex items-center justify-center text-accent-lime font-bold">
                          {idx + 1}
                        </div>
                      </div>

                      <div className="flex-1 glass-pro p-6 group-hover:border-accent-cyan/20 transition-all">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white">{stop.city.name}</h3>
                            <p className="text-sm text-muted mt-1">{stop.city.country} • {formatDateRange(stop.startDate, stop.endDate)}</p>
                          </div>
                        </div>

                        {stop.activities.length > 0 && (
                          <div className="space-y-2">
                            {stop.activities.map((sa: any) => (
                              <div key={sa.id} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-accent-cyan/20 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-accent-lime" />
                                  <div>
                                    <p className="text-sm font-medium text-white">{sa.activity.name}</p>
                                    <p className="text-xs text-muted">{sa.activity.type}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-white">
                                  {formatCurrency(sa.cost)}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="glass-pro p-6">
              <h3 className="text-editorial text-accent-yellow mb-4">Budget Overview</h3>
              <div className="mb-6">
                <p className="text-sm text-muted mb-1">Total Cost</p>
                <p className="text-3xl font-semibold text-white font-display">
                  {formatCurrency(totalBudget + activityCost)}
                </p>
              </div>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Activities</span>
                  <span className="text-white font-medium">{formatCurrency(activityCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Expenses</span>
                  <span className="text-white font-medium">{formatCurrency(totalBudget)}</span>
                </div>
              </div>
              <Link href={`/trips/${trip.id}/budget`} className="btn-pro-outline w-full justify-center py-2.5 text-sm">
                <DollarSign size={14} /> View Details
              </Link>
            </section>

            <section className="glass-pro p-6">
              <h3 className="text-editorial text-accent-lime mb-4">Packing List</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-2xl font-semibold text-white">{packedCount}/{trip.packingItems.length}</p>
                  <p className="text-sm text-muted">items packed</p>
                </div>
                <ListChecks size={24} className="text-accent-lime" />
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden mb-6">
                <div className="h-full bg-accent-lime transition-all" style={{ width: `${(packedCount / (trip.packingItems.length || 1)) * 100}%` }} />
              </div>
              <Link href={`/trips/${trip.id}/packing`} className="btn-pro-outline w-full justify-center py-2.5 text-sm">
                <ListChecks size={14} /> Manage List
              </Link>
            </section>

            <section className="glass-pro p-6">
              <h3 className="text-editorial text-accent-pink mb-4">Notes</h3>
              {trip.notes.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {trip.notes.slice(0, 2).map((note: any) => (
                    <div key={note.id} className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                      <p className="text-sm text-muted line-clamp-2">"{note.content}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted mb-6">No notes yet.</p>
              )}
              <Link href={`/trips/${trip.id}/notes`} className="btn-pro-outline w-full justify-center py-2.5 text-sm">
                <StickyNote size={14} /> View All
              </Link>
            </section>
          </div>
        </main>
      </div>
    </AppChrome>
  );
}