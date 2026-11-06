'use strict';

/* REMOVE HASH FROM URL ON PAGE LOAD */
if (window.location.hash) {
  const cleanUrl = window.location.origin + window.location.pathname;
  history.replaceState(null, null, cleanUrl);
}

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

/* HERO SLIDER (FIXED: only cycles slides visible on current screen, preloads images) */
(function () {
  const allSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = document.querySelectorAll('.hero-dot');
  const mq = window.matchMedia('(max-width: 768px)');
  const INTERVAL = 5000;
  let slides = [], current = 0, timer;

  function preload(list) {
    list.forEach(s => {
      const m = s.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (m) {
        const img = new Image();
        img.src = m[1];
        if (img.decode) img.decode().catch(() => {});
      }
    });
  }

  // Use only the slides for the current screen (mobile or desktop)
  function setup() {
    const cls = mq.matches ? 'mobile-only' : 'desktop-only';
    slides = allSlides.filter(s => s.classList.contains(cls));
    if (!slides.length) return;
    allSlides.forEach(s => s.classList.remove('active'));
    current = 0;
    slides[0].classList.add('active');
    dots.forEach((d, i) => d.classList.toggle('active', i === 0));
    preload(slides);
    startAuto();
  }

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  if (mq.addEventListener) mq.addEventListener('change', setup);
  else if (mq.addListener) mq.addListener(setup);
  setup();
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

/* SMOOTH SCROLL - only for internal section links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    // Skip if it's just "#" or if link has .pg-card class (project cards)
    if (href === '#' || anchor.closest('.pg-card')) return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();

      // Remove hash from URL IMMEDIATELY before scrolling
      const cleanUrl = window.location.origin + window.location.pathname;
      history.replaceState(null, null, cleanUrl);

      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* WATCH FOR HASH CHANGES AND REMOVE THEM */
window.addEventListener('hashchange', () => {
  const cleanUrl = window.location.origin + window.location.pathname;
  history.replaceState(null, null, cleanUrl);
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

/* HERO: match slider height exactly to the stages strip (no gap) */
(function () {
  const hero   = document.querySelector('.hero');
  const stages = document.querySelector('.hero-stages');
  if (!hero || !stages) return;
  function sync() {
    hero.style.setProperty('--stages-h', stages.offsetHeight + 'px');
  }
  sync();
  window.addEventListener('load', sync);
  window.addEventListener('resize', sync);
  window.addEventListener('orientationchange', sync);
  if (window.ResizeObserver) new ResizeObserver(sync).observe(stages);
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