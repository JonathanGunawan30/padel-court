import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseValidDate(input: string | Date | number): Date | null {
  const d = input instanceof Date ? input : new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Format date as "DD MMM" (e.g., "19 Nov") */
export function formatDateShort(input: string | Date | number): string {
  const d = parseValidDate(input);
  if (!d) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** Format date as "DD MMM YYYY" (e.g., "19 Nov 2026") */
export function formatDate(input: string | Date | number): string {
  const d = parseValidDate(input);
  if (!d) return "-";
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** Format date as "DD MMM YYYY, HH:mm" */
export function formatDateTime(input: string | Date | number): string {
  const d = parseValidDate(input);
  if (!d) return "-";
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(d)}, ${hours}:${mins}`;
}

/** Format local date as "YYYY-MM-DD" */
export function formatISODate(input: Date = new Date()): string {
  const d = parseValidDate(input) || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getOrderStatusDisplay(status: string) {
  switch (status) {
    case "order-success":
      return { label: "Lunas", class: "bg-green-100 text-green-600" };
    case "pending":
      return { label: "Menunggu Pembayaran", class: "bg-amber-100 text-amber-600" };
    case "expired":
      return { label: "Kedaluwarsa", class: "bg-red-100 text-red-600" };
    default:
      return { label: status, class: "bg-gray-100 text-gray-600" };
  }
}
