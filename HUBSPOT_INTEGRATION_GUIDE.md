# HubSpot CRM Integration Guide

This guide explains how to set up and troubleshoot the HubSpot CRM integration for the Cultivated HQ Leadership Clarity Audit.

## Overview

The integration uses two approaches to sync contacts to HubSpot CRM:

1. **Webhook Method**: HubSpot form submissions trigger a webhook to your Supabase Edge Function
2. **API Method**: After audit completion, the send-results function creates/updates contacts via HubSpot API

## Architecture

```
HubSpot Form Submission
    ↓
receive-hubspot-form Edge Function
    ↓
1. Save to Supabase (clarity_audit_initial_sessions)
2. Create/Update Contact in HubSpot CRM
3. Add Note to Contact
4. Redirect user to audit
    ↓
User Completes Audit
    ↓
send-results Edge Function
    ↓
1. Save results to Supabase (clarity_audit_results)
2. Create/Update Contact in HubSpot CRM
3. Add Audit Results as Note
4. Send Email via SendGrid
```

## Setup Instructions

### Step 1: Configure HubSpot Form

1. **Go to HubSpot Forms**
   - Log in to your HubSpot account
   - Navigate to Marketing > Lead Capture > Forms

2. **Create or Edit Your Form**
   - Ensure your form includes these fields:
     - Email (required)
     - First Name
     - Last Name
     - Phone (optional)
     - Company (optional)

3. **Configure Form Settings**
   - Go to the "Options" tab
   - Under "What should happen after a visitor submits this form?"
   - Select "Display a thank you message" OR "Redirect to another page"
   - If using redirect, set redirect URL to your custom redirect page

4. **Enable Contact Creation**
   - In form settings, go to "Follow-up" tab
   - Ensure "Create new contact for email address" is ENABLED
   - Set "Update existing contacts" to YES
   - This ensures native HubSpot contact creation

### Step 2: Set Up HubSpot Workflow (Webhook Method)

1. **Create a New Workflow**
   - Navigate to Automation > Workflows
   - Click "Create workflow"
   - Choose "Form submission" as the trigger

2. **Set Enrollment Trigger**
   - Select your Clarity Audit form
   - Set trigger to "When a form is submitted"

3. **Add Webhook Action**
   - Click the "+" to add an action
   - Search for "Webhook"
   - Configure webhook:
     - Method: POST
     - URL: `https://YOUR-PROJECT.supabase.co/functions/v1/receive-hubspot-form`
     - Headers:
       ```
       Content-Type: application/json
       Authorization: Bearer YOUR-SUPABASE-ANON-KEY
       ```
     - Body: Choose "Form fields" and select:
       - email
       - firstname
       - lastname
       - phone
       - company

4. **Activate Workflow**
   - Review the workflow
   - Turn it on

### Step 3: Configure HubSpot API Access

1. **Create Private App**
   - Go to Settings > Integrations > Private Apps
   - Click "Create a private app"
   - Name it "Clarity Audit Integration"

2. **Set Required Scopes**
   - Select the following scopes:
     - `crm.objects.contacts.read`
     - `crm.objects.contacts.write`
     - `crm.schemas.contacts.read`
     - `crm.objects.notes.read`
     - `crm.objects.notes.write`

3. **Generate Token**
   - Click "Create app"
   - Copy the access token
   - Store it securely

### Step 4: Configure Supabase Edge Functions

1. **Set Environment Variables**
   - Go to your Supabase project
   - Navigate to Settings > Edge Functions
   - Add the following secrets:
     ```
     HUBSPOT_TOKEN=your_hubspot_private_app_token
     SENDGRID_API_KEY=your_sendgrid_api_key
     FROM_EMAIL=chloe@cultivatedhq.com.au
     CC_EMAIL=chloe@cultivatedhq.com.au
     ```

2. **Deploy Edge Functions**
   - The following functions need to be deployed:
     - `receive-hubspot-form`
     - `send-results`

3. **Verify Function URLs**
   - receive-hubspot-form: `https://YOUR-PROJECT.supabase.co/functions/v1/receive-hubspot-form`
   - send-results: `https://YOUR-PROJECT.supabase.co/functions/v1/send-results`

## Testing the Integration

### Test 1: Form Submission

1. **Submit Test Form**
   - Go to your HubSpot form
   - Fill in test data with a unique email
   - Submit the form

2. **Verify in Supabase**
   - Check the `clarity_audit_initial_sessions` table
   - Confirm a new row was created with the email

3. **Verify in HubSpot CRM**
   - Go to Contacts
   - Search for the test email
   - Confirm the contact exists
   - Check for a note: "Contact submitted Leadership Clarity Audit form"

### Test 2: Audit Completion

1. **Complete the Audit**
   - Use the test email from step 1
   - Complete all audit questions
   - Submit the results

2. **Verify in Supabase**
   - Check the `clarity_audit_results` table
   - Confirm results were saved

3. **Verify in HubSpot CRM**
   - Search for the test contact again
   - Check for a new note with the audit results
   - Verify contact properties are updated

4. **Verify Email Delivery**
   - Check that the results email was received
   - Verify it contains the full audit report

