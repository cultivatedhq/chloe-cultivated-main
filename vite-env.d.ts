import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Users, Mail, Settings, CheckCircle, Copy, ExternalLink, Clock, Calendar } from 'lucide-react';
import { supabase, testConnection } from '../../lib/supabase';

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

function SurveyTestCreate() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdSession, setCreatedSession] = useState<any>(null);
  const [formData, setFormData] = useState({
    manager_name: '',
    manager_email: '',
    title: '',
    description: '',
    questions: DEFAULT_QUESTIONS,
    scale_type: 'likert_5' as 'likert_5' | 'likert_7'
  });

  const createSession = async () => {
    setLoading(true);
    try {
      console.log('Creating session with data:', formData);

      // Validate form data
      if (!formData.manager_name.trim()) {
        throw new Error('Manager name is required');
      }
      if (!formData.manager_email.trim()) {
        throw new Error('Manager email is required');
      }
      if (!formData.title.trim()) {
        throw new Error('Survey title is required');
      }
      
      const validQuestions = formData.questions.filter(q => q.trim().length > 0);
      if (validQuestions.length === 0) {
        throw new Error('At least one question is required');
      }

      // Test the connection first
      try {
        await testConnection();
      } catch (connectionError) {
        console.error('Connection test failed:', connectionError);
        throw new Error('Unable to connect to the database. Please check your internet connection and try again.');
      }

      console.log('Database connection successful, creating session...');

      // Create the session with 1 minute expiration
      const sessionData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        questions: validQuestions,
        scale_type: formData.scale_type,
        manager_name: formData.manager_name.trim(),
        manager_email: formData.manager_email.trim().toLowerCase(),
        is_active: true,
        is_public: true,
        expires_at: new Date(Date.now() + 1 * 60 * 1000).toISOString() // 1 minute from now
      };

      console.log('Inserting session data:', sessionData);

      const { data, error } = await supabase
        .from('feedback_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        
        // Provide more specific error messages based on error type
        if (error.code === 'PGRST301') {
          throw new Error('Database connection lost. Please try again.');
        } else if (error.code === '23505') {
          throw new Error('A session with this title already exists. Please use a different title.');
        } else if (error.message.includes('permission')) {
          throw new Error('Permission denied. Please contact support.');
        } else {
          throw new Error(`Failed to create session: ${error.message}`);
        }
      }

      if (!data) {
        throw new Error('Session was created but no data was returned. Please try again.');
      }

      console.log('Session created successfully:', data);

      // Try to send notifications but don't fail if they don't work
      try {
        console.log('Attempting to send notifications...');
        
        // Send notification to manager
        const managerNotification = await supabase.functions.invoke('send-notification', {
          body: {
            type: 'session_created',
            session: data,
            email: formData.manager_email,
            manager_name: formData.manager_name
          }
        });

        console.log('Manager notification result:', managerNotification);

        // Also notify admin (coach)
        const adminNotification = await supabase.functions.invoke('send-notification', {
          body: {
            type: 'public_session_created',
            session: data,
            email: 'chloe@cultivatedhq.com.au',
            manager_name: formData.manager_name
          }
        });

        console.log('Admin notification result:', adminNotification);
      } catch (notificationError) {
        console.warn('Notification failed but session was created:', notificationError);
        // Continue anyway - session was created successfully
      }

      setCreatedSession(data);
      setStep(4);
    } catch (error) {
      console.error('Error creating session:', error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Please try again.';
      
      if (error.message.includes('connection') || error.message.includes('network')) {
        errorMessage = 'Unable to connect to the database. Please check your internet connection and try again.';
      } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        errorMessage = 'Permission denied. Please contact support.';
      } else if (error.message.includes('validation') || error.message.includes('required')) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error creating session: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
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

  const copyShareLink = () => {
    const link = `${window.location.origin}/surveytest/survey/${createdSession.id}`;
    navigator.clipboard.writeText(link);
    alert('Survey link copied to clipboard!');
  };

  const getSurveyLink = () => {
    return `${window.location.origin}/surveytest/survey/${createdSession?.id}`;
  };

  const getExpirationDate = () => {
    if (createdSession?.expires_at) {
      return new Date(createdSession.expires_at).toLocaleString();
    }
    // Calculate 1 minute from now for display
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 1);
    return expirationDate.toLocaleString();
  };

  const validQuestions = formData.questions.filter(q => q.trim().length > 0);

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Navigation */}
      <nav className="bg-beige-50/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <a href="/surveytest" className="text-2xl font-bold gradient-text font-poppins">Survey Test</a>
            <div className="flex space-x-4 items-center">
              <a href="/surveytest" className="text-beige-500 hover:text-primary transition flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum 
                    ? 'bg-primary text-white' 
                    : 'bg-beige-200 text-beige-500'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNum ? 'bg-primary' : 'bg-beige-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <p className="text-beige-600">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Customize your survey"}
              {step === 3 && "Review and create"}
              {step === 4 && "Your survey is ready!"}
            </p>
          </div>
        </div>

        {/* Step 1: Manager Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 font-poppins">Let's Get Started</h2>
              <p className="text-beige-600">We need a few details to create your personalized feedback survey.</p>
              
              {/* Survey Duration Notice */}
              <div className="bg-orange-100 p-4 rounded-lg mt-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="font-semibold text-orange-600">Test Mode - Quick Expiry</span>
                </div>
                <p className="text-sm text-orange-700">
                  This survey will expire in <strong>1 minute</strong> for testing purposes.<br/>
                  Once it closes, you'll receive your feedback report straight to your inbox.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.manager_name}
                  onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Sarah Johnson"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Email *</label>
                <input
                  type="email"
                  value={formData.manager_email}
                  onChange={(e) => setFormData({ ...formData, manager_email: e.target.value })}
                  className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="sarah@company.com"
                  required
                />
                <p className="text-sm text-beige-500 mt-2">
                  We'll send your PDF report to this email address when the survey closes
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Survey Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Test Leadership Feedback Survey"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Additional context for your team about this feedback survey..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.manager_name.trim() || !formData.manager_email.trim() || !formData.title.trim()}
                className={`flex items-center px-8 py-4 rounded-full font-semibold transition ${
                  !formData.manager_name.trim() || !formData.manager_email.trim() || !formData.title.trim()
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                Continue
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customize Questions */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 font-poppins">Customize Your Survey</h2>
              <p className="text-beige-600">Review and customize the feedback questions for your team.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Response Scale</label>
                <select
                  value={formData.scale_type}
                  onChange={(e) => setFormData({ ...formData, scale_type: e.target.value as 'likert_5' | 'likert_7' })}
                  className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="likert_5">5-Point Scale (Strongly Disagree to Strongly Agree)</option>
                  <option value="likert_7">7-Point Scale (Strongly Disagree to Strongly Agree)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium">Questions ({validQuestions.length})</label>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="text-primary hover:text-secondary transition text-sm font-medium"
                  >
                    + Add Question
                  </button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
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
                              className="w-full p-3 border border-beige-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              rows={6}
                              placeholder="Enter your open text question..."
                            />
                          </div>
                        ) : (
                          // Regular Likert scale questions
                          <div>
                            <div className="text-sm text-beige-500 mb-1">Likert Scale Question</div>
                            <input
                              type="text"
                              value={question}
                              onChange={(e) => updateQuestion(index, e.target.value)}
                              className="w-full p-3 border border-beige-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              placeholder="Enter your question..."
                            />
                          </div>
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
                
                {validQuestions.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">At least one question is required.</p>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center px-6 py-3 rounded-full font-medium text-primary hover:bg-primary hover:text-white border border-primary transition"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={validQuestions.length === 0}
                className={`flex items-center px-8 py-4 rounded-full font-semibold transition ${
                  validQuestions.length === 0
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                Review Survey
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 font-poppins">Review Your Survey</h2>
              <p className="text-beige-600">Double-check everything looks good before creating your survey.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-beige-50 p-6 rounded-lg">
                <h3 className="font-bold mb-4">Survey Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-beige-500">Manager:</span>
                    <p className="font-medium">{formData.manager_name}</p>
                  </div>
                  <div>
                    <span className="text-beige-500">Email:</span>
                    <p className="font-medium">{formData.manager_email}</p>
                  </div>
                  <div>
                    <span className="text-beige-500">Title:</span>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-beige-500">Scale:</span>
                    <p className="font-medium">{formData.scale_type === 'likert_5' ? '5-Point' : '7-Point'}</p>
                  </div>
                </div>
                {formData.description && (
                  <div className="mt-4">
                    <span className="text-beige-500">Description:</span>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                )}
              </div>

              <div className="bg-beige-50 p-6 rounded-lg">
                <h3 className="font-bold mb-4">Questions ({validQuestions.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {validQuestions.map((question, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-start">
                        <span className="text-beige-500 mr-2">{index + 1}.</span>
                        <div className="flex-1">
                          {index === 10 ? (
                            <div className="bg-primary/10 p-3 rounded border-l-4 border-primary">
                              <div className="text-primary font-medium text-xs mb-1">OPEN TEXT QUESTION</div>
                              <div className="whitespace-pre-line">{question}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-beige-500 text-xs mb-1">LIKERT SCALE</div>
                              <div>{question}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-orange-100 p-6 rounded-2xl">
                <h3 className="font-bold mb-2 text-orange-600">Survey Timeline (Test Mode)</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-700">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    <span><strong>Opens:</strong> Immediately after creation</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    <span><strong>Closes:</strong> In 1 minute ({getExpirationDate()})</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-orange-600 mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-1 text-orange-700">
                    <li>• Your survey will be created and activated immediately</li>
                    <li>• You'll get a unique link to share with your team</li>
                    <li>• Team members can respond anonymously for 1 minute</li>
                    <li>• The survey automatically closes after 1 minute</li>
                    <li>• A professional PDF report will be generated and emailed to you</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center px-6 py-3 rounded-full font-medium text-primary hover:bg-primary hover:text-white border border-primary transition"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Edit
              </button>
              <button
                onClick={createSession}
                disabled={loading}
                className={`flex items-center px-8 py-4 rounded-full font-semibold transition ${
                  loading
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {loading ? 'Creating Survey...' : 'Create Survey'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && createdSession && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-6 font-poppins">Survey Created Successfully!</h2>
            
            <p className="text-lg text-beige-600 mb-8">
              Your feedback survey is ready and will automatically close in 1 minute. Share the link below with your team to start collecting anonymous feedback.
            </p>

            <div className="bg-beige-50 p-6 rounded-lg mb-8">
              <h3 className="font-bold mb-4">Survey Link</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={getSurveyLink()}
                  readOnly
                  className="flex-1 p-3 border border-beige-200 rounded bg-white text-sm"
                />
                <button
                  onClick={copyShareLink}
                  className="bg-primary text-white px-4 py-3 rounded font-medium hover:bg-secondary transition flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-orange-100 p-6 rounded-lg">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">1-Minute Window</h3>
                <p className="text-sm text-orange-700">Survey closes automatically at {getExpirationDate()}</p>
              </div>
              <div className="bg-primary/10 p-6 rounded-lg">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email Notifications</h3>
                <p className="text-sm text-beige-600">You'll receive updates at {formData.manager_email}</p>
              </div>
              <div className="bg-primary/10 p-6 rounded-lg">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-bold mb-2">PDF Report</h3>
                <p className="text-sm text-beige-600">Professional report automatically generated when survey closes</p>
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href={getSurveyLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary transition inline-flex items-center"
              >
                Preview Survey
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
              
              <div className="flex justify-center space-x-4">
                <a 
                  href="/surveytest/create"
                  className="text-primary hover:text-secondary transition"
                >
                  Create Another Survey
                </a>
                <span className="text-beige-300">|</span>
                <a 
                  href="/surveytest"
                  className="text-primary hover:text-secondary transition"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SurveyTestCreate;