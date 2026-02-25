# Bolt Workflow Testing Guide

## Test Plan for Survey Processing Workflow

### 1. Create Test Surveys
First, create test surveys with different characteristics:

#### Test Survey 1: With Responses
1. Create a new survey in the admin panel
2. Set the expiration date to yesterday (manually in the database)
3. Add 3-5 test responses with varied ratings
4. Include some comments in the responses

#### Test Survey 2: No Responses
1. Create another survey
2. Set the expiration date to yesterday
3. Don't add any responses

### 2. Prepare the Database
Run these queries to ensure the test surveys are ready for processing:

```sql
-- Update expiration dates to be in the past
UPDATE feedback_sessions
SET expires_at = NOW() - INTERVAL '1 day'
WHERE id IN ('test-survey-id-1', 'test-survey-id-2');

-- Ensure they're marked as active and not processed
UPDATE feedback_sessions
SET 
  is_active = true,
  report_generated = false,
  report_sent = false
WHERE id IN ('test-survey-id-1', 'test-survey-id-2');

-- Verify they're ready for processing
SELECT id, title, expires_at, is_active, report_generated, report_sent, response_count
FROM feedback_sessions
WHERE id IN ('test-survey-id-1', 'test-survey-id-2');
```

### 3. Run the Workflow Manually
1. Go to your Bolt dashboard
2. Find the "Process Expired Leadership Surveys" workflow
3. Click "Run Now" or the manual trigger option
4. Monitor the execution in real-time

### 4. Verify Results

#### Database Verification
Run these queries after the workflow completes:

```sql
-- Check if surveys were marked as processed
SELECT id, title, is_active, report_generated, report_sent, report_sent_at
FROM feedback_sessions
WHERE id IN ('test-survey-id-1', 'test-survey-id-2');
```

#### Email Verification
1. Check the inbox for the manager email addresses
2. Verify that Survey 1 received a report email with PDF
3. Verify that Survey 2 received a "no responses" email

#### PDF Verification
1. Download the PDF report for Survey 1
2. Check that it contains:
   - Correct survey title and manager name
   - Accurate response statistics
   - All comments
   - Appropriate recommendations

### 5. Test Error Handling

#### Test Invalid Survey ID
1. Modify the workflow to process a non-existent survey ID
2. Run the workflow
3. Verify it handles the error gracefully and continues processing other surveys

#### Test PDF Generation Failure
1. Temporarily modify the PDF.co API key to be invalid
2. Run the workflow
3. Verify it logs the error and continues processing

### 6. Test Scheduled Execution
1. Set the workflow to run at a specific time in the near future
2. Create new test surveys
3. Wait for the scheduled time
4. Verify the workflow runs automatically and processes the surveys

### 7. Performance Testing
If you have a large number of surveys:

1. Create 10+ test surveys with varied response counts
2. Run the workflow
3. Monitor execution time and resource usage
4. Verify all surveys are processed correctly

## Troubleshooting Common Issues

### Workflow Not Starting
- Check the trigger configuration
- Verify the schedule format (cron syntax)
- Check Bolt service status

### Database Queries Failing
- Verify Supabase connection
- Check SQL syntax
- Ensure the required tables and functions exist

### PDF Generation Issues
- Verify PDF.co API key
- Check HTML template for syntax errors
- Ensure the HTML is properly escaped in the template

### Email Delivery Problems
- Check email service configuration
- Verify recipient email addresses
- Check for spam filtering

## Success Criteria
The workflow test is successful when:

1. All expired surveys are processed
2. Appropriate emails are sent based on response count
3. PDF reports are generated correctly
4. Database is updated to reflect processing status
5. Errors are handled gracefully
6. The process completes within a reasonable time