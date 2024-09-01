import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBI1AZkMDXp8JtMB6-Nt0y5r8dswaPSh_Y",
  authDomain: "mynewapp-8ae86.firebaseapp.com",  // You might need to add this manually
  projectId: "mynewapp-8ae86",
  storageBucket: "mynewapp-8ae86.appspot.com",
  messagingSenderId: "157394274976",
  appId: "1:157394274976:android:abd0eace40e1eac5acd7c5",
  measurementId: "G-XXXXXXXXXX" // Optional, for analytics
};


const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
