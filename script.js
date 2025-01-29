// Adjust grid layout dynamically based on window width
function adjustGridLayout() {
    const container = document.querySelector('.gallery-container');
    const width = window.innerWidth;
  
    if (width < 600) {
      container.style.gridTemplateColumns = '1fr';  // Single column for small screens
    } else if (width < 1000) {
      container.style.gridTemplateColumns = '1fr 1fr';  // Two columns for medium screens
    } else {
      container.style.gridTemplateColumns = '1fr 1fr 1fr';  // Three columns for large screens
    }
  }
  
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
  
  // Run the function on page load and when window resizes
  window.addEventListener('load', adjustGridLayout);
  window.addEventListener('resize', adjustGridLayout);
  