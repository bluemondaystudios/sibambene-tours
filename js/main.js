(function () {
  var root = document.documentElement;
  var WA = '27766541818';
  var EMAIL = 'dennis85th@gmail.com';

  /* ---------- Theme toggle ---------- */
  var toggle = document.getElementById('themeToggle');
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : media.matches;
  }
  function syncToggle() {
    var dark = isDark();
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0f0e0c' : '#f6f2ea');
  }
  toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('sibambene-theme', next); } catch (e) {}
    syncToggle();
  });
  if (media.addEventListener) media.addEventListener('change', syncToggle);
  syncToggle();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  /* ---------- Booking form ---------- */
  var form = document.getElementById('bookForm');
  var err = document.getElementById('formError');
  var dateInput = document.getElementById('f-date');
  dateInput.min = new Date().toISOString().slice(0, 10);

  function collect() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var bad = !el.value.trim();
      el.classList.toggle('invalid', bad);
      el.setAttribute('aria-invalid', String(bad));
      if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) { form.querySelector('.invalid').focus(); return null; }
    var d = new FormData(form);
    var lines = [
      'Hello Sibambene Tours, I would like a quote.',
      '',
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone'),
      'Trip: ' + d.get('service'),
      'Group size: ' + d.get('size'),
      'Date: ' + d.get('date'),
      'Pickup: ' + d.get('from'),
      'Destination: ' + d.get('to')
    ];
    var notes = String(d.get('notes') || '').trim();
    if (notes) lines.push('Notes: ' + notes);
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = collect();
    if (msg) window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
  document.getElementById('emailBtn').addEventListener('click', function () {
    var msg = collect();
    if (msg) window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Quote request') + '&body=' + encodeURIComponent(msg);
  });
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('invalid') && e.target.value.trim()) {
      e.target.classList.remove('invalid');
      e.target.setAttribute('aria-invalid', 'false');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Header state on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
