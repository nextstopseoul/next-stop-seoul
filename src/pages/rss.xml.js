import rss from '@astrojs/rss';
import { SITE } from '../site.config.mjs';
import { getPosts } from '../lib/utils';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: `/posts/${p.id}/`,
      categories: [p.data.category, ...(p.data.area ? [p.data.area] : [])],
    })),
  });
}
