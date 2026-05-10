import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import DashboardLMSGrid from "@/components/premium/DashboardLMSGrid";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";
import type { LMSCity } from "@/components/premium/DashboardLMSGrid";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: {
      stops: { include: { city: true } },
      expenses: true,
    },
    orderBy: { startDate: "desc" },
    take: 12,
  });

  const totalTrips = await prisma.trip.count({
    where: { userId: session.user.id },
  });

  const totalExpenses = await prisma.expense.aggregate({
    where: { trip: { userId: session.user.id } },
    _sum: { amount: true },
  });

  const totalStops = await prisma.stop.count({
    where: { trip: { userId: session.user.id } },
  });

  const popularCitiesRaw = await prisma.city.findMany({
    orderBy: { popularity: "desc" },
    take: 6,
  });

  const popularCities: LMSCity[] = popularCitiesRaw.map((c) => ({
    id: c.id,
    name: c.name,
    country: c.country,
    costIndex: c.costIndex,
  }));

  const lmsTrips = trips.map((trip) => {
    const expenseTotal = trip.expenses.reduce((s: number, e: { amount: number }) => s + e.amount, 0);
    return {
      id: trip.id,
      name: trip.name,
      startDate: trip.startDate instanceof Date ? trip.startDate.toISOString() : String(trip.startDate),
      endDate: trip.endDate instanceof Date ? trip.endDate.toISOString() : String(trip.endDate),
      stops: trip.stops.length,
      expenseTotal,
      budgetLabel:
        expenseTotal > 0 ? formatCurrency(expenseTotal) : `${trip.stops.length} stops`,
    };
  });

  const todayIso = format(new Date(), "yyyy-MM-dd");

  const display =
    user?.name?.trim() ||
    (session.user.email ? session.user.email.split("@")[0] : "") ||
    "Voyager";

  return (
    <AppChrome>
      <div className="page-shell py-10 lg:py-14 pb-16">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">Dashboard</h1>
              <p className="text-muted text-base mt-2">Overview of your travel footprint</p>
            </div>
            <Link href="/trips/new" className="btn-pro-primary shrink-0">
              <PlusCircle size={18} />
              New Trip
            </Link>
          </div>
        </header>
        <DashboardLMSGrid
          displayName={display}
          totalTrips={totalTrips}
          totalStops={totalStops}
          cumulativeBudgetFormatted={formatCurrency(totalExpenses._sum.amount || 0)}
          trips={lmsTrips}
          cities={popularCities}
          todayIso={todayIso}
        />
      </div>
    </AppChrome>
  );
}
