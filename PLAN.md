# EKsathe Bangladesh MVP Implementation Plan

## Goal

Build one responsive Next.js application with a public 13-sector directory, a shared account, and separate customer, provider, and admin workspaces. Agriculture and construction are live for the MVP; the other 11 sectors remain visible as coming soon.

## Entry points

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Platform homepage, launch sectors, and directory entry | Public |
| `/dashboard` | The 13-sector service directory | Public |
| `/dashboard/agriculture-labor` | Produce, farm-worker, and machinery services | Public browsing |
| `/dashboard/construction` | Provider/material discovery and construction projects | Public browsing |
| `/account` | Orders, bookings, projects, payments, and profile | Signed-in customer |
| `/provider` | Listings, applications, quotes, jobs, and commission | Applicant or approved provider |
| `/admin` | Provider approvals and scoped operations/finance | Authorized staff |

Ordering, quote requests, bookings, and projects require a verified email account and return the customer to the requested action after sign-in. Listing and provider pages have shareable sector URLs. Planned sectors show a consistent coming-soon page; unknown sector slugs return 404. Provider and admin links appear only when the signed-in user has access. The old `/dashboard/admin` route redirects to `/admin`.

## Shared product foundation

- Keep Next.js 16, React, PostgreSQL, Prisma 7, Better Auth, Tailwind, and shadcn. Keep one root layout and separate public, account, provider, and admin layouts.
- Define all 13 sectors in one typed registry with stable slugs, display order, Bengali and English names, icons, and rollout status. Agriculture service definitions remain distinct from top-level sectors.
- Support one customer account with multiple provider capabilities. Require admin approval for each sector capability before publishing or accepting work.
- Reuse a request, quote, order, booking, payment record, commission record, and review flow across both live sectors: request, quote, acceptance, fulfilment, completion, payment confirmation, and review.
- Snapshot accepted quantity, price, scope, schedule, and commission. Keep fulfilment and payments as separate states. Prevent duplicate quote acceptance, overselling, and conflicting worker or machine bookings.
- Customers pay providers directly. Record both parties' payment confirmation; finance staff track platform commission due and receipts. Commission defaults to 10% per sector and is recorded with the accepted order.
- Check authentication, authorization, and record ownership in server-rendered data access and every mutation. Keep privileged fields server-controlled. Add an audited first-super-admin bootstrap command; expose no public admin-creation flow.
- Use signed S3-compatible uploads and validate uploads before attaching them to products, projects, or payment records. Private documents remain access-controlled.
- Use additive Prisma migrations, idempotent seeds, and fresh Next.js data. Do not import PHP users or transactions.

## Agriculture

- Farmer profiles and storefronts with bilingual details, district, photo, product category, price/unit, quantity, and harvest availability.
- Public produce search and filters. Support buy-now requests for one listing at a time; farmers accept the terms or issue a revised quote. The parties arrange collection or transport.
- Farm-worker profiles, skills, daily rates, availability, location, and booking requests.
- Machinery hire listings with daily rates, availability, location, and operator/transport terms.
- Provide provider inventory, incoming requests, quote handling, fulfilment updates, customer order history, reviews, and payment records. Other agriculture service definitions remain unavailable for transactions during the MVP.

## Construction

- Searchable approved directories of contractors, engineers, architects, tradespeople, and material suppliers.
- Private customer projects with location, type, scope, approximate area, budget, dates, photos, and documents.
- Provider invitations and quote requests for one work package or material requirement; compare scope, price, schedule, transport charges, and provider profile.
- Accept one quote per request and link each booking or material order to its project.
- Project overview with accepted quotes, milestones, work schedule, material orders, documents, recorded expenses, and payment history. Providers post progress; customers approve milestones, changes, and handover.
- Defer automated BOQ/structural estimates, procurement automation, attendance/payroll, warranties, and full ERP features.

## Admin and launch operations

- Admin queues for provider approvals, listing moderation, requests, disputes, payment mismatches, and outstanding commission.
- Sector managers see only assigned-sector operations. Finance manages payment and commission records. Super admins manage staff access and platform settings.
- Use in-app workflow notifications, email verification, and password recovery. Add structured server logs, readiness checks, rate limiting, and database backups.
- Run a controlled provider pilot after migrations, seeds, email, and object storage work in staging.

