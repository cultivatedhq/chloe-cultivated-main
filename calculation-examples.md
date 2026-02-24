# 🔗 Bolt Webhook Setup for SurveyTest Instant Processing

## 🎯 **Overview**
This setup creates a real-time webhook trigger in Bolt that automatically processes survey responses the moment they're submitted to the `/surveytest` system.

---

## 🔧 **Step 1: Create Supabase Webhook Trigger in Bolt**

### **1.1 Open Bolt and Create New Flow**
1. Go to your Bolt dashboard
2. Click **"Create New Workflow"**
3. Name it: **"SurveyTest Instant Processing"**
4. Description: **"Real-time processing of survey responses with instant PDF generation"**

### **1.2 Add Supabase Webhook Trigger**
1. Click **"+ Add Step"** at the top of your flow
2. Choose **"Trigger"** → **"Supabase Webhook"**
3. Configure the trigger:
   - **Database:** Select your Supabase project
   - **Table:** `feedback_responses`
   - **Event:** `INSERT`
   - **Name:** "New Survey Response Submitted"

### **1.3 Webhook Configuration**
```json
{
  "table": "feedback_responses",
  "event": "INSERT",
  "schema": "public",
  "filter": null,
  "columns": ["id", "session_id", "responses", "comment", "submitted_at"]
}
```

---

## 🔧 **Step 2: Add Session Validation Block**

### **2.1 Get Session Details**
**Block Type:** Supabase SQL Query
**Name:** "Get Session Details"
**Query:**
```sql
SELECT 
  id,
  title,
  manager_name,
  manager_email,
  questions,
  scale_type,
  expires_at,
  is_active,
  response_count
FROM feedback_sessions 
WHERE id = '{{ trigger.session_id }}';
```
**Output Variable:** `session`

### **2.2 Check if SurveyTest Session**
**Block Type:** Conditional Logic
**Name:** "Check if SurveyTest Session"
**Condition:** `{{ session.expires_at <= new Date(Date.now() + 20 * 60 * 1000).toISOString() }}`
**Description:** Only process sessions that expire within 20 minutes (SurveyTest sessions)

---

## 🔧 **Step 3: Instant Report Generation (TRUE Branch)**

### **3.1 Get All Session Responses**
**Block Type:** Supabase SQL Query
**Name:** "Get All Session Responses"
**Query:**
```sql
SELECT 
  responses,
  comment,
  submitted_at
FROM feedback_responses 
WHERE session_id = '{{ session.id }}'
ORDER BY submitted_at ASC;
```
**Output Variable:** `all_responses`

### **3.2 Process Survey Data**
**Block Type:** Logic/JavaScript
**Name:** "Process Survey Data for Report"
**Code:**
```javascript
try {
  console.log('🔄 Processing SurveyTest data for instant report...');
  
  const session = {{ session }};
  const responses = {{ all_responses }};
  
  if (!responses || responses.length === 0) {
    console.log('❌ No responses found for session:', session.id);
    return { error: 'No responses found' };
  }
  
  const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;
  const questionCount = session.questions.length;
  
  // Process analytics
  const question_averages = [];
  const question_medians = [];
  const response_distributions = [];
  const comments = [];
  
  // Process each question
  for (let i = 0; i < questionCount; i++) {
    const questionResponses = responses
      .map(r => r.responses[i])
      .filter(r => r > 0 && r <= scaleMax);
    
    if (questionResponses.length > 0) {
      // Calculate average
      const sum = questionResponses.reduce((acc, val) => acc + val, 0);
      question_averages.push(sum / questionResponses.length);
      
      // Calculate median
      const sorted = [...questionResponses].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      question_medians.push(
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid]
      );
      
      // Calculate distribution
      const distribution = new Array(scaleMax).fill(0);
      questionResponses.forEach(response => {
        distribution[response - 1]++;
      });
      response_distributions.push(distribution);
    } else {
      question_averages.push(0);
      question_medians.push(0);
      response_distributions.push(new Array(scaleMax).fill(0));
    }
  }
  
  // Collect comments
  responses.forEach(response => {
    if (response.comment && response.comment.trim()) {
      comments.push(response.comment.trim());
    }
  });
  
  // Calculate overall metrics
  const validAverages = question_averages.filter(avg => avg > 0);
  const overall_average = validAverages.length > 0 
    ? validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length 
    : 0;
  
  const overallPercentage = Math.round((overall_average / scaleMax) * 100);
  
  // Find strongest and weakest areas
  const maxIndex = question_averages.indexOf(Math.max(...question_averages));
  const minIndex = question_averages.indexOf(Math.min(...validAverages));
  
  const reportData = {
    session: {
      ...session,
      scale_max: scaleMax
    },
    analytics: {
      total_responses: responses.length,
      question_averages,
      question_medians,
      response_distributions,
      overall_average,
      overall_percentage,
      strongest_area: session.questions[maxIndex] || 'N/A',
      strongest_score: question_averages[maxIndex] || 0,
      weakest_area: session.questions[minIndex] || 'N/A',
      weakest_score: question_averages[minIndex] || 0,
      comments,
      comment_count: comments.length,
      performance_category: overallPercentage >= 80 ? 'excellent' : 
                           overallPercentage >= 60 ? 'good' : 
                           overallPercentage >= 40 ? 'fair' : 'needs_improvement'
    },
    processed_at: new Date().toISOString()
  };
  
  console.log('✅ SurveyTest data processed successfully');
  return reportData;
  
} catch (error) {
  console.error('❌ Error processing SurveyTest data:', error);
  return { error: error.message };
}
```
**Output Variable:** `reportData`

