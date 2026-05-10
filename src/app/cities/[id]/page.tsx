import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import AppChrome from "@/components/AppChrome";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowLeft, Clock, DollarSign, Sparkles } from "lucide-react";

export default async function CityActivitiesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const city = await prisma.city.findUnique({
    where: { id },
    include: { activities: { orderBy: { type: "asc" } } },
  });

  if (!city) notFound();

  return (
    <AppChrome>
      <Link
        href="/cities"
        className="inline-flex mb-10 items-center gap-3 rounded-full px-5 py-2.5 border border-white/[0.1] bg-white/[0.03] text-muted text-[12px] hover:text-accent-cyan hover:bg-white/[0.06] no-underline font-semibold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} strokeWidth={1.75} /> Cities index
      </Link>

      {city.description && (
        <p className="text-muted max-w-[720px] text-lg mb-10 leading-relaxed">{city.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mb-12">
        {[
          `Popularity ${city.popularity}/100`,
          `Cost index ${city.costIndex}/100`,
          `${city.activities.length} activities`,
        ].map((chip, idx) => (
          <span
            key={`${chip}-${idx}`}
            className={cn(
              "rounded-full border px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em]",
              idx === 0 && "border-accent-cyan/45 text-accent-cyan bg-accent-cyan/[0.08]",
              idx === 1 && "border-accent-pink/35 text-accent-pink bg-accent-pink/[0.08]",
              idx === 2 && "border-accent-lime/35 text-accent-lime bg-accent-lime/[0.06]"
            )}
          >
            {chip}
          </span>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-8 flex gap-10 items-center text-white">
        <Sparkles strokeWidth={1.75} size={28} className="text-accent-cyan" /> Things to do
      </h2>

      {city.activities.length === 0 ? (
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.02] px-12 py-16 text-muted text-center">
          No curated activities listed for this city yet.
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {city.activities.map((act: { id: string; name: string; type: string; duration: number | null; description: string | null; cost: number }) => (
            <div key={act.id} className="glass-pro rounded-[22px] px-8 py-8 flex flex-col">
              <h3 className="text-xl leading-snug mb-5 font-semibold text-white">{act.name}</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider border border-accent-cyan/30 text-accent-cyan">
                  {act.type}
                </span>
                {act.duration != null && (
                  <span className="rounded-full px-4 py-1.5 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] border border-accent-yellow/30 text-accent-yellow">
                    <Clock size={11} strokeWidth={2} />
                    {act.duration} min
                  </span>
                )}
              </div>
              {act.description && (
                <p className="text-[15px] text-muted mb-6 flex-1">{act.description}</p>
              )}
              <div className="flex items-center gap-3 text-accent-cyan mt-auto pt-4">
                <DollarSign size={18} strokeWidth={1.75} />
                <span className="text-xl tracking-tighter font-semibold">
                  {formatCurrency(act.cost)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppChrome>
  );
}
