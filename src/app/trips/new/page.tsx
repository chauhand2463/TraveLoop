"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createTrip } from "@/actions/trips";
import { MapPin, Calendar, FileText, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
};

export default function NewTripPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createTrip(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="max-w-[800px] mx-auto px-6 py-20 lg:py-32">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
             <span className="text-editorial">New Protocol Initialization</span>
             <div className="h-[1px] flex-1 bg-white/10" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white font-display uppercase leading-none">
            Plan <span className="text-primary">Sequence</span>
          </h1>
          <p className="text-xl text-text-muted mt-4">
            Define the parameters for your next global trajectory.
          </p>
        </motion.header>

        {error && (
          <div className="p-4 mb-8 text-sm font-medium border bg-red-500/10 border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="glass-pro p-10 space-y-8"
        >
          <motion.div variants={itemVariants}>
            <label className="block mb-3 text-xs font-black tracking-[0.2em] uppercase text-text-muted">Sequence Identifier</label>
            <div className="relative group">
               <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
               <input 
                 name="name" 
                 required 
                 className="input-pro pl-14 text-xl" 
                 placeholder="e.g. TOKYO NEON SHIFT 2026" 
               />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-3 text-xs font-black tracking-[0.2em] uppercase text-text-muted">Brief Description</label>
            <div className="relative group">
               <FileText className="absolute left-5 top-6 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
               <textarea
                 name="description"
                 className="input-pro pl-14 pt-5 min-h-[120px]"
                 placeholder="Define the scope and objectives of this journey..."
                 style={{ resize: "none" }}
               />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-3 text-xs font-black tracking-[0.2em] uppercase text-text-muted">Launch Date</label>
              <div className="relative group">
                 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                 <input 
                   name="startDate" 
                   type="date" 
                   required 
                   className="input-pro pl-14 [color-scheme:dark]" 
                 />
              </div>
            </div>
            <div>
              <label className="block mb-3 text-xs font-black tracking-[0.2em] uppercase text-text-muted">Return Date</label>
              <div className="relative group">
                 <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                 <input 
                   name="endDate" 
                   type="date" 
                   required 
                   className="input-pro pl-14 [color-scheme:dark]" 
                 />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-pro-primary w-full py-6 text-xl"
            >
              <Sparkles size={24} />
              {loading ? "INITIALIZING SEQUENCE..." : "INITIALIZE & MAP NODES"}
              <ArrowRight size={24} className="ml-2" />
            </button>
          </motion.div>
        </motion.form>
      </main>
    </div>
  );
}
