import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReportRequest {
  session_id: string;
}

interface ReportData {
  session: {
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
  };
  responses: Array<{
    responses: number[];
    comment?: string;
    submitted_at: string;
  }>;
}

const generateHTMLReport = (reportData: ReportData): string => {
  const { session, responses } = reportData;
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
        <h3>${question}</h3>
        <p>Average: ${average.toFixed(2)} / Median: ${median.toFixed(1)}</p>
        <p>Responses: ${distributionHTML}</p>
      </div>
    `;
  }).join('');
  
  // Generate comments HTML
  const commentsHTML = comments.map(comment => `
    <div class="comment">${comment}</div>
  `).join('');
  
  // Generate recommendations based on score
  let recommendations = '';
  if (overallPercentage >= 80) {
    recommendations = 'You\'re performing strongly. Consider mentoring emerging leaders and sharing your practices across teams.';
  } else if (overallPercentage >= 60) {
    recommendations = `You have a solid leadership foundation. Target specific areas for refinement, especially around ${weakest_area}.`;
  } else {
    recommendations = 'Improvement needed. We recommend structured leadership coaching focused on core behaviors like clarity, accountability, and feedback.';
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leadership Feedback Report</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 40px;
      color: #333;
      line-height: 1.6;
    }

    h1, h2, h3 {
      color: #00695C; /* Cultivated HQ teal */
    }

    .header, .footer {
      text-align: center;
      border-bottom: 2px solid #00695C;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }

    .section {
      margin-bottom: 40px;
    }

    .box {
      border: 1px solid #ccc;
      padding: 20px;
      margin-top: 10px;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .question-block {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .comment {
      background-color: #e0f2f1;
      border-left: 4px solid #00695C;
      padding: 10px;
      margin-bottom: 10px;
    }

    .footer {
      font-size: 0.8em;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      color: #777;
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
      <p><strong>Manager Name:</strong> ${session.manager_name}</p>
      <p><strong>Survey Period:</strong> ${new Date(session.created_at).toLocaleDateString()} to ${new Date(session.expires_at).toLocaleDateString()}</p>
      <p><strong>Total Responses:</strong> ${responses.length}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to ${scaleMax} = Strongly Agree</p>
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="box">
      <p><strong>Overall Leadership Score:</strong> ${overallPercentage}%</p>
      <p><strong>Strongest Area:</strong> ${strongest_area} (${strongest_score.toFixed(2)})</p>
      <p><strong>Development Opportunity:</strong> ${weakest_area} (${weakest_score.toFixed(2)})</p>
      <p><strong>Anonymous Comments:</strong> ${comments.length}</p>
    </div>
  </div>

  <div class="section">
    <h2>Detailed Results</h2>
    ${questionsHTML}
  </div>

  ${comments.length > 0 ? `
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
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { session_id }: ReportRequest = await req.json()

    console.log('📊 Generating PDF report for session:', session_id)

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('feedback_sessions')
      .select('*')
      .eq('id', session_id)
      .single()

    if (sessionError || !session) {
      throw new Error(`Session not found: ${sessionError?.message}`)
    }

    // Get responses
    const { data: responses, error: responsesError } = await supabase
      .from('feedback_responses')
      .select('responses, comment, submitted_at')
      .eq('session_id', session_id)
      .order('submitted_at', { ascending: true })

    if (responsesError) {
      throw new Error(`Failed to fetch responses: ${responsesError.message}`)
    }

    const reportData: ReportData = {
      session,
      responses: responses || []
    }

    // Generate HTML report
    const htmlContent = generateHTMLReport(reportData)

    console.log('✅ PDF report generated successfully for session:', session_id)

    return new Response(
      JSON.stringify({
        success: true,
        html: htmlContent,
        session_id,
        response_count: responses?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('💥 Error generating PDF report:', error)
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