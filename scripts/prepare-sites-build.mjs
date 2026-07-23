import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';

const dist = new URL('../dist/', import.meta.url);
const client = new URL('./client/', dist);
const server = new URL('./server/', dist);
const metadata = new URL('./.openai/', dist);

await mkdir(client, { recursive: true });

for (const entry of await readdir(dist, { withFileTypes: true })) {
  if (['client', 'server', '.openai'].includes(entry.name)) continue;

  await cp(
    new URL(`./${entry.name}`, dist),
    new URL(`./${entry.name}`, client),
    { recursive: true },
  );
}

await mkdir(server, { recursive: true });
await writeFile(
  new URL('./index.js', server),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;

    const url = new URL(request.url);
    if (url.pathname.includes('.')) return response;

    url.pathname = url.pathname.endsWith('/')
      ? \`\${url.pathname}index.html\`
      : \`\${url.pathname}/index.html\`;

    return env.ASSETS.fetch(new Request(url, request));
  },
};
`,
);

await mkdir(metadata, { recursive: true });
await cp(
  new URL('../.openai/hosting.json', import.meta.url),
  new URL('./hosting.json', metadata),
);
