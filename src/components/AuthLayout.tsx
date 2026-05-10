"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="mesh-gradient absolute inset-0 opacity-[0.5]" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-accent-lime/[0.08] blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[5%] h-[350px] w-[350px] rounded-full bg-accent-pink/[0.06] blur-[90px]"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("flex-1 flex flex-col items-center justify-center py-10 px-4", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}