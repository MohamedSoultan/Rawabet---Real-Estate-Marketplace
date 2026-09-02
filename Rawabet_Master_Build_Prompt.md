# RAWABET MASTER BUILD PROMPT

You are the senior software architect and implementation agent for the Rawabet Real Estate Brokerage Platform.

## 1. Mission
Build a production-ready Arabic real-estate brokerage web application for Kafr El Sheikh, Egypt. The system is a controlled brokerage platform, NOT an open classified marketplace. Owners and brokers submit properties. Rawabet reviewers approve/reject them. Only approved versions are published. Customers never receive seller contact details. Customer interest creates Rawabet leads and all commercial communication is routed to Rawabet.

The first production MVP must be deliberately small, secure and deployable on Hostinger Premium shared hosting. Do not add unnecessary infrastructure.

## 2. Mandatory implementation stack
- Laravel modular monolith, using the latest stable Laravel version that is compatible with the Hostinger PHP environment at implementation time.
- PHP + MySQL.
- Blade for server-rendered public UI.
- Livewire and Alpine.js where interaction materially improves UX.
- Tailwind CSS.
- Filament may be used for internal administration where it does not compromise required business flows.
- Laravel Policies/Gates plus a mature open-source permission package such as Spatie Laravel Permission.
- SMTP for Release 1 email.
- Local server storage for Release 1 media.
- Git source control.

Do NOT require in production for Release 1: permanent Node.js runtime, Redis, Elasticsearch, Meilisearch, WebSockets, Kubernetes, Docker, Supervisor, Firebase/Auth0/Supabase authentication, paid CRM, paid image service, WhatsApp API, or any proprietary backend.

## 3. Product language and UX
- Product UI is Arabic only in Release 1 and fully RTL.
- Preferred website font: Cairo.
- Tone: friendly, clear, semi-formal Egyptian Arabic; professional and never random/slang-heavy.
- Mobile-first is mandatory.
- Public UI must be custom and polished; do not ship a generic unmodified admin/template experience.
- Primary brand direction is a comfortable professional green. Brand colors are configurable settings.

## 4. User model
Actors:
1. Guest.
2. Customer.
3. Owner capability.
4. Broker capability.
5. Property Reviewer.
6. Sales User.
7. Operations Manager.
8. Content Manager.
9. Super Admin.

A normal customer account can additionally become Owner or Broker; do not require separate accounts.

External authentication in Release 1 is email OTP/passwordless. Collect full name, mobile/WhatsApp, email, governorate, area and consent. Mobile remains the primary commercial contact. Use 6-digit OTP, 10-minute expiry, maximum 5 invalid attempts, 60-second resend cooldown, single-use, stored hashed, never logged.

Internal Rawabet users use email/password accounts created by Super Admin.

Account state dimensions must remain separate:
- account_status: ACTIVE / SUSPENDED / DISABLED
- email verification: UNVERIFIED / VERIFIED
- seller platform verification: NOT_REQUESTED / PENDING / VERIFIED / REJECTED

Seller verification is manual trust verification by Rawabet. It does NOT allow automatic property publishing.

## 5. Authorization
Authorization = role template + granular user permissions + ownership policy + record state.

All protected actions must be enforced server-side using policies/gates/middleware. Hiding a button is never security.

Minimum permission namespaces:
user.view, user.create, user.edit, user.disable, user.enable, user.verify, user.assign_role, user.assign_permission
property.create, property.view_own, property.edit_own, property.submit, property.view_pending, property.review, property.edit_pending, property.approve, property.reject, property.edit_published, property.archive, property.mark_sold, property.mark_rented, property.view_private_source
lead.view, lead.edit, lead.assign, lead.change_status, lead.add_note, lead.contact
locations.manage, property_types.manage, settings.general, settings.branding, settings.contact, settings.legal, help.manage
audit.view

A broker/owner must never access another seller's internal property by changing IDs or routes.

## 6. Core privacy rules
Public users/customers MUST NEVER receive in HTML, JSON, Livewire payloads, JavaScript variables or APIs:
- seller name
- seller mobile/phone
- seller WhatsApp
- seller email
- seller/source identity or private source IDs
- private detailed address unless explicitly approved public later
- internal review notes

The public property uses Rawabet branding and Rawabet contact only.

Initial Rawabet contact numbers are:
01000920759
01000920749
Store them in system settings; never hard-code them across templates.

Seller-generated public content must not contain external URLs, phone numbers, email addresses, WhatsApp/social links or instructions intended to bypass Rawabet. Use server-side validation/pattern detection plus reviewer control.

## 7. Location model
Hierarchy: Governorate -> City/Markaz -> Area.
Kafr El Sheikh is the only active governorate at launch.
Only Super Admin can activate new governorates. Activation automatically makes the location available in supported forms and filters. Deactivation must not destroy historical records.

