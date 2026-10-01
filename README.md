# RastroCero — Landing page

Sitio público de RastroCero: contabilidad de carbono para instituciones financieras
(GHG Protocol alcances 1, 2 y 3 + emisiones financiadas PCAF).

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · React Router 7 · lucide-react.
Bilingüe (ES/EN) sin librerías de i18n.

## Scripts

```bash
npm install
npm run dev      # servidor local
npm run build    # typecheck + bundle en dist/
npm run lint
```

## Variables de entorno

Copiar `.env.example` a `.env`:

| Variable | Uso |
|----------|-----|
| `VITE_WEB3FORMS_KEY` | Clave de Web3Forms para el formulario de `/contact` |

## Estructura

```
src/
  i18n/          textos ES/EN (translations.ts) y contexto de idioma
  components/    Navbar, Footer, AppMockup, FlowLines, Logo, Reveal, SectionHeading
  sections/      bloques de la home (Hero, ProductView, Challenge, Modules, Process, Security, CtaBand)
  pages/         Home y Contact
public/brand/    logos recortados, paisaje de hojas (webp) y hoja; hero/ = arte del hero
```

## Sistema visual

Los tokens de `src/index.css` (`--color-r0-*`) son los mismos de la plataforma
(`R0_PLATFORM/frontend/src/index.css`), así el sitio y el producto se leen como un solo sistema.
Se suman tres colores corporativos: `r0-leaf` (hoja del logo), `r0-ink` (gris del logotipo) y
`r0-sun` (acento de energía).

- Tipografía: Montserrat para títulos (la del logotipo) e Inter para texto.
- Logo: gris + hoja verde sobre fondo claro, blanco + hoja verde sobre fondo oscuro,
  todo blanco sobre el verde de marca (`components/Logo.tsx`).
- El hero ocupa toda la pantalla (`min-h-svh`); su arte se mueve lento (deriva en dos ejes +
  corrientes SVG sobre las olas, bloque `Hero stream` en `index.css`) y se detiene con
  `prefers-reduced-motion`.
- `AppMockup` (en `ProductView`) replica el shell real de la plataforma y alterna solo entre el
  dashboard operativo y el selector PCAF. Sus cifras son ilustrativas y consistentes entre sí.
- `Modules` presenta Operativo y PCAF en dos paneles: alcances 1-2-3 y la escala DQS 1→5.
- `FlowLines` reutiliza las líneas animadas del fondo de la plataforma (CTA y contacto).
- Criterio: un solo botón lleno por pantalla, títulos en un color, sin íconos decorativos;
  la jerarquía la hacen la tipografía y las líneas finas, como en la plataforma.

El idioma se elige con el botón ES/EN, con `?lang=en` en la URL, y se recuerda por navegador.

## Deploy

Build estático (`dist/`). `public/_redirects` hace el fallback SPA para Netlify.
