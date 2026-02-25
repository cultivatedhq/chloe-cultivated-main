import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    urlValue: supabaseUrl,
    keyLength: supabaseAnonKey?.length
  });
  throw new Error('Missing Supabase environment variables. Please check your configuration.');
}

console.log('Supabase configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'pulse-check'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Test the connection with better error handling
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('feedback_sessions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      console.log('Supabase connection test successful');
      return true;
    }
  } catch (error) {
    console.error('Connection test error:', error);
    throw error;
  }
};

// Types for our database
export interface FeedbackSession {
  id: string;
  title: string;
  description?: string;
  questions: string[];
  scale_type: 'likert_5' | 'likert_7';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  response_count: number;
  manager_name: string;
  manager_email: string;
  is_public: boolean;
  expires_at: string;
  report_generated?: boolean;
  report_sent?: boolean;
  report_sent_at?: string;
}

export interface FeedbackResponse {
  id: string;
  session_id: string;
  responses: number[];
  comment?: string;
  submitted_at: string;
}

export interface SessionStats {
  session_id: string;
  total_responses: number;
  question_averages: number[];
  question_medians: number[];
  comments: string[];
}