### **3.3 Generate HTML Report**
**Block Type:** Set Variable
**Variable Name:** `html_report`
**Value:** (Use the complete HTML template from the previous setup)

### **3.4 Generate PDF with PDF.co**
**Block Type:** HTTP Request
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
  "html": "{{ html_report }}",
  "name": "SurveyTest-Report-{{ reportData.session.manager_name }}-{{ new Date().toISOString().split('T')[0] }}.pdf",
  "async": false,
  "margins": "20px",
  "paperSize": "A4",
  "orientation": "Portrait",
  "printBackground": true,
  "mediaType": "print"
}
```
**Output Variable:** `pdf_result`

### **3.5 Send Instant Email Notification**
**Block Type:** Email
**To:** `{{ reportData.session.manager_email }}`
**CC:** `chloe@cultivatedhq.com.au`
**Subject:** `⚡ INSTANT Report Ready: {{ reportData.session.title }}`
**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #ff9800; color: white; text-align: center; padding: 15px; margin-bottom: 20px; font-weight: bold; font-size: 1.2em;">
    ⚡ INSTANT REPORT - Generated Immediately Upon Response Submission
  </div>
  
  <h2 style="color: #2a9d8f;">Your SurveyTest Report is Ready!</h2>
  <p>Hi {{ reportData.session.manager_name }},</p>
  <p>Your survey response has been processed instantly and your comprehensive report is ready for download! 🚀</p>
  
  <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
    <h3 style="margin-top: 0;">📊 Instant Results Summary:</h3>
    <ul>
      <li><strong>Total Responses:</strong> {{ reportData.analytics.total_responses }}</li>
      <li><strong>Overall Leadership Score:</strong> {{ reportData.analytics.overall_percentage }}%</li>
      <li><strong>Processing Time:</strong> Instant (under 30 seconds)</li>
      <li><strong>Anonymous Comments:</strong> {{ reportData.analytics.comment_count }}</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ pdf_result.url }}" style="background: #ff9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">⚡ Download Instant Report</a>
  </div>

  <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ff9800;">
    <h3 style="margin-top: 0; color: #856404;">🧪 SurveyTest Features:</h3>
    <ul>
      <li>✅ Instant processing (no waiting)</li>
      <li>✅ Real-time PDF generation</li>
      <li>✅ Immediate email delivery</li>
      <li>✅ Professional analytics and insights</li>
      <li>✅ Complete anonymity for respondents</li>
    </ul>
  </div>
  
  <p>This demonstrates the power of automated feedback processing - from response submission to professional report delivery in seconds!</p>
  
  <p>Best regards,<br>
  <strong>Chloe James</strong><br>
  Cultivated HQ - SurveyTest System<br>
  <a href="mailto:chloe@cultivatedhq.com.au" style="color: #2a9d8f;">chloe@cultivatedhq.com.au</a></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666;">
    This is an instant report generated by the SurveyTest system.<br>
    Processing time: Under 30 seconds from response submission to email delivery.
  </p>
</div>
```

