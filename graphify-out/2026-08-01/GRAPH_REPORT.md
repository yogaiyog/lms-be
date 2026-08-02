# Graph Report - backend  (2026-07-31)

## Corpus Check
- 131 files · ~87,736 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 625 nodes · 1016 edges · 33 communities (31 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5bac85b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App Config & Reports
- NPM Dependencies
- Route Setup & Module Router
- Certificate Service
- Prisma Seeds
- Dev Dependencies
- App Core & Error Handling
- Path References
- Package Metadata
- CRUD Module Routes
- Scratch Curriculum
- Python Curriculum
- OpenAPI Docs
- Badges Module
- CRUD Router Factory
- Report PDF Service
- Deployment & Env
- Certificates Route
- Quiz Images & Uploads
- Enrollments Module
- Student Topic Progress
- Prisma Client & Saved Reports
- Attendances Module
- Schedules Module
- invoice-pdf.service.ts
- Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?
- Q: Bagaimana alur lengkap pembayaran Midtrans di backend?
- Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?
- Upload Schema
- TypeScript Verification
- attendances.route.ts
- Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?

## God Nodes (most connected - your core abstractions)
1. `createCrudRouter()` - 23 edges
2. `AppError` - 22 edges
3. `mapPrismaError()` - 15 edges
4. `compilerOptions` - 13 edges
5. `CertificateService` - 12 edges
6. `Role` - 12 edges
7. `scripts` - 11 edges
8. `CertificateData` - 11 edges
9. `Python Explorer Curriculum (12 Sessions)` - 11 edges
10. `TemplateService` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Prisma Migration Flow Document` --conceptually_related_to--> `Prisma Migration Rules`  [INFERRED]
  docs/prisma-migration-flow.md → AGENTS.md
- `LMS Backend (Express + Prisma + TypeScript)` --references--> `Prisma Migration Flow Document`  [INFERRED]
  README.md → docs/prisma-migration-flow.md
- `main()` --references--> `@prisma/client`  [EXTRACTED]
  scripts/update-image-urls.ts → package.json
- `getOrUploadImage()` --calls--> `uploadFile()`  [EXTRACTED]
  prisma/seed-topics-ce.ts → src/services/minio/minio.service.ts
- `uploadSampleProjects()` --calls--> `uploadFile()`  [EXTRACTED]
  prisma/seed-topics-ce.ts → src/services/minio/minio.service.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Prisma Migration Command Workflow** — backend_prisma_migrate_cmd, backend_prisma_db_push, backend_env_sqlite_dev, backend_env_postgresql_prod, agents_md_prisma_migration_rules [EXTRACTED 1.00]
- **Python Curriculum Progression (Sessions 1-12)** — backend_python_fundamentals, backend_python_variables_types, backend_python_operators_fstrings, backend_python_conditionals, backend_python_while_loops, backend_python_for_loops, backend_python_lists, backend_python_dictionaries, backend_python_functions, backend_python_string_manipulation, backend_python_capstone_cashier [INFERRED 0.95]
- **Code Explorer Quiz Image Series (Topic 6)** — uploadseed_quiz_image_topics_6_code_exploler_1, uploadseed_quiz_image_topics_6_code_exploler_2, uploadseed_quiz_image_topics_6_code_exploler_3, uploadseed_quiz_image_topics_6_code_exploler_4, uploadseed_quiz_image_topics_6_code_exploler_5, uploadseed_quiz_image_topics_6_code_exploler_6, topic_code_explorer [INFERRED 0.95]

## Communities (33 total, 2 thin omitted)

### Community 0 - "App Config & Reports"
Cohesion: 0.11
Nodes (19): AspectAnalysis, reportPdfService, reportsRouter, ScheduleReportPayload, StudentReport, savedReportsRouter, forbidden(), unauthorized() (+11 more)

### Community 1 - "NPM Dependencies"
Cohesion: 0.06
Nodes (35): bcryptjs, cors, dotenv, express, helmet, jsonwebtoken, minio, morgan (+27 more)

### Community 2 - "Route Setup & Module Router"
Cohesion: 0.07
Nodes (27): authPaths, authRequestSchemas, baseSchemas, bearerAuth, idParam, stringDate, stringUuid, swaggerDoc (+19 more)

### Community 3 - "Certificate Service"
Cohesion: 0.10
Nodes (19): baseRouter, certificateService, include, router, certificateBatchGenerateSchema, certificateCreateSchema, certificateGenerateSchema, certificateUpdateSchema (+11 more)

### Community 4 - "Prisma Seeds"
Cohesion: 0.11
Nodes (22): main(), prisma, codeExplorerUnits, CodeLevel, CodeUnit, getOrUploadImage(), resolveQuizImages(), seedCodeExplorer() (+14 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.04
Nodes (44): devDependencies, prisma, tsx, @types/bcryptjs, @types/cors, @types/express, @types/jsonwebtoken, @types/morgan (+36 more)

### Community 6 - "App Core & Error Handling"
Cohesion: 0.05
Nodes (44): mapPrismaError(), globalForPrisma, classesRouter, commonInclude, handleError(), classCreateSchema, classUpdateSchema, commonInclude (+36 more)

### Community 7 - "Path References"
Cohesion: 0.10
Nodes (20): dist, node, node_modules, prisma, src/**/*.ts, compilerOptions, baseUrl, esModuleInterop (+12 more)

### Community 8 - "Package Metadata"
Cohesion: 0.09
Nodes (25): createApp(), envSchema, parsedEnv, errorMiddleware(), notFoundMiddleware(), baseRouter, include, midtransChargeSchema (+17 more)

### Community 9 - "CRUD Module Routes"
Cohesion: 0.06
Nodes (37): createCrudRouter(), CreateCrudRouterOptions, handleError(), parsePagination(), PrismaDelegate, announcementsRouter, announcementCreateSchema, announcementUpdateSchema (+29 more)

### Community 10 - "Scratch Curriculum"
Cohesion: 0.19
Nodes (13): Algorithms and Problem Solving, Clone/Object Instancing in Scratch, Conditionals in Scratch, Debugging in Scratch, Digital Citizenship Curriculum Concept, Event-Driven Programming in Scratch, Input/Output and Looks in Scratch, IPO (Input-Process-Output) and Sensing (+5 more)

### Community 11 - "Python Curriculum"
Cohesion: 0.27
Nodes (12): Python Capstone: Cashier Application, Python Conditionals (if-elif-else), Python Dictionaries, Python For Loops and range(), Python Functions (def, parameters, return), Python Fundamentals — print, comments, input, Python Lists, Python Operators and f-Strings (+4 more)

### Community 12 - "OpenAPI Docs"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur wizard buat invoice baru dengan pilihan metode pembayaran (manual/VA/QRIS/e-wallet) di admin dashboard?, Source Nodes

### Community 13 - "Badges Module"
Cohesion: 0.07
Nodes (26): API Routes, Auto-Generate Nomor Invoice, Backend Routes, Current Problems, Enrollment, Entity Relationship Diagram, Flow 1: Admin Buat Enrollment, Flow 2: Admin Assign Siswa ke Kelas (+18 more)

### Community 14 - "CRUD Router Factory"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Kenapa AppError muncul di hampir semua module?, Source Nodes

### Community 15 - "Report PDF Service"
Cohesion: 0.26
Nodes (7): badgesRouter, badgeCreateSchema, badgeUpdateSchema, gamificationRouter, studentBadgesRouter, studentBadgeCreateSchema, studentBadgeUpdateSchema

### Community 16 - "Deployment & Env"
Cohesion: 0.20
Nodes (10): Prisma Migration Rules, Production Deployment Rules, PostgreSQL Production Database, SQLite Development Database, prisma db push — Forbidden in Production, prisma migrate dev — Wajib Migration Command, Prisma Migration Flow Document, CRUD API Endpoints (+2 more)

### Community 17 - "Certificates Route"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran academic.route.ts sebagai god node?, Source Nodes

### Community 18 - "Quiz Images & Uploads"
Cohesion: 0.25
Nodes (8): Topic 6: Code Explorer, Quiz Image Seed Data, Code Explorer Quiz Image 1, Code Explorer Quiz Image 2, Code Explorer Quiz Image 3, Code Explorer Quiz Image 4, Code Explorer Quiz Image 5, Code Explorer Quiz Image 6

### Community 19 - "Enrollments Module"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran auth.service.ts sebagai god node?, Source Nodes

### Community 20 - "Student Topic Progress"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran crud-router.ts sebagai god node?, Source Nodes

### Community 21 - "Prisma Client & Saved Reports"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran prisma.ts sebagai god node?, Source Nodes

### Community 22 - "Attendances Module"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran routes/index.ts sebagai god node?, Source Nodes

### Community 23 - "Schedules Module"
Cohesion: 0.50
Nodes (3): 2026-07-27: Prettier 62 playground files, 2026-07-27: Scratchblocks syntax untuk operator blocks, 2026-07-27: Starter variable pattern (counter)

### Community 24 - "invoice-pdf.service.ts"
Cohesion: 0.13
Nodes (17): qrcode, qrcode, QR_DIR, QRService, bankName(), COLORS, drawRect(), drawText() (+9 more)

### Community 25 - "Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana guard 1 payment PENDING aktif per invoice (cancel otomatis saat buat payment baru)?, Source Nodes

### Community 27 - "Q: Bagaimana alur lengkap pembayaran Midtrans di backend?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur lengkap pembayaran Midtrans di backend?, Source Nodes

### Community 28 - "Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Apa peran InvoiceSequence dan bagaimana invoice number dibuat atomic?, Source Nodes

### Community 34 - "attendances.route.ts"
Cohesion: 0.06
Nodes (42): forgotPasswordSchema, loginSchema, logoutSchema, parentRegisterSchema, refreshSchema, registerSchema, resetPasswordSchema, roleSchema (+34 more)

### Community 37 - "Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Bagaimana alur download PDF invoice dan kirim email di billing admin?, Source Nodes

## Knowledge Gaps
- **220 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+215 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Work-memory lessons

**Preferred sources** — corroborated by past sessions; start here.
- `invoices.service.ts` (2× useful, score=1.999995429)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `qrcode` connect `invoice-pdf.service.ts` to `NPM Dependencies`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies` to `invoice-pdf.service.ts`, `Dev Dependencies`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `InvoicePdfService` connect `invoice-pdf.service.ts` to `App Core & Error Handling`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _220 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Config & Reports` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Route Setup & Module Router` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._