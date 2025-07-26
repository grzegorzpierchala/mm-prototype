// Settings Panel Component - 380px sliding panel
export function SettingsPanel() {
  return `
    <!-- Settings Panel Container -->
    <div x-show="$store.ui.settingsPanelOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="transform translate-x-full"
         x-transition:enter-end="transform translate-x-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="transform translate-x-0"
         x-transition:leave-end="transform translate-x-full"
         @click.away="$store.ui.closeSettingsPanel()"
         class="settings-panel"
         :class="{ 'show': $store.ui.settingsPanelOpen }">
      
      <!-- Header -->
      <div class="settings-header">
        <h3 class="text-lg font-semibold text-gray-900">
          <span x-show="$store.ui.selectedQuestionId">Question Settings</span>
          <span x-show="!$store.ui.selectedQuestionId">Survey Settings</span>
        </h3>
        <button @click="$store.ui.closeSettingsPanel()" 
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
        <button @click="$store.ui.settingsSection = 'logic'"
                :class="$store.ui.settingsSection === 'logic' ? 'active' : ''"
                class="settings-tab">
          Logic
        </button>
        <button @click="$store.ui.settingsSection = 'validation'"
                :class="$store.ui.settingsSection === 'validation' ? 'active' : ''"
                class="settings-tab">
          Validation
        </button>
        <button @click="$store.ui.settingsSection = 'appearance'"
                :class="$store.ui.settingsSection === 'appearance' ? 'active' : ''" 
                class="settings-tab">
          Appearance
        </button>
      </div>
      
      <!-- Settings Content -->
      <div class="settings-content">
        <template x-if="$store.ui.selectedQuestionId">
          <div>
            <!-- General Tab Content -->
            <div x-show="$store.ui.settingsSection === 'general'">
              <div class="settings-section">
                <h4 class="settings-section-title">Basic Settings</h4>
                
                <!-- Required Toggle -->
                <div class="flex items-center justify-between mb-4">
                  <label class="text-sm font-medium text-gray-700">Required</label>
                  <label class="toggle-switch">
                    <input type="checkbox" 
                           :checked="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.required"
                           @change="$store.survey.updateQuestion($store.ui.selectedQuestionId, { required: $event.target.checked }); $store.ui.debouncedAutoSave()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <!-- Description Field -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    :value="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.description"
                    @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { description: $event.target.value }); $store.ui.debouncedAutoSave()"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows="3"
                    placeholder="Add a description or help text..."></textarea>
                </div>
                
                <!-- Question Type Specific Settings -->
                <div x-data="{ question: $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId) }">
                  <!-- Multiple Choice Settings -->
                  <div x-show="question?.type === 'multiple_choice'">
                    <h4 class="settings-section-title">Multiple Choice Options</h4>
                    
                    <div class="flex items-center justify-between mb-4">
                      <label class="text-sm font-medium text-gray-700">Allow multiple selections</label>
                      <label class="toggle-switch-sm">
                        <input type="checkbox" 
                               :checked="question?.settings?.allowMultiple"
                               @change="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, allowMultiple: $event.target.checked } })">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <div class="flex items-center justify-between mb-4">
                      <label class="text-sm font-medium text-gray-700">Randomize options</label>
                      <label class="toggle-switch-sm">
                        <input type="checkbox" 
                               :checked="question?.settings?.randomizeOptions"
                               @change="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, randomizeOptions: $event.target.checked } })">
                        <span class="toggle-slider"></span>
                      </label>
                    </div>
                    
                    <!-- Display Format -->
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Display Format</label>
                      <div class="display-format-grid">
                        <label class="display-format-card" :class="{ 'selected': question?.settings?.displayFormat === 'list' }">
                          <input type="radio" 
                                 name="displayFormat" 
                                 value="list"
                                 :checked="question?.settings?.displayFormat === 'list'"
                                 @change="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, displayFormat: 'list' } })">
                          <div class="display-format-icon">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                            </svg>
                          </div>
                          <span class="display-format-label">List</span>
                        </label>
                        
                        <label class="display-format-card" :class="{ 'selected': question?.settings?.displayFormat === 'grid' }">
                          <input type="radio" 
                                 name="displayFormat" 
                                 value="grid"
                                 :checked="question?.settings?.displayFormat === 'grid'"
                                 @change="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, displayFormat: 'grid' } })">
                          <div class="display-format-icon">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                            </svg>
                          </div>
                          <span class="display-format-label">Grid</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Text Input Settings -->
                  <div x-show="question?.type === 'text_input' || question?.type === 'long_text'">
                    <h4 class="settings-section-title">Text Input Options</h4>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Placeholder Text</label>
                      <input type="text" 
                             :value="question?.settings?.placeholder"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, placeholder: $event.target.value } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             placeholder="Enter placeholder text...">
                    </div>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Character Limit</label>
                      <input type="number" 
                             :value="question?.settings?.maxLength"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, maxLength: parseInt($event.target.value) } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="1"
                             max="5000">
                    </div>
                  </div>
                  
                  <!-- Number Scale Settings -->
                  <div x-show="question?.type === 'number_scale'">
                    <h4 class="settings-section-title">Scale Options</h4>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
                        <input type="number" 
                               :value="question?.settings?.minValue"
                               @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, minValue: parseInt($event.target.value) } })"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
                        <input type="number" 
                               :value="question?.settings?.maxValue"
                               @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, maxValue: parseInt($event.target.value) } })"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                    </div>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Min Label</label>
                      <input type="text" 
                             :value="question?.settings?.labels?.min"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, labels: { ...question.settings.labels, min: $event.target.value } } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             placeholder="e.g. Not likely">
                    </div>
                    
                    <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Max Label</label>
                      <input type="text" 
                             :value="question?.settings?.labels?.max"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { settings: { ...question.settings, labels: { ...question.settings.labels, max: $event.target.value } } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             placeholder="e.g. Very likely">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Logic Tab Content -->
            <div x-show="$store.ui.settingsSection === 'logic'" class="settings-section">
              <h4 class="settings-section-title">Conditional Logic</h4>
              <p class="text-sm text-gray-500 mb-4">Show or hide this question based on previous answers</p>
              
              <button class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                + Add Condition
              </button>
              
              <div class="mt-6">
                <h4 class="settings-section-title">Skip Logic</h4>
                <p class="text-sm text-gray-500 mb-4">Jump to a specific question based on the answer</p>
                
                <button class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  + Add Skip Rule
                </button>
              </div>
            </div>
            
            <!-- Validation Tab Content -->
            <div x-show="$store.ui.settingsSection === 'validation'" class="settings-section">
              <h4 class="settings-section-title">Answer Validation</h4>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Error Message</label>
                <input type="text" 
                       :value="$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.validation?.requiredError"
                       @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { validation: { ...$store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId)?.validation, requiredError: $event.target.value } })"
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                       placeholder="Please answer this question">
              </div>
              
              <div x-data="{ question: $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId) }">
                <!-- Text validation -->
                <div x-show="question?.type === 'text_input' || question?.type === 'email' || question?.type === 'url'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pattern (Regex)</label>
                    <input type="text" 
                           :value="question?.validation?.pattern"
                           @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { validation: { ...question.validation, pattern: $event.target.value } })"
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                           placeholder="e.g. ^[a-zA-Z0-9]+$">
                  </div>
                  
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pattern Error Message</label>
                    <input type="text" 
                           :value="question?.validation?.patternError"
                           @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { validation: { ...question.validation, patternError: $event.target.value } })"
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="Please enter a valid format">
                  </div>
                </div>
                
                <!-- Number validation -->
                <div x-show="question?.type === 'number'">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Min Value</label>
                      <input type="number" 
                             :value="question?.validation?.min"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { validation: { ...question.validation, min: $event.target.value ? parseInt($event.target.value) : null } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Max Value</label>
                      <input type="number" 
                             :value="question?.validation?.max"
                             @input="$store.survey.updateQuestion($store.ui.selectedQuestionId, { validation: { ...question.validation, max: $event.target.value ? parseInt($event.target.value) : null } })"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Appearance Tab Content -->
            <div x-show="$store.ui.settingsSection === 'appearance'" class="settings-section">
              <h4 class="settings-section-title">Visual Settings</h4>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Question Width</label>
                <select class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Full width</option>
                  <option>Half width</option>
                  <option>Third width</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Text Size</label>
                <select class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option>Small</option>
                  <option selected>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">Hide question number</label>
                <label class="toggle-switch-sm">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Survey Settings (when no question is selected) -->
        <template x-if="!$store.ui.selectedQuestionId">
          <div>
            <div x-show="$store.ui.settingsSection === 'general'" class="settings-section">
              <h4 class="settings-section-title">Survey Configuration</h4>
              
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">Allow anonymous responses</label>
                <label class="toggle-switch">
                  <input type="checkbox" x-model="$store.survey.settings.allowAnonymous">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">Show progress bar</label>
                <label class="toggle-switch">
                  <input type="checkbox" x-model="$store.survey.settings.showProgressBar">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">Allow back navigation</label>
                <label class="toggle-switch">
                  <input type="checkbox" x-model="$store.survey.settings.allowBackNavigation">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="flex items-center justify-between mb-4">
                <label class="text-sm font-medium text-gray-700">Randomize questions</label>
                <label class="toggle-switch">
                  <input type="checkbox" x-model="$store.survey.settings.randomizeQuestions">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Survey Timeout (minutes)</label>
                <input type="number" 
                       x-model="$store.survey.settings.surveyTimeout"
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                       placeholder="No timeout"
                       min="1">
              </div>
            </div>
            
            <div x-show="$store.ui.settingsSection === 'appearance'" class="settings-section">
              <h4 class="settings-section-title">Theme Customization</h4>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" 
                         x-model="$store.survey.settings.customTheme.primaryColor"
                         class="h-10 w-20 rounded border border-gray-200">
                  <input type="text" 
                         x-model="$store.survey.settings.customTheme.primaryColor"
                         class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm">
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select x-model="$store.survey.settings.customTheme.fontFamily"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="Inter, system-ui">Inter (Default)</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                </select>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                <div class="display-format-grid">
                  <label class="display-format-card" :class="{ 'selected': $store.survey.settings.customTheme.buttonStyle === 'rounded' }">
                    <input type="radio" 
                           name="buttonStyle" 
                           value="rounded"
                           x-model="$store.survey.settings.customTheme.buttonStyle">
                    <div class="display-format-icon">
                      <div class="w-12 h-6 bg-indigo-600 rounded"></div>
                    </div>
                    <span class="display-format-label">Rounded</span>
                  </label>
                  
                  <label class="display-format-card" :class="{ 'selected': $store.survey.settings.customTheme.buttonStyle === 'square' }">
                    <input type="radio" 
                           name="buttonStyle" 
                           value="square"
                           x-model="$store.survey.settings.customTheme.buttonStyle">
                    <div class="display-format-icon">
                      <div class="w-12 h-6 bg-indigo-600"></div>
                    </div>
                    <span class="display-format-label">Square</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  `
}