"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);
    
    if (result?.success) {
      router.push("/dashboard");
      router.refresh();
    } else if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-surface">
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="w-full max-w-md p-12 glass-pro relative z-10 space-y-10"
      >
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 group no-underline">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-surface group-hover:rotate-12 transition-transform duration-500">
              <Navigation size={20} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white font-display uppercase">Traveloop</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-white font-display uppercase">Join Collective</h1>
            <p className="text-text-muted text-sm font-medium tracking-wide">Initialize your architectural identity.</p>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 text-xs font-black uppercase tracking-widest text-center border bg-red-500/10 border-red-500/20 text-red-400 rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Designation (Name)</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input
                name="name"
                type="text"
                required
                className="input-pro pl-14 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                placeholder="Architect Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Identity (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input
                name="email"
                type="email"
                required
                className="input-pro pl-14 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                placeholder="architect@trajectory.sys"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
              <input
                name="password"
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                className="input-pro pl-14 pr-14 h-14 bg-white/[0.03] border-white/5 focus:bg-white/[0.08]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pro-primary w-full h-16 text-[0.7rem] uppercase tracking-[0.3em] font-black mt-4"
          >
            {loading ? "Registering..." : "Initialize Profile"}
            {!loading && <UserPlus size={18} />}
          </button>
        </form>

        <p className="text-center text-[0.65rem] font-black uppercase tracking-widest text-text-muted">
          Already a member?{" "}
          <Link href="/login" className="text-primary hover:text-white transition-colors">
            Authorized Entry
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
