/* ============================================
   CODEWAFT — Three.js Scene
   3D Hero Environment
   ============================================ */

export class ThreeScene {
  constructor(container) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.wireframe = null;
    this.innerGeo = null;
    this.particles = null;
    this.mouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.isRunning = true;

    this.init();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0xF8FAFC, 0.035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Create objects
    this.createMainStructure();
    this.createParticles();
    this.createLights();

    // Events
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('scroll', () => this.onScroll());

    // Animate
    this.animate();
  }

  createMainStructure() {
    // Main icosahedron (wireframe)
    const geo = new THREE.IcosahedronGeometry(1.5, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    this.wireframe = new THREE.Mesh(geo, mat);
    this.scene.add(this.wireframe);

    // Inner solid with glow
    const innerGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x818CF8,
      emissive: 0x6366F1,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.08,
      shininess: 100
    });
    this.innerGeo = new THREE.Mesh(innerGeo, innerMat);
    this.scene.add(this.innerGeo);

    // Outer ring
    const ringGeo = new THREE.TorusGeometry(2.2, 0.01, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6366F1,
      transparent: true,
      opacity: 0.1
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    this.ring = ring;
    this.scene.add(ring);

    // Second ring
    const ring2Geo = new THREE.TorusGeometry(2.5, 0.005, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.06
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    this.ring2 = ring2;
    this.scene.add(ring2);
  }

  createParticles() {
    const particlesGeo = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x6366F1,
      size: 0.02,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(particlesGeo, particlesMat);
    this.scene.add(this.particles);
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0xE0E7FF, 0.5);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366F1, 0.8, 10);
    pointLight1.position.set(3, 2, 3);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8B5CF6, 0.5, 10);
    pointLight2.position.set(-3, -2, 2);
    this.scene.add(pointLight2);
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  onScroll() {
    const scrollY = window.pageYOffset;
    const scrollPercent = scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    
    if (this.camera) {
      // Subtle camera movement on scroll
      this.camera.position.z = 5 - scrollPercent * 2;
      this.camera.position.y = -scrollPercent * 1;
    }
  }

  onResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // Smooth mouse follow
    this.targetRotation.x += (this.mouse.y * 0.3 - this.targetRotation.x) * 0.05;
    this.targetRotation.y += (this.mouse.x * 0.3 - this.targetRotation.y) * 0.05;

    // Main wireframe rotation
    if (this.wireframe) {
      this.wireframe.rotation.x = time * 0.1 + this.targetRotation.x;
      this.wireframe.rotation.y = time * 0.15 + this.targetRotation.y;
    }

    // Inner geometry
    if (this.innerGeo) {
      this.innerGeo.rotation.x = -time * 0.08 + this.targetRotation.x * 0.5;
      this.innerGeo.rotation.y = -time * 0.12 + this.targetRotation.y * 0.5;
      this.innerGeo.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }

    // Rings
    if (this.ring) {
      this.ring.rotation.z = time * 0.2;
    }
    if (this.ring2) {
      this.ring2.rotation.z = -time * 0.15;
    }

    // Particles subtle movement
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isRunning = false;
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
