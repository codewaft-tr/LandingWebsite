/* ============================================
   CODEWAFT — Main Application
   Entry point & orchestrator
   ============================================ */

import { CustomCursor } from './modules/cursor.js';
import { Loader } from './modules/loader.js';
import { Navigation } from './modules/navigation.js';
import { AnimationSystem } from './animations.js';

class App {
  constructor() {
    this.cursor = null;
    this.loader = null;
    this.nav = null;
    this.animations = null;

    this.init();
  }

  async init() {
    // Show loader
    this.loader = new Loader();
    await this.loader.start();

    // Init nav
    this.nav = new Navigation();

    // Init cursor
    this.cursor = new CustomCursor();

    // Init animations
    this.animations = new AnimationSystem();
    this.animations.init();

    // Page-specific init
    this.initPageFeatures();

    // Smooth scroll for anchor links
    this.initSmoothScroll();
  }

  initPageFeatures() {
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    // Service module mouse tracking
    const serviceModules = document.querySelectorAll('.service-module');
    serviceModules.forEach(module => {
      module.addEventListener('mousemove', (e) => {
        const rect = module.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        module.style.setProperty('--mouse-x', x + '%');
        module.style.setProperty('--mouse-y', y + '%');
      });
    });

    // Vault filter buttons
    const filterBtns = document.querySelectorAll('.vault-filter');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterProjects(btn.getAttribute('data-filter'));
      });
    });

    // Proficiency bars animation
    const profBars = document.querySelectorAll('.tech-proficiency-fill');
    if (profBars.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      profBars.forEach(bar => observer.observe(bar));
    }
  }

  handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.transmit-btn');
    const formBody = form.closest('.terminal-body');
    const successEl = document.querySelector('.form-success');
    
    // Animate button
    if (btn) {
      btn.textContent = 'Transmitting…';
      btn.disabled = true;
    }

    // Simulate submission
    setTimeout(() => {
      if (formBody) formBody.style.display = 'none';
      if (successEl) successEl.classList.add('visible');
    }, 1500);
  }

  filterProjects(filter) {
    const items = document.querySelectorAll('.vault-item');
    items.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.display = '';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => { item.style.display = 'none'; }, 300);
      }
    });
  }

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
