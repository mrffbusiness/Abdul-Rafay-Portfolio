// ============================================================
// THEME — applied as early as possible to avoid a flash of the
// wrong color theme while the real content loads from Supabase.
// Uses a small local cache (just the theme name) for instant
// first paint; content-loader.js re-applies the real value once
// it has fetched fresh data, and refreshes this cache.
// ============================================================
(function () {
  try {
    var cached = localStorage.getItem('ar_theme_cache') || 'charcoal-orange';
    document.documentElement.setAttribute('data-theme', cached);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'charcoal-orange');
  }
})();
