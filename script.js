(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shrink ---------- */
  var nav = document.getElementById("nav");
  var lastScrollState = false;
  function onScrollNav() {
    var scrolled = window.scrollY > 20;
    if (scrolled !== lastScrollState) {
      nav.classList.toggle("is-scrolled", scrolled);
      lastScrollState = scrolled;
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var mobileLinks = document.querySelectorAll(".mobile-menu__link");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Smooth scroll for in-page links (with sticky nav offset) ---------- */
  var navHeight = 84;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMenu();
      history.pushState(null, "", id);
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));

  function setActiveLink() {
    var scrollPos = window.scrollY + navHeight + 40;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      var match = current && link.getAttribute("href") === "#" + current.id;
      link.classList.toggle("is-active", !!match);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      // Large sections can be taller than a mobile viewport; a low threshold
      // ensures they reveal as soon as they enter view.
      { threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Back to top button ---------- */
  var toTop = document.getElementById("toTop");
  function onScrollTop() {
    toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScrollTop, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  onScrollTop();
})();
