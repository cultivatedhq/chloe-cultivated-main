# Bolt Workflow Setup Guide

## 🔄 Complete Bolt Flow Configuration

### **Step 1: Trigger Setup**
```
Trigger Type: Scheduled
Schedule: Daily at 8:00 AM
Name: "Process Expired Surveys"
```

### **Step 2: Get Expired Surveys**
**Block Type:** Supabase SQL Query
```sql
SELECT * FROM session_expiration_status 
WHERE status = 'expired_pending'
ORDER BY expires_at ASC;
```
**Output Variable:** `surveys`

### **Step 3: For Each Survey Loop**
**Block Type:** For Each
**Input:** `surveys`
**Alias:** `survey`

---

## 🔄 Inside the Loop - Process Each Survey

### **Step 4: Get Complete Survey Analysis**
**Block Type:** Supabase SQL Query
```sql
SELECT * FROM get_complete_survey_analysis('{{ survey.id }}');
```
**Output Variable:** `analysis`

### **Step 5: Extract Data for Template**
**Block Type:** Logic/JavaScript
```javascript
// Extract and format data from the analysis
const sessionData = analysis[0].session_data;
const responseCount = analysis[0].response_count;
const questionAnalytics = analysis[0].question_analytics;
const overallMetrics = analysis[0].overall_metrics;
const commentsData = analysis[0].comments_data;

// Calculate scale max
const scaleMax = sessionData.scale_type === 'likert_7' ? 7 : 5;

// Process question analytics
const questionAverages = questionAnalytics.map(q => q.average_score);
const questionMedians = questionAnalytics.map(q => q.median_score);
const responseDistributions = questionAnalytics.map(q => {
  const dist = q.distribution;
  const result = [];
  for (let i = 1; i <= scaleMax; i++) {
    result.push(dist[i.toString()] || 0);
  }
  return result;
});

// Extract comments
const comments = commentsData.map(c => c.comment);

// Calculate overall percentage
const overallPercentage = Math.round((overallMetrics.overall_average / scaleMax) * 100);

// Get strongest and weakest areas
const strongestArea = sessionData.questions[overallMetrics.strongest_question_index] || 'N/A';
const weakestArea = sessionData.questions[overallMetrics.weakest_question_index] || 'N/A';

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
    overall_average: overallMetrics.overall_average,
    overall_percentage: overallPercentage,
    strongest_area: strongestArea,
    strongest_score: overallMetrics.strongest_score,
    weakest_area: weakestArea,
    weakest_score: overallMetrics.weakest_score,
    comments: comments,
    comment_count: comments.length,
    performance_category: overallMetrics.performance_category
  },
  processed_at: new Date().toISOString()
};

return templateData;
```
**Output Variable:** `templateData`

