import Alpine from 'alpinejs'

// Results Store - Survey response data and analytics
Alpine.store('results', {
  // Summary metrics
  totalResponses: 247,
  responseRate: 68.3, // percentage
  avgCompletionTime: 3.2, // minutes
  lastResponse: '2025-07-31T09:45:00Z',
  
  // Response status breakdown
  completed: 247,
  started: 362, // including completed
  partialResponses: 115, // started but not completed
  
  // Time-based data for charts
  responsesOverTime: [
    { date: '2025-07-24', responses: 12 },
    { date: '2025-07-25', responses: 28 },
    { date: '2025-07-26', responses: 45 },
    { date: '2025-07-27', responses: 38 },
    { date: '2025-07-28', responses: 52 },
    { date: '2025-07-29', responses: 41 },
    { date: '2025-07-30', responses: 31 }
  ],
  
  // Mock response data for each question
  questionResults: {
    // Q1: Multiple Choice - Satisfaction
    'q1': {
      type: 'multiple_choice',
      totalResponses: 247,
      responses: [
        { optionId: 'o1', optionText: 'Very Satisfied', count: 89, percentage: 36.0 },
        { optionId: 'o2', optionText: 'Satisfied', count: 98, percentage: 39.7 },
        { optionId: 'o3', optionText: 'Neutral', count: 35, percentage: 14.2 },
        { optionId: 'o4', optionText: 'Dissatisfied', count: 18, percentage: 7.3 },
        { optionId: 'o5', optionText: 'Very Dissatisfied', count: 7, percentage: 2.8 }
      ],
      skipped: 0,
      avgScore: 4.01, // 1-5 scale
      sentiment: 'positive' // positive, neutral, negative
    },
    
    // Q2: Text Input - Feedback
    'q2': {
      type: 'text_input',
      totalResponses: 184, // Some skipped this optional question
      responses: [
        { id: 'r1', text: 'The food was excellent, especially the pasta. Service could be faster during peak hours.', timestamp: '2025-07-31T09:30:00Z', sentiment: 'positive' },
        { id: 'r2', text: 'Great atmosphere and friendly staff. Would definitely come back!', timestamp: '2025-07-31T08:45:00Z', sentiment: 'positive' },
        { id: 'r3', text: 'Food was good but took a long time to arrive. Maybe hire more kitchen staff?', timestamp: '2025-07-31T07:15:00Z', sentiment: 'neutral' },
        { id: 'r4', text: 'Loved the ambiance and the wine selection. Perfect for a date night.', timestamp: '2025-07-30T20:30:00Z', sentiment: 'positive' },
        { id: 'r5', text: 'The dessert was amazing! Could use more vegetarian options though.', timestamp: '2025-07-30T19:45:00Z', sentiment: 'positive' },
        { id: 'r6', text: 'Service was slow and the food was cold when it arrived. Not impressed.', timestamp: '2025-07-30T18:20:00Z', sentiment: 'negative' },
        { id: 'r7', text: 'Beautiful restaurant with great views. Food quality could be improved for the price.', timestamp: '2025-07-30T17:30:00Z', sentiment: 'neutral' },
        { id: 'r8', text: 'Outstanding experience from start to finish. Will recommend to friends!', timestamp: '2025-07-30T16:45:00Z', sentiment: 'positive' }
      ],
      skipped: 63,
      wordCloud: [
        { word: 'food', count: 45, sentiment: 'neutral' },
        { word: 'service', count: 38, sentiment: 'mixed' },
        { word: 'excellent', count: 32, sentiment: 'positive' },
        { word: 'great', count: 29, sentiment: 'positive' },
        { word: 'staff', count: 24, sentiment: 'positive' },
        { word: 'slow', count: 19, sentiment: 'negative' },
        { word: 'atmosphere', count: 16, sentiment: 'positive' },
        { word: 'delicious', count: 14, sentiment: 'positive' },
        { word: 'recommend', count: 12, sentiment: 'positive' },
        { word: 'improve', count: 11, sentiment: 'neutral' }
      ],
      sentimentBreakdown: {
        positive: 112, // 60.9%
        neutral: 51,   // 27.7%
        negative: 21   // 11.4%
      }
    },
    
    // Q3: Rating Scale - NPS
    'q3': {
      type: 'rating_scale',
      totalResponses: 247,
      responses: [
        { value: 0, count: 2 },
        { value: 1, count: 1 },
        { value: 2, count: 3 },
        { value: 3, count: 8 },
        { value: 4, count: 12 },
        { value: 5, count: 18 },
        { value: 6, count: 24 },
        { value: 7, count: 35 },
        { value: 8, count: 52 },
        { value: 9, count: 48 },
        { value: 10, count: 44 }
      ],
      skipped: 0,
      avgScore: 7.8,
      npsScore: 52, // Net Promoter Score
      npsBreakdown: {
        promoters: 144, // 9-10 ratings (58.3%)
        passives: 87,   // 7-8 ratings (35.2%)
        detractors: 16  // 0-6 ratings (6.5%)
      },
      distribution: {
        min: 0,
        max: 10,
        median: 8,
        mode: 8
      }
    }
  },
  
  // Cross-tabulation data (satisfaction by recommendation)
  crossTabulation: {
    'q1_vs_q3': {
      title: 'Satisfaction vs Recommendation',
      data: [
        { q1Option: 'Very Satisfied', avgNPS: 9.2, count: 89 },
        { q1Option: 'Satisfied', avgNPS: 8.1, count: 98 },
        { q1Option: 'Neutral', avgNPS: 6.3, count: 35 },
        { q1Option: 'Dissatisfied', avgNPS: 3.8, count: 18 },
        { q1Option: 'Very Dissatisfied', avgNPS: 1.4, count: 7 }
      ]
    }
  },
  
  // Export functionality
  exportFormats: ['csv', 'excel', 'pdf', 'json'],
  
  // Actions
  getQuestionResult(questionId) {
    return this.questionResults[questionId] || null
  },
  
  getOverallSentiment() {
    const textResults = this.questionResults['q2']
    if (!textResults) return 'neutral'
    
    const { positive, neutral, negative } = textResults.sentimentBreakdown
    const total = positive + neutral + negative
    
    if (positive / total > 0.6) return 'positive'
    if (negative / total > 0.4) return 'negative'
    return 'neutral'
  },
  
  getCompletionRate() {
    return Math.round((this.completed / this.started) * 100 * 10) / 10
  },
  
  getResponseTrend() {
    const recent = this.responsesOverTime.slice(-3)
    const older = this.responsesOverTime.slice(-6, -3)
    
    const recentAvg = recent.reduce((sum, day) => sum + day.responses, 0) / recent.length
    const olderAvg = older.reduce((sum, day) => sum + day.responses, 0) / older.length
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100
    
    return {
      trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      percentage: Math.abs(Math.round(change))
    }
  },
  
  // Filter responses by date range
  filterByDateRange(startDate, endDate) {
    // This would filter the actual response data in a real implementation
    console.log(`Filtering responses from ${startDate} to ${endDate}`)
  },
  
  // Export data in various formats
  exportData(format, questionId = null) {
    const data = questionId ? this.getQuestionResult(questionId) : this.questionResults
    
    switch (format) {
      case 'csv':
        return this.generateCSV(data)
      case 'excel':
        return this.generateExcel(data)
      case 'pdf':
        return this.generatePDF(data)
      case 'json':
        return JSON.stringify(data, null, 2)
      default:
        return data
    }
  },
  
  generateCSV(data) {
    // Mock CSV generation
    return 'question,response,count,percentage\n' + 
           'Sample CSV data would be generated here...'
  },
  
  generateExcel(data) {
    // Mock Excel generation
    return 'Excel file would be generated here...'
  },
  
  generatePDF(data) {
    // Mock PDF generation
    return 'PDF report would be generated here...'
  }
})