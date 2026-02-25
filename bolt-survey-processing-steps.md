# 🚀 Bolt Deployment Guide - Step by Step

## ✅ **Prerequisites Checklist**

Before starting, ensure you have:
- [x] Supabase project connected to your app
- [x] Database migration applied (20250627082616_patient_bonus.sql)
- [x] PDF.co API key: `cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR`
- [x] Email service configured in Bolt
- [x] Access to Bolt workflow builder

---

## 🔧 **Step 1: Create the Scheduled Trigger**

1. **Open Bolt** and navigate to Workflows
2. **Click "Create New Workflow"**
3. **Set up the trigger:**
   - **Trigger Type:** Scheduled
   - **Schedule:** `0 8 * * *` (Daily at 8:00 AM)
   - **Name:** "Process Expired Leadership Surveys"
   - **Description:** "Automatically process expired surveys and send PDF reports"

---

## 🔧 **Step 2: Add Get Expired Surveys Block**

1. **Add Block:** Supabase SQL Query
2. **Configuration:**
   - **Name:** "Get Expired Surveys"
   - **Query:**
   ```sql
   SELECT * FROM session_expiration_status 
   WHERE status = 'expired_pending'
   ORDER BY expires_at ASC;
   ```
   - **Output Variable:** `surveys`

---

## 🔧 **Step 3: Add For Each Loop**

1. **Add Block:** For Each
2. **Configuration:**
   - **Name:** "Process Each Survey"
   - **Input:** `surveys`
   - **Alias:** `survey`

---

## 🔧 **Step 4: Get Survey Analysis (Inside Loop)**

1. **Add Block:** Supabase SQL Query
2. **Configuration:**
   - **Name:** "Get Complete Survey Analysis"
   - **Query:**
   ```sql
   SELECT * FROM get_complete_survey_analysis('{{ survey.id }}');
   ```
   - **Output Variable:** `analysis`

---

## 🔧 **Step 5: Process Data for Template (Inside Loop)**

1. **Add Block:** Logic/JavaScript
2. **Configuration:**
   - **Name:** "Process Data for Template"
   - **Code:**
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
   - **Output Variable:** `templateData`

---

## 🔧 **Step 6: Build Report HTML (Inside Loop)**

1. **Add Block:** Set Variable
2. **Configuration:**
   - **Variable Name:** `report_html`
   - **Value:** Copy the complete HTML template from `logic/survey-report-html-template.html`

---

## 🔧 **Step 7: Add Conditional Logic (Inside Loop)**

1. **Add Block:** Conditional Logic
2. **Configuration:**
   - **Name:** "Check if Survey Has Responses"
   - **Condition:** `{{ templateData.analytics.total_responses > 0 }}`

---

## 🔧 **Step 8A: Generate PDF (TRUE Branch)**

1. **Add Block:** HTTP Request
2. **Configuration:**
   - **Name:** "Generate PDF with PDF.co"
   - **Method:** POST
   - **URL:** `https://api.pdf.co/v1/pdf/convert/from/html`
   - **Headers:**
   ```json
   {
     "x-api-key": "cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR",
     "Content-Type": "application/json"
   }
   ```
   - **Body:**
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
   - **Output Variable:** `pdf_response`

---

## 🔧 **Step 9A: Send Report Email (TRUE Branch)**

1. **Add Block:** Email
2. **Configuration:**
   - **Name:** "Send PDF Report Email"
   - **To:** `{{ templateData.survey.manager_email }}`
   - **CC:** `chloe@cultivatedhq.com.au`
   - **Subject:** `Your Leadership Feedback Report is Ready: {{ templateData.survey.title }}`
   - **Body:** Copy the HTML email template from the complete setup guide

---

## 🔧 **Step 8B: Send No Responses Email (FALSE Branch)**

1. **Add Block:** Email
2. **Configuration:**
   - **Name:** "Send No Responses Email"
   - **To:** `{{ templateData.survey.manager_email }}`
   - **CC:** `chloe@cultivatedhq.com.au`
   - **Subject:** `Survey Closed: {{ templateData.survey.title }}`
   - **Body:** Copy the no responses email template from the complete setup guide

---

## 🔧 **Step 10: Mark Survey as Processed (Both Branches)**

1. **Add Block:** Supabase SQL Query
2. **Configuration:**
   - **Name:** "Mark Survey as Processed"
   - **Query:**
   ```sql
   SELECT process_survey_completion('{{ survey.id }}');
   ```

---

## 🔧 **Step 11: Log Processing Result (Both Branches)**

1. **Add Block:** Logic/JavaScript
2. **Configuration:**
   - **Name:** "Log Processing Result"
   - **Code:**
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

---

## 🧪 **Step 12: Testing the Workflow**

### **Create a Test Survey:**
1. Go to your Pulse Check admin panel
2. Create a test survey with a past expiration date
3. Add some test responses
4. Manually trigger the workflow or wait for the scheduled run

### **Verify the Results:**
1. Check that the PDF is generated correctly
2. Verify email delivery
3. Confirm database updates
4. Review logs for any errors

---

## 🔍 **Step 13: Monitoring and Maintenance**

### **Daily Monitoring:**
- Check Bolt workflow logs
- Verify email delivery reports
- Monitor PDF.co usage
- Review database function performance

### **Weekly Review:**
- Analyze processing success rates
- Review any error patterns
- Check email bounce rates
- Validate PDF quality

---

## 🚨 **Troubleshooting Common Issues**

### **PDF Generation Fails:**
- Check PDF.co API key is correct
- Verify HTML template syntax
- Check API usage limits
- Review error logs

### **Emails Not Sending:**
- Verify email service configuration
- Check recipient email addresses
- Review spam/bounce reports
- Validate email templates

### **Database Errors:**
- Ensure migration is applied
- Check function permissions
- Verify data integrity
- Review query syntax

---

## ✅ **Deployment Checklist**

- [ ] Scheduled trigger created (8:00 AM daily)
- [ ] All workflow blocks added in correct order
- [ ] PDF.co API key configured
- [ ] Email templates added
- [ ] Conditional logic set up
- [ ] Database functions working
- [ ] Test survey processed successfully
- [ ] Monitoring system in place
- [ ] Error handling configured
- [ ] Documentation updated

---

## 🎉 **Success Metrics**

Once deployed, you should see:
- **Daily automated processing** of expired surveys
- **Professional PDF reports** generated and delivered
- **Email notifications** sent to managers
- **Database updates** marking surveys as processed
- **Comprehensive logging** for monitoring
- **Zero manual intervention** required

Your leadership development platform now has a **fully automated reporting system**! 🚀

---

## 📞 **Support**

If you encounter any issues during deployment:
1. Check the Bolt workflow logs first
2. Verify all configuration settings
3. Test individual blocks separately
4. Review the troubleshooting section above
5. Contact Bolt support if needed

**Remember:** This system will save you hours of manual work every week while providing professional, valuable reports to your coaching clients!