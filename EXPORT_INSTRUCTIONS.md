# Edge Functions Deployment Guide

This project includes 10 Supabase Edge Functions. This guide explains what each does and how to deploy them.

## Overview of Edge Functions

| Function Name | Purpose | Requires Secrets |
|--------------|---------|------------------|
| `clarity-audit-pdf` | Generates PDF reports for clarity audit surveys | Yes (PDFCO_API_KEY) |
| `generate-and-send-report-instant` | Creates and immediately emails PDF reports | Yes (PDFCO_API_KEY, RESEND_API_KEY) |
| `generate-clarity-report` | Core logic for generating clarity report data | No |
| `generate-pdf-report` | Generic PDF generation utility | Yes (PDFCO_API_KEY) |
| `process-expired-sessions` | Scheduled job to clean up old survey sessions | No |
| `receive-hubspot-form` | Webhook receiver for HubSpot form submissions | No |
| `send-clarity-email` | Sends clarity audit results via email | Yes (RESEND_API_KEY) |
| `send-notification` | General notification system | Yes (RESEND_API_KEY) |
| `send-results` | Sends survey results to users | Yes (RESEND_API_KEY) |
| `test-pdf-report` | Testing endpoint for PDF generation | Yes (PDFCO_API_KEY) |

## Prerequisites

1. Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Project linked to Supabase:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. Required API keys (see ENVIRONMENT_VARIABLES.md)

## Deploying All Functions

### Step 1: Set Required Secrets

```bash
# PDF generation service
supabase secrets set PDFCO_API_KEY=your_pdfco_api_key

# Email service
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

### Step 2: Deploy Functions

You can deploy all functions at once or individually.

**Deploy All:**
```bash
cd /path/to/your/project

# Deploy all functions in the functions directory
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

**Or use a script:**
```bash
#!/bin/bash
functions=(
  "clarity-audit-pdf"
  "generate-and-send-report-instant"
  "generate-clarity-report"
  "generate-pdf-report"
  "process-expired-sessions"
  "receive-hubspot-form"
  "send-clarity-email"
  "send-notification"
  "send-results"
  "test-pdf-report"
)

for func in "${functions[@]}"; do
  echo "Deploying $func..."
  supabase functions deploy "$func"
done
```

## Function Details

### 1. clarity-audit-pdf
**Purpose:** Main PDF generation for clarity audits
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/clarity-audit-pdf`
**Method:** POST
**Requires:** PDFCO_API_KEY

**Usage:**
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/clarity-audit-pdf`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: 'uuid' })
  }
);
```

### 2. generate-and-send-report-instant
**Purpose:** End-to-end report generation and email delivery
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/generate-and-send-report-instant`
**Method:** POST
**Requires:** PDFCO_API_KEY, RESEND_API_KEY

**Usage:**
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/generate-and-send-report-instant`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: 'uuid',
      email: 'user@example.com'
    })
  }
);
```

### 3. generate-clarity-report
**Purpose:** Calculates scores and generates report data
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/generate-clarity-report`
**Method:** POST

**Usage:**
```typescript
const response = await fetch(
  `${supabaseUrl}/functions/v1/generate-clarity-report`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: 'uuid' })
  }
);
```

### 4. generate-pdf-report
**Purpose:** Generic PDF generation utility
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/generate-pdf-report`
**Method:** POST
**Requires:** PDFCO_API_KEY

