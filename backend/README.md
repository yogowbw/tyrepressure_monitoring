# Tyre Monitoring Backend

Backend API ini membaca data KPI Tyre Pressure Monitoring dari SQL Server Managed Instance.

## 1) Setup

1. Copy `.env.example` menjadi `.env`.
2. Install dependency:
   ```bash
   npm install
   ```
3. Jalankan API:
   ```bash
   npm run server
   ```

## 2) Endpoint

- `GET /health`
- `GET /api/jobsites`
- `GET /api/dashboard/full?jobsite=ADMO%20Mining&equipmentClass=DT%20180%20Ton`
- `GET /api/dashboard/pressure-quality?jobsite=ADMO%20Mining&equipmentClass=DT%20180%20Ton`
- `GET /api/dashboard/check-achievement?jobsite=ADMO%20Mining&equipmentClass=DT%20180%20Ton`
- `GET /api/dashboard/units?jobsite=ADMO%20Mining&equipmentClass=DT%20180%20Ton&view=follow-up`
- `GET /api/dashboard/overdue?jobsite=ADMO%20Mining&equipmentClass=DT%20180%20Ton`

`equipmentClass` opsional. Jika tidak diisi, hasil di-level jobsite.

## 3) SQL Views

Jalankan script berikut di database `dwstage`:

- `backend/sql/01_create_monitoring_views.sql`

Script tersebut membuat:

- `Monitoring.vw_tyre_latest`
- `Monitoring.vw_unit_status`
- `Monitoring.vw_kpi_pressure_quality`
- `Monitoring.vw_kpi_tyre_check`

Jika nama tabel sumber Anda berbeda, sesuaikan bagian CTE `source_pressure` dan `source_check`.

