// Switch between local and production
// When running locally, http://localhost:5000 will be used and in production, https://kyotoventure.onrender.com will be used
const API_URL = 
window.location.hostname === "localhost"
  ? "http://localhost:5000" // local backend
  : "https://kyotoventure-production.up.railway.app"; //production url on Railway

// Search Feature
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".activities-search-box input");
  const searchButton = document.querySelector(".activities-search-button");
  const cards = document.querySelectorAll(".card");

  // Function to filter activities based on search input
  function filterActivities() {
    const searchText = searchInput.value.toLowerCase();

    cards.forEach((card) => {
      const title = card.querySelector(".cardTitle").textContent.toLowerCase();
      card.style.display = title.includes(searchText) ? "block" : "none";
    });
  }

  // Event listeners for search functionality
  searchButton.addEventListener("click", filterActivities);
  searchInput.addEventListener("keyup", filterActivities);

  // Card Click Feature (to go to the activity details page of the card)
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function (event) {
      console.log("Card clicked");

      // Prevent navigation when clicking the "Add to Itinerary" button (clicking anywhere else on the card takes you to activity details page)
      if (event.target.closest(".addItineraryButton")) {
        event.stopPropagation();
        return;
      }
      // Get the URL of the activity details page from data-url and navigate to that specific page
      const pageUrl = this.getAttribute("data-url");
      // debug log for URL to show that your navigating to the activity details page based on the activity cards clicked
      console.log("Navigating to:", pageUrl);

      if (pageUrl) {
        window.location.href = pageUrl;
      } else {
        console.error("No URL found for this card!");
      }
    });
  });

  // Function to filter activities based on selected tags, areas, and interests
  function filterCards() {
    const selectedTags = [
      ...document.querySelectorAll(".selected-checkbox-tags .tag"),
    ].map((tag) => tag.getAttribute("data-value"));

    const selectedAreas = [
      ...document.querySelectorAll(
        '.area-checkbox-group input[type="checkbox"]:checked'
      ),
    ].map((checkbox) => checkbox.value);

    const selectedInterests = [
      ...document.querySelectorAll(
        '.interests-checkbox-group input[type="checkbox"]:checked'
      ),
    ].map((checkbox) => checkbox.value);

    cards.forEach((card) => {
      const cardArea = card.getAttribute("data-area");
      const cardInterests = card.getAttribute("data-interests").split(", ");

      const matchesArea =
        selectedAreas.length === 0 || selectedAreas.includes(cardArea);
      const matchesInterest =
        selectedInterests.length === 0 ||
        cardInterests.some((interest) => selectedInterests.includes(interest));
      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.every(
          (tag) => cardInterests.includes(tag) || cardArea === tag
        );

      card.style.display =
        matchesArea && matchesInterest && matchesTag ? "block" : "none";
    });
  }

  // Event listeners for checkbox filtering
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const value = event.target.value;
      const tagContainer = document.querySelector(".selected-checkbox-tags");

      if (event.target.checked) {
        // Create a tag element for selected checkbox
        const tag = document.createElement("div");
        tag.className = "tag";
        tag.setAttribute("data-value", value);
        tag.innerHTML = `${value} <button aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>`;

        tagContainer.appendChild(tag);

        // Remove tag when clicked
        tag.querySelector("button").addEventListener("click", () => {
          event.target.checked = false;
          tag.remove();
          filterCards();
        });
      } else {
        // Remove tag when checkbox is unchecked
        const tagToRemove = tagContainer.querySelector(
          `.tag[data-value="${value}"]`
        );
        if (tagToRemove) tagToRemove.remove();
        filterCards();
      }
    });
  });

  // Clear all selected filters
  document.querySelector(".clear-all").addEventListener("click", () => {
    document.querySelector(".selected-checkbox-tags").innerHTML = "";
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));
    showAllCards();
    filterCards();
  });

  // Function to show all cards
  function showAllCards() {
    cards.forEach((card) => (card.style.display = "block"));
  }

  // Event listeners for area and interest checkboxes
  document
    .querySelectorAll(
      '.area-checkbox-group input[type="checkbox"], .interests-checkbox-group input[type="checkbox"]'
    )
    .forEach((checkbox) => {
      checkbox.addEventListener("change", filterCards);
    });

   // Function to show a popup notification when an activity is added to the itinerary
   function showActivityAddedPopup() {
    // Remove any existing popups first
    const existingPopup = document.getElementById('activity-added-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'activity-added-popup';
    popup.classList.add('move-activity-popup');
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Success';
    
    // Create message
    const message = document.createElement('p');
    message.textContent = 'Activity added to your default itinerary!';
    message.classList.add('delete-confirmation-message');
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('popup-buttons');
    
    // Create OK button
    const okButton = document.createElement('button');
    okButton.classList.add('popup-confirm-button');
    okButton.textContent = 'OK';
    okButton.onclick = () => {
      popup.remove();
    };
    
    // Assemble the popup
    buttonsContainer.appendChild(okButton);
    
    popupContent.appendChild(title);
    popupContent.appendChild(message);
    popupContent.appendChild(buttonsContainer);
    
    popup.appendChild(popupContent);
    
    // Add the popup to the document body
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
    const existingPopup = document.getElementById('activity-error-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'activity-error-popup';
    popup.classList.add('move-activity-popup');
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Error';
    
    // Create message
    const message = document.createElement('p');
    message.textContent = errorMessage || 'Something went wrong. Please try again.';
    message.classList.add('delete-confirmation-message');
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('popup-buttons');
    
    // Create OK button
    const okButton = document.createElement('button');
    okButton.classList.add('popup-confirm-button');
    okButton.textContent = 'OK';
    okButton.onclick = () => {
      popup.remove();
    };
    
    // Assemble the popup
    buttonsContainer.appendChild(okButton);
    
    popupContent.appendChild(title);
    popupContent.appendChild(message);
    popupContent.appendChild(buttonsContainer);
    
    popup.appendChild(popupContent);
    
    // Add the popup to the document body
    document.body.appendChild(popup);
  }

  // Function to remove any existing popups (for better user experience and to not have multiple popups on screen for any reason)
  function removeExistingPopups() {
    const existingPopups = document.querySelectorAll('.move-activity-popup');
    existingPopups.forEach(popup => {
      popup.remove();
    });
  }

  // Function to show a popup notification when an activity is added to the itinerary
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
    
    // popup title
    const title = document.createElement('h3');
    title.textContent = 'Success';
    
    // message for adding an activity to the default itinerary
    const message = document.createElement('p');
    message.textContent = 'Activity added to your default itinerary!';
    message.classList.add('delete-confirmation-message');
    
    // buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('popup-buttons');
    
    // confirmation button
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

    // Automatically close popup after 3 seconds or the user can click the ok button
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
    
    // OK button to exit popup
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

      const response = await fetch(`${API_URL}/api/activities/add`, {
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

  // Event listeners for "Add to Itinerary" buttons
  document.querySelectorAll(".addItineraryButton").forEach((button) => {
    button.addEventListener("click", (event) => {
      const activityId = event.target.dataset.activityId;
      addActivityToDefaultItinerary(activityId);
    });
  });

  // Event listener for "Go to My Itinerary" button at the top right (that page shows the users default itinerary)
  document
    .querySelector(".goToMyItineraryButton")
    .addEventListener("click", function () {
      window.location.href = "itineraries.html";
    });
});