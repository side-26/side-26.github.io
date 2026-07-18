---
name: pre-prompt-workflow
description: Enforce Portfolio Front's prompt classification and conversation logging workflow. Use before answering every user request in the portfolio-front-app project to validate `fea:`, `fix:`, or `hotfix:` prompts and ID-based continuations, assign conversation IDs, and maintain Markdown records in the typed workflow directories under `docs/`.
---

# Pre-prompt Workflow

Apply this check before doing any task work or giving a substantive answer.

## Validate the prompt

Accept only one of these forms:

- `fea: <prompt>` for a new feature.
- `fix: <prompt>` for an improvement that is neither a new feature nor a bug fix.
- `hotfix: <prompt>` for a project bug fix.
- `<ID>: <prompt>` to continue an existing conversation. Resolve the ID by searching the records in `docs/fea/`, `docs/fix/`, and `docs/hotfix/`.

Treat tags as case-insensitive, but store them in lowercase. Require non-empty text after the colon.

If the prompt is invalid, do not analyze or execute it. Reply only with a short correction notice and these accepted formats, then stop. Repeat this behavior until a valid prompt arrives.

Repository workflow setup or maintenance requests that explicitly create or change this skill or `docs/workflow.md` are exempt from prompt validation.

## Start a conversation

For a valid tagged prompt:

1. Classify it from its explicit tag; do not silently change the user's tag.
2. Create an ID in the form `<TYPE>-<YYYYMMDD>-<NNN>`, such as `FEA-20260717-001`. Determine `NNN` by scanning existing records for that type and date, then use the next unused sequence.
3. Create `docs/<type>/<ID>.md` before task work, using the schema in `docs/workflow.md`.
4. Store the original prompt exactly and mark the record `In progress`.
5. Include the ID in the answer so the user can continue with `<ID>: <prompt>`.

## Continue a conversation

For a valid ID prompt:

1. Find exactly one matching record.
2. If none exists, notify the user that the ID is unknown and stop.
3. If duplicates exist, report the ambiguity and stop.
4. Append the user request and a concise summary of the response to the record's conversation log.
5. Keep the original prompt type and ID.

An ID continuation is a valid replacement for repeating the prompt-type tag.

## Complete and record work

After each valid exchange, update the record. When the requested work is fulfilled:

1. Set status to `Fulfilled`.
2. Set the completion date and time using the `Asia/Tehran` timezone.
3. Replace the working summary with a concise final summary of what was done, including relevant files and verification.
4. Ensure the document contains title, ID, time/date, prompt type, original prompt, status, summary, and conversation log.

If work is not yet fulfilled, leave status as `In progress`; the same ID remains usable for follow-ups.
