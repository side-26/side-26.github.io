# Component Creation Workflow

Use these rules whenever creating or reorganizing React components in this project.

## Atomic components

- Place every atomic or base-level component in `src/components/base/`.
- Name component files with concise lowercase names, such as `image.tsx` or `button.tsx`.
- Keep each base component focused on one primitive responsibility and make visual behavior configurable through typed props.
- Prefer Server Components. Add `"use client"` only when browser APIs, state, effects, or event handlers require it.
- Preserve semantic HTML and accessibility requirements in the base component API.
- Support both LTR and RTL content by inheriting or accepting `dir` and using logical properties for directional spacing and positioning.
- Support both light and dark themes with semantic design tokens, preserve readable contrast in each theme, and avoid assumptions about the active color scheme.
- Import components directly from their files, such as `@/components/base/image`; do not add barrel files.

## Composition

- Build larger UI components by composing base components rather than duplicating their behavior.
- Keep application-specific content and layout decisions outside base components.
- Add responsive and performance-sensitive props when the underlying Next.js primitive requires them.

## Global components

- Place components and providers mounted by the root layout and shared across the entire application in `src/components/global/`.
- Keep the root layout as a Server Component and isolate context, state, effects, and browser APIs inside the smallest possible Client Component boundary.
- Pass root-layout content through global providers as `children` so Server Components remain server-rendered.
- Import global components directly from their files; do not add barrel files.
