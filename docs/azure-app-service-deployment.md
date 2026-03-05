# Azure App Service Deployment Guide (Frontend + Backend)

Dokumen ini untuk arsitektur saat ini:
- Frontend: React + Vite (`npm run build`)
- Backend: Node.js Express (`npm run server`)
- Database: Azure SQL Managed Instance public endpoint `...,3342`

## 1. Target arsitektur (recommended)

- 1 App Service Plan Linux (minimal `P1v3` jika ingin deployment slot).
- 2 Web App:
  - `tyre-monitoring-fe` untuk frontend.
  - `tyre-monitoring-api` untuk backend.
- 1 Staging slot per app (opsional tapi direkomendasikan).
- Deploy otomatis via GitHub Actions (OIDC, tanpa publish profile).

## 2. Buat resource Azure

Contoh CLI:

```bash
az group create -n rg-tyre-monitoring -l southeastasia

az appservice plan create \
  -g rg-tyre-monitoring \
  -n asp-tyre-monitoring \
  --is-linux \
  --sku P1v3

az webapp create \
  -g rg-tyre-monitoring \
  -p asp-tyre-monitoring \
  -n tyre-monitoring-api \
  --runtime "NODE|22-lts"

az webapp create \
  -g rg-tyre-monitoring \
  -p asp-tyre-monitoring \
  -n tyre-monitoring-fe \
  --runtime "NODE|22-lts"
```

## 3. App settings backend

Set di `tyre-monitoring-api`:

- `API_PORT=8080`
- `SQL_SERVER=sqlmisis-prod.public.6273d55d722a.database.windows.net,3342`
- `SQL_DATABASE=dwstage`
- `SQL_USER=dwread`
- `SQL_PASSWORD=<secret>`
- `WEBSITE_NODE_DEFAULT_VERSION=~22`

Startup command backend:
- `npm run server`

## 4. App settings frontend

Set di `tyre-monitoring-fe`:

- `VITE_API_BASE_URL=https://tyre-monitoring-api.azurewebsites.net`
- `WEBSITE_NODE_DEFAULT_VERSION=~22`

Startup command frontend (SPA static):
- `pm2 serve /home/site/wwwroot --no-daemon --spa`

## 5. SQL MI connectivity checklist

- Pastikan public endpoint SQL MI aktif.
- Pastikan port `3342` terbuka sesuai aturan MI.
- Whitelist outbound IP App Service ke network rule SQL MI bila dibutuhkan.
- Verifikasi dari backend endpoint `/health` dan endpoint dashboard.

## 6. Setup GitHub Actions OIDC (sekali saja)

1. Buat Entra App Registration untuk GitHub OIDC.
2. Tambahkan Federated Credential untuk repository dan branch `main`.
3. Beri role minimal `Contributor` ke web apps/resource group.
4. Simpan secrets di GitHub repo:
   - `AZURE_CLIENT_ID`
   - `AZURE_TENANT_ID`
   - `AZURE_SUBSCRIPTION_ID`
   - `AZURE_WEBAPP_NAME_FRONTEND`
   - `AZURE_WEBAPP_NAME_BACKEND`

Workflow siap pakai:
- `.github/workflows/deploy-frontend.yml`
- `.github/workflows/deploy-backend.yml`

Setelah ini, setiap `git push` ke `main` akan auto deploy.

## 7. Rekomendasi produksi tambahan

- Aktifkan deployment slot `staging` dan lakukan swap.
- Simpan `SQL_PASSWORD` di Azure Key Vault + Key Vault reference pada App Settings.
- Aktifkan App Service logs + Application Insights.
- Tambahkan custom domain + HTTPS only.

## Referensi resmi

- App Service Node.js: https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs
- Deploy to App Service with GitHub Actions: https://learn.microsoft.com/en-us/azure/app-service/deploy-github-actions
- Azure Login action (OIDC): https://github.com/Azure/login
- Azure WebApps deploy action: https://github.com/Azure/webapps-deploy
- Deployment slots App Service: https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots
- SQL Managed Instance public endpoint: https://learn.microsoft.com/en-us/azure/azure-sql/managed-instance/public-endpoint-configure
- SQL MI connectivity architecture: https://learn.microsoft.com/en-us/azure/azure-sql/managed-instance/connectivity-architecture-overview

