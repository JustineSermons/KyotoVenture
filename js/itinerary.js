//////////// Retrieve User Itineraries and Display Username of Logged-in User
// Itineraries Page to display all of the user's collections


// Fetch itineraries from the backend and display them
async function fetchItineraries() {
  try {
    console.log("Fetching itineraries...");

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/api/itineraries", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch itineraries");
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    // Check if user and itineraries exist in response
    if (!data || !data.user || !data.itineraries) {
      throw new Error("Invalid response format");
    }

    // Display username of logged-in user
    const usernameElement = document.getElementById("username");
    console.log("Username element found:", usernameElement);

    if (usernameElement) {
      usernameElement.textContent = data.user;
      console.log("Updated username:", data.user);
    } else {
      console.warn("Username element not found in the HTML.");
    }

    // Display itineraries of logged-in user
    const itinerariesContainer = document.getElementById("itineraries-container");
    console.log("Itinerary collections found:", itinerariesContainer);
    if (!itinerariesContainer) {
      console.warn("Itineraries container not found.");
      return;
    }

   
    itinerariesContainer.innerHTML = "";

    // display selected itinerary collection in dropdown
    const dropdown = document.getElementById("itinerary-dropdown");
    dropdown.innerHTML = "";

    if (data.itineraries.length === 0) {
      itinerariesContainer.innerHTML = "<p>No itineraries found.</p>";
      dropdown.innerHTML = "<option>No itineraries</option>";
    } else {
      // displays itinerary collections in dropdown (order of recently added first to first made as the last)
      data.itineraries.forEach((itinerary) => {
        // create itinerary collection elements
        const itineraryElement = document.createElement("div");
        itineraryElement.classList.add("itin-container");

        itineraryElement.innerHTML = `
        <div class="itin-container">
          <p class="defitin">
            <span <i class="fa-solid fa-star star"></i></span> ${itinerary.itinerary_name}
          </p>
          <div class="image-container">
            <img class="bamb" src="${
              itinerary.image
                ? "assets/images/" + itinerary.image
                : "assets/images/bamboogrove.png"
            }" alt="${itinerary.itinerary_name}">
          </div>
          <div class="button-container">
            <button class="foodbutton view-btn" data-id="${itinerary.id}">View</button>
            <button class="foodbutton delete-btn" data-id="${itinerary.id}">Delete</button>
          </div>
        </div>
      `;

        itinerariesContainer.appendChild(itineraryElement);

        // add to dropdown for default itinerary selection
        const option = document.createElement("option");
        option.value = itinerary.id;
        option.textContent = itinerary.itinerary_name;

        // Bold currently selected default itinerary collection
        if (itinerary.is_default) {
          option.style.fontWeight = "bold";
          dropdown.dataset.default = itinerary.id;
          // default itinerary selected
          option.selected = true;
        }

        dropdown.appendChild(option);
      });

      // View Button Functionality for Each Itinerary Collection
      document.querySelectorAll(".view-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const itineraryId = this.getAttribute("data-id");

          console.log("View button clicked, itinerary ID:", itineraryId);

          if (!itineraryId) {
            console.error("No itinerary ID found.");
            return;
          }

          // Store itinerary ID in localStorage
          localStorage.setItem("selectedItineraryId", itineraryId);

          // goes to itinerary-collections.html page of the specific collection clicked
          window.location.href = "itinerary-collections.html";
        });
      });

      // Delete Buttons on each itinerary collection functionality
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const itineraryId = this.getAttribute("data-id");
          showDeleteItineraryPopup(itineraryId);
        });
      });
    }
  } catch (error) {
    console.error("Error fetching itineraries:", error);
  }
}

// Function to show popup for deleting an itinerary
function showDeleteItineraryPopup(itineraryId) {
// Remove any existing popups first
const existingPopup = document.getElementById('delete-itinerary-popup');
if (existingPopup) {
  existingPopup.remove();
}

// Create popup container
const popup = document.createElement('div');
popup.id = 'delete-itinerary-popup';
popup.classList.add('move-activity-popup');

// Create popup content
const popupContent = document.createElement('div');
popupContent.classList.add('popup-content');

// Create title
const title = document.createElement('h3');
title.textContent = 'Delete Itinerary';

// Create message
const message = document.createElement('p');
message.textContent = 'Are you sure you want to delete this itinerary collection?';
message.classList.add('delete-confirmation-message');

// Create buttons container
const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('popup-buttons');

// Create confirm button
const confirmButton = document.createElement('button');
confirmButton.classList.add('popup-confirm-button');
confirmButton.textContent = 'Confirm';
confirmButton.onclick = () => {
  deleteItinerary(itineraryId);
  popup.remove();
};

// Create cancel button
const cancelButton = document.createElement('button');
cancelButton.classList.add('popup-cancel-button');
cancelButton.textContent = 'Cancel';
cancelButton.onclick = () => {
  popup.remove();
  console.log("Itinerary deletion cancelled.");
};

// Assemble the popup
buttonsContainer.appendChild(confirmButton);
buttonsContainer.appendChild(cancelButton);

popupContent.appendChild(title);
popupContent.appendChild(message);
popupContent.appendChild(buttonsContainer);

popup.appendChild(popupContent);

// Add the popup to the document body
document.body.appendChild(popup);
}

// delete an itinerary
async function deleteItinerary(itineraryId) {
try {
  console.log("Deleting itinerary ID:", itineraryId);

  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/itineraries/${itineraryId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete itinerary.");
  }

  console.log("Itinerary deleted:", result.message);

  // Refresh the itinerary list after deletion
  fetchItineraries();
} catch (error) {
  console.error("Error deleting itinerary:", error);
}
}

// set an itinerary as the default itinerary
async function setDefaultItinerary(itineraryId) {
try {
  console.log("Setting default itinerary:", itineraryId);

  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/itineraries/default/${itineraryId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to set default itinerary.");
  }

  console.log("Default itinerary updated:", result.message);

  // Store the default itinerary ID in localStorage
  localStorage.setItem("defaultItineraryId", itineraryId);

  // Refresh list to update the bold styling for the default itinerary
  fetchItineraries();
} catch (error) {
  console.error("Error setting default itinerary:", error);
}
}

// dropdown change event listener
document
.getElementById("itinerary-dropdown")
.addEventListener("change", function () {
  const selectedItineraryId = this.value;
  if (selectedItineraryId) {
    setDefaultItinerary(selectedItineraryId);
  }
});

// Gets logged-in user itineraries when the page loads
fetchItineraries();