# Deploying Foosball Tracker to Vercel

This guide will help you deploy your foosball tracker application to Vercel with Supabase integration.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [Supabase project](https://supabase.com) with your database set up
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Environment Variables

Your application needs Supabase credentials to work. You'll need to add these as environment variables in Vercel.

### Required Environment Variables

From your Supabase project dashboard (Settings → API):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

> [!IMPORTANT]
> Make sure your Supabase database has the `wins` table created with the correct schema:
> - `id` (uuid, primary key)
> - `player` (text)
> - `delta` (integer)
> - `created_at` (timestamp)

## Step 2: Deploy to Vercel (Web Dashboard Method)

### Option A: Using the Vercel Dashboard

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import your project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git provider and repository
   - Click "Import"

3. **Configure your project**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable:
     - Name: `NEXT_PUBLIC_SUPABASE_URL`
     - Value: `https://your-project.supabase.co`
     - Environment: Select all (Production, Preview, Development)
   - Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project.vercel.app`

## Step 3: Deploy to Vercel (CLI Method)

### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   cd c:\Repos\foosball
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **foosball** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Add environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   - For each, select all environments (production, preview, development)
   - Paste the value when prompted

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Step 4: Verify Your Deployment

1. Visit your deployed URL
2. Test the score counters for both players
3. Check that scores persist after page refresh
4. Verify the dashboard shows correct totals

## Continuous Deployment

Once set up, Vercel will automatically:
- Deploy to **production** when you push to your main branch
- Create **preview deployments** for pull requests
- Run builds and show deployment status

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Make sure you added both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard
- Redeploy after adding variables

**Error: Type errors during build**
- Run `npm run build` locally first to catch TypeScript errors
- Fix any type errors before deploying

### Runtime Errors

**Scores don't save**
- Check Vercel logs: Dashboard → Your Project → Deployments → Click deployment → Runtime Logs
- Verify Supabase credentials are correct
- Check Supabase database has the `wins` table with correct schema
- Verify Supabase RLS (Row Level Security) policies allow inserts

**CORS errors**
- Supabase should allow requests from your Vercel domain by default
- If issues persist, check Supabase dashboard → Authentication → URL Configuration

### Checking Logs

View real-time logs in Vercel:
```bash
vercel logs
```

Or in the dashboard:
- Go to your project
- Click "Deployments"
- Click on a deployment
- View "Runtime Logs" or "Build Logs"

## Updating Your Deployment

To deploy updates:

**Using Git (recommended):**
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Vercel will automatically deploy the changes.

**Using CLI:**
```bash
vercel --prod
```

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 48 hours)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

> [!TIP]
> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never use this prefix for sensitive keys like service role keys!

## Next Steps

- Set up a custom domain
- Configure preview deployments for testing
- Set up monitoring and analytics
- Add more features to your app

## Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
