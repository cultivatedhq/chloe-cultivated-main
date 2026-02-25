# Survey Data Calculation Examples

## JavaScript Logic for Processing Survey Data

### 1. Calculate Average Score for Each Question
```javascript
function calculateQuestionAverages(responses, questionCount, scaleMax) {
  const questionAverages = [];
  
  for (let questionIndex = 0; questionIndex < questionCount; questionIndex++) {
    const questionResponses = responses
      .map(response => response.responses[questionIndex])
      .filter(value => value > 0 && value <= scaleMax);
    
    if (questionResponses.length > 0) {
      const sum = questionResponses.reduce((total, value) => total + value, 0);
      const average = sum / questionResponses.length;
      questionAverages.push(Math.round(average * 100) / 100); // Round to 2 decimal places
    } else {
      questionAverages.push(0);
    }
  }
  
  return questionAverages;
}
```

### 2. Calculate Median for Each Question
```javascript
function calculateQuestionMedians(responses, questionCount, scaleMax) {
  const questionMedians = [];
  
  for (let questionIndex = 0; questionIndex < questionCount; questionIndex++) {
    const questionResponses = responses
      .map(response => response.responses[questionIndex])
      .filter(value => value > 0 && value <= scaleMax)
      .sort((a, b) => a - b);
    
    if (questionResponses.length > 0) {
      const middle = Math.floor(questionResponses.length / 2);
      let median;
      
      if (questionResponses.length % 2 === 0) {
        // Even number of responses - average of two middle values
        median = (questionResponses[middle - 1] + questionResponses[middle]) / 2;
      } else {
        // Odd number of responses - middle value
        median = questionResponses[middle];
      }
      
      questionMedians.push(Math.round(median * 10) / 10); // Round to 1 decimal place
    } else {
      questionMedians.push(0);
    }
  }
  
  return questionMedians;
}
```

### 3. Calculate Response Distribution
```javascript
function calculateResponseDistribution(responses, questionCount, scaleMax) {
  const distributions = [];
  
  for (let questionIndex = 0; questionIndex < questionCount; questionIndex++) {
    const distribution = {};
    
    // Initialize distribution object with all possible values
    for (let i = 1; i <= scaleMax; i++) {
      distribution[i] = 0;
    }
    
    // Count responses for this question
    responses.forEach(response => {
      const value = response.responses[questionIndex];
      if (value > 0 && value <= scaleMax) {
        distribution[value]++;
      }
    });
    
    distributions.push(distribution);
  }
  
  return distributions;
}
```

### 4. Find Strongest and Weakest Questions
```javascript
function findStrongestAndWeakest(questionAverages, questions) {
  const validAverages = questionAverages
    .map((avg, index) => ({ average: avg, index, question: questions[index] }))
    .filter(item => item.average > 0);
  
  if (validAverages.length === 0) {
    return {
      strongest: { question: 'N/A', score: 0, index: -1 },
      weakest: { question: 'N/A', score: 0, index: -1 }
    };
  }
  
  const strongest = validAverages.reduce((max, current) => 
    current.average > max.average ? current : max
  );
  
  const weakest = validAverages.reduce((min, current) => 
    current.average < min.average ? current : min
  );
  
  return {
    strongest: {
      question: strongest.question,
      score: strongest.average,
      index: strongest.index
    },
    weakest: {
      question: weakest.question,
      score: weakest.average,
      index: weakest.index
    }
  };
}
```

### 5. Calculate Overall Performance
```javascript
function calculateOverallPerformance(questionAverages, scaleMax) {
  const validAverages = questionAverages.filter(avg => avg > 0);
  
  if (validAverages.length === 0) {
    return {
      overallAverage: 0,
      percentage: 0,
      category: 'no_data'
    };
  }
  
  const overallAverage = validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length;
  const percentage = Math.round((overallAverage / scaleMax) * 100);
  
  let category = 'needs_improvement';
  if (percentage >= 80) category = 'excellent';
  else if (percentage >= 60) category = 'good';
  else if (percentage >= 40) category = 'fair';
  
  return {
    overallAverage: Math.round(overallAverage * 100) / 100,
    percentage,
    category
  };
}
```

### 6. Process Comments
```javascript
function processComments(responses) {
  const comments = responses
    .map(response => response.comment)
    .filter(comment => comment && comment.trim().length > 0)
    .map(comment => comment.trim());
  
  return {
    comments,
    count: comments.length
  };
}
```

