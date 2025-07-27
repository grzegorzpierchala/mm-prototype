import Alpine from 'alpinejs'
import { validateField, validateSurvey } from '../utils/validation'

// Validation Store - Managing validation state and real-time validation
Alpine.store('validation', {
  // Validation results for each question
  results: {}, // { questionId: { isValid: boolean, errors: string[] } }
  
  // Response data (simulated for prototype)
  responses: {}, // { questionId: response }
  
  // Real-time validation enabled
  realTimeValidation: true,
  
  // Validation mode
  mode: 'blur', // 'blur', 'change', 'submit'
  
  // Show validation errors
  showErrors: true,
  
  // Initialize validation for a question
  initQuestion(questionId) {
    if (!this.results[questionId]) {
      this.results[questionId] = { isValid: true, errors: [] }
    }
    if (!this.responses[questionId]) {
      this.responses[questionId] = null
    }
  },
  
  // Update response and validate
  updateResponse(questionId, value) {
    this.responses[questionId] = value
    
    if (this.realTimeValidation) {
      this.validateQuestion(questionId)
    }
  },
  
  // Validate a single question
  validateQuestion(questionId) {
    const question = Alpine.store('survey').questions.find(q => q.id === questionId)
    if (!question) return
    
    const response = this.responses[questionId]
    const result = validateField(question, response)
    
    this.results[questionId] = result
    
    return result
  },
  
  // Validate all questions
  validateAll() {
    const questions = Alpine.store('survey').questions
    const validation = validateSurvey(questions, this.responses)
    
    this.results = validation.results
    
    return validation
  },
  
  // Clear validation for a question
  clearValidation(questionId) {
    if (this.results[questionId]) {
      this.results[questionId] = { isValid: true, errors: [] }
    }
  },
  
  // Clear all validation
  clearAll() {
    this.results = {}
  },
  
  // Get validation state for a question
  getValidation(questionId) {
    return this.results[questionId] || { isValid: true, errors: [] }
  },
  
  // Check if question has errors
  hasErrors(questionId) {
    const validation = this.getValidation(questionId)
    return !validation.isValid && validation.errors.length > 0
  },
  
  // Get first error message
  getFirstError(questionId) {
    const validation = this.getValidation(questionId)
    return validation.errors[0] || null
  },
  
  // Get all error messages
  getErrors(questionId) {
    const validation = this.getValidation(questionId)
    return validation.errors
  },
  
  // Check if form is valid
  isFormValid() {
    return Object.values(this.results).every(result => result.isValid)
  },
  
  // Count total errors
  getErrorCount() {
    return Object.values(this.results)
      .filter(result => !result.isValid)
      .reduce((count, result) => count + result.errors.length, 0)
  },
  
  // Get questions with errors
  getQuestionsWithErrors() {
    return Object.entries(this.results)
      .filter(([_, result]) => !result.isValid)
      .map(([questionId, _]) => questionId)
  },
  
  // Toggle real-time validation
  toggleRealTimeValidation() {
    this.realTimeValidation = !this.realTimeValidation
  },
  
  // Set validation mode
  setValidationMode(mode) {
    this.mode = mode
  },
  
  // Toggle error visibility
  toggleErrorVisibility() {
    this.showErrors = !this.showErrors
  },
  
  // Mock responses for testing
  generateMockResponses() {
    const questions = Alpine.store('survey').questions
    
    questions.forEach(question => {
      switch (question.type) {
        case 'text_input':
        case 'long_text':
          this.responses[question.id] = 'Sample response text'
          break
        case 'multiple_choice':
        case 'dropdown':
          this.responses[question.id] = question.options?.[0]?.id
          break
        case 'checkbox':
          this.responses[question.id] = [question.options?.[0]?.id].filter(Boolean)
          break
        case 'yes_no':
          this.responses[question.id] = 'yes'
          break
        case 'star_rating':
          this.responses[question.id] = 4
          break
        case 'number_scale':
        case 'nps':
          this.responses[question.id] = 7
          break
        case 'slider':
          this.responses[question.id] = 50
          break
        case 'number':
          this.responses[question.id] = 42
          break
        case 'email':
          this.responses[question.id] = 'user@example.com'
          break
        case 'phone':
          this.responses[question.id] = '+1 (555) 123-4567'
          break
        case 'url':
          this.responses[question.id] = 'https://example.com'
          break
        case 'date':
          this.responses[question.id] = new Date().toISOString().split('T')[0]
          break
        case 'time':
          this.responses[question.id] = '14:30'
          break
        default:
          this.responses[question.id] = null
      }
    })
  },
  
  // Clear mock responses
  clearMockResponses() {
    this.responses = {}
    this.results = {}
  }
})

// Initialize validation when survey loads
document.addEventListener('alpine:init', () => {
  Alpine.effect(() => {
    const questions = Alpine.store('survey').questions
    questions.forEach(question => {
      Alpine.store('validation').initQuestion(question.id)
    })
  })
})