import './style.css'
import Alpine from 'alpinejs'
import sort from '@alpinejs/sort'
import surveyEditor from './components/surveyEditor'

// Import stores
import './stores/surveyStore'
import './stores/uiStore'
import './stores/commentStore'
import './stores/versionStore'
import './stores/validationStore'
import './stores/flowStore'
import './stores/resultsStore'

// Register Alpine plugins
Alpine.plugin(sort)

// Make Alpine available globally before components register
window.Alpine = Alpine

// Import validation components first
import ValidationError, { ValidationSummary } from './components/ui/ValidationError'

// Register components before Alpine starts
Alpine.data('surveyEditor', surveyEditor)

// Register validation component
Alpine.data('validationSummary', () => ({
  errorCount: 0,
  questionsWithErrors: [],
  
  init() {
    this.$watch('$store.validation.results', () => {
      this.errorCount = this.$store.validation.getErrorCount()
      this.questionsWithErrors = this.$store.validation.getQuestionsWithErrors()
    })
    // Initial values
    this.errorCount = this.$store.validation.getErrorCount()
    this.questionsWithErrors = this.$store.validation.getQuestionsWithErrors()
  },
  
  scrollToError(questionId) {
    const element = document.querySelector(`[data-question-id="${questionId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Flash the question
      element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2')
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2')
      }, 2000)
    }
  }
}))

// Initialize UI store
Alpine.store('ui').initAutoSave()

// Import layout components
import { Header } from './components/layout/Header'
import { TabNavigation } from './components/layout/TabNavigation'
import { MainLayout } from './components/layout/MainLayout'

// Import UI components
import { SettingsPanel } from './components/ui/SettingsPanel'
import { CommentSidebar } from './components/ui/CommentSidebar'
import { VersionHistory } from './components/ui/VersionHistory'
import { AIAssistant } from './components/ui/AIAssistant'
import { KeyboardHelp } from './components/ui/KeyboardHelp'

// Set up the app structure
document.querySelector('#app').innerHTML = `
  <div x-data="surveyEditor" 
       @keydown.window.ctrl.h="$store.ui.toggleVersionHistory()"
       class="min-h-screen bg-gray-50">
    
    ${Header()}
    ${TabNavigation()}
    ${MainLayout()}
    
    ${SettingsPanel()}
    ${CommentSidebar()}
    ${VersionHistory()}
    ${AIAssistant()}
    ${KeyboardHelp()}
    ${ValidationSummary()}
    
  </div>
`

// Start Alpine after DOM is set up
// Need to wait for next tick to ensure Alpine processes all elements
requestAnimationFrame(() => {
  Alpine.start()
})