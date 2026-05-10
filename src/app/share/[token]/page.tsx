import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatDateRange, formatCurrency, getDaysBetween } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Globe, Sparkles, Copy } from "lucide-react";

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

  const totalCost = trip.expenses.reduce((s: number, e: any) => s + e.amount, 0) +
    trip.stops.reduce((s: number, st: any) => s + st.activities.reduce((a: number, sa: any) => a + sa.cost, 0), 0);
  const days = getDaysBetween(trip.startDate, trip.endDate);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-surface)" }}>
      {/* Header */}
      <nav
        style={{
          background: "oklch(1 0 0 / 0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-border-light)",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            textDecoration: "none", fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: "1.25rem",
          }}
        >
          <span
            style={{
              width: "30px", height: "30px", borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-coral))",
              color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem",
            }}
          >
            ✈
          </span>
          <span className="gradient-text">Traveloop</span>
        </Link>
        <Link href="/register" className="btn btn-sm btn-primary">
          Create Your Own Trip
        </Link>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div className="badge badge-accent animate-in" style={{ marginBottom: "1rem" }}>
          Shared Itinerary
        </div>

        <div className="animate-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-display)", marginBottom: "0.5rem" }}>
            {trip.name}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <Calendar size={14} /> {formatDateRange(trip.startDate, trip.endDate)} · {days} days
            {trip.user.name && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                · by {trip.user.name}
              </span>
            )}
          </p>
          {trip.description && (
            <p style={{ color: "var(--color-text-secondary)", marginTop: "0.75rem", lineHeight: 1.7 }}>
              {trip.description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-primary)" }}>{trip.stops.length}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Cities</div>
          </div>
          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-coral)" }}>
              {trip.stops.reduce((s: number, st: any) => s + st.activities.length, 0)}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Activities</div>
          </div>
          <div className="card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--color-accent)" }}>{formatCurrency(totalCost)}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>Est. Cost</div>
          </div>
        </div>

        {/* Itinerary */}
        <h2 className="animate-in" style={{ fontSize: "1.35rem", fontFamily: "var(--font-display)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Globe size={18} /> Full Itinerary
        </h2>

        <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {trip.stops.map((stop: any, idx: number) => (
            <div key={stop.id} className="card card-elevated" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "40px", height: "40px", borderRadius: "var(--radius-full)",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-coral))",
                    color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: "0.875rem", flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{stop.city.name}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
                    {stop.city.country} · {formatDateRange(stop.startDate, stop.endDate)}
                  </p>
                  {stop.activities.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {stop.activities.map((sa: any) => (
                        <div key={sa.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "var(--color-surface-alt)", fontSize: "0.875rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className="badge badge-primary" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>{sa.activity.type}</span>
                            {sa.activity.name}
                          </span>
                          <span style={{ fontWeight: 600, color: "var(--color-accent-dark)" }}>{formatCurrency(sa.cost)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
