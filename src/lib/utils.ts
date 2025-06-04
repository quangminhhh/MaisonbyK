import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function formatDate(date: Date | string, locale = 'vi-VN') {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale)
}
