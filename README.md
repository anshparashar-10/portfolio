# Ansh Parashar — Portfolio

Space-themed portfolio built with React, Vite, Tailwind CSS, Three.js and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Structure

```
src/
  App.jsx                    page composition
  index.css                  Tailwind layers + shared component classes
  components/
    Starfield.jsx            canvas starfield, twinkles, resizes with viewport
    CursorGlow.jsx           radial glow that eases toward the cursor
    Navbar.jsx               sticky nav, scroll-spy, mobile drawer
    three/Globe.jsx          draggable wireframe globe + Indore marker
    sections/Hero.jsx        hero: globe, intro, specialty chips, socials
```

## Still to build

- Tech Stack section (categorised chips with logos)
- Journey timeline (alternating, scroll-revealed)
- Projects section (list + detail, 2D/3D view toggle)
- Contact section
- Ambient planets between sections

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at vercel.com/new.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
4. Deploy. Every push to `main` redeploys automatically.
