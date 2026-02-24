import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  session: {
    id: string;
    title: string;
    description?: string;
    questions: string[];
    scale_type: 'likert_5' | 'likert_7';
    response_count: number;
    created_at: string;
    expires_at: string;
    manager_name: string;
    manager_email: string;
  };
  responses: Array<{
    responses: number[];
    comment?: string;
    submitted_at: string;
  }>;
}

export interface ProcessedReportData {
  session: ReportData['session'];
  analytics: {
    question_averages: number[];
    question_medians: number[];
    response_distribution: number[][];
    comments: string[];
    total_responses: number;
    overall_average: number;
    strongest_area: string;
    strongest_score: number;
    weakest_area: string;
    weakest_score: number;
    comment_count: number;
  };
}

export const processResponseData = (data: ReportData): ProcessedReportData => {
  const { session, responses } = data;
  const questionCount = session.questions.length;
  const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;
  
  // Initialize analytics
  const question_averages: number[] = [];
  const question_medians: number[] = [];
  const response_distribution: number[][] = [];
  const comments: string[] = [];
  
  // Process each question
  for (let i = 0; i < questionCount; i++) {
    const questionResponses = responses
      .map(r => r.responses[i])
      .filter(r => r > 0 && r <= scaleMax);
    
    if (questionResponses.length > 0) {
      // Calculate average
      const sum = questionResponses.reduce((acc, val) => acc + val, 0);
      question_averages.push(sum / questionResponses.length);
      
      // Calculate median
      const sorted = [...questionResponses].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      question_medians.push(
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid]
      );
      
      // Calculate distribution
      const distribution = new Array(scaleMax).fill(0);
      questionResponses.forEach(response => {
        distribution[response - 1]++;
      });
      response_distribution.push(distribution);
    } else {
      question_averages.push(0);
      question_medians.push(0);
      response_distribution.push(new Array(scaleMax).fill(0));
    }
  }
  
  // Collect comments
  responses.forEach(response => {
    if (response.comment && response.comment.trim()) {
      comments.push(response.comment.trim());
    }
  });
  
  // Calculate overall metrics
  const validAverages = question_averages.filter(avg => avg > 0);
  const overall_average = validAverages.length > 0 
    ? validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length 
    : 0;
  
  // Find strongest and weakest areas
  const maxIndex = question_averages.indexOf(Math.max(...question_averages));
  const minIndex = question_averages.indexOf(Math.min(...validAverages));
  
  return {
    session,
    analytics: {
      question_averages,
      question_medians,
      response_distribution,
      comments,
      total_responses: responses.length,
      overall_average,
      strongest_area: session.questions[maxIndex] || 'N/A',
      strongest_score: question_averages[maxIndex] || 0,
      weakest_area: session.questions[minIndex] || 'N/A',
      weakest_score: question_averages[minIndex] || 0,
      comment_count: comments.length
    }
  };
};

