"use client";

import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
};

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/[0.06]",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded h-4",
        variant === "rectangular" && "rounded-xl",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-pro p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-pro p-8 space-y-6">
      <div className="flex justify-between">
        <Skeleton variant="text" className="w-32 h-6" />
        <Skeleton variant="circular" className="h-10 w-10" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-pro p-6 space-y-4">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="text" className="flex-1 h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-t border-white/[0.06]">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} variant="text" className="flex-1 h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-pro p-8 space-y-6">
      <div className="flex gap-8">
        <Skeleton variant="circular" className="h-24 w-24" />
        <div className="flex-1 space-y-4">
          <Skeleton variant="text" className="w-1/4 h-6" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-accent-lime/20" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-accent-lime border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}