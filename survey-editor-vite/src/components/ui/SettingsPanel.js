// Settings Panel Component - 380px sliding panel
export function SettingsPanel() {
  return `
    <!-- Settings Panel Container -->
    <div x-show="$store.ui.settingsPanelOpen && $store.ui.selectedQuestionId" 
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 transform translate-x-full"
         x-transition:enter-end="opacity-100 transform translate-x-0"
         @click.away="$store.ui.closeSettingsPanel()"
         class="settings-panel" 
         :class="{ 'show': $store.ui.settingsPanelOpen && $store.ui.selectedQuestionId }">
      
      <template x-if="$store.ui.selectedQuestionId">
        <div class="h-full flex flex-col">
          <!-- Settings Header -->
          <div class="settings-header">
            <h3 class="text-lg font-semibold text-gray-900">Question Settings</h3>
            <button @click="$store.ui.closeSettingsPanel()" 
                    class="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Tab Navigation -->
          <div class="settings-tabs">
            <button @click="$store.ui.settingsSection = 'general'" 
                    :class="$store.ui.settingsSection === 'general' ? 'active' : ''"
                    class="settings-tab">
              General
            </button>
            <button @click="$store.ui.settingsSection = 'validation'" 
                    :class="$store.ui.settingsSection === 'validation' ? 'active' : ''"
                    class="settings-tab">
              Validation
            </button>
            <button @click="$store.ui.settingsSection = 'display'" 
                    :class="$store.ui.settingsSection === 'display' ? 'active' : ''"
                    class="settings-tab">
              Display
            </button>
            <button @click="$store.ui.settingsSection = 'logic'" 
                    :class="$store.ui.settingsSection === 'logic' ? 'active' : ''"
                    class="settings-tab"
                    x-show="['multiple_choice', 'dropdown', 'rating_scale'].includes($store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.type)">
              Logic
            </button>
          </div>
          
          <!-- Settings Content -->
          <div class="settings-content">
            <!-- General Tab -->
            <div x-show="$store.ui.settingsSection === 'general'" class="space-y-6">
              <!-- Question Type -->
              <div class="settings-section">
                <h4 class="settings-section-title">Type</h4>
                <select x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).type" 
                        @change="$store.ui.debouncedAutoSave()"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base">
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text_input">Text Input</option>
                  <option value="rating_scale">Rating Scale</option>
                  <option value="matrix">Matrix</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="yes_no">Yes/No</option>
                  <option value="slider">Slider</option>
                  <option value="ranking">Ranking</option>
                  <option value="date_time">Date/Time</option>
                  <option value="file_upload">File Upload</option>
                </select>
              </div>
              
              <!-- Question Text -->
              <div class="settings-section">
                <h4 class="settings-section-title">Question Text</h4>
                <textarea x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).text" 
                          @input="$store.ui.debouncedAutoSave()"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-base"
                          placeholder="Enter your question..."></textarea>
              </div>
              
              <!-- Required Toggle -->
              <div class="settings-section">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-base font-medium text-gray-900">Required Question</h4>
                    <p class="text-sm text-gray-500 mt-1">Respondents must answer this question</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" 
                           x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).required"
                           @change="$store.ui.debouncedAutoSave()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Validation Tab -->
            <div x-show="$store.ui.settingsSection === 'validation'" class="space-y-6">
              <!-- Multiple Choice Validation -->
              <div x-show="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.type === 'multiple_choice'" class="space-y-6">
                <div class="settings-section">
                  <h4 class="settings-section-title">Selection Rules</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Min selections</label>
                      <input type="number" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).validation.minSelections"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="0">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max selections</label>
                      <input type="number" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).validation.maxSelections"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="1">
                    </div>
                  </div>
                </div>
                
                <div class="settings-section">
                  <h4 class="settings-section-title">Error Messages</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Required Field Error</label>
                      <input type="text" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).validation.requiredError"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             placeholder="Please select your satisfaction level">
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Text Input Validation -->
              <div x-show="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.type === 'text_input'" class="space-y-6">
                <div class="settings-section">
                  <h4 class="settings-section-title">Text Validation</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                      <input type="number" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).validation.minLength"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="0">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                      <input type="number" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).validation.maxLength"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="1">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Display Tab -->
            <div x-show="$store.ui.settingsSection === 'display'" class="space-y-6">
              <!-- Multiple Choice Display -->
              <div x-show="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.type === 'multiple_choice'" class="space-y-6">
                <div class="settings-section">
                  <h4 class="settings-section-title">Display Options</h4>
                  
                  <!-- Allow Multiple Toggle -->
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-base font-medium text-gray-900">Multiple Selection</h4>
                      <p class="text-sm text-gray-500 mt-1">Allow selecting multiple options</p>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.allowMultiple"
                             @change="$store.ui.debouncedAutoSave()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <!-- Randomize Options Toggle -->
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h4 class="text-base font-medium text-gray-900">Randomize Options</h4>
                      <p class="text-sm text-gray-500 mt-1">Show options in random order</p>
                    </div>
                    <label class="toggle-switch">
                      <input type="checkbox" 
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.randomizeOptions"
                             @change="$store.ui.debouncedAutoSave()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <!-- Display Format -->
                <div class="settings-section">
                  <h4 class="settings-section-title">Display Format</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <label class="display-format-card cursor-pointer" 
                           :class="{ 'selected': $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.settings?.displayFormat === 'list' }">
                      <input type="radio" 
                             name="displayFormat" 
                             value="list"
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.displayFormat"
                             @change="$store.ui.debouncedAutoSave()"
                             class="sr-only">
                      <div class="display-format-icon">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                        </svg>
                      </div>
                      <span class="display-format-label">List</span>
                    </label>
                    
                    <label class="display-format-card cursor-pointer" 
                           :class="{ 'selected': $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.settings?.displayFormat === 'grid' }">
                      <input type="radio" 
                             name="displayFormat" 
                             value="grid"
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.displayFormat"
                             @change="$store.ui.debouncedAutoSave()"
                             class="sr-only">
                      <div class="display-format-icon">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                        </svg>
                      </div>
                      <span class="display-format-label">Grid</span>
                    </label>
                    
                    <label class="display-format-card cursor-pointer" 
                           :class="{ 'selected': $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.settings?.displayFormat === 'dropdown' }">
                      <input type="radio" 
                             name="displayFormat" 
                             value="dropdown"
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.displayFormat"
                             @change="$store.ui.debouncedAutoSave()"
                             class="sr-only">
                      <div class="display-format-icon">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      <span class="display-format-label">Dropdown</span>
                    </label>
                    
                    <label class="display-format-card cursor-pointer" 
                           :class="{ 'selected': $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.settings?.displayFormat === 'buttons' }">
                      <input type="radio" 
                             name="displayFormat" 
                             value="buttons"
                             x-model="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId).settings.displayFormat"
                             @change="$store.ui.debouncedAutoSave()"
                             class="sr-only">
                      <div class="display-format-icon">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2z"></path>
                        </svg>
                      </div>
                      <span class="display-format-label">Buttons</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Logic Tab -->
            <div x-show="$store.ui.settingsSection === 'logic'" class="space-y-6">
              <div class="settings-section">
                <h4 class="settings-section-title">Conditional Logic</h4>
                <p class="text-sm text-gray-500 mb-4">Show or hide questions based on responses</p>
                
                <button class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                  + Add Logic Rule
                </button>
              </div>
              
              <div class="settings-section">
                <h4 class="settings-section-title">Skip Logic</h4>
                <p class="text-sm text-gray-500 mb-4">Jump to specific questions based on answers</p>
                
                <button class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                  + Add Skip Rule
                </button>
              </div>
            </div>
            
            <!-- Delete Question Button -->
            <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
              <button @click="if(confirm('Are you sure you want to delete this question?')) { $store.survey.removeQuestion($store.ui.selectedQuestionId); $store.ui.closeSettingsPanel(); }"
                      class="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                Delete Question
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  `
}