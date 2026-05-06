import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortByKey =
  <T extends Record<string, string>>(key: keyof T) =>
  (a: { data: T }, b: { data: T }) =>
    a.data[key].toLowerCase().localeCompare(b.data[key].toLowerCase());
