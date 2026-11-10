/*
 * site.js — the phone menu of the shared header (10 Nov 2026; styles in site.css).
 * Loaded in <head> without defer so the `js` class is on <html> before the header paints:
 * without JavaScript the links simply stay visible.
 */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var button = header && header.querySelector('.site-menu-btn');
  if (!button) return;

  function setOpen(open) {
    header.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  button.addEventListener('click', function () {
    setOpen(!header.classList.contains('open'));
  });

  // A tap on a link (an anchor on this page too) or outside the header closes it; so does Escape.
  header.querySelectorAll('.site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('click', function (e) {
    if (header.classList.contains('open') && !header.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('open')) {
      setOpen(false);
      button.focus();
    }
  });
});
