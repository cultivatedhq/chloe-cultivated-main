import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle, BarChart3, Award, Users, Heart, ArrowRight, Compass, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Question categories and their questions
const CATEGORIES = [
  {
    id: 'team-performance',
    title: 'Team Performance',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'primary',
    questions: [
      'Our leadership team consistently achieves its strategic objectives.',
      'Our leaders effectively translate strategy into clear, actionable plans.',
      'Our leadership team makes decisions efficiently without unnecessary delays.',
      'Our leaders are skilled at identifying and solving problems before they escalate.'
    ]
  },
  {
    id: 'values-culture',
    title: 'Values & Culture',
    icon: <Heart className="w-6 h-6" />,
    color: 'secondary',
    questions: [
      'Our leadership team consistently models our organisation\'s core values.',
      'Our leaders actively foster a culture of trust and psychological safety.',
      'Our leadership team effectively communicates the "why" behind decisions.',
      'Our leaders recognise and celebrate team achievements and contributions.'
    ]
  },
  {
    id: 'leadership-alignment',
    title: 'Leadership Alignment',
    icon: <Compass className="w-6 h-6" />,
    color: 'primary',
    questions: [
      'Our leadership team is aligned on our strategic priorities.',
      'Our leaders present a unified message to the rest of the organisation.',
      'Our leadership team has clearly defined roles with minimal overlap or confusion.',
      'Our leaders effectively manage conflict and disagreement within the team.'
    ]
  },
  {
    id: 'people-retention',
    title: 'People & Retention',
    icon: <Users className="w-6 h-6" />,
    color: 'secondary',
    questions: [
      'Our leadership team effectively identifies and develops high-potential talent.',
      'Our leaders provide regular, constructive feedback to their team members.',
      'Our leadership team creates growth opportunities for employees at all levels.',
      'Our leaders maintain high engagement and low turnover within their teams.'
    ]
  }
];

// Flattened questions array for easier navigation
const ALL_QUESTIONS = CATEGORIES.flatMap(category => 
  category.questions.map(question => ({
    category: category.id,
    categoryTitle: category.title,
    text: question
  }))
);

