import Alpine from 'alpinejs'

// UI Store - Managing UI state and interactions
Alpine.store('ui', {
  // Tab navigation
  activeTab: 'build', // build, preview, share, settings, results, analytics
  
  // Panel states
  settingsPanelOpen: false,
  settingsSection: 'general', // general, logic, validation, appearance
  commentSidebarOpen: false,
  versionHistoryOpen: false,
  aiAssistantOpen: false,
  
  // Selected items
  selectedQuestionId: null,
  activeCommentThread: null,
  selectedVersion: null,
  
  // Preview settings
  previewDevice: 'desktop', // desktop, tablet, mobile
  
  // Question type selector
  showQuestionTypes: null, // questionId when dropdown is open
  highlightedTypeIndex: 0,
  searchQuery: '',
  recentlyUsedTypes: ['text_input', 'multiple_choice', 'star_rating'],
  
  // Save status
  saveStatus: 'saved', // saving, saved, error
  lastSaved: new Date().toISOString(),
  
  // Validation states
  questionNumberValidation: {},
  
  // Actions
  openSettingsPanel(questionId = null) {
    this.selectedQuestionId = questionId
    this.settingsPanelOpen = true
  },
  
  closeSettingsPanel() {
    this.settingsPanelOpen = false
    this.selectedQuestionId = null
  },
  
  toggleCommentSidebar(questionId = null) {
    if (questionId) {
      this.activeCommentThread = questionId
      this.commentSidebarOpen = true
    } else {
      this.commentSidebarOpen = !this.commentSidebarOpen
    }
  },
  
  closeCommentSidebar() {
    this.commentSidebarOpen = false
    this.activeCommentThread = null
  },
  
  toggleVersionHistory() {
    this.versionHistoryOpen = !this.versionHistoryOpen
  },
  
  setActiveTab(tab) {
    this.activeTab = tab
  },
  
  setPreviewDevice(device) {
    this.previewDevice = device
  },
  
  selectQuestion(questionId) {
    this.selectedQuestionId = questionId
  },
  
  setSaveStatus(status) {
    this.saveStatus = status
    if (status === 'saved') {
      this.lastSaved = new Date().toISOString()
    }
  },
  
  // Auto-save functionality
  async autoSave() {
    this.setSaveStatus('saving')
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would make an API call
    this.setSaveStatus('saved')
  },
  
  // Debounced auto-save
  debouncedAutoSave: null,
  
  initAutoSave() {
    let timeout
    this.debouncedAutoSave = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.autoSave()
      }, 1000)
    }
  },
  
  // Comment sidebar
  commentSidebarOpen: false,
  activeCommentQuestionId: null,
  
  toggleCommentSidebar(questionId) {
    if (this.activeCommentQuestionId === questionId && this.commentSidebarOpen) {
      this.commentSidebarOpen = false
      this.activeCommentQuestionId = null
    } else {
      this.commentSidebarOpen = true
      this.activeCommentQuestionId = questionId
    }
  },
  
  closeCommentSidebar() {
    this.commentSidebarOpen = false
    this.activeCommentQuestionId = null
  },
  
  // Keyboard shortcuts help
  showKeyboardHelp: false,
  
  // Settings Panel Tab Visibility
  hasDisplaySettings(questionType) {
    const displayTypes = [
      'multiple_choice', 'checkbox', 'dropdown', 'slider', 'star_rating',
      'number_scale', 'likert', 'matrix', 'yes_no', 'emoji_scale',
      'long_text', 'constant_sum', 'ranking', 'side_by_side',
      'image_choice', 'priority_grid'
    ]
    return displayTypes.includes(questionType)
  },
  
  hasLogicSettings(questionType) {
    const logicTypes = [
      'multiple_choice', 'dropdown', 'checkbox', 'yes_no', 'number_scale',
      'star_rating', 'nps', 'likert', 'slider', 'emoji_scale',
      'matrix', 'ranking', 'image_choice'
    ]
    return logicTypes.includes(questionType)
  },
  
  hasAdvancedSettings(questionType) {
    const advancedTypes = [
      'text_input', 'long_text', 'multiple_choice', 'checkbox',
      'matrix', 'file_upload', 'signature', 'drawing',
      'video_response', 'audio_response', 'heat_map', 'hot_spot',
      'map_location', 'card_sort', 'constant_sum', 'max_diff'
    ]
    return advancedTypes.includes(questionType)
  },

  // Smart UX Logic Helpers
  getAvailableFormats(questionType, answerType) {
    if (questionType === 'multiple_choice') {
      if (answerType === 'multiple') {
        // For multiple answers, only List format makes UX sense
        return ['list']
      } else {
        // For single answer, all formats are available
        return ['list', 'dropdown', 'select_box']
      }
    }
    
    // Return all formats for other question types (to be expanded)
    return ['list', 'dropdown', 'select_box']
  },

  isFormatDisabled(questionType, answerType, format) {
    const availableFormats = this.getAvailableFormats(questionType, answerType)
    return !availableFormats.includes(format)
  },

  getSmartTextTypes(currentType) {
    // Smart logic for text entry types
    if (currentType === 'password') {
      // Password type should disable multi-line options
      return {
        available: ['single_line', 'password'],
        disabled: ['multiple_lines', 'essay_box', 'autocomplete']
      }
    }
    
    return {
      available: ['single_line', 'multiple_lines', 'essay_box', 'password', 'autocomplete'],
      disabled: []
    }
  },

  isTextTypeDisabled(currentType, optionType) {
    const typeInfo = this.getSmartTextTypes(currentType)
    return typeInfo.disabled.includes(optionType)
  },

  getSliderInteractionModes(sliderType) {
    if (sliderType === 'stars') {
      return ['discrete', 'half_step', 'continuous']
    }
    return []
  },

  shouldShowSliderInteraction(sliderType) {
    return sliderType === 'stars'
  },

  shouldShowLayoutOptions(questionType, format) {
    return questionType === 'multiple_choice' && format === 'list'
  },

  shouldShowLabelPosition(questionType, format, layout) {
    return questionType === 'multiple_choice' && format === 'list' && layout === 'horizontal'
  },

  shouldShowColumns(questionType, format, layout) {
    return questionType === 'multiple_choice' && format === 'list' && layout === 'columns'
  },

  // Smart format switching when answer type changes
  handleAnswerTypeChange(question, newAnswerType) {
    const availableFormats = this.getAvailableFormats(question.type, newAnswerType)
    
    // If current format is not available for new answer type, switch to first available
    if (!availableFormats.includes(question.settings.format)) {
      question.settings.format = availableFormats[0]
    }
    
    return question
  },

  // Smart answer type switching when format changes
  handleFormatChange(question, newFormat) {
    // If switching to dropdown or select_box, force single answer type
    if (['dropdown', 'select_box'].includes(newFormat) && question.settings.answerType === 'multiple') {
      question.settings.answerType = 'single'
    }
    
    return question
  }
})