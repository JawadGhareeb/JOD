# JOD — متطلبات الباك إند لميزة الفرق التطوعية والمجموعات

> هذا الملف يشرح المطلوب من الباك إند فقط. لا يتضمن أي تعديل فعلي على كود الباك إند.

## 1. الكيانات الأساسية

### Group / Team

حقول مقترحة:

- `id`
- `ownerId`
- `type`: `group | volunteer_team`
- `name`
- `description`
- `categoryId` أو category مناسب لبنية المشروع الحالية
- `city` / `location`
- `visibility`: `public | private`
- `joinPolicy`: `open | approval | invite_only`
- `status`: `active | suspended | archived`
- `membersCount`
- `postsCount`
- `coverImage`
- `avatar/logo`
- `rules`
- `createdAt`
- `updatedAt`

يفضّل عدم تخزين العدادات كمصدر وحيد للحقيقة إلا إذا كان هناك آلية موثوقة لمزامنتها.

### GroupMember

- `id`
- `groupId`
- `userId`
- `role`: `owner | admin | moderator | member`
- `status`: `active | removed | banned`
- `joinedAt`
- `createdAt`
- `updatedAt`

ويجب وجود Unique Constraint يمنع تكرار نفس المستخدم داخل نفس المجموعة.

### GroupJoinRequest

- `id`
- `groupId`
- `userId`
- `status`: `pending | approved | rejected | cancelled`
- `message` اختياري
- `reviewedBy`
- `reviewedAt`
- `createdAt`
- `updatedAt`

ويجب منع وجود أكثر من طلب pending لنفس المستخدم والمجموعة.

### GroupInvitation — مرحلة لاحقة أو ضمن MVP إذا مطلوب

- `id`
- `groupId`
- `invitedUserId` أو email/phone حسب سياسة النظام
- `invitedBy`
- `status`: `pending | accepted | declined | expired`
- `expiresAt`

### GroupPost

إذا كان نظام المنشورات الحالي قابلًا للتوسعة، يفضّل إعادة استخدامه عبر relation إلى `groupId` بدل بناء نظام منشورات منفصل بالكامل. إن لم يكن ذلك مناسبًا، نحتاج كيانًا مستقلًا للمحتوى داخل المجموعة.

### VolunteerTask — للفرق التطوعية

يمكن إضافته بمرحلة ثانية:

- `id`
- `groupId`
- `createdBy`
- `title`
- `description`
- `location`
- `startsAt`
- `endsAt`
- `requiredVolunteers`
- `status`: `open | full | completed | cancelled`
- `createdAt`
- `updatedAt`

ويحتاج relation لتسجيل الأعضاء في المهمة وحالة كل تسجيل.

## 2. APIs المطلوبة للموبايل

أسماء الـroutes التالية مقترحة وليست إلزامية؛ يجب مطابقتها مع naming conventions الموجودة في باك إند JOD.

### الاستكشاف والقراءة العامة

- `GET /api/mobile/groups`
- `GET /api/mobile/groups/{groupId}`
- فلاتر: `type`, `category`, `city`, `search`, `page`, `perPage`

هذه endpoints يجب أن تسمح بالقراءة العامة للمجموعات المتاحة للعرض بدون تسجيل دخول، مع إخفاء المحتوى الخاص إذا كانت المجموعة private.

### مجموعاتي

- `GET /api/mobile/groups/mine`

تحتاج Authentication.

### إنشاء وتعديل وحذف

- `POST /api/mobile/groups`
- `PUT/PATCH /api/mobile/groups/{groupId}`
- `DELETE /api/mobile/groups/{groupId}` أو archive حسب سياسة المشروع

الصلاحيات:

- الإنشاء: مستخدم مسجل فقط.
- التعديل: Owner/Admin حسب permission model.
- الحذف/الأرشفة: Owner فقط أو حسب قواعد المشروع.

### الانضمام والمغادرة

- `POST /api/mobile/groups/{groupId}/join`
- `POST /api/mobile/groups/{groupId}/join-requests`
- `DELETE /api/mobile/groups/{groupId}/membership`

السلوك يعتمد على `joinPolicy`:

- `open`: ينضم المستخدم مباشرة.
- `approval`: ينشأ طلب pending.
- `invite_only`: لا يسمح بطلب عادي إلا إذا قررت قواعد المنتج خلاف ذلك.

### طلبات الانضمام للإدارة

- `GET /api/mobile/groups/{groupId}/join-requests`
- `POST /api/mobile/groups/{groupId}/join-requests/{requestId}/approve`
- `POST /api/mobile/groups/{groupId}/join-requests/{requestId}/reject`

يفضّل أن تكون عمليات approve/reject idempotent قدر الإمكان لتجنب مشاكل الضغط المكرر أو retries.

### الأعضاء والصلاحيات

- `GET /api/mobile/groups/{groupId}/members`
- `PATCH /api/mobile/groups/{groupId}/members/{userId}/role`
- `DELETE /api/mobile/groups/{groupId}/members/{userId}`
- endpoint للحظر/فك الحظر إذا كانت الميزة مطلوبة.

قواعد مهمة:

- لا يمكن إزالة الـOwner قبل نقل الملكية.
- لا يمكن تخفيض صلاحية آخر Owner بدون تعيين Owner بديل.
- Admin لا يجب أن يستطيع إعطاء صلاحية أعلى من صلاحياته إذا كان permission model يمنع ذلك.

## 3. Response مطلوب لتطبيق الموبايل

يفضّل أن يرجع تفاصيل المجموعة معلومات كافية لبناء الشاشة بدون استدعاءات كثيرة، مثل:

