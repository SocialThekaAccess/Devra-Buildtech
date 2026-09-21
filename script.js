'use strict';

/* NAVBAR SCROLL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* HAMBURGER */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* HERO SLIDER */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const INTERVAL = 5000;
  let current = 0, timer;

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  startAuto();
})();

/* COLLECTION TABS */
(function () {
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  const details = Array.from(document.querySelectorAll('.tab-detail-item'));
  if (!tabs.length || !details.length) return;

  let activeTab = tabs.find(tab => tab.classList.contains('active')) || tabs[0];

  function showTab(tabName, makeActive) {
    details.forEach(item => item.classList.toggle('active', item.dataset.tabContent === tabName));
    if (makeActive) {
      tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
      activeTab = tabs.find(tab => tab.dataset.tab === tabName) || activeTab;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('mouseenter', () => {
      showTab(tab.dataset.tab, false);
    });

    tab.addEventListener('focus', () => {
      showTab(tab.dataset.tab, false);
    });

    tab.addEventListener('click', () => {
      showTab(tab.dataset.tab, true);
    });
  });

  const tabsWrap = document.querySelector('.collection-tabs');
  if (tabsWrap) {
    tabsWrap.addEventListener('mouseleave', () => {
      showTab(activeTab.dataset.tab, false);
    });
  }

  showTab(activeTab.dataset.tab, true);
})();

/* SCROLL REVEAL */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  items.forEach(item => observer.observe(item));
})();

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* MARQUEE PAUSE ON HOVER */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
  marqueeTrack.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
}

/* VISION VIDEO HOVER */
(function () {
  const media = document.querySelector('.vision-media');
  const video = document.querySelector('.vision-video');
  if (!media || !video) return;
  media.addEventListener('mouseenter', () => video.play().catch(() => {}));
  media.addEventListener('mouseleave', () => video.pause());
})();

/* HERO PARALLAX */
(function () {
  const hero   = document.querySelector('.hero');
  const slides = document.querySelectorAll('.hero-slide');
  if (!hero || !slides.length) return;
  hero.addEventListener('mousemove', e => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    slides.forEach(s => {
      s.style.transform = s.classList.contains('active')
        ? `scale(1) translate(${x * 10}px, ${y * 7}px)`
        : 'scale(1.08)';
    });
  });
  hero.addEventListener('mouseleave', () => {
    slides.forEach(s => { s.style.transform = s.classList.contains('active') ? 'scale(1)' : 'scale(1.08)'; });
  });
})();
