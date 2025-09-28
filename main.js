// Main JavaScript for Aplii Landing Page

// Clerk removed: no initialization required

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", async function () {
  // Handle smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle smooth scroll to top for logo/home link
  const logoLinks = document.querySelectorAll(
    'a[href="/"], a[href="#top"], .logo'
  );

  logoLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up - show header
      header.style.transform = "translateY(0)";
    }

    // Add backdrop blur effect when scrolled
    if (scrollTop > 50) {
      header.style.background = "rgba(10, 10, 15, 0.95)";
    } else {
      header.style.background = "rgba(10, 10, 15, 0.9)";
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe feature cards and other elements
  const elementsToAnimate = document.querySelectorAll(
    ".feature-card, .stat-item, .cta-content"
  );

  elementsToAnimate.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });

  // Particle effect for hero background
  function createParticle() {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = Math.random() * 3 + 1 + "px";
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(${Math.random() * 100 + 155}, ${
      Math.random() * 100 + 155
    }, 255, ${Math.random() * 0.3 + 0.1})`;
    particle.style.borderRadius = "50%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = "100%";
    particle.style.pointerEvents = "none";
    particle.style.animation = `floatUp ${
      Math.random() * 10 + 10
    }s linear infinite`;

    document.querySelector(".hero-bg").appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 20000);
  }

  // Add CSS animation for floating particles
  const style = document.createElement("style");
  style.textContent = `
    @keyframes floatUp {
      to {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Create particles periodically
  setInterval(createParticle, 3010);

  // Redirect all CTA buttons to the app
  document.querySelectorAll(".cta-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "https://app.aplii.ai";
    });
  });

  // Ripple effect removed with Clerk waitlist

  // Simple analytics tracking (placeholder)
  function trackEvent(eventName, eventData = {}) {
    console.log("Event:", eventName, eventData);
    // In production, you would send this to your analytics service
  }

  // Track page load
  trackEvent("page_view", { page: "landing" });

  // Waitlist join success handling removed

  // Track feature card interactions
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      trackEvent("feature_hover", {
        feature: card.querySelector("h3").textContent,
      });
    });
  });
});

// Console branding
console.log(
  `
%c    _    ____  _     ___ ___
%c   / \\  |  _ \\| |   |_ _|_ _|
%c  / _ \\ | |_) | |    | | | |
%c / ___ \\|  __/| |___ | | | |
%c/_/   \\_\\_|   |_____|___|___|

%c🚀 The First AI Operating System
%c💬 Chat with AI • 📱 Create Apps • 🎨 Share Creations

%cInterested in joining our team? Check out our careers page!
`,
  "color: #667eea; font-weight: bold",
  "color: #667eea; font-weight: bold",
  "color: #f093fb; font-weight: bold",
  "color: #f093fb; font-weight: bold",
  "color: #4facfe; font-weight: bold",
  "color: #00f2fe; font-size: 16px; font-weight: bold",
  "color: #a0a0a0; font-size: 14px",
  "color: #ffffff; font-size: 12px"
);
