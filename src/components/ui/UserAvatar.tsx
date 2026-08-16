import React from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  showOnlineStatus?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function UserAvatar({
  name,
  src,
  size = 'md',
  showOnlineStatus = false,
  isOnline = true,
  className,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const statusDotSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };

  return (
    <div className="relative inline-flex shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-xs select-none',
            sizeClasses[size],
            className
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border border-teal-500/20 select-none shadow-xs',
            sizeClasses[size],
            className
          )}
        >
          {initials}
        </div>
      )}

      {showOnlineStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900',
            isOnline ? 'bg-emerald-500' : 'bg-slate-400',
            statusDotSizes[size]
          )}
        />
      )}
    </div>
  );
}
