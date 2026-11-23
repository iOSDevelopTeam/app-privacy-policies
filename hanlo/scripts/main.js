/**
 * Hanlo marketing site — audio preview, subtitles, units, motion.
 * ASC app id: 6837873922
 */
(function () {
  "use strict";

  /** @type {string|null} null = Coming Soon mailto fallback */
  var APP_STORE_URL = "https://apps.apple.com/app/id6837873922";

  var CONTACT_MAIL = "mailto:inkreads@163.com?subject=Hanlo%20iOS%20release%20reminder";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ——— CTA wiring ——— */
  function wireCta() {
    qsa("[data-cta]").forEach(function (el) {
      if (APP_STORE_URL) {
        el.setAttribute("href", APP_STORE_URL);
        el.removeAttribute("data-coming-soon");
        if (el.hasAttribute("data-cta-label")) {
          el.textContent = el.getAttribute("data-cta-label") || "Download on the App Store";
        }
      } else {
        var mode = el.getAttribute("data-cta") || "mail";
        if (mode === "mail") {
          el.setAttribute("href", CONTACT_MAIL);
        } else if (mode === "contact") {
          el.setAttribute("href", "#contact");
        }
      }
    });
  }

  /* ——— Single shared Audio element ——— */
  var player = new Audio();
  player.preload = "none";
  var activeBtn = null;

  function clearPlaying() {
    qsa(".is-playing, [aria-pressed='true'][data-audio]").forEach(function (el) {
      el.classList.remove("is-playing");
      if (el.hasAttribute("data-audio")) el.setAttribute("aria-pressed", "false");
    });
    activeBtn = null;
  }

  function playSrc(btn, src) {
    if (!src) return;
    if (activeBtn === btn && !player.paused) {
      player.pause();
      clearPlaying();
      return;
    }
    clearPlaying();
    activeBtn = btn;
    btn.classList.add("is-playing");
    btn.setAttribute("aria-pressed", "true");
    player.src = src;
    var p = player.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        clearPlaying();
      });
    }
  }

  player.addEventListener("ended", clearPlaying);
  player.addEventListener("pause", function () {
    if (player.ended || player.currentTime === 0) return;
  });

  function wireAudio() {
    qsa("[data-audio]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        playSrc(btn, btn.getAttribute("data-audio"));
      });
    });
  }

  /* ——— Dialogue subtitle density ——— */
  function wireSubtitles() {
    var root = qs("[data-dialogue]");
    if (!root) return;
    var chips = qsa("[data-sub]", root);
    var lines = qsa(".dialogue-line", root);
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var mode = chip.getAttribute("data-sub");
        chips.forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        lines.forEach(function (line) {
          line.setAttribute("data-mode", mode);
        });
      });
    });
  }

  /* ——— Curriculum accordion ——— */
  function wireUnits() {
    qsa(".unit").forEach(function (unit) {
      var toggle = qs(".unit__toggle", unit);
      var body = qs(".unit__body", unit);
      if (!toggle || !body) return;
      var open = unit.hasAttribute("open");
      body.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.addEventListener("click", function () {
        var next = !unit.hasAttribute("open");
        if (next) unit.setAttribute("open", "");
        else unit.removeAttribute("open");
        body.hidden = !next;
        toggle.setAttribute("aria-expanded", next ? "true" : "false");
      });
    });
  }

  /* ——— Reveal on scroll ——— */
  function wireReveal() {
    var nodes = qsa(".reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireCta();
    wireAudio();
    wireSubtitles();
    wireUnits();
    wireReveal();
  });
})();
