import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const postUrl = (p: Post) => `/posts/${p.id}/`;
export const categoryUrl = (c: string) => `/category/${slugify(c)}/`;
export const areaUrl = (a: string) => `/area/${slugify(a)}/`;

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Seoul' });

export const fmtShort = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'Asia/Seoul' });

export function readingTime(body = ''): number {
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

export type Status = 'now' | 'soon' | 'ended' | null;

/** Build-time status; a small script refreshes it in the browser. */
export function eventStatus(event?: { start: Date; end: Date }, now = new Date()): Status {
  if (!event) return null;
  const end = new Date(event.end); end.setHours(23, 59, 59);
  if (now > end) return 'ended';
  if (now < event.start) return 'soon';
  return 'now';
}

/** Posts whose event is running today or opens within `days`. */
export function upcoming(posts: Post[], days = 21, now = new Date()) {
  const horizon = new Date(now.getTime() + days * 864e5);
  return posts
    .filter((p) => p.data.event && eventStatus(p.data.event, now) !== 'ended' && p.data.event.start <= horizon)
    .sort((a, b) => a.data.event!.start.valueOf() - b.data.event!.start.valueOf());
}

// Seoul subway line colours, for the station pills.
export const LINE_COLORS: Record<string, string> = {
  '1': '#0052A4', '2': '#00A84D', '3': '#EF7C1C', '4': '#00A5DE', '5': '#996CAC',
  '6': '#CD7C2F', '7': '#747F00', '8': '#E6186C', '9': '#BDB092',
  Airport: '#0090D2', 'Gyeongui-Jungang': '#77C4A3', Shinbundang: '#D4003B', 'Suin-Bundang': '#F5A200',
};

/** Turns "Gwanghwamun (Line 5), Exit 5" into HTML with coloured line pills. */
export function stationHtml(s: string): string {
  const esc = s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    // "Station (Line 9, Line Airport)" -> "Station Line 9 Line Airport" so pills sit inline without brackets
    .replace(/\s*\(((?:Line [^,)]+(?:,\s*)?)+)\)/g, (_, inner) => ' ' + inner.replace(/,\s*/g, ' '));
  return esc.replace(/Line (\d|Airport|Gyeongui-Jungang|Shinbundang|Suin-Bundang)/g, (_, l) => {
    const c = LINE_COLORS[l] ?? '#555';
    const label = /^\d$/.test(l) ? l : l.slice(0, 1);
    return `<span class="line" style="--c:${c}" title="Line ${l}">${label}</span><span class="sr">Line ${l}</span>`;
  });
}

/** Configured neighborhoods plus any area a post uses that isn't configured yet ("Near Seoul" stays last). */
export function allAreas(configured: string[], posts: { data: { area?: string } }[]): string[] {
  const extra = [...new Set(posts.map((p) => p.data.area).filter((a): a is string => !!a && !configured.includes(a)))].sort();
  const last = configured.includes('Near Seoul') ? ['Near Seoul'] : [];
  return [...configured.filter((a) => a !== 'Near Seoul'), ...extra, ...last];
}
