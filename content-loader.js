// ============================================================
// CONTENT LOADER
// Reads site data (data.js) and injects it into whichever page
// is currently loaded. Runs before script.js so that interactive
// behaviors (reveal, filters, lightbox) attach to real content.
// Also listens for cross-tab updates so edits made in the Admin
// Panel in one tab reflect instantly in a site tab left open.
// ============================================================

(function () {

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  async function renderSite() {
    const data = await arLoadData();

    // Cache the theme locally so the next page load has no flash
    try { localStorage.setItem('ar_theme_cache', data.theme); } catch (e) {}
    document.documentElement.setAttribute('data-theme', data.theme);

    applyThemeSvg(data);
    applyHero(data);
    applyStats(data);
    applyServicesTeaser(data);
    applyFeaturedWork(data);
    applyServicesPage(data);
    applyPortfolioPage(data);
    applyAwardsPage(data);
    applyAboutPage(data);
    applyContactPage(data);
    applyFooterAndGlobalLinks(data);

    // Let script.js know fresh content is in the DOM (it listens for this)
    document.dispatchEvent(new CustomEvent('ar-content-ready'));
  }

  /* ---------- Sync placeholder avatar gradient to active theme ---------- */
  function applyThemeSvg() {
    const grad = document.getElementById('avatarGrad');
    if (!grad) return;
    const styles = getComputedStyle(document.documentElement);
    const orange = styles.getPropertyValue('--orange').trim();
    const blue = styles.getPropertyValue('--blue').trim();
    const stops = grad.querySelectorAll('stop');
    if (stops[0] && orange) stops[0].setAttribute('stop-color', orange);
    if (stops[1] && blue) stops[1].setAttribute('stop-color', blue);
  }

  /* ---------- HOME: hero + profile photo ---------- */
  function applyHero(data) {
    const firstName = document.getElementById('heroFirstName');
    if (!firstName) return; // not on this page

    firstName.textContent = data.hero.firstName;
    const lastName = document.getElementById('heroLastName');
    if (lastName) lastName.textContent = data.hero.lastName;
    const role = document.getElementById('heroRole');
    if (role) role.textContent = data.hero.role;
    const tagline = document.getElementById('heroTagline');
    if (tagline) tagline.textContent = data.hero.tagline;

    if (data.images.profilePhoto) {
      const inner = document.getElementById('heroPhotoInner');
      if (inner) {
        inner.innerHTML = `<img src="${data.images.profilePhoto}" alt="${arEscapeHtml(data.hero.firstName + ' ' + data.hero.lastName)}" style="width:100%;height:100%;object-fit:cover;">`;
      }
    }
  }

  /* ---------- HOME: stats ---------- */
  function applyStats(data) {
    const inner = document.getElementById('statsInner');
    if (!inner) return;
    data.stats.forEach((stat, i) => {
      const valueEl = document.getElementById('statValue' + i);
      const suffixEl = document.getElementById('statSuffix' + i);
      const labelEl = document.getElementById('statLabel' + i);
      if (valueEl) {
        valueEl.setAttribute('data-target', stat.value);
        valueEl.setAttribute('data-decimal', stat.decimals || 0);
        valueEl.textContent = '0';
      }
      if (suffixEl) suffixEl.textContent = stat.suffix;
      if (labelEl) labelEl.textContent = stat.label;
    });
  }

  /* ---------- HOME: services teaser (mirrors Services list) ---------- */
  function applyServicesTeaser(data) {
    const grid = document.getElementById('servicesTeaserGrid');
    if (!grid) return;
    grid.innerHTML = data.services.slice(0, 4).map((svc, i) => `
      <div class="service-card reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
        <div class="service-icon">${arIconSvg(svc.icon)}</div>
        <h3 class="service-title">${arEscapeHtml(svc.title)}</h3>
        <p class="service-desc">${arEscapeHtml(svc.shortDesc || svc.desc)}</p>
      </div>
    `).join('');
  }

  /* ---------- HOME: featured work (portfolio items marked featured) ---------- */
  function applyFeaturedWork(data) {
    const grid = document.getElementById('featuredWorkGrid');
    if (!grid) return;
    const items = data.portfolio.filter(p => p.featured).slice(0, 6);
    grid.innerHTML = items.map((p, i) => {
      const bg = p.thumbImage ? `background-image:url('${p.thumbImage}');background-size:cover;background-position:center;` : `background:${p.thumbColor};`;
      return `
      <div class="work-item reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
        <div class="work-thumb" style="${bg}"></div>
        <div class="work-overlay">
          <span class="work-cat">${arEscapeHtml(AR_CATEGORY_LABELS[p.category] || p.category)}</span>
          <h3 class="work-name">${arEscapeHtml(p.title)}</h3>
        </div>
        <div class="work-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      </div>`;
    }).join('');
  }

  /* ---------- SERVICES PAGE: full pricing cards ---------- */
  function applyServicesPage(data) {
    const grid = $('.services-page-grid');
    if (!grid) return;
    grid.innerHTML = data.services.map((svc, i) => `
      <div class="pricing-card reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
        <div class="pricing-icon">${arIconSvg(svc.icon)}</div>
        <h3 class="pricing-title">${arEscapeHtml(svc.title)}</h3>
        <p class="pricing-desc">${arEscapeHtml(svc.desc)}</p>
        <div class="pricing-price">
          <span class="pricing-from">From</span>
          <span class="pricing-amount">$${arEscapeHtml(svc.price)}</span>
          <span class="pricing-unit">/ ${arEscapeHtml(svc.unit)}</span>
        </div>
      </div>
    `).join('');
  }

  /* ---------- PORTFOLIO PAGE: full project grid ---------- */
  function applyPortfolioPage(data) {
    const grid = document.getElementById('folioGrid');
    if (!grid) return;
    grid.innerHTML = data.portfolio.map(p => {
      const bg = p.thumbImage ? `url('${p.thumbImage}')` : p.thumbColor;
      const bgStyle = p.thumbImage ? `background-image:${bg};background-size:cover;background-position:center;` : `background:${bg};`;
      const catLabel = AR_CATEGORY_LABELS[p.category] || p.category;
      return `
      <article class="folio-card" data-cat="${p.category}"
        data-title="${arEscapeHtml(p.title)}"
        data-cat-label="${arEscapeHtml(catLabel)}"
        data-desc="${arEscapeHtml(p.desc)}"
        data-bg="${p.thumbImage ? p.thumbImage : p.thumbColor}">
        <div class="folio-thumb">
          <div class="folio-thumb-bg" style="${bgStyle}"></div>
          <div class="folio-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        </div>
        <div class="folio-body">
          <div class="folio-cat">${arEscapeHtml(catLabel)}</div>
          <h3 class="folio-title">${arEscapeHtml(p.title)}</h3>
          <p class="folio-desc">${arEscapeHtml(p.desc)}</p>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------- AWARDS PAGE ---------- */
  function applyAwardsPage(data) {
    const grid = $('.awards-grid');
    if (!grid) return;
    grid.innerHTML = data.awards.map((a, i) => `
      <div class="award-card reveal${i ? ' reveal-delay-' + Math.min(i, 4) : ''}">
        <div class="award-top">
          <div class="award-icon">${arIconSvg(i % 2 === 0 ? 'trophy' : 'cert')}</div>
          <span class="award-year">${arEscapeHtml(a.year)}</span>
        </div>
        <h3 class="award-name">${arEscapeHtml(a.name)}</h3>
        <div class="award-issuer">Awarded by ${arEscapeHtml(a.issuer)}</div>
        <p class="award-desc">${arEscapeHtml(a.desc)}</p>
      </div>
    `).join('');
  }

  /* ---------- ABOUT PAGE ---------- */
  function applyAboutPage(data) {
    const lead = document.getElementById('storyLead');
    if (!lead) return;
    lead.textContent = data.about.lead;
    const body1 = document.getElementById('storyBody1');
    if (body1) body1.textContent = data.about.body1;
    const body2 = document.getElementById('storyBody2');
    if (body2) body2.textContent = data.about.body2;
    const mission = document.getElementById('storyMission');
    if (mission) mission.textContent = data.about.mission;

    data.about.timeline.forEach((item, i) => {
      const m = document.getElementById('timelineMarker' + i);
      const t = document.getElementById('timelineTitle' + i);
      const d = document.getElementById('timelineDesc' + i);
      if (m) m.textContent = item.marker;
      if (t) t.textContent = item.title;
      if (d) d.textContent = item.desc;
    });

    data.about.skills.forEach((skill, i) => {
      const name = document.getElementById('skillName' + i);
      const count = document.getElementById('skillCount' + i);
      const fill = document.getElementById('skillFill' + i);
      if (name) name.textContent = skill.name;
      if (count) { count.setAttribute('data-target', skill.pct); count.textContent = '0'; }
      if (fill) fill.setAttribute('data-fill', skill.pct);
    });
  }

  /* ---------- CONTACT PAGE ---------- */
  function applyContactPage(data) {
    const invite = document.getElementById('contactInvite');
    if (!invite) return;
    invite.textContent = data.contact.invite;
    const whatsapp = document.getElementById('whatsappText');
    if (whatsapp) whatsapp.textContent = data.contact.whatsappNote;
  }

  /* ---------- GLOBAL: footer + email + social links on every page ---------- */
  function applyFooterAndGlobalLinks(data) {
    $all('.js-email-link').forEach(a => {
      a.setAttribute('href', 'mailto:' + data.contact.email);
      if (a.classList.contains('js-email-text')) a.textContent = data.contact.email;
    });
    $all('.js-social-instagram').forEach(a => {
      a.setAttribute('href', data.contact.instagram || '#');
    });
    $all('.js-social-youtube').forEach(a => {
      a.setAttribute('href', data.contact.youtube || '#');
    });
  }

  /* ---------- Run now, and re-run if the content changes in
     Supabase (e.g. admin saves something while this page is open) ---------- */
  document.addEventListener('DOMContentLoaded', renderSite);

  try {
    supabaseClient
      .channel('site_content_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_content' }, () => {
        renderSite();
      })
      .subscribe();
  } catch (e) {
    // Realtime not available — page will still show the latest content on every load/refresh
  }

})();
