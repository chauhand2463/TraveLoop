"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppChrome from "@/components/AppChrome";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
    <AppChrome contentClassName="page-shell page-shell--form py-10 lg:py-14">
      <main>
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-editorial text-accent-cyan">New Trip</span>
            <div className="h-px flex-1 bg-white/10 max-w-[180px]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white font-display">
            Plan Your <span className="text-accent-lime">Adventure</span>
          </h1>
          <p className="text-muted mt-3 text-lg">
            Create a new multi-city itinerary with dates and details.
          </p>
        </motion.header>

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            {error}
          </div>
        )}

        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="glass-pro p-8 space-y-6"
        >
          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-medium text-muted">Trip Name</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                name="name" 
                required 
                className="input-pro pl-12" 
                placeholder="e.g., Europe Summer 2026" 
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block mb-2 text-sm font-medium text-muted">Description (optional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-muted" size={18} />
              <textarea
                name="description"
                className="input-pro pl-12 pt-4 min-h-[100px]"
                placeholder="Brief description of your trip..."
                style={{ resize: "none" }}
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-muted">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  name="startDate" 
                  type="date" 
                  required 
                  className="input-pro pl-12 [color-scheme:dark]" 
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-muted">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  name="endDate" 
                  type="date" 
                  required 
                  className="input-pro pl-12 [color-scheme:dark]" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-pro-primary w-full justify-center py-3.5"
            >
              <Sparkles size={18} />
              {loading ? "Creating..." : "Create Trip"}
              <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>
        </motion.form>
      </main>
    </AppChrome>
  );
}