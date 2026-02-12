(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var nav = document.querySelector("#site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var main = document.querySelector("#main");

  function setHeaderElevate() {
    if (!header) return;
    var y = window.scrollY || window.pageYOffset;
    header.setAttribute("data-elevate", y > 20 ? "true" : "false");
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.setAttribute("data-open", "true");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function toggleNav() {
    var isOpen = nav && nav.getAttribute("data-open") === "true";
    if (isOpen) closeNav();
    else openNav();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", toggleNav);
  }

  // Close mobile nav when clicking a nav link (e.g. after smooth scroll)
  if (nav) {
    nav.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 767px)").matches && e.target.closest("a")) {
        closeNav();
      }
    });
  }

  // Smooth scroll for anchor links (optional; HTML already has scroll-behavior: smooth)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute("href");
    if (href === "#" || !href) return;
    var target = document.querySelector(href);
    if (target) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // Counter animation for hero stats
  var statNumbers = document.querySelectorAll(".stat-number[data-count-to]");
  if (statNumbers.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var to = parseInt(el.getAttribute("data-count-to"), 10);
          if (isNaN(to)) return;
          var duration = 1200;
          var start = performance.now();
          var from = 0;

          function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(from + (to - from) * easeOut);
            el.textContent = value;
            if (progress < 1) requestAnimationFrame(step);
          }

          requestAnimationFrame(step);
          countObserver.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.2 }
    );
    statNumbers.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // Header shadow on scroll
  window.addEventListener("scroll", setHeaderElevate, { passive: true });
  setHeaderElevate();

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form (demo: no backend)
  var form = document.querySelector(".contact-form");
  var hint = form ? form.querySelector(".form-hint") : null;
  if (form && hint) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hint.textContent = "This is a demo. Connect a backend or use a form service to send emails.";
      hint.setAttribute("aria-live", "polite");
    });
  }
})();
