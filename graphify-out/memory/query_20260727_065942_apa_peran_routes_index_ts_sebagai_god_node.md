---
type: "query"
date: "2026-07-27T06:59:42.813602+00:00"
question: "Apa peran routes/index.ts sebagai god node?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["routes/index.ts"]
---

# Q: Apa peran routes/index.ts sebagai god node?

## Answer

routes/index.ts (src/routes/index.ts) — 26 edges. Entry point routing backend. Import semua router module (academic, auth, upload, galleries, parent-profiles, tutor-profiles, users, gamification, docs, request-class) lalu di-import oleh app.ts. Peta top-level routing aplikasi.

## Outcome

- Signal: useful

## Source Nodes

- routes/index.ts