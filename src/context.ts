import { createContext } from 'react'
import { AppwriteInit } from './utils/appwrite'

const initialAppwriteContext = {
  appwriteInstance: new AppwriteInit()
}


export const AppwriteContext = createContext({ ...initialAppwriteContext })