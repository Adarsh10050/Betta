// Initialize TailwindCSS custom configuration
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#FFA500',  // Orange color theme
        dark: '#0a0a0a',
        lightdark: '#1a1a1a',
      }
    }
  }
};

// Initialize AOS (Animate On Scroll) library
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// --- Event Listeners ---

// Mobile menu toggle
document.querySelector('.mobile-menu-button').addEventListener('click', function () {
  document.querySelector('.mobile-menu').classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-menu a').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.mobile-menu').classList.add('hidden');
  });
});

// --- Functions ---

/**
 * Toggles the visibility of service details sections.
 * @param {string} id - The ID of the service detail element to show/hide.
 * @param {HTMLElement} clickedCard - The card element that was clicked.
 */
function toggleService(id, clickedCard) {
  const section = document.getElementById(id);
  const allDetailSections = document.querySelectorAll('.service-details');
  const allCards = document.querySelectorAll('.service-card');

  // Hide all other service detail sections
  allDetailSections.forEach(s => {
    if (s.id !== id) {
      s.classList.add('hidden');
    }
  });

  // Remove active class from all cards
  allCards.forEach(card => {
    card.classList.remove('active-service');
  });

  // Toggle the clicked section and add active class to its card
  if (section.classList.contains('hidden')) {
    section.classList.remove('hidden');
    clickedCard.classList.add('active-service');
  } else {
    section.classList.add('hidden');
  }
}

function toggleService(id, card) {
  const section = document.getElementById(id);
  const isHidden = section.classList.contains("hidden");

  // Hide all service details
  document.querySelectorAll('[id$="-services"]').forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".service-card").forEach((c) => c.classList.remove("active"));

  if (isHidden) {
    section.classList.remove("hidden");
    card.classList.add("active");
  }
}

let currentlyOpenDetailsId = null;
function toggleDetails(detailsId) {
    const details = document.getElementById(detailsId);
    // Close the currently open details if it's not the same as the clicked one
    if (currentlyOpenDetailsId && currentlyOpenDetailsId !== detailsId) {
        const currentlyOpenDetails = document.getElementById(currentlyOpenDetailsId);
        currentlyOpenDetails.classList.add('hidden');
    }
    // Toggle the clicked details
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        currentlyOpenDetailsId = detailsId; // Update the currently open details ID
    } else {
        details.classList.add('hidden');
        currentlyOpenDetailsId = null; // Reset if closing the same details
    }
}
