/* ================================================================
   ANIMAI KINGDOM — script.js
   AI Web Developer: Claude
   Theme: Forest Daybreak Fantasy AI

   TABLE OF CONTENTS
   ─────────────────────────────────────────────────────────────
    1.  DOMContentLoaded wrapper
    2.  Scroll Progress Bar
    3.  Sticky Navigation (transparent → solid on scroll)
    4.  Active Navigation Link Highlighting
    5.  Mobile Hamburger Menu (open / close)
    6.  Close Mobile Menu When a Nav Link Is Clicked
    7.  Companion Card Expand / Collapse
    8.  Contact Form Confirmation Message
    9.  Scroll-Triggered Fade-In Animations
   10.  Back to Top Button
   11.  Shake Animation (injected for empty form submit)
   ─────────────────────────────────────────────────────────────
================================================================ */


/* ================================================================
   1. DOMContentLoaded WRAPPER
   ─────────────────────────────────────────────────────────────
   Everything inside this function runs AFTER the browser has
   finished reading all the HTML on the page.
   This prevents errors like "Cannot read properties of null"
   that happen when JavaScript tries to find an element
   that hasn't been created yet.
================================================================ */
document.addEventListener('DOMContentLoaded', function () {


  /* ==============================================================
     2. SCROLL PROGRESS BAR
     ─────────────────────────────────────────────────────────────
     The gold bar at the very top of the page fills from left to
     right as the user scrolls down. When fully scrolled, it's 100%.
  ============================================================== */

  // Get the progress bar element from the HTML
  const progressBar = document.getElementById('scroll-progress');

  function updateProgressBar() {
    // Total scrollable distance = full page height minus viewport height
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

    // How far the user has scrolled right now
    const scrolled = window.scrollY;

    // Calculate percentage (0% at top, 100% at bottom)
    const percentage = scrollableHeight > 0 ? (scrolled / scrollableHeight) * 100 : 0;

    // Set the width of the gold bar
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  }

  // Run every time the user scrolls
  window.addEventListener('scroll', updateProgressBar);


  /* ==============================================================
     3. STICKY NAVIGATION — TRANSPARENT TO SOLID ON SCROLL
     ─────────────────────────────────────────────────────────────
     The nav starts fully transparent over the dark hero.
     After scrolling 60px, JavaScript adds the class "scrolled"
     to the header, which CSS uses to apply the solid dark background.
  ============================================================== */

  const siteHeader = document.getElementById('site-header');

  function updateNavStyle() {
    if (!siteHeader) return; // Safety check

    if (window.scrollY > 60) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  // Run on every scroll event
  window.addEventListener('scroll', updateNavStyle);

  // Run once immediately in case page loads mid-scroll (e.g. browser refresh)
  updateNavStyle();


  /* ==============================================================
     4. ACTIVE NAVIGATION LINK HIGHLIGHTING
     ─────────────────────────────────────────────────────────────
     As the user scrolls, the nav link that matches the currently
     visible section gets the CSS class "active", which triggers
     the golden underline defined in style.css.
  ============================================================== */

  // Get all sections that have an id (the ones linked in the nav)
  const sections = document.querySelectorAll('section[id]');

  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNavLink() {
    let currentSectionId = '';

    // Check each section to see if its top is at or above the current scroll position
    sections.forEach(function (section) {
      // 100px offset accounts for the sticky nav bar height
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Remove "active" from all nav links
    navLinks.forEach(function (link) {
      link.classList.remove('active');

      // Add "active" to the link whose href matches the current section
      if (link.getAttribute('href') === '#' + currentSectionId) {
        link.classList.add('active');
      }
    });
  }

  // Run on every scroll event
  window.addEventListener('scroll', highlightActiveNavLink);

  // Run once on page load to highlight the correct link immediately
  highlightActiveNavLink();


  /* ==============================================================
     5. MOBILE HAMBURGER MENU
     ─────────────────────────────────────────────────────────────
     Clicking the hamburger icon slides the nav drawer in from
     the right. Clicking the dark backdrop, or pressing Escape,
     closes it again.
  ============================================================== */

  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinksList = document.getElementById('nav-links');
  const navBackdrop  = document.getElementById('nav-backdrop');

  // ── Open the mobile menu ──
  function openMenu() {
    if (!navLinksList || !hamburgerBtn || !navBackdrop) return;

    navLinksList.classList.add('open');
    navBackdrop.classList.add('visible');
    hamburgerBtn.classList.add('open');

    // Update aria attributes so screen readers know the menu is open
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Close navigation menu');

    // Lock body scroll so the page doesn't scroll behind the open menu
    document.body.style.overflow = 'hidden';
  }

  // ── Close the mobile menu ──
  function closeMenu() {
    if (!navLinksList || !hamburgerBtn || !navBackdrop) return;

    navLinksList.classList.remove('open');
    navBackdrop.classList.remove('visible');
    hamburgerBtn.classList.remove('open');

    // Update aria attributes so screen readers know the menu is closed
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');

    // Unlock body scroll
    document.body.style.overflow = '';
  }

  // Clicking the hamburger button toggles open/closed
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      const isOpen = navLinksList.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Clicking the dark backdrop closes the menu
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMenu);
  }

  // Pressing the Escape key closes the menu (keyboard accessibility)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinksList && navLinksList.classList.contains('open')) {
      closeMenu();
      // Return keyboard focus to the hamburger button so the user isn't lost
      if (hamburgerBtn) {
        hamburgerBtn.focus();
      }
    }
  });


  /* ==============================================================
     6. CLOSE MOBILE MENU WHEN A NAV LINK IS CLICKED
     ─────────────────────────────────────────────────────────────
     On mobile, clicking a nav link scrolls to a section but
     the drawer stays open. This closes it automatically so the
     user can see the section they navigated to.
  ============================================================== */

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Only close if we're in mobile mode and the menu is open
      if (navLinksList && navLinksList.classList.contains('open')) {
        closeMenu();
      }
    });
  });


  /* ==============================================================
     7. COMPANION CARD EXPAND / COLLAPSE
     ─────────────────────────────────────────────────────────────
     Each companion card has a "Learn More" button.
     Clicking it shows or hides the hidden detail panel below.
     
     How it works:
     - The button has aria-expanded="false" and aria-controls="[panel-id]"
     - The detail panel starts with the HTML "hidden" attribute
     - JavaScript toggles both aria-expanded and the hidden attribute
     - CSS animates the panel sliding into view (slideDown keyframe)
  ============================================================== */

  // Find all "Learn More" buttons on the page
  const cardToggleButtons = document.querySelectorAll('.card-toggle');

  cardToggleButtons.forEach(function (button) {
    button.addEventListener('click', function () {

      // Get the ID of the detail panel this button controls
      const detailsId = button.getAttribute('aria-controls');
      const detailPanel = document.getElementById(detailsId);

      if (!detailPanel) return; // Safety check

      // Check the current state: "true" = open, "false" = closed
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        // ── CLOSE the panel ──
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = 'Learn More <span class="toggle-arrow" aria-hidden="true">▼</span>';
        detailPanel.hidden = true;
      } else {
        // ── OPEN the panel ──
        button.setAttribute('aria-expanded', 'true');
        button.innerHTML = 'Show Less <span class="toggle-arrow" aria-hidden="true">▼</span>';
        detailPanel.hidden = false;
      }
    });
  });


  /* ==============================================================
     8. CONTACT FORM CONFIRMATION MESSAGE
     ─────────────────────────────────────────────────────────────
     When the form is submitted:
     1. The page does NOT reload (e.preventDefault stops that)
     2. If any field is empty, the submit button shakes as a hint
     3. If all fields are filled, a green confirmation message appears
     4. The submit button changes to show success
     5. The form fields are cleared after a short delay
  ============================================================== */

  const contactForm    = document.getElementById('contact-form');
  const confirmMessage = document.getElementById('form-confirmation');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {

      // STEP 1: Stop the form from doing a real page reload/submit
      e.preventDefault();

      // STEP 2: Get the submit button (used for feedback below)
      const submitButton = contactForm.querySelector('button[type="submit"]');

      // STEP 3: Read the values from each field (trim removes extra spaces)
      const nameValue    = document.getElementById('contact-name').value.trim();
      const emailValue   = document.getElementById('contact-email').value.trim();
      const messageValue = document.getElementById('contact-message').value.trim();

      // STEP 4: Basic validation — make sure no field is empty
      if (!nameValue || !emailValue || !messageValue) {
        // Shake the button to signal something is wrong
        if (submitButton) {
          submitButton.style.animation = 'shake 0.4s ease';
          // Remove the animation after it plays so it can play again if needed
          setTimeout(function () {
            submitButton.style.animation = '';
          }, 400);
        }
        return; // Stop here — don't show the confirmation yet
      }

      // STEP 5: All fields are filled — show the confirmation message
      if (confirmMessage) {
        confirmMessage.hidden = false;
      }

      // STEP 6: Update the submit button to show success
      if (submitButton) {
        submitButton.textContent = '✅ Message Sent!';
        submitButton.disabled = true;
        submitButton.style.background = '#3F8A3E'; // Leaf Green
        submitButton.style.borderColor = '#3F8A3E';
      }

      // STEP 7: Clear the form fields after a short delay
      setTimeout(function () {
        contactForm.reset();
      }, 600);

    });
  }


  /* ==============================================================
     9. SCROLL-TRIGGERED FADE-IN ANIMATIONS
     ─────────────────────────────────────────────────────────────
     Elements with class="fade-in" start invisible (opacity: 0)
     and slightly shifted downward (translateY(20px)).
     
     IntersectionObserver watches each fade-in element. When an
     element enters the visible area of the screen (the viewport),
     this code adds the class "is-visible", which CSS uses to
     transition the element to fully visible (opacity: 1).
     
     After an element has animated in, we stop watching it
     (fadeObserver.unobserve) for better performance.

     NOTE: The hero section does NOT use fade-in. It has its own
     CSS @keyframes animation that works without JavaScript.
  ============================================================== */

  // Get all elements that should fade in on scroll
  const fadeElements = document.querySelectorAll('.fade-in');

  // Create the IntersectionObserver
  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // entry.isIntersecting is true when the element is in view
        if (entry.isIntersecting) {
          // Add the class that triggers the CSS fade-in transition
          entry.target.classList.add('is-visible');

          // Stop watching this element — it has already animated in
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,              // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -40px 0px' // Trigger slightly before the bottom of the screen
    }
  );

  // Start watching each fade-in element
  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /*
    Fallback for very old browsers that don't support IntersectionObserver:
    Make all fade-in elements immediately visible so nothing is hidden.
  */
  if (!('IntersectionObserver' in window)) {
    fadeElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ==============================================================
    10. BACK TO TOP BUTTON
     ─────────────────────────────────────────────────────────────
     A small orange circle button fixed in the bottom-right corner.
     It appears after the user scrolls 300px down.
     Clicking it smoothly scrolls back to the top.

     FIX APPLIED: The button no longer uses the HTML hidden attribute.
     Instead, CSS keeps it invisible with opacity:0 + pointer-events:none
     by default. JavaScript adds/removes the .visible class,
     which CSS transitions smoothly. This avoids the conflict between
     display:none (set by hidden) and opacity transitions.
  ============================================================== */

  const backToTopBtn = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (!backToTopBtn) return;

    if (window.scrollY > 300) {
      // Show the button
      backToTopBtn.classList.add('visible');
    } else {
      // Hide the button
      backToTopBtn.classList.remove('visible');
    }
  }

  // Check on every scroll
  window.addEventListener('scroll', updateBackToTop);

  // Check once on load in case page starts scrolled
  updateBackToTop();

  // Clicking the button scrolls smoothly to the very top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


}); // ── End of DOMContentLoaded ──


/* ================================================================
  11. SHAKE ANIMATION (CSS injection)
  ─────────────────────────────────────────────────────────────
  This creates the "shake" animation used when the contact form
  is submitted with empty fields. It is injected into the page
  as a <style> tag rather than defined in style.css because it
  is applied dynamically through JavaScript's style property
  (button.style.animation = 'shake 0.4s ease').
  
  The shake moves the button left and right quickly to signal
  to the user that something needs to be fixed.
================================================================ */
const shakeStyleTag = document.createElement('style');
shakeStyleTag.textContent = `
  @keyframes shake {
    0%,  100% { transform: translateX(0); }
    20%        { transform: translateX(-7px); }
    40%        { transform: translateX(7px); }
    60%        { transform: translateX(-4px); }
    80%        { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyleTag);
