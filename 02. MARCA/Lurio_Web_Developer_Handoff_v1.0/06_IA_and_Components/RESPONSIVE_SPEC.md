# Responsive behavior

## Breakpoints (reference, not mandatory)
- Small: < 640px
- Medium: 640–1023px
- Large: >= 1024px
- Wide: >= 1440px

## Layout
Desktop container max: 1280px.
Page gutters:
- mobile 20–24px
- tablet 32–48px
- desktop 64–80px

## Hero
Desktop: split layout.
Mobile: stack copy before image. Do not reduce H1 below ~52px unless viewport demands it.

## Type
Use clamp() rather than hard breakpoint jumps.

## Images
Serve responsive WebP using srcset.
Use object-fit: cover and intentional focal points.
Hero focal point is usually center-right / architecture opening.

## Navigation
Collapse to menu below ~900px.
Keep CTA accessible in the menu.

## Cards
3–4 columns desktop → 2 tablet → 1 mobile.

## Accessibility
Never rely on color alone for state.
Text over imagery requires tested contrast or a solid overlay.
