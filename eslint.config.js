# Chloe James Coaching - Leadership Development Platform

A comprehensive leadership development platform featuring leadership coaching programs, clarity audits, anonymous feedback surveys, and leadership accelerator programs.

## Transfer Documentation

**Transferring this project to a new account?** See these guides:

- **[TRANSFER_QUICK_START.md](TRANSFER_QUICK_START.md)** - Quick checklist and 1-hour setup
- **[PROJECT_TRANSFER_GUIDE.md](PROJECT_TRANSFER_GUIDE.md)** - Complete step-by-step guide
- **[EXPORT_INSTRUCTIONS.md](EXPORT_INSTRUCTIONS.md)** - How to export the project files
- **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** - All environment variables explained
- **[EDGE_FUNCTIONS_GUIDE.md](EDGE_FUNCTIONS_GUIDE.md)** - Edge functions deployment guide

## Features

### 🎯 Clarity Audit
- **Leadership Assessment**: Comprehensive self-assessment for leaders
- **PDF Report Generation**: Professional reports with insights and recommendations
- **Email Delivery**: Automated delivery of results to participants
- **HubSpot Integration**: Webhook support for form submissions

### 📊 Leadership Pulse Check
- **Anonymous Feedback Surveys**: Create secure, anonymous feedback surveys for leadership development
- **3-Day Auto-Expiry**: Surveys automatically close after 3 days with automatic report generation
- **Professional PDF Reports**: Comprehensive analytics and insights delivered automatically
- **Real-time Analytics**: Track responses and engagement in real-time

### 🚀 Leadership Accelerator
- **6-Week Development Program**: Intensive in-person leadership development journey
- **Group Coaching**: Maximum 10 participants for focused attention
- **Implementation Tools**: Practical frameworks and accountability systems

### 👥 1:1 Leadership Coaching
- **Personalized Development**: Tailored coaching sessions for individual growth
- **Flexible Packages**: Single sessions to 12-week intensive programs
- **Practical Focus**: Real-world application and immediate implementation

### 🎓 Leadership Bootcamp
- **Online Group Program**: Virtual leadership development bootcamp
- **Enrollment System**: Online registration with Supabase backend
- **Flexible Learning**: Accessible from anywhere

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security (RLS)
- **Edge Functions** for serverless processing
- **Automated scheduling** for survey processing

### Database Schema

Key tables include:
- `survey_sessions` - Survey submission tracking
- `survey_responses` - Individual survey answers
- `generated_reports` - PDF report metadata
- `bootcamp_registrations` - Leadership bootcamp enrollments
- `pulse_check_sessions` - Pulse check surveys
- `pulse_check_responses` - Pulse check answers

All tables have Row Level Security (RLS) enabled. See migration files in `supabase/migrations/` for complete schema.

## Automated Survey Processing

### Daily Scheduled Processing
The system includes automated processing that runs daily to:

1. **Identify Expired Surveys**: Find surveys that have passed their 3-day window
2. **Generate Reports**: Create comprehensive PDF reports with analytics
3. **Send Notifications**: Email reports to survey creators
4. **Update Status**: Mark surveys as processed and inactive

### Edge Functions

This project includes 10 edge functions:

1. **clarity-audit-pdf** - Generates PDF reports for clarity audits
2. **generate-and-send-report-instant** - Creates and emails reports immediately
3. **generate-clarity-report** - Core report generation logic
4. **generate-pdf-report** - Generic PDF generation
5. **process-expired-sessions** - Cleanup job for old sessions
6. **receive-hubspot-form** - Webhook receiver for HubSpot
7. **send-clarity-email** - Email delivery for clarity reports
8. **send-notification** - General notification system
9. **send-results** - Survey results delivery
10. **test-pdf-report** - Testing endpoint for PDF generation

See [EDGE_FUNCTIONS_GUIDE.md](EDGE_FUNCTIONS_GUIDE.md) for detailed documentation.

## Security Features

### Row Level Security (RLS)
- **Anonymous Access**: Public surveys readable by anyone
- **Response Submission**: Anonymous users can submit responses to active, non-expired surveys
- **Admin Access**: Authenticated users can manage all sessions
- **Data Isolation**: Private sessions only accessible to authenticated users

