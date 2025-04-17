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