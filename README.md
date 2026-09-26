# Life, rewritten

**New on this branch:** [a one-minute, silent hand-painted cartoon](animation/README.md), made in JavaScript with p5.js and p5.brush. See its storyboard and rendering instructions in `animation/`.

A general-audience, interactive 3D history of genetic engineering: from an ancient bacterial arms race to recombinant human insulin.

**[Explore the website](https://andrewliew86.github.io/Genetic-engineering-in-a-nutshell-animation/)**

Seven timeline chapters include short animations, explanatory captions, pause/resume and replay. Drag to orbit the models and scroll to zoom. With the canvas focused, arrow keys rotate and `+` / `-` zoom.

## How it was created

Developed with assistance from OpenAI Codex, starting from a cinematic science-story concept and refined into an interactive website. This repository is a standalone static adaptation of the initial Sites prototype.

- **React 19 + TypeScript** manage chapters, explanations and playback controls.
- **Three.js** renders procedural 3D geometry in WebGL: cells, phages, DNA strands, plasmids and simplified protein chains. These are educational models, not molecular-dynamics simulations or recorded videos.
- **`requestAnimationFrame`** drives approximately eight-second sequences with eased movement and staged captions. Playback pauses in place and can be replayed; camera controls remain available.
- **Vite 8** builds static HTML, CSS and JavaScript. The 3D module loads separately. No backend, API key, account or paid service is required by the site.
- **GitHub Actions** checks TypeScript, builds the site and publishes `dist/` to GitHub Pages on pushes to `main`.

## Run locally

Use Node.js 22.13 or newer (Node 22 recommended) and npm:

```sh
npm ci
npm run dev
```

`npm run build` checks types and creates `dist/`; `npm run preview` serves that build locally. Open the URL printed by Vite. The repository subpath is set in `vite.config.ts`; change `base` if the repository is renamed or a custom domain is used.

## Where to edit

- `src/App.tsx`: chapter content, timeline and controls.
- `src/world.tsx`: geometry, animation sequences and camera controls.
- `src/styles.css`: layout, theme and responsive styles.
- `.github/workflows/pages.yml`: automatic deployment; Pages uses **GitHub Actions** as its publishing source.

## Scientific context

Colours, shapes, scales and timing are illustrative. The ancient scenes do not claim an exact origin date for phages, plasmids or restriction systems. The insulin sequence illustrates the early two-chain method. Sources are also linked within the website:

- [Restriction enzymes — Hamilton Smith's Nobel lecture](https://www.nobelprize.org/uploads/2018/06/smith-lecture.pdf)
- [Plasmids — NHGRI](https://www.genome.gov/genetics-glossary/Plasmid)
- [Recombinant plasmids — 1973 paper](https://pubmed.ncbi.nlm.nih.gov/4594039/)
- [Somatostatin milestone — Genentech](https://www.gene.com/stories/the-paper)
- [Insulin history — FDA](https://www.fda.gov/about-fda/fda-history-exhibits/100-years-insulin)
