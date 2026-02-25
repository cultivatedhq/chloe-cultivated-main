import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SENDGRID_KEY = Deno.env.get("SENDGRID_API_KEY");
const HUBSPOT_TOKEN = Deno.env.get("HUBSPOT_TOKEN");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "chloe@cultivatedhq.com.au";
const CC_EMAIL = Deno.env.get("CC_EMAIL") || "chloe@cultivatedhq.com.au";

// Check if we're in a minimal configuration mode (only database available)
const MINIMAL_MODE = !SENDGRID_KEY || !HUBSPOT_TOKEN;

type Payload = {
  name: string;
  email: string;
  summaryMarkdown: string;
  results: Record<string, unknown>;
  ctaUrl?: string;
};

function mdToHtml(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- /g, "<br>• ")
    .replace(/\n/g, "<br>");
}

async function sendWithSendGrid(toEmail: string, subject: string, html: string, text: string): Promise<void> {
  const payload = {
    personalizations: [{
      to: [{ email: toEmail }],
      ...(CC_EMAIL ? { cc: [{ email: CC_EMAIL }] } : {}),
      subject
    }],
    from: { email: FROM_EMAIL, name: "Cultivated HQ" },
    reply_to: { email: "chloe@cultivatedhq.com.au", name: "Chloe" },
    content: [
      { type: "text/plain", value: text },
      { type: "text/html", value: html }
    ]
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${SENDGRID_KEY}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SendGrid: ${res.status} ${errorText}`);
  }
}

async function hubspotUpsertContact(name: string, email: string): Promise<string> {
  const [firstName, ...rest] = name.trim().split(" ");
  const lastName = rest.join(" ") || "";

  // Try to create contact
  let res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${HUBSPOT_TOKEN}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      properties: { 
        email, 
        firstname: firstName, 
        lastname: lastName, 
        lifecyclestage: "lead", 
        source: "Clarity Audit" 
      } 
    })
  });

  // If contact already exists (409 conflict), search and update
  if (res.status === 409) {
    const search = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${HUBSPOT_TOKEN}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        filterGroups: [{ 
          filters: [{ 
            propertyName: "email", 
            operator: "EQ", 
            value: email 
          }]
        }]
      })
    });

    if (!search.ok) {
      throw new Error(`HubSpot search failed: ${await search.text()}`);
    }

    const data = await search.json();
    const contactId = data?.results?.[0]?.id;
    
    if (!contactId) {
      throw new Error("HubSpot: contact not found after conflict");
    }

    // Update existing contact
    const updateRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      headers: { 
        "Authorization": `Bearer ${HUBSPOT_TOKEN}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ 
        properties: { 
          firstname: firstName, 
          lastname: lastName 
        } 
      })
    });

    if (!updateRes.ok) {
      throw new Error(`HubSpot update failed: ${await updateRes.text()}`);
    }

    return contactId;
  }

  if (!res.ok) {
    throw new Error(`HubSpot create failed: ${await res.text()}`);
  }

  const created = await res.json();
  return created.id as string;
}

