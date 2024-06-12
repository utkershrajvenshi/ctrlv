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
export const TEXT_CONTENT_POSTGRES = 'text_content'
export const CLIP_TITLE_POSTGRES = 'title'
export const CLIP_CREATED_AT_POSTGRES = 'created_at'
export const ATTACHMENTS_POSTGRES = 'attachments'

export enum QUERY_KEYS {
  FETCH_EXISTING = 'fetchExistingBoards',
  FETCH_CLIP = 'fetchClip',
  CREATE_CLIP = 'createClip',
  UPDATE_CLIP = 'updateClip',
  DELETE_CLIP = 'deleteClip',
  CREATE_BOARD = 'createBoard',
  UPDATE_BOARD = 'updateBoard',
  DELETE_BOARD = 'deleteBoard',
}