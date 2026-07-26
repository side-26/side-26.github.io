# Contact Message API

## Endpoint

`POST /api/contact/message`

The contact page submits its validated form data to this endpoint. The endpoint sends one
server-side email to the portfolio inbox through Nodemailer and Gmail SMTP. The visitor’s selected
contact method is included as the preferred reply channel.

## Authentication

Same-origin browser requests are accepted when their `Origin` matches
`CONTACT_FORM_ALLOWED_ORIGIN`. In local environments where that variable is omitted, the request
URL origin is used.

Trusted server callers can instead send the optional private API key as a bearer token:

```http
Authorization: Bearer <CONTACT_MESSAGE_API_KEY>
```

Keep this value on the server. Do not expose it through a `NEXT_PUBLIC_` environment variable.
Gmail credentials are always server-only.

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

The API returns `202 Accepted` after Gmail SMTP accepts the email:

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

The Route Handler calls an entity-owned Nodemailer transport configured with Gmail SMTP.
Configure:

- `SMTP_USER` with the Gmail account that sends and receives portfolio briefs
- `SMTP_APP_PASSWORD` with a dedicated Google App Password, never the normal account password
- `CONTACT_RECIPIENT_EMAIL` to override the portfolio’s configured contact email

The message includes the visitor’s name, role, project summary, preferred reply method, contact
detail, and request ID. Email submissions also set `replyTo` to the visitor’s validated email.
The request ID is included as an email header for traceability. SMTP responses and credentials are
never returned to the caller.

## Errors

Errors use this envelope:

```json
{
  "id": "generated-request-id",
  "message": "The request payload is invalid.",
  "data": {
    "code": "VALIDATION_ERROR",
    "messages": [
      {
        "name": "contactValue",
        "messages": ["Use a full Telegram profile URL, such as https://t.me/username."]
      }
    ]
  }
}
```

The same ID is returned in the `x-request-id` header. Non-validation failures omit
`data.messages` and keep their public error code in `data.code`.

Expected statuses include:

- `403` when neither a trusted bearer token nor a verified same-origin request is present
- `413` for an oversized body
- `415` for a non-JSON request
- `422` for invalid contact data
- `502` when Gmail SMTP rejects delivery with an unknown failure
- `503` when `SMTP_USER` or `SMTP_APP_PASSWORD` is not configured
- `503` with `DELIVERY_CONFIGURATION_ERROR` when Gmail rejects authentication
- `503` with `DELIVERY_TEMPORARILY_UNAVAILABLE` for temporary SMTP connection failures

## Tests

The adjacent `route.test.ts` covers same-origin enforcement, trusted bearer access, content type
and payload limits, all four reply methods, Gmail configuration, missing credentials,
authentication errors, temporary connection failures, and safe unknown failures. The entity
mailer tests verify the SMTP transport configuration and complete email envelope, while the entity
service test verifies the browser request path, request body, cache policy, and error propagation.
Shared route-handler and fetch-client tests cover the error envelope, validation-message mapping,
safe unknown failures, and client normalization.

Run:

```bash
pnpm test
```
