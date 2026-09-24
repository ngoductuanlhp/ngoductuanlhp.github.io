# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Jekyll-built academic personal site (Tuan Duc Ngo, PhD student at UMass Amherst) served at `ngoductuanlhp.github.io`. Two top-level pages — `index.html` (home) and `cv.html` — render entirely from YAML data files in `_data/`. There is no `_layouts/`, `_includes/`, or `_posts/`; both pages set `layout: null` and inline their own HTML. Originally forked from a template (Keunhong Park's site / al-folio), so several files are template leftovers (see below).

## Commands

Local toolchain: Homebrew `ruby@3.3` (keg-only, so it doesn't replace the macOS system Ruby 2.6), with gems in the gitignored `vendor/bundle` (set via `.bundle/config`). Put it on `PATH` first:

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle install                           # one-time: installs Jekyll 4.2 etc. into vendor/bundle
bundle exec jekyll serve --livereload    # http://localhost:4000, auto-rebuild + browser reload
bundle exec jekyll build                 # static build into _site/
```

- `_config.yml` is **not** auto-reloaded — restart the server after editing it.
- SCSS errors don't stop `jekyll serve`: the server keeps serving the **last good** `css/index.css`. Check the server log for `Conversion error` after editing SCSS.
- Ruby 3.3 prints harmless `csv`/`base64`/`bigdecimal` deprecation warnings on every run. CI uses Ruby 3.0 (`.github/workflows/jekyll.yml`).
- `Gemfile.lock` is gitignored, so CI resolves gem versions fresh on every build.

**Quick data sanity check** (no gems needed):

```bash
ruby -ryaml -e 'a=YAML.load_file("_data/authors.yml"); YAML.load_file("_data/publications.yml").each{|p| ((p["first_authors"]||[])+(p["authors"]||[])).each{|i| puts "#{p["id"]}: unknown author #{i}" unless a[i]}; [p["image"],p["image_mouseover"]].compact.each{|f| puts "missing images/#{f}" unless File.exist?("images/#{f}")}}'
```

## Deployment

Push to `master` → `.github/workflows/jekyll.yml` builds with `JEKYLL_ENV=production` and deploys through GitHub Pages **Actions** (not branch-based Pages). Pushing is publishing, so there is no staging step. Because it's an Actions deploy, a `CNAME` file would be ignored; any custom domain is set in repo settings.

## Architecture

**Data-driven, layout-free.** Content lives in `_data/*.yml`; the two `.html` pages are Liquid templates that loop over those files. To add a publication, news item, or job, edit YAML. Only touch HTML when the rendering itself needs to change.

- `_data/publications.yml`: list of papers, rendered in file order (newest first by convention). Fields:
  - `first_authors` / `authors`: author IDs that must exist in `_data/authors.yml`; unknown IDs **silently render blank**. If `first_authors` has more than one entry, each gets a `*` (equal contribution).
  - `arxiv`: ID only, **always quoted** (`"2603.03744"`), because unquoted IDs are parsed as floats and lose trailing zeros. Generates both the PDF and arXiv buttons.
  - `project_page`, `github` (`owner/repo`), `video`, `open_access` (PDF URL for non-arXiv papers), `awards[]` (red tag after venue), `highlight: true` (tinted, bordered card).
  - `image`: still in `images/`. `image_mouseover`: if it contains `mp4`, it **replaces** the still with an autoplay/loop/muted `<video>` (it's not a hover effect, despite the name). Otherwise it's ignored and `image` is shown.
  - `id`: used in the TL;DR panel's `aria-label`; not otherwise rendered.
  - `description`: one sentence, **hidden by default** behind a "TL;DR" toggle in the links row (JS in `js/index.js`; the collapse animation uses the `grid-template-rows: 0fr → 1fr` trick in `.tldr`). It supports markdown. Wrap 1–2 key phrases in `**…**` and they render in bold. `cv.html` strips the markup to plain text.
- `_data/authors.yml`: author lookup keyed by ID. `is_me: true` renders without a link and in bold (`author-me`). An optional `middle_name` is supported.
- `_data/news.yml`: `date` (e.g. `"[06/2026]"`) + markdown `description`. The first 5 are shown; the rest are toggled by `toggleNews()`. Newest first.
- `_data/experience.yml`: the logo strip on the home page. Only `role`, `company`, `company_url`, `logo` (path from repo root), and `dates` are rendered. `description` and `mentors` are stored but **not rendered** anywhere.
- `_data/services.yml`: `teaching[]` (role + courses with URLs) and `reviewing[]` (type + venue strings), rendered as chips.
- `_data/education.yml`, `employment.yml`: used **only** by `cv.html`. Keep `employment.yml` in sync with `experience.yml` by hand, since they overlap.

**`cv.html` is a secondary page.** It isn't linked from the home page; the home page's CV icon links to `assets/CV.pdf`, which is a separate, manually maintained PDF. It renders `first_authors` (with `*` when there's more than one) and then `authors` as initials, and the title is linked only when `project_page` is set. Any rendering change to author lists in `index.html` has to be mirrored here.

**Styling.** Bulma (vendored `css/bulma.min.css`) + Google Fonts. Site styles are SCSS compiled by Jekyll: `css/index.scss` for the home page and `css/cv.scss` for the CV, both importing `_sass/_base.scss`. Both `.scss` files start with an empty front-matter `---` fence, which Jekyll needs in order to compile them to `css/*.css`. Icons: `index.html` loads FontAwesome 6.5.1 and Academicons from **CDN**. The vendored `css/fontawesome.*`, `js/fontawesome.*` are used only by `cv.html`, and `css/academicons.*` is unused.

**Theming (home page only).** Light/dark/system theme via CSS variables in `css/index.scss`: `:root` holds the light palette and `html[data-theme="dark"]` the dark one. Bulma 0.9.3 hardcodes light colors, so the top of `index.scss` re-points the Bulma selectors it uses at those variables. Any new color must be a variable with values in **both** palettes, or it will look wrong in one theme.

- An inline `<head>` script in `index.html` sets `data-theme` before first paint, so there's no flash.
- `js/index.js` (`applyTheme`/`setTheme`) wires up the navbar switcher and stores explicit choices in `localStorage['theme']`. "System" removes that key and follows `prefers-color-scheme` live.
- `cv.html` is not themed.

**Footer.** "Last updated" is `site.time`, the Jekyll build time. CI rebuilds on every push, so it tracks the last deploy with no manual editing.

**JS.** `js/index.js` (no build step) handles the theme switcher, the news toggle, the back-to-top button, and the Bulma navbar burger / mobile-menu close. `filterPublications()` runs with `'all'` on load, but its `#btn-all` / `#btn-selected` buttons aren't in the HTML, so the "selected only" filter is dormant.

## Conventions worth knowing

- `_config.yml` is the single source of truth for name, position, tagline, email, social handles, and the bio (`description`, markdown via `markdownify`; it also feeds the `<meta>`/OG description). Templates read `site.*`, so don't hardcode these values.
- The navbar anchors (`#experience`, `#news`, `#publications`, `#services`) point into the same page, so keep those IDs stable when reordering. `#publications` is on the `<h2>` inside the News section, not on its own `<section>`.
- `url` in `_config.yml` has **no trailing slash**. Build absolute URLs with `| absolute_url`, not `{{ site.url }}/...`.
- Google Analytics: the gtag `<script>` in both pages is gated on `site.google_analytics`, which is commented out in `_config.yml`. Uncomment that line to enable it.
- Media budget: thumbnails display at ~230px, so keep files small. `images/` was optimized from 61 MB down to 6 MB, so match these settings for new files:
  - **Stills:** real JPEG (check with `file`, since some old `.jpg`s were really PNGs), ≤800px wide, quality ~82: `sips -s format jpeg -s formatOptions 82 --resampleWidth 800 in.png --out out.jpg`. Only use PNG when transparency is needed.
  - **Videos:** `ffmpeg -i in.mp4 -an -vf "scale='min(640,iw)':-2:flags=lanczos,fps='min(30,source_fps)'" -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart out.mp4`. **`+faststart` is required.** Without it the `moov` index sits at the end of the file, and the browser must download the whole video before showing a frame.
- `theme: minima` and `jekyll-feed` are declared but effectively unused (`layout: null`).
- Template leftovers with no function here: `.all-contributorsrc`, `.github/FUNDING.yml`, `.github/stale.yml`, and `.github/ISSUE_TEMPLATE/`.
- `_site/`, `.jekyll-cache/`, `vendor/`, `Gemfile.lock`, and `.specstory/` are gitignored; don't commit them.