## Implementation order and acceptance

1. **Plan, routes, identity, and access:** add this plan; establish the sector registry and page shells; finish email/password registration, verification, reset, and profile; secure admin routes/actions; add provider applications and sector-scoped grants. Acceptance: customers can access their own workspace and an admin can approve provider capabilities; unprivileged users cannot access admin data or actions.
2. **Shared data and transaction lifecycle:** add provider, product, request, quote, order, booking, payment, commission, review, notification, attachment, audit, and project models with safe migrations and seeds; implement validated server-side domain services and ownership checks. Acceptance: one seeded transaction completes with payment confirmation, review, and commission receipt while preserving an audit trail.
3. **Agriculture workflows:** deliver produce listings/orders, farm-worker bookings, and machinery hire. Acceptance: each workflow appears correctly in customer, provider, and admin views.
4. **Construction workflows:** deliver projects, provider/material directories, quote comparison, linked orders/bookings, milestones, documents, and payment history. Acceptance: a customer can create a project, engage a provider, approve a milestone, record payments, and confirm handover.
5. **Operations and release readiness:** complete scoped admin queues, notifications, readiness and backup operations, and provider pilot. Acceptance: the full customer, provider, operations, and finance paths work in Bangla and English on mobile and desktop.

## Verification

- Run lint, TypeScript, Prisma migration/seed, and production build checks.
- Add Bun domain tests and PostgreSQL integration tests for permissions, quote acceptance, stock and booking conflicts, payments, refunds, commission, and reviews.
- Add Playwright journeys for public sector discovery, registration/verification, the three agriculture flows, construction project/quotes, role boundaries, mobile layout, and Bangla/English switching.

## Defaults and boundaries

- Responsive web first; native Android and iOS follow after workflows stabilize.
- Bangla-first interface with English switching; preserve the green brand, Bengali font, and theme support.
- One provider profile per account with multiple approved sector capabilities; provider staff teams and multiple storefronts come later.
- Currency is BDT with decimal arithmetic and explicit units. The 10% commission excludes separately listed transport charges.
- Customers and providers arrange delivery and site visits themselves. No marketplace shopping cart, payment gateway, social feed, live chat, or provider fleet dispatch in the MVP.
- The other 11 sectors remain visible as coming soon; their service definitions are not transactable.

## Agriculture prototype restoration

Restore the agriculture prototype as a dedicated experience while keeping the current Next.js accounts, provider approvals, marketplace orders, bookings, payments, and commission records. The internal sector slug remains `agriculture-labor`.

### Agriculture routes

| Route | Purpose |
| --- | --- |
| `/agriculture` | Canonical agriculture homepage, without a dashboard back link |
| `/dashboard/agriculture` | Same homepage with a back link to `/dashboard` |
| Both prefixes + `/services/[slug]` | Shareable service details and request form |
| Both prefixes + `/market` | Searchable produce and service marketplace |
| Both prefixes + `/listings/[id]` | Listing details |
| Both prefixes + `/providers/[id]` | Farmer/provider storefront |
| Both prefixes + `/market-prices` | Staff-published, sourced market prices |
| Both prefixes + `/updates` | Staff-published news, advice, and weather alerts |

Use one shared agriculture module with an explicit route base. Keep that base in detail links, filters, breadcrumbs, and login return URLs. The header and homepage CTA use `/agriculture`; the agriculture sector card opens `/dashboard/agriculture`. Permanently redirect `/dashboard/agriculture-labor` and its listing/provider descendants to matching `/dashboard/agriculture` routes, preserving query parameters. Direct agriculture URLs are canonical for public pages.

The agriculture homepage restores the prototype's introduction, marketplace CTA, searchable service directory and category filters, how-it-works section, commission estimate, and published updates. Keep the project logo, Bangla/English translations, Lucide controls, and emoji fallbacks for missing photos. Support information must come from platform settings; do not use the prototype's unverified emergency number.

### Service request catalogue

Create one typed, versioned registry sourced from `includes/panel-data.php`. It defines all 30 stable slugs, bilingual descriptions and labels, category, fields, options, validation, and form version:

