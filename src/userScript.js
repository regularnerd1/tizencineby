import SpatialNavigation from 'spatial-navigation-js';

// Initialize Spatial Navigation
SpatialNavigation.init();

// Define valid focusable elements on Cineby.at
SpatialNavigation.add({
  selector: 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"]), .movie-card, .poster'
});

// Make sure the spatial navigation is focused on the body first
SpatialNavigation.makeFocusable();
SpatialNavigation.focus();

// Add custom CSS to highlight focused elements for the TV
const style = document.createElement('style');
style.innerHTML = `
  /* Scale up the UI for TV viewing */
  body {
    zoom: 1.25;
  }

  /* Hide scrollbars for TV feel */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Modern sleek focus highlight (Apple TV style) */
  :focus, .sn-focused {
    outline: none !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.9) !important;
    transform: scale(1.08) !important;
    border-radius: 8px;
    transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease !important;
    z-index: 9999;
  }
  
  /* Reset transition for non-focused elements for smoothness */
  a, button, .movie-card, .poster {
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
`;
document.head.appendChild(style);

// Handle TV specific keys (like Return/Back)
window.addEventListener('keydown', function(e) {
    if (e.key === 'Return' || e.key === 'Backspace' || e.keyCode === 10009) {
        e.preventDefault();
        
        // If we are deep in navigation, go back
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Exit the app if at root
            try {
                if (typeof tizen !== 'undefined') {
                    tizen.application.getCurrentApplication().exit();
                }
            } catch (err) {
                console.error("Not running in Tizen environment", err);
            }
        }
    }
});

// Continuously attempt to focus the first element if nothing is focused (e.g. after a page load/SPA transition)
setInterval(() => {
    if (!document.activeElement || document.activeElement === document.body) {
        SpatialNavigation.focus();
    }
}, 1000);
