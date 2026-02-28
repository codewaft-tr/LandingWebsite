/* ============================================
   CODEWAFT — Navigation Module
   ============================================ */

export class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.toggle = document.querySelector('.nav-toggle');
    this.mobile = document.querySelector('.nav-mobile');
    this.links = document.querySelectorAll('.nav-link');
    this.scrollProgress = document.querySelector('.scroll-progress');
    this.labPowerFill = document.querySelector('.lab-power-fill');
    this.lastScroll = 0;

    this.init();
  }

  init() {
    // Scroll handler
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Mobile toggle
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile on link click
    if (this.mobile) {
      this.mobile.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
    }

    // Set active link
    this.setActiveLink();
  }

  onScroll() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // Nav background
    if (this.nav) {
      if (scrollTop > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }

    // Scroll progress bar
    if (this.scrollProgress) {
      this.scrollProgress.style.width = scrollPercent + '%';
    }

    // Lab power indicator
    if (this.labPowerFill) {
      this.labPowerFill.style.height = scrollPercent + '%';
    }

    this.lastScroll = scrollTop;
  }

  toggleMobile() {
    if (this.toggle) this.toggle.classList.toggle('active');
    if (this.mobile) this.mobile.classList.toggle('open');
    document.body.style.overflow = this.mobile?.classList.contains('open') ? 'hidden' : '';
  }

  closeMobile() {
    if (this.toggle) this.toggle.classList.remove('active');
    if (this.mobile) this.mobile.classList.remove('open');
    document.body.style.overflow = '';
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    this.links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }
}
