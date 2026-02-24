import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { supabase, FeedbackSession, testConnection } from '../../lib/supabase';

function SurveyTestSurvey() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [responses, setResponses] = useState<number[]>([]);
  const [comment, setComment] = useState('');
  const [openTextResponse, setOpenTextResponse] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showOpenText, setShowOpenText] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (session?.expires_at) {
      const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const expiry = new Date(session.expires_at).getTime();
        const difference = expiry - now;

        if (difference > 0) {
          const minutes = Math.floor(difference / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes} minute${minutes !== 1 ? 's' : ''}, ${seconds} second${seconds !== 1 ? 's' : ''} remaining`);
        } else {
          setTimeRemaining('Survey has expired');
          // Automatically reload the page if the survey expires while user is on it
          window.location.reload();
        }
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [session]);

  const loadSession = async () => {
    try {
      console.log('Loading session:', sessionId);
      
      // Test connection first
      try {
        await testConnection();
      } catch (connectionError) {
        console.error('Connection test failed:', connectionError);
        setError('Unable to connect to the database. Please check your internet connection and try again.');
        return;
      }
      
      const { data, error } = await supabase
        .from('feedback_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error loading session:', error);
        if (error.code === 'PGRST116') {
          setError('Survey not found or no longer active.');
        } else {
          setError('Unable to load survey. Please check the link and try again.');
        }
        return;
      }
      
      if (!data) {
        setError('Survey not found or no longer active.');
        return;
      }

      // Check if survey has expired
      const now = new Date();
      const expiryDate = new Date(data.expires_at);
      
      if (now > expiryDate) {
        setError('This survey has closed. The feedback window has ended.');
        return;
      }

      // Check if survey is still active
      if (!data.is_active) {
        setError('This survey is no longer accepting responses.');
        return;
      }

      console.log('Session loaded successfully:', data);
      setSession(data);
      
      // Initialize responses array - only for Likert scale questions (first 10)
      const likertQuestions = data.questions.slice(0, 10);
      setResponses(new Array(likertQuestions.length).fill(0));
    } catch (error) {
      console.error('Error loading session:', error);
      setError('Unable to load survey. Please check the link and try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (questionIndex: number, value: number) => {
    const newResponses = [...responses];
    newResponses[questionIndex] = value;
    setResponses(newResponses);
  };

  const nextQuestion = () => {
    if (currentQuestion < 9) { // First 10 questions (0-9) are Likert scale
      setCurrentQuestion(currentQuestion + 1);
    } else if (session?.questions.length > 10) {
      // Go to open text question (11th question)
      setShowOpenText(true);
    } else {
      // Go to comments
      setShowComments(true);
    }
  };

  const prevQuestion = () => {
    if (showComments) {
      if (session?.questions.length > 10) {
        setShowComments(false);
        setShowOpenText(true);
      } else {
        setShowComments(false);
        setCurrentQuestion(9);
      }
    } else if (showOpenText) {
      setShowOpenText(false);
      setCurrentQuestion(9);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const continueToComments = () => {
    setShowOpenText(false);
    setShowComments(true);
  };

  const submitSurvey = async () => {
    if (!session || !sessionId) return;

    // Validate all Likert scale questions are answered
    if (responses.some(r => r === 0)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Check if survey is still within the time window
    const now = new Date();
    const expiryDate = new Date(session.expires_at);
    
    if (now > expiryDate) {
      alert('This survey has expired and is no longer accepting responses.');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare the submission data
      const submissionData = {
        session_id: sessionId,
        responses: responses,
        comment: comment.trim() || null
      };

      // If there's an open text response, add it to the comment
      if (openTextResponse.trim()) {
        const openTextPrefix = "Start/Stop/Keep Response:\n\n";
        if (submissionData.comment) {
          submissionData.comment = openTextPrefix + openTextResponse.trim() + "\n\nAdditional Comments:\n" + submissionData.comment;
        } else {
          submissionData.comment = openTextPrefix + openTextResponse.trim();
        }
      }

      console.log('Submitting data to Supabase:', submissionData);

      // Use the service role key for this request to bypass RLS
      const { data, error } = await supabase
        .from('feedback_responses')
        .insert([submissionData])
        .select();

      if (error) {
        console.error('Error submitting response:', error);
        
        if (error.code === 'PGRST301') {
          throw new Error('Database connection lost. Please try again.');
        } else if (error.message.includes('permission')) {
          throw new Error('Permission denied. This may be due to the survey being expired or inactive.');
        } else {
          throw new Error(`Failed to submit response: ${error.message}`);
        }
      }

      console.log('Response submitted successfully:', data);

      // Call the instant report generation function
      try {
        console.log('Triggering instant report generation...');
        
        const { data: reportResult, error: reportError } = await supabase.functions.invoke('generate-and-send-report-instant', {
          body: { sessionId: sessionId }
        });

        if (reportError) {
          console.error('Report generation error:', reportError);
          // Don't fail the submission if report generation fails
        } else {
          console.log('Report generation triggered successfully:', reportResult);
        }
      } catch (reportError) {
        console.warn('Report generation failed but response was submitted:', reportError);
        // Continue anyway - response was submitted successfully
      }

      // Try to send notification email but don't fail if it doesn't work
      try {
        await supabase.functions.invoke('send-notification', {
          body: {
            type: 'new_response',
            session: session,
            email: 'chloe@cultivatedhq.com.au'
          }
        });
      } catch (notificationError) {
        console.warn('Notification failed but response was submitted:', notificationError);
      }

      navigate('/surveytest/thankyou');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert(`Error submitting survey: ${error.message || 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getScaleLabels = () => {
    if (session?.scale_type === 'likert_7') {
      return [
        'Strongly Disagree',
        'Disagree',
        'Somewhat Disagree',
        'Neutral',
        'Somewhat Agree',
        'Agree',
        'Strongly Agree'
      ];
    }
    return [
      'Strongly Disagree',
      'Disagree',
      'Neutral',
      'Agree',
      'Strongly Agree'
    ];
  };

  const getScaleValue = (index: number) => {
    return session?.scale_type === 'likert_7' ? index + 1 : index + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-beige-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Survey Not Available</h1>
          <p className="text-beige-600 mb-6">{error}</p>
          {error.includes('expired') || error.includes('closed') ? (
            <div className="bg-beige-100 p-4 rounded-lg mb-6">
              <p className="text-sm text-beige-700">
                This test survey closed after 1 minute as scheduled. The manager will receive their feedback report automatically.
              </p>
            </div>
          ) : null}
          <a 
            href="/surveytest"
            className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const scaleLabels = getScaleLabels();
  const likertQuestions = session.questions.slice(0, 10); // First 10 are Likert scale
  const openTextQuestion = session.questions[10]; // 11th question is open text
  const isLastLikertQuestion = currentQuestion === (likertQuestions.length - 1);
  
  // Calculate total steps: Likert questions + open text (if exists) + comments
  const totalSteps = likertQuestions.length + (openTextQuestion ? 1 : 0) + 1;
  let currentStep = currentQuestion + 1;
  if (showOpenText) currentStep = likertQuestions.length + 1;
  if (showComments) currentStep = totalSteps;
  
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-beige-50 text-beige-800">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-poppins">{session.title}</h1>
            <div className="flex items-center text-sm text-beige-500">
              <Shield className="w-4 h-4 mr-2" />
              Anonymous & Secure
            </div>
          </div>
          
          {session.description && (
            <p className="text-beige-600 mb-4">{session.description}</p>
          )}

          {/* Time Remaining Notice */}
          {timeRemaining && (
            <div className="bg-orange-100 p-3 rounded-lg mb-4">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-medium text-orange-600">Test Mode - Quick Expiry: </span>
                <span className="ml-1 text-orange-700">{timeRemaining}</span>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-beige-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-beige-500 mt-2">
            {showComments 
              ? 'Comments (Optional)' 
              : showOpenText 
                ? 'Leadership Feedback Question'
                : `Question ${currentQuestion + 1} of ${likertQuestions.length}`
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!showOpenText && !showComments ? (
          // Likert Scale Questions (1-10)
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-8 text-center">
              {likertQuestions[currentQuestion]}
            </h2>

            <div className="space-y-4">
              {scaleLabels.map((label, index) => (
                <label 
                  key={index}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    responses[currentQuestion] === getScaleValue(index)
                      ? 'border-primary bg-primary/10'
                      : 'border-beige-200 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={getScaleValue(index)}
                    checked={responses[currentQuestion] === getScaleValue(index)}
                    onChange={() => updateResponse(currentQuestion, getScaleValue(index))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                    responses[currentQuestion] === getScaleValue(index)
                      ? 'border-primary bg-primary'
                      : 'border-beige-300'
                  }`}>
                    {responses[currentQuestion] === getScaleValue(index) && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="flex-1">{label}</span>
                  <span className="text-sm text-beige-500 ml-4">{getScaleValue(index)}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition ${
                  currentQuestion === 0
                    ? 'text-beige-400 cursor-not-allowed'
                    : 'text-primary hover:bg-primary hover:text-white border border-primary'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <button
                onClick={nextQuestion}
                disabled={responses[currentQuestion] === 0}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition ${
                  responses[currentQuestion] === 0
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {isLastLikertQuestion 
                  ? (openTextQuestion ? 'Continue to Leadership Question' : 'Continue to Comments')
                  : 'Next'
                }
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ) : showOpenText ? (
          // Open Text Question (11th question)
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Leadership Feedback
            </h2>
            
            <div className="bg-primary/5 p-6 rounded-lg mb-6">
              <div className="whitespace-pre-line text-lg leading-relaxed">
                {openTextQuestion}
              </div>
            </div>

            <textarea
              value={openTextResponse}
              onChange={(e) => setOpenTextResponse(e.target.value)}
              className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={8}
              placeholder="Share your thoughts here... You can answer one, two, or all three areas."
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                className="flex items-center px-6 py-3 rounded-full font-medium text-primary hover:bg-primary hover:text-white border border-primary transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Questions
              </button>

              <button
                onClick={continueToComments}
                className="flex items-center px-6 py-3 rounded-full font-medium bg-primary text-white hover:bg-secondary transition"
              >
                Continue to Comments
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ) : (
          // Comments section
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Additional Comments (Optional)
            </h2>
            <p className="text-beige-600 text-center mb-8">
              Share any additional thoughts or specific examples that might help with leadership development.
            </p>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 border border-beige-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={6}
              placeholder="Your comments remain completely anonymous..."
            />

            <div className="flex justify-between mt-8">
              <button
                onClick={prevQuestion}
                className="flex items-center px-6 py-3 rounded-full font-medium text-primary hover:bg-primary hover:text-white border border-primary transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>

              <button
                onClick={submitSurvey}
                disabled={submitting}
                className={`flex items-center px-8 py-3 rounded-full font-medium transition ${
                  submitting
                    ? 'bg-beige-200 text-beige-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-secondary'
                }`}
              >
                {submitting ? 'Submitting & Processing...' : 'Submit Feedback'}
                {!submitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm">
            <Shield className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm text-beige-600">
              Your responses are completely anonymous and secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyTestSurvey;