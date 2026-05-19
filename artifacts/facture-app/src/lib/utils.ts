import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' F'
}

export function generateInvoiceNumber(): string {
  return 'FAC-' + Math.floor(100000 + Math.random() * 900000)
}
