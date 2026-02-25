import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import LeadershipAccelerator from './LeadershipAccelerator.tsx';
import LeadershipAcceleratorDetail from './LeadershipAcceleratorDetail.tsx';
import LeadershipBootcamp from './LeadershipBootcamp.tsx';
import BootcampWelcome from './BootcampWelcome.tsx';
import BootcampEnrollment from './BootcampEnrollment.tsx';
import OneOnOneCoaching from './OneOnOneCoaching.tsx';
import ClarityAuditLanding from './ClarityAuditLanding.tsx';
import ClarityAudit from './ClarityAudit.tsx';
import ClarityAuditRedirect from './ClarityAuditRedirect.tsx';
import PulseCheck from './components/PulseCheck/PulseCheck.tsx';
import PulseCheckCreate from './components/PulseCheck/PulseCheckCreate.tsx';
import PulseCheckSurvey from './components/PulseCheck/PulseCheckSurvey.tsx';
import PulseCheckAdmin from './components/PulseCheck/PulseCheckAdmin.tsx';
import PulseCheckResults from './components/PulseCheck/PulseCheckResults.tsx';
import PulseCheckThankYou from './components/PulseCheck/PulseCheckThankYou.tsx';
import SurveyTest from './components/SurveyTest/SurveyTest.tsx';
import SurveyTestCreate from './components/SurveyTest/SurveyTestCreate.tsx';
import SurveyTestSurvey from './components/SurveyTest/SurveyTestSurvey.tsx';
import SurveyTestAdmin from './components/SurveyTest/SurveyTestAdmin.tsx';
import SurveyTestResults from './components/SurveyTest/SurveyTestResults.tsx';
import SurveyTestThankYou from './components/SurveyTest/SurveyTestThankYou.tsx';
import './index.css';

// Get the current pathname
const pathname = window.location.pathname;

// Create the main app component with routing
function MainApp() {
  // If we're on a pulse check route, use React Router
  if (pathname.startsWith('/pulsecheck')) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/pulsecheck" element={<PulseCheck />} />
          <Route path="/pulsecheck/create" element={<PulseCheckCreate />} />
          <Route path="/pulsecheck/admin" element={<PulseCheckAdmin />} />
          <Route path="/pulsecheck/survey/:sessionId" element={<PulseCheckSurvey />} />
          <Route path="/pulsecheck/results/:sessionId" element={<PulseCheckResults />} />
          <Route path="/pulsecheck/thankyou" element={<PulseCheckThankYou />} />
          {/* Fallback to main pulse check page */}
          <Route path="*" element={<PulseCheck />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If we're on a survey test route, use React Router
  if (pathname.startsWith('/surveytest')) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/surveytest" element={<SurveyTest />} />
          <Route path="/surveytest/create" element={<SurveyTestCreate />} />
          <Route path="/surveytest/admin" element={<SurveyTestAdmin />} />
          <Route path="/surveytest/survey/:sessionId" element={<SurveyTestSurvey />} />
          <Route path="/surveytest/results/:sessionId" element={<SurveyTestResults />} />
          <Route path="/surveytest/thankyou" element={<SurveyTestThankYou />} />
          {/* Fallback to main survey test page */}
          <Route path="*" element={<SurveyTest />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // For other routes, use simple component rendering
  if (pathname === '/accelerator') {
    return <LeadershipAcceleratorDetail />;
  } else if (pathname === '/leadershipaccelerator') {
    return <LeadershipAccelerator />;
  } else if (pathname === '/bootcamp') {
    return <LeadershipBootcamp />;
  } else if (pathname === '/bootcamp-welcome') {
    return <BootcampWelcome />;
  } else if (pathname === '/bootcamp-enroll') {
    return <BootcampEnrollment />;
  } else if (pathname.startsWith('/clarityaudit')) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/clarityaudit" element={<ClarityAuditLanding />} />
          <Route path="/clarityauditentry" element={<ClarityAudit />} />
          <Route path="/clarityauditredirect" element={<ClarityAuditRedirect />} />
          <Route path="/clarityauditpage" element={<ClarityAudit />} />
          {/* Fallback to redirect page */}
          <Route path="*" element={<ClarityAuditRedirect />} />
        </Routes>
      </BrowserRouter>
    );
  } else if (pathname === '/coaching') {
    return <OneOnOneCoaching />;
  } else {
    return <App />;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);