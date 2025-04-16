const API_URL = 
  window.location.hostname === "localhost"
    ? "http://localhost:5000" // local backend
    : "https://kyotoventure.onrender.com"; //production url on Render

// API_URL globally available
window.API_URL = API_URL;