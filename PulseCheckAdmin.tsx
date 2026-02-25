import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight, Users, Target, Brain, TrendingUp, CheckCircle, Menu, X, MessageCircle, Award, Clock, Repeat, Zap, Shield } from 'lucide-react';

function LeadershipAcceleratorDetail() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < 100 || currentScrollY < lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
    });

    document.querySelectorAll('.fade-up').forEach((element) => {
      observerRef.current?.observe(element);
    });

    const loadCalendly = () => {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore
        window.Calendly?.initBadgeWidget({
          url: 'https://calendly.com/chloe-cultivatedhq/30min',
          text: 'Book your Strategy Session',
          color: '#2a9d8f',
          textColor: '#ffffff'
        });
      };

      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.body.removeChild(script);
        document.head.removeChild(link);
      };
    };

    const timer = setTimeout(loadCalendly, 2000);

    return () => {
      observerRef.current?.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 bg-beige-50/95 backdrop-blur-sm shadow-sm transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>

            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-beige-800" />
              ) : (
                <Menu className="w-6 h-6 text-beige-800" />
              )}
            </button>

            <div className="hidden md:flex space-x-8 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition">Home</a>
              <a href="/coaching" className="text-beige-500 hover:text-primary transition">1:1 Coaching</a>
              <a href="/#framework" className="text-beige-500 hover:text-primary transition">Framework</a>
              <a href="/#expertise" className="text-beige-500 hover:text-primary transition">Expertise</a>
              <a
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-6 py-2 rounded-full font-medium hover:bg-secondary transition"
              >
                Get Started
              </a>
            </div>
          </div>

          <div
            className={`md:hidden absolute left-0 right-0 top-full bg-beige-50/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out z-50 ${
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="flex flex-col p-6 space-y-4">
              <a href="/" onClick={closeMenu} className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200">
                Home
              </a>
              <a href="/coaching" onClick={closeMenu} className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200">
                1:1 Coaching
              </a>
              <a href="/#framework" onClick={closeMenu} className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200">
                Framework
              </a>
              <a href="/#expertise" onClick={closeMenu} className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200">
                Expertise
              </a>
              <a
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-6 py-2 rounded-full font-medium hover:bg-secondary transition w-full text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen grid-pattern">
        <div className="relative max-w-7xl mx-auto px-6 pt-48 md:pt-64 pb-32 md:pb-48 hero-content">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary text-primary text-sm mb-8 fade-up">
              <Clock className="w-4 h-4 mr-2" />
              3–12 Month Leadership Capability Build
            </span>
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-8 leading-tight fade-up font-poppins">
              Leadership <span className="gradient-text">Accelerator</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige-600 mb-12 fade-up max-w-3xl mx-auto">
              A structured, facilitated development journey designed to strengthen your leadership team over time - not through one-off workshops, but through intentional capability building embedded into your business rhythm.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 hero-buttons fade-up">
              <a
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-8 py-4 rounded-full font-semibold hover:bg-secondary transition flex items-center w-full sm:w-auto justify-center"
              >
                Book a Leadership Strategy Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center w-full">
          <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
        </div>
      </header>

      {/* Introduction */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-poppins text-beige-900">
              Leadership capability doesn't develop by accident.
            </h2>
            <div className="max-w-2xl mx-auto space-y-6 text-lg text-beige-700">
              <p>As businesses grow, complexity increases.</p>
              <p className="text-2xl font-light text-beige-800">More people. More decisions. Higher expectations.</p>
              <p className="mt-8">
                The Leadership Accelerator is a structured, facilitated development journey designed to strengthen your leadership team over time - not through one-off workshops, but through intentional capability building embedded into your business rhythm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why 3-12 Months */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-poppins text-beige-900">
              Why 3–12 Months?
            </h2>
            <p className="text-xl text-beige-600 max-w-3xl mx-auto mb-12">
              Real capability requires:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up text-center">
              <Repeat className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Repetition</h3>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Practice</h3>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up text-center">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Application</h3>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Accountability</h3>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center fade-up">
            <div className="bg-gradient-to-br from-primary to-secondary p-12 rounded-3xl text-white">
              <p className="text-2xl font-light mb-4">Short programs create awareness.</p>
              <p className="text-3xl font-bold">Sustained development creates behavioural change.</p>
              <p className="text-lg mt-8">
                The Leadership Accelerator is delivered over 3, 6, or 12 months depending on your business stage and depth of need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Focus On */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">CAPABILITY BUILD</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins text-beige-900">
              What We Focus On
            </h2>
            <p className="text-xl text-beige-600 max-w-3xl mx-auto mb-8">
              This isn't theory.
            </p>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              It's practical leadership capability that improves execution.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-beige-900">Alignment & Accountability</h3>
                  <p className="text-beige-700 text-lg">Clarifying decision rights, ownership standards, and behavioural expectations.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-beige-900">Communication & Feedback</h3>
                  <p className="text-beige-700 text-lg">Building consistency in performance conversations and leadership presence.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-beige-900">Confidence & Authority</h3>
                  <p className="text-beige-700 text-lg">Strengthening managers' ability to lead decisively as complexity increases.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-beige-900">Execution Discipline</h3>
                  <p className="text-beige-700 text-lg">Turning meetings into measurable action and reducing escalation.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up hover:shadow-lg transition">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-beige-900">Embedding Leadership Standards</h3>
                  <p className="text-beige-700 text-lg">Ensuring leadership behaviours align with business priorities - not just personal style.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It's Delivered */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">DELIVERY MODEL</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins text-beige-900">
              How It's Delivered
            </h2>
            <p className="text-xl text-beige-600 max-w-2xl mx-auto">
              The structure is flexible but intentional.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-12 rounded-3xl shadow-lg fade-up">
              <p className="text-lg text-beige-700 mb-8">
                Depending on your needs, the Accelerator may include:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">Monthly facilitated leadership sessions</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">Quarterly alignment intensives</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">1:1 coaching for senior leaders</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">Real-time issue facilitation</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">Leadership KPI integration</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-beige-700">Accountability structure design</span>
                </div>
              </div>

              <div className="mt-12 p-6 bg-beige-50 rounded-2xl border-l-4 border-primary">
                <p className="text-beige-800 font-semibold text-lg">
                  Everything is grounded in your real operational challenges - not generic case studies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">IDEAL FIT</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins text-beige-900">
              Who This Is For
            </h2>
            <p className="text-xl text-beige-600 max-w-2xl mx-auto">
              This is designed for businesses that:
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary to-secondary p-12 rounded-3xl text-white fade-up">
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-7 h-7 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-lg">Have 4–10 people in leadership roles</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-7 h-7 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-lg">Are navigating growth or increased complexity</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-7 h-7 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-lg">Have promoted strong operators into leadership</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-7 h-7 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-lg">Want consistent decision-making and accountability</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-7 h-7 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-lg">Are ready to intentionally build leadership capability over time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">RESULTS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 font-poppins text-beige-900">
              Outcomes You Can Expect
            </h2>
            <p className="text-xl text-beige-600 max-w-3xl mx-auto">
              By the end of the engagement, leadership teams typically demonstrate:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Greater Decision Confidence</h3>
              <p className="text-beige-600">Leaders make decisions with clarity and authority, without constant escalation.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <Target className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Clearer Ownership</h3>
              <p className="text-beige-600">Accountability is clearly defined across all functions and levels.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Stronger Performance Conversations</h3>
              <p className="text-beige-600">Consistent, effective feedback that drives improvement and growth.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <Users className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Reduced Senior Leader Dependency</h3>
              <p className="text-beige-600">Teams operate effectively without constant oversight from founders or executives.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <CheckCircle className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Improved Follow-Through</h3>
              <p className="text-beige-600">Actions are tracked, completed, and tied to measurable outcomes.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <TrendingUp className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Better Execution</h3>
              <p className="text-beige-600">Strategy translates into action consistently across the leadership team.</p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center fade-up">
            <div className="bg-white p-10 rounded-3xl shadow-lg border-2 border-beige-200">
              <p className="text-2xl text-beige-800 font-light mb-4">
                Not because they attended training -
              </p>
              <p className="text-3xl font-bold text-beige-900">
                but because capability was built and reinforced over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The First Step */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="fade-up">
            <span className="text-primary text-sm uppercase tracking-wider font-bold">GET STARTED</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-8 font-poppins text-beige-900">
              The First Step
            </h2>
            <p className="text-xl text-beige-600 mb-8 max-w-2xl mx-auto">
              Every engagement begins with a Leadership Alignment Conversation.
            </p>
            <p className="text-lg text-beige-700 mb-12 max-w-3xl mx-auto">
              We assess your current leadership capability stage and determine the right structure - 3, 6, or 12 months - based on your goals and growth trajectory.
            </p>
            <a
              href="https://calendly.com/chloe-cultivatedhq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-lg hover:shadow-lg transition inline-flex items-center border-2 border-white"
            >
              Book a Leadership Strategy Call
              <ArrowRight className="ml-3 w-5 h-5" />
            </a>
            <p className="text-sm text-beige-500 mt-6">
              20 minute strategy call • No obligation • Explore fit
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-beige-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold gradient-text mb-4 font-poppins">Cultivated HQ</h4>
              <p className="text-beige-600 mb-4">From Chaos to Clarity: Leadership That Lasts</p>
              <a href="mailto:chloe@cultivatedhq.com.au" className="text-primary hover:text-secondary transition">
                chloe@cultivatedhq.com.au
              </a>
            </div>
            <div>
              <h5 className="font-bold mb-4">Services</h5>
              <div className="space-y-2">
                <a href="/accelerator" className="block text-beige-600 hover:text-primary transition">
                  Leadership Accelerator
                </a>
                <a href="/coaching" className="block text-beige-600 hover:text-primary transition">
                  1:1 Leadership Coaching
                </a>
                <a href="/#framework" className="block text-beige-600 hover:text-primary transition">
                  Our Framework
                </a>
              </div>
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

export default LeadershipAcceleratorDetail;
