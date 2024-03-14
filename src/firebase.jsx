// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app'
// import {getAnalytics} from 'firebase/analytics'
import {getAuth, setPersistence, browserLocalPersistence} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'


// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth()
setPersistence(auth, browserLocalPersistence)
const db = getFirestore()

export {auth, app, db}
