---
type: "query"
date: "2026-07-27T06:58:33.095936+00:00"
question: "Kenapa AppError muncul di hampir semua module?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["AppError", "createCrudRouter", "errorMiddleware", "mapPrismaError"]
---

# Q: Kenapa AppError muncul di hampir semua module?

## Answer

AppError (src/utils/app-error.ts) adalah backbone error handling dengan 139 node terhubung di 15+ community. Pattern: (1) createCrudRouter() auto-inject AppError via handleError() ke semua CRUD route, (2) errorMiddleware() menangkap semua AppError secara global, (3) mapPrismaError() mapping Prisma error ke AppError, (4) manual import di auth, quizzes, certificates. Ini adalah single point of failure untuk refactor error handling.

## Outcome

- Signal: useful

## Source Nodes

- AppError
- createCrudRouter
- errorMiddleware
- mapPrismaError