# Lurio — landing page de lanzamiento

Sitio de una página para **Lurio** (*Market Entry & Expansion Advisory · Colombia*), construido a partir del
*Web Developer Handoff v1.0* de `02. MARCA/`. Es una aplicación monolítica en Next.js (App Router): la página
se genera de forma estática y el formulario de contacto se procesa en la misma app mediante una Server Action.

- **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Vitest
- **Sin base de datos ni servicios externos obligatorios.** El envío del formulario se conecta a un webhook o a
  Resend mediante variables de entorno.
- **Idiomas:** inglés (`/en`, voz principal de la marca) y español (`/es`). Ver sección 5.

## Estructura del proyecto

```text
frontend/
  app/              Rutas, metadatos y adaptador Server Action
  components/       Interfaz y formulario
  content/          Textos en inglés y español
  lib/              Utilidades de presentación, idiomas y SEO
  public/           Logos, imágenes e iconos
  tests/            Pruebas de interfaz, contenido y conexión con backend
  .env.example      Configuración del proceso Next.js
backend/
  contact/          Antispam, coordinación y entrega de mensajes
  contracts/        Validación pura, tipos y estados compartidos
  tests/            Pruebas de negocio y entrega
scripts/            Preparación de activos
02. MARCA/          Materiales de referencia originales
```

La separación es de código y responsabilidades: **un único proceso y despliegue**.
`frontend/app/actions.ts` conecta el formulario con `backend/contact/submit.ts`.
Los componentes del navegador solo importan los contratos compartidos; el backend
no depende del frontend. ESLint comprueba estas restricciones.

La instalación, el lockfile y todos los comandos se mantienen en la raíz. Next.js
usa `frontend/` como carpeta de aplicación y genera allí su `.next/`. Los módulos
de `backend/` se incluyen en la compilación del servidor.

---

## 1. Instalación y entorno local

Requisitos: Node.js ≥ 20.9 (probado con Node 24) y npm.

```bash
npm install
cp frontend/.env.example frontend/.env.local   # opcional; ver sección 3
npm run dev                  # http://localhost:3000
```

Para probar el estado de éxito del formulario en local sin integración real, añade `CONTACT_DEV_LOG=true` a
`frontend/.env.local`: los envíos se imprimen en la consola del servidor (solo funciona en `npm run dev`).

> **Si la página se recarga sin parar en `npm run dev`:** Turbopack guarda una caché en `frontend/.next/` que puede
> quedar desactualizada tras mover o renombrar rutas (aparece `FATAL: An unexpected Turbopack error occurred` en
> la terminal). Detén el servidor, borra la carpeta `.next` y vuelve a ejecutar `npm run dev`.

## 2. Build de producción

```bash
npm run build    # genera frontend/.next/ (la home es estática)
npm run start    # sirve el build en http://localhost:3000
```

Otros scripts:

| Script | Qué hace |
|---|---|
| `npm run lint` | ESLint (config de Next) |
| `npm run typecheck` | Genera los tipos de rutas y ejecuta `tsc --noEmit` |
| `npm test` | Pruebas unitarias (validación, antispam, entrega, indexación, idiomas, sincronía de tokens) |
| `npm run assets` | Regenera los activos de `frontend/public/` desde `02. MARCA/` (ver sección 7) |

## 3. Variables de entorno

Todas son opcionales para ejecutar el sitio; ninguna debe commitearse (`.env*` está en `.gitignore`, excepto
`frontend/.env.example`).

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública confirmada (p. ej. `https://lurio.co`). Activa canonical, sitemap, URLs absolutas de Open Graph y datos estructurados `Organization`. **Pendiente de confirmar el dominio.** |
| `SITE_INDEXING` | `true` solo en el despliegue de producción definitivo. En cualquier otro caso se envía `noindex` y `robots.txt` bloquea todo. Los previews de Vercel nunca se indexan. |
| `CONTACT_WEBHOOK_URL` / `CONTACT_WEBHOOK_SECRET` | Destino del formulario (opción A). |
| `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` | Destino del formulario (opción B). |
| `CONTACT_DEV_LOG` | `true` = modo de desarrollo que solo registra en consola. Se ignora en producción. |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Solo si se autoaloja con varias instancias. |

> `NEXT_PUBLIC_SITE_URL` y `SITE_INDEXING` se leen en el build: cámbialas y vuelve a desplegar.

## 4. Formulario de contacto

Campos: nombre, correo profesional, empresa, interés (*Our Colombia expansion* / *Market Entry Assessment*) y
mensaje. El CTA secundario **“Assess your entry options”** enlaza a `#assessment-inquiry` y preselecciona el
interés *Market Entry Assessment*; los CTA principales enlazan a `#contact`.

