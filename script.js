/**
 * PROJECT: Minimal Dynamic Gallery
 * MODE: Hybrid Scroll Installation
 *
 * EN:
 * - Scroll defines spatial progression
 * - Observer updates UI state
 * - Background is a cinematic fixed layer
 *
 * EL:
 * - Το scroll ορίζει τον χώρο
 * - Ο observer ενημερώνει το UI
 * - Το background είναι σταθερό κινηματογραφικό layer
 */

/* ==========================================================
   DATA CONFIGURATION
   ========================================================== */

const pageData = {
  sections: [
    {
      id: "ena",
      title: "One",
      navImage: "./img/export-28.png",
      bgImage: "./img/export-28.png"
    },
    {
      id: "duo",
      title: "Two",
      navImage: "./img/yellow.jpg",
      bgImage: "./img/yellow.jpg"
    },
    {
      id: "tria",
      title: "Three",
      navImage: "./img/export-26.png",
      bgImage: "./img/export-26.png"
    },
    {
      id: "tessera",
      title: "Four",
      navImage: "./img/07.jpg",
      bgImage: "./img/07.jpg"
    }
  ]
};

/* ==========================================================
   ELEMENT CREATION
   ========================================================== */

function createNavItem(section) {
  const navItem = document.createElement("div");
  navItem.className = "nav-item";
  navItem.dataset.section = section.id;

  navItem.setAttribute("role", "button");
  navItem.setAttribute("tabindex", "0");
  navItem.setAttribute("aria-label", `Navigate to section ${section.title}`);

  const img = document.createElement("img");
  img.src = section.navImage;
  img.alt = section.title;
  img.loading = "lazy";

  const label = document.createElement("div");
  label.className = "label";
  label.textContent = section.title;

  navItem.append(img, label);
  return navItem;
}

function createSection(section) {
  const sectionEl = document.createElement("section");
  sectionEl.id = section.id;

  /* EN: Store background reference only
     EL: Αποθηκεύουμε ΜΟΝΟ αναφορά background */
  sectionEl.dataset.bg = section.bgImage;

  const heading = document.createElement("h2");
  heading.textContent = section.title;

  sectionEl.appendChild(heading);
  return sectionEl;
}

/* ==========================================================
   CINEMATIC BACKGROUND CONTROL
   ========================================================== */

const bgLayer = document.getElementById("bg-layer");
let currentBg = null;

function changeBackground(newBg) {
  if (newBg === currentBg) return;

  bgLayer.style.opacity = 0;

  setTimeout(() => {
    bgLayer.style.backgroundImage = `url('${newBg}')`;
    bgLayer.style.opacity = 1;
    currentBg = newBg;
  }, 400);
}

/* ==========================================================
   INTERSECTION OBSERVER
   ========================================================== */

function setupScrollObserver() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        /* EN: Spatial background change
           EL: Χωρική αλλαγή background */
        changeBackground(entry.target.dataset.bg);

        /* EN: UI state update only
           EL: ΜΟΝΟ ενημέρωση UI */
        navItems.forEach(item => {
          item.classList.toggle(
            "active",
            item.dataset.section === entry.target.id
          );
        });
      });
    },
    {
      threshold: 0.6
    }
  );

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================
   NAVIGATION
   ========================================================== */

function scrollToSection(id) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth" });
}

function setupNavigation() {
  const navContainer = document.getElementById("nav-container");

  navContainer.addEventListener("click", e => {
    const item = e.target.closest(".nav-item");
    if (item) scrollToSection(item.dataset.section);
  });

  navContainer.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      const item = e.target.closest(".nav-item");
      if (item) {
        e.preventDefault();
        scrollToSection(item.dataset.section);
      }
    }
  });
}

/* ==========================================================
   NAVBAR VISIBILITY (RAF)
   ========================================================== */

function setupNavbarVisibility() {
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;
  let ticking = false;

  function update() {
    const current = window.scrollY;
    navbar.classList.toggle(
      "hidden",
      current > lastScrollY && current > 100
    );
    lastScrollY = current;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================
   INITIALIZATION
   ========================================================== */

function initializePage() {
  const navContainer = document.getElementById("nav-container");
  const sectionsContainer = document.getElementById("sections-container");

  pageData.sections.forEach(section => {
    navContainer.appendChild(createNavItem(section));
    sectionsContainer.appendChild(createSection(section));
  });

  /* EN: Set initial background
     EL: Αρχικό background */
  changeBackground(pageData.sections[0].bgImage);

  setupNavigation();
  setupScrollObserver();
  setupNavbarVisibility();
}

document.addEventListener("DOMContentLoaded", initializePage);
