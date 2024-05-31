import { createClient } from '@supabase/supabase-js'
import { createContext } from 'react'

export const supabase = createClient(process.env.PROJECT_URL ?? '', process.env.PROJECT_API_KEY ?? '')
export const SupabaseContext = createContext({ supabase })

export const CLIPS_RELATION = 'ctrlv-clips'
export const BOARDS_RELATION = 'ctrlv-main'
export const ACCESS_CODE_POSTGRES = 'access_code'
export const CLIPBOARD_NAME_POSTGRES = 'clipboard_name'
export const EXPIRY_DATE_POSTGRES = 'expiry_date'
export const CLIPS_POSTGRES = 'clips'

export enum QUERY_KEYS {
  FETCH_EXISTING = 'fetchExistingBoards',
}