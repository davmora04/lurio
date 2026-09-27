# Accessibility & performance requirements

## Accessibility target
WCAG 2.2 AA.

## Required checks
- Keyboard accessible navigation and forms.
- Visible focus states.
- Skip-to-content link.
- Alt text for meaningful images; decorative imagery alt="".
- Labels associated with all form controls.
- Error messages readable by screen readers.
- Do not use small all-caps copy for long paragraphs.
- Respect prefers-reduced-motion.
- Color contrast:
  - normal text >= 4.5:1
  - large text >= 3:1

## Performance
Suggested Lighthouse targets:
- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

## Images
- Use provided WebP assets.
- Responsive srcset.
- width/height attributes to prevent layout shift.
- Hero may preload if it is the LCP image.
- Lazy-load below-the-fold imagery.

## Fonts
Use `font-display: swap`.
Self-host only if licensing and deployment permit; otherwise load from a reputable provider.
Preconnect only to origins actually used.

## JavaScript
No heavy animation library needed for launch.
The brand should derive its personality from typography, imagery and composition, not front-end gimmicks.
