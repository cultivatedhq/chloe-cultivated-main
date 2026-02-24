import React from 'react';
import { CheckCircle, ArrowRight, Shield, Sparkles, Heart } from 'lucide-react';

function PulseCheckThankYou() {
  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-6 font-poppins">Thank You for Your Feedback!</h1>
          
          <p className="text-lg text-beige-600 mb-8">
            Your anonymous feedback has been submitted successfully and will help create valuable insights for leadership development.
          </p>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              <span className="font-semibold text-primary">Your Impact</span>
            </div>
            <p className="text-sm text-beige-700">
              Your honest feedback helps leaders grow and improve<br/>
              Contributes to better team culture and communication<br/>
              Enables targeted leadership development and coaching<br/>
              Strengthens the overall leadership effectiveness
            </p>
          </div>

          <div className="bg-beige-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary mr-2" />
              <span className="font-semibold text-primary">Privacy Confirmed</span>
            </div>
            <p className="text-sm text-beige-600">
              Your responses are completely anonymous and secure<br/>
              No individual responses can be traced back to you<br/>
              Only aggregated insights will be shared<br/>
              Your privacy is our top priority
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600 mr-2" />
              <span className="font-semibold text-green-600">What Happens Next?</span>
            </div>
            <div className="text-sm text-beige-700 space-y-2">
              <p>Your feedback joins other anonymous responses</p>
              <p>A comprehensive report will be generated automatically</p>
              <p>Your manager will receive insights and development recommendations</p>
              <p>This leads to better leadership and team experiences</p>
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href="/pulsecheck"
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary transition inline-flex items-center"
            >
              Return to Pulse Check Home
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            
            <div className="text-center">
              <p className="text-sm text-beige-500 mb-2">
                Want to learn more about leadership development?
              </p>
              <a 
                href="/"
                className="text-primary hover:text-secondary transition text-sm font-medium"
              >
                Visit Cultivated HQ →
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-beige-200">
            <p className="text-xs text-beige-400">
              You can now safely close this window
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PulseCheckThankYou;