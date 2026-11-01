import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'css', 'js', 'assets']) await cp(file, `dist/${file}`, { recursive: true });
console.log('Site pronto em dist/.');
