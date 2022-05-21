import admin from 'firebase-admin'

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64'))

export const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
