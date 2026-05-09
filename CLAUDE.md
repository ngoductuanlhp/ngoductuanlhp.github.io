# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Jekyll-built academic personal site (Tuan Duc Ngo) deployed at `ngoductuanlhp.github.io` (CNAME-pinned). Two top-level pages — `index.html` (home) and `cv.html` — render entirely from YAML data files in `_data/`. There is no `_layouts/`, `_includes/`, or `_posts/`; both pages set `layout: null` and inline their own HTML.

## Commands

```bash
bundle install            # one-time: install Jekyll 4.2 + minima theme + jekyll-feed
bundle exec jekyll serve  # local dev server with live reload (http://localhost:4000)
bundle exec jekyll build  # static build into _site/
```

`_config.yml` is **not** auto-reloaded — restart the server after editing it.

## Architecture

**Data-driven, layout-free.** Content lives in `_data/*.yml`; the two `.html` pages are Liquid templates that loop over those files. To add a publication/news item/job, edit YAML — do not touch HTML unless the rendering itself is changing.

- `_data/publications.yml` — list of papers. Each entry references author IDs (`first_authors`, `authors`) that must exist in `_data/authors.yml`. Optional fields: `project_page`, `arxiv` (ID only — URLs are built as `arxiv.org/pdf/{id}.pdf` and `arxiv.org/abs/{id}`), `github` (`owner/repo`), `video`, `open_access`, `awards[]`, `highlight: true`. `image` is a still; `image_mouseover` ending in `.mp4` is rendered as an autoplay `<video>`. Both resolve relative to `images/`.
- `_data/authors.yml` — author lookup keyed by ID. The `is_me: true` author renders without a hyperlink and gets the `author-me` CSS class. Author IDs in `publications.yml` will silently render blank if not defined here.
- `_data/news.yml` — first 5 entries shown; the rest are toggled by `toggleNews()` in `js/index.js`.
- `_data/experience.yml`, `services.yml` — used by `index.html`.
- `_data/education.yml`, `employment.yml` — used **only** by `cv.html` (which also re-iterates `publications.yml`, but with a simpler renderer that uses `authors` only — not `first_authors`). When adding a paper you want shown on the CV with co-first-author marking, the CV template will not honor `first_authors`.

**Styling.** Bulma (vendored under `css/`) + FontAwesome + Academicons. Site-specific styles are SCSS compiled by Jekyll: `css/index.scss` (imports `_sass/_base.scss`) for the home page, `css/cv.scss` for the CV. Both files start with the Jekyll front-matter `---` fence — that is required so Jekyll processes them as SCSS rather than copying them verbatim.

**Assets.** Paper figures/videos go in `images/` (referenced bare, e.g. `dage.png`). The downloadable CV PDF is `assets/CV.pdf` (note: the visible/HTML CV at `cv.html` is separate and rebuilt from YAML — keep them in sync manually).

**JS.** `js/index.js` handles the news show-more toggle and (commented-out) publication filter. No build step for JS.

## Conventions worth knowing

- `_config.yml` is the single source of truth for name, position, email, social handles, and the bio paragraph (`description`, supports markdown via `markdownify`). Templates pull from `site.*` rather than hardcoding.
- The home page navbar links (`#news`, `#publications`, `#experience`, `#services`) are anchors into the same page — keep section IDs stable when reordering.
- Google Analytics is wired via `site.google_analytics` but currently commented out in `_config.yml`.
- `_site/` and `.jekyll-cache/` are build output — don't commit (already in `.gitignore`).