## 8. Property types and media
Initial configurable property types:
Apartment, Villa, Land, Shop, Office.
Initial suggested image limits:
Apartment 3–12; Villa 5–20; Land 1–8; Shop 2–10; Office 2–10.
Store limits in property_types, not code constants.
Allowed Release 1 image types: JPG/JPEG/PNG/WEBP, maximum 2 MB each. Randomize filenames, validate actual MIME, keep uploads non-executable.
Direct seller video upload is NOT Release 1. Target Release 2: one video, max 90 seconds, configurable file size.

## 9. Property versioning - absolutely mandatory
A property is a stable identity. Public/editable content lives in property_versions.
Each property has current_published_version_id.

Business states:
DRAFT, PENDING_REVIEW, PUBLISHED, REJECTED, PENDING_REVISION, ARCHIVED, SOLD, RENTED.
Version states: DRAFT, PENDING, APPROVED, REJECTED.

Initial submission:
Draft -> Pending Review -> Approved -> Published
or Pending Review -> Rejected.

Published edit by seller:
- clone current published version to a new draft version
- seller edits and submits it
- new version becomes Pending Revision/Pending
- old approved version remains public unchanged
- reviewer approves -> new version becomes current_published_version_id
- reviewer rejects -> old published version remains public

Never implement seller edit as an UPDATE directly to the published version.

An internal user may directly edit a published property only if they have property.edit_published. Every such critical change must be audited with old/new values.

## 10. Property workflow
Seller can save an incomplete private draft.
Required at submission: active property type, transaction type, governorate, city/area as configured, public location, internal private address, price > 0, area > 0, title, description, required conditional specifications and images according to type.

Submit button Arabic: "إرسال للمراجعة".
Success message: "تم إرسال العقار للمراجعة. فريق روابط هيراجع البيانات ويبلغك بالنتيجة."

Review queue shows reference, seller, verification status, type, location, price, submitted time and waiting age.
Reviewer detail shows submitted data plus private seller name/mobile/WhatsApp/email and review history.
Reviewer actions by permission: edit pending data, approve, reject, call seller, WhatsApp seller.

Reject MUST open a mandatory reason modal. Reason 10–1000 meaningful characters. Empty reason blocks rejection. Store reason, reviewer and time. Notify seller. Seller can correct and resubmit while historical rejection remains.

Concurrency: if another reviewer already processed the pending version, do not overwrite; show an Arabic stale-state message and require refresh.

## 11. Public website
Guest can browse Home, property listing, search and approved property cards without login.
Only PUBLISHED properties with current_published_version_id may be returned by public queries.
Minimum filters: governorate, city/markaz, area, property type, transaction type, min/max price, min/max area, bedrooms where applicable.
Sorting: newest, price low-high, price high-low.
Pagination mandatory, recommended 12–20 per page.

A protected detailed journey such as "رؤية المزيد" may open registration/login modal. Do not navigate the guest away unnecessarily. After successful authentication, close modal and continue to the intended property context.

Public property detail may show approved images/title/price/type/transaction/public location/area/rooms/bathrooms/floor/finishing/description/features/trust message and Rawabet contact CTA.
Never show seller identity/contact/source data.

## 12. Lead CRM
A customer contact action creates or reuses an open Lead for customer + property.
Lead fields: reference, customer, property, status, source, contact channel, assigned user optional, timestamps.
Statuses for Release 1:
NEW, WHATSAPP_CONTACT_INITIATED, CALL_CONTACT_INITIATED, CONTACTED, FOLLOW_UP, VIEWING, WON, LOST.

WhatsApp click:
1. Verify authenticated customer and property still published.
2. Find/create open lead for customer + property.
3. Add WHATSAPP_CONTACT_INITIATED activity.
4. Update last_activity_at.
5. Open configured Rawabet WhatsApp with message containing property reference.

A deep-link click does NOT mean sent/delivered/read. Do not label it Contacted automatically.

Call click follows the same rule with CALL_CONTACT_INITIATED.
Repeated contact for the same open customer+property must add activity, not generate unlimited duplicate leads.
Sales can view authorized leads, update status and add internal notes. Notes are never public.

## 13. Notifications
Release 1 channels: in-app + email.
Critical events: property submitted to reviewers, property approved, property rejected with reason, revision approved/rejected, seller verification approved/rejected.
Mail failure must not roll back a successful business transaction. Log the mail failure safely. Shared hosting solution must not require Supervisor; synchronous mail or database queue + Hostinger cron is acceptable.

## 14. Admin configuration
Super Admin manages:
- internal users
- role templates and granular permission checkboxes
- seller verification
- governorates/cities/areas
- property types and image limits
- system settings
- Rawabet logo and primary/secondary colors
- primary/secondary WhatsApp/phone numbers
- support email
- Privacy Policy, Terms, About and selected site copy
- seller help PDF
- audit log access

Release 1.1 may add YouTube help resources. External users must never add arbitrary URLs.

## 15. Audit
Audit critical events: approvals, rejections and reason, price, title, description, public/private address, image changes after submission, published-state changes, direct public internal edits, seller verification, permission/role changes, user enable/disable, governorate activation/deactivation, critical contact/legal/settings changes.
Audit is append-only through normal application UI and cannot be edited/deleted by standard users.