### 5. process-expired-sessions
**Purpose:** Cleanup job for old sessions (can be scheduled)
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/process-expired-sessions`
**Method:** POST

**Set up cron schedule:**
```sql
-- Run this in your Supabase SQL editor to set up automatic cleanup
select cron.schedule(
  'cleanup-expired-sessions',
  '0 2 * * *', -- Every day at 2 AM
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/process-expired-sessions',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

### 6. receive-hubspot-form
**Purpose:** Webhook endpoint for HubSpot form submissions
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/receive-hubspot-form`
**Method:** POST

**Configure in HubSpot:**
1. Go to your HubSpot form settings
2. Add webhook URL: `https://YOUR_PROJECT.supabase.co/functions/v1/receive-hubspot-form`
3. Select form fields to send

### 7. send-clarity-email
**Purpose:** Email delivery for clarity audit results
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/send-clarity-email`
**Method:** POST
**Requires:** RESEND_API_KEY

### 8. send-notification
**Purpose:** General notification system for various alerts
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/send-notification`
**Method:** POST
**Requires:** RESEND_API_KEY

### 9. send-results
**Purpose:** Sends survey results to participants
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/send-results`
**Method:** POST
**Requires:** RESEND_API_KEY

### 10. test-pdf-report
**Purpose:** Testing endpoint for PDF generation
**Endpoint:** `https://YOUR_PROJECT.supabase.co/functions/v1/test-pdf-report`
**Method:** GET or POST
**Requires:** PDFCO_API_KEY

## Testing Edge Functions

### Test from Command Line

```bash
# Test a function locally
supabase functions serve clarity-audit-pdf

# In another terminal, make a request
curl -X POST http://localhost:54321/functions/v1/clarity-audit-pdf \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test-uuid"}'
```

### Test from Supabase Dashboard

1. Go to Edge Functions in your Supabase dashboard
2. Click on a function
3. Use the "Invoke" tab to test
4. Add request body and headers
5. Click "Run"

### Test from Frontend

```typescript
// Example test in your React app
const testFunction = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-pdf-report`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test: true })
      }
    );
    const data = await response.json();
    console.log('Function response:', data);
  } catch (error) {
    console.error('Function error:', error);
  }
};
```

## Monitoring and Logs

### View Function Logs

**In Supabase Dashboard:**
1. Go to Edge Functions
2. Click on a function
3. Go to "Logs" tab
4. View real-time logs

**Via CLI:**
```bash
# Stream logs for a specific function
supabase functions logs clarity-audit-pdf --follow

# View recent logs
supabase functions logs clarity-audit-pdf --limit 100
```

### Monitor Function Performance

Check in Supabase Dashboard:
- Invocation count
- Error rate
- Average execution time
- Most recent errors

## Common Issues and Solutions

### "Function not found"
- Verify function is deployed: `supabase functions list`
- Check function name spelling
- Ensure project is linked correctly

### "Secrets not available"
- List secrets: `supabase secrets list`
- Set missing secrets
- Redeploy function after setting secrets

### "CORS error"
All functions include CORS headers. If you still see errors:
```typescript
// Check that CORS headers are present in function response
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

### "Timeout error"
- Default timeout is 150 seconds
- Check function logs for performance issues
- Consider breaking up long-running tasks

### "Out of memory"
- Edge functions have 512MB RAM limit
- Optimize data processing
- Consider streaming for large responses

## Updating Functions

When you make changes to a function:

```bash
# 1. Save your changes to the function file

# 2. Redeploy the specific function
supabase functions deploy function-name

# 3. Test the updated function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/function-name \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## Security Best Practices

1. **Never expose service role key in frontend**
   - Only use in edge functions
   - Never log or return it

2. **Validate all inputs**
   - Check request body structure
   - Validate UUIDs and email formats
   - Sanitize user input

3. **Use RLS policies**
   - Edge functions can bypass RLS with service role
   - But still validate ownership/permissions

4. **Rate limiting**
   - Consider implementing rate limiting
   - Use Supabase's built-in protections

5. **Error handling**
   - Never expose internal errors to users
   - Log detailed errors server-side
   - Return generic messages to client

## Cost Optimization

- Edge functions are billed per invocation
- Free tier: 500K function invocations/month
- Optimize function code for speed
- Cache results where possible
- Clean up old data regularly

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [PDF.co API Docs](https://apidocs.pdf.co/)
- [Resend API Docs](https://resend.com/docs)
