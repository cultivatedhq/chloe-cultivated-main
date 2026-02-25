# Bolt Test Workflow Setup Guide

## Overview
This guide provides step-by-step instructions for creating a test workflow in Bolt to verify your PDF report generation system is working correctly. This workflow allows you to manually trigger the test-pdf-report function and view the results.

## Complete Setup Instructions

### Step 1: Create a New Workflow
1. In Bolt, create a new workflow
2. Name it "Test PDF Report Generator"
3. Description: "Manually test the PDF report generation system"
4. Trigger Type: "Run on demand" (Manual trigger)

### Step 2: Add HTTP Request Block
**Block Type:** HTTP Request
**Name:** "Generate Test PDF Report"
**Method:** POST
**URL:** `https://vidlhnvtsjjzrsshepcd.supabase.co/functions/v1/test-pdf-report`
**Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGxobnZ0c2pqenJzc2hlcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU0NTQsImV4cCI6MjA2NjU3MTQ1NH0.Uc6OovgASNXejAtdJKW_tX-Ju2Emon-4Z5anDsVGKs8",
  "Content-Type": "application/json"
}
```
**Body:**
```json
{}
```
**Output Variable:** `pdfResponse`

### Step 3: Add Logic Block to Process Results
**Block Type:** Logic/JavaScript
**Name:** "Process PDF Response"
**Code:**
```javascript
console.log('✅ PDF Report Generation Test Results:');
console.log('PDF URL:', pdfResponse.pdf_url);
console.log('PDF Name:', pdfResponse.pdf_name);
console.log('Generated at:', pdfResponse.timestamp);

// Create a formatted result for display
return {
  success: pdfResponse.success,
  pdf_url: pdfResponse.pdf_url,
  pdf_name: pdfResponse.pdf_name,
  test_data: pdfResponse.test_data,
  timestamp: pdfResponse.timestamp
};
```
**Output Variable:** `displayResults`

### Step 4: Add Set Variable Block for HTML Preview
**Block Type:** Set Variable
**Variable Name:** `previewHtml`
**Value:**
```html
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: #e8f5f3; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #2a9d8f;">
    <h2 style="color: #2a9d8f; margin-top: 0;">✅ PDF Report Generated Successfully!</h2>
    <p><strong>Status:</strong> {{ displayResults.success ? 'Success' : 'Failed' }}</p>
    <p><strong>Generated:</strong> {{ new Date(displayResults.timestamp).toLocaleString() }}</p>
    <p><strong>File Name:</strong> {{ displayResults.pdf_name }}</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ displayResults.pdf_url }}" target="_blank" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
      📄 View Generated PDF Report
    </a>
  </div>

  <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3 style="margin-top: 0;">📊 Test Report Details:</h3>
    <ul>
      <li><strong>Survey Title:</strong> {{ displayResults.test_data.survey_title }}</li>
      <li><strong>Manager:</strong> {{ displayResults.test_data.manager_name }}</li>
      <li><strong>Email:</strong> {{ displayResults.test_data.manager_email }}</li>
      <li><strong>Total Responses:</strong> {{ displayResults.test_data.total_responses }}</li>
      <li><strong>Overall Score:</strong> {{ displayResults.test_data.overall_score }}%</li>
      <li><strong>Performance Category:</strong> {{ displayResults.test_data.performance_category }}</li>
    </ul>
  </div>

  <div style="background: #e0f7fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #0097a7;">
    <h3 style="margin-top: 0; color: #0097a7;">🔍 What to Check in the PDF:</h3>
    <ul>
      <li>Professional formatting and layout</li>
      <li>Correct data display and calculations</li>
      <li>Charts and visualizations</li>
      <li>Personalized recommendations</li>
      <li>Sample comments section</li>
      <li>Overall report quality and readability</li>
    </ul>
  </div>

  <p style="text-align: center; margin-top: 30px; color: #666;">
    This test confirms that your PDF generation system is working correctly.<br>
    The same system will be used to generate reports for expired surveys.
  </p>
</div>
```

### Step 5: Add Preview Block
**Block Type:** Preview
**Name:** "Preview PDF Report"
**Content:** `{{ previewHtml }}`

## Running the Test

1. Go to your Bolt dashboard
2. Find the "Test PDF Report Generator" workflow
3. Click "Run" to manually trigger the workflow
4. Wait for the workflow to complete (usually takes 10-15 seconds)
5. View the results in the Preview block
6. Click the "View Generated PDF Report" button to open the PDF in a new tab

## What This Tests

This workflow tests:

1. **Edge Function Connectivity**: Verifies that your Supabase Edge Function is accessible
2. **PDF.co Integration**: Confirms that the PDF.co API key is valid and working
3. **HTML Template**: Tests that your HTML report template renders correctly
4. **Email Template**: Indirectly tests the email template structure
5. **End-to-End Flow**: Validates the complete PDF generation process

## Troubleshooting

If the test fails, check:

1. **Edge Function Deployment**: Ensure the `test-pdf-report` function is deployed
2. **API Key**: Verify the Supabase anon key is correct
3. **PDF.co API Key**: Check that the PDF.co API key in the function is valid
4. **Function Logs**: Review the Supabase Edge Function logs for errors

## Next Steps

After confirming the PDF generation works:

1. Test the scheduled workflow with a real expired survey
2. Verify email delivery
3. Check database updates
4. Monitor the daily automated processing