# JOD — Backend Contract وخطة تنفيذ الفرق التطوعية

## 1. الهدف

هذا الملف هو العقد التقني المرجعي لميزة **الفرق التطوعية** بين تطبيق JOD والباك إند ولوحة الإدارة.

المنتج يحتوي نوعًا واحدًا فقط. داخليًا نستخدم `groups` كاسم تقني، لكن لا يوجد Product Type آخر بجانبه.

## 2. قرارات نهائية غير قابلة للتأويل

```text
ONE product type = volunteer team
always public after approval
no kind
no visibility
no private teams
no invite-only teams
no join request workflow
```

أي مصطلح `Core`, `Social`, `Operations` في هذه الوثيقة يعني طبقة تنفيذ فقط.

## 3. Data Model

### groups

```text
id: uuid/string PK
owner_id: nullable FK users, nullOnDelete
organization_id: nullable FK organizations, nullOnDelete
name
description
category
location
status: pending|active|rejected|suspended|archived
purpose nullable
rules json nullable
proposed_admin_ids json nullable
rejection_reason nullable
suspension_reason nullable
submitted_at nullable
reviewed_at nullable
reviewed_by nullable FK users
created_at
updated_at
deleted_at nullable
```

لا يوجد:

```text
kind
visibility
join_policy
```

### group_members

```text
id
group_id
user_id
role: owner|admin|moderator|member
status: active|left|removed
joined_at
left_at nullable
created_at
updated_at
UNIQUE(group_id, user_id)
```

### group_posts

```text
id
group_id
author_id
body
is_pinned
likes_count
comments_count
created_at
updated_at
```

### group_comments

```text
id
post_id
author_id
parent_id nullable
body
likes_count
created_at
updated_at
```

### group_post_likes / group_comment_likes

Unique per user/resource.

## 4. Creation Flow

### Admin candidates

```http
GET /api/mobile/groups/admin-candidates?search=
```

Auth required.

Response item:

```json
{
  "id": "user-id",
  "name": "...",
  "username": "...",
  "avatarUrl": null
}
```

### Create

```http
POST /api/mobile/groups
```

```json
{
  "name": "فريق جود التطوعي",
  "description": "...",
  "category": "تعليم",
  "location": "دمشق",
  "purpose": "...",
  "rules": ["..."],
  "proposedAdminIds": ["user-id"]
}
```

Optional image can be sent using the existing Media/FormData pattern supported by the current implementation.

Server behavior:

1. Require auth.
2. Create status `pending`.
3. Create owner membership.
4. Save proposed admins.
5. Notify admins: `group.submitted`.
6. Notify creator that review is pending.
7. Keep team out of public discovery.

## 5. Admin Review

Base path:

```text
/api/v1/admin
```

Endpoints:

```http
GET    /groups
GET    /groups/{group}
POST   /groups/{group}/approve
POST   /groups/{group}/reject
DELETE /groups/{group}
```

Filters:

```text
status
category
search
sort
sortDir
page
perPage
```

### Approve

- Allowed for reviewable states according to server policy.
- Result: `active`.
- Store reviewer + reviewed timestamp.
- Activate proposed admins according to role policy.
- Notify owner: `group.approved`.

### Reject

Body:

```json
{ "rejectionReason": "..." }
```

- Allowed for `pending`.
- Result: `rejected`.
- Store reason/reviewer/time.
- Notify owner: `group.rejected`.

## 6. Public Mobile Reads

```http
GET /api/mobile/groups
GET /api/mobile/groups/suggested
GET /api/mobile/groups/{group}
GET /api/mobile/groups/{group}/members
GET /api/mobile/groups/{group}/posts
GET /api/mobile/groups/{group}/recommendations
GET /api/mobile/groups/posts/{post}/comments
```

Only `active` teams are public.

Guest access is allowed for public reads.

### Discovery params

```text
search
category
location
page
perPage
```

Do not add `kind` or `visibility` params.

## 7. Authenticated Mobile Actions

```http
GET    /api/mobile/me/groups
POST   /api/mobile/groups
POST   /api/mobile/groups/{group}/join
DELETE /api/mobile/groups/{group}/join
POST   /api/mobile/groups/{group}/posts
POST   /api/mobile/groups/posts/{post}/comments
POST   /api/mobile/groups/posts/{post}/like
DELETE /api/mobile/groups/posts/{post}/like
POST   /api/mobile/groups/comments/{comment}/like
DELETE /api/mobile/groups/comments/{comment}/like
```

## 8. Membership Rules

- Join only when group status is `active`.
- Join is direct.
- No `group_join_requests` table.
- No approval queue.
- Duplicate join must not create duplicate membership.
- Leaving marks membership appropriately or deletes it according to implementation policy.
- Owner cannot use normal Leave.
- Rejoining after `left` should reactivate the same membership row when practical.

## 9. Role Rules

```text
owner
admin
moderator
member
```

Current/next management endpoints:

```http
PATCH  /api/mobile/groups/{group}/members/{userId}/role
DELETE /api/mobile/groups/{group}/members/{userId}
```

Events:

```text
group.member_role_changed
group.member_removed
```

Authorization is based on authenticated server user and membership role, never a role value submitted by the client.

## 10. Mobile Response Contract

### Group list/detail

