# Bolt Survey Processing Implementation Guide

## Daily Scheduled Trigger Setup

### 1. Bolt Trigger Configuration
```
Trigger Type: Scheduled
Schedule: Daily at 8:00 AM
Name: "Process Expired Surveys"
```

### 2. Step 1: Get Surveys Ready for Report
**Block Type:** Supabase SQL Query
**Query:**
```sql
SELECT 
  id,
  title,
  manager_name,
  manager_email,
  questions,
  scale_type,
  response_count,
  created_at,
  expires_at,
  description,
  CASE 
    WHEN scale_type = 'likert_7' THEN 7
    ELSE 5
  END as scale_max
FROM feedback_sessions
WHERE 
  expires_at <= NOW()
  AND report_sent = false
  AND is_active = true
ORDER BY expires_at ASC;
```
**Output Variable:** `surveys`

### 3. Step 2: Loop Through Each Survey
**Block Type:** For Each
**Input:** `surveys`
**Alias:** `survey`

### 4. Step 3: Get Responses for Current Survey (Inside Loop)
**Block Type:** Supabase SQL Query
**Query:**
```sql
SELECT 
  id,
  responses,
  comment,
  submitted_at
FROM feedback_responses
WHERE session_id = $1
ORDER BY submitted_at ASC;
```
**Parameters:** `survey.id`
**Output Variable:** `responses`

### 5. Step 4: Calculate Question Statistics (Inside Loop)
**Block Type:** Supabase SQL Query
**Query:**
```sql
WITH question_analysis AS (
  SELECT 
    question_index,
    response_value,
    COUNT(*) as response_count
  FROM (
    SELECT 
      (row_number() OVER (PARTITION BY fr.id ORDER BY ordinality)) - 1 as question_index,
      (response_val::text)::numeric as response_value
    FROM feedback_responses fr,
         jsonb_array_elements(fr.responses) WITH ORDINALITY as response_val(value, ordinality)
    WHERE fr.session_id = $1
      AND (response_val::text)::numeric > 0
      AND (response_val::text)::numeric <= $2
  ) expanded_responses
  GROUP BY question_index, response_value
)
SELECT 
  question_index,
  ROUND(AVG(response_value), 2) as average_score,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_value) as median_score,
  SUM(response_count) as total_responses,
  json_object_agg(response_value::text, response_count) as distribution
FROM question_analysis
GROUP BY question_index
ORDER BY question_index;
```
**Parameters:** `survey.id`, `survey.scale_max`
**Output Variable:** `question_stats`

### 6. Step 5: Get Comments (Inside Loop)
**Block Type:** Supabase SQL Query
**Query:**
```sql
SELECT 
  comment,
  submitted_at
FROM feedback_responses
WHERE session_id = $1
  AND comment IS NOT NULL
  AND TRIM(comment) != ''
ORDER BY submitted_at ASC;
```
**Parameters:** `survey.id`
**Output Variable:** `comments`

### 7. Step 6: Calculate Overall Metrics (Inside Loop)
**Block Type:** Logic/JavaScript
**Code:**
```javascript
// Calculate overall average
const overallAverage = question_stats.length > 0 
  ? question_stats.reduce((sum, q) => sum + q.average_score, 0) / question_stats.length 
  : 0;

// Find strongest and weakest questions
const strongestQuestion = question_stats.reduce((max, current) => 
  current.average_score > max.average_score ? current : max, question_stats[0]);

const weakestQuestion = question_stats.reduce((min, current) => 
  current.average_score < min.average_score ? current : min, question_stats[0]);

// Get question texts
const strongestArea = survey.questions[strongestQuestion?.question_index] || 'N/A';
const weakestArea = survey.questions[weakestQuestion?.question_index] || 'N/A';

// Calculate performance percentage
const performancePercentage = Math.round((overallAverage / survey.scale_max) * 100);

// Determine performance category
let performanceCategory = 'needs_improvement';
if (performancePercentage >= 80) performanceCategory = 'excellent';
else if (performancePercentage >= 60) performanceCategory = 'good';
else if (performancePercentage >= 40) performanceCategory = 'fair';

// Create report data object
const reportData = {
  session: survey,
  analytics: {
    total_responses: responses.length,
    question_stats: question_stats,
    overall_average: overallAverage,
    performance_percentage: performancePercentage,
    performance_category: performanceCategory,
    strongest_area: strongestArea,
    strongest_score: strongestQuestion?.average_score || 0,
    weakest_area: weakestArea,
    weakest_score: weakestQuestion?.average_score || 0,
    comments: comments.map(c => c.comment),
    comment_count: comments.length
  }
};

return reportData;
```
**Output Variable:** `reportData`