function ClarityAudit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [lowestCategory, setLowestCategory] = useState('');
  const [highestCategory, setHighestCategory] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  
  const [reportRecipientEmail, setReportRecipientEmail] = useState('');
  const [submittedAuditId, setSubmittedAuditId] = useState<string | null>(null);
  const [emailingReport, setEmailingReport] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  // New form state for send-results functionality
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState('');
  
  useEffect(() => {
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
  }, []);

  // Calculate scores when answers change or when showing results
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const scores: Record<string, { total: number; count: number }> = {};
      
      // Initialize scores object
      CATEGORIES.forEach(category => {
        scores[category.id] = { total: 0, count: 0 };
      });
      
      // Sum up scores by category
      Object.entries(answers).forEach(([index, score]) => {
        const questionIndex = parseInt(index);
        const category = ALL_QUESTIONS[questionIndex].category;
        scores[category].total += score;
        scores[category].count += 1;
      });
      
      // Calculate average scores per category
      const avgScores: Record<string, number> = {};
      let overallTotal = 0;
      let overallCount = 0;
      
      Object.entries(scores).forEach(([category, { total, count }]) => {
        if (count > 0) {
          avgScores[category] = Math.round((total / count) * 10) / 10;
          overallTotal += total;
          overallCount += count;
        } else {
          avgScores[category] = 0;
        }
      });
      
      // Calculate overall score
      const overall = overallCount > 0 ? Math.round((overallTotal / overallCount) * 10) / 10 : 0;
      
      // Find lowest and highest scoring categories
      let lowest = { category: '', score: 5 };
      let highest = { category: '', score: 0 };
      
      Object.entries(avgScores).forEach(([category, score]) => {
        if (score < lowest.score && score > 0) {
          lowest = { category, score };
        }
        if (score > highest.score) {
          highest = { category, score };
        }
      });
      
      setCategoryScores(avgScores);
      setTotalScore(overall);
      setLowestCategory(lowest.category);
      setHighestCategory(highest.category);
    }
  }, [answers, showResults]);

  // Helper function to build summary markdown for the send-results function
  const buildSummaryMarkdown = () => {
    const categories = [
      { id: 'team-performance', title: 'Team Performance' },
      { id: 'values-culture', title: 'Values & Culture' },
      { id: 'leadership-alignment', title: 'Leadership Alignment' },
      { id: 'people-retention', title: 'People & Retention' }
    ];

    let markdown = '';
    
    categories.forEach(category => {
      const score = categoryScores[category.id] || 0;
      markdown += `**${category.title}**\n`;
      markdown += `Score: ${score.toFixed(1)}/5\n`;
      markdown += `${getCategoryFeedback(category.id)}\n\n`;
    });

    markdown += `**Overall Assessment**\n`;
    markdown += `Total Score: ${totalScore.toFixed(1)}/5 - ${getScoreDescription(totalScore)}\n`;
    markdown += `${getOverallFeedback().description}\n\n`;

    markdown += `**Key Focus Areas**\n`;
    markdown += `- Strongest Area: ${getCategoryTitle(highestCategory)} (${categoryScores[highestCategory]?.toFixed(1) || 0}/5)\n`;
    markdown += `- Development Area: ${getCategoryTitle(lowestCategory)} (${categoryScores[lowestCategory]?.toFixed(1) || 0}/5)\n\n`;

    markdown += `**Recommended Actions**\n`;
    getOverallFeedback().actionItems.forEach(item => {
      markdown += `- ${item}\n`;
    });

    return markdown;
  };

  // Helper function to get category title from ID
  const getCategoryTitle = (categoryId: string) => {
    const categoryMap: Record<string, string> = {
      'team-performance': 'Team Performance',
      'values-culture': 'Values & Culture',
      'leadership-alignment': 'Leadership Alignment',
      'people-retention': 'People & Retention'
    };
    return categoryMap[categoryId] || categoryId;
  };

  // Handle form submission for sending results
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !formEmail.trim()) {
      setFormStatus('Please fill in both name and email fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      setFormStatus('Please enter a valid email address.');
      return;
    }

    setFormStatus('Sending your results...');
    
    try {
      const summaryMarkdown = buildSummaryMarkdown();
      
      const payload = {
        name: formName.trim(),
        email: formEmail.trim(),
        summaryMarkdown,
        results: {
          answers,
          category_scores: categoryScores,
          total_score: totalScore,
          lowest_category: lowestCategory,
          highest_category: highestCategory
        },
        ctaUrl: "https://calendly.com/chloe-cultivatedhq/30min"
      };

      const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-results`;
      
      console.log('Calling Edge Function:', endpoint);
      console.log('Payload:', payload);
      
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Try to read JSON; fall back to text so we never lose the error
      const text = await r.text();
      let data;
      try { 
        data = JSON.parse(text); 
      } catch { 
        data = { raw: text }; 
      }

      if (!r.ok) {
        console.error("send-results failed", { status: r.status, data });
        setFormStatus(`Failed: ${data?.error || data?.raw || `HTTP ${r.status}`}`);
        return;
      }

      console.log("send-results ok", data);
      
      // Handle different response types
      if (data.minimal_mode) {
        setFormStatus('✅ Results saved! Email service setup is pending - you\'ll receive your results once configured.');
      } else {
        setFormStatus('✅ Results sent successfully! Check your inbox.');
      }

      setFormName('');
      setFormEmail('');
      
      // Clear success message after 5 seconds
      setTimeout(() => setFormStatus(''), 5000);
      
    } catch (error) {
      console.error("network error", error);
      setFormStatus(`Failed (network): ${String(error)}`);
    }
  };

  // Scroll to results when they're shown
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showResults]);
  
  const handleAnswerSelect = (score: number) => {
    // Update the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: score
    }));
    
    // Briefly highlight the selection
    setIsTransitioning(true);
    
    // After a short delay, move to the next question
    setTimeout(() => {
      if (currentQuestionIndex < ALL_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
      setIsTransitioning(false);
    }, 300);
  };

  // Add animation classes when transitioning between questions
  const getQuestionClasses = () => {
    let classes = "transition-opacity duration-300";
    
    if (isTransitioning) {
      classes += " opacity-0";
    } else {
      classes += " opacity-100";
    }
    
    return classes;
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < ALL_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered (must have answers for all 16 questions)
    const answeredQuestions = Object.keys(answers).length;
    const allQuestionsAnswered = answeredQuestions === ALL_QUESTIONS.length;
    
    console.log('Submit check:', { answeredQuestions, totalQuestions: ALL_QUESTIONS.length, allQuestionsAnswered });
    
    if (allQuestionsAnswered) {
      setShowResults(true);
    } else {
      alert(`Please answer all questions before submitting. You have answered ${answeredQuestions} of ${ALL_QUESTIONS.length} questions.`);
    }
  };

  const handleStartOver = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setFormName('');
    setFormEmail('');
    setFormStatus('');
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / ALL_QUESTIONS.length) * 100;
  };

  const getCurrentCategoryProgress = () => {
    const currentCategory = ALL_QUESTIONS[currentQuestionIndex].category;
    const categoryQuestions = ALL_QUESTIONS.filter(q => q.category === currentCategory);
    const categoryStartIndex = ALL_QUESTIONS.findIndex(q => q.category === currentCategory);
    const currentIndexInCategory = currentQuestionIndex - categoryStartIndex;
    
    return `Question ${currentIndexInCategory + 1} of ${categoryQuestions.length}`;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.color || 'primary';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 4.5) return 'Exceptional';
    if (score >= 4) return 'Very Strong';
    if (score >= 3.5) return 'Strong';
    if (score >= 3) return 'Solid';
    if (score >= 2.5) return 'Developing';
    if (score >= 2) return 'Needs Attention';
    return 'Critical Concern';
  };

  const getOverallFeedback = () => {
    if (totalScore >= 4.5) {
      return {
        title: 'Exceptional Leadership Team',
        description: 'Your leadership team is performing at an exceptional level. You have the foundation for sustained organisational success and growth.',
        actionItems: [
          'Document your leadership practices to create a playbook for future leaders',
          'Mentor other leadership teams in your organisation or industry',
          'Focus on innovation and future growth opportunities'
        ]
      };
    } else if (totalScore >= 3.5) {
      return {
        title: 'Strong Leadership Team',
        description: 'Your leadership team is performing well with clear strengths. There are specific areas where targeted improvements can take you from good to great.',
        actionItems: [
          'Build on your strengths while addressing your lowest-scoring category',
          'Implement regular leadership team effectiveness reviews',
          'Create development plans for each leader that align with team goals'
        ]
      };
    } else if (totalScore >= 2.5) {
      return {
        title: 'Developing Leadership Team',
        description: 'Your leadership team has a foundation to build upon, but significant improvements are needed in several areas to drive organisational success.',
        actionItems: [
          'Prioritise addressing your lowest-scoring category immediately',
          'Establish clear leadership team operating principles',
          'Consider leadership coaching for key team members'
        ]
      };
    } else {
      return {
        title: 'Leadership Team Needs Significant Attention',
        description: 'Your leadership team is facing substantial challenges that require immediate attention to avoid negative impacts on organisational performance.',
        actionItems: [
          'Conduct a comprehensive leadership team reset',
          'Bring in external expertise to facilitate improvement',
          'Create 30/60/90 day improvement plans with clear accountability'
        ]
      };
    }
  };

  const getCategoryFeedback = (categoryId: string) => {
    const score = categoryScores[categoryId] || 0;
    
    switch(categoryId) {
      case 'team-performance':
        if (score >= 4) {
          return 'Your leadership team excels at execution and consistently achieves strategic objectives. Continue to document and share your effective decision-making and problem-solving approaches.';
        } else if (score >= 3) {
          return 'Your leadership team has solid performance foundations. Focus on improving decision-making speed and translating strategy into clearer action plans.';
        } else {
          return 'Your leadership team struggles with consistent execution. Prioritise establishing clearer decision-making processes and accountability for strategic objectives.';
        }
      
      case 'values-culture':
        if (score >= 4) {
          return 'Your leadership team effectively models values and creates a positive culture. Continue strengthening your communication of the "why" behind decisions.';
        } else if (score >= 3) {
          return 'Your leadership team has a foundation of positive culture. Work on more consistently modeling core values and recognising team contributions.';
        } else {
          return 'Your leadership team needs to prioritise culture-building. Start by clearly defining and modeling your core values and improving psychological safety.';
        }
      
      case 'leadership-alignment':
        if (score >= 4) {
          return 'Your leadership team demonstrates strong alignment and unity. Continue refining role clarity and maintaining your effective conflict resolution practices.';
        } else if (score >= 3) {
          return 'Your leadership team has moderate alignment. Focus on improving how you present a unified message and manage internal disagreements constructively.';
        } else {
          return 'Your leadership team shows significant misalignment. Prioritise clarifying strategic priorities and establishing healthy conflict resolution processes.';
        }
      
      case 'people-retention':
        if (score >= 4) {
          return 'Your leadership team excels at developing people and maintaining engagement. Continue your strong practices in talent development and feedback.';
        } else if (score >= 3) {
          return 'Your leadership team has solid people practices. Enhance your approach to identifying high-potential talent and providing more regular feedback.';
        } else {
          return 'Your leadership team needs to prioritise talent development. Establish consistent feedback processes and create clearer growth pathways for employees.';
        }
      
      default:
        return '';
    }
  };

  const openCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    // @ts-ignore
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/chloe-cultivatedhq/30min'
      });
    } else {
      // Fallback if Calendly widget isn't loaded
      window.open('https://calendly.com/chloe-cultivatedhq/30min', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold gradient-text font-poppins">Cultivated HQ</a>
            <div className="flex space-x-6 items-center">
              <a href="/" className="text-beige-500 hover:text-primary transition">Home</a>
              <a 
                href="https://calendly.com/chloe-cultivatedhq/30min" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-primary text-beige-50 px-6 py-2 rounded-full font-medium hover:bg-secondary transition"
              >
                Let's Chat
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">Leadership Clarity Audit</h1>
          <p className="text-2xl text-primary font-medium mb-4">Find out what's working, what's not, and how to fix it... in under 10 minutes</p>
          <p className="text-xl text-beige-600 max-w-3xl mx-auto">
            High-performing leadership teams don't just happen, they're built with intention. This audit helps you pinpoint what's working, what's missing, and where your team's out of sync, so you can lead with focus and impact.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-beige-500 mb-2">
                <span>Progress</span>
                <span>{currentQuestionIndex + 1} of {ALL_QUESTIONS.length}</span>
              </div>
              <div className="w-full bg-beige-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center text-sm text-primary">
                  {CATEGORIES.find(c => c.id === ALL_QUESTIONS[currentQuestionIndex].category)?.icon}
                  <span className="ml-2">{ALL_QUESTIONS[currentQuestionIndex].categoryTitle}</span>
                </div>
                <span className="text-sm text-beige-500">{getCurrentCategoryProgress()}</span>
              </div>
            </div>

            {/* Current question */}
            <div ref={questionRef} className={`mb-8 ${getQuestionClasses()}`}>
              <h2 className="text-xl font-semibold mb-6 text-center">
                {ALL_QUESTIONS[currentQuestionIndex].text}
              </h2>
              
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleAnswerSelect(score)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      answers[currentQuestionIndex] === score
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-beige-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{score === 1 ? 'Not true' : score === 5 ? 'Absolutely true' : `${score}`}</span>
                      {answers[currentQuestionIndex] === score && (
                        <CheckCircle className="w-5 h-5 text-primary animate-pulse" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition ${
                  currentQuestionIndex === 0
                    ? 'text-beige-400 cursor-not-allowed'
                    : 'text-primary hover:bg-primary hover:text-white border border-primary'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentQuestionIndex === ALL_QUESTIONS.length - 1 && (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== ALL_QUESTIONS.length}
                  className={`flex items-center px-8 py-3 rounded-full font-medium transition ${
                    Object.keys(answers).length !== ALL_QUESTIONS.length
                      ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-secondary'
                  }`}
                >
                  Submit Audit
                  <CheckCircle className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div ref={resultsRef} className="space-y-8">
            {/* Results header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4 font-poppins">Your Leadership Clarity Results</h2>
              <p className="text-beige-600 mb-6">
                Based on your responses, here's an assessment of your leadership team's current state.
              </p>
              
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl mb-6">
                <div className="text-5xl font-bold text-primary mb-2">{totalScore.toFixed(1)}/5</div>
                <p className="text-xl font-semibold">{getScoreDescription(totalScore)}</p>
                <p className="text-beige-600 mt-2">Overall Leadership Team Score</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map(category => (
                  <div key={category.id} className="bg-beige-50 p-4 rounded-lg">
                    <div className="flex justify-center mb-2">
                      {category.icon}
                    </div>
                    <div className={`text-2xl font-bold ${category.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                      {categoryScores[category.id]?.toFixed(1) || '0.0'}
                    </div>
                    <p className="text-sm text-beige-500">{category.title}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quadrant visualization */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 font-poppins">Leadership Quadrant Analysis</h3>
              
              <div className="relative w-full h-80 border-2 border-beige-200 rounded-lg mb-6">
                {/* Quadrant labels */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {/* X and Y axes */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-beige-300"></div>
                  <div className="absolute top-0 left-1/2 w-px h-full bg-beige-300"></div>
                  
                  {/* Quadrant labels */}
                  <div className="absolute top-2 left-2 text-xs text-beige-500">High Alignment</div>
                  <div className="absolute top-2 right-2 text-xs text-beige-500">High Performance</div>
                  <div className="absolute bottom-2 left-2 text-xs text-beige-500">Low Performance</div>
                  <div className="absolute bottom-2 right-2 text-xs text-beige-500">Low Alignment</div>
                </div>
                
                {/* Category dots */}
                {CATEGORIES.map(category => {
                  // Calculate position based on scores
                  // For x-axis: team-performance and people-retention
                  // For y-axis: values-culture and leadership-alignment
                  const xScore = (
                    (categoryScores['team-performance'] || 0) + 
                    (categoryScores['people-retention'] || 0)
                  ) / 2;
                  
                  const yScore = (
                    (categoryScores['values-culture'] || 0) + 
                    (categoryScores['leadership-alignment'] || 0)
                  ) / 2;
                  
                  // Convert to percentage (0-100%) for positioning
                  // Adjust to make 1-5 scale fit in the quadrant
                  const xPos = ((xScore - 1) / 4) * 100;
                  const yPos = 100 - ((yScore - 1) / 4) * 100;
                  
                  return (
                    <div 
                      key={category.id}
                      className={`absolute w-12 h-12 rounded-full flex items-center justify-center -ml-6 -mt-6 ${
                        category.color === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-white'
                      }`}
                      style={{ 
                        left: `${xPos}%`, 
                        top: `${yPos}%`,
                        opacity: category.id === 'team-performance' || category.id === 'people-retention' || 
                                 category.id === 'values-culture' || category.id === 'leadership-alignment' ? 0 : 1
                      }}
                    >
                      {category.icon}
                    </div>
                  );
                })}
                
                {/* Overall position dot */}
                <div 
                  className="absolute w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center -ml-8 -mt-8 border-4 border-white shadow-lg"
                  style={{ 
                    left: `${((((categoryScores['team-performance'] || 0) + (categoryScores['people-retention'] || 0)) / 2 - 1) / 4) * 100}%`, 
                    top: `${100 - ((((categoryScores['values-culture'] || 0) + (categoryScores['leadership-alignment'] || 0)) / 2 - 1) / 4) * 100}%` 
                  }}
                >
                  <div className="text-sm font-bold">{totalScore.toFixed(1)}</div>
                </div>
              </div>
              
              <p className="text-beige-600 text-sm text-center italic">
                This quadrant visualization shows how your leadership team balances performance execution with cultural alignment.
              </p>
            </div>
            
            {/* Overall feedback */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 font-poppins">{getOverallFeedback().title}</h3>
              
              <p className="text-beige-600 mb-6">
                {getOverallFeedback().description}
              </p>
              
              <div className="bg-primary/10 p-6 rounded-xl mb-6">
                <h4 className="font-bold text-primary mb-3">Recommended Actions:</h4>
                <ul className="space-y-2">
                  {getOverallFeedback().actionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item.replace(/z/g, 's')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Category breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {CATEGORIES.map(category => (
                <div key={category.id} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      category.color === 'primary' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{category.title}</h4>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${
                          category.color === 'primary' ? 'text-primary' : 'text-secondary'
                        }`}>
                          {categoryScores[category.id]?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-sm text-beige-500 ml-2">
                          {getScoreDescription(categoryScores[category.id] || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-beige-600 text-sm">
                    {getCategoryFeedback(category.id).replace(/z/g, 's')}
                  </p>
                  
                  {/* Highlight if this is the lowest or highest category */}
                  {category.id === lowestCategory && (
                    <div className="mt-4 p-3 bg-orange-100 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm text-orange-800">
                        <strong>Priority Focus Area:</strong> This is your lowest-scoring category and should be addressed first.
                      </p>
                    </div>
                  )}
                  
                  {category.id === highestCategory && (
                    <div className="mt-4 p-3 bg-green-100 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm text-green-800">
                        <strong>Strength to Leverage:</strong> This is your highest-scoring category. Build on these strengths.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Call to action */}
            <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4 font-poppins">Ready to Take Action?</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Insights are cool. Action is cooler. We'll unpack the good, the bad, and the blind spots to build a clear plan to move your leadership team forward.
              </p>
              
              <div className="flex flex-col gap-4 justify-center items-center">
                <a
                  href="https://calendly.com/chloe-cultivatedhq/30min"
                  className="bg-white text-primary hover:bg-beige-100 px-8 py-4 rounded-full font-bold text-lg transition flex items-center"
                >
                  Book My Leadership Strategy Call
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Email Results Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 font-poppins text-center">Get Your Detailed Results</h3>
              <p className="text-beige-600 text-center mb-6">
                Enter your details below to receive a comprehensive email summary of your audit results.
              </p>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="formName" className="block text-sm font-medium text-beige-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="formEmail" className="block text-sm font-medium text-beige-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="formEmail"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus.includes('Sending')}
                  className={`w-full px-8 py-4 rounded-full font-bold text-lg transition flex items-center justify-center ${
                    formStatus.includes('Sending')
                      ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                      : formStatus.includes('✅')
                        ? 'bg-green-500 text-white'
                        : 'bg-primary text-white hover:bg-secondary'
                  }`}
                >
                  {formStatus.includes('Sending') ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-beige-400 mr-2"></div>
                      Sending Results...
                    </>
                  ) : formStatus.includes('✅') ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Results Sent!
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Email My Results
                    </>
                  )}
                </button>
                
                {formStatus && (
                  <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                    formStatus.includes('✅') 
                      ? 'bg-green-100 text-green-700'
                      : formStatus.includes('Failed') || formStatus.includes('Please')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formStatus}
                  </div>
                )}
              </form>
            </div>
            
            {/* Start over button */}
            <div className="text-center">
              <button
                onClick={handleStartOver}
                className="text-primary hover:text-secondary transition"
              >
                Take the assessment again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClarityAudit;