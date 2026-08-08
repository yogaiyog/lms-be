# Graph Report - src  (2026-08-08)

## Corpus Check
- 101 files · ~25,634 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 404 nodes · 825 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f42b6ac2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- academic.route.ts
- auth.route.ts
- routes/index.ts
- crud-router.ts
- CertificateService
- auth.service.ts
- auth.middleware.ts
- payments.route.ts
- invoice-pdf.service.ts
- invoices.route.ts
- openapi.ts
- badges.route.ts
- upload.route.ts
- env.ts
- certificates.route.ts
- QRService
- upload.schema.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `createCrudRouter()` - 23 edges
2. `AppError` - 23 edges
3. `mapPrismaError()` - 16 edges
4. `CertificateService` - 12 edges
5. `Role` - 12 edges
6. `CertificateData` - 11 edges
7. `TemplateService` - 10 edges
8. `authenticate()` - 8 edges
9. `PdfConversionService` - 8 edges
10. `requireRole()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `createApp()` --indirect_call--> `errorMiddleware()`  [INFERRED]
  src/app.ts → src/middlewares/error.middleware.ts
- `createApp()` --indirect_call--> `notFoundMiddleware()`  [INFERRED]
  src/app.ts → src/middlewares/not-found.middleware.ts
- `handleError()` --calls--> `mapPrismaError()`  [EXTRACTED]
  src/lib/crud-router.ts → src/lib/prisma-error.ts
- `errorMiddleware()` --calls--> `mapPrismaError()`  [EXTRACTED]
  src/middlewares/error.middleware.ts → src/lib/prisma-error.ts
- `handleError()` --calls--> `mapPrismaError()`  [EXTRACTED]
  src/modules/classes/classes.route.ts → src/lib/prisma-error.ts

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "academic.route.ts"
Cohesion: 0.06
Nodes (40): mapPrismaError(), globalForPrisma, categoriesRouter, classesRouter, commonInclude, handleError(), commonInclude, curriculumsRouter (+32 more)

### Community 1 - "auth.route.ts"
Cohesion: 0.08
Nodes (31): attendancesRouter, attendanceCreateSchema, attendanceUpdateSchema, forgotPasswordSchema, loginSchema, logoutSchema, parentRegisterSchema, refreshSchema (+23 more)

### Community 2 - "routes/index.ts"
Cohesion: 0.07
Nodes (26): academicRouter, authRouter, baseRouter, include, router, galleryCreateSchema, galleryUpdateSchema, crudRouter (+18 more)

### Community 3 - "crud-router.ts"
Cohesion: 0.09
Nodes (23): createCrudRouter(), CreateCrudRouterOptions, handleError(), parsePagination(), PrismaDelegate, announcementsRouter, announcementCreateSchema, announcementUpdateSchema (+15 more)

### Community 4 - "CertificateService"
Cohesion: 0.13
Nodes (11): CertificateService, PdfConversionService, PlaceholderService, escapeXml(), OUTPUT_DIR, TEMPLATES_DIR, TemplateService, CertificateData (+3 more)

### Community 5 - "auth.service.ts"
Cohesion: 0.09
Nodes (20): router, authService, buildAuthResponse(), createAuthForExistingUser(), createRefreshToken(), LoginInput, PublicUser, RefreshInput (+12 more)

### Community 6 - "auth.middleware.ts"
Cohesion: 0.11
Nodes (19): AspectAnalysis, reportPdfService, reportsRouter, ScheduleReportPayload, StudentReport, savedReportsRouter, forbidden(), unauthorized() (+11 more)

### Community 7 - "payments.route.ts"
Cohesion: 0.12
Nodes (22): baseRouter, include, midtransChargeSchema, paymentCreateSchema, paymentUpdateSchema, cancelTransaction(), CreateChargeParams, createChargeTransaction() (+14 more)

### Community 8 - "invoice-pdf.service.ts"
Cohesion: 0.20
Nodes (17): badgeWidth(), bankName(), COLORS, drawBadge(), drawRect(), drawText(), ewalletName(), formatDate() (+9 more)

### Community 9 - "invoices.route.ts"
Cohesion: 0.16
Nodes (14): baseRouter, include, INVOICE_SORT_KEYS, INVOICE_STATUSES, router, invoiceCreateSchema, invoiceUpdateSchema, calculateInvoice() (+6 more)

### Community 10 - "openapi.ts"
Cohesion: 0.18
Nodes (9): authPaths, authRequestSchemas, baseSchemas, bearerAuth, idParam, stringDate, stringUuid, swaggerDoc (+1 more)

### Community 11 - "badges.route.ts"
Cohesion: 0.26
Nodes (7): badgesRouter, badgeCreateSchema, badgeUpdateSchema, gamificationRouter, studentBadgesRouter, studentBadgeCreateSchema, studentBadgeUpdateSchema

### Community 12 - "upload.route.ts"
Cohesion: 0.29
Nodes (8): ENTITY_TYPES, storage, upload, uploadRouter, deleteFile(), ensureBucket(), getClient(), uploadFile()

### Community 13 - "env.ts"
Cohesion: 0.27
Nodes (7): createApp(), envSchema, parsedEnv, errorMiddleware(), notFoundMiddleware(), apiRouter, app

### Community 14 - "certificates.route.ts"
Cohesion: 0.29
Nodes (8): baseRouter, certificateService, include, router, certificateBatchGenerateSchema, certificateCreateSchema, certificateGenerateSchema, certificateUpdateSchema

## Knowledge Gaps
- **83 isolated node(s):** `envSchema`, `parsedEnv`, `idParam`, `bearerAuth`, `stringUuid` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `academic.route.ts` to `auth.route.ts`, `routes/index.ts`, `crud-router.ts`, `auth.service.ts`, `auth.middleware.ts`, `payments.route.ts`, `invoices.route.ts`, `upload.route.ts`, `certificates.route.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `createCrudRouter()` connect `crud-router.ts` to `academic.route.ts`, `auth.route.ts`, `routes/index.ts`, `payments.route.ts`, `invoices.route.ts`, `badges.route.ts`, `certificates.route.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `CertificateService` connect `CertificateService` to `certificates.route.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `envSchema`, `parsedEnv`, `idParam` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `academic.route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06349206349206349 - nodes in this community are weakly interconnected._
- **Should `auth.route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07641196013289037 - nodes in this community are weakly interconnected._
- **Should `routes/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07435897435897436 - nodes in this community are weakly interconnected._