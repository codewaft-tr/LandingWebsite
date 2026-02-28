/* ============================================
   CODEWAFT — Loader Module
   Boot Sequence & Init Messages
   ============================================ */

export class Loader {
  constructor() {
    this.screen = document.querySelector('.loader-screen');
    this.bar = document.querySelector('.loader-bar');
    this.status = document.querySelector('.loader-status');
    this.progress = 0;
    this.messages = [
      'Initializing Core Systems',
      'Loading Neural Framework',
      'Compiling Interface Modules',
      'Establishing Secure Connection',
      'Calibrating Display Matrix',
      'Systems Online'
    ];
  }

  async start() {
    if (!this.screen) return Promise.resolve();

    return new Promise((resolve) => {
      let step = 0;
      const totalSteps = this.messages.length;

      const interval = setInterval(() => {
        if (step < totalSteps) {
          this.progress = Math.min(((step + 1) / totalSteps) * 100, 100);
          if (this.bar) this.bar.style.width = this.progress + '%';
          if (this.status) this.status.textContent = this.messages[step] + '…';
          step++;
        } else {
          clearInterval(interval);
          if (this.status) this.status.textContent = 'Launch Ready';
          
          setTimeout(() => {
            if (this.screen) this.screen.classList.add('loaded');
            // Show boot sequence messages
            this.showBootMessages();
            setTimeout(resolve, 600);
          }, 300);
        }
      }, 350);
    });
  }

  showBootMessages() {
    const bootLines = document.querySelectorAll('.boot-line');
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, i * 200);
    });

    // Hide boot messages after a delay
    if (bootLines.length > 0) {
      setTimeout(() => {
        bootLines.forEach(line => {
          line.style.transition = 'opacity 0.5s';
          line.style.opacity = '0';
        });
      }, 4000);
    }
  }
}
