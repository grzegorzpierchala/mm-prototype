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
  }
})