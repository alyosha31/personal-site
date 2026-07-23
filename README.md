# personal-site

Personal blog and project site built with [Astro](https://astro.build/) and
managed with [Bun](https://bun.sh/).

The site is intentionally simple: writing is the primary focus, with room to
add a project portfolio later.

## Prerequisites

- Bun `1.3+`

## Local development

```bash
bun install
bun run dev
```

Astro will print a local URL, usually `http://localhost:4321`.

## Build

```bash
ASTRO_TELEMETRY_DISABLED=1 bun run build
```

The generated static site is written to `dist/`.

## Project structure

```text
src/pages/index.astro   Homepage
app/globals.css         Shared visual styles
public/                 Static assets
astro.config.mjs        Astro configuration
```

## Writing workflow

Blog posts will live as Markdown files in `src/content/posts/`. A typical post
will look like this:

```md
---
title: "A post title"
date: "2026-07-18"
description: "A short description for previews and search."
---

The article goes here.
```

Once the content collection is connected, publishing a post will be:

```text
write Markdown → commit → push to GitHub → rebuild the site
```

## Repository

The source repository is:

https://github.com/alyosha31/personal-site
