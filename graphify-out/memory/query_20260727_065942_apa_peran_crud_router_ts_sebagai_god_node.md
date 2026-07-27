---
type: "query"
date: "2026-07-27T06:59:42.747019+00:00"
question: "Apa peran crud-router.ts sebagai god node?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["crud-router.ts"]
---

# Q: Apa peran crud-router.ts sebagai god node?

## Answer

crud-router.ts (src/lib/crud-router.ts) — 27 edges. Factory pattern untuk CRUD routes. 18 module route import ini untuk createCrudRouter(), plus import AppError + mapPrismaError(). Semua standard CRUD (announcements, assessments, attendances, badges, topics, dll) lewat sini.

## Outcome

- Signal: useful

## Source Nodes

- crud-router.ts