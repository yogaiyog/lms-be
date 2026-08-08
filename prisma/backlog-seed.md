seed-trial-topics.ts:20 hapus studentTopicProgress.deleteMany() TANPA filter — menghapus progress SEMUA kurikulum (beda dari py/ce yang scoped per kurikulum).
PYTHON_EDITOR_URL default http://localhost:3000 (seed-topics-py.ts:4), sedangkan FE .env pakai NEXT_PUBLIC_PYTHON_EDITOR_URL=http://localhost:3001 → kalau env backend tak di-set, URL task Python salah port.
CE memakai tipe SCRATCH untuk link eksternal (code.org) — hanya berfungsi karena autoComplete.
autoComplete hanya di CE; Scratch/Python/trial tidak set (default false).
Scratch tidak idempotent standalone (tidak hapus kurikulum sendiri); py/ce/trial idempotent.