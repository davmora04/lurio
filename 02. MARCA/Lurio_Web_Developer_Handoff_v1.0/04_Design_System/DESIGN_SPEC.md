# Lurio web design system — implementation notes

## Brand intent
Distinctive sophistication: credible at first glance, distinctive on second glance.
The website should feel resourceful, approachable, sharp and confident — never flashy, startup-ish or bureaucratic.

## Typography
- Display/headlines: Playfair Display 500–600.
- Body/UI: Inter 400–600.
- Wordmark: always use the supplied artwork where possible; do not recreate the logo as live text in production.
- Do not ship font files from this package. Use a properly licensed web source. Google Fonts is acceptable for Playfair Display and Inter.

Suggested responsive scale:
- H1: clamp(3.5rem, 7vw, 6.5rem), line-height .93–1.0
- H2: clamp(2.25rem, 4vw, 4rem), line-height 1.0–1.08
- H3: 1.6–2.25rem
- Body large: 1.125–1.25rem
- Body: 1rem
- Eyebrow: .72–.8rem, uppercase, tracking .18–.24em

## Color behavior
- Primary authority: Midnight Ink.
- Primary differentiation/accent: Amethyst Violet.
- Warm background: Parchment / near-white.
- Orchid and Rose Beige are supporting colors; do not let them dominate.
- Avoid gradients unless extremely subtle; the identity is architectural/editorial, not tech-startup.
- Recommended ratio on core pages: 50–60% white/parchment, 25–35% ink/charcoal, 8–12% amethyst, <=8% orchid/rose.

## Graphic language
Use confident curved/architectural crops, large image planes, generous negative space and asymmetric editorial compositions.
Avoid:
- thin consulting-style line systems,
- maps/globes,
- arrows as growth metaphors,
- handshake stock imagery,
- network nodes,
- excessive rounded cards.

## Photography
Prefer real business context, architecture, operating environments, people in purposeful conversation, and subtle Colombia/LATAM context.
Do not turn the website into country-promotion imagery.

## Interaction
- Motion should be calm and purposeful: 180–350ms.
- Favor fades, small vertical reveals and measured image movement.
- No bouncing, playful spring effects or novelty cursor interactions.
