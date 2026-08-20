# 🌐 Hosting Guide: Render & Netlify Deployment

This step-by-step guide explains how to host your Full-Stack Job Portal on **Render** (Backend API) and **Netlify / Render** (Frontend Web App).

---

## Part 1: Deploy Backend API on Render (Node.js & Express)

1. **Push your project to GitHub** (if not already done).
2. Go to **[Render.com](https://render.com)** and sign in.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Configure Web Service settings:
   - **Name**: `job-portal-backend-api`
   - **Root Directory**: `full-stack-job-portal-server-main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add **Environment Variables** in Render Dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `COOKIE_NAME` = `job_portal_token`
   - `COOKIE_SECRET` = `your_cookie_secret_key`
   - `JWT_SECRET` = `your_jwt_secret_key`
   - `DB_STRING` = `mongodb+srv://<username>:<password>@cluster.mongodb.net/job-portal`
7. Click **Create Web Service**. Render will deploy your backend and provide a live URL (e.g., `https://job-portal-backend-api.onrender.com`).

---

## Part 2: Deploy Frontend on Netlify (React & Vite)

### Option A: Netlify Deployment (Recommended for Frontend)
1. Go to **[Netlify.com](https://netlify.com)** and sign in.
2. Click **Add new site** → **Import an existing project**.
3. Connect to GitHub and select your repository.
4. Set deployment configuration:
   - **Base directory**: `full-stack-job-portal-client-main`
   - **Build command**: `npm run build`
   - **Publish directory**: `full-stack-job-portal-client-main/dist`
5. Add **Environment Variable**:
   - `VITE_API_URL` = `https://job-portal-backend-api.onrender.com/api/v1` *(replace with your deployed Render backend URL)*
6. Click **Deploy Site**. Netlify will use the included [netlify.toml](file:///c:/Users/solai/OneDrive/Desktop/job-portal-main/full-stack-job-portal-client-main/netlify.toml) to handle React Router client-side routing.

---

### Option B: Render Static Site Deployment
1. In Render Dashboard, click **New +** → **Static Site**.
2. Select repository and set:
   - **Root Directory**: `full-stack-job-portal-client-main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Add **Rewrite Rule** in Render dashboard:
   - Source: `/*` -> Destination: `/index.html` (Status: 200)
4. Add `VITE_API_URL` environment variable pointing to backend API.

---

## 🎯 Verification Checklist After Hosting
- [ ] Backend API responds at `https://<your-backend-url>/` with "Job Hunter Server is running!".
- [ ] Frontend opens cleanly at your custom Netlify / Render domain.
- [ ] Test registration, login with candidate/recruiter/admin accounts.
