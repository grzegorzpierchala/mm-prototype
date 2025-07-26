import Alpine from 'alpinejs'

// Survey Store - Main survey data and questions
Alpine.store('survey', {
  // Survey metadata
  title: 'Customer Satisfaction Survey 2024',
  description: 'Help us improve your dining experience by sharing your feedback',
  status: 'draft', // draft, published, archived
  
  // Questions array
  questions: [
    {
      id: 'q1',
      questionNumber: 'Q1',
      type: 'multiple_choice',
      text: 'How satisfied were you with your overall dining experience?',
      required: true,
      options: [
        { id: 'o1', text: 'Very Satisfied' },
        { id: 'o2', text: 'Satisfied' },
        { id: 'o3', text: 'Neutral' },
        { id: 'o4', text: 'Dissatisfied' },
        { id: 'o5', text: 'Very Dissatisfied' }
      ],
      settings: {
        allowMultiple: false,
        randomizeOptions: false,
        displayFormat: 'list',
        placeholder: ''
      },
      validation: {
        minSelections: 1,
        maxSelections: 1,
        requiredError: 'Please select your satisfaction level',
        pattern: '',
        patternError: '',
        maxLength: null
      }
    },
    {
      id: 'q2',
      type: 'text_input',
      questionNumber: 'Q2',
      text: 'What could we improve about your experience?',
      required: false,
      settings: {
        placeholder: 'Respondent will type their answer here...'
      },
      validation: {
        maxLength: 500,
        requiredError: 'Please provide your feedback',
        pattern: '',
        patternError: ''
      }
    }
  ],
  
  // Survey settings
  settings: {
    theme: 'light',
    allowAnonymous: true,
    requireAllQuestions: false,
    showProgressBar: true,
    allowBackNavigation: true,
    randomizeQuestions: false,
    surveyTimeout: null,
    customTheme: {
      primaryColor: '#6366f1',
      fontFamily: 'Inter, system-ui',
      buttonStyle: 'rounded'
    }
  },
  
  // Actions
  addQuestion(question) {
    this.questions.push(question)
  },
  
  updateQuestion(questionId, updates) {
    const index = this.questions.findIndex(q => q.id === questionId)
    if (index !== -1) {
      this.questions[index] = { ...this.questions[index], ...updates }
    }
  },
  
  removeQuestion(questionId) {
    this.questions = this.questions.filter(q => q.id !== questionId)
  },
  
  reorderQuestions(fromIndex, toIndex) {
    const [removed] = this.questions.splice(fromIndex, 1)
    this.questions.splice(toIndex, 0, removed)
  },
  
  duplicateQuestion(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (question) {
      const duplicate = {
        ...question,
        id: `q_${Date.now()}`,
        questionNumber: `${question.questionNumber}_copy`,
        options: question.options ? question.options.map(opt => ({
          ...opt,
          id: `opt_${Date.now()}_${Math.random()}`
        })) : []
      }
      
      const index = this.questions.findIndex(q => q.id === questionId)
      this.questions.splice(index + 1, 0, duplicate)
      return duplicate.id
    }
  }
})