# Graph Report - .  (2026-07-27)

## Corpus Check
- 112 files · ~80,961 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 476 nodes · 810 edges · 33 communities (30 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

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
- Announcements Module
- Assessment Aspects Module
- Assessment Sets Module
- Attendance Assessment Scores
- Attendance Assessments
- Topics Module
- Upload Schema
- TypeScript Verification

## God Nodes (most connected - your core abstractions)
1. `createCrudRouter()` - 21 edges
2. `AppError` - 19 edges
3. `compilerOptions` - 13 edges
4. `CertificateService` - 12 edges
5. `scripts` - 11 edges
6. `mapPrismaError()` - 11 edges
7. `CertificateData` - 11 edges
8. `Python Explorer Curriculum (12 Sessions)` - 11 edges
9. `TemplateService` - 10 edges
10. `Role` - 10 edges

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

## Communities (33 total, 3 thin omitted)

### Community 0 - "App Config & Reports"
Cohesion: 0.06
Nodes (45): envSchema, parsedEnv, AspectAnalysis, reportPdfService, reportsRouter, ScheduleReportPayload, StudentReport, forbidden() (+37 more)

### Community 1 - "NPM Dependencies"
Cohesion: 0.05
Nodes (39): bcryptjs, cors, dotenv, express, helmet, jsonwebtoken, minio, morgan (+31 more)

### Community 2 - "Route Setup & Module Router"
Cohesion: 0.08
Nodes (23): academicRouter, authRouter, baseRouter, include, router, galleryCreateSchema, galleryUpdateSchema, crudRouter (+15 more)

### Community 3 - "Certificate Service"
Cohesion: 0.13
Nodes (11): CertificateService, PdfConversionService, PlaceholderService, escapeXml(), OUTPUT_DIR, TEMPLATES_DIR, TemplateService, CertificateData (+3 more)

### Community 4 - "Prisma Seeds"
Cohesion: 0.11
Nodes (22): main(), prisma, codeExplorerUnits, CodeLevel, CodeUnit, getOrUploadImage(), resolveQuizImages(), seedCodeExplorer() (+14 more)

### Community 5 - "Dev Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, prisma, tsx, @types/bcryptjs, @types/cors, @types/express, @types/jsonwebtoken, @types/morgan (+19 more)

### Community 6 - "App Core & Error Handling"
Cohesion: 0.12
Nodes (17): createApp(), mapPrismaError(), errorMiddleware(), notFoundMiddleware(), classesRouter, commonInclude, handleError(), classCreateSchema (+9 more)

### Community 7 - "Path References"
Cohesion: 0.10
Nodes (20): dist, node, node_modules, prisma, src/**/*.ts, compilerOptions, baseUrl, esModuleInterop (+12 more)

### Community 8 - "Package Metadata"
Cohesion: 0.11
Nodes (17): name, prisma, seed, private, scripts, build, db:push, db:reset (+9 more)

### Community 9 - "CRUD Module Routes"
Cohesion: 0.21
Nodes (8): categoriesRouter, quizRouter, roadmapRouter, DAY_NAMES, isValidHour(), isWeekend(), tutorSlotsRouter, AppError

### Community 10 - "Scratch Curriculum"
Cohesion: 0.19
Nodes (13): Algorithms and Problem Solving, Clone/Object Instancing in Scratch, Conditionals in Scratch, Debugging in Scratch, Digital Citizenship Curriculum Concept, Event-Driven Programming in Scratch, Input/Output and Looks in Scratch, IPO (Input-Process-Output) and Sensing (+5 more)

### Community 11 - "Python Curriculum"
Cohesion: 0.27
Nodes (12): Python Capstone: Cashier Application, Python Conditionals (if-elif-else), Python Dictionaries, Python For Loops and range(), Python Functions (def, parameters, return), Python Fundamentals — print, comments, input, Python Lists, Python Operators and f-Strings (+4 more)

### Community 12 - "OpenAPI Docs"
Cohesion: 0.18
Nodes (9): authPaths, authRequestSchemas, baseSchemas, bearerAuth, idParam, stringDate, stringUuid, swaggerDoc (+1 more)

### Community 13 - "Badges Module"
Cohesion: 0.26
Nodes (7): badgesRouter, badgeCreateSchema, badgeUpdateSchema, gamificationRouter, studentBadgesRouter, studentBadgeCreateSchema, studentBadgeUpdateSchema

### Community 14 - "CRUD Router Factory"
Cohesion: 0.27
Nodes (8): createCrudRouter(), CreateCrudRouterOptions, handleError(), parsePagination(), PrismaDelegate, requestClassRouter, requestClassCreateSchema, requestClassUpdateSchema

### Community 15 - "Report PDF Service"
Cohesion: 0.25
Nodes (9): COLORS, drawRect(), drawText(), getGradeLabel(), ReportData, ReportNote, ReportPdfService, ReportScoreItem (+1 more)

### Community 16 - "Deployment & Env"
Cohesion: 0.20
Nodes (10): Prisma Migration Rules, Production Deployment Rules, PostgreSQL Production Database, SQLite Development Database, prisma db push — Forbidden in Production, prisma migrate dev — Wajib Migration Command, Prisma Migration Flow Document, CRUD API Endpoints (+2 more)

### Community 17 - "Certificates Route"
Cohesion: 0.29
Nodes (8): baseRouter, certificateService, include, router, certificateBatchGenerateSchema, certificateCreateSchema, certificateGenerateSchema, certificateUpdateSchema

### Community 18 - "Quiz Images & Uploads"
Cohesion: 0.25
Nodes (8): Topic 6: Code Explorer, Quiz Image Seed Data, Code Explorer Quiz Image 1, Code Explorer Quiz Image 2, Code Explorer Quiz Image 3, Code Explorer Quiz Image 4, Code Explorer Quiz Image 5, Code Explorer Quiz Image 6

### Community 19 - "Enrollments Module"
Cohesion: 0.38
Nodes (5): baseRouter, include, router, enrollmentCreateSchema, enrollmentUpdateSchema

### Community 20 - "Student Topic Progress"
Cohesion: 0.38
Nodes (5): include, studentTopicProgressRouter, metadataField, studentTopicProgressUpdateSchema, studentTopicProgressUpsertSchema

### Community 22 - "Attendances Module"
Cohesion: 0.47
Nodes (4): attendancesRouter, attendanceCreateSchema, attendanceUpdateSchema, AttendanceStatus

### Community 23 - "Schedules Module"
Cohesion: 0.47
Nodes (4): schedulesRouter, scheduleCreateSchema, scheduleUpdateSchema, DayOfWeek

### Community 24 - "Announcements Module"
Cohesion: 0.60
Nodes (3): announcementsRouter, announcementCreateSchema, announcementUpdateSchema

### Community 25 - "Assessment Aspects Module"
Cohesion: 0.60
Nodes (3): assessmentAspectsRouter, assessmentAspectCreateSchema, assessmentAspectUpdateSchema

### Community 26 - "Assessment Sets Module"
Cohesion: 0.60
Nodes (3): assessmentSetsRouter, assessmentSetCreateSchema, assessmentSetUpdateSchema

### Community 27 - "Attendance Assessment Scores"
Cohesion: 0.60
Nodes (3): attendanceAssessmentScoresRouter, attendanceAssessmentScoreCreateSchema, attendanceAssessmentScoreUpdateSchema

### Community 28 - "Attendance Assessments"
Cohesion: 0.60
Nodes (3): attendanceAssessmentsRouter, attendanceAssessmentCreateSchema, attendanceAssessmentUpdateSchema

### Community 29 - "Topics Module"
Cohesion: 0.60
Nodes (3): topicsRouter, topicCreateSchema, topicUpdateSchema

## Knowledge Gaps
- **145 isolated node(s):** `name`, `version`, `private`, `type`, `dev` (+140 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppError` connect `CRUD Module Routes` to `App Config & Reports`, `Route Setup & Module Router`, `Prisma Seeds`, `App Core & Error Handling`, `CRUD Router Factory`, `Certificates Route`, `Enrollments Module`, `Student Topic Progress`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `CertificateService` connect `Certificate Service` to `Certificates Route`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _145 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Config & Reports` be split into smaller, more focused modules?**
  _Cohesion score 0.061581920903954805 - nodes in this community are weakly interconnected._
- **Should `NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Route Setup & Module Router` be split into smaller, more focused modules?**
  _Cohesion score 0.08403361344537816 - nodes in this community are weakly interconnected._
- **Should `Certificate Service` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._