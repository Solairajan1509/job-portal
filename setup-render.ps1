Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   JOB PORTAL - RENDER ENVIRONMENT VARIABLES SETUP GUIDE   " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Get your MongoDB Atlas connection string" -ForegroundColor Yellow
Write-Host "  1. Go to: https://cloud.mongodb.com" -ForegroundColor White
Write-Host "  2. Create a free M0 cluster (if you don't have one)" -ForegroundColor White
Write-Host "  3. Click [Connect] > [Drivers] > Copy the URI" -ForegroundColor White
Write-Host "  4. Replace <password> with your actual password" -ForegroundColor White
Write-Host ""

Write-Host "Opening MongoDB Atlas..." -ForegroundColor Green
Start-Process "https://cloud.mongodb.com"
Start-Sleep -Seconds 2

Write-Host "STEP 2: Copy these values into Render dashboard" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening Render backend service environment settings..." -ForegroundColor Green
Start-Process "https://dashboard.render.com"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   PASTE THESE INTO RENDER BACKEND (job-portal-backend-api) " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "KEY                 | VALUE" -ForegroundColor White
Write-Host "--------------------|-------------------------------------------" -ForegroundColor Gray
Write-Host "DB_STRING           | [PASTE YOUR MONGODB ATLAS URI HERE]" -ForegroundColor Red
Write-Host "JWT_SECRET          | job_portal_secret_key_jwt_2026_super_secure" -ForegroundColor Green
Write-Host "COOKIE_SECRET       | job_portal_cookie_secret_2026" -ForegroundColor Green
Write-Host "COOKIE_NAME         | job_portal_token" -ForegroundColor Green
Write-Host "NODE_ENV            | production" -ForegroundColor Green
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   PASTE THIS INTO RENDER FRONTEND (job-portal-frontend-client) " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "KEY                 | VALUE" -ForegroundColor White
Write-Host "--------------------|-------------------------------------------" -ForegroundColor Gray
Write-Host "VITE_API_URL        | https://job-portal-backend-api.onrender.com" -ForegroundColor Green
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   HOW TO ADD ENV VARS IN RENDER DASHBOARD                  " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. In Render Dashboard, click 'job-portal-backend-api'" -ForegroundColor White
Write-Host "2. Click the 'Environment' tab on the left" -ForegroundColor White
Write-Host "3. Click 'Add Environment Variable'" -ForegroundColor White
Write-Host "4. Add each row from the table above" -ForegroundColor White
Write-Host "5. Click 'Save Changes'" -ForegroundColor White
Write-Host "6. Click 'Manual Deploy' > 'Deploy latest commit'" -ForegroundColor White
Write-Host ""
Write-Host "7. Then click 'job-portal-frontend-client'" -ForegroundColor White
Write-Host "8. Click 'Environment' tab" -ForegroundColor White
Write-Host "9. Add: VITE_API_URL = https://job-portal-backend-api.onrender.com" -ForegroundColor White
Write-Host "10. Save and deploy" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
