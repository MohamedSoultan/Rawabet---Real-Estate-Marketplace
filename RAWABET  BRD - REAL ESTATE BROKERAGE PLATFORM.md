# **RAWABET REAL ESTATE BROKERAGE PLATFORM**

## **Complete Business Requirements & Functional Specification Baseline**

**Document ID:** RAW-BRD-001  
**Document Version:** 1.0  
**Product:** Rawabet Real Estate Brokerage Platform  
**Initial Market:** Kafr El Sheikh Governorate, Egypt  
**Product Interface Language — Release 1:** Arabic only  
**Document Language:** English  
**Product Direction:** Controlled Digital Real Estate Brokerage Platform  
**Delivery Methodology:** Agile / Incremental Releases  
**Release 1 Target:** Production-ready MVP within 5–8 working days  
**Primary Hosting Constraint:** Hostinger Premium Shared Hosting  
**Document Status:** Client Approval Baseline  
**Confidentiality:** Project Internal / Client Approved Parties Only

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# **1\. DOCUMENT PURPOSE**

This document defines the complete business and functional baseline for the Rawabet Real Estate Brokerage Platform.

It is intentionally more detailed than a traditional high-level BRD and includes:

-   Business objectives.
-   Product scope.
-   User roles.
-   Permission architecture.
-   Business rules.
-   Epics.
-   User stories.
-   Acceptance criteria.
-   Validation rules.
-   Error handling.
-   Security considerations.
-   Data privacy controls.
-   Audit requirements.
-   Release planning.
-   Sprint planning.
-   Kano prioritization.
-   Traceability matrix.
-   Data entities.
-   Deployment constraints.
-   Source-code handover requirements.
-   Go-live acceptance conditions.

This document shall be treated as the contractual functional baseline for Release 1.0 unless a requirement is changed through an approved Change Request.

The developer must not assume undocumented functionality.

Where a requirement is unclear during implementation, the developer must request clarification before implementing a business behavior.

  
  
  
  

# **2\. PRODUCT DEFINITION**

Rawabet is not intended to operate as an unrestricted real estate classified advertisements website.

Rawabet is a:

**Controlled Digital Real Estate Brokerage Platform**

The platform enables:

1.  Property owners to submit properties.
2.  Real estate brokers to submit properties.
3.  Rawabet reviewers to review and approve property submissions.
4.  Approved properties to be published under Rawabet.
5.  Customers to browse approved properties.
6.  Customers to express interest.
7.  Rawabet to become the visible commercial intermediary.
8.  Rawabet employees to manage customer leads.
9.  Direct seller-to-buyer contact information to remain private.

Rawabet remains the commercial contact point presented to the customer.

# **3\. BUSINESS VISION**

To create the most trusted, easy-to-use local digital real estate brokerage experience in Kafr El Sheikh, based on:

-   Controlled property quality.
-   Local market specialization.
-   Competitive brokerage model.
-   Data privacy.
-   Professional customer journey.
-   Reliable property information.
-   Transparent communication through Rawabet.
-   Strong mobile-first user experience.

The system must be architected so Rawabet can activate additional governorates in the future without rebuilding the application.

# **4\. BUSINESS PROBLEM**

## **4.1 Customer Problems**

Customers frequently experience:

-   Unreliable property listings.
-   Outdated availability.
-   Direct exposure to multiple sellers.
-   Repeated phone calls.
-   Difficulty finding properties within budget.
-   Poor mobile experiences.
-   Unclear property information.
-   Difficulty knowing whether a listing has been reviewed.

Rawabet must reduce this friction.

## **4.2 Property Owner / Broker Problems**

Property sources frequently depend on:

-   Facebook groups.
-   WhatsApp forwarding.
-   Personal relationships.
-   Unstructured property spreadsheets.
-   Repeated manual communication.

Rawabet must provide a controlled submission channel.

  
  
  
  
  
  
  
  
  

## **4.3 Rawabet Business Problems**

Rawabet requires a system that:

-   Builds a proprietary property database.
-   Prevents uncontrolled direct communication.
-   Tracks property sources privately.
-   Reviews listings before publication.
-   Captures customer demand.
-   Records leads.
-   supports internal follow-up.
-   Creates trust in the Rawabet brand.
-   allows expansion without rebuilding the system.

  

# **5\. BUSINESS OBJECTIVES**

## **BO-001 — Controlled Property Supply**

Allow owners and brokers to submit property inventory through structured forms.

## **BO-002 — Listing Quality**

Ensure no property is publicly published without review by an authorized Rawabet employee.

## **BO-003 — Lead Generation**

Convert property interest into trackable Rawabet leads.

## **BO-004 — Data Privacy**

Prevent customers from discovering seller contact details through the platform.

## **BO-005 — Trust**

Clearly communicate that published properties have been reviewed by Rawabet.

## **BO-006 — Low Operating Cost**

Avoid unnecessary monthly SaaS subscriptions and vendor lock-in.

## **BO-007 — Local Launch**

Launch initially for Kafr El Sheikh.

## **BO-008 — Future Expansion**

Allow additional governorates, property types and system capabilities to be activated later.

## **BO-009 — Strong UX**

Provide a polished Arabic mobile-first experience.

## **BO-010 — Fast Go-To-Market**

Release a production-ready MVP in the shortest responsible timeframe.

# **6\. SUCCESS CRITERIA — RELEASE 1**

Release 1.0 shall be considered commercially usable when all of the following can be completed successfully:

1.  An Owner can create an account.
2.  A Broker can create an account.
3.  The seller can submit a property.
4.  Submitted property enters a review queue.
5.  Authorized reviewer can review the property.
6.  Reviewer can modify property content when authorized.
7.  Reviewer can approve the property.
8.  Approved property appears publicly.
9.  Reviewer can reject property only after entering a rejection reason.
10.  Seller receives rejection or approval notification.
11.  A guest can browse published properties.
12.  A guest can search/filter properties.
13.  A guest can start the detailed-property access journey.
14.  Customer data can be captured.
15.  Customer interest creates a Lead.
16.  WhatsApp contact to Rawabet can be opened.
17.  Rawabet internal user can view and manage Leads.
18.  Seller contact details never appear publicly.
19.  Users cannot access unauthorized administrative functions.
20.  Critical changes are recorded in an audit trail.
21.  System is deployed successfully on the approved Hostinger environment.
22.  No Critical or High-severity release-blocking defect remains open.

# **7\. PRODUCT PRINCIPLES**

The developer must treat the following principles as non-negotiable.

## **7.1 Rawabet Is the Visible Seller**

Public pages shall not disclose the identity of the property source.

## **7.2 Approval Before Publication**

External users cannot publish directly.

## **7.3 Privacy by Default**

Sensitive source information is private unless explicitly authorized.

## **7.4 Permission by Capability**

Access is permission-driven, not only role-name-driven.

## **7.5 Server-Side Enforcement**

Frontend hiding is not considered security.

Every permission must also be enforced by the backend.

## **7.6 Existing Published Version Must Remain Stable**

A seller editing an already published property must not immediately alter the public version.

The approved public version remains visible until the new revision is approved.

## **7.7 No External Contact Bypass**

Seller-generated property content must not contain:

-   External URLs.
-   WhatsApp links.
-   Social media links.
-   Email addresses.
-   Seller phone numbers.
-   QR links.
-   Contact instructions intended to bypass Rawabet.

## **7.8 No Online Financial Transaction**

All negotiation, commissions, contracts and payments remain outside the application for the defined releases unless separately approved.

# **8\. INITIAL OPERATING SCOPE**

## **Geography**

Initial active governorate:

**Kafr El Sheikh**

The database and user interface must not hard-code Kafr El Sheikh as the only possible governorate.

Governorates are configurable master data.

Additional governorates become visible only when activated by Super Admin.

# **9\. PRODUCT LANGUAGE & TONE**

## **Release 1**

Arabic only.

Direction:

RTL.

Preferred primary font:

**Cairo**

Fallback:

A modern Arabic-compatible sans-serif font.

Tone of voice:

-   Friendly.
-   Clear.
-   Semi-formal.
-   Professional.
-   Human.
-   Locally understandable.
-   Not slang-heavy.
-   Not overly corporate.
-   Not random or informal.

Example:

Preferred:

**"عقارك المناسب أقرب مما تتخيل."**

Avoid:

Excessively formal legal-style copy in normal customer journeys.

Avoid:

Overly casual slang.

# **10\. TARGET TECHNOLOGY CONSTRAINT**

The approved target architecture for Release 1 is:

**Laravel Full Stack**

Recommended composition:

-   Laravel — supported stable version.
-   PHP supported by Hostinger.
-   Blade.
-   Livewire where required.
-   Alpine.js where useful.
-   Filament for internal administration where appropriate.
-   MySQL.
-   Standard Laravel authentication/security mechanisms.
-   Open-source packages only unless explicitly approved.

The solution shall not require, for Release 1:

-   Persistent Node.js server.
-   Next.js server runtime.
-   Redis.
-   Elasticsearch.
-   Meilisearch.
-   Kubernetes.
-   Docker in production.
-   WebSockets.
-   Permanent background queue worker.
-   Paid external CRM.
-   Paid authentication service.
-   Paid image processing SaaS.

The developer may propose an alternative only through written technical approval.

# **11\. HOSTING CONSTRAINT**

Deployment target:

**Hostinger Premium Shared Hosting**

The application must therefore:

-   Operate within shared hosting limitations.
-   Use MySQL.
-   Support standard cron jobs.
-   Avoid permanent worker processes.
-   Avoid high-memory runtime requirements.
-   Avoid infrastructure requiring root access.
-   Avoid mandatory external microservices.

# **12\. USERS & STAKEHOLDERS**

The platform contains the following logical user categories.

## **12.1 Guest**

Unauthenticated visitor.

## **12.2 Customer**

Authenticated person looking for property.

## **12.3 Property Owner**

Authenticated property owner capable of submitting properties.

## **12.4 Broker**

