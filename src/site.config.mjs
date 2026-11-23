// One place to change the blog's name, domain and monetization settings.
export const SITE = {
  name: 'Next Stop Seoul',
  tagline: "Your friendly guide to what's on in Seoul",
  description:
    'Festivals, markets, pop-ups and easy day plans in Seoul — with subway exits, prices and tips written for international visitors.',
  url: 'https://next-stop-seoul.pages.dev', // ← change to https://www.nextstopseoul.com when the domain is bought
  author: 'Next Stop Seoul',
  locale: 'en',
  koreanBlog: 'https://blog.naver.com/flowsbekickin',
  instagram: '', // e.g. https://instagram.com/yourhandle
  pinterest: '', // e.g. https://pinterest.com/yourhandle
  contactEmail: 'hello@example.com', // ← replace
  // Google AdSense: put your publisher id (ca-pub-XXXX) here after approval. Empty = no ads rendered.
  adsenseClient: '',
  // Google Search Console HTML-tag verification
  googleVerification: '98fmcW9_IM55OGypmUHx0jItWRJtwVYOTp_eCdY3oAU',
};

// Neighborhoods and categories shown in navigation. Posts may use other values too.
export const AREAS = [
  'Jongno', 'Myeongdong', 'Hongdae', 'Seongsu', 'Itaewon', 'Gangnam', 'Yeouido', 'Mapo', 'Gangseo', 'Jamsil', 'Near Seoul',
];
export const CATEGORIES = [
  'Festivals & Events', 'Food & Markets', 'Indoor & Rainy Day', 'Exhibitions', 'Pop-ups', 'Parks & Walks', 'Weekly Guide', 'Monthly Guide', 'Travel Tips',
];