### 7. Complete Processing Function
```javascript
function processeSurveyData(survey, responses) {
  const questionCount = survey.questions.length;
  const scaleMax = survey.scale_type === 'likert_7' ? 7 : 5;
  
  // Calculate all metrics
  const questionAverages = calculateQuestionAverages(responses, questionCount, scaleMax);
  const questionMedians = calculateQuestionMedians(responses, questionCount, scaleMax);
  const distributions = calculateResponseDistribution(responses, questionCount, scaleMax);
  const strongestWeakest = findStrongestAndWeakest(questionAverages, survey.questions);
  const overallPerformance = calculateOverallPerformance(questionAverages, scaleMax);
  const commentsData = processComments(responses);
  
  // Create comprehensive report data
  const reportData = {
    session: {
      id: survey.id,
      title: survey.title,
      manager_name: survey.manager_name,
      manager_email: survey.manager_email,
      questions: survey.questions,
      scale_type: survey.scale_type,
      scale_max: scaleMax,
      created_at: survey.created_at,
      expires_at: survey.expires_at,
      description: survey.description
    },
    analytics: {
      total_responses: responses.length,
      question_averages: questionAverages,
      question_medians: questionMedians,
      response_distributions: distributions,
      overall_average: overallPerformance.overallAverage,
      overall_percentage: overallPerformance.percentage,
      performance_category: overallPerformance.category,
      strongest_area: strongestWeakest.strongest.question,
      strongest_score: strongestWeakest.strongest.score,
      strongest_index: strongestWeakest.strongest.index,
      weakest_area: strongestWeakest.weakest.question,
      weakest_score: strongestWeakest.weakest.score,
      weakest_index: strongestWeakest.weakest.index,
      comments: commentsData.comments,
      comment_count: commentsData.count
    },
    processing: {
      processed_at: new Date().toISOString(),
      status: responses.length > 0 ? 'ready_for_report' : 'no_responses'
    }
  };
  
  return reportData;
}
```

### 8. Usage Example in Bolt
```javascript
// Inside the "For Each" loop for processing surveys
const processedData = processeSurveyData(survey, responses);

// Log processing results
console.log(`Processing survey: ${survey.title}`);
console.log(`Responses: ${processedData.analytics.total_responses}`);
console.log(`Overall score: ${processedData.analytics.overall_percentage}%`);
console.log(`Strongest area: ${processedData.analytics.strongest_area}`);
console.log(`Development area: ${processedData.analytics.weakest_area}`);

// Return processed data for next steps
return processedData;
```

## SQL Alternative for Complex Calculations

If you prefer to do calculations in SQL rather than JavaScript:

### Calculate All Metrics in One Query
```sql
WITH survey_analysis AS (
  SELECT 
    fs.id,
    fs.title,
    fs.manager_name,
    fs.manager_email,
    fs.questions,
    fs.scale_type,
    CASE WHEN fs.scale_type = 'likert_7' THEN 7 ELSE 5 END as scale_max,
    COUNT(fr.id) as total_responses,
    
    -- Calculate averages for each question position
    ARRAY(
      SELECT ROUND(AVG((response_val::text)::numeric), 2)
      FROM (
        SELECT 
          jsonb_array_elements(fr_inner.responses) as response_val,
          row_number() OVER () as pos
        FROM feedback_responses fr_inner
        WHERE fr_inner.session_id = fs.id
      ) expanded
      WHERE pos = question_pos
        AND (response_val::text)::numeric > 0
        AND (response_val::text)::numeric <= CASE WHEN fs.scale_type = 'likert_7' THEN 7 ELSE 5 END
      GROUP BY question_pos
      ORDER BY question_pos
    ) as question_averages,
    
    -- Get all comments
    ARRAY(
      SELECT fr.comment
      FROM feedback_responses fr
      WHERE fr.session_id = fs.id
        AND fr.comment IS NOT NULL
        AND TRIM(fr.comment) != ''
      ORDER BY fr.submitted_at
    ) as comments
    
  FROM feedback_sessions fs
  LEFT JOIN feedback_responses fr ON fs.id = fr.session_id
  CROSS JOIN generate_series(1, jsonb_array_length(fs.questions)) as question_pos
  WHERE fs.id = $1
  GROUP BY fs.id, fs.title, fs.manager_name, fs.manager_email, fs.questions, fs.scale_type
)
SELECT 
  *,
  -- Overall average
  (
    SELECT ROUND(AVG(avg_val), 2)
    FROM unnest(question_averages) as avg_val
    WHERE avg_val > 0
  ) as overall_average,
  
  -- Performance percentage
  ROUND(
    (
      SELECT AVG(avg_val)
      FROM unnest(question_averages) as avg_val
      WHERE avg_val > 0
    ) / scale_max * 100
  ) as performance_percentage,
  
  -- Comment count
  array_length(comments, 1) as comment_count
  
FROM survey_analysis;
```

This provides you with both JavaScript and SQL approaches for implementing the survey processing logic in Bolt!