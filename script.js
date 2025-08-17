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


// project add     ---- the food hub ----
 function toggleFoodHub() {
    const details = document.getElementById("foodHubDetails");
    const button = event.target;
    details.classList.toggle("hidden");
    button.textContent = details.classList.contains("hidden") ? "Show More" : "Show Less";
  }

  // ---- portfolio ---- 

  document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const currentDetails = this.closest(".project-card").querySelector(".details-section");
      const isHidden = currentDetails.classList.contains("hidden");

      // Hide all other detail sections
      document.querySelectorAll(".details-section").forEach(section => {
        section.classList.add("hidden");
      });

      // Reset all button text to "Show More"
      buttons.forEach(btn => btn.textContent = "Show More");

      // If the clicked section was hidden, show it and change button text
      if (isHidden) {
        currentDetails.classList.remove("hidden");
        this.textContent = "Show Less";
      }
    });
  });
});


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
let currentlyOpenDetailsId = null;

/**
 * Shows the selected service details.
 * On desktop → displays details at the bottom of the section.
 * On mobile → moves the details block right below the clicked card.
 * @param {string} serviceId - The ID of the service details section.
 * @param {HTMLElement} cardElement - The clicked service card element.
 */
function toggleService(serviceId, cardElement) {
  const isMobile = window.innerWidth <= 768; // Mobile breakpoint
  const target = document.getElementById(serviceId);

  // If clicking the same open service → just close it
  if (currentlyOpenDetailsId === serviceId) {
    target.classList.add("hidden");
    cardElement.classList.remove("active-service");
    currentlyOpenDetailsId = null;
    return;
  }


  // Always close the previously open service (if any)
  if (currentlyOpenDetailsId) {
    const prevOpen = document.getElementById(currentlyOpenDetailsId);
    if (prevOpen) prevOpen.classList.add("hidden");
    document.querySelectorAll(".service-card").forEach(card => {
      card.classList.remove("active-service");
    });
  }
   
  // Show new service details in correct position
  if (isMobile) {
    cardElement.insertAdjacentElement("afterend", target);
  } else {
    document.querySelector("#services").appendChild(target);
  }

  target.classList.remove("hidden");
  cardElement.classList.add("active-service");
  currentlyOpenDetailsId = serviceId;
}


// mobile menu section 

// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".mobile-menu-button"); // Your hamburger icon
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuButton && mobileMenu) {
    // Toggle menu on button click
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close menu when any link is clicked
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
});

function toggleDetails(id) {
  const allLists = document.querySelectorAll('#student-corner ul'); // all lists
  const current = document.getElementById(id);

  allLists.forEach(list => {
    if (list !== current) {
      // Collapse other lists
      list.style.maxHeight = null;
      list.classList.add('hidden');
    }
  });

  // Toggle clicked list
  if (current.style.maxHeight) {
    // currently open → close it
    current.style.maxHeight = null;
    setTimeout(() => current.classList.add('hidden'), 300);
  } else {
    // currently closed → open it
    current.classList.remove('hidden');
    current.style.maxHeight = current.scrollHeight + "px"; // smooth height
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const btn  = document.querySelector('.mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    function toggleMenu() {
      const willHide = !menu.classList.contains('hidden'); // currently open?
      menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', willHide ? 'false' : 'true');
      document.body.classList.toggle('overflow-hidden', !willHide); // lock scroll when open
    }

    btn.addEventListener('click', toggleMenu);

    // Optional: close menu when clicking a link or pressing Esc
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (!menu.classList.contains('hidden')) toggleMenu();
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) toggleMenu();
    });
  });

  