### **3.6 Mark Session as Processed**
**Block Type:** Supabase SQL Query
**Name:** "Mark Session as Processed"
**Query:**
```sql
UPDATE feedback_sessions 
SET 
  is_active = false,
  report_generated = true,
  report_sent = true,
  report_sent_at = NOW(),
  updated_at = NOW()
WHERE id = '{{ session.id }}';
```

### **3.7 Log Success**
**Block Type:** Logic/JavaScript
**Name:** "Log Instant Processing Success"
**Code:**
```javascript
console.log('⚡ INSTANT PROCESSING COMPLETE');
console.log('📊 Survey:', reportData.session.title);
console.log('👤 Manager:', reportData.session.manager_name);
console.log('📧 Email:', reportData.session.manager_email);
console.log('📈 Responses:', reportData.analytics.total_responses);
console.log('🎯 Score:', reportData.analytics.overall_percentage + '%');
console.log('📄 PDF:', pdf_result.url);
console.log('⏰ Processed at:', new Date().toISOString());

return {
  success: true,
  session_id: reportData.session.id,
  processing_type: 'instant',
  response_count: reportData.analytics.total_responses,
  overall_score: reportData.analytics.overall_percentage,
  pdf_url: pdf_result.url,
  processed_at: new Date().toISOString()
};
```

---

## 🔧 **Step 4: Regular Survey Handling (FALSE Branch)**

### **4.1 Log Regular Survey**
**Block Type:** Logic/JavaScript
**Name:** "Log Regular Survey Response"
**Code:**
```javascript
console.log('📝 Regular survey response received');
console.log('📊 Session:', session.title);
console.log('⏰ Expires:', session.expires_at);
console.log('🔄 Will be processed by scheduled workflow');

return {
  success: true,
  session_id: session.id,
  processing_type: 'scheduled',
  expires_at: session.expires_at,
  message: 'Will be processed by scheduled workflow when expired'
};
```

---

## 🧪 **Step 5: Testing the Webhook**

### **5.1 Test Connection**
1. Save your Bolt workflow
2. Go to `/surveytest/create` and create a test survey
3. Submit a response to the survey
4. Check Bolt → Your workflow → "Runs" tab
5. You should see a new run within 30 seconds

### **5.2 Verify Results**
- Check that the PDF was generated
- Verify email delivery
- Confirm database updates
- Review processing logs

### **5.3 Expected Timeline**
- **Response submission:** 0 seconds
- **Webhook trigger:** 1-3 seconds
- **Data processing:** 5-10 seconds
- **PDF generation:** 10-15 seconds
- **Email delivery:** 15-25 seconds
- **Total time:** Under 30 seconds

---

## 🔍 **Step 6: Monitoring and Troubleshooting**

### **6.1 Webhook Debugging**
If the webhook isn't triggering:
1. Check Supabase → Database → Webhooks
2. Verify the webhook URL is correct
3. Test with a manual database insert
4. Check Bolt logs for errors

### **6.2 Common Issues**
- **No webhook triggers:** Check Supabase webhook configuration
- **PDF generation fails:** Verify PDF.co API key
- **Email not sending:** Check email service configuration
- **Data processing errors:** Review JavaScript logic

### **6.3 Success Indicators**
- ✅ Webhook triggers within 3 seconds
- ✅ PDF generated successfully
- ✅ Email delivered to manager
- ✅ Database updated correctly
- ✅ Complete process under 30 seconds

---

## 🎯 **Expected Outcome**

Once set up, your SurveyTest system will:

1. **Instantly detect** new survey responses via webhook
2. **Immediately process** the data and generate analytics
3. **Create professional PDFs** in real-time
4. **Send email notifications** within seconds
5. **Update the database** to mark completion
6. **Provide instant gratification** to users

This creates a **true instant feedback system** that demonstrates the power of automated processing and real-time report generation!

---

## 📞 **Support**

If you encounter issues:
1. Check Bolt workflow logs first
2. Verify Supabase webhook configuration
3. Test PDF.co API connectivity
4. Review email service settings
5. Contact support if needed

**Remember:** This webhook system processes SurveyTest responses instantly while leaving regular PulseCheck surveys to be processed by the scheduled workflow!