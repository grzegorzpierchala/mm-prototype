import Alpine from 'alpinejs'

// Version Store - Managing version history
Alpine.store('versions', {
  // Current version
  currentVersion: 3,
  
  // Version history
  history: [
    {
      id: 'v3',
      version: 3,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: 'You',
      message: 'Added demographic questions and improved flow',
      surveySnapshot: {
        title: 'Customer Satisfaction Survey 2024',
        description: 'Help us improve your dining experience by sharing your feedback',
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
            ]
          },
          {
            id: 'q2',
            questionNumber: 'Q2',
            type: 'text_input',
            text: 'What could we improve about your experience?',
            required: false,
            settings: { placeholder: 'Type your answer here...', rows: 4 }
          },
          {
            id: 'q3',
            questionNumber: 'Q3',
            type: 'nps',
            text: 'How likely are you to recommend our restaurant to a friend?',
            required: true
          },
          {
            id: 'q4',
            questionNumber: 'Q4',
            type: 'email',
            text: 'Email (optional)',
            required: false
          },
          {
            id: 'q5',
            questionNumber: 'Q5',
            type: 'multiple_choice',
            text: 'What is your age range?',
            required: false,
            options: [
              { id: 'age1', text: '18-24' },
              { id: 'age2', text: '25-34' },
              { id: 'age3', text: '35-44' },
              { id: 'age4', text: '45-54' },
              { id: 'age5', text: '55+' }
            ]
          },
          {
            id: 'q6',
            questionNumber: 'Q6',
            type: 'multiple_choice',
            text: 'How often do you visit us?',
            required: false,
            options: [
              { id: 'freq1', text: 'First time' },
              { id: 'freq2', text: 'Weekly' },
              { id: 'freq3', text: 'Monthly' },
              { id: 'freq4', text: 'Occasionally' }
            ]
          }
        ]
      },
      changes: [
        { 
          type: 'added', 
          item: 'question', 
          text: 'Added age range question (Q5)',
          questionId: 'q5',
          id: 'change-1'
        },
        { 
          type: 'modified', 
          item: 'question', 
          text: 'Updated satisfaction scale from 3 points to 5 points (Q1)',
          questionId: 'q1',
          oldText: 'Satisfied, Maybe, Dissatisfied',
          newText: 'Very Satisfied, Satisfied, Neutral, Dissatisfied, Very Dissatisfied',
          id: 'change-2'
        },
        { 
          type: 'added', 
          item: 'question', 
          text: 'Added visit frequency question (Q6)',
          questionId: 'q6',
          id: 'change-3'
        },
        { 
          type: 'modified', 
          item: 'settings', 
          text: 'Enabled progress bar',
          id: 'change-4'
        }
      ],
      stats: {
        questions: 6,
        responses: 0
      },
      isCurrent: true,
      // Snapshot of survey state at this version
      surveySnapshot: {
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve your experience by sharing your feedback',
        questions: [
          {
            id: 'q1',
            questionNumber: 'Q1',
            type: 'multiple_choice',
            text: 'How satisfied are you with our service?',
            required: true,
            options: [
              { id: 'o1', text: 'Very Satisfied' },
              { id: 'o2', text: 'Satisfied' },
              { id: 'o3', text: 'Neutral' },
              { id: 'o4', text: 'Dissatisfied' },
              { id: 'o5', text: 'Very Dissatisfied' }
            ]
          },
          {
            id: 'q2',
            questionNumber: 'Q2',
            type: 'text_input',
            text: 'What did you like most about your experience?',
            required: false,
            settings: {
              placeholder: 'Please share your thoughts...',
              rows: 4
            }
          },
          {
            id: 'q3',
            questionNumber: 'Q3',
            type: 'rating',
            text: 'Rate your overall experience',
            required: true,
            settings: {
              scale: 5,
              showLabels: true
            }
          },
          {
            id: 'q4',
            questionNumber: 'Q4',
            type: 'text_input',
            text: 'Email (optional)',
            required: false,
            settings: {
              inputType: 'email',
              placeholder: 'your@email.com'
            }
          },
          {
            id: 'q5',
            questionNumber: 'Q5',
            type: 'dropdown',
            text: 'What is your age range?',
            required: true,
            options: [
              { id: 'age1', text: '18-24' },
              { id: 'age2', text: '25-34' },
              { id: 'age3', text: '35-44' },
              { id: 'age4', text: '45-54' },
              { id: 'age5', text: '55+' }
            ]
          },
          {
            id: 'q6',
            questionNumber: 'Q6',
            type: 'multiple_choice',
            text: 'How often do you use our service?',
            required: true,
            options: [
              { id: 'freq1', text: 'Daily' },
              { id: 'freq2', text: 'Weekly' },
              { id: 'freq3', text: 'Monthly' },
              { id: 'freq4', text: 'First time' }
            ]
          }
        ]
      }
    },
    {
      id: 'v2',
      version: 2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      author: 'Sarah Chen',
      message: 'Legal compliance updates',
      surveySnapshot: {
        title: 'Customer Satisfaction Survey 2024',
        description: 'Help us improve your dining experience by sharing your feedback',
        questions: [
          {
            id: 'q1',
            questionNumber: 'Q1',
            type: 'multiple_choice',
            text: 'How satisfied were you with your overall dining experience?',
            required: true,
            options: [
              { id: 'o1', text: 'Satisfied' },
              { id: 'o2', text: 'Maybe' },
              { id: 'o3', text: 'Dissatisfied' }
            ]
          },
          {
            id: 'q2',
            questionNumber: 'Q2',
            type: 'text_input',
            text: 'What could we improve about your experience?',
            required: false,
            settings: { placeholder: 'Type your answer here...', rows: 4 }
          },
          {
            id: 'q3',
            questionNumber: 'Q3',
            type: 'nps',
            text: 'How likely are you to recommend our restaurant to a friend?',
            required: true
          },
          {
            id: 'q4',
            questionNumber: 'Q4',
            type: 'email',
            text: 'Email (optional)',
            required: false
          },
          {
            id: 'q5',
            questionNumber: 'Q5',
            type: 'phone',
            text: 'Phone Number',
            required: true
          }
        ]
      },
      changes: [
        { 
          type: 'added', 
          item: 'text', 
          text: 'Added GDPR consent notice to survey introduction',
          id: 'change-5'
        },
        { 
          type: 'modified', 
          item: 'question', 
          text: 'Made email field optional instead of required (Q4)',
          questionId: 'q4',
          oldText: 'Email (required)',
          newText: 'Email (optional)',
          id: 'change-6'
        },
        { 
          type: 'removed', 
          item: 'question', 
          text: 'Removed phone number field - too sensitive for initial survey',
          questionId: 'q_phone',
          id: 'change-7'
        }
      ],
      stats: {
        questions: 4,
        responses: 0
      },
      isCurrent: false,
      // Snapshot of survey state at this version
      surveySnapshot: {
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve your experience by sharing your feedback\n\n[GDPR Notice: Your data will be processed in accordance with our privacy policy.]',
        questions: [
          {
            id: 'q1',
            questionNumber: 'Q1',
            type: 'multiple_choice',
            text: 'How satisfied are you with our service?',
            required: true,
            options: [
              { id: 'o1', text: 'Satisfied' },
              { id: 'o2', text: 'Maybe' },
              { id: 'o3', text: 'Dissatisfied' }
            ]
          },
          {
            id: 'q2',
            questionNumber: 'Q2',
            type: 'text_input',
            text: 'What did you like most about your experience?',
            required: false,
            settings: {
              placeholder: 'Please share your thoughts...',
              rows: 4
            }
          },
          {
            id: 'q3',
            questionNumber: 'Q3',
            type: 'rating',
            text: 'Rate your overall experience',
            required: true,
            settings: {
              scale: 5,
              showLabels: true
            }
          },
          {
            id: 'q4',
            questionNumber: 'Q4',
            type: 'text_input',
            text: 'Email (optional)',
            required: false,
            settings: {
              inputType: 'email',
              placeholder: 'your@email.com'
            }
          },
          {
            id: 'q_phone',
            questionNumber: 'Q5',
            type: 'text_input',
            text: 'Phone number',
            required: true,
            settings: {
              inputType: 'tel',
              placeholder: '(555) 123-4567'
            },
            _removed: true
          }
        ]
      }
    },
    {
      id: 'v1',
      version: 1,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'You',
      message: 'Initial survey creation',
      changes: [
        { type: 'added', item: 'survey', text: 'Created Customer Satisfaction Survey' },
        { type: 'added', item: 'question', text: 'Added 3 initial questions' }
      ],
      stats: {
        questions: 3,
        responses: 0
      },
      isCurrent: false,
      // Snapshot of survey state at this version
      surveySnapshot: {
        title: 'Customer Satisfaction Survey',
        description: 'Help us improve your experience',
        questions: [
          {
            id: 'q1',
            questionNumber: 'Q1',
            type: 'multiple_choice',
            text: 'How satisfied are you with our service?',
            required: true,
            options: [
              { id: 'o1', text: 'Satisfied' },
              { id: 'o2', text: 'Maybe' },
              { id: 'o3', text: 'Dissatisfied' }
            ]
          },
          {
            id: 'q2',
            questionNumber: 'Q2',
            type: 'text_input',
            text: 'What did you like most about your experience?',
            required: false,
            settings: {
              placeholder: 'Please share your thoughts...',
              rows: 4
            }
          },
          {
            id: 'q3',
            questionNumber: 'Q3',
            type: 'rating',
            text: 'Rate your overall experience',
            required: true,
            settings: {
              scale: 5,
              showLabels: true
            }
          }
        ]
      }
    }
  ],
  
  // Comparison state
  compareMode: false,
  compareVersion: null,
  showVisualDiff: false,
  showDiffHighlights: true, // New toggle for showing/hiding diff colors
  selectedVersion: null,
  hoveredChange: null,
  leftVersion: 'v1',  // Default to version 1 for left comparison
  rightVersion: 'v3', // Default to current version for right comparison
  
  // Actions
  getVersion(versionId) {
    return this.history.find(v => v.id === versionId)
  },
  
  createVersion(message = '') {
    const newVersion = {
      id: `v${this.currentVersion + 1}`,
      version: this.currentVersion + 1,
      timestamp: new Date().toISOString(),
      author: 'You',
      message: message || 'Survey updated',
      changes: [], // Would be calculated based on diff
      stats: {
        questions: Alpine.store('survey').questions.length,
        responses: 0
      },
      isCurrent: true
    }
    
    // Mark previous versions as not current
    this.history.forEach(v => v.isCurrent = false)
    
    // Add new version
    this.history.unshift(newVersion)
    this.currentVersion++
    
    return newVersion
  },
  
  restoreVersion(versionId) {
    const version = this.getVersion(versionId)
    if (!version) return
    
    // In a real app, this would restore the survey state
    console.log('Restoring version:', version)
    
    // Create a new version for the restore
    this.createVersion(`Restored from version ${version.version}`)
  },
  
  toggleCompareMode(versionId = null) {
    if (versionId && !this.compareMode) {
      this.compareMode = true
      this.compareVersion = versionId
    } else {
      this.compareMode = false
      this.compareVersion = null
      this.showVisualDiff = false
    }
  },
  
  toggleVisualDiff() {
    this.showVisualDiff = !this.showVisualDiff
  },
  
  getChangesSummary(versionId) {
    const version = this.getVersion(versionId)
    if (!version) return null
    
    const summary = {
      added: version.changes.filter(c => c.type === 'added').length,
      modified: version.changes.filter(c => c.type === 'modified').length,
      removed: version.changes.filter(c => c.type === 'removed').length
    }
    
    return summary
  },
  
  // Helper methods for visual diff
  isQuestionNew(questionId) {
    if (!this.selectedVersion) return false
    const selectedVersion = this.getVersion(this.selectedVersion)
    if (!selectedVersion) return false
    
    // Get all versions between selected and current
    const selectedIndex = this.history.findIndex(v => v.id === this.selectedVersion)
    const versionsAfterSelected = this.history.slice(0, selectedIndex)
    
    // Check if this question was added in any version after the selected one
    return versionsAfterSelected.some(version => 
      version.changes.some(c => 
        c.type === 'added' && 
        c.item === 'question' && 
        c.questionId === questionId
      )
    )
  },
  
  isQuestionModified(questionId) {
    if (!this.selectedVersion) return false
    const selectedVersion = this.getVersion(this.selectedVersion)
    if (!selectedVersion) return false
    
    // Get all versions between selected and current
    const selectedIndex = this.history.findIndex(v => v.id === this.selectedVersion)
    const versionsAfterSelected = this.history.slice(0, selectedIndex)
    
    // Check if this question was modified in any version after the selected one
    return versionsAfterSelected.some(version => 
      version.changes.some(c => 
        c.type === 'modified' && 
        c.item === 'question' && 
        c.questionId === questionId
      )
    )
  },
  
  isQuestionRemoved(questionId) {
    if (!this.selectedVersion) return false
    const selectedVersion = this.getVersion(this.selectedVersion)
    if (!selectedVersion) return false
    
    // Check if the question exists in selected version but not in current
    const existsInSelected = selectedVersion.surveySnapshot?.questions.some(q => q.id === questionId)
    const existsInCurrent = Alpine.store('survey').questions.some(q => q.id === questionId)
    
    return existsInSelected && !existsInCurrent
  },
  
  // Get the diff status for a specific question
  getQuestionDiffStatus(questionId) {
    if (!this.showDiffHighlights || !this.selectedVersion) return null
    
    if (this.isQuestionNew(questionId)) return 'added'
    if (this.isQuestionModified(questionId)) return 'modified'
    if (this.isQuestionRemoved(questionId)) return 'removed'
    
    return null
  },
  
  // Get diff status between two specific versions
  getQuestionDiffStatusBetween(questionId, leftVersionId, rightVersionId) {
    if (!this.showDiffHighlights || !leftVersionId || !rightVersionId) return null
    
    const leftVersion = this.getVersion(leftVersionId)
    const rightVersion = this.getVersion(rightVersionId)
    
    if (!leftVersion || !rightVersion) return null
    
    const existsInLeft = leftVersion.surveySnapshot?.questions.some(q => q.id === questionId)
    const existsInRight = rightVersion.surveySnapshot?.questions.some(q => q.id === questionId)
    
    // Question was added (exists in right but not left)
    if (!existsInLeft && existsInRight) return 'added'
    
    // Question was removed (exists in left but not right)
    if (existsInLeft && !existsInRight) return 'removed'
    
    // Check if modified by looking at changes between versions
    if (existsInLeft && existsInRight) {
      const leftIndex = this.history.findIndex(v => v.id === leftVersionId)
      const rightIndex = this.history.findIndex(v => v.id === rightVersionId)
      
      // Get all versions between left and right
      const versionsBetween = this.history.slice(Math.min(leftIndex, rightIndex), Math.max(leftIndex, rightIndex) + 1)
      
      // Check if question was modified in any version between
      const wasModified = versionsBetween.some(version => 
        version.changes.some(c => 
          c.type === 'modified' && 
          c.item === 'question' && 
          c.questionId === questionId
        )
      )
      
      if (wasModified) return 'modified'
    }
    
    return null
  }
})