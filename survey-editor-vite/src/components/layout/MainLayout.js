// Main Layout Component - Container for different tab content
import { QuestionRenderer } from '../questions/QuestionRenderer'
import { PreviewPage } from '../pages/PreviewPage'
import { SharePage } from '../pages/SharePage'
import { SettingsPage } from '../pages/SettingsPage'

export function MainLayout() {
  return `
    <main class="px-6 py-8">
      
      <!-- Build Tab Content -->
      <div x-show="$store.ui.activeTab === 'build'" 
           class="max-w-4xl mx-auto relative">
        
        <!-- Survey Title and Description -->
        <div class="mb-8">
          <input type="text" 
                 x-model="$store.survey.title"
                 @input="debouncedAutosave"
                 class="text-3xl font-bold text-gray-900 mb-2 w-full bg-transparent border-0 focus:bg-gray-50 px-2 -mx-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 placeholder="Survey Title">
          <input type="text"
                 x-model="$store.survey.description"
                 @input="debouncedAutosave"
                 class="text-gray-600 w-full bg-transparent border-0 focus:bg-gray-50 px-2 -mx-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 placeholder="Survey description...">
        </div>

        <!-- Blocks Container -->
        <div class="space-y-4">
          <!-- Question Blocks -->
          ${QuestionRenderer()}
          
          <!-- Add Block Button -->
          <div class="flex items-center justify-center py-8">
            <button @click="showSlashMenu = true" class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <span class="text-xl">+</span>
              <span>Add block or type / for commands</span>
            </button>
          </div>
        </div>
      </div>

      ${PreviewPage()}

      ${SharePage()}

      ${SettingsPage()}

    </main>
  `
}