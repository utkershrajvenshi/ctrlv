import { Client, Databases } from 'appwrite'
import { createContext } from 'react'

const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('6624061d15b9c848f5e1')

const databases = new Databases(client)

export const AppwriteContext = createContext({
  client,
  databases
})