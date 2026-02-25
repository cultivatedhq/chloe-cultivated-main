# Bolt Workflow Monitoring Guide

## Daily Monitoring Checklist

### 1. Check Workflow Execution Status
- Log into Bolt dashboard
- Navigate to "Process Expired Leadership Surveys" workflow
- Check the "Runs" tab for the most recent execution
- Verify status is "Completed" with no errors

### 2. Review Processing Logs
- Click on the most recent run
- Check the logs for any warnings or errors
- Verify the number of surveys processed
- Look for successful PDF generation and email sending

### 3. Database Verification
Run these queries to verify database state:

```sql
-- Check for any surveys that should have been processed but weren't
SELECT id, title, expires_at, is_active, report_generated, report_sent
FROM feedback_sessions
WHERE 
  expires_at < NOW() 
  AND is_active = true 
  AND report_sent = false;

-- Check recently processed surveys
SELECT id, title, expires_at, report_sent_at, response_count
FROM feedback_sessions
WHERE 
  report_sent = true
  AND report_sent_at > NOW() - INTERVAL '1 day'
ORDER BY report_sent_at DESC;
```

### 4. Email Delivery Verification
- Check email delivery logs if available
- Verify that emails were sent to the correct recipients
- Check for any bounce notifications

### 5. PDF Generation Verification
- Check PDF.co dashboard for recent activity
- Verify PDF files were generated successfully
- Sample a few PDFs to ensure content quality

## Weekly Review Process

### 1. Performance Analysis
- Review average processing time per survey
- Check resource usage during workflow execution
- Identify any performance bottlenecks

### 2. Error Pattern Analysis
- Look for recurring errors or warnings
- Identify common failure points
- Develop solutions for frequent issues

### 3. Success Rate Calculation
```sql
-- Calculate success rate for the past week
SELECT 
  COUNT(*) as total_expired,
  SUM(CASE WHEN report_sent = true THEN 1 ELSE 0 END) as successfully_processed,
  ROUND(
    (SUM(CASE WHEN report_sent = true THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100, 
    2
  ) as success_rate_percent
FROM feedback_sessions
WHERE 
  expires_at BETWEEN NOW() - INTERVAL '7 days' AND NOW()
  AND is_active = false;
```

### 4. Response Rate Analysis
```sql
-- Calculate average response rate
SELECT 
  COUNT(*) as total_surveys,
  AVG(response_count) as avg_responses_per_survey,
  SUM(CASE WHEN response_count = 0 THEN 1 ELSE 0 END) as surveys_with_no_responses,
  ROUND(
    (SUM(CASE WHEN response_count > 0 THEN 1 ELSE 0 END)::numeric / COUNT(*)::numeric) * 100,
    2
  ) as percent_with_responses
FROM feedback_sessions
WHERE expires_at BETWEEN NOW() - INTERVAL '7 days' AND NOW();
```

## Monthly Maintenance Tasks

### 1. API Key Rotation
- Check PDF.co API key expiration
- Rotate keys if necessary
- Update the key in Bolt workflow

### 2. Template Updates
- Review email templates for relevance
- Update PDF report template if needed
- Test any template changes

### 3. Database Optimization
```sql
-- Check for any orphaned responses
SELECT fr.id, fr.session_id
FROM feedback_responses fr
LEFT JOIN feedback_sessions fs ON fr.session_id = fs.id
WHERE fs.id IS NULL;

-- Clean up old processed sessions if needed
-- (Only if you want to archive or delete very old data)
UPDATE feedback_sessions
SET is_active = false
WHERE 
  expires_at < NOW() - INTERVAL '90 days'
  AND is_active = true;
```

### 4. Workflow Optimization
- Review workflow steps for efficiency
- Consider parallel processing for multiple surveys
- Update any outdated components

## Alert Setup

### Critical Alerts (Immediate Notification)
- Workflow execution failure
- Database connection errors
- PDF.co API errors
- Email sending failures

### Warning Alerts (Daily Digest)
- Surveys with no responses
- Processing time exceeding thresholds
- Low success rate (below 95%)

## Troubleshooting Guide

### Workflow Not Running
1. Check scheduled trigger configuration
2. Verify Bolt service status
3. Check for any account limitations

### Database Connection Issues
1. Verify Supabase credentials
2. Check network connectivity
3. Ensure database is online and accessible

### PDF Generation Failures
1. Verify PDF.co API key
2. Check HTML template for errors
3. Ensure PDF.co service is available
4. Check for size limitations

### Email Delivery Problems
1. Verify email service configuration
2. Check recipient email addresses
3. Look for spam filtering issues
4. Verify email templates

## Recovery Procedures

### Manual Processing
If the automated workflow fails, you can manually process surveys:

1. Identify unprocessed surveys:
```sql
SELECT id, title FROM feedback_sessions
WHERE expires_at < NOW() AND report_sent = false;
```

2. Manually trigger the workflow for specific surveys
3. Verify processing completion

### Data Correction
If survey data needs correction:

1. Update the database directly:
```sql
-- Example: Fix incorrect response count
UPDATE feedback_sessions
SET response_count = (
  SELECT COUNT(*) FROM feedback_responses
  WHERE session_id = 'specific-survey-id'
)
WHERE id = 'specific-survey-id';
```

2. Re-run the workflow for the affected survey