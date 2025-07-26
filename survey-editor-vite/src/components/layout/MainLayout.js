// Main Layout Component - Container for different tab content
import { QuestionRenderer } from '../questions/QuestionRenderer'
import { PreviewPage } from '../pages/PreviewPage'

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

      <!-- Share Tab Content -->
      <div x-show="$store.ui.activeTab === 'share'" 
           class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-bold mb-6">Share Your Survey</h2>
          
          <!-- Survey Link -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Survey Link</label>
            <div class="flex">
              <input type="text" 
                     value="https://surveys.example.com/s/abc123" 
                     readonly 
                     class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700">
                Copy
              </button>
            </div>
          </div>
          
          <!-- QR Code -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
            <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-gray-400">QR Code</span>
            </div>
          </div>
          
          <!-- Embed Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
            <textarea 
              readonly 
              rows="4" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              ><iframe src="https://surveys.example.com/embed/abc123" width="100%" height="600"></iframe></textarea>
          </div>
        </div>
      </div>

      <!-- Settings Tab Content -->
      <div x-show="$store.ui.activeTab === 'settings'" 
           class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow">
          <div class="p-6">
            <h2 class="text-xl font-semibold mb-6">Survey Settings</h2>
            
            <!-- General Settings -->
            <div class="space-y-6">
              <div>
                <label class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Allow anonymous responses</span>
                  <label class="toggle-switch">
                    <input type="checkbox" x-model="$store.survey.settings.allowAnonymous">
                    <span class="toggle-slider"></span>
                  </label>
                </label>
              </div>
              
              <div>
                <label class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Require all questions</span>
                  <label class="toggle-switch">
                    <input type="checkbox" x-model="$store.survey.settings.requireAllQuestions">
                    <span class="toggle-slider"></span>
                  </label>
                </label>
              </div>
              
              <div>
                <label class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Show progress bar</span>
                  <label class="toggle-switch">
                    <input type="checkbox" x-model="$store.survey.settings.showProgressBar">
                    <span class="toggle-slider"></span>
                  </label>
                </label>
              </div>
              
              <div>
                <label class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Allow back navigation</span>
                  <label class="toggle-switch">
                    <input type="checkbox" x-model="$store.survey.settings.allowBackNavigation">
                    <span class="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  `
}