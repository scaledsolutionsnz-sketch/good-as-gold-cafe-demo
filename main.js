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

// Gmail compose links (no raw address in the HTML)
(function () {
  document.querySelectorAll("a[data-gmail]").forEach(function (a) {
    var to = a.getAttribute("data-user") + "@" + a.getAttribute("data-domain");
    var su = a.getAttribute("data-su") || "";
    var body = a.getAttribute("data-body") || "";
    a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) +
             "&su=" + su + "&body=" + body;
    a.target = "_blank";
    a.rel = "noopener";
  });
})();

// Gallery masonry — balanced columns, exact heights, no cropping
(function () {
  var gal = document.querySelector(".gallery");
  if (!gal) return;
  var items = Array.prototype.slice.call(gal.querySelectorAll("figure"));
  if (!items.length) return;
  var ROW = 6;

  function reset() {
    gal.classList.remove("is-masonry");
    items.forEach(function (f) { f.style.gridColumn = ""; f.style.gridRowEnd = ""; });
  }

  // Pack tallest-first into the shortest column, then try single swaps
  // between the tallest and shortest column to even them out further.
  function assign(heights, cols, gap) {
    var order = heights.map(function (h, i) { return { i: i, h: h }; })
                       .sort(function (a, b) { return b.h - a.h; });
    var col = new Array(heights.length);
    var tot = [], bucket = [];
    for (var c = 0; c < cols; c++) { tot.push(0); bucket.push([]); }

    order.forEach(function (it) {
      var s = 0;
      for (var c = 1; c < cols; c++) if (tot[c] < tot[s]) s = c;
      col[it.i] = s;
      bucket[s].push(it.i);
      tot[s] += it.h + gap;
    });

    for (var pass = 0; pass < 12; pass++) {
      var hi = 0, lo = 0;
      for (var c = 1; c < cols; c++) {
        if (tot[c] > tot[hi]) hi = c;
        if (tot[c] < tot[lo]) lo = c;
      }
      var spread = tot[hi] - tot[lo];
      if (spread < 1 || bucket[hi].length < 2) break;
      var best = null;
      bucket[hi].forEach(function (idx) {
        var after = Math.abs((tot[hi] - heights[idx]) - (tot[lo] + heights[idx]));
        if (after < spread && (best === null || after < best.after)) best = { idx: idx, after: after };
      });
      if (!best) break;
      tot[hi] -= heights[best.idx] + gap;
      tot[lo] += heights[best.idx] + gap;
      bucket[hi].splice(bucket[hi].indexOf(best.idx), 1);
      bucket[lo].push(best.idx);
      col[best.idx] = lo;
    }
    return col;
  }

  function layout() {
    reset();
    var cs = window.getComputedStyle(gal);
    var cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
    if (cols < 2) return;                      // single column: natural flow
    var gap = parseFloat(cs.rowGap) || 0;
    var heights = items.map(function (f) { return f.getBoundingClientRect().height; });
    if (!heights.some(function (h) { return h > 1; })) return;

    var col = assign(heights, cols, gap);
    gal.classList.add("is-masonry");
    items.forEach(function (f, i) {
      f.style.gridColumn = String(col[i] + 1);
      f.style.gridRowEnd = "span " + Math.ceil(heights[i] / ROW);
    });
  }

  var t;
  function schedule() { clearTimeout(t); t = setTimeout(layout, 90); }

  layout();
  window.addEventListener("load", layout);
  window.addEventListener("resize", schedule, { passive: true });
  items.forEach(function (f) {
    var img = f.querySelector("img");
    if (img && !img.complete) img.addEventListener("load", schedule);
  });
})();