### 8. Step 7: Generate HTML Report (Inside Loop)
**Block Type:** Logic/JavaScript
**Code:**
```javascript
// Generate recommendations based on performance
let recommendations = '';
if (reportData.analytics.performance_percentage >= 80) {
  recommendations = "You're performing strongly. Consider mentoring emerging leaders and sharing your practices across teams.";
} else if (reportData.analytics.performance_percentage >= 60) {
  recommendations = `You have a solid leadership foundation. Target specific areas for refinement, especially around ${reportData.analytics.weakest_area}.`;
} else {
  recommendations = "Improvement needed. We recommend structured leadership coaching focused on core behaviors like clarity, accountability, and feedback.";
}

// Generate questions HTML
const questionsHTML = survey.questions.map((question, index) => {
  const stats = reportData.analytics.question_stats.find(q => q.question_index === index);
  if (!stats) return '';
  
  const distributionHTML = Object.entries(stats.distribution)
    .map(([value, count]) => `${value}⭐ ${count}`)
    .join(' | ');
  
  return `
    <div class="question-block">
      <h3>${question}</h3>
      <p>Average: ${stats.average_score} / Median: ${stats.median_score}</p>
      <p>Responses: ${distributionHTML}</p>
    </div>
  `;
}).join('');

// Generate comments HTML
const commentsHTML = reportData.analytics.comments.map(comment => `
  <div class="comment">${comment}</div>
`).join('');

// Generate complete HTML report
const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leadership Feedback Report</title>
  <style>
    body { font-family: 'Inter', sans-serif; margin: 40px; color: #333; line-height: 1.6; }
    h1, h2, h3 { color: #00695C; }
    .header, .footer { text-align: center; border-bottom: 2px solid #00695C; padding-bottom: 10px; margin-bottom: 30px; }
    .section { margin-bottom: 40px; }
    .box { border: 1px solid #ccc; padding: 20px; margin-top: 10px; border-radius: 8px; background-color: #f9f9f9; }
    .question-block { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
    .comment { background-color: #e0f2f1; border-left: 4px solid #00695C; padding: 10px; margin-bottom: 10px; }
    .footer { font-size: 0.8em; border-top: 1px solid #ccc; padding-top: 10px; color: #777; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Leadership Feedback Report</h1>
    <p>Generated by Cultivated HQ</p>
  </div>

  <div class="section">
    <h2>Survey Overview</h2>
    <div class="box">
      <p><strong>Manager Name:</strong> ${survey.manager_name}</p>
      <p><strong>Survey Period:</strong> ${new Date(survey.created_at).toLocaleDateString()} to ${new Date(survey.expires_at).toLocaleDateString()}</p>
      <p><strong>Total Responses:</strong> ${reportData.analytics.total_responses}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to ${survey.scale_max} = Strongly Agree</p>
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="box">
      <p><strong>Overall Leadership Score:</strong> ${reportData.analytics.performance_percentage}%</p>
      <p><strong>Strongest Area:</strong> ${reportData.analytics.strongest_area} (${reportData.analytics.strongest_score})</p>
      <p><strong>Development Opportunity:</strong> ${reportData.analytics.weakest_area} (${reportData.analytics.weakest_score})</p>
      <p><strong>Anonymous Comments:</strong> ${reportData.analytics.comment_count}</p>
    </div>
  </div>

  <div class="section">
    <h2>Detailed Results</h2>
    ${questionsHTML}
  </div>

  ${reportData.analytics.comments.length > 0 ? `
  <div class="section">
    <h2>Anonymous Comments</h2>
    ${commentsHTML}
  </div>
  ` : ''}

  <div class="section">
    <h2>Development Recommendations</h2>
    <div class="box">
      <p>${recommendations}</p>
    </div>
  </div>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()} | Cultivated HQ</p>
  </div>
</body>
</html>
`;

