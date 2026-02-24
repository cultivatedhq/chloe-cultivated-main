import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight, Sparkles, Target, Zap, Users, Brain, Trophy, Quote, Menu, X, Clock, CheckCircle, Star, Calendar, Award, TrendingUp, BookOpen, MessageCircle, BarChart3 } from 'lucide-react';

function LeadershipAccelerator() {
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
          text: 'Book your 30min Strategy Session',
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
              <Users className="w-4 h-4 mr-2" />
              Custom Workshops
            </span>
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-8 leading-tight fade-up font-poppins">
              Leadership <span className="gradient-text">Workshops</span>
            </h1>
            <p className="text-xl md:text-2xl text-beige-600 mb-12 fade-up max-w-4xl mx-auto">
              Custom workshops for your team - designed around your people, your culture, and the leadership challenges you care about.
            </p>
            <p className="text-lg text-beige-600 mb-12 fade-up max-w-3xl mx-auto">
              Not a one-size-fits-all program. These are tailored sessions built around the real situations your leaders are facing, so your team walks away with practical tools they can use today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 hero-buttons fade-up">
              <a
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-8 py-4 rounded-full font-semibold hover:bg-secondary transition flex items-center w-full sm:w-auto justify-center"
              >
                Start the Conversation
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="#workshop-details"
                className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-white transition w-full sm:w-auto text-center"
              >
                Explore Options
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-center w-full">
          <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
        </div>
      </header>

      {/* Intro Section */}
      <section id="workshop-details" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Built Around Your Reality</h2>
            <p className="text-beige-600 max-w-4xl mx-auto text-lg fade-up">
              Whether you're building new leaders, strengthening team alignment, or lifting performance across functions, these workshops are designed to move the needle.
            </p>
          </div>
        </div>
      </section>

      {/* What We Can Work On */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">WHAT WE CAN WORK ON</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">We Customise Based on What Matters Most</h2>
            <p className="text-beige-600 max-w-3xl mx-auto text-lg fade-up">
              Common themes we work on with organisations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-poppins">People & Culture</h3>
              <ul className="space-y-3 text-beige-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Clarifying expectations without ambiguity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Building trust and psychological safety</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Performance conversations that land</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Inclusion and engagement strategies</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-poppins">Leadership Fundamentals</h3>
              <ul className="space-y-3 text-beige-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Defining leadership behaviours that stick</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Feedback frameworks that actually get used</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Decision-making with clarity and speed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Role clarity for teams in growth mode</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-poppins">Team Performance</h3>
              <ul className="space-y-3 text-beige-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Cross-team collaboration and handovers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Accountability rhythms that show up</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Setting goals that teams actually commit to</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Avoiding dependency on individual leaders</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 font-poppins">Change & Adaptation</h3>
              <ul className="space-y-3 text-beige-600">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Helping teams navigate ambiguity</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Embedding new ways of working</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                  <span>Leading through uncertainty without burnout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">WHAT YOU GET</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Every Workshop Includes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Pre-session diagnosis</h3>
              <p className="text-beige-600">We build around your reality, not generic frameworks</p>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Practical tools and models</h3>
              <p className="text-beige-600">That can be used immediately in your day-to-day work</p>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Action planning</h3>
              <p className="text-beige-600">Clear next steps after the session to maintain momentum</p>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Support materials</h3>
              <p className="text-beige-600">Templates and resources to support ongoing implementation</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white fade-up">
            <h3 className="text-2xl font-bold mb-4 text-center">Workshops are available:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Sparkles className="w-8 h-8 mb-3" />
                <p className="font-semibold">As stand-alone modules</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="w-8 h-8 mb-3" />
                <p className="font-semibold">In series to build capability over time</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 mb-3" />
                <p className="font-semibold">Online or in-person where possible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Format & Options */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">FORMAT & OPTIONS</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Flexible Delivery to Suit Your Team</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Custom single workshops</h3>
              <p className="text-beige-600 mb-6">90-minute focused sessions on specific leadership challenges</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Workshop series</h3>
              <p className="text-beige-600 mb-6">Tailored to your people and culture goals, building capability over time</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg fade-up">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-poppins">Designed for</h3>
              <p className="text-beige-600 mb-6">Leaders, team leads, emerging leaders, and teams</p>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 fade-up">
            <h3 className="text-2xl font-bold mb-6 text-center font-poppins">Workshops can be delivered to:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-beige-800">Whole leadership teams</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-beige-800">Functional groups</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-beige-800">Small cohorts (high engagement format)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">WHO THIS IS FOR</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Who These Workshops Are For</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-12 rounded-3xl border border-beige-200 fade-up">
              <div className="space-y-6 text-lg text-beige-700">
                <p className="font-semibold text-beige-800">
                  These workshops are for organisations that know people and culture are either your biggest advantage or your biggest risk.
                </p>

                <p className="font-semibold text-beige-800 mt-8">They're a strong fit if:</p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>You're losing good people, or worried you will</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Engagement is slipping despite best intentions</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Culture feels inconsistent across leaders or teams</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Strong performers have been promoted without leadership support</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Accountability is avoided, delayed, or unclear</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p>Too much still relies on a few key individuals</p>
                  </div>
                </div>

                <p className="font-semibold text-beige-800 mt-8">Or…</p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <p>You have high-performing teams and want to protect that edge</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <p>You're scaling, changing, or under pressure</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <p>You want leadership consistency as you grow</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                    <p>You invest early to avoid bigger problems later</p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary/10 rounded-2xl">
                  <p className="font-semibold text-beige-800">
                    These workshops help leaders create clarity, confidence, and consistency - without burnout, heroics, or guesswork.
                  </p>
                  <p className="mt-4">
                    If you want a culture that actually shows up in day-to-day behaviour, this is where to start.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">SUCCESS STORIES</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 fade-up font-poppins">Real Leadership Growth</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                "I put the majority of my frontline leadership team into Chloe's 90 minute session and the feedback has been excellent. Leadership is an ongoing challenge, and what Chloe has added to my team is going to prove invaluable. She helps new leaders zoom out, genuinely own their responsibilities, and work on the business rather than just in it."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Dean Alexander</p>
                  <p className="text-sm text-beige-600">General Manager, Toll People</p>
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
                "Chloe guided me in learning to delegate so I could focus on working on my business, not just in it. I've grown in confidence, improved how I run team meetings, and strengthened how I connect with my team. She blends deep insight with practical guidance and is one of the most affable, easy to work with coaches I've met."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Courtney Denyer</p>
                  <p className="text-sm text-beige-600">Business Manager, QFS Solutions Pty Ltd</p>
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
                "One of the biggest challenges we face is accountability and leading with clarity. A line from the session that really stayed with me was, 'The standard you walk past is the standard you accept.' I'm leaving focused on giving my team clarity and strengthening how we communicate."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Marissa Carpenter</p>
                  <p className="text-sm text-beige-600">National Scheduling Manager, Nextt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up block mb-6">NEXT STEPS</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 fade-up font-poppins">
            Want to Explore a Custom Workshop?
          </h2>
          <p className="text-xl text-beige-600 mb-12 fade-up">
            Let's have a conversation about what matters most to your organisation and how we can design a workshop that moves the needle for your team.
          </p>
          <div className="space-y-6 fade-up">
            <a
              href="https://calendly.com/chloe-cultivatedhq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary to-secondary text-white px-12 py-6 rounded-full font-bold text-lg hover:shadow-lg transition inline-flex items-center border-2 border-white"
            >
              Start the Conversation
              <ArrowRight className="ml-3 w-5 h-5" />
            </a>
            <p className="text-sm text-beige-500">
              Custom workshops designed for your people and culture goals
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

export default LeadershipAccelerator;