import React, { useState, useEffect } from 'react';
import { Plus, Settings, BarChart3, Download, Eye, Users, Calendar, ArrowLeft, Filter, Search, FileText, Lock, LogIn, RefreshCw, Clock } from 'lucide-react';
import { supabase, FeedbackSession } from '../../lib/supabase';

const DEFAULT_QUESTIONS = [
  "My manager communicates clearly and effectively.",
  "My manager fosters a culture of trust and respect.",
  "I feel supported by my manager in my role.",
  "My manager gives constructive feedback.",
  "My manager models accountability and ownership.",
  "My manager listens actively and responds to concerns.",
  "My manager sets clear goals and expectations.",
  "My manager leads by example.",
  "My manager encourages growth and development.",
  "My manager recognizes individual contributions.",
  "From your perspective, what should I:\n\nStart doing,\n\nStop doing,\n\nKeep doing?\n\nFeel free to answer one or all three, your feedback helps me lead better."
];

function SurveyTestAdmin() {
  const [sessions, setSessions] = useState<FeedbackSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<FeedbackSession[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: DEFAULT_QUESTIONS,
    scale_type: 'likert_5' as 'likert_5' | 'likert_7',
    manager_name: 'Test Admin',
    manager_email: 'test@cultivatedhq.com.au'
  });
  
  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const ADMIN_PASSWORD = 'LeadersLearning2025';
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage)
    const authStatus = localStorage.getItem('pulseCheckAdminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadSessions();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      filterSessions();
    }
  }, [sessions, searchTerm, filterType]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pulseCheckAdminAuth', 'true');
      setLoginError('');
      loadSessions();
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pulseCheckAdminAuth');
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      console.log('Loading sessions...');
      const { data, error } = await supabase
        .from('feedback_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading sessions:', error);
        throw error;
      }
      
      console.log('Sessions loaded:', data?.length || 0);
      
      // For each session, get the actual response count
      if (data && data.length > 0) {
        const updatedSessions = [...data];
        
        for (let i = 0; i < updatedSessions.length; i++) {
          const session = updatedSessions[i];
          const { count, error: countError } = await supabase
            .from('feedback_responses')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);
            
          if (!countError && count !== null) {
            console.log(`Session ${session.id} has ${count} responses (DB shows ${session.response_count})`);
            
            // Update the local state regardless of whether the counts match
            updatedSessions[i] = {
              ...session,
              response_count: count
            };
            
            // If the counts don't match, update the database
            if (count !== session.response_count) {
              console.log(`Updating response count for session ${session.id} from ${session.response_count} to ${count}`);
              
              const { error: updateError } = await supabase
                .from('feedback_sessions')
                .update({ response_count: count })
                .eq('id', session.id);
                
              if (updateError) {
                console.error(`Error updating response count for session ${session.id}:`, updateError);
              }
            }
          }
        }
        
        // Update the sessions state with the corrected counts
        setSessions(updatedSessions);
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by type
    if (filterType === 'public') {
      filtered = filtered.filter(session => session.is_public);
    } else if (filterType === 'private') {
      filtered = filtered.filter(session => !session.is_public);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.manager_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.manager_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  };

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('feedback_sessions')
        .insert([{
          title: formData.title,
          description: formData.description,
          questions: formData.questions,
          scale_type: formData.scale_type,
          manager_name: formData.manager_name,
          manager_email: formData.manager_email,
          is_active: true,
          is_public: false, // Admin sessions are private by default
          expires_at: new Date(Date.now() + 1 * 60 * 1000).toISOString() // 1 minute from now
        }])
        .select()
        .single();

      if (error) throw error;

      // Try to send notification but don't fail if it doesn't work
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'session_created',
            session: data,
            email: formData.manager_email,
            manager_name: formData.manager_name
          }
        });
      } catch (notificationError) {
        console.warn('Notification failed but session was created:', notificationError);
      }

      setSessions([data, ...sessions]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        questions: DEFAULT_QUESTIONS,
        scale_type: 'likert_5',
        manager_name: 'Test Admin',
        manager_email: 'test@cultivatedhq.com.au'
      });
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`Error creating session: ${error.message || 'Please try again.'}`);
    }
  };

  const toggleSessionStatus = async (sessionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback_sessions')
        .update({ is_active: !isActive })
        .eq('id', sessionId);

      if (error) throw error;
      loadSessions();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const copyShareLink = (sessionId: string) => {
    const link = `${window.location.origin}/surveytest/survey/${sessionId}`;
    navigator.clipboard.writeText(link);
    alert('Survey link copied to clipboard!');
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, '']
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadSessions();
    setRefreshing(false);
  };

  // Function to check if a session is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // Function to format time remaining
  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (now > expiry) {
      return 'Expired';
    }
    
    const diffMs = expiry.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return `${diffSec}s remaining`;
    }
    
    const diffMin = Math.floor(diffSec / 60);
    return `${diffMin}m ${diffSec % 60}s remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-beige-600">Loading admin dashboard...</p>
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
            <h1 className="text-2xl font-bold mb-2 font-poppins">Admin Access</h1>
            <p className="text-beige-600">Enter your password to access the admin dashboard</p>
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
              Login to Admin
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/surveytest" className="text-primary hover:text-secondary transition text-sm">
              Return to Survey Test Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const publicSessions = sessions.filter(s => s.is_public);
  const privateSessions = sessions.filter(s => !s.is_public);

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="/surveytest" className="text-2xl font-bold gradient-text font-poppins">Survey Test Admin</a>
            </div>
            <div className="flex space-x-4 items-center">
              <button 
                onClick={handleLogout}
                className="text-beige-500 hover:text-primary transition flex items-center"
              >
                <Lock className="w-4 h-4 mr-2" />
                Logout
              </button>
              <a href="/surveytest" className="text-beige-500 hover:text-primary transition flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4 font-poppins">Test Admin Dashboard</h1>
            <p className="text-beige-600">Manage all test feedback sessions and view analytics</p>
            <div className="flex items-center space-x-6 mt-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-beige-500">Total Sessions:</span>
                <span className="font-bold ml-2">{sessions.length}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-beige-500">Public:</span>
                <span className="font-bold ml-2">{publicSessions.length}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="text-beige-500">Private:</span>
                <span className="font-bold ml-2">{privateSessions.length}</span>
              </div>
              <button 
                onClick={refreshData}
                disabled={refreshing}
                className={`bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition flex items-center ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary transition flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Test Session
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-beige-400" />
                <input
                  type="text"
                  placeholder="Search sessions, managers, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-beige-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'public' | 'private')}
                className="px-4 py-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Sessions</option>
                <option value="public">Public Sessions</option>
                <option value="private">Private Sessions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Session Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 font-poppins">Create New Test Session</h2>
              
              <form onSubmit={createSession} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Manager Name</label>
                    <input
                      type="text"
                      value={formData.manager_name}
                      onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                      className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Manager Email</label>
                    <input
                      type="email"
                      value={formData.manager_email}
                      onChange={(e) => setFormData({ ...formData, manager_email: e.target.value })}
                      className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Session Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Test Survey - Manager Jane"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Additional context for participants..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Scale Type</label>
                  <select
                    value={formData.scale_type}
                    onChange={(e) => setFormData({ ...formData, scale_type: e.target.value as 'likert_5' | 'likert_7' })}
                    className="w-full p-3 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="likert_5">5-Point Scale (Strongly Disagree to Strongly Agree)</option>
                    <option value="likert_7">7-Point Scale (Strongly Disagree to Strongly Agree)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Questions</label>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="text-primary hover:text-secondary transition text-sm font-medium"
                    >
                      + Add Question
                    </button>
                  </div>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {formData.questions.map((question, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <span className="text-sm text-beige-500 w-8 mt-3">{index + 1}.</span>
                        <div className="flex-1">
                          {index === 10 ? (
                            // Special handling for the 11th question (open text)
                            <div className="p-3 border border-primary rounded bg-primary/5">
                              <div className="text-sm text-primary font-medium mb-2">Open Text Question</div>
                              <textarea
                                value={question}
                                onChange={(e) => updateQuestion(index, e.target.value)}
                                className="w-full p-2 border border-beige-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                rows={4}
                                required
                              />
                            </div>
                          ) : (
                            // Regular Likert scale questions
                            <input
                              type="text"
                              value={question}
                              onChange={(e) => updateQuestion(index, e.target.value)}
                              className="w-full p-2 border border-beige-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              required
                            />
                          )}
                        </div>
                        {formData.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="text-red-500 hover:text-red-700 transition text-sm px-2 mt-3"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-beige-300 rounded-full font-medium hover:bg-beige-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-secondary transition"
                  >
                    Create Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="grid gap-6">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-beige-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || filterType !== 'all' ? 'No matching sessions found' : 'No feedback sessions yet'}
              </h3>
              <p className="text-beige-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first test session to start collecting anonymous feedback.'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary transition"
                >
                  Create First Session
                </button>
              )}
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold font-poppins">{session.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.is_public 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {session.is_public ? 'Public' : 'Private'}
                      </span>
                      {isExpired(session.expires_at) && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Expired
                        </span>
                      )}
                      {session.report_sent && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Report Sent
                        </span>
                      )}
                    </div>
                    {session.description && (
                      <p className="text-beige-600 mb-3">{session.description}</p>
                    )}
                    <div className="flex items-center space-x-6 text-sm text-beige-500 mb-2">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {session.response_count || 0} responses
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        {session.questions.length} questions
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {isExpired(session.expires_at) ? 'Expired' : formatTimeRemaining(session.expires_at)}
                      </div>
                    </div>
                    <div className="text-sm text-beige-600">
                      <span className="font-medium">Manager:</span> {session.manager_name} ({session.manager_email})
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => copyShareLink(session.id)}
                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition"
                  >
                    Copy Survey Link
                  </button>
                  
                  <a
                    href={`/surveytest/survey/${session.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-primary text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </a>

                  {(session.response_count > 0) && (
                    <a
                      href={`/surveytest/results/${session.id}`}
                      className="border border-secondary text-secondary px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary hover:text-white transition flex items-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      View Results
                    </a>
                  )}

                  <button
                    onClick={() => toggleSessionStatus(session.id, session.is_active)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      session.is_active
                        ? 'border border-red-400 text-red-600 hover:bg-red-400 hover:text-white'
                        : 'border border-green-400 text-green-600 hover:bg-green-400 hover:text-white'
                    }`}
                  >
                    {session.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SurveyTestAdmin;