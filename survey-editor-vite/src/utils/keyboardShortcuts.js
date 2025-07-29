// Keyboard shortcuts for the survey editor
export function initKeyboardShortcuts() {
  const shortcuts = {
    // Show keyboard shortcuts help
    '?': () => {
      Alpine.store('ui').showKeyboardHelp = !Alpine.store('ui').showKeyboardHelp
    },
    'shift+/': () => {
      Alpine.store('ui').showKeyboardHelp = !Alpine.store('ui').showKeyboardHelp
    },
    
    // Save
    'ctrl+s': (e) => {
      e.preventDefault()
      Alpine.store('ui').autoSave()
    },
    'cmd+s': (e) => {
      e.preventDefault()
      Alpine.store('ui').autoSave()
    },
    
    // Version history
    'ctrl+h': () => {
      Alpine.store('ui').toggleVersionHistory()
    },
    'cmd+h': () => {
      Alpine.store('ui').toggleVersionHistory()
    },
    
    // Add new question
    'ctrl+enter': () => {
      const surveyEditor = Alpine.$data(document.querySelector('[x-data="surveyEditor"]'))
      if (surveyEditor) {
        surveyEditor.addQuestion()
      }
    },
    'cmd+enter': () => {
      const surveyEditor = Alpine.$data(document.querySelector('[x-data="surveyEditor"]'))
      if (surveyEditor) {
        surveyEditor.addQuestion()
      }
    },
    
    // Duplicate current question
    'ctrl+d': (e) => {
      e.preventDefault()
      const selectedId = Alpine.store('ui').selectedQuestionId
      if (selectedId) {
        Alpine.store('survey').duplicateQuestion(selectedId)
      }
    },
    'cmd+d': (e) => {
      e.preventDefault()
      const selectedId = Alpine.store('ui').selectedQuestionId
      if (selectedId) {
        Alpine.store('survey').duplicateQuestion(selectedId)
      }
    },
    
    // Delete current question
    'delete': () => {
      const selectedId = Alpine.store('ui').selectedQuestionId
      if (selectedId && !document.activeElement.matches('input, textarea')) {
        if (confirm('Delete this question?')) {
          Alpine.store('survey').deleteQuestion(selectedId)
        }
      }
    },
    
    // Navigate questions
    'arrowup': (e) => {
      if (!document.activeElement.matches('input, textarea')) {
        e.preventDefault()
        navigateQuestions(-1)
      }
    },
    'arrowdown': (e) => {
      if (!document.activeElement.matches('input, textarea')) {
        e.preventDefault()
        navigateQuestions(1)
      }
    },
    
    // Toggle settings panel
    'ctrl+,': (e) => {
      e.preventDefault()
      const selectedId = Alpine.store('ui').selectedQuestionId
      if (selectedId) {
        Alpine.store('ui').toggleSettingsPanel(selectedId)
      }
    },
    'cmd+,': (e) => {
      e.preventDefault()
      const selectedId = Alpine.store('ui').selectedQuestionId
      if (selectedId) {
        Alpine.store('ui').toggleSettingsPanel(selectedId)
      }
    }
  }
  
  // Helper function to navigate between questions
  function navigateQuestions(direction) {
    const questions = Alpine.store('survey').questions
    const currentId = Alpine.store('ui').selectedQuestionId
    const currentIndex = questions.findIndex(q => q.id === currentId)
    
    let newIndex = currentIndex + direction
    if (newIndex < 0) newIndex = questions.length - 1
    if (newIndex >= questions.length) newIndex = 0
    
    if (questions[newIndex]) {
      Alpine.store('ui').selectedQuestionId = questions[newIndex].id
      // Scroll to the question
      const element = document.querySelector(`[x-data*="question.id === '${questions[newIndex].id}'"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
  
  // Register keyboard event listener
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input field
    if (e.target.matches('input, textarea, select, [contenteditable]')) {
      return
    }
    
    // Build the key combination string
    const keys = []
    if (e.ctrlKey) keys.push('ctrl')
    if (e.metaKey) keys.push('cmd')
    if (e.altKey) keys.push('alt')
    if (e.shiftKey) keys.push('shift')
    
    // Add the actual key
    const key = e.key.toLowerCase()
    keys.push(key)
    
    const combo = keys.join('+')
    
    // Check for exact match
    if (shortcuts[combo]) {
      shortcuts[combo](e)
    } else if (shortcuts[key]) {
      // Check for single key shortcuts
      shortcuts[key](e)
    }
  })
  
  return {
    shortcuts,
    showHelp() {
      return `
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
             x-show="$store.ui.showKeyboardHelp"
             @click.away="$store.ui.showKeyboardHelp = false"
             @keydown.escape="$store.ui.showKeyboardHelp = false">
          <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="font-medium text-gray-700 mb-2">Navigation</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">Navigate questions</span>
                      <span class="kbd">↑ ↓</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-700 mb-2">Actions</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">Save</span>
                      <span class="kbd">⌘/Ctrl + S</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Add question</span>
                      <span class="kbd">⌘/Ctrl + Enter</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Duplicate question</span>
                      <span class="kbd">⌘/Ctrl + D</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Delete question</span>
                      <span class="kbd">Delete</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-700 mb-2">Panels</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">Version history</span>
                      <span class="kbd">⌘/Ctrl + H</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm">Settings</span>
                      <span class="kbd">⌘/Ctrl + ,</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 class="font-medium text-gray-700 mb-2">Help</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm">Show shortcuts</span>
                      <span class="kbd">?</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  }
}