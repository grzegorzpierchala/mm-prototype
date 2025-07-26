import './style.css'
import './originalStyles.css'
import Alpine from 'alpinejs'
import surveyEditor from './components/surveyEditor'

// Import stores
import './stores/surveyStore'
import './stores/uiStore'
import './stores/commentStore'
import './stores/versionStore'

// Import Alpine.js plugins if needed
// import focus from '@alpinejs/focus'
// import persist from '@alpinejs/persist'

// Make Alpine available globally before components register
window.Alpine = Alpine

// Register components before Alpine starts
Alpine.data('surveyEditor', surveyEditor)

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
    
  </div>
`

// Start Alpine after DOM is set up
Alpine.start()