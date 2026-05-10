"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Navigation, Globe, Zap, Shield, ArrowRight, Play, MapPin, Calendar, Users, Star } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const fadeUpVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};
const fadeUpTransition: { duration: number; ease: [number, number, number, number] } = {
  duration: 0.75,
  ease: [0.16, 1, 0.3, 1],
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const floatInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="relative min-h-screen bg-bg text-[#fafafa] font-sans">
      {/* Floating Navigation Bar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-bg/80 backdrop-blur-2xl"
      >
        <div className="page-shell flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-lime to-accent-cyan">
              <Navigation className="text-bg" size={20} strokeWidth={2} />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">Traveloop</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted hover:text-white transition-colors no-underline">Features</Link>
            <Link href="/cities" className="text-sm font-medium text-muted hover:text-white transition-colors no-underline">Destinations</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted hover:text-white transition-colors no-underline">Testimonials</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-muted hover:text-white transition-colors no-underline">Sign in</Link>
            <Link href="/register" className="btn-pro-primary text-sm py-2.5 px-5">Get Started</Link>
          </div>
        </div>
      </motion.nav>

      <main
        ref={containerRef}
        className="relative isolate min-w-0 overflow-x-hidden font-sans"
      >
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="mesh-gradient absolute inset-0 opacity-[0.6]" />
          
          {/* Floating Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 60, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[5%] left-[5%] h-[500px] w-[500px] rounded-full bg-accent-lime/[0.08] blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              x: [0, -50, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="absolute top-[30%] right-[5%] h-[400px] w-[400px] rounded-full bg-accent-cyan/[0.07] blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] left-[30%] h-[350px] w-[350px] rounded-full bg-accent-pink/[0.06] blur-[90px]"
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 flex min-h-screen flex-col justify-center py-32">
          <motion.div
            style={{ scale: heroScale, opacity: heroOpacity }}
            className="page-shell mx-auto w-full max-w-5xl"
          >
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center"
            >
              {/* Badge */}
              <motion.div
                variants={floatInUp}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-white/[0.05] px-6 py-3 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-lime opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-lime"></span>
                </span>
                <span className="text-sm font-medium text-white/80">Now with AI-powered itineraries</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={floatInUp}
                className="font-display text-[clamp(3rem,8vw,6rem)] font-semibold tracking-[-0.04em] text-white leading-[1.05]"
              >
                Plan trips that
                <br />
                <span className="bg-gradient-to-r from-accent-lime via-accent-cyan to-accent-pink bg-clip-text text-transparent">
                  tell a story
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={floatInUp}
                className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-muted leading-relaxed"
              >
                Build multi-city itineraries with budgets, packing lists, and activities — all in one beautiful dashboard. Share with friends or keep private.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={floatInUp}
                className="mt-12 flex flex-col items-center justify-center gap-5"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link href="/register" className="group btn-pro-primary text-base px-10 py-4.5">
                    Start Planning Free
                    <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1.5" strokeWidth={2} />
                  </Link>
                  <Link href="/cities" className="btn-pro-outline text-base px-10 py-4.5">
                    Explore Destinations
                  </Link>
                </div>
                
                {/* Trust Indicators */}
                <motion.div 
                  variants={floatInUp}
                  className="mt-10 flex items-center gap-8 text-sm text-muted"
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-accent-cyan" />
                    <span>12,000+ travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-accent-yellow" />
                    <span>4.9/5 rating</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <MapPin size={16} className="text-accent-lime" />
                    <span>190+ cities</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mt-20 page-shell"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent-lime/20 via-accent-cyan/20 to-accent-pink/20 blur-3xl" />
              <div className="glass-pro relative overflow-hidden rounded-2xl border border-white/[0.1] p-2">
                <div className="aspect-[16/9] rounded-xl bg-card overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        {[
                          { label: "Trips", value: "24", color: "text-accent-lime" },
                          { label: "Cities", value: "48", color: "text-accent-cyan" },
                          { label: "Budget", value: "$12.4k", color: "text-accent-pink" },
                        ].map((stat, i) => (
                          <div key={i} className="glass-pro p-4 rounded-xl">
                            <div className={`text-2xl font-bold ${stat.color} font-display`}>{stat.value}</div>
                            <div className="text-xs text-muted mt-1">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-muted text-sm">Your travel dashboard at a glance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-32 lg:py-44">
          <div className="page-shell">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20 text-center"
            >
              <span className="text-editorial text-accent-cyan">Powerful Features</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                Everything you need to travel smarter
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Globe size={32} strokeWidth={1.5} className="text-accent-cyan" />,
                  title: "190+ Destinations",
                  desc: "Explore cities worldwide with cost indices, weather patterns, and curated activities for every budget.",
                  gradient: "from-accent-cyan/20 to-transparent",
                },
                {
                  icon: <Zap size={32} strokeWidth={1.5} className="text-accent-yellow" />,
                  title: "Smart Trip Builder",
                  desc: "Drag and drop activities, reorder stops, and visualize your entire itinerary on a timeline.",
                  gradient: "from-accent-yellow/20 to-transparent",
                },
                {
                  icon: <Shield size={32} strokeWidth={1.5} className="text-accent-lime" />,
                  title: "Budget Tracking",
                  desc: "Set budgets per category, track expenses in real-time, and get alerts when you're overspending.",
                  gradient: "from-accent-lime/20 to-transparent",
                },
                {
                  icon: <Calendar size={32} strokeWidth={1.5} className="text-accent-pink" />,
                  title: "Packing Lists",
                  desc: "Smart packing lists that adapt to your destination, weather, and trip duration.",
                  gradient: "from-accent-pink/20 to-transparent",
                },
                {
                  icon: <MapPin size={32} strokeWidth={1.5} className="text-accent-teal" />,
                  title: "Share & Collaborate",
                  desc: "Share read-only links with friends and family. They can view but not edit your plans.",
                  gradient: "from-accent-teal/20 to-transparent",
                },
                {
                  icon: <Star size={32} strokeWidth={1.5} className="text-accent-cyan" />,
                  title: "Notes & Docs",
                  desc: "Keep all your travel docs, confirmation numbers, and notes organized in one place.",
                  gradient: "from-accent-cyan/20 to-transparent",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative glass-pro rounded-2xl p-8 transition-all duration-500 hover:border-white/[0.15]"
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-4 text-muted leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="relative z-10 py-32 bg-card/50">
          <div className="page-shell">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="text-editorial text-accent-pink">Testimonials</span>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-white">
                Loved by travelers worldwide
              </h2>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Sarah Chen",
                  role: "Digital Nomad",
                  quote: "Traveloop changed how I plan trips. The budget tracking alone saved me hundreds on my last Europe trip.",
                  avatar: "SC",
                  color: "from-accent-lime to-accent-cyan",
                },
                {
                  name: "Marcus Johnson",
                  role: "Travel Blogger",
                  quote: "Finally a tool that handles multi-city itineraries properly. The sharing feature is perfect for collabs.",
                  avatar: "MJ",
                  color: "from-accent-cyan to-accent-pink",
                },
                {
                  name: "Emma Williams",
                  role: "Solo Traveler",
                  quote: "The packing lists are genius. It reminds me of things I'd never remember. Best travel app I've used.",
                  avatar: "EW",
                  color: "from-accent-pink to-accent-yellow",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="glass-pro rounded-2xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-bg font-bold`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-muted">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted leading-relaxed">"{testimonial.quote}"</p>
                  <div className="mt-4 flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} className="text-accent-yellow fill-accent-yellow" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Cities Strip */}
        <section className="relative z-10 border-y border-white/[0.06] bg-card-muted/30 py-12 overflow-hidden">
          <div className="page-shell mb-8 flex items-center justify-between">
            <span className="text-editorial">Popular Destinations</span>
            <Link href="/cities" className="text-sm font-medium text-accent-cyan hover:text-white transition-colors no-underline">
              View all →
            </Link>
          </div>
          <div className="flex overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 whitespace-nowrap ps-8"
            >
              {[
                { name: "Tokyo", country: "Japan" },
                { name: "Paris", country: "France" },
                { name: "New York", country: "USA" },
                { name: "London", country: "UK" },
                { name: "Barcelona", country: "Spain" },
                { name: "Rome", country: "Italy" },
                { name: "Sydney", country: "Australia" },
                { name: "Dubai", country: "UAE" },
                { name: "Singapore", country: "Singapore" },
                { name: "Tokyo", country: "Japan" },
                { name: "Paris", country: "France" },
                { name: "New York", country: "USA" },
                { name: "London", country: "UK" },
                { name: "Barcelona", country: "Spain" },
                { name: "Rome", country: "Italy" },
              ].map((city, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl glass-pro flex items-center justify-center">
                    <MapPin size={24} className="text-accent-cyan" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-semibold text-white">{city.name}</div>
                    <div className="text-xs text-muted">{city.country}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-32 lg:py-44">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="page-shell text-center"
          >
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-accent-lime/10 via-accent-cyan/10 to-accent-pink/10 blur-3xl" />
              <div className="relative z-10">
                <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
                  Ready to plan your next adventure?
                </h2>
                <p className="mt-6 text-lg text-muted">
                  Join thousands of travelers who plan smarter with Traveloop.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
                  <Link href="/register" className="btn-pro-primary text-base px-12 py-5">
                    Create Free Account
                  </Link>
                  <Link href="/login" className="btn-pro-outline text-base px-12 py-5">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.06] py-16">
          <div className="page-shell flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-lime to-accent-cyan">
                <Navigation className="text-bg" size={20} strokeWidth={2} />
              </div>
              <span className="font-display text-lg font-bold tracking-wide text-white">Traveloop</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted">
              <Link href="/cities" className="hover:text-white transition-colors no-underline">Cities</Link>
              <Link href="#" className="hover:text-white transition-colors no-underline">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors no-underline">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors no-underline">Contact</Link>
            </div>
            
            <p className="text-sm text-muted">© 2026 Traveloop. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}