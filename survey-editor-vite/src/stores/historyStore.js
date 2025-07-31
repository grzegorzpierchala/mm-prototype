import Alpine from 'alpinejs'

// History Store - Manages undo/redo functionality
Alpine.store('history', {
  // History stacks
  undoStack: [],
  redoStack: [],
  maxHistorySize: 50,
  isRecording: true,
  
  // Initialize history
  init() {
    // Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault()
        this.undo()
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault()
        this.redo()
      }
    })
  },
  
  // Record an action
  recordAction(action) {
    if (!this.isRecording) return
    
    // Create action object with timestamp
    const actionRecord = {
      ...action,
      timestamp: new Date().toISOString(),
      id: `action_${Date.now()}`
    }
    
    // Add to undo stack
    this.undoStack.push(actionRecord)
    
    // Limit stack size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift()
    }
    
    // Clear redo stack when new action is recorded
    this.redoStack = []
  },
  
  // Undo last action
  undo() {
    if (!this.canUndo()) return
    
    const action = this.undoStack.pop()
    this.isRecording = false
    
    try {
      // Execute undo based on action type
      switch (action.type) {
        case 'ADD_QUESTION':
          Alpine.store('survey').removeQuestion(action.data.questionId)
          break
          
        case 'REMOVE_QUESTION':
          Alpine.store('survey').questions.splice(action.data.index, 0, action.data.question)
          break
          
        case 'UPDATE_QUESTION':
          Alpine.store('survey').updateQuestion(action.data.questionId, action.data.oldData)
          break
          
        case 'REORDER_QUESTIONS':
          Alpine.store('survey').questions = [...action.data.oldOrder]
          break
          
        case 'ADD_OPTION':
          Alpine.store('survey').removeOption(action.data.questionId, action.data.optionId)
          break
          
        case 'REMOVE_OPTION':
          const question = Alpine.store('survey').questions.find(q => q.id === action.data.questionId)
          if (question && question.options) {
            question.options.splice(action.data.index, 0, action.data.option)
          }
          break
          
        case 'ADD_PAGE_BREAK':
          Alpine.store('survey').removePageBreak(action.data.afterQuestionId)
          break
          
        case 'REMOVE_PAGE_BREAK':
          Alpine.store('survey').addPageBreak(action.data.afterQuestionId)
          break
          
        case 'DUPLICATE_QUESTION':
          Alpine.store('survey').removeQuestion(action.data.newQuestionId)
          break
          
        case 'UPDATE_SURVEY_SETTINGS':
          Alpine.store('survey').settings = { ...action.data.oldSettings }
          break
      }
      
      // Add to redo stack
      this.redoStack.push(action)
      
      // Trigger UI update
      Alpine.store('ui').debouncedAutoSave()
      
      // Show notification
      window.dispatchEvent(new CustomEvent('history:undo', { 
        detail: { 
          message: `Undone: ${this.getActionDescription(action)}` 
        } 
      }))
      
    } finally {
      this.isRecording = true
    }
  },
  
  // Redo last undone action
  redo() {
    if (!this.canRedo()) return
    
    const action = this.redoStack.pop()
    this.isRecording = false
    
    try {
      // Execute redo based on action type
      switch (action.type) {
        case 'ADD_QUESTION':
          Alpine.store('survey').questions.splice(action.data.index, 0, action.data.question)
          break
          
        case 'REMOVE_QUESTION':
          Alpine.store('survey').removeQuestion(action.data.questionId)
          break
          
        case 'UPDATE_QUESTION':
          Alpine.store('survey').updateQuestion(action.data.questionId, action.data.newData)
          break
          
        case 'REORDER_QUESTIONS':
          Alpine.store('survey').questions = [...action.data.newOrder]
          break
          
        case 'ADD_OPTION':
          const question = Alpine.store('survey').questions.find(q => q.id === action.data.questionId)
          if (question && question.options) {
            question.options.push(action.data.option)
          }
          break
          
        case 'REMOVE_OPTION':
          Alpine.store('survey').removeOption(action.data.questionId, action.data.optionId)
          break
          
        case 'ADD_PAGE_BREAK':
          Alpine.store('survey').addPageBreak(action.data.afterQuestionId)
          break
          
        case 'REMOVE_PAGE_BREAK':
          Alpine.store('survey').removePageBreak(action.data.afterQuestionId)
          break
          
        case 'DUPLICATE_QUESTION':
          Alpine.store('survey').questions.splice(action.data.index + 1, 0, action.data.newQuestion)
          break
          
        case 'UPDATE_SURVEY_SETTINGS':
          Alpine.store('survey').settings = { ...action.data.newSettings }
          break
      }
      
      // Add back to undo stack
      this.undoStack.push(action)
      
      // Trigger UI update
      Alpine.store('ui').debouncedAutoSave()
      
      // Show notification
      window.dispatchEvent(new CustomEvent('history:redo', { 
        detail: { 
          message: `Redone: ${this.getActionDescription(action)}` 
        } 
      }))
      
    } finally {
      this.isRecording = true
    }
  },
  
  // Check if can undo
  canUndo() {
    return this.undoStack.length > 0
  },
  
  // Check if can redo
  canRedo() {
    return this.redoStack.length > 0
  },
  
  // Get last undoable action description
  getUndoDescription() {
    if (!this.canUndo()) return ''
    const lastAction = this.undoStack[this.undoStack.length - 1]
    return this.getActionDescription(lastAction)
  },
  
  // Get last redoable action description
  getRedoDescription() {
    if (!this.canRedo()) return ''
    const lastAction = this.redoStack[this.redoStack.length - 1]
    return this.getActionDescription(lastAction)
  },
  
  // Get human-readable action description
  getActionDescription(action) {
    switch (action.type) {
      case 'ADD_QUESTION':
        return `Add ${action.data.questionType} question`
      case 'REMOVE_QUESTION':
        return `Remove question ${action.data.question.questionNumber}`
      case 'UPDATE_QUESTION':
        return `Edit question ${action.data.questionNumber}`
      case 'REORDER_QUESTIONS':
        return 'Reorder questions'
      case 'ADD_OPTION':
        return 'Add answer option'
      case 'REMOVE_OPTION':
        return 'Remove answer option'
      case 'ADD_PAGE_BREAK':
        return 'Add page break'
      case 'REMOVE_PAGE_BREAK':
        return 'Remove page break'
      case 'DUPLICATE_QUESTION':
        return `Duplicate question ${action.data.questionNumber}`
      case 'UPDATE_SURVEY_SETTINGS':
        return 'Update survey settings'
      default:
        return 'Survey change'
    }
  },
  
  // Clear history
  clearHistory() {
    this.undoStack = []
    this.redoStack = []
  },
  
  // Temporarily disable recording (for batch operations)
  withoutRecording(callback) {
    const wasRecording = this.isRecording
    this.isRecording = false
    try {
      callback()
    } finally {
      this.isRecording = wasRecording
    }
  }
})