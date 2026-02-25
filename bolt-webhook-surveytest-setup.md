# Bolt Test Workflow Guide

## Creating a Test Workflow for PDF Report Generation

This guide walks you through creating a test workflow in Bolt to verify that your PDF report generation system is working correctly.

## Step 1: Create a New Workflow

1. Log in to your Bolt account
2. Click "Create New Workflow" button
3. Fill in the basic details:
   - **Name:** Test PDF Report Generation
   - **Description:** Manually test the PDF report generation system
   - **Trigger Type:** Run on demand (Manual trigger)

## Step 2: Add HTTP Request Block

This block will call your Supabase Edge Function to generate a test PDF report.

1. Click "+ Add Step"
2. Select "HTTP Request"
3. Configure the block:
   - **Name:** Generate Test PDF Report
   - **Method:** POST
   - **URL:** `https://vidlhnvtsjjzrsshepcd.supabase.co/functions/v1/test-pdf-report`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZGxobnZ0c2pqenJzc2hlcGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTU0NTQsImV4cCI6MjA2NjU3MTQ1NH0.Uc6OovgASNXejAtdJKW_tX-Ju2Emon-4Z5anDsVGKs8",
       "Content-Type": "application/json"
     }
     ```
   - **Body:**
     ```json
     {}
     ```
   - **Output Variable:** `pdf_result`

## Step 3: Add Logic Block to Process Results

This block will process and display the results from the HTTP request.

1. Click "+ Add Step"
2. Select "Logic/JavaScript"
3. Configure the block:
   - **Name:** Display PDF Report Results
   - **Code:**
     ```javascript
     console.log('✅ PDF Report Generation Test Results:');
     console.log('PDF URL:', pdf_result.pdf_url);
     console.log('PDF Name:', pdf_result.pdf_name);
     console.log('Generated at:', pdf_result.timestamp);

     // Create a formatted result for display
     return {
       success: pdf_result.success,
       pdf_url: pdf_result.pdf_url,
       pdf_name: pdf_result.pdf_name,
       test_data: pdf_result.test_data,
       timestamp: pdf_result.timestamp
     };
     ```
   - **Output Variable:** `display_results`

## Step 4: Add HTML Preview Block

This block will create a nice HTML preview of the results with a link to the PDF.

1. Click "+ Add Step"
2. Select "Set Variable"
3. Configure the block:
   - **Variable Name:** `preview_html`
   - **Value:** (Copy the HTML template from the bolt-test-pdf-flow.md file)

## Step 5: Add Preview Block

This block will display the HTML preview.

1. Click "+ Add Step"
2. Select "Preview"
3. Configure the block:
   - **Name:** Preview PDF Report
   - **Content:** `{{ preview_html }}`

## Step 6: Save and Run the Workflow

1. Click "Save" to save your workflow
2. Click "Run" to manually trigger the workflow
3. Wait for the workflow to complete (usually takes 10-15 seconds)
4. View the results in the Preview block
5. Click the "View Generated PDF Report" button to open the PDF in a new tab

## What to Check in the PDF

When you open the PDF, verify:

1. **Professional formatting and layout**
2. **Correct data display and calculations**
3. **Charts and visualizations**
4. **Personalized recommendations**
5. **Sample comments section**
6. **Overall report quality and readability**

## Troubleshooting

If the test fails, check:

1. **Edge Function Deployment:** Ensure the `test-pdf-report` function is deployed
2. **API Key:** Verify the Supabase anon key is correct
3. **PDF.co API Key:** Check that the PDF.co API key in the function is valid
4. **Function Logs:** Review the Supabase Edge Function logs for errors

## Next Steps

After confirming the PDF generation works:

1. Test the scheduled workflow with a real expired survey
2. Verify email delivery
3. Check database updates
4. Monitor the daily automated processing