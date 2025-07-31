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
        answerType: 'single', // single or multiple
        format: 'list', // list, dropdown, select_box
        layout: 'vertical', // vertical, horizontal, columns
        columns: 2,
        labelPosition: 'side', // side, above
        randomizeOptions: false,
        useSuggestedChoices: false,
        placeholder: ''
      },
      validation: {
        forceResponse: true,
        requestResponse: false,
        minSelections: 1,
        maxSelections: 1,
        requiredError: 'Please select your satisfaction level'
      }
    },
    {
      id: 'q2',
      type: 'text_input',
      questionNumber: 'Q2',
      text: 'What could we improve about your experience?',
      required: false,
      settings: {
        placeholder: 'Type your answer here...',
        textType: 'single_line'
      },
      validation: {
        forceResponse: false,
        requestResponse: false,
        minLength: null,
        maxLength: 500,
        requiredError: 'Please provide your feedback',
        pattern: '',
        patternError: ''
      }
    },
    {
      id: 'q3',
      type: 'rating_scale',
      questionNumber: 'Q3',
      text: 'How likely are you to recommend our restaurant to a friend?',
      required: true,
      settings: {
        scaleType: 'nps',
        minValue: 0,
        maxValue: 10,
        minLabel: 'Not at all likely',
        maxLabel: 'Extremely likely',
        showNumbers: true
      },
      validation: {
        requiredError: 'Please select a rating'
      }
    }
  ],
  
  // Page breaks - stores IDs of questions after which a page break appears
  pageBreaks: [],
  
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
    const index = this.questions.length
    this.questions.push(question)
    
    // Record action for undo
    Alpine.store('history').recordAction({
      type: 'ADD_QUESTION',
      data: {
        question: { ...question },
        questionId: question.id,
        questionType: question.type,
        index: index
      }
    })
  },
  
  updateQuestion(questionId, updates) {
    const index = this.questions.findIndex(q => q.id === questionId)
    if (index !== -1) {
      const oldData = { ...this.questions[index] }
      this.questions[index] = { ...this.questions[index], ...updates }
      
      // Record action for undo
      Alpine.store('history').recordAction({
        type: 'UPDATE_QUESTION',
        data: {
          questionId: questionId,
          questionNumber: oldData.questionNumber,
          oldData: oldData,
          newData: { ...this.questions[index] }
        }
      })
    }
  },
  
  removeQuestion(questionId) {
    const index = this.questions.findIndex(q => q.id === questionId)
    const question = this.questions[index]
    
    if (index !== -1) {
      this.questions = this.questions.filter(q => q.id !== questionId)
      
      // Record action for undo
      Alpine.store('history').recordAction({
        type: 'REMOVE_QUESTION',
        data: {
          question: { ...question },
          questionId: questionId,
          index: index
        }
      })
    }
  },
  
  reorderQuestions(fromIndex, toIndex) {
    const oldOrder = [...this.questions]
    const [removed] = this.questions.splice(fromIndex, 1)
    this.questions.splice(toIndex, 0, removed)
    
    // Record action for undo
    Alpine.store('history').recordAction({
      type: 'REORDER_QUESTIONS',
      data: {
        oldOrder: oldOrder,
        newOrder: [...this.questions],
        fromIndex: fromIndex,
        toIndex: toIndex
      }
    })
  },
  
  // Page break actions
  addPageBreak(afterQuestionId) {
    if (!this.pageBreaks.includes(afterQuestionId)) {
      this.pageBreaks.push(afterQuestionId)
      
      // Record action for undo
      Alpine.store('history').recordAction({
        type: 'ADD_PAGE_BREAK',
        data: {
          afterQuestionId: afterQuestionId
        }
      })
    }
  },
  
  removePageBreak(afterQuestionId) {
    this.pageBreaks = this.pageBreaks.filter(id => id !== afterQuestionId)
    
    // Record action for undo
    Alpine.store('history').recordAction({
      type: 'REMOVE_PAGE_BREAK',
      data: {
        afterQuestionId: afterQuestionId
      }
    })
  },
  
  hasPageBreakAfter(questionId) {
    return this.pageBreaks.includes(questionId)
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
      
      // Record action for undo
      Alpine.store('history').recordAction({
        type: 'DUPLICATE_QUESTION',
        data: {
          originalQuestionId: questionId,
          newQuestionId: duplicate.id,
          newQuestion: { ...duplicate },
          questionNumber: question.questionNumber,
          index: index
        }
      })
      
      return duplicate.id
    }
  },
  
  addOption(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question) return
    
    // Initialize options array if it doesn't exist
    if (!question.options) {
      question.options = []
    }
    
    const newOption = {
      id: `opt_${Date.now()}`,
      text: `Option ${question.options.length + 1}`
    }
    
    question.options.push(newOption)
    
    // Record action for undo
    Alpine.store('history').recordAction({
      type: 'ADD_OPTION',
      data: {
        questionId: questionId,
        optionId: newOption.id,
        option: { ...newOption }
      }
    })
    
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removeOption(questionId, optionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.options || question.options.length <= 2) return
    
    const optionIndex = question.options.findIndex(opt => opt.id === optionId)
    const option = question.options[optionIndex]
    
    question.options = question.options.filter(opt => opt.id !== optionId)
    
    // Record action for undo
    Alpine.store('history').recordAction({
      type: 'REMOVE_OPTION',
      data: {
        questionId: questionId,
        optionId: optionId,
        option: { ...option },
        index: optionIndex
      }
    })
    
    Alpine.store('ui').debouncedAutoSave()
  },
  
  // Matrix management methods
  addMatrixRow(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || question.type !== 'matrix') return
    
    // Initialize statements array if it doesn't exist
    if (!question.settings.statements) {
      question.settings.statements = []
    }
    
    const newRow = {
      id: `row_${Date.now()}`,
      text: `Statement ${question.settings.statements.length + 1}`
    }
    
    question.settings.statements.push(newRow)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removeMatrixRow(questionId, rowId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.settings.statements || question.settings.statements.length <= 1) return
    
    question.settings.statements = question.settings.statements.filter(row => row.id !== rowId)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  addMatrixColumn(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || question.type !== 'matrix') return
    
    // Initialize scalePoints array if it doesn't exist
    if (!question.settings.scalePoints) {
      question.settings.scalePoints = []
    }
    
    const newColumn = {
      id: `col_${Date.now()}`,
      text: `Option ${question.settings.scalePoints.length + 1}`
    }
    
    question.settings.scalePoints.push(newColumn)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removeMatrixColumn(questionId, columnId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.settings.scalePoints || question.settings.scalePoints.length <= 1) return
    
    question.settings.scalePoints = question.settings.scalePoints.filter(col => col.id !== columnId)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  // Priority Grid management methods
  addPriorityGridItem(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || question.type !== 'priority_grid') return
    
    const newItem = {
      id: `opt_${Date.now()}`,
      text: `Item ${question.options.length + 1}`
    }
    
    question.options.push(newItem)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removePriorityGridItem(questionId, itemId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.options || question.options.length <= 1) return
    
    question.options = question.options.filter(item => item.id !== itemId)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  // Side by Side management methods
  addSideBySideColumn(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || question.type !== 'side_by_side') return
    
    if (!question.settings.columns) {
      question.settings.columns = []
    }
    
    const newColumn = {
      id: `col_${Date.now()}`,
      text: `Column ${question.settings.columns.length + 1}`,
      type: 'text',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
    
    question.settings.columns.push(newColumn)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removeSideBySideColumn(questionId, columnId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.settings.columns || question.settings.columns.length <= 1) return
    
    question.settings.columns = question.settings.columns.filter(col => col.id !== columnId)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  updateSideBySideColumnType(questionId, columnId, newType) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.settings.columns) return
    
    const column = question.settings.columns.find(col => col.id === columnId)
    if (!column) return
    
    column.type = newType
    
    // Reset options if changing to a type that needs options
    if (['radio', 'checkbox', 'select'].includes(newType) && !column.options) {
      column.options = ['Option 1', 'Option 2', 'Option 3']
    }
    
    Alpine.store('ui').debouncedAutoSave()
  },
  
  addSideBySideRow(questionId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || question.type !== 'side_by_side') return
    
    if (!question.settings.rows) {
      question.settings.rows = []
    }
    
    const newRow = {
      id: `row_${Date.now()}`,
      text: `Question ${question.settings.rows.length + 1}`
    }
    
    question.settings.rows.push(newRow)
    Alpine.store('ui').debouncedAutoSave()
  },
  
  removeSideBySideRow(questionId, rowId) {
    const question = this.questions.find(q => q.id === questionId)
    if (!question || !question.settings.rows || question.settings.rows.length <= 1) return
    
    question.settings.rows = question.settings.rows.filter(row => row.id !== rowId)
    Alpine.store('ui').debouncedAutoSave()
  }
})