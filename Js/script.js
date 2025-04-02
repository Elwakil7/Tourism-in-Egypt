// Common images array for both pages
const images = [
    './assets/images/pyramids giza.jpg',
    './assets/images/Luxur Temple.jpg',
    './assets/images/nile rever.jpg'
];

// Current zoom level
let zoomLevel = 1;
const zoomStep = 0.2;
const maxZoom = 3;
const minZoom = 0.5;

// Variables for pinch zoom
let initialPinchDistance = 0;
let isMultiTouch = false;

// Variables for image dragging/swiping
let isDragging = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

// Function to open modal
function openModal(index) {
    const modal = document.getElementById('modal');
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        const navbar = document.querySelector('nav');
        
        // Hide navbar when modal opens
        if (navbar) {
            navbar.style.display = 'none';
        }
        
        modal.style.display = 'block';
        modalImg.src = images[index];
        
        // Reset zoom level and position when opening modal
        zoomLevel = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
        updateZoomPercentage(); // Update the displayed percentage
        
        // Add touch events for pinch zoom
        if (modalImg) {
            modalImg.addEventListener('touchstart', handleTouchStart, false);
            modalImg.addEventListener('touchmove', handleTouchMove, false);
            modalImg.addEventListener('touchend', handleTouchEnd, false);
            
            // Add mouse events for dragging
            modalImg.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
        }
    }
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Show navbar when modal closes
        const navbar = document.querySelector('nav');
        if (navbar) {
            navbar.style.display = 'flex';
        }
    }
    
    // Remove touch events when closing modal
    const modalImg = document.getElementById('modal-img');
    if (modalImg) {
        modalImg.removeEventListener('touchstart', handleTouchStart);
        modalImg.removeEventListener('touchmove', handleTouchMove);
        modalImg.removeEventListener('touchend', handleTouchEnd);
        
        // Remove mouse events
        modalImg.removeEventListener('mousedown', handleDragStart);
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }
}

// Function to zoom in
function zoomIn() {
    if (zoomLevel < maxZoom) {
        zoomLevel += zoomStep;
        updateImageTransform();
        updateZoomPercentage(); // Update the displayed percentage
    }
}

// Function to zoom out
function zoomOut() {
    if (zoomLevel > minZoom) {
        zoomLevel -= zoomStep;
        
        // If zooming out to normal, reset position
        if (zoomLevel <= 1) {
            translateX = 0;
            translateY = 0;
        }
        
        updateImageTransform();
        updateZoomPercentage(); // Update the displayed percentage
    }
}

