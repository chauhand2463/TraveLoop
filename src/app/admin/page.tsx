import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Shield, Users, MapPin, Globe, TrendingUp, BarChart3 } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "admin") redirect("/dashboard");

  const totalUsers = await prisma.user.count();
  const totalTrips = await prisma.trip.count();
  const totalStops = await prisma.stop.count();
  const totalActivities = await prisma.activity.count();
  const totalCities = await prisma.city.count();

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { trips: true } } },
  });

  const topCities = await prisma.city.findMany({
    orderBy: { popularity: "desc" },
    take: 10,
    include: { _count: { select: { stops: true, activities: true } } },
  });

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "var(--color-primary)" },
    { label: "Total Trips", value: totalTrips, icon: MapPin, color: "var(--color-coral)" },
    { label: "Total Cities", value: totalCities, icon: Globe, color: "var(--color-accent)" },
    { label: "Total Activities", value: totalActivities, icon: TrendingUp, color: "var(--color-success)" },
  ];

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div className="animate-in" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Shield size={20} style={{ color: "var(--color-primary)" }} />
            <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Platform overview and user management.
          </p>
        </div>

        {/* Stats */}
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card card-elevated" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", background: `color-mix(in oklch, ${s.color}, transparent 88%)`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>{s.value}</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{s.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Recent Users */}
          <div className="animate-in">
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Users size={16} /> Recent Users
            </h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border-light)" }}>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Name</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Email</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 600 }}>Trips</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 600 }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u: any) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                      <td style={{ padding: "0.625rem 1rem" }}>{u.name || "—"}</td>
                      <td style={{ padding: "0.625rem 1rem", color: "var(--color-text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "center" }}>{u._count.trips}</td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "center" }}>
                        <span className={u.role === "admin" ? "badge badge-coral" : "badge badge-primary"} style={{ fontSize: "0.65rem" }}>{u.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Cities */}
          <div className="animate-in">
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BarChart3 size={16} /> Top Cities
            </h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
                <thead>
                  <tr style={{ background: "var(--color-surface-alt)", borderBottom: "1px solid var(--color-border-light)" }}>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>City</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Country</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 600 }}>Pop.</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 600 }}>Stops</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 600 }}>Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((c: any) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                      <td style={{ padding: "0.625rem 1rem", fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: "0.625rem 1rem", color: "var(--color-text-muted)" }}>{c.country}</td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "center" }}>{c.popularity}</td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "center" }}>{c._count.stops}</td>
                      <td style={{ padding: "0.625rem 1rem", textAlign: "center" }}>{c._count.activities}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
