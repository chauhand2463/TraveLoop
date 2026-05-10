"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
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
      <>
        <Navbar />
        <main style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
          <div className="skeleton" style={{ width: "200px", height: "28px", margin: "0 auto" }} />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <Link href={`/trips/${tripId}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          <ArrowLeft size={14} /> Back to Trip
        </Link>

        <div className="animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>
              Trip <span className="gradient-text">Notes</span>
            </h1>
            <p style={{ color: "var(--color-text-secondary)" }}>{tripName}</p>
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
    </>
  );
}
