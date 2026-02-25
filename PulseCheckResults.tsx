import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight, Sparkles, Target, Zap, Users, Brain, Trophy, Quote, Menu, X, Clock, CheckCircle, Star, Calendar, Award, TrendingUp, MessageCircle, Heart, Shield, Lightbulb, User, Compass, Rocket } from 'lucide-react';

function OneOnOneCoaching() {
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
          text: "Let's Chat!",
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
            
            {/* Mobile Menu Button */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition">Home</a>
              <a href="/leadershipaccelerator" className="text-beige-500 hover:text-primary transition">Custom Leadership Workshops</a>
              <a href="/#framework" className="text-beige-500 hover:text-primary transition">Framework</a>
              <a href="/#expertise" className="text-beige-500 hover:text-primary transition">Expertise</a>
              <a href="/#results" className="text-beige-500 hover:text-primary transition">Results</a>
              <a 
                href="https://calendly.com/cbjames674/15min" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary text-beige-50 px-6 py-2 rounded-full font-medium hover:bg-secondary transition"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div 
            className={`md:hidden absolute left-0 right-0 top-full bg-beige-50/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out z-50 ${
              isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="flex flex-col p-6 space-y-4">
              <a
                href="/"
                onClick={closeMenu}
                className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
              >
                Home
              </a>
              <a
                href="/leadershipaccelerator"
                onClick={closeMenu}
                className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
              >
                Custom Leadership Workshops
              </a>
              <a 
                href="/#framework" 
                onClick={closeMenu} 
                className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
              >
                Framework
              </a>
              <a 
                href="/#expertise" 
                onClick={closeMenu} 
                className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
              >
                Expertise
              </a>
              <a 
                href="/#results" 
                onClick={closeMenu} 
                className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
              >
                Results
              </a>
              <a 
                href="https://calendly.com/cbjames674/15min"
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
              <User className="w-4 h-4 mr-2" />
              Personalised Leadership Development
            </span>
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-8 leading-tight fade-up font-poppins">
              1:1 Leadership <span className="gradient-text">Coaching</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige-600 mb-12 fade-up max-w-4xl mx-auto">
              Unlock your leadership potential with personalised coaching designed to accelerate your growth, strengthen your impact, and build the confidence to lead with clarity and purpose.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 hero-buttons fade-up">
              <a 
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-8 py-4 rounded-full font-semibold hover:bg-secondary transition flex items-center w-full sm:w-auto justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a 
                href="#coaching-details"
                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition w-full sm:w-auto text-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center w-full">
          <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
        </div>
      </header>

      {/* Coaching Overview */}
      <section id="coaching-details" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">PERSONALISED DEVELOPMENT</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Why 1:1 Coaching?</h2>
            <p className="text-beige-600 max-w-4xl mx-auto text-lg fade-up">
              Leadership isn't one size fits all. Your challenges are unique, your goals are specific, and your growth deserves a personalised approach that meets you exactly where you are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="fade-up">
              <h3 className="text-3xl font-bold mb-6 font-poppins">The Challenge</h3>
              <div className="space-y-4 text-beige-600">
                <p>• You're ready to step up but need clarity on how</p>
                <p>• Generic leadership advice doesn't address your specific situation</p>
                <p>• You want to build confidence in your leadership decisions</p>
                <p>• You need someone to challenge your thinking and hold you accountable</p>
                <p>• You're looking for practical strategies, not just theory</p>
              </div>
            </div>
            <div className="fade-up">
              <h3 className="text-3xl font-bold mb-6 font-poppins">The Solution</h3>
              <div className="space-y-4 text-beige-600">
                <p>• Completely personalised coaching tailored to your goals</p>
                <p>• Deep dive sessions that address your real challenges</p>
                <p>• Practical tools and frameworks you can use immediately</p>
                <p>• Ongoing support and accountability between sessions</p>
                <p>• Flexible scheduling that works with your busy life</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary p-12 rounded-3xl text-white text-center fade-up">
            <h3 className="text-3xl font-bold mb-6">Coaching Investment</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 p-8 rounded-2xl">
                <div className="text-4xl font-bold mb-4">$350</div>
                <h4 className="text-xl font-bold mb-4">Single Session</h4>
                <ul className="text-left space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>60 minute focused coaching session</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Personalised action plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Follow up resources and tools</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/20 p-8 rounded-2xl border-2 border-white">
                <div className="text-4xl font-bold mb-4">$2,400</div>
                <h4 className="text-xl font-bold mb-4">6 Session Package</h4>
                <ul className="text-left space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>6 x 60 minute coaching sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Comprehensive leadership assessment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Between session support via email</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Personalised leadership development plan</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/30 p-8 rounded-2xl border-2 border-white">
                <div className="text-4xl font-bold mb-4">$4,800</div>
                <h4 className="text-xl font-bold mb-4">12 Week Intensive</h4>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>12 x 60 minute 1:1 sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited support access between sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Weekly progress check ins</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Custom leadership growth framework + toolkit</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Goal setting, accountability, and transformation tracking ($800 value)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We'll Work On */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">COACHING FOCUS AREAS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">What We'll Work On Together</h2>
            <p className="text-beige-600 max-w-3xl mx-auto text-lg fade-up">
              Every coaching relationship is unique, but here are the core areas where leaders typically see the most transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Leadership Vision & Purpose</h3>
              <p className="text-beige-600">Define your leadership identity, clarify your values, and create a compelling vision that guides your decisions and inspires others.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Communication & Influence</h3>
              <p className="text-beige-600">Master difficult conversations, build your influence without authority, and communicate with clarity and impact in any situation.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Emotional Intelligence</h3>
              <p className="text-beige-600">Develop self awareness, manage your emotions under pressure, and build stronger relationships through empathy and understanding.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Strategic Thinking</h3>
              <p className="text-beige-600">Think bigger picture, make better decisions, and develop the strategic mindset needed to drive long term success.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Team Leadership</h3>
              <p className="text-beige-600">Build high performing teams, navigate team dynamics, and create a culture where people thrive and deliver their best work.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Change & Growth</h3>
              <p className="text-beige-600">Lead through change with confidence, drive innovation, and create sustainable growth for yourself and your organisation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">THE PROCESS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">How Coaching Works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Discovery Session</h3>
                    <p className="text-beige-600">We start with a deep dive conversation to understand your current challenges, goals, and what success looks like for you.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personalised Plan</h3>
                    <p className="text-beige-600">Based on our discovery, I create a tailored coaching plan that addresses your specific needs and accelerates your growth.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Regular Sessions</h3>
                    <p className="text-beige-600">We meet regularly (typically fortnightly) for focused 60 minute sessions that combine insight, strategy, and practical application.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
                    <p className="text-beige-600">Between sessions, you have access to resources, tools, and email support to keep you moving forward.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fade-up">
              <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200">
                <h3 className="text-2xl font-bold mb-6 font-poppins">Session Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary mr-3" />
                    <span><strong>Duration:</strong> 60 minutes per session</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-3" />
                    <span><strong>Frequency:</strong> Weekly or Fortnightly (flexible scheduling)</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-primary mr-3" />
                    <span><strong>Format:</strong> Video call</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-primary mr-3" />
                    <span><strong>Confidentiality:</strong> Completely confidential space</span>
                  </div>
                </div>

                <a
                  href="https://calendly.com/chloe-cultivatedhq/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 p-6 bg-primary rounded-xl text-white block hover:bg-secondary transition"
                >
                  <h4 className="font-bold mb-2">Ready to Get Started?</h4>
                  <p className="text-lg">Book your discovery session today</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">IDEAL CLIENTS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Is This Right for You?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="fade-up">
              <h3 className="text-2xl font-bold mb-6 text-primary font-poppins">✓ Perfect If You Are:</h3>
              <ul className="space-y-4 text-beige-700">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>A current or aspiring leader ready to invest in your growth</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Committed to doing the work and implementing what you learn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Open to feedback and willing to challenge yourself</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Looking for practical solutions, not just theory</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Want to make a meaningful impact in your role and organisation</span>
                </li>
              </ul>
            </div>

            <div className="fade-up">
              <h3 className="text-2xl font-bold mb-6 text-secondary font-poppins">✗ Not Right If You:</h3>
              <ul className="space-y-4 text-beige-700">
                <li className="flex items-start">
                  <X className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Are looking for someone to give you all the answers</span>
                </li>
                <li className="flex items-start">
                  <X className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Want a quick fix without putting in the effort</span>
                </li>
                <li className="flex items-start">
                  <X className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Aren't willing to be vulnerable and honest about challenges</span>
                </li>
                <li className="flex items-start">
                  <X className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Prefer to stay in your comfort zone</span>
                </li>
                <li className="flex items-start">
                  <X className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Are resistant to change or new perspectives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">SUCCESS STORIES</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Coaching Transformations</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-beige-700 mb-8 text-lg">
                "Working with Chloe has genuinely shifted how I show up as a leader. I'm more emotionally aware, better at handling tough conversations, and more confident in how I lead. I understand my team on a deeper level and lead with more patience, clarity, and empathy. It's been a game-changer."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Stefan Schaar</p>
                  <p className="text-sm text-beige-600">Operations Manager, Komatsu</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-beige-700 mb-8 text-lg">
                "Chloe helped me step back from the day to day and focus on being the kind of leader my business needs. Her coaching built my confidence and transformed how I connect with my team. She's the most affable, easy to work with coach I've ever met."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Courtney Denyer</p>
                  <p className="text-sm text-beige-600">Business Manager, QFS Solutions Pty Ltd</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">WHY CHOOSE CHLOE</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">What Makes This Different</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-12 rounded-3xl border border-beige-200 fade-up">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4 font-poppins">Real Experience, Real Results</h3>
              </div>
              
              <div className="text-lg text-beige-700 space-y-6">
                <p>
                  I'm not just a coach who's read the books – I've lived the leadership journey. With 10+ years in senior leadership roles, I've faced the same challenges you're facing right now.
                </p>
                
                <p>
                  I've managed large teams, navigated complex organisational politics, dealt with difficult conversations, and led through change and uncertainty. I know what it's like to feel the weight of leadership responsibility.
                </p>
                
                <div className="bg-primary/10 p-6 rounded-2xl">
                  <h4 className="font-bold text-primary mb-3">My Approach:</h4>
                  <ul className="space-y-2 text-beige-700">
                    <li>• <strong>No fluff:</strong> Practical, actionable strategies you can use immediately</li>
                    <li>• <strong>Real talk:</strong> Honest conversations about the realities of leadership</li>
                    <li>• <strong>Your agenda:</strong> We focus on what matters most to you and your goals</li>
                    <li>• <strong>Sustainable change:</strong> Building habits and mindsets that last</li>
                    <li>• <strong>Confidential space:</strong> A safe place to explore challenges without judgment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 fade-up font-poppins">
            Ready to Unlock Your Leadership Potential?
          </h2>
          <p className="text-xl text-beige-600 mb-12 fade-up">
            Your leadership journey starts with a single conversation. Let's explore how coaching can accelerate your growth and help you become the leader you're meant to be.
          </p>
          <div className="space-y-6 fade-up">
            <a 
              href="https://calendly.com/chloe-cultivatedhq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-lg hover:shadow-lg transition inline-flex items-center border-2 border-white"
            >
              Book Your Discovery Session
              <ArrowRight className="ml-3 w-5 h-5" />
            </a>
            <p className="text-sm text-beige-500">
              15 minute discovery call • No obligation • Completely confidential
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-beige-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-2xl font-bold gradient-text mb-4 font-poppins">Cultivated HQ</h4>
              <p className="text-beige-600">From Chaos to Clarity: Leadership That Lasts</p>
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

export default OneOnOneCoaching;