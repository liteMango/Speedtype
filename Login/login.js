const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})


// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
  import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAFtTW8f-AW1a8cT03naEBfZ6tBVyYSibM",
    authDomain: "sign-2926b.firebaseapp.com",
    databaseURL: "https://sign-2926b-default-rtdb.firebaseio.com",
    projectId: "sign-2926b",
    storageBucket: "sign-2926b.firebasestorage.app",
    messagingSenderId: "619679599192",
    appId: "1:619679599192:web:80d3021115a2f33662982d",
    measurementId: "G-JHZX1NMTNG"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const signup = document.getElementById('submitSignUp');
  signUp.addEventListener('click', (event)=>{
    event.preventDefault
  })