Authenticated real estate broker capable of submitting properties.

## **12.5 Internal User**

Rawabet employee with permissions assigned by Super Admin.

Examples:

-   Property Reviewer.
-   Sales User.
-   Operations User.
-   Content User.

## **12.6 Super Admin**

Highest application-level administrative authority.

# **13\. USER CAPABILITY MODEL**

A normal customer account is the base external account.

An account may additionally be granted seller capability:

-   Owner.
-   Broker.

Every Owner/Broker can still use the public website as a customer.

Seller capabilities do not grant access to other sellers' private property records.

# **14\. SUPER ADMIN ROLE**

Super Admin shall have authority to:

-   Create users.
-   Edit users.
-   Disable users.
-   Assign roles.
-   Assign individual permissions.
-   Create permission templates.
-   Modify existing user permissions.
-   Verify Owner/Broker accounts.
-   Manage governorates.
-   Manage locations.
-   Manage property types.
-   Manage system settings.
-   Manage contact information.
-   Manage branding fields.
-   Manage legal content.
-   Manage help resources.
-   Access audit logs.
-   Override states when explicitly allowed.
-   Grant internal users the right to edit approved properties.
-   Manage administrative role templates.

Super Admin actions affecting security or published information shall be audited.

# **15\. ROLE TEMPLATES**

The system shall ship with configurable default role templates.

## **RT-001 — Property Reviewer**

Recommended permissions:

-   View pending properties.
-   View seller private contact details.
-   Edit pending properties.
-   Approve properties.
-   Reject properties.
-   Add internal review note.
-   Contact seller.
-   View property history.

## **RT-002 — Sales User**

Recommended permissions:

-   View assigned/authorized Leads.
-   Update Lead status.
-   Add Lead note.
-   Call customer.
-   Open WhatsApp contact.
-   View published property information.

## **RT-003 — Operations Manager**

Recommended permissions:

-   Property Reviewer permissions.
-   View operational dashboard.
-   View Leads.
-   View critical audit entries.
-   Reassign review work if implemented.

## **RT-004 — Content Manager**

Recommended permissions:

-   Edit public static content.
-   Manage help resources.
-   No property approval unless separately granted.

Templates are starting points.

The Super Admin may customize permissions per user.

# **16\. PERMISSION ARCHITECTURE**

Permissions must be granular.

Example permission keys:

### **Users**

-   user.view
-   user.create
-   user.edit
-   user.disable
-   user.verify
-   user.assign\_role
-   user.assign\_permission

### **Properties**

-   property.view\_own
-   property.create
-   property.edit\_own\_draft
-   property.submit
-   property.view\_pending
-   property.review
-   property.approve
-   property.reject
-   property.edit\_pending
-   property.edit\_published
-   property.archive
-   property.mark\_sold
-   property.mark\_rented
-   property.view\_source\_private\_data

### **Leads**

-   lead.view
-   lead.edit
-   lead.assign
-   lead.change\_status
-   lead.add\_note
-   lead.export

### **Configuration**

-   configuration.locations
-   configuration.property\_types
-   configuration.system\_settings
-   configuration.branding
-   configuration.legal
-   configuration.help

### **Audit**

-   audit.view

Normal users shall never be able to delete audit history.

# **17\. HIGH-LEVEL PERMISSION MATRIX**

**Capability**

**Guest**

**Customer**

**Owner**

**Broker**

**Reviewer**

**Sales**

**Super Admin**

Browse published properties

Yes

Yes

Yes

Yes

Yes

Yes

Yes

View unpublished property

No

No

Own only

Own only

With permission

No

Yes

Submit property

No

No

Yes

Yes

Optional

No

Yes

Edit own draft

No

No

Yes

Yes

N/A

No

Yes

Approve property

No

No

No

No

Permission

No

Yes

Reject property

No

No

No

No

Permission

No

Yes

View seller private contact

No

No

Own

Own

Permission

No

Yes

View Leads

No

Own inquiry history if enabled

No

No

Permission

Permission

Yes

Manage roles

No

No

No

No

No

No

Yes

Manage governorates

No

No

No

No

No

No

Yes

Edit published property directly

No

No

No

No

Permission

No

Yes

View audit

No

No

No

No

Optional

No

Yes

# **18\. ACCOUNT STATUS MODEL**

Accounts must have independent state fields.

## **Account Status**

-   Active.
-   Suspended.
-   Disabled.

## **Email Status**

-   Unverified.
-   Verified.

## **Platform Verification Status**

Applicable mainly to Owner/Broker:

-   Not Requested.
-   Pending.
-   Verified.
-   Rejected.

These concepts must not be merged into a single status field.

# **19\. TRUST & VERIFICATION MODEL**

Platform verification means Rawabet has manually accepted the seller identity as trusted.

It does not mean every future property is automatically approved.

A verified Broker/Owner still submits every property through the property review workflow.

A non-verified Broker/Owner is still allowed to submit properties.

Their properties still require review.

# **20\. PUBLIC TRUST DISPLAY**

Because seller identity is hidden from customers, customer-facing pages shall not publicly expose the seller verification identity.

Instead, an approved public property may display a platform-level badge such as:

**"تمت مراجعة العقار من روابط"**

Internal seller profile may display:

**"موثق من روابط"**

or:

**"الحساب غير موثق من روابط"**

# **21\. SELLER VERIFICATION PROMPT**

When an authenticated Customer activates Owner or Broker capability, show a friendly verification prompt.

Example Arabic copy:

**"خلّي حسابك أوثق"**

**"توثيق حسابك من روابط يساعد فريقنا على التعامل مع عقاراتك بشكل أسرع ويزيد مستوى الثقة. تقدر تكمل دلوقتي وتطلب التوثيق في أي وقت."**

Actions:

-   Request Verification.
-   Not Now.

Verification is not mandatory for property submission in Release 1.

# **22\. BUSINESS RULES**

## **BR-001**

Only properties with an approved public version may appear to customers.

## **BR-002**

Owner/Broker identity must never appear on the public property page in Release 1.

## **BR-003**

Public contact information must belong to Rawabet.

## **BR-004**

Every externally submitted property must be reviewed.

## **BR-005**

Rejection requires a mandatory rejection reason.

## **BR-006**

Rejection reason must be visible to the property submitter.

## **BR-007**

An authorized reviewer may contact the submitter by phone or WhatsApp from the internal review screen.

## **BR-008**

External users can only edit property records they own.

## **BR-009**

A published property cannot be silently replaced by a seller edit.

## **BR-010**

Seller edits to published properties create a pending revision.

## **BR-011**

The previously approved public version remains live until the revision is approved.

## **BR-012**

Authorized internal users may directly edit a published property only if granted the specific permission by Super Admin.

## **BR-013**

Direct internal edits to published properties must be audited.

## **BR-014**

External links are forbidden in seller-generated property fields.

## **BR-015**

Phone numbers, email addresses or social handles must not be allowed in public seller-generated text fields.

## **BR-016**

Public users can only query Published records.

## **BR-017**

Kafr El Sheikh is the only initially active governorate.

## **BR-018**

Only Super Admin may activate additional governorates.

## **BR-019**

Activating a governorate must automatically make it available to applicable registration, profile, property and filter interfaces.

## **BR-020**

Financial transactions are outside the system.

## **BR-021**

The application shall not process brokerage payment.

## **BR-022**

The application shall not expose commission calculations in Release 1.

## **BR-023**

The two approved Rawabet contact numbers must be configuration values and never hard-coded throughout templates.

Initial approved numbers:

-   01000920759
-   01000920749

## **BR-024**

Opening WhatsApp through the platform creates or updates a Lead activity.

## **BR-025**

In Release 1, a WhatsApp deep-link click must not be interpreted as confirmed WhatsApp delivery.

The accurate status shall be:

**WhatsApp Contact Initiated**

not:

**Message Delivered**

## **BR-026**

Only a future WhatsApp API integration may confirm message delivery.

## **BR-027**

Critical audit entries cannot be modified or deleted by standard users.

## **BR-028**

All sensitive permission checks must be backend-enforced.

## **BR-029**

Deactivated users cannot authenticate.

## **BR-030**

Disabling a seller must not delete historical properties.

## **BR-031**

Disabling an internal employee must not delete their historical review/audit actions.

## **BR-032**

All public property pages use Rawabet branding.

## **BR-033**

Property source data must never be serialized into public HTML/API responses.

## **BR-034**

No developer-owned infrastructure or SaaS dependency may be required for the system to function.

# **23\. PROPERTY STATUS WORKFLOW**

The primary status model is:

**Draft → Pending Review → Published**

Alternative outcomes:

**Pending Review → Rejected**

Published property actions:

**Published → Pending Revision**

While Pending Revision:

-   Current approved version remains public.
-   Proposed revision remains private.

Revision outcome:

**Pending Revision → Published with New Approved Version**

or:

**Pending Revision → Revision Rejected / Published Old Version Remains**

Terminal or operational statuses:

-   Archived.
-   Sold.
-   Rented.

# **24\. PROPERTY VERSIONING REQUIREMENT**

A property shall maintain at least:

-   Current working version.
-   Current approved public version.
-   Previous approval/rejection history.

For every submitted revision, the system shall record:

-   Version number.
-   Submitted by.
-   Submitted date/time.
-   Reviewed by.
-   Review date/time.
-   Decision.
-   Rejection reason where applicable.
-   Fields changed.
-   Previous values where required for audit.

# **25\. PROPERTY TYPES — INITIAL CONFIGURATION**

Release 1 initial property types:

1.  Apartment.
2.  Villa.
3.  Land.
4.  Shop.
5.  Office.

Property types must be configurable master data.

Super Admin may:

-   Create type.
-   Rename type.
-   Activate type.
-   Disable type.
-   Configure minimum image count.
-   Configure maximum image count.

# **26\. INITIAL IMAGE LIMITS**

Recommended Release 1 defaults:

**Property Type**

**Minimum Images**

**Maximum Images**

Apartment

3

12

Villa

5

20

