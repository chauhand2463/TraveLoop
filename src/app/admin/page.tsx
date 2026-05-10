import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import { Users, MapPin, Globe, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { trips: true } },
    },
  });

  const topCities = await prisma.city.findMany({
    orderBy: { popularity: "desc" },
    take: 10,
    include: { _count: { select: { stops: true, activities: true } } },
  });

  const statColors = ["text-accent-cyan", "text-accent-pink", "text-accent-lime", "text-accent-yellow"];
  const stats = [
    { label: "Total users", value: totalUsers, icon: Users, className: statColors[0] },
    { label: "Total trips", value: totalTrips, icon: MapPin, className: statColors[1] },
    { label: "Total cities", value: totalCities, icon: Globe, className: statColors[2] },
    {
      label: "Total activities",
      value: totalActivities,
      icon: TrendingUp,
      className: statColors[3],
    },
  ];

  return (
    <AppChrome>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-16">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-pro animate-in rounded-[22px] p-7">
              <div className="flex items-center gap-5">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04]",
                    s.className
                  )}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-5xl leading-none font-semibold tracking-tight text-white">{s.value}</div>
                  <p className="text-[13px] text-muted uppercase tracking-[0.2em] font-bold uppercase mt-3">
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="animate-in">
          <h2 className="text-xl font-semibold mb-6 flex gap-10 items-center text-white">
            <Users size={26} strokeWidth={1.5} className="text-accent-cyan" /> Recent users
          </h2>
          <div className="glass-pro rounded-[22px] overflow-hidden border border-white/[0.08]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/[0.08] bg-white/[0.03]">
                  <th className="px-6 py-4 font-semibold text-muted">Name</th>
                  <th className="px-6 py-4 font-semibold text-muted">Email</th>
                  <th className="px-6 py-4 font-semibold text-muted text-center">Trips</th>
                  <th className="px-6 py-4 font-semibold text-muted text-center">Role</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.06] last:border-none hover:bg-white/[0.02]">
                    <td className="px-6 py-3.5 font-semibold">{u.name || "—"}</td>
                    <td className="px-6 py-3.5 text-muted">{u.email}</td>
                    <td className="px-6 py-3.5 text-center">{u._count.trips}</td>
                    <td className="px-6 py-3.5 text-center">
                      <span
                        className={cn(
                          "rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-wider inline-block mt-[-2px]",
                          u.role === "admin"
                            ? "border border-accent-pink/55 text-accent-pink bg-accent-pink/[0.1]"
                            : "border border-accent-lime/40 text-accent-lime bg-accent-lime/[0.1]"
                        )}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="animate-in">
          <h2 className="text-xl font-semibold mb-6 flex gap-10 items-center text-white">
            <BarChart3 size={26} strokeWidth={1.5} className="text-accent-lime" /> Top cities
          </h2>
          <div className="glass-pro rounded-[22px] overflow-hidden border border-white/[0.08]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left uppercase tracking-[0.2em] text-[11px] font-bold border-b border-white/[0.08] bg-white/[0.03]">
                  <th className="px-6 py-4 font-semibold text-muted">City</th>
                  <th className="px-6 py-4 font-semibold text-muted">Country</th>
                  <th className="px-6 py-4 font-semibold text-muted text-center">Pop.</th>
                  <th className="px-6 py-4 font-semibold text-muted text-center">Stops</th>
                  <th className="px-6 py-4 font-semibold text-muted text-center">Acts</th>
                </tr>
              </thead>
              <tbody>
                {topCities.map((c) => (
                  <tr key={c.id} className="border-b border-white/[0.06] last:border-none hover:bg-white/[0.02]">
                    <td className="px-6 py-3.5 font-semibold">{c.name}</td>
                    <td className="px-6 py-3.5 text-muted">{c.country}</td>
                    <td className="px-6 py-3.5 text-center">{c.popularity}</td>
                    <td className="px-6 py-3.5 text-center">{c._count.stops}</td>
                    <td className="px-6 py-3.5 text-center">{c._count.activities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
