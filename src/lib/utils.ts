import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Sqids from 'sqids'

const sqids = new Sqids()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSqid(): string {
  return sqids.encode([Date.now()])
}