```json
{
  "id": "...",
  "name": "...",
  "description": "...",
  "category": "...",
  "location": "...",
  "membersCount": 25,
  "postsThisWeek": 3,
  "postsCount": 12,
  "isMember": false,
  "myRole": null,
  "imageUrl": null,
  "coverImageUrl": null,
  "organizationName": null,
  "isVerifiedOrganization": false,
  "rules": [],
  "status": "active",
  "rejectionReason": null,
  "createdAt": "...",
  "createdAtLabel": "...",
  "owner": {},
  "admins": [],
  "membersPreview": []
}
```

Explicitly absent:

```text
kind
visibility
joinRequestStatus
joinPolicy
```

## 11. Pending / Rejected Access

- `pending`: owner can retrieve it through `me/groups` and detail authorization.
- `rejected`: owner can retrieve it and see `rejectionReason`.
- Other users/guests must not access non-active team detail.

## 12. Posts

### Create

```http
POST /api/mobile/groups/{group}/posts
```

Body example:

```json
{ "body": "نحتاج متطوعين للنشاط القادم" }
```

Requires active membership.

### Post Like

```http
POST   /api/mobile/groups/posts/{post}/like
DELETE /api/mobile/groups/posts/{post}/like
```

Return final `isLiked` and count.

## 13. Comments

```http
GET  /api/mobile/groups/posts/{post}/comments
POST /api/mobile/groups/posts/{post}/comments
```

Create:

```json
{
  "parentId": null,
  "body": "تعليق"
}
```

Reply is normalized to root comment for a one-level thread.

Like:

```http
POST   /api/mobile/groups/comments/{comment}/like
DELETE /api/mobile/groups/comments/{comment}/like
```

Writing requires active membership.

## 14. Recommendations

```http
GET /api/mobile/groups/{group}/recommendations
```

Use real domain relations when matching recommendations. For example, campaign category comparison should use the Campaign → Category relationship rather than assuming a `campaigns.category` column.

Possible signals:

- same category.
- same location.
- related campaign/opportunity.

## 15. Notifications

Required event types:

```text
group.submitted
group.approved
group.rejected
group.member_role_changed
group.member_removed
```

Future operations events:

```text
group.task_created
group.task_updated
group.task_cancelled
group.task_assignment_changed
```

Use the existing JOD notification infrastructure and FCM pipeline.

## 16. Media

Reuse existing Media infrastructure.

Supported/expected model props:

```text
avatar: max 1
cover: max 1
```

Group posts can adopt the same media system later if needed.

## 17. Dashboard Contract

Admin UI sections:

- Pending review.
- Active teams.
- Rejected teams.

Actions:

- View details.
- Approve.
- Reject with reason.
- Delete/soft delete.

Filters:

- status.
- category.
- search.

No privacy/type filters.

## 18. Current implementation state

### Backend implemented

- `groups` + memberships + posts + comments + likes.
- create pending flow.
- admin candidates.
- public discovery/detail/members/posts/comments/recommendations.
- mine.
- direct join/leave.
- group post create endpoint.
- post/comment likes.
- admin list/detail/approve/reject/delete.
- notifications for creation/review decisions and role/member events.
- group media type.

### Dashboard implemented

- Real API instead of mocks.
- Pending/Active/Rejected flows.
- Approve/Reject/Delete.
- No visibility filter.
- Terminology changed to «الفرق التطوعية».

### Mobile implemented

- Real groups API instead of mocks.
- Discovery / Suggested / Mine / Detail.
- Create request.
- Admin candidates search.
- Join / Leave.
- Members read.
- Posts read.
- Comments + comment likes.
- Recommendations.
- Pending/Rejected owner states.

### Mobile remaining hardening / completion

- Gate `Mine` query for guests.
- Do not show Leave action to owner.
- Wire create group post UI to existing backend endpoint.
- Wire post like/unlike UI.
- Disable comment/reply/like composer for authenticated non-members and show join CTA/message.
- Add role/member management UI when management phase starts.
- Add group edit/avatar/cover update UI when needed.

## 19. Future Volunteer Operations

Do not add `kind=volunteer_team`.

Add operational entities against the existing `group_id`.

### volunteer_tasks

```text
id
group_id
created_by
title
description
location
starts_at
ends_at
required_volunteers
capacity nullable
status: open|full|completed|cancelled
campaign_id nullable
post_id nullable
created_at
updated_at
```

### volunteer_task_assignments

```text
task_id
user_id
status: requested|accepted|declined|completed|cancelled
checked_in_at nullable
completed_at nullable
```

Optional future additions:

- skills.
- shifts.
- attendance/check-in.
- completion history.
- volunteer hours.
- campaign linkage.

## 20. Definition of Done

### Core/Social backend

- No mocks required for group data.
- Create → Pending → Admin Review → Approve/Reject works.
- Only active teams are public.
- Rejected reason is visible to owner.
- Direct join works without join requests.
- Role checks are server-side.
- Public team content is guest-readable.
- Writing requires auth + membership where applicable.
- Posts/comments/likes/recommendations are real API data.

### Mobile completion

- Guest discovery works without auth errors.
- Owner cannot accidentally trigger forbidden Leave.
- Member can create a group post from UI.
- Member can like/unlike posts from UI.
- Non-member is clearly prompted to join before social interactions.

### Future operations

Tasks/shifts/skills are considered a later feature and attach to the same team entity.