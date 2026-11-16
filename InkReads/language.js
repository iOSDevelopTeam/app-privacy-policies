// Remember the selected language; explicit page URLs always take precedence.
(() => {
  const english = document.documentElement.lang === 'en';
  try {
    if (location.pathname.endsWith('/') && localStorage.getItem('inkreads-language') === 'en') {
      location.replace('index-en.html' + location.search + location.hash);
      return;
    }
    localStorage.setItem('inkreads-language', english ? 'en' : 'zh');
  } catch {
    // Storage may be blocked in private browsing; ordinary language links still work.
  }
})();
