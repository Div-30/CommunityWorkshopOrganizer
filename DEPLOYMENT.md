# 🚀 Deployment Guide — Community Workshop Organizer

> **Branch:** `dev`  
> **Backend:** .NET 10 API → exposed via **ngrok**  
> **Frontend:** React + Vite → deployed on **Vercel**

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **.NET SDK** | 10.0+ | [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download) |
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Git** | any | [git-scm.com](https://git-scm.com/) |
| **ngrok** | v3 | [ngrok.com/download](https://ngrok.com/download) |
| **Vercel CLI** *(optional)* | latest | `npm i -g vercel` |

---

## Part 1 — Backend (ngrok)

### 1.1 Clone & switch to `dev` branch

```bash
git clone https://github.com/Div-30/CommunityWorkshopOrganizer.git
cd CommunityWorkshopOrganizer
git checkout dev
```

### 1.2 Run the backend

```bash
cd backend/CommunityWorkshopOrganizer
dotnet run
```

You should see:

```
Now listening on: http://localhost:5272
Application started.
```

> **Note:** The database is SQLite — it auto-creates a `CommunityWorkshopDatabase.db` file on first start. No database server needed.

### 1.3 Install & authenticate ngrok

1. **Download ngrok** from [ngrok.com/download](https://ngrok.com/download) and unzip it.

2. **Sign up** for a free account at [dashboard.ngrok.com](https://dashboard.ngrok.com/signup).

3. **Copy your auth token** from [dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken).

4. **Connect your account:**

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### 1.4 Expose the backend with ngrok

Open a **new terminal** (keep the backend running in the first one):

```bash
ngrok http 5272
```

ngrok will display a public URL like:

```
Forwarding  https://abcd-1234.ngrok-free.app -> http://localhost:5272
```

📋 **Copy that `https://...ngrok-free.app` URL** — you'll need it for the frontend.

### 1.5 Allow CORS from your Vercel domain

Before the frontend can talk to the backend, you need to whitelist your Vercel URL.

**Stop the backend** (`Ctrl+C`), then restart it with the `ALLOWED_ORIGINS` env var:

**Windows (PowerShell):**
```powershell
$env:ALLOWED_ORIGINS = "https://your-app-name.vercel.app"
dotnet run
```

**macOS / Linux:**
```bash
ALLOWED_ORIGINS="https://your-app-name.vercel.app" dotnet run
```

> **Tip:** You can add multiple origins separated by commas:  
> `ALLOWED_ORIGINS="https://my-app.vercel.app,https://my-app-git-dev.vercel.app"`

You can set this **after** you know your Vercel URL from Part 2.

---

## Part 2 — Frontend (Vercel)

### Option A — Deploy via Vercel Dashboard (Recommended)

#### 2.1 Import the repo

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Connect your GitHub account and select **`Div-30/CommunityWorkshopOrganizer`**

#### 2.2 Configure the project

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Vite` (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Branch** | `dev` |

#### 2.3 Set the environment variable

In **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://abcd-1234.ngrok-free.app/api` |

> ⚠️ **Important:** Include `/api` at the end of the ngrok URL!

#### 2.4 Deploy

Click **"Deploy"**. Vercel will build and deploy the frontend. You'll get a URL like:

```
https://community-workshop-organizer.vercel.app
```

#### 2.5 Update backend CORS

Now go back to the backend terminal and restart with your Vercel URL:

**Windows (PowerShell):**
```powershell
$env:ALLOWED_ORIGINS = "https://community-workshop-organizer.vercel.app"
dotnet run
```

**macOS / Linux:**
```bash
ALLOWED_ORIGINS="https://community-workshop-organizer.vercel.app" dotnet run
```

---

### Option B — Deploy via Vercel CLI

```bash
cd frontend
npm install
npx vercel --yes \
  --build-env VITE_API_URL=https://abcd-1234.ngrok-free.app/api \
  --env VITE_API_URL=https://abcd-1234.ngrok-free.app/api
```

Follow the prompts. When asked, set the root directory to `./` (since you're already in `frontend/`).

To deploy to production:
```bash
npx vercel --prod \
  --build-env VITE_API_URL=https://abcd-1234.ngrok-free.app/api \
  --env VITE_API_URL=https://abcd-1234.ngrok-free.app/api
```

---

## ✅ Verify Everything Works

1. Open your Vercel URL in the browser
2. Register a new account (or use an existing one)
3. Log in — you should see the dashboard with no 401 errors
4. Check the backend terminal — you should see SQL queries being logged

---

## 🔄 Updating After Code Changes

### Push new code:
```bash
git add .
git commit -m "your changes"
git push origin dev
```

- **Frontend:** Vercel auto-redeploys when you push to `dev`
- **Backend:** Stop and re-run `dotnet run` on your machine. The ngrok URL stays the same as long as you don't restart ngrok.

---

## ⚠️ Important Notes

### ngrok free tier limitations
- **URL changes every time** you restart ngrok. When it changes, you must update `VITE_API_URL` in Vercel and redeploy.
- To get a **static URL**, upgrade to ngrok's paid plan or use `ngrok http 5272 --url=your-custom-name.ngrok-free.app` (available on free tier — one static domain).

### Claim a free static ngrok domain
ngrok now gives **one free static domain** per account:
1. Go to [dashboard.ngrok.com/domains](https://dashboard.ngrok.com/domains)
2. Click **"New Domain"** — you'll get something like `your-name.ngrok-free.app`
3. Use it when starting ngrok:
```bash
ngrok http 5272 --url=your-name.ngrok-free.app
```
This way your backend URL never changes, and you won't need to update Vercel.

### ngrok browser warning
When accessing the ngrok URL directly, you may see a "Visit Site" interstitial page. This is normal for free-tier ngrok. API calls from your frontend will still work fine.

### Database
The SQLite database file (`CommunityWorkshopDatabase.db`) is local to whoever runs the backend. It is auto-created on first run via EF Core migrations.

---

## 📁 Project Structure

```
CommunityWorkshopOrganizer/
├── backend/
│   └── CommunityWorkshopOrganizer/
│       ├── Controllers/          # API endpoints
│       ├── Data/                 # EF Core DbContext
│       ├── Models/               # Entity models
│       ├── Services/             # Business logic
│       ├── Program.cs            # App entry point
│       └── appsettings.json      # DB + JWT config
└── frontend/
    ├── src/
    │   ├── components/           # Reusable UI components
    │   ├── context/              # Auth + Toast providers
    │   ├── pages/                # Route pages
    │   └── services/api.js       # API client (reads VITE_API_URL)
    ├── package.json
    └── vite.config.js
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `401 Unauthorized` on all requests | Clear localStorage in browser DevTools → Application → Local Storage → delete `token`, then log in again |
| CORS errors in console | Make sure you restarted the backend with `ALLOWED_ORIGINS` set to your exact Vercel URL (no trailing slash) |
| ngrok URL changed | Update `VITE_API_URL` in Vercel dashboard → Settings → Environment Variables → Redeploy |
| `dotnet run` fails with port in use | Run `Get-Process -Name dotnet \| Stop-Process -Force` (Windows) or `kill $(lsof -t -i:5272)` (Mac/Linux), then retry |
| Frontend shows blank page | Check browser console for errors. Make sure `VITE_API_URL` includes `/api` at the end |
| Database not found | Delete `CommunityWorkshopDatabase.db` and restart the backend — it will recreate it |