return htmlReport;
```
**Output Variable:** `htmlReport`

### 9. Step 8: Send Report Email (Inside Loop)
**Block Type:** Conditional Logic
**Condition:** `responses.length > 0`

**If True - Send Report:**
**Block Type:** Email/HTTP Request
```javascript
// Send email with HTML report
const emailData = {
  to: survey.manager_email,
  subject: `Your Feedback Report is Ready: ${survey.title}`,
  html: htmlReport,
  from: 'chloe@cultivatedhq.com.au'
};

// Call email service (adjust based on your email provider)
return emailData;
```

**If False - Send No Responses Email:**
**Block Type:** Email/HTTP Request
```javascript
// Send no responses notification
const emailData = {
  to: survey.manager_email,
  subject: `Survey Closed: ${survey.title}`,
  html: `
    <h2>Survey Period Complete</h2>
    <p>Hi ${survey.manager_name},</p>
    <p>Your 3-day feedback survey period has ended with no responses received.</p>
    <p>Consider creating a new survey and following up directly with team members.</p>
    <p>Best regards,<br>The Cultivated HQ Team</p>
  `,
  from: 'chloe@cultivatedhq.com.au'
};

return emailData;
```

### 10. Step 9: Update Survey Status (Inside Loop)
**Block Type:** Supabase SQL Query
**Query:**
```sql
UPDATE feedback_sessions 
SET 
  is_active = false,
  report_generated = true,
  report_sent = true,
  report_sent_at = NOW(),
  updated_at = NOW()
WHERE id = $1;
```
**Parameters:** `survey.id`

### 11. Step 10: Send Admin Summary (After Loop)
**Block Type:** Logic/JavaScript
**Code:**
```javascript
// Create summary of processed surveys
const processedCount = surveys.length;
const successCount = surveys.filter(s => s.response_count > 0).length;
const noResponseCount = surveys.filter(s => s.response_count === 0).length;

const summaryHTML = `
  <h2>Daily Processing Summary</h2>
  <p>Processed ${processedCount} expired surveys:</p>
  <ul>
    <li>With responses: ${successCount}</li>
    <li>No responses: ${noResponseCount}</li>
  </ul>
  <p>All reports have been sent to managers.</p>
`;

// Send to admin
const adminEmail = {
  to: 'chloe@cultivatedhq.com.au',
  subject: `Daily Survey Processing Summary - ${new Date().toLocaleDateString()}`,
  html: summaryHTML,
  from: 'system@cultivatedhq.com.au'
};

return adminEmail;
```

## Error Handling

### Add Try-Catch Blocks
For each major step, wrap in error handling:

```javascript
try {
  // Process survey logic here
  console.log(`✅ Successfully processed survey: ${survey.title}`);
} catch (error) {
  console.error(`❌ Error processing survey ${survey.id}:`, error);
  
  // Log error but continue with next survey
  const errorLog = {
    survey_id: survey.id,
    error_message: error.message,
    timestamp: new Date().toISOString()
  };
  
  // Continue to next survey
  return errorLog;
}
```

## Testing the Workflow

### Manual Trigger Test
1. Create a test survey with expired date
2. Add some test responses
3. Manually trigger the Bolt workflow
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