## 16. Security
Mandatory:
- HTTPS
- CSRF
- backend RBAC and policies
- IDOR tests
- Eloquent/query bindings
- escaped/sanitized content
- secure file validation/storage
- session regeneration after authentication
- rate limiting for login/registration/OTP/contact
- APP_DEBUG=false in production
- secrets only in environment configuration
- no OTP/password/session token/SMTP secret in logs
- no public seller-data serialization
- no hidden developer admin/backdoor

Production errors must show friendly Arabic pages/messages, never stack traces or SQL/filesystem errors.

## 17. Shared-hosting performance
The initial operational expectation is roughly 500–2,000 visitors/day, not simultaneous users.
Optimize for Hostinger Premium shared hosting:
- indexes on publication state, seller, location, type, transaction, price, lead status/customer/property
- paginate
- lazy-load images
- avoid N+1 queries
- no unlimited datasets
- cache small master/settings data with file/database cache
- no Redis requirement
- no heavy reporting/media processing in Release 1
- use Hostinger-compatible cron only

## 18. Required Release 1 screens
Public: Home, Property Listing, Property Detail, Registration Modal, Email OTP Modal, Customer Profile.
Seller: Seller Dashboard, My Properties, Property Create/Edit Wizard, Property Status, Rejected Property, Verification Status.
Internal: Login, Dashboard, Review Queue, Property Review, Revision Compare, Leads, Lead Detail, Users, Internal User Create/Edit, Roles/Permissions, Verification Requests, Locations, Property Types, Settings, Help Resources, Audit Log.

## 19. Release boundaries
Release 1.0: core MVP described above.
Release 1.1: Favorites with 30-day expiration, image WebP/resize if hosting supports it, improved review diff, YouTube help, notification/dashboard refinements.
Release 2.0: WhatsApp API/OTP, advanced CRM/follow-up, optional EspoCRM evaluation, one max-90-second property video, English, saved searches/alerts.
Release 3.0: recommendations, advanced analytics, conversion funnel, improved ranking, duplicate-property assistance, PWA evaluation.
Release 4.0: AI matching/content/lead scoring, recommendation engine, native apps, partner API and advanced market intelligence.
Do not pull later-release functionality into Release 1 without explicit approval.

## 20. Build process - mandatory
Do NOT start coding the full application immediately.

Step A: Read all files under /docs and generate:
- docs/IMPLEMENTATION_PLAN.md
- docs/ARCHITECTURE_DECISIONS.md
- docs/DB_SCHEMA_PLAN.md
- docs/SECURITY_CHECKLIST.md
- docs/OPEN_QUESTIONS.md

If an ambiguity materially affects business/security, put it in OPEN_QUESTIONS and stop that affected feature. Do not invent the answer.

Step B: Propose the exact Laravel version/PHP requirements after checking the implementation environment compatibility. Explain any package you want to add, its license, purpose and whether it creates recurring cost/vendor lock-in. Do not use pirated/nulled code.

Step C: Implement in four micro-sprints:
Sprint 1: foundation/auth/users/RBAC/locations/types/settings.
Sprint 2: property/version/media/review/approval/rejection/revision/audit.
Sprint 3: public website/customer gate/WhatsApp-call/lead CRM.
Sprint 4: notifications/dashboard/legal/help/security QA/deployment readiness.

At the end of each sprint:
- run tests
- run migrations from clean DB
- self-review authorization and privacy
- summarize files changed
- list acceptance criteria passed
- list known issues
- stop and request approval before moving to the next sprint

## 21. Testing requirements
Create automated tests for at least:
- broker cannot edit another broker's property
- public query never returns unpublished property
- public response never contains seller private contact fields
- reviewer without permission cannot approve/reject
- rejection requires reason
- seller published edit creates revision and does not alter live version
- revision approval switches published version
- revision rejection retains old public version
- WhatsApp/call contact creates/reuses lead and activity
- disabled user cannot authenticate
- inactive location cannot be used for new submissions

Do not delete/disable tests to obtain a green test result.

## 22. Required code/document handover
Repository must remain owner-controlled. Deliver migrations, seeders, README, .env.example without secrets, deployment instructions, cron/mail/storage/backup instructions and package license register. No hidden license lock, no developer-owned production dependency, no production credentials in source.

## 23. Definition of Done
A feature is Done only when business behavior, backend authorization, server validation, Arabic UI, responsive states, error handling, acceptance tests and relevant security checks are complete, source is committed, and there is no open Critical/High defect for that feature.

## 24. Initial response to this prompt
Do not write application code yet.
First return:
1. Your understanding of Rawabet in 15–25 precise bullets.
2. Proposed module boundaries.
3. Proposed database entities and relationships.
4. Proposed authentication/RBAC approach.
5. The exact 5–8 day implementation plan with daily deliverables.
6. Top 15 implementation/security risks.
7. Any true blocking questions only.
8. Packages you intend to use, with purpose and license.
9. A Release 1 acceptance checklist.

Wait for approval before generating business code.
