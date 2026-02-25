import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InstantReportRequest {
  sessionId: string;
}

interface FeedbackResponse {
  responses: number[];
  comment?: string;
  submitted_at: string;
}

interface FeedbackSession {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  scale_type: 'likert_5' | 'likert_7';
  response_count: number;
  created_at: string;
  expires_at: string;
  manager_name: string;
  manager_email: string;
}

const generateHTMLReport = (session: FeedbackSession, responses: FeedbackResponse[]): string => {
  const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;
  
  // Process analytics
  const questionCount = session.questions.length;
  const question_averages: number[] = [];
  const question_medians: number[] = [];
  const response_distribution: number[][] = [];
  const comments: string[] = [];
  
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
      response_distribution.push(distribution);
    } else {
      question_averages.push(0);
      question_medians.push(0);
      response_distribution.push(new Array(scaleMax).fill(0));
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
  
  const strongest_area = session.questions[maxIndex] || 'N/A';
  const strongest_score = question_averages[maxIndex] || 0;
  const weakest_area = session.questions[minIndex] || 'N/A';
  const weakest_score = question_averages[minIndex] || 0;
  
  // Generate questions HTML
  const questionsHTML = session.questions.map((question, index) => {
    const average = question_averages[index] || 0;
    const median = question_medians[index] || 0;
    const distribution = response_distribution[index] || [];
    
    const distributionHTML = distribution.map((count, i) => 
      `${i + 1}⭐ ${count}`
    ).join(' | ');
    
    return `
      <div class="question-block">
        <h3>${index + 1}. ${question}</h3>
        
        <div class="question-stats">
          <div class="stat-item">
            <div class="stat-label">Average Score</div>
            <div class="stat-value">${average.toFixed(2)}/${scaleMax}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Median Score</div>
            <div class="stat-value">${median.toFixed(1)}</div>
          </div>
        </div>
        
        <div class="distribution">
          ${distribution.map((count, i) => `
          <div class="distribution-item">
            <div class="distribution-value">${count}</div>
            <div class="distribution-label">${i + 1}⭐</div>
          </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  // Generate comments HTML
  const commentsHTML = comments.map(comment => `
    <div class="comment">${comment}</div>
  `).join('');
  
  // Generate recommendations based on score
  let recommendations = '';
  let performanceCategory = 'needs_improvement';
  
  if (overallPercentage >= 80) {
    performanceCategory = 'excellent';
    recommendations = `
      <p><strong>🌟 Outstanding Leadership Performance!</strong></p>
      <p>You're performing at an exceptional level. Your team clearly sees you as an effective leader. Consider these next steps:</p>
      <ul>
        <li><strong>Mentor emerging leaders</strong> - Share your successful practices with other managers</li>
        <li><strong>Lead by example</strong> - Continue modeling the leadership behaviors your team values</li>
        <li><strong>Expand your influence</strong> - Consider taking on broader leadership responsibilities</li>
        <li><strong>Stay connected</strong> - Maintain regular feedback loops to sustain this high performance</li>
      </ul>
    `;
  } else if (overallPercentage >= 60) {
    performanceCategory = 'good';
    recommendations = `
      <p><strong>💪 Strong Leadership Foundation</strong></p>
      <p>You have solid leadership skills with room for targeted improvement. Focus on:</p>
      <ul>
        <li><strong>Target your development area:</strong> Pay special attention to "${weakest_area}"</li>
        <li><strong>Build on your strengths:</strong> Leverage your success in "${strongest_area}"</li>
        <li><strong>Seek specific feedback</strong> - Have follow-up conversations with your team about improvement areas</li>
        <li><strong>Practice consistently</strong> - Focus on daily habits that reinforce good leadership behaviors</li>
      </ul>
    `;
  } else if (overallPercentage >= 40) {
    performanceCategory = 'fair';
    recommendations = `
      <p><strong>📈 Growth Opportunity Identified</strong></p>
      <p>There are clear areas where focused development will make a significant impact:</p>
      <ul>
        <li><strong>Priority focus:</strong> Concentrate on improving "${weakest_area}"</li>
        <li><strong>Leadership coaching</strong> - Consider working with a leadership coach for targeted development</li>
        <li><strong>Skill building</strong> - Invest in specific leadership training programs</li>
        <li><strong>Regular check-ins</strong> - Schedule monthly feedback sessions with your team</li>
      </ul>
    `;
  } else {
    recommendations = `
      <p><strong>🎯 Significant Development Needed</strong></p>
      <p>This feedback indicates important areas requiring immediate attention:</p>
      <ul>
        <li><strong>Structured leadership coaching</strong> - We strongly recommend professional leadership development</li>
        <li><strong>Focus on core behaviors</strong> - Clarity, accountability, and consistent feedback</li>
        <li><strong>Team relationship building</strong> - Invest time in understanding your team's needs and perspectives</li>
        <li><strong>Regular progress reviews</strong> - Implement weekly one-on-ones and monthly team feedback sessions</li>
      </ul>
    `;
  }
  
  return `
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

    .instant-banner {
      background: #ff9800;
      color: white;
      text-align: center;
      padding: 15px;
      margin: -40px -40px 40px -40px;
      font-weight: bold;
      font-size: 1.2em;
    }

    @media print {
      body { margin: 20px; }
      .section { page-break-inside: avoid; }
      .question-block { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

  <div class="instant-banner">
    ⚡ INSTANT REPORT - Generated Immediately Upon Response Submission
  </div>

  <div class="header">
    <h1>Leadership Feedback Report</h1>
    <p>Generated by Cultivated HQ</p>
  </div>

  <div class="section">
    <h2>Survey Overview</h2>
    <div class="box">
      <p><strong>Manager Name:</strong> ${session.manager_name}</p>
      <p><strong>Survey Title:</strong> ${session.title}</p>
      <p><strong>Survey Period:</strong> ${new Date(session.created_at).toLocaleDateString()} to ${new Date(session.expires_at).toLocaleDateString()}</p>
      <p><strong>Total Responses:</strong> ${responses.length}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to ${scaleMax} = Strongly Agree</p>
      ${session.description ? `<p><strong>Description:</strong> ${session.description}</p>` : ''}
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="highlight-box">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${overallPercentage}%</div>
          <div class="metric-label">Overall Leadership Score</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${responses.length}</div>
          <div class="metric-label">Team Responses</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${comments.length}</div>
          <div class="metric-label">Anonymous Comments</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${strongest_score.toFixed(1)}</div>
          <div class="metric-label">Highest Question Score</div>
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <p><strong>🎯 Strongest Area:</strong> ${strongest_area} (${strongest_score.toFixed(2)}/${scaleMax})</p>
        <p><strong>📈 Development Opportunity:</strong> ${weakest_area} (${weakest_score.toFixed(2)}/${scaleMax})</p>
        <p><strong>📊 Performance Category:</strong> ${performanceCategory}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Detailed Question Results</h2>
    ${questionsHTML}
  </div>

  ${comments.length > 0 ? `
  <div class="section">
    <h2>Anonymous Comments</h2>
    <p style="margin-bottom: 25px; color: #666; font-style: italic;">
      Your team shared these anonymous insights to help with your leadership development:
    </p>
    ${commentsHTML}
  </div>
  ` : ''}

  <div class="section">
    <h2>Development Recommendations</h2>
    <div class="recommendations performance-${performanceCategory}">
      <h3>Personalized Leadership Development Plan</h3>
      
      ${recommendations}
      
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
    <p><strong>Generated on ${new Date().toLocaleDateString()} | Cultivated HQ</strong></p>
    <p>For questions about this report or leadership development support, contact: <strong>chloe@cultivatedhq.com.au</strong></p>
    <p style="margin-top: 15px; font-size: 0.8em;">
      This report contains confidential leadership feedback. Please handle with appropriate discretion.
    </p>
  </div>

</body>
</html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const pdfcoApiKey = Deno.env.get('PDFCO_API_KEY') || 'cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { sessionId }: InstantReportRequest = await req.json()

    console.log('⚡ Generating instant report for session:', sessionId)

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('feedback_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      throw new Error(`Session not found: ${sessionError?.message}`)
    }

    // Get responses
    const { data: responses, error: responsesError } = await supabase
      .from('feedback_responses')
      .select('responses, comment, submitted_at')
      .eq('session_id', sessionId)
      .order('submitted_at', { ascending: true })

    if (responsesError) {
      throw new Error(`Failed to fetch responses: ${responsesError.message}`)
    }

    if (!responses || responses.length === 0) {
      console.log('📭 No responses found for session:', sessionId)
      
      // Send no-response notification
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'session_complete_no_responses',
          session: session,
          email: session.manager_email,
          manager_name: session.manager_name
        }
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: 'No responses found, notification sent',
          session_id: sessionId,
          response_count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`📊 Processing ${responses.length} responses for instant report`)

    // Generate HTML report
    const htmlContent = generateHTMLReport(session, responses)

    console.log('📄 HTML report generated, calling PDF.co...')

    // Generate PDF using PDF.co
    const pdfResponse = await fetch('https://api.pdf.co/v1/pdf/convert/from/html', {
      method: 'POST',
      headers: {
        'x-api-key': pdfcoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: htmlContent,
        name: `Leadership-Report-${session.manager_name.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.pdf`,
        async: false,
        margins: '20px',
        paperSize: 'A4',
        orientation: 'Portrait',
        printBackground: true,
        mediaType: 'print'
      })
    })

    const pdfResult = await pdfResponse.json()

    if (!pdfResponse.ok) {
      throw new Error(`PDF.co error: ${pdfResult.message || 'Unknown error'}`)
    }

    console.log('✅ PDF generated successfully:', pdfResult.url)

    // Send email notification with PDF
    await supabase.functions.invoke('send-notification', {
      body: {
        type: 'session_complete',
        session: session,
        responses: responses,
        email: session.manager_email,
        manager_name: session.manager_name,
        pdf_url: pdfResult.url
      }
    })

    // Mark session as processed
    await supabase
      .from('feedback_sessions')
      .update({
        is_active: false,
        report_generated: true,
        report_sent: true,
        report_sent_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    console.log('📧 Report email sent and session marked as processed')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Instant report generated and sent successfully',
        session_id: sessionId,
        response_count: responses.length,
        pdf_url: pdfResult.url,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('💥 Error generating instant report:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})