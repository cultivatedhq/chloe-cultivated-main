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
      color: #00695C; /* Cultivated HQ teal */
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

    .header p {
      font-size: 1.1em;
      color: #666;
      margin: 0;
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

    .question-block h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 1.2em;
      color: #333;
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
      position: relative;
    }

    .comment::before {
      content: '"';
      font-size: 3em;
      color: #4caf50;
      position: absolute;
      top: -10px;
      left: 10px;
      opacity: 0.3;
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

    .page-break {
      page-break-before: always;
    }

    @media print {
      body {
        margin: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .question-block {
        page-break-inside: avoid;
      }
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
      <p><strong>Manager Name:</strong> {{ survey.manager_name }}</p>
      <p><strong>Survey Title:</strong> {{ survey.title }}</p>
      <p><strong>Survey Period:</strong> {{ formatDate(survey.created_at) }} to {{ formatDate(survey.expires_at) }}</p>
      <p><strong>Total Responses:</strong> {{ analytics.total_responses }}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to {{ survey.scale_max }} = Strongly Agree</p>
      {{#if survey.description}}
      <p><strong>Description:</strong> {{ survey.description }}</p>
      {{/if}}
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="highlight-box">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">{{ analytics.overall_percentage }}%</div>
          <div class="metric-label">Overall Leadership Score</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ analytics.total_responses }}</div>
          <div class="metric-label">Team Responses</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ analytics.comment_count }}</div>
          <div class="metric-label">Anonymous Comments</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">{{ analytics.strongest_score }}</div>
          <div class="metric-label">Highest Question Score</div>
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <p><strong>🎯 Strongest Area:</strong> {{ analytics.strongest_area }} ({{ analytics.strongest_score }}/{{ survey.scale_max }})</p>
        <p><strong>📈 Development Opportunity:</strong> {{ analytics.weakest_area }} ({{ analytics.weakest_score }}/{{ survey.scale_max }})</p>
        <p><strong>📊 Performance Category:</strong> {{ analytics.performance_category }}</p>
      </div>
    </div>
  </div>

  <div class="section page-break">
    <h2>Detailed Question Results</h2>
    {{#each survey.questions}}
    <div class="question-block">
      <h3>{{ @index_plus_1 }}. {{ this }}</h3>
      
      <div class="question-stats">
        <div class="stat-item">
          <div class="stat-label">Average Score</div>
          <div class="stat-value">{{ lookup ../analytics.question_averages @index }}/{{ ../survey.scale_max }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Median Score</div>
          <div class="stat-value">{{ lookup ../analytics.question_medians @index }}</div>
        </div>
      </div>
      
      <div class="distribution">
        {{#each (lookup ../analytics.response_distributions @index)}}
        <div class="distribution-item">
          <div class="distribution-value">{{ this }}</div>
          <div class="distribution-label">{{ @index_plus_1 }}⭐</div>
        </div>
        {{/each}}
      </div>
    </div>
    {{/each}}
  </div>

  {{#if analytics.comments}}
  {{#if (gt analytics.comment_count 0)}}
  <div class="section page-break">
    <h2>Anonymous Comments</h2>
    <p style="margin-bottom: 25px; color: #666; font-style: italic;">
      Your team shared these anonymous insights to help with your leadership development:
    </p>
    {{#each analytics.comments}}
    <div class="comment">
      {{ this }}
    </div>
    {{/each}}
  </div>
  {{/if}}
  {{/if}}

  <div class="section page-break">
    <h2>Development Recommendations</h2>
    <div class="recommendations performance-{{ analytics.performance_category }}">
      <h3>Personalized Leadership Development Plan</h3>
      
      {{#if (eq analytics.performance_category "excellent")}}
      <p><strong>🌟 Outstanding Leadership Performance!</strong></p>
      <p>You're performing at an exceptional level. Your team clearly sees you as an effective leader. Consider these next steps:</p>
      <ul>
        <li><strong>Mentor emerging leaders</strong> - Share your successful practices with other managers</li>
        <li><strong>Lead by example</strong> - Continue modeling the leadership behaviors your team values</li>
        <li><strong>Expand your influence</strong> - Consider taking on broader leadership responsibilities</li>
        <li><strong>Stay connected</strong> - Maintain regular feedback loops to sustain this high performance</li>
      </ul>
      {{else if (eq analytics.performance_category "good")}}
      <p><strong>💪 Strong Leadership Foundation</strong></p>
      <p>You have solid leadership skills with room for targeted improvement. Focus on:</p>
      <ul>
        <li><strong>Target your development area:</strong> Pay special attention to "{{ analytics.weakest_area }}"</li>
        <li><strong>Build on your strengths:</strong> Leverage your success in "{{ analytics.strongest_area }}"</li>
        <li><strong>Seek specific feedback</strong> - Have follow-up conversations with your team about improvement areas</li>
        <li><strong>Practice consistently</strong> - Focus on daily habits that reinforce good leadership behaviors</li>
      </ul>
      {{else if (eq analytics.performance_category "fair")}}
      <p><strong>📈 Growth Opportunity Identified</strong></p>
      <p>There are clear areas where focused development will make a significant impact:</p>
      <ul>
        <li><strong>Priority focus:</strong> Concentrate on improving "{{ analytics.weakest_area }}"</li>
        <li><strong>Leadership coaching</strong> - Consider working with a leadership coach for targeted development</li>
        <li><strong>Skill building</strong> - Invest in specific leadership training programs</li>
        <li><strong>Regular check-ins</strong> - Schedule monthly feedback sessions with your team</li>
      </ul>
      {{else}}
      <p><strong>🎯 Significant Development Needed</strong></p>
      <p>This feedback indicates important areas requiring immediate attention:</p>
      <ul>
        <li><strong>Structured leadership coaching</strong> - We strongly recommend professional leadership development</li>
        <li><strong>Focus on core behaviors</strong> - Clarity, accountability, and consistent feedback</li>
        <li><strong>Team relationship building</strong> - Invest time in understanding your team's needs and perspectives</li>
        <li><strong>Regular progress reviews</strong> - Implement weekly one-on-ones and monthly team feedback sessions</li>
      </ul>
      {{/if}}
      
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

  <div class="section">
    <h2>About This Report</h2>
    <div class="box">
      <p><strong>Methodology:</strong> This report is based on anonymous feedback from your team using validated leadership assessment questions. All responses are completely confidential.</p>
      
      <p><strong>Statistical Analysis:</strong> Scores represent averages across all responses. The distribution shows how many team members selected each rating level.</p>
      
      <p><strong>Confidentiality:</strong> Individual responses cannot be traced back to specific team members. Comments are presented exactly as written to preserve authenticity.</p>
      
      <p><strong>Follow-up Support:</strong> If you'd like help interpreting these results or creating a development plan, contact Cultivated HQ for personalized coaching support.</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>Generated on {{ formatDate(processed_at) }} | Cultivated HQ</strong></p>
    <p>For questions about this report or leadership development support, contact: <strong>chloe@cultivatedhq.com.au</strong></p>
    <p style="margin-top: 15px; font-size: 0.8em;">
      This report contains confidential leadership feedback. Please handle with appropriate discretion.
    </p>
  </div>

</body>
</html>