### Data Privacy
- **Anonymous Responses**: No tracking or identification of respondents
- **Secure Storage**: All data encrypted at rest
- **GDPR Compliant**: Data handling follows privacy regulations

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development server
npm run dev

# Production build
npm run build
```

### Deployment

For complete deployment instructions, see:
- [TRANSFER_QUICK_START.md](TRANSFER_QUICK_START.md) - Quick setup (1 hour)
- [PROJECT_TRANSFER_GUIDE.md](PROJECT_TRANSFER_GUIDE.md) - Full guide

**Key Steps:**
1. Create new Supabase project
2. Apply database migrations
3. Deploy edge functions
4. Set environment variables
5. Deploy to Netlify

See the transfer guides for detailed instructions.

## Scheduled Processing Setup

### Option 1: Supabase Cron (Recommended)
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily processing at 8:00 AM
SELECT cron.schedule(
  'process-expired-surveys',
  '0 8 * * *',
  'SELECT net.http_post(
    url := ''https://your-project.supabase.co/functions/v1/process-expired-sessions'',
    headers := ''{"Authorization": "Bearer your-service-role-key"}''::jsonb
  );'
);
```

### Option 2: External Cron Service
Set up a daily cron job to call:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/process-expired-sessions \
  -H "Authorization: Bearer your-service-role-key"
```

### Option 3: GitHub Actions
```yaml
name: Process Expired Surveys
on:
  schedule:
    - cron: '0 8 * * *'  # Daily at 8:00 AM UTC
jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call Processing Function
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/process-expired-sessions \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}"
```

## Monitoring and Logging

### Function Logs
- All processing activities are logged with timestamps
- Error tracking and reporting
- Success/failure metrics
- Processing summaries

### Admin Dashboard
- View all surveys (public and private)
- Monitor response rates
- Track expiration status
- Download reports manually

## Development

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

### Database Migrations
Migrations are located in `supabase/migrations/` and should be applied in order:
1. `20250627033019_rustic_recipe.sql` - Initial schema
2. `20250627041601_mute_shape.sql` - Expiration and reporting features

### Edge Functions
Functions are located in `supabase/functions/`:
- `send-notification/` - Email notification handling
- `process-expired-sessions/` - Automated survey processing

## External Services Required

This project uses several external services:

### Required
- **Supabase** - Database and backend (free tier available)
- **Netlify** - Frontend hosting (free tier available)

### For Full Functionality
- **PDF.co** - PDF report generation (free tier available)
- **Resend** - Email delivery (100 emails/day free)
- **HubSpot** - Form integration (optional)

See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for API key setup.

## Project Structure

```
src/                    # React components
  ├── App.tsx                      # Main app and routing
  ├── ClarityAudit.tsx             # Clarity audit survey
  ├── LeadershipBootcamp.tsx       # Bootcamp information
  ├── LeadershipAccelerator.tsx    # Accelerator program
  ├── OneOnOneCoaching.tsx         # Coaching information
  └── components/                  # Shared components
      ├── PulseCheck/              # Pulse check surveys
      └── SurveyTest/              # Testing utilities

public/                 # Static assets and images

supabase/
  ├── migrations/       # Database schema (19 migration files)
  └── functions/        # Edge functions (10 functions)

logic/                  # Documentation and guides
```

## Documentation

- [PROJECT_TRANSFER_GUIDE.md](PROJECT_TRANSFER_GUIDE.md) - Complete transfer guide
- [TRANSFER_QUICK_START.md](TRANSFER_QUICK_START.md) - Quick setup checklist
- [EXPORT_INSTRUCTIONS.md](EXPORT_INSTRUCTIONS.md) - How to export files
- [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) - Environment setup
- [EDGE_FUNCTIONS_GUIDE.md](EDGE_FUNCTIONS_GUIDE.md) - Functions documentation
- [HUBSPOT_INTEGRATION_GUIDE.md](HUBSPOT_INTEGRATION_GUIDE.md) - HubSpot setup

## Support

For technical support or questions:
- Review the documentation guides above
- Check [Supabase Docs](https://supabase.com/docs)
- Check [Netlify Docs](https://docs.netlify.com)

## License

© 2024-2025 Chloe James Coaching. All rights reserved.