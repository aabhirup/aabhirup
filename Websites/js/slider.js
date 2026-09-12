/**
 * Bento Presentation Slide Deck Controller
 * Smooth sliding carousel with touch/mouse drag, arrow navigation,
 * pagination dots, tactile haptics, and responsive layout.
 */

document.addEventListener('DOMContentLoaded', () => {
  initPresentationSlider();
});

function initPresentationSlider() {
  const viewport = document.getElementById('slider-viewport');
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dotsContainer = document.getElementById('slider-dots');
  const indicator = document.getElementById('slide-indicator');

  if (!viewport || !track) return;

  const slides = Array.from(track.querySelectorAll('.slide-item'));
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationId = null;

  // Initialize dots if not already populated
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `dot-btn ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlidePosition(triggerSound = true) {
    track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    // Update Counter
    if (indicator) {
      indicator.textContent = `0${currentIndex + 1} / 0${totalSlides}`;
    }

    // Update Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot-btn');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Sound feedback
    if (triggerSound && window.tactileAudio) {
      window.tactileAudio.playClick(1200 + currentIndex * 150, 0.015);
    }
  }

  function goToSlide(index, triggerSound = true) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;
    updateSlidePosition(triggerSound);
  }

  // Button navigation
  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });

  // Touch & Mouse Drag / Swipe Handlers
  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = 'none';
    viewport.classList.add('grabbing');
  }

  function dragMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    const viewportWidth = viewport.offsetWidth || 300;
    const offsetPercentage = (diff / viewportWidth) * 100;
    const targetTranslate = -(currentIndex * 100) + offsetPercentage;
    track.style.transform = `translateX(${targetTranslate}%)`;
  }

  function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('grabbing');

    const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
    const diff = endX - startX;
    const threshold = 45; // min px to switch slide

    if (diff < -threshold && currentIndex < totalSlides - 1) {
      currentIndex += 1;
    } else if (diff > threshold && currentIndex > 0) {
      currentIndex -= 1;
    } else if (diff < -threshold && currentIndex === totalSlides - 1) {
      currentIndex = 0; // wrap around
    } else if (diff > threshold && currentIndex === 0) {
      currentIndex = totalSlides - 1; // wrap around
    }

    updateSlidePosition(true);
  }

  // Pointer & Touch events
  viewport.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);

  viewport.addEventListener('touchstart', dragStart, { passive: true });
  viewport.addEventListener('touchmove', dragMove, { passive: true });
  viewport.addEventListener('touchend', dragEnd);

  // Keyboard navigation when hovering or focused
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
    }
  });

  // Initial render
  renderDots();
  updateSlidePosition(false);
}
