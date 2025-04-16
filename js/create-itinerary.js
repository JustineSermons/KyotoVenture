// Switch between local and production
// When running locally, http://localhost:5000 will be used and in production, https://kyotoventure.onrender.com will be used
const API_URL = 
window.location.hostname === "localhost"
  ? "http://localhost:5000" // local backend
  : "https://kyotoventure.onrender.com"; //production url on Render

// Gets the "Add Day" option/button, the container for days, and the Save Itinerary button
const addDayText = document.getElementById('add-day');
const daysContainer = document.getElementById('days-container');
const saveItineraryButton = document.getElementById('save-itinerary-btn');

// Function to create a new day section
function addNewDay() {
  const dayCount = daysContainer.querySelectorAll('.day').length;

  if (dayCount < 7) {
    // Create a new container div for the day
    const dayContainer = document.createElement('div');
    dayContainer.classList.add('day');

    // Create the text for the new day
    const dayText = document.createElement('span');
    dayText.classList.add('dayText');
    dayText.textContent = `Day ${dayCount + 1}`;

    // Append the day text to the day container
    dayContainer.appendChild(dayText);
    daysContainer.appendChild(dayContainer);
  } else {
    // Show error popup for day limit
    showPopup("Day Limit Reached", "You can't add more than 7 days!", "OK", "error");
  }
}

// Popup function with button-type support
function showPopup(title, message, buttonText, type, callback) {
  // Remove any existing popup first
  const existingPopup = document.getElementById('custom-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // popup container
  const popup = document.createElement('div');
  popup.id = 'custom-popup';
  popup.classList.add('move-activity-popup');

  // popup content with appropriate class based on type
  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');
  
  // add type-specific class
  if (type) {
    popupContent.classList.add(`popup-${type}`);
  }

  // title
  const popupTitle = document.createElement('h3');
  popupTitle.textContent = title;
  popupTitle.classList.add('popup-title');

  // message
  const popupMessage = document.createElement('p');
  popupMessage.textContent = message;
  popupMessage.classList.add('popup-message');

  // buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('popup-buttons');

  // button with type-specific class
  const confirmButton = document.createElement('button');
  confirmButton.classList.add('popup-button');
  
  if (type) {
    confirmButton.classList.add(`popup-button-${type}`);
  }
  
  confirmButton.textContent = buttonText;
  confirmButton.onclick = () => {
    popup.remove();
    if (callback) callback();
  };

  // combine popup
  buttonsContainer.appendChild(confirmButton);
  popupContent.appendChild(popupTitle);
  popupContent.appendChild(popupMessage);
  popupContent.appendChild(buttonsContainer);
  popup.appendChild(popupContent);

  // add popup to document body
  document.body.appendChild(popup);
}

// Event listener for the "Add Day" option
addDayText.addEventListener('click', function() {
  addNewDay();
});

// Function to save the itinerary and form data
function saveItinerary() {
  // Get the number of days added
  const daysAdded = daysContainer.querySelectorAll('.day').length;

  // Get form data values
  const itineraryName = document.getElementById('itineraryName').value;
  const destinations = document.getElementById('destinations').value;
  const budget = document.getElementById('budget').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  // form validation
  if (!itineraryName || !destinations || !budget || !startDate || !endDate || daysAdded === 0) {
    showPopup("Missing Information", "Please fill in all fields and add at least one day.", "OK", "error");
    return;
  }

  // Log both the form data and the number of days in console
  console.log("Itinerary Name:", itineraryName);
  console.log("Destinations:", destinations);
  console.log("Budget ($):", budget);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Number of Days Added:", daysAdded);

  // Request body to send to the backend
  const itineraryData = {
    itinerary_name: itineraryName,
    destinations: destinations.split(',').map(destination => destination.trim()), 
    budget: budget,
    start_date: startDate,
    end_date: endDate,
    days_added: daysAdded 
  };

  // Show loading popup
  showPopup("Processing", "Saving your itinerary...", "Please wait", "info");

  // Send data to the backend
  fetch(`${window.API_URL}/api/itineraries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(itineraryData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log("Itinerary saved successfully:", data.itinerary);
        
        // Show success popup and redirect to itineraries page when confirmed
        showPopup("Success", "Itinerary saved successfully!", "View My Itineraries", "success", () => {
          window.location.href = 'itineraries.html';
        });
      } else {
        console.error('Error saving itinerary:', data.message);
        showPopup("Error", data.message || 'Error saving itinerary. Please try again.', "OK", "error");
      }
    })
    .catch(err => {
      console.error('Error:', err);
      showPopup("Error", "Error saving itinerary. Please try again.", "OK", "error");
    });
}

// Event listener for the "Save Itinerary" button
saveItineraryButton.addEventListener('click', saveItinerary);