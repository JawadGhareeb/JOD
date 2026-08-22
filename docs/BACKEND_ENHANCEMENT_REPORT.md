# JOD Mobile — Backend Enhancement Report

**Audience:** Backend / API team  
**From:** Mobile app (React Native / Expo)  
**Date:** 2026-08-22  
**Contract reference:** `MOBILE_API_CONTRACT.md` (`/api/mobile`)

This report lists what the **existing mobile UI** needs that the current Mobile API does not fully support. It is ordered by impact so you can plan work in phases.

---

## Summary

| Priority | Theme | Impact |
|---|---|---|
| P0 | Post images (write + read) | Create-post photos cannot be saved |
| P0 | Publisher contact (`phone` / WhatsApp) | Donate / apply / contact flows have no number to open |
| P0 | Feed / detail / saved payload enrichment | Cards and detail screens cannot render fully from contract shape |
| P0 | Profile fields (`city`, `bio`, `username`, `stats`, …) | Profile + edit-information UI cannot persist/display correctly |
| P1 | Viewer state (`isLiked`, `isSaved`) | Heart / bookmark always start empty |
| P1 | Author / organization public profile | Author screen has no dedicated endpoint |
| P1 | Search / sort / CTA filters | Search UI filters exceed discovery query params |
| P2 | Whole domains: blogs, notifications, donations history | Screens exist; API does not |
| P2 | Token refresh | Contract intro mentions refresh; no endpoint in OpenAPI |

**Already usable for mobile (no change required for basic flows):**  
auth register/login/logout/forgot/verify/reset, `GET /me`, change password, own-post lifecycle (`/posts`, submit/archive/repost/delete), like/unlike, save/unsave, report endpoint, basic discovery list, `/me/posts`, `/me/saved-posts`, categories list.

---

## P0 — Blocking for current UI

### 1. Post images on create / update

**UI:** Create Post screen lets users pick photos.

**Problem:** `PostRequest.images` is schema’d with `maxItems: 0`, so the mobile client cannot send images.

**Ask:**
- Raise `maxItems` to a real limit (e.g. 1–5), **or**
- Add a dedicated media upload endpoint (multipart) that returns public URLs to attach on create/update.
- Return `images: string[]` on:
  - `GET /discovery/posts`
  - `GET /discovery/posts/{post}`
  - `GET /discovery/campaigns`
  - `GET /discovery/campaigns/{campaign}`
  - `GET /me/saved-posts`
  - `GET /me/posts` (already closer; keep consistent)

**Suggested write shape:**
```json
{
  "type": "help_request",
  "title": "...",
  "details": "...",
  "city": "دمشق",
  "categoryId": "...",
  "images": ["https://cdn.example.com/posts/1.jpg"],
  "saveAsDraft": false
}
```

---

### 2. Contact channel for donate / apply / contact

**UI:** Donate, apply, and “contact” CTAs open WhatsApp or the phone dialer. There is **no in-app payment or application form**.

**Problem:** Discovery / campaign responses expose flat `organizationName` / `authorName` (or similar) with **no phone or WhatsApp number**.

**Ask:** Add contact fields on the publisher (preferred) or on the post/campaign:

```ts
publisher: {
  id: string
  name: string
  username?: string
  avatarUrl?: string | null
  verified?: boolean
  phoneNumber?: string | null
  whatsappNumber?: string | null
}
```

Required on at least:
- `GET /discovery/posts`
- `GET /discovery/posts/{post}`
- `GET /discovery/campaigns`
- `GET /discovery/campaigns/{campaign}`
- `GET /me/saved-posts`

Without this, donate/apply screens cannot function against live data.

---

### 3. Enriched discovery / saved-post response shape

**UI:** Home card, post detail, search results, saved posts.

**Problem:** OpenAPI list/detail items are too flat for the card (`summary`, `authorName`, `organizationName`, `reactionsCount`, …). The app needs a richer shape (and live responses may already diverge — **please update the OpenAPI to match reality**).

**Ask — target item shape (minimum):**
```json
{
  "id": "…",
  "title": "…",
  "content": "…",
  "images": ["…"],
  "status": "published",
  "location": "دمشق",
  "createdAt": "…",
  "campaignId": null,
  "publisher": {
    "id": "…",
    "name": "…",
    "username": "…",
    "avatarUrl": null,
    "verified": false,
    "city": "دمشق",
    "bio": null,
    "phoneNumber": "09xxxxxxxx",
    "whatsappNumber": "09xxxxxxxx"
  },
  "cta": {
    "type": "donate | apply | contact | details | none",
    "label": "تبرع الآن",
    "state": "open | submitted | closed",
    "targetId": "…"
  },
  "stats": {
    "likes": 0,
    "comments": 0,
    "shares": 0
  },
  "isLiked": false,
  "isSaved": false,
  "viewsCount": 0
}
```

Notes:
- List can keep a shorter `summary` **if** detail (`/{post}`) returns full `content` / `details`.
- Align field names across posts, campaigns, and saved-posts so the mobile client can share one card model.

---

### 4. Profile: read + write fields the UI already shows

**UI:**
- Profile header: name, username, city, bio, verified, stats (posts / saved / donations)
- Edit Information: name, email, phone, **city**, **bio**

**Problem:**
- `PATCH /me/profile` (`ProfileRequest`) only accepts `name`, `email`, `phone`
- Documented `GET /me` omits `username`, `city`, `bio`, `verified`, `stats`, `avatarUrl`

**Ask:**

