import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, BarChart3, Users, MessageCircle, TrendingUp, ArrowLeft, FileText, Lock, LogIn } from 'lucide-react';
import { supabase, FeedbackSession, FeedbackResponse } from '../../lib/supabase';
import { processResponseData, downloadPDFReport, ProcessedReportData } from '../../lib/pdfGenerator';

function PulseCheckResults() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const ADMIN_PASSWORD = 'LeadersLearning2025';

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const authStatus = localStorage.getItem('pulseCheckAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (sessionId) {
        loadSessionData();
      }
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pulseCheckAdminAuth', 'true');
      setLoginError('');
      if (sessionId) {
        loadSessionData();
      }
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const loadSessionData = async () => {
    try {
      setLoading(true);
      // Load session
      const { data: sessionData, error: sessionError } = await supabase
        .from('feedback_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      if (!sessionData) {
        setError('Session not found');
        return;
      }

      setSession(sessionData);

      // Load responses
      const { data: responsesData, error: responsesError } = await supabase
        .from('feedback_responses')
        .select('*')
        .eq('session_id', sessionId)
        .order('submitted_at', { ascending: true });

      if (responsesError) throw responsesError;

      setResponses(responsesData || []);

      // Process data for analytics
      if (responsesData && responsesData.length > 0) {
        const processed = processResponseData({
          session: sessionData,
          responses: responsesData
        });
        setProcessedData(processed);
      }

    } catch (error) {
      console.error('Error loading session data:', error);
      setError('Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!processedData) return;

    setGeneratingPDF(true);
    try {
      await downloadPDFReport(processedData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getScaleLabels = () => {
    if (session?.scale_type === 'likert_7') {
      return ['Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Agree', 'Strongly Agree'];
    }
    return ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-beige-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2 font-poppins">Results Access</h1>
            <p className="text-beige-600">Enter your password to view survey results</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Access Results
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/pulsecheck" className="text-primary hover:text-secondary transition text-sm">
              Return to Pulse Check Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Results Not Available</h1>
          <p className="text-beige-600 mb-6">{error}</p>
          <a 
            href="/pulsecheck/admin"
            className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition"
          >
            Back to Admin
          </a>
        </div>
      </div>
    );
  }

  const scaleLabels = getScaleLabels();
  const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold gradient-text font-poppins">Survey Results</h1>
            <div className="flex space-x-4 items-center">
              <a href="/pulsecheck/admin" className="text-beige-500 hover:text-primary transition flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 font-poppins">{session.title}</h2>
              {session.description && (
                <p className="text-beige-600 mb-4">{session.description}</p>
              )}
              <div className="flex items-center space-x-6 text-sm text-beige-500">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {responses.length} responses
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {processedData?.analytics.comment_count || 0} comments
                </div>
                <div>
                  Manager: {session.manager_name}
                </div>
              </div>
            </div>
            
            {processedData && (
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition ${
                  generatingPDF
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                <Download className="w-4 h-4 mr-2" />
                {generatingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            )}
          </div>

          {/* Summary Stats */}
          {processedData && (
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-primary/10 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((processedData.analytics.overall_average / scaleMax) * 100)}%
                </div>
                <div className="text-sm text-beige-600">Overall Score</div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {processedData.analytics.strongest_score.toFixed(1)}
                </div>
                <div className="text-sm text-beige-600">Highest Score</div>
              </div>
              <div className="bg-orange-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {processedData.analytics.weakest_score.toFixed(1)}
                </div>
                <div className="text-sm text-beige-600">Lowest Score</div>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {processedData.analytics.comment_count}
                </div>
                <div className="text-sm text-beige-600">Comments</div>
              </div>
            </div>
          )}
        </div>

        {responses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <BarChart3 className="w-16 h-16 text-beige-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Responses Yet</h3>
            <p className="text-beige-600">This survey hasn't received any responses yet.</p>
          </div>
        ) : (
          <>
            {/* Key Insights */}
            {processedData && (
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold mb-6 font-poppins">Key Insights</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-green-600 mb-2">Strongest Area</h4>
                    <p className="text-beige-700 mb-1">{processedData.analytics.strongest_area}</p>
                    <p className="text-sm text-beige-500">Average: {processedData.analytics.strongest_score.toFixed(2)}/{scaleMax}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-600 mb-2">Development Opportunity</h4>
                    <p className="text-beige-700 mb-1">{processedData.analytics.weakest_area}</p>
                    <p className="text-sm text-beige-500">Average: {processedData.analytics.weakest_score.toFixed(2)}/{scaleMax}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Question Results */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold mb-6 font-poppins">Question Results</h3>
              <div className="space-y-8">
                {session.questions.map((question, index) => {
                  const questionResponses = responses.map(r => r.responses[index]).filter(r => r > 0);
                  const average = questionResponses.length > 0 
                    ? questionResponses.reduce((sum, val) => sum + val, 0) / questionResponses.length 
                    : 0;
                  
                  // Calculate distribution
                  const distribution = new Array(scaleMax).fill(0);
                  questionResponses.forEach(response => {
                    distribution[response - 1]++;
                  });

                  return (
                    <div key={index} className="border-b border-beige-200 pb-6 last:border-b-0">
                      <h4 className="font-semibold mb-4">{index + 1}. {question}</h4>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-beige-600">Average Score</span>
                            <span className="font-bold">{average.toFixed(2)}/{scaleMax}</span>
                          </div>
                          <div className="w-full bg-beige-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(average / scaleMax) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-beige-600 block mb-2">Response Distribution</span>
                          <div className="flex space-x-2">
                            {distribution.map((count, i) => (
                              <div key={i} className="text-center">
                                <div className="text-xs text-beige-500">{i + 1}</div>
                                <div className="text-sm font-medium">{count}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments */}
            {processedData && processedData.analytics.comments.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 font-poppins">Anonymous Comments</h3>
                <div className="space-y-4">
                  {processedData.analytics.comments.map((comment, index) => (
                    <div key={index} className="bg-beige-50 p-4 rounded-lg border-l-4 border-primary">
                      <p className="text-beige-700">"{comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PulseCheckResults;