// Initialize Firebase
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
const firestore = firebase.firestore();

// Sign in logic
const nextButton = document.getElementById('next-button');
const emailInput = document.getElementById('email');
const signInLabel = document.getElementById('sign-in-label');

nextButton.addEventListener('click', () => {
  const email = emailInput.value;
  if (email) {
    // Hide email input and show password input in the same position
    emailInput.style.display = 'none';
    nextButton.style.display = 'none'; // Hide next button

    signInLabel.textContent = 'Password'
    // Create the password input element
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter password';
    passwordInput.id = 'password-input';
    passwordInput.style.marginTop = '10px'; // Ensure it's in the same spot as the email input

    // Insert the password input element right where the next button was
    nextButton.parentNode.insertBefore(passwordInput, nextButton);

    // Create and display the "Sign In" button, insert it in the same place as the Next button
    const signInButton = document.createElement('button');
    signInButton.id = 'sign-in-button';
    signInButton.textContent = 'Sign In';

    // Insert the sign-in button before the next button (where the next button was)
    nextButton.parentNode.insertBefore(signInButton, nextButton);

    // Sign in logic when the user clicks Sign In
    signInButton.addEventListener('click', () => {
      const password = passwordInput.value;
      if (password) {
        auth.signInWithEmailAndPassword(email, password)
          .then(userCredential => {
            console.log('Signed in as:', userCredential.user.email);
            window.location.reload(); // Reload the page after successful sign-in
          })
          .catch(error => {
            alert(error.message); // Show error if sign-in fails
          });
      }
    });
  }
});


// Handle showing sign-up form
const showSignUpButton = document.getElementById('show-signup');
const signUpForm = document.getElementById('sign-up-form');

showSignUpButton.addEventListener('click', () => {
  signUpForm.classList.add('active'); // Show sign-up form as a popup
});

// Close the sign-up form if clicked outside
signUpForm.addEventListener('click', (event) => {
  if (event.target === signUpForm) {
    signUpForm.classList.remove('active'); // Close the sign-up popup
  }
});

// Step 1 (Email & Password) of sign-up
const nextStep1Button = document.getElementById('next-step-1');
nextStep1Button.addEventListener('click', () => {
  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('password').value;
  
  if (email && password) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        document.getElementById('step-1').classList.remove('active');
        document.getElementById('step-2').classList.add('active');
      })
      .catch(error => {
        alert(error.message);
      });
  }
});

// Step 2 (Name & Date of Birth)
const nextStep2Button = document.getElementById('next-step-2');
nextStep2Button.addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  
  if (name && dob) {
    document.getElementById('step-2').classList.remove('active');
    document.getElementById('step-3').classList.add('active');
  }
});

// Step 3 (Agree to Terms & Conditions)
const agreeTermsCheckbox = document.getElementById('agree-terms');
const signUpButton = document.getElementById('sign-up-button');

agreeTermsCheckbox.addEventListener('change', () => {
  signUpButton.disabled = !agreeTermsCheckbox.checked; // Enable/disable sign-up button
});

signUpButton.addEventListener('click', () => {
  const user = auth.currentUser;
  const userId = user.uid;
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;

  firestore.collection('users').doc(userId).set({
    name: name,
    dob: dob,
    email: user.email,
    dateCreated: new Date(),
    followers: 0,
    creds: 0
  })
  .then(() => {
    signUpButton.disabled = true; // Disable sign-up button
    alert('Account created successfully!');
    signUpForm.classList.remove('active'); // Close the sign-up form
  })
  .catch(error => {
    alert('Error creating account: ' + error.message);
  });
});
