"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const key = useMemo(() => pathname, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94],
          }
        }}
        exit={{ 
          opacity: 0,
          y: -4,
          transition: {
            duration: 0.15,
            ease: "easeOut",
          }
        }}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}