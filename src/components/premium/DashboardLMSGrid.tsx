"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import {
  ArrowRight,
  Calendar,
  MapPin,
  PlusCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export type LMSCity = {
  id: string;
  name: string;
  country: string;
  costIndex: number;
};

export type LMSTrip = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stops: number;
  expenseTotal: number;
  budgetLabel: string;
};

type Props = {
  displayName: string;
  totalTrips: number;
  totalStops: number;
  cumulativeBudgetFormatted: string;
  trips: LMSTrip[];
  cities: LMSCity[];
  /** YYYY-MM-DD for consistent SSR day highlight */
  todayIso: string;
};

const ACCENTS = ["bg-accent-cyan", "bg-accent-pink", "bg-accent-yellow", "bg-accent-lime"];

const chartFallback = [
  { d: "Mon", theory: 3, practice: 2 },
  { d: "Tue", theory: 4, practice: 3 },
  { d: "Wed", theory: 2, practice: 5 },
  { d: "Thu", theory: 5, practice: 3 },
  { d: "Fri", theory: 3, practice: 4 },
  { d: "Sat", theory: 2, practice: 6 },
  { d: "Sun", theory: 6, practice: 2 },
];

export default function DashboardLMSGrid({
  displayName,
  totalTrips,
  totalStops,
  cumulativeBudgetFormatted,
  trips,
  cities,
  todayIso,
}: Props) {
  const chartUid = useId().replace(/:/g, "");
  const [journeysTab, setJourneysTab] = useState<"explore" | "mine">("mine");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const today = useMemo(() => new Date(todayIso), [todayIso]);

  const monthStart = startOfMonth(monthCursor);
  const monthEnd = endOfMonth(monthCursor);
  const gridDays = useMemo(() => {
    const pad = monthStart.getDay();
    const daysInMonth = monthEnd.getDate();
    const cells: ({ date?: Date } | null)[] = [];
    for (let i = 0; i < pad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(monthStart.getFullYear(), monthStart.getMonth(), d) });
    }
    return cells;
  }, [monthStart, monthEnd, monthCursor]);

  const tripRanges = useMemo(() => {
    return trips.flatMap((t) => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      try {
        return eachDayOfInterval({ start: s, end: e }).map((d) => ({
          tripId: t.id,
          date: d,
        }));
      } catch {
        return [];
      }
    });
  }, [trips]);

  const dotsForDay = (date?: Date) => {
    if (!date) return [];
    const matches = tripRanges.filter(({ date: d }) => isSameDay(d, date));
    const uniq = [...new Map(matches.map((m) => [m.tripId, m])).values()];
    const palette = [
      "bg-accent-yellow",
      "bg-accent-teal",
      "bg-accent-pink",
      "bg-accent-cyan",
    ];
    return uniq.slice(0, 3).map((_, i) => palette[i % palette.length]);
  };

  const started = trips.length;
  const completedGuess = Math.min(totalTrips, Math.floor(totalTrips * 0.35));

  const ringStyle = useMemo(() => {
    const p1 = Math.max(25, completedGuess * 8);
    const p2 = Math.max(20, Math.min(40, totalStops * 3));
    return {
      background: `conic-gradient(
        #fee440 0deg ${p1 + 80}deg,
        #a4f644 ${p1 + 80}deg ${p2 + 200}deg,
        #ff5c8d ${p2 + 200}deg 360deg
      )`,
    } as React.CSSProperties;
  }, [completedGuess, totalStops]);

  const barData =
    trips.length >= 2
      ? trips.slice(0, 7).map((t) => ({
          d: t.name.slice(0, 3),
          theory: Math.max(1, t.stops * 3),
          practice: Math.min(24, Math.max(2, Math.round(t.expenseTotal / 30))),
        }))
      : chartFallback;

  return (
    <>
      {/* Personal welcome */}
      <header className="mb-10 space-y-2">
        <p className="text-editorial">
          Workspace · Hello,{" "}
          <span className="text-accent-cyan">{displayName}</span>
        </p>
        <h2 className="text-4xl lg:text-[2.85rem] font-semibold tracking-tight text-white">
          Plan premium journeys{" "}
          <span className="text-accent-lime">&amp; itineraries</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Journeys + calendar */}
        <div className="xl:col-span-8 glass-pro overflow-hidden rounded-[22px] p-8">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Journeys
            </h3>
            <div className="flex items-center gap-3 rounded-full bg-card-muted p-1.5 border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setJourneysTab("explore")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer border-none bg-transparent",
                  journeysTab === "explore"
                    ? "bg-white text-bg shadow-premium-soft"
                    : "text-muted hover:text-white"
                )}
              >
                Explore
              </button>
              <button
                type="button"
                onClick={() => setJourneysTab("mine")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer border-none bg-transparent",
                  journeysTab === "mine"
                    ? "bg-white text-bg shadow-premium-soft"
                    : "text-muted hover:text-white"
                )}
              >
                My trips
              </button>
            </div>
          </div>

          {journeysTab === "explore" ? (
            <div className="rounded-xl border border-dashed border-accent-cyan/25 bg-accent-cyan/5 p-10 text-center space-y-4">
              <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
                Open the Discover tab to browse the global registry, then stitch
                cities into your next sequence inside the Planner.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/cities" className="btn-pro-outline">
                  Browse destinations
                </Link>
                <Link href="/trips/new" className="btn-pro-primary py-3">
                  New itinerary
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-16 text-center space-y-6">
              <Sparkles className="mx-auto text-accent-lime opacity-70" size={52} strokeWidth={1.25} />
              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">
                  No journeys yet — start yours
                </p>
                <p className="text-sm text-muted max-w-md mx-auto">
                  Sketch dates, stitch cities together, balance spend, share the
                  plan.
                </p>
              </div>
              <Link href="/trips/new" className="btn-pro-primary px-10 py-4">
                <PlusCircle size={22} strokeWidth={1.75} />
                Create itinerary
              </Link>
            </div>
          ) : (
            <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
              {trips.map((trip, i) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className={cn(
                    "relative shrink-0 w-[280px] overflow-hidden rounded-2xl border border-white/[0.08]",
                    "bg-card-muted hover:border-accent-cyan/35 transition-colors no-underline group shadow-premium-soft"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-4 top-4 z-[1] rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-bg",
                      ACCENTS[i % ACCENTS.length]
                    )}
                  >
                    {trip.budgetLabel}
                  </span>
                  <div className="h-36 bg-linear-to-br from-white/[0.08] via-transparent to-accent-cyan/10 flex items-center justify-center">
                    <div className="text-7xl opacity-85 select-none">✈️</div>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted">
                      Itinerary
                    </p>
                    <p className="text-lg font-semibold tracking-tight text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                      {trip.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/85">
                        {trip.stops} stops
                      </span>
                      <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/85">
                        {trip.expenseTotal > 0 ? "Spend tracked" : "Draft"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-4 glass-pro rounded-[22px] p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {format(monthCursor, "MMMM yyyy")}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-white/[0.1] bg-white/[0.04] cursor-pointer hover:bg-white/[0.1] transition-colors flex items-center justify-center text-muted"
                aria-label="Previous month"
                onClick={() =>
                  setMonthCursor(
                    (d) => new Date(d.getFullYear(), d.getMonth() - 1)
                  )
                }
              >
                ‹
              </button>
              <button
                type="button"
                className="h-10 w-10 rounded-xl border border-white/[0.1] bg-white/[0.04] cursor-pointer hover:bg-white/[0.1] transition-colors flex items-center justify-center text-muted"
                aria-label="Next month"
                onClick={() =>
                  setMonthCursor(
                    (d) => new Date(d.getFullYear(), d.getMonth() + 1)
                  )
                }
              >
                ›
              </button>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-5 text-center text-sm font-medium">
            {gridDays.map((cell, i) => {
              if (!cell || !cell.date) {
                return <div key={`e-${i}`} />;
              }
              const isToday = isSameDay(cell.date, today);
              const inMonth = isSameMonth(cell.date, monthCursor);
              const dots = dotsForDay(cell.date);
              return (
                <div key={cell.date.toISOString()} className="flex flex-col items-center gap-1.5 py-2">
                  <span
                    className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors leading-none",
                      inMonth ? "text-white" : "text-white/30",
                      isToday &&
                        "ring-2 ring-white bg-white/[0.1] shadow-premium-soft"
                    )}
                  >
                    {format(cell.date, "d")}
                  </span>
                  <div className="flex gap-1">
                    {dots.map((cls, dotI) => (
                      <span
                        key={`${cell.date}-${dotI}`}
                        className={cn("h-2 w-2 rounded-full shrink-0", cls)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Calendar className="mt-0.5 shrink-0 text-accent-yellow" size={16} strokeWidth={1.75} />
            Dots mark days covered by trips in this month window.
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-pro rounded-[22px] p-8">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Planning footprint
            </h3>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              Stacked · itinerary vs logistics
            </p>
          </div>
          <div className="mb-12 grid gap-10 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1">
                Nodes
              </p>
              <p className="text-5xl font-semibold tracking-tight text-accent-cyan">
                {totalStops}
              </p>
              <p className="mt-3 text-[11px] text-muted uppercase tracking-wider">
                Stops routed
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1">
                Sequences
              </p>
              <p className="text-5xl font-semibold tracking-tight text-accent-pink">
                {totalTrips}
              </p>
              <p className="mt-3 text-[11px] text-muted uppercase tracking-wider">
                Active builds
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted mb-1">
                Spend index
              </p>
              <p className="text-5xl font-semibold tracking-tight text-accent-yellow">
                {cumulativeBudgetFormatted}
              </p>
              <p className="mt-3 text-[11px] text-muted uppercase tracking-wider">
                Logged to trips
              </p>
            </div>
          </div>
          <div className="min-h-[240px] min-w-0 [&_.recharts-cartesian-axis-tick_text]:fill-[#71717b] [&_.recharts-surface]:outline-none [&_rect]:rounded-md">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barGap={6} margin={{ left: -16, top: 4 }}>
                <defs>
                  <linearGradient id={`pink-${chartUid}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff5c8d" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ff5c8d55" />
                  </linearGradient>
                  <linearGradient id={`limeg-${chartUid}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#a4f644" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a4f64455" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="d" stroke="transparent" tickLine={false} />
                <YAxis stroke="transparent" tickLine={false} width={0} />
                <Tooltip
                  contentStyle={{
                    background: "#161616",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px",
                    color: "#fafafa",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  labelFormatter={() => ""}
                  formatter={(value, name, _item, _idx, payload) => {
                    void _item;
                    void _idx;
                    void payload;
                    const v = value ?? "";
                    const n =
                      typeof name === "string" ? name : name != null ? String(name) : "";
                    return [`${v}`, n];
                  }}
                />
                <Bar dataKey="theory" name="routing" radius={[12, 12, 0, 0]} fill={`url(#limeg-${chartUid})`} maxBarSize={28} />
                <Bar dataKey="practice" name="logistics" radius={[12, 12, 0, 0]} fill={`url(#pink-${chartUid})`} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-pro rounded-[22px] flex flex-col p-8">
          <div className="mb-6 flex justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              {started} journeys
            </h3>
          </div>
          <div className="mx-auto mb-14 flex justify-center mt-12">
            <div
              className="rounded-full h-44 w-44 p-[3px] animate-in"
              style={ringStyle}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-card-muted border border-black/40 px-10 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                  Velocity
                </p>
                <p className="mt-6 text-[2rem] leading-none font-semibold text-white">{started}</p>
              </div>
            </div>
          </div>
          <dl className="mt-auto grid grid-cols-1 gap-3 text-[13px]">
            <div className="flex justify-between rounded-[14px] border border-yellow-500/35 bg-accent-yellow/[0.05] px-4 py-3">
              <dt className="uppercase tracking-wider text-accent-yellow font-bold text-[11px]">
                Routed
              </dt>
              <dd className="font-semibold">{totalTrips}</dd>
            </div>
            <div className="flex justify-between rounded-[14px] border border-lime-400/35 bg-accent-lime/[0.06] px-4 py-3">
              <dt className="uppercase tracking-wider text-accent-lime font-bold text-[11px]">
                On map
              </dt>
              <dd className="font-semibold">{totalStops}</dd>
            </div>
          </dl>
          <Link
            href="/trips/new"
            className="btn-pro-primary mt-6 w-full py-4 justify-center"
          >
            <PlusCircle strokeWidth={1.75} size={22} /> New itinerary
          </Link>
        </div>

      </div>

      {/* Destinations */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-8">
          <div className="mb-10 flex justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              Recent itineraries
            </h3>
            <Link href="/trips" className="rounded-full px-6 py-2.5 text-sm font-medium text-accent-cyan border border-accent-cyan/40 hover:bg-accent-cyan/[0.1] transition-colors no-underline">
              Archive
            </Link>
          </div>
          <div className="space-y-4">
            {trips.slice(0, 8).length === 0 ? (
              <div className="rounded-xl bg-card-muted px-16 py-20 text-center text-muted border border-white/[0.06]">
                Build your first itinerary to populate this rail.
              </div>
            ) : (
              trips.slice(0, 8).map((trip) => (
                <Link
                  key={`row-${trip.id}`}
                  href={`/trips/${trip.id}`}
                  className="group flex justify-between rounded-[14px] border border-transparent bg-card-muted hover:border-accent-cyan/35 px-5 py-4 transition-all gap-10 no-underline"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">
                      #{trip.id.slice(-6)}
                    </span>
                    <p className="mt-4 text-lg font-semibold text-white truncate group-hover:text-accent-cyan">
                      {trip.name}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                      <span className="inline-flex items-center gap-2">
                        <MapPin strokeWidth={1.75} size={16} />
                        {trip.stops} stops
                      </span>
                      <span className="opacity-70 normal-case">{trip.startDate.slice(0, 10)}</span>
                    </div>
                  </div>
                  <ArrowRight strokeWidth={1.75} className="flex-shrink-0 text-white/35 group-hover:translate-x-1 group-hover:text-accent-cyan transition-all" />
                </Link>
              ))
            )}
          </div>
        </section>

        <aside className="lg:col-span-4 rounded-[22px] border border-white/[0.08] bg-gradient-to-b from-card-muted to-transparent p-8">
          <div className="flex items-start gap-4 mb-10">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent-pink/30 bg-accent-pink/[0.08]">
              <TrendingUp className="text-accent-pink" size={26} strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.34em] text-muted">
                Global pulse
              </span>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                Trending destinations
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {cities.slice(0, 6).map((city: LMSCity, i: number) => (
              <Link key={city.id}
                href={`/cities/${city.id}`}
                className="flex justify-between items-center rounded-[14px] border border-white/[0.06] bg-bg/40 backdrop-blur-sm px-4 py-3 text-sm hover:border-accent-lime/30 transition-colors no-underline gap-12"
              >
                <span className="truncate text-white">{city.name}</span>
                <span className="text-[13px] font-semibold whitespace-nowrap" style={{
                  color:
                    ["#fee440", "#ff5c8d", "#4cc9f0", "#a4f644"][i % 4],
                }}>
                  {city.costIndex}
                </span>
              </Link>
            ))}
          </div>
          <Link href="/trips/new" className="btn-pro-outline mt-10 w-full py-5 justify-center">
            Plan next route
          </Link>
        </aside>
      </div>
    </>
  );
}
