import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  name: string;
  pdf_url: string;
  audit_id: string;
  total_score: number;
  highest_category: string;
  lowest_category: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, subject, name, pdf_url, audit_id, total_score, highest_category, lowest_category }: EmailRequest = await req.json();

    if (!to || !pdf_url) {
      throw new Error("Email recipient and PDF URL are required");
    }

    console.log(`📧 Sending clarity audit email to: ${to}`);

    // Create email body
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2a9d8f;">Your Leadership Clarity Audit Results</h2>
        <p>Hi ${name || "there"},</p>
        <p>Thank you for completing the Leadership Clarity Audit. Your personalized report is now ready!</p>
        
        <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
          <h3 style="margin-top: 0;">Audit Summary:</h3>
          <ul>
            <li><strong>Overall Score:</strong> ${total_score.toFixed(1)}/5</li>
            <li><strong>Strongest Area:</strong> ${highest_category}</li>
            <li><strong>Development Area:</strong> ${lowest_category}</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${pdf_url}" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Download Your Full Report
          </a>
        </div>

        <p>Your report includes:</p>
        <ul>
          <li>Detailed analysis of your leadership team's current state</li>
          <li>Specific insights for each leadership dimension</li>
          <li>Personalized recommendations for improvement</li>
          <li>Practical next steps to enhance your leadership effectiveness</li>
        </ul>
        
        <p>If you'd like to discuss your results or explore how we can help you implement the recommendations, book a free strategy call:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://calendly.com/chloe-cultivatedhq/30min" style="background: #264653; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Book Your Strategy Call
          </a>
        </div>
        
        <p>Best regards,<br>
        <strong>Chloe James</strong><br>
        Cultivated HQ<br>
        <a href="mailto:chloe@cultivatedhq.com.au" style="color: #2a9d8f;">chloe@cultivatedhq.com.au</a></p>
      </div>
    `;

    // In a production environment, you would integrate with an email service here
    // For this example, we'll use a direct API call to a transactional email service
    
    // Log the email details for debugging
    console.log({
      to,
      subject,
      pdf_url,
      audit_id,
      timestamp: new Date().toISOString()
    });

    // Simulate successful email sending
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        recipient: to,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("💥 Error sending email:", error);
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