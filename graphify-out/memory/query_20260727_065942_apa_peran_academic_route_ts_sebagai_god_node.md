---
type: "query"
date: "2026-07-27T06:59:42.543708+00:00"
question: "Apa peran academic.route.ts sebagai god node?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["academic.route.ts"]
---

# Q: Apa peran academic.route.ts sebagai god node?

## Answer

academic.route.ts (src/modules/academic/academic.route.ts) — 40 edges. Central orchestrator yang import 18 module routes (enrollments, classes, schedules, quiz, roadmap, certificates, announcements, assessments, attendances, topics, dll) dan di-import oleh routes/index.ts. Ini hub dari hampir semua bisnis logic backend.

## Outcome

- Signal: useful

## Source Nodes

- academic.route.ts