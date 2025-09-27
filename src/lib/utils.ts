import { PostgrestError } from "@supabase/supabase-js"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createShareableLink(accessCode: string) {
  const baseUrl = new URL(window.location.origin)
  baseUrl.searchParams.append('code', accessCode)

  return baseUrl.href
}

export function generateAccessCode(length: number = 7) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export const accessCodeValidationRegex = /^[a-zA-Z0-9]{7}$/g

export type QueryType<T> = {
  count: number | null
  data: T
  error: Error | PostgrestError | null
  status: number
  statusText: string
}

export const getFileUploadPathName = (file?: File, accessCode?: string) => {
  const basePath = 'public'
  if (file && accessCode) {
    return `${basePath}-${accessCode}/${file.name}`
  }
  return basePath + '/'
}