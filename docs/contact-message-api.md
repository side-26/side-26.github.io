# Contact Message API

## Endpoint

`POST /api/contact/messages`

This is a protected server-to-server endpoint. The contact page does not call it. A future trusted
server integration can submit the existing contact-form payload and the endpoint will forward it
to the fixed webhook configured for the selected channel.

## Authentication

Send the private API key as a bearer token:

```http
Authorization: Bearer <CONTACT_MESSAGE_API_KEY>
```

Keep this value on the server. Do not expose it through a `NEXT_PUBLIC_` environment variable or
call this endpoint directly from browser code.

## Request

```json
{
  "fullName": "Alex Morgan",
  "jobTitle": "Product lead",
  "projectSummary": "We need a reliable customer portal with a focused onboarding flow.",
  "contactMethod": "telegram",
  "contactValue": "https://t.me/alexmorgan"
}
```

Supported `contactMethod` values:

- `email`
- `phoneNumber`
- `telegram`
- `instagram`

`contactValue` is validated according to the selected method. Requests must use
`Content-Type: application/json` and may not exceed 16 KiB.

## Successful response

The API returns `202 Accepted` after the selected webhook accepts the request:

```json
{
  "data": {
    "channel": "telegram",
    "messageId": "generated-request-id",
    "status": "accepted"
  }
}
```

The `x-request-id` response header contains the same identifier.

## Delivery

Each channel maps to a fixed HTTPS webhook:

- `CONTACT_EMAIL_WEBHOOK_URL`
- `CONTACT_PHONE_WEBHOOK_URL`
- `CONTACT_TELEGRAM_WEBHOOK_URL`
- `CONTACT_INSTAGRAM_WEBHOOK_URL`

If `CONTACT_MESSAGE_WEBHOOK_TOKEN` is configured, it is sent to the webhook as a bearer token.
Webhook URLs and provider responses are never returned to the caller.

The outgoing event name is `contact.message.created` and its version is `1`.

## Errors

Errors use this envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request payload is invalid.",
    "requestId": "generated-request-id"
  }
}
```

Expected statuses include:

- `401` for invalid or missing API credentials
- `413` for an oversized body
- `415` for a non-JSON request
- `422` for invalid contact data
- `502` when webhook delivery fails
- `503` when the API or selected channel is not configured

## Tests

The adjacent `route.test.ts` covers authentication, content type and payload limits,
method-specific validation, all four webhook mappings, response headers, provider authorization,
missing configuration, provider errors, and network failures.

Run:

```bash
pnpm test
```
