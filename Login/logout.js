import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

const loginSection = document.getElementById('loginSection');
const userSection = document.getElementById('userSection');
const welcomeMsg = document.getElementById('welcomeMsg');
const logoutBtn = document.getElementById('logout');

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is logged in, fetch their name
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.exists() ? docSnap.data() : {};

    const firstName = userData.firstName || "User";
    console.log("userData", userData);

    // Show welcome message
    welcomeMsg.textContent = `Welcome, ${firstName}`;
    loginSection.style.display = "none";
    userSection.style.display = "block";
  } else {
    // No user is signed in
    loginSection.style.display = "block";
    userSection.style.display = "none";
  }
});

// Logout button handler
logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log("User signed out");
  });
});



document.getElementById('signIn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('tEmail').value;
  const password = document.getElementById('tPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("Login failed:", err.message);
    alert("Login failed");
  }
});
