import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuditResult {
  id: string;
  email: string;
  name?: string;
  answers: Record<number, number>;
  category_scores: Record<string, number>;
  total_score: number;
  lowest_category: string;
  highest_category: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const pdfcoApiKey = "cbjames674@gmail.com_C8Qxi0EeYZPsuFleKhRErEynYQ12d16f2TttcgYaMpKOtP3aHlBHTNvG64EynWbR";
    const sendgridApiKey = "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";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request data
    const { email, sessionId } = await req.json();

    if (!email && !sessionId) {
      throw new Error("Either email or sessionId is required");
    }

    console.log(`🔍 Processing clarity audit report for: ${email || `session ${sessionId}`}`);

    // Get the audit result
    let auditResult;
    let auditError;
    
    if (sessionId) {
      // If sessionId is provided, use it to find the audit result
      const { data, error } = await supabase
        .from("clarity_audit_results")
        .select("*")
        .eq("id", sessionId)
        .single();
      
      auditResult = data;
      auditError = error;
    } else {
      // Otherwise, use email to find the most recent audit result
      const { data, error } = await supabase
        .from("clarity_audit_results")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      auditResult = data;
      auditError = error;
    }

    if (auditError || !auditResult) {
      throw new Error(`Failed to fetch audit result: ${auditError?.message || "No results found"}`);
    }

    console.log(`📊 Found audit result for ${auditResult.email}, generating report...`);

    // Generate HTML report
    const htmlReport = generateHTMLReport(auditResult);

    // Send email with HTML content (no PDF generation)
    const emailSubject = "Your Leadership Clarity Audit Results";
    const emailBody = htmlReport;

    // Send email using SendGrid
    try {
      console.log(`📧 Attempting to send email to ${auditResult.email} via SendGrid API...`);
      
      const emailData = {
        personalizations: [
          {
            to: [{ email: auditResult.email }],
            cc: [{ email: "chloe@cultivatedhq.com.au" }],
            subject: emailSubject,
          },
        ],
        from: { email: "chloe@cultivatedhq.com.au", name: "Chloe James - Cultivated HQ" },
        content: [
          {
            type: "text/html",
            value: emailBody,
          },
        ],
      };
      
      // Direct API call to SendGrid
      const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(`⚠️ SendGrid API error (${emailResponse.status}): ${errorText}`);
        throw new Error(`SendGrid API error: ${errorText}`);
      } else {
        console.log(`✅ Email sent successfully to ${auditResult.email}`);
      }
    } catch (emailError) {
      console.error(`⚠️ Failed to send email via SendGrid: ${emailError.message}`);
      throw emailError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Report generated successfully",
        audit_id: auditResult.id,
        email: auditResult.email,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("💥 Error generating report:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function formatCategoryName(category: string): string {
  if (!category) return "N/A";
  
  // Convert from kebab-case to Title Case with spaces
  return category
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function generateHTMLReport(auditResult: AuditResult): string {
  const { category_scores, total_score, lowest_category, highest_category } = auditResult;
  
  // Get category names and descriptions
  const categories = [
    {
      id: "team-performance",
      title: "Team Performance",
      color: "#2A9D8F", // primary color
      description: getTeamPerformanceDescription(category_scores["team-performance"] || 0)
    },
    {
      id: "values-culture",
      title: "Values & Culture",
      color: "#264653", // secondary color
      description: getValuesCultureDescription(category_scores["values-culture"] || 0)
    },
    {
      id: "leadership-alignment",
      title: "Leadership Alignment",
      color: "#2A9D8F", // primary color
      description: getLeadershipAlignmentDescription(category_scores["leadership-alignment"] || 0)
    },
    {
      id: "people-retention",
      title: "People & Retention",
      color: "#264653", // secondary color
      description: getPeopleRetentionDescription(category_scores["people-retention"] || 0)
    }
  ];

  // Get overall feedback based on total score
  const overallFeedback = getOverallFeedback(total_score);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leadership Clarity Audit Report</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 40px;
      color: #333;
      line-height: 1.6;
      background-color: #ffffff;
    }

    h1, h2, h3 {
      color: #2A9D8F;
      margin-top: 0;
    }

    .header {
      text-align: center;
      border-bottom: 3px solid #2A9D8F;
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
      border-left: 4px solid #2A9D8F;
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
      border: 2px solid #2A9D8F;
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
      color: #2A9D8F;
      margin-bottom: 5px;
    }

    .metric-label {
      font-size: 0.9em;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .category-block {
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 10px;
      border-left: 4px solid #2A9D8F;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .category-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .category-score {
      font-size: 1.8em;
      font-weight: bold;
      margin-left: auto;
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

    .footer {
      text-align: center;
      border-top: 2px solid #2A9D8F;
      padding-top: 20px;
      margin-top: 50px;
      font-size: 0.9em;
      color: #666;
    }

    .quadrant-chart {
      position: relative;
      width: 100%;
      height: 400px;
      border: 2px solid #ddd;
      border-radius: 10px;
      margin: 30px 0;
      background-color: #f9f9f9;
    }

    .quadrant-lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .quadrant-h-line {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #ccc;
    }

    .quadrant-v-line {
      position: absolute;
      top: 0;
      left: 50%;
      width: 1px;
      height: 100%;
      background-color: #ccc;
    }

    .quadrant-label {
      position: absolute;
      font-size: 12px;
      color: #666;
    }

    .quadrant-label-tl {
      top: 10px;
      left: 10px;
    }

    .quadrant-label-tr {
      top: 10px;
      right: 10px;
    }

    .quadrant-label-bl {
      bottom: 10px;
      left: 10px;
    }

    .quadrant-label-br {
      bottom: 10px;
      right: 10px;
    }

    .quadrant-dot {
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #2A9D8F;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      transform: translate(-50%, -50%);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    @media print {
      body { margin: 20px; }
      .section { page-break-inside: avoid; }
      .category-block { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>Leadership Clarity Audit Report</h1>
    <p>Prepared for: ${auditResult.name || auditResult.email}</p>
    <p>Generated on: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="section">
    <h2>Audit Overview</h2>
    <div class="highlight-box">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${total_score.toFixed(1)}</div>
          <div class="metric-label">Overall Score</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${getScoreDescription(total_score)}</div>
          <div class="metric-label">Performance Level</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatCategoryName(highest_category)}</div>
          <div class="metric-label">Strongest Area</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatCategoryName(lowest_category)}</div>
          <div class="metric-label">Development Area</div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Leadership Quadrant Analysis</h2>
    <p>This quadrant visualization shows how your leadership team balances performance execution with cultural alignment.</p>
    
    <div class="quadrant-chart">
      <div class="quadrant-lines">
        <div class="quadrant-h-line"></div>
        <div class="quadrant-v-line"></div>
        <div class="quadrant-label quadrant-label-tl">High Alignment</div>
        <div class="quadrant-label quadrant-label-tr">High Performance</div>
        <div class="quadrant-label quadrant-label-bl">Low Performance</div>
        <div class="quadrant-label quadrant-label-br">Low Alignment</div>
      </div>
      
      <!-- Position dot based on scores -->
      <div class="quadrant-dot" style="
        left: ${calculateXPosition(category_scores)}%; 
        top: ${calculateYPosition(category_scores)}%;"
      >
        ${total_score.toFixed(1)}
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Category Breakdown</h2>
    
    ${categories.map(category => `
    <div class="category-block">
      <div class="category-header">
        <div>
          <h3>${category.title}</h3>
          <p>${getScoreDescription(category_scores[category.id] || 0)}</p>
        </div>
        <div class="category-score" style="color: ${category.color}">
          ${(category_scores[category.id] || 0).toFixed(1)}
        </div>
      </div>
      
      <p>${category.description}</p>
      
      ${category.id === lowest_category ? `
      <div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <strong>Priority Focus Area:</strong> This is your lowest-scoring category and should be addressed first.
      </div>
      ` : ''}
      
      ${category.id === highest_category ? `
      <div style="margin-top: 15px; padding: 10px; background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
        <strong>Strength to Leverage:</strong> This is your highest-scoring category. Build on these strengths.
      </div>
      ` : ''}
    </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Overall Assessment</h2>
    <div class="box">
      <h3>${overallFeedback.title}</h3>
      <p>${overallFeedback.description}</p>
      
      <div style="margin-top: 20px;">
        <h4>Recommended Actions:</h4>
        <ul>
          ${overallFeedback.actionItems.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Next Steps</h2>
    <div class="recommendations">
      <h3>Taking Action on Your Results</h3>
      
      <p>To make the most of this assessment:</p>
      <ol>
        <li><strong>Share these insights</strong> with your leadership team</li>
        <li><strong>Focus first</strong> on your lowest-scoring category</li>
        <li><strong>Create an action plan</strong> with specific, measurable goals</li>
        <li><strong>Schedule a follow-up assessment</strong> in 3-6 months to track progress</li>
      </ol>
      
      <div style="margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.7); border-radius: 10px;">
        <h4 style="margin-top: 0; color: #2A9D8F;">Need Support?</h4>
        <p>Book a free 30-minute strategy call to discuss your results and get personalized guidance on implementing these recommendations.</p>
        <p style="margin-bottom: 0;"><strong>Visit:</strong> <a href="https://calendly.com/chloe-cultivatedhq/30min">calendly.com/chloe-cultivatedhq/30min</a></p>
      </div>
    </div>
  </div>

  <div class="footer">
    <p><strong>Generated on ${new Date().toLocaleDateString()} | Cultivated HQ</strong></p>
    <p>For questions about this report or leadership development support, contact: <strong>chloe@cultivatedhq.com.au</strong></p>
    <p style="margin-top: 15px; font-size: 0.8em;">
      This report contains confidential leadership insights. Please handle with appropriate discretion.
    </p>
  </div>

</body>
</html>
  `;
}

function calculateXPosition(categoryScores: Record<string, number>): number {
  // For x-axis: team-performance and people-retention
  const xScore = (
    (categoryScores["team-performance"] || 0) + 
    (categoryScores["people-retention"] || 0)
  ) / 2;
  
  // Convert to percentage (0-100%) for positioning
  // Adjust to make 1-5 scale fit in the quadrant
  return ((xScore - 1) / 4) * 100;
}

function calculateYPosition(categoryScores: Record<string, number>): number {
  // For y-axis: values-culture and leadership-alignment
  const yScore = (
    (categoryScores["values-culture"] || 0) + 
    (categoryScores["leadership-alignment"] || 0)
  ) / 2;
  
  // Convert to percentage (0-100%) for positioning
  // Adjust to make 1-5 scale fit in the quadrant
  // Invert Y axis (100 - y) because in CSS, 0 is at the top
  return 100 - ((yScore - 1) / 4) * 100;
}

function getScoreDescription(score: number): string {
  if (score >= 4.5) return "Exceptional";
  if (score >= 4) return "Very Strong";
  if (score >= 3.5) return "Strong";
  if (score >= 3) return "Solid";
  if (score >= 2.5) return "Developing";
  if (score >= 2) return "Needs Attention";
  return "Critical Concern";
}

function getOverallFeedback(totalScore: number) {
  if (totalScore >= 4.5) {
    return {
      title: "Exceptional Leadership Team",
      description: "Your leadership team is performing at an exceptional level. You have the foundation for sustained organisational success and growth.",
      actionItems: [
        "Document your leadership practices to create a playbook for future leaders",
        "Mentor other leadership teams in your organisation or industry",
        "Focus on innovation and future growth opportunities"
      ]
    };
  } else if (totalScore >= 3.5) {
    return {
      title: "Strong Leadership Team",
      description: "Your leadership team is performing well with clear strengths. There are specific areas where targeted improvements can take you from good to great.",
      actionItems: [
        "Build on your strengths while addressing your lowest-scoring category",
        "Implement regular leadership team effectiveness reviews",
        "Create development plans for each leader that align with team goals"
      ]
    };
  } else if (totalScore >= 2.5) {
    return {
      title: "Developing Leadership Team",
      description: "Your leadership team has a foundation to build upon, but significant improvements are needed in several areas to drive organisational success.",
      actionItems: [
        "Prioritise addressing your lowest-scoring category immediately",
        "Establish clear leadership team operating principles",
        "Consider leadership coaching for key team members"
      ]
    };
  } else {
    return {
      title: "Leadership Team Needs Significant Attention",
      description: "Your leadership team is facing substantial challenges that require immediate attention to avoid negative impacts on organisational performance.",
      actionItems: [
        "Conduct a comprehensive leadership team reset",
        "Bring in external expertise to facilitate improvement",
        "Create 30/60/90 day improvement plans with clear accountability"
      ]
    };
  }
}

function getTeamPerformanceDescription(score: number): string {
  if (score >= 4) {
    return "Your leadership team excels at execution and consistently achieves strategic objectives. Continue to document and share your effective decision-making and problem-solving approaches.";
  } else if (score >= 3) {
    return "Your leadership team has solid performance foundations. Focus on improving decision-making speed and translating strategy into clearer action plans.";
  } else {
    return "Your leadership team struggles with consistent execution. Prioritise establishing clearer decision-making processes and accountability for strategic objectives.";
  }
}

function getValuesCultureDescription(score: number): string {
  if (score >= 4) {
    return "Your leadership team effectively models values and creates a positive culture. Continue strengthening your communication of the 'why' behind decisions.";
  } else if (score >= 3) {
    return "Your leadership team has a foundation of positive culture. Work on more consistently modeling core values and recognising team contributions.";
  } else {
    return "Your leadership team needs to prioritise culture-building. Start by clearly defining and modeling your core values and improving psychological safety.";
  }
}

function getLeadershipAlignmentDescription(score: number): string {
  if (score >= 4) {
    return "Your leadership team demonstrates strong alignment and unity. Continue refining role clarity and maintaining your effective conflict resolution practices.";
  } else if (score >= 3) {
    return "Your leadership team has moderate alignment. Focus on improving how you present a unified message and manage internal disagreements constructively.";
  } else {
    return "Your leadership team shows significant misalignment. Prioritise clarifying strategic priorities and establishing healthy conflict resolution processes.";
  }
}

function getPeopleRetentionDescription(score: number): string {
  if (score >= 4) {
    return "Your leadership team excels at developing people and maintaining engagement. Continue your strong practices in talent development and feedback.";
  } else if (score >= 3) {
    return "Your leadership team has solid people practices. Enhance your approach to identifying high-potential talent and providing more regular feedback.";
  } else {
    return "Your leadership team needs to prioritise talent development. Establish consistent feedback processes and create clearer growth pathways for employees.";
  }
}