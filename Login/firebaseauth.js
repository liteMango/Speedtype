// Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
 import { getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
 

 
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

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }

 const signUp = document.getElementById('signUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('rName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Set displayName in Firebase Auth
      return updateProfile(user, { displayName: firstName }).then(() => {
        const userData = {
          email: email,
          displayName: firstName,
          wpm: 0
        };
        const docRef = doc(db, "users", user.uid);
        return setDoc(docRef, userData);
      });
    })
    .then(() => {
      localStorage.setItem('loggedInUserId', getAuth().currentUser.uid);
      localStorage.setItem("user", JSON.stringify(getAuth().currentUser));
      showMessage('Account Created Successfully', 'signUpMessage');
      window.location.href = '/Homepage.html';
    })

    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      } else if (errorCode === 'auth/invalid-email') {
        showMessage('Invalid email address.', 'signUpMessage');
      } else if (errorCode === 'auth/weak-password') {
        showMessage('Password should be at least 6 characters.', 'signUpMessage');
      } else {
        showMessage('Unable to create User: ' + error.message, 'signUpMessage');
      }
    });
});

//  const signUp=document.getElementById('signUp');
//  signUp.addEventListener('click', (event)=>{
//     event.preventDefault();
//     const email=document.getElementById('rEmail').value;
//     const password=document.getElementById('rPassword').value;
//     const firstName=document.getElementById('rName').value;
    
//     console.log("email", email);
//     console.log("password", password);
//     console.log("firstName", firstName);

//     const auth=getAuth();
//     const db=getFirestore();

//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential)=>{
//         const user=userCredential.user;
//         const userData={
//             email: email,
//             displayName: firstName,
//             password:password
//         };

//     console.log("userData", userData)
//         showMessage('Account Created Successfully', 'signUpMessage');
//         const docRef = doc(db, "users", user.uid);
//         setDoc(docRef,userData)
//         .then(()=>{
//             window.location.href='/index.html';
//         })
//         .catch((error)=>{
//             console.error("error writing document", error);

//         });
//     })
//     .catch((error)=>{
//         const errorCode=error.code;
//         if(errorCode=='auth/email-already-in-use'){
//             showMessage('Email Address Already Exists !!!', 'signUpMessage');
//         }
//         else{
//             showMessage('unable to create User', 'signUpMessage');
//         }
//     })
//  });

 const signIn=document.getElementById('signIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const name=document.getElementById('tName').value;
    const email=document.getElementById('tEmail').value;
    const password=document.getElementById('tPassword').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href='/Homepage.html';
        console.log("user", user);
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })


// signIn.addEventListener('click', async (event) => {
//   event.preventDefault();

//   const email = document.getElementById('tEmail').value;
//   const password = document.getElementById('tPassword').value;
//   const auth = getAuth();
//   const db = getFirestore();

//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // ✅ Retrieve user data from Firestore
//     const docRef = doc(db, "users", user.uid);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const userData = docSnap.data();
//       const firstName = userData.firstName;

//       // ✅ Store it or display it
//       localStorage.setItem('firstName', firstName);
//       console.log("First Name:", firstName);

//       showMessage('Login successful. Welcome ' + firstName + '!', 'signInMessage');
//       localStorage.setItem('loggedInUserId', user.uid);

//       // Redirect
//       window.location.href = '/test.html';
//     } else {
//       console.error("No user document found.");
//       showMessage('User data not found in Firestore.', 'signInMessage');
//     }

//   } catch (error) {
//     const errorCode = error.code;
//     if (errorCode === 'auth/invalid-credential') {
//       showMessage('Incorrect Email or Password', 'signInMessage');
//     } else {
//       showMessage('Account does not exist or another error occurred', 'signInMessage');
//     }
//   }
// });



  