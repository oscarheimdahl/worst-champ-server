import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTextBetween(str: string, start: string, end: string) {
  const startIndex = str.indexOf(start);
  const endIndex = str.indexOf(end, startIndex + start.length);

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  return str.slice(startIndex + start.length, endIndex);
}
