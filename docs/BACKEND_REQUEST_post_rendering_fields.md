# Backend request: fields missing to render posts/campaigns in the mobile app

The mobile app's post/campaign card (used on the home feed, saved posts, and
profile screens) needs a few fields that aren't in the current mobile API
responses. This is blocking wiring `/discovery/posts`, `/discovery/campaigns`,
and `/me/saved-posts` into the real UI — right now those screens are still
running on mock data because the real responses can't fill the card.

## What the UI needs vs. what each endpoint returns today

### `GET /discovery/posts`, `GET /discovery/posts/{post}`, `GET /me/saved-posts`

These three share the same response shape today:

```json
{
  "id": "...", "title": "...", "summary": "...", "type": "...", "status": "...",
  "organizationName": "...", "authorName": "...", "location": "...",
  "campaignTitle": null, "submittedAt": "...", "createdAt": "...",
  "updatedAt": "...", "publishedAt": "...", "reviewedBy": "...",
  "rejectionReason": null, "viewsCount": 0, "reactionsCount": 0,
  "applicationsCount": 0
}
```

Missing, needed for the card and detail screen:

| Field | Why it's needed | Notes |
|---|---|---|
| `images` (`string[]`) | Post photos — the card and detail screen both show up to several images per post | Currently absent from every read endpoint, even though posts can carry photos (see the separate, already-reported issue: `PostRequest.images` on the *write* side is schema'd with `maxItems: 0`, which also needs fixing so there's something to return here) |
| Full body text | `summary` is enough for a feed preview, but the **detail screen** needs the complete post body, not a truncated summary | Either add a `content`/`details` field to these responses, or add it to the single-item response (`/discovery/posts/{post}`) even if the list endpoint keeps `summary` only |
| Publisher/organization as an object, not two flat strings | `organizationName`/`authorName` are just display strings — the app needs to show an avatar, a verified badge, and **how to contact them** | At minimum: `publisherId`, `avatarUrl` (nullable), `verified` (boolean), and a contact channel — `phoneNumber` and/or `whatsappNumber` |
| `commentsCount`, `sharesCount` | The card shows likes/comments/shares; only `reactionsCount` (likes) and `viewsCount` exist today | |

**The contact-info gap is the most important one.** The donate/apply screens
in this app work by opening WhatsApp or dialing the organization directly —
there is currently no field anywhere in the mobile API that returns a phone
number or WhatsApp number for a post's publisher. Without it, that flow (which
is the app's actual "donate"/"apply" mechanism, since there's no in-app
payment or application form) has no way to know who to contact.

### `GET /discovery/campaigns`, `GET /discovery/campaigns/{campaign}`

Same four gaps as above, on the campaign shape instead of the post shape:
`images`, a full description beyond `summary`, an organization object with
avatar + contact info instead of flat `organizationName`/`managerName`
strings, and (if applicable to campaigns) comment/share counts.

### `GET /me/posts` (smallest gap)

This one is closest to usable already — it returns `details` (full body) and
`images`, unlike the others above. The only thing missing, and only if you
want the "My Posts" screen to show the same stats as the public feed, is
engagement counters (`viewsCount`/`reactionsCount`/`commentsCount`) — not
currently returned for a user's own posts.

## Summary for the backend team

1. Add `images: string[]` to `/discovery/posts`, `/discovery/posts/{post}`,
   `/discovery/campaigns`, `/discovery/campaigns/{campaign}`, and
   `/me/saved-posts`.
2. Add the full post/campaign body text to at least the single-item detail
   endpoints (`/discovery/posts/{post}`, `/discovery/campaigns/{campaign}`).
3. Replace the flat `organizationName`/`authorName`/`managerName` strings with
   an object that also includes an id, an avatar/logo URL, a verified flag,
   and **a phone number and/or WhatsApp number** — this last one specifically
   is what the donate/apply "contact" flow depends on and currently has no
   data source for at all.
4. Add `commentsCount` and `sharesCount` alongside the existing
   `reactionsCount`/`viewsCount`.
5. (Lower priority) Add engagement counters to `/me/posts` for parity with the
   public feed's stats.
6. While you're in this area: the write-side `PostRequest.images` field is
   schema'd with `maxItems: 0`, which means a post can't actually be created
   with any photos today either — worth fixing alongside item 1 above.
