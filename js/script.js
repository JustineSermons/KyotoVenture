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

  // Update the label text
  galleryLabel.textContent = imageDetails[index].label;
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