### **Step 6: Build Report HTML**
**Block Type:** Set Variable
**Variable Name:** `report_html`
**Value:** 
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leadership Feedback Report</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 40px;
      color: #333;
      line-height: 1.6;
      background-color: #ffffff;
    }

    h1, h2, h3 {
      color: #00695C;
      margin-top: 0;
    }

    .header {
      text-align: center;
      border-bottom: 3px solid #00695C;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .section {
      margin-bottom: 50px;
      page-break-inside: avoid;
    }

    .section h2 {
      font-size: 1.8em;
      margin-bottom: 20px;
      border-left: 4px solid #00695C;
      padding-left: 15px;
    }

    .box {
      border: 1px solid #ddd;
      padding: 25px;
      margin-top: 15px;
      border-radius: 12px;
      background-color: #f9f9f9;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .highlight-box {
      background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%);
      border: 2px solid #00695C;
      padding: 30px;
      border-radius: 15px;
      margin: 25px 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .metric-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .metric-value {
      font-size: 2.5em;
      font-weight: bold;
      color: #00695C;
      margin-bottom: 5px;
    }

    .metric-label {
      font-size: 0.9em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .question-block {
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 10px;
      border-left: 4px solid #00695C;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .question-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 15px;
    }

    .stat-item {
      background: #f5f5f5;
      padding: 10px 15px;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 1.1em;
      font-weight: bold;
      color: #00695C;
    }

    .distribution {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .distribution-item {
      text-align: center;
      flex: 1;
    }

    .distribution-value {
      font-weight: bold;
      font-size: 1.1em;
      color: #00695C;
    }

    .comment {
      background-color: #e8f5e8;
      border-left: 4px solid #4caf50;
      padding: 15px 20px;
      margin-bottom: 15px;
      border-radius: 8px;
      font-style: italic;
    }

    .recommendations {
      background: linear-gradient(135deg, #fff3e0 0%, #f3e5f5 100%);
      border: 2px solid #ff9800;
      padding: 25px;
      border-radius: 15px;
      margin: 20px 0;
    }

    .footer {
      text-align: center;
      border-top: 2px solid #00695C;
      padding-top: 20px;
      margin-top: 50px;
      font-size: 0.9em;
      color: #666;
    }
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
      <p><strong>Manager Name:</strong> {{ templateData.survey.manager_name }}</p>
      <p><strong>Survey Title:</strong> {{ templateData.survey.title }}</p>
      <p><strong>Survey Period:</strong> {{ new Date(templateData.survey.created_at).toLocaleDateString() }} to {{ new Date(templateData.survey.expires_at).toLocaleDateString() }}</p>
      <p><strong>Total Responses:</strong> {{ templateData.analytics.total_responses }}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to {{ templateData.survey.scale_max }} = Strongly Agree</p>
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="highlight-box">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">{{ templateData.analytics.overall_percentage }}%</div>
          <div class="metric-label">Overall Leadership Score</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ templateData.analytics.total_responses }}</div>
          <div class="metric-label">Team Responses</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ templateData.analytics.comment_count }}</div>
          <div class="metric-label">Anonymous Comments</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ templateData.analytics.strongest_score.toFixed(1) }}</div>
          <div class="metric-label">Highest Question Score</div>
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <p><strong>🎯 Strongest Area:</strong> {{ templateData.analytics.strongest_area }} ({{ templateData.analytics.strongest_score.toFixed(2) }}/{{ templateData.survey.scale_max }})</p>
        <p><strong>📈 Development Opportunity:</strong> {{ templateData.analytics.weakest_area }} ({{ templateData.analytics.weakest_score.toFixed(2) }}/{{ templateData.survey.scale_max }})</p>
        <p><strong>📊 Performance Category:</strong> {{ templateData.analytics.performance_category }}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Detailed Question Results</h2>
    {{ templateData.survey.questions.map((question, index) => `
    <div class="question-block">
      <h3>${index + 1}. ${question}</h3>
      
      <div class="question-stats">
        <div class="stat-item">
          <div class="stat-label">Average Score</div>
          <div class="stat-value">${templateData.analytics.question_averages[index]?.toFixed(2) || 'N/A'}/${templateData.survey.scale_max}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Median Score</div>
          <div class="stat-value">${templateData.analytics.question_medians[index]?.toFixed(1) || 'N/A'}</div>
        </div>
      </div>
      
      <div class="distribution">
        ${templateData.analytics.response_distributions[index]?.map((count, i) => `
        <div class="distribution-item">
          <div class="distribution-value">${count}</div>
          <div class="distribution-label">${i + 1}⭐</div>
        </div>
        `).join('') || ''}
      </div>
    </div>
    `).join('') }}
  </div>

  ${ templateData.analytics.comments.length > 0 ? `
  <div class="section">
    <h2>Anonymous Comments</h2>
    <p style="margin-bottom: 25px; color: #666; font-style: italic;">
      Your team shared these anonymous insights to help with your leadership development:
    </p>
    ${templateData.analytics.comments.map(comment => `
    <div class="comment">
      ${comment}
    </div>
    `).join('')}
  </div>
  ` : '' }

  <div class="section">
    <h2>Development Recommendations</h2>
    <div class="recommendations">
      <h3>Personalized Leadership Development Plan</h3>
      
      ${ templateData.analytics.performance_category === 'excellent' ? `
      <p><strong>🌟 Outstanding Leadership Performance!</strong></p>
      <p>You're performing at an exceptional level. Your team clearly sees you as an effective leader. Consider these next steps:</p>
      <ul>
        <li><strong>Mentor emerging leaders</strong> - Share your successful practices with other managers</li>
        <li><strong>Lead by example</strong> - Continue modeling the leadership behaviors your team values</li>
        <li><strong>Expand your influence</strong> - Consider taking on broader leadership responsibilities</li>
        <li><strong>Stay connected</strong> - Maintain regular feedback loops to sustain this high performance</li>
      </ul>
      ` : templateData.analytics.performance_category === 'good' ? `
      <p><strong>💪 Strong Leadership Foundation</strong></p>
      <p>You have solid leadership skills with room for targeted improvement. Focus on:</p>
      <ul>
        <li><strong>Target your development area:</strong> Pay special attention to "${templateData.analytics.weakest_area}"</li>
        <li><strong>Build on your strengths:</strong> Leverage your success in "${templateData.analytics.strongest_area}"</li>
        <li><strong>Seek specific feedback</strong> - Have follow-up conversations with your team about improvement areas</li>
        <li><strong>Practice consistently</strong> - Focus on daily habits that reinforce good leadership behaviors</li>
      </ul>
      ` : templateData.analytics.performance_category === 'fair' ? `
      <p><strong>📈 Growth Opportunity Identified</strong></p>
      <p>There are clear areas where focused development will make a significant impact:</p>
      <ul>
        <li><strong>Priority focus:</strong> Concentrate on improving "${templateData.analytics.weakest_area}"</li>
        <li><strong>Leadership coaching</strong> - Consider working with a leadership coach for targeted development</li>
        <li><strong>Skill building</strong> - Invest in specific leadership training programs</li>
        <li><strong>Regular check-ins</strong> - Schedule monthly feedback sessions with your team</li>
      </ul>
      ` : `
      <p><strong>🎯 Significant Development Needed</strong></p>
      <p>This feedback indicates important areas requiring immediate attention:</p>
      <ul>
        <li><strong>Structured leadership coaching</strong> - We strongly recommend professional leadership development</li>
        <li><strong>Focus on core behaviors</strong> - Clarity, accountability, and consistent feedback</li>
        <li><strong>Team relationship building</strong> - Invest time in understanding your team's needs and perspectives</li>
        <li><strong>Regular progress reviews</strong> - Implement weekly one-on-ones and monthly team feedback sessions</li>
      </ul>
      ` }
      
      <div style="margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.7); border-radius: 10px;">
        <h4 style="margin-top: 0; color: #00695C;">Next Steps:</h4>
        <ol>
          <li><strong>Reflect on this feedback</strong> - Take time to process these insights</li>
          <li><strong>Have follow-up conversations</strong> - Thank your team and ask clarifying questions</li>
          <li><strong>Create an action plan</strong> - Choose 2-3 specific areas to focus on</li>
          <li><strong>Schedule regular check-ins</strong> - Plan follow-up feedback sessions in 3-6 months</li>
          <li><strong>Consider professional support</strong> - Explore coaching or training opportunities</li>
        </ol>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Generated on ${new Date(templateData.processed_at).toLocaleDateString()} | Cultivated HQ</strong></p>
    <p>For questions about this report or leadership development support, contact: <strong>chloe@cultivatedhq.com.au</strong></p>
  </div>

