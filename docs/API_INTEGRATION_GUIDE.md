# JOD Mobile API — Frontend Integration Guide

Endpoint-by-endpoint reference for wiring the React Native app in `src/` to the
real backend described in `MOBILE_API_CONTRACT.md`. Every section gives the
exact request shape, the exact success response, the error responses that can
come back, and — where it applies — a **⚠️ Doesn't match existing code**
callout pointing at the specific file that will need to change.

Work through it in this order: **Auth → Discovery → Me → your own posts →
engagement → reports.** That's also the order a user hits these screens in.

---

## 0. Before you write a single call

### Base URL & headers

```
Base URL: http://<host>/api/mobile
```

Every request:

```
Accept: application/json
Content-Type: application/json        (omit on GET/DELETE with no body)
Authorization: Bearer <token>          (once logged in)
```

Put the base URL behind an env var (`EXPO_PUBLIC_API_URL` or similar) — never
hardcode `localhost`.

### The envelope — every response, success or failure, has this shape

```jsonc
{
  "success": true,
  "message": "Human-readable summary",
  "data": { /* or array, or null */ },
  "error": null,
  "meta": { /* pagination / viewer info, or null, or [] — see note below */ }
}
```

Build **one** response wrapper in `src/lib/api.ts` that:
1. Attaches `Authorization` and `Accept`/`Content-Type` headers.
2. Unwraps `data` on success, throws a typed `ApiError` built from `error` on failure.
3. On `401`, clears the session and routes to `/(auth)/login` (see the note on
   token refresh at the end of §1.6 — there's no refresh endpoint in this
   contract, so don't build a refresh-queue for one that may not exist).

> ⚠️ **`meta`'s shape is not consistent across endpoints.** It's an `object`
> with pagination fields on list endpoints, an empty-item `array` on most
> mutation endpoints, a plain `object` on engagement toggles, but a bare
> **`string`** on `/me`, `/me/profile`, and `/me/permissions`. Don't write one
> shared TypeScript type for `meta` — type it per-endpoint, or treat it as
> `unknown` and ignore it unless a specific endpoint's docs below say to read it.

### Shared error shapes (referenced by number below instead of repeated in full)

**`401` — Authentication Error** (session missing/expired):
```json
{ "message": "Unauthenticated." }
```
Note this one does **not** follow the `{success,message,data,error,meta}`
envelope — it's just `{ message }`. Your wrapper needs a special case for 401.

**`403` — Authorization Error** (logged in, but not allowed to act on this resource):
```json
{
  "success": false,
  "message": "This action is unauthorized.",
  "data": null,
  "error": { "code": "forbidden", "message": "...", "details": null },
  "meta": null
}
```

**`404` — Not Found:**
```json
{
  "success": false,
  "message": "Resource not found.",
  "data": null,
  "error": { "code": "not_found", "message": "...", "details": null },
  "meta": null
}
```

**`422` — Validation Error** (field-level, keyed by field name):
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "data": null,
  "error": {
    "code": "validation_error",
    "message": "...",
    "details": {
      "email": ["The email field is required."]
    }
  },
  "meta": null
}
```
`details` is a map of field name → array of error strings for that field.
Build one form-error mapper that takes `error.details` and calls
`setError(field, { message: messages[0] })` for each key — every screen using
`react-hook-form` can reuse it.

---

## 1. Auth

### 1.1 `POST /auth/register` — Register a mobile account

**Auth:** none (public)

**Request body:**
```json
{
  "name": "Ahmad Mohammad",
  "email": "ahmad@example.com",
  "phone": "0999999999",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```
| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | ✅ | max 255 |
| `email` | string | ✅ | valid email format, max 255 |
| `phone` | string \| null | optional | max 20 |
| `password` | string | ✅ | min 8 |
| `password_confirmation` | string | ✅ | min 8, must match `password` |

**Success `200`:**
```json
{
  "success": true,
  "message": "Registered successfully.",
  "data": {
    "token": "1|abc123...",
    "tokenType": "Bearer",
    "user": {
      "id": "usr_01",
      "name": "Ahmad Mohammad",
      "email": "ahmad@example.com",
      "phone": "0999999999",
      "userType": null,
      "status": null,
      "organizationId": null,
      "organization": null,
      "createdAt": "2026-08-16T10:00:00Z",
      "lastActiveAt": null
    }
  },
  "error": null,
  "meta": []
}
```
Store `token` (SecureStore, not AsyncStorage, since it's a real bearer
credential now) and the `user` object as the session.

**Errors:** `422` Validation Error.

> ⚠️ **Doesn't match existing code** — [`app/(auth)/register.tsx`](../app/(auth)/register.tsx)
> currently collects `firstName`, `lastName`, `phoneNumber` and **never asks
> for an email**, while the server requires one. You need to:
> 1. Add an email field to the form (with `zod` email validation to match server rules).
> 2. Combine `firstName`/`lastName` into the single `name` string the API expects (or drop the split and just collect one name field).
> 3. Send `password_confirmation`, not just `confirmPassword` — same value, different key name for the wire format.
> 4. Replace `setMockAuth({ firstName, lastName, phoneNumber })` with storing the real `token` + full `user` object — [`src/lib/auth.ts`](../src/lib/auth.ts)'s `MockAuthUser` type has no `email`, `id`, `userType`, `status`, `organizationId`, `organization`, `createdAt`, or `lastActiveAt` fields at all. This type needs to be replaced with the server's `user` shape, not extended.

---

### 1.2 `POST /auth/login` — Log in

**Auth:** none (public)

**Request body:**
```json
{
  "email": "ahmad@example.com",
  "phone": null,
  "password": "Password123!"
}
```
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string \| null | optional | valid email format if present |
| `phone` | string \| null | optional | max 20 |
| `password` | string | ✅ | min 8 |

> The schema does **not** enforce "at least one of email/phone" — that's presumably a server-side business rule, not a schema constraint. Confirm with the backend which identifier(s) actually work before assuming phone-only login is supported.

**Success `200`:** identical shape to register's response (`token`, `tokenType`, `user`).

**Errors:** `422` Validation Error (also used for "invalid credentials" — check `message`, not just the status code, to distinguish "wrong password" from "malformed request").

> ⚠️ **Doesn't match existing code** — [`app/(auth)/login.tsx`](../app/(auth)/login.tsx)
> only has a `phoneNumber` field and calls `setMockAuth` with a hardcoded
> placeholder name (`"مستخدم"`). You'll need to decide the real login UX —
> phone field, email field, or a single "email or phone" field — then send it
> as whichever key (`email` or `phone`) matches what the user typed, and store
> the real returned `user` object instead of a placeholder.

---

### 1.3 `POST /auth/forgot-password` — Request a password reset code

**Auth:** none (public)

**Request body:**
```json
{ "login": "0999999999" }
```
`login` (string, max 255) — a single field for either email or phone.

**Success `200`:**
```json
{
  "success": true,
  "message": "Reset code sent.",
  "data": { "resetCodeSent": true },
  "error": null,
  "meta": []
}
```

**Errors:** `422` Validation Error.

---

### 1.4 `POST /auth/verify-reset-code` — Verify the reset code

**Auth:** none (public)

**Request body:**
```json
{ "login": "0999999999", "code": "482913" }
```
| Field | Type | Constraints |
|---|---|---|
| `login` | string | max 255, same value sent to forgot-password |
| `code` | string | **exactly 6 characters** |

**Success `200`:**
```json
{
  "success": true,
  "message": "Code verified.",
  "data": { "resetCodeVerified": true },
  "error": null,
  "meta": []
}
```

**Errors:** `422` Validation Error (wrong/expired code).

---

### 1.5 `POST /auth/reset-password` — Set the new password

**Auth:** none (public)

**Request body:**
```json
{
  "login": "0999999999",
  "code": "482913",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```
`code` must be exactly 6 characters, same as §1.4. `password`/`password_confirmation` min 8, must match.

**Success `200`:**
```json
{
  "success": true,
  "message": "Password reset.",
  "data": { "resetPasswordUpdated": true },
  "error": null,
  "meta": []
}
```

**Errors:** `422` Validation Error.

> ⚠️ **Doesn't match existing code — this is a concrete bug waiting to happen, not just a naming gap.** [`app/(auth)/reset-password.tsx`](../app/(auth)/reset-password.tsx) implements a 4-step wizard (phone → code → password → success), but:
> - `VERIFICATION_CODE_LENGTH = 4` — the UI renders **4** boxes and validates a 4-digit code, while the server requires **exactly 6 characters** for `code` in both `verify-reset-code` and `reset-password`. This will reject every code a real user enters until the constant is changed to 6 and `VerificationCodeInput` is given 6 boxes.
> - The "verify code" step (`goToPasswordStep`) currently only runs local Zod validation — it never calls `/auth/verify-reset-code`. You need to add that network call between steps 2 and 3, and only advance to the password step on `resetCodeVerified: true`.
> - `submitNewPassword` currently just flips to the success step locally — it needs to actually call `/auth/reset-password` with the collected `login`/`code`/`password` and only show the success screen after `resetPasswordUpdated: true` comes back.
> - The screen collects `phoneNumber` specifically; the API's `login` field is generic (email or phone), so decide whether this screen stays phone-only or also accepts email.

---

### 1.6 `POST /auth/logout` — Log out

**Auth:** Bearer token required

**Request body:** none

**Success `200`:**
```json
{ "success": true, "message": "Logged out.", "data": null, "error": null, "meta": [] }
```

**Errors:** `401` Authentication Error.

Revokes the current token server-side. Call this **before** clearing local
storage, not after — if the network call fails, keep the local token so the
user isn't silently logged out of a token the server still considers valid.

> **No `/auth/refresh` endpoint exists anywhere in this contract**, despite
> `MOBILE_API_CONTRACT.md`'s own implementation guide describing a
> "queue concurrent requests during refresh and replay them" strategy. Don't
> build that queuing logic against an endpoint that isn't documented. Simplest
> correct behavior until this is clarified with the backend: on any `401`,
> clear the session and send the user to `/(auth)/login` — no silent retry.

---

## 2. Discovery — public, no token needed, powers the home feed

### 2.1 `GET /discovery/posts` — List posts

**Auth:** none (public; response `meta.viewer.isAuthenticated` tells you if a token was sent along and recognized)

**Query params** (all optional):
| Param | Type | Values |
|---|---|---|
| `page` | integer | ≥ 1 |
| `perPage` | integer | 1–100 |
| `search` | string | max 255 |
| `status` | string | `published` |
| `type` | string | max 50 (e.g. `volunteer_opportunity`, `donation_campaign`, `help_request`) |
| `location` | string | max 255 |
| `organizationId` | string | — |
| `sort` | string | `title`, `-title`, `updatedAt`, `-updatedAt` |
| `sortBy` | string | `title_asc`, `title_desc`, `updated_oldest` |

**Success `200`:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "post_123",
      "title": "فرصة تطوع لتنظيم التوزيع",
      "summary": "مطلوب 20 متطوع لتنظيم وتوزيع السلال الغذائية...",
      "type": "volunteer_opportunity",
      "status": "published",
      "organizationName": "جمعية عطاء",
      "authorName": "أحمد محمد",
      "location": "دمشق",
      "campaignTitle": null,
      "submittedAt": "2026-08-10T09:00:00Z",
      "createdAt": "2026-08-10T09:00:00Z",
      "updatedAt": "2026-08-10T09:00:00Z",
      "publishedAt": "2026-08-10T09:05:00Z",
      "reviewedBy": "admin_1",
      "rejectionReason": null,
      "viewsCount": 340,
      "reactionsCount": 58,
      "applicationsCount": 12
    }
  ],
  "error": null,
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 87,
    "lastPage": 5,
    "viewer": { "isAuthenticated": true, "userId": "usr_01", "organizationId": null }
  }
}
```

> ⚠️ **This is the most important mismatch in the whole contract — plan around it before building the feed.** The app's `HomePost` type ([`src/types/home.ts`](../src/types/home.ts)) and `HomePostCard` UI expect: a full `publisher` object (with `avatarUrl`, `bio`, `phoneNumber`, `whatsappNumber`), a `content` body, an `images` array, a `cta` action, and `stats.{likes, comments, shares}`.
>
> **None of that is in this response.** You get `organizationName`/`authorName` as plain strings (no id, avatar, or contact info at all), `summary` instead of full `content`, no `images` field, no `commentsCount` or `sharesCount` (only `reactionsCount` and `viewsCount`), and no CTA/action field. Concretely, this means:
> - `src/lib/engagement.ts`'s `openPostContact()` — which reads `post.phoneNumber`/`post.whatsappNumber`/`post.publisher.phoneNumber`/`post.publisher.whatsappNumber` to open WhatsApp or dial a number — **has no data source from this endpoint.** There is no phone/WhatsApp field anywhere in the discovery response. The donate/apply "contact the organization" flow that the whole app is built around cannot be populated from this contract as documented. This needs to be raised with the backend explicitly — either the field is missing from the spec, or organization contact details are meant to come from a different endpoint not yet shown.
> - Card images, like counts, comment counts, and share counts on the feed will need to either come from a different endpoint or be dropped from v1 of the integration.
> - `HomePost.postType` values (`volunteer_opportunity`, `donation_campaign`, `help_request`, `campaign_update`, `awareness`) only line up with 3 of these 5 for `type` — there's no server equivalent for `campaign_update` or `awareness`, since those aren't valid `PostRequest.type` values either (see §4.1).

**Errors:** `422` Validation Error (bad query params).

---

### 2.2 `GET /discovery/posts/{post}` — Show one post

**Auth:** none (public)

**Path param:** `post` (string, the post id)

**Success `200`:** same object shape as one item from §2.1's `data` array, wrapped as a single object (not an array) in `data`. `meta` here is just `{ viewer: {...} }` — no pagination fields.

**Errors:** none of the documented `4xx` responses are listed for this one besides the implicit 404 for a bad id (not explicitly spec'd — handle a non-200 defensively).

> ⚠️ Same gap as §2.1: **no `content`/`details` field and no `images` array even on the single-post detail view.** If a full description and photos are needed on the post-detail screen (`app/posts/[id].tsx`), this endpoint as documented can't supply them — only `summary` is available. Flag this to the backend: a detail endpoint returning the same fields as the list endpoint (just `summary`, no full body) is unusual and worth double-checking isn't a spec-generation omission.

---

### 2.3 `GET /discovery/campaigns` — List active campaigns

**Auth:** none (public)

**Query params:**
| Param | Values |
|---|---|
| `page`, `perPage` | same as §2.1 |
| `search` | max 255 |
| `status` | `active` |
| `category` | max 50 |
| `location` | max 255 |
| `organizationId` | string |
| `sort` | `updatedAt`, `-updatedAt`, `progress`, `-progress` |
| `sortBy` | `updated_oldest`, `progress_highest`, `progress_lowest` |

**Success `200`:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "camp_1",
      "title": "سلال غذائية للأسر المتعففة",
      "summary": "حملة لتأمين احتياجات غذائية شهرية لـ 200 أسرة.",
      "category": "donation",
      "status": "active",
      "organizationName": "جمعية عطاء",
      "managerName": "أحمد محمد",
      "location": "دمشق",
      "goalAmount": 500000,
      "raisedAmount": 174000,
      "beneficiariesCount": 200,
      "donorsCount": 340,
      "applicantsCount": 0,
      "startDate": "2026-04-01",
      "endDate": "2026-05-10",
      "submittedAt": "2026-03-28T00:00:00Z",
      "createdAt": "2026-03-28T00:00:00Z",
      "updatedAt": "2026-08-01T00:00:00Z",
      "closedAt": null,
      "closedReason": null,
      "reviewedBy": "admin_1",
      "rejectionReason": null
    }
  ],
  "error": null,
  "meta": { "currentPage": 1, "perPage": 20, "total": 12, "lastPage": 1, "viewer": { "isAuthenticated": false, "userId": "usr_01", "organizationId": null } }
}
```

> ⚠️ **Doesn't match existing code** — the app's local types split this into two separate interfaces, `DonationCampaign` and `VolunteeringCampaign` ([`src/types/models.ts`](../src/types/models.ts)), each with different fields (`goalAmount`/`raisedAmount` vs `requiredVolunteers`/`joinedVolunteers`). The real API models **one unified `Campaign` resource** that carries both donor and applicant/volunteer counters (`donorsCount` *and* `applicantsCount` together, differentiated by `category`). Plan to replace both local types with one `Campaign` type matching this shape, and branch UI on `category`/`applicantsCount > 0` vs `donorsCount > 0` instead of on two separate TypeScript interfaces.
>
> Also: **read-only.** There is no `POST /campaigns` or contribute/apply action anywhere in this contract — this confirms the donate/apply screens' existing "contact the organization directly" behavior ([`app/donate/[id].tsx`](../app/donate/[id].tsx), [`app/apply/[id].tsx`](../app/apply/[id].tsx)) is the actual intended mechanism, not a placeholder waiting for a real form.

**Errors:** `422` Validation Error.

---

### 2.4 `GET /discovery/campaigns/{campaign}` — Show one campaign

**Auth:** none (public). Same object shape as one item from §2.3, `meta` reduced to just `{ viewer }`.

---

### 2.5 `GET /discovery/categories` — List categories

**Auth:** none (public)

**Query params:** `page`, `perPage`, `search` (max 255), `status` (`active`), `target` (`post` | `campaign`), `sort` (`createdAt`, `-createdAt`).

**Success `200`:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "cat_1",
      "name": "إغاثة عاجلة",
      "target": "post",
      "description": "منشورات الحالات الطارئة",
      "usageCount": 42,
      "status": "active",
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "error": null,
  "meta": { "currentPage": 1, "perPage": 20, "total": 6, "lastPage": 1, "viewer": {...} }
}
```

