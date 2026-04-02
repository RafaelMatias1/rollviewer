// ================================
// Init Lucide icons
// ================================
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ================================
// Mobile Menu Toggle — smooth slide
// ================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  menuToggle.setAttribute(
    'aria-expanded',
    mobileMenu.classList.contains('open') ? 'true' : 'false'
  );
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// ================================
// Navbar scroll effect
// ================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(10, 11, 14, 0.97)';
    navbar.style.boxShadow = '0 1px 0 rgba(255,255,255,0.06)';
  } else {
    navbar.style.background = 'rgba(10, 11, 14, 0.85)';
    navbar.style.boxShadow = 'none';
  }
}, { passive: true });

// ================================
// Hero Particles
// ================================
(function spawnParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 4 + 2; // 2–6px
    const left = Math.random() * 100;
    const bottom = Math.random() * 50;
    const duration = Math.random() * 10 + 8; // 8–18s
    const delay = Math.random() * 12;
    const maxOpacity = (Math.random() * 0.2 + 0.08).toFixed(2);

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: ${bottom}%;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --max-opacity: ${maxOpacity};
    `;
    container.appendChild(p);
  }
})();

// ================================
// Scroll Reveal System
// ================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after first reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

// Auto-add reveal class to grid children with stagger
function setupStaggerGrid(selector, animClass = 'reveal') {
  const grids = document.querySelectorAll(selector);
  grids.forEach(grid => {
    grid.classList.add('stagger');
    grid.querySelectorAll(':scope > *').forEach(child => {
      child.classList.add(animClass);
      revealObserver.observe(child);
    });
  });
}

// Apply reveal to explicit .reveal / .reveal-* / .fade-in elements
document.querySelectorAll(
  '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .fade-in'
).forEach(el => revealObserver.observe(el));

// Auto-stagger grids
setupStaggerGrid('.features-grid', 'reveal-scale');
setupStaggerGrid('.pricing-grid', 'reveal-up');
setupStaggerGrid('.platform-grid', 'reveal-up');
setupStaggerGrid('.for-who-list', 'reveal-up');
setupStaggerGrid('.steps-grid', 'reveal-scale');
setupStaggerGrid('.contact-links', 'reveal-up');

// ================================
// Animated number counters (hero stats)
// ================================
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
})();

// ================================
// Parallax subtle effect on hero bg grid
// ================================
(function initParallax() {
  const grid = document.querySelector('.hero-bg-grid');
  if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      grid.style.transform = `translateY(${y * 0.25}px)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

// ================================
// Carousel (only runs if carousel track exists in DOM)
// ================================
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  if (total <= 1) {
    // Single slide — hide controls
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (dotsContainer) dotsContainer.style.display = 'none';
    return;
  }

  let current = 0;
  let autoplayTimer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  // Swipe / drag support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    track.style.transform = `translateX(calc(-${current * 100}% + ${diff}px))`;
  });

  window.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const diff = e.clientX - startX;
    if (diff < -60) goTo(current + 1);
    else if (diff > 60) goTo(current - 1);
    else goTo(current);
    resetAutoplay();
  });

  // Autoplay every 4s
  function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(current + 1), 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Pause on hover
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', () => startAutoplay());

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
  });

  // Re-init lucide for carousel buttons after DOM is ready
  if (typeof lucide !== 'undefined') lucide.createIcons();

  startAutoplay();
})();