</body>
</html>
```

### **Step 7: Generate PDF with PDF.co**
**Block Type:** HTTP Request
**Method:** POST
**URL:** `https://api.pdf.co/v1/pdf/convert/from/html`
**Headers:**
```json
{
  "x-api-key": "YOUR_PDFCO_API_KEY",
  "Content-Type": "application/json"
}
```
**Body:**
```json
{
  "html": "{{ report_html }}",
  "name": "Leadership-Report-{{ templateData.survey.manager_name }}.pdf",
  "async": false,
  "margins": "20px",
  "paperSize": "A4",
  "orientation": "Portrait"
}
```
**Output Variable:** `pdf_response`

### **Step 8: Send Email with PDF Report**
**Block Type:** Email
**To:** `{{ templateData.survey.manager_email }}`
**CC:** `chloe@cultivatedhq.com.au`
**Subject:** `Your Leadership Feedback Report is Ready: {{ templateData.survey.title }}`
**Body:**
```
Hi {{ templateData.survey.manager_name }},

Your team's leadership feedback report is now ready! 

📊 **Survey Summary:**
- Total Responses: {{ templateData.analytics.total_responses }}
- Overall Leadership Score: {{ templateData.analytics.overall_percentage }}%
- Survey Period: {{ new Date(templateData.survey.created_at).toLocaleDateString() }} - {{ new Date(templateData.survey.expires_at).toLocaleDateString() }}

📄 **Download your comprehensive report here:**
{{ pdf_response.url }}

**Your Report Includes:**
✅ Statistical analysis of all responses
✅ Visual performance metrics  
✅ Anonymous comments from your team
✅ Personalized development recommendations
✅ Strengths and growth opportunities

**Next Steps:**
1. Review your detailed feedback report
2. Identify key development areas
3. Consider scheduling follow-up conversations with your team
4. Create an action plan for improvement

If you have any questions about your results or would like support creating a development plan, I'm here to help.

Thank you for investing in your leadership development!

Best regards,
**Chloe James**
Cultivated HQ
chloe@cultivatedhq.com.au

---
*This report contains confidential leadership feedback. Please handle with appropriate discretion.*
```