## Troubleshooting

### Issue: Form submissions not creating contacts

**Possible Causes:**
1. HubSpot form not configured to create contacts
2. Workflow not active or not triggering
3. Webhook URL incorrect
4. HUBSPOT_TOKEN not configured or invalid

**Solutions:**
1. Check form settings: "Create new contact for email address" must be enabled
2. Verify workflow is active in HubSpot Workflows dashboard
3. Check Supabase Edge Function logs for webhook errors
4. Test HubSpot API token with a curl command:
   ```bash
   curl https://api.hubapi.com/crm/v3/objects/contacts?limit=1 \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Issue: Contacts created but notes not added

**Possible Causes:**
1. Missing note creation scope in HubSpot token
2. Contact ID not found after creation
3. Association API failing

**Solutions:**
1. Verify scopes: `crm.objects.notes.write` must be enabled
2. Check Edge Function logs for contact ID
3. Review HubSpot API error responses in logs

### Issue: Duplicate contacts being created

**Possible Causes:**
1. Email deduplication not working in HubSpot
2. API creating contacts instead of updating

**Solutions:**
1. Check HubSpot settings: Settings > Objects > Contacts > Duplicate management
2. Verify email is set as the unique identifier
3. Review Edge Function logic for upsert vs create

### Issue: Environment variables not available

**Possible Causes:**
1. Variables not set in Supabase
2. Edge Function cache not refreshed

**Solutions:**
1. Go to Supabase Settings > Edge Functions
2. Add all required secrets
3. Redeploy the Edge Functions

## Monitoring and Logs

### View Edge Function Logs

1. **In Supabase Dashboard**
   - Go to Edge Functions
   - Click on the function name
   - View "Logs" tab
   - Look for webhook requests and their outcomes

2. **Key Log Messages**
   - ✅ Success indicators (green checkmarks)
   - ⚠️ Warnings (yellow warnings)
   - ❌ Errors (red X marks)

### View HubSpot Activity

1. **Contact Timeline**
   - Go to any contact record
   - Check the timeline for:
     - Form submissions
     - Workflow enrollments
     - Note creations
     - Property updates

2. **Workflow History**
   - Go to the workflow
   - Click "History" tab
   - Check for successful enrollments
   - Review any errors

## Data Flow Details

### Fields Captured from HubSpot Form

- `email` - Contact email (required)
- `firstname` - Contact first name
- `lastname` - Contact last name
- `phone` - Contact phone number
- `company` - Contact company name

### HubSpot Contact Properties Set

- `email` - Email address
- `firstname` - First name
- `lastname` - Last name
- `phone` - Phone number (if provided)
- `company` - Company name (if provided)
- `lifecyclestage` - Set to "lead"
- `hs_lead_status` - Set to "NEW"
- `source` - Set to "Clarity Audit Form"

### Notes Added to Contact

1. **Form Submission Note**
   - Added by: receive-hubspot-form function
   - Content: "Contact submitted Leadership Clarity Audit form. Session ID: {uuid}"

2. **Audit Results Note**
   - Added by: send-results function
   - Content: Full HTML audit report with scores and recommendations

## API Rate Limits

HubSpot has API rate limits:
- **Professional/Enterprise**: 10 requests per second
- **Free/Starter**: 100 requests per 10 seconds

The integration is designed to handle these limits with:
- Sequential API calls (not parallel)
- Error handling for rate limit responses
- Automatic retry logic

## Security Best Practices

1. **Keep Tokens Secure**
   - Never commit tokens to git
   - Store in Supabase secrets only
   - Rotate tokens periodically

2. **Validate Webhook Sources**
   - Consider adding webhook signature verification
   - Use HTTPS only for webhooks

3. **Monitor API Usage**
   - Check HubSpot API usage regularly
   - Set up alerts for rate limit approaches

## Support Resources

- **HubSpot API Documentation**: https://developers.hubspot.com/docs/api/overview
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Project Support**: chloe@cultivatedhq.com.au

## Quick Reference

### Important URLs

- HubSpot Form: `https://share-ap1.hsforms.com/1TmtlcZixSN-RGx_WhwOhgw7b5o2s`
- Webhook URL: `https://vidlhnvtsjjzrsshepcd.supabase.co/functions/v1/receive-hubspot-form`
- Redirect URL: `https://www.cultivatedhq.com.au/clarityauditredirect`
- Audit Entry: `https://www.cultivatedhq.com.au/clarityauditentry`

### Environment Variables Checklist

- [ ] HUBSPOT_TOKEN
- [ ] SENDGRID_API_KEY
- [ ] FROM_EMAIL
- [ ] CC_EMAIL
- [ ] SUPABASE_URL (automatic)
- [ ] SUPABASE_SERVICE_ROLE_KEY (automatic)

### Testing Checklist

- [ ] Form submission creates session in Supabase
- [ ] Contact created/updated in HubSpot CRM
- [ ] Form submission note added to contact
- [ ] User redirected to audit page
- [ ] Audit completion saves results to Supabase
- [ ] Audit results note added to HubSpot contact
- [ ] Results email sent via SendGrid
- [ ] All logs show success messages
