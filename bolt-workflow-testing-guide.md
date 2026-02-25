# Bolt Workflow Implementation Guide

## Complete Setup Instructions

### Step 1: Create Scheduled Trigger
1. Open Bolt and click "Create New Workflow"
2. Name: "Process Expired Leadership Surveys"
3. Description: "Automatically process expired surveys and send PDF reports"
4. Trigger Type: Scheduled
5. Schedule: `0 8 * * *` (Daily at 8:00 AM)

### Step 2: Get Expired Surveys
**Block Type:** Supabase SQL Query
**Name:** "Get Expired Surveys"
**Query:**
```sql
SELECT * FROM session_expiration_status 
WHERE status = 'expired_pending'
ORDER BY expires_at ASC;
```
**Output Variable:** `surveys`

### Step 3: For Each Survey Loop
**Block Type:** For Each
**Name:** "Process Each Survey"
**Input:** `surveys`
**Alias:** `survey`

### Step 4: Get Complete Survey Analysis (Inside Loop)
**Block Type:** Supabase SQL Query
**Name:** "Get Complete Survey Analysis"
**Query:**
```sql
SELECT * FROM get_complete_survey_analysis('{{ survey.id }}');
```
**Output Variable:** `analysis`

### Step 5: Process Data for Template (Inside Loop)
**Block Type:** Logic/JavaScript
**Name:** "Process Data for Template"
**Code:**
```javascript
// Extract and format data from the analysis
const analysisData = analysis[0];
const sessionData = analysisData.session_data;
const responseCount = analysisData.response_count;
const questionAnalytics = analysisData.question_analytics || [];
const overallMetrics = analysisData.overall_metrics || {};
const commentsData = analysisData.comments_data || [];

// Calculate scale max
const scaleMax = sessionData.scale_type === 'likert_7' ? 7 : 5;

// Process question analytics
const questionAverages = questionAnalytics.map(q => q.average_score || 0);
const questionMedians = questionAnalytics.map(q => q.median_score || 0);
const responseDistributions = questionAnalytics.map(q => {
  const dist = q.distribution || {};
  const result = [];
  for (let i = 1; i <= scaleMax; i++) {
    result.push(dist[i.toString()] || 0);
  }
  return result;
});

// Extract comments
const comments = commentsData.map(c => c.comment || '').filter(c => c.length > 0);

// Calculate overall percentage
const overallAverage = overallMetrics.overall_average || 0;
const overallPercentage = Math.round((overallAverage / scaleMax) * 100);

// Get strongest and weakest areas
const strongestIndex = overallMetrics.strongest_question_index || 0;
const weakestIndex = overallMetrics.weakest_question_index || 0;
const strongestArea = sessionData.questions[strongestIndex] || 'N/A';
const weakestArea = sessionData.questions[weakestIndex] || 'N/A';

// Create template data object
const templateData = {
  survey: {
    ...sessionData,
    scale_max: scaleMax
  },
  analytics: {
    total_responses: responseCount,
    question_averages: questionAverages,
    question_medians: questionMedians,
    response_distributions: responseDistributions,
    overall_average: overallAverage,
    overall_percentage: overallPercentage,
    strongest_area: strongestArea,
    strongest_score: overallMetrics.strongest_score || 0,
    weakest_area: weakestArea,
    weakest_score: overallMetrics.weakest_score || 0,
    comments: comments,
    comment_count: comments.length,
    performance_category: overallMetrics.performance_category || 'needs_improvement'
  },
  processed_at: new Date().toISOString()
};

console.log('Template data prepared:', templateData);
return templateData;
```
**Output Variable:** `templateData`

### Step 6: Build Report HTML (Inside Loop)
**Block Type:** Set Variable
**Variable Name:** `report_html`
**Value:** Copy the complete HTML template from `logic/survey-report-html-template.html`

### Step 7: Check if Survey Has Responses (Inside Loop)
**Block Type:** Conditional Logic
**Name:** "Check if Survey Has Responses"
**Condition:** `{{ templateData.analytics.total_responses > 0 }}`

