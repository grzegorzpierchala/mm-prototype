// Settings Panel Component - 380px sliding panel with dynamic sections
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
        <div class="h-full flex flex-col"
             x-data="{
               get question() {
                 return $store.survey.questions.find(q => q.id === $store.ui.selectedQuestionId);
               },
               updateSetting(path, value) {
                 const keys = path.split('.');
                 let obj = this.question;
                 for (let i = 0; i < keys.length - 1; i++) {
                   if (!obj[keys[i]]) obj[keys[i]] = {};
                   obj = obj[keys[i]];
                 }
                 obj[keys[keys.length - 1]] = value;
                 $store.ui.debouncedAutoSave();
               }
             }">
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
          
          <!-- Dynamic Tab Navigation -->
          <div class="settings-tabs">
            <button @click="$store.ui.settingsSection = 'general'" 
                    :class="$store.ui.settingsSection === 'general' ? 'active' : ''"
                    class="settings-tab">
              General
            </button>
            <button @click="$store.ui.settingsSection = 'display'" 
                    :class="$store.ui.settingsSection === 'display' ? 'active' : ''"
                    class="settings-tab"
                    x-show="$store.ui.hasDisplaySettings(question.type)">
              Display
            </button>
            <button @click="$store.ui.settingsSection = 'validation'" 
                    :class="$store.ui.settingsSection === 'validation' ? 'active' : ''"
                    class="settings-tab">
              Validation
            </button>
            <button @click="$store.ui.settingsSection = 'logic'" 
                    :class="$store.ui.settingsSection === 'logic' ? 'active' : ''"
                    class="settings-tab"
                    x-show="$store.ui.hasLogicSettings(question.type)">
              Logic
            </button>
            <button @click="$store.ui.settingsSection = 'advanced'" 
                    :class="$store.ui.settingsSection === 'advanced' ? 'active' : ''"
                    class="settings-tab"
                    x-show="$store.ui.hasAdvancedSettings(question.type)">
              Advanced
            </button>
          </div>
          
          <!-- Settings Content -->
          <div class="settings-content">
            <!-- General Tab -->
            <div x-show="$store.ui.settingsSection === 'general'" class="space-y-6">
              <!-- Question Type (First) -->
              <div class="settings-section">
                <h4 class="settings-section-title">Question Type</h4>
                <select x-model="question.type" 
                        @change="changeQuestionType(question.id, $event.target.value)"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium">
                  <optgroup label="Essential">
                    <option value="text_input">Short Text</option>
                    <option value="long_text">Long Text</option>
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="checkbox">Checkboxes</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="yes_no">Yes/No</option>
                  </optgroup>
                  <optgroup label="Rating">
                    <option value="star_rating">Star Rating</option>
                    <option value="number_scale">Number Scale</option>
                    <option value="nps">NPS Score</option>
                    <option value="likert">Likert Scale</option>
                    <option value="slider">Slider</option>
                    <option value="emoji_scale">Emoji Scale</option>
                  </optgroup>
                  <optgroup label="Input">
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="url">Website</option>
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                  </optgroup>
                  <optgroup label="Advanced">
                    <option value="matrix">Matrix Table</option>
                    <option value="ranking">Rank Order</option>
                    <option value="constant_sum">Constant Sum</option>
                    <option value="max_diff">MaxDiff</option>
                    <option value="side_by_side">Side by Side</option>
                    <option value="card_sort">Card Sort</option>
                  </optgroup>
                  <optgroup label="Media">
                    <option value="file_upload">File Upload</option>
                    <option value="image_choice">Image Choice</option>
                    <option value="signature">Signature</option>
                    <option value="drawing">Drawing</option>
                    <option value="video_response">Video</option>
                    <option value="audio_response">Audio</option>
                  </optgroup>
                  <optgroup label="Interactive">
                    <option value="heat_map">Heat Map</option>
                    <option value="hot_spot">Hot Spot</option>
                    <option value="map_location">Map Location</option>
                    <option value="priority_grid">Priority Grid</option>
                  </optgroup>
                </select>
              </div>
              
              <!-- Question Number (Second) -->
              <div class="settings-section">
                <h4 class="settings-section-title">Question Number</h4>
                <input type="text" 
                       x-model="question.questionNumber"
                       @input="validateQuestionNumber(question.id); $store.ui.debouncedAutoSave()"
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                       :class="{'border-red-500': !isQuestionNumberValid(question.id)}"
                       placeholder="Q1, A1, 1.1, etc.">
                <p class="text-sm text-gray-500 mt-1">For research reference purposes</p>
              </div>
              
              <!-- Question Text (Third) -->
              <div class="settings-section">
                <h4 class="settings-section-title">Question Text</h4>
                <textarea x-model="question.text" 
                          @input="$store.ui.debouncedAutoSave()"
                          rows="3"
                          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-base"
                          placeholder="Enter your question..."></textarea>
              </div>
              
              <!-- Required Toggle (Fourth) -->
              <div class="settings-section">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-base font-medium text-gray-900">Required Question</h4>
                    <p class="text-sm text-gray-500 mt-1">Respondents must answer this question</p>
                  </div>
                  <label class="toggle-switch">
                    <input type="checkbox" 
                           x-model="question.required"
                           @change="$store.ui.debouncedAutoSave()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <!-- Question-Type Specific General Settings -->
              <template x-if="['text_input', 'long_text'].includes(question.type)">
                <div class="settings-section">
                  <h4 class="settings-section-title">Text Settings</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Placeholder Text</label>
                      <input type="text" 
                             x-model="question.settings.placeholder"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             placeholder="e.g., Type your answer here...">
                    </div>
                    <div x-show="question.type === 'text_input'">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Text Type</label>
                      <select x-model="question.settings.textType"
                              @change="$store.ui.debouncedAutoSave()"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="single_line" 
                                :disabled="$store.ui.isTextTypeDisabled(question.settings.textType, 'single_line')">
                          Single Line
                        </option>
                        <option value="multiple_lines"
                                :disabled="$store.ui.isTextTypeDisabled(question.settings.textType, 'multiple_lines')">
                          Multiple Lines
                        </option>
                        <option value="essay_box"
                                :disabled="$store.ui.isTextTypeDisabled(question.settings.textType, 'essay_box')">
                          Essay Text Box
                        </option>
                        <option value="password">
                          Password
                        </option>
                        <option value="autocomplete"
                                :disabled="$store.ui.isTextTypeDisabled(question.settings.textType, 'autocomplete')">
                          Autocomplete
                        </option>
                      </select>
                      <p x-show="question.settings.textType === 'password'" class="text-xs text-amber-600 mt-1">
                        💡 Password type disables multi-line options for security
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Display Tab -->
            <div x-show="$store.ui.settingsSection === 'display'" class="space-y-6">
              <!-- Multiple Choice Display Settings -->
              <template x-if="question.type === 'multiple_choice'">
                <div class="space-y-6">
                  <!-- Answer Type -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Answer Type</h4>
                    <div class="space-y-3">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" 
                               x-model="question.settings.answerType"
                               value="single"
                               @change="$store.ui.handleAnswerTypeChange(question, 'single'); $store.ui.debouncedAutoSave()"
                               class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Allow one answer</span>
                          <p class="text-xs text-gray-500">Radio buttons</p>
                        </div>
                      </label>
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" 
                               x-model="question.settings.answerType"
                               value="multiple"
                               @change="$store.ui.handleAnswerTypeChange(question, 'multiple'); $store.ui.debouncedAutoSave()"
                               class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Allow multiple answers</span>
                          <p class="text-xs text-gray-500">Checkboxes</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Format (Smart Logic Applied) -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Format</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <!-- List Format (Always Available) -->
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 'selected': question.settings.format === 'list' }">
                        <input type="radio" 
                               x-model="question.settings.format"
                               value="list"
                               @change="$store.ui.handleFormatChange(question, 'list'); $store.ui.debouncedAutoSave()"
                               class="sr-only">
                        <div class="display-format-icon">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                          </svg>
                        </div>
                        <span class="display-format-label">List</span>
                      </label>
                      
                      <!-- Dropdown Format (Disabled for Multiple Answers) -->
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 
                               'selected': question.settings.format === 'dropdown',
                               'disabled': $store.ui.isFormatDisabled(question.type, question.settings.answerType, 'dropdown')
                             }">
                        <input type="radio" 
                               x-model="question.settings.format"
                               value="dropdown"
                               @change="$store.ui.handleFormatChange(question, 'dropdown'); $store.ui.debouncedAutoSave()"
                               :disabled="$store.ui.isFormatDisabled(question.type, question.settings.answerType, 'dropdown')"
                               class="sr-only">
                        <div class="display-format-icon">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                        <span class="display-format-label">Dropdown</span>
                      </label>
                      
                      <!-- Select Box Format (Disabled for Multiple Answers) -->
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 
                               'selected': question.settings.format === 'select_box',
                               'disabled': $store.ui.isFormatDisabled(question.type, question.settings.answerType, 'select_box')
                             }">
                        <input type="radio" 
                               x-model="question.settings.format"
                               value="select_box"
                               @change="$store.ui.handleFormatChange(question, 'select_box'); $store.ui.debouncedAutoSave()"
                               :disabled="$store.ui.isFormatDisabled(question.type, question.settings.answerType, 'select_box')"
                               class="sr-only">
                        <div class="display-format-icon">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="16" rx="2" stroke-width="2"></rect>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h10M7 16h10"></path>
                          </svg>
                        </div>
                        <span class="display-format-label">Select Box</span>
                      </label>
                    </div>
                    
                    <!-- Smart UX Explanation -->
                    <div x-show="question.settings.answerType === 'multiple'" 
                         class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div class="flex items-start space-x-2">
                        <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                          <p class="text-sm font-medium text-blue-800">Smart UX Applied</p>
                          <p class="text-xs text-blue-700 mt-1">
                            When allowing multiple answers, only List format provides good UX. 
                            Dropdown and Select Box don't work well for multiple selections.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Layout (Smart Conditional Display) -->
                  <div class="settings-section" x-show="$store.ui.shouldShowLayoutOptions(question.type, question.settings.format)">
                    <h4 class="settings-section-title">Layout</h4>
                    <select x-model="question.settings.layout"
                            @change="$store.ui.debouncedAutoSave()"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="vertical">Vertical</option>
                      <option value="horizontal">Horizontal</option>
                      <option value="columns">Columns</option>
                    </select>
                    
                    <!-- Number of Columns (Smart Conditional) -->
                    <div x-show="$store.ui.shouldShowColumns(question.type, question.settings.format, question.settings.layout)" class="mt-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Number of Columns</label>
                      <input type="number" 
                             x-model="question.settings.columns"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="2" max="4" step="1">
                    </div>
                    
                    <!-- Label Position (Smart Conditional) -->
                    <div x-show="$store.ui.shouldShowLabelPosition(question.type, question.settings.format, question.settings.layout)" class="mt-3">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Label Position</label>
                      <select x-model="question.settings.labelPosition"
                              @change="$store.ui.debouncedAutoSave()"
                              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="side">Side</option>
                        <option value="above">Above</option>
                      </select>
                    </div>
                  </div>
                  
                  <!-- Additional Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Randomize Options</span>
                          <p class="text-xs text-gray-500">Show in random order</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.randomizeOptions"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Use Suggested Choices</span>
                          <p class="text-xs text-gray-500">Show common options</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.useSuggestedChoices"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Slider Display Settings -->
              <template x-if="question.type === 'slider'">
                <div class="space-y-6">
                  <!-- Slider Type -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Slider Type</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 'selected': question.settings.type === 'sliders' }">
                        <input type="radio" 
                               x-model="question.settings.type"
                               value="sliders"
                               @change="$store.ui.debouncedAutoSave()"
                               class="sr-only">
                        <div class="display-format-icon">
                          <div class="w-full h-2 bg-gray-300 rounded-full relative">
                            <div class="absolute w-4 h-4 bg-indigo-600 rounded-full -top-1 left-1/2 -translate-x-1/2"></div>
                          </div>
                        </div>
                        <span class="display-format-label">Sliders</span>
                      </label>
                      
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 'selected': question.settings.type === 'bars' }">
                        <input type="radio" 
                               x-model="question.settings.type"
                               value="bars"
                               @change="$store.ui.debouncedAutoSave()"
                               class="sr-only">
                        <div class="display-format-icon">
                          <div class="w-full h-6 bg-indigo-600 rounded" style="width: 60%"></div>
                        </div>
                        <span class="display-format-label">Bars</span>
                      </label>
                      
                      <label class="display-format-card cursor-pointer" 
                             :class="{ 'selected': question.settings.type === 'stars' }">
                        <input type="radio" 
                               x-model="question.settings.type"
                               value="stars"
                               @change="$store.ui.debouncedAutoSave()"
                               class="sr-only">
                        <div class="display-format-icon">
                          <div class="text-yellow-400 text-xl">★★★☆☆</div>
                        </div>
                        <span class="display-format-label">Stars</span>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Range Settings -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Range</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                        <input type="number" 
                               x-model="question.settings.min"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                        <input type="number" 
                               x-model="question.settings.max"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Stars Interaction Mode (Smart Conditional) -->
                  <div class="settings-section" x-show="$store.ui.shouldShowSliderInteraction(question.settings.type)">
                    <h4 class="settings-section-title">Interaction Mode</h4>
                    <select x-model="question.settings.interactionMode"
                            @change="$store.ui.debouncedAutoSave()"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <template x-for="mode in $store.ui.getSliderInteractionModes(question.settings.type)" :key="mode">
                        <option :value="mode" x-text="mode === 'discrete' ? 'Whole Stars Only' : mode === 'half_step' ? 'Half Stars' : 'Any Portion'"></option>
                      </template>
                    </select>
                    <p class="text-xs text-blue-600 mt-1">
                      💡 Stars support different interaction modes for precise rating
                    </p>
                  </div>
                  
                  <!-- Display Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Display Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Show Value</span>
                          <p class="text-xs text-gray-500">Display current value</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.showValue"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Snap to Increments</span>
                          <p class="text-xs text-gray-500">Lock to grid points</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.snapToIncrements"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div x-show="question.settings.snapToIncrements || question.settings.type !== 'stars'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Increments</label>
                        <input type="number" 
                               x-model="question.settings.increments"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                               min="2" max="20">
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Star Rating Display Settings -->
              <template x-if="question.type === 'star_rating'">
                <div class="space-y-6">
                  <div class="settings-section">
                    <h4 class="settings-section-title">Star Settings</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Number of Stars</label>
                        <input type="number" 
                               x-model="question.settings.maxStars"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                               min="3" max="10" step="1">
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Interaction Mode</label>
                        <select x-model="question.settings.interaction"
                                @change="$store.ui.debouncedAutoSave()"
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option value="discrete">Whole Stars Only</option>
                          <option value="half_step">Half Stars</option>
                          <option value="continuous">Any Portion</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Matrix Table Display Settings -->
              <template x-if="question.type === 'matrix'">
                <div class="space-y-6">
                  <div class="settings-section">
                    <h4 class="settings-section-title">Matrix Configuration</h4>
                    
                    <!-- Rows Configuration -->
                    <div class="mb-4">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-gray-700">Rows (Statements)</label>
                        <button @click="$store.survey.addMatrixRow(question.id)"
                                class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          + Add Row
                        </button>
                      </div>
                      <div class="space-y-2">
                        <template x-for="(row, index) in question.settings.statements" :key="row.id">
                          <div class="flex items-center gap-2">
                            <input type="text"
                                   x-model="row.text"
                                   @input="$store.ui.debouncedAutoSave()"
                                   class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                   :placeholder="'Row ' + (index + 1)">
                            <button @click="$store.survey.removeMatrixRow(question.id, row.id)"
                                    x-show="question.settings.statements.length > 1"
                                    class="text-gray-400 hover:text-red-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                    
                    <!-- Columns Configuration -->
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-gray-700">Columns (Scale Points)</label>
                        <button @click="$store.survey.addMatrixColumn(question.id)"
                                class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          + Add Column
                        </button>
                      </div>
                      <div class="space-y-2">
                        <template x-for="(col, index) in question.settings.scalePoints" :key="col.id">
                          <div class="flex items-center gap-2">
                            <input type="text"
                                   x-model="col.text"
                                   @input="$store.ui.debouncedAutoSave()"
                                   class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                   :placeholder="'Column ' + (index + 1)">
                            <button @click="$store.survey.removeMatrixColumn(question.id, col.id)"
                                    x-show="question.settings.scalePoints.length > 1"
                                    class="text-gray-400 hover:text-red-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Matrix Type -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Matrix Type</h4>
                    <select x-model="question.settings.matrixType"
                            @change="$store.ui.debouncedAutoSave()"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="likert">Likert Scale</option>
                      <option value="bipolar">Bipolar</option>
                      <option value="rank_order">Rank Order</option>
                      <option value="constant_sum">Constant Sum</option>
                      <option value="text_entry">Text Entry</option>
                      <option value="max_diff">Max Diff</option>
                      <option value="profile">Profile</option>
                    </select>
                  </div>
                  
                  <!-- Answer Type -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Answer Type</h4>
                    <select x-model="question.settings.answerType"
                            @change="$store.ui.debouncedAutoSave()"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="single">Single Answer per Row</option>
                      <option value="multiple">Multiple Answers per Row</option>
                      <option value="dropdown">Dropdown per Row</option>
                      <option value="drag_drop">Drag & Drop</option>
                    </select>
                  </div>
                </div>
              </template>
              
              <!-- Ranking Display Settings -->
              <template x-if="question.type === 'ranking'">
                <div class="space-y-6">
                  <div class="settings-section">
                    <h4 class="settings-section-title">Ranking Items</h4>
                    
                    <div class="mb-4">
                      <div class="flex items-center justify-between mb-2">
                        <label class="text-sm font-medium text-gray-700">Items to Rank</label>
                        <button @click="$store.survey.addOption(question.id)"
                                class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          + Add Item
                        </button>
                      </div>
                      <div class="space-y-2">
                        <template x-for="(option, index) in question.options" :key="option.id">
                          <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500 w-6">#<span x-text="index + 1"></span></span>
                            <input type="text"
                                   x-model="option.text"
                                   @input="$store.ui.debouncedAutoSave()"
                                   class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                   :placeholder="'Item ' + (index + 1)">
                            <button @click="$store.survey.removeOption(question.id, option.id)"
                                    x-show="question.options.length > 2"
                                    class="text-gray-400 hover:text-red-600">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Ranking Method -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Ranking Method</h4>
                    <select x-model="question.settings.rankingMethod"
                            @change="$store.ui.debouncedAutoSave()"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="drag_drop">Drag & Drop</option>
                      <option value="number_input">Number Input</option>
                    </select>
                  </div>
                  
                  <!-- Ranking Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Force All Ranked</span>
                          <p class="text-xs text-gray-500">Require ranking all items</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.forceAllRanked"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Allow Ties</span>
                          <p class="text-xs text-gray-500">Multiple items can have same rank</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.allowTies"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Show Numbers</span>
                          <p class="text-xs text-gray-500">Display rank numbers</p>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.showNumbers"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Priority Grid Display Settings -->
              <template x-if="question.type === 'priority_grid'">
                <div class="space-y-6">
                  <!-- Grid Configuration -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Grid Configuration</h4>
                    
                    <!-- Axis Labels -->
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">X-Axis Label</label>
                        <input type="text"
                               x-model="question.settings.xAxisLabel"
                               @input="$store.ui.debouncedAutoSave()"
                               placeholder="e.g., Importance"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Y-Axis Label</label>
                        <input type="text"
                               x-model="question.settings.yAxisLabel"
                               @input="$store.ui.debouncedAutoSave()"
                               placeholder="e.g., Performance"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quadrant Labels -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Quadrant Labels</h4>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs text-gray-500">Top Left</label>
                        <input type="text"
                               x-model="question.settings.quadrantLabels[0]"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="text-xs text-gray-500">Top Right</label>
                        <input type="text"
                               x-model="question.settings.quadrantLabels[2]"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="text-xs text-gray-500">Bottom Left</label>
                        <input type="text"
                               x-model="question.settings.quadrantLabels[1]"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      <div>
                        <label class="text-xs text-gray-500">Bottom Right</label>
                        <input type="text"
                               x-model="question.settings.quadrantLabels[3]"
                               @input="$store.ui.debouncedAutoSave()"
                               class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                    </div>
                  </div>
                  
                  <!-- Grid Items -->
                  <div class="settings-section">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="settings-section-title mb-0">Items</h4>
                      <button @click="$store.survey.addPriorityGridItem(question.id)"
                              class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        + Add Item
                      </button>
                    </div>
                    <div class="space-y-2">
                      <template x-for="(item, index) in question.options" :key="item.id">
                        <div class="flex items-center gap-2">
                          <input type="text"
                                 x-model="item.text"
                                 @input="$store.ui.debouncedAutoSave()"
                                 class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                 :placeholder="'Item ' + (index + 1)">
                          <button @click="$store.survey.removePriorityGridItem(question.id, item.id)"
                                  x-show="question.options.length > 1"
                                  class="p-1 hover:bg-gray-100 rounded transition-colors">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Grid Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Grid Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Show Grid Guides</div>
                          <div class="text-xs text-gray-500">Display grid lines to help positioning</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.showGuides"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Snap to Grid</div>
                          <div class="text-xs text-gray-500">Items snap to grid intersections</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.snapToGrid"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Side by Side Display Settings -->
              <template x-if="question.type === 'side_by_side'">
                <div class="space-y-6">
                  <!-- Columns Configuration -->
                  <div class="settings-section">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="settings-section-title mb-0">Columns</h4>
                      <button @click="$store.survey.addSideBySideColumn(question.id)"
                              class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        + Add Column
                      </button>
                    </div>
                    <div class="space-y-3">
                      <template x-for="(column, index) in question.settings.columns" :key="column.id">
                        <div class="border border-gray-200 rounded-lg p-3 space-y-3">
                          <div class="flex items-start justify-between">
                            <input type="text"
                                   x-model="column.text"
                                   @input="$store.ui.debouncedAutoSave()"
                                   placeholder="Column header"
                                   class="flex-1 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                            <button @click="$store.survey.removeSideBySideColumn(question.id, column.id)"
                                    x-show="question.settings.columns.length > 1"
                                    class="ml-2 p-1 hover:bg-gray-100 rounded transition-colors">
                              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                          
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Column Type</label>
                            <select x-model="column.type"
                                    @change="$store.survey.updateSideBySideColumnType(question.id, column.id, $event.target.value)"
                                    class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                              <option value="text">Text Input</option>
                              <option value="number">Number</option>
                              <option value="select">Dropdown</option>
                              <option value="radio">Radio Buttons</option>
                              <option value="checkbox">Checkboxes</option>
                              <option value="scale">Scale (1-5)</option>
                              <option value="star">Star Rating</option>
                            </select>
                          </div>
                          
                          <!-- Options for radio/checkbox/select -->
                          <template x-if="['radio', 'checkbox', 'select'].includes(column.type)">
                            <div>
                              <label class="block text-xs font-medium text-gray-700 mb-1">Options</label>
                              <div class="space-y-1">
                                <template x-for="(option, optIndex) in column.options" :key="optIndex">
                                  <div class="flex items-center gap-1">
                                    <input type="text"
                                           x-model="column.options[optIndex]"
                                           @input="$store.ui.debouncedAutoSave()"
                                           class="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                                    <button @click="column.options.splice(optIndex, 1); $store.ui.debouncedAutoSave()"
                                            x-show="column.options.length > 1"
                                            class="p-0.5 hover:bg-gray-100 rounded">
                                      <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                      </svg>
                                    </button>
                                  </div>
                                </template>
                                <button @click="column.options.push('Option ' + (column.options.length + 1)); $store.ui.debouncedAutoSave()"
                                        class="text-xs text-blue-600 hover:text-blue-700">
                                  + Add Option
                                </button>
                              </div>
                            </div>
                          </template>
                        </div>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Rows Configuration -->
                  <div class="settings-section">
                    <div class="flex items-center justify-between mb-3">
                      <h4 class="settings-section-title mb-0">Rows</h4>
                      <button @click="$store.survey.addSideBySideRow(question.id)"
                              class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        + Add Row
                      </button>
                    </div>
                    <div class="space-y-2">
                      <template x-for="(row, index) in question.settings.rows" :key="row.id">
                        <div class="flex items-center gap-2">
                          <input type="text"
                                 x-model="row.text"
                                 @input="$store.ui.debouncedAutoSave()"
                                 class="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
                                 :placeholder="'Row ' + (index + 1)">
                          <button @click="$store.survey.removeSideBySideRow(question.id, row.id)"
                                  x-show="question.settings.rows.length > 1"
                                  class="p-1 hover:bg-gray-100 rounded transition-colors">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Constant Sum Display Settings -->
              <template x-if="question.type === 'constant_sum'">
                <div class="space-y-6">
                  <!-- Sum Configuration -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Sum Configuration</h4>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Total Sum</label>
                        <input type="number"
                               x-model.number="question.settings.total"
                               @input="$store.ui.debouncedAutoSave()"
                               min="1"
                               placeholder="100"
                               class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      </div>
                      
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Min per item</label>
                          <input type="number"
                                 x-model.number="question.settings.minPerItem"
                                 @input="$store.ui.debouncedAutoSave()"
                                 min="0"
                                 placeholder="0"
                                 class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Max per item</label>
                          <input type="number"
                                 x-model.number="question.settings.maxPerItem"
                                 @input="$store.ui.debouncedAutoSave()"
                                 min="1"
                                 placeholder="No limit"
                                 class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Visual Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Visual Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Show Visual Bars</div>
                          <div class="text-xs text-gray-500">Display progress bars for each item</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.visualBars"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Show Total Box</div>
                          <div class="text-xs text-gray-500">Display running total</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.showTotalBox"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Number Format -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Number Format</h4>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Decimal Places</label>
                        <select x-model.number="question.settings.decimals"
                                @change="$store.ui.debouncedAutoSave()"
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option value="0">0 (whole numbers)</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </select>
                      </div>
                      
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Symbol</label>
                          <input type="text"
                                 x-model="question.settings.symbol"
                                 @input="$store.ui.debouncedAutoSave()"
                                 placeholder="e.g., $, %"
                                 maxlength="3"
                                 class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-700 mb-1">Position</label>
                          <select x-model="question.settings.symbolPosition"
                                  @change="$store.ui.debouncedAutoSave()"
                                  class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent">
                            <option value="before">Before</option>
                            <option value="after">After</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Ranking Display Settings -->
              <template x-if="question.type === 'ranking'">
                <div class="space-y-6">
                  <!-- Ranking Method -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Ranking Method</h4>
                    <div class="space-y-3">
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" 
                               x-model="question.settings.rankingMethod"
                               value="drag_drop"
                               @change="$store.ui.debouncedAutoSave()"
                               class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Drag and Drop</span>
                          <p class="text-xs text-gray-500">Users drag items to reorder</p>
                        </div>
                      </label>
                      <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" 
                               x-model="question.settings.rankingMethod"
                               value="number_input"
                               @change="$store.ui.debouncedAutoSave()"
                               class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                        <div>
                          <span class="text-sm font-medium text-gray-900">Number Input</span>
                          <p class="text-xs text-gray-500">Users enter rank numbers</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <!-- Visual Options -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Visual Options</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Show Rank Numbers</div>
                          <div class="text-xs text-gray-500">Display rank position numbers</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.showNumbers"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Visual Feedback</div>
                          <div class="text-xs text-gray-500">Enhance drag/drop with visual cues</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.visualFeedback"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Ranking Rules -->
                  <div class="settings-section">
                    <h4 class="settings-section-title">Ranking Rules</h4>
                    <div class="space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Force All Ranked</div>
                          <div class="text-xs text-gray-500">Require all items to be ranked</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.forceAllRanked"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                      
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-medium text-gray-700">Allow Ties</div>
                          <div class="text-xs text-gray-500">Multiple items can share the same rank</div>
                        </div>
                        <label class="toggle-switch toggle-switch-sm">
                          <input type="checkbox" 
                                 x-model="question.settings.allowTies"
                                 @change="$store.ui.debouncedAutoSave()">
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Validation Tab -->
            <div x-show="$store.ui.settingsSection === 'validation'" class="space-y-6">
              <!-- Response Requirements -->
              <div class="settings-section">
                <h4 class="settings-section-title">Response Requirements</h4>
                <div class="space-y-3">
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" 
                           :name="'response_' + question.id"
                           value="none"
                           :checked="!question.validation.forceResponse && !question.validation.requestResponse"
                           @change="updateSetting('validation.forceResponse', false); updateSetting('validation.requestResponse', false)"
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                    <div>
                      <span class="text-sm font-medium text-gray-900">Optional</span>
                      <p class="text-xs text-gray-500">Response not required</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" 
                           :name="'response_' + question.id"
                           value="force"
                           :checked="question.validation.forceResponse"
                           @change="updateSetting('validation.forceResponse', true); updateSetting('validation.requestResponse', false)"
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                    <div>
                      <span class="text-sm font-medium text-gray-900">Force Response</span>
                      <p class="text-xs text-gray-500">Must answer to proceed</p>
                    </div>
                  </label>
                  
                  <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" 
                           :name="'response_' + question.id"
                           value="request"
                           :checked="question.validation.requestResponse"
                           @change="updateSetting('validation.forceResponse', false); updateSetting('validation.requestResponse', true)"
                           class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                    <div>
                      <span class="text-sm font-medium text-gray-900">Request Response</span>
                      <p class="text-xs text-gray-500">Ask but allow skip</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <!-- Error Message -->
              <div class="settings-section">
                <h4 class="settings-section-title">Error Message</h4>
                <input type="text" 
                       x-model="question.validation.requiredError"
                       @input="$store.ui.debouncedAutoSave()"
                       class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                       placeholder="This field is required">
              </div>
              
              <!-- Type-Specific Validation -->
              <template x-if="['text_input', 'long_text'].includes(question.type)">
                <div class="settings-section">
                  <h4 class="settings-section-title">Text Validation</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Min Length</label>
                      <input type="number" 
                             x-model="question.validation.minLength"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="0">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Max Length</label>
                      <input type="number" 
                             x-model="question.validation.maxLength"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="1">
                    </div>
                  </div>
                  
                  <div x-show="question.type === 'text_input'" class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pattern (RegEx)</label>
                    <input type="text" 
                           x-model="question.validation.pattern"
                           @input="$store.ui.debouncedAutoSave()"
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                           placeholder="e.g., ^[A-Z]{2}\\d{6}$">
                    <input type="text" 
                           x-model="question.validation.patternError"
                           @input="$store.ui.debouncedAutoSave()"
                           class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mt-2"
                           placeholder="Pattern error message">
                  </div>
                </div>
              </template>
              
              <template x-if="question.type === 'multiple_choice' && question.settings.answerType === 'multiple'">
                <div class="settings-section">
                  <h4 class="settings-section-title">Selection Limits</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                      <input type="number" 
                             x-model="question.validation.minSelections"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="0">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                      <input type="number" 
                             x-model="question.validation.maxSelections"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                             min="1">
                    </div>
                  </div>
                </div>
              </template>
              
              <template x-if="question.type === 'number'">
                <div class="settings-section">
                  <h4 class="settings-section-title">Number Validation</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                      <input type="number" 
                             x-model="question.validation.min"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                      <input type="number" 
                             x-model="question.validation.max"
                             @input="$store.ui.debouncedAutoSave()"
                             class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                  </div>
                  
                  <div class="mt-3 flex items-center justify-between">
                    <div>
                      <span class="text-sm font-medium text-gray-900">Integer Only</span>
                      <p class="text-xs text-gray-500">No decimal values</p>
                    </div>
                    <label class="toggle-switch toggle-switch-sm">
                      <input type="checkbox" 
                             x-model="question.validation.integerOnly"
                             @change="$store.ui.debouncedAutoSave()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Logic Tab -->
            <div x-show="$store.ui.settingsSection === 'logic'" class="space-y-6">
              <div class="settings-section">
                <h4 class="settings-section-title">Display Logic</h4>
                <p class="text-sm text-gray-500 mb-4">Show this question based on previous answers</p>
                <button class="btn-secondary w-full">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Display Logic
                </button>
              </div>
              
              <div class="settings-section">
                <h4 class="settings-section-title">Skip Logic</h4>
                <p class="text-sm text-gray-500 mb-4">Skip to specific questions based on answers</p>
                <button class="btn-secondary w-full">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Add Skip Logic
                </button>
              </div>
            </div>
            
            <!-- Advanced Tab -->
            <div x-show="$store.ui.settingsSection === 'advanced'" class="space-y-6">
              <div class="settings-section">
                <h4 class="settings-section-title">Question Behavior</h4>
                <p class="text-sm text-gray-500">Advanced settings for this question type</p>
              </div>
              
              <!-- Advanced settings specific to question types -->
              <template x-if="question.type === 'text_input' && question.settings.textType === 'autocomplete'">
                <div class="settings-section">
                  <h4 class="settings-section-title">Autocomplete Options</h4>
                  <textarea x-model="question.settings.autocompleteList.join('\\n')"
                            @input="updateSetting('settings.autocompleteList', $event.target.value.split('\\n').filter(v => v.trim()))"
                            rows="5"
                            class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="One option per line"></textarea>
                </div>
              </template>
            </div>
          </div>
          
          <!-- Delete Question (Danger Zone) -->
          <div class="p-4 border-t border-gray-200">
            <button @click="if(confirm('Are you sure you want to delete this question?')) removeQuestion(question.id)"
                    class="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
              Delete Question
            </button>
          </div>
        </div>
      </template>
    </div>
  `
}