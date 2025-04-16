// Switch between local and production
// When running locally, http://localhost:5000 will be used and in production, https://kyotoventure.onrender.com will be used
const API_URL = 
window.location.hostname === "localhost"
  ? "http://localhost:5000" // local backend
  : "https://kyotoventure.onrender.com"; //production url on Render

document.addEventListener("DOMContentLoaded", function () {
    // Function to remove any existing popups
    function removeExistingPopups() {
      const existingPopups = document.querySelectorAll('.move-activity-popup');
      existingPopups.forEach(popup => {
        popup.remove();
      });
    }
  
    // Function to show a success popup when an activity is added to the itinerary
    function showActivityAddedPopup() {
      // Remove any existing popups first
      removeExistingPopups();
  
      // popup container
      const popup = document.createElement('div');
      popup.id = 'activity-added-popup';
      popup.classList.add('move-activity-popup');
      
      // popup content
      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');
      
      // title
      const title = document.createElement('h3');
      title.textContent = 'Success';
      
      // message for adding an activity to the default itinerary
      const message = document.createElement('p');
      message.textContent = 'Activity added to your default itinerary!';
      message.classList.add('delete-confirmation-message');
      
      // buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('popup-buttons');
      
      // OK button
      const okButton = document.createElement('button');
      okButton.classList.add('popup-confirm-button');
      okButton.textContent = 'OK';
      okButton.onclick = () => {
        popup.remove();
      };
      
      // combine popup
      buttonsContainer.appendChild(okButton);
      
      popupContent.appendChild(title);
      popupContent.appendChild(message);
      popupContent.appendChild(buttonsContainer);
      
      popup.appendChild(popupContent);
      
      // add popup to the document body
      document.body.appendChild(popup);
  
      // Automatically close popup after 3 seconds
      setTimeout(() => {
        if (document.body.contains(popup)) {
          popup.remove();
        }
      }, 3000);
    }
  
    // Function to show an error popup
    function showErrorPopup(errorMessage) {
      // Remove any existing popups first
      removeExistingPopups();
  
      // popup container
      const popup = document.createElement('div');
      popup.id = 'activity-error-popup';
      popup.classList.add('move-activity-popup');
      
      // popup content
      const popupContent = document.createElement('div');
      popupContent.classList.add('popup-content');
      
      // title
      const title = document.createElement('h3');
      title.textContent = 'Error';
      
      // error message
      const message = document.createElement('p');
      message.textContent = errorMessage || 'Something went wrong. Please try again.';
      message.classList.add('delete-confirmation-message');
      
      // buttons container
      const buttonsContainer = document.createElement('div');
      buttonsContainer.classList.add('popup-buttons');
      
      // OK button
      const okButton = document.createElement('button');
      okButton.classList.add('popup-confirm-button');
      okButton.textContent = 'OK';
      okButton.onclick = () => {
        popup.remove();
      };
      
      // combine popup
      buttonsContainer.appendChild(okButton);
      
      popupContent.appendChild(title);
      popupContent.appendChild(message);
      popupContent.appendChild(buttonsContainer);
      
      popup.appendChild(popupContent);
      
      // add popup to the document body
      document.body.appendChild(popup);
    }
  
    // Function to add an activity to the default itinerary
    async function addActivityToDefaultItinerary(activityId) {
      try {
        const token = localStorage.getItem("token");
        const defaultItineraryId = localStorage.getItem("defaultItineraryId");
  
        if (!defaultItineraryId) {
          showErrorPopup("You need to set a default itinerary first.");
          return;
        }
  
        const response = await fetch(`${window.API_URL}/api/activities/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ activityId }),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || "Failed to add activity.");
        }
  
        showActivityAddedPopup();
      } catch (error) {
        console.error("Error adding activity to itinerary:", error);
        showErrorPopup(error.message || "Failed to add activity to itinerary.");
      }
    }
  
    // Event listener for the "Add to Itinerary" button for adding specific activities
    const addToItineraryButton = document.querySelector('.itinerary');
    if (addToItineraryButton) {
      addToItineraryButton.addEventListener('click', function() {
        const activityId = this.getAttribute('data-activity-id');
        if (activityId) {
          addActivityToDefaultItinerary(activityId);
        } else {
          showErrorPopup("Activity ID not found");
        }
      });
    }
});