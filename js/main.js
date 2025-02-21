// Function to check if the user is logged in
document.addEventListener("DOMContentLoaded", checkLoginStatus);

function checkLoginStatus() {
    console.log("Checking login status...");

    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging log

    const loggedInMenu = document.getElementById("logged-in");
    const loggedOutMenu = document.getElementById("logged-out");

    if (!loggedInMenu || !loggedOutMenu) {
        console.error("Navbar elements not found!");
        return;
    }

    if (token) {
        loggedInMenu.style.display = "block";
        loggedOutMenu.style.display = "none";
        console.log("User logged in - Navbar updated.");
    } else {
        loggedInMenu.style.display = "none";
        loggedOutMenu.style.display = "block";
        console.log("User logged out - Navbar updated.");
    }
}

  
  // Function to log out the user
  function logout() {
  // Remove the token from localStorage
    localStorage.removeItem("token");
    console.log("User logged out");
        // Redirects to login page
        window.location.href = 'login.html'; 
}

