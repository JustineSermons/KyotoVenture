document.addEventListener('DOMContentLoaded', () => {
  console.log('Login JavaScript loaded!');
  
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const loginError = document.getElementById('login-error-message');
  

  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log("Login form submitted!");

      const email = emailInput.value;
      const password = passwordInput.value;

      fetch('http://localhost:5000/api/login', {  
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
      })
      .then(response => response.json())
      .then(data => {
          if (data.token) {  // Check if the server responded with a token
              console.log('Login successful:', data);

              // Stores the JWT token in localStorage
              localStorage.setItem('token', data.token);

              // Redirects to the home page 
              window.location.href = '/index.html';  
          } else {
              loginError.textContent = data.message || "Login failed, please try again.";
              loginError.style.color = "red";
          }
      })
      .catch(error => {
          console.error('Error:', error);
          loginError.textContent = "Something went wrong. Please try again later.";
          loginError.style.color = "red";
      });
  });
});

