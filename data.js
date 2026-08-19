// ============================================================
// ABDUL RAFAY PORTFOLIO — SHARED DATA LAYER
// Powers both the public site and the Admin Panel.
// Content lives in a Supabase database so edits made in the
// Admin Panel are visible to every visitor, on every device,
// the moment they're saved.
// ============================================================

const AR_DATA_KEY = 'ar_site_data';

const AR_DEFAULT_DATA = {
  theme: 'charcoal-orange',

  hero: {
    firstName: 'Abdul',
    lastName: 'Rafay',
    role: 'Video Editor & Content Creator',
    tagline: 'Turning raw footage into stories that hook.'
  },

  stats: [
    { label: 'Videos Edited', value: 75, decimals: 0, suffix: '+' },
    { label: 'Happy Clients', value: 13, decimals: 0, suffix: '+' },
    { label: 'Experience', value: 2, decimals: 0, suffix: '+ yrs' },
    { label: 'Avg. Client Rating', value: 4.3, decimals: 1, suffix: '/5' }
  ],

  services: [
    { id: 'svc1', icon: 'video', title: 'YouTube Video Editing', desc: 'Full editing of long-form YouTube videos — cuts, transitions, pacing, and structure built to keep viewers watching.', shortDesc: 'Full edit, pacing and structure for long-form YouTube videos.', price: 120, unit: 'video' },
    { id: 'svc2', icon: 'reel', title: 'Short-Form Reels Editing', desc: 'Fast-paced vertical edits for Instagram Reels, YouTube Shorts, and TikTok — built to hook in the first second.', shortDesc: 'Fast, scroll-stopping edits built for Reels, TikTok and Shorts.', price: 55, unit: 'reel' },
    { id: 'svc3', icon: 'color', title: 'Color Grading & Sound Design', desc: 'Professional color correction and audio mixing to give your video a polished, cinematic finish.', shortDesc: 'Consistent, cinematic tones and clean, mixed audio.', price: 95, unit: 'video' },
    { id: 'svc4', icon: 'thumb', title: 'Thumbnail Design', desc: 'Eye-catching, on-brand thumbnails designed to boost click-through rate across your uploads.', shortDesc: 'Eye-catching thumbnails designed to boost click-through.', price: 20, unit: 'month' }
  ],

  portfolio: [
    { id: 'p1', title: 'Momentum', category: 'longform', desc: 'A 14-minute brand documentary — full edit, pacing and structure built from four hours of raw interview footage.', thumbColor: 'linear-gradient(150deg,#ff6a2b,#3a1a10)', thumbImage: null, featured: true },
    { id: 'p2', title: 'Groundwork', category: 'longform', desc: 'A 22-minute channel documentary series episode — narrative edit, pacing and B-roll selection.', thumbColor: 'linear-gradient(150deg,#6db4ff,#0a1b30)', thumbImage: null, featured: true },
    { id: 'p3', title: 'The Last Mile', category: 'longform', desc: 'A 30-minute long-form vlog edit — trimmed from six hours of raw footage into a tight, watchable cut.', thumbColor: 'linear-gradient(150deg,#ff9248,#2a1206)', thumbImage: null, featured: false },
    { id: 'p4', title: 'Streetlight', category: 'shortform', desc: 'A 28-second Reel edit built for retention — fast cuts, captions and a hook in the first second.', thumbColor: 'linear-gradient(150deg,#2e8fff,#0f2440)', thumbImage: null, featured: true },
    { id: 'p5', title: 'Static', category: 'shortform', desc: 'A TikTok music promo cut — beat-synced edit with motion titles and quick jump cuts.', thumbColor: 'linear-gradient(150deg,#ff6a2b,#2e8fff)', thumbImage: null, featured: true },
    { id: 'p6', title: 'Departures', category: 'shortform', desc: 'A Shorts series edit for a travel vlog series — nine episodes cut for daily posting.', thumbColor: 'linear-gradient(150deg,#ffb06a,#1a1a1a)', thumbImage: null, featured: false },
    { id: 'p7', title: 'Afterglow', category: 'color', desc: 'A cinematic color grade and full sound design pass for an independent short film.', thumbColor: 'linear-gradient(150deg,#2e8fff,#0f2440)', thumbImage: null, featured: true },
    { id: 'p8', title: 'Nightcall', category: 'color', desc: 'Mixed and mastered dialogue, foley and ambient sound design for a narrative short.', thumbColor: 'linear-gradient(150deg,#ff6a2b,#3a1a10)', thumbImage: null, featured: true },
    { id: 'p9', title: 'Undertone', category: 'color', desc: "A moody, desaturated grade with a custom LUT built for a brand's mini-documentary series.", thumbColor: 'linear-gradient(150deg,#6db4ff,#0a1b30)', thumbImage: null, featured: false }
  ],

  awards: [
    { id: 'a1', name: 'Best Editor Certificate', year: '2026', issuer: 'ChatGPT', desc: "Recognizing outstanding storytelling through video editing — awarded for the ability to shape raw footage into a cut that consistently holds a viewer's attention." },
    { id: 'a2', name: 'AI Tools Certificate', year: '2025', issuer: 'ChatGPT Luna', desc: 'Recognizing proficiency in applying AI-powered tools within the editing workflow — from assisted rough cuts to smarter, faster post-production.' }
  ],

  about: {
    lead: "I started editing videos two years ago as a hobby — helping a friend cut his YouTube uploads on weekends.",
    body1: "Somewhere along the way, what started as a favor turned into an obsession. I fell in love with storytelling — not just cutting clips together, but shaping pace, sound design, and color to build something that actually holds a viewer's attention. That obsession eventually became a full-time career.",
    body2: "What makes me different is simple: I don't just trim footage into a timeline. I build a narrative — a reason for the viewer to keep watching until the very last second. Every cut, transition, and sound cue is there to serve that story.",
    mission: 'To help creators and brands turn raw, unorganized footage into polished stories that grow their audience.',
    skills: [
      { name: 'Video Editing', pct: 95 },
      { name: 'Color Grading', pct: 85 },
      { name: 'Sound Design', pct: 80 },
      { name: 'Channel Management', pct: 78 },
      { name: 'Short-Form Reels', pct: 90 }
    ],
    timeline: [
      { marker: 'Year 1', title: 'Started Editing As A Hobby', desc: 'Began cutting weekend YouTube uploads for a friend — no formal training, just curiosity and a lot of trial and error.' },
      { marker: 'Year 1', title: 'First Paid Client', desc: 'Turned a hobby into a service — first invoice, first deadline, first taste of doing this for real.' },
      { marker: 'Year 2', title: 'Crossed 100 Edited Videos', desc: 'Hit the 100-video mark across long-form, short-form and brand content — and started noticing the craft click into place.' },
      { marker: 'Year 2', title: 'Started Managing Full Channels', desc: 'Moved beyond single edits into end-to-end channel management — strategy, consistency, and long-term growth.' },
      { marker: 'Today', title: '75+ Videos, 13+ Clients', desc: 'A growing roster of happy clients, a 4.3-star average rating, and a portfolio that keeps expanding.' }
    ]
  },

  contact: {
    email: 'mrffbusiness@gmail.com',
    whatsappNote: 'Available on request — email me to get the number',
    invite: "Have an editing or channel management project in mind? Reach out — I'd love to hear about it.",
    instagram: '#',
    youtube: '#'
  },

  images: {
    profilePhoto: null
  }
};

