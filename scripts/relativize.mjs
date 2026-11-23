// Preview-only: rewrite root-absolute links in dist/ to relative .html links
// so the static build can be browsed as a Claude artifact. Not used for production.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';
const root = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(root);
const exists = new Set(files.map((f) => '/' + relative(root, f).split('\\').join('/')));
function target(path) {
  let [p, hash = ''] = path.split('#');
  if (p === '/' || p === '') p = '/index.html';
  else if (!/\.[a-z0-9]+$/i.test(p)) {
    p = p.replace(/\/$/, '');
    p = exists.has(p + '.html') ? p + '.html' : exists.has(p + '/index.html') ? p + '/index.html' : p + '.html';
  }
  return [p, hash];
}
for (const f of files) {
  const rel = '/' + relative(root, f).split('\\').join('/');
  const dir = posix.dirname(rel);
  if (f.endsWith('.html')) {
    let s = readFileSync(f, 'utf8');
    s = s.replace(/(href|src)="(\/[^"\/][^"]*|\/)"/g, (m, attr, url) => {
      const [p, hash] = target(url);
      let r = posix.relative(dir, p) || posix.basename(p);
      return `${attr}="${r}${hash ? '#' + hash : ''}"`;
    });
    writeFileSync(f, s);
  } else if (f.endsWith('.css')) {
    let s = readFileSync(f, 'utf8');
    s = s.replace(/url\((\/[^)]+)\)/g, (m, url) => `url(${posix.relative(dir, url)})`);
    writeFileSync(f, s);
  }
}
console.log('relativized', files.length, 'files');
