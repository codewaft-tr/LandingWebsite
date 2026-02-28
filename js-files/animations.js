/* ============================================
   CODEWAFT — Animation System
   GSAP + ScrollTrigger Animations
   ============================================ */

export class AnimationSystem {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.initRevealObserver();
    this.initCounterAnimations();
    this.initMagneticButtons();
    this.initCardMouseFollow();
    this.initHeroAnimations();
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      this.initGSAPAnimations();
    }
  }

  // --- Intersection Observer for Reveals ---
  initRevealObserver() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // --- Hero Entrance Animations ---
  initHeroAnimations() {
    const heroLines = document.querySelectorAll('.hero-title .line-inner');
    const heroBadge = document.querySelector('.hero-badge');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCTA = document.querySelector('.hero-cta-group');
    const heroScroll = document.querySelector('.hero-scroll');

    // Stagger entrance
    setTimeout(() => {
      heroLines.forEach((line, i) => {
        setTimeout(() => {
          line.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
          line.style.transform = 'translateY(0)';
        }, i * 120);
      });

      if (heroBadge) {
        setTimeout(() => {
          heroBadge.style.transition = 'opacity 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          heroBadge.style.opacity = '1';
          heroBadge.style.transform = 'translateY(0)';
        }, 100);
      }

      if (heroSubtitle) {
        setTimeout(() => {
          heroSubtitle.style.transition = 'opacity 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          heroSubtitle.style.opacity = '1';
          heroSubtitle.style.transform = 'translateY(0)';
        }, 600);
      }

      if (heroCTA) {
        setTimeout(() => {
          heroCTA.style.transition = 'opacity 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          heroCTA.style.opacity = '1';
          heroCTA.style.transform = 'translateY(0)';
        }, 800);
      }

      if (heroScroll) {
        setTimeout(() => {
          heroScroll.style.transition = 'opacity 1s';
          heroScroll.style.opacity = '1';
        }, 1200);
      }
    }, 800); // Wait for loader
  }

  // --- Animated Counters ---
  initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  // --- Magnetic Buttons ---
  initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');
    
    magnetics.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  // --- Card Mouse Follow (Spotlight) ---
  initCardMouseFollow() {
    const cards = document.querySelectorAll('.service-module, .vault-item, .tech-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // --- GSAP Scroll Animations ---
  initGSAPAnimations() {
    // Page header parallax
    const pageHeaders = document.querySelectorAll('.page-header');
    pageHeaders.forEach(header => {
      gsap.to(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        y: 100,
        opacity: 0.3
      });
    });

    // Section reveal with GSAP
    const sections = document.querySelectorAll('.home-section, .services-console, .projects-vault, .team-section');
    sections.forEach(section => {
      const targets = section.querySelectorAll('.section-label, h2, h3, > p');
      gsap.fromTo(targets,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none none'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'expo.out'
        }
      );
    });

    // Marquee speed based on scroll
    const marquees = document.querySelectorAll('.marquee-track');
    marquees.forEach(track => {
      gsap.to(track, {
        scrollTrigger: {
          trigger: track.closest('.marquee') || track,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        x: -100,
        ease: 'none'
      });
    });

    // Pipeline step activation
    const pipelineSteps = document.querySelectorAll('.pipeline-step');
    pipelineSteps.forEach(step => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        onEnter: () => step.classList.add('active'),
      });
    });
  }
}