const generateHTMLReport = (processedData: ProcessedReportData): string => {
  const { session, analytics } = processedData;
  const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;
  const overallPercentage = Math.round((analytics.overall_average / scaleMax) * 100);
  
  // Generate questions HTML
  const questionsHTML = session.questions.map((question, index) => {
    const average = analytics.question_averages[index] || 0;
    const median = analytics.question_medians[index] || 0;
    const distribution = analytics.response_distribution[index] || [];
    
    const distributionHTML = distribution.map((count, i) => 
      `${i + 1}⭐ ${count}`
    ).join(' | ');
    
    return `
      <div class="question-block">
        <h3>${question}</h3>
        <p>Average: ${average.toFixed(2)} / Median: ${median.toFixed(1)}</p>
        <p>Responses: ${distributionHTML}</p>
      </div>
    `;
  }).join('');
  
  // Generate comments HTML
  const commentsHTML = analytics.comments.map(comment => `
    <div class="comment">${comment}</div>
  `).join('');
  
  // Generate recommendations based on score
  let recommendations = '';
  if (overallPercentage >= 80) {
    recommendations = 'You\'re performing strongly. Consider mentoring emerging leaders and sharing your practices across teams.';
  } else if (overallPercentage >= 60) {
    recommendations = `You have a solid leadership foundation. Target specific areas for refinement, especially around ${analytics.weakest_area}.`;
  } else {
    recommendations = 'Improvement needed. We recommend structured leadership coaching focused on core behaviors like clarity, accountability, and feedback.';
  }
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Leadership Feedback Report</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 40px;
      color: #333;
      line-height: 1.6;
    }

    h1, h2, h3 {
      color: #00695C; /* Cultivated HQ teal */
    }

    .header, .footer {
      text-align: center;
      border-bottom: 2px solid #00695C;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }

    .section {
      margin-bottom: 40px;
    }

    .box {
      border: 1px solid #ccc;
      padding: 20px;
      margin-top: 10px;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .question-block {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .comment {
      background-color: #e0f2f1;
      border-left: 4px solid #00695C;
      padding: 10px;
      margin-bottom: 10px;
    }

    .footer {
      font-size: 0.8em;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      color: #777;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>Leadership Feedback Report</h1>
    <p>Generated by Cultivated HQ</p>
  </div>

  <div class="section">
    <h2>Survey Overview</h2>
    <div class="box">
      <p><strong>Manager Name:</strong> ${session.manager_name}</p>
      <p><strong>Survey Period:</strong> ${new Date(session.created_at).toLocaleDateString()} to ${new Date(session.expires_at).toLocaleDateString()}</p>
      <p><strong>Total Responses:</strong> ${analytics.total_responses}</p>
      <p><strong>Scale:</strong> 1 = Strongly Disagree to ${scaleMax} = Strongly Agree</p>
    </div>
  </div>

  <div class="section">
    <h2>Key Insights Summary</h2>
    <div class="box">
      <p><strong>Overall Leadership Score:</strong> ${overallPercentage}%</p>
      <p><strong>Strongest Area:</strong> ${analytics.strongest_area} (${analytics.strongest_score.toFixed(2)})</p>
      <p><strong>Development Opportunity:</strong> ${analytics.weakest_area} (${analytics.weakest_score.toFixed(2)})</p>
      <p><strong>Anonymous Comments:</strong> ${analytics.comment_count}</p>
    </div>
  </div>

  <div class="section">
    <h2>Detailed Results</h2>
    ${questionsHTML}
  </div>

  ${analytics.comments.length > 0 ? `
  <div class="section">
    <h2>Anonymous Comments</h2>
    ${commentsHTML}
  </div>
  ` : ''}

  <div class="section">
    <h2>Development Recommendations</h2>
    <div class="box">
      <p>${recommendations}</p>
    </div>
  </div>

  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()} | Cultivated HQ</p>
  </div>

</body>
</html>
  `;
};

export const generatePDFFromHTML = async (processedData: ProcessedReportData): Promise<Uint8Array> => {
  // Create a temporary container for the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '210mm'; // A4 width
  container.style.backgroundColor = 'white';
  container.innerHTML = generateHTMLReport(processedData);
  
  document.body.appendChild(container);
  
  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    return pdf.output('arraybuffer') as Uint8Array;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

export const generatePDFReport = async (processedData: ProcessedReportData): Promise<Uint8Array> => {
  try {
    return await generatePDFFromHTML(processedData);
  } catch (error) {
    console.error('Error generating PDF from HTML, falling back to jsPDF:', error);
    
    // Fallback to direct jsPDF generation
    const { session, analytics } = processedData;
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;
    
    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 105, 92); // Cultivated HQ teal
    pdf.text('Leadership Feedback Report', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by Cultivated HQ', 20, yPosition);
    yPosition += 20;
    
    // Session Overview
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Survey Overview', 20, yPosition);
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(`Manager: ${session.manager_name}`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Survey Period: ${new Date(session.created_at).toLocaleDateString()} to ${new Date(session.expires_at).toLocaleDateString()}`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Total Responses: ${analytics.total_responses}`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Scale: 1 = Strongly Disagree to ${session.scale_type === 'likert_7' ? '7' : '5'} = Strongly Agree`, 20, yPosition, pageWidth - 40);
    yPosition += 20;
    
    // Key Insights
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Insights Summary', 20, yPosition);
    yPosition += 15;
    
    const scaleMax = session.scale_type === 'likert_7' ? 7 : 5;
    const overallPercentage = Math.round((analytics.overall_average / scaleMax) * 100);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(`Overall Leadership Score: ${overallPercentage}%`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Strongest Area: ${analytics.strongest_area} (${analytics.strongest_score.toFixed(2)})`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Development Opportunity: ${analytics.weakest_area} (${analytics.weakest_score.toFixed(2)})`, 20, yPosition, pageWidth - 40);
    yPosition += 5;
    yPosition = addWrappedText(`Anonymous Comments: ${analytics.comment_count}`, 20, yPosition, pageWidth - 40);
    yPosition += 20;
    
    return pdf.output('arraybuffer') as Uint8Array;
  }
};

export const downloadPDFReport = async (processedData: ProcessedReportData) => {
  const pdfBytes = await generatePDFReport(processedData);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${processedData.session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_feedback_report.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};