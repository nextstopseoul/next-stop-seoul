# How to publish a post (for the daily/weekly automation)

Every push to `main` redeploys https://next-stop-seoul.pages.dev in a few minutes.
Never push if `npm run build` fails.

## Files
- Post: `src/content/posts/<slug>.md` (slug = lowercase-words-with-hyphens, matches the URL `/posts/<slug>/`)
- Photos: `public/images/posts/<slug>/NN.jpg` (longest side ≤ 1600px, JPEG quality ~80, progressive). 6–10 photos per post.
- Never edit or delete other posts unless asked. Never commit `node_modules`, `dist`, `.astro`.

## Frontmatter template (daily)
```yaml
---
title: "Seoul Lantern Festival 2026: Dates, Hours & How to Get There"   # ≤ 60 chars ideal
description: "One or two sentences, ~150 chars, for search results and cards."
pubDate: 2026-11-24            # today, Asia/Seoul
type: daily                    # daily | weekly | monthly | guide
category: Festivals & Events   # Festivals & Events | Food & Markets | Indoor & Rainy Day | Exhibitions | Pop-ups | Parks & Walks | Travel Tips | Weekly Guide | Monthly Guide
area: Jongno                   # Jongno | Myeongdong | Hongdae | Seongsu | Itaewon | Gangnam | Yeouido | Mapo | Gangseo | Jamsil | Yongsan | Near Seoul (a new one is added to the neighborhood lists automatically)
tags: [keyword one, keyword two]
hero:
  src: /images/posts/<slug>/03.jpg
  alt: Describe what the photo shows
  credit: Author / CC BY-SA 4.0          # add "(past edition)" if it is not this year's event
event:                         # only for time-limited events; omit otherwise
  start: 2026-12-11
  end: 2027-01-31
quickFacts:
  name: Seoul Lantern Festival
  korean: 서울빛초롱축제
  dates: Dec 11, 2026 – Jan 31, 2027
  hours: Daily, 6–11pm
  price: Free                  # KRW + approx. USD, e.g. "₩5,000 (about US$3–4)"
  station: Gwanghwamun (Line 5), Exit 5     # ALWAYS "Station (Line N), Exit N" — renders coloured line pills
  reservation: Not needed
  payment: Cards accepted
  englishLevel: 3              # 1–5
  mapQuery: 청계광장             # Korean search term for Naver Map
faq:
  - q: Question travelers search?
    a: Short answer.
credits:
  - "Photo 1: Author / License (Wikimedia Commons)"
koreanUrl: https://blog.naver.com/flowsbekickin
---
```
Weekly posts: `type: weekly`, `category: Weekly Guide`, no `event`/`quickFacts` needed; `hero` may be omitted (a default image is used) or point to an existing image in `public/images/posts/`.

## Body
Markdown with `##` sections. Photos as HTML figures:
```html
<figure>
  <img src="/images/posts/<slug>/01.jpg" alt="What the photo shows" loading="lazy" />
  <figcaption>Photo 1 · Short caption. If it's a past edition, say so.</figcaption>
</figure>
```
Link other posts with `/posts/<other-slug>/`. Mark past-edition photos with a `> **Heads up:** …` note.

Google Maps: shows transit routes in Korea but no turn-by-turn walking/driving directions — recommend Naver Map or KakaoMap.
