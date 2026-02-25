# Bolt Webhook Setup Guide for Survey Processing

## Overview
This guide explains how to set up a webhook in Bolt to automatically process expired surveys and send reports.

## Step 1: Create a Webhook Trigger
1. In Bolt, create a new workflow
2. Select "Webhook" as the trigger type
3. Name it "Process Expired Surveys Webhook"
4. Save the webhook URL for later use

## Step 2: Add the Same Processing Steps
Add the same processing steps as in the scheduled workflow:

1. **Get Expired Surveys** (Supabase SQL Query)
2. **For Each Survey Loop**
3. **Get Complete Survey Analysis**
4. **Process Data for Template**
5. **Build Report HTML**
6. **Check if Survey Has Responses**
7. **Generate PDF** (if responses exist)
8. **Send Email** (appropriate version based on responses)
9. **Mark Survey as Processed**
10. **Log Processing Result**

## Step 3: Set Up External Trigger
You can trigger this webhook in several ways:

### Option 1: Manual Trigger
Use the webhook URL to manually trigger the process:
```bash
curl -X POST https://your-webhook-url
```

### Option 2: GitHub Actions
Create a GitHub workflow file:
```yaml
name: Process Expired Surveys
on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8:00 AM UTC
jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call Processing Webhook
        run: |
          curl -X POST https://your-webhook-url
```

### Option 3: Supabase Edge Function
Create a simple edge function that calls the webhook:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const response = await fetch('https://your-webhook-url', {
    method: 'POST'
  });
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } }
  );
})
```

## Step 4: Testing
1. Create a test survey with an expiration date in the past
2. Manually trigger the webhook
3. Verify that the survey is processed correctly
4. Check that emails are sent and the database is updated

## Monitoring
- Set up monitoring for the webhook to ensure it's triggered successfully
- Check Bolt logs for any errors
- Verify that surveys are being processed daily

## Troubleshooting
- If the webhook fails, check the Bolt logs for error messages
- Verify that the webhook URL is correct
- Ensure that the Supabase connection is working
- Check that the PDF.co API key is valid