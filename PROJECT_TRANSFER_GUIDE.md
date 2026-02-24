# Project Transfer Guide

This guide will help you transfer this complete Chloe James Coaching application to another account.

## Project Overview

This is a full-featured coaching business application with:
- Leadership Bootcamp enrollment system
- Clarity Audit surveys with PDF report generation
- Pulse Check surveys
- One-on-one coaching information pages
- Leadership Accelerator program details
- Supabase backend with database, edge functions, and authentication

## Step 1: Set Up New Supabase Project

### 1.1 Create New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and set project name
4. Save your database password (you'll need it)
5. Wait for project to finish provisioning

### 1.2 Get Your New Project Credentials
Once the project is ready:
1. Go to Project Settings > API
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service Role Key** (keep this secret!)

## Step 2: Run Database Migrations

### 2.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 2.2 Initialize Supabase in Your Project
```bash
cd /path/to/your/project
supabase init
```

### 2.3 Link to Your New Project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```
(Find your project ref in the Project URL: `https://[PROJECT_REF].supabase.co`)

### 2.4 Apply All Migrations
```bash
supabase db push
```

This will create all tables, RLS policies, and database functions from the `supabase/migrations/` folder.

## Step 3: Deploy Edge Functions

You have 10 edge functions that need to be deployed:

```bash
# Deploy each function
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

### 3.1 Set Edge Function Secrets

Some functions need environment variables. Set them using:

```bash
# For PDF.co API (used in PDF generation functions)
supabase secrets set PDFCO_API_KEY=your_pdfco_api_key

# For email functionality (if using external email service)
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

## Step 4: Update Frontend Environment Variables

Update your `.env` file with the new Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_new_anon_key
```

## Step 5: Deploy Frontend to Netlify

### 5.1 Prepare for Deployment
1. Ensure your project is in a Git repository
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 5.2 Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy site"

### 5.3 Configure Redirects
The project includes a `_redirects` file in the `public/` folder for client-side routing. This will be automatically included in the build.

## Step 6: Configure External Services

### 6.1 PDF.co Setup (for PDF generation)
1. Sign up at [PDF.co](https://pdf.co)
2. Get your API key
3. Add it to Supabase secrets (see Step 3.1)

### 6.2 HubSpot Integration (optional)
If using HubSpot forms:
1. Follow instructions in `HUBSPOT_INTEGRATION_GUIDE.md`
2. Configure webhook URL in HubSpot to point to your edge function
3. URL format: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/receive-hubspot-form`

### 6.3 Email Service (Resend)
For sending PDF reports via email:
1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Get your API key
4. Add it to Supabase secrets

## Step 7: Test Everything

### 7.1 Test Database
- Try accessing different pages
- Submit test forms
- Check that data is being saved in Supabase

### 7.2 Test Edge Functions
- Submit a Clarity Audit survey
- Verify PDF generation works
- Check email delivery

### 7.3 Test Frontend
- Navigate through all pages
- Test responsive design
- Verify all images load correctly

## Step 8: Update DNS (if using custom domain)

### 8.1 In Netlify
1. Go to Site settings > Domain management
2. Add your custom domain
3. Follow Netlify's DNS configuration instructions

### 8.2 Update DNS Records
Point your domain to Netlify:
- Add a CNAME record pointing to your Netlify site URL
- Or use Netlify DNS for full management

## Database Schema Overview

Your new Supabase project will have these tables:
- `survey_sessions` - Survey submission tracking
- `survey_responses` - Individual survey answers
- `generated_reports` - PDF report metadata
- `bootcamp_registrations` - Leadership bootcamp enrollments
- `pulse_check_sessions` - Pulse check surveys
- `pulse_check_responses` - Pulse check answers

All tables have RLS enabled for security.

## Edge Functions Overview

1. **clarity-audit-pdf** - Generates PDF reports for clarity audits
2. **generate-and-send-report-instant** - Creates and emails reports immediately
3. **generate-clarity-report** - Core report generation logic
4. **generate-pdf-report** - Generic PDF generation
5. **process-expired-sessions** - Cleanup job for old sessions
6. **receive-hubspot-form** - Webhook receiver for HubSpot
7. **send-clarity-email** - Email delivery for clarity reports
8. **send-notification** - General notification system
9. **send-results** - Survey results delivery
10. **test-pdf-report** - Testing endpoint for PDF generation

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify Node version is compatible (v18+ recommended)
- Check for TypeScript errors: `npm run build`

### Database Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure RLS policies allow your operations

### Edge Functions Not Working
- Check function logs in Supabase dashboard
- Verify secrets are set correctly
- Test functions individually using the Supabase dashboard

### Images Not Loading
- Verify all images are in the `public/` folder
- Check image paths in components
- Ensure images were included in the build

## Files to Transfer

Make sure to transfer these key directories/files:
```
/src                    # All React components
/public                 # Static assets (images, _redirects)
/supabase/migrations    # Database schema
/supabase/functions     # Edge functions
/logic                  # Documentation and guides
package.json            # Dependencies
vite.config.ts          # Build configuration
tsconfig.json           # TypeScript configuration
tailwind.config.js      # Styling configuration
.env                    # Environment variables (update with new values)
```

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## Next Steps After Transfer

1. Update social media links and contact information
2. Set up analytics (Google Analytics, etc.)
3. Configure error monitoring (Sentry, etc.)
4. Set up automated backups for database
5. Review and update content as needed
6. Test all user flows thoroughly
7. Set up monitoring for edge functions
8. Configure proper logging

---

**Important Security Notes:**
- Never commit `.env` files to Git
- Keep service role keys secure
- Regularly rotate API keys
- Review RLS policies periodically
- Monitor function usage and costs
