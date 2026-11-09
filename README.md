# RastroCero — Landing page

Sitio público de RastroCero. Cuenta dos cosas, por separado:

- **Plataforma** (presente): lo que un banco puede probar hoy. Se sube la cartera en una sola
  planilla; Emissions Banker, el asistente de la plataforma, la lee, propone la clase de activo y
  la actividad de cada operación y pregunta lo que no puede saber; el motor calcula con
  metodología PCAF; el trabajo pasa a la cartera oficial cuando lo aprueba otra persona. La
  plataforma no tiene nombre de producto. El módulo operativo no se ofrece en esta etapa y no
  aparece en el sitio.
- **Visión / Bankers / Proceso** (futuro): el equipo de Climate Bankers autónomos que estamos
  construyendo. Emissions Banker es el primero de los cinco y el único que ya existe: va en
  presente y con la marca «En la plataforma»; los otros cuatro, en futuro y «En construcción».

Qué no decir:

- Emissions Banker hoy **no es autónomo**: propone y pregunta, y el equipo del banco confirma cada
  decisión. «Autónomos» es la visión del equipo de bankers, no el producto actual.
- Ningún nombre de banco ni de cliente, tampoco el del piloto. El repo es público.
- Nada de «cumple PCAF», «alineado con…», «verde» ni comparaciones entre bancos: son las mismas
  afirmaciones que el producto le prohíbe al asistente. Se dice «metodología PCAF».
- «Oficial» es una clasificación interna de la plataforma (referencias autorizadas y alcances 1 y 2
  completos), no una certificación externa.
- El asistente usa un proveedor de modelos externo, así que no vale «los datos no salen de tu red».
  Lo que sí vale: cada institución lo habilita o no, elige el nivel de datos y la retención, y en
  el nivel más restrictivo los montos, las emisiones, los nombres y los códigos de las operaciones
  no se envían al proveedor.

Los títulos de sección son de una o dos palabras (Plataforma, Visión, Bankers, Proceso, Seguridad,
Contacto).

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
  sections/      bloques de la home (Hero, Challenge, Platform, Vision [Vision, Bankers, BankersProcess], Security, CtaBand)
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
- `Platform` reúne todo lo de la plataforma: `AppMockup` (réplica del shell real: riel de íconos,
  barra lateral de Emissions Banker y tres pantallas que rotan solas: la conversación que lleva una
  planilla de la carga al resultado, el Dashboard de la cartera oficial y la Bandeja donde otra
  persona aprueba), cuatro paneles (carga única, una pregunta por texto, oficial o estimación,
  calidad del dato), las nueve clases de activo y el flujo Subí → Confirmá → Calculá → Aprobá.
  Las cifras son de ejemplo, el sitio lo indica, y son las mismas en la maqueta y en los paneles:
  486 filas = 431 calculadas + 24 y 12 en espera + 19 fuera de alcance; los sectores suman el
  total oficial.
- `Security` muestra una operación como la guarda la plataforma: método, referencia sectorial
  usada, cada alcance por separado («No informado» cuando falta, nunca 0), año del dato, el cálculo
  que reemplazó y el snapshot con la versión del motor.
- `Vision.tsx` es el capítulo de la visión, sobre fondo oscuro: sin tarjetas ni botones. Cada
  banker lleva su estado al lado del nombre.
- `FlowLines` reutiliza las líneas animadas del fondo de la plataforma (CTA y contacto).
- Criterio: un solo botón lleno por pantalla, títulos en un color, sin íconos decorativos;
  la jerarquía la hacen la tipografía y las líneas finas, como en la plataforma.

El idioma se elige con el botón ES/EN, con `?lang=en` en la URL, y se recuerda por navegador.

## Deploy

Build estático (`dist/`) en Cloudflare Pages: cada push a `main` publica en producción y cada rama
genera un preview. `public/_redirects` hace el fallback SPA.