Land

1

8

Shop

2

10

Office

2

10

These are configuration values, not hard-coded business constants.

Maximum uploaded file size in Release 1:

**2 MB per image**

Allowed formats:

-   JPG.
-   JPEG.
-   PNG.
-   WEBP.

Automatic advanced optimization/conversion is Release 1.1/2 functionality.

# **27\. VIDEO POLICY**

To protect the 5–8 day MVP schedule and Hostinger Shared Hosting resources:

**Direct seller video upload is not part of Release 1.0.**

Release 2.0 target:

-   One property video.
-   Maximum 90 seconds.
-   File size controlled by configuration.
-   Approved formats only.
-   No external video URL from external users.

Super Admin instructional YouTube links are separate from property media and may be supported earlier.

# **28\. LOCATION MODEL**

Hierarchy:

**Governorate → City/Center → Area**

Initial:

Governorate:

Kafr El Sheikh.

Super Admin shall manage:

-   Governorates.
-   Cities/Centers.
-   Areas.
-   Active/Inactive status.

External users cannot create arbitrary locations.

# **29\. PUBLIC LOCATION PRIVACY**

The system shall support:

-   Public area.
-   Internal detailed address.

Public property details should display the approved public location level.

Exact private address should not be automatically exposed unless specifically configured.

# **30\. EPIC AUTH — AUTHENTICATION & CUSTOMER ONBOARDING**

## **US-AUTH-001 — Guest Browsing**

### **User Story**

As a Guest, I want to browse published properties without creating an account so that I can understand the available inventory before registering.

### **Business Rules**

-   Authentication is not required for listing pages.
-   Only Published properties may be returned.

### **Acceptance Criteria**

1.  Guest can open Home.
2.  Guest can open property listing.
3.  Guest can search.
4.  Guest can filter.
5.  No private source field is returned.
6.  Unpublished properties never appear.

### **Validation Rules**

No user input beyond filter validation.

### **Error Messages**

Arabic:

**"مفيش عقارات مطابقة للبحث حاليًا. جرّب تغيّر الفلاتر."**

### **Security Considerations**

Public queries must enforce publication state at server/database query level.

## **US-AUTH-002 — Quick Customer Registration**

### **User Story**

As a Guest, I want to create my account without leaving the property journey so that I can continue viewing detailed information.

### **Trigger**

Customer clicks an action requiring account creation, such as:

**"رؤية المزيد"**

### **Required Fields**

-   Full Name.
-   WhatsApp/Mobile Number.
-   Email Address.
-   Governorate.
-   Area.
-   Privacy/Terms consent.

### **UX Requirement**

Registration shall occur inside a modal/popup.

The user must not be unnecessarily redirected away from the property journey.

### **Acceptance Criteria**

1.  Popup appears without losing current property context.
2.  Entered data remains if validation fails.
3.  Successful registration creates customer account.
4.  User becomes authenticated.
5.  Temporary/default profile avatar is displayed.
6.  User returns to the intended property content.
7.  Customer Profile is automatically created.
8.  Mobile number is stored as the primary contact number.

### **Validation Rules**

Name:

-   Required.
-   2–100 characters.
-   Remove unsafe markup.

Mobile:

-   Required.
-   Egyptian mobile format in Release 1.
-   Must be normalized before storage.
-   Duplicate number handling required.

Email:

-   Required in Release 1.
-   Valid email syntax.
-   Unique or linked to existing account.

Governorate:

-   Must reference Active master data.

Area:

-   Must belong to selected governorate/city.

Consent:

-   Required.

### **Error Messages**

**"اكتب اسمك علشان نكمّل."**

**"رقم الموبايل مش مكتوب بشكل صحيح."**

**"البريد الإلكتروني مش صحيح."**

**"الحساب ده موجود بالفعل. سجّل دخول بدل ما تعمل حساب جديد."**

**"اختار المحافظة والمنطقة."**

**"لازم توافق على سياسة الخصوصية وشروط الاستخدام علشان تكمل."**

### **Security Considerations**

-   Rate-limit account creation.
-   CSRF protection.
-   Server-side validation.
-   Prevent mass assignment.
-   Normalize phone.
-   Do not trust hidden fields.
-   Password/session tokens must never appear in logs.

## **US-AUTH-003 — Release 1 Email Verification**

### **User Story**

As a Customer, I want to verify my email so that Rawabet can safely send me account and property-related notifications.

### **Release 1 Decision**

Automated WhatsApp OTP is not required in Release 1.

Email verification shall be the available automated verification channel.

### **Acceptance Criteria**

1.  Verification email can be sent.
2.  Verification token/code expires.
3.  Successful verification updates email\_verified\_at.
4.  Old/used code cannot be reused.
5.  Verification does not mark the user as Platform Verified.

### **Validation**

Recommended OTP rules:

-   6 digits.
-   10 minute expiry.
-   Maximum 5 incorrect attempts.
-   Resend cooldown 60 seconds.
-   Rate limit resends.

### **Error Messages**

**"كود التأكيد غير صحيح."**

**"الكود انتهت صلاحيته. اطلب كود جديد."**

**"استنى شوية قبل ما تطلب كود جديد."**

### **Security**

-   OTP stored hashed.
-   Never log OTP.
-   Rate-limit.
-   Expire after use.

## **US-AUTH-004 — External Login**

### **User Story**

As an external user, I want to log in securely to access my profile and property submissions.

### **Release 1**

Standard secure authentication may use:

-   Email/password, or
-   Email one-time authentication implementation agreed during technical design.

The implementation shall remain compatible with future WhatsApp OTP.

### **Acceptance Criteria**

-   Active valid user can authenticate.
-   Suspended/disabled user cannot authenticate.
-   Secure session created.
-   Login redirects appropriately.

### **Error Message**

**"بيانات الدخول غير صحيحة."**

**"الحساب متوقف. تواصل مع فريق روابط للمساعدة."**

### **Security**

-   Laravel password hashing if passwords are used.
-   Secure session.
-   Regenerate session after authentication.
-   Login throttling.

## **US-AUTH-005 — Activate Owner/Broker Capability**

### **User Story**

As an authenticated Customer, I want to identify myself as an Owner or Broker so I can submit properties.

### **Acceptance Criteria**

1.  Customer can choose Owner.
2.  Customer can choose Broker.
3.  Applicable seller profile is created.
4.  Verification prompt is displayed.
5.  User can dismiss verification prompt.
6.  User can still submit property if unverified.
7.  Seller capability does not grant administrative permissions.

### **Error Messages**

**"اختار نوع الحساب علشان نجهزلك الأدوات المناسبة."**

### **Security**

Role escalation must only grant predefined external seller permissions.

# **31\. EPIC VER — PLATFORM VERIFICATION**

## **US-VER-001 — Request Platform Verification**

### **User Story**

As an Owner/Broker, I want to request Rawabet verification.

### **Acceptance Criteria**

-   Verification request may be submitted.
-   Status becomes Pending.
-   Authorized internal staff can review.
-   User remains operational while Pending.

### **Security**

External user cannot set verification status directly.

## **US-VER-002 — Approve Verification**

### **User Story**

As an authorized Rawabet user, I want to mark a seller as verified.

### **Acceptance Criteria**

-   Requires user.verify permission.
-   Status changes to Verified.
-   Timestamp recorded.
-   Approver recorded.
-   User receives notification.
-   Audit event created.

### **Error Message**

**"ما عندكش صلاحية توثيق الحسابات."**

## **US-VER-003 — Verification Badge**

### **Acceptance Criteria**

Internal seller profile shows:

Verified:

**"موثق من روابط"**

Not verified:

**"الحساب غير موثق من روابط"**

Public customer pages must not reveal seller identity.

Approved properties may show:

**"تمت مراجعة العقار من روابط"**

# **32\. EPIC PROPERTY — PROPERTY SUBMISSION**

## **US-PROP-001 — Create Property Draft**

### **User Story**

As an Owner/Broker, I want to create a property draft.

### **Minimum Property Fields**

-   Property Reference — generated automatically.
-   Property Type.
-   Transaction Type.
-   Governorate.
-   City/Center.
-   Area.
-   Public Location Description.
-   Private Detailed Address.
-   Price.
-   Area in square meters.
-   Bedrooms where applicable.
-   Bathrooms where applicable.
-   Floor where applicable.
-   Finishing status.
-   Property Title.
-   Description.
-   Features.
-   Images.
-   Seller internal reference.
-   Owner/Broker account source.

### **Acceptance Criteria**

1.  Seller can create draft.
2.  Draft is private.
3.  Draft can be saved incomplete.
4.  Seller sees only own draft.
5.  Reference number generated automatically.

### **Security**

Seller account ID must be derived from authenticated user, never supplied blindly by form.

## **US-PROP-002 — Submit Property for Review**

### **User Story**

As an Owner/Broker, I want to submit my complete property for review.

### **Acceptance Criteria**

1.  Required fields validated.
2.  Image limits validated.
3.  Forbidden contact content checked.
4.  Status becomes Pending Review.
5.  Submission timestamp recorded.
6.  Reviewer queue receives property.
7.  Seller receives confirmation.

### **Arabic Confirmation**

**"تم إرسال العقار للمراجعة. فريق روابط هيراجع البيانات ويبلغك بالنتيجة."**

### **Validation**

-   Price > 0.
-   Area > 0.
-   Active property type.
-   Active transaction type.
-   Active location.
-   Images meet type minimum/maximum.
-   Description within configured limit.
-   Forbidden URL/contact patterns blocked.
-   Required applicable fields completed.

### **Errors**

**"كمّل البيانات المطلوبة قبل إرسال العقار."**

**"عدد الصور أقل من الحد المطلوب لنوع العقار ده."**

**"عدد الصور أكبر من الحد المسموح."**

**"مينفعش تضيف رقم تليفون أو رابط خارجي داخل بيانات العقار."**

## **US-PROP-003 — Upload Property Image**

### **Acceptance Criteria**

