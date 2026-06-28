import admin from "firebase-admin"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const serviceAccount = JSON.parse(readFileSync(resolve("./src/config/social-media-app-79e10-firebase-adminsdk-fbsvc-be0da0fa84.json"),"utf-8"))


const firebaseApp = admin.apps.length > 0 ? admin.app() : admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default firebaseApp;