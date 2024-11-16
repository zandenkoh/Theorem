const firebaseConfig = {
  apiKey: "AIzaSyBpwEe0JzFbZDaewHMPNaJmZax34IpZHz0",
  authDomain: "learn-theorem.firebaseapp.com",
  projectId: "learn-theorem",
  storageBucket: "learn-theorem.firebasestorage.app",
  messagingSenderId: "143829885312",
  appId: "1:143829885312:web:416c03d73bd290fc54a165"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
//const headerUserImage = document.querySelector('.header-user-image');
const profileContainerName = document.getElementById('profile-container-name');
const profileContainerUsername = document.getElementById('profile-container-username');

// Function to display user's initials
function displayUserInitial(userId) {
  // Reference the user’s document using their userId as the subcollection name
  db.collection("users").doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const userName = userData.name || '';
        const userColor = userData.color || ''; // Default color if none is specified
        const userContainerName = userData.name || '';
        const userContainerUsername = userData.username || '';

        // Get the first letter of the user's name
        //const initial = userName.charAt(0);

        // Set the background color and initial
        //headerUserImage.style.backgroundColor = userColor;
        //headerUserImage.textContent = initial;
        profileContainerName.textContent = userContainerName;
        profileContainerUsername.textContent = '@' + userContainerUsername;
      } else {
        console.log("No user document found!");
      }
    })
    .catch((error) => {
      console.error("Error retrieving user document:", error);
    });
}

// Call displayUserInitial when the user is authenticated
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(`User is logged in as ${user.email}`);
    displayUserInitial(user.uid); // Pass the user's ID to retrieve their document
  } else {
    window.location.href = "/Join/index.html";
  }
});


/*// Handle showing sign-up form
const showActionContainerButton = document.getElementById('header-ask-button');
const chooseActionPopup = document.getElementById('choose-action-popup');
const insideActionPopup = document.getElementById('choose-action-popup');

showActionContainerButton.addEventListener('click', () => {
  chooseActionPopup.classList.add('active');
});

chooseActionPopup.addEventListener('click', (event) => {
  if (event.target === chooseActionPopup) {
    chooseActionPopup.classList.remove('active');
  }
});*/

const createPostButton = document.querySelector('.create-post-button');
const createPostBottom = document.querySelector('.create-post-bottom');
const createPostTop = document.querySelector('.create-post-top');

createPostButton.addEventListener('click', () => {
  createPostButton.classList.toggle('expanded'); // Toggle expansion
});
