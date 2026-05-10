import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { updateProfile } from "@/actions/auth";
import { User, Mail, Globe, Save } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const tripCount = await prisma.trip.count({ where: { userId: user.id } });

  async function handleUpdate(formData: FormData) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) return;
    await updateProfile(s.user.id, formData);
    redirect("/profile");
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div className="animate-in" style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>
            My <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Manage your account settings and preferences.
          </p>
        </div>

        {/* User Info Card */}
        <div className="card card-elevated animate-in" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "64px", height: "64px", borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-coral))",
                color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-display)",
              }}
            >
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{user.name}</h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem" }}>{user.email}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <span className="badge badge-primary">{tripCount} Trips</span>
                <span className="badge badge-accent">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form action={handleUpdate} className="card animate-in" style={{ padding: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-display)", marginBottom: "1.25rem" }}>
            Edit Profile
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}>
                <User size={14} /> Full Name
              </label>
              <input name="name" defaultValue={user.name || ""} className="input" />
            </div>
            <div>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}>
                <Mail size={14} /> Email
              </label>
              <input value={user.email} disabled className="input" style={{ opacity: 0.6 }} />
            </div>
            <div>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.375rem" }}>
                <Globe size={14} /> Language Preference
              </label>
              <select name="language" defaultValue={user.language} className="input">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              <Save size={14} /> Save Changes
            </button>
          </div>
        </form>

        <div style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
          Member since {user.createdAt.toLocaleDateString()}
        </div>
      </main>
    </>
  );
}