**`GET /me` (and auth `user` on login/register) — document and guarantee:**
```json
{
  "id": "…",
  "name": "…",
  "username": "…",
  "email": "…",
  "phone": null,
  "city": "دمشق",
  "bio": "…",
  "verified": false,
  "avatarUrl": null,
  "userType": "general",
  "status": "active",
  "organizationId": null,
  "organization": null,
  "stats": {
    "postsCount": 0,
    "savedCount": 0,
    "donationsCount": 0
  },
  "createdAt": "…",
  "lastActiveAt": null
}
```

**`PATCH /me/profile` — extend `ProfileRequest`:**
```json
{
  "name": "…",
  "email": "…",
  "phone": "…",
  "city": "دمشق",
  "bio": "…"
}
```

Optional follow-up: profile avatar upload endpoint.

---

## P1 — Important for UI parity

### 5. Viewer engagement state on lists

**UI:** Like and save toggles on the home card.

**Problem:** Toggle responses return `isLiked` / `isSaved`, but **list endpoints do not**, so the UI always starts unliked / unsaved after reload.

**Ask:** Include `isLiked` and `isSaved` on discovery posts, post detail, and saved-posts (saved-posts can hardcode `isSaved: true`).

---

### 6. Public author / organization profile

**UI:** `/author/[id]` shows publisher profile + their posts.

**Problem:** No `GET /users/{id}` or `GET /organizations/{id}`. Mobile currently infers profile from `GET /discovery/posts?organizationId=…`.

**Ask:** Dedicated public profile endpoint, e.g.:
- `GET /discovery/publishers/{id}`  
  or  
- `GET /users/{id}` / `GET /organizations/{id}`

Returning the same publisher object used on posts (id, name, username, bio, city, verified, avatar, contact, stats).

---

### 7. Search / filter / sort parity

**UI filters (Search screen):** text, location, type chips, CTA-like status (`open` / `submitted` / `closed`), sort including engagement.

**Current discovery query (approx.):** `search`, `type`, `location`, `status=published`, sort by title / updatedAt.

**Ask:**
- Filter or expose `cta.state` (or equivalent) for open/submitted/closed
- Sort by engagement (e.g. `sort=-likes` or `sortBy=most_engaged`)
- Confirm which post `type` values exist (`volunteer_opportunity`, `donation_campaign`, `help_request`, and whether `campaign_update` / `awareness` are real)

---

### 8. Shares (optional but visible in UI)

**UI:** Shows a share count on cards.

**Ask (if the number should stay accurate):**
- `sharesCount` (or `stats.shares`) on read endpoints
- Optional `POST /posts/{post}/share` to increment

---

### 9. Token refresh

**Contract intro** tells mobile to refresh on 401 and replay queued requests.

**OpenAPI** has no `/auth/refresh` (or equivalent).

**Ask:** Either:
- Add `POST /auth/refresh` with refresh-token request/response and document expiry, **or**
- Explicitly remove refresh from the contract and keep “401 → sign out” as the mobile rule.

Mobile currently clears the session on 401 (no refresh).

---

## P2 — Domains present in UI with no Mobile API

These screens ship in the app on **mock data**. They need new endpoints if they should go live.

### 10. Blogs

**Screens:** `/(tabs)/blogs`, `/blogs/[id]`, categories slider.

**Needed (example):**
- `GET /discovery/blogs` (pagination, category filter)
- `GET /discovery/blogs/{id}`
- Optional: `GET /discovery/blog-categories`

### 11. Notifications

**Screen:** `/notifications` (+ header bell).

**Needed (example):**
- `GET /me/notifications`
- `PATCH /me/notifications/{id}/read` (or mark-all)
- Unread count (header badge), e.g. in `/me` or a tiny `GET /me/notifications/unread-count`

### 12. My donations history

**Screen:** `/my-donations` (contributed vs received, amounts, statuses).

**Needed (example):**
- `GET /me/donations?flow=contributed|received`
- Item: campaign/post link, amount, currency, status, date

Note: today’s donate CTA is **contact-only**. A real donations ledger is a new product/backend domain, not just a field on posts.

---

## OpenAPI / contract hygiene

Please update `mobile-api.json` / the embedded contract so it matches production:

1. Discovery post/campaign item schemas (publisher object, images, content, cta, stats, isLiked/isSaved).
2. `PostRequest.images` real `maxItems`.
3. `ProfileRequest` + `GET /me` extended fields.
4. Document refresh endpoint **or** remove refresh guidance from the intro.
5. Align `meta` types (`string` vs pagination object vs `[]`) — mobile already treats these carefully, but the contract is inconsistent.

---

## Suggested delivery phases

| Phase | Deliverables | Unblocks |
|---|---|---|
| **A** | Images write+read, publisher contact, enriched discovery/saved shape | Home, detail, donate/apply, create-post photos |
| **B** | Profile read/write (`city`, `bio`, `username`, `stats`, …), `isLiked`/`isSaved` on lists | Profile, edit info, correct like/save UI |
| **C** | Publisher profile endpoint, search sort/filters, shares, refresh decision | Author page, search parity, sessions |
| **D** | Blogs, notifications, donations history | Remaining mock-only tabs/screens |

---

## Out of scope (unless product asks)

- In-app payment for donations
- In-app application form submission (beyond contact)
- Comments create/list (UI shows counts; no comment composer required today)
- CMS for About / Terms / Help Center copy

---

## Contact / validation

When Phase A is ready, please send:

1. Updated OpenAPI (`mobile-api.json`)
2. Example JSON for:
   - `GET /discovery/posts` (one item)
   - `GET /discovery/posts/{post}`
   - `POST /posts` with images
   - `GET /me`
3. Staging base URL the mobile app can point at

The mobile team can then drop remaining mocks and finish wiring Search, report UI, categories picker, and campaigns browse against the real contract.
