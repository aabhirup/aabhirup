/**
 * Simple, Minimalist & Satisfying Portfolio - Main Controller
 * Mouse spotlight tracking, tactile copy feedback, magnetic buttons, and theme toggles.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpotlightEffect();
  initCopyButton();
  initThemeToggle();
  initSoundToggle();
  initMagneticButtons();
});

/* --------------------------------------------------------------------------
   Mouse-Tracking Spotlight Border Glow (Linear / Vercel Style)
   -------------------------------------------------------------------------- */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.bento-card');

  window.addEventListener('mousemove', (e) => {
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   Satisfying Copy-to-Clipboard Button
   -------------------------------------------------------------------------- */
function initCopyButton() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const originalContent = copyBtn.innerHTML;
  const email = 'aabhirup@quantum-arch.dev';

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(email).then(() => {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Copied to clipboard!</span>
      `;

      if (window.tactileAudio) window.tactileAudio.playPop();

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = originalContent;
      }, 2400);
    });
  });
}

/* --------------------------------------------------------------------------
   Minimalist Theme Toggle (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('minimal_portfolio_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon(true);
  }

  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('minimal_portfolio_theme', 'dark');
      updateThemeIcon(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('minimal_portfolio_theme', 'light');
      updateThemeIcon(true);
    }

    if (window.tactileAudio) window.tactileAudio.playClick(1000, 0.015);
  });

  function updateThemeIcon(isLight) {
    themeBtn.innerHTML = isLight
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  }
}

/* --------------------------------------------------------------------------
   Tactile Sound Toggle
   -------------------------------------------------------------------------- */
function initSoundToggle() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn || !window.tactileAudio) return;

  if (window.tactileAudio.enabled) {
    soundBtn.classList.add('active');
  }

  soundBtn.addEventListener('click', () => {
    const isEnabled = window.tactileAudio.toggle();
    soundBtn.classList.toggle('active', isEnabled);
  });
}

/* --------------------------------------------------------------------------
   Subtle Magnetic Button Hover Pull
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  const magneticEls = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-btn');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}
