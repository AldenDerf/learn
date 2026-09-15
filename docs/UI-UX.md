# UI and UX guidelines

## Standards and references

Target WCAG 2.2 Level AA. Use native HTML first and WAI-ARIA Authoring Practices for custom widgets. These guidelines are a development target, not a claim that the current app is compliant.

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Accessibility acceptance criteria

- All actions work by keyboard, with visible focus that sticky UI does not obscure. Provide a skip link and semantic landmarks.
- Use one descriptive page H1 and an ordered heading hierarchy. Give buttons accessible names and inputs persistent labels with associated errors.
- Normal text contrast: at least 4.5:1; large text: 3:1. Essential controls and visual states need 3:1 non-text contrast where WCAG requires it. Do not communicate status by color alone.
- Reflow at 320 CSS px without page-wide horizontal scrolling; allow contained scrolling for code and genuinely two-dimensional tables. Preserve usability at 200% zoom.
- Meet WCAG's 24 by 24 CSS px minimum target size or applicable spacing/exception; prefer 44 by 44 for primary touch controls as a project usability target.
- Respect reduced-motion preferences. Avoid unnecessary motion and flashing effects.
- Supply useful instructional image alt text; decorative images use empty alt text. Label tables and preserve associations between headers and cells.
- Dialogs need focus management, Escape dismissal where appropriate, and focus return. Announce asynchronous save/error feedback without unnecessarily moving focus.

## Learning experience

- Prioritize readable handouts: project defaults of 16-18 px body text, roughly 60-75 characters per line, and 1.6-1.8 line height. These are design choices, not WCAG requirements.
- Show subject, chapter, lesson title, location in the outline, and previous/next lessons consistently.
- Make the chapter outline collapsible on small screens; keep the reading area dominant.
- Keep code language labels, copy feedback, and contained overflow. Use readable print styles for classroom handouts.
- Preserve educational text when changing its presentation. Do not replace a handout with a summary.
- Show loading, empty, error, and success states for data-backed features. Avoid decorative dashboards with fabricated metrics.

## Future lesson and admin states

- Distinguish Draft, Locked, Available, and Completed with text plus an icon when helpful.
- A locked lesson can expose its title and explanation, but never its protected body. Avoid prefetching protected content for unauthorized students.
- Clearly distinguish saving a draft, publishing, and unlocking. Show success only after persistence succeeds.
- Retain completion records when a lesson is relocked; explain what completion measures.
- Provide a keyboard alternative to drag-and-drop reordering. Protect unsaved edits and offer recovery from failed saves.

## Visual consistency and review

- Use shared semantic tokens for color, typography, spacing, borders, and focus. Reuse the current Nextra layout until an intentional UI migration is scoped.
- When shadcn/ui is introduced, reuse its accessible primitives and inspect the resulting behavior; a library is not proof of accessibility.
- Verify changed screens at mobile and desktop sizes, with keyboard-only navigation, zoom, and every supported theme.
- Record browser checks and any limitations. Automated accessibility checks supplement manual review; they do not establish full compliance.