// Update transform with both zoom and position
function updateImageTransform() {
    const modalImg = document.getElementById('modal-img');
    if (modalImg) {
        modalImg.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${zoomLevel})`;
    }
}

// Update zoom percentage display
function updateZoomPercentage() {
    const zoomPercentage = document.querySelector('.zoom-percentage');
    if (zoomPercentage) {
        // Convert zoom level to percentage and display
        const percentage = Math.round(zoomLevel * 100);
        zoomPercentage.textContent = `${percentage}%`;
    }
}

// Handle drag start
function handleDragStart(e) {
    // Only enable dragging when zoomed in
    if (zoomLevel > 1) {
        isDragging = true;
        
        // Get initial position (handle both mouse and touch)
        if (e.type === 'touchstart') {
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
        } else {
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        }
        
        e.preventDefault();
    }
}

// Handle drag move
function handleDragMove(e) {
    if (!isDragging) return;
    
    let clientX, clientY;
    
    // Handle both mouse and touch events
    if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Calculate new position
    translateX = clientX - startX;
    translateY = clientY - startY;
    
    // Limit the range of panning
    const limit = 100 * zoomLevel;
    translateX = Math.min(Math.max(translateX, -limit), limit);
    translateY = Math.min(Math.max(translateY, -limit), limit);
    
    updateImageTransform();
    e.preventDefault();
}

// Handle drag end
function handleDragEnd() {
    isDragging = false;
}

// Handle touch start for pinch zoom and dragging
function handleTouchStart(e) {
    if (e.touches.length >= 2) {
        isMultiTouch = true;
        initialPinchDistance = getPinchDistance(e);
        e.preventDefault(); // Prevent default behavior
    } else if (e.touches.length === 1 && zoomLevel > 1) {
        // Single touch for dragging when zoomed
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        e.preventDefault();
    }
}

// Handle touch move for pinch zoom and dragging
function handleTouchMove(e) {
    if (isMultiTouch && e.touches.length >= 2) {
        // Pinch zoom logic
        const currentDistance = getPinchDistance(e);
        const pinchRatio = currentDistance / initialPinchDistance;
        
        if (pinchRatio > 1.05) { // Pinch out/zoom in
            if (zoomLevel < maxZoom) {
                zoomLevel += zoomStep;
                updateImageTransform();
                updateZoomPercentage(); // Update the displayed percentage
                initialPinchDistance = currentDistance; // Reset for smoother zooming
            }
        } else if (pinchRatio < 0.95) { // Pinch in/zoom out
            if (zoomLevel > minZoom) {
                zoomLevel -= zoomStep;
                if (zoomLevel <= 1) {
                    translateX = 0;
                    translateY = 0;
                }
                updateImageTransform();
                updateZoomPercentage(); // Update the displayed percentage
                initialPinchDistance = currentDistance; // Reset for smoother zooming
            }
        }
        
        e.preventDefault(); // Prevent default behavior like page zoom
    } else if (isDragging && e.touches.length === 1) {
        // Single touch drag logic
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        
        // Limit dragging range
        const limit = 100 * zoomLevel;
        translateX = Math.min(Math.max(translateX, -limit), limit);
        translateY = Math.min(Math.max(translateY, -limit), limit);
        
        updateImageTransform();
        e.preventDefault();
    }
}

// Handle touch end for pinch zoom and dragging
function handleTouchEnd() {
    isMultiTouch = false;
    isDragging = false;
}

// Calculate distance between two touch points
function getPinchDistance(e) {
    // Get the positions of the first two touches
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    // Calculate the distance using the Pythagorean theorem
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
}

// Close modal when clicking outside the image
const modal = document.getElementById('modal');
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Make all cards with images clickable
document.addEventListener('DOMContentLoaded', function() {
    // Get all destination cards
    const cards = document.querySelectorAll('.destination-card');
    
    // Add click event listeners if they don't have one already
    cards.forEach((card, index) => {
        if (!card.getAttribute('onclick')) {
            card.addEventListener('click', function() {
                openModal(index);
            });
            card.style.cursor = 'pointer'; // Add pointer cursor for better UX
        }
    });
});

// Mobile navbar toggle functionality
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
}

// Function to handle search when pressing "Enter"
function handleSearchKeyPress(event) {
    if (event.key === "Enter") {
        const query = document.getElementById('search-bar').value.trim().toLowerCase();
        if (query) {
            // Redirect to the results page with the query as a URL parameter
            window.location.href = `search-results.html?query=${encodeURIComponent(query)}`;
        }
    }
}

// Attach the keypress event listener to the search bar
document.getElementById('search-bar').addEventListener('keypress', handleSearchKeyPress);

// Function to toggle search bar visibility
function toggleSearchBar() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar.classList.contains('active')) {
        searchBar.classList.remove('active');
        searchBar.value = ''; // Clear the search field
    } else {
        searchBar.classList.add('active');
        searchBar.focus(); // Focus on the search field
    }
}

// Close the search bar when clicking outside
document.addEventListener('click', function (e) {
    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.querySelector('.search-icon');
    const searchContainer = document.querySelector('.search-container');

    // Ensure the search bar closes only when clicking outside the search container
    if (
        searchBar.classList.contains('active') &&
        !searchContainer.contains(e.target)
    ) {
        searchBar.classList.remove('active');
        searchBar.value = ''; // Clear the search field
    }
});

// Log for debugging
console.log('Script loaded successfully');
