import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Skeleton className="w-24 h-8" />
      <Skeleton className="w-32 h-4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 gap-4"
        >
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-36 h-4" />
          <Skeleton className="w-28 h-4" />
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-16 h-4" />
        </div>
      ))}
    </div>
  );
}
