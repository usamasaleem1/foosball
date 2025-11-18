# 🏆 Foosball Championship Counter

A real-time foosball win counter tracking lifetime victories between **Usama** and **Nicholas**. Built with Next.js 14, Supabase, and deployed on Vercel.

![Foosball Counter](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- **Real-time Updates**: Instant synchronization across all connected clients using Supabase real-time subscriptions
- **Lifetime Statistics**: Track total wins, win percentages, and trends over time
- **Beautiful UI**: Modern dark mode design with vibrant gradients, glassmorphism, and smooth animations
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Date-based Analytics**: View daily win breakdowns and recent game history
- **Mobile Responsive**: Works seamlessly on all device sizes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Supabase account (already configured)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd foosball
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://zlekkdfyjkkgvvhvxwmd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Set up the database**
   
   Run the SQL migration in your Supabase SQL Editor:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20241118_initial_schema.sql`
   - Click "Run"

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses a single `wins` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `player` | TEXT | Player name ('Usama' or 'Nicholas') |
| `delta` | INTEGER | +1 for win, -1 for undo |
| `created_at` | TIMESTAMPTZ | Timestamp for trend analysis |

## 🎨 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with modern design system
- **Deployment**: Vercel
- **Real-time**: Supabase Real-time subscriptions

## 🌐 Deployment to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add environment variables**
   
   In Vercel project settings, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   
   Click "Deploy" and your app will be live!

## 📱 Usage

- Click the **+** button to record a win for a player
- Click the **−** button to undo the last win (if needed)
- View real-time statistics in the dashboard below
- Open the app on multiple devices to see real-time synchronization

## 🛠️ Project Structure

```
foosball/
├── app/
│   ├── globals.css          # Design system & animations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── WinCounter.tsx        # Win counter with +/- buttons
│   └── StatsBoard.tsx        # Statistics dashboard
├── lib/
│   ├── actions/
│   │   └── win-actions.ts    # Server actions
│   └── supabase/
│       └── client.ts         # Supabase client
├── supabase/
│   └── migrations/
│       └── 20241118_initial_schema.sql
├── .env.local.example        # Environment template
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🎯 Future Enhancements

- [ ] Add charts/graphs for win trends
- [ ] Export statistics to CSV
- [ ] Add sound effects for wins
- [ ] Weekly/monthly leaderboards
- [ ] Push notifications for milestone wins

## 📄 License

MIT

---

Built with ❤️ for the ultimate foosball rivalry!

