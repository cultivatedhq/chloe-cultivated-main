import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function ClarityAuditRedirect() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectStatus, setRedirectStatus] = useState<'initial' | 'loading' | 'success'>('initial');

  useEffect(() => {
    // Get sessionId from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for direct HubSpot parameters
    const email = urlParams.get('email');
    const firstname = urlParams.get('firstname');
    const lastname = urlParams.get('lastname');
    const phone = urlParams.get('phone');
    const company = urlParams.get('company');
    const sessionId = urlParams.get('sessionId');
    
    // This is the redirect page after HubSpot form submission
    // Show success message briefly, then redirect to the audit
    setIsLoading(false);
    setRedirectStatus('success');
    
    // Store email and name if present in URL
    if (email) {
      localStorage.setItem('clarityAuditUserEmail', email);
      console.log('Email stored from HubSpot redirect:', email);
    }
    
    if (firstname) {
      localStorage.setItem('clarityAuditUserName', firstname);
      console.log('Name stored from HubSpot redirect:', firstname);
    }
    
    if (lastname) {
      localStorage.setItem('clarityAuditUserLastName', lastname);
      console.log('Last name stored from HubSpot redirect:', lastname);
    }
    if (phone) {
      localStorage.setItem('clarityAuditUserPhone', phone);
      console.log('Phone stored from HubSpot redirect:', phone);
    }
    if (company) {
      localStorage.setItem('clarityAuditUserCompany', company);
      console.log('Company stored from HubSpot redirect:', company);
    }
    
    // Store in localStorage that they've completed the form
    localStorage.setItem('clarityAuditFormCompleted', 'true');
    
    // Store sessionId in localStorage if available
    if (sessionId) {
      localStorage.setItem('clarityAuditSessionId', sessionId);
      console.log('Session ID stored from HubSpot redirect:', sessionId);
    }
    
    // Redirect to the audit page after a short delay
    const timer = setTimeout(() => {
      // Pass sessionId as a parameter if available
      if (sessionId || email) {
        const params = new URLSearchParams();
        if (sessionId) params.append('sessionId', sessionId);
        if (email) params.append('email', email);
        if (firstname) params.append('firstname', firstname);
        
        navigate(`/clarityauditentry?sessionId=${encodeURIComponent(sessionId)}`);
      } else {
        navigate('/clarityauditentry');
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-6 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition">Home</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-6 font-poppins">Thank You for Registering!</h1>
          
          <p className="text-lg text-beige-600 mb-8 max-w-2xl mx-auto">
            Your registration is complete. You're now being redirected to the Leadership Clarity Audit.
          </p>

          <div className="animate-pulse">
            <p className="text-primary font-medium">Redirecting you in a few seconds...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClarityAuditRedirect;
