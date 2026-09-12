# Deploying CampusMind to Cloudflare Pages

This guide outlines how to deploy the CampusMind frontend single-page application (SPA) to **Cloudflare Pages**.

---

## Architecture & Features Setup
The repository is pre-configured with:
- **`public/_redirects`**: Rewrites all client-side paths (`/*`) to `/index.html` with HTTP 200 so React Router deep routes (e.g. `/dashboard`, `/explore`, `/join`) load seamlessly without 404s.
- **`public/_headers`**: Immutably caches hashed production assets (`/assets/*`) for 1 year while serving `index.html` with cache revalidation, plus modern security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`).
- **`wrangler.toml`**: Configures the project name (`campus-mind`) and output directory (`dist`) for Cloudflare Wrangler CLI.

---

## Method 1: Cloudflare Dashboard Git Integration (Recommended)

This is the easiest and most powerful method: every `git push` to `main` deploys automatically, and pull requests get instant preview deployments.

### Step 1: Log In to Cloudflare
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and sign in.
2. In the left sidebar, navigate to **Workers & Pages** → **Overview** → Click **Create Application**.
3. Select the **Pages** tab and click **Connect to Git**.

### Step 2: Connect Repository
1. Authorize your GitHub account and select the repository: `subrataroy912/Campus-Mind`.
2. Click **Begin setup**.

### Step 3: Configure Build Settings
Fill in the deployment settings:
- **Project name**: `campus-mind` (or your preferred subdomain)
- **Production branch**: `main`
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty or as `/`)

### Step 4: Add Environment Variables
Under **Environment variables (advanced)**, add:
| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NODE_VERSION` | `20` | Ensures Node 20+ runtime |
| `VITE_API_BASE_URL` | `https://m198-backend.onrender.com` | Your backend API base URL |
| `VITE_MAINTENANCE_MODE` | `false` | Disable maintenance banner |
| `VITE_CSRF_COOKIE_NAME` | `csrf_token` | CSRF cookie identifier |

### Step 5: Save and Deploy
Click **Save and Deploy**. Cloudflare will clone your repository, run `npm run build`, and deploy your SPA to a custom `*.pages.dev` domain in under 1 minute!

---

## Method 2: Deploy via Wrangler CLI

You can also deploy directly from your local terminal using Wrangler:

1. **Log In to Cloudflare via CLI**:
   ```bash
   npx wrangler login
   ```
2. **Build and Deploy**:
   ```bash
   npm run deploy:ci
   ```
   *Or if already built:*
   ```bash
   npm run deploy
   ```
3. The CLI will provide the live URL (e.g. `https://campus-mind.pages.dev`).

---

## Method 3: Automated CI/CD via GitHub Actions

A workflow is included at [`.github/workflows/deploy-cloudflare.yml`](./.github/workflows/deploy-cloudflare.yml).

To enable automated deployments through GitHub Actions:
1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**.
2. Add the following repository secrets:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with **Cloudflare Pages:Edit** permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (found on the Workers & Pages dashboard URL or overview).
   - `VITE_API_BASE_URL` (optional): `https://m198-backend.onrender.com`.
3. Every push to `main` will automatically build, test, and deploy to Cloudflare Pages.

---

## Custom Domain Setup (Optional)
Once deployed on Cloudflare Pages:
1. In your project dashboard on Cloudflare Pages, click **Custom domains**.
2. Click **Set up a custom domain** and enter your domain (e.g. `campusmind.com` or `app.campusmind.com`).
3. If your DNS is managed on Cloudflare, DNS records and free auto-renewing SSL certificates will be configured automatically with zero downtime.
