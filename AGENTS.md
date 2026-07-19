<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio Front Agent Instructions

Before handling any user request in this repository, use the project-local `pre-prompt-workflow` skill at `.agents/skills/pre-prompt-workflow/SKILL.md`. Enforce its prompt validation, ID continuation, and conversation-record requirements.

## Component Creation

Before creating, reorganizing, styling, reviewing, or auditing React components, use the project-local `component-workflow` skill at `.agents/skills/component-workflow/SKILL.md` and follow `docs/component-workflow.md`. In particular, place all atomic components in `src/components/base/` and apply the glass visual language to components that own visible UI surfaces.