const AR_THEMES = [
  { key: 'charcoal-orange', name: 'Charcoal Orange', swatch: ['#0a0b0d', '#ff6a2b', '#2e8fff'] },
  { key: 'midnight-blue', name: 'Midnight Blue', swatch: ['#080b14', '#3b6bff', '#22d3ee'] },
  { key: 'slate-purple', name: 'Slate Purple', swatch: ['#0c0a12', '#8b5cf6', '#ec4899'] },
  { key: 'emerald-dark', name: 'Emerald Dark', swatch: ['#07120d', '#10b981', '#0ea5e9'] }
];

const AR_ICONS = {
  video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 9l5-3v12l-5-3"/>',
  reel: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 18h4"/>',
  color: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  thumb: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><circle cx="9" cy="9" r="1.4" fill="currentColor" stroke="none"/><path d="M4 15l4.5-4 3.5 3 3-2.5L21 15"/>',
  mic: '<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z"/><path d="M19 11a7 7 0 0 1-14 0M12 19v3"/>',
  motion: '<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  camera: '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/>',
  trophy: '<path d="M8 21h8M12 17v4M6 4h12v4a6 6 0 0 1-12 0V4z"/><path d="M6 6H3a3 3 0 0 0 3 3M18 6h3a3 3 0 0 1-3 3"/>',
  cert: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><path d="M8 12l2.5-2.5L13 12l3-3"/>'
};

function arIconSvg(key) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${AR_ICONS[key] || AR_ICONS.video}</svg>`;
}

const AR_CATEGORY_LABELS = {
  longform: 'YouTube Long-Form',
  shortform: 'Short-Form Reels',
  color: 'Color Grading & Sound Design'
};

/* ---------- Deep merge (so old saved data gains new default fields) ---------- */
function arDeepMerge(base, override) {
  if (Array.isArray(base)) return override !== undefined ? override : base;
  if (typeof base !== 'object' || base === null) return override !== undefined ? override : base;
  const result = { ...base };
  if (override && typeof override === 'object') {
    Object.keys(override).forEach(key => {
      result[key] = arDeepMerge(base[key], override[key]);
    });
  }
  return result;
}

/* ---------- Storage: content (now backed by Supabase) ---------- */
async function arLoadData() {
  try {
    const { data, error } = await supabaseClient
      .from('site_content')
      .select('data')
      .eq('id', 1)
      .single();
    if (error || !data) {
      console.warn('Supabase load failed, using defaults:', error);
      return JSON.parse(JSON.stringify(AR_DEFAULT_DATA));
    }
    return arDeepMerge(AR_DEFAULT_DATA, data.data || {});
  } catch (e) {
    console.warn('Supabase unreachable, using defaults:', e);
    return JSON.parse(JSON.stringify(AR_DEFAULT_DATA));
  }
}

async function arSaveData(data) {
  const { error } = await supabaseClient
    .from('site_content')
    .update({ data: data, updated_at: new Date().toISOString() })
    .eq('id', 1);
  if (error) {
    console.error('Supabase save failed:', error);
    throw error;
  }
  return true;
}

async function arResetData() {
  return arSaveData(JSON.parse(JSON.stringify(AR_DEFAULT_DATA)));
}

/* ---------- Utility ---------- */
function arGenId(prefix) {
  return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function arEscapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

/* ---------- Image resize/compress helper (keeps database rows small and fast) ---------- */
function arResizeImageFile(file, maxDim, quality) {
  maxDim = maxDim || 1000;
  quality = quality || 0.82;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w >= h) { h = Math.round(h * maxDim / w); w = maxDim; }
          else { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#101216';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Could not read image'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}
