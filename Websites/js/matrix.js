/**
 * Cyber Matrix Digital Rain Engine
 * Generates falling digital glyphs on the matrix-canvas layer.
 */

class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.characters = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.active = false;
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -100);
    }
  }

  draw() {
    if (!this.active) return;

    // Translucent black rectangle to create trailing fade effect
    this.ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Glow effect for lead character
      if (Math.random() > 0.9) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 8;
      } else {
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      this.drops[i]++;
    }

    this.animationId = requestAnimationFrame(() => this.draw());
  }

  toggle(forceState) {
    this.active = forceState !== undefined ? forceState : !this.active;
    const btn = document.getElementById('matrix-toggle-btn');

    if (this.active) {
      this.canvas.classList.add('active');
      if (btn) btn.classList.add('active');
      if (window.cyberAudio) window.cyberAudio.playSuccess();
      if (!this.animationId) this.draw();
    } else {
      this.canvas.classList.remove('active');
      if (btn) btn.classList.remove('active');
      if (window.cyberAudio) window.cyberAudio.playGlitch();
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.active;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.matrixRain = new MatrixRain('matrix-canvas');
});
