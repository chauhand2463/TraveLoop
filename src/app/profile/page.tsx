"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import Breadcrumbs from "@/components/Breadcrumbs";
import { User, Mail, Globe, Save, Shield, Bell, Moon, Sun, Camera, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <AppChrome contentClassName="page-shell page-shell--narrow py-10 lg:py-14">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full border-2 border-accent-lime/20 animate-pulse" />
            <p className="text-sm text-muted">Loading...</p>
          </div>
        </div>
      </AppChrome>
    );
  }

  if (!session) {
    return (
      <AppChrome contentClassName="page-shell page-shell--narrow py-10 lg:py-14">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted mb-4">Please sign in to view your profile</p>
            <Link href="/login" className="btn-pro-primary">Sign In</Link>
          </div>
        </div>
      </AppChrome>
    );
  }

  const userName = session.user?.name ?? "";
  const userEmail = session.user?.email ?? "";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <AppChrome contentClassName="page-shell page-shell--narrow py-10 lg:py-14">
      <Breadcrumbs />
      
      <header className="mb-10 mt-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-editorial text-accent-cyan">Account</span>
          <div className="h-px flex-1 bg-white/10 max-w-[180px]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          Settings
        </h1>
        <p className="text-muted mt-2">Manage your account and preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3">
          <nav className="glass-pro rounded-2xl p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-accent-lime/10 text-accent-lime"
                      : "text-muted hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-accent-lime"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-9">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <section className="glass-pro rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Profile Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent-lime to-accent-cyan flex items-center justify-center text-3xl font-bold text-bg">
                      {userName.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-card border border-white/[0.1] hover:bg-white/[0.1] transition-colors">
                      <Camera size={14} className="text-muted" />
                    </button>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">Your Avatar</p>
                    <p className="text-sm text-muted">Click to upload a new photo</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input 
                          name="name" 
                          defaultValue={userName} 
                          className="input-pro pl-12" 
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input 
                          value={userEmail} 
                          disabled 
                          className="input-pro pl-12 opacity-60" 
                          readOnly 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted">Manage your account settings</p>
                    <button type="button" className="btn-pro-primary">
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </section>

              <section className="glass-pro rounded-2xl p-8 border-red-500/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-red-500/10">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">Danger Zone</h3>
                    <p className="text-muted text-sm mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <section className="glass-pro rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-accent-cyan/10">
                        <Globe size={20} className="text-accent-cyan" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Language</p>
                        <p className="text-sm text-muted">Select your preferred language</p>
                      </div>
                    </div>
                    <select className="input-pro w-40">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-accent-pink/10">
                        <Moon size={20} className="text-accent-pink" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Theme</p>
                        <p className="text-sm text-muted">Choose your appearance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <button className="p-2 rounded-lg bg-card text-muted hover:text-white">
                        <Moon size={16} />
                      </button>
                      <button className="p-2 rounded-lg text-accent-lime">
                        <Sun size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <section className="glass-pro rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Notification Settings</h3>
                
                <div className="space-y-6">
                  {[
                    { label: "Trip Updates", desc: "Get notified when trips are modified", enabled: true },
                    { label: "Budget Alerts", desc: "Receive alerts when spending approaches budget", enabled: true },
                    { label: "Packing Reminders", desc: "Reminders before your trip date", enabled: false },
                    { label: "Marketing Emails", desc: "News, features, and updates", enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/[0.06] last:border-0">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-muted">{item.desc}</p>
                      </div>
                      <button
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          item.enabled ? "bg-accent-lime" : "bg-white/[0.1]"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            item.enabled ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </div>
    </AppChrome>
  );
}