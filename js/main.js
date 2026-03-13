window.Portfolio = window.Portfolio || {};

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize theme + dots
    Portfolio.Theme.init();
    Portfolio.Dots.init();
    Portfolio.Terminal.init();

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
        document.getElementById('tab-portfolio').innerHTML =
          '<div style="padding:4rem 2rem;text-align:center;color:var(--text-secondary)">' +
          '<p>Failed to load site content. Please check the console.</p></div>';
      });

    // Tab switching
    var tabLinks = document.querySelectorAll('.tab-link');
    var tabContents = document.querySelectorAll('.tab-content');
    var tocPortfolio = document.getElementById('toc-portfolio');
    var tocBlog = document.getElementById('toc-blog');

    tabLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var tab = this.dataset.tab;

        // Update active tab link
        tabLinks.forEach(function (l) { l.classList.remove('active'); });
        this.classList.add('active');

        // Show/hide tab content
        tabContents.forEach(function (tc) {
          if (tc.id === 'tab-' + tab) {
            tc.style.display = '';
            tc.classList.add('active');
          } else {
            tc.style.display = 'none';
            tc.classList.remove('active');
          }
        });

        // Show/hide TOC
        if (tocPortfolio && tocBlog) {
          tocPortfolio.style.display = tab === 'portfolio' ? '' : 'none';
          tocBlog.style.display = tab === 'blog' ? '' : 'none';
        }
      });
    });

    // TOC clicks — scroll within tab container
    document.querySelectorAll('.toc-dash').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(this.getAttribute('data-section'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Mobile nav toggle
    var menuBtn = document.getElementById('nav-menu-btn');
    var navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('open');
      });

      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
        });
      });
    }
  });
})();
