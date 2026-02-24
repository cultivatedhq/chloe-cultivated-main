import React from 'react';
import { ArrowRight, BarChart3, Shield, Users, FileText, Mail, Sparkles, CheckCircle } from 'lucide-react';

function SurveyTest() {
  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-6 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition">Home</a>
              <a href="/surveytest/create" className="bg-primary text-beige-50 px-6 py-2 rounded-full font-medium hover:bg-secondary transition">
                Create Survey
              </a>
              <a href="/surveytest/admin" className="border border-primary text-primary px-4 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition">
                Admin
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-32 grid-pattern">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary text-primary text-sm mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              Instant Feedback Testing Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight font-poppins">
              Survey <span className="gradient-text">Test</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige-600 mb-12 max-w-4xl mx-auto">
              Test anonymous feedback surveys with instant processing. Create surveys that expire in 1 minute and get professional PDF reports delivered immediately.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/surveytest/create"
                className="bg-primary text-beige-50 px-8 py-4 rounded-full font-semibold hover:bg-secondary transition flex items-center w-full sm:w-auto justify-center"
              >
                Create Test Survey
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a 
                href="#how-it-works"
                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition w-full sm:w-auto text-center"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">WHY SURVEY TEST</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins">Built for Rapid Testing</h2>
            <p className="text-beige-600 max-w-3xl mx-auto text-lg">
              Test your feedback systems quickly with instant processing and immediate report delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">1-Minute Expiry</h3>
              <p className="text-beige-600">Surveys automatically expire after 1 minute, perfect for quick testing and validation of your feedback systems.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Instant Reports</h3>
              <p className="text-beige-600">Professional PDF reports generated and delivered immediately when responses are submitted - no waiting required.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Real-Time Processing</h3>
              <p className="text-beige-600">Test your entire feedback workflow from survey creation to report delivery in minutes, not days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">SIMPLE PROCESS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins">How It Works</h2>
            <p className="text-beige-600 max-w-2xl mx-auto text-lg">
              From setup to insights in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Create Survey</h3>
              <p className="text-beige-600">Enter your details, customize questions if needed, and create your test survey in minutes.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Share Link</h3>
              <p className="text-beige-600">Get a unique survey link to share with your team via email, Slack, or any communication channel.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Team Responds</h3>
              <p className="text-beige-600">Your team provides anonymous feedback using our secure, mobile-friendly survey platform.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                4
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Instant Report</h3>
              <p className="text-beige-600">Receive a professional PDF report with insights and recommendations immediately in your inbox.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins">Everything You Need for Testing</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Quick Expiry</h3>
              <p className="text-beige-600 text-sm">1-minute expiry window perfect for rapid testing and validation.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Instant Processing</h3>
              <p className="text-beige-600 text-sm">Reports generated and delivered immediately when responses are submitted.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Professional Reports</h3>
              <p className="text-beige-600 text-sm">Beautifully formatted PDF reports with comprehensive analytics.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Anonymous Feedback</h3>
              <p className="text-beige-600 text-sm">Complete anonymity for honest, valuable feedback from your team.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Mobile Optimized</h3>
              <p className="text-beige-600 text-sm">Perfect experience on any device - desktop, tablet, or mobile.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <CheckCircle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">Secure & Private</h3>
              <p className="text-beige-600 text-sm">Enterprise-grade security with complete respondent anonymity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-poppins">
            Ready to Test Your Feedback System?
          </h2>
          <p className="text-xl text-beige-600 mb-12">
            Create a test survey and see how our instant processing works in real-time.
          </p>
          <div className="space-y-6">
            <a 
              href="/surveytest/create"
              className="bg-gradient-to-br from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-lg hover:shadow-lg transition inline-flex items-center border-2 border-white"
            >
              Create Your Test Survey
              <ArrowRight className="ml-3 w-5 h-5" />
            </a>
            <p className="text-sm text-beige-500">
              No logins. No fuss. Just brutally honest feedback.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-beige-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold gradient-text mb-4 font-poppins">Cultivated HQ</h4>
              <p className="text-beige-600">Survey Test - Instant Feedback Platform</p>
              <a href="mailto:chloe@cultivatedhq.com.au" className="text-primary hover:text-secondary transition">
                chloe@cultivatedhq.com.au
              </a>
            </div>
            <div className="text-right">
              <p className="text-beige-600">© 2024 All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SurveyTest;