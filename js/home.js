// Global variables to track the current image index
let currentImageIndex = 0;

// Gallery image collection
const galleryImages = document.querySelectorAll('.gallery-image');

// Event names
const eventNames = [
  "Gion Matsuri",
  "Aoi Matsuri",
  "To-ji Temple Flea Market",
  "Jidai Matsuri",
  "Arashiyama Hanatouro"
];

// Event detail pages corresponding to each event
const eventDetailsPages = [
  "gion-matsuri-festival-details.html",
  "aoi-matsuri-festival-details.html",
  "toji-temple-details.html",
  "jidai-matsuri-festival-details.html",
  "arashiyama-hanatouro-details.html"
];

// Function to update event name on top button
function updateEventName() {
  const eventNameElement = document.getElementById('event-name');
  if (eventNameElement) {
    eventNameElement.textContent = eventNames[currentImageIndex];
  }
}

// Function to navigate to the previous image (with circular navigation)
function prevImage() {
  currentImageIndex = (currentImageIndex === 0) ? galleryImages.length - 1 : currentImageIndex - 1; // Loop back to last image if on the first
  showImage();  // Show the current image
  updateEventName();  // Update event name text
}

// Function to navigate to the next image (with circular navigation)
function nextImage() {
  currentImageIndex = (currentImageIndex === galleryImages.length - 1) ? 0 : currentImageIndex + 1; // Loop back to first image if on the last
  showImage();  // Show the current image
  updateEventName();  // Update event name text
}

// Function to show the current image and hide others
function showImage() {
  galleryImages.forEach((img, index) => {
    img.style.display = (index === currentImageIndex) ? 'block' : 'none';
  });
}

// Initialize on page load
window.addEventListener('load', () => {
  showImage();  // Show the first image initially
  updateEventName();  // Update event name when the page loads
});

// Add hover effects to gallery items
const galleryItems = document.querySelectorAll('.gallery-item-container');

galleryItems.forEach(item => {
  const caption = item.querySelector('.image-caption');
  const img = item.querySelector('.gallery-item');

  item.addEventListener('mouseenter', () => {
    item.style.transform = 'scale(1.05)';
    img.style.transform = 'scale(1.05)';
    caption.style.opacity = '1';  // Show caption on hover
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = 'scale(1)';
    img.style.transform = 'scale(1)';
    caption.style.opacity = '0';  // Hide caption when not hovering
  });
});

// Tag Functionality
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener('change', (event) => {
    const value = event.target.value;
    const tagContainer = document.querySelector('.selected-checkbox-tags');

    if (event.target.checked) {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.setAttribute('data-value', value);
      tag.innerHTML = `${value} <button aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>`;

      tagContainer.appendChild(tag);

      tag.querySelector('button').addEventListener('click', () => {
        event.target.checked = false; 
        tag.remove(); 
      });
    } else {
      const tagToRemove = tagContainer.querySelector(`.tag[data-value="${value}"]`);
      if (tagToRemove) tagToRemove.remove();
    }
  });
});

// Clears all tags and checkboxes once Clear All is clicked 
document.querySelector('.clear-all').addEventListener('click', () => {
  const tagContainer = document.querySelector('.selected-checkbox-tags');
  tagContainer.innerHTML = '';
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
});

// Handle clicking cards to navigate to activity details
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function(event) {
    if (event.target.closest('.addItineraryButton')) {
      event.stopPropagation(); 
      return;
    }

    const pageUrl = this.getAttribute('data-url');
    if (pageUrl) {
      window.location.href = pageUrl;
    }
  });
});

// Search Feature
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".activities-search-box input");
  const searchButton = document.querySelector(".activities-search-button");
  const cards = document.querySelectorAll(".card");

  function filterActivities() {
    const searchText = searchInput.value.toLowerCase();

    cards.forEach((card) => {
      const title = card.querySelector(".cardTitle").textContent.toLowerCase();
      
      if (title.includes(searchText)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchButton.addEventListener("click", filterActivities);
  searchInput.addEventListener("keyup", filterActivities); 
});

// Go to My Itinerary Button
document.querySelector(".goToMyItineraryButton").addEventListener("click", function () {
  window.location.href = "my-itinerary.html"; 
});

// scrolling cards
function scrollCards(containerId, direction) {
    const container = document.getElementById(containerId);
    container.scrollBy({ left: direction * 300, behavior: 'smooth' });
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const leftArrows = document.querySelectorAll('.scrollable-cards-section .left-arrow');
    const rightArrows = document.querySelectorAll('.scrollable-cards-section .right-arrow');
    
    // left arrow event listener
    leftArrows.forEach(leftArrow => {
      leftArrow.addEventListener('click', function() {
        const container = this.closest('.scrollable-cards-wrapper')
                             .querySelector('.scrollable-cards-container');
        container.scrollBy({ left: -300, behavior: 'smooth' });
      });
    });
    
    // right arrow event listener
    rightArrows.forEach(rightArrow => {
      rightArrow.addEventListener('click', function() {
        const container = this.closest('.scrollable-cards-wrapper')
                             .querySelector('.scrollable-cards-container');
        container.scrollBy({ left: 300, behavior: 'smooth' });
      });
    });
  });
