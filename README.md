# PAUL — Dashboard JS

JavaScript for the PAUL dashboard SPA (Webflow site `69b997eb94c82b210b5176e8`).
Served to the live site via jsDelivr CDN.

## Files

- `paul.js` — the entire dashboard script. Loaded from the Webflow **footer** custom code field.

## Live URL

Production (pinned to a tag, immutable + permanently cached):

```
https://cdn.jsdelivr.net/gh/USER/paul-dashboard@v1.0.0/paul.js
```

Development (tracks `main`, cached ~12h — purge after each push):

```
https://cdn.jsdelivr.net/gh/USER/paul-dashboard@main/paul.js
https://purge.jsdelivr.net/gh/USER/paul-dashboard@main/paul.js
```

## Webflow footer code

The footer field now contains only:

```html
<script src="https://cdn.jsdelivr.net/gh/USER/paul-dashboard@v1.0.0/paul.js"></script>
```

Chart.js stays in the Webflow **Head** code and must load before this file.

## Deploy workflow

```bash
# 1. edit paul.js
node --check paul.js          # syntax gate — never push a file that fails this

# 2. commit
git add paul.js
git commit -m "Prognose: add scenario toggle"
git push

# 3. release
git tag v1.1.0
git push --tags

# 4. update the src URL in the Webflow footer to @v1.1.0, then publish
```

If using the `@main` URL during development, skip steps 3–4 and hit the purge URL
in a browser after each push, then hard-reload the staging site.

## Notes

- Verification happens on the published `.webflow.io` staging URL. Footer JS does
  not execute in the Webflow Designer canvas.
- Placeholder data (`accounts`, `positions`) is marked for API replacement. When
  async fetch lands, `accountsTotal` and its downstream consumers must move inside
  the `.then()` callback.
- Migrating off jsDelivr later (e.g. to Webflow asset hosting) is a single `src`
  URL swap.
