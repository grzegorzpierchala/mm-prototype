// Main survey editor Alpine component
import { initKeyboardShortcuts } from '../utils/keyboardShortcuts'

export default function surveyEditor() {
  return {
    // Local state that doesn't need to be in stores
    showQuestionTypes: null,
    highlightedType: null,
    duplicateQuestions: [],
    showSlashMenu: false,
    keyboardShortcuts: null,
    
    // Initialize
    init() {
      console.log('Survey Editor initialized')
      // Initialize auto-save
      this.$store.ui.initAutoSave()
      // Initialize keyboard shortcuts
      this.keyboardShortcuts = initKeyboardShortcuts()
    },
    
    // Question Management
    addQuestion(type = 'text_input') {
      const newQuestion = {
        id: `q_${Date.now()}`,
        type: type,
        text: '',
        questionNumber: `Q${this.$store.survey.questions.length + 1}`,
        required: false,
        options: type === 'multiple_choice' || type === 'checkbox' || type === 'dropdown'
          ? [
              { id: `opt_${Date.now()}_1`, text: 'Option 1' },
              { id: `opt_${Date.now()}_2`, text: 'Option 2' }
            ] 
          : [],
        settings: this.getDefaultSettings(type),
        validation: this.getDefaultValidation(type)
      }
      
      this.$store.survey.addQuestion(newQuestion)
      this.$store.ui.selectQuestion(newQuestion.id)
      this.$store.ui.openSettingsPanel(newQuestion.id)
      
      // Track recently used types
      this.trackRecentlyUsedType(type)
    },
    
    // Get default settings for question type
    getDefaultSettings(type) {
      const defaults = {
        text_input: { placeholder: 'Type your answer here...', maxLength: 200, inputType: 'text' },
        long_text: { placeholder: 'Type your detailed answer here...', maxLength: 500, rows: 4 },
        multiple_choice: { allowMultiple: false, randomizeOptions: false, displayFormat: 'list' },
        checkbox: { minSelections: 0, maxSelections: null },
        dropdown: { placeholder: 'Select an option...' },
        number_scale: { minValue: 1, maxValue: 10, labels: { min: '', max: '' } },
        star_rating: { maxStars: 5 },
        yes_no: { labels: { yes: 'Yes', no: 'No' } },
        nps: { minValue: 0, maxValue: 10 },
        likert: { scale: 5, labels: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'] },
        slider: { min: 0, max: 100, step: 1, showValue: true },
        emoji_scale: { emojis: ['😡', '😟', '😐', '😊', '😍'] }
      }
      
      return defaults[type] || {}
    },
    
    // Get default validation for question type
    getDefaultValidation(type) {
      const defaults = {
        text_input: { requiredError: 'This field is required', pattern: '', patternError: '', maxLength: 200 },
        long_text: { requiredError: 'This field is required', maxLength: 500 },
        multiple_choice: { requiredError: 'Please select an option', minSelections: 1, maxSelections: 1 },
        checkbox: { requiredError: 'Please select at least one option', minSelections: 1, maxSelections: null },
        email: { requiredError: 'This field is required', pattern: '^[^@]+@[^@]+\\.[^@]+$', patternError: 'Please enter a valid email' },
        phone: { requiredError: 'This field is required', pattern: '', patternError: 'Please enter a valid phone number' },
        url: { requiredError: 'This field is required', pattern: '^https?://', patternError: 'Please enter a valid URL' },
        number: { requiredError: 'This field is required', min: null, max: null }
      }
      
      return defaults[type] || { requiredError: 'This field is required' }
    },
    
    
    // Remove a question
    removeQuestion(questionId) {
      this.$store.survey.removeQuestion(questionId)
      if (this.$store.ui.selectedQuestionId === questionId) {
        this.$store.ui.closeSettingsPanel()
      }
    },
    
    // Duplicate a question
    duplicateQuestion(questionId) {
      const newId = this.$store.survey.duplicateQuestion(questionId)
      if (newId) {
        this.$store.ui.selectQuestion(newId)
      }
    },
    
    // Change question type
    changeQuestionType(questionId, newType) {
      this.$store.survey.updateQuestion(questionId, {
        type: newType,
        settings: this.getDefaultSettings(newType),
        validation: this.getDefaultValidation(newType)
      })
      
      // Close dropdown
      this.showQuestionTypes = null
      
      // Track recently used
      this.trackRecentlyUsedType(newType)
      
      // Trigger auto-save
      this.$store.ui.debouncedAutoSave()
    },
    
    // Add option to question
    addOption(questionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question || !question.options) return
      
      const newOption = {
        id: `opt_${Date.now()}`,
        text: `Option ${question.options.length + 1}`
      }
      
      question.options.push(newOption)
      this.$store.ui.debouncedAutoSave()
    },
    
    // Remove option from question
    removeOption(questionId, optionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question || !question.options || question.options.length <= 2) return
      
      question.options = question.options.filter(opt => opt.id !== optionId)
      this.$store.ui.debouncedAutoSave()
    },
    
    // Question validation
    validateQuestionNumber(questionId) {
      const question = this.$store.survey.questions.find(q => q.id === questionId)
      if (!question) return
      
      // Check for duplicates
      const duplicates = this.$store.survey.questions.filter(q => 
        q.id !== questionId && 
        q.questionNumber && 
        q.questionNumber.trim().toLowerCase() === question.questionNumber.trim().toLowerCase()
      )
      
      // Store validation result
      this.$store.ui.questionNumberValidation[questionId] = {
        isValid: duplicates.length === 0,
        duplicateWith: duplicates.length > 0 ? duplicates[0].id : null
      }
    },
    
    isQuestionNumberValid(questionId) {
      const validation = this.$store.ui.questionNumberValidation[questionId]
      return !validation || validation.isValid
    },
    
    // Comments
    toggleCommentThread(questionId) {
      this.$store.ui.toggleCommentSidebar(questionId)
    },
    
    getCommentCount(questionId) {
      return this.$store.comment.getCommentCount(questionId)
    },
    
    hasUnresolvedComments(questionId) {
      return this.$store.comment.hasUnresolvedComments(questionId)
    },
    
    // Question types management
    getQuestionTypeCategories() {
      return {
        essentials: [
          { id: 'text_input', name: 'Short Text', icon: '💬' },
          { id: 'long_text', name: 'Long Text', icon: '📝' },
          { id: 'multiple_choice', name: 'Multiple Choice', icon: '🔘' },
          { id: 'checkbox', name: 'Checkboxes', icon: '☑️' },
          { id: 'dropdown', name: 'Dropdown', icon: '▼' },
          { id: 'yes_no', name: 'Yes/No', icon: '👍' }
        ],
        rating: [
          { id: 'star_rating', name: 'Star Rating', icon: '⭐' },
          { id: 'number_scale', name: 'Number Scale', icon: '🔢' },
          { id: 'nps', name: 'NPS Score', icon: '🎯' },
          { id: 'likert', name: 'Likert Scale', icon: '📊' },
          { id: 'slider', name: 'Slider', icon: '🎚️' },
          { id: 'emoji_scale', name: 'Emoji Scale', icon: '😊' }
        ],
        input: [
          { id: 'number', name: 'Number', icon: '💯' },
          { id: 'email', name: 'Email', icon: '✉️' },
          { id: 'phone', name: 'Phone', icon: '📱' },
          { id: 'url', name: 'Website', icon: '🌐' },
          { id: 'date', name: 'Date', icon: '📅' },
          { id: 'time', name: 'Time', icon: '🕐' }
        ],
        advanced: [
          { id: 'matrix', name: 'Matrix Table', icon: '⊞' },
          { id: 'ranking', name: 'Rank Order', icon: '📋' },
          { id: 'constant_sum', name: 'Constant Sum', icon: '💯' },
          { id: 'max_diff', name: 'MaxDiff', icon: '⚖️' },
          { id: 'side_by_side', name: 'Side by Side', icon: '📊' },
          { id: 'card_sort', name: 'Card Sort', icon: '🗂️' }
        ],
        media: [
          { id: 'file_upload', name: 'File Upload', icon: '📎' },
          { id: 'image_choice', name: 'Image Choice', icon: '🖼️' },
          { id: 'signature', name: 'Signature', icon: '✍️' },
          { id: 'drawing', name: 'Drawing', icon: '🎨' },
          { id: 'video_response', name: 'Video', icon: '📹' },
          { id: 'audio_response', name: 'Audio', icon: '🎤' }
        ],
        interactive: [
          { id: 'heat_map', name: 'Heat Map', icon: '🔥' },
          { id: 'hot_spot', name: 'Hot Spot', icon: '🎯' },
          { id: 'map_location', name: 'Map Location', icon: '📍' },
          { id: 'priority_grid', name: 'Priority Grid', icon: '⊞' }
        ]
      }
    },
    
    // Track recently used question types
    trackRecentlyUsedType(type) {
      const recent = this.$store.ui.recentlyUsedTypes
      
      // Remove if already exists
      const index = recent.indexOf(type)
      if (index > -1) {
        recent.splice(index, 1)
      }
      
      // Add to beginning
      recent.unshift(type)
      
      // Keep only last 5
      if (recent.length > 5) {
        recent.pop()
      }
    },
    
    // Get recently used types with full data
    get recentlyUsedTypes() {
      const allTypes = Object.values(this.getQuestionTypeCategories()).flat()
      return this.$store.ui.recentlyUsedTypes
        .map(typeId => allTypes.find(t => t.id === typeId))
        .filter(Boolean)
        .slice(0, 3)
    },
    
    // Dropdown keyboard navigation
    handleDropdownKeydown(event, questionId) {
      // Implementation would handle arrow keys, enter, etc.
      if (event.key === 'Escape') {
        this.showQuestionTypes = null
      }
    },
    
    // Type highlighting
    setHighlightedType(typeKey) {
      this.highlightedType = typeKey
    },
    
    isTypeHighlighted(typeKey) {
      return this.highlightedType === typeKey
    },
    
    // Auto-save trigger
    debouncedAutosave() {
      this.$store.ui.debouncedAutoSave()
    }
  }
}