### Step 8A: Generate PDF (TRUE Branch)
**Block Type:** HTTP Request
**Name:** "Generate PDF with PDF.co"
**Method:** POST
**URL:** `https://api.pdf.co/v1/pdf/convert/from/html`
**Headers:**
```json
{
  "x-api-key": "cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR",
  "Content-Type": "application/json"
}
```
**Body:**
```json
{
  "html": "{{ report_html }}",
  "name": "Leadership-Report-{{ templateData.survey.manager_name }}-{{ new Date().toISOString().split('T')[0] }}.pdf",
  "async": false,
  "margins": "20px",
  "paperSize": "A4",
  "orientation": "Portrait",
  "printBackground": true,
  "mediaType": "print"
}
```
**Output Variable:** `pdf_response`

### Step 9A: Send Report Email (TRUE Branch)
**Block Type:** Email
**Name:** "Send PDF Report Email"
**To:** `{{ templateData.survey.manager_email }}`
**CC:** `chloe@cultivatedhq.com.au`
**Subject:** `Your Leadership Feedback Report is Ready: {{ templateData.survey.title }}`
**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2a9d8f;">Your Leadership Feedback Report is Ready!</h2>
  <p>Hi {{ templateData.survey.manager_name }},</p>
  <p>Your team's leadership feedback report is now ready! 🎉</p>
  
  <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
    <h3 style="margin-top: 0;">📊 Survey Summary:</h3>
    <ul>
      <li><strong>Total Responses:</strong> {{ templateData.analytics.total_responses }}</li>
      <li><strong>Overall Leadership Score:</strong> {{ templateData.analytics.overall_percentage }}%</li>
      <li><strong>Survey Period:</strong> {{ new Date(templateData.survey.created_at).toLocaleDateString() }} - {{ new Date(templateData.survey.expires_at).toLocaleDateString() }}</li>
      <li><strong>Anonymous Comments:</strong> {{ templateData.analytics.comment_count }}</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ pdf_response.url }}" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">📄 Download Your Report</a>
  </div>

  <div style="background: #e8f5f3; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #2a9d8f;">📋 Your Report Includes:</h3>
    <ul>
      <li>Statistical analysis of all responses</li>
      <li>Visual performance metrics and charts</li>
      <li>Anonymous comments from your team</li>
      <li>Personalized leadership development recommendations</li>
      <li>Strengths and development opportunities</li>
      <li>Actionable next steps for improvement</li>
    </ul>
  </div>
  
  <h3>🎯 Next Steps:</h3>
  <ol>
    <li><strong>Review your detailed feedback report</strong></li>
    <li><strong>Identify key development areas</strong></li>
    <li><strong>Consider scheduling follow-up conversations with your team</strong></li>
    <li><strong>Create an action plan for improvement</strong></li>
    <li><strong>Schedule regular check-ins for ongoing feedback</strong></li>
  </ol>

  <p>If you have any questions about your results or would like support interpreting your feedback and creating a development plan, I'm here to help.</p>
  
  <p>Thank you for investing in your leadership development!</p>
  
  <p>Best regards,<br>
  <strong>Chloe James</strong><br>
  Cultivated HQ<br>
  <a href="mailto:chloe@cultivatedhq.com.au" style="color: #2a9d8f;">chloe@cultivatedhq.com.au</a></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666;">
    This report contains confidential leadership feedback. Please handle with appropriate discretion.<br>
    Questions about your report? Reply to this email or visit <a href="https://www.cultivatedhq.com.au" style="color: #2a9d8f;">cultivatedhq.com.au</a>
  </p>
