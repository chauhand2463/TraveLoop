"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { addExpense, deleteExpense } from "@/actions/trips";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, DollarSign, Plus, Trash2, PieChart } from "lucide-react";

interface Expense { id: string; category: string; amount: number; description: string | null; }
interface StopAct { cost: number; activity: { type: string } }
interface Stop { activities: StopAct[] }
interface Trip { id: string; name: string; expenses: Expense[]; stops: Stop[]; }

const CATEGORIES = ["Transport", "Accommodation", "Food", "Activities", "Shopping", "Other"];
const CAT_COLORS: Record<string, string> = {
  Transport: "oklch(0.55 0.18 195)",
  Accommodation: "oklch(0.68 0.19 25)",
  Food: "oklch(0.70 0.18 45)",
  Activities: "oklch(0.60 0.18 145)",
  Shopping: "oklch(0.55 0.15 310)",
  Other: "oklch(0.50 0.05 260)",
};

export default function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const [tripId, setTripId] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setTripId(p.id));
  }, [params]);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    fetch(`/api/trips/${tripId}/budget`)
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addExpense(tripId, formData);
    setShowForm(false);
    const res = await fetch(`/api/trips/${tripId}/budget`);
    if (res.ok) setTrip(await res.json());
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    const res = await fetch(`/api/trips/${tripId}/budget`);
    if (res.ok) setTrip(await res.json());
  };

  if (loading || !trip) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
          <div className="skeleton" style={{ width: "250px", height: "28px", margin: "0 auto" }} />
        </main>
      </>
    );
  }

  const byCategory = CATEGORIES.map((cat) => ({
    name: cat,
    total: trip.expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: CAT_COLORS[cat],
  })).filter((c) => c.total > 0);

  const actCost = trip.stops.reduce((s, st) => s + st.activities.reduce((a, sa) => a + sa.cost, 0), 0);
  const expenseTotal = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const grandTotal = expenseTotal + actCost;
  const maxCat = Math.max(...byCategory.map((c) => c.total), actCost || 1);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <Link href={`/trips/${tripId}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={14} /> Back to Trip
        </Link>

        <div className="animate-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>
            Budget & <span className="gradient-text">Costs</span>
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>{trip.name}</p>
        </div>

        {/* Total */}
        <div className="card card-elevated animate-in" style={{ padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", marginBottom: "0.25rem" }}>Estimated Total Cost</div>
          <div style={{ fontSize: "3rem", fontWeight: 800, fontFamily: "var(--font-display)" }} className="gradient-text">
            {formatCurrency(grandTotal)}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "1rem" }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-primary)" }}>{formatCurrency(expenseTotal)}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Manual Expenses</div>
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-coral)" }}>{formatCurrency(actCost)}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Activity Costs</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="card animate-in" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1rem", fontFamily: "var(--font-display)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PieChart size={16} /> Cost Breakdown
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {actCost > 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600 }}>Activities (from itinerary)</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(actCost)}</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-surface-alt)" }}>
                  <div style={{ height: "100%", borderRadius: "4px", background: "oklch(0.60 0.18 145)", width: `${(actCost / maxCat) * 100}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            )}
            {byCategory.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(cat.total)}</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "var(--color-surface-alt)" }}>
                  <div style={{ height: "100%", borderRadius: "4px", background: cat.color, width: `${(cat.total / maxCat) * 100}%`, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Expense */}
        <div className="animate-in" style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: "1.15rem", fontFamily: "var(--font-display)" }}>Manual Expenses</h3>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> Add Expense
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="card card-elevated" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0.75rem", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Category</label>
                <select name="category" className="input" style={{ fontSize: "0.875rem" }}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Amount ($)</label>
                <input name="amount" type="number" step="0.01" required className="input" placeholder="0.00" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Description</label>
                <input name="description" className="input" placeholder="e.g. Flight tickets" style={{ fontSize: "0.875rem" }} />
              </div>
            </div>
            <button type="submit" className="btn btn-sm btn-primary" style={{ marginTop: "0.75rem" }}>Save Expense</button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {trip.expenses.map((exp) => (
            <div key={exp.id} className="card" style={{ padding: "0.875rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="badge badge-primary" style={{ fontSize: "0.65rem", marginRight: "0.5rem" }}>{exp.category}</span>
                <span style={{ fontSize: "0.875rem" }}>{exp.description || "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontWeight: 700 }}>{formatCurrency(exp.amount)}</span>
                <button onClick={() => handleDelete(exp.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", padding: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