-   Allowed file type only.
-   Max 2 MB per Release 1 image.
-   Randomized stored filename.
-   Image is associated only with authorized property.
-   User can reorder images.
-   One image may be marked Cover.

### **Errors**

**"نوع الصورة غير مدعوم."**

**"حجم الصورة أكبر من 2 ميجابايت."**

**"حصلت مشكلة أثناء رفع الصورة. جرّب مرة تانية."**

### **Security**

-   Validate actual MIME.
-   Reject executable/polyglot types where detectable.
-   Store uploads in non-executable location.
-   Never use original user filename as filesystem path.
-   Sanitize metadata where feasible.

## **US-PROP-004 — Edit Draft**

Seller may freely edit Draft before submission.

No reapproval issue applies because the property is not public.

## **US-PROP-005 — Seller Views Own Properties**

Seller dashboard shall display own records only.

Columns:

-   Reference.
-   Type.
-   Area.
-   Price.
-   Status.
-   Last Update.
-   Review Result.
-   Action.

The seller must not access another seller's records by changing URL IDs.

# **33\. EPIC REVIEW — PROPERTY REVIEW & APPROVAL**

## **US-REV-001 — Review Queue**

### **User Story**

As a Property Reviewer, I want to see pending submissions.

### **Acceptance Criteria**

Queue contains:

-   Reference.
-   Submitter.
-   Submitter verification status.
-   Submission time.
-   Type.
-   Location.
-   Price.
-   Pending age.

Reviewer can open submission.

### **Security**

Requires property.view\_pending.

## **US-REV-002 — Reviewer Property Screen**

Reviewer sees:

-   All submitted public fields.
-   Seller name.
-   Seller phone.
-   Seller WhatsApp.
-   Seller email.
-   Seller verification status.
-   Internal address.
-   Review history.

Actions based on permission:

-   Edit.
-   Approve.
-   Reject.
-   Call Seller.
-   WhatsApp Seller.

Seller contact details remain internal.

## **US-REV-003 — Reviewer Edits Pending Property**

### **User Story**

As an authorized reviewer, I want to correct property information before approval.

### **Acceptance Criteria**

-   Requires property.edit\_pending.
-   Changes save to pending version.
-   Modification is traceable.
-   Reviewer cannot unintentionally change source ownership.
-   Seller receives final approved version status.

### **Security**

Sensitive ownership/source fields require stronger permission.

## **US-REV-004 — Approve Property**

### **Acceptance Criteria**

1.  Reviewer has property.approve.
2.  Current state is Pending Review.
3.  Required information still valid.
4.  Approved version becomes public version.
5.  Property becomes Published.
6.  Approval user/time logged.
7.  Seller notified in-app.
8.  Seller emailed when email is available.
9.  Property visible in public listing.

### **Arabic Notification**

**"تمت الموافقة على العقار ونشره على روابط."**

### **Concurrency**

If another reviewer already processed the record:

Show:

**"العقار اتراجع بالفعل بواسطة مستخدم آخر. حدّث الصفحة علشان تشوف آخر حالة."**

## **US-REV-005 — Reject Property**

### **Acceptance Criteria**

1.  Reviewer has property.reject.
2.  Reject action opens mandatory modal.
3.  Rejection Reason is required.
4.  Empty reason prevents action.
5.  Reason stored.
6.  Seller notified.
7.  Rejected property remains non-public.
8.  Reviewer identity and time recorded.

### **Validation**

Reason:

-   Required.
-   Minimum 10 characters.
-   Maximum 1000 characters.

### **Arabic Errors**

**"اكتب سبب الرفض قبل ما تكمل."**

### **Arabic Notification**

**"العقار محتاج تعديل قبل النشر."**

Then show reason.

## **US-REV-006 — Seller Corrects Rejected Property**

Seller may edit rejected property and resubmit.

New submission creates new review cycle.

Previous rejection remains in history.

# **34\. EPIC REVISION — CHANGES AFTER PUBLICATION**

## **US-RVS-001 — Seller Edits Published Property**

### **User Story**

As a Seller, I want to update my published property without immediately changing approved public information.

### **Business Rule**

Published version remains unchanged.

### **Acceptance Criteria**

1.  Seller selects Edit.
2.  New revision is created.
3.  Public version remains visible.
4.  Seller can edit revision.
5.  Submission moves revision to Pending Review.
6.  Reviewer sees changed fields.
7.  Approved revision replaces public version.
8.  Rejected revision does not affect live version.

### **UI**

Seller sees:

**"في تعديل مستني المراجعة. النسخة المنشورة الحالية هتفضل ظاهرة لحد اعتماد التعديل."**

## **US-RVS-002 — Change Comparison**

Reviewer should be able to identify changed important fields.

At minimum highlight changes to:

-   Price.
-   Public location.
-   Private address.
-   Title.
-   Description.
-   Images.
-   Property status.
-   Features.

## **US-RVS-003 — Direct Internal Edit of Published Property**

Authorized internal user may directly modify public property only with:

**property.edit\_published**

All such edits must create a critical audit record.

# **35\. EPIC PUBLIC — CUSTOMER PROPERTY EXPERIENCE**

## **US-PUB-001 — Home**

Release 1 Home must provide:

-   Rawabet brand.
-   Primary property search.
-   Active governorate/area inputs.
-   Property type.
-   Transaction type.
-   Price selection where appropriate.
-   Selected/new properties.
-   Clear contact CTA.

No complex SEO implementation is required.

## **US-PUB-002 — Property Listing**

Each card should display approved public information only.

Recommended:

-   Cover image.
-   Price.
-   Type.
-   Area/location.
-   Size.
-   Rooms where relevant.
-   Transaction type.
-   Rawabet-reviewed indicator.
-   View More CTA.

## **US-PUB-003 — Search**

Minimum Release 1 filters:

-   Governorate.
-   City/Center.
-   Area.
-   Property Type.
-   Transaction Type.
-   Minimum Price.
-   Maximum Price.
-   Minimum Area.
-   Maximum Area.
-   Bedrooms where applicable.

### **Validation**

Min price <= Max price.

Min area <= Max area.

### **Error**

**"الحد الأدنى لازم يكون أقل من الحد الأقصى."**

## **US-PUB-004 — Sorting**

Release 1:

-   Newest.
-   Price Low to High.
-   Price High to Low.

## **US-PUB-005 — Property Details Access**

Guest may see listing/card-level information.

Clicking **"رؤية المزيد"** may trigger the customer onboarding modal if the user is not authenticated.

After successful onboarding/authentication, reveal the full approved property detail view.

No seller identity shall be displayed.

## **US-PUB-006 — Public Property Detail**

May contain:

-   Approved images.
-   Title.
-   Price.
-   Property type.
-   Transaction type.
-   Approved public area.
-   Size.
-   Rooms.
-   Bathrooms.
-   Floor.
-   Finishing.
-   Description.
-   Features.
-   Rawabet trust message.
-   Rawabet contact CTA.

Must not contain:

-   Owner name.
-   Broker name.
-   Seller phone.
-   Seller email.
-   Seller WhatsApp.
-   Internal source ID.
-   Private notes.

# **36\. EPIC LEAD — CUSTOMER LEAD MANAGEMENT**

## **US-LEAD-001 — Create Lead From Property Interest**

### **Trigger**

Customer selects:

-   Contact Rawabet.
-   WhatsApp.
-   Call.
-   Interested in Property.

### **Lead Fields**

-   Lead Reference.
-   Customer ID.
-   Customer Name.
-   Customer Mobile.
-   Customer Email.
-   Property ID.
-   Property Reference.
-   Lead Source.
-   Contact Channel.
-   Status.
-   Assigned User if applicable.
-   Created At.
-   Last Activity At.
-   Notes.

## **US-LEAD-002 — WhatsApp Contact**

When authenticated customer selects WhatsApp:

1.  Create/update lead.
2.  Add activity:  
    **WhatsApp Contact Initiated**
3.  Open configured Rawabet WhatsApp number.
4.  Prefill message.

Recommended message:

**"أهلاً، أنا مهتم بالعقار رقم {PROPERTY\_REFERENCE} على روابط. محتاج أعرف تفاصيل أكتر."**

No seller phone shall be included.

## **US-LEAD-003 — Phone Call Contact**

When customer presses Call:

1.  Create/update Lead.
2.  Add activity:  
    **Call Contact Initiated**
3.  Open configured Rawabet telephone link.

## **US-LEAD-004 — Duplicate Lead Prevention**

If the same authenticated customer contacts Rawabet for the same property while an open Lead already exists, the system should not generate unlimited duplicate lead rows.

Recommended rule:

If open Lead exists for:

Customer + Property

then:

-   Add new activity.
-   Update last\_activity\_at.
-   Preserve existing Lead.

A new Lead may be created after prior Lead has been closed according to future business configuration.

## **US-LEAD-005 — Lead Statuses**

Release 1 statuses:

-   New.
-   WhatsApp Contact Initiated.
-   Call Contact Initiated.
-   Contacted.
-   Follow Up.
-   Viewing.
-   Won.
-   Lost.

Internal user must manually move from Initiated to Contacted unless automated communication confirmation exists.

## **US-LEAD-006 — Lead Notes**

Authorized Sales user may add internal note.

Notes must never be visible publicly.

Recommended note fields:

-   Text.
-   Created by.
-   Timestamp.

# **37\. EPIC CRM — BASIC INTERNAL CRM**

Release 1 intentionally contains a lightweight CRM.

It does not require EspoCRM.

Release 1 CRM includes:

-   Lead list.
-   Search.
-   Filter by status.
-   Filter by date.
-   Filter by property.
-   Lead detail.
-   Status update.
-   Notes.
-   Customer contact.
-   Property link.
-   Basic dashboard counts.

EspoCRM integration shall be evaluated in Release 2.

# **38\. EPIC NOTIFICATION — NOTIFICATIONS**

## **Release 1 Channels**

-   In-app.
-   Email.

No automated WhatsApp API notification is required in Release 1.

## **Notification Events**

