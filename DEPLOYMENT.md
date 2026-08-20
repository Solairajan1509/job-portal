# 🚀 100% Free Hosting Guide: Deploying to Render ($0/month)

You can host your entire **Full-Stack Job Portal completely FREE ($0/Month)** using:
- 🟢 **Backend API**: Render Free Web Service (`plan: free`)
- 🌐 **Frontend Client**: Render Free Static Site (Unlimited bandwidth & free SSL)
- 🍃 **Database**: MongoDB Atlas M0 Free Shared Cluster (512 MB storage forever)

---

## ⚡ 100% Free Deployment Steps via Render Blueprint

Render uses the updated [render.yaml](file:///c:/Users/solai/OneDrive/Desktop/job-portal-main/render.yaml) file which is pre-configured with `plan: free`.

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Set Render deployment to Free Tier"
git push origin main
```

### Step 2: Create Blueprint Instance on Render
1. Go to **[Render Dashboard](https://dashboard.render.com/)** (Sign in or create a free account, no credit card required).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository (`job-portal` or `Solairajan1509/job-portal`).
4. Render will automatically detect `render.yaml` and select the **Free Plan** for both services:
   - 🛠️ `job-portal-backend-api` (Web Service - **Free**)
   - 🌐 `job-portal-frontend-client` (Static Site - **Free**)
5. Set your **Free Environment Variables**:
   - `DB_STRING`: Your free **MongoDB Atlas URI** (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/job-portal`)
   - `COOKIE_SECRET`: Any random string (e.g., `my_secret_cookie_key`)
   - `JWT_SECRET`: Any random string (e.g., `my_secret_jwt_key`)
   - `VITE_API_URL`: `https://job-portal-backend-api.onrender.com/api/v1` (replace with your backend URL)
6. Click **Apply**. Both services will build and deploy for **$0/month**!

---

## 💡 Important Notes About Render Free Tier
- **Zero Cost**: No credit card is required to sign up or deploy.
- **Backend Spin-down**: Free Web Services automatically spin down after 15 minutes of inactivity. When a new request arrives, it wakes up within ~30–50 seconds.
- **Frontend Static Site**: Stays active 24/7 with fast response times and free SSL encryption (`https://`).