> There's no local type for this at all yet — add a `Category` type to `src/types/`. Note `target` splits categories between `post` and `campaign` use, so filter this list by `target` before showing it in the create-post category picker vs. anywhere campaigns are filtered.

---

## 3. Me — the authenticated user's own account

### 3.1 `GET /me` — Get your profile

**Auth:** Bearer token

**Success `200`:**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "usr_01",
    "name": "Ahmad Mohammad",
    "email": "ahmad@example.com",
    "phone": "0999999999",
    "userType": "individual",
    "status": "active",
    "organizationId": null,
    "organization": null,
    "createdAt": "2026-08-16T10:00:00Z",
    "lastActiveAt": "2026-08-16T11:30:00Z"
  },
  "error": null,
  "meta": "some string, ignore it"
}
```
Call this on app launch (after confirming a token exists) to hydrate the
session rather than trusting a locally-cached user object indefinitely.

**Errors:** `401` Authentication Error.

---

### 3.2 `PATCH /me/profile` — Update your profile

**Auth:** Bearer token

**Request body:**
```json
{ "name": "Ahmad M.", "email": "ahmad@example.com", "phone": "0999999999" }
```
`name` and `email` required, `phone` optional/nullable.

**Success `200`:** same `user` shape as §3.1.

**Errors:** `401`, `422`.

> ⚠️ [`app/edit-information.tsx`](../app/edit-information.tsx) / `EditInformationScreen` should be checked against this — if it currently edits fields like username or bio that aren't in `ProfileRequest` (`name`/`email`/`phone` only), those fields have no server-side home yet.

---

### 3.3 `PATCH /me/change-password` — Change password

**Auth:** Bearer token

**Request body:**
```json
{
  "currentPassword": "OldPassword123!",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Success `200`:**
```json
{ "success": true, "message": "Password changed.", "data": { "passwordChanged": true }, "error": null, "meta": [] }
```

**Errors:** `401`, `422` (wrong current password surfaces here too — check `message`).

> Note the field is `currentPassword` (camelCase) but `password_confirmation`
> (snake_case) — that's not a typo to "fix," match it exactly as documented.

---

### 3.4 `GET /me/permissions` — Get your permission catalogue

**Auth:** Bearer token

**Success `200`:**
```json
{ "success": true, "message": "OK", "data": [ /* untyped items */ ], "error": null, "meta": "string" }
```

> The array's item shape isn't documented (`items: {}` in the schema — genuinely empty/untyped). Before building any role-gated UI (e.g. showing publisher-only screens) off this, get a real example response from the backend team — don't guess the shape.

**Errors:** `401`.

---

### 3.5 `GET /me/posts` — List your own posts

**Auth:** Bearer token

**Query params:**
| Param | Values |
|---|---|
| `page`, `perPage` | as before |
| `filter[status]` | `draft`, `pending`, `active`, `rejected`, `archived` |
| `sort` | `createdAt`, `-createdAt`, `updatedAt`, `-updatedAt`, `title`, `-title` |

**Success `200`:**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "post_123",
      "ownerId": "usr_01",
      "title": "حملة دعم طلاب المدارس",
      "details": "شرح كامل للهدف من المنشور...",
      "city": "دمشق",
      "type": "help_request",
      "categoryId": "cat_1",
      "images": [],
      "status": "pending",
      "rejectionReason": null,
      "createdAt": "2026-08-15T12:00:00Z",
      "updatedAt": "2026-08-15T12:00:00Z",
      "publishedAt": null
    }
  ],
  "error": null,
  "meta": { "currentPage": 1, "perPage": 20, "total": 3, "lastPage": 1 }
}
```

> ⚠️ **Status vocabulary doesn't match.** `src/types/posts.ts`'s `PostStatus` is `pending | published | in_progress | completed | rejected | removed`. The real filter values are `draft | pending | active | rejected | archived`. Only `pending` and `rejected` are shared. `published` → `active`, and `removed` is closest in spirit to `archived` but isn't the same lifecycle event (archived posts can be reposted via §4.6; there's no `in_progress`/`completed` concept server-side at all). **Rewrite `PostStatus` to match the server's 5 values before wiring any status-branching UI** (the "edit a rejected post" flow in `CreatePostScreen`, status badges, filters).
>
> Also note this endpoint *does* return `details` and `images` for your own posts — unlike the public discovery endpoints (§2.1/§2.2) which only return `summary` and nothing image-related. Full content is available for posts you own; it's the public-read side that's missing it.

**Errors:** `401`, `422`.

---

### 3.6 `GET /me/saved-posts` — List saved posts

**Auth:** Bearer token

**Query params:** `page`, `perPage`.

**Success `200`:** same item shape as §2.1's discovery posts, plus one extra field: `savedAt`. Same `commentsCount`/`sharesCount`/images/content gaps noted in §2.1 apply here too.

**Errors:** `401`, `422`.

---

## 4. UserPost — create, edit, and manage your own posts

### 4.1 `POST /posts` — Create a draft or submit a new post

**Auth:** Bearer token

**Request body (submitting for review):**
```json
{
  "type": "help_request",
  "title": "حملة دعم طلاب المدارس",
  "details": "اشرح الهدف من المنشور، الفئة المستهدفة، وكيف يمكن المساعدة.",
  "city": "دمشق",
  "categoryId": "cat_1",
  "images": [],
  "saveAsDraft": false
}
```
| Field | Type | Required | Constraints |
|---|---|---|---|
| `type` | string | ✅ | one of `volunteer_opportunity`, `donation_campaign`, `help_request` |
| `title` | string | conditionally ✅ | 4–255 chars — required unless `saveAsDraft: true` |
| `details` | string | conditionally ✅ | min 10 chars — required unless `saveAsDraft: true` |
| `city` | string | conditionally ✅ | 2–100 chars — required unless `saveAsDraft: true` |
| `categoryId` | string \| null | optional | id from §2.5 |
| `images` | string[] \| null | optional | **`maxItems: 0`** — see the callout below |
| `saveAsDraft` | boolean | optional | `true` skips the title/details/city requirement above |

> ⚠️ **Blocking issue — read before wiring `CreatePostScreen`.** The `images`
> field is schema'd with `"maxItems": 0`, meaning any array you send **must be
> empty**. As documented, this endpoint cannot accept photos at all.
> [`CreatePostScreen`](../src/components/pages/create-post/CreatePostScreen.tsx)
> already has a full multi-image picker (`handlePickImages`, `selectedImages`
> state) wired up and ready to submit. **Get a direct answer from the backend
> team before shipping this screen against the real API**: is there a
> separate multipart upload endpoint not shown in this contract, or is image
> upload genuinely not supported yet? Don't silently drop the picked images —
> confirm first.

> ⚠️ **Post-type vocabulary is narrower than the app's UI.** `CreatePostScreen`'s
> `postTypes` array offers `volunteer` / `donation` / `help` (labels: فرصة تطوع
> / حملة تبرع / طلب مساعدة) — these map fairly directly to `volunteer_opportunity`
> / `donation_campaign` / `help_request`, so the 3-way picker itself is fine.
> But `src/types/menu.ts`'s `CreatePostType` (`"volunteer" | "donation" | "help"`)
> and `src/types/posts.ts`'s unrelated `PostType` (`"offer" | "request"`) are two
> different, inconsistent local vocabularies for what the server calls `type` —
> consolidate on one type alias that maps 1:1 to the three server enum values.

**Success `200`:**
```json
{
  "success": true,
  "message": "Post created.",
  "data": {
    "id": "post_124",
    "ownerId": "usr_01",
    "title": "حملة دعم طلاب المدارس",
    "details": "اشرح الهدف من المنشور...",
    "city": "دمشق",
    "type": "help_request",
    "categoryId": "cat_1",
    "images": [],
    "status": "pending",
    "rejectionReason": null,
    "createdAt": "2026-08-16T12:00:00Z",
    "updatedAt": "2026-08-16T12:00:00Z",
    "publishedAt": null
  },
  "error": null,
  "meta": []
}
```
A `saveAsDraft: true` request returns the same shape with `"status": "draft"`.

**Errors:** `401`, `403`, `422`.

---

### 4.2 `PATCH /posts/{post}` — Update a draft or rejected post

**Auth:** Bearer token. **Path param:** `post` id.

**Request body:** same `PostRequest` shape as §4.1 (all fields, same rules).

**Success `200`:** same post object shape as §4.1.

**Errors:** `401`, `403` (not your post, or post isn't in an editable state), `404`, `422`.

> Server summary says this only works on a **draft or rejected** post — attempting to edit an `active`/`pending` post will presumably 403. Gate the "edit" button in the UI on `status === 'draft' || status === 'rejected'`, matching the server's own restriction, so the user doesn't hit a 403 after filling out a whole form.

---

### 4.3 `DELETE /posts/{post}` — Delete your post

**Auth:** Bearer token. **Path param:** `post` id.

**Success `200`:**
```json
{ "success": true, "message": "Post deleted.", "data": null, "error": null, "meta": [] }
```

**Errors:** `401`, `403`, `404`.

---

### 4.4 `POST /posts/{post}/submit` — Submit or resubmit for review

**Auth:** Bearer token. **Path param:** `post` id. **Request body:** none.

**Success `200`:** post object, `status` now `pending`.

**Errors:** `401`, `403`, `404`, `422`.

> This is the call that belongs behind `CreatePostScreen`'s "إعادة إرسال للمراجعة" (resubmit) button in edit mode — right now that button only shows a local confirmation dialog and never hits the network (`handleConfirmSubmit` just sets local state on a timeout). Wire it to this endpoint.

---

### 4.5 `POST /posts/{post}/archive` — Archive an active post

**Auth:** Bearer token. **Path param:** `post` id. **Request body:** none.

**Success `200`:** post object, `status` now `archived`.

**Errors:** `401`, `403`, `404`.

---

### 4.6 `POST /posts/{post}/repost` — Repost an archived post

**Auth:** Bearer token. **Path param:** `post` id. **Request body:** none.

**Success `200`:** post object (check the returned `status` — likely back to `pending` for re-review, confirm with backend rather than assuming).

**Errors:** `401`, `403`, `404`.

---

## 5. PostEngagement — like & save

Both of these are **idempotent toggles**: calling `POST` when already liked/saved, or `DELETE` when not, is safe and just returns the current state.

### 5.1 `POST /posts/{post}/like` / `DELETE /posts/{post}/like`

**Auth:** Bearer token. **Path param:** `post` id (called `post` in the path but described as "the post identifier" — same thing).

**Success `200`:**
```json
{
  "success": true,
  "message": "Liked.",
  "data": { "postId": "post_123", "isLiked": true, "likesCount": 59 },
  "error": null,
  "meta": {}
}
```
`DELETE` (unlike) returns the same shape with `isLiked: false` and the decremented count.

**Errors:** `401`, `404`.

> Note the field is `likesCount` here, but the discovery list (§2.1) calls the
> same number `reactionsCount`. Reconcile these under one name in your local
> types rather than treating them as two different counters.

---

### 5.2 `POST /posts/{post}/save` / `DELETE /posts/{post}/save`

**Auth:** Bearer token. **Path param:** `post` id.

**Success `200`:**
```json
{
  "success": true,
  "message": "Saved.",
  "data": { "postId": "post_123", "isSaved": true, "savesCount": 12 },
  "error": null,
  "meta": {}
}
```

**Errors:** `401`, `404`.

---

## 6. PostReport — flag content

### 6.1 `POST /posts/{post}/reports` — Report a post

**Auth:** Bearer token. **Path param:** `post` id.

**Request body:**
```json
{ "reason": "محتوى مضلل", "details": "تفاصيل اختيارية توضح سبب البلاغ." }
```
| Field | Type | Required | Constraints |
|---|---|---|---|
| `reason` | string | ✅ | 3–100 chars |
| `details` | string \| null | optional | max 180 chars |

**Success `200`:**
```json
{
  "success": true,
  "message": "Report submitted.",
  "data": { "id": "report_1", "postId": "post_123", "status": "pending" },
  "error": null,
  "meta": {}
}
```
"Every valid submission creates a new report" — this is not idempotent like
§5; don't debounce/dedupe client-side beyond disabling the button after one
successful submit, since a resubmit is a genuinely new report, not a toggle.

**Errors:** `401`, `404`, `422`.

> No "report" UI exists anywhere in the app yet (no report button on
> `HomePostCard` or the post detail screens) — this is a feature to build from
> scratch, not one to reconcile against existing code.

---

## Summary — what to fix, in build order

1. **Confirm image upload with the backend** (§4.1) before finishing `CreatePostScreen` — this blocks the single most-built feature in the app.
2. **Confirm the contact-info gap** (§2.1) — no phone/WhatsApp field exists anywhere in the public post/campaign responses, and `openPostContact()` has nothing to read. This affects the donate and apply screens directly.
3. **Rebuild the auth screens** around `email` + the real `user` shape (§1.1–1.2), and fix the reset-password code length from 4 to 6 digits and wire its two dead network calls (§1.5).
4. **Rewrite `src/types/posts.ts`** to match the real `type`/`status`/field vocabulary instead of the unrelated `offer`/`request` model it has now (§3.5, §4.1).
5. **Merge `DonationCampaign`/`VolunteeringCampaign`** into one `Campaign` type matching §2.3.
6. Everything else in this doc is additive — new types, new calls, no existing code to reconcile.
