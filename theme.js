// ============================================================
// THEME — applied as early as possible to avoid a flash of the
// wrong color theme. Reads directly from localStorage so it can
// run before data.js's helper functions are needed.
// ============================================================
(function () {
  try {
    var raw = localStorage.getItem('ar_site_data');
    var theme = 'charcoal-orange';
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.theme) theme = parsed.theme;
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'charcoal-orange');
  }
})();
