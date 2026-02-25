# Environment Variables Reference

This document lists all environment variables needed to run this project.

## Frontend Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Where to Find These Values

1. **VITE_SUPABASE_URL**
   - Go to your Supabase project dashboard
   - Navigate to Project Settings > API
   - Copy the "Project URL"

2. **VITE_SUPABASE_ANON_KEY**
   - Same location as above
   - Copy the "anon public" key
   - This key is safe to use in frontend code (it's public)

## Supabase Edge Function Secrets

These are set using the Supabase CLI and are NOT in the `.env` file:

```bash
# PDF Generation Service
supabase secrets set PDFCO_API_KEY=your_pdfco_api_key

# Email Service (Resend)
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

### Where to Get These API Keys

1. **PDFCO_API_KEY**
   - Sign up at https://pdf.co
   - Go to Dashboard > API Keys
   - Copy your API key
   - Used by: PDF generation edge functions

2. **RESEND_API_KEY**
   - Sign up at https://resend.com
   - Verify your sending domain
   - Go to API Keys section
   - Create and copy a new API key
   - Used by: Email sending edge functions

## Netlify Environment Variables

When deploying to Netlify, add these in the Netlify dashboard:

1. Go to Site settings > Environment variables
2. Add the following:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Frontend API endpoint |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Public API key |

## Automatic Environment Variables

These variables are automatically available in Supabase Edge Functions and DO NOT need to be set:

- `SUPABASE_URL` - Automatically set in edge functions
- `SUPABASE_ANON_KEY` - Automatically set in edge functions
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically set in edge functions
- `SUPABASE_DB_URL` - Automatically set in edge functions

## Security Best Practices

### DO NOT Commit to Git
Never commit these files to version control:
- `.env`
- `.env.local`
- `.env.production`
- Any file containing API keys

The `.gitignore` file is already configured to ignore these.

### Key Types and Usage

1. **Anon Key (Public)**
   - Safe to use in frontend code
   - Can be exposed in browser
   - Has limited permissions (controlled by RLS)

2. **Service Role Key (Secret)**
   - NEVER use in frontend code
   - Only use in edge functions
   - Bypasses Row Level Security
   - Keep this absolutely secret

3. **Third-party API Keys (Secret)**
   - PDF.co API key
   - Resend API key
   - Only store in Supabase secrets
   - Never in frontend code

### Rotating Keys

If you need to rotate keys:

1. **Supabase Keys**
   - Cannot be rotated easily
   - Would require creating a new project
   - Protect these carefully

2. **Third-party API Keys**
   - Generate new key in service dashboard
   - Update Supabase secrets:
     ```bash
     supabase secrets set KEY_NAME=new_value
     ```
   - Redeploy affected edge functions

## Validation

### Check Frontend Variables
```bash
# In your project directory
cat .env
```

Should show:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Check Edge Function Secrets
```bash
supabase secrets list
```

Should show:
```
PDFCO_API_KEY
RESEND_API_KEY
```

### Test Connection
After setting variables, test the connection:

```bash
# Build the project
npm run build

# If successful, your environment variables are correct
```

## Troubleshooting

### "Supabase client error"
- Check that `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_ANON_KEY` matches your project
- Ensure variables start with `VITE_` prefix (Vite requirement)

### "Failed to generate PDF"
- Verify `PDFCO_API_KEY` is set in Supabase secrets
- Check API key is valid on PDF.co dashboard
- Review edge function logs in Supabase

### "Email not sending"
- Verify `RESEND_API_KEY` is set in Supabase secrets
- Check domain is verified in Resend
- Review edge function logs

### "Environment variables not loading"
- Restart dev server after changing `.env`
- For Netlify, redeploy after updating variables
- Ensure variable names are EXACTLY as shown (case-sensitive)

## Example .env File

```env
# Supabase Configuration
# Replace these with your actual values from Supabase dashboard

VITE_SUPABASE_URL=https://vidlhnvtsjjzrsshepcd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGxobnZ0c2pqenJzc2hlcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU0NTQsImV4cCI6MjA2NjU3MTQ1NH0.Uc6OovgASNXejAtdJKW_tX-Ju2Emon-4Z5anDsVGKs8

# Note: The above are example values from the original project
# You MUST replace them with YOUR new Supabase project credentials
```

## Quick Setup Checklist

- [ ] Create `.env` file in project root
- [ ] Add `VITE_SUPABASE_URL` with your project URL
- [ ] Add `VITE_SUPABASE_ANON_KEY` with your anon key
- [ ] Sign up for PDF.co and get API key
- [ ] Set PDF.co key in Supabase secrets
- [ ] Sign up for Resend and verify domain
- [ ] Set Resend key in Supabase secrets
- [ ] Add variables to Netlify (if deploying)
- [ ] Test build: `npm run build`
- [ ] Verify all features work
