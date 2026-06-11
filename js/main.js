/**
 * Tanmay Limje Portfolio — Main Interactions
 * Flow field, scroll reveal, nav, and interactions.
 */

(function () {
  'use strict';

  /* ---------- Flow Field Background (Odysseus-inspired) ---------- */
  function initFlowField() {
    var canvas = document.getElementById('flowfield-canvas');
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, t = 0, particles = [];
    var COLORS = ['#5fb6cc', '#9cdef2', '#e06c75'];
    var FADE = 'rgba(15, 17, 21, 0.03)';

    function n2(x, y) {
      var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    function noise(x, y) {
      var ix = Math.floor(x), iy = Math.floor(y);
      var fx = x - ix, fy = y - iy;
      var a = n2(ix, iy), b = n2(ix + 1, iy);
      var c = n2(ix, iy + 1), d = n2(ix + 1, iy + 1);
      var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!particles.length) {
        for (var i = 0; i < 400; i++) {
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            life: Math.random(),
            c: COLORS[i % COLORS.length]
          });
        }
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      requestAnimationFrame(draw);
      ctx.fillStyle = FADE;
      ctx.fillRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var ang = noise(p.x * 0.004 + t * 0.0008, p.y * 0.004 + 100) * Math.PI * 6;
        var sp = 1 + noise(p.x * 0.003, p.y * 0.003 + 50) * 1.5;
        p.x += Math.cos(ang) * sp;
        p.y += Math.sin(ang) * sp;
        p.life -= 0.001;

        if (p.life <= 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
          p.life = 1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.life * 0.35;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t++;
    }

    draw();
  }

  /* ---------- Scroll Reveal ---------- */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          } else {
            entry.target.classList.remove('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    elements.forEach(function (el, index) {
      el.style.transitionDelay = (index % 3 * 80) + 'ms';
      observer.observe(el);
    });
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- Nav Scroll Behavior ---------- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (window.scrollY > 80) {
            nav.classList.add('nav--scrolled');
          } else {
            nav.classList.remove('nav--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Stagger Cards Animation ---------- */
  function initStaggerCards() {
    var groups = document.querySelectorAll('.experience-list, .project-grid, .other-projects');

    groups.forEach(function (group) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var cards = entry.target.querySelectorAll('.experience-card, .project-card, .other-project-item');
            if (entry.isIntersecting) {
              cards.forEach(function (card, i) {
                card.style.transitionDelay = (i * 120) + 'ms';
                card.classList.add('revealed');
              });
            } else {
              cards.forEach(function (card) {
                card.style.transitionDelay = '';
                card.classList.remove('revealed');
              });
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(group);
    });
  }

  /* ---------- Tech Pill Stagger ---------- */
  function initTechStagger() {
    var container = document.querySelector('.tech-pills');
    if (!container) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var pills = entry.target.querySelectorAll('.tech-pill');
          if (entry.isIntersecting) {
            pills.forEach(function (pill, i) {
              pill.style.transitionDelay = (i * 60) + 'ms';
              pill.classList.add('revealed');
            });
          } else {
            pills.forEach(function (pill) {
              pill.style.transitionDelay = '';
              pill.classList.remove('revealed');
            });
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
  }

  /* ---------- Scroll Indicator Fade ---------- */
  function initScrollIndicator() {
    var indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', function () {
      var opacity = Math.max(0, 1 - window.scrollY / 300);
      indicator.style.opacity = opacity;
    }, { passive: true });
  }

  /* ---------- Active Nav Link Highlight ---------- */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id], .scroll-section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.remove('nav-link--active');
            });
            var activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
            if (activeLink) activeLink.classList.add('nav-link--active');
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Initialize Everything ---------- */
  function init() {
    initFlowField();
    initScrollReveal();
    initSmoothScroll();
    initNavScroll();
    initStaggerCards();
    initTechStagger();
    initScrollIndicator();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
