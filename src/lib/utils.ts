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
  if (!file || !accessCode) {
    return 'public/'
  }
  
  // Create a unique filename to avoid conflicts
  const timestamp = new Date().getTime()
  // const fileExtension = file.name.split('.').pop()
  const sanitizedBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const uniqueFileName = `${timestamp}-${sanitizedBaseName}`
  
  return `public-${accessCode}/${uniqueFileName}`
}

// Utility function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Utility function to check if file type is supported
export const isSupportedFileType = (file: File): boolean => {
  const supportedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
  
  return supportedTypes.includes(file.type)
}

// Utility function to get file icon based on type
export const getFileTypeIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'txt':
      return '📄'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return '🖼️'
    default:
      return '📎'
  }
}