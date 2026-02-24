# Running the Test PDF Report Function with Authentication Token

## Overview
This guide explains how to test the PDF report generation function using the Supabase authentication token.

## Prerequisites
- Supabase project with deployed edge functions
- Access to your Supabase anon key

## Method 1: Using Bolt Workflow (Recommended)

The easiest way to test the PDF report generation is to use the Bolt workflow:

1. Create a "Run on demand" workflow in Bolt
2. Add an HTTP Request block that calls the test-pdf-report function
3. Use your Supabase anon key in the Authorization header
4. Run the workflow and view the results

See the complete setup instructions in `logic/bolt-test-pdf-flow.md`.

## Method 2: Using cURL

You can also test the function directly using cURL:

```bash
curl -X POST "https://vidlhnvtsjjzrsshepcd.supabase.co/functions/v1/test-pdf-report" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGxobnZ0c2pqenJzc2hlcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU0NTQsImV4cCI6MjA2NjU3MTQ1NH0.Uc6OovgASNXejAtdJKW_tX-Ju2Emon-4Z5anDsVGKs8" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Method 3: Using Fetch in JavaScript

You can also test the function using JavaScript:

```javascript
const response = await fetch('https://vidlhnvtsjjzrsshepcd.supabase.co/functions/v1/test-pdf-report', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGxobnZ0c2pqenJzc2hlcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU0NTQsImV4cCI6MjA2NjU3MTQ1NH0.Uc6OovgASNXejAtdJKW_tX-Ju2Emon-4Z5anDsVGKs8',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
});

const result = await response.json();
console.log(result);
```

## Expected Response

The function should return a JSON response like this:

```json
{
  "success": true,
  "message": "Test PDF report generated successfully!",
  "pdf_url": "https://pdf-temp-files.s3-us-west-2.amazonaws.com/...",
  "pdf_name": "Test-Leadership-Report-Chloe-James-2024-07-01.pdf",
  "test_data": {
    "survey_title": "Q4 2024 Leadership Feedback - Test Report",
    "manager_name": "Chloe James",
    "manager_email": "chloe@cultivatedhq.com.au",
    "total_responses": 8,
    "overall_score": 84,
    "performance_category": "excellent"
  },
  "timestamp": "2024-07-01T12:34:56.789Z"
}
```

## Troubleshooting

If you encounter errors:

1. **401 Unauthorized**: Check your Supabase anon key
2. **404 Not Found**: Verify the function is deployed
3. **500 Internal Server Error**: Check the function logs in Supabase

## Viewing the PDF

The response includes a `pdf_url` field with a direct link to the generated PDF. This URL is temporary and will expire after some time, so download the PDF if you need to keep it.

## Next Steps

After confirming the PDF generation works:

1. Test the scheduled workflow with a real expired survey
2. Verify email delivery
3. Check database updates
4. Monitor the daily automated processing