// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0RUDrq5FOUA6vjB-h2uCqZ00zhbH4xCE",
  authDomain: "order-demo-d73c2.firebaseapp.com",
  projectId: "order-demo-d73c2",
  storageBucket: "order-demo-d73c2.appspot.com",
  messagingSenderId: "891267425909",
  appId: "1:891267425909:web:2898c05fc19004ec163a3c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('fire app init')
export default { fireapp: app };