// ============================================================
// ADMIN DASHBOARD LOGIC
// ============================================================

(function () {

  /* ---------- Auth guard ---------- */
  if (sessionStorage.getItem('ar_admin_session') !== 'true') {
    window.location.href = 'login.html';
    return;
  }

  let siteData = arLoadData();

  function persist() {
    arSaveData(siteData);
    renderOverview(); // keep summary/storage meter fresh
  }

  function toast(msg) {
    const el = document.getElementById('adminToast');
    const text = document.getElementById('adminToastText');
    text.textContent = msg || 'Saved';
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- Sidebar navigation ---------- */
  const navBtns = document.querySelectorAll('.admin-nav-btn');
  const panels = document.querySelectorAll('.admin-panel');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.panel;
      panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + target));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('ar_admin_session');
    window.location.href = 'login.html';
  });

  /* ============================================================
     OVERVIEW
     ============================================================ */
  function renderOverview() {
    const statsWrap = document.getElementById('overviewStats');
    const items = [
      { label: 'Services', value: siteData.services.length },
      { label: 'Portfolio Projects', value: siteData.portfolio.length },
      { label: 'Awards', value: siteData.awards.length },
      { label: 'Featured on Home', value: siteData.portfolio.filter(p => p.featured).length }
    ];
    statsWrap.innerHTML = items.map(i => `
      <div style="background:var(--charcoal-1); border:1px solid var(--line); border-radius:10px; padding:14px 16px;">
        <div style="font-family:var(--font-display); font-size:24px;">${i.value}</div>
        <div style="font-family:var(--font-mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-mute); margin-top:4px;">${i.label}</div>
      </div>
    `).join('');

    // Storage usage
    let bytes = 0;
    try {
      const raw = localStorage.getItem(AR_DATA_KEY) || '';
      bytes = new Blob([raw]).size;
    } catch (e) {}
    const approxLimit = 5 * 1024 * 1024; // most browsers allow ~5MB per origin
    const pct = Math.min(100, Math.round((bytes / approxLimit) * 100));
    document.getElementById('storageMeterFill').style.width = pct + '%';
    document.getElementById('storageMeterLabel').textContent =
      (bytes / 1024).toFixed(0) + ' KB used of an approximate ' + (approxLimit / 1024 / 1024) + ' MB browser limit';

    // Current theme
    const theme = AR_THEMES.find(t => t.key === siteData.theme) || AR_THEMES[0];
    document.getElementById('overviewTheme').innerHTML = `
      <div style="display:flex; gap:4px;">
        ${theme.swatch.map(c => `<span style="width:22px;height:22px;border-radius:50%;background:${c};border:1px solid rgba(255,255,255,.15);display:inline-block;"></span>`).join('')}
      </div>
      <span style="font-weight:700; font-size:14px;">${theme.name}</span>
    `;
  }

  /* ============================================================
     HOME PAGE
     ============================================================ */
  function renderHome() {
    document.getElementById('hFirstName').value = siteData.hero.firstName;
    document.getElementById('hLastName').value = siteData.hero.lastName;
    document.getElementById('hRole').value = siteData.hero.role;
    document.getElementById('hTagline').value = siteData.hero.tagline;

    const preview = document.getElementById('profilePhotoPreview');
    if (siteData.images.profilePhoto) {
      preview.style.background = `url('${siteData.images.profilePhoto}') center/cover`;
    } else {
      preview.style.background = 'linear-gradient(150deg,#ff6a2b,#2e8fff)';
    }

    const statsWrap = document.getElementById('statsFields');
    statsWrap.innerHTML = siteData.stats.map((s, i) => `
      <div class="admin-row-3" style="margin-bottom:14px; align-items:end;">
        <div class="admin-field" style="margin-bottom:0;">
          <label>Label</label>
          <input type="text" class="stat-label-input" data-i="${i}" value="${arEscapeHtml(s.label)}">
        </div>
        <div class="admin-field" style="margin-bottom:0;">
          <label>Value</label>
          <input type="text" class="stat-value-input" data-i="${i}" value="${arEscapeHtml(s.value)}">
        </div>
        <div class="admin-field" style="margin-bottom:0;">
          <label>Suffix</label>
          <input type="text" class="stat-suffix-input" data-i="${i}" value="${arEscapeHtml(s.suffix)}">
        </div>
      </div>
    `).join('');
  }

  document.getElementById('profilePhotoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await arResizeImageFile(file, 900, 0.85);
      siteData.images.profilePhoto = dataUrl;
      persist();
      renderHome();
      toast('Profile photo updated');
    } catch (err) {
      toast('Could not read that image');
    }
  });

  document.getElementById('removeProfilePhotoBtn').addEventListener('click', () => {
    siteData.images.profilePhoto = null;
    persist();
    renderHome();
    toast('Profile photo removed');
  });

  document.getElementById('saveHomeBtn').addEventListener('click', () => {
    siteData.hero.firstName = document.getElementById('hFirstName').value.trim() || 'Abdul';
    siteData.hero.lastName = document.getElementById('hLastName').value.trim() || 'Rafay';
    siteData.hero.role = document.getElementById('hRole').value.trim();
    siteData.hero.tagline = document.getElementById('hTagline').value.trim();

    document.querySelectorAll('.stat-label-input').forEach(input => {
      const i = parseInt(input.dataset.i, 10);
      siteData.stats[i].label = input.value.trim();
    });
    document.querySelectorAll('.stat-value-input').forEach(input => {
      const i = parseInt(input.dataset.i, 10);
      const val = parseFloat(input.value);
      siteData.stats[i].value = isNaN(val) ? 0 : val;
      siteData.stats[i].decimals = (input.value.includes('.')) ? (input.value.split('.')[1] || '').length : 0;
    });
    document.querySelectorAll('.stat-suffix-input').forEach(input => {
      const i = parseInt(input.dataset.i, 10);
      siteData.stats[i].suffix = input.value;
    });

    persist();
    toast('Home page saved');
  });

  /* ============================================================
     ABOUT PAGE
     ============================================================ */
  function renderAbout() {
    document.getElementById('aLead').value = siteData.about.lead;
    document.getElementById('aBody1').value = siteData.about.body1;
    document.getElementById('aBody2').value = siteData.about.body2;
    document.getElementById('aMission').value = siteData.about.mission;

    const tWrap = document.getElementById('timelineFields');
    tWrap.innerHTML = siteData.about.timeline.map((t, i) => `
      <div class="admin-item">
        <div class="admin-item-head"><span class="admin-item-tag">Milestone ${i + 1}</span></div>
        <div class="admin-row" style="margin-bottom:14px;">
          <div class="admin-field" style="margin-bottom:0;">
            <label>Marker (e.g. "Year 1")</label>
            <input type="text" class="tl-marker" data-i="${i}" value="${arEscapeHtml(t.marker)}">
          </div>
          <div class="admin-field" style="margin-bottom:0;">
            <label>Title</label>
            <input type="text" class="tl-title" data-i="${i}" value="${arEscapeHtml(t.title)}">
          </div>
        </div>
        <div class="admin-field" style="margin-bottom:0;">
          <label>Description</label>
          <textarea class="tl-desc" data-i="${i}">${arEscapeHtml(t.desc)}</textarea>
        </div>
      </div>
    `).join('');

    const sWrap = document.getElementById('skillFieldsAdmin');
    sWrap.innerHTML = siteData.about.skills.map((s, i) => `
      <div class="admin-row" style="margin-bottom:14px; align-items:end;">
        <div class="admin-field" style="margin-bottom:0;">
          <label>Skill Name</label>
          <input type="text" class="sk-name" data-i="${i}" value="${arEscapeHtml(s.name)}">
        </div>
        <div class="admin-field" style="margin-bottom:0;">
          <label>Percentage (0–100)</label>
          <input type="number" min="0" max="100" class="sk-pct" data-i="${i}" value="${arEscapeHtml(s.pct)}">
        </div>
      </div>
    `).join('');
  }

  document.getElementById('saveAboutBtn').addEventListener('click', () => {
    siteData.about.lead = document.getElementById('aLead').value.trim();
    siteData.about.body1 = document.getElementById('aBody1').value.trim();
    siteData.about.body2 = document.getElementById('aBody2').value.trim();
    siteData.about.mission = document.getElementById('aMission').value.trim();

    document.querySelectorAll('.tl-marker').forEach(input => {
      siteData.about.timeline[parseInt(input.dataset.i, 10)].marker = input.value.trim();
    });
    document.querySelectorAll('.tl-title').forEach(input => {
      siteData.about.timeline[parseInt(input.dataset.i, 10)].title = input.value.trim();
    });
    document.querySelectorAll('.tl-desc').forEach(input => {
      siteData.about.timeline[parseInt(input.dataset.i, 10)].desc = input.value.trim();
    });
    document.querySelectorAll('.sk-name').forEach(input => {
      siteData.about.skills[parseInt(input.dataset.i, 10)].name = input.value.trim();
    });
    document.querySelectorAll('.sk-pct').forEach(input => {
      const v = parseInt(input.value, 10);
      siteData.about.skills[parseInt(input.dataset.i, 10)].pct = isNaN(v) ? 0 : Math.max(0, Math.min(100, v));
    });

    persist();
    toast('About page saved');
  });

  /* ============================================================
     SERVICES (CRUD)
     ============================================================ */
  const ICON_OPTIONS = ['video', 'reel', 'color', 'thumb', 'mic', 'motion', 'doc', 'camera'];

  function renderServices() {
    const wrap = document.getElementById('servicesList');
    wrap.innerHTML = siteData.services.map((svc) => `
      <div class="admin-item" data-id="${svc.id}">
        <div class="admin-item-head">
          <span class="admin-item-tag">Service</span>
          <button class="admin-btn admin-btn-danger admin-btn-sm svc-delete" data-id="${svc.id}" type="button">Delete</button>
        </div>
        <div class="admin-row" style="margin-bottom:14px;">
          <div class="admin-field" style="margin-bottom:0;">
            <label>Title</label>
            <input type="text" class="svc-title" value="${arEscapeHtml(svc.title)}">
          </div>
          <div class="admin-field" style="margin-bottom:0;">
            <label>Icon</label>
            <select class="svc-icon">
              ${ICON_OPTIONS.map(ic => `<option value="${ic}" ${ic === svc.icon ? 'selected' : ''}>${ic}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="admin-field">
          <label>Full Description (Services page)</label>
          <textarea class="svc-desc">${arEscapeHtml(svc.desc)}</textarea>
        </div>
        <div class="admin-field">
          <label>Short Description (Home page preview)</label>
          <input type="text" class="svc-shortdesc" value="${arEscapeHtml(svc.shortDesc)}">
        </div>
        <div class="admin-row-3">
          <div class="admin-field" style="margin-bottom:0;">
            <label>Starting Price ($)</label>
            <input type="number" min="0" step="1" class="svc-price" value="${arEscapeHtml(svc.price)}">
          </div>
          <div class="admin-field" style="margin-bottom:0;">
            <label>Unit</label>
            <input type="text" class="svc-unit" value="${arEscapeHtml(svc.unit)}" placeholder="video / reel / month">
          </div>
        </div>
      </div>
    `).join('');

    wrap.querySelectorAll('.svc-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this service? This cannot be undone.')) return;
        siteData.services = siteData.services.filter(s => s.id !== btn.dataset.id);
        persist();
        renderServices();
        toast('Service deleted');
      });
    });
  }

  document.getElementById('addServiceBtn').addEventListener('click', () => {
    siteData.services.push({
      id: arGenId('svc'), icon: 'video', title: 'New Service', desc: 'Describe what this service includes.',
      shortDesc: 'A short one-line description.', price: 0, unit: 'project'
    });
    persist();
    renderServices();
    toast('Service added — edit the details below, then Save');
  });

  document.getElementById('saveServicesBtn').addEventListener('click', () => {
    const items = document.querySelectorAll('#servicesList .admin-item');
    items.forEach(item => {
      const id = item.dataset.id;
      const svc = siteData.services.find(s => s.id === id);
      if (!svc) return;
      svc.title = item.querySelector('.svc-title').value.trim();
      svc.icon = item.querySelector('.svc-icon').value;
      svc.desc = item.querySelector('.svc-desc').value.trim();
      svc.shortDesc = item.querySelector('.svc-shortdesc').value.trim();
      const price = parseFloat(item.querySelector('.svc-price').value);
      svc.price = isNaN(price) ? 0 : price;
      svc.unit = item.querySelector('.svc-unit').value.trim() || 'project';
    });
    persist();
    toast('Services saved');
  });

  /* ============================================================
     PORTFOLIO (CRUD + image upload)
     ============================================================ */
  function renderPortfolio() {
    const wrap = document.getElementById('portfolioList');
    wrap.innerHTML = siteData.portfolio.map((p) => {
      const bg = p.thumbImage ? `url('${p.thumbImage}') center/cover` : p.thumbColor;
      return `
      <div class="admin-item" data-id="${p.id}">
        <div class="admin-item-head">
          <span class="admin-item-tag">Project</span>
          <button class="admin-btn admin-btn-danger admin-btn-sm pf-delete" data-id="${p.id}" type="button">Delete</button>
        </div>
        <div class="admin-item-thumb-row">
          <div class="admin-thumb-preview pf-thumb-preview" style="background:${bg};"></div>
          <label class="admin-upload-btn">
            Upload Thumbnail
            <input type="file" accept="image/*" class="pf-thumb-input" data-id="${p.id}">
          </label>
          <button class="admin-btn admin-btn-outline admin-btn-sm pf-thumb-remove" data-id="${p.id}" type="button">Remove Image</button>
        </div>
        <div class="admin-row" style="margin-bottom:14px;">
          <div class="admin-field" style="margin-bottom:0;">
            <label>Title</label>
            <input type="text" class="pf-title" value="${arEscapeHtml(p.title)}">
          </div>
          <div class="admin-field" style="margin-bottom:0;">
            <label>Category</label>
            <select class="pf-category">
              <option value="longform" ${p.category === 'longform' ? 'selected' : ''}>YouTube Long-Form</option>
              <option value="shortform" ${p.category === 'shortform' ? 'selected' : ''}>Short-Form Reels</option>
              <option value="color" ${p.category === 'color' ? 'selected' : ''}>Color Grading &amp; Sound Design</option>
            </select>
          </div>
        </div>
        <div class="admin-field">
          <label>Description</label>
          <textarea class="pf-desc">${arEscapeHtml(p.desc)}</textarea>
        </div>
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-dim); cursor:pointer;">
          <input type="checkbox" class="pf-featured" ${p.featured ? 'checked' : ''} style="width:16px; height:16px;">
          Show in Home page's Featured Work section
        </label>
      </div>`;
    }).join('');

    wrap.querySelectorAll('.pf-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this project? This cannot be undone.')) return;
        siteData.portfolio = siteData.portfolio.filter(p => p.id !== btn.dataset.id);
        persist();
        renderPortfolio();
        toast('Project deleted');
      });
    });

    wrap.querySelectorAll('.pf-thumb-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const dataUrl = await arResizeImageFile(file, 1000, 0.82);
          const p = siteData.portfolio.find(x => x.id === input.dataset.id);
          if (p) { p.thumbImage = dataUrl; persist(); renderPortfolio(); toast('Thumbnail updated'); }
        } catch (err) {
          toast('Could not read that image');
        }
      });
    });

    wrap.querySelectorAll('.pf-thumb-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = siteData.portfolio.find(x => x.id === btn.dataset.id);
        if (p) { p.thumbImage = null; persist(); renderPortfolio(); toast('Thumbnail image removed'); }
      });
    });
  }

  document.getElementById('addPortfolioBtn').addEventListener('click', () => {
    const colors = ['linear-gradient(150deg,#ff6a2b,#3a1a10)', 'linear-gradient(150deg,#2e8fff,#0f2440)', 'linear-gradient(150deg,#ff9248,#2a1206)', 'linear-gradient(150deg,#6db4ff,#0a1b30)'];
    siteData.portfolio.push({
      id: arGenId('p'), title: 'New Project', category: 'longform',
      desc: 'Describe this project and what you did on it.',
      thumbColor: colors[Math.floor(Math.random() * colors.length)],
      thumbImage: null, featured: false
    });
    persist();
    renderPortfolio();
    toast('Project added — edit the details below, then Save');
  });

  document.getElementById('savePortfolioBtn').addEventListener('click', () => {
    const items = document.querySelectorAll('#portfolioList .admin-item');
    items.forEach(item => {
      const id = item.dataset.id;
      const p = siteData.portfolio.find(x => x.id === id);
      if (!p) return;
      p.title = item.querySelector('.pf-title').value.trim();
      p.category = item.querySelector('.pf-category').value;
      p.desc = item.querySelector('.pf-desc').value.trim();
      p.featured = item.querySelector('.pf-featured').checked;
    });
    persist();
    toast('Portfolio saved');
  });

  /* ============================================================
     AWARDS (CRUD)
     ============================================================ */
  function renderAwards() {
    const wrap = document.getElementById('awardsList');
    wrap.innerHTML = siteData.awards.map((a) => `
      <div class="admin-item" data-id="${a.id}">
        <div class="admin-item-head">
          <span class="admin-item-tag">Award</span>
          <button class="admin-btn admin-btn-danger admin-btn-sm aw-delete" data-id="${a.id}" type="button">Delete</button>
        </div>
        <div class="admin-row" style="margin-bottom:14px;">
          <div class="admin-field" style="margin-bottom:0;">
            <label>Award Name</label>
            <input type="text" class="aw-name" value="${arEscapeHtml(a.name)}">
          </div>
          <div class="admin-field" style="margin-bottom:0;">
            <label>Year</label>
            <input type="text" class="aw-year" value="${arEscapeHtml(a.year)}">
          </div>
        </div>
        <div class="admin-field">
          <label>Issued By</label>
          <input type="text" class="aw-issuer" value="${arEscapeHtml(a.issuer)}">
        </div>
        <div class="admin-field" style="margin-bottom:0;">
          <label>Why It Matters</label>
          <textarea class="aw-desc">${arEscapeHtml(a.desc)}</textarea>
        </div>
      </div>
    `).join('');

    wrap.querySelectorAll('.aw-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this award? This cannot be undone.')) return;
        siteData.awards = siteData.awards.filter(a => a.id !== btn.dataset.id);
        persist();
        renderAwards();
        toast('Award deleted');
      });
    });
  }

  document.getElementById('addAwardBtn').addEventListener('click', () => {
    siteData.awards.push({ id: arGenId('a'), name: 'New Award', year: String(new Date().getFullYear()), issuer: '', desc: '' });
    persist();
    renderAwards();
    toast('Award added — edit the details below, then Save');
  });

  document.getElementById('saveAwardsBtn').addEventListener('click', () => {
    const items = document.querySelectorAll('#awardsList .admin-item');
    items.forEach(item => {
      const id = item.dataset.id;
      const a = siteData.awards.find(x => x.id === id);
      if (!a) return;
      a.name = item.querySelector('.aw-name').value.trim();
      a.year = item.querySelector('.aw-year').value.trim();
      a.issuer = item.querySelector('.aw-issuer').value.trim();
      a.desc = item.querySelector('.aw-desc').value.trim();
    });
    persist();
    toast('Awards saved');
  });

  /* ============================================================
     CONTACT INFO
     ============================================================ */
  function renderContact() {
    document.getElementById('cEmail').value = siteData.contact.email;
    document.getElementById('cWhatsapp').value = siteData.contact.whatsappNote;
    document.getElementById('cInvite').value = siteData.contact.invite;
    document.getElementById('cInstagram').value = siteData.contact.instagram === '#' ? '' : siteData.contact.instagram;
    document.getElementById('cYoutube').value = siteData.contact.youtube === '#' ? '' : siteData.contact.youtube;
  }

  document.getElementById('saveContactBtn').addEventListener('click', () => {
    siteData.contact.email = document.getElementById('cEmail').value.trim() || siteData.contact.email;
    siteData.contact.whatsappNote = document.getElementById('cWhatsapp').value.trim();
    siteData.contact.invite = document.getElementById('cInvite').value.trim();
    siteData.contact.instagram = document.getElementById('cInstagram').value.trim() || '#';
    siteData.contact.youtube = document.getElementById('cYoutube').value.trim() || '#';
    persist();
    toast('Contact info saved');
  });

  /* ============================================================
     THEME SWITCHER — applies + saves instantly, no Save button
     ============================================================ */
  function renderTheme() {
    const grid = document.getElementById('themeGrid');
    grid.innerHTML = AR_THEMES.map(t => `
      <div class="theme-option ${t.key === siteData.theme ? 'selected' : ''}" data-key="${t.key}">
        <div class="theme-swatches">
          ${t.swatch.map(c => `<span class="theme-swatch" style="background:${c};"></span>`).join('')}
        </div>
        <div class="theme-option-name">${t.name}</div>
        <div class="theme-option-check">
          <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        siteData.theme = opt.dataset.key;
        document.documentElement.setAttribute('data-theme', siteData.theme);
        persist();
        renderTheme();
        toast('Theme applied site-wide');
      });
    });
  }

  /* ============================================================
     SETTINGS
     ============================================================ */
  document.getElementById('changeCredsBtn').addEventListener('click', () => {
    const cur = document.getElementById('curPassword').value;
    const newU = document.getElementById('newUsername').value.trim();
    const newP = document.getElementById('newPassword').value;
    const creds = arLoadCreds();

    if (cur !== creds.password) {
      toast('Current password is incorrect');
      return;
    }
    if (!newU || !newP) {
      toast('Please fill in both new username and password');
      return;
    }
    if (newP.length < 6) {
      toast('New password should be at least 6 characters');
      return;
    }
    arSaveCreds({ username: newU, password: newP });
    document.getElementById('curPassword').value = '';
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
    toast('Login credentials updated');
  });

  document.getElementById('resetDataBtn').addEventListener('click', () => {
    if (!confirm('This will erase all your edits and restore the original demo content. Continue?')) return;
    arResetData();
    siteData = arLoadData();
    renderAll();
    toast('Content reset to defaults');
  });

  /* ---------- Initial render ---------- */
  function renderAll() {
    renderOverview();
    renderHome();
    renderAbout();
    renderServices();
    renderPortfolio();
    renderAwards();
    renderContact();
    renderTheme();
  }

  renderAll();

})();
