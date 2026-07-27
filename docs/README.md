# LMS Documentation Index

Dokumen ini panduan ringkas untuk pengembangan LMS.

## Baca Urutan Ini

1. `docs/PRD.md` - tujuan produk, user role, scope, dan prioritas fitur.
2. `docs/FEATURE_ROADMAP.md` - ide fitur terbaik dan urutan pengerjaan.
3. `docs/ARCHITECTURE.md` - aturan architecture Laravel + React tanpa over-engineering.
4. `docs/DATABASE_PLAN.md` - schema existing, constraint wajib, dan table future.
5. `.codex/AI_RULES.md` - aturan AI saat coding di project ini.

## Keputusan Utama

- Fokus project: LMS monolith API + React SPA.
- Jangan microservice atau DDD berat.
- Rapikan foundation sebelum tambah fitur besar.
- Prioritas fitur: progress, continue learning, search/filter, certificate, analytics.
- Backend harus tambah validation, policy, API response standard.
- Frontend harus punya API client dan component split yang jelas.

## Next Sprint Rekomendasi

1. Buat API response helper di Laravel.
2. Buat FE API client di React.
3. Tambah unique constraints enrollment/activity/review.
4. Tambah progress percentage endpoint.
5. Tambah continue learning card di dashboard.
