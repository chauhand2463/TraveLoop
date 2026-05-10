"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumbs({ items }: { items?: BreadcrumbItem[] }) {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/" }
    ];

    if (pathname.startsWith("/dashboard")) {
      breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });
    } else if (pathname.startsWith("/trips")) {
      breadcrumbs.push({ label: "Trips", href: "/trips" });
      if (pathname.includes("/new")) {
        breadcrumbs.push({ label: "New Trip" });
      } else if (pathname.match(/\/trips\/[^\/]+$/)) {
        breadcrumbs.push({ label: "Trip Details" });
      } else if (pathname.includes("/builder")) {
        breadcrumbs.push({ label: "Builder" });
      } else if (pathname.includes("/budget")) {
        breadcrumbs.push({ label: "Budget" });
      } else if (pathname.includes("/packing")) {
        breadcrumbs.push({ label: "Packing" });
      } else if (pathname.includes("/notes")) {
        breadcrumbs.push({ label: "Notes" });
      }
    } else if (pathname.startsWith("/cities")) {
      breadcrumbs.push({ label: "Cities", href: "/cities" });
    } else if (pathname.startsWith("/profile")) {
      breadcrumbs.push({ label: "Profile" });
    } else if (pathname.startsWith("/admin")) {
      breadcrumbs.push({ label: "Admin" });
    }

    return items || breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={14} className="text-white/30 mx-1" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "font-medium",
                  isLast ? "text-white" : "text-muted"
                )}
              >
                {item.label}
              </motion.span>
            )}
          </div>
        );
      })}
    </nav>
  );
}