### **Step 9: Mark Survey as Processed**
**Block Type:** Supabase SQL Query
```sql
SELECT process_survey_completion('{{ survey.id }}');
```

### **Step 10: Handle No Responses Case**
**Block Type:** Conditional Logic
**Condition:** `{{ templateData.analytics.total_responses }} == 0`

**If True - Send No Responses Email:**
**Block Type:** Email
**To:** `{{ templateData.survey.manager_email }}`
**CC:** `chloe@cultivatedhq.com.au`
**Subject:** `Survey Closed: {{ templateData.survey.title }}`
**Body:**
```
Hi {{ templateData.survey.manager_name }},

Your 3-day feedback survey period has ended.

**Survey Summary:**
- Session: {{ templateData.survey.title }}
- Total Responses: 0
- Status: Closed (No responses received)

**Tips for Future Surveys:**
• Send personal invitations to team members
• Explain the purpose and benefits of the feedback
• Emphasize the anonymous nature of responses
• Follow up with reminders during the 3-day window
• Consider the timing - avoid busy periods

Would you like to create another survey? I'm here to help you gather valuable feedback from your team.

Best regards,
**Chloe James**
Cultivated HQ
```

---

## 🎯 **Complete Bolt Flow Summary**

```
[TRIGGER: Scheduled Daily 8:00 AM]
↓
[SQL: Get expired surveys]
↓
[FOR EACH survey]
  ↓
  [SQL: Get complete analysis]
  ↓
  [Logic: Process data for template]
  ↓
  [Set Variable: Build HTML report]
  ↓
  [HTTP: Generate PDF with PDF.co]
  ↓
  [Conditional: Check if responses > 0]
    ↓ YES                    ↓ NO
    [Email: Send PDF report] [Email: No responses notification]
  ↓
  [SQL: Mark as processed]
```

## 🔧 **Required Setup**

1. **PDF.co Account**: Sign up at pdf.co and get API key
2. **Email Service**: Configure email service in Bolt
3. **Environment Variables**: Set PDF.co API key
4. **Database Functions**: Ensure migration has been applied

This workflow will automatically process expired surveys, generate beautiful PDF reports, and email them to managers daily!