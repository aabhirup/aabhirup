/**
 * 3D Holographic Tilt Physics & Glare Tracking
 * Provides smooth 3D mouse parallax and specular reflection effects.
 */

class HoloTilt {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
    this.maxTilt = options.maxTilt || 12; // degrees
    this.perspective = options.perspective || 1000;
    this.scale = options.scale || 1.02;
    this.speed = options.speed || 400; // transition speed in ms

    this.init();
  }

  init() {
    this.elements.forEach((el) => {
      let isHovered = false;
      let rafId = null;

      el.style.transformStyle = 'preserve-3d';

      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const tiltX = -(percentY * this.maxTilt);
        const tiltY = percentX * this.maxTilt;

        // Set CSS variables for holographic glare gradient
        el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          el.style.transform = `perspective(${this.perspective}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;
        });
      };

      const handleMouseEnter = () => {
        isHovered = true;
        el.style.transition = `transform ${this.speed * 0.3}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        if (window.cyberAudio) {
          window.cyberAudio.playBlip(750, 0.03);
        }
      };

      const handleMouseLeave = () => {
        isHovered = false;
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transition = `transform ${this.speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      };

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.holoTilt = new HoloTilt('.project-card, .matrix-card, .mission-card', {
    maxTilt: 10,
    scale: 1.015,
    speed: 350
  });
});