```json
{
  "id": "...",
  "type": "volunteer_team",
  "name": "...",
  "description": "...",
  "visibility": "public",
  "joinPolicy": "approval",
  "membersCount": 25,
  "postsCount": 12,
  "coverImage": null,
  "avatar": null,
  "owner": {
    "id": "...",
    "name": "...",
    "avatarUrl": "..."
  },
  "membership": {
    "isMember": false,
    "role": null,
    "joinRequestStatus": "pending",
    "canJoin": false,
    "canPost": false,
    "canManageMembers": false,
    "canEdit": false
  }
}
```

الفكرة الأساسية أن الباك إند يرجع permissions/status واضحة بدل جعل الفرونت يحاول استنتاجها من عدة حقول.

## 4. Authentication وAuthorization

القراءة العامة يجب أن تعمل للـguest عندما تكون المجموعة public.

يجب طلب Authentication فقط عند الإجراءات، مثل:

- إنشاء مجموعة.
- الانضمام.
- طلب انضمام.
- النشر.
- التعليق.
- تغيير دور عضو.
- قبول/رفض الطلبات.
- المغادرة.
- التسجيل في مهمة.

الباك إند يجب ألا يعتمد على إخفاء الأزرار في الفرونت فقط؛ كل endpoint كتابة يجب أن يفحص الصلاحيات بنفسه.

## 5. الإشعارات

مطلوب Events/Notifications لـ:

- `group_join_request_created`
- `group_join_request_approved`
- `group_join_request_rejected`
- `group_member_invited`
- `group_member_role_changed`
- `group_member_removed`
- `group_announcement_created`
- `volunteer_task_created`
- `volunteer_task_updated`
- `volunteer_task_cancelled`

الأسماء الفعلية يجب أن تتبع نظام الأحداث الموجود في JOD، لكن المعاني السابقة مطلوبة.

## 6. الحماية من الحالات المتعارضة

يجب معالجة:

- المستخدم عضو بالفعل ثم يضغط Join مرة ثانية.
- وجود طلب pending مسبقًا.
- المستخدم يحاول قبول طلب غير موجود أو تم قبوله مسبقًا.
- المستخدم المحظور يحاول الانضمام من جديد.
- حذف مستخدم من المجموعة بينما لديه طلبات/مهام مرتبطة.
- مغادرة Owner للمجموعة.
- تعديل مجموعة archived/suspended.
- وصول مستخدم لمحتوى private بدون عضوية.

يفضّل Response codes واضحة مثل `already_member`, `join_request_pending`, `group_private`, `permission_denied` ضمن نمط الأخطاء الموجود في المشروع.

## 7. Pagination والبحث

يجب دعم pagination في:

- قائمة المجموعات.
- الأعضاء.
- طلبات الانضمام.
- منشورات المجموعة.
- المهام.

ويُفضّل دعم البحث بالاسم والوصف، مع فلاتر النوع والتصنيف والمدينة.

## 8. Media

إذا استُخدم نظام الميديا الحالي في JOD، يجب إعادة استخدام نفس آلية رفع وربط الصور بدل إنشاء طريقة مختلفة للمجموعات.

مطلوب على الأقل:

- avatar/logo.
- cover image.
- media ضمن المنشورات إذا كان post system يدعم ذلك.

## 9. Soft Delete / Archive

يفضّل أرشفة المجموعة بدل حذفها نهائيًا إذا كان ذلك متوافقًا مع سياسات المشروع، حتى لا تنكسر العلاقات مع المنشورات والإشعارات والمهام.

## 10. Audit وModeration

يُنصح بتسجيل عمليات الإدارة المهمة:

- تغيير اسم/نوع/خصوصية المجموعة.
- تغيير الأدوار.
- حذف/حظر عضو.
- قبول/رفض الطلبات.
- أرشفة المجموعة.

وذلك لتسهيل المراجعة من لوحة الأدمن لاحقًا.

## 11. متطلبات لوحة الأدمن مستقبلًا

حتى لو لم تُنفذ الآن، يجب أن يسمح تصميم الباك إند لاحقًا بـ:

- عرض جميع المجموعات والفرق.
- إيقاف/تعليق مجموعة.
- مراجعة البلاغات.
- عرض المالك والمشرفين.
- عرض عدد الأعضاء والنشاط.
- التعامل مع المجموعات المخالفة.

## 12. ترتيب تنفيذ الباك إند المقترح

### المرحلة الأولى

1. Group/Team entity.
2. Memberships + roles.
3. Create/update/details/list.
4. Join/leave.
5. Join requests approve/reject.
6. Public vs private access rules.
7. Mobile-friendly permissions response.
8. Notifications الأساسية.

### المرحلة الثانية

1. Invitations.
2. Moderation/ban/reporting.
3. Volunteer tasks.
4. ربط الفرق بالحملات أو احتياجات التطوع.
5. Admin dashboard APIs.

## 13. Contract مطلوب من الباك إند قبل بدء ربط الفرونت

على فريق الباك إند تسليم الفرونت:

- أسماء الـendpoints النهائية.
- DTOs/JSON response لكل endpoint.
- حقول pagination.
- حالات `joinPolicy` و`membership`.
- قائمة error codes.
- قواعد الصلاحيات لكل role.
- شكل media URLs.
- notification event types.
- هل المجموعة العامة قابلة للعرض بالكامل للـguest أم يتم إخفاء جزء من المحتوى.

بعد تثبيت هذا العقد يمكن ربط تطبيق JOD بدون استنتاجات أو منطق متكرر على الفرونت.
