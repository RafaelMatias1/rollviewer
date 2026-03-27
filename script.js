// ================================
// Init Lucide icons
// ================================
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ================================
// Mobile Menu Toggle
// ================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ================================
// Navbar scroll effect
// ================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(10, 11, 14, 0.97)';
  } else {
    navbar.style.background = 'rgba(10, 11, 14, 0.85)';
  }
});

// ================================
// Scroll fade-in animation
// ================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

// Apply to cards and sections
const animatables = document.querySelectorAll(
  '.feature-card, .pricing-card, .portfolio-card, .step, .for-who-list li, .security-list li, .contact-link'
);

animatables.forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 5) * 80}ms`;
  observer.observe(el);
});

// ================================
// Smooth hover on mock buttons (kept for potential future use)
// ================================

// ================================
// Carousel
// ================================
(function () {
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
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