At minimum:

### **Property Submitted**

Internal reviewers notified.

### **Property Approved**

Seller notified.

### **Property Rejected**

Seller notified with rejection reason.

### **Revision Approved**

Seller notified.

### **Revision Rejected**

Seller notified.

### **Seller Platform Verification Approved**

Seller notified.

### **Seller Verification Rejected**

Seller notified if rejection workflow is used.

# **39\. EMAIL REQUIREMENTS**

Email templates must:

-   Use Rawabet name.
-   Use Arabic.
-   Avoid exposing internal data.
-   Include property reference when relevant.
-   Use configurable company sender identity where hosting permits.

Failure to send email must not corrupt the underlying business transaction.

Example:

Property approval succeeds even if email transport temporarily fails.

Email failure should be logged for administrators.

# **40\. EPIC ADMIN — USER MANAGEMENT**

## **US-ADM-001 — Create Internal User**

Super Admin can:

-   Enter name.
-   Email.
-   Phone.
-   Choose template.
-   Select permissions through checkboxes.
-   Save.

### **Acceptance Criteria**

-   User created.
-   Effective permissions visible.
-   Sensitive permissions clearly grouped.
-   Duplicate email/phone prevented where required.

## **US-ADM-002 — Customize Permissions**

Super Admin can modify individual permission selections after selecting a role template.

System shall clearly differentiate:

-   Template defaults.
-   Actual effective permissions.

## **US-ADM-003 — Disable User**

Disabling user:

-   Prevents future login.
-   Does not delete history.
-   Does not delete audit entries.
-   Does not reassign ownership automatically unless separately requested.

# **41\. EPIC CONFIG — LOCATIONS**

Super Admin can:

-   Add Governorate.
-   Activate/deactivate Governorate.
-   Add City/Center.
-   Add Area.
-   Activate/deactivate child locations.

If governorate is disabled:

-   It must not be selectable for new public searches/submissions.
-   Existing historical records remain valid.

# **42\. EPIC CONFIG — PROPERTY TYPES**

Super Admin can:

-   Create property type.
-   Edit property type.
-   Activate/deactivate.
-   Define applicable fields.
-   Define image minimum.
-   Define image maximum.

Changes must not invalidate old records silently.

# **43\. EPIC SETTINGS — BRAND & SYSTEM SETTINGS**

Super Admin Settings shall support, subject to Release 1 implementation:

## **Branding**

-   Logo.
-   Primary color.
-   Secondary/accent color.
-   Site name.
-   Default avatar.

Primary visual direction:

Comfortable professional green palette.

Exact HEX values shall be signed off during UI/UX design.

Color input must accept valid HEX values only.

## **Contact**

-   Primary WhatsApp.
-   Secondary WhatsApp/phone.
-   Primary call number.
-   Customer support email.

## **Legal Content**

Editable text areas:

-   Privacy Policy.
-   Terms & Conditions.
-   About Rawabet.

## **General**

-   Site headline.
-   Short platform description.

No code change should be required for these basic content updates.

# **44\. HELP & SELLER GUIDANCE**

Rawabet shall provide basic seller guidance explaining how to photograph and submit a property.

Release 1 minimum:

-   Help page.
-   Admin-editable text.
-   Super Admin PDF upload.

Release 1.1:

-   Super Admin YouTube tutorial URL.
-   Multiple help resources.

External users must never have the ability to add arbitrary links to property listings.

# **45\. FAVORITES**

Favorites are classified as Performance, not Must-Be for core Go-Live.

Target Release:

**1.1**

Rules:

-   Authenticated customer can save property.
-   Save expires after 30 days.
-   UI clearly communicates expiration.
-   Expired favorite may be deleted automatically through scheduled cleanup.
-   If property is no longer Published, it must not continue displaying as normally available.

Example Arabic copy:

**"العقار محفوظ عندك لمدة 30 يوم."**

Potential FOMO copy must remain truthful and not falsely imply property scarcity.

# **46\. AUDIT REQUIREMENTS**

The system shall audit critical business events.

Audit record fields:

-   Actor User ID.
-   Actor role.
-   Action.
-   Entity Type.
-   Entity ID.
-   Property Version where applicable.
-   Timestamp.
-   Previous value.
-   New value.
-   IP where technically reasonable.
-   Context/reason where applicable.

Critical audit events include:

-   Property approval.
-   Property rejection.
-   Rejection reason.
-   Price change.
-   Address change.
-   Description change.
-   Property image change after submission.
-   Direct internal public edit.
-   Published status change.
-   Seller account verification.
-   User permission change.
-   Role assignment change.
-   User disable/enable.
-   Governorate activation/deactivation.
-   Important legal/settings changes.

Normal users cannot edit or delete audit records.

# **47\. SECURITY REQUIREMENTS**

## **SEC-001 Authentication**

Use secure framework authentication.

## **SEC-002 Passwords**

If passwords are implemented:

-   Never store plain text.
-   Use Laravel-approved hashing.

## **SEC-003 Authorization**

Every protected route/action requires server-side authorization.

## **SEC-004 IDOR Prevention**

A seller cannot access another seller's property by modifying an ID in a URL/request.

## **SEC-005 CSRF**

All state-changing browser requests require CSRF protection.

## **SEC-006 XSS**

User-generated text must be escaped/sanitized.

## **SEC-007 SQL Injection**

Use ORM/query bindings.

No untrusted SQL concatenation.

## **SEC-008 File Security**

-   Whitelist file types.
-   Validate MIME.
-   Randomize stored names.
-   Prevent uploaded file execution.
-   Enforce size limits.

## **SEC-009 Session Security**

-   Session regeneration after login.
-   Secure cookie configuration when HTTPS is active.
-   Appropriate expiration.

## **SEC-010 HTTPS**

Production must use HTTPS.

## **SEC-011 Secrets**

Credentials belong in environment configuration.

Never commit:

-   DB password.
-   SMTP password.
-   API key.
-   App secrets.

## **SEC-012 Logging**

Logs must not contain:

-   Passwords.
-   OTP values.
-   Session tokens.
-   Authentication secrets.

## **SEC-013 Rate Limiting**

Apply rate limits to:

-   Login.
-   Registration.
-   OTP resend.
-   Contact/lead creation.
-   Sensitive submission actions.

## **SEC-014 Public Data Boundary**

Property source fields must never be included in public payloads.

## **SEC-015 Permission Escalation**

Only Super Admin can grant privileged permissions.

## **SEC-016 Audit Protection**

Audit logs cannot be deleted through normal application UI.

# **48\. SELLER CONTENT PROTECTION**

To prevent users bypassing Rawabet:

Server-side validation shall reject or flag:

