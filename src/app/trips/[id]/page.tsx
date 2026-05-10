import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import { MapPin, Calendar, DollarSign, Pencil, Share2, ListChecks, StickyNote, ArrowLeft, Globe, Sparkles, Navigation } from "lucide-react";

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
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      {/* Cinematic Header Overlay */}
      <div className="relative h-[40vh] min-h-[400px] flex items-end p-6 lg:p-20 overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent z-10" />
         <div className="mesh-gradient opacity-40 z-0" />
         
         <div className="relative z-20 max-w-[1400px] mx-auto w-full">
            <Link href="/trips" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest no-underline mb-6 hover:gap-4 transition-all">
               <ArrowLeft size={16} /> Protocol Registry
            </Link>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
               <div>
                  <h1 className="text-5xl lg:text-8xl font-black tracking-tighter text-white font-display uppercase leading-none mb-4">
                    {trip.name}
                  </h1>
                  <div className="flex items-center gap-6 text-text-muted">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      <span className="font-medium tracking-tight text-lg">{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/20" />
                    <div className="flex items-center gap-2">
                      <Navigation size={18} className="text-primary" />
                      <span className="font-medium tracking-tight text-lg">{days} Days Sequence</span>
                    </div>
                  </div>
               </div>
               
               <div className="flex gap-3">
                  <Link href={`/trips/${trip.id}/builder`} className="btn-pro-primary h-fit px-10">
                    <Pencil size={18} />
                    Edit Sequence
                  </Link>
                  {trip.isPublic && (
                    <button className="btn-pro-outline px-6">
                       <Share2 size={18} />
                    </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Itinerary Timeline */}
        <div className="lg:col-span-8">
           <div className="flex items-center gap-3 mb-12">
              <span className="text-editorial">Itinerary Sequence</span>
              <div className="h-[1px] flex-1 bg-white/10" />
           </div>

           {trip.stops.length === 0 ? (
             <div className="glass-pro p-20 text-center">
               <Sparkles size={48} className="mx-auto mb-6 text-primary/20" />
               <p className="text-text-muted mb-8 text-lg">No nodes detected in this sequence.</p>
               <Link href={`/trips/${trip.id}/builder`} className="btn-pro-primary">Initialize Nodes</Link>
             </div>
           ) : (
             <div className="space-y-12 relative">
               {/* Connecting Line */}
               <div className="absolute left-[23px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary/40 via-accent/40 to-primary/40" />
               
               {trip.stops.map((stop: any, idx: number) => (
                 <div key={stop.id} className="relative group">
                    <div className="flex gap-10">
                       {/* Node Marker */}
                       <div className="relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-surface border-2 border-primary flex items-center justify-center text-primary font-black font-display group-hover:bg-primary group-hover:text-surface transition-all">
                             {idx + 1}
                          </div>
                       </div>

                       {/* Node Content */}
                       <div className="flex-1 glass-pro p-10 group-hover:bg-white/5 transition-all">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                             <div>
                                <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-2">{stop.city.name}</h3>
                                <p className="text-text-muted uppercase tracking-widest text-xs">{stop.city.country} · {formatDateRange(stop.startDate, stop.endDate)}</p>
                             </div>
                             <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[0.6rem] font-black uppercase tracking-widest">
                                Node Access Authorized
                             </div>
                          </div>

                          {stop.activities.length > 0 && (
                            <div className="space-y-3">
                               {stop.activities.map((sa: any) => (
                                 <div key={sa.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                       <div className="w-2 h-2 rounded-full bg-primary" />
                                       <div>
                                          <p className="text-white font-bold text-sm uppercase tracking-tight">{sa.activity.name}</p>
                                          <p className="text-editorial text-white/40">{sa.activity.type}</p>
                                       </div>
                                    </div>
                                    <div className="text-white font-black font-display text-lg">
                                       {formatCurrency(sa.cost)}
                                    </div>
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

        {/* Right Column: Tactical Board */}
        <div className="lg:col-span-4 space-y-12">
           {/* Financial Overview */}
           <section>
              <h4 className="text-editorial mb-6">Financial Analytics</h4>
              <div className="glass-pro p-10 space-y-8 bg-primary/5 border-primary/20">
                 <div>
                    <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-2">Estimated Net Cost</p>
                    <div className="text-5xl font-black text-white font-display">
                       {formatCurrency(totalBudget + activityCost)}
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-text-muted">Node Activities</span>
                       <span className="text-white font-bold">{formatCurrency(activityCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-text-muted">Logged Expenses</span>
                       <span className="text-white font-bold">{formatCurrency(totalBudget)}</span>
                    </div>
                    <div className="h-[1px] bg-white/10" />
                    <Link href={`/trips/${trip.id}/budget`} className="btn-pro-outline w-full py-4 text-xs">
                       Detailed Audit <DollarSign size={14} />
                    </Link>
                 </div>
              </div>
           </section>

           {/* Inventory Protocol */}
           <section>
              <h4 className="text-editorial mb-6">Inventory Protocol</h4>
              <div className="glass-pro p-10">
                 <div className="flex items-end justify-between mb-8">
                    <div>
                       <p className="text-4xl font-black text-white font-display">{packedCount}/{trip.packingItems.length}</p>
                       <p className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Items Authorized</p>
                    </div>
                    <div className="text-primary">
                       <ListChecks size={32} />
                    </div>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${(packedCount / (trip.packingItems.length || 1)) * 100}%` }} />
                 </div>
                 <Link href={`/trips/${trip.id}/packing`} className="btn-pro-outline w-full py-4 text-xs">
                    Inventory Check <ListChecks size={14} />
                 </Link>
              </div>
           </section>

           {/* Tactical Notes */}
           <section>
              <h4 className="text-editorial mb-6">Tactical Notes</h4>
              <div className="glass-pro p-10">
                 {trip.notes.length > 0 ? (
                    <div className="space-y-4 mb-8">
                       {trip.notes.slice(0, 2).map((note: any) => (
                         <div key={note.id} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                            <p className="text-sm text-text-muted italic leading-relaxed line-clamp-3">"{note.content}"</p>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <p className="text-sm text-text-muted italic mb-8">No tactical briefings logged.</p>
                 )}
                 <Link href={`/trips/${trip.id}/notes`} className="btn-pro-outline w-full py-4 text-xs">
                    Access Briefing <StickyNote size={14} />
                 </Link>
              </div>
           </section>
        </div>

      </main>
    </div>
  );
}
