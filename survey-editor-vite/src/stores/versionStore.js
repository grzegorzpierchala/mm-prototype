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
      changes: [
        { type: 'added', item: 'question', text: 'Added age range question (Q5)' },
        { type: 'modified', item: 'question', text: 'Updated wording for satisfaction scale (Q1)' },
        { type: 'added', item: 'question', text: 'Added visit frequency question (Q6)' },
        { type: 'modified', item: 'settings', text: 'Enabled progress bar' }
      ],
      stats: {
        questions: 6,
        responses: 0
      },
      isCurrent: true
    },
    {
      id: 'v2',
      version: 2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      author: 'Sarah Chen',
      message: 'Legal compliance updates',
      changes: [
        { type: 'added', item: 'text', text: 'Added GDPR consent notice' },
        { type: 'modified', item: 'question', text: 'Made email optional (Q4)' },
        { type: 'removed', item: 'question', text: 'Removed phone number field' }
      ],
      stats: {
        questions: 4,
        responses: 0
      },
      isCurrent: false
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
      isCurrent: false
    }
  ],
  
  // Comparison state
  compareMode: false,
  compareVersion: null,
  showVisualDiff: false,
  
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
  }
})