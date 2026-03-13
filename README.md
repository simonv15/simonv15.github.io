# simonv15.github.io

Personal portfolio site for Van Sy — AI Engineer. Built with plain HTML/CSS/JS, no build tools. All content is driven by a single YAML config file.

Live at: [simonv15.github.io](https://simonv15.github.io)

## Quick Start

```bash
# Preview locally
python3 -m http.server 8080
# Open http://localhost:8080
```

## How to Update Content

All site content lives in **`data/config.yaml`**. Edit this file to update anything on the site — no HTML changes needed.

### Site Metadata

```yaml
site:
  title: "Your Name — Your Role"
  description: "SEO description for your portfolio."
```

### About / Hero

Displayed on the first content section with your contact info.

```yaml
about:
  name: "Your Name"
  tagline: "Your Role"
  summary: >
    A few sentences about yourself.
  avatar: ""        # optional: URL or path to avatar image
  resume_url: ""    # optional: link to downloadable resume
```

### Work Experience

Rendered as a vertical timeline. Add as many entries as needed.

```yaml
experience:
  - company: "Company Name"
    role: "Your Role"
    period: "Start – End"
    location: "City, Country"
    bullets:
      - "What you did."
      - "Another achievement."
```

### Projects

Displayed as a card grid. Set `highlight: true` for featured projects.

```yaml
projects:
  - name: "Project Name"
    description: "Short description."
    tags: ["Python", "FastAPI"]
    url: "https://github.com/..."
    highlight: true   # featured card styling
```

### Skills

Grouped by category, rendered as pill badges.

```yaml
skills:
  - category: "Category Name"
    items: ["Skill 1", "Skill 2", "Skill 3"]
```

### Blog

Uncomment and add entries to enable the blog section. The section and nav link are hidden when empty.

```yaml
blog:
  - title: "Post Title"
    date: "2025-12-01"
    summary: "One-line summary."
    url: "https://..."
```

### Contact / Social Links

Shown in the hero section as a vertical list with bullet points.

```yaml
contact:
  email: "you@example.com"
  phone: "+84 123 456 789"       # optional
  links:
    - label: "GitHub"
      url: "https://github.com/username"
      icon: "github"             # github, linkedin, or twitter
```

## Theming

Click the sun/moon icon in the nav to toggle light/dark mode. Theme colors are defined in `css/variables.css` using Monokai-inspired palette.

## File Structure

```
├── index.html              # Page shell
├── data/
│   └── config.yaml         # All site content (edit this)
├── css/
│   ├── variables.css       # Theme tokens (colors, spacing)
│   ├── base.css            # Layout, nav, sections
│   └── components.css      # Cards, timeline, pills
├── js/
│   ├── lib/js-yaml.min.js  # YAML parser (vendored)
│   ├── theme.js            # Light/dark toggle
│   ├── dots.js             # Dot grid background with magnet effect
│   ├── pixel-scene.js      # Retro pixel art welcome scene
│   ├── renderer.js         # YAML to HTML renderer
│   └── main.js             # Bootstrap
└── assets/
    └── favicon.svg         # VS monogram favicon
```

## Deploy

Push to `main`. In repo Settings > Pages, set source to **Deploy from branch** > `main` / `/ (root)`.