**Flujo** (`frontend/app/actions.ts` → `backend/contact/`):

1. Normalización y validación (misma lógica en cliente y servidor: `backend/contracts/schema.ts`).
2. Antispam (`backend/contact/guard.ts`): campo trampa oculto, tiempo mínimo de llenado (3 s), límite de 5 envíos
   por IP cada 10 min y supresión de duplicados durante 30 min. El botón se desactiva mientras se envía.
3. Entrega (`backend/contact/delivery.ts`). **Solo se muestra éxito si el destino responde 2xx.**
4. Si no hay destino configurado, el visitante ve *“Our contact form isn't accepting messages right now”* sin
   detalles técnicos.

**Opción A — webhook (CRM, Zapier/Make/n8n, relay propio).** Define `CONTACT_WEBHOOK_URL` (https) y,
opcionalmente, `CONTACT_WEBHOOK_SECRET` (se envía como `Authorization: Bearer …`). Cuerpo JSON:

```json
{
  "source": "lurio-website",
  "interest": "assessment",
  "interestLabel": "Market Entry Assessment",
  "name": "…", "email": "…", "company": "…", "message": "…",
  "locale": "es",
  "submittedAt": "2026-09-27T12:00:00.000Z"
}
```

**Opción B — correo con [Resend](https://resend.com).** Verifica el dominio remitente en Resend y define
`RESEND_API_KEY`, `CONTACT_TO_EMAIL` (uno o varios, separados por comas) y `CONTACT_FROM_EMAIL`. El correo
llega con `reply-to` apuntando al visitante.

**Límites conocidos:** el rate limit y la deduplicación viven en memoria de cada instancia. En plataformas
serverless son una primera barrera; si aparece spam, añade un almacén compartido o un servicio antibots
(p. ej. Vercel BotID o Cloudflare Turnstile).

## 5. Idiomas (i18n)

- **Rutas:** `/en` y `/es`, ambas generadas estáticamente (`frontend/app/[lang]/`). `/` y cualquier ruta sin prefijo
  redirigen (`frontend/proxy.ts`) al idioma elegido antes con el selector (cookie `lurio-locale`), si no al del navegador
  (`Accept-Language`) y, por defecto, a inglés.
- **Selector EN / ES** en el header, el menú móvil y el footer. Mantiene la sección actual (`/en#about` →
  `/es#about`) y recuerda la elección.
- **Textos:** `frontend/content/dictionaries/en.ts` (fuente) y `frontend/content/dictionaries/es.ts`. Ambos deben tener exactamente
  la misma estructura: TypeScript y una prueba (`frontend/tests/i18n.test.ts`) fallan si falta una clave o cambia el
  número de elementos de una lista.
- **SEO:** `<html lang>`, títulos y descripciones por idioma, `og:locale` (en_US / es_CO), canonical por idioma,
  `hreflang` (en, es, x-default) y sitemap con alternativas cuando `NEXT_PUBLIC_SITE_URL` está definido.
- **Formulario:** los mensajes de validación se traducen en el cliente (el servidor devuelve códigos de error) y
  cada envío incluye `locale` para saber en qué idioma responder.
- **404:** `/es/lo-que-sea` muestra la 404 en español y `/en/...` en inglés. Las URL fuera de ambos idiomas
  muestran una 404 bilingüe (`frontend/app/global-not-found.tsx`).
- **Decisiones de traducción (a validar por los fundadores):** el español está **pendiente de aprobación**; es
  una adaptación del copy aprobado en inglés, no una traducción literal. Usa trato de *usted* (registro B2B
  ejecutivo). El tagline **Keep Expansion Moving** no se traduce (Brand Book), así que el hero en español es
  “Que su expansión siga avanzando.”. Los nombres de oferta se traducen (p. ej. “Evaluación de entrada al
  mercado colombiano”). La imagen de vista previa social tiene texto en inglés y se usa en ambos idiomas.
- **Añadir un idioma:** agregarlo a `locales` en `backend/contracts/locale.ts`, crear su diccionario en `frontend/content/dictionaries/` y
  registrarlo en `frontend/content/dictionaries/index.ts`.

## 6. Dónde editar

| Qué | Dónde |
|---|---|
| Textos de la landing (por idioma) | `frontend/content/dictionaries/en.ts`, `frontend/content/dictionaries/es.ts` (cada bloque indica su fuente en el handoff) |
| Anclas, rutas de imágenes, LinkedIn, política de privacidad | `frontend/content/site.ts` |
| Artículos de Insights | `frontend/content/insights.ts` (cada artículo indica su `locale`). Mientras un idioma no tenga artículos, la sección y su enlace no se muestran. |
| Secciones (maquetación) | `frontend/components/sections/*.tsx` |
| Header, menú móvil, footer, formulario | `frontend/components/` |
| Colores, tipografías, escala tipográfica, movimiento | `frontend/app/globals.css` (`@theme`). La paleta por defecto de Tailwind está desactivada: solo existen los colores oficiales. |
| Colores para metadatos/manifest | `frontend/lib/brand.ts` (una prueba verifica que coincide con `brand-tokens.json` y con el CSS) |
| Iconos, manifest, robots, sitemap | `frontend/public/favicon.ico`, `frontend/public/icons/`, `frontend/app/manifest.ts`, `frontend/app/robots.ts`, `frontend/app/sitemap.ts` |

Tipografías: Playfair Display (titulares) e Inter (cuerpo/UI), cargadas con `next/font/google`. Se autoalojan
en el build (licencia SIL OFL) con `font-display: swap`.

## 7. Activos de marca utilizados

Los originales de `02. MARCA/` no se modifican. `npm run assets` (`scripts/prepare-brand-assets.mjs`) copia o
deriva lo necesario a `frontend/public/` y `frontend/app/`.

| Destino | Origen (`Lurio_Web_Developer_Handoff_v1.0/…`) | Uso |
|---|---|---|
| `frontend/public/brand/lurio-wordmark-primary.png` | `01_Logos/Lurio_Wordmark_Primary.png`, recortado al wordmark | Header y 404 |
| `frontend/public/brand/lurio-lockup-reversed.png` | `01_Logos/Lurio_Wordmark_Reversed.png`, recortado con margen | Footer (su fondo es exactamente Midnight Ink) |
| `frontend/public/images/hero-architecture-passage.jpg` | `02_Web_Images/hero-architecture-source.jpg`, zona del pasaje | Hero |
| `frontend/public/images/abstract-curves-aperture.jpg` | `02_Web_Images/abstract-curves-source.jpg`, panel 1 | Sección *Open ecosystem* |
| `frontend/public/images/abstract-curves-arc.jpg` | `02_Web_Images/abstract-curves-source.jpg`, panel 3 | Tarjeta *Market Entry Assessment* |
| `frontend/public/images/lurio-og-1200x630-web.jpg` | `02_Web_Images/lurio-og-1200x630.jpg`, sin la franja derecha | Open Graph / Twitter |
| `frontend/public/favicon.ico`, `frontend/public/icons/*` | `03_Favicons/*` | Favicons, Apple Touch Icon, manifest |
| Tokens (`frontend/app/globals.css`, `frontend/lib/brand.ts`) | `04_Design_System/brand-tokens.{css,json}` | Sistema de color y tipografía |

**Por qué hay derivados en lugar de copias literales:**

- `hero-architecture*` y `abstract-curves*` son recortes de *brand boards* con copy incrustado que no está
  aprobado (“New markets. A brighter tomorrow.”, “A more connected world ahead.”, etc.). Solo se usan las zonas
  limpias. La resolución de origen es baja (≈650 px en el hero, ≈280 px en las curvas), así que se ven suaves en
  pantallas retina. **Conviene sustituirlas por originales en alta resolución.**
- `lurio-og-1200x630.jpg` muestra letras cortadas del panel vecino en el borde derecho. Se recorta y se
  restaura el tamaño 1200×630.
- Todos los logos incluyen el tagline, ilegible a tamaño de header, por eso el header usa solo la región del
  wordmark de la misma pieza. Los PNG se sirven sin recomprimir.
- No se usan los SVG de `01_Logos/`: su contenido es texto vivo con `font-family: Inter` y un rectángulo de fondo
  opaco. Dentro de un `<img>` se renderizarían con una fuente de sistema, es decir, reconstruidos, algo que el
  Brand Book prohíbe. **Conviene pedir SVG con el wordmark convertido a trazos.**
- Parchment: el handoff web usa `#F4EDE6` y el Brand Book/`Lurio_Brand_Assets_v1.0` usan `#FAEDE6`. Se usa el
  del handoff (fuente prioritaria para la web). **Hay que unificarlo en la paleta maestra.**
- No se añadieron imágenes del banco (`Lurio_Image_Bank_v1.0`): solo contiene enlaces de búsqueda, no archivos
  con licencia confirmada.

Fuera de la IA del handoff se añadió una sección breve **“Common questions”**, construida exclusivamente con
frases aprobadas y que responde objeciones que la estrategia de marca identifica (abogado vs. Lurio, asesores
propios, geografía). Se elimina borrando `<Faq />` en `frontend/app/[lang]/page.tsx`.

## 8. Despliegue

La app es un único proyecto Next.js. `.vercelignore` excluye `02. MARCA/` del despliegue.

**Vercel:** la estructura cambió y requiere ajustar la configuración del proyecto.
Usa `frontend` como *Root Directory* y permite incluir archivos fuera de esa carpeta
para que estén disponibles `backend/`, el `package.json` y el lockfile de la raíz.
Configura la instalación como `cd .. && npm ci` y el build como `cd .. && npm run build`;
el directorio de salida es `.next` relativo a `frontend`. No despliegues solo la carpeta
`frontend/`. Esta configuración queda pendiente de validación en el despliegue real.
Define las variables de la sección 3 en *Production*. Deja `SITE_INDEXING` vacío en *Preview*. Asigna el
dominio y vuelve a desplegar.

**Servidor propio (Node):** `npm ci && npm run build && npm run start` detrás de un proxy HTTPS. El proxy debe
enviar `X-Forwarded-For` (lo usa el rate limit) y `X-Forwarded-Host` (validación de origen de las Server
Actions). Con varias instancias, define `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.

No se ha desplegado nada: el sitio queda listo para revisión local.

## 9. Estado frente a `LAUNCH_CHECKLIST.md` y pendientes

Cumplido: wordmark original sin redibujar; Amethyst solo como acento; sin mapas, globos, flechas ni apretones de
manos; Playfair Display e Inter; Colombia como capacidad y LATAM como ambición; sin logos de clientes,
testimonios ni cifras; ningún texto presenta a Lurio como firma legal, contable, de reclutamiento o EOR; CTA con
ruta de conversión; 320 px, tablet y escritorio probados; navegación y formulario operables con teclado;
favicons, OG, meta tags, sitemap y robots; formulario con protección antispam y estados de error y éxito;
página 404 con la marca; un único H1 y títulos únicos; contraste WCAG AA.

**Pendiente de los fundadores antes de publicar:**

1. **Dominio** (`lurio.co` aparece en los documentos, pero no está confirmado) → `NEXT_PUBLIC_SITE_URL` y
   `SITE_INDEXING=true` solo en producción.
2. **Destino del formulario** (correo o CRM) → sección 4. Sin esto, el formulario muestra “no disponible”.
3. **Aviso de privacidad y tratamiento de datos.** El formulario recoge datos personales; en Colombia aplica la
   Ley 1581 de 2012. Se necesitan la razón social y un texto revisado por un especialista. Cuando exista la
   página, define `privacyPolicyPath` en `frontend/content/site.ts`: aparecerán el enlace en el footer y la nota en el
   formulario.
4. **Analítica y consentimiento de cookies:** hoy el sitio usa una cookie de preferencia de idioma y no incorpora analítica. Decidir herramienta y
   requisitos antes de añadirla.
5. **LinkedIn** → `linkedInUrl` en `frontend/content/site.ts`.
6. **Perfiles de fundadores incorporados.** La sección “Quiénes somos” incluye a
   Juan Diego Guzmán (Founder) y Nathalia Saavedra (Cofounder), con sus fotos y correos.
   Las fotos proporcionadas se conservan en `frontend/public/images/team/`; el comando
   `npm run assets` no las modifica. No se muestra un enlace personal a LinkedIn.
   La biografía de Juan Diego fue proporcionada por el fundador; la formación de
   Nathalia se contrastó con la [Universidad Icesi](https://www.icesi.edu.co/sitios/semana-desarrollo-profesional/)
   y fue confirmada por el usuario. Los textos se editan en `frontend/content/dictionaries/`.
7. **Contenido de Insights** aprobado → `frontend/content/insights.ts`.
8. **Aprobación del copy en español** (`frontend/content/dictionaries/es.ts`): registro de *usted*, hero, nombres de
   oferta y FAQ.
9. **Activos:** imágenes en alta resolución con licencia documentada (las actuales son sintéticas, generadas
   para la marca), SVG del wordmark en trazos y paleta maestra unificada (Parchment).
10. Probar la vista previa social en LinkedIn y otras plataformas con el dominio real.

## Revisión visual de la landing

El recorrido se compactó a hero, enfoque, assessment, servicios, ecosistema/diferenciación, nosotros, FAQ y contacto (Insights se añade cuando tenga contenido). El assessment aparece antes del catálogo de servicios. Los textos introductorios se abreviaron en ambos idiomas; las imágenes conservan los originales y se muestran a tamaños más contenidos. No se añadieron fotografías de personas, testimonios ni credenciales inexistentes. La fuente del hero sigue necesitando mayor resolución para pantallas de alta densidad.
