# Component Workflow

Use these rules whenever creating, reorganizing, styling, reviewing, or auditing React components in this project.

## Atomic components

- Place every atomic or base-level component in `src/components/base/`.
- Name component files with concise lowercase names, such as `image.tsx` or `button.tsx`.
- Keep each base component focused on one primitive responsibility and make visual behavior configurable through typed props.
- Prefer Server Components. Add `"use client"` only when browser APIs, state, effects, or event handlers require it.
- Preserve semantic HTML and accessibility requirements in the base component API.
- Support both LTR and RTL content by inheriting or accepting `dir` and using logical properties for directional spacing and positioning.
- Support both light and dark themes with semantic design tokens, preserve readable contrast in each theme, and avoid assumptions about the active color scheme.
- Import components directly from their files, such as `@/components/base/image`; do not add barrel files.

## Visual language

- Make every component that owns a visible UI surface or interactive control glassy. This includes buttons, inputs, textareas, cards, dialogs, sheets, popovers, dropdowns, navigation surfaces, tooltips, and similar surface-bearing components.
- Start neutral surfaces with `tw:glass-surface`, which provides a translucent semantic background, subtle semantic border, restrained highlight and shadow, backdrop blur and saturation, and an opaque reduced-transparency fallback.
- Adapt the translucent background by component variant when hierarchy or state requires it, while keeping the same glass depth cues and semantic theme tokens.
- Preserve readable contrast, visible focus, invalid and disabled states, light and dark themes, RTL and LTR behavior, and reduced-transparency preferences.
- Apply glass once to the element that owns the visual boundary. Avoid stacking blur across nested elements belonging to the same surface.
- Keep providers, layout-only wrappers, field structure, labels, separators, and raw media visually neutral unless they explicitly own a visible surface. Do not add glass styling solely because a component renders markup.

## Composition

- Build larger UI components by composing base components rather than duplicating their behavior.
- Keep application-specific content and layout decisions outside base components.
- Add responsive and performance-sensitive props when the underlying Next.js primitive requires them.
- Let the outermost surface-owning component provide the glass treatment; nested structural children should inherit the visual context.

## Global components

- Place components and providers mounted by the root layout and shared across the entire application in `src/components/global/`.
- Keep the root layout as a Server Component and isolate context, state, effects, and browser APIs inside the smallest possible Client Component boundary.
- Pass root-layout content through global providers as `children` so Server Components remain server-rendered.
- Import global components directly from their files; do not add barrel files.
