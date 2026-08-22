# JOD Mobile — Lookup / Reference Data Request

**Audience:** Backend team  
**From:** Mobile app  
**Date:** 2026-08-22

The mobile UI currently hardcodes several dropdowns and filter lists. Please expose these as **lookup APIs** (or documented static enums) so the app can stay in sync with the server without app releases.

Suggested base path: `/api/mobile/lookups/...`  
(or `/api/mobile/discovery/...` if you prefer keeping public reads under discovery)

---

## Priority 1 — Needed now (UI already has these pickers)

### 1. Cities / Locations — `المدينة`

**Used in:**
- Create / edit post (city picker)
- Edit profile (city field)
- Search location filter
- Feed / profile display

**Today:** Hardcoded in the app (دمشق، حلب، حمص، …).

**Ask:**
```http
GET /lookups/cities
```

**Response item:**
```json
{
  "id": "city_damascus",
  "name": "دمشق",
  "nameEn": "Damascus",
  "slug": "damascus",
  "isActive": true,
  "sortOrder": 1
}
```

**Notes:**
- Profile + posts should store either `cityId` **or** the canonical `name` — pick one and document it.
- Prefer `cityId` for writes (`PATCH /me/profile`, `POST /posts`) and return both `cityId` + `city` name on reads.
- Support `?search=` for typeahead later.

---

### 2. Post categories — already partially exists

**Contract already has:** `GET /discovery/categories?target=post|campaign`

**Used in (should be):**
- Create post category picker (UI exists conceptually; app does not send `categoryId` yet)
- Search / discovery filters

**Ask:** Confirm this endpoint is production-ready and returns:

```json
{
  "id": "cat_…",
  "name": "…",
  "target": "post" | "campaign",
  "description": null,
  "usageCount": 0,
  "status": "active"
}
```

If cities and categories are the only dynamic lists, we can keep using `/discovery/categories` and only add `/lookups/cities`.

---

### 3. Report reasons — أسباب البلاغ

**Used in:** Post options → Report

**Today hardcoded:**
| value | label (AR) |
|---|---|
| `misleading` | محتوى مضلل |
| `abusive` | محتوى مسيء أو غير لائق |
| `fraud` | احتيال أو طلب تبرع مشبوه |
| `impersonation` | انتحال جهة أو شخصية |
| `other` | سبب آخر |

**Ask:**
```http
GET /lookups/report-reasons
```

```json
{
  "id": "misleading",
  "code": "misleading",
  "label": "محتوى مضلل",
  "hint": "معلومات غير صحيحة أو غير موثوقة.",
  "allowsCustomText": false,
  "sortOrder": 1,
  "isActive": true
}
```

`other` should have `"allowsCustomText": true` so the app shows the free-text dialog.

Wire `POST /posts/{post}/reports` to accept these `code` values as `reason`.

---

## Priority 2 — Strongly recommended (filters / create-post)

### 4. Post types — أنواع المنشور

**Used in:**
- Create post type picker
- Home / search type chips

**App UI types today:**
| UI key | API `type` (current) | label |
|---|---|---|
| `volunteer` | `volunteer_opportunity` | فرصة تطوع |
| `donation` | `donation_campaign` | حملة تبرع |
| `help` | `help_request` | طلب مساعدة |

**Home also shows (may not exist on write API):**
- `campaign_update` — تحديثات الحملات  
- `awareness` — منشورات توعوية  

**Ask:**
```http
GET /lookups/post-types
```

```json
{
  "code": "volunteer_opportunity",
  "label": "فرصة تطوع",
  "hint": "مناسب لطلبات المتطوعين",
  "canCreate": true,
  "canFilter": true,
  "sortOrder": 1,
  "isActive": true
}
```

Please clarify which types are creatable vs filter-only.

---

### 5. Post statuses (owner lifecycle)

**Used in:** Profile “منشوراتي” tabs

**Values today:** `draft` | `pending` | `active` | `rejected` | `archived`

**Ask (optional if these are fixed forever):**
```http
GET /lookups/post-statuses
```

```json
{
  "code": "pending",
  "label": "قيد المراجعة",
  "sortOrder": 2,
  "isActive": true
}
```

If statuses never change, documenting them in OpenAPI is enough — no endpoint required.

---

### 6. CTA / opportunity states (search filters)

**Used in:** Search status chips — `open` / `submitted` / `closed`

**Ask:** Either expose on posts as `cta.state`, or:

```http
GET /lookups/cta-states
```

```json
{ "code": "open", "label": "مفتوح", "sortOrder": 1 }
```

---

## Priority 3 — When those screens go live (no API domain yet)

### 7. Blog categories

**Used in:** Blogs tab filters  
**Values today:** `awareness`, `success_stories`, `campaign_updates`, `volunteer_guides`

```http
GET /lookups/blog-categories
```
(Only needed once blogs API exists.)

### 8. Notification types

**Used in:** Notifications list icons/labels  
**Values today:** `campaign`, `volunteer`, `comment`, `saved`, `system`

```http
GET /lookups/notification-types
```
(Only needed once notifications API exists.)

### 9. Donation statuses / flows

**Used in:** My Donations (`contributed` / `received`, status labels)

```http
GET /lookups/donation-flows
GET /lookups/donation-statuses
```
(Only needed once donations history API exists.)

---

## Suggested shared response envelope

```json
{
  "success": true,
  "message": "OK",
  "data": [ /* lookup items */ ],
  "error": null,
  "meta": []
}
```

Optional query params on all lookups:
- `status=active` (default)
- `search=`
- `locale=ar` (if you ever add multi-language labels)

---

## What we recommend you build first

| # | Endpoint | Why |
|---|---|---|
| 1 | `GET /lookups/cities` | Profile + create post + search — hardcoded today |
| 2 | Confirm `GET /discovery/categories` | Create post must send `categoryId` |
| 3 | `GET /lookups/report-reasons` | Report modal is hardcoded |
| 4 | `GET /lookups/post-types` | Align create + home filters with server truth |

**Write-side follow-up (related):**  
Once cities exist, accept `cityId` (or documented city name) on:
- `PATCH /me/profile`
- `POST /posts` / `PATCH /posts/{post}`

---

## Out of scope for lookups

These are **not** lookups — they need full feature APIs (see `BACKEND_ENHANCEMENT_REPORT.md`):
- Blogs list/detail
- Notifications list
- My donations history
- Image upload
- Publisher contact fields
