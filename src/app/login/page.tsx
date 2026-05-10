"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/actions/auth";
import { Mail, Lock, Eye, EyeOff, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import AuthLayout from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    
    if (result?.success) {
      router.push("/dashboard");
      router.refresh();
    } else if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <div className="glass-pro p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-[0.3]" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 no-underline">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-lime to-accent-cyan flex items-center justify-center">
                  <Navigation size={24} className="text-bg" fill="currentColor" />
                </div>
                <span className="text-2xl font-bold text-white font-display">Traveloop</span>
              </Link>
              <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
              <p className="text-muted">Sign in to continue to your dashboard</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-pro pl-12"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    className="input-pro pl-12 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white cursor-pointer bg-transparent border-none"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-pro-primary w-full justify-center py-3"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent-cyan hover:text-white font-medium no-underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}