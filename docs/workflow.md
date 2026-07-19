# Prompt and Conversation Workflow (v1)

This workflow defines how prompts for the `portfolio-front-app` project are classified, validated, identified, and documented. The pre-prompt checks are mandatory before answering or acting on a project request.

## Prompt types

| Tag      | Meaning                                                    | Example                                        |
| -------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `fea`    | A new feature or capability                                | `fea: add a saved-search page`                 |
| `fix`    | An improvement that is neither a new feature nor a bug fix | `fix: improve the empty-state wording`         |
| `hotfix` | A fix for a bug in the project                             | `hotfix: stop the checkout page from crashing` |

Start a conversation with:

```text
<prompt-type>: <prompt>
```

Continue an existing conversation with:

```text
<ID>: <prompt>
```

Tags are case-insensitive and are normalized to lowercase. Text after the colon is required.

## Mandatory pre-prompt check

Before every substantive answer or action:

1. Accept a new prompt only when it starts with `fea:`, `fix:`, or `hotfix:`.
2. Accept a continuation only when it starts with an existing conversation ID.
3. If the format is invalid, provide only a brief format reminder and stop. Do not answer or execute the request.
4. Repeat the validation for every later user message while the conversation is active.

An ID continuation is valid and does not need the prompt-type tag again. Requests that explicitly maintain this workflow or its skill are exempt so the workflow can be installed or repaired.

## IDs and storage

Each new tagged conversation receives an ID:

```text
<TYPE>-<YYYYMMDD>-<NNN>
```

Example: `FEA-20260717-001`.

`NNN` is the next unused three-digit sequence for that prompt type and date. Records are stored by type:

- `docs/fea/<ID>.md`
- `docs/fix/<ID>.md`
- `docs/hotfix/<ID>.md`

Create the record before beginning task work. Update it after every valid user/assistant exchange. Keep it `In progress` until the requested work is fulfilled, then finalize it as `Fulfilled`.

## Conversation record format

```markdown
# <Title>

- ID: `<ID>`
- Created: `<YYYY-MM-DD HH:mm Asia/Tehran>`
- Completed: `<YYYY-MM-DD HH:mm Asia/Tehran or —>`
- Prompt type: `<fea|fix|hotfix>`
- Status: `<In progress|Fulfilled>`

## Original prompt

<Exact original prompt text>

## Summary

<Concise summary of what was done, relevant files, and verification>

## Conversation log

### <timestamp> — User

<User request>

### <timestamp> — Assistant

<Concise summary of the answer and actions>
```

The completed record must contain the title, time/date, prompt type, original prompt, and final summary requested for v1. It also retains the ID, status, and exchange log so work can be resumed reliably.
