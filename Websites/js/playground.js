/**
 * Satisfying Interactive AI / Neural Decision Sandbox
 * A live interactive 2D neural boundary playground for Aabhirup's portfolio.
 */

class NeuralPlayground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.tempSlider = document.getElementById('temp-slider');
    this.tempValueEl = document.getElementById('temp-val');
    this.regenBtn = document.getElementById('regen-btn');

    this.temperature = 1.0;
    this.points = [];
    this.probe = { x: 120, y: 110, targetX: 120, targetY: 110, isDragging: false };

    this.init();
  }

  init() {
    this.resize();
    this.generateClusters();
    this.setupListeners();
    this.render();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  generateClusters() {
    this.points = [];
    const countPerClass = 14;

    // Cluster 1 (Left / Top - Cyan)
    const c1 = { x: this.width * 0.32, y: this.height * 0.45 };
    for (let i = 0; i < countPerClass; i++) {
      this.points.push({
        x: c1.x + (Math.random() - 0.5) * 80,
        y: c1.y + (Math.random() - 0.5) * 80,
        class: 0,
        color: '#38bdf8'
      });
    }

    // Cluster 2 (Right / Bottom - Purple)
    const c2 = { x: this.width * 0.68, y: this.height * 0.55 };
    for (let i = 0; i < countPerClass; i++) {
      this.points.push({
        x: c2.x + (Math.random() - 0.5) * 80,
        y: c2.y + (Math.random() - 0.5) * 80,
        class: 1,
        color: '#c084fc'
      });
    }

    this.probe.x = this.width * 0.5;
    this.probe.y = this.height * 0.5;
    this.probe.targetX = this.probe.x;
    this.probe.targetY = this.probe.y;
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    if (this.tempSlider) {
      this.tempSlider.addEventListener('input', (e) => {
        this.temperature = parseFloat(e.target.value);
        if (this.tempValueEl) this.tempValueEl.textContent = this.temperature.toFixed(1);
        if (window.tactileAudio) window.tactileAudio.playClick(900 + this.temperature * 300, 0.008);
      });
    }

    if (this.regenBtn) {
      this.regenBtn.addEventListener('click', () => {
        this.generateClusters();
        if (window.tactileAudio) window.tactileAudio.playPop();
      });
    }

    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = getMousePos(e);
      const dist = Math.hypot(pos.x - this.probe.x, pos.y - this.probe.y);
      if (dist < 30) {
        this.probe.isDragging = true;
      } else {
        this.probe.targetX = pos.x;
        this.probe.targetY = pos.y;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.probe.isDragging) {
        const pos = getMousePos(e);
        this.probe.targetX = Math.max(10, Math.min(this.width - 10, pos.x));
        this.probe.targetY = Math.max(10, Math.min(this.height - 10, pos.y));
      }
    });

    window.addEventListener('mouseup', () => {
      this.probe.isDragging = false;
    });

    // Touch support
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.probe.targetX = touch.clientX - rect.left;
      this.probe.targetY = touch.clientY - rect.top;
    }, { passive: false });
  }

  // Softmax / Sigmoid RBF Kernel probability
  computeProbability(px, py) {
    let scoreA = 0;
    let scoreB = 0;
    const sigma = 55 * this.temperature;

    for (const pt of this.points) {
      const d2 = (px - pt.x) ** 2 + (py - pt.y) ** 2;
      const weight = Math.exp(-d2 / (2 * sigma ** 2));
      if (pt.class === 0) scoreA += weight;
      else scoreB += weight;
    }

    const total = scoreA + scoreB + 0.0001;
    return scoreA / total;
  }

  render() {
    requestAnimationFrame(() => this.render());

    // Smooth probe lerp
    this.probe.x += (this.probe.targetX - this.probe.x) * 0.2;
    this.probe.y += (this.probe.targetY - this.probe.y) * 0.2;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw subtle decision field contours
    const step = 18;
    for (let x = 0; x < this.width; x += step) {
      for (let y = 0; y < this.height; y += step) {
        const prob = this.computeProbability(x, y);
        if (Math.abs(prob - 0.5) < 0.08) {
          // Boundary point
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          this.ctx.fillRect(x, y, 2, 2);
        }
      }
    }

    // 2. Draw connections from probe to nearest points
    for (const pt of this.points) {
      const dist = Math.hypot(this.probe.x - pt.x, this.probe.y - pt.y);
      if (dist < 90) {
        const alpha = (1 - dist / 90) * 0.4;
        this.ctx.strokeStyle = pt.class === 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(192, 132, 252, ${alpha})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.probe.x, this.probe.y);
        this.ctx.lineTo(pt.x, pt.y);
        this.ctx.stroke();
      }
    }

    // 3. Draw Data Cluster Points
    for (const pt of this.points) {
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = pt.color;
      this.ctx.shadowColor = pt.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // 4. Draw Interactive Probe Node
    const probAtProbe = this.computeProbability(this.probe.x, this.probe.y);
    const probeColor = probAtProbe > 0.5 ? '#38bdf8' : '#c084fc';

    // Outer radar ring
    this.ctx.beginPath();
    this.ctx.arc(this.probe.x, this.probe.y, 14, 0, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Center dot
    this.ctx.beginPath();
    this.ctx.arc(this.probe.x, this.probe.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = probeColor;
    this.ctx.shadowColor = probeColor;
    this.ctx.shadowBlur = 10;
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Update live inference badge
    const badgeEl = document.getElementById('probe-inference-badge');
    if (badgeEl) {
      const clsName = probAtProbe > 0.5 ? 'Class A (Cyan)' : 'Class B (Purple)';
      const confidence = Math.round(Math.max(probAtProbe, 1 - probAtProbe) * 100);
      badgeEl.textContent = `${clsName}: ${confidence}% confidence`;
      badgeEl.style.color = probeColor;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.neuralPlayground = new NeuralPlayground('ai-canvas');
});
