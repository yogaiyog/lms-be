---
type: "query"
date: "2026-07-27T06:59:42.679542+00:00"
question: "Apa peran prisma.ts sebagai god node?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["prisma.ts"]
---

# Q: Apa peran prisma.ts sebagai god node?

## Answer

prisma.ts (src/lib/prisma.ts) — 31 edges. Paling banyak di-import oleh module lain (31 incoming edges). Hampir semua route file butuh prisma: auth, certificates, enrollments, classes, announcements, badges, topics, dll. Single source of truth database connection.

## Outcome

- Signal: useful

## Source Nodes

- prisma.ts