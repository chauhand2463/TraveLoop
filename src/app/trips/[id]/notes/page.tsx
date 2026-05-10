"use client";

import { useState, useEffect } from "react";
import AppChrome from "@/components/AppChrome";
import Link from "next/link";
import { addNote, deleteNote } from "@/actions/trips";
import { ArrowLeft, StickyNote, Plus, Trash2 } from "lucide-react";

interface Note { id: string; content: string; createdAt: string; }

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const [tripId, setTripId] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [tripName, setTripName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setTripId(p.id));
  }, [params]);

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    fetch(`/api/trips/${tripId}/notes`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes);
        setTripName(data.name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tripId]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await addNote(tripId, formData);
    setShowForm(false);
    const res = await fetch(`/api/trips/${tripId}/notes`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    const res = await fetch(`/api/trips/${tripId}/notes`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes);
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

  return (
    <AppChrome contentClassName="page-shell page-shell--narrow py-10 lg:py-12">
      <main className="">
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-muted hover:text-accent-cyan transition-colors mb-10 no-underline">
          <ArrowLeft size={16} strokeWidth={1.75} /> Trip overview
        </Link>

        <div className="animate-in flex flex-wrap justify-between items-start gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-[2.85rem] font-semibold tracking-tight text-white">
              Briefing notes
            </h1>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} /> New Note
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="card card-elevated animate-in" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
            <textarea name="content" required className="input" rows={4} placeholder="Write your note here..." style={{ resize: "vertical", marginBottom: "0.75rem" }} />
            <button type="submit" className="btn btn-sm btn-primary">Save Note</button>
          </form>
        )}

        {notes.length === 0 ? (
          <div className="card animate-in" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
            <StickyNote size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
            <p>No notes yet. Jot down important details!</p>
          </div>
        ) : (
          <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {notes.map((note) => (
              <div key={note.id} className="card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ flex: 1, lineHeight: 1.7, fontSize: "0.9375rem", whiteSpace: "pre-wrap" }}>{note.content}</p>
                  <button onClick={() => handleDelete(note.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-danger)", padding: "0.25rem", marginLeft: "0.75rem", flexShrink: 0 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppChrome>
  );
}
