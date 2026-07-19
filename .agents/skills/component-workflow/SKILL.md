---
name: component-workflow
description: Enforce Portfolio Front's React and Next.js component architecture, accessibility, direction, theme, glass-surface, and verification rules. Use whenever creating, moving, composing, styling, reviewing, or auditing project components, including atomic components, global providers, shadcn primitives, fields, controls, cards, overlays, menus, and other visible UI surfaces.
---

# Component Workflow

Apply the project component rules consistently without expanding client boundaries or adding decorative treatment to components that do not own a visible surface.

## Workflow

1. Read `../../../docs/component-workflow.md` completely before changing component code.
2. Read the relevant local Next.js guide in `node_modules/next/dist/docs/` before writing Next.js code.
3. If `components.json` exists or shadcn components are involved, use the project shadcn skill and fetch the current component documentation before editing.
4. Inspect the existing component, nearby primitives, semantic tokens, and call sites before choosing an implementation.
5. Classify the component as atomic, composed, global, visible-surface, or structure-only, then follow the matching project rules.
6. Preserve server rendering by adding `"use client"` only to the smallest component that needs browser state, effects, handlers, or client-only context.
7. Format and verify the affected code with the repository's native checks. Include a production build when the change can affect Next.js rendering or CSS generation.

## Glass Decision

- Apply the glass visual language whenever a component owns a visible surface or interactive control. Examples include buttons, inputs, textareas, cards, dialogs, sheets, popovers, dropdowns, navigation surfaces, and tooltips.
- Start neutral surfaces with the semantic `tw:glass-surface` utility. Adapt component variants only when their hierarchy or state requires a different translucent semantic background.
- Preserve legible contrast, focus visibility, invalid and disabled states, light and dark themes, RTL and LTR behavior, and the opaque reduced-transparency fallback.
- Keep providers, layout-only wrappers, field structure, labels, separators, and raw media visually neutral unless they explicitly own a rendered surface. Do not add blur, background, borders, or shadows merely because they render markup.
- Avoid stacking multiple blur layers for one visual surface. Apply glass to the element that owns the boundary, not every nested child.

## Component Boundaries

- Place atomic primitives under `src/components/base/` and import their files directly.
- Place root-layout providers and project-wide components under `src/components/global/`.
- Compose larger features from base primitives instead of duplicating primitive behavior.
- Use typed props, semantic HTML, accessible naming and state, logical directional properties, and semantic theme tokens.
- Keep application-specific content and page layout outside atomic components.
