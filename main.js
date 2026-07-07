// Good as Gold Cafe — shared interactions

// Intro overlay (opening animation) — only on homepage
(function () {
  var intro = document.querySelector(".intro");
  if (!intro) return;
  window.addEventListener("load", function () {
    setTimeout(function () { intro.classList.add("hide"); }, 1150);
  });
  // Safety: never trap the page
  setTimeout(function () { intro.classList.add("hide"); }, 2600);
})();

// Sticky nav state
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Mobile menu
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", function () { links.classList.toggle("open"); });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { links.classList.remove("open"); });
  });
})();

// Hero rolling slides
(function () {
  var slides = document.querySelectorAll(".hero-slide");
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var i = 0;
  setInterval(function () {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 6000);
})();

// Scroll reveal
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) { e.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { io.observe(e); });
})();

// Footer year
(function () {
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
