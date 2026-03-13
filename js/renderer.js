window.Portfolio = window.Portfolio || {};

window.Portfolio.Renderer = (function () {
  // Inline SVG icons
  var icons = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
  };

  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function renderHero(about, contact) {
    var el = document.getElementById('section-about');
    if (!el || !about) return;

    var html = '<div class="hero-content section-content">';
    html += '<h1 class="hero-name">' + esc(about.name) + '</h1>';
    html += '<p class="hero-tagline">' + esc(about.tagline) + '</p>';
    html += '<p class="hero-summary">' + esc(about.summary) + '</p>';
    if (about.resume_url) {
      html += '<a href="' + esc(about.resume_url) + '" class="hero-resume" target="_blank" rel="noopener">Download Resume</a>';
    }

    // Contact inline
    if (contact) {
      html += '<div class="hero-contact">';
      if (contact.email) {
        html += '<a href="mailto:' + esc(contact.email) + '" class="hero-contact-item">' + esc(contact.email) + '</a>';
      }
      if (contact.phone) {
        html += '<a href="tel:' + esc(contact.phone.replace(/\s/g, '')) + '" class="hero-contact-item">' + esc(contact.phone) + '</a>';
      }
      if (contact.links && contact.links.length) {
        contact.links.forEach(function (link) {
          html += '<a href="' + esc(link.url) + '" target="_blank" rel="noopener" class="hero-contact-item">' + esc(link.url) + '</a>';
        });
      }
      html += '</div>';
    }

    html += '</div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderExperience(data) {
    var el = document.getElementById('section-experience');
    if (!el || !data) return;

    var html = '<div class="section-content">';
    html += '<h2 class="section-title">Experience</h2>';
    html += '<div class="timeline">';

    data.forEach(function (item) {
      html += '<div class="timeline-item">';
      html += '<div class="timeline-header">';
      html += '<div class="timeline-role">' + esc(item.role) + ' <span class="timeline-company">@ ' + esc(item.company) + '</span></div>';
      html += '<div class="timeline-meta">';
      html += '<span>' + icons.calendar + ' ' + esc(item.period) + '</span>';
      if (item.location) {
        html += '<span>' + icons.location + ' ' + esc(item.location) + '</span>';
      }
      html += '</div>';
      html += '</div>';

      if (item.bullets && item.bullets.length) {
        html += '<ul class="timeline-bullets">';
        item.bullets.forEach(function (b) {
          html += '<li>' + esc(b) + '</li>';
        });
        html += '</ul>';
      }

      html += '</div>';
    });

    html += '</div></div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderProjects(data) {
    var el = document.getElementById('section-projects');
    if (!el || !data) return;

    var html = '<div class="section-content">';
    html += '<h2 class="section-title">Public Projects</h2>';
    html += '<div class="projects-grid">';

    data.forEach(function (item) {
      var cls = 'project-card' + (item.highlight ? ' highlight' : '');
      html += '<div class="' + cls + '">';
      html += '<div class="project-card-name">';
      if (item.url) {
        html += '<a href="' + esc(item.url) + '" target="_blank" rel="noopener">' + esc(item.name) + '</a>';
        html += '<span class="project-card-link-icon">' + icons.external + '</span>';
      } else {
        html += '<span>' + esc(item.name) + '</span>';
      }
      html += '</div>';
      html += '<p class="project-card-desc">' + esc(item.description) + '</p>';

      if (item.tags && item.tags.length) {
        html += '<div class="project-card-tags">';
        item.tags.forEach(function (t) {
          html += '<span class="tag">' + esc(t) + '</span>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    html += '</div></div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderSkills(data) {
    var el = document.getElementById('section-skills');
    if (!el || !data) return;

    var html = '<div class="section-content">';
    html += '<h2 class="section-title">Skills</h2>';

    data.forEach(function (group) {
      html += '<div class="skills-group">';
      html += '<div class="skills-category">' + esc(group.category) + '</div>';
      html += '<div class="skills-items">';
      group.items.forEach(function (item) {
        html += '<span class="skill-pill">' + esc(item) + '</span>';
      });
      html += '</div></div>';
    });

    html += '</div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderEducation(data) {
    var el = document.getElementById('section-education');
    if (!el || !data || !data.length) return;

    var html = '<div class="section-content">';
    html += '<h2 class="section-title">Education</h2>';

    data.forEach(function (item) {
      html += '<div class="education-item">';
      html += '<div class="education-degree">' + esc(item.degree) + '</div>';
      html += '<div class="education-school">' + esc(item.school) + '</div>';
      html += '<div class="timeline-meta">';
      html += '<span>' + icons.calendar + ' ' + esc(item.period) + '</span>';
      if (item.gpa) {
        html += '<span>GPA: ' + esc(item.gpa) + '</span>';
      }
      html += '</div>';

      if (item.highlights && item.highlights.length) {
        html += '<ul class="timeline-bullets">';
        item.highlights.forEach(function (h) {
          html += '<li>' + esc(h) + '</li>';
        });
        html += '</ul>';
      }
      html += '</div>';
    });

    html += '</div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderBlog(data) {
    var el = document.getElementById('section-blog');
    if (!el || !data || !data.length) {
      // Hide section if no blog posts
      if (el) el.style.display = 'none';
      return;
    }

    var html = '<div class="section-content">';
    html += '<h2 class="section-title">Blog</h2>';
    html += '<div class="blog-list">';

    data.forEach(function (post) {
      html += '<div class="blog-item">';
      html += '<div class="blog-date">' + esc(post.date) + '</div>';
      html += '<div class="blog-info">';
      html += '<div class="blog-title"><a href="' + esc(post.url) + '" target="_blank" rel="noopener">' + esc(post.title) + '</a></div>';
      html += '<div class="blog-summary">' + esc(post.summary) + '</div>';
      html += '</div></div>';
    });

    html += '</div></div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function renderContact(data) {
    var el = document.getElementById('section-contact');
    if (!el || !data) return;

    var html = '<div class="section-content contact-content">';
    html += '<h2 class="section-title" style="display:block;text-align:center;">Get in Touch</h2>';

    if (data.email) {
      html += '<p class="contact-email"><a href="mailto:' + esc(data.email) + '">' + esc(data.email) + '</a></p>';
    }

    if (data.links && data.links.length) {
      html += '<div class="social-links">';
      data.links.forEach(function (link) {
        var icon = icons[link.icon] || icons.external;
        html += '<a href="' + esc(link.url) + '" target="_blank" rel="noopener" class="social-link" title="' + esc(link.label) + '">' + icon + '</a>';
      });
      html += '</div>';
    }

    html += '</div>';
    el.querySelector('.section-inner').innerHTML = html;
  }

  function setupScrollReveal() {
    var container = document.getElementById('tab-portfolio');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, root: container, rootMargin: '0px 0px -50px 0px' });

    container.querySelectorAll('.section-content').forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupNavHighlight() {
    var container = document.getElementById('tab-portfolio');
    var sections = container.querySelectorAll('.section[id]');
    var tocLinks = document.querySelectorAll('#toc-portfolio .toc-dash');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tocLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { threshold: 0.3, root: container, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  function renderSite(data) {
    // Set page metadata
    if (data.site) {
      document.title = data.site.title || 'Portfolio';
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && data.site.description) {
        metaDesc.setAttribute('content', data.site.description);
      }
    }

    // Set nav brand
    if (data.about) {
      var brand = document.querySelector('.nav-brand');
      if (brand) brand.textContent = data.about.name;
    }

    renderHero(data.about, data.contact);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);

    // Post-render setup
    setupScrollReveal();
    setupNavHighlight();
  }

  return { renderSite: renderSite };
})();
