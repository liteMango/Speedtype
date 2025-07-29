import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                // document.getElementById('loggedUserFName').innerText=userData.firstName;
                // document.getElementById('loggedUserEmail').innerText=userData.email;

            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='Login/register.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })


 window.testWPMUpdate = async function(wpm) {
    const user = auth.currentUser;
    if (!user) {
        console.log("user not signed in");
        return
    }

  const userRef = doc(db, "users", user.uid);

  try{
    await updateDoc(userRef, { wpm });
    console.log("WPM successfully updated to:", wpm);
  } catch(err) {
    console.error("Error updating WPM:", err);
  }
};