- Crop production: crop farming, seeds and seedlings, fertilizer and soil testing, pest and disease management, irrigation, and organic farming.
- Farm enterprises: livestock, poultry, fisheries, land and equipment, training and advice, and contract farming.
- Markets and supply: farm inputs, produce market, wholesale buyers, daily market prices, storage and warehouses, transport and logistics, food processing, and export support.
- Labor and machinery: farm labor, machinery hire and repair, and worker marketplace.
- Finance: farm finance and insurance claims.
- Information and community: weather alerts, disaster support, women farmers, youth agripreneurs, and community reports.

Keep common name, phone, district, and requirement details required. Prototype-specific fields and budget are optional unless a selected operation needs them. Validate counts as numbers, dates as dates, and money using decimal arithmetic. Do not treat prototype digit-length limits as maximum quantities. A crop-disease photo is optional, private, and limited to JPEG/PNG/WebP up to 5 MB. Service request submission requires a verified account and shows a reference plus customer tracking link. Existing direct purchase and booking flows stay in place for produce, workers, and machinery; those service pages also offer staff-assisted requests.

### Request operations and privacy

Extend `ServiceDefinition` and `ServiceRequest`; do not create a second request system. Store versioned structured answers with the submitted field labels and options, staff assignment, public updates, private notes, private attachments, and an optional link to a marketplace request. The marketplace link records matching only and must not create an order or payment.

Agriculture operations staff manually review and coordinate requests. Use the existing `NEW → REVIEWING → ASSIGNED → COMPLETED` progression. Customers can withdraw new or reviewing requests; staff handle cancellations after assignment. Add an agriculture intake queue filtered by service, district, date, status, and assignee. Notify customers about meaningful status changes, log mutations in the audit trail, and authorize every request and photo read by owner or agriculture staff. Enable all 30 service definitions with an additive migration; subsequent seeds must preserve staff availability settings.

### Farmer shops, marketplace, and information

- Add editable bilingual storefront name/bio, district, profile and cover photos, and a public preview.
- Add product editing and archiving for price, unit, category, availability, stock, description, and optional image. Moderate material content/photo edits and retain accepted order snapshots.
- Add prototype produce categories (vegetables, fruits, dairy, fish, spices, and other) while retaining grain listings. Support category, district, minimum/maximum price, sorting, result counts, and pagination with filters stored in the URL.
- Show product ratings, reviews, seller information, and more products by that seller. Continue to allow one review per completed order.
- Apply stock visibility only to goods; worker and machinery listings depend on schedule availability.
- Add sourced market prices with product, market, district, unit, price, observation date, and publication status. Staff review submissions before publishing and never publish customer contact details.
- Add bilingual news, advice, and weather alerts with source and publication date. Weather alerts require an expiry. Show only published, current content and honest empty states. Do not add automated external feeds in this release.

Finance, insurance, disaster, and advisory requests provide intake and coordination only; a request does not mean approval, coverage, or guaranteed assistance. Keep customer payments direct to providers and continue to record commission under the existing rules.

### Delivery increments

1. **Routes and registry:** add the shared agriculture routes, redirects, homepage, route-aware navigation, and 30-service registry. Acceptance: both entry routes share content, only the dashboard entry shows the back link, old URLs redirect, unknown service slugs return 404, and all services have stable bilingual metadata and fields.
2. **Requests and staff intake:** add specific forms, verified-account submission, private disease photos, customer tracking, agriculture staff queue, updates, and audit history. Acceptance: all 30 forms persist versioned answers and authorized users can track a request from submission through completion.
3. **Storefront and discovery:** add storefront/product management, moderation and archive behavior, URL-backed filters, ratings, and corrected stock/schedule visibility. Acceptance: edits do not change accepted order terms and all supported filters work on mobile and desktop.
4. **Publishing and integration:** add staff publishing for sourced prices/news/advice/weather, public updates, commission estimate, settings-backed support information, and translations. Acceptance: only current published records appear, sources/dates are visible, expired alerts/drafts remain private, and the full flow works in Bangla and English.

After each increment, update this plan and commit the completed change. Verify migrations/seeds, lint, typecheck, targeted integration/browser journeys, responsive layouts, and production build at completion.
