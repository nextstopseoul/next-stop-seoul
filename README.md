# Next Stop Seoul

Astro static site. Posts are Markdown files in `src/content/posts/`, photos in `public/images/posts/<slug>/`.

## Commands
- `npm install` — once
- `npm run dev` — local preview at http://localhost:4321
- `npm run build` — production build into `dist/`

## Settings
Edit `src/site.config.mjs`: blog name, domain (`url`), contact email, Instagram/Pinterest links, AdSense publisher id (`adsenseClient`, leave empty until approved).

## Adding a post
Create `src/content/posts/<slug>.md` with the frontmatter used in the sample posts:
title, description, pubDate, type (daily/weekly/monthly/guide), category, area, tags, hero {src, alt, credit},
event {start, end} for time-limited events (drives the Happening now / Opens / Ended badge and banner),
quickFacts {name, korean, dates, hours, price, station "Name (Line N), Exit N", reservation, payment, englishLevel 1–5, mapQuery},
faq [{q, a}], credits [...], koreanUrl, draft (true = not published).

## Deploy (Cloudflare Pages)
Connect the GitHub repo → build command `npm run build`, output `dist`. Every push to `main` redeploys.

`scripts/relativize.mjs` and `PREVIEW=1` are only for the Claude preview build; production does not use them.
