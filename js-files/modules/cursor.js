/* ============================================
   CODEWAFT — Custom Cursor Module
   ============================================ */

export class CustomCursor {
  constructor() {
    this.dot = null;
    this.ring = null;
    this.pos = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.isHovering = false;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!this.isTouch) {
      this.init();
    }
  }

  init() {
    // Create cursor elements
    this.dot = document.createElement('div');
    this.dot.className = 'cursor-dot';
    this.ring = document.createElement('div');
    this.ring.className = 'cursor-ring';
    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);

    // Event listeners
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    
    // Hover targets
    const hoverElements = document.querySelectorAll('a, button, .btn, .service-module, .vault-item, .team-pod, .tech-card, .nav-link, input, textarea, select');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverEnter());
      el.addEventListener('mouseleave', () => this.onHoverLeave());
    });

    // Start animation loop
    this.animate();
  }

  onMouseMove(e) {
    this.target.x = e.clientX;
    this.target.y = e.clientY;
  }

  onHoverEnter() {
    this.isHovering = true;
    document.body.classList.add('cursor-hover');
  }

  onHoverLeave() {
    this.isHovering = false;
    document.body.classList.remove('cursor-hover');
  }

  animate() {
    // Smooth interpolation
    this.pos.x += (this.target.x - this.pos.x) * 0.15;
    this.pos.y += (this.target.y - this.pos.y) * 0.15;

    if (this.dot) {
      this.dot.style.left = this.target.x + 'px';
      this.dot.style.top = this.target.y + 'px';
    }
    if (this.ring) {
      this.ring.style.left = this.pos.x + 'px';
      this.ring.style.top = this.pos.y + 'px';
    }

    requestAnimationFrame(() => this.animate());
  }

  // Refresh hover targets (call after dynamic content load)
  refresh() {
    const hoverElements = document.querySelectorAll('a, button, .btn, .service-module, .vault-item, .team-pod, .tech-card, .nav-link, input, textarea, select');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverEnter());
      el.addEventListener('mouseleave', () => this.onHoverLeave());
    });
  }
}