async function hubspotAttachNote(contactId: string, html: string): Promise<void> {
  // Create note
  const noteRes = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${HUBSPOT_TOKEN}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ 
      properties: { 
        hs_note_body: html 
      }
    })
  });

  if (!noteRes.ok) {
    throw new Error(`HubSpot note creation failed: ${await noteRes.text()}`);
  }

  const note = await noteRes.json();

  // Associate note with contact
  const assoc = await fetch(`https://api.hubapi.com/crm/v4/objects/notes/${note.id}/associations/contacts/${contactId}/note_to_contact`, {
    method: "PUT",
    headers: { 
      "Authorization": `Bearer ${HUBSPOT_TOKEN}` 
    }
  });

  if (!assoc.ok) {
    throw new Error(`HubSpot note association failed: ${await assoc.text()}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Check critical environment variables
    const criticalMissing = [];
    if (!SUPABASE_URL) criticalMissing.push("SUPABASE_URL");
    if (!SERVICE_KEY) criticalMissing.push("SUPABASE_SERVICE_ROLE_KEY");
    
    if (criticalMissing.length > 0) {
      console.error("❌ Missing critical environment variables:", criticalMissing);
      return new Response(
        JSON.stringify({ 
          error: `Database configuration missing: ${criticalMissing.join(", ")}`,
          success: false,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check optional environment variables for full functionality
    const optionalMissing = [];
    if (!SENDGRID_KEY) optionalMissing.push("SENDGRID_API_KEY");
    if (!HUBSPOT_TOKEN) optionalMissing.push("HUBSPOT_TOKEN");
    
    if (optionalMissing.length > 0) {
      console.warn("⚠️ Missing optional environment variables:", optionalMissing);
      console.warn("🔄 Running in minimal mode - database only");
    } else {
      console.log("✅ All environment variables present - running in full mode");
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method Not Allowed" }), 
        { 
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("🔄 Processing send-results request...");

    // Parse and validate input
    const payload = await req.json() as Partial<Payload>;
    const errors: string[] = [];
    
    if (!payload?.name?.trim()) errors.push("name");
    if (!payload?.email?.trim()) errors.push("email");
    if (!payload?.summaryMarkdown?.trim()) errors.push("summaryMarkdown");
    if (!payload?.results) errors.push("results");
    
    if (errors.length) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${errors.join(", ")}` }), 
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email!)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }), 
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`📧 Processing audit results for: ${payload.email}`);

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!);

    // Insert audit results into clarity_audit_results table
    console.log("💾 Saving audit results to database...");
    console.log("📊 Data to insert:", {
      email: payload.email,
      name: payload.name,
      answers_type: typeof payload.results.answers,
      category_scores_type: typeof payload.results.category_scores,
      total_score: payload.results.total_score,
      lowest_category: payload.results.lowest_category,
      highest_category: payload.results.highest_category
    });

    const { data: auditData, error: insertErr } = await supabase
      .from("clarity_audit_results")
      .insert({
        email: payload.email,
        name: payload.name,
        answers: payload.results.answers || {},
        category_scores: payload.results.category_scores || {},
        total_score: payload.results.total_score || 0,
        lowest_category: payload.results.lowest_category || '',
        highest_category: payload.results.highest_category || '',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertErr) {
      console.error("❌ Database insert failed:", {
        error: insertErr,
        code: insertErr.code,
        message: insertErr.message,
        details: insertErr.details,
        hint: insertErr.hint
      });
      throw new Error(`Failed to save audit results: ${insertErr.message || insertErr.code || 'Unknown database error'}`);
    }

    console.log("✅ Audit results saved successfully:", auditData.id);

    // If in minimal mode, just save to database and return success
    if (MINIMAL_MODE) {
      console.log("⚠️ Running in minimal mode - email and CRM services not configured");
      console.log("📝 Missing services:", optionalMissing.join(", "));
      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Audit results saved successfully. Missing: ${optionalMissing.join(", ")}. Please configure these environment variables for full functionality.`,
          audit_id: auditData.id,
          minimal_mode: true,
          missing_services: optionalMissing,
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Full mode - send emails and update CRM
    console.log("🔄 Running in full mode - processing email and CRM...");
    
    // Prepare email content
    const htmlSummary = generateComprehensiveEmailReport(payload);

    const textSummary = `
Your Leadership Clarity Audit Results

Hey ${payload.name!.split(" ")[0]}, here are your results.

${payload.summaryMarkdown!.replace(/\*\*(.+?)\*\*/g, "$1")}

${payload.ctaUrl ? `Book a clarity call: ${payload.ctaUrl}` : ""}

— Chloe @ Cultivated HQ
chloe@cultivatedhq.com.au
    `.trim();

    // Upsert contact in HubSpot and attach note
    console.log("🔄 Upserting contact in HubSpot CRM...");
    console.log(`📊 Contact details - Name: ${payload.name}, Email: ${payload.email}`);

    try {
      const contactId = await hubspotUpsertContact(payload.name!, payload.email!);
      console.log(`✅ HubSpot contact upserted successfully with ID: ${contactId}`);

      console.log("📝 Attaching audit results note to contact...");
      await hubspotAttachNote(contactId, htmlSummary);
      console.log("✅ HubSpot note attached successfully");

      console.log(`🎉 HubSpot CRM sync complete for contact: ${payload.email}`);
    } catch (hubspotError) {
      console.error("⚠️ HubSpot operation failed:", hubspotError);
      console.error("⚠️ Error details:", {
        message: hubspotError instanceof Error ? hubspotError.message : "Unknown error",
        name: hubspotError instanceof Error ? hubspotError.name : "Error",
        stack: hubspotError instanceof Error ? hubspotError.stack : undefined
      });
      console.log("⚠️ Continuing with email delivery despite HubSpot failure");
    }

    // Send email via SendGrid
    console.log("📧 Sending email via SendGrid...");
    try {
      await sendWithSendGrid(
        payload.email!, 
        "Your Leadership Clarity Audit Results", 
        htmlSummary, 
        textSummary
      );
      console.log("✅ Email sent successfully");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      throw new Error(`Failed to send email: ${(emailError as Error).message}`);
    }


    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Audit results saved, contact updated in HubSpot, and email sent successfully",
        audit_id: auditData.id,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("💥 Error in send-results function:", error);
    
    // Provide more detailed error information
    const errorDetails = {
      error: (error as Error).message,
      success: false,
      timestamp: new Date().toISOString(),
      environment_check: {
        supabase_url: !!SUPABASE_URL,
        service_key: !!SERVICE_KEY,
        sendgrid_key: !!SENDGRID_KEY,
        hubspot_token: !!HUBSPOT_TOKEN,
        minimal_mode: MINIMAL_MODE
      }
    };
    
    return new Response(
      JSON.stringify(errorDetails), 
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

function generateComprehensiveEmailReport(payload: Payload): string {
  const results = payload.results as any;
  const categoryScores = results.category_scores || {};
  const totalScore = results.total_score || 0;
  const lowestCategory = results.lowest_category || '';
  const highestCategory = results.highest_category || '';
  
  // Helper functions
  const getScoreDescription = (score: number): string => {
    if (score >= 4.5) return "Exceptional";
    if (score >= 4) return "Very Strong";
    if (score >= 3.5) return "Strong";
    if (score >= 3) return "Solid";
    if (score >= 2.5) return "Developing";
    if (score >= 2) return "Needs Attention";
    return "Critical Concern";
  };

  const formatCategoryName = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      'team-performance': 'Team Performance',
      'values-culture': 'Values & Culture',
      'leadership-alignment': 'Leadership Alignment',
      'people-retention': 'People & Retention'
    };
    return categoryMap[categoryId] || categoryId;
  };

  const getCategoryFeedback = (categoryId: string): string => {
    const score = categoryScores[categoryId] || 0;
    
    switch(categoryId) {
      case 'team-performance':
        if (score >= 4) {
          return 'Your leadership team excels at execution and consistently achieves strategic objectives. Continue to document and share your effective decision-making and problem-solving approaches.';
        } else if (score >= 3) {
          return 'Your leadership team has solid performance foundations. Focus on improving decision-making speed and translating strategy into clearer action plans.';
        } else {
          return 'Your leadership team struggles with consistent execution. Prioritise establishing clearer decision-making processes and accountability for strategic objectives.';
        }
      
      case 'values-culture':
        if (score >= 4) {
          return 'Your leadership team effectively models values and creates a positive culture. Continue strengthening your communication of the "why" behind decisions.';
        } else if (score >= 3) {
          return 'Your leadership team has a foundation of positive culture. Work on more consistently modeling core values and recognising team contributions.';
        } else {
          return 'Your leadership team needs to prioritise culture-building. Start by clearly defining and modeling your core values and improving psychological safety.';
        }
      
      case 'leadership-alignment':
        if (score >= 4) {
          return 'Your leadership team demonstrates strong alignment and unity. Continue refining role clarity and maintaining your effective conflict resolution practices.';
        } else if (score >= 3) {
          return 'Your leadership team has moderate alignment. Focus on improving how you present a unified message and manage internal disagreements constructively.';
        } else {
          return 'Your leadership team shows significant misalignment. Prioritise clarifying strategic priorities and establishing healthy conflict resolution processes.';
        }
      
      case 'people-retention':
        if (score >= 4) {
          return 'Your leadership team excels at developing people and maintaining engagement. Continue your strong practices in talent development and feedback.';
        } else if (score >= 3) {
          return 'Your leadership team has solid people practices. Enhance your approach to identifying high-potential talent and providing more regular feedback.';
        } else {
          return 'Your leadership team needs to prioritise talent development. Establish consistent feedback processes and create clearer growth pathways for employees.';
        }
      
      default:
        return '';
    }
  };

  const getOverallFeedback = () => {
    if (totalScore >= 4.5) {
      return {
        title: 'Exceptional Leadership Team',
        description: 'Your leadership team is performing at an exceptional level. You have the foundation for sustained organisational success and growth.',
        actionItems: [
          'Document your leadership practices to create a playbook for future leaders',
          'Mentor other leadership teams in your organisation or industry',
          'Focus on innovation and future growth opportunities'
        ]
      };
    } else if (totalScore >= 3.5) {
      return {
        title: 'Strong Leadership Team',
        description: 'Your leadership team is performing well with clear strengths. There are specific areas where targeted improvements can take you from good to great.',
        actionItems: [
          'Build on your strengths while addressing your lowest-scoring category',
          'Implement regular leadership team effectiveness reviews',
          'Create development plans for each leader that align with team goals'
        ]
      };
    } else if (totalScore >= 2.5) {
      return {
        title: 'Developing Leadership Team',
        description: 'Your leadership team has a foundation to build upon, but significant improvements are needed in several areas to drive organisational success.',
        actionItems: [
          'Prioritise addressing your lowest-scoring category immediately',
          'Establish clear leadership team operating principles',
          'Consider leadership coaching for key team members'
        ]
      };
    } else {
      return {
        title: 'Leadership Team Needs Significant Attention',
        description: 'Your leadership team is facing substantial challenges that require immediate attention to avoid negative impacts on organisational performance.',
        actionItems: [
          'Conduct a comprehensive leadership team reset',
          'Bring in external expertise to facilitate improvement',
          'Create 30/60/90 day improvement plans with clear accountability'
        ]
      };
    }
  };

  const calculateQuadrantPosition = () => {
    // For x-axis: team-performance and people-retention
    const xScore = (
      (categoryScores['team-performance'] || 0) + 
      (categoryScores['people-retention'] || 0)
    ) / 2;
    
    // For y-axis: values-culture and leadership-alignment
    const yScore = (
      (categoryScores['values-culture'] || 0) + 
      (categoryScores['leadership-alignment'] || 0)
    ) / 2;
    
    let quadrantDescription = '';
    
    if (xScore >= 3.5 && yScore >= 3.5) {
      quadrantDescription = 'High Performance & High Alignment - Your leadership team excels in both execution and cultural cohesion.';
    } else if (xScore >= 3.5 && yScore < 3.5) {
      quadrantDescription = 'High Performance & Lower Alignment - Strong execution but needs better cultural alignment and unity.';
    } else if (xScore < 3.5 && yScore >= 3.5) {
      quadrantDescription = 'Lower Performance & High Alignment - Good cultural foundation but needs to improve execution and results.';
    } else {
      quadrantDescription = 'Development Needed - Both performance execution and cultural alignment require focused attention.';
    }
    
    return quadrantDescription;
  };

  const overallFeedback = getOverallFeedback();
  const quadrantAnalysis = calculateQuadrantPosition();
  
  const categories = [
    { id: 'team-performance', title: 'Team Performance', icon: '📊' },
    { id: 'values-culture', title: 'Values & Culture', icon: '❤️' },
    { id: 'leadership-alignment', title: 'Leadership Alignment', icon: '🧭' },
    { id: 'people-retention', title: 'People & Retention', icon: '👥' }
  ];

  return `
      <div style="font-family: system-ui, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2A9D8F; margin-bottom: 10px;">Your Leadership Clarity Audit Results</h1>
          <p style="color: #666; font-size: 16px;">Prepared for ${payload.name!}</p>
        </div>
        
        <!-- Overall Assessment -->
        <div style="background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%); border: 2px solid #2A9D8F; padding: 25px; border-radius: 15px; margin: 25px 0;">
          <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 15px;">📊 Overall Assessment</h2>
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 3em; font-weight: bold; color: #2A9D8F; margin-bottom: 5px;">${totalScore.toFixed(1)}/5</div>
            <div style="font-size: 1.2em; font-weight: bold; color: #264653;">${getScoreDescription(totalScore)}</div>
          </div>
          <h3 style="color: #264653; margin-bottom: 10px;">${overallFeedback.title}</h3>
          <p style="margin-bottom: 15px;">${overallFeedback.description}</p>
        </div>
        
        <!-- Leadership Quadrant Analysis -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #264653;">
          <h2 style="color: #264653; margin-top: 0; margin-bottom: 15px;">🎯 Leadership Quadrant Analysis</h2>
          <p style="margin-bottom: 10px;"><strong>Your Position:</strong> ${quadrantAnalysis}</p>
          <p style="font-size: 14px; color: #666; font-style: italic;">This analysis shows how your leadership team balances performance execution with cultural alignment.</p>
        </div>
        
        <!-- Category Breakdown -->
        <div style="margin: 30px 0;">
          <h2 style="color: #2A9D8F; margin-bottom: 20px;">📋 Detailed Category Breakdown</h2>
          
          ${categories.map(category => {
            const score = categoryScores[category.id] || 0;
            const isHighest = category.id === highestCategory;
            const isLowest = category.id === lowestCategory;
            
            return `
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); ${isLowest ? 'border-left: 4px solid #ffc107;' : isHighest ? 'border-left: 4px solid #28a745;' : 'border-left: 4px solid #2A9D8F;'}">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
                <div>
                  <h3 style="margin: 0; color: #333; font-size: 1.2em;">${category.icon} ${category.title}</h3>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${getScoreDescription(score)}</p>
                </div>
                <div style="font-size: 1.8em; font-weight: bold; color: #2A9D8F;">${score.toFixed(1)}</div>
              </div>
              
              <p style="margin-bottom: 15px; color: #555; line-height: 1.5;">${getCategoryFeedback(category.id)}</p>
              
              ${isLowest ? `
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; border-radius: 4px;">
                <strong style="color: #856404;">🎯 Priority Focus Area:</strong> <span style="color: #856404;">This is your lowest-scoring category and should be addressed first.</span>
              </div>
              ` : ''}
              
              ${isHighest ? `
              <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 10px; border-radius: 4px;">
                <strong style="color: #155724;">💪 Strength to Leverage:</strong> <span style="color: #155724;">This is your highest-scoring category. Build on these strengths.</span>
              </div>
              ` : ''}
            </div>
            `;
          }).join('')}
        </div>
        
        <!-- Recommended Actions -->
        <div style="background: linear-gradient(135deg, #fff3e0 0%, #f3e5f5 100%); border: 2px solid #ff9800; padding: 25px; border-radius: 15px; margin: 25px 0;">
          <h2 style="color: #e65100; margin-top: 0; margin-bottom: 15px;">🚀 Recommended Actions</h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${overallFeedback.actionItems.map(item => `<li style="margin-bottom: 8px; color: #333;">${item}</li>`).join('')}
          </ul>
        </div>
        
        <!-- Call to Action -->
        <div style="background: #2A9D8F; color: white; padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
          <h2 style="color: white; margin-top: 0; margin-bottom: 15px;">Ready to Take Action?</h2>
          <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.4;">Insights are cool. Action is cooler. We'll unpack the good, the bad, and the blind spots to build a clear plan to move your leadership team forward.</p>
          
          ${payload.ctaUrl ? `
          <a href="${payload.ctaUrl}" style="background: white; color: #2A9D8F; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin-top: 10px;">
            Book Your Strategy Call
          </a>
          ` : ""}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            — Chloe @ Cultivated HQ<br>
            <a href="mailto:chloe@cultivatedhq.com.au" style="color: #2A9D8F;">chloe@cultivatedhq.com.au</a>
          </p>
        </div>
      </div>
    `.trim();
}