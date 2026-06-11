# VOIDSTEP — Premium Futuristic Shoe Brand Landing Page

A cinematic, award-winning product launch page inspired by Nike, Adidas, and Yeezy. Built with React, Three.js R3F, Framer Motion, GSAP, and Tailwind CSS.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **React + Vite** | App framework |
| **Three.js + React Three Fiber** | 3D shoe rendering |
| **@react-three/drei** | Helpers (OrbitControls, Environment, etc.) |
| **Framer Motion** | Section & component animations |
| **GSAP + ScrollTrigger** | Scroll-based cinematic transitions |
| **Lenis** | Smooth inertia scrolling |
| **Tailwind CSS v3** | Utility-first styling |
| **React Icons** | Icon library |
| **Three/postprocessing** | Bloom, DOF effects on 3D canvas |

---

## Proposed Changes

### Project Scaffolding

#### [NEW] Project root via Vite
- Initialize with `npx create-vite@latest ./ --template react`
- Install all dependencies
- Configure Tailwind CSS v3 with custom theme tokens

---

### Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── ShoeShowcase.jsx
│   │   ├── ProductExperience.jsx
│   │   ├── Features.jsx
│   │   ├── Stats.jsx
│   │   ├── Testimonials.jsx
│   │   ├── BrandStory.jsx
│   │   ├── Gallery.jsx
│   │   └── Newsletter.jsx
│   ├── three/
│   │   ├── ShoeModel.jsx         ← R3F 3D shoe (GLTF or procedural)
│   │   ├── HeroCanvas.jsx        ← Full-screen R3F canvas
│   │   ├── ProductCanvas.jsx     ← Interactive product viewer
│   │   └── ParticleField.jsx     ← Animated background particles
│   ├── ui/
│   │   ├── MagneticButton.jsx
│   │   ├── CursorGlow.jsx
│   │   ├── AnimatedCounter.jsx
│   │   ├── ProductCard.jsx
│   │   ├── TestimonialCard.jsx
│   │   ├── FeatureCard.jsx
│   │   └── Loader.jsx
│   └── hooks/
│       ├── useMousePosition.js
│       ├── useScrollProgress.js
│       └── useLenis.js
├── assets/
│   └── (images, fonts)
├── App.jsx
├── main.jsx
└── index.css
```

---

### Component Details

#### Navbar
- Fixed, blur-glass background on scroll
- Logo: "VOIDSTEP" in custom lettering
- Nav links with magnetic underline hover
- CTA "Buy Now" button with glow

#### Hero Section
- Full-screen black canvas with R3F shoe model
- Procedural animated shoe (geometry + PBR materials) if no GLTF
- Mouse parallax on 3D mesh
- Headline: "Step Into The Future" — character-by-character reveal
- Sub-copy + two CTA buttons
- Floating particle field (Three.js Points)
- GSAP ScrollTrigger fade-out on scroll

#### Shoe Showcase (3 Cards)
- Cards: glassmorphism, 3D tilt on mouse
- Products: VOIDSTEP X1, APEX RUNNER, LUNAR DRIFT
- Animated price reveal
- Quick View modal
- Stagger reveal on scroll entry

#### 3D Product Experience
- Dedicated R3F canvas (OrbitControls)
- Color switcher (3 colorways)
- Zoom + rotate
- Environment map (HDRI via drei)
- Bloom post-processing

#### Features (4 Cards)
- Viewport-triggered card animations
- Icons with animated SVG strokes
- Glassmorphism card style

#### Statistics (4 Counters)
- ScrollTrigger onEnter starts count-up
- Large display numbers

#### Testimonials
- Auto-play carousel (Framer Motion AnimatePresence)
- Glassmorphism cards
- Customer avatars (generated placeholder)

#### Brand Story
- Split-screen: left text timeline, right animated image
- Timeline line draws on scroll via GSAP
- Image reveal with clip-path animation

#### Gallery
- CSS Masonry grid (columns)
- Hover zoom & overlay
- Lightbox with Framer Motion

#### Newsletter
- Floating background orbs
- Email input with animated focus
- Success state animation

#### Footer
- Social icons, nav links, contact
- Subtle line animations

---

### Animation Strategy

| Type | Tool |
|---|---|
| Page load sequence | Framer Motion `AnimatePresence` |
| Scroll-triggered transitions | GSAP `ScrollTrigger` |
| Component mount/unmount | Framer Motion `motion.*` |
| 3D model rotation/parallax | Three.js `useFrame` |
| Smooth scroll inertia | Lenis |
| Counter animations | GSAP `to` with `snap` |
| Cursor glow | CSS + mouse events |
| Magnetic buttons | Custom hook |

---

### 3D Strategy

Since we cannot load external GLTF files (no server), the 3D shoe will be built **procedurally** using Three.js geometries combined into a convincing shoe silhouette, with:
- `MeshStandardMaterial` with metalness/roughness
- `Environment` preset lighting (drei)
- `PointLight` + `SpotLight` for dramatic shadows
- `Bloom` post-processing via `@react-three/postprocessing`

If the user wants to add a real GLTF shoe later, the `ShoeModel.jsx` component accepts a `modelUrl` prop.

---

## Open Questions

> [!IMPORTANT]
> **Brand Name**: I'll use **VOIDSTEP** as the brand. Let me know if you want a different name.

> [!IMPORTANT]
> **3D Model**: Since there is no external 3D shoe GLTF file available, I will build a **procedural 3D shoe silhouette** using Three.js geometry. It will look stylized and futuristic rather than photo-realistic. You can drop a real `.glb` file in `/src/assets/` later and it will swap in automatically.

> [!NOTE]
> **Images**: I will generate all product images and gallery images using the image generation tool, so no placeholders will be used.

---

## Verification Plan

### Automated
- `npm run dev` — confirm Vite dev server starts without errors
- Check browser console for Three.js / R3F errors

### Manual
- Scroll through all sections and verify animations trigger
- Test 3D canvas mouse interaction
- Test color switcher in product experience
- Verify responsive breakpoints (mobile, tablet, desktop)
- Check 60 FPS in Chrome DevTools Performance tab
