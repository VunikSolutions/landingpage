import './style.scss';

// Lazy load analytics after page load
setTimeout(() => {
  import('@vercel/analytics').then(({ inject }) => {
    inject();
  });
}, 1000);

// Intersection Observer for lazy loading images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      }
    });
  });

  // Observe all images with data-src attribute
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  });
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
  const iconMenuHamburguer = document.querySelector('#iconMenu');
  const closeBtn = document.getElementById('closeBtn');
  const menu = document.getElementById('side-menu');
  const menuOverlay = document.getElementById('menuOverlay');

  // Menu functionality
  if (iconMenuHamburguer) {
    iconMenuHamburguer.addEventListener('click', () => {
      menu.classList.add('open');
      menuOverlay.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      menu.classList.remove('open');
      menuOverlay.classList.remove('active');
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', function () {
      menu.classList.remove('open');
      menuOverlay.classList.remove('active');
    });
  }

  // Event delegation for button actions
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('buttonAction') || e.target.closest('.buttonAction')) {
      e.preventDefault();
      window.open('https://wa.me/5571992432321?text=Olá!%20Quero%20Impulsionar%20Meu%20Negócio!%20', '_blank');
    }
  });
});
