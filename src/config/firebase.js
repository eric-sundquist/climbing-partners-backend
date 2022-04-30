import admin from 'firebase-admin'
import { readFile } from 'fs/promises'
const serviceAccount = JSON.parse(
  await readFile(
    new URL('./service-account-key.json', import.meta.url)
  )
)

export const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
