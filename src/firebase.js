// Import Firebase SDK for Google Auth
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

export const firebaseConfig = {
  apiKey: "AIzaSyCp--eljk8cfqNbcZKM0D7Pc0Ndg3cQZ2g",
  authDomain: "new--clone-cdaa6.firebaseapp.com",
  projectId: "new--clone-cdaa6",
  databaseURL: "https://new--clone-cdaa6-default-rtdb.firebaseio.com/",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export auth and provider for Google authentication
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
