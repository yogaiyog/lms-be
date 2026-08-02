# Backlog

## Backend

### [Invoice] Izin hapus invoice CANCELLED yang pernah ada payment SETTLEMENT
- **Status:** Backlog
- **Lokasi:** `src/modules/invoices/invoices.route.ts:239-248`
- **Masalah:** Guard hapus invoice memakai `hasSettlement` (cek payment ber-status SETTLEMENT/REFUND). Akibatnya invoice ber-status `CANCELLED` yang pernah dibayar lalu dibatalkan manual tetap **tidak bisa dihapus**, padahal secara bisnis sudah "tidak aktif".
- **Perilaku saat ini:** Boleh dihapus hanya jika status `DRAFT | UNPAID | CANCELLED` **dan** tidak ada payment `SETTLEMENT`/`REFUND`.
- **Perilaku yang diinginkan (opsional):** Izinkan hapus invoice `CANCELLED` meski pernah ada payment `SETTLEMENT` (payment ikut terhapus). Pertimbangkan apakah `PARTIAL`/`REFUNDED` tetap diblokir.
- **Catatan terkait:** Payment terhapus otomatis saat invoice di-delete (`deleteMany` + `onDelete: Cascade`), tidak perlu perubahan relasi.
