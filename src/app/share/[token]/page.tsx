import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { MapPin, Calendar, DollarSign, Globe, Copy, Share2, Sparkles } from "lucide-react";

export default async function SharedTripPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const trip = await prisma.trip.findUnique({
    where: { shareToken: token },
    include: {
      user: { select: { name: true } },
      stops: {
        include: {
          city: true,
          activities: { include: { activity: true } },
        },
        orderBy: { order: "asc" },
      },
      expenses: true,
    },
  });

  if (!trip || !trip.isPublic) notFound();

  const totalCost =
    trip.expenses.reduce((s: number, e: { amount: number }) => s + e.amount, 0) +
    trip.stops.reduce(
      (s: number, st: { activities: { cost: number }[] }) =>
        s + st.activities.reduce((a: number, sa: { cost: number }) => a + sa.cost, 0),
      0
    );
  const days = getDaysBetween(trip.startDate, trip.endDate);
  const activityCount = trip.stops.reduce(
    (s: number, st: { activities: unknown[] }) => s + st.activities.length,
    0
  );

  return (
    <AppChrome contentClassName="page-shell page-shell--form py-10 lg:py-12">
      <div className="mb-10 rounded-full border border-accent-cyan/35 bg-accent-cyan/[0.06] px-6 py-3 text-[13px] uppercase tracking-[0.3em] text-accent-cyan w-fit font-bold">
        Public link · live view
      </div>

      <header className="mb-16 animate-in space-y-4">
        <h1 className="text-6xl lg:text-[4.5rem] tracking-tight font-semibold text-white leading-none">
          {trip.name}
        </h1>
        <p className="text-gray-400 font-medium text-lg flex gap-10 flex-wrap gap-y-3">
          <Calendar className="shrink-0 text-accent-pink" strokeWidth={1.75} size={25} />
          {formatDateRange(trip.startDate, trip.endDate)} · {days} days
          {trip.user.name && <span className="opacity-80">· {trip.user.name}</span>}
        </p>
        {trip.description && (
          <p className="text-muted text-lg max-w-[720px] leading-relaxed">{trip.description}</p>
        )}
      </header>

      <div className="grid gap-5 sm:grid-cols-3 mb-20">
        <div className="glass-pro rounded-[20px] px-6 py-9 text-center">
          <div className="text-5xl font-semibold tracking-tight text-accent-cyan">{trip.stops.length}</div>
          <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-muted mt-3">Cities</p>
        </div>
        <div className="glass-pro rounded-[20px] px-6 py-9 text-center">
          <div className="text-5xl font-semibold tracking-tight text-accent-pink">{activityCount}</div>
          <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-muted mt-3">Activities</p>
        </div>
        <div className="glass-pro rounded-[20px] px-6 py-9 text-center">
          <div className="text-5xl font-semibold tracking-tight text-accent-yellow">{formatCurrency(totalCost)}</div>
          <p className="text-[12px] uppercase tracking-[0.2em] font-bold text-muted mt-3">Est. spend</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-8 flex gap-4 items-center text-white animate-in">
        <Globe strokeWidth={1.75} className="text-accent-lime" size={28} /> Route
      </h2>

      <div className="flex flex-col gap-8 animate-in pb-12">
        {trip.stops.map(
          (
            stop: {
              id: string;
              city: { name: string; country: string };
              startDate: Date;
              endDate: Date;
              activities: {
                id: string;
                cost: number;
                activity: { name: string; type: string };
              }[];
            },
            idx: number
          ) => (
            <div key={stop.id} className="glass-pro rounded-[22px] p-8">
              <div className="flex gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-accent-lime to-accent-cyan font-bold text-bg text-lg shadow-premium-soft border border-white/10">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl leading-tight font-semibold text-white">{stop.city.name}</h3>
                    <p className="text-sm text-muted uppercase tracking-[0.22em] mt-3 font-medium">
                      <MapPin strokeWidth={1.75} size={16} /> {stop.city.country} ·{" "}
                      {formatDateRange(stop.startDate, stop.endDate)}
                    </p>
                  </div>
                  {stop.activities.length > 0 && (
                    <ul className="space-y-3">
                      {stop.activities.map(
                        (sa: { id: string; cost: number; activity: { name: string; type: string } }) => (
                          <li
                            key={sa.id}
                            className="flex flex-wrap gap-4 justify-between items-center rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-3.5"
                          >
                            <span className="flex gap-4 items-center flex-wrap min-w-0">
                              <span className="rounded-full border border-accent-cyan/30 text-accent-cyan text-[11px] font-bold uppercase tracking-wider px-4 py-1.5">
                                {sa.activity.type}
                              </span>
                              <span className="text-white font-medium truncate">{sa.activity.name}</span>
                            </span>
                            <span className="text-accent-cyan font-semibold flex items-center gap-3 shrink-0">
                              <DollarSign size={16} strokeWidth={1.75} />
                              {formatCurrency(sa.cost)}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex flex-wrap gap-5 justify-center pt-8">
        <Link href="/register" className="btn-pro-primary px-10 py-5">
          Claim your own itinerary
        </Link>
        <Link href="/" className="btn-pro-outline px-10 py-5">
          Explore Traveloop
        </Link>
      </div>
    </AppChrome>
  );
}
