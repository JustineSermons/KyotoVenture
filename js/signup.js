document.addEventListener('DOMContentLoaded', () => {
  console.log('Frontend JavaScript loaded!');
  const form = document.getElementById('form');
  const username_input = document.getElementById('username-input');
  const email_input = document.getElementById('email-input');
  const password_input = document.getElementById('password-input');
  const confirm_password_input = document.getElementById('confirm-password-input');
  const error_message = document.getElementById('error-message');

  // Signup form logic
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log("Form submitted!");

    const username = username_input.value;
    const email = email_input.value;
    const password = password_input.value;
    const confirm_password = confirm_password_input.value;

    // Validation check if passwords match
    if (password !== confirm_password) {
      error_message.textContent = "Passwords do not match!";
      error_message.style.color = "red";
      return;
    }

    // Send signup request to backend API
    fetch('http://localhost:5000/api/signup', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/login.html';  // Redirects to login page after successful signup
      } else {
        error_message.textContent = data.message || "Signup failed, please try again.";
        error_message.style.color = "red";
      }
    })
    .catch(error => {
      console.error('Error:', error);
      error_message.textContent = "Something went wrong. Please try again later.";
      error_message.style.color = "red";
    });
  });
});
