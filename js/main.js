window.Portfolio = window.Portfolio || {};

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize theme
    Portfolio.Theme.init();

    // 2. Fetch and parse YAML config
    fetch('data/config.yaml')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load config: ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var data = jsyaml.load(text);

        // 3. Render site content
        Portfolio.Renderer.renderSite(data);
      })
      .catch(function (err) {
        console.error('Portfolio init error:', err);
        document.querySelector('main').innerHTML =
          '<div style="padding:4rem 2rem;text-align:center;color:var(--text-secondary)">' +
          '<p>Failed to load site content. Please check the console.</p></div>';
      });

    // Mobile nav toggle
    var menuBtn = document.getElementById('nav-menu-btn');
    var navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });

      // Close nav when a link is clicked
      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }
  });
})();
