import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function percentage(completed: number, target: number) {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.round((completed / target) * 100));
}

export function levelFromXp(totalXp: number) {
  return Math.floor(totalXp / 100);
}

export function xpIntoLevel(totalXp: number) {
  return totalXp % 100;
}
