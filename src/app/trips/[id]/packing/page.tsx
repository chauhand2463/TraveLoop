"use client";

import { useState, useEffect } from "react";
import AppChrome from "@/components/AppChrome";
import Link from "next/link";
import { addPackingItem, togglePackingItem, deletePackingItem } from "@/actions/trips";
import { ArrowLeft, ListChecks, Plus, Check, Trash2, RotateCcw } from "lucide-react";

interface PackingItem { id: string; name: string; category: string; isPacked: boolean; }

const PACKING_CATS = ["Clothing", "Documents", "Electronics", "Toiletries", "Medicine", "Other"];

export default function PackingPage({ params }: { params: Promise<{ id: string }> }) {
  const [tripId, setTripId] = useState("");
  const [items, setItems] = useState<PackingItem[]>([]);
  const [tripName, setTripName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setTripId(p.id));
  }, [params]);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    fetch(`/api/trips/${tripId}/packing`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.packingItems);
        setTripName(data.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addPackingItem(tripId, formData);
    setShowForm(false);
    const res = await fetch(`/api/trips/${tripId}/packing`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.packingItems);
    }
  };

  const handleToggle = async (id: string) => {
    await togglePackingItem(id);
    const res = await fetch(`/api/trips/${tripId}/packing`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.packingItems);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePackingItem(id);
    const res = await fetch(`/api/trips/${tripId}/packing`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.packingItems);
    }
  };

  if (loading) {
    return (
      <AppChrome>
        <main className="max-w-[700px] mx-auto px-6 py-28 text-center">
          <div className="animate-pulse h-8 bg-white/[0.08] rounded-xl w-48 mx-auto" />
        </main>
      </AppChrome>
    );
  }

  const grouped = PACKING_CATS.map((cat) => ({
    name: cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  const packed = items.filter((i) => i.isPacked).length;
  const total = items.length;
  const pct = total > 0 ? Math.round((packed / total) * 100) : 0;

  return (
    <AppChrome contentClassName="page-shell page-shell--narrow py-10 lg:py-12">
      <main className="">
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted hover:text-accent-cyan transition-colors mb-10 no-underline">
          <ArrowLeft size={16} strokeWidth={1.75} /> Trip overview
        </Link>

        <div className="animate-in mb-12 space-y-2">
          <h1 className="text-5xl lg:text-[2.85rem] font-semibold tracking-tight text-white">
            Packing checklist
          </h1>
        </div>

        {/* Progress */}
        <div className="card card-elevated animate-in" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: 600 }}>{packed} of {total} packed</span>
            <span style={{ fontWeight: 800, fontSize: "1.25rem", fontFamily: "var(--font-display)" }} className="gradient-text">{pct}%</span>
          </div>
          <div style={{ height: "10px", borderRadius: "5px", background: "var(--color-surface-alt)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: "5px", background: "linear-gradient(90deg, var(--color-primary), var(--color-coral))", width: `${pct}%`, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div className="animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>Items</h3>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> Add Item
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="card card-elevated" style={{ padding: "1rem", marginBottom: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
              <div>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Item</label>
                <input name="name" required className="input" placeholder="e.g. Passport" style={{ fontSize: "0.875rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8125rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>Category</label>
                <select name="category" className="input" style={{ fontSize: "0.875rem" }}>
                  {PACKING_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-sm btn-primary">Add</button>
            </div>
          </form>
        )}

        {grouped.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
            <ListChecks size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p>No items yet. Start packing!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {grouped.map((group) => (
              <div key={group.name}>
                <h4 style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                  {group.name} ({group.items.filter(i => i.isPacked).length}/{group.items.length})
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: "0.75rem 1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        opacity: item.isPacked ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", flex: 1 }}
                        onClick={() => handleToggle(item.id)}
                      >
                        <div
                          style={{
                            width: "22px", height: "22px", borderRadius: "6px",
                            border: item.isPacked ? "none" : "2px solid var(--color-border)",
                            background: item.isPacked ? "var(--color-primary)" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s ease", cursor: "pointer", flexShrink: 0,
                          }}
                        >
                          {item.isPacked && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <span style={{ textDecoration: item.isPacked ? "line-through" : "none", fontSize: "0.9375rem" }}>
                          {item.name}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", padding: 0 }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppChrome>
  );
}
