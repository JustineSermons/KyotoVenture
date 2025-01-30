const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const scrollContainer = document.querySelector('.scrollable-cards-container');

// Scroll amount
const scrollAmount = 320; // Adjust to fit one card width or desired scroll distance

// Event listeners for left and right arrows
leftArrow.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

rightArrow.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// Function to handle navigation
function navigateToPage(url) {
  window.location.href = url; // Redirect to the specified page
}
