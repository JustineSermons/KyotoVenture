/* Toggle =/- responsive nav links with menu */
function toggleMenuBar() {
  var x = document.getElementById("topNavBar");
  if (x.classList.contains("responsive")) {
      x.classList.remove("responsive");
  } else {
      x.classList.add("responsive");
  }
}
// Switch back to normal top-nav w
// To avoid mobile menu staying open on larger screens
window.addEventListener("resize", function() {
  let nav = document.querySelector(".top-nav");
  
  if (window.innerWidth > 1200) {
    nav.classList.remove("responsive"); // Switch back to normal top-nav
  }
});


let currentIndex = 0;
const images = document.querySelectorAll(".gallery-image");
const galleryLabel = document.querySelector(".gallery-label");

// Details pages for each image
const imageDetails = [
  { url: "gion-matsuri-festival-details.html", label: "Gion Matsuri" },
  { url: "aoi-matsuri-festival-details.html", label: "Aoi Matsuri" },
  { url: "toji-temple-details.html", label: "To-ji Temple" },
  { url: "jidai-matsuri-festival-details.html", label: "Jidai Matsuri" },
  { url: "arashiyama-hanatouro-details.html", label: "Arashiyama Hanatouro" }
];

function showImage(index) {
  images.forEach((img, i) => {
    img.style.display = i === index ? "block" : "none";
  });

  // Check if galleryLabel exists before modifying it
  if (galleryLabel) {
    galleryLabel.textContent = imageDetails[index].label;
  } else {
    console.error("galleryLabel element not found!");
  }
}

 // Event listeners for the next and previous arrow buttons
function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

 // Event listener for the "Details" button
function goToDetails() {
  window.location.href = imageDetails[currentIndex].url;
}

// Initialize gallery with first image visible
showImage(currentIndex);

// Tag Functionality //
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const value = event.target.value;
      // Select div from html. Tags will be displayed in the div
      const tagContainer = document.querySelector('.selected-checkbox-tags');
  
      if (event.target.checked) {
        // Create a new tag
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.setAttribute('data-value', value);
        tag.innerHTML = `${value} <button aria-label="Remove tag"><i class="fa-solid fa-xmark"></i></button>`;
  
        // Append the tag to the tag container
        tagContainer.appendChild(tag);
  
        // Add event listener to the remove button
        tag.querySelector('button').addEventListener('click', () => {
          // Uncheck related checkbox
          event.target.checked = false; 
          // Remove tag
          tag.remove(); 
        });
      } else {
        // Remove tag if the checkbox is unchecked
        const tagToRemove = tagContainer.querySelector(`.tag[data-value="${value}"]`);
        if (tagToRemove) tagToRemove.remove();
      }
    });
  });
  // Clears all tags and checkboxes once Clear All is clicked // 
  document.querySelector('.clear-all').addEventListener('click', () => {
    // Clear all the tags
    const tagContainer = document.querySelector('.selected-checkbox-tags');
    tagContainer.innerHTML = '';
  
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  });


  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function(event) {
      console.log('Card clicked');
      
      // Check for the 'Add to Itinerary' button, don't navigate if clicked
      if (event.target.closest('.addItineraryButton')) {
        event.stopPropagation();
        return;
      }
  
      // Get the URL from data-url and navigate to specific activity details page
      const pageUrl = this.getAttribute('data-url');
      console.log('Navigating to:', pageUrl); // Debug log for URL
  
      if (pageUrl) {
        window.location.href = pageUrl;
      } else {
        console.error("No URL found for this card!");
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

    // Event Listeners
    searchButton.addEventListener("click", filterActivities);
    searchInput.addEventListener("keyup", filterActivities); 
  });

  // Go to My Itinerary Button
  document.querySelector(".goToMyItineraryButton").addEventListener("click", function () {
    window.location.href = "my-itinerary.html"; 
});

