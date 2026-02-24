import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight, Sparkles, Target, Zap, Users, Brain, Trophy, Quote, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastScrollY = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          text: 'Book your 20min Strategy Session',
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

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // @ts-ignore
    window.Calendly?.initPopupWidget({
      url: 'https://calendly.com/chloe-cultivatedhq/30min'
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Hero Section */}
      <header className="relative min-h-screen grid-pattern overflow-hidden">
        {/* Background Image Banner */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full overflow-hidden">
            <img
              src="/bootcamp-hero-2.jpg"
              alt="Leadership workshop"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="w-1/3 h-full overflow-hidden">
            <img
              src="/bootcamp-hero-3.jpg"
              alt="Leadership training"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="w-1/3 h-full overflow-hidden">
            <img
              src="/bootcamp-hero-5.jpg"
              alt="Team collaboration"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        </div>

        <nav className={`fixed top-0 left-0 right-0 bg-beige-50/95 backdrop-blur-sm shadow-sm transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</h1>
              
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
                <a href="#framework" className="text-beige-500 hover:text-primary transition">Framework</a>
                <a href="#expertise" className="text-beige-500 hover:text-primary transition">Expertise</a>
                <a href="#results" className="text-beige-500 hover:text-primary transition">Results</a>
                
                {/* How We Help Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="text-beige-500 hover:text-primary transition flex items-center"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    How We Help
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div
                    className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-beige-200 transition-all duration-200 ${
                      isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className="p-2">
                      <a
                        href="/accelerator"
                        className="block px-4 py-3 text-beige-700 hover:bg-beige-50 hover:text-primary rounded-md transition"
                      >
                        <div className="font-semibold">Leadership Accelerator</div>
                        <div className="text-sm text-beige-500">3-12 month capability build</div>
                      </a>
                      <a
                        href="/coaching"
                        className="block px-4 py-3 text-beige-700 hover:bg-beige-50 hover:text-primary rounded-md transition"
                      >
                        <div className="font-semibold">1:1 Leadership Coaching</div>
                        <div className="text-sm text-beige-500">Personalised leadership development</div>
                      </a>
                    </div>
                  </div>
                </div>

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

            {/* Mobile Navigation */}
            <div
              className={`md:hidden absolute left-0 right-0 top-full bg-beige-50/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out z-50 ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <div className="flex flex-col p-6 space-y-4">
                <a
                  href="/accelerator"
                  onClick={closeMenu}
                  className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
                >
                  Leadership Accelerator
                </a>
                <a
                  href="/coaching"
                  onClick={closeMenu}
                  className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
                >
                  1:1 Leadership Coaching
                </a>
                <a 
                  href="#framework" 
                  onClick={closeMenu} 
                  className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
                >
                  Framework
                </a>
                <a 
                  href="#expertise" 
                  onClick={closeMenu} 
                  className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
                >
                  Expertise
                </a>
                <a 
                  href="#results" 
                  onClick={closeMenu} 
                  className="text-beige-500 hover:text-primary transition py-2 text-center border-b border-beige-200"
                >
                  Results
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

        <div className="relative s-10 max-w-7xl mx-auto px-6 pt-48 md:pt-64 pb-32 md:pb-48 hero-content">
          <div className="max-w-3xl mx-auto md:mx-0">
            <h2 className="hero-title text-5xl md:text-6xl font-bold mb-6 leading-tight fade-up font-poppins">
              Build a Leadership Team That Can <span className="gradient-text">Execute Without You</span>
            </h2>
            <p className="text-xl text-beige-600 mb-8 fade-up">
              We partner with growing, operationally complex businesses to strengthen leadership capability - improving decision-making, accountability and execution across your team.
            </p>
            <div className="flex items-center space-x-6 hero-buttons fade-up">
              <a
                href="https://calendly.com/chloe-cultivatedhq/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-beige-50 px-8 py-4 rounded-full font-semibold hover:bg-secondary transition flex items-center w-full md:w-auto justify-center"
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

      {/* What We Do Section */}
      <section id="framework" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <span className="text-primary text-xs uppercase tracking-widest font-semibold">WHAT WE DO</span>
            <p className="text-beige-500 text-sm uppercase tracking-wide mt-3 mb-6">Not generic training</p>
            <h3 className="text-5xl md:text-6xl font-bold mb-8 font-poppins text-beige-900">We Build Leadership Capability That Matches Your Growth</h3>
            <p className="text-lg text-beige-600 max-w-2xl mx-auto">
              A structured capability build designed to strengthen how your leadership team operates.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-12 mb-16">
            <div className="flex items-start gap-6 fade-up group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="text-beige-400 group-hover:text-white text-sm font-bold">01</span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl font-bold text-beige-900 mb-2">Clarify Decision Rights & Ownership</h4>
                <p className="text-beige-600">- Reduce escalation and increase confident decision-making.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 fade-up group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="text-beige-400 group-hover:text-white text-sm font-bold">02</span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl font-bold text-beige-900 mb-2">Strengthen Communication & Feedback</h4>
                <p className="text-beige-600">- Create consistency in performance conversations.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 fade-up group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="text-beige-400 group-hover:text-white text-sm font-bold">03</span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl font-bold text-beige-900 mb-2">Improve Leadership Confidence & Authority</h4>
                <p className="text-beige-600">- Equip managers to lead without hesitation.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 fade-up group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="text-beige-400 group-hover:text-white text-sm font-bold">04</span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl font-bold text-beige-900 mb-2">Embed Accountability Systems</h4>
                <p className="text-beige-600">- Turn meetings into measurable action.</p>
              </div>
            </div>

            <div className="flex items-start gap-6 fade-up group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                <span className="text-beige-400 group-hover:text-white text-sm font-bold">05</span>
              </div>
              <div className="pt-2">
                <h4 className="text-xl font-bold text-beige-900 mb-2">Align Leadership Behaviour with Business Priorities</h4>
                <p className="text-beige-600">- Ensure leadership drives strategy, not just activity.</p>
              </div>
            </div>
          </div>

          <div className="text-center fade-up pt-8 border-t-2 border-beige-200">
            <p className="text-lg font-semibold text-beige-900 max-w-3xl mx-auto">
              Delivered through facilitated workshops, integrated coaching, and practical implementation over time - embedded into the rhythm of your business.
            </p>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">WHY CHOOSE US</span>
              <h3 className="text-4xl font-bold mt-4 mb-6 fade-up font-poppins">Leadership That Actually Leads.<br/>Culture That Actually Connects.</h3>
              <p className="text-beige-600 mb-8 fade-up">
                With 10+ years leading high-performing teams in complex, fast-paced environments, I bring more than theory - I bring real-world results. I've held senior leadership roles in major organisations, managed large-scale operations, and developed emerging leaders across diverse teams. My experience spans the full leadership lifecycle: from chaos to clarity, from disconnect to alignment, from high turnover to high engagement.
                <br/><br/>
                I hold a Bachelor of Business and a proven track record in transforming culture, building capability, and closing the gaps that stall performance. My approach? No fluff. Just sharp insights, courageous conversations, and strategies that stick - because they're built around your people and your goals.
                <br/><br/>
                At Cultivated HQ, I work with organisations who are ready to lead better - from the inside out. Whether you're facing retention issues, misaligned leadership, or a culture that's just not clicking, I'll help you turn things around and build a leadership team you're proud of.
                <br/><br/>
                You already have good people. I help make them great.
              </p>
              <div className="space-y-4">
                <div className="flex items-start fade-up">
                  <Trophy className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Data-Driven Approach</h4>
                    <p className="text-beige-600">Leverage analytics and behavioral metrics to create targeted development strategies.</p>
                  </div>
                </div>
                <div className="flex items-start fade-up">
                  <Users className="w-6 h-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2">Customized Programs</h4>
                    <p className="text-beige-600">Tailored solutions that address your specific leadership challenges and goals.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative fade-up">
              <img
                src="/bootcamp-hero-6.jpg"
                alt="Chloe James - Leadership Coach"
                className="rounded-2xl shadow-lg w-3/4 h-auto object-cover mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 fade-up">
            <h3 className="text-5xl md:text-6xl font-bold font-poppins text-beige-900">This Work Is For Businesses That:</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="fade-up">
              <div className="mb-6">
                <span className="text-4xl font-bold text-beige-300">01</span>
              </div>
              <h4 className="text-2xl font-bold text-beige-900 mb-6">Are Navigating Complexity</h4>
              <ul className="space-y-4 text-beige-600">
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>Growth has increased operational demands</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>Multiple managers or departments now interact</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>Decisions feel heavier or slower than before</span>
                </li>
              </ul>
            </div>

            <div className="fade-up">
              <div className="mb-6">
                <span className="text-4xl font-bold text-beige-300">02</span>
              </div>
              <h4 className="text-2xl font-bold text-beige-900 mb-6">Are Developing Their Leadership Layer</h4>
              <ul className="space-y-4 text-beige-600">
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>Strong operators have stepped into leadership roles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>Managers need more authority and confidence</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>You want consistent leadership behaviours across teams</span>
                </li>
              </ul>
            </div>

            <div className="fade-up">
              <div className="mb-6">
                <span className="text-4xl font-bold text-beige-300">03</span>
              </div>
              <h4 className="text-2xl font-bold text-beige-900 mb-6">Are Ready To Build Intentionally</h4>
              <ul className="space-y-4 text-beige-600">
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>You want structured leadership development</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>You're prepared to invest time, not just attend a workshop</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 text-beige-400">•</span>
                  <span>You see leadership capability as part of growth strategy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Smaller and moved after expertise */}
      <section className="py-20 bg-beige-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">OUR SERVICES</span>
            <h3 className="text-3xl font-bold mt-4 mb-4 fade-up font-poppins">How We Strengthen Leadership Capability</h3>
            <p className="text-beige-600 max-w-3xl mx-auto fade-up">
              Choose the level of partnership that fits your stage of growth - from focused alignment intensives to embedded leadership development across your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <Sparkles className="w-10 h-10 text-beige-800 mb-4" />
              <h4 className="text-xl font-bold mb-3 text-beige-800">Leadership Alignment Intensive</h4>
              <p className="text-white mb-4 text-sm">A focused, facilitator-led session designed to reset expectations, clarify ownership and align your leadership team around execution.</p>
              <p className="text-white mb-3 text-sm font-semibold">Best for:</p>
              <p className="text-white mb-4 text-sm">Growing businesses that need immediate clarity and stronger leadership consistency.</p>
              <ul className="text-white mb-6 space-y-2 text-sm">
                <li>• Define decision rights and accountability</li>
                <li>• Surface execution breakdowns</li>
                <li>• Align behavioural standards</li>
                <li>• Build a practical 90-day leadership roadmap</li>
                <li>• Designed for intact leadership teams (not open enrolment)</li>
              </ul>
              <p className="text-white font-semibold text-sm">Outcome: Clearer ownership. Faster decisions. Less escalation.</p>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <Brain className="w-10 h-10 text-beige-800 mb-4" />
              <h4 className="text-xl font-bold mb-3 text-beige-800">Leadership Accelerator</h4>
              <p className="text-white mb-4 text-sm">(6-Month Capability Build)</p>
              <p className="text-white mb-4 text-sm">A structured leadership development program delivered to your leadership team over time - building capability that scales with your business.</p>
              <p className="text-white mb-3 text-sm font-semibold">Best for:</p>
              <p className="text-white mb-4 text-sm">Organisations with 4-10 managers navigating growth, complexity, or structural change.</p>
              <ul className="text-white mb-6 space-y-2 text-sm">
                <li>• Monthly facilitated capability sessions</li>
                <li>• Real-time application to current business challenges</li>
                <li>• Communication, accountability & execution frameworks</li>
                <li>• Leadership habit embedding</li>
                <li>• Optional 1:1 coaching for key leaders</li>
              </ul>
              <p className="text-white font-semibold text-sm">Outcome: Confident managers who lead, decide and execute without constant oversight.</p>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <Trophy className="w-10 h-10 text-beige-800 mb-4" />
              <h4 className="text-xl font-bold mb-3 text-beige-800">Embedded Leadership Partnership</h4>
              <p className="text-white mb-4 text-sm">(12-Month Embedded Leadership Partnership)</p>
              <p className="text-white mb-4 text-sm">For businesses ready to intentionally build a high-performing leadership team as part of their growth strategy.</p>
              <p className="text-white mb-3 text-sm font-semibold">Best for:</p>
              <p className="text-white mb-4 text-sm">Operationally complex businesses scaling headcount, sites, or revenue.</p>
              <ul className="text-white mb-6 space-y-2 text-sm">
                <li>• Quarterly strategy alignment</li>
                <li>• Monthly leadership development sessions</li>
                <li>• Founder / GM advisory support</li>
                <li>• Leadership KPI alignment</li>
                <li>• Accountability system embedding</li>
                <li>• Succession & bench strength development</li>
              </ul>
              <p className="text-white font-semibold text-sm">Outcome: A leadership team capable of driving performance at the next stage of growth.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition fade-up mb-12 max-w-4xl mx-auto border-2 border-beige-200">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3 text-beige-800">Executive & Leadership Coaching</h4>
                <p className="text-beige-700 mb-4">Targeted 1:1 coaching designed to strengthen individual leadership capability within a broader team development strategy.</p>
                <p className="text-beige-700 mb-2 font-semibold">Best for:</p>
                <ul className="text-beige-700 mb-4 space-y-1 text-sm">
                  <li>• Senior leaders stepping into larger roles</li>
                  <li>• Managers navigating complexity or growth</li>
                  <li>• Reinforcing leadership behaviours introduced in team programs</li>
                  <li>• Supporting key decision-makers during transition</li>
                </ul>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-beige-700 text-sm">• 60-90 minute sessions</p>
                    <p className="text-beige-700 text-sm">• Real-time scenario work</p>
                  </div>
                  <div>
                    <p className="text-beige-700 text-sm">• Clear action focus</p>
                    <p className="text-beige-700 text-sm">• Practical, not theoretical</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center fade-up">
            <p className="text-beige-700 text-lg">
              Not sure what you need? <a href="https://calendly.com/chloe-cultivatedhq/30min" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:text-secondary transition">Start with a strategy session</a> - it's the fastest way to create clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-primary text-sm uppercase tracking-wider font-bold fade-up">IMPACT</span>
            <h3 className="text-4xl font-bold mt-4 mb-6 fade-up font-poppins">Transformative Results</h3>
            <p className="text-beige-600 max-w-2xl mx-auto fade-up">
              Real outcomes from organisations that have implemented our leadership development strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <p className="text-5xl font-bold text-beige-800 mb-4">70%</p>
              <p className="text-white">Strong leadership can boost employee engagement by 70%, reducing turnover and driving higher performance.</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <p className="text-5xl font-bold text-beige-800 mb-4">29%</p>
              <p className="text-white">Companies with strong leadership development programs experience an average 29% increase in productivity.</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl shadow-lg hover:shadow-xl transition card-hover fade-up backdrop-blur-sm border-2 border-white">
              <p className="text-5xl font-bold text-beige-800 mb-4">3x</p>
              <p className="text-white">Leadership training enhances decision-making and innovation, leading to 3x improvement in profitability and more effective business strategies.</p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-6 fade-up font-poppins">What Our Clients Say</h3>
            <p className="text-beige-600 max-w-2xl mx-auto mb-12 fade-up">
              Hear directly from leaders who have transformed their leadership and organisations through our partnership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <p className="text-beige-700 mb-8 relative s-10">
                "One of the biggest challenges we face is accountability and leading with clarity. This session really made me reflect on the standards I set and what I'm prepared to accept. I'm leaving focused on creating clearer direction and stronger communication within my team."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Marissa Carpenter</p>
                  <p className="text-sm text-beige-600">National Scheduling Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <p className="text-beige-700 mb-8 relative s-10">
                "Working with Chloe genuinely shifted how I show up as a leader. I'm more emotionally aware, more confident handling tough conversations, and I lead with more patience, clarity, and empathy. It's been a game-changer."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Stefan Schaar</p>
                  <p className="text-sm text-beige-600">Operations Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <p className="text-beige-700 mb-8 relative s-10">
                "Chloe helped me step back from the day-to-day and focus on being the kind of leader my business needs. Her coaching built my confidence and transformed how I connect with my team."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Courtney Denyer</p>
                  <p className="text-sm text-beige-600">Business Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige-100 to-beige-50 p-8 rounded-2xl border border-beige-200 relative card-hover fade-up">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary opacity-50" />
              <p className="text-beige-700 mb-8 relative s-10">
                "Leadership development is ongoing, and what Chloe has added to our team is going to prove invaluable. The session helped our leaders step back, take ownership, and focus on the bigger picture of their roles."
              </p>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">Dean Alexander</p>
                  <p className="text-sm text-beige-600">General Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-beige-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 fade-up font-poppins">
              Build the Leadership Capability Your Next Stage Requires
            </h3>
            <p className="text-xl text-beige-600 mb-8 fade-up">
              If your business is growing and you want your leadership team to scale with it, let's talk.
            </p>
            <p className="text-lg text-beige-600 mb-10 fade-up">
              Book a 20-minute Leadership Strategy Call to explore whether this is the right fit.
            </p>
            <a
              href="https://calendly.com/chloe-cultivatedhq/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-primary to-secondary text-white px-10 py-5 rounded-full font-semibold hover:shadow-lg transition inline-flex items-center fade-up border-2 border-white text-lg"
            >
              Book Your Strategy Call
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
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
                <a href="#framework" className="block text-beige-600 hover:text-primary transition">
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

export default App;