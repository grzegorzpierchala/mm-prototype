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
  }
})