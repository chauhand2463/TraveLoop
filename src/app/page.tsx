"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation, Globe, Zap, Shield, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import Navbar from "@/components/Navbar";

const fadeUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};
const fadeUpTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] };

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <main ref={containerRef} className="relative bg-surface overflow-hidden">
      <Navbar />
      
      {/* Cinematic Background Orchestration */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-primary/5 blur-[100px] will-change-transform" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-5%] right-[-2%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[80px] will-change-transform" 
        />
      </div>

      {/* Hero Section: Massive Typography */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 z-10">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="max-w-[1400px] w-full text-center space-y-12"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-pro border-white/5"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-white/60">System Online: v4.0.0</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[clamp(3rem,12vw,9rem)] leading-[0.85] font-black tracking-tighter uppercase italic"
            >
              Architect <br />
              <span className="gradient-text">Your Escape</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="max-w-2xl mx-auto text-xl text-text-muted font-medium tracking-tight"
            >
              The definitive protocol for high-fidelity travel orchestration. 
              Leave the logistics to the collective.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link href="/register" className="btn-pro-primary group">
              Initialize Registry
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="flex items-center gap-4 px-8 py-5 rounded-inner glass-pro border-white/10 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-surface transition-colors">
                <Play size={16} fill="currentColor" />
              </div>
              <span className="text-[0.7rem] font-black uppercase tracking-widest">Watch Protocol</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Marquee: Cinematic Brand Bar */}
      <section className="relative z-10 py-12 border-y border-white/5 bg-surface/50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 mb-8 flex justify-between items-center">
          <span className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-white/30">Verified Strategic Partners</span>
          <Link href="/cities" className="text-[0.6rem] font-black uppercase tracking-[0.4em] text-primary hover:text-white transition-colors">Explore Global Index</Link>
        </div>
        <div className="flex overflow-hidden gap-12 select-none">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex flex-none gap-24 items-center"
          >
            {["AETHER", "VORTEX", "LUMINA", "OBSIDIAN", "ZENITH", "STRATOS", "KINETIC", "ORACLE"].map((brand) => (
              <span key={brand} className="text-4xl font-black text-white/10 tracking-[0.3em] italic">{brand}</span>
            ))}
          </motion.div>
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex flex-none gap-24 items-center"
          >
            {["AETHER", "VORTEX", "LUMINA", "OBSIDIAN", "ZENITH", "STRATOS", "KINETIC", "ORACLE"].map((brand) => (
              <span key={brand} className="text-4xl font-black text-white/10 tracking-[0.3em] italic">{brand}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tactical Intelligence Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { icon: <Globe size={32} />, title: "Global Sync", desc: "Real-time trajectory alignment across 190+ jurisdictions." },
            { icon: <Zap size={32} />, title: "Instant Alpha", desc: "Proprietary intelligence protocols for immediate routing." },
            { icon: <Shield size={32} />, title: "Elite Security", desc: "Military-grade encryption for all itinerary data." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUpVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ ...fadeUpTransition, delay: 0.2 * i }}
              className="p-10 glass-pro group hover:border-primary/30 transition-colors"
            >
              <div className="text-primary mb-8 group-hover:scale-110 transition-transform origin-left">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA: Final Protocol */}
      <section className="relative z-10 py-48 px-6 text-center">
        <motion.div 
          variants={fadeUpVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={fadeUpTransition}
          className="max-w-4xl mx-auto space-y-12"
        >
          <h2 className="text-[clamp(2.5rem,8vw,6rem)] leading-none font-black tracking-tighter uppercase italic">
            Ready to <span className="text-primary">Deploy?</span>
          </h2>
          <p className="text-xl text-text-muted font-medium">
            Join the elite collective of global architects and master your itinerary.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/register" className="btn-pro-primary h-20 px-12 text-sm">
              Launch Application
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer Signature */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Navigation className="text-primary" fill="currentColor" size={24} />
            <span className="font-black uppercase tracking-widest text-sm">Traveloop collective</span>
          </div>
          <div className="flex gap-8 text-[0.6rem] font-black uppercase tracking-[0.3em] text-white/40">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Protocol</Link>
            <Link href="#" className="hover:text-primary transition-colors">System Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Access Logs</Link>
          </div>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-white/20">
            © 2026 ARCHITECTURAL INTELLIGENCE
          </p>
        </div>
      </footer>
    </main>
  );
}
