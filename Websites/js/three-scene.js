/**
 * Interactive Three.js 3D Quantum Holographic Scene
 * Renders an interactive 3D quantum core and responsive particle starfield.
 */

class QuantumScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container || typeof THREE === 'undefined') {
      console.warn('Three.js container or library not found. Falling back.');
      return;
    }

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.clock = new THREE.Clock();

    this.init();
    this.createStarfield();
    this.createQuantumCore();
    this.setupEvents();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.0015);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 70;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x00f0ff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2, 100);
    pointLight.position.set(20, 20, 30);
    this.scene.add(pointLight);

    const magentaLight = new THREE.PointLight(0xf000ff, 2, 100);
    magentaLight.position.set(-20, -20, 30);
    this.scene.add(magentaLight);
  }

  createStarfield() {
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorMagenta = new THREE.Color(0xf000ff);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

      let chosenColor = colorWhite;
      const rand = Math.random();
      if (rand < 0.4) chosenColor = colorCyan;
      else if (rand < 0.7) chosenColor = colorMagenta;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture / material
    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createQuantumCore() {
    this.coreGroup = new THREE.Group();

    // 1. Outer Wireframe Polyhedron
    const outerGeo = new THREE.IcosahedronGeometry(16, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    this.outerPoly = new THREE.Mesh(outerGeo, outerMat);
    this.coreGroup.add(this.outerPoly);

    // 2. Vertex glowing points
    const pointMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.2,
      blending: THREE.AdditiveBlending
    });
    const outerPoints = new THREE.Points(outerGeo, pointMat);
    this.coreGroup.add(outerPoints);

    // 3. Inner Quantum Core (Dodecahedron)
    const innerGeo = new THREE.DodecahedronGeometry(8, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xf000ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.innerPoly = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerPoly);

    // 4. Orbiting Rings
    const ringGeo1 = new THREE.TorusGeometry(22, 0.2, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    });
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = Math.PI / 3;
    this.coreGroup.add(this.ring1);

    const ringGeo2 = new THREE.TorusGeometry(26, 0.15, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.3
    });
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.y = Math.PI / 4;
    this.coreGroup.add(this.ring2);

    // Position the core towards the right side on desktop for heroic asymmetry
    this.coreGroup.position.set(24, 2, -10);
    this.scene.add(this.coreGroup);
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      // Adjust position for smaller screens
      if (window.innerWidth < 1024) {
        this.coreGroup.position.set(0, 5, -20);
      } else {
        this.coreGroup.position.set(24, 2, -10);
      }
    });

    if (window.innerWidth < 1024) {
      this.coreGroup.position.set(0, 5, -20);
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotate Particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.02;
      this.particles.rotation.x = this.mouse.y * 0.1;
      this.particles.rotation.z = this.mouse.x * 0.1;
    }

    // Rotate Quantum Core
    if (this.coreGroup) {
      this.outerPoly.rotation.x += 0.005;
      this.outerPoly.rotation.y += 0.007;

      this.innerPoly.rotation.x -= 0.009;
      this.innerPoly.rotation.y -= 0.012;

      this.ring1.rotation.z += 0.008;
      this.ring1.rotation.x += 0.004;

      this.ring2.rotation.z -= 0.006;
      this.ring2.rotation.y += 0.005;

      // React to cursor position
      this.coreGroup.rotation.y = this.mouse.x * 0.4;
      this.coreGroup.rotation.x = -this.mouse.y * 0.3;

      // Float with elapsed time
      this.coreGroup.position.y = (window.innerWidth < 1024 ? 5 : 2) + Math.sin(elapsedTime * 1.5) * 1.5;

      // Scroll response (subtly move core deeper and shift rotation)
      const scrollProgress = this.scrollY * 0.015;
      this.camera.position.y = -scrollProgress * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.quantumScene = new QuantumScene('three-canvas-container');
});
