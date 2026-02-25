# Transfer Quick Start Guide

This is a condensed checklist for transferring the Chloe James Coaching app to a new account. For detailed instructions, see the other guide documents.

## Prerequisites

- [ ] New Supabase account created
- [ ] Netlify account ready
- [ ] PDF.co account (for PDF generation)
- [ ] Resend account (for emails)
- [ ] Git/GitHub access

## 5-Minute Setup

### 1. Export Project Files
```bash
# Download or copy all project files
# Exclude: node_modules, dist, .git, .bolt
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Supabase Project
1. Go to supabase.com/dashboard
2. Create new project
3. Copy Project URL and Anon Key

### 4. Set Environment Variables
Create `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5. Deploy Database
```bash
npm install -g supabase
supabase link --project-ref YOUR_REF
supabase db push
```

### 6. Deploy Edge Functions
```bash
# Set secrets first
supabase secrets set PDFCO_API_KEY=your_key
supabase secrets set RESEND_API_KEY=your_key

# Deploy all functions
supabase functions deploy clarity-audit-pdf
supabase functions deploy generate-and-send-report-instant
supabase functions deploy generate-clarity-report
supabase functions deploy generate-pdf-report
supabase functions deploy process-expired-sessions
supabase functions deploy receive-hubspot-form
supabase functions deploy send-clarity-email
supabase functions deploy send-notification
supabase functions deploy send-results
supabase functions deploy test-pdf-report
```

### 7. Test Build
```bash
npm run build
npm run dev
```

### 8. Deploy to Netlify
```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Then deploy via Netlify dashboard:
# 1. Connect to GitHub
# 2. Select repository
# 3. Build: npm run build
# 4. Publish: dist
# 5. Add env vars
```

## Critical Environment Variables

### Frontend (.env file)
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### Supabase Secrets (via CLI)
```
PDFCO_API_KEY
RESEND_API_KEY
```

## Project Structure

```
src/                    # React components
public/                 # Images and static files
supabase/migrations/    # Database schema
supabase/functions/     # Edge functions (10 total)
```

## Database Tables

The migrations will create:
- `survey_sessions`
- `survey_responses`
- `generated_reports`
- `bootcamp_registrations`
- `pulse_check_sessions`
- `pulse_check_responses`

All with RLS enabled.

## Edge Functions List

1. clarity-audit-pdf
2. generate-and-send-report-instant
3. generate-clarity-report
4. generate-pdf-report
5. process-expired-sessions
6. receive-hubspot-form
7. send-clarity-email
8. send-notification
9. send-results
10. test-pdf-report

## External Services Setup

### PDF.co
1. Sign up at pdf.co
2. Get API key from dashboard
3. Add to Supabase: `supabase secrets set PDFCO_API_KEY=xxx`

### Resend
1. Sign up at resend.com
2. Verify your domain
3. Get API key
4. Add to Supabase: `supabase secrets set RESEND_API_KEY=xxx`

## Testing Checklist

After deployment:
- [ ] Homepage loads
- [ ] All navigation works
- [ ] Forms submit
- [ ] Clarity Audit generates PDF
- [ ] Emails send
- [ ] Images display
- [ ] Mobile responsive
- [ ] Build completes without errors

## Troubleshooting

**Build fails:** Run `npm install` again
**Can't connect to Supabase:** Check `.env` credentials
**Functions fail:** Verify secrets are set
**Images missing:** Check `public/` folder copied
**PDF not generating:** Verify PDFCO_API_KEY
**Emails not sending:** Verify RESEND_API_KEY and domain

## Quick Commands

```bash
# Fresh install
npm install

# Build
npm run build

# Dev server
npm run dev

# Check Supabase connection
supabase link --project-ref YOUR_REF

# List deployed functions
supabase functions list

# View function logs
supabase functions logs function-name

# List secrets
supabase secrets list
```

## Cost Estimates

**Supabase Free Tier:**
- 500MB database
- 2GB bandwidth
- 500K edge function invocations
- Perfect for starting

**Netlify Free Tier:**
- 100GB bandwidth
- 300 build minutes
- Sufficient for most sites

**PDF.co:**
- Free tier available
- Pay per API call

**Resend:**
- 100 emails/day free
- 3,000 emails/month free

## Documentation Files

- `PROJECT_TRANSFER_GUIDE.md` - Complete transfer guide
- `ENVIRONMENT_VARIABLES.md` - All environment variables explained
- `EDGE_FUNCTIONS_GUIDE.md` - Detailed function documentation
- `EXPORT_INSTRUCTIONS.md` - How to export the project
- `HUBSPOT_INTEGRATION_GUIDE.md` - HubSpot webhook setup

## Support Links

- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)

## Timeline

Estimated time with all accounts ready:
- Project setup: 10 minutes
- Supabase setup: 15 minutes
- Edge functions deploy: 10 minutes
- Netlify deployment: 10 minutes
- Testing: 15 minutes

**Total: ~1 hour**

---

**Remember:** Keep the original project until you verify everything works in the new environment!
