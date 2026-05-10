import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, MapPin, Clock, DollarSign, Sparkles } from "lucide-react";

export default async function CityActivitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const city = await prisma.city.findUnique({
    where: { id },
    include: { activities: { orderBy: { type: "asc" } } },
  });

  if (!city) notFound();

  const types = [...new Set(city.activities.map((a: any) => a.type))];

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <Link href="/cities" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={14} /> Back to Cities
        </Link>

        <div className="animate-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>
            <span className="gradient-text">{city.name}</span>
          </h1>
          <p style={{ color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
            <MapPin size={14} /> {city.country}
            {city.region && <span> · {city.region}</span>}
          </p>
          {city.description && (
            <p style={{ color: "var(--color-text-secondary)", marginTop: "0.75rem", lineHeight: 1.7 }}>
              {city.description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          <span className="badge badge-primary">Popularity: {city.popularity}/100</span>
          <span className="badge badge-coral">Cost Index: {city.costIndex}/100</span>
          <span className="badge badge-accent">{city.activities.length} Activities</span>
        </div>

        <h2 className="animate-in" style={{ fontSize: "1.25rem", fontFamily: "var(--font-display)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={18} /> Things to Do
        </h2>

        {city.activities.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
            <p>No activities listed for this city yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {city.activities.map((act: any) => (
              <div key={act.id} className="card" style={{ padding: "1.25rem" }}>
                <h4 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.375rem" }}>{act.name}</h4>
                <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>{act.type}</span>
                  <span className="badge badge-accent" style={{ fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                    <Clock size={9} /> {act.duration} min
                  </span>
                </div>
                {act.description && (
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                    {act.description}
                  </p>
                )}
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-accent-dark)" }}>
                  {formatCurrency(act.cost)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
