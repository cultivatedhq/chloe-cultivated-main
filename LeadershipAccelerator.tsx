import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, CheckCircle, Shield, Brain, Target } from 'lucide-react';

function ClarityAuditLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already completed the form
    const formCompleted = localStorage.getItem('clarityAuditFormCompleted');
    if (formCompleted === 'true') {
      // Redirect directly to the audit entry page
      navigate('/clarityauditentry');
      return;
    }

    // Add animation for elements when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
    });

    document.querySelectorAll('.fade-up').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navigate]);

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

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Leadership Clarity Audit</h1>
          <p className="text-2xl text-primary font-medium mb-4">Find out what's working, what's not, and how to fix it</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12 fade-up">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Compass className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 font-poppins">Before We Begin</h2>
              <p className="text-beige-600 mb-4">
                We need to collect a few details from you before you start the Leadership Clarity Audit. This helps us:
              </p>
              <ul className="space-y-2 text-beige-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Provide personalized insights based on your role and team size</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Follow up with additional resources tailored to your needs</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <a 
              href="https://share-ap1.hsforms.com/1TmtlcZixSN-RGx_WhwOhgw7b5o2s?redirectUri=https://www.cultivatedhq.com.au/clarityauditredirect" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-semibold transition inline-flex items-center"
            >
              Let's Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md fade-up">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">10 Minutes to Complete</h3>
            <p className="text-beige-600 text-sm">The audit takes just 10 minutes to complete and provides immediate insights.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md fade-up">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Actionable Insights</h3>
            <p className="text-beige-600 text-sm">Get practical recommendations you can implement right away.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md fade-up">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Completely Secure</h3>
            <p className="text-beige-600 text-sm">Your information is kept private and secure at all times.</p>
          </div>
        </div>
        
        <div className="text-center fade-up">          
          <p className="text-sm text-beige-500 mt-4">
            Your data is protected and will never be shared with third parties.
          </p>
        </div>
      </div>
      
      <footer className="py-8 border-t border-beige-200 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-beige-600 text-sm">© 2024 Cultivated HQ. All rights reserved.</p>
            </div>
            <div>
              <a href="mailto:chloe@cultivatedhq.com.au" className="text-primary hover:text-secondary transition text-sm">
                chloe@cultivatedhq.com.au
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ClarityAuditLanding;