</div>
```

### Step 8B: Send No Responses Email (FALSE Branch)
**Block Type:** Email
**Name:** "Send No Responses Email"
**To:** `{{ templateData.survey.manager_email }}`
**CC:** `chloe@cultivatedhq.com.au`
**Subject:** `Survey Closed: {{ templateData.survey.title }}`
**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2a9d8f;">Survey Period Complete</h2>
  <p>Hi {{ templateData.survey.manager_name }},</p>
  <p>Your 3-day feedback survey period has ended.</p>
  
  <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f39c12;">
    <h3 style="margin-top: 0;">📊 Survey Summary:</h3>
    <ul>
      <li><strong>Session:</strong> {{ templateData.survey.title }}</li>
      <li><strong>Total Responses:</strong> 0</li>
      <li><strong>Status:</strong> Closed (No responses received)</li>
    </ul>
  </div>

  <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f39c12;">
    <h3 style="margin-top: 0; color: #856404;">💡 Tips for Future Surveys:</h3>
    <ul>
      <li>Send personal invitations to team members</li>
      <li>Explain the purpose and benefits of the feedback</li>
      <li>Emphasize the anonymous nature of responses</li>
      <li>Follow up with reminders during the 3-day window</li>
      <li>Consider the timing - avoid busy periods</li>
      <li>Share the survey link in team meetings</li>
    </ul>
  </div>
  
  <p>Would you like to create another survey? I'm here to help you gather valuable feedback from your team.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://www.cultivatedhq.com.au/pulsecheck/create" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Create New Survey</a>
  </div>
  
  <p>Best regards,<br>
  <strong>Chloe James</strong><br>
  Cultivated HQ<br>
  <a href="mailto:chloe@cultivatedhq.com.au" style="color: #2a9d8f;">chloe@cultivatedhq.com.au</a></p>
</div>
```

### Step 10: Mark Survey as Processed (Both Branches)
**Block Type:** Supabase SQL Query
**Name:** "Mark Survey as Processed"
**Query:**
```sql
SELECT process_survey_completion('{{ survey.id }}');
```

### Step 11: Log Processing Result (Both Branches)
**Block Type:** Logic/JavaScript
**Name:** "Log Processing Result"
**Code:**
```javascript
console.log(`✅ Successfully processed survey: ${templateData.survey.title}`);
console.log(`📊 Responses: ${templateData.analytics.total_responses}`);
console.log(`📧 Email sent to: ${templateData.survey.manager_email}`);
console.log(`⏰ Processed at: ${new Date().toISOString()}`);

return {
  survey_id: templateData.survey.id,
  survey_title: templateData.survey.title,
  response_count: templateData.analytics.total_responses,
  status: 'processed',
  processed_at: new Date().toISOString()
};
```

## Testing the Workflow

### Test Procedure
1. Create a test survey with a past expiration date
2. Add some test responses
3. Manually trigger the workflow
4. Verify email delivery and database updates

### Validation Queries
```sql
-- Check surveys that should be processed
SELECT id, title, expires_at, report_sent 
FROM feedback_sessions 
WHERE expires_at <= NOW() AND report_sent = false;

-- Verify processing results
SELECT id, title, report_sent, report_sent_at 
FROM feedback_sessions 
WHERE report_sent = true 
ORDER BY report_sent_at DESC;
```

## Troubleshooting

### Common Issues and Solutions

#### PDF Generation Fails
- Check PDF.co API key is correct
- Verify HTML template syntax
- Check API usage limits
- Review error logs

#### Emails Not Sending
- Verify email service configuration
- Check recipient email addresses
- Review spam/bounce reports
- Validate email templates

#### Database Errors
- Ensure migration is applied
- Check function permissions
- Verify data integrity
- Review query syntax

## Monitoring and Maintenance

### Daily Checks
- Review Bolt workflow logs
- Verify email delivery
- Check PDF.co usage
- Monitor database performance

### Weekly Reviews
- Analyze success rates
- Review error patterns
- Check client feedback
- Optimize performance

## Expected Results

Once deployed, your system will:
- **Daily automated processing** of expired surveys
- **Professional PDF reports** generated and delivered
- **Email notifications** sent to managers
- **Database updates** marking surveys as processed
- **Comprehensive logging** for monitoring
- **Zero manual intervention** required