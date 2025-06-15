const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})


const client = new Appwrite.Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('684e081a001463b9b7c3') // Replace with your project ID

const account = new Appwrite.Account(client)
const databases = new Appwrite.Databases(client)

const signupForm = document.getElementById(
    "login" 
)


signupForm.addEventListener("submit", async (e) => {
  // preventing the default behaviour of refreshing the page when the form is submitted
  e.preventDefault();

  // Perform some form validations
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  console.log(email, name, password);

  // form validation logic
  if (!name || !email || !password) {
    Toastify({
      text: "Please Fill in all fields",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
    return;
  }
  if (password.length < 8) {
    Toastify({
      text: "Password must be at least 6 characters long",
      backgroundColor: "red",
      duration: 3000,
    }).showToast();
    return;
  }

  // Step 1 create a user
  const userResponse = await account.create(
    Appwrite.ID.unique(),
    email,
    password
  );
  console.log("User created sucessfully");

  // step 2 Log the user in to get an authenticated session
  await account.createEmailPasswordSession(email, password);

  // Step 3 update the user's name
  await account.updateName(name);
  console.log("Name updated succesfully");
  // Show a success message using toastify
  Toastify({
    text: "Account created successfully! Redirecting...",
    backgroundColor: "green",
    duration: 3000,
  }).showToast();
  // redirect the user to the login page
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});



// loginForm.addEventListener("submit", (event) => {
//   event.preventDefault();
//   //   Get the email and password
//   const email = document.getElementById("loginEmail").value;
//   const password = document.getElementById("loginPassword").value;

//   //creating a session by calling the appwrite create session for login
//   account
//     .createEmailPasswordSession(email, password)
//     .then((response) => {
//       console.log("user logged in successfully", response);
//       // show a toast message
//       Toastify({
//         text: "Login successful! Redirecting !!!",
//         backgroundColor: "green",
//         duration: 3000,
//       }).showToast();

//       // wait a little for the toast to show before redirecting
//       setTimeout(() => {
//         window.location.href = "index.html";
//       }, 3000);
//     })
//     .catch((err) => {
//       console.log("Error logging in", err);
//       Toastify({
//         text: "Error!" + err.message,
//         backgroundColor: "red",
//         duration: 3000,
//       }).showToast();
//     });
// });
