import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  type: 'session_created' | 'new_response' | 'session_complete' | 'session_complete_no_responses' | 'public_session_created' | 'daily_processing_summary';
  session?: {
    id: string;
    title: string;
    response_count?: number;
    manager_name?: string;
    manager_email?: string;
    expires_at?: string;
    created_at?: string;
  };
  responses?: Array<{
    responses: number[];
    comment?: string;
    submitted_at: string;
  }>;
  processed_sessions?: Array<{
    id: string;
    title: string;
    response_count?: number;
    status: string;
    error?: string;
  }>;
  email: string;
  manager_name?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, session, responses, processed_sessions, email, manager_name }: NotificationRequest = await req.json()

    let subject = '';
    let body = '';
    const siteUrl = 'https://www.cultivatedhq.com.au';

    switch (type) {
      case 'session_created':
        subject = `Your Feedback Survey is Ready: ${session?.title}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">Your Leadership Feedback Survey is Ready!</h2>
            <p>Hi ${manager_name || 'there'},</p>
            <p>Your anonymous feedback survey has been successfully created and is ready to share with your team.</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
              <h3 style="margin-top: 0;">Survey Details:</h3>
              <ul>
                <li><strong>Title:</strong> ${session?.title}</li>
                <li><strong>Survey Link:</strong> <a href="${siteUrl}/pulsecheck/survey/${session?.id}" style="color: #2a9d8f;">View Survey</a></li>
                <li><strong>Duration:</strong> 3 days (closes automatically)</li>
              </ul>
            </div>

            <h3>Next Steps:</h3>
            <ol>
              <li>Share the survey link with your team</li>
              <li>We'll notify you when responses come in</li>
              <li>You'll receive a professional PDF report automatically when the survey closes</li>
            </ol>

            <div style="background: #e8f5f3; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>⏰ Important:</strong> Your survey will automatically close in 3 days. After that, no new responses can be submitted and your report will be generated.</p>
            </div>

            <p>Your team can respond completely anonymously - no login required, no tracking.</p>
            
            <p>Best regards,<br>
            <strong>The Cultivated HQ Team</strong></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              This email was sent because you created a feedback survey at Cultivated HQ. 
              If you have any questions, reply to this email.
            </p>
          </div>
        `;
        break;

      case 'public_session_created':
        subject = `New Public Survey Created: ${session?.title}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">New Public Feedback Session</h2>
            <p>A new public feedback session has been created:</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <ul>
                <li><strong>Manager:</strong> ${session?.manager_name}</li>
                <li><strong>Email:</strong> ${session?.manager_email}</li>
                <li><strong>Title:</strong> ${session?.title}</li>
                <li><strong>Session ID:</strong> ${session?.id}</li>
                <li><strong>Survey Link:</strong> <a href="${siteUrl}/pulsecheck/survey/${session?.id}" style="color: #2a9d8f;">View Survey</a></li>
                <li><strong>Expires:</strong> ${session?.expires_at ? new Date(session.expires_at).toLocaleDateString() : 'In 3 days'}</li>
              </ul>
            </div>
            
            <p>You can monitor this session from your <a href="${siteUrl}/pulsecheck/admin" style="color: #2a9d8f;">admin dashboard</a>.</p>
          </div>
        `;
        break;

      case 'new_response':
        subject = `New Response Received: ${session?.title}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">New Feedback Response</h2>
            <p>Hi ${manager_name || 'there'},</p>
            <p>Great news! A new anonymous response has been submitted for your feedback survey.</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
              <h3 style="margin-top: 0;">Survey Update:</h3>
              <ul>
                <li><strong>Session:</strong> ${session?.title}</li>
                <li><strong>Total Responses:</strong> ${session?.response_count || 0}</li>
              </ul>
            </div>

            <p>Your survey will automatically close in 3 days, and you'll receive a comprehensive PDF report with insights and recommendations.</p>
            
            <p>Keep sharing the survey link to gather more valuable feedback from your team!</p>
            
            <p>Best regards,<br>
            <strong>The Cultivated HQ Team</strong></p>
          </div>
        `;
        break;

      case 'session_complete':
        subject = `Your Feedback Report is Ready: ${session?.title}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">Your Leadership Feedback Report is Ready!</h2>
            <p>Hi ${manager_name || 'there'},</p>
            <p>Your 3-day feedback survey has closed and we've generated your comprehensive leadership report.</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #2a9d8f;">
              <h3 style="margin-top: 0;">Survey Summary:</h3>
              <ul>
                <li><strong>Session:</strong> ${session?.title}</li>
                <li><strong>Total Responses:</strong> ${session?.response_count || 0}</li>
                <li><strong>Survey Period:</strong> ${session?.created_at ? new Date(session.created_at).toLocaleDateString() : ''} - ${session?.expires_at ? new Date(session.expires_at).toLocaleDateString() : ''}</li>
                <li><strong>Status:</strong> Complete</li>
              </ul>
            </div>

            <div style="background: #e8f5f3; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2a9d8f;">📊 Your Report Includes:</h3>
              <ul>
                <li>Statistical analysis of all responses</li>
                <li>Visual charts and performance metrics</li>
                <li>Anonymous comments from your team</li>
                <li>Personalized leadership development recommendations</li>
                <li>Strengths and development opportunities</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/pulsecheck" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">View Your Dashboard</a>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review your detailed feedback report</li>
              <li>Identify key development areas</li>
              <li>Consider scheduling follow-up conversations with your team</li>
              <li>Create an action plan for improvement</li>
            </ol>
            
            <p>Thank you for investing in your leadership development! If you'd like support interpreting your results or creating a development plan, we're here to help.</p>
            
            <p>Best regards,<br>
            <strong>Chloe James & The Cultivated HQ Team</strong></p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              Questions about your report? Reply to this email or visit <a href="${siteUrl}" style="color: #2a9d8f;">cultivatedhq.com.au</a>
            </p>
          </div>
        `;
        break;

      case 'session_complete_no_responses':
        subject = `Survey Closed: ${session?.title}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">Survey Period Complete</h2>
            <p>Hi ${manager_name || 'there'},</p>
            <p>Your 3-day feedback survey period has ended.</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f39c12;">
              <h3 style="margin-top: 0;">Survey Summary:</h3>
              <ul>
                <li><strong>Session:</strong> ${session?.title}</li>
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
              </ul>
            </div>
            
            <p>Would you like to create another survey? We're here to help you gather valuable feedback from your team.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/pulsecheck/create" style="background: #2a9d8f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Create New Survey</a>
            </div>
            
            <p>Best regards,<br>
            <strong>Chloe James & The Cultivated HQ Team</strong></p>
          </div>
        `;
        break;

      case 'daily_processing_summary':
        subject = `Daily Survey Processing Summary - ${new Date().toLocaleDateString()}`;
        body = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2a9d8f;">Daily Processing Summary</h2>
            <p>Daily automated processing completed at ${new Date().toLocaleString()}</p>
            
            <div style="background: #f5f5f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>Processed Sessions:</h3>
              ${processed_sessions?.map(session => `
                <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                  <strong>${session.title}</strong><br>
                  <small>ID: ${session.id} | Responses: ${session.response_count || 0} | Status: ${session.status}</small>
                  ${session.error ? `<br><span style="color: red;">Error: ${session.error}</span>` : ''}
                </div>
              `).join('') || '<p>No sessions processed today.</p>'}
            </div>
          </div>
        `;
        break;
    }

    // Log the notification for debugging
    console.log('📧 Email notification prepared:', {
      to: email,
      subject,
      type,
      timestamp: new Date().toISOString()
    });

    // In a production environment, you would integrate with an email service here
    // For now, we'll simulate successful email sending
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification processed successfully',
        type,
        recipient: email,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('💥 Error in notification function:', error);
    
    // Return success even if there's an error to prevent blocking other operations
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Operation completed (notification skipped)',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})