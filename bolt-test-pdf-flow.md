# 🚀 PRODUCTION-READY Bolt Workflow Setup

## 🔑 **API Configuration**
**PDF.co API Key:** `cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR`

---

## 🎯 **COMPLETE BOLT WORKFLOW CONFIGURATION**

### **TRIGGER: Scheduled Daily Processing**
```
Trigger Type: Scheduled
Schedule: 0 8 * * * (Daily at 8:00 AM)
Name: "Process Expired Leadership Surveys"
Description: "Automatically process expired surveys and send PDF reports"
```

---

## 📋 **WORKFLOW BLOCKS (Copy & Paste Ready)**

### **Block 1: Get Expired Surveys**
**Type:** Supabase SQL Query
**Name:** "Get Expired Surveys"
**Query:**
```sql
SELECT * FROM session_expiration_status 
WHERE status = 'expired_pending'
ORDER BY expires_at ASC;
```
**Output Variable:** `surveys`

---

### **Block 2: For Each Survey Loop**
**Type:** For Each
**Name:** "Process Each Survey"
**Input:** `surveys`
**Alias:** `survey`

---

### **Block 3: Get Complete Analysis (Inside Loop)**
**Type:** Supabase SQL Query
**Name:** "Get Complete Survey Analysis"
**Query:**
```sql
SELECT * FROM get_complete_survey_analysis('{{ survey.id }}');
```
**Output Variable:** `analysis`

---

### **Block 4: Process Template Data (Inside Loop)**
**Type:** Logic/JavaScript
**Name:** "Process Data for Template"
**Code:**
```javascript
try {
  // Extract and format data from the analysis
  const analysisData = analysis[0];
  const sessionData = analysisData.session_data;
  const responseCount = analysisData.response_count || 0;
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

  console.log(`✅ Template data prepared for survey: ${templateData.survey.title}`);
  console.log(`📊 Responses: ${templateData.analytics.total_responses}`);
  
  return templateData;
} catch (error) {
  console.error('❌ Error processing template data:', error);
  throw error;
}
```
**Output Variable:** `templateData`

---

