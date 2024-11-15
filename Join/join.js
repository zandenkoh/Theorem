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

// Sign-in logic with error handling
const nextButton = document.getElementById('next-button');
const emailInput = document.getElementById('email');
const emailErrorMessage = document.getElementById('email-error-message');

nextButton.addEventListener('click', () => {
  const email = emailInput.value.trim().toLowerCase();

  if (email) {
    nextButton.disabled = true;

    // Clear previous error messages
    clearErrorMessages();

    // Check Firestore users collection for the provided email
    firestore.collection('users').where('email', '==', email).get()
      .then(snapshot => {
        if (snapshot.empty) {
          // Email does not exist in Firestore, show error
          displayErrorMessage(emailInput, 'This email does not exist in our records.');
        } else {
          // Email exists, proceed to show password input
          emailInput.style.display = 'none';
          nextButton.style.display = 'none';

          const signInLabel = document.getElementById('sign-in-label');
          signInLabel.textContent = 'Password';

          // Create the password input element
          const passwordInput = document.createElement('input');
          passwordInput.type = 'password';
          passwordInput.placeholder = 'Enter password';
          passwordInput.id = 'password-input';
          passwordInput.style.marginTop = '10px';

          // Insert the password input element
          nextButton.parentNode.insertBefore(passwordInput, nextButton);

          // Create and display the "Sign In" button
          const signInButton = document.createElement('button');
          signInButton.id = 'sign-in-button';
          signInButton.textContent = 'Sign In';

          // Insert the sign-in button
          nextButton.parentNode.insertBefore(signInButton, nextButton);

          // Handle "Sign In" button logic
          signInButton.addEventListener('click', () => {
            event.preventDefault();
            const password = passwordInput.value.trim();

            if (!password) {
              displayErrorMessage(passwordInput, 'Please enter your password.');
              return;
            }

            // Firebase sign-in with email and password
            auth.signInWithEmailAndPassword(email, password)
              .then(userCredential => {
                console.log('Signed in as:', userCredential.user.email);
                window.location.href = '../index.html'; // Redirect to index
              })
              .catch(error => {
                // Display error message if password is incorrect
                displayErrorMessage(passwordInput, 'Incorrect password, please try again.');
              });
          });
        }
      })
      .catch(error => {
        console.error('Error querying Firestore for email:', error);
        alert('An error occurred while checking your email. Please try again.');
      })
      .finally(() => {
        nextButton.disabled = false;
      });
  } else {
    alert('Please enter your email.');
  }
});

// Helper function to clear previous error messages
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.style.display = 'none'); // Hide any error messages
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.classList.remove('error')); // Remove error class from inputs
}

// Helper function to display error messages below the input fields
function displayErrorMessage(inputElement, message) {
  // Show error message
  const errorMessage = document.getElementById(inputElement.id + '-error-message');
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  // Apply error border to input
  inputElement.classList.add('error');
}

// Handle showing sign-up form
const showSignUpButton = document.getElementById('show-signup');
const signUpForm = document.getElementById('sign-up-form');
const backStep = document.getElementById('back-step');

showSignUpButton.addEventListener('click', () => {
  signUpForm.classList.add('active'); // Show sign-up form as a popup
});

// Close the sign-up form if clicked outside
backStep.addEventListener('click', (event) => {
  if (event.target === backStep) {
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
    document.getElementById('step-username').classList.add('active');
  }
});

const usernameInput = document.getElementById('username');
const usernameStatus = document.getElementById('username-status');
const nextStepUsernameButton = document.getElementById('next-step-username');

let tempUsername = ""; // Temporary variable to store the username

// Validate username rules and availability
usernameInput.addEventListener('input', () => {
  const username = usernameInput.value.trim();

  // Ensure the username is not blank
  if (username === "") {
    usernameStatus.textContent = "Username cannot be blank.";
    usernameStatus.style.color = "red";
    usernameInput.style.borderColor = "red";
    nextStepUsernameButton.disabled = true;
    return;
  }

  // Validate against allowed characters and length
  const isValid = /^[a-zA-Z0-9_]{1,15}$/.test(username); // Twitter-style rules

  if (!isValid) {
    usernameStatus.textContent = "Invalid username. Use letters, numbers, or underscores only (1-15 characters).";
    usernameStatus.style.color = "red";
    usernameInput.style.borderColor = "red";
    nextStepUsernameButton.disabled = true;
    return;
  }

  // Check username availability in Firestore
  firestore.collection('users').where('username', '==', username).get()
    .then(snapshot => {
      if (!snapshot.empty) {
        usernameStatus.textContent = "Username is already taken.";
        usernameStatus.style.color = "red";
        usernameInput.style.borderColor = "red";
        nextStepUsernameButton.disabled = true;
      } else {
        usernameStatus.textContent = "Username is available!";
        usernameStatus.style.color = "green";
        usernameInput.style.borderColor = "green";
        tempUsername = username; // Store the username temporarily
        nextStepUsernameButton.disabled = false;
      }
    })
    .catch(error => {
      console.error("Error checking username:", error);
    });
});

// Move to the next step when "Next" is clicked
nextStepUsernameButton.addEventListener('click', () => {
  if (tempUsername) {
    document.getElementById('step-username').classList.remove('active');
    document.getElementById('step-3').classList.add('active'); // Move to the final step
  } else {
    alert("Please choose a valid username.");
  }
});


// Step 3 (Agree to Terms & Conditions)
//const agreeTermsCheckbox = document.getElementById('agree-terms');
const signUpButton = document.getElementById('sign-up-button');

/*agreeTermsCheckbox.addEventListener('change', () => {
  signUpButton.disabled = !agreeTermsCheckbox.checked; // Enable/disable sign-up button
});*/

signUpButton.addEventListener('click', () => {
  const user = auth.currentUser;
  const userId = user.uid;
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;

  if (!tempUsername) {
    alert("Username not set. Please go back and choose a username.");
    return;
  }

  signUpButton.disabled = true;

  // Save the user's information to Firestore, including the username
  firestore.collection('users').doc(userId).set({
    name: name,
    dob: dob,
    email: user.email,
    username: tempUsername, // Save the username here
    dateCreated: new Date(),
    followers: 0,
    creds: 0
  })
  .then(() => {
    alert('Account created successfully!');
    signUpForm.classList.remove('active'); // Close the sign-up form
  })
  .catch(error => {
    alert('Error creating account: ' + error.message);
    signUpButton.disabled = false;
  });
});