-   http://
-   https://
-   [www](http://www/).
-   common social links.
-   email patterns.
-   phone numbers in public title/description.
-   WhatsApp links.

The reviewer remains the final manual control.

Automated filters are not treated as perfect fraud detection.

# **49\. NON-FUNCTIONAL REQUIREMENTS**

## **NFR-001 Responsive**

Mobile-first.

Support modern phone, tablet and desktop layouts.

## **NFR-002 RTL**

Full Arabic RTL support.

## **NFR-003 Usability**

Primary operations should require minimal unnecessary steps.

## **NFR-004 Performance**

Public listing pages must use:

-   Pagination.
-   Lazy-loaded images.
-   Indexed database columns.
-   Efficient queries.

## **NFR-005 Shared Hosting Efficiency**

Avoid memory-heavy processes.

## **NFR-006 Availability**

Application failure should show friendly error screen rather than raw exception.

## **NFR-007 Maintainability**

Code must use clear naming and conventional Laravel structure.

## **NFR-008 Browser Support**

Current modern versions of:

-   Chrome.
-   Edge.
-   Safari.
-   Firefox.

## **NFR-009 Accessibility**

Minimum:

-   Keyboard-accessible forms.
-   Visible labels.
-   Reasonable contrast.
-   Focus states.
-   Form errors connected to relevant field.

## **NFR-010 Data Integrity**

Use database constraints where appropriate.

# **50\. ERROR HANDLING STANDARD**

The user must never receive raw:

-   Stack trace.
-   SQL error.
-   PHP exception.
-   Server filesystem path.

Production errors must show controlled Arabic messages.

General:

**"حصلت مشكلة غير متوقعة. جرّب مرة تانية، ولو المشكلة مستمرة تواصل مع فريق روابط."**

Unauthorized:

**"ما عندكش صلاحية لتنفيذ الإجراء ده."**

Not Found:

**"المحتوى اللي بتدور عليه مش موجود أو مبقاش متاح."**

Session Expired:

**"جلستك انتهت. سجّل دخول تاني وكمل."**

Upload Failed:

**"حصلت مشكلة أثناء رفع الملف. جرّب مرة تانية."**

Network/Temporary:

**"الاتصال اتأخر شوية. جرّب تاني خلال لحظات."**

# **51\. VALIDATION STANDARD**

Validation must exist:

1.  Client side for UX.
2.  Server side for security.

Server-side validation is authoritative.

Validation failures must:

-   Preserve entered user data where safe.
-   Identify affected field.
-   Avoid generic error when specific error is known.
-   Return Arabic user-facing text.

# **52\. SOFT DELETE POLICY**

Recommended soft delete for:

-   Users.
-   Properties.
-   Leads where deletion is allowed.

Audit records must not use standard user-controlled deletion.

Published property deletion should normally be Archive rather than physical delete.

# **53\. BASIC DASHBOARD — RELEASE 1**

Internal Dashboard minimum widgets:

-   Pending Properties.
-   Published Properties.
-   Rejected Properties.
-   New Leads.
-   Follow-Up Leads.
-   Total Active Sellers.

No heavy analytics engine required.

# **54\. SEARCH PERFORMANCE RULES**

Database indexes recommended for:

-   property status.
-   governorate\_id.
-   city\_id.
-   area\_id.
-   property\_type\_id.
-   transaction\_type\_id.
-   price.
-   created\_at.
-   seller\_id.
-   lead status.
-   lead customer/property pair.

# **55\. KANO PRIORITIZATION MODEL**

The classification below is a working Kano-based product prioritization.

A formal Kano customer survey may later refine the classification.

## **55.1 MUST-BE REQUIREMENTS**

Customers/business would consider the platform incomplete or unsafe without these.

-   Secure user accounts.
-   Permission enforcement.
-   Owner/Broker property submission.
-   Property review.
-   Mandatory rejection reason.
-   Property approval.
-   Published-version protection.
-   Public property browsing.
-   Search.
-   Basic filters.
-   Public property details.
-   Seller data privacy.
-   Rawabet contact.
-   Lead creation.
-   Basic Lead management.
-   Email/in-app review notifications.
-   Critical audit log.
-   Location management.
-   Super Admin.
-   System settings.
-   Mobile-responsive layout.
-   HTTPS/security controls.

## **55.2 PERFORMANCE REQUIREMENTS**

More quality improves satisfaction.

-   Faster search.
-   Better filters.
-   Easier seller submission.
-   Better mobile UX.
-   Better image presentation.
-   Dashboard quality.
-   Favorites.
-   Faster review workflow.
-   Better property status visibility.
-   Seller guidance.
-   Better notification experience.
-   Image optimization.

## **55.3 ATTRACTIVE REQUIREMENTS**

Not required for initial satisfaction but may create differentiation.

-   WhatsApp OTP.
-   WhatsApp automated notifications.
-   Smart recommendations.
-   AI matching.
-   Saved search alerts.
-   Market insights.
-   Advanced CRM automation.
-   Intelligent duplicate detection.
-   AI property-description assistance.

# **56\. RELEASE ROADMAP**

# **RELEASE 1.0 — PRODUCTION MVP / GTM**

**Version:** 1.0.0  
**Target:** 5–8 working days  
**Objective:** Operate Rawabet's complete core property brokerage loop.

## **Included**

### **Authentication**

-   Guest browsing.
-   External account creation.
-   Email field.
-   Mobile/WhatsApp primary contact.
-   Secure login.
-   Email verification capability.
-   Customer profile.
-   Owner capability.
-   Broker capability.

### **Verification**

-   Platform verification status.
-   Verification request.
-   Super Admin/manual approval.
-   Verification badge internally.

### **Property**

-   Property draft.
-   Images.
-   Dynamic property types.
-   Location.
-   Submit.
-   Review.
-   Reviewer edits.
-   Approval.
-   Rejection with mandatory reason.
-   Published version.
-   Pending revision workflow.
-   Archive/Sold/Rented.

### **Public**

-   Arabic RTL.
-   Home.
-   Property listing.
-   Search.
-   Basic filters.
-   Property detail.
-   Rawabet contact.

### **Lead**

-   Create Lead.
-   WhatsApp initiated activity.
-   Phone initiated activity.
-   Lead statuses.
-   Internal notes.
-   Basic dashboard.

### **Admin**

-   Users.
-   Roles.
-   Dynamic permissions.
-   Role templates.
-   Locations.
-   Property types.
-   Settings.
-   Legal text.
-   Branding basics.
-   Contact numbers.
-   PDF help resource.

### **Communication**

-   In-app notifications.
-   Email notifications.

### **Security**

-   Full permission enforcement.
-   Critical audit.
-   Secure uploads.
-   Privacy controls.

# **RELEASE 1.1 — UX & OPERATIONAL IMPROVEMENT**

**Version:** 1.1.0  
**Target:** Immediately after MVP stabilization.

## **Scope**

-   Favorites.
-   30-day favorite expiration.
-   YouTube help resource.
-   More detailed filter UX.
-   Better submission progress indicator.
-   Improved review comparison.
-   Image auto-resize.
-   WEBP conversion if server compatibility is validated.
-   Better dashboard widgets.
-   Email template management.
-   User-facing notification center refinements.
-   Optional bulk property actions for authorized staff.

# **RELEASE 2.0 — COMMUNICATION & CRM EXPANSION**

**Version:** 2.0.0

## **Scope**

### **WhatsApp**

-   WhatsApp OTP.
-   Mobile ownership verification.
-   WhatsApp API integration.
-   Automated approval/rejection messages.
-   Communication delivery state where supported.

### **CRM**

-   Advanced Lead assignment.
-   Follow-up date.
-   Reminders.
-   Sales ownership.
-   Lead activity timeline.
-   Lead aging.
-   Advanced filtering.
-   EspoCRM integration evaluation.

Decision:

Native Rawabet CRM remains source of truth unless EspoCRM integration is explicitly approved.

### **Media**

-   One property video.
-   Maximum duration 90 seconds.
-   Configurable max file size.
-   Video validation.

### **Language**

-   English interface.
-   Arabic/English toggle.
-   Localized settings/content.

### **Customer Experience**

-   Saved searches.
-   Optional property alerts.

# **RELEASE 3.0 — GROWTH & INTELLIGENCE**

**Version:** 3.0.0

## **Scope**

-   Similar property suggestions.
-   Rule-based recommendations.
-   Advanced reports.
-   Funnel analysis.
-   Property supply analysis.
-   Lead conversion dashboard.
-   Broker/Owner performance internally.
-   Potential duplicate-property detection.
-   Better search ranking.
-   Customer behavior analytics with privacy controls.
-   PWA evaluation.

# **RELEASE 4.0 — SMART PLATFORM**

**Version:** 4.0.0

Potential scope subject to future approval:

-   AI matching.
-   AI-assisted property descriptions.
-   Intelligent lead scoring.
-   Advanced recommendation engine.
-   Native mobile application.
-   External API.
-   Partner integrations.
-   Advanced market analysis.

No Release 4 item is included in current commercial MVP.

# **57\. GOVERNORATE EXPANSION**

Multi-governorate architecture is built into Release 1.

Actual new governorates are activated operationally, not developed as separate code projects.

Super Admin:

1.  Creates governorate.
2.  Adds cities/areas.
3.  Activates governorate.
4.  Governorate appears in permitted interfaces.

# **58\. RELEASE 1 MICRO-SPRINT PLAN**

Because Release 1 is intentionally limited to 5–8 working days, these are launch micro-sprints rather than conventional two-week Scrum sprints.

## **SPRINT 0 — FINALIZATION**

**Before Development / Maximum several hours**

Deliverables:

-   BRD frozen.
-   UI/UX screens approved.
-   Hosting credentials ready.
-   Domain/subdomain ready.
-   SMTP ready.
-   Git repository created.
-   Initial system data approved.

No development begins with unresolved core workflows.

## **SPRINT 1 — FOUNDATION**

**Target: Day 1–2**

Deliver:

-   Project setup.
-   Database.
-   Authentication.
-   User profiles.
-   Account types.
-   Roles.
-   Permissions.
-   Role templates.
-   Locations.
-   Basic settings.
-   Admin access.

Exit Criteria:

Super Admin can create internal user and assign permissions.

Owner/Broker can authenticate.

## **SPRINT 2 — PROPERTY ENGINE**

**Target: Day 2–4**

Deliver:

-   Property data model.
-   Property types.
-   Draft.
-   Image upload.
-   Seller own-property dashboard.
-   Submit.
-   Review queue.
-   Reviewer edit.
-   Approve.
-   Reject.
-   Rejection reason.
-   Published-version logic.
-   Revision logic.
-   Audit events.

Exit Criteria:

Owner → Submit → Reviewer → Approve → Publish works end-to-end.

## **SPRINT 3 — CUSTOMER & LEADS**

**Target: Day 4–6**

Deliver:

-   Home.
-   Listing.
-   Search.
-   Filters.
-   Detail.
-   Customer registration modal.
-   Rawabet contact CTA.
-   WhatsApp deep link.
-   Call action.
-   Lead creation.
-   Lead statuses.
-   Internal Lead screen.

Exit Criteria:

Guest → Property → Customer → Contact → Lead works end-to-end.

## **SPRINT 4 — PRODUCTION HARDENING**

**Target: Day 6–8**

Deliver:

-   Email notifications.
-   In-app notifications.
-   Settings.
-   Legal content.
-   Help PDF.
-   Dashboard.
-   Permission QA.
-   Security review.
-   Mobile QA.
-   Error handling.
-   Deployment.
-   UAT fixes.

Exit Criteria:

Production Release Candidate accepted.

# **59\. RELEASE 1 DEFINITION OF DONE**

A User Story is Done only when:

-   Code completed.
-   Server-side validation completed.
-   Permission check completed.
-   UI completed.
-   Responsive behavior verified.
-   Acceptance Criteria passed.
-   Error states implemented.
-   Security considerations addressed.
-   No Critical bug.
-   Database migration included.
-   Code committed to project repository.
-   Relevant test evidence available.

# **60\. UAT — RELEASE 1**

Mandatory UAT scenarios:

## **UAT-01**

Owner account submits valid Apartment.

Expected:

Pending Review.

## **UAT-02**

Broker attempts to access another broker's private property.

Expected:

Denied.

## **UAT-03**

Reviewer rejects property without reason.

Expected:

Blocked.

## **UAT-04**

Reviewer rejects with reason.

Expected:

Rejected + seller notified.

## **UAT-05**

Reviewer approves property.

Expected:

Published publicly.

## **UAT-06**

Seller edits Published price.

Expected:

Public old price remains until new revision approved.

## **UAT-07**

Reviewer approves price revision.

Expected:

New approved price becomes public.

## **UAT-08**

Seller adds phone number in description.

Expected:

Validation blocks or flags submission according to approved implementation.

## **UAT-09**

Guest opens unpublished property URL.

Expected:

Not accessible.

## **UAT-10**

Customer clicks WhatsApp.

Expected:

Lead/activity created and Rawabet WhatsApp opens.

## **UAT-11**

Customer changes URL to another user's private endpoint.

Expected:

Denied.

## **UAT-12**

Internal user without approve permission tries approval.

Expected:

Denied.

## **UAT-13**

Super Admin adds new governorate but leaves it inactive.

Expected:

Not publicly selectable.

## **UAT-14**

Super Admin activates governorate.

Expected:

Available in supported forms/filters.

## **UAT-15**

Critical published price edit performed internally.

Expected:

Audit entry exists.

# **61\. DATA MODEL — HIGH LEVEL**

Expected logical entities include:

## **Users**

-   users
-   user\_profiles
-   seller\_profiles
-   roles
-   permissions
-   role\_permission
-   user\_role / user permissions

## **Verification**

-   verification\_requests
-   email\_verification/otp records

## **Locations**

-   governorates
-   cities
-   areas

## **Property Master**

-   property\_types
-   transaction\_types
-   property\_features

## **Properties**

-   properties
-   property\_versions
-   property\_media
-   property\_feature\_values
-   property\_reviews

## **Customers & Leads**

-   leads
-   lead\_activities
-   lead\_notes

## **Communication**

-   notifications

## **Configuration**

-   system\_settings
-   help\_resources

## **Governance**

-   audit\_logs

## **Later Release**

-   favorites
-   saved\_searches
-   communication\_logs
-   video\_media

Exact physical schema is part of Technical Design/SRS implementation, but it must preserve the business relationships defined here.

# **62\. DATA OWNERSHIP**

All project data belongs to the Client/Rawabet.

The developer shall not:

-   Copy production customer data to personal systems.
-   Retain production database after handover without written authorization.
-   Use customer data for portfolio/demo.
-   transfer source data to third-party AI/SaaS systems without approval.

# **63\. SOURCE CODE OWNERSHIP & FREELANCER CONTROLS**

This section is mandatory.

## **63.1 Ownership**

All custom source code created under the project becomes client project deliverable after payment according to the commercial agreement.

## **63.2 Repository**

The project must be stored in a Git repository controlled by the project owner/client team.

Developer must not keep the only repository in a personal account.

## **63.3 No Obfuscation**

Custom source code must not be:

-   Encrypted.
-   Obfuscated.
-   Compiled into an intentionally unreadable form where source is expected.
-   Protected by developer-controlled license keys.

## **63.4 Third-Party Packages**

Every package must be:

-   Documented.
-   Legally licensed.
-   Compatible with commercial use.
-   Preferably open source.

No pirated/nulled theme, plugin or script is permitted.

## **63.5 Paid Dependency**

Developer may not introduce a recurring paid service without written approval.

## **63.6 No Developer Dependency**

Production must not depend on:

-   Developer personal email.
-   Developer personal API account.
-   Developer personal hosting.
-   Developer personal domain.
-   Developer-controlled license.
-   Developer private SaaS key.

## **63.7 Secrets**

A .env.example must be delivered without real secrets.

## **63.8 Database**

All migrations and required seed/configuration logic must be supplied.

## **63.9 Documentation**

Minimum handover:

-   README.
-   Installation steps.
-   Deployment steps.
-   Required PHP extensions.
-   Cron requirements.
-   SMTP setup.
-   Storage permissions.
-   Admin account creation procedure.

# **64\. DEPLOYMENT REQUIREMENTS**

Developer shall:

1.  Deploy to approved Hostinger account.
2.  Configure production environment.
3.  Run migrations safely.
4.  Configure storage links if needed.
5.  Configure HTTPS.
6.  Configure email.
7.  Configure cron if required.
8.  Verify upload directories.
9.  Disable debug mode.
10.  Verify no secrets exposed.
11.  Test production flows.
12.  Provide backup instructions.

# **65\. BACKUP REQUIREMENTS**

At minimum:

-   Hosting backup functionality shall be enabled where included in plan.
-   Database must be exportable.
-   Uploaded media must be recoverable through hosting backup or documented backup procedure.
-   Restore instructions shall be documented.

# **66\. LOGGING**

Application logs should include:

-   Error timestamp.
-   Request context where safe.
-   Internal user ID where relevant.

Must not include:

-   Password.
-   OTP.
-   Session token.
-   Raw authentication secrets.

Production debug output must be disabled.

# **67\. PRIVACY REQUIREMENTS**

Rawabet shall collect only data reasonably required for:

-   Account operation.
-   Property submission.
-   Lead handling.
-   Communication.

Public/private field boundaries must be explicit.

Privacy Policy must be editable by Super Admin.

Registration must include consent.

Final legal wording must be approved by Rawabet/client legal/business owner.

# **68\. PROPERTY SOURCE PRIVACY MATRIX**

**Field**

**Seller**

**Reviewer**

**Sales**

**Customer/Public**

Seller Name

Own

Yes

No by default

Never

Seller Phone

Own

Yes

No by default

Never

Seller Email

Own

Yes

No by default

Never

Property Price

Yes

Yes

Yes

Yes

Public Area

Yes

Yes

Yes

Yes

Private Address

Own

Yes

Permission

No by default

Source Type

Own

Yes

No

Never

Review Notes

Own only if explicitly customer-facing

Yes

No

Never

Rejection Reason

Own

Yes

No

Never public

Published Description

Yes

Yes

Yes

Yes

# **69\. CHANGE REQUEST PROCESS**

After BRD sign-off:

Any requirement not covered by:

-   Release 1 scope,
-   approved clarification,
-   or acceptance criteria

shall be considered a Change Request.

Process:

1.  Request received.
2.  BA analyzes requirement.
3.  Impact assessed.
4.  Release placement proposed.
5.  Cost/time impact documented.
6.  Approval obtained.
7.  Requirement added to Traceability Matrix.

Developer must not silently change scope.

# **70\. TRACEABILITY MATRIX**

**ID**

**Requirement**

**Kano**

**Release**

**Sprint**

AUTH-001

Guest browsing

Must-Be

1.0

S3

AUTH-002

Quick customer account

Must-Be

1.0

S3

AUTH-003

Email verification

Must-Be/Support

1.0

S1/S4

AUTH-004

Secure login

Must-Be

1.0

S1

AUTH-005

Owner capability

Must-Be

1.0

S1

AUTH-006

Broker capability

Must-Be

1.0

S1

VER-001

Verification request

Performance

1.0

S1

VER-002

Manual seller verification

Performance

1.0

S1

VER-003

Verification badge

Performance

1.0

S1

RBAC-001

Dynamic roles

Must-Be

1.0

S1

RBAC-002

Granular permissions

Must-Be

1.0

S1

RBAC-003

Role templates

Performance

1.0

S1

LOC-001

Governorate configuration

Must-Be

1.0

S1

LOC-002

City/Area hierarchy

Must-Be

1.0

S1

LOC-003

Governorate activation

Must-Be

1.0

S1

TYPE-001

Dynamic property types

Must-Be

1.0

S2

TYPE-002

Media limits by type

Performance

1.0

S2

PROP-001

Create Draft

Must-Be

1.0

S2

PROP-002

Edit Draft

Must-Be

1.0

S2

PROP-003

Image upload

Must-Be

1.0

S2

PROP-004

Submit for review

Must-Be

1.0

S2

PROP-005

Seller own-property list

Must-Be

1.0

S2

REVIEW-001

Pending queue

Must-Be

1.0

S2

REVIEW-002

Internal source details

Must-Be

1.0

S2

REVIEW-003

Reviewer edit

Must-Be

1.0

S2

REVIEW-004

Approve

Must-Be

1.0

S2

REVIEW-005

Mandatory rejection reason

Must-Be

1.0

S2

REVIEW-006

Seller correction/resubmit

Must-Be

1.0

S2

REV-001

Published version protection

Must-Be

1.0

S2

REV-002

Pending revision

Must-Be

1.0

S2

REV-003

Reviewer field comparison

Performance

1.0/1.1

S2

REV-004

Authorized direct public edit

Must-Be

1.0

S2

PUBLIC-001

Arabic home

Must-Be

1.0

S3

PUBLIC-002

Property cards

Must-Be

1.0

S3

PUBLIC-003

Search

Must-Be

1.0

S3

PUBLIC-004

Basic filters

Performance

1.0

S3

PUBLIC-005

Sorting

Performance

1.0

S3

PUBLIC-006

Detailed property page

Must-Be

1.0

S3

PRIV-001

Hide source identity

Must-Be

1.0

S2/S3

PRIV-002

Block public source contact

Must-Be

1.0

S2

PRIV-003

Block seller links/contact in content

Must-Be

1.0

S2

LEAD-001

Property inquiry Lead

Must-Be

1.0

S3

LEAD-002

WhatsApp initiation

Must-Be

1.0

S3

LEAD-003

Phone initiation

Must-Be

1.0

S3

LEAD-004

Duplicate open Lead handling

Performance

1.0

S3

LEAD-005

Lead statuses

Must-Be

1.0

S3

LEAD-006

Internal notes

Must-Be

1.0

S3

CRM-001

Lead list

Must-Be

1.0

S3

CRM-002

Basic Lead filters

Performance

1.0

S3

NOTIF-001

In-app notifications

Must-Be

1.0

S4

NOTIF-002

Email notifications

Must-Be

1.0

S4

ADMIN-001

Create internal user

Must-Be

1.0

S1

ADMIN-002

Permission checkboxes

Must-Be

1.0

S1

ADMIN-003

Disable user

Must-Be

1.0

S1

SETTINGS-001

Rawabet contact settings

Must-Be

1.0

S4

SETTINGS-002

Logo/branding basics

Performance

1.0

S4

SETTINGS-003

Legal content

Must-Be

1.0

S4

HELP-001

PDF seller guide

Performance

1.0

S4

AUDIT-001

Critical audit log

Must-Be

1.0

S2/S4

DASH-001

Operational dashboard

Performance

1.0

S4

FAV-001

Favorites

Performance

1.1

—

FAV-002

30-day expiration

Performance

1.1

—

IMG-001

Auto WEBP conversion

Performance

1.1

—

HELP-002

YouTube training resource

Performance

1.1

—

WA-001

WhatsApp OTP

Attractive/Performance

2.0

—

WA-002

WhatsApp API notifications

Performance

2.0

—

CRM-003

Advanced CRM assignment

Performance

2.0

—

CRM-004

EspoCRM evaluation/integration

Performance

2.0

—

MEDIA-001

Property video max 90 sec

Performance

2.0

—

LANG-001

English interface

Performance

2.0

—

SEARCH-ADV-001

Saved searches

Attractive

2.0

—

REC-001

Similar properties

Attractive

3.0

—

ANALYTICS-001

Advanced analytics

Attractive

3.0

—

DUP-001

Duplicate property detection

Attractive

3.0

—

AI-001

Smart matching

Attractive

4.0

—

APP-001

Native mobile app

Attractive

4.0

—

# **71\. RELEASE BLOCKERS**

Release 1 may not go live if any of the following exists:

-   Unauthorized seller data exposure.
-   Property bypasses approval.
-   Seller can access another seller's property.
-   Non-authorized user can approve/reject.
-   Published revision overwrites live version before approval.
-   Customer Lead is not created correctly.
-   Production debug mode enabled.
-   Critical upload vulnerability.
-   Broken mobile primary journey.
-   Database migration failure.
-   Missing source code in client repository.

# **72\. DEFECT SEVERITY**

## **Critical**

-   Security breach.
-   Private seller data public.
-   Unauthorized administrative access.
-   Production data corruption.
-   Authentication bypass.
-   Application unavailable.

Release blocked.

## **High**

-   Core approval flow broken.
-   Lead flow broken.
-   Published revisions incorrect.
-   Major mobile workflow unusable.

Release blocked unless explicitly waived.

## **Medium**

-   Non-core feature defect with workaround.

Can be scheduled immediately after release if approved.

## **Low**

-   Cosmetic/minor copy issue.

Does not necessarily block release.

# **73\. POST-LAUNCH WARRANTY**

Recommended developer agreement:

**14 calendar days after production launch**

Included:

-   Fixing defects against approved BRD.
-   Fixing security bugs caused by implementation.
-   Fixing broken approved workflows.
-   Correcting release regression.

Not included:

-   New features.
-   New business rules.
-   Design redesign.
-   New integrations.
-   New reports.
-   Scope added after sign-off.

# **74\. HANDOVER CHECKLIST**

Before final developer payment:

-   Production system operational.
-   Source repository transferred/accessible.
-   No uncommitted production-only code.
-   Database migrations delivered.
-   .env.example delivered.
-   Admin credentials handed over securely.
-   Hostinger deployment documented.
-   SMTP documented.
-   Cron documented.
-   Storage documented.
-   Backup documented.
-   Open-source packages documented.
-   Known issues documented.
-   14-day support period completed according to contract.
-   No Critical/High unresolved defects.
-   BRD UAT signed off.

# **75\. COMMERCIAL/TECHNICAL EXCLUSIONS**

Unless added by written Change Request:

-   No payment gateway.
-   No online brokerage settlement.
-   No e-signature.
-   No native mobile app in Release 1.
-   No AI in Release 1.
-   No WhatsApp Business API in Release 1.
-   No advanced SEO project.
-   No blog engine requirement.
-   No complex map search.
-   No internal chat.
-   No enterprise ERP.
-   No Odoo dependency.
-   No mandatory EspoCRM dependency.
-   No Elasticsearch.
-   No real-time socket infrastructure.
-   No multi-branch model.
-   No customer-to-seller messaging.
-   No public seller directory.

# **76\. FUTURE CRM INTEGRATION PRINCIPLE**

If EspoCRM or another CRM is introduced:

Rawabet property ownership and approval data shall remain authoritative in Rawabet.

Integration must not require duplicating sensitive seller data unnecessarily.

Integration scope shall define:

-   Source of truth.
-   Sync direction.
-   Duplicate handling.
-   Failure handling.
-   Authentication.
-   Audit.
-   Data mapping.

# **77\. ARCHITECTURAL EXTENSIBILITY REQUIREMENTS**

Release 1 must avoid business logic that assumes:

-   Only one governorate forever.
-   Only five property types forever.
-   Arabic forever.
-   Only email authentication forever.
-   No API forever.
-   Only one Lead pipeline forever.

Extensible does not mean implementing future features now.

It means not making future changes unnecessarily expensive.

# **78\. UI/UX REQUIREMENTS**

UI/UX is a first-class project priority.

The developer must not use a generic unmodified admin/template appearance for public customer journeys.

Public UI must feel:

-   Clean.
-   Trustworthy.
-   Modern.
-   Friendly.
-   Arabic-native.
-   Mobile-first.

Important UX journeys:

1.  Browse property.
2.  View more.
3.  Quick account creation.
4.  Contact Rawabet.
5.  Seller adds property.
6.  Seller sees review status.
7.  Reviewer processes property.
8.  Sales follows Lead.

Each should minimize unnecessary navigation.

# **79\. DESIGN SYSTEM BASELINE**

Initial direction:

-   Arabic RTL.
-   Cairo font.
-   Comfortable professional green primary direction.
-   White/light neutral surfaces.
-   Strong readable contrast.
-   Clear form states.
-   Rounded but professional controls.
-   Consistent badges.
-   Accessible error states.

Exact final colors shall be approved during UI/UX design.

System settings may expose brand color variables, but design integrity must not depend on unrestricted styling.

# **80\. CUSTOMER INDICATOR REQUIREMENT**

Guest state may display a subtle incomplete-account indicator near the profile/avatar UI.

After successful account creation/authentication, the interface should update immediately.

Do not confuse:

-   Account created.
-   Email verified.
-   Rawabet platform verified.

These states require visually distinct meanings.

# **81\. EMPTY STATES**

Examples:

No properties:

**"لسه مفيش عقارات مطابقة للاختيارات دي."**

No seller properties:

**"أول عقار ليك لسه مستنيك. ابدأ إضافة عقار جديد."**

No Leads:

**"مفيش طلبات جديدة حاليًا."**

Pending property:

**"العقار تحت المراجعة."**

# **82\. REVIEWER COMMUNICATION**

Review screen shall provide convenient contact actions where seller contact exists:

-   Call Seller.
-   WhatsApp Seller.

These are internal-only controls.

Clicking these actions should not expose contact information publicly.

# **83\. PROPERTY REJECTION EXAMPLE**

Reviewer clicks Reject.

Modal:

**"سبب الرفض"**

Required textarea.

Example:

**"الصورة الرئيسية غير واضحة، وكمان محتاجين نتأكد من المساحة المكتوبة. عدّل البيانات وابعت العقار للمراجعة تاني."**

On confirmation:

-   Record rejection.
-   Record reviewer.
-   Record timestamp.
-   Notify seller.
-   Preserve review history.

# **84\. PROPERTY APPROVAL EXAMPLE**

Reviewer approves.

System:

1.  Validates authorization.
2.  Validates pending state.
3.  Creates/marks approved version.
4.  Sets current public version.
5.  Changes property to Published.
6.  Records audit.
7.  Sends notification.
8.  Makes property queryable publicly.

# **85\. CUSTOMER CONTACT EXAMPLE**

Customer opens published property.

Clicks:

**"كلّمنا على واتساب"**

System:

1.  Finds/creates open Lead.
2.  Records customer/property.
3.  Records channel = WhatsApp.
4.  Adds activity = WhatsApp Contact Initiated.
5.  Updates last\_activity.
6.  Opens Rawabet WhatsApp deep link.

# **86\. INITIAL RAWABET CONTACT CONFIGURATION**

Initial approved contact numbers:

**01000920759**

**01000920749**

Developer must implement these through system configuration.

The business must be able to change them without modifying source code.

# **87\. NO CONTACT LEAKAGE ACCEPTANCE TEST**

QA must inspect:

-   Public HTML.
-   Page source.
-   JSON responses.
-   JavaScript variables.
-   network responses accessible to guest/customer.

Seller phone/email/source IDs must not be present.

Simply hiding fields with CSS is an automatic test failure.

# **88\. INITIAL GO-LIVE DATA**

Before Go-Live, Super Admin should have:

-   Kafr El Sheikh governorate.
-   Required cities/centers.
-   Required areas.
-   Five initial property types.
-   Sale/Rent transaction types as approved.
-   Initial contact numbers.
-   Logo.
-   Primary colors.
-   Privacy Policy.
-   Terms.
-   About text.
-   Help PDF if available.
-   Internal users.
-   Permission templates.

# **89\. ASSUMPTIONS**

Release 1 schedule assumes:

-   One experienced Full-Stack Laravel developer.
-   Full-time focus during delivery window.
-   BRD frozen before coding.
-   UI direction available.
-   Hostinger account available.
-   Domain/SSL accessible.
-   SMTP available.
-   Client feedback provided quickly.
-   No major new scope during development.
-   No WhatsApp API dependency in Release 1.
-   No direct video processing in Release 1.

If these assumptions change, delivery duration must be reassessed.

# **90\. CLIENT SIGN-OFF**

By approving this document, the Client confirms that:

-   Release 1 scope is understood.
-   Out-of-scope items are understood.
-   Property approval workflow is accepted.
-   Privacy model is accepted.
-   User roles are accepted.
-   Permission model is accepted.
-   Release roadmap is accepted.
-   WhatsApp API is not required for Release 1.
-   Payment/commission processing is outside the platform.
-   Published revisions require approval.
-   Change Requests may affect cost and schedule.

**Client Name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Title:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# **91\. BUSINESS ANALYST SIGN-OFF**

**Prepared By:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Role:** Business Analyst / Product Owner

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# **92\. TECHNICAL ACKNOWLEDGEMENT**

The assigned developer must confirm:

I have reviewed this BRD and understand that no undocumented assumption should replace the stated business rules, acceptance criteria, security controls or permission requirements. Any ambiguity affecting implementation will be raised before development.

**Developer Name:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Signature:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Date:** \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

# **END OF BUSINESS REQUIREMENTS & FUNCTIONAL BASELINE**

**Document:** RAW-BRD-001  
**Version:** 1.0