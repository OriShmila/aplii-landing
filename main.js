// Main JavaScript for Aplii Landing Page
import { Clerk } from "@clerk/clerk-js";

/*
🚀 CLERK SETUP INSTRUCTIONS:
1. Go to https://dashboard.clerk.com and create an account
2. Create a new application
3. In your Clerk Dashboard, go to "API Keys" 
4. Copy your "Publishable key" 
5. Add it to your .env file as: VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
6. Enable "Waitlist" mode in Dashboard > User & Authentication > Restrictions
7. Under "Sign-up modes", toggle on "Waitlist"

✅ Environment variable detected! Using VITE_CLERK_PUBLISHABLE_KEY from .env
*/

// Initialize Clerk with environment variable
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validate environment variable
if (!clerkPublishableKey) {
  console.error(
    "❌ VITE_CLERK_PUBLISHABLE_KEY not found in environment variables!"
  );
  console.error(
    "Make sure you have VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx in your .env file"
  );
} else if (!clerkPublishableKey.startsWith("pk_")) {
  console.error(
    '❌ Invalid Clerk publishable key format. Key should start with "pk_test_" or "pk_live_"'
  );
} else {
  console.log(
    "✅ Clerk publishable key found:",
    clerkPublishableKey.substring(0, 20) + "..."
  );
}

const clerk = clerkPublishableKey ? new Clerk(clerkPublishableKey) : null;

// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", async function () {
  // Initialize Clerk
  if (clerk) {
    try {
      await clerk.load();
      console.log("✅ Clerk loaded successfully");
    } catch (error) {
      console.error("❌ Error loading Clerk:", error);
      console.error(
        "Check your Clerk Dashboard settings and ensure Waitlist mode is enabled"
      );
    }
  } else {
    console.error(
      "❌ Clerk not initialized due to missing or invalid publishable key"
    );
  }
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
  setInterval(createParticle, 3000);

  // Individual CTA button handlers with specific parameters
  function setupCTAButton(selector, params = {}) {
    const button = document.querySelector(selector);
    if (!button) return;

    // Hover effects
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
      this.style.boxShadow = "0 15px 35px rgba(102, 126, 234, 0.4)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-2px) scale(1)";
      this.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.3)";
    });

    // Click handler with specific parameters
    button.addEventListener("click", function (e) {
      e.preventDefault();

      // Add ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.3)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.pointerEvents = "none";

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);

      // Track event with specific parameters
      trackEvent("waitlist_opened", {
        button_text: this.textContent.trim(),
        button_source: this.dataset.source || params.source || "unknown",
        button_priority: this.dataset.priority || params.priority || "normal",
        button_action: this.dataset.action || params.action || "waitlist",
        timestamp: new Date().toISOString(),
      });

      // Open waitlist with specific parameters
      setTimeout(() => {
        if (clerk && clerk.openWaitlist) {
          const waitlistParams = {
            signInUrl: "https://app.aplii.ai",
            afterJoinWaitlistUrl:
              window.location.href +
              "?joined=true&source=" +
              (this.dataset.source || params.source),
            ...params.waitlistOptions,
          };
          clerk.openWaitlist(waitlistParams);
        } else {
          // Fallback if Clerk isn't loaded yet
          alert(
            "Join the Aplii waitlist! We'll notify you when early access is available."
          );
        }
      }, 100);
    });
  }

  // Setup each CTA button with specific parameters
  setupCTAButton('[data-source="header"]', {
    source: "header",
    priority: "high",
    waitlistOptions: {
      // Header-specific waitlist options can go here
    },
  });

  setupCTAButton('[data-source="hero"]', {
    source: "hero",
    priority: "highest",
    waitlistOptions: {
      // Hero-specific waitlist options can go here
    },
  });

  setupCTAButton('[data-source="cta-section"]', {
    source: "cta-section",
    priority: "medium",
    waitlistOptions: {
      // CTA section-specific waitlist options can go here
    },
  });

  // Add ripple animation CSS
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    .cta-button {
      position: relative;
      overflow: hidden;
    }
  `;
  document.head.appendChild(rippleStyle);

  // Simple analytics tracking (placeholder)
  function trackEvent(eventName, eventData = {}) {
    console.log("Event:", eventName, eventData);
    // In production, you would send this to your analytics service
  }

  // Track page load
  trackEvent("page_view", { page: "landing" });

  // Track successful waitlist joins (when user returns with joined=true)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("joined") === "true") {
    const source = urlParams.get("source") || "unknown";
    trackEvent("waitlist_joined", {
      timestamp: new Date().toISOString(),
      source: source,
      conversion_path: source + "_to_waitlist",
    });
    // Show success message with source info
    showWaitlistSuccessMessage(source);
  }

  // Function to show success message with source tracking
  function showWaitlistSuccessMessage(source = "unknown") {
    const successMessage = document.createElement("div");
    successMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-weight: 600;
      animation: slideInRight 0.5s ease-out;
    `;

    const sourceMessages = {
      header: "Thanks for joining from the header!",
      hero: "Welcome to the Aplii revolution!",
      "cta-section": "Excited to have you join the future!",
      unknown: "Thanks for joining the Aplii waitlist!",
    };

    successMessage.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>🎉</span>
        <span>${sourceMessages[source] || sourceMessages.unknown}</span>
      </div>
      <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 5px;">
        We'll notify you when early access is available.
      </div>
    `;

    // Add animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(successMessage);

    // Auto remove after 5 seconds
    setTimeout(() => {
      successMessage.style.animation = "slideInRight 0.5s ease-out reverse";
      setTimeout(() => successMessage.remove(), 500);
    }, 5000);
  }

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