### **Block 5: Build Report HTML (Inside Loop)**
**Type:** Set Variable
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

    .stat-label {
      font-size: 0.85em;
      color: #666;
      margin-bottom: 5px;
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

    .distribution-label {
      font-size: 0.8em;
      color: #666;
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

    .recommendations h3 {
      color: #e65100;
      margin-top: 0;
    }

    .performance-excellent {
      background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
      border-color: #4caf50;
    }

    .performance-excellent h3 {
      color: #2e7d32;
    }

    .performance-good {
      background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
      border-color: #2196f3;
    }

    .performance-good h3 {
      color: #1565c0;
    }

    .performance-fair {
      background: linear-gradient(135deg, #fff8e1 0%, #fffde7 100%);
      border-color: #ffc107;
    }

    .performance-fair h3 {
      color: #f57c00;
    }

    .performance-needs-improvement {
      background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
      border-color: #f44336;
    }

    .performance-needs-improvement h3 {
      color: #c62828;
    }

    .footer {
      text-align: center;
      border-top: 2px solid #00695C;
      padding-top: 20px;
      margin-top: 50px;
      font-size: 0.9em;
      color: #666;
    }

    @media print {
      body { margin: 20px; }
      .section { page-break-inside: avoid; }
      .question-block { page-break-inside: avoid; }
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
      {{ templateData.survey.description ? `<p><strong>Description:</strong> ${templateData.survey.description}</p>` : '' }}
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
          <div class="stat-value">${(templateData.analytics.question_averages[index] || 0).toFixed(2)}/${templateData.survey.scale_max}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Median Score</div>
          <div class="stat-value">${(templateData.analytics.question_medians[index] || 0).toFixed(1)}</div>
        </div>
      </div>
      
      <div class="distribution">
        ${(templateData.analytics.response_distributions[index] || []).map((count, i) => `
        <div class="distribution-item">
          <div class="distribution-value">${count}</div>
          <div class="distribution-label">${i + 1}⭐</div>
        </div>
        `).join('')}
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
    <div class="recommendations performance-{{ templateData.analytics.performance_category }}">
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
    <p style="margin-top: 15px; font-size: 0.8em;">
      This report contains confidential leadership feedback. Please handle with appropriate discretion.
    </p>
  </div>

</body>
</html>
```

---

### **Block 6: Check Response Count (Inside Loop)**
**Type:** Conditional Logic
**Name:** "Check if Survey Has Responses"
**Condition:** `{{ templateData.analytics.total_responses > 0 }}`

---

## 📊 **TRUE BRANCH: Survey Has Responses**

### **Block 7A: Generate PDF**
**Type:** HTTP Request
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

---

### **Block 8A: Send Report Email**
**Type:** Email
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

---

## 📭 **FALSE BRANCH: No Responses**

### **Block 7B: Send No Responses Email**
**Type:** Email
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

---

## ✅ **FINAL BLOCKS (Both Branches)**

### **Block 9: Mark Survey as Processed**
**Type:** Supabase SQL Query
**Name:** "Mark Survey as Processed"
**Query:**
```sql
SELECT process_survey_completion('{{ survey.id }}');
```

---

### **Block 10: Log Processing Result**
**Type:** Logic/JavaScript
**Name:** "Log Processing Result"
**Code:**
```javascript
try {
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
} catch (error) {
  console.error(`❌ Error logging result for survey ${templateData.survey.id}:`, error);
  return {
    survey_id: templateData.survey.id,
    status: 'error',
    error: error.message,
    processed_at: new Date().toISOString()
  };
}
```

---

## 🎯 **COMPLETE FLOW DIAGRAM**

```
[TRIGGER: Daily 8:00 AM]
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
  [Conditional: Check responses > 0]
    ↓ YES                           ↓ NO
    [HTTP: Generate PDF]            [Email: No responses notification]
    ↓
    [Email: Send PDF report]
  ↓
  [SQL: Mark as processed]
  ↓
  [Logic: Log result]
```

---

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] **Database migration applied** (20250627082616_patient_bonus.sql)
- [ ] **PDF.co API key configured** (provided above)
- [ ] **Email service configured** in Bolt
- [ ] **All blocks added** in correct order
- [ ] **Conditional logic set up** properly
- [ ] **Error handling included** in all blocks
- [ ] **Test survey created** with past expiration
- [ ] **Manual test run** completed successfully
- [ ] **Monitoring system** in place
- [ ] **Daily schedule activated** (8:00 AM)

---

## 🎉 **EXPECTED RESULTS**

Once deployed, your system will:

✅ **Automatically find expired surveys** every morning at 8:00 AM
✅ **Generate beautiful PDF reports** with professional styling
✅ **Send personalized emails** to managers with their reports
✅ **Handle edge cases** (no responses) gracefully
✅ **Update database** to mark surveys as processed
✅ **Log everything** for monitoring and debugging
✅ **Save you hours** of manual work every week
✅ **Provide exceptional value** to your coaching clients

---

## 🔧 **TESTING INSTRUCTIONS**

1. **Create a test survey** in your admin panel
2. **Set expiration date** to yesterday
3. **Add some test responses**
4. **Run the workflow manually** first
5. **Check PDF generation** and email delivery
6. **Verify database updates**
7. **Review all logs** for errors
8. **Activate daily schedule**

---

## 📞 **SUPPORT & MONITORING**

**Daily Checks:**
- Review Bolt workflow logs
- Verify email delivery
- Check PDF.co usage
- Monitor database performance

**Weekly Reviews:**
- Analyze success rates
- Review error patterns
- Check client feedback
- Optimize performance

Your automated leadership development reporting system is now **READY TO DEPLOY**! 🚀

This will transform your coaching business by providing professional, automated reports that save you time while delivering exceptional value to your clients.