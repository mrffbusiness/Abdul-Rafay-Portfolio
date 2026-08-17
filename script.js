// ============================================================
// ABDUL RAFAY PORTFOLIO — shared interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.count');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
    };
    requestAnimationFrame(step);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => statObserver.observe(c));

  /* ---------- Testimonial slider ---------- */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDots = document.querySelectorAll('.testi-dot');
  let testiIndex = 0;
  let testiTimer;

  const showTesti = (i) => {
    testiCards.forEach(c => c.classList.remove('active'));
    testiDots.forEach(d => d.classList.remove('active'));
    testiCards[i].classList.add('active');
    testiDots[i].classList.add('active');
    testiIndex = i;
  };

  const nextTesti = () => showTesti((testiIndex + 1) % testiCards.length);

  const startAutoSlide = () => {
    clearInterval(testiTimer);
    testiTimer = setInterval(nextTesti, 5500);
  };

  testiDots.forEach(dot => {
    dot.addEventListener('click', () => {
      showTesti(parseInt(dot.dataset.i, 10));
      startAutoSlide();
    });
  });

  if (testiCards.length) startAutoSlide();

  /* ---------- Portfolio: staggered card reveal ---------- */
  const folioCards = document.querySelectorAll('.folio-card');
  if (folioCards.length) {
    const folioObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const visibleIndex = Array.from(folioCards)
            .filter(c => !c.classList.contains('hide'))
            .indexOf(card);
          const delay = Math.min(Math.max(visibleIndex, 0) * 90, 540);
          card.style.transitionDelay = delay + 'ms';
          card.classList.add('in-view');
          folioObserver.unobserve(card);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    folioCards.forEach(card => folioObserver.observe(card));
  }

  /* ---------- Portfolio: filter tabs ---------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterBg = document.getElementById('filterBg');
  const folioGrid = document.getElementById('folioGrid');

  const moveFilterBg = (tab) => {
    if (!filterBg || !tab) return;
    filterBg.style.width = tab.offsetWidth + 'px';
    filterBg.style.transform = `translateX(${tab.offsetLeft - 6}px)`;
  };

  if (filterTabs.length && folioGrid) {
    const initTab = document.querySelector('.filter-tab.active');
    // wait a tick so layout is ready
    requestAnimationFrame(() => moveFilterBg(initTab));
    window.addEventListener('resize', () => {
      moveFilterBg(document.querySelector('.filter-tab.active'));
    });

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        moveFilterBg(tab);

        const filter = tab.dataset.filter;
        const cards = Array.from(folioGrid.querySelectorAll('.folio-card'));

        // Fade current cards out slightly, then filter + re-reveal
        cards.forEach(card => {
          card.classList.remove('in-view');
          card.style.transitionDelay = '0ms';
        });

        setTimeout(() => {
          cards.forEach(card => {
            const match = filter === 'all' || card.dataset.cat === filter;
            card.classList.toggle('hide', !match);
          });

          const visibleCards = cards.filter(c => !c.classList.contains('hide'));
          visibleCards.forEach((card, i) => {
            const delay = Math.min(i * 80, 480);
            requestAnimationFrame(() => {
              card.style.transitionDelay = delay + 'ms';
              card.classList.add('in-view');
            });
          });
        }, 220);
      });
    });
  }

  /* ---------- Portfolio: lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox && folioGrid) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCat = document.getElementById('lightboxCat');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');

    const openLightbox = (card) => {
      lightboxImg.style.background = card.dataset.bg || 'var(--charcoal-3)';
      lightboxCat.textContent = card.dataset.catLabel || '';
      lightboxTitle.textContent = card.dataset.title || '';
      lightboxDesc.textContent = card.dataset.desc || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    folioGrid.querySelectorAll('.folio-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---------- About: timeline reveal ---------- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -80px 0px' });
    timelineItems.forEach(item => timelineObserver.observe(item));
  }

  /* ---------- About: skill meters ---------- */
  const skillRows = document.querySelectorAll('.skill-row');
  if (skillRows.length) {
    const animateSkill = (row) => {
      const fill = row.querySelector('.skill-fill');
      const countEl = row.querySelector('.skill-count');
      const target = parseFloat(fill.dataset.fill);

      fill.style.width = target + '%';

      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        countEl.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else countEl.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkill(entry.target);
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillRows.forEach(row => skillObserver.observe(row));
  }

  /* ---------- Contact form (front-end only — no backend yet) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
    });
  }

});
