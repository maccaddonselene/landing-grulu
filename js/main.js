/* ============================================================
   GRULU · main.js — Animaciones e interacciones
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 0. AÑO DEL FOOTER: se actualiza automáticamente ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- 1. NAVBAR: cambio de estilo y logo al hacer scroll --- */
  const navbar = document.getElementById('navbar');
  const navLogo = document.getElementById('navLogo');

  const handleNavbarScroll = () => {
    if (navbar.classList.contains('navbar-solid')) return;
    
    if (window.scrollY > 60) {
      if (!navbar.classList.contains('scrolled')) {
        navbar.classList.add('scrolled');
        if (navLogo) navLogo.src = 'assets/logo-grulu-dark.jpg';
      }
    } else {
      if (navbar.classList.contains('scrolled')) {
        navbar.classList.remove('scrolled');
        if (navLogo) navLogo.src = 'assets/logo-grulu-principal.png';
      }
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // comprobar estado inicial


  /* ---- 2. HERO: animación de tagline línea por línea --------- */
  // Disparamos las líneas del hero tras un pequeño delay inicial
  setTimeout(() => {
    const lineasHero = document.querySelectorAll('.linea-hero');
    lineasHero.forEach(linea => linea.classList.add('visible'));

    const heroDesc = document.querySelector('.hero-desc');
    const heroLema = document.querySelector('.hero-lema');
    if (heroDesc) heroDesc.classList.add('visible');
    if (heroLema) heroLema.classList.add('visible');
  }, 200);


  /* ---- 3. INTERSECTION OBSERVER: animaciones on-scroll ------- */
  const isMobile = window.innerWidth < 900;

  // Elementos generales (fade-up, fade-left, etc.)
  const animTargets = document.querySelectorAll(
    '.fade-up, .fade-left, .fade-right, .fade-in, .scale-in, .linea-dorada'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: isMobile ? 0.05 : 0.12,
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -60px 0px'
  });

  animTargets.forEach(el => observer.observe(el));

  // Tarjetas de actividades — stagger manual por índice
  const actCards = document.querySelectorAll('.actividad-card');
  const actObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.stagger || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        actObserver.unobserve(el);
      }
    });
  }, {
    threshold: isMobile ? 0.04 : 0.1,
    rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -40px 0px'
  });

  actCards.forEach((card, i) => {
    card.dataset.stagger = i * 120; // 120ms entre cada tarjeta
    actObserver.observe(card);
  });

  // Tarjetas de valores — stagger manual por índice
  const valorItems = document.querySelectorAll('.valor-item');
  const valorObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.stagger || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        valorObserver.unobserve(el);
      }
    });
  }, {
    threshold: isMobile ? 0.05 : 0.1,
    rootMargin: isMobile ? '0px 0px -10px 0px' : '0px 0px -40px 0px'
  });

  valorItems.forEach((item, i) => {
    item.dataset.stagger = i * 100; // 100ms entre cada valor
    valorObserver.observe(item);
  });


  /* ---- 4. HAMBURGER + MOBILE MENU --------------------------- */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileLinks  = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  const toggleMenu = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      toggleMenu(!isOpen);
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });


  /* ---- 5. SMOOTH SCROLL para anclas internas ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ---- 6. ACTIVE NAV LINK según sección visible ------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => activeSectionObserver.observe(sec));


  /* ---- 7. PARALLAX MUY SUTIL en imagen hero (solo desktop) --- */
  const heroBgImg = document.querySelector('.hero-bg-img');

  if (heroBgImg && !isMobile) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBgImg.style.transform = `translateY(${scrolled * 0.18}px)`;
    }, { passive: true });
  }


  /* ---- 8. HOVER: tarjetas actividades — cursor personalizado  */
  // (mantenemos el cursor default del sistema — elegant y limpio)

}); // end DOMContentLoaded
