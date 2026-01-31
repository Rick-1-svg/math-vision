# 🚀 Hosting "Math Vision" on Vercel

Hosting your Vite + React project on Vercel is free, fast, and easy. Follow these steps to get your 3D Grapher online.

## Option 1: Automatic Deployment via GitHub (Recommended)

This is the best method because Vercel will automatically redeploy whenever you push changes to GitHub.

### 1. Push Code to GitHub
If you haven't already:
1. Create a new repository on [GitHub](https://github.com/new).
2. Push your local code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/math-vision.git
   git push -u origin main
   ```

### 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Select **"Continue with GitHub"**.
4. Find your `math-vision` repository and click **"Import"**.

### 3. Configure Project
Vercel usually detects Vite automatically, but double-check these settings:
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `dist` (default)

### 4. Deploy
Click **"Deploy"**. Vercel will build your project. In about 1-2 minutes, you'll get a live URL (e.g., `https://math-vision-app.vercel.app`).

---

## Option 2: Deployment via CLI (Command Line)

If you don't want to use GitHub, you can deploy directly from your terminal.

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   Run this command in your project folder (`d:\Math Vision`):
   ```bash
   vercel
   ```
   - Follow the prompts (Keep default settings: `Y` for all usually).
   - It will upload your code and build it on Vercel servers.

4. **Production Deploy**:
   The command above creates a "Preview" deployment. To push to production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Common Configurations (Optional)

### Handling Routing (Single Page App)
If you add multiple pages (React Router) in the future, create a `vercel.json` file in your root folder to redirect all requests to `index.html`:

**vercel.json**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
*(Note: Your current version is a single-page app without router, so this isn't strictly necessary yet, but good for future-proofing.)*

### Environment Variables
If you add API keys later (e.g., for cloud storage):
1. Go to **Settings** > **Environment Variables** in Vercel project dashboard.
2. Add variables like `VITE_API_KEY`. (Must start with `VITE_` to be visible to the browser).

---

## ✅ Verification
Once deployed:
1. Open the Vercel URL.
2. Test a **3D Graph** (e.g., `x^2 - y^2`) to ensure WebGL works.
3. Check **Mobile View** on your phone.
